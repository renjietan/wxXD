// farmingCarlendar/pages/addWorker/addWorker.js
import Toast from '../../../dist/toast/toast';
import Notify from '../../../dist/notify/notify';
// import {
//   areaList
// } from '../../../utils/area';
import {
  $request,
  $parseArray,
  $convertDate
} from "../../../utils/util.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      name: "", //姓名
      payloadMethodID: "", // 选中的工资结算方式的ID
      payloadMethodName: "", // 选中的工资结算方式 名字
      telephone: "", //手机号  
      holiday: "", //假期
      arrivalDate: $convertDate(new Date().getTime()), //预计上工时间
      sId: "",
      type:"",
      typeName: ""
    },
    isEdit: false,
    _Url: app.globalData.serverWorker,
    // _Url_Add: app.globalData.serverWorker,
    height: null,
    activeNames: '1',
    payloadList: {
      isVisiable: false,
      data: [{
        id: 1,
        name: "年"
      }, {
        id: 2,
        name: "日"
      }] //工资结算方式的字典集合
    },
    workerType: {
      isVisiable: false,
      data: [{
        id: 1,
        name: "正式工",
      }, {
        id: 2,
        name: "临时工",
      }]
    },
    btnhide: false,
    workerList: [],
    isShowDate: false,
    minDate: new Date().getTime(),
    currentDate: new Date().getTime() //当前时间
  },
  handleisVisableType(){
    this.setData({
      'workerType.isVisiable':  !this.data.workerType.isVisiable
    })
  },

  handleWorkerListChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  handleReset() {
    let that = this
    let fd = {
      name: "", //姓名
      payloadMethodID: this.data.payloadList.data[0].id,
      payloadMethodName: this.data.payloadList.data[0].name, // 选中的工资结算方式 名字
      telephone: "", //手机号
      holiday: "", //假期
      arrivalDate: $convertDate(new Date().getTime()), //预计上工时间
      sId: "",
      type: that.data.workerType.data[0].id,
      typeName: that.data.workerType.data[0].name,
    };
    this.setData({
      formData: fd,
      currentDate: new Date().getTime()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let query = wx.createSelectorQuery();
    let params = options.workerInfo.indexOf("sId") > -1 ? JSON.parse(options.workerInfo) : {}
    if (params.sId) {
      wx.setNavigationBarTitle({
        title: '员工编辑',
        success: () => {
          that.setData({
            'formData.name': params.sname,
            'formData.payloadMethodID': that.data.payloadList.data[params.stype - 1].id,
            'formData.payloadMethodName': that.data.payloadList.data[params.stype - 1].name,
            'formData.telephone': params.stelephone,
            'formData.holiday': params.Holiday,
            'formData.arrivalDate': params.expected_time,
            'formData.sId': params.sId,
            "formData.type": that.data.workerType.data[params.stype - 1].id,
            "formData.typeName": that.data.workerType.data[params.stype - 1].name,
            "isEdit": !that.data.isEdit
          })
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新增员工',
        success: () => {
          that.setData({
            'formData.payloadMethodName': that.data.payloadList.data[0].name,
            'formData.payloadMethodID': that.data.payloadList.data[0].id,
            "formData.type": that.data.workerType.data[0].id,
            "formData.typeName": that.data.workerType.data[0].name
          })
        }
      })
    }
    // $request({
    //   url: that.data._Url + "staff/findByOwer",
    //   type: 'form'
    // }).then(result => {
    //   let workerList = result.data.data;
    //   setTimeout(function () {
    //     if(params.sId){
    //       wx.setNavigationBarTitle({
    //         title: '员工编辑',
    //         success: () => {
    //           that.setData({
    //             'formData.name': params.sname,
    //             'formData.payloadMethodID': that.data.payloadList.data[params.stype - 1].id,
    //             'formData.payloadMethodName': that.data.payloadList.data[params.stype - 1].name,
    //             'formData.telephone': params.stelephone,
    //             'formData.holiday': params.Holiday,
    //             'formData.arrivalDate': params.expected_time,
    //             'formData.sId': params.sId,
    //             'workerList': workerList
    //           })
    //         }
    //       })
    //     }else {
    //       that.setData({
    //         'workerList': workerList,
    //         'formData.payloadMethodName': that.data.payloadList.data[0].name,
    //         'formData.payloadMethodID': that.data.payloadList.data[0].id,
    //       })
    //     }
    //     Toast.clear()
    //   }, 600)
    // }).catch(error => {
    //   Toast.clear()
    // })
  },
  isOpenArr(e) {
    this.setData({
      isShowDate: !this.data.isShowDate
    })
  },
  handleDateConfirm(e) {
    this.setData({
      'formData.arrivalDate': $convertDate(e.detail),
      isShowDate: !this.data.isShowDate
    })
  },
  handleChangeText(e) {
    let key = 'formData'.concat('.', e.currentTarget.dataset.name)
    this.setData({
      [key]: e.detail
    })
  },
  openPayload() {
    this.setData({
      'payloadList.isVisiable': !this.data.payloadList.isVisiable
    })
  },
  closePayload() {
    this.setData({
      'payloadList.isVisiable': !this.data.payloadList.isVisiable
    })
  },
  handleDelete(e) {
    let index = e.currentTarget.dataset.name
    let workerId = this.data.workerList[index].sId
    let that = this
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    $request({
      url: that.data._Url + "staff/updateIsDelete",
      type: "form",
      params: {
        sId: workerId
      }
    }).then(res => {
      if (workerId == this.data.formData.sId) {
        this.handleReset()
      }
      Toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0
      });
      if (res.data.resultCode == 0) {
        return $request({
          url: that.data._Url + "staff/findByOwer",
          type: 'form'
        })
      } else {
        setTimeout(function() {
          Toast.fail("操作失败")
          Toast.clear()
        }, 600)
      }
    }).then(result => {
      setTimeout(function() {
        Toast.clear()
        setTimeout(function() {
          Toast.success("操作成功")
          that.setData({
            'workerList': result.data.data
          })
        }, 600)
      }, 600)

    }).catch(error => {
      setTimeout(function() {
        Toast.clear()
      }, 600)
    })
  },
  handleChangePayload(e) {
    this.setData({
      'formData.payloadMethodID': e.detail.id,
      'formData.payloadMethodName': e.detail.name,
      'payloadList.isVisiable': !this.data.payloadList.isVisiable
    })
  },
  handleChangeWorkerType(e) {
    if(e.detail.name == "临时工"){
      this.setData({
        "formData.holiday": "0"
      })
    }
    this.setData({
      'formData.type': e.detail.id,
      'formData.typeName': e.detail.name,
      'workerType.isVisiable': !this.data.workerType.isVisiable
    })
  },
  handleSubmit(e) {
    let formData = {
      ...this.data.formData
    };
    let name = e.currentTarget.dataset.name
    // var num = /^[^ ]+$/
    console.log(name)
    let phonetest = /^$|^[1][3,4,5,7,8][0-9]{9}$/;
    let holidayTest = /^\d{1,5}(?:\.\d{1,2})?$/
    if (formData.name.trim() == "") {
      Notify("必填项不可为空")
      return false
    } else if (formData.telephone != "" && !phonetest.test(formData.telephone)) {
      Notify("手机格式有误")
      return false
    } else if (!holidayTest.test(formData.holiday)) {
      Notify("请输入1-5位小数或整数")
      return false
    }
    let that = this
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    let url;
    formData.owerId = ""
    formData.sId == "" ? url = that.data._Url + 'staff/addStaff' : url = that.data._Url + "staff/updateStaff"
    $request({
      url: url,
      type: "form",
      params: formData
    }).then(res => {
      setTimeout(function() {
        Toast.clear()
        if (res.data.resultCode == "0") {
          setTimeout(function() {
            Toast.success("操作成功")
            setTimeout(function() {
              name != "save2" ? wx.navigateBack({
                delta: 1,
              }) : that.handleReset()
            }, 1000)
          }, 600)
        } else {
          let msg = res.data.resultDesc == "操作失败：员工姓名不可重复!" ? "姓名重复" : "操作失败"
          setTimeout(function() {
            Toast.fail(msg)
          }, 600)
        }
      }, 600)
    }).catch(error => {
      setTimeout(function() {
        Toast.clear()
      }, 600)
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