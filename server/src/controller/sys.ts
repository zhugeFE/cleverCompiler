import {Router} from 'express'
import sysService from '../service/sys'
const router = Router()

router.get('/status', async (req, res) => {
  const result = await sysService.getStatus()
  res.json(result)
})

export default router