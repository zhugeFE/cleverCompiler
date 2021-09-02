/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-01 09:10:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-01 15:22:23
 */

import { exec } from "child_process";
import logger from "./logger";
import * as fs from "fs";
import * as path from 'path';

class Terminal {
  username: string;
  socket: any
  reg: { cd: RegExp};
  cwd: string;
  envPath: string;

  constructor (username: string, socket) {
    this.username = username,
    this.socket = socket,
    this.reg = {
      cd: /^cd\s*/
    },
    this.cwd = process.cwd(),
    this.envPath = process.env.PATH
  }

  log (data = '', needSocket = true): void {
    logger.error(`${this.username} ${data.toString()}`)
    if( this.socket && needSocket) {
      this.socket.emit('compileLog', data.toString())
    }
  }
  isDir (dir): Promise<boolean> {
    return (
      new Promise((resolve, reject) => {
        try {
          fs.stat(dir, (err, stats) => {
            if (err) {
              resolve(false)
            } else {
              resolve(stats.isDirectory())
            }
          })
        } catch (e) {
          reject(e)
          this.log(e)
        }
      })
    )
  }

  cd (dir): Promise<void> {
    return new Promise((resolve , reject) => {
      try {
        if( path.isAbsolute(dir)) {
          this.cwd = dir
        } else {
          this.cwd = path.join(this.cwd, dir)
        }
        fs.access(this.cwd, (e) => {
          if (e) {
            reject(e)
            this.log(e.message)
          } else {
            resolve()
          }
        })
      } catch (e) {
        reject(e)
        this.log(e)
      }
    })
  }

  exec (cmd: string, ignoreOutput): Promise<void> {
    const needSocket = ignoreOutput !== true
    if (this.reg.cd.test(cmd)) {
      return this.cd(cmd.replace(/^cd\s*/, ""))
    } else {
      return new Promise((resolve, reject) => {
        logger.error(`${this.username} EXEC ${cmd} (CWD: ${this.cwd})`)
        const result = exec(cmd, {cwd: this.cwd, env:{
          PATH: this.envPath
        }, maxBuffer: 1023 * 1024})
        result.stdout.on('data', (data) => {
          this.log(data, needSocket)
        })
        result.stderr.on('data', (data) => {
          this.log(data, needSocket)
        })
        result.on("exit", (code) => {
          if( code != 0) {
            reject()
          } else {
            resolve()
          }
        })
      })
    }
  }

  exceList (cmdList): void {
    cmdList.map( async item => {
      await this.exec(item.cmd, item.ignoreOutput)
    })
  }
}

export default Terminal