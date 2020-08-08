import sys from './sys'
import user from './user'
import git from './git'
import template from './template'
import { Router } from 'express'
const router = Router()

router.use('/sys', sys)
router.use('/user', user)
router.use('/git', git)
router.use('/template', template)
export default router