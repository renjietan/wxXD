import Toast from '../../../dist/toast/toast';
import Notify from '../../../dist/notify/notify';
import { $request, $convertDate  } from "../../../utils/util.js";
import Dialog from '../../../dist/dialog/dialog';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _Url: app.globalData.serverWorker,
    workerListInfo:[],
    activeNames:["1",0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  handleRouter(e){
    let params = e.currentTarget.dataset.sid
    wx.navigateTo({
      url: "../addWorker/addWorker?workerInfo=" + JSON.stringify(params),
    })
  },
  handleDelete(e){
    let sId = e.currentTarget.dataset.sid
    let that = this
    Dialog.confirm({
      title: '删除',
      message: '是否删除工人?'
    }).then(() => {
      Toast.loading({
        mask: true,
        message: "加载中...",
        duration: 0
      })
      $request({
        url: that.data._Url + "staff/updateIsDelete",
        params: {
          sId: sId
        },
        type: "form"
      }).then(res => {
        setTimeout(function () {
          Toast.clear()
          setTimeout(function () {
            if (res.data.resultCode == "0") {
              Toast.success("操作成功")
              return $request({
                url: that.data._Url + "staff/findByOwer",
                type: 'form'
              }).then(result => {
                setTimeout(function () {
                  that.setData({
                    workerListInfo: result.data.data
                  })
                }, 600)
              }).catch(error => {
                Toast.clear()
              })
            } else {
              Toast.fail("操作失败")
              return false
            }
          }, 600)
        }, 600)
      }).catch(error => {
        Toast.clear()
      })
    }).catch(() => {
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onChange(e){
    this.setData({
      activeNames: e.detail
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    Toast.loading({
      mask: true,
      message: "加载中",
      duration: 0
    })
    $request({
      url: that.data._Url + "staff/findByOwer",
      type: 'form'
    }).then(res => {
      setTimeout(function () {
        Toast.clear()
        that.setData({
          workerListInfo: res.data.data
        })
      }, 600)
    }).catch(error => {
      Toast.clear()
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