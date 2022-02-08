/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-18 11:39:22
 */
import * as path from 'path'
import * as fs from 'fs'
import * as jsBeautify from 'js-beautify'
const configPath: string = path.resolve(__dirname, '../.config')

interface Database {
  connectionLimit?: number;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
interface RedisCofig {
  ip: string;
  port: number;
  password?: string;
}
interface ServerConfig{
  database: Database;
  port: number;
  compileDir: string;
  redis: {
    default: RedisCofig;
    poolSize: number;
    maxPoolSize: number;
  };
}

let config: ServerConfig = {
  port: 3000,
  database: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'clever_compile',
    connectionLimit: 20
  },
  redis: {
    poolSize: 10,
    maxPoolSize: 100,
    default: {
      ip: '127.0.0.1',
      port: 6379,
      password: ''
    } 
  },
  compileDir: path.resolve(__dirname, '../.compile')
}
try {
  fs.statSync(configPath)
  config = JSON.parse(fs.readFileSync(configPath).toString())
} catch (e) {
  fs.writeFileSync(configPath, jsBeautify.js(JSON.stringify(config)))
}
try {
  fs.statSync(config.compileDir)
} catch (e) {
  fs.mkdirSync(config.compileDir)
}
export default config