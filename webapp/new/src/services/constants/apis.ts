/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-19 16:45:51
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
    updateConfig: '/git/config/update',
    updateVersion: '/git/version/update',
    deleteVersion: '/git/version',
    updateGitStatus: '/git/status',
    updateGitVersionStatus: '/git/version/status',
    deleteGit: '/git/info'
  },
  template: {
    createTemplate: '/template/add',
    getInfo: '/template/{{id}}/info',
    getTemplateVersionInfo: '/template/version/list',
    queryTemplateList: '/template/list',
    updateTemplateStatus: "/template/status",
    copyTemplate: '/template/copy',
    getVersionInfo: '/template/version/{{id}}/info',
    addVersion: '/template/version/add',
    delVersion: '/template/version',
    updateVersion: '/template/version/update',
    updateVersionStatus: '/template/version/status',
    addVersionGit: '/template/git/add',
    delVersionGit: '/template/git',
    changeGitVersion: '/template/version/changeGitVersion',
    addConfig: '/template/config/add',
    updateConfig: '/template/config/update',
    updateConfigStatus: '/template/config/status/update',
    updateConfigGlobalConfig: '/template/config/globalConfig/update',
    delConfig: '/template/config',
    addGlobalConfig: '/template/globalconfig/add',
    updateGlobalConfig: '/template/globalconfig/update',
    updateGlobalConfigStatus: '/template/globalconfig/status/update',
    delGlobalConfig: '/template/globalconfig',
    deleteTemplate: '/template/info'
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
    compileParamInfo: '/project/compile',
  },
  customer: {
    getInfo: '/customer/{{id}}/info',
    createCustomer: '/customer/add',
    customerList: '/customer/list',
    updateCustomer: '/customer/update',
    deleteCustomer: '/customer/delete'
  },
  download: {
    downloadFile: '/download'
  }
  
}