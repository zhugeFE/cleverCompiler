/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-09 19:27:00
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

export interface RegistParam {
  username: string;
  password: string;
  email: string;
}

export interface Member {
  id: string;
  name: string;
}