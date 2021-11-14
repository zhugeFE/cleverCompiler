/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-13 22:52:12
 */
import * as childProcess from 'child_process'
import * as _ from 'lodash';
import logger from './logger';
import * as path from 'path';
import fsUtil from './fsUtil';
class DashUtil {
  workdir: string

  constructor (workdir: string) {
    this.workdir = workdir
  }

  async cd (originPath: string): Promise <void> {
    return new Promise( (resolve, reject) => {
      const dir = path.resolve(this.workdir, originPath)
      logger.info(`检测 ${dir} 路径是否存在`)
      fsUtil.pathExist(dir)
      .then((exist: boolean) => {
        if (exist) {
          this.workdir = dir
          resolve()
          return
        }
        reject(new Error(`执行cd命令失败： 目录( ${dir} )不存在`))
      })
    })
  }
  exec (command: string, 
    options: childProcess.ExecOptions={cwd: this.workdir}, 
    onData?: (data: string) => void): Promise<string> {

    return new Promise((resolve, reject) => {
      logger.info(`exec command: ${command}`)
      const process = childProcess.exec(command, options, (err: childProcess.ExecException, out: string) => {
        if (err) {
          logger.error('命令行执行异常', command, options, err.message)
          reject(err)
        } else {
          resolve(out)
        }
      })
      process.stdout.on('data', (chunk: any) => {
        if (_.isFunction(onData)) {
          onData(chunk.toString())
        }
        logger.info(chunk.toString())
      })
      process.stderr.on('data', (chunk: any) => {
        if (_.isFunction(onData)) {
          onData(chunk.toString())
        }
        logger.info(chunk.toString())
      })
    })
  }
}
export default DashUtil