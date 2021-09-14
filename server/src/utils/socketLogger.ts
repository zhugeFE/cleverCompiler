import logger from "./logger"

/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-14 11:05:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-14 11:27:16
 */
const SocketLogge = (socket, gitName: string, message: string, type= "info"): void =>{
  /**
   *  socket 
   *  socketTarget: 客户端目标
   *  gitName: 仓库名称
   *  message: 消息
   *  type: logger 等级类型
   */
  socket.emit("compileMessage", {
    message,
    gitName
  })
  logger[type](message)
}

export default SocketLogge