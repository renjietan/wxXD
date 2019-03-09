// accountBook/pages/craylist/craylist.js
import {
  formatData
} from "../../../utils/util.js"
import Toast from '../../../dist/toast/toast';
const {
  $request
} = require('../../../utils/util.js');
const {
  $Message
} = require('../../../dist1/base/index');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    form: {
      amount: "", //药品价格
      billing_time: "", //账单时间
      drug_name: "", //药品名称
      quantity: "", //购买量
      dealer_name: "", //经销商名称
      remarks: "", //补充说明
    },
    show: false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    btnColor: "0",
    unit: ["mL", "L", "g", "Kg"],
  },
  //弹出时间选择
  handleClick() {
    this.setData({
      show: true
    })
  },
  //时间点击确定
  onOk(event) {
    // console.log(event.detail)
    let date = new Date(event.detail)
    date = formatData(date)
    this.setData({
      show: false,
      ['form.billing_time']: date
    });
  },
  //时间点击取消
  onNo(event) {
    console.log(event)
    this.setData({
      show: false
    });
  },
  //选择单位
  changeColor(event) {
    // console.log(event)
    // console.log(event.target.dataset.bg)
    this.setData({
      btnColor: event.target.dataset.bg,

    });
  },
  //输入框双向绑定
  changeIn(event) {
    let name = event.target.dataset.name
    this.setData({
      ['form.' + name]: event.detail
    })
  },
  changeInn(event) {
    let name = event.target.dataset.name
    this.setData({
      ['form.' + name]: event.detail.value
    })
  },
  //提交
  submit() {
    // console.log(this.data.form)
    // console.log(this.data.unit[this.data.btnColor])
    let { amount, drug_name, quantity, dealer_name} = this.data.form
    let inputtest = /^\d{1,9}(\.\d{1,2})?$/;
    if(amount == "" || amount == null){
      $Message({
        content: '请输入价格',
        type: 'error'
      });
    } else if (drug_name == "" || drug_name == null){
      $Message({
        content: '请输入名称',
        type: 'error'
      });
    } else if (quantity == "" || quantity == null){
      $Message({
        content: '请输入购买量',
        type: 'error'
      });
    } else if (dealer_name == "" || dealer_name == null) {
      $Message({
        content: '请输入经销商名',
        type: 'error'
      });
    } else{
      Toast.loading({
        mask: true,
        duration:0,
        message: '加载中...'
      });
      if (this.data.id) {
        //编辑
        console.log(Object.assign(this.data.form, {
          diId: this.data.id,
          unit: this.data.unit[this.data.btnColor]
        }))
        $request({
          url: app.globalData.server9696 + "drug/updDrug",
          type: "form",
          params: Object.assign(this.data.form, {

            diId: this.data.id,
            unit: this.data.unit[this.data.btnColor]
          })
        }).then(res => {
          console.log(res)
          if (res.data.resultCode == "0") {
            Toast.success("操作成功")
            setTimeout(() => {
              wx.navigateBack({
                url: '../list/list?type=drug',
                delta:1
              })
            }, 2000)
          } else {
            Toast.fail(res.data.resultDesc)
          }
        })
      } else {
        //添加
        $request({
          url: app.globalData.server9696 + "drug/addDrug",
          type: "form",
          params: Object.assign(this.data.form, {

            unit: this.data.unit[this.data.btnColor]
          })
        }).then(res => {
          console.log(res)
          if (res.data.resultCode == "0") {
            Toast.success("操作成功")
            setTimeout(() => {
              wx.navigateBack({
                url: '../list/list?type=drug',
                delta:1
              })
            }, 2000)
          } else {
            Toast.fail(res.data.resultDesc)
          }
        })
      }
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let date = formatData(new Date())
    if (options.id) {
      this.setData({
        id: options.id
      })
      wx.setNavigationBarTitle({
        title: '编辑'
      })
      $request({
        url: app.globalData.server9696 +"drug/findDrugOne",
        type: "form",
        params: {

          diId: this.data.id
        }
      }).then(res => {
        console.log(res)
        if (res.data.resultCode == "0") {
          delete res.data.data.token
          let index = this.data.unit.indexOf(res.data.data.unit)
          this.setData({
            form: res.data.data,
            btnColor: index
          })
        } else {
          Toast.fail(res.data.resultDesc)
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加'
      })
      this.setData({'form.billing_time':date})
    }
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