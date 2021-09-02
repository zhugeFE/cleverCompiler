/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-01 09:10:38
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-01 20:53:24
 */

import * as fs from 'fs';
import * as path from 'path';
import { Socket } from 'socket.io';
import Terminal from './terminal';

class WorkFlow {
  username: string;
  socket: Socket;
  requestData: {};
  terminal: Terminal;
  workDir: string;
  constructor(username = " " , socket, requestData ={}){
    this.username = username,
    this.socket = socket,
    this.requestData = requestData
    this.terminal = new Terminal(username, socket)
    this.workDir = path.join(username)
  }

  async initUserDir () { //初始化工作根目录 用户根目录

  }

  async initSrcRepoDir () {// 初始化源码仓库

  }


}