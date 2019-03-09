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
    navUrl: "../payerCGHandle/payerCGHandle",
    searchVal: "",
    // queryUrl: "http://192.168.3.59:9093/" + "farmhand/findList",
    queryUrl: serverList.server9093_1 + "farmhand/findList",
    deleteUrl: serverList.server9093_1 + "farmhand/delFarmhand",
    labInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList(this.data.searchVal)
  },
  handleTextChange(e) {
    this.setData({
      searchVal: e.detail
    })
  },
  handleIsDelete(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    Dialog.alert({
      title: '作废',
      message: '是否作废？',
      showCancelButton: true
    }).then(() => {
      Toast.loading({
        mask: true,
        duration: 0,
        message: "加载中..."
      })    
      $request({
        url: that.data.deleteUrl,
        params: {
          wsId: id
        },
        type: "form"
      }).then(res => {
        let result = res.data
        setTimeout(function () {
          Toast.clear()
          setTimeout(function () {
            Toast.clear(result == 1 ? "操作成功" : "操作失败")
            setTimeout(function () {
              that.getDataList(that.data.searchVal)
            }, 400)
          }, 600)
        }, 600)
      }).catch(error => {
        Toast.clear()
      })
    });

  },
  handleSearch() {
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
  getDataList(name) {
    let that = this
    let url = that.data.queryUrl
    Toast.loading({
      mask: true,
      duration: 0,
      message: "加载中..."
    })
    $request({
      url: url,
      params: {
        sname: name
      },
      type: "form"
    }).then(res => {
      setTimeout(function () {
        Toast.clear()
        that.setData({
          labInfo: res.data || []
        })
      }, 600)
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
  handleEvent(e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: this.data.navUrl + "?type=" + type +  "&wsid=" + (type == "add" ? "" : e.currentTarget.dataset.wsid),
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