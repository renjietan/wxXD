// accountBook/pages/summary/summary.js
import { $request, formatData, parserNum } from "../../../utils/util.js"
const { $Message } = require('../../../dist1/base/index');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:null,
    sum:null,
    show:false,
    currentDate: new Date().getTime(),
    parserCurrentDate: new Date().getFullYear(),
  },
  isVisiableDate(){
    this.setData({
      show:!this.data.show
    })
  },
  handleChangeDate(e){
    var that = this
    that.setData({
      currentDate: e.detail,
      parserCurrentDate: new Date(e.detail).getFullYear(),
      show: false
    },()=>{
      this.getreturnedMoney()
    })
    
  },
  //获取回款额
  getreturnedMoney() {
    $request({
      url: app.globalData.serverWeather + "Wx/selectReturnRecord",
      method: "POST",
      type: 'form',
      params:{
        paymenTime: this.data.parserCurrentDate
      }
    }).then(res => {
      console.log('回款额', res.data)
      if (res.data.resultCode == 0) {

        let newdata=[];
        let sum = res.data.data.Sum[0].sum;
        if (sum !== 0) {
        res.data.data.All.forEach(item=>{
          newdata.push({
            name: item.payer,
            data: parserNum(item.amount),
            databl: (item.amount / sum * 100).toFixed(2)
          })
        })
        this.setData({
          data: newdata,
          sum: parserNum(sum),
        })
      } else {
        this.setData({
          data: null,
          sum: 0
        })
      }
      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getreturnedMoney();
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