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
      machineName: "", //农机名称
      purchaseTime: "", //购买时间
      amount: "", //购买金额
      remarks: "", //补充说明
    },
    show: false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
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
      ['form.purchaseTime']: date
    });
  },
  //时间点击取消
  onNo(event) {
    console.log(event)
    this.setData({
      show: false
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
    let {
      amount,
      machineName
    } = this.data.form
    let inputtest = /^\d{1,9}(\.\d{1,2})?$/;
     if (machineName == "" || machineName == null) {
      $Message({
        content: '请输入名称',
        type: 'error'
      });
     } else if (amount == "" || amount == null) {
       $Message({
         content: '请输入价格',
         type: 'error'
       });
     } else {
      Toast.loading({
        mask: true,
        duration: 0,
        message: '加载中...'
      });
      if (this.data.id) {
        //编辑
        $request({
          url: app.globalData.server11110 + "farm/updateMachineryinfo",
          type: "form",
          params: Object.assign(this.data.form, {

            miId: this.data.id
          })
        }).then(res => {
          console.log(res)
          if (res.data.resultCode == "0") {
            Toast.success("操作成功")
            setTimeout(() => {
              wx.navigateBack({
                url: '../machineryinfolist/machineryinfolist',
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
          url: app.globalData.server11110 + "farm/addMachineryinfo",
          type: "form",
          params: this.data.form
        }).then(res => {
          console.log(res)
          if (res.data.resultCode == "0") {
            Toast.success("操作成功")
            setTimeout(() => {
              wx.navigateBack({
                url: '../machineryinfolist/machineryinfolist',
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
    let date = formatData(new Date())
    if (options.id) {
      this.setData({
        id: options.id
      })
      wx.setNavigationBarTitle({
        title: '编辑'
      })
      $request({
        url: app.globalData.server11110 + "farm/selectMachineryinfoMiId",
        type: "form",
        params: {

          miId: this.data.id
        }
      }).then(res => {
        console.log(res)
        if (res.data.resultCode == "0") {
          console.log(111)
          this.setData({
            form: res.data.data[0]
          })
        } else {

        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加'
      })
      this.setData({
        'form.purchaseTime': date
      })
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