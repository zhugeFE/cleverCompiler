import pool from './pool'
import { User } from '../types/user';

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
  }
}
export default userDao