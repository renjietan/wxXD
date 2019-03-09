//index.js
//获取应用实例

const { $Toast } = require('../../dist1/base/index');
import ajaxUtil from '../../utils/ajaxUtil.js';
const { $Message } = require('../../dist1/base/index');
import { $request } from "../../utils/util.js"
const app = getApp(); 
Page({
  data: {
    show: false,
    isshow: false,
    btnhide: false,
    deviceshow: true,
    pondArray: [],
    deviceData: [],
    warnMsgList: [],
    alarmCount: null,
    codeType: {
      "O2_W": "icon-rongjieyang",
      "PH_W":"icon-PHzhi",
      "TP_W":"icon-shuiwen"
    },
    calendarDate: {},
    farming:''
  },
  //获取本月农事
  getnongshi(){
    let month = new Date().getMonth() + 1
    $request({
      url: app.globalData.serverWeather + 'monthFarm/getInfomation', params: {
        "month": month,
      }, method: "POST"
    }).then(result => {
      console.log('关注按钮', result.data);
      if (result.data.resultCode == 0) {
        this.setData({
          farming: result.data.data.farming
        })
      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  //扫一扫
  scanCode() {
    this.isFromScan = true //防止触发onshow，onhide
    let that = this
    console.log(that)
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
        wx.getStorage({
          key: 'token',
          success(res1) {
            $request({
              url: app.globalData.serverLKJ + 'device2/selectDevice', type:'form', params: {
                "deviceCode": res.result,
              }, method: "POST"
            }).then(res3 => {
              if (res3.data.resultCode == 0) {
                res3.data.data.text = "添加"
                res3.data.data.from = "首页添加设备"
                let param = JSON.stringify(res3.data.data)
                wx.navigateTo({
                  url: '../../device/pages/add/add?param=' + param
                })
              } else {
                $Toast({
                  content: res3.data.resultDesc,
                  type: 'error'
                });
              }
            }).catch(error => { })
          }
        })
      },
      fail: (err) => {
        // $Toast({
        //   content: err,
        //   type: 'error'
        // });
      }
    })
  },
  /*手风琴效果*/
  togglefunc: function (event) {
    var index = event.currentTarget.dataset.index;
    this.groupId = event.currentTarget.dataset.groupid;
    console.log('塘口id', this.groupId);
    if (this.data.show === index) {
      this.setData({
        show: false
      })
    } else {
      this.setData({
        show: index
      })
      this.getDevice()
    }

  },
  /*添加设备悬浮按钮*/
  addbtnfunc() {
    if (!this.data.btnhide) {
      this.scanCode();
    } else {
      this.setData({
        btnhide: false
      })
    }
  },
  /*关注塘口按钮*/
  focusFunc: function (event) {
    this.groupId = event.currentTarget.dataset.groupid;
    this.isCare = event.currentTarget.dataset.iscare == 1 ? 0 : 1;
    console.log(event, event.currentTarget.dataset.iscare, this.isCare);
    $request({
      url: app.globalData.serverWJ + 'wx/user/careGroup.do', params: {
        "groupId": this.groupId, "isCare": this.isCare
      }, method: "POST"
    }).then(result => {
      console.log('关注按钮', result.data);
      if (result.data.resultCode == 0) {
        this.setData({
          show: false,
        })
        if (this.isCare == 1) {
          $Toast({
            content: '取消关注成功',
            type: 'success',
            duration: 1
          });
        } else {
          $Toast({
            content: '添加关注成功',
            type: 'success',
            duration: 1
          });
        }
        this.getPond();
      }  else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
},
  /*获取塘口列表*/
  getPond() {
    $request({
      url: app.globalData.serverWJ + 'wx/user/groupOrder.do', method: "POST"
    }).then(result => {
      console.log('塘口列表', result.data.grouplist);
      this.open = true;
      if (result.data.resultCode == 0) {
        this.setData({
          pondArray: result.data.grouplist
        })
      }  else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  /*获取设备列表*/
  getDevice() {
    this.setData({
      deviceshow: true,
    })
    $request({
      url: app.globalData.serverWJ + 'wx/user/findDeviceInfoByGroup.do', method: "POST",
      params: { "groupId": this.groupId}
    }).then(result => {
      console.log('设备列表', result.data);
      if (result.data.resultCode == 0) {
        let resultData = result.data.deviceInfo;
        for (let i in resultData) {
          resultData[i].uptime = resultData[i].uptime.split(" ")[0];
          resultData[i].value = resultData[i].value.substr(0, resultData[i].value.indexOf('.') + 3);
        }
        this.setData({
          deviceshow: false,
          deviceData: resultData,
        })
      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })

  },
  /*获取告警信息*/
  getAlertInfo() {
    $request({
      url: app.globalData.serverWJ + 'wx/user/findWarningMsgIndex.do', method: "POST",
    }).then(result => {
      console.log('告警信息', result.data.warnMsgList);
      if (result.data.resultCode == 0) {
        this.setData({
          warnMsgList: result.data.warnMsgList,
          alarmCount: result.data.alarmCount
        })
      }else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  /*获取农事日历*/
  getCalendar() {
    wx.request({
      url:  app.globalData.serverWJ +'wx/user/getLunar.do',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      success: (res) => {
        console.log(res.data.date);
        let date = new Date();
        let days = date.getDay();
        let weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        this.setData({
          calendarDate: res.data.date,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          days: weekday[days]
        })
      }
    })

  },
  onLoad: function () {
    //获取sessionId
    this.sessionId = wx.getStorageSync('sessionId');
    //获取token
    this.token = wx.getStorageSync('token');
    //获取塘口列表
    this.getPond();
    //获取告警信息
    this.getAlertInfo();
    //获取农事日历
    this.getCalendar()
    //获取本月农事
    this.getnongshi();
  },

  onShow() {
    if (this.isFromScan) { this.isFromScan = false; return }
    if (this.open) {
      console.log('onShow');
      //获取塘口列表
      this.getPond();
      //获取体验塘口列表
      // this.getonePond();
      //获取告警信息
      this.getAlertInfo();
    }
  },
  onHide(){
    this.setData({
      show: false,
    })
  },
  /*监听页面滚动*/
  onPageScroll(value) {
    if (value.scrollTop > 10) {
      this.setData({
        btnhide: true
      })
    } else {
      this.setData({
        btnhide: false
      })
    }
  }
})
