// accountBook/pages/payerYZ/pageYZ.js
const {
  $Message
} = require('../../../dist1/base/index');
const {
  $request
} = require('../../../utils/util.js');
import {
  groupByList
} from "../../../utils/util.js"
import Toast from '../../../dist/toast/toast';
import Dialog from '../../../dist/dialog/dialog';
const serverList = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navUrl: "../payerHandle/payerHandle",
    searchVal:"",
    queryUrl: serverList.server9093 + "Work/selectAllRepayment",
    costInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getDataList(this.data.searchVal)
  },
  handleTextChange(e){
    this.setData({
      searchVal: e.detail
    })
  },

  handleSearch(){
    this.getDataList(this.data.searchVal)
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
    this.getDataList(this.data.searchVal)

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
  getDataList(name){
    let that = this
    let url = that.data.queryUrl
    Toast.loading({
      mask: true,
      duration: 0,
      message: "加载中..."
    })
    $request({
      url: url,
      params:{
        name: name
      },
      type: "form"
    }).then(res => {
      setTimeout(function(){
        Toast.clear()
        that.setData({
          costInfo: res.data.data || []
        })
      },600)
    }).catch(error => {
      setTimeout(function(){
        Toast.clear()
      },600)
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  handleEvent(e){
    let type = e.currentTarget.dataset.type
    type == "add" || type == "edit" ? wx.navigateTo({
      url: this.data.navUrl + "?type=" + type + "&id="  + (type == "add" ? "" : e.currentTarget.dataset.id),
    }):wx.navigateTo({
        url: '../payerYZDetail/payerYZDetail?type=' + type + "&id=" + e.currentTarget.dataset.id,
    })
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