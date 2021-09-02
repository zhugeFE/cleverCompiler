/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-01 09:10:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-01 12:04:27
 */

class Socket {
  start(socket): void {
    socket.emit("message",JSON.stringify({name:"12321"}))
  }
  
}

export default new Socket()