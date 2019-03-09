// pages/login/login.js
const {
  $Toast
} = require('../../dist1/base/index');
import Notify from '../../dist/notify/notify';
var util = require('../../utils/md5.js');

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pshow: true,
    formdata: {
      phone: null,
      password: null
    },
    btnloading: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //密码显示
  passwordshow() {
    this.setData({
      pshow: !this.data.pshow
    })
  },
  //input输入框改变
  onChange(event) {
    let name = event.currentTarget.dataset.name;
    this.setData({
      ['formdata.' + name]: event.detail
    })

  },
  //点击登录按钮
  formsubimt(event) {
    console.log(this.data.formdata);
    let {
      phone,
      password
    } = this.data.formdata;
    let phonetest = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (phone == '' || phone == ' ' || phone == null) {
      Notify('手机号不能为空');
    } else if (!phonetest.test(phone)) {
      Notify('手机号格式有误');
    } else if (password == '' || password == ' ' || password == null) {
      Notify('密码不能为空');
    } else {
      let spassword = util.hexMD5(password);
      wx.request({
        url: app.globalData.serverWJ + 'wx/user/login.do',
        method: 'POST',
        header: {
          'Cookie': 'JSESSIONID=' + this.sessionId
        },
        data: {
          "loginName": phone,
          "passWord": spassword,
        },
        success: (result) => {
          if (result.data.resultCode == 0) {
            console.log('登录成功');
            $Toast({
              content: '登录成功',
              type: 'success',
              duration: 0
            });
            //同步方式存储
            wx.setStorageSync('token', result.data.token);
            wx.setStorageSync('loginName', phone);
            //跳转到成功页面
            if (result.data.isExperience == '0') {
              //体验用户
              setTimeout(()=>{
                $Toast.hide();
                wx.reLaunch({
                  url: '../newLogin/newLogin'
                })
              },2000)

            } else if (result.data.isExperience == '1' && (result.data.groupCount == '0' && result.data.deviceCount == '0')) {
              //正式用户且没有塘口且没有设备
              setTimeout(() => {
                $Toast.hide();
                wx.reLaunch({
                  url: '../use/use'
                })
              }, 2000)
            } else if (result.data.isExperience == '1' && (result.data.groupCount !== '0' || result.data.deviceCount !== '0')) { //正式用户且有塘口或设备
              setTimeout(() => {
                $Toast.hide();
                wx.switchTab({
                  url: '../index/index'
                })
              }, 2000)
            }
          } else {
            $Toast({
              content: result.data.resultDesc,
              type: 'error'
            });
            console.log(result.data.resultDesc);
          }
        },
        fail: function({
          errMsg
        }) {
          $Toast({
            content: errMsg,
            type: 'error'
          });
          console.log('request fail', errMsg)
        }
      })
    }
  },

  GotoWL(){
    wx.navigateTo({
      url: '../wxLogin/wxLogin?nav=home'
    })
  },
  // 第三方授权登录
  // getPhoneNumber: function(e) {
  //   if (e.detail.errMsg != "getPhoneNumber:ok") {
  //     wx.showModal({
  //       title: '提示',
  //       showCancel: false,
  //       content: '授权失败',
  //       success: function (res) {}
  //     })
  //   } else {
  //     wx.getSetting({
  //       success: function (isValidate) {
  //         debugger
  //         if (isValidate.authSetting['scope.userInfo']) {
  //           wx.getUserInfo({
  //             lang: 'zh_CN',
  //             success: function (userInfo) {
  //               debugger
  //               console.log(userInfo)
  //             }
  //           });
  //         } else {

  //         }
  //       }
  //     })
  //     wx.login({
  //       success: function(res) {
  //         console.log(res.code)
  //         // 获取当前的code
  //         if (res.code) {
  //           wx.request({
  //             url: app.globalData.serverWJ + 'WeChatLogin',
  //             data: {
  //               code: res.code,
  //               iv: e.detail.iv,
  //               encryptedData: e.detail.encryptedData
  //             },
  //             method: "post",
  //             success: function(result) {
  //               console.log("token", result.data.token)
  //               if (result.data.resultCode == 0) {
  //                 console.log('登录成功');
  //                 $Toast({
  //                   content: '登录成功',
  //                   type: 'success'
  //                 });
  //                 wx.setStorageSync('token', result.data.token);
  //                 //跳转到成功页面
  //                 if (result.data.isExperience == '0') {
  //                   //体验用户
  //                   wx.reLaunch({
  //                     url: '../newLogin/newLogin'
  //                   })
  //                 } else if (result.data.isExperience == '1' && (result.data.groupCount == '0' && result.data.deviceCount == '0')) {
  //                   //正式用户且没有塘口且没有设备
  //                   wx.reLaunch({
  //                     url: '../use/use'
  //                   })
  //                 } else if (result.data.isExperience == '1' && (result.data.groupCount !== '0' || result.data.deviceCount !== '0')) { //正式用户且有塘口或设备
  //                   wx.switchTab({
  //                     url: '../index/index'
  //                   })
  //                 }
  //               } else {
  //                 $Toast({
  //                   content: result.data.resultDesc,
  //                   type: 'error'
  //                 });
  //                 console.log(result.data.resultDesc);
  //               }


  //             }
  //           })
  //           //发起网络请求    
  //         } else {
  //           console.log('获取用户登录态失败！' + res.errMsg)
  //         }
  //       }
  //     });
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.sessionId = wx.getStorageSync('sessionId');
    //判断token是否存在
    let islogin = wx.getStorageSync('token');
    /*
      判断是否为新用户用户，是进入newLogin页面
      否 判断是否有设备或塘口 有进入首页 没有进入加设备塘口页面
    */
    if (islogin) {
      wx.request({
        url: app.globalData.serverWJ + 'wx/user/getUserState.do',
        method: "POST",
        data: {
          "token": islogin
        },
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          console.log(res.data);
          if (res.data.resultCode == 0) {
            let isExperience = res.data.isExperience;
            let deviceCount = res.data.deviceCount;
            let groupCount = res.data.groupCount;
            if (isExperience == '0') {
              //新用户
              wx.reLaunch({
                url: '../newLogin/newLogin'
              })
            } else if (isExperience == '1' && (deviceCount == 0 && groupCount == 0)) {
              //正式用户跳转添加塘口设备页面
              wx.reLaunch({
                url: '../use/use'
              })
            } else if (isExperience == '1' && (deviceCount !== 0 || groupCount !== 0)) {
              //正式用户跳转正式首页
              wx.switchTab({
                url: '../index/index'
              })
            }
          }
        }
      })
    }
    let name = wx.getStorageSync('loginName');
    if (name) {
      this.setData({
        'formdata.phone': name
      })
    }
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