import { SysInfo } from './../types/sys';
/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-14 10:02:15
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-08 15:39:08
 */
import { CompileDoc, CompileGitData } from './../types/compile';
import { TypeMode } from './../types/common';
import * as fs from 'fs';
import * as path from 'path';
import DashUtil from './dashUtil';
import FsUtil from './fsUtil';
import logger from './logger';
import SocketLogge from './socketLogger';
import fsUtil from './fsUtil';
import axios from 'axios';
import { Repo } from '../dao/git';

export const SocketEventNames  = {
  compileMessage: 'compileMessage',
  compileStatus: 'compileStatus',
  result: 'result',
  compileInfo: 'compileInfo',
  download: 'download',
}
class WorkFlow {

  workDir: string
  
  constructor (workDir: string) {
    this.workDir = workDir
  }

  async initUserDir (socket,  gitName: string): Promise<void> { 
    /**
     * 初始化目录 并返回目录
     */
    SocketLogge(socket, SocketEventNames.compileMessage , gitName, `Step: 初始化用户根目录 ${this.workDir}`)
    const exist = await FsUtil.pathExist(this.workDir)
    if( exist)  {
      SocketLogge(socket, SocketEventNames.compileMessage , gitName, `Step: 初始化工作目录 执行完毕！`)
    } else {
      SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 创建用户根目录 ${this.workDir}`)
      await FsUtil.mkdir(this.workDir)
    }
  }

  async initSrcRepoDir (socket, sourceSsh: string, sourceName: string, sourceValue: string, sourceType: string): Promise<void> {
    //初始化源码仓库
    const dashUtil = new DashUtil(this.workDir)
    SocketLogge(socket, SocketEventNames.compileMessage, sourceName, `Step: 初始化源码仓库 ${sourceName}`)
    const srcRepoDir =  path.join( this.workDir , sourceName )
    const exist = await FsUtil.pathExist(srcRepoDir)
    if (exist) {
      await dashUtil.cd(sourceName, socket, SocketEventNames.compileMessage,  sourceName)
    }
    else {
      SocketLogge(socket, SocketEventNames.compileMessage , sourceName, `Step: 克隆源码仓库 ${sourceName}`)
      await dashUtil.exec(`git clone ${sourceSsh}`, socket,SocketEventNames.compileMessage, sourceName)
      await dashUtil.cd(sourceName, socket,SocketEventNames.compileMessage, sourceName)
      await dashUtil.exec(`git pull`, socket,SocketEventNames.compileMessage, sourceName)
    }
    // 此处由于可能存在未提交的新建分支，此处可能存在异常，需要单独处理 回退到上一次成功的点
    await dashUtil.exec(`git reset --hard FETCH_HEAD`, socket,SocketEventNames.compileMessage, sourceName).catch( err => {
      SocketLogge(socket, SocketEventNames.compileMessage, sourceName, err.message)
    })
    let currentRemoteBranchName: string
    await dashUtil.exec(`git branch -r`, socket,SocketEventNames.compileMessage,sourceName, (data: string) =>{
      logger.info(data)
      const reg = new RegExp("origin/HEAD -> (.*?)\\n")
      currentRemoteBranchName = reg.exec(data)[1].split('/')[1] 
    })
    SocketLogge(socket, SocketEventNames.compileMessage, sourceName, `当前仓库${sourceName}---分支${currentRemoteBranchName}`)
    //删除没有git add的文件和目录
    await dashUtil.exec(`git clean -df`, socket,SocketEventNames.compileMessage, sourceName)
    await dashUtil.exec(`git checkout ${currentRemoteBranchName}`, socket,SocketEventNames.compileMessage, sourceName)
    await dashUtil.exec(`git fetch`, socket,SocketEventNames.compileMessage, sourceName)
    await dashUtil.exec(`git reset --hard FETCH_HEAD`, socket,SocketEventNames.compileMessage, sourceName)
    //删除非main以外的其它分支
    await dashUtil.exec(`git branch | grep -v "^[*| ]*${currentRemoteBranchName}$" | xargs git branch -D`, socket,SocketEventNames.compileMessage, sourceName).catch( err => {
      SocketLogge(socket, SocketEventNames.compileMessage, sourceName, err.message)
    })
    await dashUtil.exec(`git pull`, socket,SocketEventNames.compileMessage, sourceName)
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
      await dashUtil.exec(cmdStr, socket,SocketEventNames.compileMessage, sourceName).then( () => {
        SocketLogge(socket, SocketEventNames.compileMessage, sourceName, `初始化源码仓库 执行完毕`)
      })
    } else {
      SocketLogge(socket, SocketEventNames.compileMessage, sourceName, `初始化源码仓库 执行完毕`)
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
    SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 开始执行定制文件修改动作`)
    for (const item of configList){
      fileDir = path.join(srcRepoDir, item.filePath)
      SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 开始定制修改文件 =》 ${item.filePath}`)

      if (item.typeId == TypeMode.text) {
        text = fs.readFileSync(fileDir, 'utf-8')
        regex = JSON.parse(item.reg)
        regModifiers = regex.global ? "g" : "" + regex.ignoreCase ? "i" : ""
        Reg = new RegExp(regex.source , regModifiers)
        if(!Reg.test(text)) {
          SocketLogge(socket, SocketEventNames.compileMessage, gitName, `warning 匹配失败：${item.filePath} => ${Reg}`)
        } else {
          SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 执行文字替换 ${Reg} => ${item.targetValue}`)
          text = text.replace(Reg, item.targetValue)
          fs.writeFileSync(fileDir, text, 'utf8')
        }
      }
      else if (item.typeId == TypeMode.fiel) {
        const newAddr = path.resolve(srcRepoDir, JSON.parse(item.targetValue)['newFilename'])
        fsUtil.copyFile(newAddr,fileDir)
        .then( err => {
          if (err) {
            SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 文件替换失败 执行完毕`)
            throw(err)
          }
        })
      }
    }
    SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 定制文件修改 执行完毕`)
  }

  async runCompile (socket, gitName: string, buildCommand: string[]): Promise<void> {
    const dashUtil = new DashUtil(this.workDir)
    await dashUtil.cd(gitName, socket,SocketEventNames.compileMessage, gitName).catch(err => {throw(err)})
    SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 开始执行编译动作`)
    try{
      for (const cmd of buildCommand) {
        logger.info(`Step: 正在执行 =》 ${cmd}`)
        if (cmd.split(" ")[0] == 'cd') {
          await dashUtil.cd( cmd.split(" ")[1], socket,SocketEventNames.compileMessage, gitName)
        } else{
          await dashUtil.exec(`${cmd}`, socket,SocketEventNames.compileMessage, gitName)
        }
      }
    } catch(e) {
      logger.info(e)
      SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 编译命令执行失败`)
      throw(e)
    }
  }
  
  async publiceToGit (socket, sysInfo: SysInfo, gitData: CompileGitData[], customerName: string, description: string, callback: (message: string) => void): Promise<void> {
    for(const item of gitData){
      try {
        const res = await axios({
          url: `api/v3/projects/${item.publicGit}`,
          method: 'GET',
          baseURL: sysInfo.gitHost,
          headers: {
            'PRIVATE-TOKEN': sysInfo.gitToken
          }
        }) as {
          data: Repo;
        }
        await this.initPublishRepoDir(socket, res.data.ssh_url_to_repo, res.data.name, customerName)
        const fileDir =  path.resolve(this.workDir, `${item.name}${item.outputName}`)
        const publichRepo = path.resolve(this.workDir, res.data.name)
        SocketLogge(socket, SocketEventNames.result, 'result', `Step: 执行${item.name}代码发布动作`)
        const cmds = [
          `git checkout ${customerName}`,
          `cp -rf ${fileDir} ${publichRepo}`,
          `git config --local user.email "${sysInfo.gitAccount}"`,
          `git add --all`,
          `git commit -m "${description}"`,
          `git push origin ${customerName}`
        ]
        const dashUtil =  new DashUtil(publichRepo)
        for (const cmd of cmds) {
          await dashUtil.exec(cmd, socket,SocketEventNames.result, 'result')
        }
        callback(`发布到git${item.publicGit}-${customerName}成功`)
      }
      catch (e) {
        SocketLogge(socket, SocketEventNames.result, 'result', `Step: 发布到git失败 info:${e.message.toString()}`)
        callback(`发布到git${item.publicGit}-${customerName}失败`)
      }
    }
  }

  async initPublishRepoDir (socket, sshHost: string, sourceName: string, sourceValue: string): Promise<void> {
    //初始化发布仓库

    const dashUtil = new DashUtil(this.workDir)
    SocketLogge(socket, SocketEventNames.result, 'result', `Step: 初始化发布仓库 ${sourceName}`)
    const srcRepoDir =  path.join( this.workDir , sourceName )
    const exist = await FsUtil.pathExist(srcRepoDir)
    if (exist) {
      await dashUtil.cd(sourceName, socket,SocketEventNames.result, 'result')
    }
    else {
      SocketLogge(socket, SocketEventNames.result , 'result', `Step: 克隆源码仓库 ${sourceName}`)
      await dashUtil.exec(`git clone ${sshHost}`, socket,SocketEventNames.result, 'result')
      await dashUtil.cd(sourceName, socket,SocketEventNames.result, 'result')
      await dashUtil.exec(`git pull`, socket,SocketEventNames.result, 'result')
    }
    // 此处由于可能存在未提交的新建分支，此处可能存在异常，需要单独处理 回退到上一次成功的点
    await dashUtil.exec(`git reset --hard FETCH_HEAD`, socket,SocketEventNames.result, 'result').catch( err => {
      SocketLogge(socket, SocketEventNames.result, 'result', err.message)
    })
    let currentRemoteBranchName: string
    await dashUtil.exec(`git branch -r`, socket,SocketEventNames.result,'result', (data: string) =>{
      logger.info(data)
      const reg = new RegExp("origin/HEAD -> (.*?)\\n")
      currentRemoteBranchName = reg.exec(data)[1].split('/')[1] 
    })
    SocketLogge(socket, SocketEventNames.result, 'result', `当前仓库${sourceName}---分支${currentRemoteBranchName}`)
    //删除没有git add的文件和目录
    await dashUtil.exec(`git clean -df`, socket,SocketEventNames.result, 'result')
    await dashUtil.exec(`git checkout ${currentRemoteBranchName}`, socket, SocketEventNames.result,'result')
    await dashUtil.exec(`git fetch`, socket,SocketEventNames.result, 'result')
    await dashUtil.exec(`git reset --hard FETCH_HEAD`, socket,SocketEventNames.result, 'result')
    //删除非main以外的其它分支
    await dashUtil.exec(`git branch | grep -v "^[*| ]*${currentRemoteBranchName}$" | xargs git branch -D`, socket,SocketEventNames.result, 'result').catch( err => {
      SocketLogge(socket, SocketEventNames.result, 'result', err.message)
    })
    await dashUtil.exec(`git pull`, socket,SocketEventNames.result, 'result')
    if (sourceValue !== currentRemoteBranchName) {
      const cmdStr = `git checkout ${sourceValue} `
      await dashUtil.exec(cmdStr, socket,SocketEventNames.result, 'result').then( () => {
        SocketLogge(socket, SocketEventNames.result, 'result', `初始化源码仓库 执行完毕`)
      })
    } else {
      SocketLogge(socket, SocketEventNames.result, 'result', `初始化源码仓库 执行完毕`)
    }
  }

  async buildTmpProject (socket, gitData: CompileGitData[], doc: CompileDoc): Promise<string> {
    //在workdir下创建一个tmp文件
    SocketLogge(socket, SocketEventNames.result,'result','Step: 创建tmp临时文件')
    const tmpPath = path.resolve(this.workDir, "tmp")
    const exist = await fsUtil.pathExist(tmpPath)
    if (exist){
      await new DashUtil(tmpPath).exec('rm -rf ./*', socket,SocketEventNames.result, 'result')
    }
    await fsUtil.mkdir(tmpPath)

    SocketLogge(socket, SocketEventNames.result,'result','Step: tmp文件创建成功')
    for ( let i = 0 ; i < gitData.length; i++) {
      logger.info(gitData[i])
      const fileDir =  `${gitData[i].name}${gitData[i].outputName}`
      logger.info(fileDir)
      const oldPath =  path.resolve( this.workDir, fileDir)
      const newPath = path.resolve( tmpPath, gitData[i].name)
      SocketLogge(socket, SocketEventNames.result,'result',`Step: 正在拷贝${oldPath} 到 ${newPath}`)
      await fsUtil.rename(oldPath, newPath)
      SocketLogge(socket, SocketEventNames.result,'result',`Step: 拷贝成功 ${oldPath} 到 ${newPath}`)
    }

    SocketLogge(socket, SocketEventNames.result,'result',`Step: 开始写入配置文件`)
    fs.writeFileSync( path.resolve(tmpPath, 'build.md') , doc.buildDoc)
    fs.writeFileSync( path.resolve(tmpPath, 'update.md') , doc.updateDoc)
    fs.writeFileSync( path.resolve(tmpPath, 'readme.md') , doc.readmeDoc)
    SocketLogge(socket, SocketEventNames.result,'result',`Step: 写入配置文件成功`)

    return tmpPath
  }

  async pack (socket, fileName: string, gitData: CompileGitData[], doc: CompileDoc): Promise<boolean> {
    try {
      
      const tmpPath = await this.buildTmpProject(socket, gitData, doc)
      const savePath = path.resolve(this.workDir, `${fileName}.tar.gz`)

      SocketLogge(socket, SocketEventNames.result,'result',`Step: 开始打包文件`)
      
      await new DashUtil(tmpPath).exec(`tar czvf ${savePath} ./`, socket,SocketEventNames.result, 'result')

      return true
    } catch(err) {
      SocketLogge(socket, SocketEventNames.result,'result',`打包失败：${err.message}`)
      return false
    }
  }
}



export default WorkFlow