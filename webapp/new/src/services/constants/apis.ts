export default {
  user: {
    getCurrent: '/user/getCurrent',
    login: '/user/login'
  },
  sys: {
    init: '/sys/init'
  },
  base: {
    queryConfigTypes: '/sys/configtypes',
    queryRoles: '/sys/roles'
  },
  git: {
    queryGitList: '/git/list',
    getFileTree: '/git/filetree',
    getInfo: '/git/{{id}}/info',
    queryBranch: '/api/git/{{gitId}}/branchs',
    queryTags: '/api/git/{{gitId}}/tags',
    queryCommits: '/api/git/{{gitId}}/commits',
    createVersion: '/api/git/version/add',
    fileCat: '/git/cat',
    addConfig: '/git/config/add',
    delConfig: '/git/config',
    updateVersion: '/git/version/update',
    deleteVersion: '/git/version'
  },
  template: {
    add: '/template/add',
    query: '/template/query'
  }
}