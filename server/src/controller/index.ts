/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-15 16:06:04
 */
import sys from './sys'
import user from './user'
import git from './git'
import template from './template'
import compile from './compile'
import project from './project'
import customer from './customer'
import download from './download'
import { Router } from 'express'
const router = Router()

router.use('/sys', sys)
router.use('/user', user)
router.use('/git', git)
router.use('/template', template)
router.use('/compile', compile)
router.use('/project', project)
router.use('/customer', customer)
router.use('/download', download)
export default router