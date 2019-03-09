// calendar/pages/fodder/fodder.js
import {$request,formatData} from "../../../utils/util.js"
const {$Message} = require('../../../dist1/base/index');
import Toast from '../../../dist/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather: '晴',
    date: formatData(new Date()),
    datatime: new Date().getTime(),
    listPerson: [], //所有员工列表
    dataPerson: [], //选中员工列表
    personstring: '',
    listFodder: [], //所有品种idname
    datafodder: [], //选中品种idname
    selectfodder: 0, //默认选中的品种
    selectvalue: 0, //默认选中用量
    value: [10, 15, 20, 30],
    inputvalue: '',
    textarea: '',
    showPerson: false,
    btnloading: false,
    show: false,
    listFoddershow: false,
    groupId: null,
    listWeather: [], //十五天天气数据
    isShowDate:false
  },
  isOpenDate() {
    this.setData({
      isShowDate: !this.data.isShowDate
    })
  },
  //操作时间
  handleDateConfirm(e) {
    console.log(e.detail)
    this.setData({
      date: formatData(new Date(e.detail)),
      datatime: e.detail,
      isShowDate: false
    })
    let newlist = this.data.listWeather.filter((item) => {
      return item.predictDate == formatData(new Date(e.detail))
    })
    if (newlist.length > 0) {
      console.log(newlist)
      this.setData({
        weather: newlist[0].conditionDay
      })
    } else {
      this.setData({
        weather: '未知'
      })
    }
  },
  handleDateChange(event) { },
  //饲料品种显示
  listFoddershow() {
    this.setData({
      listFoddershow: true
    })
  },
  //饲料品种隐藏
  listFodderhide() {
    this.setData({
      listFoddershow: false
    })
  },
  //选择饲料品种
  selectfooderfunc(event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      selectfodder: index
    })
  },
  //选择饲料用量
  selectvaluefunc(event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      selectvalue: index
    })
  },
  //自定义用量
  inputchange(event) {
    console.log(event.detail.value)
    this.setData({
      inputvalue: event.detail.value,
      selectvalue: null,

    })
  },
  //添加一条记录
  addfunc() {
    let {
      datafodder,
      inputvalue,
      value,
      selectvalue,
      listFodder,
      selectfodder
    } = this.data;
    let numvalue;
    // 饲料用量为整数+小数点后面两位，总长不超过6位
    //let inputtest = /^(?=[\d.]{1,4})[1-9]\d{0,4}(\.\d\d)?$/;
    let inputtest = /^\d{1,10}(\.\d{1,2})?$/;
    if (selectvalue == null) {
      if (!inputtest.test(inputvalue)) {
        $Message({
          content: '饲料用量小数点前十位后面两位',
          type: 'error'
        });
        return false;
      } else {
        numvalue = inputvalue
      }
    } else {
      numvalue = value[selectvalue]
    }
    datafodder.push({
      operation_name: listFodder[selectfodder].dcName,
      operation_id: listFodder[selectfodder].dcId,
      operation_num: numvalue
    })
    this.setData({
      datafodder,
      listFoddershow: false,
      selectvalue: 0,
      selectfodder: 0,
      inputvalue:''
    })
  },
  //删除一条记录
  delfodderfunc(event) {
    let index = event.currentTarget.dataset.index;
    let {
      datafodder
    } = this.data;
    datafodder.splice(index, 1)
    this.setData({
      datafodder
    })
  },
  //选择人显示
  choosePerson() {
    this.setData({
      showPerson: true
    })
  },
  //选择人隐藏
  cancelfunc() {
    this.setData({
      showPerson: false
    })
  },
  //选择人
  onChange(event) {
    console.log(event.detail);
    let newlist = event.detail.toString()
    this.setData({
      dataPerson: event.detail,
      personstring: newlist
    });
  },
  //选择人
  toggle(event) {
    const {name} = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${name}`);
    checkbox.toggle();
  },
  //选择人
  noops(event) {},
  //textarea
  textareafunc(event) {
    this.setData({
      textarea: event.detail.value
    })
  },
  //获取员工列表
  getstaff() {
    $request({
      url: app.globalData.serverWorker + "staff/findByOwer",
      method: "POST",
      type: 'form'
    }).then(res => {
      console.log(res)
      if (res.data.resultCode == 0) {
        this.setData({
          listPerson: res.data.data
        })
      }
    }).catch(error => {})
  },
  //获取饲料品种
  getlistFodder() {
    $request({
      url: app.globalData.serverFarm + "farm/findDictionary",
      method: "POST",
      type: 'form',
      params: {
        operation_type: 1
      }
    }).then(res => {
      Toast.clear();
      if (res.data.resultCode == 0) {
        this.setData({
          listFodder: res.data.data
        })
      }
    }).catch(error => {})
  },
  noop: function noop() {},
  //提交按钮
  handleClick() {
    let {
      weather,
      date,
      dataPerson,
      listFodder,
      textarea,
      datafodder,
      groupId
    } = this.data;
    //必填项
    if (!datafodder.length) {
      $Message({
        content: '请选择饲料品种',
        type: 'error'
      });
    } else if (!dataPerson.length) {
      $Message({
        content: '请选择操作人',
        type: 'error'
      });
    } else {
      //通过人名找到id
      let staffid = [];
      this.data.listPerson.map((item, index) => {
        for (let i in this.data.dataPerson) {
          if (item.sname == this.data.dataPerson[i]) {
            staffid.push(item.sId)
          }
        }
      })
      let operation = []
      datafodder.map((item, index) => {
        operation.push({
          ...item,
          'unit': '斤'
        })
      })

      let newdata = {
        "sIds": staffid,
        "groupId": groupId,
        "operation_time": date,
        "weather": weather,
        "operation_type": "1",
        "operation_ids_num_unit": operation,
        "explanation": textarea
      };
      this.setData({
        btnloading: true
      })
      if (this.edit) {
        //点击保存修改数据
        $request({
          url: app.globalData.serverFarm + "farm/updateFarm",
          method: "POST",
          params: {
            ...newdata,
            'groupId': groupId,
            'foId': this.foId
          }
        }).then(res => {
          this.setData({
            btnloading: false
          })
          if (res.data.resultCode == 0) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            })
          } else {
            wx.showToast({
              title: res.data.resultDesc,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(error => {
          this.setData({
            btnloading: false
          })
        })
      } else {
        //点击保存发送数据
        // app.globalData.serverFarm
        $request({
          url: app.globalData.serverFarm+"farm/addFarm",
          method: "POST",
          params: newdata
        }).then(res => {
          this.setData({
            btnloading: false
          })
          if (res.data.resultCode == 0) {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                setTimeout(() => {
                  wx.switchTab({
                    url: '../../../pages/farmingHome/farmingHome'
                  })
                }, 2000)
              }
            })
          } else {
            wx.showToast({
              title: res.data.resultDesc,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(error => {
          this.setData({
            btnloading: false
          })
        })
      }
    }
  },
  //获取城市天气
  getWeather(lat, lng) {
    $request({
      url: app.globalData.serverWeather + 'getWeather15Days',
      method: "POST",
      params: {
        'lat': lat,
        'lon': lng
      }
    }).then(result => {
      console.log(result.data.msg)
      if (result.data.resultCode == 0) {
        this.setData({
          listWeather: result.data.msg.data15.forecast,
          weather: result.data.msg.data15.forecast[1].conditionDay
        })
        console.log(this.data.listWeather)
      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => {})

  },
  //获取饲料数据
  getolddata(foId) {
    $request({
      url: app.globalData.serverFarm + 'farm/findFarmByfoIdToUpdate',
      method: "POST",
      type: 'form',
      params: {
        foId: foId
      }
    }).then(result => {
      if (result.data.resultCode == 0) {
        let datafoddes = [];
        result.data.data.data.forEach((item, index) => {
          let temp = {
            operation_num: item.operation_num,
            operation_name: item.operation_name,
            unit: item.unit,
            operation_id: item.operation_id
          }
          datafoddes[index] = temp
        })
        this.setData({
          datafodder: datafoddes,
          dataPerson: Object.values(result.data.data.staff),
          personstring: Object.values(result.data.data.staff).toString(),
          weather: result.data.data.weather,
          explanation: result.data.data.explanation,
          operation_time: result.data.data.operation_time,
          groupId: result.data.data.groupId,
          date: result.data.data.operation_time,
          datatime: new Date(result.data.data.operation_time).getTime()
        })
      } else {
        $Toast({
          content: result.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    //判断是否编辑页面
    if (options.foId) {
      this.edit = true;
      this.foId = options.foId;
      this.groupid = options.groupid;
      wx.setNavigationBarTitle({
        title: '编辑饲料投放'
      })
      this.getolddata(options.foId);
    } else {
      this.edit = false;
      this.setData({
        groupId: options.groupid
      })
      let newlist = this.data.dataPerson.toString()
      this.setData({
        personstring: newlist
      });
    }
    //获取城市天气
    this.getWeather(options.lat, options.lon);
    //获取品种接口
    this.getlistFodder();
    //获取员工接口
    this.getstaff();
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