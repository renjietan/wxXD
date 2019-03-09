// accountBook/pages/craylist/craylist.js
import { $request, formatData } from "../../../utils/util.js";
const { $Message } = require('../../../dist1/base/index');
const { $Toast } = require('../../../dist1/base/index');
import Toast from '../../../dist/toast/toast';
import Dialog from '../../../dist/dialog/dialog';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowGroup: false,
    groupData: null,
    groupName: '所有塘口',
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
      url: app.globalData.serverBook + "crayfish_production_marketing/selectCrayfishOrderByoutput",
      method: "POST",
      type: 'form',
    }).then(res => {
      console.log('小龙虾列表', res.data)
      setTimeout(()=>{
        Toast.clear();
      },600)
      if (res.data.resultCode == 0) {
        let listData = res.data.data.data;
        if (listData.length > 0) {
          this.setData({
            allData: listData,
            data: listData,
            sum: res.data.data.sum_output
          }, () => {
            this.getnewlist();
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
  //获取塘口列表
  getpondlist() {
    $request({
      url: app.globalData.serverHYH + "QueryAllGroupInfo",
      method: "GET"
    }).then(res => {
      console.log('塘口列表', res.data)
      if (res.data.resultCode == 0) {
        let groupData = res.data.data;
        if (groupData.length > 0 && res.data) {
          let newlistpond = [{
            'name': '所有塘口',
            'groupid': null
          }];
          groupData.forEach(item => {
            newlistpond.push({
              'name': item.groupname,
              'groupid': item.groupid
            })
          })
          this.setData({
            groupData: newlistpond,
            groupName: newlistpond[0].name,
            groupId: newlistpond[0].groupid,
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
  //选择塘口
  handleGroupConfirm(event) {
    this.setData({
      groupName: event.detail.name,
      groupId: event.detail.groupid,
      isShowGroup: false
    }, () => {
      this.getnewlist();
    })
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
      url: app.globalData.serverBook + "crayfish_production_marketing/isInvalidCrayfish",
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
  //获取选中列表
  getnewlist() {
    let newdata = [];
    if (this.data.groupName == '所有塘口') {
      newdata = this.data.allData;
    } else {
      newdata = this.data.allData.filter((item) => {
        return item.groupId == this.data.groupId;
      });
    }
    let sum=0;
    newdata.forEach((item)=>{
      console.log(item)
      sum += item.output;

    })
    this.setData({
      data: newdata,
      sum:sum
    })
    console.log(this.data.data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getpondlist();
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