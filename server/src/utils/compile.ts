/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-23 16:56:36
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-05 19:04:25
 */
import WorkFlowUtil from './workFlowUtil';
import logger from './logger';
import { CompileConfig } from './../types/compile';
import SocketLogge from './socketLogger';
import { SocketEventNames } from './workFlowUtil';

class Socket {

  workdir: string

  constructor (workdir: string) {
    this.workdir = workdir
  }

  async start(socket, requestData: CompileConfig): Promise<boolean> {
    // if (!session || !session.user) 
    //   return
    // }
    // 判断用户是否有改仓库操作权限
    SocketLogge(socket, SocketEventNames.compileMessage, requestData.gitName, "Step: 开始执行编译流程,请耐心等待...")

    try {
      const workFlowUtil = new WorkFlowUtil(this.workdir)
      //传入 用户id 初始化工作目录
      await workFlowUtil.initUserDir(socket, requestData.gitName)
      // 传入 工作路径 git名 来源类型 类型值
      await workFlowUtil.initSrcRepoDir(socket, requestData.gitSsh, requestData.gitName, requestData.gitValue, requestData.gitType)
      // await WorkFlowUtil.initOutputDir(socket, workDir, requestData.gitName)
      await workFlowUtil.runReplacement(socket, requestData.gitName, requestData.configList)
      await workFlowUtil.runCompile(socket , requestData.gitName, requestData.compileOrders)
      SocketLogge(socket, SocketEventNames.compileMessage, requestData.gitName, `Step: 执行编译动作 执行完毕`)
      return true
    }
    catch (err) {
      logger.error("compile Error:", err)
      return false
    }
  }
}

  
export default Socket