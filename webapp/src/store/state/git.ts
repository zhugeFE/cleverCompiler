import { Config, Version } from './common';

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
  sourceType: string;
  sourceValue: string;
  compileOrders: string[]; // 编译命令组
  configs: GitConfig[];
}
export interface GitInfo {
  id: string;
  gitId: string;
  name: string;
  gitRepo: string;
  versionList: GitVersion[];
}
export interface GitState {
  list: GitInstance[]
}
export interface GitCommit {
  id: string;
  message: string;
  createdAt: string;
}
export interface GitBranch {
  name: string;
  commit: GitCommit;
}
export interface GitTag {
  name: string;
  commit: GitCommit;
}
export interface GitCreateVersionParam {
  gitId: string; // git id（这里指编译平台里面的id）
  version: string; // 版本号
  source: string; // 版本来源：branch/tag/commit
  value: string; // 版本来源值
  description: string; // 版本描述
  parentId?: string; // 父版本id
}