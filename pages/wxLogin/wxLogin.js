const app = getApp();
const util = require('../../utils/util.js');
const {
  $Toast
} = require('../../dist1/base/index');
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nav: ""
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      nav: options.nav
    })
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              //从数据库获取用户信息
              // that.queryUsreInfo();
              //用户已经授权过
              // wx.switchTab({
              //   url: ''
              // })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      var that = this;
      console.log(e.detail.userInfo)
      wx.login({
        success: res => {
          let paramJSON = {
            code: res.code,
            avatarUrl: e.detail.userInfo.avatarUrl,
            city: e.detail.userInfo.city,
            country: e.detail.userInfo.country,
            gender: e.detail.userInfo.gender,
            language: e.detail.userInfo.language,
            nickName: e.detail.userInfo.nickName,
            province: e.detail.userInfo.province
          }
          wx.request({
            url: app.globalData.serverEncry + 'WeChatLogin',
            data: paramJSON,
            method: "post",
            success: result => {
              if (result.data.resultCode == 0) {
                console.log('登录成功');
                $Toast({
                  content: '登录成功',
                  type: 'success'
                });
                wx.setStorageSync('token', result.data.token);
                //跳转到成功页面
                if (result.data.isExperience == '0') {
                  //体验用户
                  wx.reLaunch({
                    url: '../newLogin/newLogin'
                  })
                } else if (result.data.isExperience == '1' && (result.data.groupCount == '0' && result.data.deviceCount == '0')) {
                  //正式用户且没有塘口且没有设备
                  wx.reLaunch({
                    url: '../use/use'
                  })
                } else if (result.data.isExperience == '1' && (result.data.groupCount !== '0' || result.data.deviceCount !== '0')) { //正式用户且有塘口或设备
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              } else {
                $Toast({
                  content: result.data.resultDesc,
                  type: 'error'
                });
                console.log(result.data.resultDesc);
              }
            }
          })
        },
        fail: err => {
          $Toast({
            content: "登录失败",
            type: "error"
          })
        }
      })
      //插入登录的用户的相关信息到数据库
      // wx.request({
      //   url: getApp().globalData.urlPath + 'hstc_interface/insert_user',
      //   data: {
      //     openid: getApp().globalData.openid,
      //     nickName: e.detail.userInfo.nickName,
      //     avatarUrl: e.detail.userInfo.avatarUrl,
      //     province: e.detail.userInfo.province,
      //     city: e.detail.userInfo.city
      //   },
      //   header: {
      //     'content-type': 'application/json'
      //   },
      //   success: function (res) {
      //     //从数据库获取用户信息
      //     that.queryUsreInfo();
      //     console.log("插入小程序登录用户信息成功！");
      //   }
      // });
      // //授权成功后，跳转进入小程序首页
      // wx.switchTab({
      //   url: ''
      // })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '授权失败',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function() {
    wx.request({
      url: getApp().globalData.urlPath + 'hstc_interface/queryByOpenid',
      data: {
        openid: getApp().globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data);
        getApp().globalData.userInfo = res.data;
      }
    })
  },

})