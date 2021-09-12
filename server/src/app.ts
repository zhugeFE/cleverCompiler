import { CompileConfig } from './types/compile';
/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-12 23:19:50
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
import Compile from "./utils/compile"
import ProjectService from "./service/project"
import http = require('http')
import Socket = require('socket.io')
import { ProjectInfo } from './types/project'
import GitService from "./service/git"
import CompileDao from './dao/compile';
import { ProjectCompile, CompileParam } from './types/compile';


const app = express()
const server = http.createServer(app)
const io =  new Socket.Server(server,{transports:["websocket"]})
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


server.listen(config.port, () => {
  logger.info(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
})


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
    compileInfo.gitList =  compileInfo.gitList.filter(item => ctx.GitIds.includes(item.id))

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
    logger.info(CompileList)
    const compileInstance: ProjectCompile = await CompileDao.addProjectCompile({
      compileUser: ctx.userId, //编译者id
      compileResult: "开始编译", //编译结果
      projectId: ctx.projectId, //项目id
      description: ctx.description //编译描述
    } as CompileParam)
    let result = 0
    await Promise.all( CompileList.map( async item => {
      if ( await Compile.start( socket, item) ) {
        result += 1;
      }
    }) )
    compileInstance.compileResult = result === CompileList.length ? "全部成功" : `成功： ${result} ， 失败： ${CompileList.length - result}`
    CompileDao.updateProjectCompile(compileInstance)
  })

  socket.on('disconnect', (socket: any)=>{
    logger.info("丢失", socket )
  })
})

