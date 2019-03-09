// accountBook/pages/add/add.js
import {
  $request,
  $convertDate
} from "../../../utils/util.js"
import Toast from '../../../dist/toast/toast';
import Notify from '../../../dist/notify/notify';

const serverList = getApp().globalData;
Page({


  /**
   * 组件的初始数据
   */
  data: {
    formData: {
      id: "",
      amount: "", //金额
      currentDate: $convertDate(new Date().getTime()), //账单时间
      remarks: "", //补充说明
      payer: '' //付款方
    },
    routerList: {
      "edit": {
        name: "编辑",
        "url_update": serverList.server9401 + "returnmoney/updateReturnMoney",
        'url_Query': serverList.server9401 + "returnmoney/selectReturnMoneyById",
      },
      "add": {
        name: "新增",
        "url_add": serverList.server9401 + "returnmoney/insertReturnMoney",
      }
    },
    currentRouter: {},
    currentDate: new Date().getTime(),
    isVisiableDate: false, //日期显示隐藏
    isVisiableCause: false, //补贴原因显示隐藏
    isVisiableText: false, //多行文本显示隐藏
  },
  handleisVisiableDate() {
    this.setData({
      isVisiableDate: !this.data.isVisiableDate
    })
  },
  handleChangeText(e) {
    let key = 'formData'.concat('.', e.currentTarget.dataset.type)
    this.setData({
      [key]: e.currentTarget.dataset.type == "remarks" ? e.detail.value : e.detail
    })
  },
  handleChangeDate(e) {
    this.setData({
      'formData.currentDate': $convertDate(e.detail),
      "currentDate": e.detail,
    })
    this.handleisVisiableDate()
  },
  handleTextarea() {
    this.setData({
      "isVisiableText": !this.data.isVisiableText
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let type = options.type;
    let that = this
    that.setData({
      currentRouter: that.data.routerList[type]
    })
    wx.setNavigationBarTitle({
      title: that.data.currentRouter.name,
    })
    if (type == "edit") {
      that.setData({
        'formData.id': options.id,
      })
      Toast.loading({
        mask: true,
        message: "加载中",
        duration: 0
      })
      $request({
        url: that.data.currentRouter.url_Query,
        params: {
          id: that.data.formData.id
        },
        type: "form"
      }).then(res => {
        setTimeout(function() {
          that.handleTextarea()
          that.setData({
            'formData.remarks': res.data.data.remarks,
            "formData.currentDate": res.data.data.payment_ime,
            'formData.amount': res.data.data.amount,
            'formData.payer': res.data.data.payer,            
            "currentDate": new Date(res.data.data.payment_ime).getTime()
          })
          Toast.clear()
        }, 600)
      })
    }else{
      that.handleTextarea()
    }
    // else {
    //   Toast.loading({
    //     mask: true,
    //     message: "加载中",
    //     duration: 0
    //   })
    //   $request({
    //     url: that.data.currentRouter.url_queryType,
    //     type: "form"
    //   }).then(res => {
    //     setTimeout(function() {
    //       that.handleTextarea()
    //       that.setData({
    //         "causeList": res.data.data.map(item => {
    //           item.name = item.dictionarie_type_name;
    //           item.id = item.dictionarie_id;
    //           return item
    //         })
    //       })
    //       Toast.clear()
    //     }, 600)
    //   })
    // }
  },
  handleSubmit() {
    let that = this
    let formData = that.data.formData
    if (!/^\d*(?:\.\d{0,2})?$/.test(formData.amount) || formData.amount.toString().length > 10 || formData.amount.toString().length == 0) {
      Notify("金额保留俩位小数，且长度范围为1-10位")
    } else if (formData.remarks.length > 200) {
      Notify("【补充说明】字符串长度不可超过200")
    } else if (formData.payer.length == 0 || formData.payer.length > 20) {
      Notify("【付款方】字符串长度1-20")
    } else {
      Toast.loading({
        mask: true,
        duration: 0,
        message: "加载中..."
      })
      $request({
        url: that.data.currentRouter.url_update ? that.data.currentRouter.url_update : that.data.currentRouter.url_add,
        type: "form",
        params: {
          rrId: formData.id,
          amount: formData.amount,
          payment_ime: formData.currentDate,
          payer: formData.payer,
          remarks: formData.remarks
        }
      }).then(res => {
        setTimeout(function() {
          Toast.clear();
          setTimeout(function() {
            Toast.success("操作成功")
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }, 600)
        }, 600)
      })
    }
  },
})