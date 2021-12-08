/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-23 16:55:25
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-08 10:27:43
 */
import { TemplateConfig } from './template';

export interface ProjectCompile {
  id: string; //编译id
  compileTime: Date; //编译时间
  compileUser: string; //编译者id
  compileResult: string; //编译结果
  projectId: string; //项目id
  description: string; //编译描述
  projectName: string; //项目名称
  projectDesc: string; //项目描述
  cusName: string; // 客户名称
  file: string; //文件位置
  config: string;
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
  configList: TemplateConfig[]; //配置
  compileType: number ; //编译类型
  templateId: string;
  templateVersionId: string;
}
export interface CompileGitData {
  name: string;
  outputName: string;
  publicType: number;
  publicGit: number;
}
export interface CompileDoc {
  buildDoc: string;
  updateDoc: string;
  readmeDoc: string;
}