/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-10 23:15:03
 */
import * as fs from 'fs'
import { reject } from 'lodash';
import * as pt from 'path'
import { DirNode } from '../types/common';
import logger from './logger';

class FsUtil {
  async mkdir (path: string): Promise<void> {
    const pathExist = await this.pathExist(path)
    if (!pathExist) {
      await new Promise<void>((resolve, reject) => {
        fs.mkdir(path, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    }
  }

  rename (oldpath: string, newpath: string): Promise<NodeJS.ErrnoException> {
    return new Promise( (resolve) => {
      logger.info(`${oldpath} ${newpath}`)
      fs.rename(oldpath, newpath, (err) => {
        resolve(err)
      })
    })
  }


  pathExist (path: string): Promise<NodeJS.ErrnoException> {
    return new Promise((resolve) => {
      fs.stat(path, (err) => {
        if (err) {
          resolve(err)
        } 
      })
    })
  }
  async getDirTree (targetPath: string, parentDir?: string): Promise<DirNode[]> {
    const res: DirNode[] = []
    const children = fs.readdirSync(targetPath)
    const exclude = ['^\\.']
    const ignorePath = pt.resolve(targetPath, '.gitignore')
    if (await this.pathExist(ignorePath)) {
      const text = await this.readFile(ignorePath)
      text.split(/\s/g).forEach(item => {
        if (item && !/^#/.test(item)) {
          exclude.push(item.replace(/[/*]/g, ''))
        }
      })
    }
    const matchIgnore = (itemPath: string): boolean => {
      let match = false
      exclude.forEach(reg => {
        if (reg && new RegExp(reg).test(itemPath)) {
          match = true
        }
      })
      return match
    }
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const childPath = pt.resolve(targetPath, child)
      const stat = fs.statSync(childPath)
      const relativePath = parentDir ? pt.join(parentDir, child) : child
      if (matchIgnore(child)) {
        // nothing
      } else if (stat.isDirectory()) {
        res.unshift({
          name: child,
          filePath: relativePath,
          isDirectory: true,
          children: await this.getDirTree(childPath, relativePath)
        })
      } else {
        res.push({
          name: child,
          filePath: relativePath,
          fileType: pt.extname(child).replace(/^\./, ''),
          isDirectory: false,
          children: []
        })
      }
    }
    return res
  }
  readFile (filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data: Buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.toString())
        }
      })
    })
  }
  readDir (filePath: string): Promise<string[]> {
    return new Promise( (resolve, reject) => {
      fs.readdir(filePath, (err, data: string[]) => {
        if(err){
          reject(err)
        } else {
          const res = data.map( item => `${filePath}/${item}`)
          resolve(res)
        }
      })
    })
  }
  async getFileContent (filePath: string): Promise<string> {
    return await this.readFile(filePath)
  }
}
export default new FsUtil()