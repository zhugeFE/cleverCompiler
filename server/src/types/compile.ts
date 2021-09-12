/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-23 16:55:25
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-12 16:36:37
 */

import { ConfigInstance } from "./template";


export interface ProjectCompile {
  id: string; //编译id
  compileTime: Date; //编译时间
  compileUser: string; //编译者id
  compileResult: string; //编译结果
  projectId: string; //项目id
  description: string; //编译描述
}

export interface CompileParam {
  compileUser: string; //编译者id
  compileResult: string; //编译结果
  projectId: string; //项目id
  description: string; //编译描述
}

export interface CompileConfig {
  userId: string; //编译者id
  gitName: string; //仓库名称
  gitSsh: string; //仓库地址
  gitValue: string; //来源值
  gitType: string; //来源类型
  compileOrders: string[]; //编译命令
  configList: ConfigInstance[]; //配置
  compileType: number ; //编译类型
  templateId: string;
  templateVersionId: string;
}