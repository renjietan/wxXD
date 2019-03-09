// accountBook/pages/payerHandle/payerHandle.js
const {
  $Message
} = require('../../../dist1/base/index');
const {
  $request,
} = require('../../../utils/util.js');
import {
  groupByList,
  $convertDate
} from "../../../utils/util.js"
import Toast from '../../../dist/toast/toast';
import Dialog from '../../../dist/dialog/dialog';
import Notify from '../../../dist/notify/notify';
const serverList = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      workerId: "",
      workerName: "",
      date: $convertDate(new Date().getTime()),
      amount: "",
    },
    advanceFee: "",
    workerList: {
      isVisiable: false,
      data: []
    },
    type: "",
    currentDate: new Date().getTime(),
    isVisiableDate: false,
    currentRouter: {
      worker_url: serverList.serverWorker + "staff/findByOwer",
      urlById: serverList.server9093 + "Work/selectadvanceFee",
      urlByIdMoney: serverList.server9093 + "farmhand/findListBySid",
      add: {
        url: serverList.server9093 + "Work/addAdvanceFee",
        workerName: "申请人",
        date: "申请时间",
        money: "预支金额(元)"
      },
      edit: {
        url: serverList.server9093 + "Work/addRepayment",
        workerName: "还款人",
        date: "还款时间",
        money: "还款金额(元)"
      }
    }
  },
  handleIsVisableDate(e) {
    this.setData({
      isVisiableDate: !this.data.isVisiableDate
    })
  },
  handleChangeText(e) {
    this.setData({
      "formData.amount": e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let currentRouter = that.data.currentRouter
    that.setData({
      type: options.type
    })
    if (options.type == "add") {
      Toast.loading({
        mask: true,
        duration: 0,
        message: "加载中"
      })
      wx.setNavigationBarTitle({
        title: '添加',
      })
      $request({
        url: currentRouter.worker_url,
        type: "form"
      }).then(res => {
        setTimeout(function() {
          let temp = res.data.data.map(item => {
            item.checked = false
            return item
          })
          that.setData({
            "workerList.data": temp
          })
          Toast.clear();
        }, 600)
      }).catch(error => {
        setTimeout(function() {
          Toast.clear();
        }, 600)
      })
    } else {
      let workerReq = $request({
        url: currentRouter.worker_url,
        type: "form"
      })
      let costReq = $request({
        url: currentRouter.urlById,
        type: "form",
        params: {
          sId: options.id
        }
      })
      let moneyReq = $request({
        url: currentRouter.urlByIdMoney,
        type: "form",
        params: {
          sId: options.id
        }
      })
      wx.setNavigationBarTitle({ 
        title: '还款',
      })
      Promise.all([workerReq, costReq, moneyReq]).then(res => {
        let workerList = res[0].data.data
        let costInfo = res[1].data.data
        let moneyInfo = res[2].data
        
        if (costInfo.length == 0){
          Notify("未获取到此工人的相关信息")
          return false
        }
        workerList.map(item => {
          item.checked = item.sId == costInfo[0].sId ? true : false
          return item
        })
        that.setData({
          "advanceFee": -(moneyInfo.arrearages),
          'workerList.data': workerList,
          'formData.workerId': costInfo[0].sId,
          'formData.workerName': costInfo[0].name,
        })
      })
    }
  },
  handleChangeDate(e) {
    let date = $convertDate(e.detail)
    this.setData({
      "formData.date": date,
      currentDate: e.detail,
      isVisiableDate: !this.data.isVisiableDate
    })
  },
  handleIsVisableWorker(e) {
    if(this.data.type == "edit"){
      Toast("不可重新选择还款人...")
      return false
    }
    this.setData({
      "workerList.isVisiable": !this.data.workerList.isVisiable
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  handleSubmit() {
    let that = this
    let type = that.data.type
    let formData = that.data.formData
    let moneyTest = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    let currentRouter = that.data.currentRouter
    if (formData.workerName == "" || formData.workerId == "") {
      Notify("请选择还款人")
      return false
    } else if (!moneyTest.test(formData.amount)) {
      Notify("金额保留俩位小数")
      return false
    } else if (formData.date == "") {
      Notify("请选择日期")
      return false
    } else if (that.data.type == "edit" && that.data.advanceFee < formData.amount){
      Notify("还款金额不可大于预支金额")
      return false
    }

    let params = {
      Amount: formData.amount,
      time: formData.date,
      sname: formData.workerName,
      sId: formData.workerId
    }
    Toast.loading({
      mask: true,
      duration: 0,
      message: "加载中..."
    })
    $request({
      url: currentRouter[type].url,
      params: params,
      type: "form"
    }).then(res => {
      setTimeout(function() {
        Toast.clear()
        setTimeout(function() {
          Toast.success("操作成功")
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 600)
        }, 600)
      }, 600)
    })
  },
  handleWorkerCheck(e) {
    let workerList = this.data.workerList.data
    for (var i = 0; i < workerList.length; i++) {
      if (workerList[i].sId == e.currentTarget.dataset.id) {
        workerList[i].checked = !workerList[i].checked
        workerList[i].checked == true ? this.setData({
          'formData.workerName': e.currentTarget.dataset.name,
          'formData.workerId': e.currentTarget.dataset.id,
        }) : this.setData({
          'formData.workerName': "",
          'formData.workerId': "",
        })
      } else {
        workerList[i].checked = false
      }
    }
    this.setData({
      "workerList.data": workerList
    })
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