import { publicType } from './common';
/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 18:37:57
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-06 14:17:46
 */

import { Effect, TemplateGlobalConfig, TemplateVersionGit } from "@/.umi/plugin-dva/connect"
import { Reducer } from "redux"
import projectService from "@/services/project"


export interface ProjectCompile {
  id: string; //编译id
  compileTime: Date; //编译时间
  compileUser: string; //编译者id
  compileResult: string; //编译结果
  projectId: string; //项目id
  description: string; //编译描述
  projectName: string; //项目名称
  projectDesc: string; //项目描述
  cusName: string; // 客户名称
  file: string; 
}

export interface ProjectInstance {
  id: string; //项目id
  name: string; //项目名称
  description: string; //描述
  compileType: number; //编译类型
  lastCompileTime: string; //上次编译时间
  lastCompileResult: number; // 上次编译结果
  lastCompileUser: string; //上次编译人
  createTime: Date; //创建时间
  creatorId: string;
  receiveUserId: string;
  enable: number;
  templateId: string;
  templateVersion: string;
}

export interface ProjectInfo {
  id: string; //项目id
  name: string; //项目名称
  description: string; //描述
  templateId: string; // 项目来源模板id
  templateVersion: string; //项目来源模板版本id
  compileType: number; //编译类型 0私有部署 1常规迭代 2发布测试
  publicType: number;
  createTime: Date; //创建时间
  gitList: TemplateVersionGit[] // git
  creatorId: string;
  shareMember: string; //分享成员
  customer: string; //客户id
  globalConfigList: TemplateGlobalConfig[];//全局配置
}

export interface ProjectCompileGitParams {
  id: string;
  name: string;
}


export interface ProjectCompileParams {
  id: string;
  name: string;
  publicType: number;
  gitList: ProjectCompileGitParams[];
}

export interface Project {
  id: string; // 项目id
  name: string; // 项目名称
  templateId: string; // 项目来源模板id
  templateVersion: string; //项目来源模板版本id
  compileType: number; //编译类型 0私有部署 1常规迭代 2发布测试
  publishType: number; //发布方式 0发布到git 1下载  2自动
  description: string; //项目描述
  createTime: Date; //创建时间
  enable: number;
}


export interface CreateProjectParams {
  name: string; //名称
  templateId: string; //模板id
  templateVersionId: string; //模板版本id
  compileType: number; //编译类型 0私有部署 1常规迭代 2发布测试
  publicType: number; //发布方式 0发布到git 1下载 2自动
  configList: TemplateGlobalConfig[];
  gitList: TemplateVersionGit[];
  shareMember: string[];
  description: string; //描述
  customer: string;
}

export interface Member {
  id: string;
  name: string;
}



export type ProjectModelState = {
  projectList: ProjectInstance[];
}


export type ProjectModelType = {
  namespace: 'project';
  state: ProjectModelState;
  effects: {
    getCompileParams: Effect;
    getProjectList: Effect;
    getProjectInfo: Effect;
    addProject: Effect;
    updateProject: Effect;
    getMemberList: Effect;
    getCompileInfo: Effect;
  };
  reducers: {
    setProjectList: Reducer<ProjectModelState>;
  };
}

const ProjectModel: ProjectModelType = {
  namespace: 'project',
  state: {
    projectList: []
  },
  effects: {
    *getCompileInfo ( { payload, callback} , {put , call}){
      const res = yield call(projectService.compileInfo, payload)
      if (res.status === -1)return
      if (callback) callback(res.data)
    },
    *getCompileParams ( {_, callback}, {call}) {
      const res = yield call(projectService.compileParamInfo)
      if (res.status === -1)return
      if (callback) callback(res.data)
    },
    *getMemberList ( {callback}, {put, call}){
      const res = yield call(projectService.memberList)
      if (res.status === -1)return
      if (callback) callback(res.data)
    },
    *getProjectList (_ , {put , call}){
      const res = yield call(projectService.projectList)
      if (res.status === -1)return
      yield put({
        type: "setProjectList",
        payload: res.data
      })
    },
    *getProjectInfo ({payload, callback}, {call}) {
      const res = yield call(projectService.projectInfo, payload as string)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *addProject ({payload, callback}, {call}) {
      const res = yield call(projectService.addProject, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateProject ({payload, callback}, {call}) {
      const res = yield call(projectService.updateProject, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    }
  },
  reducers: {
    setProjectList (state, {payload}): ProjectModelState {
      return {
        ...state,
        projectList: payload
      }
    }
  }
}

export default ProjectModel