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
   * 组件的初始数据
   */
  data: {
    searchVal: "",
    listData: {
      "subCount": 0,
      "data": {}
    },
    currentRouter:{
      url_Query: serverList.server9093 + "Temporary/selectAllNone",
      url_nav_add: "../workerCompHandle/workerCompHandle/workerCompHandle",
      url_nav_detail: "../workerCompDetail/workerCompDetail",    
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.setNavigationBarTitle({
      title: "工时记录",
    })
    that.getDataList(that, that.data.currentRouter.url_Query, {
      name: ""
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  getDataList(that, url, params) {
    Toast.loading({
      mask: true,
      duration: 0,
      message: '加载中...'
    })
    let temp = params ? params : {}
    $request({
      url: url,
      type: "form",
      params: temp
    }).then(res => {
      let result = res.data.data
      setTimeout(function() {
        Toast.clear();
        // let subCount = result.length != 0 ? result.reduce((pre, cur) => {
        //   return Number((pre.duration || pre) + cur.duration)
        // }) : 0
        let subCount
        switch (result.length) {
          case 0:
            subCount = 0
            break;
          case 1:
            subCount = result[0].duration
            break;
          default:
            subCount = result.reduce((pre, cur) => {
              return Number((pre.duration || pre) + cur.duration)
            })
            break;
        }
        that.setData({
          'listData.subCount': subCount,
          'listData.data': result
        })
      }, 600)
    }).catch(error => {
      Toast.clear();
    })
  },
  handleSearch(e) {
    let currentRouter = this.data.currentRouter
    let that = this
    that.getDataList(that, currentRouter.url_Query, {
      'name': that.data.searchVal
    })
  },
  handleTextChange(e) {
    let that = this
    that.setData({
      searchVal: e.detail
    })
  },
  handleEvent(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let currentRouter = that.data.currentRouter
    //type == del ---- 删除 || type == edit ---- 编辑 || type == add ---- 新增
    switch (type) {
      case "add":
        wx.navigateTo({
          url: "../workerCompHandle/workerCompHandle",
        })
        break;
      case "detail":
        wx.navigateTo({
          url: currentRouter.url_nav_detail + '?id=' + e.currentTarget.dataset.typeid,
        })
        break;
      default:
        return
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    that.getDataList(that, that.data.currentRouter.url_Query, {
      name: ""
    })
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
})