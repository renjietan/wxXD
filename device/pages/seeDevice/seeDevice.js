// pages/seeDevice/seeDevice.js
const app = getApp(); Page({

  /**
   * 页面的初始数据
   */
  data: {
    param: {
      deviceId: '',//设备id
      groupName: "", //塘口名称
      // deviceName: "", //设备名称
      device_type_name: "", //设备类型
      deviceCode: "", //设备编码
      supplier: "", //生产厂家
      model: "", //设备型号
      longitude: "", //经度
      latitude: "", //纬度
      data_level:"",//告警等级
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && Object.keys(options).length <= 0) { return }
    let that = this
    let param = JSON.parse(options.param)
    that.setData({
      param: param
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