import { Version } from "./common";

/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-09 09:20:12
 */

export interface TemplateInstance {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createTime: Date;
  enable: number;
  version: string; //最新版本号
  versionId?: string; //最新版本id
}

export interface TemplateInfo extends TemplateInstance {
  versionList: TemplateVersion[];
}

export interface CreateTemplateParams {
  name: string;
  description: string;
  creatorId: string;
}


export interface TemplateVersion extends Version{
  templateId: string ; //模板版本id
  description: string; //模板版本描述
  version: string; //模板版本号
  gitList: TemplateVersionGit[]; //配置项
  globalConfigList?: TemplateGlobalConfig[]; //全局配置项
}


export interface CreateTemplateVersionParams {
  templateId: string ; //模板id
  description: string ; //模板版本描述
  version: string; //模板版本号
}


export interface CreateTemplateVersionGitParams {
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  gitSourceId: string; //git来源id
  gitSourceVersionId: string; //git版本来源id
}

export interface TemplateVersionGit {
  id: string; //id
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  gitSourceId: string; //git来源id
  gitSourceVersionId: string; //git版本来源id
  name: string; //git来源名称
  configList: ConfigInstance[]; //配置项
  buildDoc?: string; //所在版本的配置文档
  readmeDoc?: string; //所在版本的说明文档
  updateDoc?: string; //所在版本的更新文档
}

export interface ConfigInstance {
  id: string; 
  value: string; //配置项默认值
  isHidden: string; //是否隐藏
  globalConfigId: string; //全局配置id
  typeId: number; // 类型名称
  description: string; // 描述信息
  reg: string; // 正则表达式
  filePath: string; // 原始文件路径
  sourceValue: string;
  realValue: string; //真实被替换的值
}

export interface GitConfig {
  id: string; // 配置项id
  sourceId: string;
  versionId: string;
  typeId: number; // 类型id
  type: string; // 类型名称
  description: string; // 描述信息
  reg: string; // 正则表达式
  filePath: string; // 原始文件路径
  targetValue: string; // 目标值，配置项类型是文件时，该值是文件存放地址
}
export interface TemplateConfig {
  id: string;
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  templateVersionGitId: string; //模板版本中git项id
  gitSourceConfigId: string; //模板版本中git项的配置项id
  value: string; //配置项默认值
  isHidden: string; //是否隐藏
  globalConfigId: string; //全局配置id
}

export interface UpdateConfigParam {
  id: string;
  defaultValue: string;
  isHidden: number;
  globalConfigId: string;
}

export interface CreateTemplateConfigParams {
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  templateVersionGitId: string; //模板版本中git项id
  gitSourceConfigId: string; //模板版本中git项的配置项id
}


export interface TemplateGlobalConfig {
  id: string; 
  name: string;
  description: string;
  templateId: string; //模板id
  templateVersionId: string;//模板版本id
  defaultValue: string;//默认值
  isHidden: number; //是否隐藏配置项
}

export interface CreateTemplateGlobalConfigParams {
  name: string; //名称
  defaultValue: string; //默认值
  description: string; //描述
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
}
