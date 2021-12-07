/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:14:20
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-05 18:58:46
 */

export interface ProjectCustomer {
  id: string; //客户id
  name: string; // 客户名称
  description: string; //客户描述
  creatorId: string; //创建者id
  creatorName?: string; //创建者名称,
  tel: string; //联系方式
}

export interface AddCustomerParams {
  name: string; //客户名称
  tel: string; //联系方式
  description: string; //客户描述
  creatorId: string; //创建者id
}

