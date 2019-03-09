//index.js
//获取应用实例

import Toast from '../../dist/toast/toast';
const { $Message } = require('../../dist1/base/index');
import { $request } from "../../utils/util.js"
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    isshow: false,
    deviceshow: true,
    pondArray: [],
    deviceData: [],
    warnMsgList: [],
    alarmCount: null,
    codeType: {
      "O2_W": "icon-rongjieyang",
      "PH_W": "icon-PHzhi",
      "TP_W": "icon-shuiwen"
    },
    isExperience: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
    /*获取体验塘口列表*/
    getonePond() {
      $request({
        url: app.globalData.serverWJ + "wx/user/experienceGroup.do", method: "POST"
      }).then(result => {
        console.log('体验塘口列表', result.data.grouplist);
        if (result.data.resultCode == 0) {
          this.setData({
            pondArray: result.data.grouplist
          })
        } else {
          this.triggerEvent('show', {
            type: 'error',
            text: result.data.resultDesc
          })
        }
      }).catch(error => { })

    },
    /*获取设备列表*/
    getDevice() {
      this.setData({
        deviceshow: true,
      })
      $request({
        url: app.globalData.serverWJ + "wx/user/findDeviceInfoByGroup.do", method: "POST",params: {
          "groupId": this.groupId
        }
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
          this.triggerEvent('show', {
            type: 'error',
            text: result.data.resultDesc
          })

        }
      }).catch(error => { })
    },
    /*获取体验告警信息3*/
    getoneAlertInfo() {
      $request({
        url: app.globalData.serverWJ + "wx/user/findExprienceWarningMsgIndex.do", method: "POST", params: {
          "groupId": this.groupId
        }
      }).then(result => {
        console.log('体验告警信息', result.data.warnMsgList);
        if (result.data.resultCode == 0) {
          this.setData({
            warnMsgList: result.data.warnMsgList,
            alarmCount: result.data.alarmCount
          })
        } else {
          this.triggerEvent('show', {
            type: 'error',
            text: result.data.resultDesc
          })

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
    /*获取用户是否正式用户*/
    getuser() {
      $request({
        url: app.globalData.serverWJ + "wx/user/getUserState.do", method: "POST",
      }).then(result => {
        console.log(result.data)
        if (result.data.resultCode == 0) {
          this.isExperience = result.data.isExperience;
          this.deviceCount = result.data.deviceCount;
          this.groupCount = result.data.groupCount;
          this.setData({
            isExperience: this.isExperience == 0
          }, () => {
            console.log(this.data.isExperience);
          })
        } else if (result.data.resultCode == '0013') {
          wx.clearStorage();
          $Toast({
            content: '登录过期',
            type: 'error'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login'
            })
          }, 500)
        } else {
          $Toast({
            content: result.data.resultDesc,
            type: 'error'
          });
        }
      }).catch(error => { })
      
    },
    /**/
    gotoIndex() {
      if (this.isExperience == '0') {
        //新用户
        wx.reLaunch({
          url: '../becomeFormal/becomeFormal'
        })
      } else if (this.isExperience == '1' && (this.deviceCount == 0 && this.groupCount == 0)) {
        //正式用户跳转添加塘口设备页面
        wx.reLaunch({
          url: '../use/use'
        })
      } else if (this.isExperience == '1' && (this.deviceCount !== 0 || this.groupCount !== 0)) {
        //正式用户跳转正式首页
        wx.switchTab({
          url: '../index/index'
        })
      }
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      //获取sessionId
      let that = this
      that.sessionId = wx.getStorageSync('sessionId');
      //获取token
      that.token = wx.getStorageSync('token');

      //获取体验塘口列表
      that.getonePond();
      //获取体验告警信息
      that.getoneAlertInfo();

      //获取农事日历
      this.getCalendar()
      //
      this.getuser()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },

  }

})