/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-14 10:02:15
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-18 11:26:11
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
      await dashUtil.cd(sourceName, socket, sourceName)
    }
    else {
      SocketLogge(socket, SocketEventNames.compileMessage , sourceName, `Step: 克隆源码仓库 ${sourceName}`)
      await dashUtil.exec(`git clone ${sourceSsh}`, socket, sourceName)
      await dashUtil.cd(sourceName, socket, sourceName)
      await dashUtil.exec(`git pull`, socket, sourceName)
    }
    // 此处由于可能存在未提交的新建分支，此处可能存在异常，需要单独处理 回退到上一次成功的点
    await dashUtil.exec(`git reset --hard FETCH_HEAD`, socket, sourceName).catch( err => {
      SocketLogge(socket, SocketEventNames.compileMessage, sourceName, err.message)
    })
    let currentRemoteBranchName: string
    await dashUtil.exec(`git branch -r`, socket,sourceName, (data: string) =>{
      currentRemoteBranchName = data.split('\n')[1].split('/')[1] 
    })
    SocketLogge(socket, SocketEventNames.compileMessage, sourceName, `当前仓库${sourceName}---分支${currentRemoteBranchName}`)
    //删除没有git add的文件和目录
    await dashUtil.exec(`git clean -df`, socket, sourceName)
    await dashUtil.exec(`git checkout ${currentRemoteBranchName}`, socket, sourceName)
    await dashUtil.exec(`git fetch`, socket, sourceName)
    await dashUtil.exec(`git reset --hard FETCH_HEAD`, socket, sourceName)

    //删除非main以外的其它分支
    await dashUtil.exec(`git branch | grep -v "^[*| ]*${currentRemoteBranchName}$" | xargs git branch -D`, socket, sourceName).catch( err => {
      SocketLogge(socket, SocketEventNames.compileMessage, sourceName, err.message)
    })

    await dashUtil.exec(`git pull`, socket, sourceName)

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
      await dashUtil.exec(cmdStr, socket, sourceName).then( () => {
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
    await dashUtil.cd(gitName, socket, gitName).catch(err => {throw(err)})
    SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 开始执行编译动作`)
    try{
      for (const cmd of buildCommand) {
        logger.info(`Step: 正在执行 =》 ${cmd}`)
        if (cmd.split(" ")[0] == 'cd') {
          await dashUtil.cd( cmd.split(" ")[1], socket, gitName)
        } else{
          await dashUtil.exec(`${cmd}`, socket, gitName)
        }
      }
    } catch(e) {
      logger.info(e)
      SocketLogge(socket, SocketEventNames.compileMessage, gitName, `Step: 编译命令执行失败`)
      throw(e)
    }
  }

  async tarAndOutput (socket, fileName: string, gitData: CompileGitData[], doc: CompileDoc, publicType: number): Promise<boolean> {
    /**
     * 传递 工作路径  git名称 一个或者多个
     * 
     * 判断发布类型
     * 0 发布到git
     * 1 打包下载 查询模版中的三个文档 根据gitName 数组拼接 需要压缩的文件路径 复制到www文件下 以10位时间戳+6位随机数（100000-999999）+ userID
     * 2 自动 循环gitName 进行压缩 查询对应git版本的三个文档 
     * 保存到数据库中  compileId  string[]的 文件路径
     */
    const dashUtil = new DashUtil(this.workDir)
    switch (publicType) {
      case 0: {
        break;
      }
      case 1: {
        try{
          //在www下创建一个tmp文件
          SocketLogge(socket, SocketEventNames.result,'result','Step: 创建tmp临时文件')
          const dirPath = __dirname.replace('dist/utils', `www/download/tmp`)

          await new DashUtil(dirPath).exec('rm -rf ./*', socket, 'result')
          await fsUtil.mkdir(dirPath)
          .catch (err => {
            //创建临时文件失败
            SocketLogge(socket, SocketEventNames.result,'result','Step: 创建tmp失败, 打包结束')
            throw(err)
          })

          SocketLogge(socket, SocketEventNames.result,'result','Step: tmp文件创建成功')
          for ( let i = 0 ; i < gitData.length; i++) {
            logger.info(gitData[i])
            const fileDir =  `${gitData[i].name}${gitData[i].outputName}`
            logger.info(fileDir)
            const oldPath =  path.resolve( this.workDir, fileDir)
            const newPath = path.resolve( dirPath, gitData[i].name)
            SocketLogge(socket, SocketEventNames.result,'result',`Step: 正在拷贝${oldPath} 到 ${newPath}`)
            await fsUtil.rename(oldPath, newPath).catch ( (err) => {
               //复制失败
              SocketLogge(socket, SocketEventNames.result,'result',`Step: 拷贝失败 ${oldPath} 到 ${newPath}`)
              SocketLogge(socket, SocketEventNames.result,'result',`Step: 错误信息 ${err}`)

              throw(new Error(`拷贝失败 ${oldPath} 到 ${newPath}`))
            })

            SocketLogge(socket, SocketEventNames.result,'result',`Step: 拷贝成功 ${oldPath} 到 ${newPath}`)
          }

          SocketLogge(socket, SocketEventNames.result,'result',`Step: 开始写入配置文件`)
          fs.writeFileSync( path.resolve(dirPath, 'build.md') , doc.buildDoc)
          fs.writeFileSync( path.resolve(dirPath, 'update.md') , doc.updateDoc)
          fs.writeFileSync( path.resolve(dirPath, 'readme.md') , doc.readmeDoc)
          SocketLogge(socket, SocketEventNames.result,'result',`Step: 写入配置文件成功`)

          const savePath = __dirname.replace('dist/utils', `www/download/${fileName}.tar.gz`)

          SocketLogge(socket, SocketEventNames.result,'result',`Step: 开始打包文件`)
          
          await new DashUtil(dirPath).exec(`tar czvf ${savePath} ./`, socket, 'result')

          return true
        
        } catch(e){
          logger.info(e)
          return false
        }
        
      }
      case 2: {
          break
        }
      }
    }
  }



export default WorkFlow