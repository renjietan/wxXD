// pages/addEnd/addEnd.js

const {
  $Toast
} = require('../../../dist1/base/index');
const app = getApp(); Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    noteShow: false,
    zjjy: [{
      title: "一、水温",
      content: "龙虾对温度是比较敏感的，养殖过程中，成虾温差范围不超过5摄氏度，虾苗温差范围不超过3摄氏度，建议成虾告警设置为中，虾苗告警设置为高。"
    },
    {
      title: "二、pH值",
      content: "小龙虾喜欢中性和偏碱性的水体，在小龙虾的养殖中，池水一般pH值的日变化在0(一般只见于室内养殖)～0.5之间波动较为适宜，建议告警设置为中。"
    },
    {
      title: "三、溶氧",
      content: "小龙虾有一定的耐低氧能力！一般要求水中溶氧不低于3mg/L，蜕壳期对溶氧要求较高，水中溶氧必须在5mg/L以上，建议告警设置为中。"
    }
    ], //专家建议
    param: {
      data_level: "2", //告警
    },
    typeShow: false,
    typeActions: [{
      name: "低",
      data_level: "3"
    }, {
      name: "中",
      data_level: "2"
    }, {
      name: "高",
      data_level: "1"
    }]
  },

  submit() {
    let that = this
    if (that.data.buttonClicked) {
      return
    }
    that.setData({
      buttonClicked: true
    })
    console.log(this.data.param)
    let p = this.data.param
    let param = {
      deviceId: p.deviceId,
      groupId: p.groupid,
      level: p.data_level,
      deviceType: p.deviceType
    }
    if (param.groupId == undefined || param.groupId == "undefined") {
      param.groupId = p.groupId
    }
    wx.getStorage({
      key: 'token',
      success(res) {
        console.log(res.data)
        param.token = res.data
        // if (that.data.buttonClicked) {
        //   console.log(11111)
        //   $Toast({
        //     content: '正在提交',
        //     type: 'loading'
        //   });
        //   return
        // 
        if (p.from == "编辑") {
          console.log("这是编辑提交")
          wx.request({
            url: app.globalData.serverLKJ + 'device2/updateDeviceToUser',
            data: param,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success(res1) {
              console.log(res1)
              if (res1.data.resultCode == 0) {
                $Toast({
                  content: '修改成功',
                  type: 'success',
                  duration: 0
                });
                setTimeout(() => {
                  wx.redirectTo({
                    url: '../changeDevice/changeDevice',
                  })
                }, 1000)
              } else if (res1.data.resultCode == 13) {
                $Toast({
                  content: "登陆过期",
                  type: 'error'
                });
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../../../pages/login/login',
                  })
                }, 2000)
              } else {
                $Toast({
                  content: res1.data.resultDesc,
                  type: 'warning'
                });
              }
            },
            error(err) {
              console.log(err)
            }
          })
        } else {
          console.log("这是添加提交")
          param.longitude = p.longitude
          param.latitude = p.latitude
          console.log(param)
          wx.request({
            url: app.globalData.serverLKJ + 'device2/addDeviceToUser',
            data: param,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success(res1) {
              if (res1.data.resultCode == 0) {
                $Toast({
                  content: '添加成功',
                  type: 'success',
                  duration: 0
                });
                setTimeout(() => {
                  if (p.from == "首页添加设备") {
                    wx.switchTab({
                      url: '../../../pages/index/index'
                    })
                  } else if (p.from == "塘口添加设备") {
                    wx.switchTab({
                      url: '../../../pages/pondList/pondList'
                    })
                  }
                }, 1000)
              } else if (res1.data.resultCode == 13) {
                $Toast({
                  content: "登陆过期",
                  type: 'error'
                });
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../../../pages/login/login',
                  })
                }, 2000)
              } else {
                $Toast({
                  content: res1.data.resultDesc,
                  type: 'warning'
                });
              }
              console.log(res1.data)
            },
            error(err) {
              console.log(err)
            }
          })
        }
      }
    })
  },
  typeClick(e) {
    this.setData({
      typeShow: true
    });
  },
  //下拉
  typeSelect(event) {
    console.log(event)
    this.setData({
      typeShow: false
    });
    this.setData({
      ['param.data_level']: event.detail.data_level
    })
  },
  onClose() {
    this.setData({
      typeShow: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let param = JSON.parse(options.param)
    console.log(param)
    let that = this
    if (options && Object.keys(options) != 0) {
      console.log(param)
      console.log(that.data.param)
      if (param.from == "编辑") {
        that.setData({
          "noteShow": true
        })
        that.setData({
          param: param
        })
      } else {
        that.setData({
          param: Object.assign(param, that.data.param)
        })
      }

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})