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
    id: "",
    listData: {
      "subCount": 0,
      "data": {}
    },
    url: serverList.server9093 + 'Work/selectAllSid',
    url_del: serverList.server9093 + 'Work/updateIsInvalid',
    nav_edit: '../handleHoliday/handleHoliday'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let id = options.id
    that.setData({
      id: id
    })
    wx.setNavigationBarTitle({
      title: "请假详情",
    })
    that.getDataList(that, that.data.url, { id: id })
    // this.getDataList(that, that.data.currentRouter.url_Query)
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
        let temp = null
        let subCount = 0
        for (var i =0 ; i< result.length; i++){
          if (i == result.length) break
          subCount += result[i].days
        }
        temp = groupByList({
          params: result,
          key: "time"
        })
        that.setData({
          'listData.subCount': subCount,
          'listData.data': temp
        })
      }, 600)
    }).catch(error => {
      Toast.clear();
    })
  },
  handleEvent(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let currentRouter = that.data.currentRouter
    //type == del ---- 删除 || type == edit ---- 编辑 || type == add ---- 新增
    switch (type) {
      case "del":
        Dialog.confirm({
          title: '删除',
          message: '确定删除吗？'
        }).then(() => {
          Toast.loading({
            mark: true,
            duration: 0,
            message: "加载中"
          })
          let id = e.currentTarget.dataset.typeid;
          $request({
            url: that.data.url_del,
            params: {
              id: id,
              isInvalid: 1
            },
            type: "form"
          }).then(res => {
            setTimeout(function() {
              Toast.clear();
              setTimeout(function() {
                Toast.success("操作成功")
                that.getDataList(that, that.data.url, { id: that.data.id })
              }, 600)
            }, 600)
          })
        }).catch(() => {
          Toast.clear()
        });
        break;
      case "edit":
        let id = e.currentTarget.dataset.typeid;
        wx.navigateTo({
          url: that.data.nav_edit + "?id=" + id
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
    that.getDataList(that, that.data.url, { id: that.data.id})
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