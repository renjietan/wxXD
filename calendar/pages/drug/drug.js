// pages/drug/drug.js
import { $request, formatData } from "../../../utils/util.js"
const { $Message } = require('../../../dist1/base/index');
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
    listPerson: [],
    dataPerson: [],
    personstring: '',
    unitlist: ['mL', 'L', 'g', 'Kg'],
    active: 0,
    textarea: '',
    listDisease: [],//所有疾病
    dataDisease: [],//选中疾病名
    diseasearr: [],//选中疾病带参数
    dataDrug: [],//选中药品名
    drug: [],//选中药品带参数
    drugarr: [],//所有疾病对应药品
    btnshow: true,
    showPerson: false,
    diseaseshow: false,
    showDrug: false,
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
  onChangePerson(event) {
    console.log(event.detail);
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
  noops(event) {
    const { name } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${name}`);
    checkbox.toggle();
  },
  //选择疾病
  onChangeDisease({ detail = {} }) {
    const index = this.data.dataDisease.indexOf(detail.value);
    index === -1 ? this.data.dataDisease.push(detail.value) : this.data.dataDisease.splice(index, 1);
    //获取选中疾病数组带id和name
    detail.current ? this.data.diseasearr.push({
      dcName: detail.value,
      dcId: this.getDiseaseid(detail.value)
    }) : this.data.diseasearr.splice(index, 1);
    //drug dataDrug
    let newdrug = this.data.drug;
    let newdataDrug = this.data.dataDrug;
    if (!detail.current){
      console.log(123)
      if (this.data.drug.length>0){
        newdrug = this.data.drug.filter(item => { return item.name.split('-')[0].toString() !== detail.value })
        newdataDrug = this.data.dataDrug.filter(item => { return item.split('-')[0].toString() !== detail.value })
      }
    }
    this.setData({
      dataDisease: this.data.dataDisease,
      diseasearr: this.data.diseasearr,
      drug: newdrug,
      dataDrug: newdataDrug,
      btnshow: this.data.dataDisease.length ? false : true
    });

  },
  //选择药剂
  onChangeDrug({ detail = {} }) {
    const index = this.data.dataDrug.indexOf(detail.value);
    index === -1 ? this.data.dataDrug.push(detail.value) : this.data.dataDrug.splice(index, 1);
    let diseasename = detail.value.split('-')[0].toString();
    let drugname = detail.value.split('-')[1].toString();
    this.data.drug.push({
      "name": detail.value,
      "operation_id": this.getdrugid(drugname),
      "operation_num": "",
      "unit": 'mL',
      "disease": this.getDiseaseid(diseasename)
    })
    this.setData({
      dataDrug: this.data.dataDrug,
      drug: this.data.drug
    });
  },
  //删除疾病
  onDelDisease(event) {
    let name = event.currentTarget.dataset.name;//疾病名称
    //疾病列表同步
    let newdataDisease = this.data.dataDisease.filter(item => item !== name);
    //选中疾病带参数同步
    let newdiseasearr = this.data.diseasearr.filter(item => item.dcName !== name);
    //选中药品名
    let newdataDrug = this.data.dataDrug.filter(item => item.split('-')[0] !== name);
    //选中药品带参数
    let newdrug = this.data.drug.filter(item => item.name.split('-')[0] !== name);
    this.setData({
      dataDisease: newdataDisease,
      diseasearr: newdiseasearr,
      dataDrug: newdataDrug,
      drug: newdrug,
      btnshow: newdataDisease.length ? false : true
    });
  },
  //删除药剂
  onDelDrug(event) {
    let id = event.currentTarget.dataset.id;
    this.data.dataDrug.splice(id, 1);
    this.data.drug.splice(id, 1);
    this.setData({
      dataDrug: this.data.dataDrug,
      drug: this.data.drug
    });
  },
  //显示疾病
  diseasefunc() {
    this.setData({
      diseaseshow: true
    })
  },
  //隐藏疾病
  onDiseaseClose() {
    this.setData({
      diseaseshow: false
    })
  },
  //显示药剂
  drugfunc() {
    if (this.data.dataDisease.length) {
      this.setData({
        showDrug: true
      })
      let newarr = [];
      this.data.diseasearr.map((item) => {
        newarr.push(item.dcId)
      })
      let sdata = newarr.toString();
      this.getdrugarr(sdata);

    } else {
      wx.showToast({
        icon: 'none',
        title: '请先点击添加疾病'
      });
    }
  },
  //隐藏药剂
  onDrugClose() {
    this.setData({
      showDrug: false,
      active: 0
    })
  },
  //根据疾病获取对应药品
  getdrugarr(data) {
    $request({
      url: app.globalData.serverFarm +"farm/findDrugs", method: "POST", type: 'form', params: {
        operation_ids: data
      }
    }).then(res => {
      if (res.data.resultCode == 0) {
        res.data.data.map((item) => {
          this.data.listDisease.map((its) => {
            if (its.dcId == item.diseaseId) {
              item.diseaseName = its.dcName
            }
          })
        })
        this.setData({
          drugarr: res.data.data
        })
      }
    }).catch(error => { })
  },
  //通过疾病名字获取疾病id
  getDiseaseid(name) {
    let diseasearr = this.data.listDisease;
    for (let i in diseasearr) {
      if (diseasearr[i].dcName == name) {
        return diseasearr[i].dcId
      }
    }
  },
  //通过药品名字获取药品id
  getdrugid(name) {
    let drugarr = this.data.drugarr;
    for (let i in drugarr) {
      for (let j in drugarr[i].drugs) {
        if (drugarr[i].drugs[j].dcName == name) {
          return drugarr[i].drugs[j].drugId
        }
      }
    }
  },
  //药剂弹层切换疾病
  onChange(event) {
    this.setData({
      active: event.detail
    })
  },
  //单位
  clickunit(event) {
    let name = event.currentTarget.dataset.name;
    let indexs = event.currentTarget.dataset.index;
    let newlist = this.data.drug;
    this.data.drug.map((item, index) => {
      if (index == indexs) {
        this.data.drug[index].unit = name
      }
    })
    this.setData({
      drug: this.data.drug
    })
  },
  //药剂用量
  bindKeyInput(event) {
    let id = event.currentTarget.dataset.id;
    let ids = event.currentTarget.dataset.ids;
    let newdata = this.data.drug;
    newdata.map((item, index) => {
      if (item.operation_id == id && item.disease==ids) {
        item.operation_num = event.detail.value
      }
    })
    this.setData({
      drug: newdata
    })
  },
  //备注
  textareafunc(event) {
    this.setData({
      textarea: event.detail.value
    })
  },
  noop: function noop() { },
  //获取员工列表
  getstaff() {
    $request({ url: app.globalData.serverWorker + "staff/findByOwer", method: "POST", type: 'form' }).then(res => {
      console.log(res)
      if (res.data.resultCode == 0) {
        this.setData({
          listPerson: res.data.data
        })
      }
    }).catch(error => { })
  },
  //获取疾病列表
  getlistDisease() {
    $request({
      url: app.globalData.serverFarm +"farm/findDictionary", method: "POST", type: 'form',
      params: { operation_type: 3 }
    }).then(res => {
      Toast.clear();
      if (res.data.resultCode == 0) {
        this.setData({
          listDisease: res.data.data
        })
      }
    }).catch(error => { })
  },
  //保存按钮
  handleClick() {
    let { weather, date, dataPerson, listPerson, drug, textarea } = this.data;
    //必填项
    if (!dataPerson.length) {
      $Message({
        content: '请选择操作人',
        type: 'error'
      });
    } else if (!drug.length) {
      $Message({
        content: '请添加药剂',
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
      //药剂用量必选
      this.btnshow = true;
      drug.map((item, index) => {
        //let inputtest = /^(?=[\d.]{1,4})[1-9]\d{0,4}(\.\d\d)?$/;
        let inputtest = /^\d{1,10}(\.\d{1,2})?$/;
        if (item.operation_num == '') {
          $Message({
            content: '请输入药剂用量',
            type: 'error'
          });
          this.btnshow = false;
        } else if (!inputtest.test(item.operation_num)) {
          $Message({
            content: '药剂用量小数点前十位后面两位',
            type: 'error'
          });
          this.btnshow = false;
        }
      })
      if (this.btnshow) {
        let operation = []
        drug.map((item, index) => {
          operation.push({ 'operation_id': item.operation_id, 'operation_num': item.operation_num, 'unit': item.unit, 'medicineId': item.disease })
        })
        let newdata = {
          "sIds": staffid,
          "groupId": this.groupid,
          "operation_time": date,
          "weather": weather,
          "operation_type": "3",
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
                      delta:1
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
          $request({
            url: app.globalData.serverFarm +"farm/addFarm", method: "POST",
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
      wx.hideLoading()
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
  //获取旧的数据
  getolddata(foId) {
    $request({
      url: app.globalData.serverFarm + 'farm/findFarmByfoIdToUpdate',
      method: "POST",
      type: 'form',
      params: {
        foId: foId
      }
    }).then(result => {
      wx.hideLoading()
      if (result.data.resultCode == 0) {
        let dataDisease = [];//疾病
        let diseasearr = [];//疾病数组
        let drug = [];//药品
        let dataDrug = [];
        result.data.data.data.map(item => {
          dataDisease.push(item.drug_name)
          diseasearr.push({
            'dcName': item.drug_name,
            'dcId': item.medicineId
          })
          drug.push({
            name: `${item.drug_name}-${item.operation_name}`,
            operation_id: item.operation_id,
            operation_num: item.operation_num,
            unit: item.unit,
            disease: item.medicineId
          })
          dataDrug.push(`${item.drug_name}-${item.operation_name}`)
        })
        //数组去重
        let dataDiseases = Array.from(new Set(dataDisease));
        //对象去重
        let allArr = [];//新数组
        for (var i = 0; i < diseasearr.length; i++) {
          var flag = true;
          for (var j = 0; j < allArr.length; j++) {
            if (diseasearr[i].id == allArr[j].id) {
              flag = false;
            };
          };
          if (flag) {
            allArr.push(diseasearr[i]);
          };
        };

        this.setData({
          dataPerson: Object.values(result.data.data.staff),
          personstring: Object.values(result.data.data.staff).toString(),
          weather: result.data.data.weather,
          explanation: result.data.data.explanation,
          operation_time: result.data.data.operation_time,
          groupId: result.data.data.groupId,
          dataDisease: dataDiseases,
          diseasearr: allArr,
          drug: drug,
          dataDrug: dataDrug,
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
        title: '编辑药品投放'
      })
      //获取以前数据
      this.getolddata(options.foId);
    } else {
      let newlist = this.data.dataPerson.toString();
      this.groupid = options.groupid;
      this.setData({
        personstring: newlist
      });
    }
    //获取城市天气
    this.getWeather(options.lat, options.lon);  
    //获取员工列表
    this.getstaff();
    //获取疾病列表
    this.getlistDisease();

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