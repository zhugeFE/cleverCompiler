/**
 * Created by yqdong on 2017/5/3.
 * qq: 1013501639
 * @author yqdong
 *
 */
const util = {
  type(obj) {
    return Object.prototype.toString.call(obj)
  },
  isObject(obj) {
    return this.type(obj) === '[object Object]'
  },
  isArray(obj) {
    return this.type(obj) === '[object Array]'
  },
  isString(obj) {
    return this.type(obj) === '[object String]'
  },
  isNumber(obj) {
    return this.type(obj) === '[object Number]'
  },
  isDate(obj) {
    return this.type(obj) === '[object Date]'
  },
  isFunction(obj) {
    return this.type(obj) === '[object Function]'
  },
  /**
   *
   */
  isEmpty(obj) {
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        return false
      }
    }
    return true
  },
  /**
   * 判断对象是否是null或undefined
   * @param obj
   * @returns {boolean}
   */
  isValid(obj) {
    return obj === null || obj === undefined
  },
  /**
   * 判断两个对象是否相同
   * @param a
   * @param b
   * @returns {boolean}
   */
  isEqual(a = {}, b = {}) {
    return JSON.stringify(a) === JSON.stringify(b)
  },
  /**
   * 合并对象
   * @param defaults
   * @param extend
   * @returns {*}
   */
  mergeObject(defaults = {}, extend = {}) {
    for (let key in defaults) {
      let defaultsProp = defaults[key]
      let extendProp = extend[key]
      if (this.isObject(defaultsProp)) {
        this.mergeObject(defaultsProp, extendProp)
      } else if (this.isArray(defaultsProp)) {
        if (this.isArray(extendProp)) {
          for (
            let i = 0;
            i < defaultsProp.length && i < extendProp.length;
            i++
          ) {
            extendProp[i] = this.mergeObject(defaultsProp[i], extendProp[i])
          }
        } else {
          extend[key] = defaultsProp
        }
      } else {
        extend[key] = this.isValid(extendProp) ? defaultsProp : extendProp
      }
    }
    return extend
  },
  /**
   * 字符串占位符替换
   * @param str
   * @param obj
   * @returns {*}
   */
  strReplace(str, obj) {
    const matchList = str.match(/\{\S*?\}/g) || []
    matchList.forEach(item => {
      const key = item.replace(/\{|\}/g, '')
      str = str.replace(item, obj[key] || '')
    })
    return str
  },
  /**
   * 从中间拆分字符串,长度超出的话，解析为xxx...xxx
   * @param str
   * @param config
   * @returns {*}
   */
  strMiddleSplit(
    str,
    config = {
      maxLength: 20,
      beginLength: 8,
      endLength: 8,
      replaceStr: '...'
    }
  ) {
    str += ''
    /* eslint-disable no-control-regex */
    let reg = {
      fullCharReg: /[^\x00-\xff]/,
      fullCharsReg: /[^\x00-\xff]/g,
      anyChars: /[\S\s]{1}/g
    }

    let fullCharLength = (str.match(reg.fullCharsReg) || []).length
    let fullLength = str.length + fullCharLength
    let beginArr = []
    let beginLength = 0
    let endArr = []
    let endLength = 0

    if (fullLength > config.maxLength) {
      let strArr = str.match(reg.anyChars)

      strArr.forEach(char => {
        if (beginLength >= config.beginLength) return
        let len = reg.fullCharReg.test(char) ? 2 : 1
        beginLength += len
        beginArr.push(char)
      })

      strArr.reverse().forEach(char => {
        if (endLength >= config.endLength) return
        let len = reg.fullCharReg.test(char) ? 2 : 1
        endLength += len
        endArr.push(char)
      })

      return beginArr.join('') + config.replaceStr + endArr.reverse().join('')
    }

    return str
  },
  /**
   * 获取字符串长度，区分中英文
   * @param str
   * @returns {number}
   */
  getStrFullLength(str) {
    /* eslint-disable no-control-regex */
    let reg = {
      fullCharReg: /[^\x00-\xff]/,
      fullCharsReg: /[^\x00-\xff]/g,
      anyChars: /[\S\s]{1}/g
    }

    let fullCharLength = (str.match(reg.fullCharsReg) || []).length
    let fullLength = str.length + fullCharLength
    return fullLength
  },
  matchArray(reg, str) {
    let result = []
    let match
    while ((match = reg.exec(str))) {
      result.push(match[0])
    }
    return result
  },
  getHrefData(url) {
    let search = decodeURIComponent(
      url ? url.replace(/\S*\?/, '') : location.search.replace('?', '')
    )
    let params = []
    let data = {}
    // 这个正则用来取筛选条件
    params = this.matchArray(/[^=]+=("{.*}"|[^=&]+)/g, search).map(param => {
      if (param.indexOf('&') === 0) {
        return param.replace('&', '')
      } else {
        return param
      }
    })
    params.forEach(item => {
      let index = item.indexOf('=')
      let key = item.slice(0, index)
      let value = item.slice(index + 1)
      data[key] = value
    })
    return data
  },
  /**
   * 为单数前补0
   * @param num
   * @returns {string}
   */
  toDoubleNumber(num) {
    num += ''
    return num > 9 ? num : '0' + num
  },
  /**
   * 日期格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  dateFormat(date = new Date(), formatter = 'yyyy-mm-dd') {
    return formatter
      .replace('yyyy', date.getFullYear())
      .replace('mm', this.toDoubleNumber(date.getMonth() + 1))
      .replace('dd', this.toDoubleNumber(date.getDate()))
  },
  /**
   * 日期格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  timeFormat(date = new Date(), formatter = 'hh:mm:ss') {
    if (this.isDate(date)) {
      return formatter
        .replace('hh', this.toDoubleNumber(date.getHours()))
        .replace('mm', this.toDoubleNumber(date.getMinutes()))
        .replace('ss', this.toDoubleNumber(date.getSeconds()))
    } else if (this.isNumber(date)) {
      // formatter 格式化规则 如:{s:'秒', h:'小时', m: '分钟'}
      formatter = this.isObject(formatter) ? formatter : {}
      let s = parseInt((parseFloat(date) / 1000).toFixed(0))
      let m = parseInt(s / 60)
      let h = parseInt(m / 60)
      s = s - m * 60
      m = m - h * 60
      let format = {
        s: 's',
        m: 'm',
        h: 'h'
      }
      format = this.mergeObject(format, formatter || {})
      let text = s + format.s
      text = (m ? m + format.m : '') + text
      text = (h ? h + format.h : '') + text
      return text
    }
  },
  /**
   * 日期时间格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  dateTimeFormat(date = new Date(), formatter = 'yyyy-mm-dd hh:mm:ss') {
    formatter = formatter.split('hh')
    return (
      this.dateFormat(date, formatter[0]) +
      this.timeFormat(date, 'hh' + formatter[1])
    )
  },
  /**
   * 格式化字符串为时间（例"2017-01-01" 或"20170101"）
   * @param {string} str
   * @returns {string}
   */
  getDate(str) {
    let timeArr = str.match(/(\d{4})[^0-9]*(\d{2})[^0-9]*(\d{2})/) || []
    return new Date(timeArr.slice(1, 4).join('/'))
  },
  /**
   * xss注入处理
   */
  xssEncode(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  },
  /**
   * 字符串转为驼峰格式, eg: a_b ==> aB
   * @param str
   * @returns {string}
   */
  toCamel(str = '') {
    var matchArr = str.match(/_\S/g) || []
    matchArr.forEach(item => {
      str = str.replace(item, item.replace('_', '').toUpperCase())
    })
    return str
  },
  /**
   * 将驼峰格式字符串转化为下划线格式，eg：aB ===> a_b
   * @param str
   * @returns {string}
   */
  toUnderLine(str = '') {
    var matchArr = str.match(/[A-Z]/g) || []
    matchArr.forEach(item => {
      str = str.replace(item, '_' + item.toLowerCase())
    })
    return str
  },
  /**
   * 转为驼峰命名规范对象
   * @param obj
   * @returns {{}}
   */
  toCamelObj(obj = {}) {
    var result = {}
    for (let key in obj) {
      if (this.isFunction(obj[key])) continue
      result[this.toCamel(key)] = obj[key]
    }
    return result
  },
  /**
   * 转为下划线命名规范对象
   * @param obj
   * @returns {{}}
   */
  toUnderLineObj(obj = {}) {
    var result = {}
    for (let key in obj) {
      if (this.isFunction(obj[key])) continue
      result[this.toUnderLine(key)] = obj[key]
    }
    return result
  },
  /**
   * 根据指定url和参数对象，转成url格式字符串
   * @param url
   * @param param
   * @returns {string}
   */
  toUrl(url = '', param = {}) {
    var params = []
    var prefix = /\?/.test(url) ? '&' : '?'
    for (let key in param) {
      params.push(`${key}=${param[key]}`)
    }
    return `${url}${prefix}${params.join('&')}`
  },
  /**
   * 将数字转为千分位分割格式
   * @param num
   * @returns {string}
   */
  toThousands(num = 0) {
    var source = String(num).split('.') // 按小数点分成2部分
    source[0] = source[0].replace(
      new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'),
      '$1,'
    )
    return source.join('.') // 再将小数部分合并进来
  },
  clone(obj) {
    if (this.isObject(obj)) {
      let result = {}
      for (let key in obj) {
        const prop = obj[key]
        result[key] = this.clone(prop)
      }
      return result
    } else if (this.isArray(obj)) {
      let result = []
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i]
        result.push(this.clone(item))
      }
      return result
    } else {
      return obj
    }
  },
  isEmptyObj(obj) {
    return JSON.stringify(obj) === '{}'
  },
  /**
   * 除法计算
   * @param {number} numerator 分子
   * @param {number} denominator 分母
   * @param {number} precision 小数精度
   * @returns {string}
   */
  divisionCalculation(numerator, denominator, precision = 2) {
    let data = 0
    if (numerator && denominator) {
      precision = Math.pow(10, precision)
      numerator = numerator * precision
      data = Math.floor(numerator / denominator) / precision
    }
    return data
  },
  /**
   * 计算百分比值
   * @param {number} numerator 分子
   * @param {number} denominator 分母
   * @param {number} precision 小数精度
   * @returns {string}
   */
  percentCalculate(numerator, denominator, precision = 2) {
    let data = 0
    if (numerator && denominator) {
      precision = Math.pow(10, precision)
      numerator = numerator * precision * 100
      data = Math.floor(numerator / denominator) / precision
    }
    return data + '%'
  },
  copy(text, onSuccess, onError) {
    let id = 'zgClipboardInput'
    if (!document.getElementById(id)) {
      let input = document.createElement('input')
      input.type = 'text'
      input.id = id
      input.style = 'position: fixed; top: -9999999px; z-index: -9999999'
      document.body.appendChild(input)
    }
    let input = document.getElementById(id)
    input.value = text
    input.focus()
    input.setSelectionRange(0, text.length)
    let result = false
    result = document.execCommand('copy', true)
    if (result) {
      if (this.isFunction(onSuccess)) {
        onSuccess()
      }
    } else {
      if (this.isFunction(onError)) {
        onError()
      }
    }
  },
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    )
  },
  /**
   * 格式化store中常量的值：actions、getters、mutations
   * @param constant
   * @param prefix
   */
  initializeConstants(constant, prefix) {
    for (let prop in constant) {
      let val = constant[prop]
      if (util.isObject(val)) {
        this.initializeConstants(val, `${prefix}-${prop}`)
      } else {
        constant[prop] = `${prefix}-${prop}`
      }
    }
  },
  getDomain(url) {
    var arr = url.match(/https?:\/\/\S*?\//)
    if (arr && arr.length) {
      return arr[0].replace(/\//g, '')
    }
    return ''
  },
  /**
   * 存储信息到sessionStorage
   * 使用方法同sessionStorage.setItem但仅更新已经存在的key
   * 作用：和老平台代码数据同步@完全改版后需删除
   * @param key
   * @param value
   */
  storageSetItem(key, value) {
    try {
      if (sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, value)
      }
    } catch (e) {
      sessionStorage.removeItem(key)
    }
  },
  isPC() {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return !userAgent.includes('mobile')
  },
  /**
   * 通过相对时间，获取绝对时间
   * @param unit  相对时间单位，天、周、月
   * @param count 相对多少天、周、月
   * @param maxDate 最大时间（一般是今天或者昨天，即是否支持实时）
   * @returns {{startDate: null, endDate: null}}
   */
  getAbsoluteDate(unit, count, maxDate) {
    let res = {
      startDate: null,
      endDate: null
    }
    let dayTime = 24 * 60 * 60 * 1000
    let firstOfWeek = null
    let firstOfMonth = null
    switch (unit) {
      case 'hour':
        res.endDate = res.startDate = new Date(
          new Date().getTime() - count * dayTime
        )
        break
      case 'day':
        res.startDate = new Date(new Date().getTime() - count * dayTime)
        res.endDate = maxDate
        break
      case 'week':
        res.endDate = maxDate
        // 减一是因为这里以周一为一周的第一天，如果以周日为第一天，则去掉就行
        firstOfWeek = new Date(
          maxDate.getTime() - (maxDate.getDay() - 1) * dayTime
        )
        res.startDate = new Date(firstOfWeek.getTime() - count * 7 * dayTime)
        break
      case 'month':
        res.endDate = maxDate
        // 这里-1是为了将日期置为一号
        firstOfMonth = new Date(
          maxDate.getTime() - (maxDate.getDate() - 1) * dayTime
        )
        firstOfMonth.setMonth(firstOfMonth.getMonth() - count)
        res.startDate = new Date(firstOfMonth)
        break
    }
    return res
  },
  /**
   * 区分中英文截取字符串长度
   **/
  splitString(str, olength, suffix) {
    let resString = ''
    let len = 0
    /* eslint-disable no-control-regex */
    let reg = new RegExp(/[^\x00-\xff]/)
    /* eslint-enable no-control-regex */
    let isOverflow = false
    suffix = suffix || '...'
    for (let i = 0; i < str.length; i++) {
      let char = str.charAt(i)
      len += reg.test(char) ? 2 : 1
      if (len <= olength) {
        resString += char
      } else {
        isOverflow = true
      }
    }
    return {
      str: isOverflow ? resString + suffix : resString,
      len: len
    }
  }
}

export default util
