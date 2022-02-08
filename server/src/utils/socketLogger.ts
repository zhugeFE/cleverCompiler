import logger from "./logger"

/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-14 11:05:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-16 15:05:56
 */
const SocketLogge = (socket, eventName: string, gitName: string, message: string, type= "info"): void =>{
  /**
   *  socket 
   *  socketTarget: 客户端目标
   *  gitName: 仓库名称
   *  message: 消息
   *  type: logger 等级类型
   */
  socket.emit(eventName, {
    message,
    gitName
  })
  logger[type](message)
}

export default SocketLogge