import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

class Util {
  toCamelObj(obj: object): object {
    const result = {}
    for (const key in obj) {
      if (_.isFunction(obj[key])) continue
      result[_.camelCase(key)] = obj[key]
    }
    return result
  }
  uuid (): string {
    return uuidv4()
  }
  getType (target: any): string {
    const type = Object.prototype.toString.call(target) as string
    return type.split(/\s/)[1].replace(']', '').toLowerCase()
  }
}
export default new Util()