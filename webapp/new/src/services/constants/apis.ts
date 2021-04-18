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