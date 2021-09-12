/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-23 16:56:36
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-12 23:09:46
 */
import WorkFlowUtil from './workFlowUtil';
import logger from './logger';
import CompileDao from '../dao/compile';
import { CompileConfig } from './../types/compile';


class Socket {
  async start(socket, requestData: CompileConfig): Promise<boolean> {
    // if (!session || !session.user) {
    //   return
    // }
    
    logger.info(requestData)
    
    // 判断用户是否有改仓库操作权限


    logger.info("Step: 开始执行编译流程,请耐心等待...")
    try {

      //传入 用户id 初始化工作目录
      const workDir = await WorkFlowUtil.initUserDir(requestData.userId)
      
      // 传入 工作路径 git名 来源类型 类型值
      await WorkFlowUtil.initSrcRepoDir(workDir, requestData.gitSsh, requestData.gitName, requestData.gitValue, requestData.gitType)
      
      // await WorkFlowUtil.initOutputDir(workDir)
      // await WorkFlowUtil.runReplacement(workDir, requestData.gitName, requestData.configList)
      // await WorkFlowUtil.runCompile(workDir, requestData.compileOrders)
      // const outputDir = path.join(workDir, 'output')
      // await WorkFlowUtil.tarAndOutput(outputDir)
      return true
    }
    catch (e) {
      logger.error(e)
      return false
    }

  }
  
}

export default new Socket()