import {Router} from 'express'
import sysService from '../service/sys'
const router = Router()

router.get('/status', async (req, res) => {
  const result = await sysService.getStatus()
  res.json(result)
})
router.post('/init', async (req, res) => {
  console.log('>>>>>>', req.body)
  const result = await sysService.init(req.body)
  res.json(result)
})
export default router