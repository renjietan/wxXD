// pages/calendar/calendar.js
const { $Toast, $Message} = require('../../dist1/base/index');
import Toast from '../../dist/toast/toast';

import {  $request} from "../../utils/util.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showpond: false,
    datapond: [],
    listpond: [],
    datadevice: [],
    nowTemperatureQ: '',
    nowWindValue: '',//今日最低最高温度
    nowTemperatureQm: '',//明天最低最高温度
    nowTemperatureQh: '',//后天最低最高温度
    nowPopValue: '', //今日降水量
    nowPopValueM: '',//明天降水量
    nowPopValueH: '',//后天降水量
    nowWindValue: '',//今日风向等级
    nowWindValueM: '',//明天风向等级
    nowWindValueH: '', //后天风向等级
    farmlist: null,
    nowWeatherImg: 'W1',//当天气象图
    nowWeatherImgM: 'W2',
    nowWeatherImgH: 'W3',
    listDevice: [],//设备信息
    actions: [],
    groupCount: 0,
    workerCount: 0,
    Url_Group: app.globalData.serverHYH,
    Url_Worker: app.globalData.serverWorker,
    pagesid: null
  },
  //选择塘口显示
  showpondfunc() {
    this.setData({
      showpond: true
    })
  },
  //选择塘口隐藏
  cancelfunc() {
    this.setData({
      showpond: false
    })
  },
  //选择塘口列表
  onChange(event) {
    this.data.listpond.map((item, index) => {
      if (item.groupid == event.detail.groupid) {
        console.log(event.detail.name)
        this.setData({
          datapond: item,
          showpond: false
        }, () => {
          this.getWeather(item.lat, item.lon)
          this.getDevice(item.groupid);
          this.getlist(item.groupid)
        })
      }
    })
  },
  //获取塘口列表
  getpondlist() {
    $request({
      url: app.globalData.serverHYH + "QueryAllGroupInfo",
      method: "GET"
    }).then(res => {
      console.log('塘口列表', res.data)
      if (res.data.resultCode == 0) {
        this.open = false;
        let _res = res.data.data;

        for (var i = 0; i < _res.length; i++) {
          var item = _res[i]
          if (item.city == '省直辖县级行政区划') {
            item.city = '湖北省'
          }
        }
        if (_res.length > 0 && res.data) {
          let newlistpond = [];

          _res.map(item => {
            newlistpond.push({
              'name': item.groupname,
              'groupid': item.groupid,
              'address': item.address,
              'lat': item.lat,
              'lon': item.lon,
              'area': item.area,
              'city': item.city,
              'county': item.county,
              'province': item.province,
              'dcName': item.dcName
            })
          })
          let newdatapond = {};
          newdatapond = {
            'name': _res[0].groupname,
            'groupid': _res[0].groupid,
            'address': _res[0].address,
            'lat': _res[0].lat,
            'lon': _res[0].lon,
            'area': _res[0].area,
            'city': _res[0].city,
            'county': _res[0].county,
            'province': _res[0].province,
            'dcName': _res[0].dcName
          }
          this.setData({
            listpond: newlistpond,
            datapond: newdatapond
          })
          this.getWeather(_res[0].lat, _res[0].lon);
          this.getDevice(_res[0].groupid);
          this.getlist(_res[0].groupid)
        }
      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  //获取塘口列表
  getpondlistshow() {
    $request({
      url: app.globalData.serverHYH + "QueryAllGroupInfo",
      method: "GET"
    }).then(res => {
      console.log('塘口列表', res.data)
      if (res.data.resultCode == 0) {
        this.open = false;
        let _res = res.data.data;
        for (var i = 0; i < _res.length; i++) {
          var item = _res[i]
          if (item.city == '省直辖县级行政区划') {
            item.city = '湖北省'
          }
        }
        if (_res.length > 0 && res.data) {
          let newlistpond = [];
          _res.map(item => {
            newlistpond.push({
              'name': item.groupname,
              'groupid': item.groupid,
              'address': item.address,
              'lat': item.lat,
              'lon': item.lon,
              'area': item.area,
              'city': item.city,
              'county': item.county,
              'province': item.province,
              'dcName': item.dcName
            })
          })
          
          if (this.data.pagesid) {
            let newdatapond = {};
            newlistpond.forEach(item => {
              if (item.groupid == this.data.pagesid) {
                newdatapond = item
              }
            })
            this.setData({
              datapond: newdatapond
            })
          }

          this.setData({
            listpond: newlistpond,
          })
          //判断当前选中塘口是否被删除
          let isdel=true
          newlistpond.filter(item=>{item})
          var r = newlistpond.filter((item)=>{
            return item.groupid == this.data.datapond.groupid;
          });
          if (r.length==0){
            this.setData({
              datapond: newlistpond[0],
            })
          }

          //this.getWeather(this.data.datapond.lat, this.data.datapond.lon);
          this.getDevice(this.data.datapond.groupid);
          this.getlist(this.data.datapond.groupid)
        }
      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  //获取城市天气
  getWeather(lat, lng) {
    $request({
      url: app.globalData.serverWeather + 'getWeather',
      method: "POST",
      params: {
        'lat': lat,
        'lon': lng
      }
    }).then(result => {
      console.log(result.data.msg)
      if (result.data.resultCode == 0) {
        //24小时逐时天气
        var hourly = (result.data.msg.data24.hourly).slice(1);
        console.log(hourly)
        //15天天气预报
        var forecast = (result.data.msg.data15.forecast).slice(1);
        console.log(this)
        console.log(forecast[0].tempNight + '~' + forecast[0].tempDay + '°C')
        this.setData({
          hourlyArr: hourly,
          dailyForecast: forecast,
          nowTemperatureQ: forecast[0].tempNight + '~' + forecast[0].tempDay + '°C',//今日最低最高温
          nowTemperatureQm: forecast[1].tempNight + '~' + forecast[1].tempDay + '°C',//明天最低最高温
          nowTemperatureQh: forecast[2].tempNight + '~' + forecast[2].tempDay + '°C',//后天最低最高温
          nowPopValue: '降水量' + hourly[0].pop + '%',//今日降水量
          nowPopValueM: '降水量' + hourly[1].pop + '%',//明天降水量
          nowPopValueH: '降水量' + hourly[2].pop + '%',//后天降水量
          nowWindValue: forecast[0].windDirDay + forecast[0].windLevelDay + '级',
          nowWindValueM: forecast[1].windDirDay + forecast[1].windLevelDay + '级',//明天风向等级
          nowWindValueH: forecast[2].windDirDay + forecast[2].windLevelDay + '级',//后天风向等级
          nowWeatherImg: 'W' + forecast[0].conditionIdDay, //今日气象图
          nowWeatherImgM: 'W' + forecast[1].conditionIdDay, //明天气象图
          nowWeatherImgH: 'W' + forecast[2].conditionIdDay, //后天气象图

        })
      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  //获取设备列表
  getDevice(groupid) {
    $request({
      url: app.globalData.serverWJ + 'wx/user/findDeviceInfoByGroup.do',
      method: "POST",
      params: {
        "groupId": groupid
      }
    }).then(result => {
      console.log('设备列表', result.data);
      if (result.data.resultCode == 0) {
        if (result.data.deviceInfo !== []) {
          let listDevices = {};
          result.data.deviceInfo.map(item => {
            if (item.deviceType == 'O2_W') {
              listDevices.O2_W = {
                value: item.value.substr(0, item.value.indexOf('.') + 3),
                lower_limit: item.lower_limit,
                upper_limit: item.upper_limit
              }
            } else if (item.deviceType == 'PH_W') {
              listDevices.PH_W = {
                value: item.value.substr(0, item.value.indexOf('.') + 3),
                lower_limit: item.lower_limit,
                upper_limit: item.upper_limit
              }
            } else if (item.deviceType == 'TP_W') {
              listDevices.TP_W = {
                value: item.value.substr(0, item.value.indexOf('.') + 3),
                lower_limit: item.lower_limit,
                upper_limit: item.upper_limit
              }
            }
          })
          this.setData({
            listDevice: listDevices
          })
        }

      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { console.log(error) })

  },
  //获取操作记录
  getlist(groupid) {
    $request({
      url: app.globalData.serverFarm + 'farm/findNextNewFarm',
      method: "POST",
      params: {
        "groupId": groupid
      },
      type: "form",
    }).then(result => {
      console.log('操作记录', result.data.data);
      if (result.data.resultCode == 0) {
        let typearr = [];
        if (result.data.data.operation_time) {
          result.data.data.operation_types.forEach((item) => {
            switch (item) {
              case '1':
                typearr.push('投放饲料')
                break;
              case '2':
                typearr.push('投放苗种')
                break;
              case '3':
                typearr.push('投放药品')
                break;
              default:
                typearr.push('记录操作')
            }
          })
          let newfarm = {
            'time': result.data.data.operation_time,
            'type': typearr
          }
          this.setData({
            farmlist: newfarm
          })
        } else {
          this.setData({
            farmlist: null
          })
        }
      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  noop: function noop() { },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.open = true;
    //获取塘口列表
    this.getpondlist();

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.open) {
      
      this.getpondlistshow();
    }
    this.setData({
      showpond: false
    })
    var that = this
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    let groupInfo = $request({ url: this.data.Url_Group + "QueryAllGroupInfo", method: "GET" });
    let workerInfo = $request({ url: this.data.Url_Worker + "staff/findByOwer", type: "form" });
    Promise.all([groupInfo, workerInfo]).then(res => {
      setTimeout(function () {
        let _groupInfo = res[0].data.data;
        let _workerInfo = res[1].data.data
        that.setData({
          groupCount: _groupInfo.length,
          workerCount: _workerInfo.length
        })
        // debugger
        // if(_groupInfo.length > 0 && _workerInfo.length > 0){
        //   wx.redirectTo({
        //     url: '../farmingHome/farmingHome',
        //   })
        // }
        Toast.clear();
      }, 600)
    }).catch(error => {
      Toast.clear();
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  navGroupList() {
    wx.navigateTo({
      url: '../../farmingCarlendar/pages/pondList/pondList',
    })
  },
  navWorkerList() {
    wx.navigateTo({
      url: '../../farmingCarlendar/pages/workerList/workerList',
    })
  },
  navAddGroup() {
    wx.navigateTo({
      url: '../../farmingCarlendar/pages/addPond/addPond?groupInfo=',
    })
  },
  navAddWorker() {
    wx.navigateTo({
      url: '../../farmingCarlendar/pages/addWorker/addWorker?workerInfo=',
    })
  },
  navfodder() {
    wx.navigateTo({
      url: '../../calendar/pages/fodder/fodder?groupid=' + this.data.datapond.groupid + '&lon=' + this.data.datapond.lon + '&lat=' + this.data.datapond.lat,
    })
  },
  navseedling() {
    wx.navigateTo({
      url: '../../calendar/pages/seedling/seedling?groupid=' + this.data.datapond.groupid + '&dcName=' + this.data.datapond.dcName + '&lon=' + this.data.datapond.lon + '&lat=' + this.data.datapond.lat,
    })
  },
  navdrug() {
    wx.navigateTo({
      url: '../../calendar/pages/drug/drug?groupid=' + this.data.datapond.groupid + '&lon=' + this.data.datapond.lon + '&lat=' + this.data.datapond.lat,
    })
  },
  navhandle() {
    wx.navigateTo({
      url: '../../farmingCarlendar/pages/handle/handle?groupid=' + this.data.datapond.groupid + '&lon=' + this.data.datapond.lon + '&lat=' + this.data.datapond.lat,
    })
  },
  gotoWeather() {
    wx.navigateTo({
      url: '../newWeather/newWeather?pondName=' + this.data.datapond.name + '&lon=' + this.data.datapond.lon + '&lat=' + this.data.datapond.lat,
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