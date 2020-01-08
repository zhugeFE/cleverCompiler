import * as _ from 'lodash';
export default {
  toCamelObj(obj: object) :object {
    let result = {}
    for (let key in obj) {
      if (_.isFunction(obj[key])) continue
      result[_.camelCase(key)] = obj[key]
    }
    return result
  }
}