/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 16:13:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-26 10:52:02
 */
import { CompileParam } from "@/models/compile";
import request from "@/utils/request";
import api from "./constants/apis";


class CompileService {

  async compileList () {
    return request(api.compile.compileList)
  }

  async addCompile (data: CompileParam) {
    return request(api.compile.createCompile, {
      method: "post",
      data
    })
  }
}

export default new CompileService()