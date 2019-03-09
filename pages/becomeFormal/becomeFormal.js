// pages/becomeFormal/becomeFormal.js
const { $Toast } = require('../../dist1/base/index');
const { $Message } = require('../../dist1/base/index');
import { $request } from "../../utils/util.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  handleClick() {
    let updateExperienceState = $request({ url: app.globalData.serverWJ + "wx/user/updateExperienceState.do", method: "POST" });
    let getUserState = $request({ url: app.globalData.serverWJ + "wx/user/getUserState.do", method: "POST" });

    Promise.all([updateExperienceState, getUserState]).then(res => {
      console.log(res)
      let restwo = res[1];
      if (res[0].data.resultCode == 0){
        if (restwo.data.resultCode == 0) {
          let isExperience = restwo.data.isExperience;
          let deviceCount = restwo.data.deviceCount;
          let groupCount = restwo.data.groupCount;
          if (deviceCount == 0 && groupCount == 0) {
            //正式用户跳转添加塘口设备页面
            wx.reLaunch({
              url: '../use/use'
            })
          } else {
            //正式用户跳转正式首页
            wx.switchTab({
              url: '../index/index'
            })
          }
        } else {
          $Toast({
            content: res[1].data.resultDesc,
            type: 'error'
          });
        }
      }else{
        $Toast({
          content: res[0].data.resultDesc,
            type: 'error'
          });
      }
      
    }).catch(error => {
      $Toast({
        content: error,
        type: 'error'
      });
    })


    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.token = wx.getStorageSync('token');
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