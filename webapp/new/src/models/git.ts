
   
import { Effect, Reducer } from '@/.umi/plugin-dva/connect';
import { TextConfigParam } from '@/pages/gitManage/gitTextConfig';
import gitService from '@/services/git';
import { ConfigType, Version } from './common';
import util from '@/utils/utils';
import { ConnectState } from './connect';


export interface GitList {
  id: number;
  name: string;
}

export interface VersionUpdateDocInfo {
  id: string;
  updateDoc: string;
  version: string;
  publishTime: string;
  description: string;
}

export interface GitSelectParams {
  git: GitList[];
  version:{
    [propName:string]:string[]
  }
}
export interface UpdateGitStatus {
  id: string;
  enable: number;
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
  sourceType: string;
  sourceValue: string;
  publicType: number;
  publicGit: number;
  compileOrders: string[]; // 编译命令组
  configs: GitConfig[];
  outputName: string;
  branchId: string;
}
export interface GitInfo {
  id: string;
  gitId: string;
  name: string;
  gitRepo: string;
  branchList: GitInfoBranch[];
}

/**
 * 编译平台的分支概念
 */
export interface GitInfoBranch {
  id: string;
  name: string;
  description: string;
  creator: string;
  sourceId: string;
  publishTime: Date;
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
/**
 * git源上的分支信息
 */
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
  repoId: string;
  version: string; // 版本号
  source: string; // 版本来源：branch/tag/commit
  sourceValue: string; // 版本来源值
  description: string; // 版本描述
  branchName: string;
  branchDesc: string;
  branchId: string;
  originBranchId: string;
  originVersionId: string;
}

export interface GitTextConfigParam extends TextConfigParam{
  sourceId: string;
  versionId: string;
  typeId: ConfigType['id'];
}

export interface BranchUpdateDocInfo {
  id: string;
  name: string;
  description: string;
  createTime: Date;
  children: VersionUpdateDocInfo[];
}
export interface GitUpdateVersionParam {
  id: string;
  compileOrders: string;
  readmeDoc: string;
  buildDoc: string;
  updateDoc: string;
  outputName: string;
  publicGit: number;
  publicType: number;
}
export type GitModelState = {
  gitList: GitInstance[];
  currentGit?: GitInfo;
  currentBranch?: GitInfoBranch;
  currentVersion?: GitVersion;
  /**
   * git是否在请求更新中
   */
  updateLoading: boolean;
}

export type GitModelType = {
  namespace: 'git';
  state: GitModelState;
  effects: {
    query: Effect;
    getInfo: Effect;
    getFileTree: Effect;
    getBranchUpdateInfo: Effect;
    queryRemoteGitList: Effect;
    queryBranchs: Effect;
    queryCommits: Effect;
    queryTags: Effect;
    createVersion: Effect;
    delConfig: Effect;
    delGitInfo: Effect;
    addConfig: Effect;
    getFileContent: Effect;
    updateConfig: Effect;
    updateGitVersionStatus: Effect;
    updateVersion: Effect;
    updateGitStatus: Effect;
    deleteVersion: Effect;
    deleteBranch: Effect;
  };
  reducers: {
    setList: Reducer<GitModelState>;
    setInfo: Reducer<GitModelState>;
    setUpdateLoading: Reducer<GitModelState>;
    _addConfig: Reducer<GitModelState>;
    _updateConfig: Reducer<GitModelState>;
    _delConfig: Reducer<GitModelState>;
    _updateVersion: Reducer<GitModelState>;
  };
}

const GitModel: GitModelType = {
  namespace: 'git',
  state: {
    gitList: [],
    updateLoading: false
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
    *getBranchUpdateInfo ({payload, callback}, {call}) {
      const res = yield call(gitService.getBranchUpdateInfo, payload as string)
      if (res.status === -1) return
      callback(res.data)
    },
    *getInfo ({payload}, {call, put}) {
      const res = yield call(gitService.getInfo, payload as string)
      if (res.status === -1) return
      yield put({
        type: 'setInfo',
        info: res.data
      })
    },
    *getFileTree ({payload, callback}, {call}) {
      const res = yield call(gitService.getFileTree, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      callback(res.data)
    },
    *queryRemoteGitList ({callback}, {call}) {
      const res = yield call(gitService.queryRemoteGitList)
      if (res.status === -1) return
      if (callback) callback(res.data)
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
    *delConfig ({payload}, {call, put}) {
      const res = yield call(gitService.delConfig, payload)
      if (res.status === -1) return
      yield put({
        type: '_delConfig',
        id: payload
      })
    },
    *addConfig ({payload, callback}, {call, put}) {
      const res = yield call(gitService.addConfig, payload)
      if (res.status === -1) return
      yield put({
        type: '_addConfig',
        config: res.data
      })
      if (callback) callback()
    },
    *updateConfig ({payload, callback}, {call, put}) {
      const res = yield call(gitService.updateConfig, payload)
      if (res.status === -1) return
      yield put({
        type: '_updateConfig',
        config: res.data
      })
      if (callback) callback()
    },
    *getFileContent ({payload, callback}, {call}) {
      const res = yield call(gitService.getFileContent, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateGitVersionStatus ({payload, callback}, {call}) {
      const res = yield call(gitService.updateGitVersionStatus, payload)
      if (res.status === -1) return
      if (callback) callback()
    },
    *updateVersion ({payload}, {call, put, select}) {
      yield put({
        type: 'setUpdateLoading',
        loading: true
      })
      const currentState = yield select((conn: ConnectState) => conn.git)
      const param = util.clone(payload)
      param.id = currentState.currentVersion.id
      let res = yield call(gitService.updateVersion, param)
      if (res && res.status === -1) return
      yield put({
        type: '_updateVersion',
        param: payload
      })
    },
    *updateGitStatus ({payload, callback}, {call, select, put}) {
      const res = yield call( gitService.updateGitStatus, payload as UpdateGitStatus[])
      if (res.status === -1) return
      const gitList: GitInstance[] = util.clone( yield select( (_: {git: {gitList: GitInstance[]}}) => _.git.gitList))
      let payloadMap = {}
      payload.map( (item: UpdateGitStatus) => {
        payloadMap[item.id] = item.enable
      })
      gitList.map( (git, index) => {
        if (Object.keys(payloadMap).includes(git.id)) {
          git.enable = Boolean(payloadMap[git.id]) 
        } 
      })
       yield put({
        type: 'setList',
        payload: gitList
      })
      if (callback) callback()
    },
    *deleteVersion ({payload, callback}, {call}) {
      const res = yield call(gitService.deleteVersion, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *deleteBranch ({payload, callback}, {call}) {
      const res = yield call(gitService.deleteBranch, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *delGitInfo ({payload, callback}, {call, select, put}) {
      const res = yield call(gitService.deletGitInfo, payload)
      if (res.status === -1) return
      const gitList: GitInstance[] = util.clone( yield select( (_: {git: {gitList: GitInstance[]}}) => _.git.gitList))
      gitList.map( (git, index) => {
        if (git.id === payload) {
          gitList.splice(index,1)
        }
      })
      yield put({
        type: 'setList',
        payload: gitList
      })
      if (callback) callback(res.data)
    }
  },
  reducers: {
    setList (state, {payload}): GitModelState {
      const res = util.clone(state)!
      res.gitList = payload
      return res!
    },
    setInfo(state, p): GitModelState {
      const { info } = p as unknown as {
        info: GitInfo;
      }
      const res = util.clone(state)
      if (info.branchList.length) res!.currentBranch = info.branchList[0]
      if (res?.currentBranch &&
         res.currentBranch.versionList.length) {
        res.currentVersion = res.currentBranch.versionList[0]
      }
      res!.currentGit = info
      return res!
    },
    _addConfig(state, p): GitModelState {
      const {config} = p as unknown as {
        config: GitConfig;
      }
      const res = util.clone(state)
      res!.currentVersion!.configs.push(config)
      res?.currentBranch?.versionList.forEach((item, i) => {
        if (item.id === res.currentVersion!.id) {
          res!.currentBranch!.versionList![i] = res!.currentVersion!
        }
      })
      res?.currentGit?.branchList.forEach((branch, i) => {
        if (branch.id === res.currentBranch!.id) {
          res.currentGit!.branchList[i] = res.currentBranch!
        }
      })
      return res!
    },
    _updateConfig(state, p): GitModelState {
      const {config} = p as unknown as {
        config: GitConfig;
      }
      const res = util.clone(state)
      res?.currentVersion?.configs.forEach((item, i) => {
        if (item.id === config.id) {
          res.currentVersion!.configs[i] = config
        }
      })
      res?.currentBranch?.versionList.forEach((item, i) => {
        if (item.id === res.currentVersion!.id) {
          res!.currentBranch!.versionList![i] = res!.currentVersion!
        }
      })
      res?.currentGit?.branchList.forEach((branch, i) => {
        if (branch.id === res.currentBranch!.id) {
          res.currentGit!.branchList[i] = res.currentBranch!
        }
      })
      return res!
    },
    _delConfig(state, p): GitModelState {
      const {id} = p as unknown as {
        id: string;
      }
      const res = util.clone(state)
      res?.currentVersion?.configs.forEach((item, i) => {
        if (item.id === id) {
          res.currentVersion!.configs.splice(i, 1)
        }
      })
      res?.currentBranch?.versionList.forEach((item, i) => {
        if (item.id === res.currentVersion!.id) {
          res!.currentBranch!.versionList![i] = res!.currentVersion!
        }
      })
      res?.currentGit?.branchList.forEach((branch, i) => {
        if (branch.id === res.currentBranch!.id) {
          res.currentGit!.branchList[i] = res.currentBranch!
        }
      })
      return res!
    },
    setUpdateLoading (state, {loading}): GitModelState {
      const res = util.clone(state)!
      res.updateLoading = loading
      return res
    },
    _updateVersion (state, {param}): GitModelState {
      const res = util.clone(state)!
      res.updateLoading = false
      for (const prop in param) {
        let val = param[prop]
        switch (prop) {
          case 'compileOrders':
            val = JSON.parse(val)
            break
          default:
            break
        }
        res.currentVersion![prop] = val
      }
      res?.currentBranch?.versionList.forEach((item, i) => {
        if (item.id === res.currentVersion!.id) {
          res!.currentBranch!.versionList![i] = res!.currentVersion!
        }
      })
      res?.currentGit?.branchList.forEach((branch, i) => {
        if (branch.id === res.currentBranch!.id) {
          res.currentGit!.branchList[i] = res.currentBranch!
        }
      })
      return res
    }
  }
}

export default GitModel