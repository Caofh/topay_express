/**
 * Created by caofanghui on 17/7/20.
 */

/* 计算时间差值各种方法(注：输入参数均为时间戳，如下示例)
  var start_time = '2017-3-5'
  var end_time = '2017-3-7'

  var start = new Date(start_time.replace(/-/g, '/')) // 生成时间戳
  var end = new Date(end_time.replace(/-/g, '/')) // 生成时间戳

  var diff_count = timeControl.diff(start, end) // 输出两时间差值（单位天）
  console.log(diff_count) // 输出:  2

  var diff_count_now = timeControl.diff_now(end) // 输出时间距当前时间的差值（单位天）
  console.log(diff_count_now) // 输出： end 距离 当前时间的差值

 */

var timeControl = {}

// 取两个时间差值（单位天）
timeControl.diff = function (start_time, end_time) {
  var start = start_time ? start_time : ''
  var end = end_time ? end_time : ''

  if (start && end) {
    return (end - start) / 86400000
  } else {
    throw new error('start_time and end_time is the musted!')
  }
}

// 取输入时间距当前时间的差值（单位天）(end_time可比当前时间大，也可比当前时间小)
timeControl.diff_now = function (end_time) {
  var now = (new Date()).valueOf()
  var end = end_time ? end_time : ''

  if (end) {
    // 这里取个向上取整的值，由于当前时间时刻变化，结果是小数，故取向上\向下取整，得到实际的天数差值.
    if (end >= now) {
      return Math.ceil(Math.abs((end - now) / 86400000))
    } else {
      return Math.floor(Math.abs((end - now) / 86400000))
    }
  } else {
    throw new error('end_time is the musted!')
  }
}


module.exports = timeControl