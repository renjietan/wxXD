// pages/seedling/seedling.js
import { $request, formatData } from "../../../utils/util.js"
const { $Message } = require('../../../dist1/base/index');
const app = getApp();
import Toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather: '晴',
    date: formatData(new Date()),
    datatime: new Date().getTime(),
    listPerson: [],//所有员工列表
    dataPerson: [],//选中员工列表
    personstring: '',
    listVariety: '',//投放品种    
    listunit:[],
    unitValue: 0,
    listValue: [10, 15, 20, 30],
    value: 0,
    inputValue: '',
    textarea: '',
    showPerson: false,
    btnloading: false,
    listWeather: []//十五天天气数据
  },
  isOpenDate() {
    this.setData({
      isShowDate: !this.data.isShowDate
    })
  },
  //操作时间
  handleDateConfirm(e) {
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
    let newlist = event.detail.toString()
    this.setData({
      dataPerson: event.detail,
      personstring: newlist
    });
  },
  //选择人
  toggle(event) {
    const { name } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${name}`);
    checkbox.toggle();
  },
  //选择人
  noops() {
  },
  //选择数量
  clickvalue(event) {
    let id = event.currentTarget.dataset.id;
    this.setData({
      value: id,
      inputValue:''
    })
  },
  //选择规格
  clickunit(event) {
    let id = event.currentTarget.dataset.id;
    this.setData({
      unitValue: id
    })
  },
  //输入框
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
      value: null
    })
  },
  //textarea
  textareafunc(event) {
    this.setData({
      textarea: event.detail.value
    })
  },
  //获取员工列表
  getstaff() {
    $request({ url: app.globalData.serverWorker + "staff/findByOwer", method: "POST", type: 'form' }).then(res => {
      if (res.data.resultCode == 0) {
        this.setData({
          listPerson: res.data.data
        })
      }
    }).catch(error => { })
  },
  //获取投放规格
  getlistFodder() {
    $request({
      url: app.globalData.serverFarm+"farm/findDictionary", method: "POST", type: 'form',
      params: { operation_type: 2 }
    }).then(res => {
      Toast.clear();
      if (res.data.resultCode == 0) {
        let newlist = [];
        res.data.data.map((item, index) => {
          newlist.push(item.dcName)
        })
        this.setData({
          listunit: newlist
        },()=>{
          if (this.edit){
            this.getolddata(this.foId);
          }
          
        })
      }
    }).catch(error => { })
  },
  //保存按钮
  handleClick() {
    let { weather, date, listPerson, dataPerson, listVariety, listunit, listValue, value, unitValue, textarea, inputValue } = this.data;
    //必填项
    if (!dataPerson.length) {
      $Message({
        content: '请选择操作人',
        type: 'error'
      });
    } else if (unitValue<0) {
      $Message({
        content: '请选择投放规格',
        type: 'error'
      });
    } else {
      //通过人名找到id
      let staffid = [];
      listPerson.map((item, index) => {
        for (let i in this.data.dataPerson) {
          if (item.sname == this.data.dataPerson[i]) {
            staffid.push(item.sId)
          }
        }
      })
      //投放量
      let numvalue;
      // 饲料用量为整数+小数点后面两位，总长不超过6位
      //let inputtest = /^(?=[\d.]{1,4})[1-9]\d{0,4}(\.\d\d)?$/;
      let inputtest = /^\d{1,10}(\.\d{1,2})?$/;
      if (value == null) {
        if (!inputtest.test(inputValue)) {
          $Message({
            content: '饲料用量小数点前十位后面两位',
            type: 'error'
          });
          return false;
        } else {
          numvalue = inputValue
        }
      } else {
        numvalue = listValue[value]
      }

      let operation = [{ 'operation_num': numvalue, 'unit': listunit[unitValue] }]

      let newdata = {
        "sIds": staffid,
        "groupId": this.groupid,
        "operation_time": date,
        "weather": weather,
        "operation_type": "2",
        "operation_ids_num_unit": operation,
        "explanation": textarea
      };
      this.setData({
        btnloading: true
      })
      console.log(newdata);
      if (this.edit) {
        //点击保存修改数据
        $request({
          url: app.globalData.serverFarm +"farm/updateFarm",
          method: "POST",
          params: {
            ...newdata,
            'groupId': this.data.groupId,
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
      }else{
        //点击保存发送数据
        $request({
          url: app.globalData.serverFarm + "/farm/addFarm", method: "POST",
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
        }).catch(error => { })
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
    }).catch(error => { })

  },
  //获取苗种数据
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
        let unitValue = this.data.listunit.indexOf(result.data.data.data[0].unit)
        let value = this.data.listValue.indexOf(result.data.data.data[0].operation_num)
        let inputValue='';
        if(value==-1){
          value=null;
          inputValue=result.data.data.data[0].operation_num;
        }
        this.setData({
          unitValue: unitValue,
          value: value,
          inputValue: inputValue,
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
    }).catch(error => { })
  },
  //获取塘口信息接口
  getgroup(groupId) {
    $request({
      url: app.globalData.serverHYH + 'selectGroupgudingInfoKey',
      method: "POST",
      params: {
        groupId: groupId
      }
    }).then(result => {
      if (result.data.resultCode == 0) {
        this.setData({
          listVariety: result.data.data[0].dcName
        })
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
        title: '编辑苗种投放'
      })
      this.getolddata(this.foId)
      this.getgroup(this.groupid)
    }else{
      this.groupid = options.groupid;
      let newlist = this.data.dataPerson.toString()
      this.setData({
        personstring: newlist
      });
      this.setData({
        listVariety: options.dcName
      })
      
    }
    //获取城市天气
      this.getWeather(options.lat, options.lon);
    //获取人员数据
    this.getstaff();
    //获取种类
    this.getlistFodder();
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