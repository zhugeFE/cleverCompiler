import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
export default {
  toCamelObj(obj: object): object {
    const result = {}
    for (const key in obj) {
      if (_.isFunction(obj[key])) continue
      result[_.camelCase(key)] = obj[key]
    }
    return result
  },
  uuid (): string {
    return uuidv4()
  }
}