/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-27 15:41:17
 */
import { Version } from "./common";

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

export interface TemplateInfo {
  id: string;
  version: string;
}

export interface UpdateConfigStatus {
  id: string;
  status: number;
}

export interface TemplateInfo extends TemplateInstance {
  versionList: TemplateVersion[];
}

export interface CreateTemplateParams {
  name: string;
  description: string;
  creatorId: string;
}
export interface UpdateTemplateStatus {
  id: string;
  enable: number;
}

export interface ChangeGitVersionParams {
  id: string;
  gitSourceVersionId: string;
  configList: CreateTemplateConfig[];
}

export interface TemplateVersion extends Version{
  templateId: string ; //模板版本id
  description: string; //模板版本描述
  version: string; //模板版本号
  publicType: number;
  gitList: TemplateVersionGit[]; //配置项
  globalConfigList?: TemplateGlobalConfig[]; //全局配置项
}

export interface CreateTemplateVersionParams {
  templateId: string ; //模板id
  name: string; //模版名称
  description: string ; //模板描述
  version: string; //模板版本号
  versionDescription: string; //版本描述
}

export interface CreateTemplateVersionGitParams {
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  gitSourceId: string; //git来源id
  gitSourceBranchId: string; //git分支id
  gitSourceVersionId: string; //git版本来源id
}

export interface TemplateVersionGit {
  id: string; //id
  pid: string;
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  gitSourceBranchId: string;
  gitSourceId: string; //git来源id
  gitSourceVersionId: string; //git版本来源id
  name: string; //git来源名称
  version: string;
  branchName: string;
  configList: TemplateConfig[]; //配置项
  buildDoc?: string; //所在版本的配置文档
  readmeDoc?: string; //所在版本的说明文档
  updateDoc?: string; //所在版本的更新文档
}

export interface CreateTemplateConfig {
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  templateVersionGitId: string; //模板版本中git项id
  gitSourceConfigId: string; //模板版本中git项的配置项id
  targetValue: string; //配置项默认值
  isHidden: number; //是否隐藏
  visible?: number; //是否可见
  globalConfigId?: string; // 全局配置id
}
export interface TemplateConfig extends CreateTemplateConfig {
  id: string;
  typeId: number;
  reg: string; // 正则表达式
  filePath: string; // 原始文件路径
  description: string; // 描述信息
  globalConfigId: string; //全局配置id
}

export interface TemplateVersionUpdateInfo {
  id: string;
  name: string;
  status: number;
  description: string;
  version: string;
  gitInfo: TemplateVersionGitUpdateInfo[];
}

export interface HistoryVersion {
  id: string;
  version: string;
  sourceId: string;
  buildDoc: string;
  buildUpdateDoc: string;
  updateDoc: string;
}

export interface TemplateVersionGitUpdateInfo {
  name: string;
  version: string;
  // updateDoc: string;
  // buildDoc: string;
  gitSourceId: string;
  description: string;
  publishTime: string;
  gitSourceBranchId: string;
  branchName: string;
  historyVersion: HistoryVersion[];
}


export interface UpdateConfigParam {
  id: string;
  description?: string;
  targetValue?: string;
  isHidden?: number;
  globalConfigId?: string;
}

export interface TemplateGlobalConfig {
  id: string; 
  name: string;
  description: string;
  templateId: string; //模板id
  templateVersionId: string;//模板版本id
  targetValue: string;//默认值
  isHidden: number; //是否隐藏配置项
  type: number;
  visible?: number; //配置是否可见
}

export interface UpdateTemplateGlobalConfig {
  id: string;
  description: string;
  targetValue: string;
}

export interface CreateTemplateGlobalConfigParams {
  name: string; //名称
  targetValue: string; //默认值
  description: string; //描述
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  isHidden?: number;
  type: number;
}
