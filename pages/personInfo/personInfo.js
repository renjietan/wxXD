// pages/personInfo/personInfo.js
const { $Toast } = require('../../dist1/base/index');
const app = getApp(); 
const { $Message } = require('../../dist1/base/index');
import { $request } from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    isVisiable: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $request({
      url: app.globalData.serverEncry + "findInfomation", method: "POST"
    }).then(result => {
      if (result.data.resultCode == 0) {
        let User_Info = result.data.user[0]
        for (var i in User_Info) {
          if (User_Info[i] == "null" || User_Info[i] == "") {
            delete User_Info[i]
          }
        }
        this.setData({
          userInfo: User_Info,
        })
      }else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })

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