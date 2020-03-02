// import Axios from 'axios'
import * as _ from 'lodash'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import history from './history';

export enum ResponseStatus {
  success = 200,
  fail = 500,
  sysNotInit,
  sysInited
}
/**
 * 接口返回json统一结构
 */
export interface ApiResult{
  status: ResponseStatus,
  data: object | null,
  msg?: string
}

export default function (options: AxiosRequestConfig): Promise<any> {
  return new Promise((resolve, reject) => {
    axios(options)
    .then((res: AxiosResponse<ApiResult>) => {
      let err = new Error()
      switch (res.data.status) {
        case ResponseStatus.success:
          resolve(res.data)
          break
        case ResponseStatus.fail:
          err.message = res.data.msg
          throw err
        case ResponseStatus.sysNotInit:
          history.push('/init')
          break
        case ResponseStatus.sysInited:
          err.message = res.data.msg
          throw err
      }
      console.log(res)
    })
    .catch((e: Error) => {
      reject(e)
    })
  })
}