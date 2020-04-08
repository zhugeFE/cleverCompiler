import * as fs from 'fs'
import * as pt from 'path'
import { DirNode } from '../types/common';

class FsUtil {
  async mkdir (path: string): Promise<void> {
    const pathExist = await this.pathExist(path)
    if (!pathExist) {
      await new Promise((resolve, reject) => {
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
  pathExist (path: string): Promise<boolean> {
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
    const children = fs.readdirSync(targetPath)
    const exclude = ['node_modules'] // todo 根据ignore文件的配置，来进行忽略
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const childPath = pt.resolve(targetPath, child)
      const stat = fs.statSync(childPath)
      const relativePath = parentDir ? pt.join(parentDir, child) : child
      if (exclude.includes(child)) {
        // nothing
      } else if (stat.isDirectory()) {
        res.push({
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
  async getFileContent (filePath: string): Promise<string> {
    return await this.readFile(filePath)
  }
}
export default new FsUtil()