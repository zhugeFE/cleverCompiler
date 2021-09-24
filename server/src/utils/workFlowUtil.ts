/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-14 10:02:15
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-24 10:14:17
 */

import * as fs from 'fs';
import * as path from 'path';
import DashUtil from './dashUtil';
import FsUtil from './fsUtil';
import logger from './logger';
import dashUtil from './dashUtil';
import config from '../config';
import SocketLogge from './socketLogger';

class WorkFlow {

  async initUserDir (socket, userId: string, gitName: string): Promise<string> { 
    /**
     * 初始化目录 并返回目录
     */
    const workDir = path.resolve(config.compileDir, userId)
    SocketLogge(socket, gitName, `Step: 初始化用户根目录 ${workDir}`)
    await FsUtil.pathExist(workDir).then( async (result) => {
      if (!result) {
        SocketLogge(socket, gitName, `Step: 创建用户根目录 ${workDir}`)
        await FsUtil.mkdir(workDir)
      }
    })
    SocketLogge(socket, gitName, `Step: 初始化工作目录 执行完毕！`)
    return workDir
  }
  

  async initSrcRepoDir (socket, workDir: string, sourceSsh: string, sourceName: string, sourceValue: string, sourceType: string): Promise<void> {
    //初始化源码仓库
    SocketLogge(socket, sourceName, `Step: 初始化源码仓库 ${sourceName}`)
    const srcRepoDir =  path.join( workDir , sourceName )
    await FsUtil.pathExist(srcRepoDir).then( async (result) => {
      if (!result) {
        SocketLogge(socket, sourceName, `Step: 克隆源码仓库 ${sourceName}`)
        await DashUtil.exec(`git clone ${sourceSsh}`, {cwd: workDir})
        await DashUtil.exec(`git pull`, {cwd: srcRepoDir})
      }
    })
    // 此处由于可能存在未提交的新建分支，此处可能存在异常，需要单独处理 回退到上一次成功的点
    await DashUtil.exec(`git reset --hard FETCH_HEAD`, {cwd: srcRepoDir}).catch( err => {
      SocketLogge(socket, sourceName, err)
    })
    let currentRemoteBranchName: string
    await DashUtil.exec(`git branch -r`, {cwd: srcRepoDir} , (data: string) =>{
      currentRemoteBranchName = data.split('\n')[1].split('/')[1] 
    })
    SocketLogge(socket, sourceName, `当前仓库${sourceName}---分支${currentRemoteBranchName}`)
    //删除没有git add的文件和目录
    await DashUtil.exec(`git clean -df`, {cwd: srcRepoDir})
    await DashUtil.exec(`git checkout ${currentRemoteBranchName}`, {cwd: srcRepoDir})
    await DashUtil.exec(`git fetch`, {cwd: srcRepoDir})
    await DashUtil.exec(`git reset --hard FETCH_HEAD`, {cwd: srcRepoDir})

    //删除非main以外的其它分支
    await DashUtil.exec(`git branch | grep -v "^[*| ]*${currentRemoteBranchName}$" | xargs git branch -D`).catch( err => {
      SocketLogge(socket, sourceName, err)
    })

    await DashUtil.exec(`git pull`, {cwd: srcRepoDir})

    if (sourceValue !== currentRemoteBranchName) {
      let cmdStr = `git checkout `
      
      switch (sourceType) {
        case "branch": {
          cmdStr += sourceValue
          break
        }
        case "tag": {
          cmdStr += sourceValue
          break;
        }
        case "commit": {
          cmdStr += sourceValue
          break;
        }
      }
      await DashUtil.exec(cmdStr, {cwd: srcRepoDir}).then( () => {
        SocketLogge(socket, sourceName, `初始化源码仓库 执行完毕`)
      })
    } else {
      SocketLogge(socket, sourceName, `初始化源码仓库 执行完毕`)
    }

  }
  
  async runReplacement (socket, workDir: string, gitName: string, configList): Promise<void> {
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
    SocketLogge(socket, gitName, `Step: 开始执行定制文件修改动作`)
    for (const item of configList){
      if (item.isHidden) { return } //隐藏配置不做编辑
      fileDir = path.join(srcRepoDir, item.filePath)
      SocketLogge(socket, gitName, `Step: 开始定制修改文件 =》 ${item.filePath}`)
      text = fs.readFileSync(fileDir, 'utf-8')
      regex = JSON.parse(item.reg)
      regModifiers = regex.global ? "g" : "" + regex.ignoreCase ? "i" : ""
      Reg = new RegExp(regex.source , regModifiers)

      if(!Reg.test(text)) {
        SocketLogge(socket, gitName, `error 匹配失败：${item.file} => ${Reg}`)
        return Promise.reject()
      }
      SocketLogge(socket, gitName, `Step: 执行文字替换 ${Reg} => ${item.realValue}`)
      text = text.replace(Reg, item.realValue)
      fs.writeFileSync(fileDir, text, 'utf8')
    }
    SocketLogge(socket, gitName, `Step: 定制文件修改 执行完毕`)
    
  }

  async initOutputDir (socket, workDir: string, gitName: string): Promise<void> {
    SocketLogge(socket, gitName, `Step: 初始化output目录...`)
    const outputDir = path.join(workDir, 'output')
    await FsUtil.pathExist( outputDir ).then(async reslut => {
      if (!reslut) {
        SocketLogge(socket, gitName, `Step: 创建目录 output`)
        await DashUtil.exec(`mkdir output`, {cwd: workDir})
      } else {
        SocketLogge(socket, gitName, `Step: 清空目录 output `)
        DashUtil.exec('rm -rf *', {cwd: outputDir})
      }
    })
    SocketLogge(socket, gitName, `Step: 初始化output目录 执行完毕`)
  }
  
  async runCompile (socket, Dir: string, gitName: string, buildCommand: string[]): Promise<void> {
    const workDir = path.join(Dir, gitName)
    SocketLogge(socket, gitName, `Step: 开始执行编译动作`)
    for (const cmd of buildCommand) {
      logger.info(`Step: 正在执行 =》 ${cmd}`)
      await dashUtil.exec(`${cmd}`, {cwd: workDir})
    }
    SocketLogge(socket, gitName, `Step: 执行编译动作 执行完毕`)
  }

  async tarAndOutput (socket, workDir: string, gitName: string): Promise<void> {
    SocketLogge(socket, gitName, `Step: 开始执行打包命令`)
    await DashUtil.exec(`tar czvf ./output/${gitName}.tar.gz --exclude=.git ./output `, {cwd: workDir})
    const savePath = __dirname.replace('dist/utils', `www/download/${gitName}.tar.gz`)
    await DashUtil.exec(`cp ./output/${gitName}.tar.gz ${savePath}`, {cwd: workDir})
    SocketLogge(socket, gitName, `Step: 打包命令 执行完毕`)
  }

}


export default new WorkFlow()