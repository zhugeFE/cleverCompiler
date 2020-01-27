import sys from './sys'
import user from './user'
import { Router } from 'express';
const router = Router()

router.use('/sys', sys)
router.use('/user', user)
export default router