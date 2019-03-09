// accountBook/pages/cldformDetails/cldformDetails.js
const {
  $request
} = require('../../../utils/util.js');
const {
  $Message
} = require('../../../dist1/base/index');
import {
  groupByList
} from "../../../utils/util.js"
import Dialog from '../../../dist/dialog/dialog';
import Toast from '../../../dist/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: {},
    isList:false,
  },

// //编辑
//   handleEdit(event){
//     console.log(event.target.dataset)
//     // wx.navigateTo({
//     //   url: '../machineryinfoAdd/machineryinfoAdd?id=' + event.target.dataset.typeid,
//     // })
//   },
//删除
  handleDel(event){
    let that = this
    console.log(event.target.dataset.typeid)
    Dialog.confirm({
      title: '删除',
      message: '确定删除吗？'
    }).then(() => {
      Toast.loading({
        mark: true,
        duration: 0,
        message: "加载中"
      })
      let id = event.target.dataset.typeid;
      $request({
        url: app.globalData.server11110+"farm/updateisInvalid",
        params: {
          miId: id
        },
        type: "form"
      }).then(res => {
        setTimeout(function () {
          Toast.clear();
          setTimeout(function () {
            Toast.success("操作成功")
            that.getList()
          }, 600)
        }, 600)
      })
    }).catch(() => {
      Toast.clear()
    });
  },
  //查询list
  getList(){
    $request({
      url: app.globalData.server11110+"farm/selectMachineryinfo",
      type: "form"
    }).then(res => {
      console.log(res.data)
      if (res.data.resultCode == "0") {
        let list = groupByList({
          params: res.data.data,
          key: "purchaseTime"
        })
        console.log(list)
        this.setData({ listData: list, isList: res.data.data.length })
        console.log(this.data.isList)
      } else { }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    console.log(options)
    this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {

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