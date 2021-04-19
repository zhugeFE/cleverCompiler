/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, RequestOptionsInit } from 'umi-request';
import { notification } from 'antd';
import util from './utils';
import history from './history'
 
 enum ResponseStatus {
   success = 200,
   exists = 201,
   fail = 500,
   sysNotInit,
   sysInited,
   notLoggin,
   paramError
 }
 
 export interface InterfaceApiResult<T> {
   status: ResponseStatus,
   data?: T,
   msg?: string
 }
 /**
  * 接口返回json统一结构
  */
 class ApiResult<T> implements InterfaceApiResult<T>{
   status: ResponseStatus
 
   data?: T
 
   msg?: string
 
   constructor (status: ResponseStatus, data: any, message?: string) {
     this.status = status
     this.data = data
     this.msg = message
   }
 
 }
 const codeMessage = {
   200: '服务器成功返回请求的数据。',
   201: '新建或修改数据成功。',
   202: '一个请求已经进入后台排队（异步任务）。',
   204: '删除数据成功。',
   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
   401: '用户没有权限（令牌、用户名、密码错误）。',
   403: '用户得到授权，但是访问是被禁止的。',
   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
   406: '请求的格式不可得。',
   410: '请求的资源被永久删除，且不会再得到的。',
   422: '当创建一个对象时，发生一个验证错误。',
   500: '服务器发生错误，请检查服务器。',
   502: '网关错误。',
   503: '服务不可用，服务器暂时过载或维护。',
   504: '网关超时。',
 };
 
 /**
  * 异常处理程序
  */
 const errorHandler = (error: { response: Response }): Response => {
   const { response } = error;
   if (response && response.status) {
     const errorText = codeMessage[response.status] || response.statusText;
     const { status, url } = response;
 
     notification.error({
       message: `请求错误 ${status}: ${url}`,
       description: errorText,
     });
   } else if (!response) {
     notification.error({
       description: '您的网络发生异常，无法连接服务器',
       message: '网络异常',
     });
   }
   return response;
 };
 
 /**
  * 异常处理程序
  */
 function responseErrorHandler<T> (apiResult: ApiResult<T>): ApiResult<T> {
   if (!apiResult.status) {
     notification.error({
       message: `接口响应结构异常`
     });
     throw new Error('接口响应结构异常，缺少status')
   }
   let flag = false
   let message = '接口请求失败'
   switch(apiResult.status) {
    case ResponseStatus.sysNotInit:
      history.push('/init')
      message = '系统未初始化'
      break
     case ResponseStatus.sysInited:
       message = '系统已初始化'
       break;
     case ResponseStatus.notLoggin:
       message = '账户未登录或登录已失效'
       break;
     case ResponseStatus.paramError:
       message = '请求参数错误'
       break;
     case ResponseStatus.exists:
       message = '数据已存在'
       break
     case ResponseStatus.success:
       flag = true
       break
     case ResponseStatus.fail:
       message = apiResult.msg || '接口发生未知错误'
       break
     default:
       throw new Error(`无法识别的请求响应码: ${apiResult.status}`)
   }
   if (!flag) {
     message = apiResult.msg || message
     notification.error({
       message: `请求错误`,
       description: message,
     });
     throw new Error(message)
   }
   return apiResult
 };
 /**
  * 配置request请求时的默认参数
  */
 const req = extend({
   errorHandler, // 默认错误处理
   credentials: 'include', // 默认请求是否带上cookie
 });
 
 async function request<T> (url: string, options?: RequestOptionsInit): Promise<InterfaceApiResult<T>> {
   try {
     if (/{{\S*}}/.test(url)) {
       if (!options || !options.params) {
         const err = new Error(`带参URL(${url})请求中，缺少params参数`)
         throw err
       }
       const option: RequestOptionsInit = options!
       const list = url.match(/{{\S*?}}/g) || []
       list.forEach(param => {
         const key = param.replace(/[{|}]/g, '')
         // eslint-disable-next-line no-param-reassign
         url = url.replace(param, option.params![key])
         delete option.params![key]
       })
     }
     const res = await req(url, util.mergeObject({
       prefix: '/api'
     }, options || {}))
     return responseErrorHandler<T>(res)
   } catch (e) {
     return {
       status: -1
     }
   }
 }
 export default request;
 