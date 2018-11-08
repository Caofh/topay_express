
var baseData = require('../common')
var core = require('../core')
var apiList = require('../unit/api_list')


var home = function (req, res, next) {
  //get请求取参
  var key = baseData.key;
  var city = req.query.city && req.query.city !== '' ? encodeURIComponent(req.query.city) : '';
  var province = req.query.province && req.query.province !== '' ? encodeURIComponent(req.query.province) : '';

  // 请求获取天气开放接口
  var proxy_url = apiList.weatherList + '?key='+key+'&city='+city+'&province='+province+'';
  core.api({
    url: proxy_url,
    method: 'get',
    callback: function (error, response, data) {
      // console.log(response.statusCode)
      if (!error && response.statusCode == 200) {

        // 格式化输出数据
        var outData = core.outFormat({
          data: data.result || null,
          status: 'success'
        })
        res.json(outData)

      } else {
        // res.json(error)

        // 格式化输出数据
        var outData = core.outFormat({
          status: 'fail'
        })
        res.json(outData)

      }

    }
  })


}

module.exports = home


