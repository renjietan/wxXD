// accountBook/pages/cldform/cldform.js
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
    havePre:true,
    nowYear: new Date().getFullYear(),
    preYear: new Date().getFullYear() - 1,
    table: [],
    total:{},
    subsidy:true,
    return_money:false,
    isShow1:true,
    isShow2:true,
  },

  format(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&,');
  },
  //点击跳转
  handleClick(event) {
    let res = event.target.dataset
    console.log(res)
    wx.navigateTo({
      url: '../incomeformDetails/incomeformDetails?type=' + res.type + "&year=" + res.year + "&name=" + res.name,
    })
  },
  // 展开收缩
  slide:function(event){
    let res = event.target.dataset
    
    if(res.type==1){
      this.setData({isShow1:!this.data.isShow1})
    } else if (res.type == 2){
      this.setData({ isShow2: !this.data.isShow2 })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    $request({
      url: app.globalData.server9401 +"income/selectInComeStatement",
      type: "form"
    }).then(res => {
      console.log(res)
      if(!res.data.data.flag){
        this.setData({havePre:false})
      }
      if(res.data.resultCode=="0"){
        let total = {
          name:"总收入金额",
          nowYear:res.data.data.sum[this.data.nowYear],
          preYear:res.data.data.sum[this.data.preYear]
        }
        // console.log(total)
        this.setData({
          total:total,
          tbody:res.data.data.data
        })
      }
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