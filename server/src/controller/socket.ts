/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-16 14:12:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-05 18:12:42
 */

import SocketUtil from "../utils/socketUtil";
import * as http from "http"
import logger from "../utils/logger";

class Socket {
  createSocket (app): http.Server{
    logger.info('socket服务开始初始化');
    const server = http.createServer(app) 
    new SocketUtil(server)
    logger.info('socket服务初始化完成')
    return server
  }
}

export default new Socket()