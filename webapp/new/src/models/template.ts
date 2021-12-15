/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-04 15:55:58
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-15 14:51:18
 */

import { Effect, Reducer } from '@/.umi/plugin-dva/connect';
import templateService from '@/services/template';
import util from '@/utils/utils';
import { Version } from './common';
import { ConnectState } from './connect';



export interface TemplateVersionUpdateInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  gitInfo: TemplateVersionGitUpdateInfo[];
}

export interface HistoryVersion {
  id: string;
  version: string;
  sourceId: string;
  buildDoc: string;
  updateDoc: string;
}

export interface TemplateVersionGitUpdateInfo {
  name: string;
  version: string;
  updateDoc: string;
  buildDoc: string;
  description: string;
  publishTime: string;
  gitSourceBranchId: string;
  branchName: string;
  historyVersion: HistoryVersion[];
  tag?: number;
}

export const updateTag = {
  normal: 0,
  add: 1,
  del: -1,
  up: 2,
  down: -2
}

export interface TemplateInstance {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createTime: string;
  enable: number;
  version: string; //最新版本号
  versionId: string; //最新版本id
}

export interface UpdateTemplateStatus {
  id: string;
  enable: number;
}


export interface TemplateInfo extends TemplateInstance{
  versionList: TemplateVersion[];
  currentVersion: TemplateVersion;
}


export interface TemplateVersion extends Version{
  templateId: string ; //模板版本id
  description: string; //模板版本描述
  version: string; //模板版本号
  publicType: number;
  gitList: TemplateVersionGit[]; //配置项
  globalConfigList: TemplateGlobalConfig[]; //全局配置项
}

export interface TemplateCreateParam {
  name: string; //模板名称
  description: string; //模板描述
  version: string; //初始版本
  versionDescription: string; //版本描述
}

export interface CreateTemplateVersionParams {
  templateId: string ; //模板id
  description: string ; //模板版本描述
  version: string; //模板版本号
}

export interface CreateTemplateVersionGitParams {
  templateId: string ; //模板id
  templateVersionId: string; //模板版本id
  gitSourceId: string; //git源id
  gitSourceBranchId: string; //git源分支
  gitSourceVersionId: string; //git源版本
}

export interface TemplateVersionGit {
  id: string; //id
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  gitSourceId: string; //git来源id
  gitSourceVersionId: string; //git版本来源id
  gitSourceBranchId: string;
  name: string; //git来源名称
  version: string;
  branchName: string;
  configList: TemplateConfig[]; //配置项
  buildDoc?: string; //所在版本的配置文档
  readmeDoc?: string; //所在版本的说明文档
  updateDoc?: string; //所在版本的更新文档
}


export interface TemplateConfig {
  id: string;
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  templateVersionGitId: string; //模板版本中git项id
  gitSourceConfigId: string; //模板版本中git项的配置项id
  typeId: number; // 类型名称
  targetValue: string; //配置项默认值
  isHidden: number; //是否隐藏
  reg: string; // 正则表达式
  description: string; // 描述信息
  filePath: string; // 原始文件路径
  globalConfigId: string; //全局配置id
  file?: File;
}

export interface UpdateConfigParam {
  id: string;
  targetValue: string;
  description: string;
  isHidden: number;
  globalConfigId: string
}



export interface UpdateTemplateVersion {
  id: string; //模板版本id
  readmeDoc: string; //介绍文档
  buildDoc: string; //部署文档
  updateDoc: string; //更新文档
  publicType: number;
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
  file?: File;
}


export interface ChangeGitVersionParams {
  id: string;
  gitSourceVersionId: string;
  configList: CreateTemplateConfig[];
}

export interface CreateTemplateConfig {
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  templateVersionGitId: string; //模板版本中git项id
  gitSourceConfigId: string; //模板版本中git项的配置项id
  targetValue: string; //配置项默认值
  isHidden: number; //是否隐藏
}



export interface CreateTemplateGlobalConfigParams {
  name: string; //名称
  defaultValue: string; //默认值
  description: string; //描述
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
}



export type TemplateModelState = {
  templateList: TemplateInstance[] ;
  templateInfo?: TemplateInfo;
  currentVersion?: TemplateVersion;
  currentGitId?: string;
}


export type TemplateModelType = {
  namespace: 'template';
  state: TemplateModelState;
  effects: {
    query: Effect;
    uquery: Effect;
    getInfo: Effect;
    getTemplateVersionInfo: Effect;
    getVersionUpdateInfo: Effect;
    delTemplateInfo: Effect;
    updateTemplateStatus: Effect;
    updateTemplate: Effect;
    copyTemplate: Effect;
    addVersion: Effect;
    updateVersion: Effect;
    changeGitVersion: Effect;
    updateTemplateVersionStatus: Effect;
    deleteVersion: Effect;
    addVersionGit: Effect;
    delVersionGit: Effect;
    updateConfig: Effect;
    updateConfigStatus: Effect;
    updateConfigGlobalConfig: Effect;
    addGlobalConfig: Effect;
    updateGlobalConfig: Effect;
    updateGlobalConfigStatus: Effect;
    delGlobalConfig: Effect;
  };
  reducers: {
    setList: Reducer<TemplateModelState>;
    setInfo: Reducer<TemplateModelState>;
    setCurrentGitId: Reducer<TemplateModelState>;
    setCurrentVersion: Reducer<TemplateModelState>;
    _addGlobalConfig: Reducer<TemplateModelState>;
    _delGlobalConfig: Reducer<TemplateModelState>;
    _updateGlobalConfigStatus: Reducer<TemplateModelState>;
    _updateGlobalConfig: Reducer<TemplateModelState>;
    _addVersion: Reducer<TemplateModelState>;
    _deleteVersion: Reducer<TemplateModelState>;
    _updateTemplateVersionStatus: Reducer<TemplateModelState>;
    _updateVersion: Reducer<TemplateModelState>;
    _delVersionGit: Reducer<TemplateModelState>;
    _addVersionGit: Reducer<TemplateModelState>;
    _changeGitVersion: Reducer<TemplateModelState>;
    _updateConfigStatus: Reducer<TemplateModelState>;
    _updateConfigGlobalConfig: Reducer<TemplateModelState>;
    _updateConfig: Reducer<TemplateModelState>;
  };
}


const TemplateModel: TemplateModelType = {
  namespace: 'template',
  state: {
    templateList: []
  },
  effects: {
    *query (_ , {put , call}){
      const res = yield call(templateService.queryTemplateList)
      if (res.status === -1)return
      yield put({
        type: "setList",
        payload: res.data
      })
    },
    *uquery (_ , {put , call}){
      const res = yield call(templateService.uqueryTemplateList)
      if (res.status === -1)return
      yield put({
        type: "setList",
        payload: res.data
      })
    },
    *getTemplateVersionInfo ({payload, callback}, {call}) {
      const res = yield call(templateService.getTemplateVersionInfo, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *getVersionUpdateInfo ({payload, callback}, {call}) {
      const res = yield call(templateService.getVersionUpdateInfo, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *getInfo ({payload, callback}, {put , call}) {
      const res = yield call(templateService.getInfo, payload as string)
      if (res.status === -1) return
      yield put({
        type: 'setInfo',
        payload: res.data
      })
      if (callback) callback()
    },
    *delTemplateInfo ({payload, callback}, {call, select, put}) {
      const res = yield call(templateService.deleteTemplate, payload)
      if (res.status === -1) return
      const templateList: TemplateInstance[] = util.clone( yield select( (_: {template: {templateList: TemplateInstance[]}}) => _.template.templateList))
      templateList.map( (template, index) => {
        if (template.id === payload) {
          templateList.splice(index,1)
        }
      })
      yield put({
        type: 'setList',
        payload: templateList
      })
      if (callback) callback(res.data)
    },
    *updateTemplateStatus ({payload, callback}, {call, select, put}) {
      const res = yield call( templateService.updateTemplateStatus, payload as UpdateTemplateStatus[])
      if (res.status === -1) return
      const templateList: TemplateInstance[] = util.clone( yield select( (_: {template: {templateList: TemplateInstance[]}}) => _.template.templateList))
      let payloadMap = {}
      payload.map( (item: UpdateTemplateStatus) => {
        payloadMap[item.id] = item.enable
      })
      templateList.map( (template, index) => {
        if (Object.keys(payloadMap).includes(template.id)) {
          template.enable = payloadMap[template.id]
        } 
      })
       yield put({
        type: 'setList',
        payload: templateList
      })
      if (callback) callback()
    },
    *updateTemplate ({payload,callback}, {call}) {
      const res = yield call(templateService.updateTemplateStatus, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *copyTemplate ({payload, callback}, {call}) {
      const res = yield call( templateService.copyTemplate, payload as {templateId: string, name: string, templateVersionId: string})
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *addVersion ({payload, callback},{call,put}){
      const res = yield call(templateService.addVersion, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put ({
        type: "_addVersion",
        payload: res.data
      })
      if(callback) callback(true)
    },
    *updateTemplateVersionStatus ({payload, callback}, {call, put}) {
      const res = yield call(templateService.updateTemplateVersionStatus, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put({
        type: "_updateTemplateVersionStatus",
        payload: payload
      })
      if (callback) callback(true)
    },
    *updateVersion ({payload, callback},{call, put,select}){
      const currentState = yield select((conn: ConnectState) => conn.template)
      const param = util.clone(payload)
      param.id = currentState.currentVersion.id
      
      const res = yield call(templateService.updateVersion, param)
      if (res.status === -1) return
      yield put({
        type: "_updateVersion",
        param: payload
      })
      if (callback) callback(res.data)
    },
    *deleteVersion ({payload, callback}, {call, put}){
      const res = yield call(templateService.delVersion, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put({
        type: "_deleteVersion",
        versionId: payload
      })
      if (callback) callback(true)
    },
    *addVersionGit({payload, callback},{call,put}){
      const res = yield call(templateService.addVersionGit, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put ({
        type: "_addVersionGit",
        payload: res.data
      })
      if (callback) callback(true)
    },
    *changeGitVersion({payload, callback}, {call,put}) {
      const res = yield call(templateService.changeGitVersion, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put ({
        type: "_changeGitVersion",
        payload: res.data
      })
      if (callback) callback(true)
    },
    *delVersionGit ({payload,callback}, {call, put}){
      const res = yield call(templateService.delVersionGit, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put({
        type: '_delVersionGit',
        payload: payload
      })
      if (callback) callback(true)
    },

    *updateConfig ({payload,callback},{call,put}){
      const res = yield call(templateService.updateConfig, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put({
        type: '_updateConfig',
        payload: res.data
      })
      if (callback) callback(true)
    },
    *updateConfigStatus ({payload, callback}, {call,put} ) {
      const res = yield call(templateService.updateConfigStatus, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put ({
        type: "_updateConfigStatus",
        payload: payload
      })
      if (callback) callback(true)
    },
    *updateConfigGlobalConfig ({payload, callback}, {call,put}) {
      const res = yield call(templateService.updateConfigGlobalConfig, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put({
        type: "_updateConfigGlobalConfig",
        payload: payload
      })
      if (callback) callback(true)
    },
    *addGlobalConfig ({payload,callback},{call,put}){
      const res = yield call(templateService.addGlobalConfig, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put({
        type: "_addGlobalConfig",
        payload: res.data
      })
      if (callback) callback(true)
    },
    *updateGlobalConfig ({payload, callback}, {call,put}) {
      const res = yield call(templateService.updateGlobalConfig, payload)
      if (res.status === -1) {
        callback(false)
        return
      }      
      yield put({
        type: "_updateGlobalConfig",
        payload: res.data
      })
      if (callback) callback(true)
    },
    *updateGlobalConfigStatus ({payload, callback}, {call,put} ) {
      const res = yield call(templateService.updateGlobalConfigStatus, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put({
        type: "_updateGlobalConfigStatus",
        payload: payload
      })
      if (callback) callback(true)
    },
    *delGlobalConfig ({payload, callback}, {call,put}) {
      const res = yield call(templateService.delGlobalConfig, payload)
      if (res.status === -1) {
        callback(false)
        return
      }
      yield put ({
        type: "_delGlobalConfig",
        payload: payload
      })
      if (callback) callback(true)
    }
  },
  reducers: {
    setList (state, {payload}): TemplateModelState {
      const res =  util.clone(state)!
      res.templateList = payload
      return res
    },
    setInfo (state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.templateInfo = payload
      res.currentVersion = payload.versionList[0]
      res.currentGitId = res.currentVersion?.gitList.length ? res.currentVersion.gitList[0].id : ''
      return res
    },
    _addGlobalConfig (state, {payload}): TemplateModelState {
      const res =  util.clone(state)!
      res.currentVersion!.globalConfigList.unshift(payload)
      res.templateInfo?.versionList.forEach( (item, index) => {
        res.templateInfo!.versionList[index] = res.currentVersion!
      })
      return res
    },
    _delGlobalConfig (state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentVersion?.globalConfigList.forEach( (item,index) => {
        if (item.id == payload) {
          res.currentVersion?.globalConfigList.splice(index,1)
        }
      })
      res.templateInfo?.versionList.forEach( (item,index) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[index] = res.currentVersion!
        }
      })
      return res
    },
    _updateGlobalConfigStatus (state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentVersion?.globalConfigList.forEach( (item) => {
        if (item.id == payload.id) {
          item.isHidden = payload.status
        }
      })
      res.templateInfo?.versionList.forEach( (item,index) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[index] = res.currentVersion!
        }
      })
      return res
    },
    _updateGlobalConfig (state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentVersion?.globalConfigList.forEach( (item,index) => {
        if (item.id == payload.id) {
          res.currentVersion!.globalConfigList[index] = payload
        }
      })
      res.templateInfo?.versionList.forEach( (item,index) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[index] = res.currentVersion!
        }
      })
      return res
    },
    setCurrentVersion( state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.templateInfo?.versionList.forEach( item => {
        if (item.id == payload) {
          res.currentVersion = item
          res.currentGitId = res.currentVersion.gitList.length ? res.currentVersion.gitList[0].id : ""
        }
      })
      return res
    },
    _addVersion (state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.templateInfo?.versionList.unshift(payload)
      res.currentVersion = payload
      res.currentGitId = res.currentVersion?.gitList.length ? res.currentVersion.gitList[0].id : ""
      return res
    },
    _deleteVersion (state, {versionId}): TemplateModelState {
      const res = util.clone(state)! as TemplateModelState
      res.templateInfo?.versionList.forEach( (item,index) => {
        if (item.id == versionId) {
          res.templateInfo?.versionList.splice(index,1)
        }
      })
      res.currentVersion = res.templateInfo?.versionList[0]
      res.currentGitId = res.currentVersion?.gitList.length ? res.currentVersion.gitList[0].id : ""
      return res
    },
    _updateTemplateVersionStatus (state, {payload}): TemplateModelState {
      const res = util.clone(state)! as TemplateModelState
      res.currentVersion!.status =  payload.status
      res.templateInfo?.versionList.forEach( (item,index) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[index] = res.currentVersion!
        }
      })
      return res

    },
    _updateVersion (state, {param}): TemplateModelState {
      const res = util.clone(state)!
      for (const prop in param) {
        const val = param[prop]
        res.currentVersion![prop] = val
      }
      res.templateInfo?.versionList.forEach( (item,index) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[index] = res.currentVersion!
        }
      })
      return res
    },
    setCurrentGitId (state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentGitId = payload
      return res
    },
    _delVersionGit (state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentVersion?.gitList.forEach( (item,i) => {
        if (item.id == payload) {
          res.currentVersion?.gitList.splice(i,1)
          res.currentGitId = res.currentVersion?.gitList.length ? res.currentVersion.gitList[i-1].id : ""
        }
      })
      res.templateInfo?.versionList.forEach( (item,i) => {
        if ( item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[i] = res.currentVersion!
        }
      })
      return res
    },
    _addVersionGit (state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentVersion?.gitList.push(payload)
      res.currentGitId = payload.id
      res.templateInfo?.versionList.forEach( (item,i) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[i] =  res.currentVersion!
        }
      })
      return res
    },
    _changeGitVersion (state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentVersion?.gitList.forEach( (item, i) => {
        if (item.id == payload.id) {
          res.currentVersion!.gitList[i] = payload
          res.currentGitId = payload.id
        }
      })
      res.templateInfo?.versionList.forEach( (item,i) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[i] =  res.currentVersion!
        }
      })
      return res
    },
    _updateConfigStatus( state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentVersion?.gitList.forEach( git => {
        git.configList.forEach( config => {
          if (config.id == payload.id) {
            config.isHidden = payload.status
          }
        })
      })
      res.templateInfo?.versionList.forEach( (item,i) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[i] =  res.currentVersion!
        }
      })
      return res
    },
    _updateConfigGlobalConfig(state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentVersion?.gitList.forEach( git => {
        git.configList.forEach( config => {
          if (config.id == payload.id) {
            config.globalConfigId = payload.globalConfigId
          }
        })
      })
      res.templateInfo?.versionList.forEach( (item,i) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[i] =  res.currentVersion!
        }
      })
      return res
    },
    _updateConfig(state, {payload}): TemplateModelState {
      const res = util.clone(state)!
      res.currentVersion?.gitList.forEach( git => {
        git.configList.forEach( (config, i) => {
          if( config.id = payload.id) {
            git.configList[i] = payload
          }
        })
      })
      res.templateInfo?.versionList.forEach( (item,i) => {
        if (item.id == res.currentVersion!.id) {
          res.templateInfo!.versionList[i] =  res.currentVersion!
        }
      })
      return res
    }
  }
}

export default TemplateModel