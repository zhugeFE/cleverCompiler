import * as _ from 'lodash';

class Util {
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
    if (_.isDate(date)) {
      return (formatter as string)
        .replace('hh', this.toDoubleNumber(date.getHours()))
        .replace('mm', this.toDoubleNumber(date.getMinutes()))
        .replace('ss', this.toDoubleNumber(date.getSeconds()))
    } else if (_.isNumber(date)) {
      // formatter 格式化规则 如:{s:'秒', h:'小时', m: '分钟'}
      const fmt = _.isObject(formatter) ? formatter : {}
      let s = parseInt((parseFloat(String(date)) / 1000).toFixed(0))
      let m = parseInt(String(s / 60))
      let h = parseInt(String(m / 60))
      s = s - m * 60
      m = m - h * 60
      let format = {
        s: 's',
        m: 'm',
        h: 'h'
      }
      format = _.assignIn(format, fmt || {})
      let text = s + format.s
      text = (m ? m + format.m : '') + text
      text = (h ? h + format.h : '') + text
      return text
    }
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
}
export default new Util()