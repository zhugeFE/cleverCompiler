/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-18 17:27:07
 */
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
    queryRemoteGitList: '/git/remotelist',
    queryGitList: '/git/list',
    getFileTree: '/git/filetree',
    getInfo: '/git/{{id}}/info',
    queryBranch: '/git/{{gitId}}/branchs',
    queryTags: '/git/{{gitId}}/tags',
    queryCommits: '/git/{{gitId}}/commits',
    createVersion: '/git/version/add',
    fileCat: '/git/cat',
    addConfig: '/git/config/add',
    delConfig: '/git/config',
    updateVersion: '/git/version/update',
    deleteVersion: '/git/version'
  },
  template: {
    createTemplate: '/template/add',
    getInfo: '/template/{{id}}/info',
    queryTemplateList: '/template/list',
    updateTemplateStatus: "/template/update",
    getVersionInfo: '/template/version/{{id}}/info',
    addVersion: '/template/version/add',
    delVersion: '/template/version',
    updateVersion: '/template/version/update',
    addVersionGit: '/template/git/add',
    delVersionGit: '/template/git',
    addConfig: '/template/config/add',
    updateConfig: '/template/config/update',
    delConfig: '/template/config',
    addComConfig: '/template/comconfig/add',
    updateComConfig: '/template/comconfig/update',
    delComConfig: '/template/comconfig'
  },
  compile: {
    createCompile: '/compile/add',

  },
  project: {
    getInfo: '/project/{{id}}/info',
    createProject: '/project/add',
    updateProject: '/project/update',
    projectList: '/project/list',
    getMemberList: "/project/members",
    compileInfo: '/project/{{id}}/list',
  },
  customer: {
    getInfo: '/customer/{{id}}/info',
    createCustomer: '/customer/add',
    customerList: '/customer/list',
    updateCustomer: '/customer/update',
    deleteCustomer: '/customer/delete'
  },
  download: {
    getDownloadFilePath: '/download/info',
    downloadFile: '/download'
  }
  
}