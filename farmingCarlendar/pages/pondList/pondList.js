import Toast from '../../../dist/toast/toast';
import Notify from '../../../dist/notify/notify';
import {  $request  } from "../../../utils/util.js";
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _Url: app.globalData.serverHYH,
    groupListInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  handleRouter(e){
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: "../addPond/addPond?groupInfo=" + JSON.stringify(name),
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
    let that = this
    Toast.loading({
      mask: true,
      message: "加载中",
      duration: 0
    })
    $request({
      url: that.data._Url + "QueryAllGroupInfo",
      method: "GET"
    }).then(res => {
      setTimeout(function () {
        Toast.clear()
        that.setData({
          groupListInfo: res.data.data
        })
      }, 1000)
    }).catch(error => {
      Toast.clear()
    })
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