import * as express from 'express'
import config from './config'
import api from './controller/index'
import './dao/pool'
import auth from './middleware/auth'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
import errorHandle from './middleware/errorHandle'
import sys from './middleware/sys'
import { v4 as uuidv4 } from 'uuid'
import logger from './utils/logger'
import notFound from './middleware/notFound'

const app = express()
app.use(session({
  genid () {
    return uuidv4()
  },
  secret: 'compile'
}))
app.use(auth)
app.use(sys)
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/api', api)
app.use(errorHandle)
app.use(notFound)

app.listen(config.port, () => {
  logger.info(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
})