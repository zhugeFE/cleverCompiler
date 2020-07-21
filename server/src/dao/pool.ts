import * as mysql from 'mysql'
import config from '../config'
import logger from '../utils/logger'
import util from '../utils/util'

const pool: mysql.Pool = mysql.createPool({
  ...config.database
})

function formatRes <T>(sql: string, res: any): T[] {
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
class PoolUtil {
  query<T> (sql: string, params?: any[]): Promise<T[]> {
    logger.info('sql query', sql, params)
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (err, result) => {
        if (err) {
          logger.error('执行sql错误', err.sql)
          reject(err)
        } else {
          resolve(formatRes<T>(sql, result))
        }
      })
    })
  }
  write (sql: string, params?: any[]): Promise<mysql.OkPacket> {
    logger.info('sql insert: ', sql, params)
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (err, result) => {
        if (err) {
          logger.error('执行insert语句错误', err.sql)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
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
  }
  queryInTransaction<T> (connect: mysql.PoolConnection, sql: string, params?: Array<string|number>): Promise<T[]> {
    return new Promise((resolve, reject) => {
      logger.info('query in transaction', sql, params)
      connect.query(sql, params, (err, results) => {
        if (err) {
          logger.error('事务中执行sql失败', err.sql)
          reject(err)
        } else {
          resolve(formatRes(sql, results))
        }
      })
    })
  }
  writeInTransaction (connect: mysql.PoolConnection, sql: string, params?: any[]): Promise<mysql.OkPacket> {
    return new Promise((resolve, reject) => {
      logger.info('insert in transaction', sql, params)
      connect.query(sql, params, (err, result) => {
        if (err) {
          logger.error('事务中执行sql失败', err.sql)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
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
  }
  rollback (connection: mysql.PoolConnection): void {
    connection.rollback(() => {
      connection.release()
    })
  }
}
export default new PoolUtil()