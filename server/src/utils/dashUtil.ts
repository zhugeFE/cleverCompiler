/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-12 16:47:09
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

  async cd (originPath: string): Promise <boolean> {
    logger.info( `exec command: cd`)
    const dir = path.resolve(this.workdir, originPath)
    if ( await fsUtil.pathExist(dir) ) {
      this.workdir = dir
      return true
    } else {
      return false
    }
  }
  exec (command: string, options: childProcess.ExecOptions={cwd: this.workdir}, onData?: (data: string) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      logger.info(`exec command: ${command}`)
      const process = childProcess.exec(command, options, (err: childProcess.ExecException, out: string) => {
        if (err) {
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