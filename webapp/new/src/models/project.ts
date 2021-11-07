import { enable } from '@umijs/deps/compiled/signale';
/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 18:37:57
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-07 11:17:17
 */

import { Effect, TemplateGlobalConfig, TemplateVersionGit } from "@/.umi/plugin-dva/connect"
import { Reducer } from "redux"
import projectService from "@/services/project"
import compileService from "@/services/compile"


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
  enable: number;
}

export interface ProjectInfo {
  id: string; //项目id
  name: string; //项目名称
  description: string; //描述
  templateId: string; // 项目来源模板id
  templateVersion: string; //项目来源模板版本id
  compileType: number; //编译类型 0私有部署 1常规迭代 2发布测试
  createTime: Date; //创建时间
  gitList: TemplateVersionGit[] // git
  shareNumber: string; //分享成员
  customer: string; //客户id
  globalConfigList: ProjectConfig[];//全局配置
  enable: number;
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
  shareNumber: string[];
  description: string; //描述
  customer: string;
}


export interface CreateConfigParams {
  configId: string; //模板版本配置id
  projectId: string; //项目id
  value: string; //默认值
}

export interface ProjectConfig {
  id: string; //项目配置id
  configId: string; //模板版本配置id
  projectId: string; //项目id
  value: string; //默认值
}

export interface Member {
  id: string;
  name: string;
}

export interface ProjectShare {
  id: string; //项目分享id
  receiveUserId: string; //接收者id
  userId: string; //分享者id
  projectId: string; //项目id
}

export interface CreateShareProject {
  projectId: string; //项目id
  userId: string; //分享者id
  receiverUserId?: string; //被分享者id
  receiverUserIds?: string[]; //被分享者id数组
}


export type ProjectModelState = {
  projectList: ProjectInstance[];
  projectInfo: ProjectInfo | null ;
  memberList: Member[] ;
  compileInfo: ProjectCompile[] | null;
}


export type ProjectModelType = {
  namespace: 'project';
  state: ProjectModelState;
  effects: {
    getProjectList: Effect;
    getProjectInfo: Effect;
    addProject: Effect;
    updateProject: Effect;
    getMemberList: Effect;
    getCompileInfo: Effect;
  };
  reducers: {
    setProjectList: Reducer<ProjectModelState>;
    setProjectInfo: Reducer<ProjectModelState>;
    setMemberList: Reducer<ProjectModelState>;
    setCompileInfo: Reducer<ProjectModelState>;
  };
}

const ProjectModel: ProjectModelType = {
  namespace: 'project',
  state: {
    projectList: [],
    projectInfo: null,
    memberList: [],
    compileInfo: [],
  },
  effects: {
    *getCompileInfo ( { payload, callback} , {put , call}){
      const res = yield call(projectService.compileInfo, payload)
      console.log(res)
      if (res.status === -1)return
      yield put({
        type: "setCompileInfo",
        payload: res.data
      })
      if (callback) callback()
    },
    *getMemberList (_, {put, call}){
      const res = yield call(projectService.memberList)
      if (res.status === -1)return
      yield put({
        type: "setMemberList",
        payload: res.data
      })
    },
    *getProjectList (_ , {put , call}){
      const res = yield call(projectService.projectList)
      if (res.status === -1)return
      yield put({
        type: "setProjectList",
        payload: res.data
      })
    },
    *getProjectInfo ({payload, callback}, {put , call}) {
      const res = yield call(projectService.projectInfo, payload as string)
      if (res.status === -1) return
      yield put({
        type: "setProjectInfo",
        payload: res.data
      })
      if (callback) callback(res.data)
    },
    *addProject ({payload, callback}, {call}) {
      const res = yield call(projectService.addProject, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateProject ({payload}, {put ,call}) {
      const res = yield call(projectService.updateProject, payload)
      if (res.status === -1) return
      yield put({
        type: "setProjectInfo",
        payload: res.data
      })
    },

  },
  reducers: {
    setCompileInfo (state , {payload}): ProjectModelState {
      return {
        projectInfo: state?.projectInfo || null,
        compileInfo: payload,
        projectList: state?.projectList || [],
        memberList: state?.memberList || []
      }
    },
    setProjectList (state, {payload}): ProjectModelState {
      return {
        projectList: payload,
        projectInfo: state?.projectInfo || null,
        memberList: state?.memberList || [],
        compileInfo: state?.compileInfo || null
      }
    },
    setProjectInfo (state, {payload}): ProjectModelState {
      return {
        projectList: state?.projectList || [],
        projectInfo: payload,
        memberList: state?.memberList || [],
        compileInfo: state?.compileInfo || null
      }
    },
    setMemberList (state, {payload}): ProjectModelState {
      return {
        projectInfo: state?.projectInfo || null,
        projectList: state?.projectList || [],
        memberList: payload,
        compileInfo: state?.compileInfo || null
      } 
    }
  }
}

export default ProjectModel