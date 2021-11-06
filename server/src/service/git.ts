import { GitList, UpdateGitStatus, UpdateConfigParam } from './../types/git';
/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 16:47:43
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-07 00:03:36
 */
import gitDao from '../dao/git'
import { GitInstance, GitInfo, GitBranch, GitTag, GitCommit, GitCreateVersionParam, GitVersion, GitCreateConfigParam, GitConfig, CompileParams } from '../types/git';
import { DirNode } from '../types/common';
import * as path from 'path'
import config from '../config';
import { User } from '../types/user';
import fsUtil from '../utils/fsUtil';
import dashUtil from '../utils/dashUtil';

class GitService {
  async getRemoteGitList (): Promise<GitList[]>{
    const gitList = await gitDao.getRemoteGitList()
    return gitList
  }
  async query (): Promise<GitInstance[]> {
    // await gitDao.syncRep()
    const gitList = await gitDao.query()
    return gitList
  }
  async getInfoById (repoId: string): Promise<GitInfo> {
    return await gitDao.getInfo(repoId)
  }
  async getBranchsById (repoId: string | number): Promise<GitBranch[]> {
    return await gitDao.getBranchsById(repoId)
  }
  async getTagsById (repoId: string | number): Promise<GitTag[]> {
    return await gitDao.getTagsById(repoId)
  }
  async getCommitsById (repoId: string | number): Promise<GitCommit[]> {
    return await gitDao.getCommitsById(repoId)
  }
  async addVersion (param: GitCreateVersionParam, creatorId: string): Promise<GitVersion> {
    return await gitDao.addVersion(param, creatorId)
  }
  async initRepo (gitId: string, versionId: string, userId: string): Promise<string> {
    const gitInfo = await gitDao.getInfo(gitId)
    const workDir = path.resolve(config.compileDir, userId)
    await fsUtil.mkdir(workDir)
    const repoDir = path.resolve(workDir, gitInfo.name)
    const repoExist = await fsUtil.pathExist(repoDir)
    if (repoExist) { // 如果代码库已经clone到本地
      return repoDir
    } else { // 代码还没clone到本地
      await dashUtil.exec(`git clone ${gitInfo.gitRepo}`, {
        cwd: workDir
      })
      const version = await gitDao.getVersionById(versionId)
      switch (version.sourceType) {
        case 'branch':
        case 'commit':
          await dashUtil.exec(`git checkout ${version.sourceValue}`, {cwd: repoDir})
          break;
        case 'tag':
          await dashUtil.exec(`git checkout tags/${version.sourceValue}`, {cwd: repoDir})
          break;
      }
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
    return await gitDao.addConfig(config)
  }
  async deleteConfigById (configId: string): Promise<void> {
    await gitDao.deleteConfigById(configId)
  }
  async updateVersion (version: GitVersion): Promise<void> {
    await gitDao.updateVersion(version)
  }
  async deleteVersion (id: string): Promise<void> {
    await gitDao.deleteVersion(id)
  }
  async getCompileParams (id: string): Promise<CompileParams> {
    return await gitDao.getCompileParams(id)
  }
  async updateConfig (config: UpdateConfigParam ): Promise<GitConfig>{
    return await gitDao.updateConfg(config)
  }
  async updateGitStatus (List: UpdateGitStatus[]): Promise<void> {
    return await gitDao.updateGitStatus(List)
  }
  async deleteGit (id: string): Promise<void> {
    return await gitDao.deleteGit(id)
  }
}

export default new GitService()