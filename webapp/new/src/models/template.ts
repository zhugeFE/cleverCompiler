/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-04 15:55:58
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-06 18:25:40
 */

import { Effect, Reducer } from '@/.umi/plugin-dva/connect';
import templateService from '@/services/template';


export interface TemplateInstance {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createTime: string;
  enable: number;
}

export interface TemplateCreateParam {
  name: string; //模板名称
  description: string; //模板描述
}


export interface Template {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createTime: Date;
}



export type TemplateModelState = {
  templateList: TemplateInstance[]
}


export type TemplateModelType = {
  namespace: 'template';
  state: TemplateModelState;
  effects: {
    query: Effect;
    createTemplate: Effect;
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
    *createTemplate ({payload, callback}, {call}) {
      const res = yield call(templateService.createTemplate, payload)
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