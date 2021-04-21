import request from '@/utils/request';
import apis from './constants/apis';

class GitService {
  async query () {
    return request(apis.git.queryGitList)
  }
}

const gitService = new GitService()
export default gitService