/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-03 22:48:20
 */
export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
}
export interface LoginParam {
  username: string;
  password: string;
}

export interface Member {
  id: string;
  name: string;
}