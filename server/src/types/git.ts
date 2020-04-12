import { Version, Config } from './common';

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
  configs: Config[];
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
export interface GitVersion extends Version{
  sourceType: string; // 版本来源类型：branch/tag/commit
  sourceValue: string; // 版本来源值
  compileOrders: string[]; // 编译命令组
}