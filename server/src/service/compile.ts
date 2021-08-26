/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-23 16:55:38
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-25 18:30:27
 */
import compileDao from "../dao/compile";
import {  CompileParam, ProjectCompile } from "../types/compile";

class CompileService {

  //编译发布
  async addCompile(data: CompileParam): Promise<ProjectCompile>{
    return await compileDao.addProjectCompile(data)
  }

  async compileList(): Promise<ProjectCompile[]>{
    return await compileDao.getProjectCompile()
  }


}

const compileService = new CompileService()
export default compileService