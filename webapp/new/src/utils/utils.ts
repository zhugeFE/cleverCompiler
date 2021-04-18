class Util {

  type (obj: any): string {
    return Object.prototype.toString.call(obj)
  }

  isObject (obj: any): boolean {
    return this.type(obj) === '[object Object]'
  }

  isArray (obj: any): boolean {
    return this.type(obj) === '[object Array]'
  }

  isString (obj: any): boolean {
    return this.type(obj) === '[object String]'
  }

  isNumber (obj: any): boolean {
    return this.type(obj) === '[object Number]'
  }

  isDate (obj: any): boolean {
    return this.type(obj) === '[object Date]'
  }

  isFunction (obj: any): boolean {
    return this.type(obj) === '[object Function]'
  }

  /**
   * 为单数前补0
   * @param num
   * @returns {string}
   */
   toDoubleNumber(num: number) : string {
    return num > 9 ? String(num) : '0' + num
  }
  /**
   * 日期格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  dateFormat(date: Date = new Date(), formatter: string = 'yyyy-mm-dd'): string {
    return formatter
      .replace('yyyy', String(date.getFullYear()))
      .replace('mm', this.toDoubleNumber(date.getMonth() + 1))
      .replace('dd', this.toDoubleNumber(date.getDate()))
  }
  /**
   * 日期格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  timeFormat(date: (Date | number) = new Date(), formatter:(string | {
    s: string;
    h: string;
    m: string;
  }) = 'hh:mm:ss'): string {
    if (this.isDate(date)) {
      return (formatter as string)
        .replace('hh', this.toDoubleNumber((date as Date).getHours()))
        .replace('mm', this.toDoubleNumber((date as Date).getMinutes()))
        .replace('ss', this.toDoubleNumber((date as Date).getSeconds()))
    }
    // formatter 格式化规则 如:{s:'秒', h:'小时', m: '分钟'}
    const fmt = this.isObject(formatter) ? formatter : {}
    let s = parseInt((parseFloat(String(date)) / 1000).toFixed(0))
    let m = parseInt(String(s / 60))
    let h = parseInt(String(m / 60))
    s = s - m * 60
    m = m - h * 60
    let format: {
      s: string;
      m: string;
      h: string;
    } = this.mergeObject({
      s: 's',
      m: 'm',
      h: 'h'
    }, fmt) as {
      s: string;
      m: string;
      h: string;
    }
    let text = s + format.s
    text = (m ? m + format.m : '') + text
    text = (h ? h + format.h : '') + text
    return text
  }
  /**
   * 日期时间格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  dateTimeFormat(date: Date = new Date(), formatter: string = 'yyyy-mm-dd hh:mm:ss'): string {
    const formatList = formatter.split('hh')
    return (
      this.dateFormat(date, formatList[0]) +
      this.timeFormat(date, 'hh' + formatList[1])
    )
  }

  /**
   * 合并对象
   * @param defaults
   * @param extend
   * @returns {*}
   */
  mergeObject<T>(defaults: T, extend: T): T {
    Object.keys(defaults).forEach(key => {
      const defaultsProp = defaults[key]
      const extendProp = extend[key]
      if (this.isObject(defaultsProp)) {
        this.mergeObject(defaultsProp, extendProp)
      } else if (this.isArray(defaultsProp)) {
        if (this.isArray(extendProp)) {
          for (
            let i = 0;
            i < defaultsProp.length && i < extendProp.length;
            i += 1
          ) {
            extendProp[i] = this.mergeObject(defaultsProp[i], extendProp[i])
          }
        } else {
          // eslint-disable-next-line no-param-reassign
          extend[key] = defaultsProp
        }
      } else {
        // eslint-disable-next-line no-param-reassign
        extend[key] = this.isValid(extendProp) ? defaultsProp : extendProp
      }
    })
    return extend
  }

  clone<T> (obj: T): T {
    if (this.isObject(obj)) {
      const result = {}
      Object.keys(obj).forEach(key => {
        const prop = obj[key]
        result[key] = this.clone(prop)
      })
      return result as T
    } if (this.isArray(obj)) {
      const result = []
      for (let i = 0; i < (obj as unknown as []).length; i += 1) {
        const item = obj[i]
        result.push(this.clone(item))
      }
      return result as unknown as T
    }
    return obj
  }

  /**
   * 判断对象是否是null或undefined
   * @param obj
   * @returns {boolean}
   */
   isValid(obj: any): boolean {
    return obj === null || obj === undefined
  }
}
const util = new Util()
export default util