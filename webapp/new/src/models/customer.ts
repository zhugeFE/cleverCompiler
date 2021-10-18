/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 18:38:06
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-18 18:21:34
 */

import { Effect } from "@/.umi/plugin-dva/connect"
import { Reducer } from "redux"
import customerService from "@/services/customer"
import util from "@/utils/utils"

export interface Customer {
  id: string; //客户id
  name: string; // 客户名称
  description: string; //客户描述
  projectId: string; //项目id
  tel: string; //联系方式
  creatorId: string; //创建者id
  creatorName?: string; //创建者名称
}

export interface AddCustomerParams {
  name: string; //客户名称
  tel: string; //联系方式
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
    deleteCustomer: Effect;
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
      const res = yield call(customerService.customerList)
      if (res.status === -1)return
      yield put({
        type: "setCustomerList",
        payload: res.data
      })
    },
    *getCustomerInfo ({payload}, {put , call}) {
      const res = yield call(customerService.customerInfo, payload as string)
      if (res.status === -1) return
      res.data.currentVersion = res.data.versionList[0] || {}
      yield put({
        type: "setcustomerInfo",
        payload: res.data
      })
    },
    *addCustomer ({payload, callback}, {select, put, call}) {
      const res = yield call(customerService.addCustomer, payload)
      if (res.status === -1) return
      const data = util.clone(yield select((_: { customer: { customerList: Customer[]; }; }) => _.customer.customerList));
      data.push( res.data )
      yield put ({
        type: "setCustomerList",
        payload: data
      })
      if (callback) callback(res.data)
    },
    *updateCustomer ({payload, callback}, {select, put ,call}) {
      const res = yield call(customerService.updataCustomer, payload)
      if (res.status === -1) return
      const data: Customer[] = util.clone(yield select((_: {customer: { customerList: Customer[]; }; }) => _.customer.customerList));
      data.map( (item, index) => {
        if( item.id === payload.id) {
          item.description = payload.description
        }
      })
      yield put({
        type: "setCustomerList",
        payload: data
      })
      if (callback) callback()
    },
    *deleteCustomer ({payload, callback}, {select, call, put}) {
      const res = yield call(customerService.deleteCustomer, payload)
      if (res.status == -1) return
      const data: Customer[] = util.clone(yield select((_: {customer: { customerList: Customer[]; }; }) => _.customer.customerList));
      yield put({
        type: "setCustomerList",
        payload: data.filter( (item, index) => item.id !== payload)
      })
      if (callback) callback() 
    }
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
