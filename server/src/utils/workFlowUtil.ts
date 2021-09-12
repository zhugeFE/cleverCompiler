/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-01 09:10:38
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-04 11:02:37
 */

import * as fs from 'fs';
import * as path from 'path';
import { Socket } from 'socket.io';
import DashUtil from './dashUtil';
import FsUtil from './fsUtil';
import Config from '../config';
import logger from './logger';


class WorkFlow {

  async initUserDir (workDir: string, userID: string ) { //初始化工作根目录 用户根目录
    logger.log(`Step: 初始化工作目录 ${workDir}`)
    
    await FsUtil.pathExist(workDir).then( async (result) => {
      if (!result) {
        logger.log(`Step: 创建工作根目录 ${workDir}`)
        await DashUtil.exec(`mkdir ${workDir}`, {cwd: process.cwd()})
      }
    })
    
    await FsUtil.pathExist(path.join(workDir, userID)).then( async (result) => {
      if (!result) {
        logger.log(`Step: 创建用户根目录 ${userID}`)
        await DashUtil.exec(`mkdir ${userID}`, {cwd: path.join(process.cwd(), workDir)})
      }
    })

    logger.log(`Step: 初始化工作目录 执行完毕！`)
  }
  

  async initSrcRepoDir (workDir: string, sourceName: string, sourceValue: string, sourceType: string) {//初始化源码仓库
    logger.log(`Step: 初始化源码仓库 ${sourceName}`)
    const srcRepoDir =  path.join( process.cwd(), workDir , sourceName )
    await FsUtil.pathExist(srcRepoDir).then( async (result) => {
      if (!result) {
        logger.log(`Step: 克隆源码仓库 ${sourceName}`)
        await DashUtil.exec(`git clone ${sourceName}`, {cwd: workDir})
        await DashUtil.exec(`git pull`, {cwd: srcRepoDir})
      }
    })
    // 此处由于可能存在未提交的新建分支，此处可能存在异常，需要单独处理 回退到上一次成功的点
    await DashUtil.exec(`git reset --hard FETCH_HEAD`, {cwd: srcRepoDir}).catch( err => {
      logger.log(err)
    })

    //删除没有git add的文件和目录
    await DashUtil.exec(`git clean -df`, {cwd: srcRepoDir})
    await DashUtil.exec(`git checkout main`, {cwd: srcRepoDir})
    await DashUtil.exec(`git fetch`, {cwd: srcRepoDir})
    await DashUtil.exec(`git reset --hard FETCH_HEAD`, {cwd: srcRepoDir})

    //删除非main以外的其它分支
    await DashUtil.exec(`git branch | grep -v "^[*| ]*main$" | xargs git branch -D`).catch( err => {
      logger.log(err)
    })

    await DashUtil.exec(`git pull`, {cwd: srcRepoDir})

    if (sourceValue !== 'main') {
      let cmdStr = `git checkout ${sourceValue}`
      
      switch (sourceType) {
        case "branch": {
          break
        }
        case "tag": {
          cmdStr += sourceValue
          break;
        }
        case "commit": {
          break;
        }
      }
      await DashUtil.exec(cmdStr, {cwd: srcRepoDir}).then( () => {
        logger.log(`初始化源码仓库 执行完毕`)
      })
    } else {
      logger.log(`初始化源码仓库 执行完毕`)
    }

  }

  async initOutputDir (workDir: string) {
    logger.log(`Step: 初始化output目录...`)
    const outputDir = path.join(workDir, 'output')
    await FsUtil.pathExist( outputDir ).then(async reslut => {
      if (!reslut) {
        logger.log(`Step: 创建目录 output`)
        await DashUtil.exec(`mkdir output`, {cwd: workDir})
      } else {
        logger.log(`Step: 清空目录 output `)
        DashUtil.exec('rm -rf *', {cwd: outputDir})
      }
    })
    logger.log(`Step: 初始化output目录 执行完毕`)
  }
  
  async tarAndOutput (outputDir: string) {
    logger.log(`Step: 开始执行打包命令`)
    await DashUtil.exec(`tar czvf download.tar.gz --exclude=.git ./${outputDir}`)
    await DashUtil.exec(`cp download.tar.gz ${__dirname.replace('controllers/utils', 'www/download/result.tar.gz')}`)
    logger.log(`Step: 打包命令 执行完毕`)
  }

}


export default new WorkFlow()