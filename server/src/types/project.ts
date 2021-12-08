import { TemplateConfig, TemplateGlobalConfig, TemplateVersionGit } from "./template";

/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:14:31
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-08 14:05:55
 */
export interface ProjectInstance {
  id: string; //项目id
  name: string; //项目名称
  description: string; //描述
  compileType: number; //编译类型
  lastCompileTime: string; //上次编译时间
  lastCompileResult: number; // 上次编译结果
  lastCompileUser: string; //上次编译人
  createTime: Date; //创建时间,
  customer: string;
  creatorId: string;
  templateId: string;
  templateVersion: string;
  receiveUserId: string;
}

export interface ProjectInfo extends ProjectType{
  gitList: TemplateVersionGit[];
  globalConfigList: TemplateGlobalConfig[];//全局配置
}

export interface ProjectCompileData extends ProjectType {
  configList:  TemplateConfig[]; 
}


export interface ProjectType {
  id: string; // 项目id
  name: string; // 项目名称
  templateId: string; // 项目来源模板id
  templateVersion: string; //项目来源模板版本id
  compileType: number; //编译类型 0私有部署 1常规迭代 2发布测试
  publishType: number; //发布方式 0发布到git 1下载  2自动
  description: string; //项目描述
  createTime: Date; //创建时间,
  creatorId: string; //创建者id
  customer: string; //客户id
  customerName: string;
  shareMember: string; //分享成员
}



export interface CreateProjectParams {
  name: string; //名称
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  compileType: number; //编译类型 0私有部署 1常规迭代 2发布测试
  publicType: number; //发布方式 0发布到git 1下载 2自动
  configList: TemplateGlobalConfig[];
  gitList: TemplateVersionGit[];
  shareMember: string;
  description: string; //描述
  customer: string; //客户id
}

export interface UpdateProjectParams {
  id: string;
  templateId: string;
  templateVersionId: string;
  gitList: TemplateVersionGit[];
  publicType: string;
  shareMember: string;
  description: string;
  globalConfigList: TemplateGlobalConfig[];
}

export interface ProjectCompileGitParams {
  id: string;
  name: string;
}


export interface ProjectCompileParams {
  id: string;
  name: string;
  publicType: number;
  gitList: ProjectCompileGitParams[];
}