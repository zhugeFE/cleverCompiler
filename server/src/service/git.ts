import gitDao from '../dao/git'
import { GitInstance, GitInfo, GitBranch, GitTag, GitCommit, GitCreateVersionParam, GitVersion, GitCreateConfigParam, GitConfig } from '../types/git';
import { DirNode } from '../types/common';
import * as path from 'path'
import config from '../config';
import { User } from '../types/user';
import fsUtil from '../utils/fsUtil';
import dashUtil from '../utils/dashUtil';

class GitService {
  async query (): Promise<GitInstance[]> {
    let gitList = await gitDao.query()
    if (!gitList.length) { // 如果一个库都没查到，则默认同步一下git数据
      await gitDao.syncRep()
      gitList = await gitDao.query()
    }
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
  async addVersion (param: GitCreateVersionParam): Promise<GitVersion> {
    return await gitDao.addVersion(param)
  }
  async initRepo (gitId: string, versionId: string, userId: string): Promise<string> {
    const gitInfo = await gitDao.getInfo(gitId)
    const workDir = path.resolve(config.compileDir, userId)
    await fsUtil.mkdir(workDir)
    const repoDir = path.resolve(workDir, gitInfo.name)
    const repoExist = await fsUtil.pathExist(repoDir)
    if (!repoExist) {
      await dashUtil.exec(`git clone ${gitInfo.gitRepo}`, {
        cwd: workDir
      })
    }
    const version = await gitDao.getVersionById(versionId)
    // 清空目录下所有的修改，并且将内容更新到最新
    await dashUtil.exec(`git checkout .`, {cwd: repoDir})
    await dashUtil.exec(`git clean -df`, {cwd: repoDir})
    await dashUtil.exec('git fetch --all', {cwd: repoDir})
    switch (version.sourceType) {
      case 'branch':
      case 'commit':
        await dashUtil.exec(`git checkout ${version.sourceValue}`, {cwd: repoDir})
        break;
      case 'tag':
        await dashUtil.exec(`git checkout tags/${version.sourceValue}`, {cwd: repoDir})
        break;
    }
    await dashUtil.exec(`git checkout .`, {cwd: repoDir})
    await dashUtil.exec(`git clean -df`, {cwd: repoDir})
    if (version.sourceType === 'branch') await dashUtil.exec(`git pull`, {cwd: repoDir})
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
}

export default new GitService()