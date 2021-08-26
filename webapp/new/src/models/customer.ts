/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 18:38:06
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-25 18:54:50
 */

import { Effect } from "@/.umi/plugin-dva/connect"
import { Reducer } from "redux"
import customerService from "@/services/customer"

export interface Customer {
  id: string; //客户id
  name: string; // 客户名称
  description: string; //客户描述
  projectId: string; //项目id
  creatorId: string; //创建者id
  creatorName: string; //创建者名称
}

export interface AddCustomerParams {
  projectId: any;
  name: string; //客户名称
  description: string; //客户描述
  creatorId: string; //创建者id
}



export type CustomerModelState = {
  customerList: Customer[] | null;
}


export type CustomerModelType = {
  namespace: 'customer';
  state: CustomerModelState;
  effects: {
    addCustomer: Effect;
    updateCustomer: Effect;
    getCustomerInfo: Effect;
    getCustomerList: Effect;
  };
  reducers: {
    setCustomerList: Reducer<CustomerModelState>;
  };
}

const CustomerModel: CustomerModelType = {
  namespace: 'customer',
  state: {
    customerList: [],
  },
  effects: {
    *getCustomerList (_ , {put , call}){
      const res = yield call(customerService.queryTemplateList)
      if (res.status === -1)return
      yield put({
        type: "setList",
        payload: res.data
      })
    },
    *getCustomerInfo ({payload}, {put , call}) {
      const res = yield call(customerService.getInfo, payload as string)
      if (res.status === -1) return
      res.data.currentVersion = res.data.versionList[0] || {}
      yield put({
        type: "setTemplateInfo",
        payload: res.data
      })
    },
    *addCustomer ({payload, callback}, {call}) {
      const res = yield call(customerService.createTemplate, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *updateCustomer ({payload}, {put ,call}) {
      const res = yield call(customerService.updateTemplateStatus, payload)
      if (res.status === -1) return
      yield put({
        type: "setTemplateInfo",
        payload: res.data
      })
    },

  },
  reducers: {
    setCustomerList (state, {payload}): CustomerModelState {
      return {
        customerList: payload,
      }
    }
  }
}

export default CustomerModel
