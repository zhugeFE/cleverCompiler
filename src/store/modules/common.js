import { actions } from '../constants'
// import { ajax, util } from '../../utils'

// 测试数据
import versions from '../json/queryVersions'
import tags from '../json/queryTags'

export default {
  state: {
    publicTypes: [
      {id: 1, name: '发布测试'},
      {id: 2, name: '常规迭代'},
      {id: 3, name: '私有部署'}
    ],
    sourceTypes: [
      {name: 'tag', value: 'tag'},
      {name: 'branch', value: 'branch'}
    ]
  },
  actions: {
    [actions.common.queryVersions] (context, params) {
      return new Promise((resolve, reject) => {
        try {
          console.log(context, params)
          setTimeout(() => {
            resolve(versions.data)
          }, 1000)
        } catch (e) {
          reject(e)
        }
        // ajax({
        //   url: apis.common.queryVersions,
        //   method: 'post',
        //   data: params
        // }).then((res) => {
        //   resolve(res.data)
        // }).catch((error) => {
        //   reject(error)
        // })
      })
    },
    [actions.common.queryBranches] (context, id) {
      return new Promise((resolve, reject) => {
        try {
          console.log(context, id)
          setTimeout(() => {
            resolve(tags.data)
          }, 1000)
        } catch (e) {
          reject(e)
        }
        // ajax({
        //   url: util.strReplace(apis.common.queryBranches, {id}),
        //   method: 'get'
        // }).then((res) => {
        //   resolve(res.data)
        // }).catch((error) => {
        //   reject(error)
        // })
      })
    },
    [actions.common.queryTags] (context, id) {
      return new Promise((resolve, reject) => {
        try {
          console.log(context, id)
          setTimeout(() => {
            resolve(tags.data)
          }, 1000)
        } catch (e) {
          reject(e)
        }
        // ajax({
        //   url: util.strReplace(apis.common.queryTags, {id}),
        //   method: 'get'
        // }).then((res) => {
        //   resolve(res.data)
        // }).catch((error) => {
        //   reject(error)
        // })
      })
    }
  }
}
