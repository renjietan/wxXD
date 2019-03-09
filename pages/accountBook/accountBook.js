// pages/accountBook/accountBook.js
import { $request, parserNum} from "../../utils/util.js"
const {  $Message} = require('../../dist1/base/index');
const { $Toast } = require('../../dist1/base/index');
import Toast from '../../dist/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zsrValue:0,
    zcbValue: 0,
    zheValue: 0,
    show: false,
    currentDate: new Date().getTime(),
    parserCurrentDate: new Date().getFullYear()
  },
  isVisiableDate() {
    this.setData({
      show: !this.data.show
    })
  },
  handleChangeDate(e) {
    var that = this
    that.setData({
      currentDate: e.detail,
      parserCurrentDate: new Date(e.detail).getFullYear(),
      show: false
    }, () => {
      this.getdata();
    })

  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    


  },
  getdata(){
    Toast.loading({
      mask: true,
      duration: 0,
      message: '加载中...'
    })
    //获取预估收入
    let getestimatedIncome = $request({
      url: app.globalData.serverWeather + "Wx/selectForecast",
      method: "POST",
      type: 'form',
      params: {
        paymenTime: this.data.parserCurrentDate
      }
    })

    //获取总成本
    let getstatistics = $request({
      url: app.globalData.serverWeather + "Wx/selectIncome",
      method: "POST",
      type: 'form',
      params: {
        paymenTime: this.data.parserCurrentDate
      }
    })

    //获取回款额
    let getreturnedMoney = $request({
      url: app.globalData.serverWeather + "Wx/selectReturnRecord",
      method: "POST",
      type: 'form',
      params: {
        paymenTime: this.data.parserCurrentDate
      }
    })

    Promise.all([getestimatedIncome, getstatistics, getreturnedMoney]).then(res => {
      setTimeout(() => {
        Toast.clear();
      }, 600)
      let res1 = res[0];
      let res2 = res[1];
      let res3 = res[2];
      console.log('预估收入', res1.data)
      if (res1.data.resultCode == 0) {
        let sum = res1.data.data.Sum[0].sum;
        this.setData({
          zsrValue: parserNum(sum)
        })
      } else {
        $Toast({
          content: res1.data.resultDesc,
          type: 'error'
        });
      }

      console.log('总成本', res2.data)
      if (res2.data.resultCode == 0) {
        let sum2 = res2.data.data.Sum[0].sum;
        this.setData({
          zcbValue: parserNum(sum2)
        })
      } else {
        $Toast({
          content: res2.data.resultDesc,
          type: 'error'
        });
      }

      console.log('回款额', res3.data)
      if (res3.data.resultCode == 0) {
        let sum3 = res3.data.data.Sum[0].sum;
        this.setData({
          zheValue: parserNum(sum3)
        })
      } else {
        $Toast({
          content: res3.data.resultDesc,
          type: 'error'
        });
      }



    }).catch(error => {
      setTimeout(() => {
        Toast.clear();
      }, 600)
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
    this.getdata();

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