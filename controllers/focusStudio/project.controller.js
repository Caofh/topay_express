
var query = require('../mysql').query_focus // 调用focus数据库模块
var core = require('../core') // 调用核心模块方法

var computed = require('./computed/payRollDetail/index')

var project = {}

// 增加(编辑)项目接口
project.addProject = function (req, res, next) {
  var data = req.body; // post请求数据.

  var edit = data.edit && data.edit !== '' ? data.edit : null // 操作是新增操作还是编辑操作（1：新增；2：编辑）
  var id = data.id && data.id !== '' ? data.id : null // 当edit=2时必传

  if (edit == 2 && !id) {
    var outData = core.outFormat({
      status: 'fail',
      data: 'id不可为空'
    })
    res.json(outData)
    return false
  }

  var projectName = data.projectName && data.projectName !== '' ? data.projectName : null
  var saleMan = data.saleMan && data.saleMan !== '' ? data.saleMan : null
  var addIncome = data.addIncome && data.addIncome !== '' ? data.addIncome : null
  var complete = data.complete && data.complete !== '' ? data.complete : null
  var startTime = data.startTime && data.startTime !== '' ? data.startTime : null
  var endTime = data.endTime && data.endTime !== '' ? data.endTime : null
  var personList = data.personList && data.personList !== '' ? data.personList : null

  // 组织插入数据库语法(区分新增和编辑操作)
  if (edit == 1) {
    var values =
      core.toDatabaseStr(projectName) + ',' +
      core.toDatabaseStr(saleMan) + ',' +
      core.toDatabaseStr(addIncome) + ',' +
      core.toDatabaseStr(complete) + ',' +
      core.toDatabaseStr(startTime) + ',' +
      core.toDatabaseStr(endTime) + ',' +
      core.toDatabaseStr(core.arrToStr(personList))
    ;

    var query_str = 'insert into project_list(project_name,sale_man,add_income,complete,start_time,end_time,person_list) values('+values+')';
  } else {
    var values =
      'project_name=' + core.toDatabaseStr(projectName) + ',' +
      'sale_man=' + core.toDatabaseStr(saleMan) + ',' +
      'add_income=' + core.toDatabaseStr(addIncome) + ',' +
      'complete=' + core.toDatabaseStr(complete) + ',' +
      'start_time=' + core.toDatabaseStr(startTime) + ',' +
      'end_time=' + core.toDatabaseStr(endTime) + ',' +
      'person_list=' + core.toDatabaseStr(core.arrToStr(personList))
    ;

    var query_str = 'update project_list set '+values+' where id='+id+'';
  }

  query(query_str, function (err, vals, fields) {
    if (err) {
      var outData = core.outFormat({
        status: 'fail',
        data: err
      })
      res.json(outData)

    } else {
      var outData = core.outFormat({
        status: 'success',
        data: vals
      })
      res.json(outData)
    }

  })

}

// 查询项目接口
project.getProject = function (req, res, next) {
  var data = req.query; // get请求数据.

  var id = data.id && data.id !== '' ? data.id : null

  // 组织插入数据库语法
  if (id) {
    var query_str = 'select * from project_list where id='+id+'';
  } else {
    var query_str = 'select * from project_list';
  }

  query(query_str, function (err, vals, fields) {
    if (err) {
      var outData = core.outFormat({
        status: 'fail',
        data: err
      })
      res.json(outData)

    } else {
      vals.map(function (item) {
        // 处理数据，计算薪资
        item.studio_money = computed.getDataList([item]).studio_money || '' // 每个项目的工作室盈利
      })

      var outData = core.outFormat({
        status: 'success',
        data: vals
      })
      res.json(outData)
    }

  })

}

// 薪酬详细接口
project.payRollDetail = function (req, res, next) {
  var data = req.query; // get请求数据.

  var id = data.id && data.id !== '' ? data.id : null
  if (!id) {
    var outData = core.outFormat({
      status: 'fail',
      data: 'id不能为空'
    })
    res.json(outData)
    return false
  }

// 组织插入数据库语法
  var query_str = 'select * from project_list where id='+id+'';

  query(query_str, function (err, vals, fields) {
    if (err) {
      var outData = core.outFormat({
        status: 'fail',
        data: err
      })
      res.json(outData)

    } else {

      // res.json(vals)

      // 处理数据，计算薪资
      var dataResult = computed.getDataList(vals)

      var outData = core.outFormat({
        data: dataResult,
        status: 'success'
      })
      res.json(outData)

    }

  })

}

// 计算成本盈利情况接口
project.computedGain = function (req, res, next) {
  var data = req.body; // post请求数据.

  var addIncome = data.addIncome && data.addIncome !== '' ? data.addIncome : null
  var saleMan = data.saleMan && data.saleMan !== '' ? data.saleMan : null
  var personList = data.personList && data.personList !== '' ? JSON.stringify(data.personList) : null

  if (!addIncome || !personList) {
    var outData = core.outFormat({
      status: 'fail',
      data: '收入总金额或成员列表不可为空'
    })
    res.json(outData)
    return false
  }

  // 组织处理参数传入计算薪资公用方法
  var payArr = [
    {
      add_income: addIncome,
      sale_man: saleMan,
      person_list: personList
    }
  ]

  // 处理数据，计算薪资
  var dataResult = computed.getDataList(payArr)

  var outData = core.outFormat({
    data: dataResult,
    status: 'success'
  })
  res.json(outData)

}





module.exports = project


