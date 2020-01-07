const apis = {
  common: {
    queryVersions: '/api/proxy/getVersions',
    queryTags: '/api/proxy/getTags/{id}',
    queryBranches: '/api/proxy/getBranches/{id}'
  },
  project: {
    addProject: '',
    editProject: '',
    queryProjectTree: '/api/oem/getProjectTree/{name}'
  }
}

export default apis
