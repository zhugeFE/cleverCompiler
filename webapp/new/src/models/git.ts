import { Effect, Reducer } from '@/.umi/plugin-dva/connect';
import gitService from '@/services/git';
import { Version } from './common';

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

export type GitModelState = {
  gitList: GitInstance[];
}

export type GitModelType = {
  namespace: 'git';
  state: GitModelState;
  effects: {
    query: Effect;
    getInfo: Effect;
    getFileTree: Effect;
    queryBranchs: Effect;
    queryCommits: Effect;
    queryTags: Effect;
    createVersion: Effect;
    delConfig: Effect;
    getFileContent: Effect;
  };
  reducers: {
    setList: Reducer<GitModelState>;
  };
}

const GitModel: GitModelType = {
  namespace: 'git',
  state: {
    gitList: []
  },
  effects: {
    *query (_, { put, call}) {
      const res = yield call(gitService.query)
      if (res.status === -1) return
      yield put({
        type: 'setList',
        payload: res.data
      })
    },
    *getInfo ({payload, callback}, {call}) {
      const res = yield call(gitService.getInfo, payload as string)
      if (res.status === -1) return
      callback(res.data)
    },
    *getFileTree ({payload, callback}, {call}) {
      const res = yield call(gitService.getFileTree, payload)
      if (res.status === -1) return
      callback(res.data)
    },
    *queryBranchs ({payload, callback}, {call}) {
      const res = yield call(gitService.queryBranchs, payload)
      if (res.status === -1) return 
      if (callback) callback(res.data)
    },
    *queryCommits ({payload, callback}, {call}) {
      const res = yield call(gitService.queryCommits, payload)
      if (res.status === -1) return 
      if (callback) callback(res.data)
    },
    *queryTags ({payload, callback}, {call}) {
      const res = yield call(gitService.queryTags, payload)
      if (res.status === -1) return 
      if (callback) callback(res.data)
    },
    *createVersion ({payload, callback}, {call}) {
      const res = yield call(gitService.createVersion, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *delConfig ({payload, callback}, {call}) {
      const res = yield call(gitService.delConfig, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *getFileContent ({payload, callback}, {call}) {
      const res = yield call(gitService.getFileContent, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    }
  },
  reducers: {
    setList (state, {payload}) {
      return {
        ...state,
        gitList: payload
      }
    }   
  }
}

export default GitModel