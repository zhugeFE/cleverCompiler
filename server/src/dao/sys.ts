import pool from './pool'
import { PoolConnection } from 'mysql'
import { ConfigType } from '../constants'

const dao = {
  /**
   * 检查系统状态：是否已初始化
   * @returns boolean
   */
  async getStatus (): Promise<boolean> {
    const sql = `select * from sys;`
    const result = await pool.query(sql)
    return result.length > 0
  },
  async init (param: InitParam): Promise<void> {
    const connect = await pool.beginTransaction()
    // 初始化系统状态及git配置信息
    await this.initSys(connect, param)
    // 初始化系统基础数据: 配置项类型、内置用户角色类型
    await this.initConfigTypes(connect)
    await this.initRole(connect)
  },
  /**
   * 初始化系统信息
   * @param conn 
   * @param param 
   */
  async initSys (conn: PoolConnection, param: InitParam): Promise<void> {
    const sql = `insert into sys(git_token, git_account, inited) values(?,?,?)`
    const params = [param.gitToken, param.gitAccount, 1]
    await pool.queryInTransaction(conn, sql, params)
  },
  /**
   * 初始化配置项类型基础数据
   * @param conn 
   */
  async initConfigTypes (conn: PoolConnection): Promise<void> {
    const sql = 'insert into config_type(id, label) values(?,?)'
    const types = [
      'str',
      'file',
      'json'
    ]
    await Promise.all(types.map(type => {
      const params = [type, ConfigType[type]]
      return pool.queryInTransaction(conn, sql, params)
    }))
  },
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
}
dao.getStatus()
export default dao