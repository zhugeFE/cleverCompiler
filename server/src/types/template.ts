/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-07 10:13:59
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createTime: Date;
}
export interface TemplateInstance {
  id: string;
  name: string;
  description: string;
  versionId: string;
  version: string;
}