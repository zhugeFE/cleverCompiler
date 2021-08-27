/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:14:20
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-26 16:49:14
 */


export interface ProjectCustomer {
  id: string; //客户id
  name: string; // 客户名称
  description: string; //客户描述
  projectId: string; //项目id
  creatorId: string; //创建者id
  creatorName: string; //创建者名称
}

export interface ProjectCustomerInstance {
  id: string; //客户id
  name: string; //客户名称
  description: string; //客户描述
  projectId: string; //项目id
  creatorId: string; //创建者id
}

export interface AddCustomerParams {
  name: string; //客户名称
  description: string; //客户描述
  creatorId: string; //创建者id
}

