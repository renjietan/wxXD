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
import Notify from '../../../dist/notify/notify';
import Toast from '../../../dist/toast/toast';
import Dialog from '../../../dist/dialog/dialog';
const serverList = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      workerId: "",
      workerName: "",
      startDate: "",
      endDate: "",
      workTime: "",
      money: "",
      adMoney: 0
    },
    workerList: {
      isVisiable: false,
      data: []
    },
    oldMoney: "",
    money: "",
    type: "",
    wsId: "",
    currentEndDate: new Date().getTime(),
    currentStartDate: new Date().getTime(),
    isVisiableStartDate: false,
    isVisiableEndDate: false,
    currentRouter: {
      worker_url: serverList.serverWorker + "staff/findByOwer",
      moneyById: serverList.server9093_1 + "labor/findListBySid",
      workerInfo_url: serverList.server9093_1 + "labor/findOneBywsId",
      workTime_url: serverList.server9093_1 + "labor/findBywsIdHours",
      add: {
        url: serverList.server9093_1 + "labor/addLabor",
      },
      edit: {
        url: serverList.server9093_1 + "labor/updLabor"
      }
    }
  },
  handleIsVisableStartDate(e) {
    let that = this
    let temp = new Date(that.data.formData.startDate).getTime()
    if (!that.data.isVisiableStartDate){
      that.setData({
        isVisiableStartDate: !that.data.isVisiableStartDate,
        currentStartDate: temp
      })
    }else{
      that.setData({
        isVisiableStartDate: !that.data.isVisiableStartDate,
      })
    }
    
  },
  handleIsVisableEndDate(e) {
    let that = this
    let temp = new Date(that.data.formData.endDate).getTime()
    if (!that.data.isVisiableEndDate) {
      that.setData({
        isVisiableEndDate: !that.data.isVisiableEndDate,
        currentEndDate: temp
      })
    } else {
      that.setData({
        isVisiableEndDate: !that.data.isVisiableEndDate,
      })
    }
    // this.setData({
    //   isVisiableEndDate: !this.data.isVisiableEndDate,
    //   currentStartDate: new Date(that.data.formData.endDate).getTime()
    // })
  },
  handleChangeText(e) {
    let type = e.currentTarget.dataset.type
    let key = 'formData'.concat('.', type)
    let oldMoney = this.data.oldMoney
    // if (type == "adMoney"){
    //   this.setData({
    //     money: oldMoney - e.detail
    //   })
    // }else {
    this.setData({
      [key]: e.detail
    })
    // }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let currentRouter = that.data.currentRouter
    that.setData({
      wsId: options.wsid,
      type: options.type,
      "formData.endDate": $convertDate(new Date().getTime()),
      "formData.startDate": $convertDate(new Date().getTime())
    })
    if (options.type == "add") {
      Toast.loading({
        mask: true,
        duration: 0,
        message: "加载中"
      })
      wx.setNavigationBarTitle({
        title: '临时工结算新增',
      })
      $request({
        url: currentRouter.worker_url,
        type: "form"
      }).then(res => {
        setTimeout(function () {
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
        setTimeout(function () {
          Toast.clear();
        }, 600)
      })
    } else {
      Toast.loading({
        mask: true,
        duration: 0,
        message: "加载中"
      })
      wx.setNavigationBarTitle({
        title: '临时工结算编辑',
      })
      $request({
        url: currentRouter.worker_url,
        type: "form"
      }).then(res => {
        let temp = res.data.data.map(item => {
          item.checked = false
          return item
        })
        that.setData({
          "workerList.data": temp
        })
        return $request({
          url: this.data.currentRouter.workerInfo_url,
          params: {
            wsId: options.wsid
          },
          type: "form"
        })
      }).then(result => {
        setTimeout(function () {
          let temp = result.data
          let workerList = that.data.workerList.data.map(item => {
            item.checked = item.sId == temp.list.sId ? true : false
            return item
          })
          that.setData({
            "workerList.data": workerList,
            'formData.workerId': temp.list.sId,
            'formData.workerName': temp.list.sname,
            'formData.startDate': temp.list.starting_time ? temp.list.starting_time : $convertDate(new Date().getTime()),
            'formData.endDate': temp.list.end_time ? temp.list.end_time : $convertDate(new Date().getTime()),
            "formData.workTime": temp.hours.duration,
            'formData.money': temp.list.salary,
            'formData.adMoney': temp.list.advance_fee,
            "money": -(temp.arrearages),
            "oldMoney": -(temp.arrearages),
            currentStartDate: temp.list.starting_time ? (new Date(temp.list.starting_time).getTime()) : (new Date().getTime()),
            currentEndDate: temp.list.end_time ? (new Date(temp.list.end_time).getTime()) : (new Date().getTime()),
          })
          Toast.clear()
        }, 600)
      }).catch(error => {
        setTimeout(function () {
          Toast.clear();
        }, 600)
      })
    }
  },
  handleChangeStartDate(e) {
    let that = this
    if (!that.data.formData.workerId) {
      Notify("请选择结算人")
      this.setData({
        isVisiableStartDate: !this.data.isVisiableStartDate
      })
      return false
    }
    let date = $convertDate(e.detail)
    this.setData({
      "formData.startDate": date,
      currentStartDate: e.detail,
      isVisiableStartDate: !this.data.isVisiableStartDate
    })
    let startDate = that.data.currentStartDate
    let endDate = that.data.currentEndDate
    // if (startDate > endDate){
    //   Notify("开始时间不可大于结束时间")
    //   return false
    // }
    let params = {
      startTime: that.data.formData.startDate,
      endTime: that.data.formData.endDate,
      sId: that.data.formData.workerId
    }
    $request({
      url: that.data.currentRouter.workTime_url,
      params: params,
      type: "form"
    }).then(res => {
      this.setData({
        "formData.workTime": res.data.duration
      })
    })
  },
  handleChangeEndDate(e) {
    let that = this
    if(!that.data.formData.workerId){
      Notify("请选择结算人")
      this.setData({
        isVisiableEndDate: !this.data.isVisiableEndDate
      })
      return false
    }
    let date = $convertDate(e.detail)
    this.setData({
      "formData.endDate": date,
      currentEndDate: e.detail,
      isVisiableEndDate: !this.data.isVisiableEndDate
    })
    let startDate = that.data.currentStartDate
    let endDate = that.data.currentEndDate
    // if (startDate > endDate) {
    //   Notify("结束时间不可小于开始时间")
    //   return false
    // }
    let params = {
      startTime: that.data.formData.startDate,
      endTime: that.data.formData.endDate,
      sId: that.data.formData.workerId
    }
    $request({
      url: that.data.currentRouter.workTime_url,
      params: params,
      type: "form"
    }).then(res => {
      this.setData({
        "formData.workTime": res.data.duration
      })
    })
  },
  handleIsVisableWorker(e) {
    this.setData({
      "workerList.isVisiable": !this.data.workerList.isVisiable
    })
  },
  handleSave(e) {
    let that = this
    let id = that.data.formData.workerId;
    if (!id) {
      return false
    }
    that.setData({
      "workerList.isVisiable": !this.data.workerList.isVisiable
    })
    let moneyById_Url = this.data.currentRouter.moneyById
    Toast.loading({
      mask: true,
      message: "加载中...",
      duration: 0
    })
    $request({
      url: moneyById_Url,
      params: {
        sId: id
      },
      type: "form"
    }).then(res => {
      let result = res.data
      // let currentEndDate = result.endTime ? (new Date(result.endTime).getTime()) : (new Date().getTime())
      // let currentStartDate = result.startTime ? (new Date(result.startTime).getTime()) : (new Date().getTime())
      that.setData({
        'formData.startDate': result.startTime ? result.startTime : $convertDate(new Date().getTime()),
        'formData.endDate': result.endTime ? result.endTime : $convertDate(new Date().getTime()),
        "formData.workTime": result.hours,
        "money": -(result.arrearages),
        "oldMoney": -(result.arrearages),
        // currentEndDate: currentEndDate,
        // currentStartDate: currentStartDate
      })
      setTimeout(function () {
        Toast.clear()
      }, 200)
    }).catch(error => {
      Toast.clear()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  handleSubmit() {
    let that = this
    let type = that.data.type
    let formData = that.data.formData
    let moneyTest = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    let currentRouter = that.data.currentRouter
    if (formData.workerName == "" || formData.workerId == "") {
      Notify("请选择还款人")
      return false
    } else if (!moneyTest.test(formData.money) || !moneyTest.test(formData.adMoney) || !moneyTest.test(formData.workTime)) {
      Notify("累积工时、实发金额、还预支金额格式不符")
      return false
    } else if (formData.startDate == "" || formData.endDate == "") {
      Notify("请选择日期")
      return false
    } else if (new Date(formData.startDate).getTime() > new Date(formData.endDate).getTime()) {
      Notify("开始时间不可大于结束时间")
      return false
    }
    // else if (formData.adMoney > that.data.money){
    //   Notify("还款金额不可大于预支金额")
    //   return false
    // }

    let params = {
      sId: formData.workerId,  //工人ID
      sname: formData.workerName, //工人名称
      starting_time: formData.startDate, //开始时间
      end_time: formData.endDate, //结束时间
      number: formData.workTime,//工时
      salary: formData.money,// 实发金额
      advance_fee: formData.adMoney, //还预支金额
      wsId: that.data.wsId
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
      setTimeout(function () {
        Toast.clear()
        setTimeout(function () {
          Toast.success("操作成功")
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 600)
        }, 600)
      }, 600)
    }).catch(error => {
      Toast.clear()
    })
  },
  handleWorkerCheck(e) {
    let workerList = this.data.workerList.data
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    for (var i = 0; i < workerList.length; i++) {
      if (workerList[i].sId == id) {
        workerList[i].checked = !workerList[i].checked
        if (workerList[i].checked == true) {
          this.setData({
            'formData.workerName': name,
            'formData.workerId': id,
          })
        } else {
          this.setData({
            'formData.workerName': "",
            'formData.workerId': "",
          })
        }
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