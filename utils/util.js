const {
  $Message
} = require('../dist1/base/index');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatData = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join('-');
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const convertDate = function(date) {
  let dateObject = new Date(date);
  let m = dateObject.getMonth() + 1;
  let d = dateObject.getDate();
  if (m < 10) {
    m = "0" + m
  }
  if (d < 10) {
    d = "0" + d
  }
  let parseDate = (dateObject.getFullYear()) + "-" +
    m + "-" + d
  return parseDate
};
const request = function({
  url,
  params,
  type,
  method = 'POST'
} = {
  url,
  params,
  type,
  method
}) {
  let token = wx.getStorageSync("token");
  let posttype = type == 'form' ? 'application/x-www-form-urlencoded' : 'application/json';
  let data = params ? {
    token,
    ...params
  } : {
    token
  };
  // method = method ? "GET": "POST"
  return new Promise((resolve, reject) => {
    if (!token) {
      $Message({
        content: '登录超时,2秒后将返回登录页面',
        type: 'error'
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/login'
        })
      }, 2000)
      reject(new Error("本地TOKEN失效"))
    } else {
      wx.request({
        url: url,
        data: data,
        method: method,
        header: {
          'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId'),
          'content-type': posttype
        },
        success: res => {
          if (res.statusCode != 200) {
            $Message({
              content: '服务请求异常',
              type: 'error'
            });
            reject(new Error("服务请求异常"))
          } else if (res.data.resultCode == "0013") {
            $Message({
              content: '登录超时,2秒后将返回登录页面',
              type: 'error'
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/login/login'
              })
              wx.clearStorage();
            }, 2000)
            reject(new Error("登录超时"))
          } else {
            resolve(res)
          }
        },
        fail: error => {
          $Message({
            content: '服务请求异常',
            type: 'error'
          });
          reject(error)
        }
      })
    }
  }).catch(error => {
    $Message({
      content: '服务请求异常',
      type: 'error'
    });
    reject(error)
  })
}

const groupByList = function({
  params = [],
  key = ''
} = {
    params,
  key
}) {
  if (!params) return false
  if(!key) return params
  let res = params
  let types = new Set();
  for (let item of res) {
    types.add(item[key].substring(5, 7))
  }
  let obj = {};
  let arrList = [];
  // 根据type生成多个数组
  for (let type of types) {
    for (let item of res) {
      if (item[key].substring(5, 7) == type) {
        obj[type] = obj[type] || [];
        obj[type].push(item);
      }
    }
  }
  // arrList = Object.values(obj);
  // // arrList.map(item => {
  // //   let temp = {};
  // //   item.forEach(item => {});
  // // });
  return obj
  // console.log(arrList);
}

const parseArray = function arrayForGroup(_array, _size) {
  let b = [];
  let result = [];
  let k = 0;
  for (var i = 0; i < _array.length; ++i) {
    if (i % _size == 0) {
      b = [];
      for (var j = 0; j < _size; ++j) {
        if (_array[i + j] == undefined) {
          continue;
        } else {
          b[j] = _array[i + j];
        }
      }
      result[k] = b;
      k++;
    }
  }
  return result
}

function weekDay() {
  var weekDay;
  var week = new Date().getDay()
  var today = new Date()
  console.log(formatTime(today))
  switch (week) {
    case 0:
      weekDay = '星期日'
      break;
    case 1:
      weekDay = '星期一'
      break;
    case 2:
      weekDay = '星期二'
      break;
    case 3:
      weekDay = '星期三'
      break;
    case 4:
      weekDay = '星期四'
      break;
    case 5:
      weekDay = '星期五'
      break;
    case 6:
      weekDay = '星期六'
      break;
  }
  return weekDay;
}
const produceYearList = function() {
  let date = new Date(new Date().getTime()).getFullYear();
  return Array.from({
    length: 20
  }).reduce((arr, val, i) => {
    i < 11 ? arr.unshift((date - i) + "年") : arr.push((date + i - 10) + "年")
    return arr
  }, [])
}
const parserNum = function(x) {
  var f = parseFloat(x);
  if (isNaN(f)) return false;
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length < (rs + 1) + 2) {
    s += '0';
  }
  var leftNum = s.split(".")[0];
  var rightNum = "." + s.split(".")[1];
  var result;
  var resultArray = new Array();
  if (leftNum.length > 3) {
    var i = true;
    while (i) {
      resultArray.push(leftNum.slice(-3));
      leftNum = leftNum.slice(0, leftNum.length - 3);
      if (leftNum.length < 4) {
        i = false;
      }
    }
    var sortArray = new Array();
    for (var i = resultArray.length - 1; i >= 0; i--) {
      sortArray.push(resultArray[i]);
    }
    result = leftNum + "," + sortArray.join(",") + rightNum;
  } else {
    result = s;
  }
  return result;
}


module.exports = {
  formatTime: formatTime,
  parserNum: parserNum,
  formatData: formatData,
  $request: request,
  $parseArray: parseArray,
  $convertDate: convertDate,
  weekDay,
  produceYearList,
  groupByList
}