import axios from 'axios'
import util from './util'

const resCode = {
  SUCCESS: 10001,
  LOGIN_ERROR: 10002,
  NOT_LOGIN: -10002,
  ERROR: -1
}
var CancelToken = axios.CancelToken
var preQueryOption
var cancel

function resCodeFilter (res) {
  let flag = false
  switch (res.data.code) {
    case resCode.ERROR:
      flag = false
      break
    case resCode.NOT_LOGIN:
      flag = 'break'
      location.href = `/#/login`
      break
    case resCode.LOGIN_ERROR:
      flag = false
      break
    case resCode.SUCCESS:
      flag = true
      break
    default:
      console.error('未识别的状态码', res.data.code)
  }
  return flag
}

function checkRequestCode (code) {
  return /^2\d+/.test(code)
}

export default function (option) {
  option = util.mergeObject({
    method: 'post',
    url: '',
    data: null,
    withCredentials: true,
    transformRequest (params) {
      var arr = []
      for (let key in params) {
        arr.push(`${key}=${params[key]}`)
      }
      return arr.join('&')
    }
  }, option)
  if (preQueryOption) delete preQueryOption['cancelToken']
  if (util.isEqual(option, preQueryOption)) {
    cancel()
  }
  option.cancelToken = new CancelToken(function (c) {
    cancel = c
  })
  return new Promise((resolve, reject) => {
    preQueryOption = option
    axios(option).then((res) => {
      let flag = resCodeFilter(res)
      if (flag === 'break') {
        // nothing
      } else if (checkRequestCode(res.status) && flag) {
        resolve(res.data)
      } else {
        throw new Error(JSON.stringify({
          message: '请求状态或接口状态码错误',
          request: res.request.responseURL,
          response: res.data
        }))
      }
    }).catch((error) => {
      if (axios.isCancel(error)) return
      reject(error)
      console.error(error)
    })
  })
}
