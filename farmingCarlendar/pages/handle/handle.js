// farmingCarlendar/pages/handle/handle.js
import Toast from '../../../dist/toast/toast';
import Notify from '../../../dist/notify/notify';
// import {
//   areaList
// } from '../../../utils/area';
import {
  $request,
  $parseArray,
  $convertDate
} from "../../../utils/util.js";
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _Url: app.globalData.serverWorker,
    _Url_Farm: app.globalData.serverFarm,
    _Url_HYH: app.globalData.serverHYH,
    _Url_weather: app.globalData.serverWeather,
    formData: {
      currentDate: $convertDate(new Date().getTime()), // 日期
      currentWeather: '', // 天气
      currentWorker: [], // 操作人
      mark: "", // 补充说明
      farming: [], // 农事操作
      foId: "",
      groupId:"",
    },
    maxDate: new Date().getTime() + 24 * 60 * 60 * 1000 * 14, //可选择的最大日期
    minDate: new Date().getTime() - 24 * 60 * 60 * 1000, //可选择的最小日期
    currentDate: new Date().getTime(), //当前时间戳
    currentWorkerName: "", //选中的工人名称-----集合字符串
    tags: null, // 三个为一组  分组后----农事操作字典
    rawTags: null, // 农事操作------原始数据
    isShowDate: false, //是否显示时间下拉列表
    isShowWorker: false, //是否显示操作人抽屉
    workerList: [], //所有工人列表
    weatherInfo: [], //当天---未来15天的天气信息
    X: "",
    Y: "",
    isVisableHandleText: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    let workerDic = $request({
      url: this.data._Url + "staff/findByOwer",
      type: 'form'
    })
    let farmingHandleDic = $request({
      url: this.data._Url_Farm + "farm/findDictionary",
      type: 'form',
      params: {
        operation_type: "4"
      }
    })
    let requestList = null;
    that.setData({
      X: options.lat,
      Y: options.lon,
      'formData.groupId': options.groupid
    })
    if (options.foId) {
      let editInfo = $request({
        url: this.data._Url_Farm + "farm/findFarmByfoIdToUpdate",
        params: {
          foId: options.foId
        },
        type: 'form'
      })
      requestList = [workerDic, farmingHandleDic, editInfo]
    } else {
      requestList = [workerDic, farmingHandleDic]
    }
    that.setData({
      isVisableHandleText: !that.data.isVisableHandleText
    })
    Promise.all(requestList).then(res => {
      let workerList = res[0].data.data
      let Tags = res[1].data.data
      let currentWeather = ""
      let weatherInfo
      let parseTags = [];
      Tags.map(item => {
        item.id = item.dcId;
        item.name = item.dcName;
        item.checked = false
        return item
      })
      workerList.map(item => {
        item.sId = item.sId.toString()
        item.checked = false
        return item
      })
      $request({
        url: that.data._Url_weather +  'getWeather15Days',
        params: {
          'lat': options.lat,
          'lon': options.lon
        }
      }).then(result => {
        weatherInfo = result.data.msg.data15.forecast
        currentWeather = result.data.msg.data15.forecast[0].conditionDay;
        parseTags = $parseArray(Tags, 3)
        if (res[2]) {
          let editInfo = res[2].data.data
          let seleceFarmID = [];
          for (let i of editInfo.data) {
            Tags.map(item => {
              item.id = item.dcId;
              item.name = item.dcName;
              if(i.operation_id == item.dcId){
                item.checked = true
              } 
              return item
            })
            seleceFarmID.push(i.operation_id)
          }
          let staff = editInfo.staff
          let selectWorkerName = "";
          let selectWorkerID = [];
          for (let i in staff) {
            selectWorkerID.push(i)
            selectWorkerName += staff[i] + " "
            workerList.map(item => {
              // item.sId == i ? item.checked = true : item.checked = false
              if(item.sId == i){
                item.checked = !item.checked
              }
              return item
            })
          }
          console.log(editInfo)
          //data中currentData初始化，此时进行二次赋值
          that.setData({
            'formData.currentDate': editInfo.operation_time,
            "formData.currentWeather": editInfo.weather,
            'formData.farming': seleceFarmID,
            'formData.currentWorker': selectWorkerID,
            'currentWorkerName': selectWorkerName,
            'weatherInfo': weatherInfo,
            "formData.foId": options.foId,
            "formData.mark": editInfo.explanation,
            tags: parseTags,
            rawTags: Tags,
            workerList: workerList
          })
          that.setData({
            isVisableHandleText: !that.data.isVisableHandleText
          })
          Toast.clear()
          return false
        }
        that.setData({
          tags: parseTags,
          rawTags: Tags,
          workerList: workerList,
          'formData.currentWeather': currentWeather,
          'weatherInfo': weatherInfo
        })
        that.setData({
          isVisableHandleText: !that.data.isVisableHandleText
        })
        Toast.clear()
      }).catch(error => {
        setTimeout(function() {
          that.setData({
            isVisableHandleText: !that.data.isVisableHandleText
          })
          Toast.clear()
        }, 600)
      })
    }).catch(error => {
      that.setData({
        isVisableHandleText: !that.data.isVisableHandleText
      })
      Toast.clear()
    })
  },
  handleWorkerCheck(e) {
    let workerList = this.data.workerList
    for (var i = 0; i < workerList.length; i++) {
      if (workerList[i].sId == e.currentTarget.dataset.name) {
        workerList[i].checked = !workerList[i].checked
        this.setData({
          workerList: workerList
        })
        break
      }
    }
  },

  handleReset() {
    let workerList = this.data.workerList;
    for (let i of workerList) {
      i.checked = false
    }
    this.setData({
      formData: {
        currentDate: $convertDate(new Date().getTime()), // 日期
        currentWeather: this.data.weatherInfo[0].condition, // 天气
        currentWorker: [], // 操作人
        mark: "", // 补充说明
        farming: [], // 农事操作
      },
      workerList: workerList,
      currentWorkerName: ""
    })
  },
  handleSelectTag(e) {
    let id = e.currentTarget.dataset.id
    let rawTags = this.data.rawTags
    for (var i of rawTags) {
      if (i.id == id) {
        i.checked = !i.checked
        let array = this.data.formData.farming
        array.some(item=> {
          return item == id
        }) ? array.splice(array.findIndex(items =>{ return items == id }), 1) : array.push(id)
        let parseTags = $parseArray(rawTags, 3)
        this.setData({
          tags: parseTags,
          'formData.farming': array
        })
        return
      }
    }
  },
  isOpenDate() {
    this.setData({
      isShowDate: !this.data.isShowDate
    })
  },
  handleDateConfirm(e) {
    let weatherInfo = this.data.weatherInfo
    let currDate = $convertDate(e.detail)
    let currWeatherInfo = weatherInfo.filter(item => {
      return item.predictDate.indexOf(currDate) > -1
    })
    this.setData({
      'formData.currentDate': currDate,
      isShowDate: !this.data.isShowDate,
      'formData.currentWeather': currWeatherInfo.length > 0 ? currWeatherInfo[0].conditionDay : "未知"
    })
  },
  handleDateChange(event) {},
  handleMarkChange(event) {
    this.setData({
      'formData.mark': event.detail.value
    })
  },
  handleWorker(event) {
    this.setData({
      isShowWorker: !this.data.isShowWorker
    })
  },
  handleWorkerClose() {
    let workerList = this.data.workerList
    let selectWorker = workerList.filter(item => {
      return item.checked == true
    });
    let selectWorkerName = "";
    let selectWorkerID = []
    for (var i = 0; i < selectWorker.length; i++) {
      selectWorkerName += selectWorker[i].sname + " "
      selectWorkerID.push(selectWorker[i].sId)
    }
    this.setData({
      currentWorkerName: selectWorkerName,
      isShowWorker: !this.data.isShowWorker,
      'formData.currentWorker': selectWorkerID
    })
  },

  handleSubmit() {
    let formData = { ...this.data.formData
    };
    var that = this
    for (var i in formData) {
      if (formData[i].length == 0 && i != "mark" && i != "foId" && i !="groupId") {
        Notify("必填项不可为空")
        return false
      }
    }
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    
    formData.farming = formData.farming.map(item => {
      let param = {};
      param['operation_id'] = item.toString()
      return item = param
    })

    //operation_time  操作时间
    //weather 天气
    //operation_ids_num_unit 农事操作集合
    //sIds 操作人集合
    //explanation  备注说明
    let url = formData.foId == "" ? "farm/addFarm" : "farm/updateFarm"
    that.setData({
      isVisableHandleText: !that.data.isVisableHandleText
    })
    $request({
      url: this.data._Url_Farm + url,
      method: "POST",
      params: {
        'operation_time': formData.currentDate,
        'weather': formData.currentWeather,
        'operation_ids_num_unit': formData.farming,
        'sIds': formData.currentWorker,
        'explanation': formData.mark,
        "operation_type": "4",
        "foId": formData.foId,
        "groupId": formData.groupId
      }
    }).then(res => {
      setTimeout(function() {
        Toast.clear()
        that.setData({
          isVisableHandleText: !that.data.isVisableHandleText
        })
        if (res.data.resultCode == "0") {
          setTimeout(function() {
            Toast.success("操作成功")
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2000)
          }, 600)
        } else {
          setTimeout(function() {
            Toast.fail("操作失败")
          }, 600)
        }
      }, 600)
    }).catch(err => {
      that.setData({
        isVisableHandleText: !that.data.isVisableHandleText
      })
      Toast.clear()
    })
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