export default {
  user: {
    getCurrent: '/api/user/getCurrent',
    login: '/api/user/login'
  },
  sys: {
    init: '/api/sys/init'
  },
  base: {
    queryConfigTypes: '/api/sys/configtypes',
    queryRoles: '/api/sys/roles'
  },
  git: {
    queryGitList: '/api/git/list',
    getFileTree: '/api/git/filetree',
    fileCat: '/api/git/cat',
    addConfig: '/api/git/config/add',
    delConfig: '/api/git/config',
    updateVersion: '/api/git/version/update',
    deleteVersion: '/api/git/version'
  },
  template: {
    add: '/api/template/add'
  }
}