import * as echarts from '../../lib/ec-canvas/echarts.common.min';
const { $Toast } = require('../../dist1/base/index');
const { $Message } = require('../../dist1/base/index');
import { $request, formatData } from "../../utils/util.js"
const app = getApp();
Page({
  data: {
    currentDate: new Date(),
    maxDatas: formatData(new Date()),
    minDate: formatData(new Date()),
    maxData: formatData(new Date()),
    search: ['一天', '三天', '七天', '一月'],
    selestBtnIs: 0,
    startData: formatData(new Date()),
    endData: formatData(new Date()),
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    xdata: [],
    ydata: [],
    mina: null,
    maxa: null,
    minb: null,
    maxb: null,
    x2data: [],
    y2data: [],
    ListInfo: [],
    groupName: null,
    deviceType: null,
    ListInfoShow: true,//加载
    deviceName: null,
    deviceUnit: null
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
          startData: formatData(new Date()),
          endData: formatData(new Date()),
        }, () => {
          this.queryDate();
        });
        break;
      case 1:
        this.setData({
          startData: formatData(new Date(new Date().setDate(new Date().getDate() - 3))),
          endData: formatData(new Date()),
        }, () => {
          this.queryDate();
        });
        break;
      case 2:
        this.setData({
          startData: formatData(new Date(new Date().setDate(new Date().getDate() - 7))),
          endData: formatData(new Date()),
        }, () => {
          this.queryDate();
        });
        break;
      default:
        this.setData({
          startData: formatData(new Date(new Date().setMonth(new Date().getMonth() - 1))),
          endData: formatData(new Date()),
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
          endData: currentTime > newdata.getTime() ? formatData(newdata) : formatData(new Date()),
          //minDate: value,
        });
        break;
      case 2:
        let newdata1 = new Date(valueData.setDate(valueData.getDate() + 7));
        this.setData({
          startData: event.detail.value,
          endData: currentTime > newdata1.getTime() ? formatData(newdata1) : formatData(new Date()),
          //minDate: value,
        });
        break;
      default:
        let newdata2 = new Date(valueData.setMonth(valueData.getMonth() + 1));
        this.setData({
          startData: event.detail.value,
          endData: currentTime > newdata2.getTime() ? formatData(newdata2) : formatData(new Date()),
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
          startData: formatData(new Date(valueData.setDate(valueData.getDate() - 3))),

        });
        break;
      case 2:
        this.setData({
          endData: event.detail.value,
          startData: formatData(new Date(valueData.setDate(valueData.getDate() - 7))),
        });
        break;
      default:
        this.setData({
          endData: event.detail.value,
          startData: formatData(new Date(valueData.setMonth(valueData.getMonth() - 1))),
          //minDate: value,
        });

    }
  },
  //获取24小时值
  getHours(deviceId) {
    $request({
      url: app.globalData.serverWJ + "wx/user/findDeviceInfo24Hour.do", params: {
        "deviceId": deviceId
      }, method: "POST"
    }).then(result => {
      console.log(result)
      if (result.data.resultCode == 0) {
        this.setData({
          xdata: result.data.timeAxis,
          ydata: result.data.valueAxis,
          mina: result.data.limit.lower_limit,
          maxa: result.data.limit.upper_limit,
          deviceName: result.data.deviceInfo.device_type_name,
          deviceUnit: result.data.deviceInfo.unit
        }, () => {
          this.inita();
        })
      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => {
      $Toast({
        content: '服务器请求失败',
        type: 'error'
      });
    })
  },
  //获取告警分布散点图
  getAlertInfo(deviceId, startTime, endTime) {
    let startTimes = startTime ? startTime : '';
    let endTimes = endTime ? endTime : '';
    $request({
      url: app.globalData.serverWJ + "wx/user/findDeviceWarningInfoTimeRound.do", params: {
        "deviceId": deviceId,
        "startTime": startTime,
        "endTime": endTime,
      }, method: "POST"
    }).then(result => {
      console.log('散点图', result.data);
      if (result.data.resultCode == 0) {
        let limitData = result.data.limit;
        result.data.xAxis = result.data.xAxis.map(item => {
          return item.substring(5, 16).replace("-", "/")
        })
        this.setData({
          x2data: result.data.xAxis,
          y2data: result.data.yAxis,
          minb: limitData.lower_limit,
          maxb: limitData.upper_limit
        }, () => {
          this.chartb.setOption(this.setOptions());
        })
      } else {
        $Toast({
          content: result.data.resultDesc,
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
  //根据时间查询告警信息
  queryDate() {
    let sTime = this.data.startData + ' 00:00:00';
    let eTime = this.data.endData + ' 23:59:59';
    this.getAlertInfo(this.deviceId, sTime, eTime)
  },
  //获取设备详细记录
  getListInfo(page, deviceId) {
    $request({
      url: app.globalData.serverWJ + "wx/user/selectDeviceInfo.do", params: {
        "deviceId": deviceId,
        "page": page,
        "size": "5"
      }, method: "POST"
    }).then(result => {
      if (result.data.resultCode == 0) {
        this.count = result.data.totalCount;
        let newarr = this.data.ListInfo;
        let news = newarr.concat(result.data.List);
        this.setData({
          ListInfo: news,
          ListInfoShow: false
        })
      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => {})


  },
  onLoad: function (query) {
    this.pages = 0;
    console.log(query);
    //获取sessionId
    this.sessionId = wx.getStorageSync('sessionId');
    //获取token
    this.token = wx.getStorageSync('token');
    //获取标题
    this.setData({
      groupName: query.groupName,
      deviceType: query.deviceType
    })
    //获取设备id
    this.deviceId = query.deviceId;
    if (query.create_time) {
      console.log(query.create_time);
      this.ctime = query.create_time.split(' ')[0]
    }
  },
  onReady: function () {
    this.scrollNum = 0
    console.log('onReady');
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    this.ecComponents = this.selectComponent('#mychart-dom-bars');
    this.getHours(this.deviceId);
    this.getListInfo(this.pages, this.deviceId);
    this.initb();
    //this.queryDate();
    if (this.ctime) {
      this.setData({
        startData: this.ctime,
        endData: this.ctime
      }, () => {
        this.queryDate();
      })
    } else {
      this.queryDate();
    }

  },
  // 初始化折线图
  inita: function () {
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
  // 初始化散点图
  initb: function () {
    this.ecComponents.init((canvas, width, height) => {
      console.log(width, height);
      // 在这里初始化图表
      const chartb = echarts.init(canvas, null, {
        width: width,
        height: 175
      });
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chartb = chartb;
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return this.chartb;
    });
  },

  //折线图配置
  setOption: function () {
    let option = {
      title: {
        text: ''
      },
      xAxis: {
        name: '小时',
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        data: this.data.xdata
      },
      yAxis: {
        name: !this.data.deviceUnit ? this.data.deviceName : this.data.deviceName + '(' + this.data.deviceUnit + ')',
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999',
          }
        },
        splitLine: { show: false },
        max: (value) => {
          return Math.ceil(Math.max(value.max, this.data.maxa) + 3);
        }
      },
      grid: {
        left: 40,
        top: 30,
        bottom: 20,
        right: 40,
      },
      series: [{
        data: this.data.ydata,
        type: 'line',
        label: {
          show: false
        },
        smooth: true,
        areaStyle: {
          color: '#D0E9FF'
        },
        lineStyle: {
          color: '#3A93FF'
        },
        itemStyle: {
          opacity: 0
        },
        markLine: {
          silent: true,
          lineStyle: {
            normal: {
              color: '#E57183' // 这儿设置安全基线颜色
            }
          },
          label: {
            show: false,
          },
          symbolSize: 5,
          data: [{
            name: '最小值',
            yAxis: this.data.mina,

            lineStyle: {
              normal: {
                color: '#13C2C2' // 这儿设置安全基线颜色
              }
            },
          },
          {
            name: '最大值',
            yAxis: this.data.maxa,
          },
          ]
        },
      }]
    }
    return option;
  },
  //散点图配置
  setOptions() {
    console.log(!this.data.deviceUnit ? this.data.deviceName : this.data.deviceName + '(' + this.data.deviceUnit + ')');
    let option = {
      color: '#d6ccea',
      backgroundColor: "#f8f8f8",
      xAxis: {
        name: '时间',
        data: this.data.x2data,
        axisLine: {
          lineStyle: {
            color: '#999',
          }
        },
      },
      yAxis: {
        name: !this.data.deviceUnit ? this.data.deviceName : this.data.deviceName + '(' + this.data.deviceUnit + ')',
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: '#999',
          }
        },
        max: (value) => {
          return Math.ceil(Math.max(value.max, this.data.maxb) + 3);
        }
      },
      grid: {
        left: 40,
        top: 30,
        bottom: 30,
        right: 40,
      },
      series: [{
        data: this.data.y2data,
        symbolSize: function (val) {
          return 10;
        },
        itemStyle: {
          normal: {
            color: '#1FB1FA',
          }
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        type: 'effectScatter',
        markLine: {
          silent: true,
          lineStyle: {
            normal: {
              color: '#E57183' // 这儿设置安全基线颜色
            }
          },
          label: {
            show: false,
          },
          symbolSize: 5,
          data: [{
            name: '最小值',
            yAxis: this.data.minb,
            lineStyle: {
              normal: {
                color: '#13C2C2' // 这儿设置安全基线颜色
              }
            },
          },
          {
            name: '最大值',
            yAxis: this.data.maxb,
          },
          ]
        },
      }]
    };
    return option;
  },
  onHide: function () {
    //console.log(this.chartb);
  },
  //当页面被卸载的时候关闭webSocket
  onUnload: function () {
    //console.log(12,this.chartb);
    this.chartb.clear()
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
      console.log("---加载---")
      this.setData({
        ListInfoShow: true
      })
      if (this.pages < Math.ceil(this.count / 5)) {
        console.log(111);
        this.pages++;
        this.getListInfo(this.pages, this.deviceId);
      }
    } else {
      return
    }
  }
})