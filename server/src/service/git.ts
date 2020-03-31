import gitDao from '../dao/git'
import { GitInstance, GitInfo, GitBranch, GitTag, GitCommit, GitCreateVersionParam } from '../types/git';

class GitService {
  async query (): Promise<GitInstance[]> {
    let gitList = await gitDao.query()
    if (!gitList.length) { // 如果一个库都没查到，则默认同步一下git数据
      await gitDao.syncRep()
      gitList = await gitDao.query()
    }
    return gitList
  }
  async getInfoById (id: string): Promise<GitInfo> {
    return await gitDao.getInfo(id)
  }
  async getBranchsById (id: string | number): Promise<GitBranch[]> {
    return await gitDao.getBranchsById(id)
  }
  async getTagsById (id: string | number): Promise<GitTag[]> {
    return await gitDao.getTagsById(id)
  }
  async getCommitsById (id: string | number): Promise<GitCommit[]> {
    return await gitDao.getCommitsById(id)
  }
  async addVersion (param: GitCreateVersionParam): Promise<void> {
    await gitDao.addVersion(param)
  }
}

export default new GitService()