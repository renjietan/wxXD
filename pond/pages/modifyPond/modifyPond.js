// pages/modifyPond/modifyPond.js
import Notify from '../../../dist/notify/notify';
const { $Toast } = require('../../../dist1/base/index');

const app = getApp(); Page({
  /**
   * 页面的初始数据
   */
  data: {
    param: {
      groupid: '',
      groupname: '', //塘口名称
      area: '', //面积
      dcName: '', //品种名字
      farmingMode: '',//养殖模式名字
      tangling: '', //塘龄
      address: '', //地址
      dcId1: "",//养殖模式Id
      type:'',//品种id
      provinces:[]
    },//参数
    dcnameShow: false, //品种下拉
    loading: false,
    dcnameActions: [],
    breedShow: false, //养殖模式,
    breedActions: [],
  },
  dcnameClick(e) {
    this.setData({
      dcnameShow: true
    });
  },

  //养殖模式节点事件
  modelClick(e) {
    this.setData({
      breedShow: true
    });
  },

  //品种下拉
  dcnameSelect(event) {
    console.log(event.detail)
    this.setData({     
      dcnameShow: false,
      ['param.dcName']: event.detail.name,
      ['param.type']: event.detail.dcId
    })
  },

  //养殖模式下拉
  breedSelect(event) {
    console.log(event.detail)
    this.setData({
      breedShow: false,
      ['param.farmingMode']: event.detail.name,
      ['param.dcId1']: event.detail.dcid
    })
  },
  onClose() {
    this.setData({
      dcnameShow: false
    });
    this.setData({
      breedShow: false
    });
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'param.provinces': e.detail.value
    })
  },
  onLoad: function (options) {
    //获取token
    this.token = wx.getStorageSync('token');
    let that = this;
    // 养殖模式选项
    wx.request({
      url:  app.globalData.serverHYH+'Querydymodel',
      data: {
        "token": this.token
      },
      header: {
        'content-dcName': 'application/json' // 默认值
      },
      success: (res) => {
        
        if (res.data.resultCode==0){
          var newArray = [];
          for (let i = 0; i < res.data.data.length; i++) {
            newArray.push({ 'name': res.data.data[i].dcname, 'dcid': res.data.data[i].dcid })
          }
          this.setData({
            breedActions: newArray
          })
        } else if (res.data.resultCode == '0013') {
          wx.clearStorage();
          $Toast({
            content: '登录过期',
            type: 'error'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../../../pages/login/login'
            })
          }, 500)
        } else {
          $Toast({
            content: result.data.value,
            type: 'error'
          });
        }
      },
    })
    // 品种选项
    wx.request({
      url:  app.globalData.serverHYH+'Querydictionarycontent',
      data: {
        "token": this.token
      },
      header: {
        'content-dcName': 'application/json' // 默认值
      },
      success: (res) => {
        if(res.data.resultCode==0){
          var newArray = [];
          for (let i = 0; i < res.data.data.length; i++) {
            newArray.push({ 'name': res.data.data[i].dcname, 'dcId': res.data.data[i].dcid })
          }
          this.setData({
            dcnameActions: newArray
          })
        } else if (res.data.resultCode == '0013'){
          wx.clearStorage();
          $Toast({
            content: '登录过期',
            type: 'error'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../../../pages/login/login'
            })
          }, 500)
        } else {
          $Toast({
            content: res.data.value,
            type: 'error'
          });
        }
        
      }
    });

    // 发送id请求并进行修改
    wx.request({
      url:  app.globalData.serverHYH+'QueryGroupInfoKey',
      data: {
        "token": this.token,
        groupid: options.groupid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data)
        if(res.data.resultCode==0){
          let provinces = [res.data.data[0].province, res.data.data[0].city, res.data.data[0].county];
          that.setData({
            param: Object.assign({},res.data.data[0], { 'provinces': provinces}),
            
            
          })
        } else if (res.data.resultCode == '0013'){
          wx.clearStorage();
          $Toast({
            content: '登录过期',
            type: 'error'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../../../pages/login/login'
            })
          }, 500)
        } else {
          $Toast({
            content: '修改失败',
            type: 'warning'
          });
        }
        
      },
    })
  },

  /*input框改变*/
  changeIn: function (event) {
    let name = event.currentTarget.dataset.name;
    console.log(name);
    this.setData({
      ['param.' + name]: event.detail,
    })
    console.log(this.data.param);
  },

  // 修改后提交
  submit: function () {
    // 验证规则
    let { grandname, area, type, farmingMode, tangling, address } = this.data.param;
    // 面积为整数+小数点后面两位
    let areatest = /^(?=[\d.]{1,4})[1-9]\d{0,4}(\.\d\d)?$/;
    // 塘龄只能为整数
    let tanglingtest = /^(?!0)\d{1,8}$|^0$/;

    if (!areatest.test(area)) {
      Notify('请重新输入,面积总长度不超过7位（含2位小数)')
    } else if (!tanglingtest.test(tangling)) {
      Notify('请输入整数的塘龄')
    }else {
      let param = { ...this.data.param };
      if (this.data.dcnameActions.length > 0 && this.data.breedActions.length > 0) {
        wx.request({
          url:  app.globalData.serverHYH+'updategroupinfo',
          data: {
            "token": this.token,
            groupname: param.groupname,
            area: param.area,
            type: param.type,
            farmingMode: param.dcId1,
            tangling: param.tangling,
            address: param.address,
            groupid: param.groupid,
            provinces: param.provinces[0] + '-' + param.provinces[1] + '-' + param.provinces[2]
          },
          method: 'POST',
          header: {
             'content-dcname': 'application/x-www-form-urlencoded'
          },
          success(res) {
            if (res.data.resultCode == '0') {
              $Toast({
                content: '修改成功',
                type: 'success'
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)

            } else if (res.data.resultCode == '0013') {
              wx.clearStorage();
              $Toast({
                content: '登录过期',
                type: 'error'
              });
              setTimeout(() => {
                wx.reLaunch({
                  url: '../../../pages/login/login'
                })
              }, 500)
            } else {
              $Toast({
                content: '修改失败',
                type: 'warning'
              });
            }

          }
        })
      } else {
        return false
      }
    }
  },

})