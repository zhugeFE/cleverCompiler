/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 15:40:34
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-13 00:49:20
 */

import { Effect } from "@/.umi/plugin-dva/connect"
import { Reducer } from "redux"
import compileService from "@/services/compile"


export interface ProjectCompile {
  id: string; //编译id
  compileTime: Date; //编译时间
  compileUser: string; //编译者id
  compileResult: string; //编译结果
  projectId: string; //项目id
  description: string; //编译描述
}

export interface CompileParam {
  compileUser: string; //编译者id
  compileResult: string; //编译结果
  projectId: string; //项目id
  description: string; //编译描述
}



export type CompileModelState = {
  compileList: ProjectCompile[] | null;
  compileInfo: ProjectCompile | null ;
}


export type CompileModelType = {
  namespace: 'compile';
  state: CompileModelState;
  effects: {
    getCompileList: Effect;
    getCompileInfo: Effect;
    addCompile: Effect;
    updateCompile: Effect;
  };
  reducers: {
    setCompileList: Reducer<CompileModelState>;
    setCompileInfo: Reducer<CompileModelState>;
  };
}

const CompileModel: CompileModelType = {
  namespace: 'compile',
  state: {
    compileList: [],
    compileInfo: null 
  },
  effects: {
    *getCompileList (_ , {put , call}){
      const res = yield call(compileService.compileList)
      if (res.status === -1)return
      yield put({
        type: "setCompileList",
        payload: res.data
      })
    },
    *addCompile ({payload, callback}, {call}) {
      const res = yield call(compileService.addCompile, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *getCompileInfo ({payload}, {put , call}) {
      // const res = yield call(compileService.getInfo, payload as string)
      // if (res.status === -1) return
      // res.data.currentVersion = res.data.versionList[0] || {}
      // yield put({
      //   type: "setTemplateInfo",
      //   payload: res.data
      // })
    },
    *updateCompile ({payload}, {put ,call}) {
      // const res = yield call(compileService.updateTemplateStatus, payload)
      // if (res.status === -1) return
      // yield put({
      //   type: "setTemplateInfo",
      //   payload: res.data
      // })
    },

  },
  reducers: {
    setCompileList (state, {payload}): CompileModelState {
      return {
        compileList: payload,
        compileInfo: null
      }
    },
    setCompileInfo (state , {payload}): CompileModelState {
      return {
        compileList: state?.compileList || [],
        compileInfo: payload || {}
      }
    }
  }
}

export default CompileModel