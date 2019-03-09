import {
  $request,
  $parseArray
} from "../../../utils/util.js";
import {
  dataRes
} from "../../../utils/network.js";
import Toast from '../../../dist/toast/toast';
import Notify from '../../../dist/notify/notify';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    active: 0,
    _Url: app.globalData.serverFarm,
    handleType: {
      1: {
        name: "投放饲料",
        url: "../../../calendar/pages/fodder/fodder"
      },
      2: {
        name: "投放苗种",
        url: "../../../calendar/pages/seedling/seedling"
      },
      3: {
        name: "投放药品",
        url: "../../../calendar/pages/drug/drug"
      },
      4: {
        name: "农事操作",
        url: "../handle/handle"
      },
    },
    steps: [],
    groupId: "",
    lon: "",
    lat: "",
  },
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    });
  },
  handleTabChange(e) {
    var that = this;
    that.setData({
      active: e.detail.index
    })
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    $request({
      url: that.data._Url + "farm/findFarm",
      type: "form",
      params: {
        groupId: that.data.groupId
      }
    }).then(res => {
      let temp = []
      let parserData = this.parserData(res.data.data)
      setTimeout(function() {
        switch (that.data.active) {
          case 0:
            temp = parserData
            break;
          case 1:
            temp = parserData.filter(item => {
              return !item.operation_type || item.operation_type == 1
            })
            break;
          case 2:
            temp = parserData.filter(item => {
              return !item.operation_type || item.operation_type == 2
            })
            break;
          case 3:
            temp = parserData.filter(item => {
              return !item.operation_type || item.operation_type == 3
            })
            break;
          case 4:
            temp = parserData.filter(item => {
              return !item.operation_type || item.operation_type == 4
            })
            break;

        }
        that.setData({
          steps: temp
        })
        Toast.clear()
      }, 600)
    }).catch(error => {
      setTimeout(function() {
        Toast.clear()
      }, 600)
    })
  },
  handleIsDelete(e) {
    let that = this
    let params = {
      foId: e.detail.foId,
      status: e.detail.status
    }
    Toast.loading({
      mask: true,
      duration: 0,
      message: "加载中..."
    })
    $request({
      url: that.data._Url + "farm/loseFarm",
      type: "form",
      params: params
    }).then(res => {
      if (res.data.resultCode == "0") {

        return $request({
          url: that.data._Url + "farm/findFarm",
          type: "form",
          params: {
            groupId: that.data.groupId
          }
        })
      } else {
        setTimeout(function() {
          Toast.clear();
          Toast.fail("操作失败")
        }, 600)
      }
    }).then(result => {
      setTimeout(function() {
        Toast.clear();
        setTimeout(function() {
          let temp = [];
          let paserUpdate = [...that.parserData(result.data.data)]
          switch (that.data.active) {
            case 0:
              temp = paserUpdate
              break;
            case 1:
              temp = paserUpdate.filter(item => {
                return !item.operation_type || item.operation_type == 1
              })
              break;
            case 2:
              temp = paserUpdate.filter(item => {
                return !item.operation_type || item.operation_type == 2
              })
              break;
            case 3:
              temp = paserUpdate.filter(item => {
                return !item.operation_type || item.operation_type == 3
              })
              break;
            case 4:
              temp = paserUpdate.filter(item => {
                return !item.operation_type || item.operation_type == 4
              })
              break;

          }
          that.setData({
            steps: temp
          })
          Toast.success("操作成功");
        }, 600)
      }, 600)
    })
  },
  handleIsEdit(e) {
    let foId = e.detail.foId
    let type = e.detail.type
    var that = this
    wx.navigateTo({
      url: that.data.handleType[type].url + '?foId=' + foId + "&&lon=" + that.data.lon + "&&lat=" + that.data.lat + "&&groupid=" + that.data.groupId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      groupId: options.groupid,
      lon: options.lon,
      lat: options.lat
    })
  },

  parserData(data) {
    let handleType = this.data.handleType
    // let arr = data.sort((a, b) => {
    //   return (
    //     new Date(a.operation_time).getTime() -
    //     new Date(b.operation_time).getTime()
    //   );
    // });
    let arr = [...data]
    arr.map(item => {
      item.operation_type = item.farm[0].operation_type
      return item
    })
    //将年月日分离出来
    for (var i = 0; i < arr.length; i++) {
      arr[i].text = arr[i].operation_time
      arr[i].desc = arr[i].operation_describe
      arr[i].operation_typeName = handleType[arr[i].farm[0].operation_type].name
      arr[i].Year = arr[i].operation_time.substring(0, 4)
      arr[i].snames = arr[i].snames.replace(/,/g, "/")
      arr[i].Month = arr[i].operation_time.substring(5, 7) + "月"
      // arr[i].Month = arr[i].operation_time.substring(0, 7).replace("-", "年") + "月"
      arr[i].Day = arr[i].operation_time.substring(8, 10) + "日"
    }
    let types = new Set();
    //以不同的Month分离出来
    for (let item of arr) {
      types.add(item.Month);
    }
    let obj = {};
    var arrList = [];
    // 根据type生成多个数组
    for (let type of types) {
      for (let item of arr) {
        if (item.Month == type) {
          obj[type] = obj[type] || [];
          obj[type].push(item);
        }
      }
    }

    for (var i in obj) {
      let temp = {
        Month: i
      }
      arrList.push(temp)
      for (var item of obj[i]) {
        arrList.push(item)
      }
    }

    return [...arrList]

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
    let that = this
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    let temp = []
    $request({
      url: that.data._Url + "farm/findFarm",
      type: "form",
      params: {
        groupId: that.data.groupId
      }
    }).then(res => {
      let parserData = this.parserData(res.data.data)
      setTimeout(function() {
        // let stepsSL = parserData.filter(item => {
        //   return !item.operation_type || item.operation_type == 1
        // })
        // let stepsMZ = parserData.filter(item => {
        //   return !item.operation_type || item.operation_type == 2
        // })
        // let stepsYP = parserData.filter(item => {
        //   return !item.operation_type || item.operation_type == 3
        // })
        // let stepsCZ = parserData.filter(item => {
        //   return !item.operation_type || item.operation_type == 4
        // })
        that.setData({
          steps: parserData
        })
        Toast.clear()
      }, 600)
    }).catch(error => {
      setTimeout(function() {
        Toast.clear()
      }, 600)
    })
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