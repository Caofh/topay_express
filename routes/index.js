var express = require('express');
var router = express.Router();
var path = require('path') // node核心函数，当前路径
var controllers = path.join(__dirname, '../controllers') // controllers的路径

/* GET home page. */
router.get('/', function(req, res, next) {
  var home = require(controllers + '/home/home.controller')
  home(res)
});

// 对网站首页的访问返回 "Hello World!" 字样
// router.get('/', function (req, res) {
//   res.send('Hello World!');
// });

/* GET 获取天气信息接口. */
router.get('/getWeatherDetail', function(req, res, next) {
  var weatherDetail = require(controllers + '/weatherDetail/weatherDetail.controller')
  weatherDetail(req, res, next)
});


// focus_studio项目
/* GET 获取项目信息接口. */
router.get('/getProject', function(req, res, next) {
  var getProject = require(controllers + '/focusStudio/project.controller').getProject
  getProject(req, res, next)
});





















// 网站首页接受 POST 请求
router.post('/', function (req, res) {
  res.send('Got a POST request');
});

// /user 节点接受 PUT 请求
router.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});

// /user 节点接受 DELETE 请求
router.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user');
});

module.exports = router;
