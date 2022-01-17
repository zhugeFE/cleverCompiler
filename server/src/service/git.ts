/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-13 15:45:03
 */
import gitDao from '../dao/git'
import { 
  GitList,
  UpdateGitStatus,
  UpdateConfigParam,
  BranchUpdateDocInfo,
  GitInstance, 
  GitInfo, 
  GitBranch, 
  GitTag, 
  GitCommit, 
  GitCreateVersionParam, 
  GitVersion, 
  GitCreateConfigParam, 
  GitConfig } from '../types/git';
import { DirNode } from '../types/common';
import * as path from 'path'
import config from '../config';
import { User } from '../types/user';
import fsUtil from '../utils/fsUtil';
import DashUtil from '../utils/dashUtil';
import logger from '../utils/logger';

class GitService {
  async getRemoteGitList (): Promise<GitList[]>{
    const gitList = await gitDao.getRemoteGitList()
    return gitList
  }
  async query (userId: string): Promise<GitInstance[]> {
    const gitList = await gitDao.query(userId)
    return gitList
  }
  async getInfoById (repoId: string): Promise<GitInfo> {
    const gitInfo = await gitDao.getInfo(repoId)
    return gitInfo
  }
  async getBranchsById (repoId: string | number): Promise<GitBranch[]> {
    return await gitDao.getBranchsById(repoId)
  }
  async getTagsById (repoId: string | number): Promise<GitTag[]> {
    return await gitDao.getTagsById(repoId)
  }
  async getCommitsById (repoId: string | number, branch: string): Promise<GitCommit[]> {
    return await gitDao.getCommitsById(repoId, branch)
  }
  async addVersion (param: GitCreateVersionParam, creatorId: string): Promise<GitInfo> {
    return await gitDao.addVersion(param, creatorId)
  }
  async initRepo (gitId: string, versionId: string, userId: string): Promise<string> {
    const gitInfo = await gitDao.getInfo(gitId)
    const workDir = path.resolve(config.compileDir, userId)
    const workExist = await fsUtil.pathExist(workDir)
    if (!workExist) {
      logger.info('初始化用户工作空间', workDir)
      await fsUtil.mkdir(workDir)
    }
    // 这里是以git名为文件夹名，不能直接取gitinfo里的name。稳妥做法是取gitRepo去做截取
    const name = gitInfo.gitRepo.split('/')[1].split('.')[0]
    const repoDir = path.resolve(workDir, name)
    const repoExist = await fsUtil.pathExist(repoDir)
    
    const dashUtil = new DashUtil(workDir)
    
    if (!repoExist) {
      logger.info('初始化项目代码到本地')
      // 代码还没clone到本地
      await dashUtil.exec(`git clone ${gitInfo.gitRepo}`)
    }
    const version = await gitDao.getVersionById(versionId)
    await dashUtil.cd(`${name}`)
    await dashUtil.exec(`git checkout .`)
    await dashUtil.exec(`git clean -df`)
    await dashUtil.exec(`git fetch`)
    const sourceValue = version.sourceValue.trim()
    switch (version.sourceType) {
      case 'branch':
      case 'commit':
        await dashUtil.exec(`git checkout ${sourceValue}`)
        break;
      case 'tag':
        await dashUtil.exec(`git checkout tags/${sourceValue}`)
        break;
    }
    return repoDir
  }

  async getFileTree (session: Express.Session, id: string, versionId: string, currentUser: User): Promise<DirNode[]> {
    const repoDir = await this.initRepo(id, versionId, currentUser.id)
    session.repoDir = repoDir
    return fsUtil.getDirTree(repoDir)
  }
  async getFileContent (session: Express.Session, filePath: string): Promise<string> {
    if (!session.repoDir) {
      throw new Error('会话中workDir找不到')
    }
    return await fsUtil.readFile(path.resolve(session.repoDir, filePath))
  }
  async addConfig (config: GitCreateConfigParam): Promise<GitConfig> {
    const configId = await gitDao.addConfig(config)
    return await gitDao.getConfigById(configId)
  }
  async deleteConfigById (configId: string): Promise<void> {
    await gitDao.deleteConfigById(configId)
  }
  async updateVersion (version: GitVersion): Promise<void> {
    await gitDao.updateVersion(version)
  }
  async deleteBranch (id: string): Promise<void>{
    await gitDao.deleteBranch(id)
  }
  async deleteVersion (id: string): Promise<void> {
    await gitDao.deleteVersion(id)
  }
  async updateConfig (config: UpdateConfigParam ): Promise<GitConfig>{
    return await gitDao.updateConfg(config)
  }
  async updateGitStatus (List: UpdateGitStatus[]): Promise<void> {
    await gitDao.updateGitStatus(List)
  }
  async deleteGit (id: string): Promise<void> {
    await gitDao.deleteGit(id)
  }
  async getBranchUpdateDocByGitId(gitId: string): Promise<BranchUpdateDocInfo[]>{
    return await gitDao.getBranchUpdateDocByGitId(gitId)
  }
}

export default new GitService()