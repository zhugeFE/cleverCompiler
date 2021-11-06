/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-05 20:13:22
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
import GitService from "./service/git"
import CompileDao from './dao/compile';
import { ProjectCompile, CompileParam } from './types/compile';
import WorkFlowUtil from './utils/workFlowUtil';
import util from './utils/util';
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

  app.use(auth)
  app.use(sys)
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
      
      /**
       * 1. 遍历git项目
       * //2. 判断用户是否有权限操作git项目
       * 2. 查询出git里config配置属性
       * 3. 查询出git 仓库地址  版本值  
       * 4. 线程锁/顺序 调用start
       */
      const compileInfo: ProjectInfo = await ProjectService.projectInfo(ctx.projectId)
      compileInfo.gitList =  compileInfo.gitList.filter(item => ctx.gitIds.includes(item.id))
      const publicType = ctx.publicType //发布类型
      const CompileList: CompileConfig[] = []
      await Promise.all(compileInfo.gitList.map(async item => {
        const info = await GitService.getCompileParams(item.gitSourceVersionId)
        CompileList.push( {
          userId: ctx.userId,
          gitName: item.name,
          configList: item.configList,
          compileType: compileInfo.compileType,
          templateId: compileInfo.templateId,
          templateVersionId: compileInfo.templateVersion,
          ... info
        } )

      }))
      const compileInstance: ProjectCompile = await CompileDao.addProjectCompile({
        compileUser: ctx.userId, //编译者id
        compileResult: "开始编译", //编译结果
        projectId: ctx.projectId, //项目id
        description: ctx.description //编译描述
      } as CompileParam)

      let result = 0
      const gitNames = []
      const workDir = path.resolve(config.compileDir, ctx.userId)
      const successGitNames = []
      await Promise.all( CompileList.map( async item => { 
        gitNames.push(item.gitName)
        if ( await Compile.start( socket, workDir, item, publicType) ) {
          result += 1;
          successGitNames.push(item.gitName)
        }
      }) )
      const fileName = util.createFileName(ctx.userId)
      
      await WorkFlowUtil.tarAndOutput(socket, workDir, fileName, successGitNames, publicType)

      compileInstance.compileResult = result === CompileList.length ? "全部成功" : `成功： ${result} ， 失败： ${CompileList.length - result}`
      compileInstance.file = fileName
      CompileDao.updateProjectCompile(compileInstance)
      socket.emit('result', {"fileaddr": fileName,"successGitNames": successGitNames})
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