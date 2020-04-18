import pool from './pool'
import sysDao from './sys'
import axios from 'axios'
import { GitInstance, GitInfo, GitBranch, GitTag, GitCommit, GitCreateVersionParam, GitVersion, GitCreateConfigParam, GitConfig } from '../types/git';
import logger from '../utils/logger';
import util from '../utils/util';
import { VersionStatus } from '../types/common';
import gitUtil from '../utils/gitUtil';
import * as _ from 'lodash';
interface Repo {
  id: string;
  name: string;
  'ssh_url_to_repo': string;
  description: string;
}
class GitDao {
  /**
   * 同步git库数据
   */
  async syncRep (): Promise<Repo[]> {
    logger.info('同步git库数据')
    const sysInfo = await sysDao.getSysInfo()
    if (!sysInfo) return []
    const res = await axios({
      url: 'api/v3/projects',
      method: 'GET',
      baseURL: sysInfo.gitHost,
      headers: {
        'PRIVATE-TOKEN': sysInfo.gitToken
      },
      params: {
        'per_page': 100
      }
    }) as {
      data: Repo[];
    }
    const repoList = res.data
    const gitList = await this.query()
    const gitIdMap = {}
    gitList.forEach((git: GitInstance) => {
      gitIdMap[git.repoId] = git
    })
    const connect = await pool.beginTransaction()
    try {
      await Promise.all(repoList.map(async (rep: Repo) => {
        if (gitIdMap[rep.id]) return null
        const sql = `insert into git_source(id, name, git, git_id, description, enable) values(?, ?, ?, ?, ?, ${false})`
        await pool.queryInTransaction(connect, sql, [
          util.uuid(),
          rep.name,
          rep.ssh_url_to_repo,
          rep.id,
          rep.description
        ])
      }))
      await pool.commit(connect)
    } catch (e) {
      pool.rollback(connect)
      logger.error('向git表插入数据失败', e)
      throw e
    }
    return repoList
  }
  async getBranchsById (id: string | number): Promise<GitBranch[]> {
    const res = await gitUtil.ajax<GitBranch[]>(`projects/${id}/repository/branches`, 'GET')
    return res.map(item => {
      return {
        name: item.name,
        commit: {
          id: item.commit.id,
          message: item.commit.message
        }
      }
    })
  }
  async getTagsById (id: string | number): Promise<GitTag[]> {
    const res = await gitUtil.ajax<GitTag[]>(`projects/${id}/repository/tags`, 'GET')
    return res.map(item => {
      return {
        name: item.name,
        message: item.message,
        commit: {
          id: item.commit.id,
          message: item.commit.message
        }
      }
    })
  }
  async getCommitsById (id: string | number): Promise<GitCommit[]> {
    const res = await gitUtil.ajax<any[]>(`projects/${id}/repository/commits`, 'GET')
    return res.map(item => {
      return {
        id: item.id,
        message: item.message,
        createdAt: item.created_at
      }
    })
  }
  async query (): Promise<GitInstance[]> {
    const sql = `select 
      git.id,
      git.name,
      git.description,
      version.id as version_id,
      version.version,
      git.git as repo,
      git.git_id as repo_id,
      git.enable 
    from git_source as git
    left join (
      SELECT a.*
        FROM
        source_version as a
      JOIN
      (SELECT source_id, max(publish_time) as publish_time FROM source_version GROUP BY source_id) as b 
      ON a.source_id=b.source_id
      AND a.publish_time=b.publish_time
    ) as version 
    on git.id=version.source_id`
    return await pool.query<GitInstance>(sql) as GitInstance[]
  }
  async getInfo (id: string): Promise<GitInfo> {
    const infoSql = 'select source.id,source.git_id,source.name,source.git as git_repo from git_source as source where source.id = ?'
    const infoList = await pool.query<GitInfo>(infoSql, [id]) as GitInfo[]
    const gitInfo = infoList.length ? infoList[0] : null
    const versionSql = `select 
        version.*, 
        version.version as name
      from 
        source_version as version 
      where 
        version.source_id = ? 
      order by 
        version.publish_time desc`
    gitInfo.versionList = await pool.query<GitVersion>(versionSql, [id]) as GitVersion[]
    for (let i = 0; i < gitInfo.versionList.length; i++) {
      const version = gitInfo.versionList[i]
      version.compileOrders = JSON.parse(version.compileOrders as unknown as string) || []
      version.configs = await this.queryConfigByVersionId(version.id)
    }
    return gitInfo
  }
  async addVersion (param: GitCreateVersionParam): Promise<GitVersion> {
    // todo 版本号重复校验
    const sql = `insert into source_version(
      id, source_id, version, publish_time, status, source_type, source_value, description
    ) values(
      ?,?,?,?,?,?,?,?
    )`
    const id = util.uuid()
    await pool.query(sql, [
      id,
      param.gitId,
      param.version,
      new Date().getTime(),
      VersionStatus.normal,
      param.source,
      param.value,
      param.description
    ])
    return await this.getVersionById(id)
  }
  async getVersionById (versionId: string): Promise<GitVersion> {
    const sql = `select 
      v.id,
      v.version as name,
      v.description,
      v.status,
      v.publish_time,
      v.compile_orders,
      v.readme_doc,
      v.build_doc,
      v.update_doc,
      v.source_type,
      v.source_value from source_version as v where v.id = ?`
    const versionList = await pool.query<GitVersion[]>(sql, [versionId]) as GitVersion[]
    return versionList[0]
  }
  async addConfig (param: GitCreateConfigParam): Promise<GitConfig> {
    const sql = `insert into 
      source_config(
        id, 
        source_id, 
        version_id, 
        \`desc\`, 
        reg, 
        type_id, 
        file_path, 
        target_value
      ) values(
        ?,?,?,?,?,?,?,?
      )`
    const configId = util.uuid()
    await pool.query(sql, [
      configId, 
      param.sourceId, 
      param.versionId, 
      param.desc, 
      param.reg ? JSON.stringify(param.reg) : null, 
      param.typeId, 
      param.filePath, 
      param.value
    ])
    return await this.getConfigById(configId)
  }
  async getConfigById (id: string): Promise<GitConfig> {
    const sql = `select 
      config.*,
      ct.label as type
    from source_config as config 
    left join config_type as ct on config.type_id = ct.id
    where config.id=?`
    const list = await pool.query(sql, [id])
    return list[0]
  }
  async queryConfigByVersionId (sourceId: string): Promise<GitConfig[]> {
    const sql = `select 
      config.*,
      ct.label as type
    from source_config as config 
    left join config_type as ct on config.type_id = ct.id
    where config.version_id=?`
    return await pool.query(sql, [sourceId]) as GitConfig[]
  }
  async deleteConfigById (configId: string): Promise<void> {
    const sql = `delete from source_config where id=?`
    await pool.query(sql, [configId])
  }
  async updateVersion (version: GitVersion): Promise<void> {
    const props = []
    const params = []
    for (const key in version) {
      if (key !== 'id') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(version[key])
      }
    }
    params.push(version.id)
    const sql = `update source_version set ${props.join(',')} where id=?`
    await pool.query(sql, params)
  }
}

export default new GitDao()