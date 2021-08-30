import { TemplateGlobalConfig, TemplateVersionGit } from "./template";

/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:14:31
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-30 14:19:29
 */
export interface ProjectInstance {
  id: string; //项目id
  name: string; //项目名称
  description: string; //描述
  compileType: number; //编译类型
  lastCompileTime: string; //上次编译时间
  lastCompileResult: number; // 上次编译结果
  lastCompileUser: string; //上次编译人
  createTime: Date; //创建时间
}

export interface ProjectInfo {
  id: string; //项目id
  name: string; //项目名称
  description: string; //描述
  templateId: string; // 项目来源模板id
  templateVersion: string; //项目来源模板版本id
  compileType: number; //编译类型 0私有部署 1常规迭代 2发布测试
  createTime: Date; //创建时间
  shareNumber: string[]; //分享成员
  globalConfigList: ProjectConfig[];//全局配置
}


export interface ProjectType {
  id: string; // 项目id
  name: string; // 项目名称
  templateId: string; // 项目来源模板id
  templateVersion: string; //项目来源模板版本id
  compileType: number; //编译类型 0私有部署 1常规迭代 2发布测试
  publishType: number; //发布方式 0发布到git 1下载  2自动
  description: string; //项目描述
  createTime: Date; //创建时间
}



export interface CreateProjectParams {
  name: string; //名称
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  compileType: number; //编译类型 0私有部署 1常规迭代 2发布测试
  publicType: number; //发布方式 0发布到git 1下载 2自动
  configList: TemplateGlobalConfig[];
  gitList: TemplateVersionGit[];
  shareNumber: string[];
  description: string; //描述
}


export interface CreateConfigParams {
  configId: string; //模板版本配置id
  projectId: string; //项目id
  value: string; //默认值
}

export interface ProjectConfig {
  id: string; //项目配置id
  configId: string; //模板版本配置id
  projectId: string; //项目id
  value: string; //默认值
}

export interface ProjectShare {
  id: string; //项目分享id
  receiveUserId: string; //接收者id
  userId: string; //分享者id
  projectId: string; //项目id
}

export interface CreateShareProject {
  projectId: string; //项目id
  userId: string; //分享者id
  receiverUserId?: string; //被分享者id
  receiverUserIds?: string[]; //被分享者id数组
}

