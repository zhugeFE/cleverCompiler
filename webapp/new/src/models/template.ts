/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-04 15:55:58
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-16 17:54:31
 */

import { Effect, Reducer } from '@/.umi/plugin-dva/connect';
import templateService from '@/services/template';
import { Version } from './common';


export interface TemplateInstance {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createTime: string;
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
  git_source_id: string; //git源id
  git_source_version_id: string; //git源版本
}

export interface TemplateVersionGit {
  id: string; //id
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  git_source_id: string; //git来源id
  git_source_version_id: string; //git版本来源id
  name: string; //git来源名称
  configList: ConfigInstance[]; //配置项
}

export interface ConfigInstance {
  id: string; 
  value: string; //配置项默认值
  isHidden: number; //是否隐藏
  globalConfigId: string; //全局配置id
  typeId: number; // 类型名称
  desc: string; // 描述信息
  reg: string; // 正则表达式
  filePath: string; // 原始文件路径
  sourceValue: string; //源默认值
}

export interface TemplateConfig {
  id: string;
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  templateVersionGitId: string; //模板版本中git项id
  gitSourceConfigId: string; //模板版本中git项的配置项id
  value: string; //配置项默认值
  isHidden: number; //是否隐藏
  globalConfigId: string; //全局配置id
}

export interface UpdateTemplateVersion {
  id: string; //模板版本id
  readmeDoc: string; //介绍文档
  buildDoc: string; //部署文档
  updateDoc: string; //更新文档
}

export interface TemplateGlobalConfig {
  id: string; 
  name: string;
  desc: string;
  templateId: string; //模板id
  templateVersionId: string;//模板版本id
  defaultValue: string;//默认值
  isHidden: number; //是否隐藏配置项
}

export interface CreateTemplateGlobalConfigParams {
  name: string; //名称
  defaultValue: string; //默认值
  desc: string; //描述
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
}


export interface TextConfigParam {
  name: string;
  filePath: string;
  reg: {
    source: string;
    global: boolean;
    ignoreCase: boolean;
  };
  value: string;
  desc: string;
}



export type TemplateModelState = {
  templateList: TemplateInstance[]
}


export type TemplateModelType = {
  namespace: 'template';
  state: TemplateModelState;
  effects: {
    query: Effect;
    getInfo: Effect;
    createTemplate: Effect;
    updateTemplate: Effect;
    addVersion: Effect;
    updateVersion: Effect;
    delVersion: Effect;
    addVersionGit: Effect;
    delVersionGit: Effect;
    updateConfig: Effect;
    // delConfig: Effect;
    addComConfig: Effect;
    updateComConfig: Effect;
    delComConfig: Effect;
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
      console.log(res.data)
      yield put({
        type: "setList",
        payload: res.data
      })
    },
    *getInfo ({payload , callback}, {call}) {
      const res = yield call(templateService.getInfo, payload as string)
      if (res.status === -1) return
      callback(res.data)
    },
    *createTemplate ({payload, callback}, {call}) {
      const res = yield call(templateService.createTemplate, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateTemplate ({payload,callback}, {call}) {
      const res = yield call(templateService.updateTemplateStatus, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *addVersion ({payload,callback},{call}){
      const res = yield call(templateService.addVersion, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateVersion ({payload, callback},{call}){
      const res = yield call(templateService.updateVersion, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *delVersion ({payload, callback}, {call}){
      const res = yield call(templateService.delVersion, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *addVersionGit({payload,callback},{call}){
      const res = yield call(templateService.addVersionGit, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *delVersionGit ({payload, callback}, {call}){
      const res = yield call(templateService.delVersionGit, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateConfig ({payload,callback},{call}){
      const res = yield call(templateService.updateConfig, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    // *delConfig ({payload,callback},{call}){
    //   const res = yield call(templateService.delConfig, payload)
    //   if (res.status === -1) return
    //   if (callback) callback(res.data)
    // },
    *addComConfig ({payload,callback},{call}){
      const res = yield call(templateService.addComConfig, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateComConfig ({payload, callback}, {call}) {
      const res = yield call(templateService.updateComConfig, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *delComConfig ({payload, callback}, {call}) {
      const res = yield call(templateService.delComConfig, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    }
  },
  reducers: {
    setList (state, {payload}) {
      return {
        ...state,
        templateList: payload
      }
    }   
  }
}

export default TemplateModel