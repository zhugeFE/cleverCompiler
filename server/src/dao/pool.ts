import * as mysql from 'mysql'
import config from '../config'
import logger from '../utils/logger'
import util from '../utils/util'

const pool: mysql.Pool = mysql.createPool({
  ...config.database
})

function formatRes <T>(sql: string, res: any): T | T[] {
  if (/^select/.test(sql)) {
    const list = []
    res.forEach((item: object) => {
      list.push(util.toCamelObj(item))
    })
    return list
  } else {
    return res
  }
}
const out = {
  query<T> (sql: string, params?: any[]): Promise<T | T[]> {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (err, result) => {
        if (err) {
          logger.error('执行sql错误', err)
          reject(err)
        } else {
          resolve(formatRes<T>(sql, result))
        }
      })
    })
  },
  beginTransaction (): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection: mysql.PoolConnection) => {
        if (err) {
          logger.error('获取数据库连接失败', err)
          reject(err)
          return
        }
        connection.beginTransaction(error => {
          if (error) {
            logger.error('开启事务失败', error)
            reject(error)
          } else {
            resolve(connection)
          }
        })
      })
    })
  },
  queryInTransaction (connect: mysql.PoolConnection, sql: string, params?: Array<string|number>): Promise<any> {
    return new Promise((resolve, reject) => {
      connect.query(sql, params, (err, results) => {
        if (err) {
          logger.error('事务中执行sql失败', err.sql)
          reject(err)
        } else {
          resolve(formatRes(sql, results))
        }
      })
    })
  },
  commit (connection: mysql.PoolConnection): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.commit(err => {
        if (err) {
          logger.error('提交事务失败', err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  rollback (connection: mysql.PoolConnection): void {
    connection.rollback(() => {
      connection.release()
    })
  }
}
export default out