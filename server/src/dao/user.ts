import pool from './pool'
import { User } from '../types/user';
import { PoolConnection } from 'mysql';
import { InitParam } from '../types/sys';
import { v4 as uuidv4 } from 'uuid'

const userDao = {
  async getUser (userId: string): Promise<User> {
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
    const user: User = await pool.query(sql, [userId])
    return user
  },
  async createUser (conn: PoolConnection, param: InitParam): Promise<void> {
    const sql = `insert into user(id, email, password) values(?,?,?)`
    await pool.queryInTransaction(conn, sql, [uuidv4(), param.email, param.password])
  }
}
export default userDao