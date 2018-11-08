var request = require('request');

// 请求默认配置
var defaultOptions = {
  headers: {"Connection": "close"},
  url: '',
  method: 'get',
  json: true,
  body: {},
  callback: function () {}
};




var methed = {
  // 请求其他接口方法
  api: function (option) {

    var targetOption = Object.assign(defaultOptions, option)

    request(targetOption, targetOption.callback);
  },

  // 格式化输出
  outFormat: function (json) {
    var timestamp = new Date().getTime()

    var defaultJson =  {
      data: json.data || null,
      update_time: timestamp,
      msg: json.status && json.status == 'success' ? '请求成功' : '请求失败',
      status: 'success'
    }

    var targetJson = Object.assign(defaultJson, json)

    return targetJson

  },

  // 格式化数组（数组变字符串存库）
  arrToStr: function (arr) {
    if (!arr) return arr
    var arrNew = eval(arr.slice())
    return JSON.stringify(arrNew)
  },
  // 格式化字符串（字符串变数组取库）
  strToArr: function (str) {
    if (!str) return str
    return JSON.parse(str)
  },

  // 字符传前后加'\''，转为数据库查询形式
  toDatabaseStr: function (str) {
    var str_new = '\'' + str + '\''

    return str_new
  }


}

module.exports = methed;