/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-13 11:53:25
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-17 17:02:20
 */
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

class Util {
  toCamelObj(obj: object): object {
    const result = {}
    for (const key in obj) {
      if (_.isFunction(obj[key])) continue
      result[_.camelCase(key)] = obj[key]
    }
    return result
  }
  uuid (): string {
    return uuidv4()
  }
  type (obj: any): string {
    return Object.prototype.toString.call(obj)
  }
  isArray (obj: any): boolean {
    return this.type(obj) === '[object Array]'
  }
  getType (target: any): string {
    const type = Object.prototype.toString.call(target) as string
    return type.split(/\s/)[1].replace(']', '').toLowerCase()
  }
  createFileName (userId: string): string {
    return Math.floor( new Date().getTime() / 1000) + Math.floor( 899999 * Math.random() + 100000) + userId
  }
  async delay(time: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }
}
export default new Util()