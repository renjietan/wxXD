// pages/register/register.js
import Notify from '../../dist/notify/notify';
var util = require('../../utils/md5.js');
const { $Toast } = require('../../dist1/base/index');
const { $Message } = require('../../dist1/base/index');
import { $request } from "../../utils/util.js"
const app = getApp(); Page({

  /**
   * 页面的初始数据
   */
  data: {
    pshow: true,
    ipshow: true,
    apshow:true,
    disabled: false,
    random: null,
    formdata: {
      oldpassword: null,
      password: null,
      ispassword: null,
      radio: '1',
    },
    time: 60,
  },
  //密码显示
  passwordshow(event) {
    let name = event.currentTarget.dataset.name;
    console.log(name);
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
  
  //按钮
  formsubimt() {
    console.log(this.data.formdata);
    let { oldpassword, password, ispassword} = this.data.formdata;
    if (oldpassword == '' || oldpassword == ' ' || oldpassword == null) {
      Notify('旧密码不能为空');
    }else if (password == '' || password == ' ' || password == null) {
      Notify('新密码不能为空');
    } else if (password.length > 12 && password.length != 32 || password.length < 5) {
      Notify('请输入密码长度为5-12位');
    } else if (ispassword == '' || ispassword == ' ' || ispassword == null) {
      Notify('确认密码不能为空');
    } else if (password !== ispassword) {
      Notify('两次输入不一致');
    } else {
      let spassword = util.hexMD5(password);
      let soldpassword = util.hexMD5(oldpassword);

      $request({
        url: app.globalData.serverWJ + "wx/more/updatePassWord.do", method: "POST", params:{
          "oldPassword": soldpassword, "passWord": spassword
        }
      }).then(result => {
        if (result.data.resultCode == 0) {
          $Toast({
            content: '修改成功',
            type: 'success'
          });
          wx.clearStorageSync();
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login'
            })
          }, 1000)
        } else {
          $Toast({
            content: result.data.resultDesc,
            type: 'error'
          });
        }
      }).catch(error => { })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.sessionId = wx.getStorageSync('sessionId');
    //获取token
    this.token = wx.getStorageSync('token');
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