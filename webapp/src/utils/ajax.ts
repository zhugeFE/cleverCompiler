// import Axios from 'axios'
import * as _ from 'lodash'
import { ApiResult } from '../types/ajax';
import axios, { AxiosRequestConfig } from 'axios'

export default function (options: AxiosRequestConfig): Promise<any> {
  return new Promise((resolve, reject) => {
    axios(options)
    .then((res: ApiResult) => {
      resolve(res)
    })
    .catch((e: Error) => {
      reject(e)
    })
  })
}