/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-01 09:10:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-04 11:07:20
 */

import WorkFlowUtil from './workFlowUtil';
import config from '../config';
import * as path from "path";

class Socket {
  start(socket, session, requestData): void {
    if (!session || !session.user) {
      return
    }
    //传入 工作路径，用户id 初始化工作目录
    WorkFlowUtil.initUserDir(config.compileDir, requestData.userId)

    //传入 工作路径， git名 来源类型 值
    const workDir = path.join(config.compileDir, requestData.userId)
    WorkFlowUtil.initSrcRepoDir(workDir, requestData.sourceName, requestData.sourceValue, requestData.sourceType)

    WorkFlowUtil.initOutputDir(workDir)
    const outputDir = path.join(workDir, 'output')
    WorkFlowUtil.tarAndOutput(outputDir)
  }
  
}

export default new Socket()