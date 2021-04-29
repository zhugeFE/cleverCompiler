import request from '@/utils/request';
import apis from './constants/apis';

class GitService {
  async query () {
    return request(apis.git.queryGitList)
  }
  async getFileTree (data: {
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
      method: 'post',
      data
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
}

const gitService = new GitService()
export default gitService