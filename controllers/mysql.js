var root = process.cwd()
var ENV = require(root + '/env.js') // 获取当前项目环境（local：本地；test：测试环境；prod：线上环境）

var mysql=require("mysql");

var database_focus = 'focus_test' // 'focus_prod'数据库
// 不是线上项目使用测试数据库
if (ENV == 'prod') {
  database_focus = 'focus_prod'
}

// 数据库基础配置
var database_config = {
  host: 'localhost',
  user: 'root',
  password: 'Cfh691073',
  port: ''
}

// 数据库操作方法(公用)
function operateBase (config, sql, callback) {
  var pool = mysql.createPool(config); // 连接数据库

  pool.getConnection(function(err,conn){
    if(err){
      //释放连接
      conn.release();

      callback(err,null,null);
    }else{
      conn.query(sql,function(qerr,vals,fields){
        //释放连接
        conn.release();
        //事件驱动回调
        callback(qerr,vals,fields);
      });
    }
  });
}

var databaseAll = {}

// 连接'focus_prod'数据库
databaseAll.query_focus = function(sql,callback){
  database_config.database = database_focus // 增加数据库名称

  // 执行数据库操作
  operateBase(database_config, sql, callback)
};



module.exports = databaseAll;