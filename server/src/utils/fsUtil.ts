/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-04 19:57:35
 */
import * as fs from 'fs'
import * as pt from 'path'
import { DirNode } from '../types/common';
import logger from './logger';

class FsUtil {
  async mkdir (path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.pathExist(path)
        .then((exist: boolean) => {
          if (exist) {
            resolve()
            return
          }
          fs.mkdir(path, err => {
            if (err) {
              logger.error('创建目录失败:', path)
              reject(err)
            } else {
              resolve()
            }
          })
        })
      })
    }
  

  rename (oldpath: string, newpath: string): Promise<void> {
    return new Promise( (resolve, reject) => {
      logger.info(`${oldpath} ${newpath}`)
      fs.rename(oldpath, newpath, (err) => {
        if (err){
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async pathExist (path: string): Promise<boolean> {
    return new Promise((resolve) => {
      fs.stat(path, (err) => {
        if (err) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }
  async getDirTree (targetPath: string, parentDir?: string): Promise<DirNode[]> {
    const res: DirNode[] = []
    const children = await this.readDir(targetPath)
    // const exclude = ['^\\.']
    const exclude = []
    const ignorePath = pt.resolve(targetPath, '.gitignore')
    const exist = await this.pathExist(ignorePath)
    if (exist) {
      // 将git指定的忽略文件，放到忽略目录中
      const text = await this.readFile(ignorePath)
      text.split(/\s/g).forEach(item => {
        if (item && !/^#/.test(item)) {
          exclude.push(item.replace(/[/*]/g, ''))
        }
      })
    }
    // 检查目标目录或文件，是否为忽略内容
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
      const child = children[i].split('/').pop()
      const childPath = pt.resolve(targetPath, child)
      const stat = fs.statSync(childPath)
      const relativePath = parentDir ? pt.join(parentDir, child) : child
      if (matchIgnore(child)) {
        // nothing
      } else 
      if (stat.isDirectory()) {
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

  async copyFile (src: string, dest: string): Promise<boolean> {
    return new Promise( (resolve) => {
      fs.copyFile(src, dest, (err) => {
        if (err){
          resolve (false)
        } else {
          resolve (true)
        }
      })
    })
  }
}
export default new FsUtil()