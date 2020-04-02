import gitDao from '../dao/git'
import { GitInstance, GitInfo, GitBranch, GitTag, GitCommit, GitCreateVersionParam } from '../types/git';
import { Version, DirNode } from '../types/common';
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
  async addVersion (param: GitCreateVersionParam): Promise<Version> {
    return await gitDao.addVersion(param)
  }
  async getFileTree (id: string, currentUser: User): Promise<DirNode[]> {
    const gitInfo = await gitDao.getInfo(id)
    const workDir = path.resolve(config.compileDir, currentUser.id)
    await fsUtil.mkdir(workDir)
    const repoDir = path.resolve(workDir, gitInfo.name)
    const repoExist = await fsUtil.pathExist(repoDir)
    if (!repoExist) {
      await dashUtil.exec(`git clone ${gitInfo.gitRepo}`, {
        cwd: workDir
      })
    }
    return fsUtil.getDirTree(repoDir)
  }
}

export default new GitService()