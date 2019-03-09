// accountBook/pages/cldformDetails/cldformDetails.js
const {
  $request
} = require('../../../utils/util.js');
const {
  $Message
} = require('../../../dist1/base/index');
import {
  groupByList
} from "../../../utils/util.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noData:false,
    icon: "icon-yaopin",
    listData: {}
  },
  //查询字典
  // searchDic() {
  //   $request({
  //     url: app.globalData.server9696 + "drug/findDictionarycontent",
  //     type: "form",
  //     params: {

  //       diId: "111"
  //     }
  //   }).then(res => {
  //     console.log(res)
  //     if (res.data.resultCode == "0") {
  //       let actions = []
  //       res.data.data.map((d, i) => {
  //         actions.push(d.dcName)
  //       })
  //     } else {

  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // this.searchDic()
    switch (options.type) {
      case "wx_druginfo":
        this.setData({
          icon: "icon-yaopin"
        })
        break;
      case "wx_fodder":
        this.setData({
          icon: "icon-siliao"
        })
        break;
      case "wx_seed":
        this.setData({
          icon: "icon-miaozhong"
        })
        break;
      case "wx_fertilizer":
        this.setData({
          icon: "icon-feiliao"
        })
        break;
      case "wx_machinery":
        this.setData({
          icon: "icon-nongji"
        })
        break;
    }
    $request({
      url: app.globalData.server9696 + "excel/findTypeList",
      type: "form",
      params: {
        type: options.type,
        billing_time: options.year
      }
    }).then(res => {
      console.log(res.data.data)
      if (res.data.resultCode == 0) {
        res.data.data.length == "0" || res.data.data==null ? this.setData({noData:true}) : false
        let list = []
        res.data.data.map((d,i)=>{
          list.push({
            amount: d.amount,
            billing_time: d.billing_time,
            name: d.drug_name || d.feed_name || d.name || d.fertilizer_name,
            quantity: d.quantity,
            remarks: d.remarks,
            unit:d.unit || ""
          })
        })
        console.log(list)
        let listData = groupByList({
          params: list,
          key: "billing_time"
        })
        console.log(listData)
        this.setData({
          listData: listData
        })
      } else {}
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})