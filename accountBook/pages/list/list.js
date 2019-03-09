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
const app = getApp();

const serverList = getApp().globalData;
Page({
  /**
   * 组件的初始数据
   */
  data: {
    total: "",
    searchVal: "",
    routerList: {
      'returnedMoney': {
        name: "回款记录",
        'url_Query': serverList.server9401 + "returnmoney/selectReturnMoneyOrderByamount", //查询的接口地址
        'url_del': serverList.server9401 + "returnmoney/isInvalidReturnMoney", //删除的接口地址
        navUrl_add: "../returnedMoney/returnedMoney", //新增页面的跳转地址
        navUrl_edit: "../returnedMoney/returnedMoney", //编辑页面的跳转地址
        search: "", //是否有搜索框
        title: "回款总金额(元)", //显示TITLE  为空则不显示
        count: "time", //分类KEY名  此处将数据以 TIME 进行分类
        isDelete: true,
        isEdit: true,
        rightwidth: 65,
        icon: "iconfont icon-huikuan"
      },
      'subsidy': {
        name: "补贴记录",
        'url_Query': serverList.server9401 + "subsidy/selectSubsidyOrderByamount",
        'url_del': serverList.server9401 + "subsidy/isInvalidSubsidy",
        navUrl_add: "../subsidyHandle/subsidyHandle",
        navUrl_edit: "../subsidyHandle/subsidyHandle",
        search: "",
        title: "补贴总金额(元)",
        count: "time",
        isDelete: true,
        isEdit: true,
        rightwidth: 65,
        icon: "iconfont icon-butie"
      },
      'holiday': {
        name: "请假记录",
        'url_Query': serverList.server9093 + "Work/selectLeave",
        'url_del': serverList.server9093 + "Work/updateIsInvalid",
        navUrl_add: "../handleHoliday/handleHoliday",
        navUrl_edit: "../list/list",
        search: "搜索员工",
        title: "当年请假天数",
        count: "",
        isEdit: false,
        isDetail: true,
        rightwidth: 0,
        icon: "iconfont icon-qingjia"
      },
      'drug': {
        name: "药品账单",
        'url_Query': app.globalData.server9696 + "drug/drugList",
        'url_del': app.globalData.server9696 + "drug/delDrug",
        navUrl_add: "../drugAdd/drugAdd",
        navUrl_edit: "../drugAdd/drugAdd",
        search: "",
        title: "当年总支出(元)",
        count: "time",
        isDelete: true,
        isEdit: true,
        rightwidth: 65,
        icon:"iconfont icon-yaopin"
      },
      'fodder': {
        name: "饲料账单",
        'url_Query': app.globalData.server9696 + "fodder/fodderList",
        'url_del': app.globalData.server9696 + "fodder/delFodder",
        navUrl_add: "../fodderAdd/fodderAdd",
        navUrl_edit: "../fodderAdd/fodderAdd",
        search: "",
        title: "当年总支出(元)",
        count: "time",
        isDelete: true,
        isEdit: true,
        rightwidth: 65,
        icon: "iconfont icon-yaopin"
      },
      'seed': {
        name: "苗种账单",
        'url_Query': app.globalData.server9696 + "seed/seedList",
        'url_del': app.globalData.server9696 + "seed/delSeed",
        navUrl_add: "../seedAdd/seedAdd",
        navUrl_edit: "../seedAdd/seedAdd",
        search: "",
        title: "当年总支出(元)",
        count: "time",
        isDelete: true,
        isEdit: true,
        rightwidth: 65,
        icon: "iconfont icon-miaozhong"
      },
      'fertilizer': {
        name: "肥料账单",
        'url_Query': app.globalData.server9696 + "fertilizer/fertilizerList",
        'url_del': app.globalData.server9696 + "fertilizer/delFertilizer",
        navUrl_add: "../fertilizerAdd/fertilizerAdd",
        navUrl_edit: "../fertilizerAdd/fertilizerAdd",
        search: "",
        title: "当年总支出(元)",
        count: "time",
        isDelete: true,
        isEdit: true,
        rightwidth: 65,
        icon: "iconfont icon-feiliao"
      },
      'machinery': {
        name: "农机费账单",
        'url_Query': app.globalData.server9696 + "machinery/machineryList",
        'url_del': app.globalData.server9696 + "machinery/delMachinery",
        navUrl_add: "../machineryAdd/machineryAdd",
        navUrl_edit: "../machineryAdd/machineryAdd",
        search: "",
        title: "当年总支出(元)",
        count: "time",
        isDelete: true,
        isEdit: true,
        rightwidth: 65,
        icon: "iconfont icon-nongji"
      },
    },
    type: "",
    currentRouter: {},
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
    let type = options.type
    let currentRouter = that.data.routerList[type]
    that.setData({
      currentRouter: currentRouter,
      icon: currentRouter.icon,
      type: type
    })
    wx.setNavigationBarTitle({
      title: currentRouter.name,
    })
    // that.data.currentRouter.search ? that.getDataList(that, that.data.currentRouter.url_Query, {
    //   name: ""
    // }) : that.getDataList(that, that.data.currentRouter.url_Query)
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
        temp = groupByList({
          params: result.data || result,
          key: that.data.currentRouter.count
        })
        if (temp instanceof Array) {
          let parserTemp = {
            [that.data.currentRouter.title]: temp
          }
          temp = parserTemp
        }
        that.setData({
          'listData.subCount': result.sum_amount == null ? '0.00' : result.sum_amount,
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
          let id = e.currentTarget.dataset.typeid;
          $request({
            url: currentRouter.url_del,
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
                that.data.currentRouter.search ? that.getDataList(that, that.data.currentRouter.url_Query, {
                  name: ""
                }) : that.getDataList(that, that.data.currentRouter.url_Query)
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
    that.data.currentRouter.search ? that.getDataList(that, that.data.currentRouter.url_Query, {
      name: ""
    }) : that.getDataList(that, that.data.currentRouter.url_Query)
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