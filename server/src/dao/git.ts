import pool from './pool'
import sysDao from './sys'
import axios from 'axios'
import { GitInstance, GitInfo } from '../types/git';
import logger from '../utils/logger';
import util from '../utils/util';
import { Version, Config } from '../types/common';
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
  async getBranchsById (id: string | number): Promise<void> {
    const sysInfo = await sysDao.getSysInfo()
    const res = await axios({
      url: `/projects/${id}/repository/branches`,
      method: 'GET',
      baseURL: sysInfo.gitHost,
      headers: {
        'PRIVATE-TOKEN': sysInfo.gitToken
      }
    })
    console.log('>>>>>>>', res.data)
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
      from source_version as version where version.source_id = ?`
    gitInfo.versionList = await pool.query<Version>(versionSql, [id]) as Version[]
    const configSql = `select * from source_config where source_id = ?`
    gitInfo.configs = await pool.query<Config>(configSql, [id]) as Config[]
    return gitInfo
  }
}

export default new GitDao()