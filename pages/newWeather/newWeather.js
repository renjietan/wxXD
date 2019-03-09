// pages/weather/weather.js
import * as echarts from '../../lib/ec-canvas/echarts.common.min';
const {
  $Toast
} = require('../../dist1/base/index');
var util = require('../../utils/util.js');
const {
  $Message
} = require('../../dist1/base/index');
import {
  $request
} from "../../utils/util.js"
const app = getApp();

Page({
  data: {
    pondName: '',//塘口名称
    nowToday: '',//日期
    nowWeek: '',//星期
    nowImg: 'w2',//白天实时气象图
    nowImgNight: 'w30',//晚上实时气象图
    nowTemperature:'',//实时天气
    nowCond:'',//天气说明
    nowWindValue: '',//风向等级
    nowPopValue:'',//降水量
    nowHumidity: '',//湿度
    iconNight:'w30',//24逐小时图标晚上
    iconDay: 'w2', //24逐小时图标白天
    pondNameShow: false,

    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    xdata: [],
    xdata2: [],
    ydata: []

  },
  //选择塘口列表
  choosePond(e) {
    wx.canvasToTempFilePath({
      canvasId: 'mychart-bar',
      success: (res) => {
        console.log(res.tempFilePath)
      },
      fail: (err) => {
        console.log(err)
      }
    }, this)
    this.setData({
      pondNameShow: true
    });
  },
  //选中塘口
  pondNameSelect(event) {
    let pages = getCurrentPages();
    console.log(pages)
    let currPage = null; //当前页面
    let prevPage = null; //上一个页面

    if (pages.length >= 2) {
      currPage = pages[pages.length - 1]; //当前页面
      prevPage = pages[pages.length - 2]; //上一个页面
    }
    if (prevPage) {
      prevPage.setData({
        'pagesid': event.detail.id
      });
    }
    console.log(event.detail)
    this.setData({
      pondNameShow: false,
      'pondName': event.detail.name
    }, () => {
      this.getWeather(event.detail.lat, event.detail.lon)
    })
  },
  onClose() {
    this.setData({
      pondNameShow: false
    });
  },
  //获取塘口列表信息
  getList() {
    wx.request({
      url: app.globalData.serverHYH + 'QueryAllGroupInfo',
      data: {
        "token": this.token
      },
      header: {
        'content-dcName': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.resultCode == 0) {
          var newArray = [];
          for (let i = 0; i < res.data.data.length; i++) {
            newArray.push({
              'name': res.data.data[i].groupname,
              'id': res.data.data[i].groupid,
              'address': res.data.data[i].address,
              'lat': res.data.data[i].lat,
              'lon': res.data.data[i].lon
            })
          }
          this.setData({
            pondNameActions: newArray
          })

        } else if (res.data.resultCode == '0013') {
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
            content: res.data.value,
            type: 'error'
          });
        }
      }
    })
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
      $Toast.hide();
      if (result.data.resultCode == 0) {
        //24小时逐时天气
        var hourly = (result.data.msg.data24.hourly).slice(1);
        //15天天气预报
        var forecast = (result.data.msg.data15.forecast).slice(1);
        let newxdata = [];
        let newxdata2 = [];
        forecast.map(item => {
          newxdata.push(item.tempDay)
          newxdata2.push(item.tempNight)
        })

        console.log(newxdata, newxdata2);
        this.setData({
          xdata: newxdata,
          xdata2: newxdata2,
          hourlyArr: hourly,
          dailyForecast: forecast,
          nowHour: hourly[0].hour,
          nowToday: hourly[0].date,//日期
          nowImg: 'W' + hourly[0].iconDay, //白天实时气象图
          nowImgNight: 'W' + hourly[0].iconNight,//晚上实时气象图
          nowCond: hourly[0].condition,//实时天气说明
          nowTemperature: hourly[0].temp + '°C',//实时天气
          nowWindValue: forecast[0].windDirDay + forecast[0].windLevelDay + '级', //风向等级
          nowPopValue: '降水量' + hourly[0].pop + '%', //降水量
          nowHumidity: '湿度' + hourly[0].humidity + '%',//湿度
        }, () => {
          this.inita();
        })
      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })

  },
  scroll: function (e) {
    var scrollLeft = e.detail.scrollLeft;
    this.setData({ scrollLeft: scrollLeft })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    this.options = options;
    this.token = wx.getStorageSync('token');
    this.getList();
    //星期
    this.setData({
      nowWeek: util.weekDay()
    })
    this.setData({
      pondName: options.pondName,
    })
  },

 


  // 初始化折线图
  inita() {
    
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.setOption());
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return this.chart;
     
    });
  },


  //折线图配置
  setOption() {
    let option = {
      color: '#fff',
      grid: {
        left: 0,
        top: 30,
        right: 0,
        bottom: 20,
      },
      xAxis: {
        type: '',
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#fff',
            opacity: 0.3,
          },
          interval: (index) =>{
            if (index==0){
              return false
            }else{
              return true
            }
          }
        },
        axisLabel: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        splitLine: { show: false },
        show: false,
        axisTick: {
          show: false
        },
      },
      series: [{
        data: this.data.xdata,
        type: 'line',
        label: {
          show: true,
          formatter: '{c}°C'
        },
        lineStyle: {
          width: 1
        }
      }, {
        data: this.data.xdata2,
        type: 'line',
        label: {
          show: true,
          formatter: '{c}°C'
        },
        lineStyle: {
          width: 1
        }
      }]
    }
    return option;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    console.log(this.ecComponent)

    this.getWeather(this.options.lat, this.options.lon);

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