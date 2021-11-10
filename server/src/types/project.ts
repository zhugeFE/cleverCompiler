import { TemplateGlobalConfig, TemplateVersionGit } from "./template";

/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:14:31
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-10 14:24:56
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
}

export interface ProjectInfo extends ProjectType{
  gitList: TemplateVersionGit[];
  globalConfigList: ProjectGlobalConfig[];//全局配置
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
  shareNumber: string; //分享成员

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
  customer: string; //客户id
}


export interface ProjectGlobalConfig {
  id: string; 
  name: string;
  description: string;
  templateId: string; //模板id
  templateVersionId: string;//模板版本id
  targetValue: string;//默认值
  isHidden: number; //是否隐藏配置项
  type: number;
}

export interface ProjectGit {
  id: string; //id
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  gitSourceId: string; //git来源id
  gitSourceVersionId: string; //git版本来源id
  name: string; //git来源名称
  version: string;
  configList: ProjectConfig[]; //配置项
  buildDoc?: string; //所在版本的配置文档
  readmeDoc?: string; //所在版本的说明文档
  updateDoc?: string; //所在版本的更新文档
}

export interface ProjectConfig{
  id: string;
  typeId: number;
  reg: string; // 正则表达式
  filePath: string; // 原始文件路径
  description: string; // 描述信息
  globalConfigId: string; //全局配置id
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  templateVersionGitId: string; //模板版本中git项id
  gitSourceConfigId: string; //模板版本中git项的配置项id
  targetValue: string; //配置项默认值
  isHidden: number; //是否隐藏
}

