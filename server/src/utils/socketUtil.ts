/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-16 14:13:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-16 19:22:20
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
  

        /**
         * 
         * 1. 生成记录
         * 2. 编译结果存储  （ 编译者id， 编译结果（成功1: 失败：1）[根据 gitId List长度来] 项目ID 配置内容 编译描述   ）
         * 3. 返回编译id
         * 4. 重新编译带回 编译id git——id
         * 5. 更新编译结果  （ 编译结果 根据 gitID  ）
         * 
         * 6. 用户选择打包 （传回 编译id
         * 7. 编译结果 （对应编译内容里 加入 filePath字段内容
         */
   
        const compileInstance: ProjectCompile = await CompileDao.addProjectCompile({
          compileUser: ctx.userId, //编译者id
          compileResult: "开始编译", //编译结果
          projectId: ctx.projectId, //项目id
          description: ctx.description //编译描述
        } as CompileParam)
  
        const workDir = path.resolve(config.compileDir, ctx.userId)
  
        // const gitNameList = compileList.map( item => item.gitName)
  
        
        const compileResult = []
        for (const item of compileList) {
          SocketLogge(socket, SocketEventNames.compileStatus, item.gitName, "executing")
          const result = await new Compile(workDir).start(socket, item)
          SocketLogge(socket, SocketEventNames.compileStatus, item.gitName, result ? "success" : "fails")
          compileResult.push( `项目：${item.gitName} ===》 编译 ${result}`)
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
          gitData.push( GitService.getGitData(id) )
        }

        const doc = await GitService.getTemplateDoc(projectId)

        logger.info(gitIdList)
        // 根据id 查询git 打包目录
        
        const fileName = util.createFileName(ctx.userId)
        //传入 publicDoc， buildDoc， updateDoc
        const res = await new WorkFlowUtil(workDir).tarAndOutput(socket, fileName, gitData, doc ,publicType)
        const data = {
          id: projectId,
          compileResult: res ? "打包成功" : "打包失败",
          file: fileName
        }
        CompileDao.updateProjectCompile(data)

      })
  
      socket.on('disconnect', (socket: any)=>{
        logger.info("丢失", socket )
      })
    })
  }
}

export default SocketUtil
