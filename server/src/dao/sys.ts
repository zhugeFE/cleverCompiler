import pool from './pool'
import { PoolConnection } from 'mysql'
import { SysInfo, ConfigType, Role } from '../types/sys';
import userDao from './user';
import logger from '../utils/logger';

class SysDao {
  async getSysInfo (): Promise<SysInfo> {
    const sql = 'select * from sys'
    const res = await pool.query(sql) as SysInfo[]
    if (res.length) {
      return res[0]
    } else {
      return null
    }
  }
  /**
   * 检查系统状态：是否已初始化
   * @returns boolean
   */
  async getStatus (): Promise<boolean> {
    const sysInfo = await this.getSysInfo()
    return Boolean(sysInfo)
  }
  async init (param: SysInfo): Promise<void> {
    const connect = await pool.beginTransaction()
    try {
      // 初始化系统状态及git配置信息
      logger.info('初始化系统信息')
      await this.initSys(connect, param)
      // 初始化系统基础数据: 配置项类型、内置用户角色类型
      logger.info('初始化配置类型元数据')
      await this.initConfigTypes(connect)
      logger.info('创建初始账号')
      await userDao.createUser(connect, param)
      logger.info('初始化角色元数据')
      await this.initRole(connect)
      logger.info('git库数据同步')
      await pool.commit(connect)
    } catch (e) {
      pool.rollback(connect)
      throw e
    }
  }
  /**
   * 初始化系统信息
   * @param conn 
   * @param param 
   */
  async initSys (conn: PoolConnection, param: SysInfo): Promise<void> {
    const sql = `insert into sys(git_host, git_token, git_account, git_ssh, inited) values(?, ?,?,?,?)`
    const params = [param.gitHost, param.gitToken, param.gitAccount, param.gitSsh, 1]
    await pool.queryInTransaction(conn, sql, params)
  }
  /**
   * 初始化配置项类型基础数据
   * @param conn 
   */
  async initConfigTypes (conn: PoolConnection): Promise<void> {
    const sql = 'insert into config_type(id, label, key) values(?,?,?)'
    const types = [
      {
        id: 0,
        label: '文本',
        key: 'text'
      },
      {
        id: 1,
        label: '文件替换',
        key: 'file'
      },
      {
        id: 2,
        label: 'JSON',
        key: 'json'
      }
    ]
    await Promise.all(types.map((type) => {
      const params = [type.id, type.label, type.key]
      return pool.queryInTransaction(conn, sql, params)
    }))
  }
  async queryConfigType (): Promise<ConfigType[]> {
    return await pool.query<ConfigType[]>('select * from config_type') as ConfigType[]
  }
  async initRole (conn: PoolConnection): Promise<void> {
    const sql = 'insert into role(id, name) values(?,?)'
    const roles = [
      '运维',
      '技术支持',
      '研发',
      '测试'
    ]
    await Promise.all(roles.map((role, i) => {
      const params = [i, role]
      return pool.queryInTransaction(conn, sql, params)
    }))
  }
  async queryRole (): Promise<Role[]> {
    return await pool.query<Role[]>('select * from role') as Role[]
  }
}
export default new SysDao()