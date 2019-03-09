// accountBook/pages/craylist/craylist.js
import { $request, formatData } from "../../../utils/util.js";
const { $Message } = require('../../../dist1/base/index');
const { $Toast } = require('../../../dist1/base/index');
import Dialog from '../../../dist/dialog/dialog';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tablenamea: ['长工','临时工'],
    tablesum2018a:null,
    tablesum2019a: null,
    tabledata2018a:[],
    tabledata2019a: [],
    tablenameb: ['总人数', '工作总天数', "平均工时"],
    tabledata2018b: [],
    tabledata2019b: [],
    yeardata:[],
    isShow: true,
    currYear: Number(new Date().getFullYear()),
  },
  //获取报表列表
  selectAllSalary() {
    $request({
      url: app.globalData.serverWorker+"Last/selectAllSalary",
      method: "POST",
      type: 'form',
    }).then(res => {
      if (res.data.resultCode == 0) {
        let data = res.data;
        let data2018=[];
        let data2019 = [];
        console.log(data.ChangFormerly.sum)
        data2018.push(data.ChangFormerly.sum, data.DuanFormerly.sum)
        data2019.push(data.ChangNow.sum, data.DuanNow.sum)
        let temp = new Set(data2018)
        if(temp.size == 1 && temp.has(0)){
          data2018 = []
        }
        this.setData({
          tabledata2018a:data2018,
          tabledata2019a: data2019,
          tablesum2018a: data.SumFormerly.allSum,
          tablesum2019a: data.SumNow.allSum
        })

      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  //临时工用工报表接
  selectAllWorkers() {
    $request({
      url: app.globalData.serverWorker +"Last/selectAllWorkers",
      method: "POST",
      type: 'form',
    }).then(res => {
      if (res.data.resultCode == 0) {
        let data = res.data;
        let data2018b = [];
        let data2019b = [];
        data2019b.push(data.WorkersNow.sum, data.HoursNow.sum, data.HoursNow.sum != 0 && data.WorkersNow.sum != 0 ? (data.HoursNow.sum / data.WorkersNow.sum).toFixed(2) : "0.00") 
        data2018b.push(data.WorkersFormerly.sum, data.HoursFormerly.sum, data.WorkersFormerly.sum != 0 && data.HoursFormerly.sum != 0 ? (data.HoursFormerly.sum / data.WorkersFormerly.sum).toFixed(2) : "0.00") 

        this.setData({
          tabledata2018b: data2018b,
          tabledata2019b: data2019b,
        })

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
  },
  onShow: function () {
    this.selectAllSalary();
    this.selectAllWorkers();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */


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