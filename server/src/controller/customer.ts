/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 17:12:23
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-26 09:06:24
 */
import {Router, Response, Request, NextFunction} from 'express'
import { ApiResult, ResponseStatus } from '../types/apiResult'
import CustomerSerive from "../service/customer"
import { AddCustomerParams, ProjectCustomer } from '../types/customer'

const router = Router()


//客户信息添加
router.post('/add', (req: Request, res: Response, next: NextFunction) => {
  const param =  req.body as {
    name: string; 
    description: string;
  }
  CustomerSerive.addCustomer({creatorId: req.session.currentUser.id, ...param} as AddCustomerParams)
  .then((customer: ProjectCustomer) => {
    res.json(new ApiResult(ResponseStatus.success, customer))
  })
  .catch(next)
})

//客户信息列表
router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  CustomerSerive.customerList()
  .then((customerList: ProjectCustomer[]) => {
    res.json(new ApiResult(ResponseStatus.success, customerList))
  }) 
  .catch(next)
})

//客户信息更改
router.post('/update', (req: Request, res: Response, next: NextFunction) => {
  const customer = req.body as ProjectCustomer
  if( !customer.id ){
    res.json(new ApiResult(ResponseStatus.fail, null , "客户id不能为空！"))
    return
  }
  CustomerSerive.updateCustomer(customer)
  .then(() => {
    res.json(new ApiResult(ResponseStatus.success))
  })
  .catch(next)
})

// 客户详细信息待完成
router.post('/:id/info', (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
})

export default router