/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-14 10:02:15
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-10 23:41:48
 */

import * as fs from 'fs';
import * as path from 'path';
import DashUtil from './dashUtil';
import FsUtil from './fsUtil';
import logger from './logger';
import dashUtil from './dashUtil';
import SocketLogge from './socketLogger';

class WorkFlow {

  workDir: string
  
  constructor (workDir: string) {
    this.workDir = workDir
  }

  async initUserDir (socket,  gitName: string): Promise<void> { 
    /**
     * 初始化目录 并返回目录
     */
    SocketLogge(socket, gitName, `Step: 初始化用户根目录 ${this.workDir}`)
    await FsUtil.pathExist(this.workDir).then( async (result) => {
      if (!result) {
        SocketLogge(socket, gitName, `Step: 创建用户根目录 ${this.workDir}`)
        await FsUtil.mkdir(this.workDir)
      }
    })
    SocketLogge(socket, gitName, `Step: 初始化工作目录 执行完毕！`)
  }
  

  async initSrcRepoDir (socket, sourceSsh: string, sourceName: string, sourceValue: string, sourceType: string): Promise<void> {
    //初始化源码仓库
    const dashUtil = new DashUtil(this.workDir)
    SocketLogge(socket, sourceName, `Step: 初始化源码仓库 ${sourceName}`)
    const srcRepoDir =  path.join( this.workDir , sourceName )
    const err =  await FsUtil.pathExist(srcRepoDir)
    if (!err) {
      SocketLogge(socket, sourceName, `Step: 克隆源码仓库 ${sourceName}`)
      await dashUtil.exec(`git clone ${sourceSsh}`)
      await dashUtil.cd(sourceName)
      await dashUtil.exec(`git pull`)
    } else{
      await dashUtil.cd(sourceName)
    }
    // 此处由于可能存在未提交的新建分支，此处可能存在异常，需要单独处理 回退到上一次成功的点
    await dashUtil.exec(`git reset --hard FETCH_HEAD`).catch( err => {
      SocketLogge(socket, sourceName, err.message)
    })
    let currentRemoteBranchName: string
    await dashUtil.exec(`git branch -r`, {} , (data: string) =>{
      currentRemoteBranchName = data.split('\n')[1].split('/')[1] 
    })
    SocketLogge(socket, sourceName, `当前仓库${sourceName}---分支${currentRemoteBranchName}`)
    //删除没有git add的文件和目录
    await dashUtil.exec(`git clean -df`)
    await dashUtil.exec(`git checkout ${currentRemoteBranchName}`)
    await dashUtil.exec(`git fetch`)
    await dashUtil.exec(`git reset --hard FETCH_HEAD`)

    //删除非main以外的其它分支
    await dashUtil.exec(`git branch | grep -v "^[*| ]*${currentRemoteBranchName}$" | xargs git branch -D`).catch( err => {
      SocketLogge(socket, sourceName, err.message)
    })

    await dashUtil.exec(`git pull`)

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
      await dashUtil.exec(cmdStr).then( () => {
        SocketLogge(socket, sourceName, `初始化源码仓库 执行完毕`)
      })
    } else {
      SocketLogge(socket, sourceName, `初始化源码仓库 执行完毕`)
    }
  }
  
  async runReplacement (socket,  gitName: string, configList): Promise<void> {
    let text = ''
    let regex: {
      source: string;
      global: boolean;
      ignoreCase: boolean;
    }
    let regModifiers = ""
    let Reg: RegExp 
    let fileDir = ''
    const srcRepoDir = path.join(this.workDir, gitName)
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

  // async initOutputDir (socket, gitName: string): Promise<void> {
  //   SocketLogge(socket, gitName, `Step: 初始化output目录...`)
  //   const outputDir = path.join(workDir, 'output')
  //   await FsUtil.pathExist( outputDir ).then(async reslut => {
  //     if (!reslut) {
  //       SocketLogge(socket, gitName, `Step: 创建目录 output`)
  //       await dashUtil.exec(`mkdir output`)
  //     } else {
  //       SocketLogge(socket, gitName, `Step: 清空目录 output `)
  //       await dashUtil.cd('output')
  //       await dashUtil.exec('rm -rf *')
  //       await dashUtil.cd('..')
  //     }
  //   })
  //   SocketLogge(socket, gitName, `Step: 初始化output目录 执行完毕`)
  // }
  
  async runCompile (socket, gitName: string, buildCommand: string[]): Promise<boolean> {
    const dashUtil = new DashUtil(this.workDir)
    const workDir = path.join(this.workDir, gitName)
    const err = await dashUtil.cd(gitName)
    if (err) {
      throw (err)
    }
    SocketLogge(socket, gitName, `Step: 开始执行编译动作`)
    try{
      for (const cmd of buildCommand) {
        logger.info(`Step: 正在执行 =》 ${cmd}`)
        if (cmd.split(" ")[0] == 'cd') {
          await dashUtil.cd( cmd.split(" ")[1])
        } else{
          await dashUtil.exec(`${cmd}`, {cwd: workDir})
        }
      }
      SocketLogge(socket, gitName, `Step: 执行编译动作 执行完毕`)
      return true
    } catch(e) {
      logger.info(e)
      SocketLogge(socket, gitName, `Step: 编译命令执行失败`)
      throw(e)
    }
  }

  async tarAndOutput (socket, fileName: string, gitName: string[], publicType: number): Promise<void> {
    /**
     * 传递 工作路径  git名称 一个或者多个
     * 判断发布类型
     * 0 发布到云端
     * 1 打包下载 根据gitName 数组拼接 需要压缩的文件路径 复制到www文件下 以10位时间戳+6位随机数（100000-999999）+ userID
     * 2 分开下载 循环gitName 进行压缩 
     * 保存到数据库中  compileId  string[]的 文件路径
     */
    const dashUtil = new DashUtil(this.workDir)
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
          await dashUtil.exec(`tar czvf ${savePath} --exclude=.git ${addr}`)
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
            await dashUtil.exec(`mkdir ${fileName}`, {cwd: downloadFile})
          } else {
            SocketLogge(socket, gitName[0], `Step: 清空目录文件内容 `)
            await dashUtil.exec('rm -rf *', {cwd: outputDir})
          }
        })
        for ( let i = 0 ; i < gitName.length; i++) {
          SocketLogge(socket, gitName[i], `Step: 开始执行打包命令`)
          const addr = `./${gitName[i]} `
          const savePath = __dirname.replace('dist/utils', `www/download/${fileName}/${gitName[i]}.tar.gz`)
          await dashUtil.exec(`tar czvf ${savePath} --exclude=.git ${addr}`)

          SocketLogge(socket, gitName[i], `Step: 打包命令 执行完毕`)
        }
      }
    }
  }


}


export default WorkFlow