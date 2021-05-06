import { ConfigType } from '@/models/common';
import { GitCreateVersionParam, GitTextConfigParam, GitUpdateVersionParam } from '@/models/git';
import request from '@/utils/request';
import apis from './constants/apis';

class GitService {
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
}

const gitService = new GitService()
export default gitService