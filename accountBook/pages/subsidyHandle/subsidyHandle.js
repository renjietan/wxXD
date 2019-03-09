// accountBook/pages/add/add.js
import { $request, $convertDate} from "../../../utils/util.js"
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
      amount: "", //药品价格
      currentDate: $convertDate(new Date().getTime()), //账单时间
      cause: "", //补贴类型
      remarks: "", //补充说明
      causeId: ''
    },
    routerList:  {
      "edit":{
        name: "补贴编辑",
        "url_update": serverList.server9401 + "subsidy/updateSubsidy",
        "url_queryType": serverList.server9401 + "subsidy/selectSubsidyType",
        'url_Query': serverList.server9401 + "subsidy/selectSubsidyById",
      },
      "add":{
        name: "补贴新增",
        "url_queryType": serverList.server9401 + "subsidy/selectSubsidyType",
        "url_add": serverList.server9401 + "subsidy/insertsubsidy",        
      }
    },
    currentRouter:{},
    currentDate: new Date().getTime(),
    isVisiableDate: false, //日期显示隐藏
    isVisiableCause:false, //补贴原因显示隐藏
    isVisiableText: false, //多行文本显示隐藏
    causeList: [], //补贴原因
  },
  handleisVisiableDate() {
    this.setData({
      isVisiableDate: !this.data.isVisiableDate
    })
  },
  handleChangeText(e){
    let key = 'formData'.concat('.', e.currentTarget.dataset.type)
    this.setData({
      [key]: e.currentTarget.dataset.type == "remarks" ? e.detail.value : e.detail
    })
  },
  handleisVisiableCause(){
    this.setData({
      isVisiableCause: !this.data.isVisiableCause
    })
  },
  handleChangeCause(e){
    this.setData({
      "formData.cause": e.detail.name,
      "formData.causeId": e.detail.id
    })
    this.handleisVisiableCause()
  },
  handleChangeDate(e){
    this.setData({
      'formData.currentDate': $convertDate(e.detail),
      "currentDate": e.detail,
    })
    this.handleisVisiableDate()
  },
  handleTextarea(){
    this.setData({
      "isVisiableText": !this.data.isVisiableText
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let type = options.type;
    let that = this
    that.setData({
      currentRouter: that.data.routerList[type]
    })
    wx.setNavigationBarTitle({
      title: that.data.currentRouter.name,
    })
    if(type == "edit"){
      that.setData({
        'formData.id': options.id,
      })
      Toast.loading({
        mask: true,
        message: "加载中",
        duration: 0
      })
      let getCauseList = $request({
        url: that.data.currentRouter.url_queryType,
        type: "form"
      })
      let getFormData = $request({
        url: that.data.currentRouter.url_Query,
        params:{
          id: that.data.formData.id
        },
        type: "form"
      })
      Promise.all([getFormData, getCauseList]).then(res => {
        setTimeout(function(){
          that.handleTextarea()
          that.setData({
            'formData.remarks': res[0].data.data.remarks,
            "formData.currentDate": res[0].data.data.get_time,
            'formData.amount': res[0].data.data.amount,
            'formData.cause': res[0].data.data.dictionarie_type_name,
            'formData.causeId': res[0].data.data.kindid,
            "currentDate": new Date(res[0].data.data.get_time).getTime(),
            "causeList": res[1].data.data.map(item => {
              item.name = item.dictionarie_type_name;
              item.id = item.dictionarie_id;
              return item
            })
          })
          Toast.clear()
        },600)
      }).catch(error => {
        setTimeout(function(){
          Toast.clear()
        },600)
      })
    }else{
      Toast.loading({
        mask: true,
        message: "加载中",
        duration: 0
      })
      $request({
        url: that.data.currentRouter.url_queryType,
        type: "form"
      }).then(res => {
        setTimeout(function(){
          that.handleTextarea()
          that.setData({
            "causeList": res.data.data.map(item => {
              item.name = item.dictionarie_type_name;
              item.id = item.dictionarie_id;
              return item
            })
          })
          Toast.clear()
        },600)
      })
    }
  },
  handleSubmit(){
    let that = this
    let formData = that.data.formData
    if (!/^\d*(?:\.\d{0,2})?$/.test(formData.amount) || formData.amount.toString().length > 10 || formData.amount.toString().length == 0){
      Notify("金额保留俩位小数，且长度范围为1-10位")
    } else if (formData.remarks.length > 200){
      Notify("【补充说明】字符串长度不可超过200")
    } else if (formData.cause == "") {
      Notify("请选择补充原因")
    }else{
      Toast.loading({
        mask: true,
        duration: 0,
        message: "加载中..."
      })
      $request({
        url: that.data.currentRouter.url_update ? that.data.currentRouter.url_update : that.data.currentRouter.url_add,
        type: "form",
        params: {
          suId: formData.id,
          amount: formData.amount,
          get_time: formData.currentDate,
          kindid: formData.causeId,
          remarks: formData.remarks
        }
      }).then(res => {
        setTimeout(function(){
          Toast.clear();
          setTimeout(function(){
            Toast.success("操作成功")
            setTimeout(function(){
              wx.navigateBack({
                delta:1
              })
            },1000)
          },600)
        },600)
      })
    }
  },
})