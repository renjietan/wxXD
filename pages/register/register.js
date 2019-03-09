// pages/register/register.js
const { $Toast } = require('../../dist1/base/index');
import Notify from '../../dist/notify/notify';
var util = require('../../utils/md5.js')
const app = getApp(); Page({

  /**
   * 页面的初始数据
   */
  data: {
    pshow: true,
    ipshow: true,
    disabled: false,
    random: null,
    formdata: {
      phone: null,
      code: null,
      password: null,
      ispassword: null,
      radio: '1',
    },
    time: 60,
  },
  //密码显示
  passwordshow(event) {
    let name = event.currentTarget.dataset.name;
    this.setData({
      [name]: !this.data[name]
    })
  },
  //单选框改变
  onRadioChange(name) {
    this.setData({
      'formdata.radio': name.detail
    })
  },
  //input框改变
  onChange(event) {
    let name = event.currentTarget.dataset.name;
    this.setData({
      ['formdata.' + name]: event.detail
    })
  },
  //获取验证码
  getcode() {
    if (!this.data.disabled) {
      let { phone } = this.data.formdata;
      let phonetest = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (phone == '' || phone == ' ' || phone == null) {
        Notify('手机号不能为空');
      } else if (!phonetest.test(phone)) {
        Notify('手机号格式有误');
      } else {
        this.setData({
          disabled: true
        })
        this.settime();
        this.getmsg(this.data.random, phone);
      }
    } else {
      console.log('请等待');
    }
  },
  //倒计时
  settime() {
    let time = this.data.time;
    if (time == 0) {
      this.setData({
        time: 60,
        disabled: false
      })
      return false;
    } else {
      this.setData({
        time: --time
      })
    }
    this.timeout=setTimeout(() => {
      this.settime();
    }, 1000);
  },
  //注册按钮
  formsubimt() {
    let { phone, code, password, ispassword, radio } = this.data.formdata;
    let phonetest = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (phone == '' || phone == ' ' || phone == null) {
      Notify('手机号不能为空');
    } else if (!phonetest.test(phone)) {
      Notify('手机号格式有误');
    } else if (code == '' || code == ' ' || code == null) {
      Notify('验证码不能为空');
    } else if (password == '' || password == ' ' || password == null) {
      Notify('密码不能为空');
    } else if (password.length > 12 && password.length != 32 || password.length < 6) {
      Notify('请输入密码长度为6-12位');
    } else if (password.length > 12 && password.length != 32 || password.length < 6 || password.indexOf(" ") >= 0) {
      Notify('请输入密码长度为6-12位且不能有空格');
    } else if (ispassword == '' || ispassword == ' ' || ispassword == null) {
      Notify('确认密码不能为空');
    } else if (password !== ispassword){
      Notify('两次输入不一致');
    } else {
      let spassword = util.hexMD5(password);
      console.log(this.data.formdata);
      wx.request({
        url: app.globalData.serverWJ + 'wx/user/register.do',
        method: 'POST',
        header: { 'Cookie': 'JSESSIONID=' + this.sessionId },
        data: {
          "random": this.data.random,
          "msg": code,
          "telephone": phone,
          "passWord": spassword,
          "userName": phone,
          "loginName": phone,
        },
        success: (result) => {
          console.log('注册', result.data);
          if (result.data.resultCode == 0) {
            $Toast({
              content: '注册成功',
              type: 'success'
            });
            console.log('注册成功');
            wx.setStorageSync('loginName', phone);
            wx.navigateTo({
              url: '../login/login'
            })
          } else {
            $Toast({
              content: result.data.resultDesc,
              type: 'error'
            });
            console.log(result.data.resultDesc);
          }
        },
        fail: function ({

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
  //获取验证码请求
  getmsg(random, phone) {
    wx.request({
      url: app.globalData.serverWJ + 'wx/user/sendMessage.do',
      method: 'POST',
      data: {
        "random": random,
        "telephone": phone
      },
      header: { 'Cookie': 'JSESSIONID=' + this.sessionId },
      success: (result) => {
        this.setData({
          random: result.data.random
        })
        //获取验证码失败
        if (result.data.resultCode !== '0') {
          $Toast({
            content: result.data.resultDesc,
            type: 'error'
          });
          console.log(result.data.resultDesc);
          clearTimeout(this.timeout);
          this.setData({
            disabled: false,
            time: 60
          })
        } else {
          $Toast({
            content: '验证码已发送',
            type: 'success'
          });
        }
      },
      fail: function ({
        errMsg
      }) {
        $Toast({
          content: errMsg,
          type: 'error'
        });
        console.log('request fail', errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.sessionId = wx.getStorageSync('sessionId');
    //获取sessionId
    wx.request({
      url: app.globalData.serverWJ + '/wx/user/saveSessionId.do',
      method: 'POST',
      success: (result) => {
        //wx.setStorageSync('sessionId', result.data.sessionId);
        this.sessionId = result.data.sessionId;
        wx.request({
          url: app.globalData.serverWJ + 'wx/user/toRegister.do',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': 'JSESSIONID=' + this.sessionId
          },
          success: (result) => {
            let random = result.data.random;
            console.log('第一次打开获取防刷码', random);
            this.setData({
              random: random
            })
          },
          fail: function ({
            errMsg
          }) {
            $Toast({
              content: errMsg,
              type: 'error'
            });
            console.log('request fail', errMsg)
          }
        })
      },
      fail: function ({
        errMsg
      }) {
        console.log('request fail', errMsg)
      }
    });
    

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