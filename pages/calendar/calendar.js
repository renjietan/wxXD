// pages/calendar/calendar.js
import { $request } from "../../utils/util.js"
import Toast from '../../dist/toast/toast';
const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupCount: 0,
    workerCount: 0,
    Url_Group: app.globalData.serverHYH,
    Url_Worker: app.globalData.serverWorker,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
  },
  navGroupList() {
    wx.navigateTo({
      url: '../../farmingCarlendar/pages/pondList/pondList',
    })
  },
  navWorkerList() {
    wx.navigateTo({
      url: '../../farmingCarlendar/pages/workerList/workerList',
    })
  },
  navAddGroup(){
    wx.navigateTo({
      url: '../../farmingCarlendar/pages/addPond/addPond?groupInfo=',
    })
  },
  navAddWorker(){
    wx.navigateTo({
      url: '../../farmingCarlendar/pages/addWorker/addWorker?workerInfo=',
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
    var that = this
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    let groupInfo = $request({ url: this.data.Url_Group + "QueryAllGroupInfo", method: "GET" });
    let workerInfo = $request({ url: this.data.Url_Worker + "staff/findByOwer", type: "form" });
    Promise.all([groupInfo, workerInfo]).then(res => {
      setTimeout(function () {
        let _groupInfo = res[0].data.data;
        let _workerInfo = res[1].data.data
        that.setData({
          groupCount: _groupInfo.length,
          workerCount: _workerInfo.length
        })
        // debugger
        // if(_groupInfo.length > 0 && _workerInfo.length > 0){
        //   wx.redirectTo({
        //     url: '../farmingHome/farmingHome',
        //   })
        // }
        Toast.clear();
      }, 600)
    }).catch(error => {
      Toast.clear();
    })
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