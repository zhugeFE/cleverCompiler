/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-04 15:54:25
 */
import * as childProcess from 'child_process'
import * as _ from 'lodash';
import logger from './logger';
import * as path from 'path';
import fsUtil from './fsUtil';
import SocketLogge from './socketLogger';
class DashUtil {
  workdir: string

  constructor (workdir: string) {
    this.workdir = workdir
  }

  async cd (originPath: string, socket?, socketEvent?, gitName?: string): Promise <void> {
    return new Promise( (resolve, reject) => {
      const dir = path.resolve(this.workdir, originPath)
      if (socket) {
        SocketLogge(socket, socketEvent, gitName, `检测 ${dir} 路径是否存在`)
      } else {
        logger.info(`检测 ${dir} 路径是否存在`)
      }
      fsUtil.pathExist(dir)
      .then((exist: boolean) => {
        if (exist) {
          this.workdir = dir
          if (socket) SocketLogge(socket, socketEvent, gitName, `cd ${dir} `)
          resolve()
          return
        }
        reject(new Error(`执行cd命令失败： 目录( ${dir} )不存在`))
      })
    })
  }
  exec (command: string, 
    socket?,
    socketEvent?,
    gitName?: string,
    onData?: (data: string) => void): Promise<void> {
    
    return new Promise((resolve, reject) => {
      logger.info(`exec command: ${command}`)
      if (socket) SocketLogge(socket,socketEvent, gitName, `exec command: ${command} , path===> ${this.workdir}`)
      // const arr = command.split(/\s+/)
      // const c = arr[0]
      // const args = arr.length > 1 ? arr.slice(1, arr.length) : []
      const p = childProcess.exec(command, {
        cwd: this.workdir,
        maxBuffer: 1024 * 1024 * 1024,
        env: {
          PATH: process.env.PATH
        }
      }, err => {
        if (err) {
          if( socket) {
            SocketLogge(socket,socketEvent, gitName, err.message)
          }else {
            logger.error(`命令行(${command})执行异常: ${err.message}`)
          }
          reject(err)
          return
        }
        resolve()
      })
      // p.on('exit', code => {
      //   if (code > 0) { // 命令执行异常，报错
      //     logger.error(`命令行(${c} ${args})执行异常`)
      //     reject(new Error(`命令行(${c} ${args})执行异常`))
      //     return
      //   }
      //   resolve()
      // })
      p.stdout.on('data', (chunk) => {
        if (onData) onData(chunk.toString())
        if (socket) {
          SocketLogge(socket,socketEvent, gitName, chunk.toString())
        } else {
          logger.info('command stdout >>>>', chunk.toString())
        }
      })
      p.stderr.on('data', chunk => {
        if (socket) {
          SocketLogge(socket,socketEvent, gitName, chunk.toString())
        } else {
          logger.error('command stderr >>>>', chunk.toString())
        }
        if (onData) onData(chunk.toString())
      })
    })
  }
}
export default DashUtil