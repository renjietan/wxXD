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
    nowYear:new Date().getFullYear(),
    preYear: new Date().getFullYear()-1,
    table:[
      // {
      //   name:"合计",
      //   nowYear:"45000",
      //   preYear:"50000"
      // },
      // {
      //   name: "药品",
      //   nowYear: "5000",
      //   preYear: "5000"
      // },
      // {
      //   name: "饲料",
      //   nowYear: "4000",
      //   preYear: "5000"
      // },
    ]

  },

  format(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&,');
  },
  //点击跳转
  handleClick(event){
    let res = event.target.dataset
    if (res.type){
      wx.navigateTo({
        url: '../cldformDetails/cldformDetails?type=' + res.type + "&year=" + res.year,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $request({
      url: app.globalData.server9696 +"excel/findAllList",
      type: "form"
    }).then(res => {
      // console.log(res)
      let table = res.data.data
      table.forEach((d,i)=>{
        d.name == "药品" ? d.type = "wx_druginfo" : ""
        d.name == "饲料" ? d.type = "wx_fodder" : ""
        d.name == "苗种" ? d.type = "wx_seed" : ""
        d.name == "肥料" ? d.type = "wx_fertilizer" : ""
        d.name == "农机费用" ? d.type = "wx_machinery" : ""
      })
      // console.log(table)
      table = table.sort((a,b)=>{
        return b.nowYear - a.nowYear
      })
      if(res.data.resultCode==0){
        // console.log(table[table.findIndex((n) => { return n.name == "合计" })].preYear)
        if (table[table.findIndex((n)=>{return n.name=="合计"})].preYear == "0") {
          this.setData({ havePre: false })
        }
        this.setData({ table: table})
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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