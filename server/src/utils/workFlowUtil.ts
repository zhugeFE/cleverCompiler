/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-14 10:02:15
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-15 19:42:08
 */

import * as fs from 'fs';
import * as path from 'path';
import DashUtil from './dashUtil';
import FsUtil from './fsUtil';
import logger from './logger';
import dashUtil from './dashUtil';
import SocketLogge from './socketLogger';

class WorkFlow {

  async initUserDir (socket, workDir: string, userId: string, gitName: string): Promise<void> { 
    /**
     * 初始化目录 并返回目录
     */
    SocketLogge(socket, gitName, `Step: 初始化用户根目录 ${workDir}`)
    await FsUtil.pathExist(workDir).then( async (result) => {
      if (!result) {
        SocketLogge(socket, gitName, `Step: 创建用户根目录 ${workDir}`)
        await FsUtil.mkdir(workDir)
      }
    })
    SocketLogge(socket, gitName, `Step: 初始化工作目录 执行完毕！`)
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
      SocketLogge(socket, sourceName, err.message)
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
      SocketLogge(socket, sourceName, err.message)
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
      // if (item.isHidden) { return } //隐藏配置不做编辑
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
  
  async runCompile (socket, Dir: string, gitName: string, buildCommand: string[]): Promise<boolean> {
    const workDir = path.join(Dir, gitName)
    SocketLogge(socket, gitName, `Step: 开始执行编译动作`)
    try{
      for (const cmd of buildCommand) {
        logger.info(`Step: 正在执行 =》 ${cmd}`)
          await dashUtil.exec(`${cmd}`, {cwd: workDir})
      }
      SocketLogge(socket, gitName, `Step: 执行编译动作 执行完毕`)
      return true
    } catch(e) {
      logger.info(e)
      SocketLogge(socket, gitName, `Step: 编译命令执行失败`)
      return false
    }
  }

  async tarAndOutput (socket, workDir: string, fileName: string, gitName: string[], publicType: number): Promise<void> {
    /**
     * 传递 工作路径  git名称 一个或者多个
     * 判断发布类型
     * 0 发布到云端
     * 1 打包下载 根据gitName 数组拼接 需要压缩的文件路径 复制到www文件下 以10位时间戳+6位随机数（100000-999999）+ userID
     * 2 分开下载 循环gitName 进行压缩 
     * 保存到数据库中  compileId  string[]的 文件路径
     */
    switch (publicType) {
      case 0: {
        break;
      }
      case 1: {

        let addr = ""
        for ( let i = 0 ; i < gitName.length; i++) {
          addr += `./${gitName[i]} `
          SocketLogge(socket, gitName[i], `Step: 开始执行打包命令`)
        }
        try{
          const savePath = __dirname.replace('dist/utils', `www/download/${fileName}.tar.gz`)
          await DashUtil.exec(`tar czvf ${savePath} --exclude=.git ${addr}`, {cwd: workDir})
          for ( let i = 0 ; i < gitName.length; i++) {
            SocketLogge(socket, gitName[i], `Step: 打包命令 执行完毕`)
          }
          break;
        } catch(e){
          logger.info(e)
          break
        }
        
      }
      case 2: {
        const downloadFile= __dirname.replace('dist/utils', `www/download`)
        const outputDir = path.join(downloadFile, fileName)

        await FsUtil.pathExist( outputDir ).then(async reslut => {
          if (!reslut) {
            SocketLogge(socket, gitName[0], `Step: 创建输出目录`)
            await DashUtil.exec(`mkdir ${fileName}`, {cwd: downloadFile})
          } else {
            SocketLogge(socket, gitName[0], `Step: 清空目录文件内容 `)
            await DashUtil.exec('rm -rf *', {cwd: outputDir})
          }
        })
        for ( let i = 0 ; i < gitName.length; i++) {
          SocketLogge(socket, gitName[i], `Step: 开始执行打包命令`)
          const addr = `./${gitName[i]} `
          const savePath = __dirname.replace('dist/utils', `www/download/${fileName}/${gitName[i]}.tar.gz`)
          await DashUtil.exec(`tar czvf ${savePath} --exclude=.git ${addr}`, {cwd: workDir})

          SocketLogge(socket, gitName[i], `Step: 打包命令 执行完毕`)
        }
      }
    }
  }


}


export default new WorkFlow()