import sys from './sys'
import { Router } from 'express';
const router = Router()

router.use('/sys', sys)

export default router