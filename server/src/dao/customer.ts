/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:15:15
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-25 17:17:03
 */

import pool from './pool'
import {
  ProjectCustomer,
  AddCustomerParams,
} from "../types/customer"
import util from '../utils/util'
import _ = require('lodash')


class Customer {
  //客户列表
  async customerList (): Promise<ProjectCustomer[]>{
    const sql = `SELECT c.id as id, 
      c.name as name, 
      c.description as description, 
      c.creator_id as creator_id,  
      u.name as creator_name 
      LEFT JOIN \`user\` as u 
      ON \`user\`.id = c.creator_id`
    return await pool.query(sql)
  }

  //客户新建
  async customerAdd (params: AddCustomerParams): Promise<ProjectCustomer>{
    const sql = `INSERT INTO customer ( id, NAME, description, project_id, creator_id )
      VALUES
        ( ?, ?, ?, ?, ? )`
    
    const id = util.uuid()
    await pool.write(sql,[
      id,
      params.name,
      params.description,
      params.projectId,
      params.creatorId
    ])
    return await this.getCustomerById(id)
    
  }

  //客户表查询 根据客户id
  async getCustomerById (id: string): Promise<ProjectCustomer> {
    const sql = `SELECT
      id,
      NAME,
      description,
      project_id,
      creator_id 
    FROM
      customer 
    WHERE
      id = ?`
    
    const list = await pool.query<ProjectCustomer>(sql, [id])
    return list.length > 0 ? list[0] : null
  }

  //客户删除 根据客户id
  async deleteCustomerById (id: string): Promise<void> {
    const sql = `DELETE from customer WHERE id = ?`
    await pool.query(sql, [id])
  }

  //客户信息更新
  async updateCustomer (data: ProjectCustomer): Promise<void> {
    const props = []
    const params = []
    for (const key in data) {
      if (key !== 'id') {
        props.push(`${_.snakeCase(key)}=?`)
        params.push(data[key])
      }
    }
    params.push(data.id)
    const sql = `update customer set ${props.join(',')} where id=?`
    await pool.query(sql, params)
  }
  
  //可以查看客户
}

export default new Customer()