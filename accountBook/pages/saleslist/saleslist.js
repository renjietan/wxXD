// accountBook/pages/craylist/craylist.js
import { $request, formatData, parserNum } from "../../../utils/util.js";
const { $Message } = require('../../../dist1/base/index');
const { $Toast } = require('../../../dist1/base/index');
import Dialog from '../../../dist/dialog/dialog';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataname: [],
    active: 0,
    groupname: [],
    zxltk: [],
    ygzsrtk: [],
    pjjtk: [],
    sczpc: [],
    zxltksum: null,
    ygzsrtksum: null,
    pjjtksum: null,
    sczpcsum: null,
    yeardata: [new Date().getFullYear(), new Date().getFullYear() - 1],
    this_year_zxl: [],
    this_year_zsr: [],
    this_year_pjj: [],
    last_year_zxl: [],
    last_year_zsr: [],
    last_year_pjj: [],
    
    this_year_zxl_sum:null,
    this_year_zsr_sum: null,
    this_year_pjj_sum: null,
    last_year_zxl_sum: null,
    last_year_zsr_sum: null,
    last_year_pjj_sum: null,
    flag:1
  },
  //获取报表列表
  //app.globalData.serverBook +
  getAlllist() {
    $request({
      url: app.globalData.serverBook +"sell/selectSellStatement2",
      method: "POST",
      type: 'form',
    }).then(res => {
      if (res.data.resultCode == 0) {
        let dataname = [];
        let this_year_zxl = [];
        let this_year_zsr = [];
        let this_year_pjj = [];
        let last_year_zxl = [];
        let last_year_zsr = [];
        let last_year_pjj = [];
        let datalist = res.data.data.data;
        let datasum = res.data.data.sum;
        
        for (let i in datalist) {
          console.log(datalist[i].name)
          dataname.push(datalist[i].name)
          this_year_zxl.push(datalist[i].this_year_output)
          this_year_zsr.push(parserNum(datalist[i].this_year_amount))
          this_year_pjj.push(parserNum(datalist[i].this_year_average))
          last_year_zxl.push(datalist[i].last_year_output)
          last_year_zsr.push(parserNum(datalist[i].last_year_amount))
          last_year_pjj.push(parserNum(datalist[i].last_year_average))
        }


        this.setData({
          dataname: dataname,
          this_year_zxl: this_year_zxl,
          this_year_zsr: this_year_zsr,
          this_year_pjj: this_year_pjj,
          last_year_zxl: last_year_zxl,
          last_year_zsr: last_year_zsr,
          last_year_pjj: last_year_pjj,
          this_year_zxl_sum: datasum.this_year.year_allOutPut,
          this_year_zsr_sum: parserNum(datasum.this_year.year_allIn),
          this_year_pjj_sum: parserNum(datasum.this_year_all_avg),
          last_year_zxl_sum: datasum.last_year.year_allOutPut,
          last_year_zsr_sum: parserNum(datasum.last_year.year_allIn),
          last_year_pjj_sum: parserNum(datasum.last_year_all_avg),
          flag: res.data.data.flag
        })

      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => {


    })
  },
  //获取塘口报表
  //app.globalData.serverBook + 
  getgroup() {
    $request({
      url: app.globalData.serverBook +"sell/selectSellStatementByGroup",
      method: "POST",
      type: 'form',
    }).then(res => {
      if (res.data.resultCode == 0) {
        let zxltk = [];
        let ygzsrtk = [];
        let pjjtk = [];
        let sczpc = [];
        let groupname = [];
        let datalist = res.data.data.data;
        let datasum = res.data.data.sum;
        for (let i in datalist) {
          groupname.push(datalist[i].name);
          zxltk.push(datalist[i].data.allOutPut);
          ygzsrtk.push(parserNum(datalist[i].data.allIn));
          pjjtk.push(parserNum(datalist[i].data.average_money));
          sczpc.push(datalist[i].data.count);
        }
        console.log(sczpc)
        console.log(datalist, datasum)
        this.setData({
          groupname: groupname,
          zxltk: zxltk,
          ygzsrtk: ygzsrtk,
          pjjtk: pjjtk,
          sczpc: sczpc,
          zxltksum: datasum.year_allOutPut,
          ygzsrtksum: parserNum(datasum.year_allIn),
          pjjtksum: parserNum(datasum.year_average),
          sczpcsum: datasum.year_count,
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
    wx.getSystemInfo({
      success(res) {
        console.log('屏幕宽度',res.screenWidth)
      }
    })
  },
  onShow: function () {
    this.getAlllist();
    this.getgroup();
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