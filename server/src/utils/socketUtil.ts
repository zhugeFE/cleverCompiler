import { SysInfo } from './../types/sys';
/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-16 14:13:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-07 15:45:44
 */

import * as Socket from "socket.io";
import WorkFlowUtil from './workFlowUtil';
import ProjectService from "../service/project"
import { ProjectInfo } from "../types/project";
import CompileDao from '../dao/compile';
import Compile from "./compile"
import * as path from 'path';
import config from '../config';
import { CompileGitParams } from "../types/git";
import { CompileConfig, CompileParam, ProjectCompile } from "../types/compile";
import logger from "./logger";
import SocketLogge from "./socketLogger";
import { SocketEventNames } from "./workFlowUtil";
import GitService from "../service/compile";
import util from "./util";
import sys from "../middleware/sys";

class SocketUtil{
  server
  io
  constructor (server) {
    this.server = server
    this.initSocket()
    return this.io
  }

  initSocket (): void {
     this.io = new Socket.Server(this.server, {transports:["websocket"]})
     this.bindListent()
  }

  bindListent (): void {
    this.io.on('connect', socket => {

      socket.on("startCompile", async (ctx) => {
        
       
        const compileInfo: ProjectInfo = await ProjectService.projectCompileInfo(ctx.projectId)
        const gitInfo: CompileGitParams[] = await ProjectService.getCompileGitData(ctx['gitIds'])
        const sysInfo: SysInfo = await ProjectService.getSysInfo()
        const compileList: CompileConfig[] = []
        
        const globalConfigMap = {}
        compileInfo.globalConfigList.map( item => globalConfigMap[item.id] = item.targetValue)
  
        compileInfo.gitList.map(git => {
          git.configList.map( config => {
            if (config.globalConfigId) {
              config.targetValue = globalConfigMap[config.globalConfigId]
            }
          })
        })
  
        gitInfo.map ( git => {
          compileList.unshift({
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
  
        SocketLogge(socket, SocketEventNames.compileInfo, "compileId", compileInstance.id)

        const workDir = path.resolve(config.compileDir, ctx.userId)  
        
        const compileResult = []
        for (const item of compileList) {
          SocketLogge(socket, SocketEventNames.compileStatus, item.gitName, "executing")
          const result = await new Compile(workDir).start(socket, item)
          SocketLogge(socket, SocketEventNames.compileStatus, item.gitName, result ? "success" : "fails")
          compileResult.push( `项目：${item.gitName} ===》 编译 ${result}`)
        }

        if (ctx.publicType == 0) {
          const gitData = []

          for ( const id of ctx.gitIds) {
            const data = await GitService.getGitData(id) 
            logger.info(data)
            gitData.push( data)
          }
          
          await new WorkFlowUtil(workDir).publiceToGit(socket, sysInfo.gitAccount, gitData, ctx.description, (message: string) => {
            compileResult.push(message)
          })
        }
        
        if (ctx.publicType == 1) {
          const gitData = []

          for ( const id of ctx.gitIds) {
            const data = await GitService.getGitData(id) 
            logger.info(data)
            gitData.push( data)
          }

          const doc = await GitService.getTemplateDoc(ctx.projectId)
          // 根据id 查询git 打包目录
          SocketLogge(socket, SocketEventNames.result,'result','Step: 开始执行打包。。。。')
          const fileName = util.createFileName(ctx.userId)
          //传入 publicDoc， buildDoc， updateDoc
          const res = await new WorkFlowUtil(workDir).tarAndOutput(socket, fileName, gitData, doc ,ctx.publicType)
          compileResult.push(res ? "打包成功" : "打包失败")
          compileInstance.file =  res ? fileName : ""
          SocketLogge(socket, SocketEventNames.result,'result',`Step: ${res ? "打包成功" : "打包失败"}`)
          SocketLogge(socket, SocketEventNames.download,'download',fileName)
        }

        if (ctx.publicType == 2) {
          console.log(12);
          
        }

        compileInstance.compileResult = JSON.stringify(compileResult)
  
        CompileDao.updateProjectCompile(compileInstance)

  
      })
  
      socket.on("pack", async (ctx) => {
        const workDir = path.resolve(config.compileDir, ctx.userId)
        const gitIdList = ctx.gitIds
        const projectId = ctx.projectId
        const compileId = ctx.compileId
        const publicType = ctx.publicType //发布类型
        const gitData = []

        for ( const id of gitIdList) {
          const data = await GitService.getGitData(id) 
          logger.info(data)
          gitData.push( data)
        }

        const doc = await GitService.getTemplateDoc(projectId)
        // 根据id 查询git 打包目录
        SocketLogge(socket, SocketEventNames.result,'result','Step: 开始执行打包。。。。')
        const fileName = util.createFileName(ctx.userId)
        //传入 publicDoc， buildDoc， updateDoc
        const res = await new WorkFlowUtil(workDir).tarAndOutput(socket, fileName, gitData, doc ,publicType)
        const data = {
          id: compileId,
          compileResult: res ? "打包成功" : "打包失败",
          file: res ? fileName : ""
        }
        SocketLogge(socket, SocketEventNames.result,'result',`Step: ${res ? "打包成功" : "打包失败"}`)
        SocketLogge(socket, SocketEventNames.download,'download',fileName)

        CompileDao.updateProjectCompile(data)

      })
  
      socket.on('disconnect', (socket: any)=>{
        logger.info("丢失", socket )
      })
    })
  }
}

export default SocketUtil
