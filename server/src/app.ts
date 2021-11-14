/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-14 08:36:55
 */
import { CompileConfig } from './types/compile';
import * as express from 'express'
import config from './config'
import * as path from 'path';
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
import Compile from "./utils/compile"
import ProjectService from "./service/project"
import http = require('http')
import Socket = require('socket.io')
import * as cookieParser from 'cookie-parser';
import * as ConnectRedis from 'connect-redis';
import redisClient from './utils/redis';
import { ProjectInfo } from './types/project'
import CompileDao from './dao/compile';
import { ProjectCompile, CompileParam } from './types/compile';
import util from './utils/util';
import { CompileGitParams } from './types/git';
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
  app.use('/static', express.static(path.join(__dirname + '/www/download')))


  logger.info('socket服务开始初始化');
  
  const server = http.createServer(app)
  const io =  new Socket.Server(server,{transports:["websocket"]})

  io.on('connect', socket => {

    socket.on("startCompile", async (ctx) => {
      
     
      const compileInfo: ProjectInfo = await ProjectService.projectCompileInfo(ctx.projectId)
      const compileInfoBack = compileInfo
      const GitInfo: CompileGitParams[] = await ProjectService.getCompileGitData(ctx['gitIds'])

      const publicType = ctx.publicType //发布类型
      const CompileList: CompileConfig[] = []
      

      const GlobalConfigMap = {}
      compileInfo.globalConfigList.map( item => GlobalConfigMap[item.id] = item.targetValue)


      compileInfo.gitList.map(git => {
        git.configList.map( config => {
          if (config.globalConfigId) {
            config.targetValue = GlobalConfigMap[config.globalConfigId]
          }
        })
      })


      GitInfo.map ( git => {

        CompileList.push({
          userId: ctx.userId,
          gitName: git.name,
          gitSsh: git.ssh,
          gitValue: git.gitValue,
          gitType: git.gitType,
          compileOrders: JSON.parse(git.compileOrders),
          configList: compileInfo.gitList.filter(item => item.id == git.id)[0].configList,
          compileType: compileInfo.compileType,
          templateId: compileInfo.templateId,
          templateVersionId: compileInfo.templateVersion

        })
      })

 
      const compileInstance: ProjectCompile = await CompileDao.addProjectCompile({
        compileUser: ctx.userId, //编译者id
        compileResult: "开始编译", //编译结果
        projectId: ctx.projectId, //项目id
        description: ctx.description //编译描述
      } as CompileParam)

      const workDir = path.resolve(config.compileDir, ctx.userId)

      const GitNameList = CompileList.map( item => item.gitName)
      
      Promise.all( CompileList.map( item => new Compile(workDir).start( socket, item)))
        .then( async () => {
        const fileName = util.createFileName(ctx.userId)



        //传入 publicDoc， buildDoc， updateDoc



        // await new WorkFlowUtil(workDir).tarAndOutput(socket, fileName, GitNameList, publicType)
        compileInstance.file = fileName
        compileInstance.compileResult = "成功"
        compileInstance.config = JSON.stringify(compileInfoBack)

        // projectinfo 保存到数据库


        socket.emit({'result': 'success'})
      })
      .catch ( err => {
        logger.info(err)
        compileInstance.compileResult = "失败"
        socket.emit({"result": err})
      })

      CompileDao.updateProjectCompile(compileInstance)

    })

    socket.on('disconnect', (socket: any)=>{
      logger.info("丢失", socket )
    })
  })
  logger.info('socket服务初始化完成')
  server.listen(config.port, () => {
    logger.info(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
  })
  
})()