/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-28 18:20:56
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
import Socket from "./controller/socket";
import * as cookieParser from 'cookie-parser';
import * as ConnectRedis from 'connect-redis';
import redisClient from './utils/redis';
( async (): Promise<void> => {

  const app = express() 
  const client = await redisClient.getClient(config.redis.default)

  // 跨域设置
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', req.method)//设置方法
    if (req.method === 'OPTIONS') {
      logger.info('got request in cross origin(OPTIONS): ', req.path)
      res.sendStatus(204) // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
    } else {
      logger.info('got request in cross origin: ', req.path)
      next()
    }
  })

  app.use(cookieParser())
  const RedisStore = ConnectRedis(session)

  app.use(session({
    store: new RedisStore({
      client: client.client,
    }),
    genid () {
      return uuidv4()
    },
    secret: 'compile'
  }))

  app.use(sys)
  app.use(auth)
  app.use(bodyParser.urlencoded())
  app.use(bodyParser.json())

  app.use('/api', api)
  app.use(errorHandle)
  app.use(notFound)


  const server = Socket.createSocket(app)

  server.listen(config.port, () => {
    logger.info(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
  })
  
})()