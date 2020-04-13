import { Version } from './common';

export interface GitInstance {
  id: string;
  gitId: string;
  name: string;
  git: string;
  enable: boolean;
  lastVersionId: string;
  description: string;
  lastVersion: string;
  readmeDoc: string;
  buildDoc: string;
}

export interface GitInfo {
  id: string;
  gitId: string;
  name: string;
  gitRepo: string;
  configs: GitConfig[];
  versionList: Version[];
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
  version: string; // 版本号
  source: string; // 版本来源：branch/tag/commit
  value: string; // 版本来源值
}
export interface GitCreateConfigParam {
  sourceId: string;
  versionId: string;
  typeId: string;
  filePath: string;
  reg?: {
    source: string;
    global: boolean;
    ignoreCase: boolean;
  };
  value: string;
  desc: string;
}
export interface GitConfig {
  id: string; // 配置项id
  sourceId: string;
  versionId: string;
  typeId: number; // 类型id
  type: string; // 类型名称
  desc: string; // 描述信息
  reg: string; // 正则表达式
  filePath: string; // 原始文件路径
  targetValue: string; // 目标值，配置项类型是文件时，该值是文件存放地址
}
export interface GitVersion extends Version{
  sourceType: string; // 版本来源类型：branch/tag/commit
  sourceValue: string; // 版本来源值
  compileOrders: string[]; // 编译命令组
}