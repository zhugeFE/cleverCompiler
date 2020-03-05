import pool from './pool'
import { User, LoginParam } from '../types/user';
import { PoolConnection } from 'mysql';
import { InitParam } from '../types/sys';
import { v4 as uuidv4 } from 'uuid'

const userDao = {
  async getUserById (userId: string): Promise<[User]> {
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
    const users: [User] = await pool.query(sql, [userId])
    return users
  },
  async createUser (conn: PoolConnection, param: InitParam): Promise<void> {
    const sql = `insert into user(id, email, password) values(?,?,?)`
    await pool.queryInTransaction(conn, sql, [uuidv4(), param.email, param.password])
  },
  async login (param: LoginParam): Promise<[User]> {
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
    const users: [User] = await pool.query(sql, [param.username, param.password])
    return users
  }
}
export default userDao