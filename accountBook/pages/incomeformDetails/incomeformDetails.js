// accountBook/pages/cldformDetails/cldformDetails.js
const {
  $request
} = require('../../../utils/util.js');
const {
  $Message
} = require('../../../dist1/base/index');
import {
  groupByList
} from "../../../utils/util.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: "",
    noData: false,
    listData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      icon: options.type == "1" ? "icon-butie" : "icon-huikuan"
    })
    let icon = this.data.icon
    wx.setNavigationBarTitle({
      title: icon == "icon-butie" ? '补贴详细' : "回款详细",
    })
    $request({
      url: app.globalData.server9401 + "income/selectMinuteStatement",
      type: "form",
      params: {

        type: options.type,
        year: options.year,
        name: options.name
      }
    }).then(res => {
      console.log(res.data.data)

      if (res.data.resultCode == 0) {
        res.data.data.length == 0 ? this.setData({
          noData: true
        }) : false
        let list = groupByList({
          params: res.data.data,
          key: "time"
        })
        this.setData({
          listData: list
        })
      } else {}
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