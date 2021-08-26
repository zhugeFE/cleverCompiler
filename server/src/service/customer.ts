/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:13:53
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-25 17:20:53
 */
import customerDao from "../dao/customer";
import { AddCustomerParams, ProjectCustomer } from "../types/customer";

class CustomerService {
  
  //返回客户列表
  async customerList(): Promise<ProjectCustomer[]> {
    return await customerDao.customerList()
  }

  //创建客户
  async addCustomer(data: AddCustomerParams): Promise<ProjectCustomer>{
    return await customerDao.customerAdd(data)
  }
  
  //更新客户信息
  async updateCustomer(data: ProjectCustomer): Promise<void>{
    await customerDao.updateCustomer(data)
  }
}

export default new CustomerService()