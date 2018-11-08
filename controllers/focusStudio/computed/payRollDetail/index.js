

var index = {}

// 将金钱四舍五入（取整）
index.formatMoney = function (money) {
  return Math.round(parseFloat(money))
}
// 将金钱按四舍五入取最低floor()（取整）
index.formatMoneyFloor = function (money) {
  return Math.floor(parseFloat(money))
}

// 工资部分计算
index.basePay = function (data) {
  /*
  工资部分
  var obj = [
    {
      id: 1, 1
      name: '欣儿',  1
      founder_money: '1000', 1
      sale: '1000', 1
      hours: '8',  1
      hours_sale: '800', 1
      perHoursMoney: '800',  1
      all: '2000'
    },
    ...
  ]
  */

  var personList = data.person_list ? JSON.parse(data.person_list) : ''
  var addIncome = data.add_income ? index.formatMoney(data.add_income) : ''
  var saleMan = data.sale_man ? index.formatMoney(data.sale_man) : ''
  var founder_money = index.formatMoney(addIncome * 10 / 100) // 创始人的10%
  var sale = index.formatMoney(addIncome * 10 / 100) // 销售的10%

  var allPay = 0
  personList.map(function (item) {
    item.founder_money = (item.id == 1) ? founder_money : 0 // 创始人10%
    item.sale = (item.id == saleMan) ? sale : 0 // 销售的10%
    item.hours_sale = index.formatMoney(item.perHoursMoney) * parseFloat(item.hours) // 工时薪资
    item.all = item.founder_money + item.sale + item.hours_sale // 每个人最终的薪资金额

    allPay += item.all
  })

  return {
    personList: personList, // 各成员信息数组
    allPay: index.formatMoney(allPay), // 工资总数
    founder_money: founder_money, // 创始人的10%
    sale: sale // 销售的10%
  }

}

// 分红部分计算
index.bonusPay = function (data, baseData) {
  /*
  // 分红部分
  var obj_1 = [
    {
      id: 1, 1
      name: '欣儿', 1
      founder_money: '1000', 1
      bonus_money: '1000', 1
      perHoursMoney: '800', 1
      all: '2000'
    }
  ]
  */

  var personList = data.person_list ? JSON.parse(data.person_list) : ''
  var addIncome = data.add_income ? index.formatMoney(data.add_income) : ''
  var incomePay = addIncome - baseData.allPay // 除工资、创始人10%和销售的10%外的盈利总数

  var founder_money = index.formatMoney(incomePay * 10 / 100) // 创始人的10%
  var studio_money = index.formatMoney(incomePay * 50 / 100) // 工作室所有50%(临时金额，之后还要加上抛去个人薪酬的舍去后的零碎金额)
  var per_money = index.formatMoneyFloor((incomePay - founder_money - studio_money) / personList.length) // 除去创始人10%后人均分配的分红金额(取四舍五入下限)

  var studio_money_result = incomePay - founder_money - (per_money * personList.length) // 工作室所有50%(最终金额)


  personList.map(function (item, index) {
    item.founder_money = (item.id == 1) ? founder_money : 0 // 创始人10%
    item.bonus_money = per_money // 除去创始人10%后人均分配的分红金额
    item.all = item.founder_money + item.bonus_money // 每个人最终的分红金额

    item.payAndBonus = item.all + baseData.personList[index].all // 每个人的最终所得金额(包括工资 + 分红 + 其他)

  })

  return {
    personList: personList,
    studio_money: studio_money_result,
    incomePay: incomePay
  }

}

index.getDataList = function (data) {
  var data_new = data[0] || ''

  var obj = {}
  obj = Object.assign(obj, data_new)
  delete obj.person_list // 清除personList字段

  // 计算工资金额分配
  var wages = index.basePay(data_new)
  obj.baseData = wages.personList

  // 计算盈利金额分配
  var profitData = index.bonusPay(data_new, wages)
  obj.bonusData = profitData.personList // 其中包含了每个人的最终所得


  obj.allPay = wages.allPay // 项目工资总金额
  obj.incomePay = profitData.incomePay // 项目盈利总金额
  obj.studio_money = profitData.studio_money // 工作室盈利金额

  return obj

}


module.exports = index