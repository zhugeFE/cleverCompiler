import pool from './pool'

const dao = {
  /**
   * 检查系统状态：是否已初始化
   * @returns boolean
   */
  async getStatus (): Promise<any> {
    const sql = `select * from sys;`
    const result = await pool.query(sql)
    return result.length > 0
  }
}
dao.getStatus()
export default dao