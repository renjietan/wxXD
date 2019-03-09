// accountBook/pages/craylist/craylist.js
import {
  formatData
} from "../../../utils/util.js"
const {
  $request
} = require('../../../utils/util.js');
const {
  $Message
} = require('../../../dist1/base/index');
const serverList = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    form: {
      amount: "123456", //农机价格
      get_time: "2019-01-22", //账单时间
      kindid: "", //种类
      remarks: "", //补充说明
    },
    showKindId: false,
    show: false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    actions: [],
    kindName: "",
  },
  //弹出选择
  handleClick(event) {
    let name = event.target.dataset.name
    if (name == "farmingMode") {
      this.setData({
        show: true
      })
    } else if (name == "kindName") {
      this.setData({
        showKindId: true
      })
    }
  },
  //时间点击确定
  onOk(event) {
    // console.log(event.detail)
    let date = new Date(event.detail)
    date = formatData(date)
    this.setData({
      show: false,
      ['form.get_time']: date
    });
  },
  //时间点击取消
  onNo(event) {
    console.log(event)
    this.setData({
      show: false
    });
  },
  //种类点确定
  onSelect(event) {
    console.log(event.detail)
    this.setData({
      showKindId: false,
      kindName: event.detail.name,
      ['form.kindid']: event.detail.id
    });
  },
  //种类点取消
  onClose(event) {
    this.setData({
      showKindId: false
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
    console.log(this.data.form)
    if (this.data.id) {
      //编辑
      $request({
        url: serverList.server9401 + "subsidy/updateSubsidy",
        type: "form",
        params: Object.assign(this.data.form,{

          suId: this.data.id
        })
      }).then(res => {
        console.log(res)

      })
    } else {
      //添加
      $request({
        url: serverList.server9401 + "subsidy/insertsubsidy",
        type: "form",
        params: this.data.form
      }).then(res => {
        console.log(res)
        if (res.resultCode == "0") {
          $Message({
            content: res.resultDesc,
            type: 'success'
          });
        } else {
          $Message({
            content: res.resultDesc,
            type: 'error'
          });
        }
      })
    }
  },
  //查询补贴种类
  subKind() {
    $request({
      url: serverList.server9401 + "subsidy/selectSubsidyType",
      type: "form",
      params: {
        token: "token"
      }
    }).then(res => {
      console.log(res)
      if (res.data.resultCode == "0") {
        console.log(res.data.data)
        let kindArr = []
        res.data.data.map((d, i) => {
          kindArr.push({
            id: d.dictionarie_id,
            name: d.dictionarie_type_name
          })
        })
        this.setData({
          actions: kindArr
        })
      } else {
        $Message({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    options.param = "1956340721"
    this.setData({
      id: options.param
    })
    this.subKind()
    if (options.param) {
      wx.setNavigationBarTitle({
        title: '编辑'
      })
      $request({
        url: serverList.server9401 + "subsidy/selectSubsidyById",
        type: "form",
        params: {

          id: this.data.id
        }
      }).then(res => {
        console.log(res)
        if (res.data.resultCode == "0") {
          console.log(111)
          this.setData({
            form: res.data.data,
            kindName: res.data.data.dictionarie_type_name
          })
        } else {
          $Message({
            content: res.resultDesc,
            type: 'error'
          });
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加'
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