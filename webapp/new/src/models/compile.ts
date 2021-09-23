/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 15:40:34
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-21 17:19:29
 */

import { Effect } from "@/.umi/plugin-dva/connect"
import { Reducer } from "redux"
import compileService from "@/services/compile"




export interface CompileParam {
  compileUser: string; //编译者id
  compileResult: string; //编译结果
  projectId: string; //项目id
  description: string; //编译描述
}



export type CompileModelState = {
}


export type CompileModelType = {
  namespace: 'compile';
  state: CompileModelState;
  effects: {
    addCompile: Effect;
  };
  reducers: {
  };
}

const CompileModel: CompileModelType = {
  namespace: 'compile',
  state: {
  },
  effects: {
    *addCompile ({payload, callback}, {call}) {
      const res = yield call(compileService.addCompile, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    }

  },
  reducers: {
    
  }
}

export default CompileModel