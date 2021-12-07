import { download } from '@/utils/download';
/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-04 15:55:58
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-07 14:19:33
 */

import { Effect, Reducer } from '@/.umi/plugin-dva/connect';
import templateService from '@/services/template';
import util from '@/utils/utils';
import { Version, publicType } from './common';



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
      if (callback) callback(res.data)
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
    *addVersion ({payload, callback},{call}){
      const res = yield call(templateService.addVersion, payload)
      if (res.status === -1) return
      if(callback) callback(res.data)
    },
    *updateTemplateVersionStatus ({payload, callback}, {call}) {
      const res = yield call(templateService.updateTemplateVersionStatus, payload)
      if (res.status === -1) return
      if (callback) callback()
    },
    *updateVersion ({payload, callback},{call}){
      const res = yield call(templateService.updateVersion, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *deleteVersion ({payload, callback}, {call}){
      const res = yield call(templateService.delVersion, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *addVersionGit({payload, callback},{call}){
      const res = yield call(templateService.addVersionGit, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *changeGitVersion({payload, callback}, {call}) {
      const res = yield call(templateService.changeGitVersion, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *delVersionGit ({payload,callback}, {call}){
      const res = yield call(templateService.delVersionGit, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },

    *updateConfig ({payload,callback},{call}){
      const res = yield call(templateService.updateConfig, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateConfigStatus ({payload, callback}, {call} ) {
      const res = yield call(templateService.updateConfigStatus, payload)
      if (res.status === -1) return
      if (callback) callback()
    },
    *updateConfigGlobalConfig ({payload, callback}, {call}) {
      const res = yield call(templateService.updateConfigGlobalConfig, payload)
      if (res.status === -1) return
      if (callback) callback()
    },
    *addGlobalConfig ({payload,callback},{call}){
      const res = yield call(templateService.addGlobalConfig, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateGlobalConfig ({payload, callback}, {call}) {
      const res = yield call(templateService.updateGlobalConfig, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateGlobalConfigStatus ({payload, callback}, {call} ) {
      const res = yield call(templateService.updateGlobalConfigStatus, payload)
      if (res.status === -1) return
      if (callback) callback()
    },
    *delGlobalConfig ({payload, callback}, {call}) {
      const res = yield call(templateService.delGlobalConfig, payload)
      if (res.status === -1) return
      if (callback) callback()
    }
  },
  reducers: {
    setList (state, {payload}): TemplateModelState {
      return {
        ...state,
        templateList: payload,      }
    }
  }
}

export default TemplateModel