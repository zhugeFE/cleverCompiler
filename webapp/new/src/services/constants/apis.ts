/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-13 16:57:36
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
  }
}