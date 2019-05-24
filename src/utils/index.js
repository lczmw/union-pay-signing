// 获取日期,默认当前时间
export function getDay(type, date = new Date(), addYear) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var days = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var milliseconds = date.getMilliseconds()
  month = month < 10 ? '0' + month : month
  days = days < 10 ? '0' + days : days
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  if (milliseconds < 100) {
    milliseconds = '0' + milliseconds
    if (milliseconds < 10) {
      milliseconds = '0' + milliseconds
    }
  }
  switch (type) {
    case 'dayTime':
      return (
        year.toString() +
        '-' +
        month.toString() +
        '-' +
        days.toString() +
        ' ' +
        hour.toString() +
        ':' +
        minute.toString() +
        ':' +
        second.toString()
      )
    case 'day':
      return year.toString() + '-' + month.toString() + '-' + days.toString()
    case 'month':
      return year.toString() + '-' + month.toString()
    case 'year':
      return year.toString()
    case 'milliseconds':
      return (
        year.toString() +
        month.toString() +
        days.toString() +
        hour.toString() +
        minute.toString() +
        second.toString() +
        milliseconds.toString()
      )
    case 'addYear':
      if (date.getMonth() == 1 && !isLeapYear && days == 29) {
        days = 28
      }
      return (
        parseInt(year + addYear).toString() +
        '-' +
        month.toString() +
        '-' +
        days.toString()
      )
    default:
      return year.toString() + '-' + month.toString() + '-' + days.toString()
  }
}
function isLeapYear(year) {
  // 如果year年2月没有29则自动进一变为3月1日
  var date = new Date(year, 1, 29)
  return date.getDate() === 29
}


/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = (name, parse = false) => {
  if (!name) return;
    let value = window.localStorage.getItem(name);
  return parse ? JSON.parse(value) : value;
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}