/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 18:41:40
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-18 17:28:05
 */
import { AddCustomerParams, Customer } from "@/models/customer";
import request from "@/utils/request";
import api from "./constants/apis";


class CustomerService {
  async addCustomer(data: AddCustomerParams) {
    return request(api.customer.createCustomer, {
      method: "post",
      data
    })
  }

  async customerList() {
    return request(api.customer.customerList)
  }

  async updataCustomer(data: Customer) {
    return request(api.customer.updateCustomer, {
      method: "post",
      data
    })
  }

  async customerInfo (id: string) {
    return request(api.customer.getInfo, {
      params: {
        id
      }
    })
  }
  
  async deleteCustomer (id: string) {
    return request(api.customer.deleteCustomer, {
      method: "delete",
      params: {
        id
      }
    })
  }
}

export default new CustomerService()