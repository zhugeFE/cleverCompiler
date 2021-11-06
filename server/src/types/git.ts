/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-06 23:44:12
 */
import { Version } from './common';

export interface GitList {
  id: string;
  name: string;
}

export interface GitInstance {
  id: string;
  name: string;
  description: string;
  versionId: string;
  version: string;
  repo: string;
  repoId: number;
  enable: boolean;
}
export interface UpdateGitStatus {
  id: string;
  enable: number;
}

export interface GitInfo {
  id: string;
  gitId: string;
  name: string;
  gitRepo: string;
  versionList: GitVersion[];
}

export interface GitCommit {
  id: string;
  message: string;
  createdAt?: string;
}

export interface GitBranch {
  name: string;
  commit: GitCommit;
}
export interface GitTag {
  name: string;
  message: string;
  commit: GitCommit;
}
export interface GitCreateVersionParam {
  gitId: string; // git id（这里指编译平台里面的id）
  repoId: string;
  version: string; // 版本号
  source: string; // 版本来源：branch/tag/commit
  sourceValue: string; // 版本来源值
  description: string; // 版本描述
}
export interface GitCreateConfigParam {
  configId?: string;
  sourceId: string;
  versionId: string;
  typeId: string;
  filePath: string;
  reg?: string;
  targetValue: string;
  description: string;
}

export interface UpdateConfigParam {
  configId: string;
  reg: string;
  filePath: string;
  targetValue: string;
  description: string;
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
export interface GitVersion extends Version{
  sourceId: string; 
  sourceType: string; // 版本来源类型：branch/tag/commit
  sourceValue: string; // 版本来源值
  description: string; // 版本描述
  configs: GitConfig[];
  compileOrders: string; // 编译命令组
}


export interface CompileParams {
  readmeDoc: string;
  buildDoc: string;
  updateDoc: string;
  compileOrders: string;
  gitType: string;
  gitValue: string;
  gitSsh: string;
}