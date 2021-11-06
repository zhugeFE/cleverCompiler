import { UpdateGitStatus } from './../models/git';
import { GitCreateVersionParam, GitTextConfigParam, GitUpdateVersionParam, GitConfig } from '@/models/git';
import request from '@/utils/request';
import apis from './constants/apis';

class GitService {
  async queryRemoteGitList() {
    return request(apis.git.queryRemoteGitList)
  }

  async query () {
    return request(apis.git.queryGitList)
  }
  async getFileTree (params: {
    /**
     * gitId
     */
    id: string;
    /**
     * 版本id
     */
    versionId: string;
  }) {
    return request(apis.git.getFileTree, {
      method: 'get',
      params
    })
  }
  async getInfo (id: string) {
    return request(apis.git.getInfo, {
      params: {
        id
      }
    })
  }

  async queryBranchs (gitId: string) {
    return request(apis.git.queryBranch, {
      params: {
        gitId
      }
    })
  }

  async queryTags (gitId: string) {
    return request(apis.git.queryTags, {
      params: {
        gitId
      }
    })
  }

  async queryCommits (gitId: string) {
    return request(apis.git.queryCommits, {
      params: {
        gitId
      }
    })
  }

  async createVersion (param: GitCreateVersionParam) {
    return request(apis.git.createVersion, {
      method: 'post',
      data: param
    })
  }

  async addConfig (data: GitTextConfigParam) {
    return request(apis.git.addConfig, {
      requestType: 'form',
      method: 'post',
      data: data
    })
  }

  async delConfig (configId: string) {
    return request(apis.git.delConfig, {
      method: 'delete',
      params: {
        configId
      }
    })
  }

  async getFileContent (filePath: string) {
    return request(apis.git.fileCat, {
      method: 'get',
      params: {
        filePath
      }
    })
  }

  async updateVersion (data: GitUpdateVersionParam) {
    return request(apis.git.updateVersion, {
      method: 'post',
      data
    })
  }

  async deleteVersion (versionId: string) {
    return request(apis.git.deleteVersion, {
      method: 'delete',
      params: {
        id: versionId
      }
    })
  }

  async updateGitStatus (gitList: UpdateGitStatus[]) {
    return request(apis.git.updateGitStatus, {
      method: 'post',
      data: gitList
    })
  }

  async updateGitVersionStatus (data: {id: string, status: number}) {
    return request(apis.git.updateGitVersionStatus, {
      method: "post",
      data
    })
  }
  async updateConfig(config: GitConfig) {
    return request(apis.git.updateConfig, {
      requestType: "form",
      method: "post",
      data: config
    })
  }
  async deletGitInfo (id: string) {
    return request(apis.git.deleteGit, {
      method: "delete",
      params: {
        id
      }
    })
  }
}

const gitService = new GitService()
export default gitService