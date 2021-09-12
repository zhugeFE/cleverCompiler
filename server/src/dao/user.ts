/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-07 09:59:03
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-03 22:48:42
 */
import pool from './pool'
import { User, LoginParam, Member } from '../types/user';
import { PoolConnection } from 'mysql';
import { SysInfo } from '../types/sys';
import util from '../utils/util';

class UserDao {
  async getUserById (userId: string): Promise<User[]> {
    const sql = `select user.id, 
        user.name, 
        user.email, 
        role.id as roleId, 
        role.name as roleName 
          from user 
        left join user_role 
          on user_role.user_id = user.id 
        left join role 
          on user_role.role_id = role.id
        where user.id = ?`
    const users = await pool.query<User>(sql, [userId]) as User[]
    return users
  }
  async createUser (conn: PoolConnection, param: SysInfo): Promise<void> {
    const sql = `insert into user(id, email, password, name) values(?,?,?,?)`
    await pool.queryInTransaction(conn, sql, [util.uuid(), param.email, param.password, param.gitAccount])
  }
  async login (param: LoginParam): Promise<User[]> {
    const sql = `select user.id,
      user.name,
      user.email,
      role.id as roleId,
      role.name as roleName
        from user
      left join user_role
        on user_role.user_id = user.id
      left join role
        on user_role.role_id = role.id
      where 
        user.email = ? 
        and password = ?`
    const users = await pool.query<User>(sql, [param.username, param.password]) as User[]
    return users
  }
  async getMemberList (): Promise<Member[]> {
    const sql = `SELECT id, name FROM \`user\``
    return await pool.query<Member>(sql, [])
  }
}
export default new UserDao()