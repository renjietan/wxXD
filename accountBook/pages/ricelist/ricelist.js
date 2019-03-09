// accountBook/pages/craylist/craylist.js
import { $request, formatData } from "../../../utils/util.js";
const { $Message } = require('../../../dist1/base/index');
const { $Toast } = require('../../../dist1/base/index');
import Dialog from '../../../dist/dialog/dialog';
import Toast from '../../../dist/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowGroup: false,
    groupData: null,
    groupName: null,
    groupId: null,
    sum: null,
    data: null,
    allData: null
  },
  isOpenGroup() {
    this.setData({
      isShowGroup: !this.data.isShowGroup,
    })
  },
  //获取产销列表
  getAlllist() {
    Toast.loading({
      mask: true,
      duration: 0,
      message: '加载中...'
    })
    $request({
      url: app.globalData.serverBook + "rice_production_marketing/selectRiceOrderByoutput",
      method: "POST",
      type: 'form',
    }).then(res => {
      console.log('水稻列表', res.data)
      setTimeout(() => {
        Toast.clear();
      }, 600)
      if (res.data.resultCode == 0) {
        let listData = res.data.data.data;
        if (listData.length > 0) {
          this.setData({
            allData: listData,
            data: listData,
            sum: res.data.data.sum_output
          })
          console.log(this.data.data)
        }else{
          this.setData({
            allData: [],
            data: [],
            sum: 0
          })
        }
      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error =>{ })
  },
  //滑动列表
  onClose(event) {
    const { position, instance } = event.detail;
    this.instance = instance;
    const id = event.target.dataset.id;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？'
        }).then(() => {

          this.del(id);
        });
        break;
    }
  },
  //删除列表
  del(id) {
    $request({
      url: app.globalData.serverBook + "rice_production_marketing/isInvalidRice",
      method: "POST",
      type: "form",
      params: {
        id: id,
        isInvalid: 1
      }
    }).then(res => {
      Toast.loading({
        mark: true,
        duration: 0,
        message: "加载中"
      })
      console.log('删除', res.data)
      if (res.data.resultCode == 0) {
        this.instance.close();
        this.getAlllist();
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
    this.getAlllist();
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