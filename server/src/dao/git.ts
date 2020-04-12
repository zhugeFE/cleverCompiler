import pool from './pool'
import sysDao from './sys'
import axios from 'axios'
import { GitInstance, GitInfo, GitBranch, GitTag, GitCommit, GitCreateVersionParam, GitVersion, GitCreateConfigParam } from '../types/git';
import logger from '../utils/logger';
import util from '../utils/util';
import { Config, VersionStatus } from '../types/common';
import gitUtil from '../utils/gitUtil';
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
      gitIdMap[git.gitId] = git
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
    const sql = `select * from git_source`
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
    const configSql = `select * from source_config where source_id = ?`
    gitInfo.configs = await pool.query<Config>(configSql, [id]) as Config[]
    return gitInfo
  }
  async addVersion (param: GitCreateVersionParam): Promise<GitVersion> {
    // todo 版本号重复校验
    const sql = `insert into source_version(
      id, source_id, version, publish_time, status, source_type, source_value
    ) values(
      ?,?,?,?,?,?,?
    )`
    const id = util.uuid()
    await pool.query(sql, [
      id,
      param.gitId,
      param.version,
      new Date().getTime(),
      VersionStatus.normal,
      param.source,
      param.value
    ])
    return await this.getVersionById(id)
  }
  async getVersionById (versionId: string): Promise<GitVersion> {
    const sql = `select 
      v.id,
      v.version as name,
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
  async addConfig (param: GitCreateConfigParam): Promise<any> {
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
      const a = await pool.query(sql, [
        configId, 
        param.sourceId, 
        param.versionId, 
        param.desc, 
        param.reg ? JSON.stringify(param.reg) : null, 
        param.typeId, 
        param.filePath, 
        param.value
      ])
      console.log(a)
  }
}

export default new GitDao()