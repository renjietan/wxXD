import {
  $request
} from "../../../utils/util.js"
import Toast from '../../../dist/toast/toast';
import Notify from '../../../dist/notify/notify';
const serverList = getApp().globalData;
Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: {},
    isVisiableWorker: false,
    workerList: [],
    isVisiableText: false,
    worker_url: serverList.serverWorker + "staff/findByOwer",
    // holiday_url: "http://192.168.3.189:9093/" + "Work/selectAllleId",
    // update_url: "http://192.168.3.189:9093/" + "Work/updateLeave",
    // add_url: "http://192.168.3.189:9093/" + "Work/addLeave", 
    holiday_url: serverList.server9093 + "Work/selectAllleId",
    update_url: serverList.server9093 + "Work/updateLeave",
    add_url: serverList.server9093 + "Work/addLeave",
    formData: {
      id: "",
      workerId: "",
      workerName: "",
      holiday: [],
      remarks: ""
    },
    type: ""
  },
  onLoad: function (options) {
    let that = this
    Toast.loading({
      mark: true,
      duration: 0,
      message: "加载中..."
    })
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate(),
    })
    if (options.id) {
      that.setData({
        'formData.id': options.id,
        type: "edit"
      })
      let workerRes = $request({
        url: that.data.worker_url,
        type: "form"
      })
      let holidayRes = $request({
        url: that.data.holiday_url,
        type: "form",
        params: { id: that.data.formData.id }
      })
      Promise.all([workerRes, holidayRes]).then(res => {
        setTimeout(function () {
          let workerList = res[0].data.data
          let holidayInfo = res[1].data.data
          let tempDateArr = holidayInfo[0].time.split("-")
          let year = tempDateArr[0];
          let month = tempDateArr[1];
          that.setData({
            year: year,
            month: month
          })
          workerList.map(item => {
            item.sId = item.sId.toString()
            item.checked = false
            if (item.sId == holidayInfo[0].sId) item.checked = true
            return item
          })
          // let dateArr = that.data.dateArr
          // dateArr[holidayInfo[0].time].holiday = holidayInfo[0].days
          that.setData({
            workerList: workerList,
            isVisiableText: !that.data.isVisiableText,
            'formData.workerId': holidayInfo[0].sId,
            'formData.workerName': holidayInfo[0].name,
            'formData.holiday': [{
              date: holidayInfo[0].time,
              value: holidayInfo[0].days
            }],
            'formData.remarks': holidayInfo[0].reason,
            // "dateArr": dateArr
          })
          that.dateInit(Number(year), Number(month) - 1);

          Toast.clear()
        }, 600)
      })
    } else {
      $request({
        url: that.data.worker_url,
        type: "form"
      }).then(res => {
        setTimeout(function () {
          let workerList = res.data.data
          workerList.map(item => {
            item.sId = item.sId.toString()
            item.checked = false
            return item
          })
          Toast.clear()
          that.setData({
            type: "add",
            workerList: workerList,
            isVisiableText: !that.data.isVisiableText
          })
        }, 600)
      }).catch(error => {
        setTimeout(function () {
          Toast.clear()
        }, 600)
      })
    }

  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(`${year}-${month > 8 ? month + 1 : "0" + (month + 1)}-01`).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;

    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        dateArr[year + "-" + (month < 9 ? ("0" + (month + 1)) : (month + 1)) + "-" + (num < 10 ? ("0" + num) : num)] = {
          'day': num,
          'holiday': 0
        }
      } else {
        dateArr[i] = ""
      }
    }
    let temp = {
      ...dateArr
    }
    let holidayList = this.data.formData.holiday
    if(holidayList.length > 0){
      for (let item of holidayList) {
        if(temp[item.date]){
          temp[item.date].holiday = item.value
        }
      }
    }
    this.setData({
      dateArr: temp
    })
    // let nowDate = new Date();
    // let nowYear = nowDate.getFullYear();
    // let nowMonth = nowDate.getMonth() + 1;
    // let nowWeek = nowDate.getDay();
    // let getYear = setYear || nowYear;
    // let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    // if (nowYear == getYear && nowMonth == getMonth) {
    //   this.setData({
    //     isTodayWeek: true,
    //     todayIndex: nowWeek
    //   })
    // } else {
    //   this.setData({
    //     isTodayWeek: false,
    //     todayIndex: -1
    //   })
    // }
  },
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: Number(year),
      month: (Number(month) + 1)
    })
    this.dateInit(Number(year), Number(month));
  },

  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: Number(year),
      month: (Number(month) + 1)
    })
    this.dateInit(Number(year), Number(month));
  },

  handleDate(e) {
    let check_Date = e.currentTarget.dataset.check;
    let dateArr = this.data.dateArr
    let holiday = dateArr[check_Date].holiday
    let formDataHoliday = this.data.formData.holiday
    holiday = holiday + 0.5
    if (holiday > 1) {
      holiday = 0
    }
    dateArr[check_Date].holiday = holiday

    if (formDataHoliday.length == 0) {
      formDataHoliday.push({
        date: check_Date,
        value: holiday
      })
    } else {
      let isVaildate = formDataHoliday.some((item, i) => {
        return item.date == check_Date
      })
      if (isVaildate) {
        for (let i of formDataHoliday) {
          if (i.date == check_Date) {
            i.value = holiday
          }
        }
      } else {
        formDataHoliday.push({
          date: check_Date,
          value: holiday
        })
      }


    }

    //过滤掉 holiday = 0 得到新数组
    let temp = formDataHoliday.filter(item => {
      return item.value != 0
    })
    this.setData({
      dateArr: dateArr,
      "formData.holiday": temp
    })
  },

  handleSubmit() {
    var that = this
    var formData = that.data.formData
    if (formData.holiday.length == 0 || formData.workerId == "" || formData.workerName == "") {
      Notify("必填项不可为空")
    } else if (formData.remarks.length > 200) {
      Notify("【补充说明】字符长度不可超过200")
    } else {
      Toast.loading({
        mask: true,
        message: "加载中"
      })
      let temp
      let url;
      if (formData.id == "") {
        temp = {
          sId: formData.workerId,
          sname: formData.workerName,
          leaveTime: JSON.stringify(formData.holiday),
          reason: formData.remarks
        }
        url = that.data.add_url
      }else{
        temp = {
          id: formData.id,
          sId: formData.workerId,
          sname: formData.workerName,
          leaveTime: JSON.stringify(formData.holiday),
          reason: formData.remarks
        }
        url = that.data.update_url
      }
      that.setData({
        isVisiableText: !that.data.isVisiableText
      })
      $request({
        url: url,
        params: temp,
        type: "form"
      }).then(res => {
        setTimeout(function () {
          Toast.clear()
          setTimeout(function () {
            that.setData({
              isVisiableText: !that.data.isVisiableText
            })
            Toast.success("操作成功")
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 600)
          }, 600)
        }, 600)
      })
    }
  },
  handleWorkerCheck(e) {
    let workerList = this.data.workerList
    for (var i = 0; i < workerList.length; i++) {
      if (workerList[i].sId == e.currentTarget.dataset.id) {
        workerList[i].checked = !workerList[i].checked
        workerList[i].checked == true ? this.setData({
          'formData.workerName': e.currentTarget.dataset.name,
          'formData.workerId': e.currentTarget.dataset.id,
        }) : this.setData({
          'formData.workerName': "",
          'formData.workerId': "",
        })
      } else {
        workerList[i].checked = false
      }
    }
    this.setData({
      workerList: workerList
    })
  },
  handleChangeText(e) {
    this.setData({
      "formData.remarks": e.detail.value
    })
  },
  handleIsVisableWorker() {
    if(this.data.type == "edit"){
      Toast("请假人不可编辑...")
      return false
    }
    this.setData({
      isVisiableWorker: !this.data.isVisiableWorker
    })
  },
})