// pages/newIndex.js
const { $Toast } = require('../../dist1/base/index');
const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    visible: false,
    actions: [{
      name: '确定',
      color: '#ed3f14'
    }]
  },
  //选项卡切换
  onChange(event){
    this.setData({
      active: event.detail
    })
  },
  //传递子组件事件
  hideToast() {
    $Toast.hide();
  },
  //传递子组件事件
  showToast(event) {
    switch (event.detail.type) {
      case 'loading':
        $Toast({
          content: '加载中',
          type: 'loading',
          duration: event.detail.time ? event.detail.time : 2
        });
        break;
      case 'error':
        $Toast({
          content: event.detail.text,
          type: 'error',
          duration: event.detail.time ? event.detail.time : 2
        });
        break;
      case 'success':
        $Toast({
          content: event.detail.text,
          type: 'success',
          duration: event.detail.time ? event.detail.time : 2
        });
        break;
    }

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