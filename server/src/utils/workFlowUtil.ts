/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-01 09:10:38
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-12 20:51:45
 */

import * as fs from 'fs';
import * as path from 'path';
import DashUtil from './dashUtil';
import FsUtil from './fsUtil';
import logger from './logger';
import dashUtil from './dashUtil';
import { cwd } from 'process';
import config from '../config';

class WorkFlow {

  async initUserDir (userId: string ): Promise<string> { 
    /**
     * 初始化目录 并返回目录
     */
    const workDir = path.resolve(config.compileDir, userId)
    logger.info(`Step: 初始化用户根目录 ${workDir}`)
    await FsUtil.pathExist(workDir).then( async (result) => {
      if (!result) {
        logger.info(`Step: 创建用户根目录 ${workDir}`)
        await FsUtil.mkdir(workDir)
      }
    })
    logger.info(`Step: 初始化工作目录 执行完毕！`)
    return workDir
  }
  

  async initSrcRepoDir (workDir: string, sourceSsh: string, sourceName: string, sourceValue: string, sourceType: string): Promise<void> {//初始化源码仓库
    logger.info(`Step: 初始化源码仓库 ${sourceName}`)
    const srcRepoDir =  path.join( workDir , sourceName )
    await FsUtil.pathExist(srcRepoDir).then( async (result) => {
      if (!result) {
        logger.info(`Step: 克隆源码仓库 ${sourceName}`)
        await DashUtil.exec(`git clone ${sourceSsh}`, {cwd: workDir})
        await DashUtil.exec(`git pull`, {cwd: srcRepoDir})
      }
    })
    // 此处由于可能存在未提交的新建分支，此处可能存在异常，需要单独处理 回退到上一次成功的点
    await DashUtil.exec(`git reset --hard FETCH_HEAD`, {cwd: srcRepoDir}).catch( err => {
      logger.info(err)
    })

    //删除没有git add的文件和目录
    await DashUtil.exec(`git clean -df`, {cwd: srcRepoDir})
    await DashUtil.exec(`git checkout main`, {cwd: srcRepoDir})
    await DashUtil.exec(`git fetch`, {cwd: srcRepoDir})
    await DashUtil.exec(`git reset --hard FETCH_HEAD`, {cwd: srcRepoDir})

    //删除非main以外的其它分支
    await DashUtil.exec(`git branch | grep -v "^[*| ]*main$" | xargs git branch -D`).catch( err => {
      logger.info(err)
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
        logger.info(`初始化源码仓库 执行完毕`)
      })
    } else {
      logger.info(`初始化源码仓库 执行完毕`)
    }

  }

  async initOutputDir (workDir: string): Promise<void> {
    logger.info(`Step: 初始化output目录...`)
    const outputDir = path.join(workDir, 'output')
    await FsUtil.pathExist( outputDir ).then(async reslut => {
      if (!reslut) {
        logger.info(`Step: 创建目录 output`)
        await DashUtil.exec(`mkdir output`, {cwd: workDir})
      } else {
        logger.info(`Step: 清空目录 output `)
        DashUtil.exec('rm -rf *', {cwd: outputDir})
      }
    })
    logger.info(`Step: 初始化output目录 执行完毕`)
  }
  
  async runReplacement (workDir: string, gitName: string, configList): Promise<void> {
    let text = ''
    let regex: {
      source: string;
      global: boolean;
      ignoreCase: boolean;
    }
    let regModifiers = ""
    let Reg: RegExp 
    let fileDir = ''
    const srcRepoDir = path.join(workDir, gitName)
    logger.info (`Step: 开始执行定制文件修改动作`)
    for (const item of JSON.parse(configList)){
      fileDir = path.join(srcRepoDir, item.filePath)
      logger.info(`Step: 开始定制修改文件 =》 ${item.filePath}`)

      text = fs.readFileSync(fileDir, 'utf-8')
      regex = JSON.parse(item.reg)
      regModifiers = regex.global ? "g" : "" + regex.ignoreCase ? "i" : ""
      Reg = new RegExp(regex.source , regModifiers)

      if(!Reg.test(text)) {
        logger.info(`error 匹配失败：${item.file} => ${Reg}`)
        return Promise.reject()
      }
      logger.info(`Step: 执行文字替换 ${Reg} => ${item.realValue}`)
      text = text.replace(Reg, item.realValue)
      fs.writeFileSync(fileDir, text, 'utf8')
    }
    logger.info(`Step: 定制文件修改 执行完毕`)
    
  }

  async runCompile (workDir: string, buildCommand: string[]): Promise<void> {
    logger.info(`Step: 开始执行编译动作`)
    await dashUtil.exec(`cd ${workDir}`)
    for (const cmd of buildCommand) {
      logger.info(`Step: 正在执行 =》 ${cmd}`)
      await dashUtil.exec(`${cmd}`, {cwd: workDir})
    }
    logger.info(`Step: 执行编译动作 执行完毕`)
  }

  async tarAndOutput (outputDir: string): Promise<void> {
    logger.info(`Step: 开始执行打包命令`)
    await DashUtil.exec(`tar czvf download.tar.gz --exclude=.git ./${outputDir}`)
    await DashUtil.exec(`cp download.tar.gz ${__dirname.replace('controllers/utils', 'www/download/result.tar.gz')}`)
    logger.info(`Step: 打包命令 执行完毕`)
  }

}


export default new WorkFlow()