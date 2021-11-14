/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-05 20:08:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-14 08:35:58
 */
import * as log4js from 'log4js'
import * as path from 'path'

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    file: {
      type: 'dateFile',
      filename: path.resolve(__dirname, `../../../logs/clever-compiler.log`),
      alwaysIncludePattern: true,
      daysToKeep: 5
    }
  },
  categories: {
    default: {
      appenders: ['console','dataFile'],
      level: 'info'
    }
  },
  pm2: true
})
const logger = log4js.getLogger()
export default logger