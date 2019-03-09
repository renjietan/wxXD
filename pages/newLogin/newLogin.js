// pages/newLogin/newLogin.js
const { $Toast } = require('../../dist1/base/index');
const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goTo: function () {
    wx.reLaunch({
      url: this.url
    })

  },
  //点击正式使用改变用户状态
  goUse: function () {
    wx.request({
      url:  app.globalData.serverWJ +'wx/user/updateExperienceState.do',
      method: "POST",
      data: {
        "token": this.token
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.resultCode == 0) {
          //判断是否设备或塘口
          //都没有跳转添加塘口设备页面
          //否则跳转正式首页
          if (this.deviceCount == 0 && this.groupCount == 0) {
            wx.reLaunch({
              url: '../use/use'
            })
          } else {
           wx.switchTab({
              url: '../index/index'
            })
          }
        } else if (res.data.resultCode  == '0013') {
          wx.clearStorage();
          $Toast({
            content: '登录过期',
            type: 'error'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login'
            })
          }, 500)
        } else {
          $Toast({
            content: result.data.resultDesc,
            type: 'error'
          });
        }
      }
    })
  },
  onLoad: function (options) {
    this.url = '../guideTK/guideTK';
   //获取token
    this.token = wx.getStorageSync('token');
    wx.request({
      url:  app.globalData.serverWJ +'wx/user/getUserState.do',
      method: "POST",
      data: {
        "token": this.token
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.resultCode == 0) {
          this.url = res.data.isFirstTime == 0 ? '../guideTK/guideTK' : '../newIndex/newIndex';
          this.deviceCount = res.data.deviceCount;
          this.groupCount = res.data.groupCount;
        } else if (res.data.resultCode == '0013'){
          wx.clearStorage();
          $Toast({
            content: '登录过期',
            type: 'error'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login'
            })
          }, 500)
        } else {
          $Toast({
            content: result.data.resultDesc,
            type: 'error'
          });
        }
      }
    })
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