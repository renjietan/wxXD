// pages/more/more.js
const {
  $Toast
} = require('../../dist1/base/index');
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible2: false,
    visible: false,
    actions: [{
      name: '确定',
      color: '#ed3f14'
    }],
    actions2: [{
      name: '确定',
      color: '#ed3f14'
    }],
    loginMethod: ""
    //登录方式 0----微信登录 ；1----手机号登录；2----手机号与微信关联后
  },
  //退出登录
  handleClick() {
    this.setData({
      visible: true,
    });
  },
  //再次体验
  handleClick2() {
    this.setData({
      visible2: true
    });
  },
  //点击取消
  handleCancel() {
    this.setData({
      visible: false,
      visible2: false
    });
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
            province: e.detail.userInfo.province,
          }
          util.$request({
            url: app.globalData.serverEncry + 'updateWeChatOpenId',
            params: paramJSON
          }).then(result => {
            if (result.data.resultCode == "0016") {
              $Toast({
                content: result.data.resultDesc,
                type: 'error'
              })
            } else {
              $Toast({
                content: "绑定成功",
                type: 'success'
              })
              this.setData({
                loginMethod: "wt"
              })
            }
          }).catch(error => {
            $Toast({
              content: '绑定失败',
              type: 'error'
            });
          })
        }
      })
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

  handleClickItem() {
    const action = this.data.actions;
    action[0].loading = true;
    this.setData({
      actions: action
    });
    wx.clearStorage();
    setTimeout(() => {
      action[0].loading = false;
      this.setData({
        visible: false,
        actions: action
      });
      wx.reLaunch({
        url: '../login/login'
      })
    }, 500)
  },
  handleClickItem2() {
    const action = this.data.actions2;
    action[0].loading = true;
    this.setData({
      actions2: action
    });
    action[0].loading = false;
    this.setData({
      visible2: false,
      actions2: action
    });
    wx.reLaunch({
      url: '../guideTK/guideTK'
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSetting({
      success: function (isValidate) {
        if (isValidate.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function (userInfo) {
              console.log(userInfo)
            }
          });
        } 
        // else {
        //   $Toast({
        //     content: '获取用户授权状态失败',
        //     type: 'error'
        //   });
        //   setTimeout(function(){
        //     wx.navigateTo({
        //       url: '../wxLogin/wxLogin?nav=more',
        //     })
        //   },1000)
        // }
      }
    })
    wx.request({
      url: app.globalData.serverEncry + 'findLoginMethon',
      method: "post",
      data: {
        token: wx.getStorageSync("token"),
      },
      success: (res => {
        if (res.statusCode != 200) {
          $Toast({
            content: '接口异常',
            type: 'error'
          });
          return false
        } else if (res.data.resultCode == "0013") {
          $Toast({
            content: 'token过期,2s后将自动返回到登录页面',
            type: 'error',
            duration: 0
          });
          wx.clearStorage();
          setTimeout(() => {
            $Toast.hide();
            wx.navigateTo({
              url: '../login/login',
            })
          }, 2000);
        } else {
          wx.setStorageSync("loginMethod", ["wx", "tel", "wt"][res.data.resultMethod])
          this.setData({
            loginMethod: ["wx", "tel", "wt"][res.data.resultMethod]
          })
        }
      }),
      fail: (error => {})
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})