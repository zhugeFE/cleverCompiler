/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-23 16:55:38
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-05 18:54:23
 */
import compileDao from "../dao/compile";
import {  CompileParam, ProjectCompile, CompileGitData, CompileDoc} from "../types/compile";

class CompileService {
  //编译发布
  async addCompile(data: CompileParam): Promise<ProjectCompile>{
    return await compileDao.addProjectCompile(data)
  }

  async compileList(id: string): Promise<ProjectCompile[]>{
    return await compileDao.getProjectCompile(id)
  }

  async getGitData(projectGitId: string): Promise<CompileGitData> {
    return await compileDao.getGitData(projectGitId)
  }
  
  async getTemplateDoc(projecId: string): Promise<CompileDoc> {
    return await compileDao.getTemplateDoc(projecId)
  }
}

const compileService = new CompileService()
export default compileService