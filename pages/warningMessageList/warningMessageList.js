// pages/alertInfo/alertInfo.js
const util = require('../../utils/util.js');
const { $Toast } = require('../../dist1/base/index');
import { $request } from "../../utils/util.js"
const app = getApp(); Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentDate: new Date(),
    maxDatas: util.formatData(new Date()),
    minDate: util.formatData(new Date()),
    maxData: util.formatData(new Date()),
    search: ['一天', '三天', '七天', '一月'],
    selestBtnIs: 0,
    startData: util.formatData(new Date()),
    endData: util.formatData(new Date()),
    warnMsgList: [],
    footer: false,
    ListInfoShow: true //加载
  },
  //搜索条件选择
  searchBtn(event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      selestBtnIs: index
    })
    switch (index) {
      case 0:
        this.setData({
          startData: util.formatData(new Date()),
          endData: util.formatData(new Date()),
        }, () => {
          this.queryDate();
        });
        break;
      case 1:
        this.setData({
          startData: util.formatData(new Date(new Date().setDate(new Date().getDate() - 3))),
          endData: util.formatData(new Date()),
        }, () => {
          this.queryDate();
        });
        break;
      case 2:
        this.setData({
          startData: util.formatData(new Date(new Date().setDate(new Date().getDate() - 7))),
          endData: util.formatData(new Date()),
        }, () => {
          this.queryDate();
        });
        break;
      default:
        this.setData({
          startData: util.formatData(new Date(new Date().setMonth(new Date().getMonth() - 1))),
          endData: util.formatData(new Date()),
        }, () => {
          this.queryDate();
        });

    }
  },
  //点击开始时间确定
  bindDatestart(event) {
    let index = this.data.selestBtnIs;
    let value = event.detail.value;
    let valueData = new Date(event.detail.value);
    let valueTime = valueData.getTime();
    let currentTime = new Date().getTime();
    switch (index) {
      case 0:
        this.setData({
          startData: value,
          endData: value,
          // minDate: value,
        });
        break;
      case 1:
        let newdata = new Date(valueData.setDate(valueData.getDate() + 3));
        this.setData({
          startData: event.detail.value,
          endData: currentTime > newdata.getTime() ? util.formatData(newdata) : util.formatData(new Date()),
          //minDate: value,
        });
        break;
      case 2:
        let newdata1 = new Date(valueData.setDate(valueData.getDate() + 7));
        this.setData({
          startData: event.detail.value,
          endData: currentTime > newdata1.getTime() ? util.formatData(newdata1) : util.formatData(new Date()),
          //minDate: value,
        });
        break;
      default:
        let newdata2 = new Date(valueData.setMonth(valueData.getMonth() + 1));
        this.setData({
          startData: event.detail.value,
          endData: currentTime > newdata2.getTime() ? util.formatData(newdata2) : util.formatData(new Date()),
          //minDate: value,
        });

    }

  },
  //点击结束时间确定
  bindDateend(event) {
    let index = this.data.selestBtnIs;
    let value = event.detail.value;
    let valueData = new Date(event.detail.value);
    let valueTime = valueData.getTime();
    let currentTime = new Date().getTime();
    switch (index) {
      case 0:
        this.setData({
          startData: value,
          endData: value,
        });
        break;
      case 1:
        this.setData({
          endData: event.detail.value,
          startData: util.formatData(new Date(valueData.setDate(valueData.getDate() - 3))),

        });
        break;
      case 2:
        this.setData({
          endData: event.detail.value,
          startData: util.formatData(new Date(valueData.setDate(valueData.getDate() - 7))),
        });
        break;
      default:
        this.setData({
          endData: event.detail.value,
          startData: util.formatData(new Date(valueData.setMonth(valueData.getMonth() - 1))),
          //minDate: value,
        });

    }
  },
  //根据时间查询告警信息
  queryDate() {
    let sTime = this.data.startData + ' 00:00:00';
    let eTime = this.data.endData + ' 23:59:59';
    this.pages = 0;
    this.getMsg(this.pages, sTime, eTime, true);
  },
  //根据时间获取数据
  getMsg(pages, startTime, endTime, isrefresh) {
    // this.setData({
    //   footer: false
    // })
    let startTimes = startTime ? startTime : '';
    let endTimes = endTime ? endTime : '';
    let isrefreshs = isrefresh ? isrefresh : false;

    $request({
      url: app.globalData.serverWJ + "wx/user/selectWarningMsg.do", params: {
        "page": pages,
        "size": "7",
        "startTime": startTime,
        "endTime": endTime
      }, method: "POST"
    }).then(res => {
      if (res.data.resultCode == 0) {
        if (!isrefreshs) {
          let newarr = this.data.warnMsgList;
          let news = newarr.concat(res.data.warnMsgList);
          this.count = res.data.totalCount;
          console.log(news);
          this.setData({
            warnMsgList: news,
            ListInfoShow: false
          })
        } else {
          let newarr = res.data.warnMsgList;
          console.log(newarr)
          this.count = res.data.totalCount;
          this.setData({
            warnMsgList: newarr,
          })
        }
      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => {
      // $Toast({
      //   content: '服务器请求失败',
      //   type: 'error'
      // });
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取sessionId
    this.sessionId = wx.getStorageSync('sessionId');
    //获取token
    this.token = wx.getStorageSync('token');
    let osTime = this.data.startData + ' 00:00:00';
    let oeTime = this.data.endData + ' 23:59:59';
    this.pages = 0;
    this.getMsg(this.pages, osTime, oeTime)
  },
  //监听页面触底
  onReachBottom: function () {
    if (this.data.ListInfoShow == true) {
      return
    }
    this.touchBottom = true
  },
  onPageScroll: function (e) {
    this.touchMove = false
    // this.touchBottom = false
    // console.log(e)
  },
  touchStart: function (e) {
    this.touchMove = true
    this.touchS = e.changedTouches[0].pageY
    // console.log(e)
  },
  // // 触摸结束事件
  touchEnd: function (e) {
    this.touchE = e.changedTouches[0].pageY
    this.moveY = this.touchE - this.touchS
    if (this.moveY == 0) { return } else if (this.moveY > 0) { this.touchBottom = false }
    if (this.touchMove && this.touchBottom) {
      this.setData({
        ListInfoShow: true
      })
      let osTime = this.data.startData + ' 00:00:00';
      let oeTime = this.data.endData + ' 23:59:59';
      if (this.pages < Math.ceil(this.count / 7) - 1) {
        this.pages++;
        this.getMsg(this.pages, osTime, oeTime, false);
      } else {
        this.setData({
          ListInfoShow: false
        })
      }
    } else {
      return
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})