import {Router} from 'express'
const router = Router()

router.get('/status', (req, res) => {
  res.send('query system status')
})

export default router