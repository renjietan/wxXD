// pages/accountBookList/accountBookList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:{
      workerList: "../../../farmingCarlendar/pages/workerList/workerList", //人员登记
      holiday: "../list/list?type=holiday", //长工请假
      workerCompList: "../workerCompList/workerCompList", //临时工工时,
      payerYZ: "../payerYZ/payerYZ", //预支费用
      payerLSG: "../payerLSG/payerLSG", //临时工结算
      payerCG: "../payerCG/payerCG", //长工计算
      cost: "../workerCompTable/workerCompTable", //报表
    }
  },
  handleEventNav(e){
    let nav = e.currentTarget.dataset.type
    let navList = this.data.navList
    wx.navigateTo({
      url: navList[nav],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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