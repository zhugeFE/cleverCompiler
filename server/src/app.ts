/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-01 22:41:02
 */
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
import * as HTTP from "http"
import * as SOCKET from 'socket.io'
import Compile from "./utils/compile"


const app = express()
const http = HTTP.createServer(app)
const io =  new SOCKET.Server(http)

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

io.on('connect', (socket) => {
  logger.info("socket 连接成功")
  logger.info(socket.data)
  Compile.start(socket)
})