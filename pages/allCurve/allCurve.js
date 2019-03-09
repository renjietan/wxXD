import * as echarts from '../../lib/ec-canvas/echarts.common.min';
const { $Toast } = require('../../dist1/base/index');
const { $Message } = require('../../dist1/base/index');
import { $request } from "../../utils/util.js"
const app = getApp(); 
Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    ed: {
      lazyLoad: true
    },
    xdata: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ydata: [20, 32, 54, 34, 90, 30, 20],
    ec: {
      lazyLoad: true
    },
    echart: [],
    groupName: null,
  },
  //查看养殖环境
  getDate(groupId) {
    $request({
      url: app.globalData.serverWJ + "wx/user/findDeviceLineByGroup.do", params: {
        "groupId": groupId
      }, method: "POST"
    }).then(result => {
      console.log(result.data)
      if (result.data.resultCode == 0) {
        let newArr = result.data.data;
        let arrData = [];
        for (let index in newArr) {
          arrData.push({
            name: newArr[index].deviceInfo.device_type_name,
            xechartData: newArr[index].xAxis,
            yechartData: newArr[index].yAxis,
            upAndLow: newArr[index].upAndLow,
            unit: newArr[index].deviceInfo.unit
          })
        }
        console.log(arrData);
        this.setData({
          echart: arrData
        }, function () {
          this.updata();
          $Toast.hide();
        })
      }else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => {})
  },
  onLoad: function (query) {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    //获取sessionId
    this.sessionId = wx.getStorageSync('sessionId');
    //获取token
    this.token = wx.getStorageSync('token');
    //获取塘口id
    this.groupId = query.groupId;
    console.log(query);

    this.getDate(this.groupId)
    //获取塘口名称
    this.setData({
      groupName: query.groupName
    })
  },
  onReady: function () {
  },
  //更新echart
  updata() {
    for (let i = 0; i < this.data.echart.length; i++) {
      this.selectComponent(`#mychart${i}`).init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });

        chart.setOption(this.setOption(this.data.echart[i].xechartData, this.data.echart[i].yechartData, this.data.echart[i].upAndLow.lower_limit, this.data.echart[i].upAndLow.upper_limit, this.data.echart[i].unit, this.data.echart[i].name));
        this.chart = chart;
        return chart;
      });
    }
    
  },
  //向echart传值
  setOption: function (xdata, ydata, mindata, maxdata, unit,name) {
    var option = {
      title: {
        text: ''
      },
      xAxis: {
        name:'小时',
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#999999'
          }
        },
        data: xdata
      },
      yAxis: {
        name: unit ? name + '(' + unit + ')' : name,
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999999',
          }
        },
        splitLine: { show: false },
        max: function (value) {
          return Math.ceil(Math.max(value.max, maxdata) + 3);
        }
      },
      grid: {
        left: 40,
        top: 30,
        bottom: 20,
        right: 40,
      },
      series: [{
        data: ydata,
        type: 'line',
        smooth: true,
        label: {
          show: false
        },
        lineStyle: {
          color: '#3A93FF'
        },
        areaStyle: {
          color:'#D0E9FF'
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
          symbolSize: 5,
          data: [{
            name: '最小值',
            yAxis: mindata,
            label: {
              show: false,
            },
            lineStyle: {
              normal: {
                color: '#13C2C2' // 这儿设置安全基线颜色
              }
            },
          },
          {
            name: '最大值',
            yAxis: maxdata,
            label: {
              show: false,
            }
          },
          ]
        },
      }]
    }
    return option;
  },
  //当页面被卸载的时候关闭webSocket
  onUnload: function () {

  }
})