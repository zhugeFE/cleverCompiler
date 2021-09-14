/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-23 16:56:36
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-14 11:34:11
 */
import WorkFlowUtil from './workFlowUtil';
import logger from './logger';
import { CompileConfig } from './../types/compile';
import SocketLogge from './socketLogger';


class Socket {
  async start(socket, requestData: CompileConfig): Promise<boolean> {
    // if (!session || !session.user) {
    //   return
    // }
    // 判断用户是否有改仓库操作权限

    SocketLogge(socket, requestData.gitName, "Step: 开始执行编译流程,请耐心等待...")

    try {

      //传入 用户id 初始化工作目录
      const workDir = await WorkFlowUtil.initUserDir(socket, requestData.userId, requestData.gitName)
      
      // 传入 工作路径 git名 来源类型 类型值
      await WorkFlowUtil.initSrcRepoDir(socket, workDir, requestData.gitSsh, requestData.gitName, requestData.gitValue, requestData.gitType)
      
      await WorkFlowUtil.initOutputDir(socket, workDir, requestData.gitName)
      await WorkFlowUtil.runReplacement(socket, workDir, requestData.gitName, requestData.configList)
      await WorkFlowUtil.runCompile(socket, workDir, requestData.gitName, JSON.parse(requestData.compileOrders))
      
      await WorkFlowUtil.tarAndOutput(socket, workDir, requestData.gitName)
      return true
    }
    catch (e) {
      logger.error(e)
      return false
    }

  }
  
}

export default new Socket()