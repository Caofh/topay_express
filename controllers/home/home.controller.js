
var home = function (res) {
  var timeControl = require('../../public/javascripts/unit/of-vendor/time-control.js')

  var end_time = '2018-2-15' // 2018年过年时间
  var end = new Date(end_time.replace(/-/g, '/')) // 生成时间戳
  var diff_count = timeControl.diff_now(end) // 输出两时间差值（单位天）

  // console.log(diff_count)

  res.render('home', {
    title: 'Express' ,
    day: diff_count
  });
}

module.exports = home


