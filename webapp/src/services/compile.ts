/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 16:13:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-21 17:29:40
 */
import { CompileParam } from "@/models/compile";
import request from "@/utils/request";
import api from "./constants/apis";


class CompileService {

  async addCompile (data: CompileParam) {
    return request(api.compile.createCompile, {
      method: "post",
      data
    })
  }
}

export default new CompileService()