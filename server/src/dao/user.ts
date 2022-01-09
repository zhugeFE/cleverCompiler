/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-07 09:59:03
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-09 23:05:48
 */
import pool from './pool'
import { User, LoginParam, Member, RegistParam } from '../types/user';
import { PoolConnection } from 'mysql';
import { SysInfo } from '../types/sys';
import util from '../utils/util';
import { RoleType } from '../constants';

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
    const bindRoleSql =  `insert into user_role(id, user_id,role_id) values(?,?,?)`
    const id = util.uuid()
    await pool.queryInTransaction(conn, sql, [id, param.email, param.password, param.gitAccount])
    await pool.queryInTransaction(conn, bindRoleSql, [util.uuid(), id, RoleType.admin])
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
  async regist (param: RegistParam): Promise<void> {
    const conn = await pool.beginTransaction()
    try {
      const createUserSql = `insert into user(id, name, password, email) values(?,?,?,?)`
      const userData = {
        id: util.uuid(),
        name: param.username,
        password: param.password,
        email: param.email
      }
      await pool.writeInTransaction(conn, createUserSql, [userData.id, userData.name, userData.password, userData.email])
      await pool.commit(conn)
    } catch (e) {
      await pool.rollback(conn)
      throw(e)
    }
  }
  async getMemberList (): Promise<Member[]> {
    const sql = `SELECT id, name FROM \`user\``
    return await pool.query<Member>(sql, [])
  }
}
export default new UserDao()