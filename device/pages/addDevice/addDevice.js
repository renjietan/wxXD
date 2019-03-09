// pages/addDevice/addDevice.js
import Notify from '../../../dist/notify/notify';
const { $Toast } = require('../../../dist1/base/index');

const app = getApp(); Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  param: [{
    devName:''
  }],
  onLoad: function (options) {
    //获取token
    this.token = wx.getStorageSync('token');
    wx.request({
      url:  app.globalData.serverLKJ +'device2/selectTangkouDevice',
      data: {
        "token": this.token,
        groupIds: `[${options.groupid}]`
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method:'POST',
      success: (res) => {
        console.log(res.data)
        if (res.data.resultCode==0){
          var data = res.data.data[0];
          var newArray = [];

          for (let i = 0; i < data.data.length; i++) {
            newArray.push({ 'devName': data.data[i].device_type_name })
          }
          if (newArray.length == 0) {
            Notify('该塘口未添加设备')
          } else {
            this.setData({
              param: newArray
            })
          }

        } else if (res.data.resultCode == '0013'){
          wx.clearStorage();
          $Toast({
            content: '登录过期',
            type: 'error'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../../../pages/login/login'
            })
          }, 500)
        
        } else {
          $Toast({
            content: res.data.resultDesc,
            type: 'error'
          });
        }
      }
    })
      
  },
})