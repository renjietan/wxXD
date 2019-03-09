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
    routerList:{
      subMoney:{
        name: "预支总金额",
        title: "预支总金额",
        url_Query: serverList.server9093 + "Work/selectadvanceFee",
        navUrl_edit: "../payerHandle/payerHandle"
      },
      subMoneyed:{
        name: "已还总金额",
        title: "已还总金额",
        url_Query: serverList.server9093 + "Work/selectAllDebt",
        url_del: serverList.server9093 + "Work/updateAdvanceIsD"
      }
    },
    currentRouter: {},
    id: "",
    listData: {
      "subCount": 0,
      "data": {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let id = options.id
    let type = options.type
    that.setData({
      id: id,
      currentRouter: that.data.routerList[type]
    })
    let currentRouter = that.data.currentRouter
    wx.setNavigationBarTitle({
      title: currentRouter.name,
    })
    // that.data.currentRouter.search ? that.getDataList(that, that.data.currentRouter.url_Query, {
    //   name: ""
    // }) : that.getDataList(that, that.data.currentRouter.url_Query)
    this.getDataList(that, that.data.currentRouter.url_Query, {
      sId: that.data.id
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
        let temp = null
        let subCount = 0
        switch (result.length) {
          case 0:
            break;
          case 1:
            subCount = result[0].advanceFee
            break;
          default:
            subCount = result.reduce((pre, cur) => {
              return Number((pre.advanceFee || pre) + cur.advanceFee)
            })
            break;
        }
        temp = groupByList({
          params: result.data || result,
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
  handleSearch(e) {
    let currentRouter = this.data.currentRouter
    if (!currentRouter.search) return false
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
          let afId = e.currentTarget.dataset.afid;
          let wsId = e.currentTarget.dataset.wsid
          let params;
          let url;
          if(currentRouter.name == "已还总金额"){
            url = "https://cj.datasurge.cn:9093/Work/updateAdvanceIsD"
            params = {
              wsId: wsId,
              afId: afId
            }
          }else{
            url = "https://cj.datasurge.cn:9093/Work/updateAdvanceIsInvalid"
            params = {
              afId: afId
            }
          }
          $request({
            url: url,
            params: params,
            type: "form"
          }).then(res => {
            setTimeout(function() {
              Toast.clear();
              setTimeout(function() {
                Toast.success("操作成功")
                that.getDataList(that, that.data.currentRouter.url_Query, {
                  sId: that.data.id
                })
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
          url: that.data.currentRouter.navUrl_edit + '?type=' + type + "&id=" + id,
        })
        break;
      case "add":
        wx.navigateTo({
          url: that.data.currentRouter.navUrl_add + '?type=' + type,
        })
        break;
      case "detail":
        wx.navigateTo({
          url: "../holidayList/holidayList" + '?id=' + e.currentTarget.dataset.typeid,
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
    this.getDataList(that, that.data.currentRouter.url_Query, {
      sId: that.data.id
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