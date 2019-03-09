// pages/addPond/addPond.js
import Notify from '../../../dist/notify/notify';

const {
  $Toast
} = require('../../../dist1/base/index');

import { $request } from "../../../utils/util.js"
const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    btnloading: false,
    customItem: '全部',
    param: {
      groupname: '', //塘口名称
      area: '', //面积
      type: '', //品种
      farmingMode: '', //养殖模式
      tangling: '', //塘龄
      
     //地址
      provinces: ['湖北省', '省直辖县级行政区划', '潜江市']
      // iscare:''//关注
    }, //参数
    dcnameShow: false, //品种下拉
    dcnameActions: [{
      name: " "
    }, {
      name: " "
    }],
    breedShow: false, //养殖模式,
    breedActions: [{
      name: " "
    }, {
      name: " "
    }],
  },
  bindRegionChange: function (e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'param.provinces': e.detail.value
    })
  },
  // 品种选择
  dcnameClick(e) {
    wx.request({
      url: app.globalData.serverHYH +'Querydictionarycontent',
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
            newArray.push({
              'name': res.data.data[i].dcname
            })
          }
          this.setData({
            dcnameActions: newArray,
            dcnameActions1: res.data.data
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

    this.setData({
      dcnameShow: true
    });

  },
  // 养殖模式选择
  modelClick(e) {
    wx.request({
      url: app.globalData.serverHYH +'Querydymodel',
      data: {
        "token": this.token
      },
      header: {
        'content-dcName': 'application/json' // 默认值
      },
      success: (res) => {
        var newArray = [];
        for (let i = 0; i < res.data.data.length; i++) {
          newArray.push({
            'name': res.data.data[i].dcname
          })
        }
        if (res.data.resultCode ==0){
          this.setData({
            breedActions: newArray,
            breedActions1: res.data.data
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
        
      },
    })
    this.setData({
      breedShow: true
    });
  },
  //品种下拉
  dcnameSelect(event) {
    this.setData({
      dcnameShow: false,
      ['param.type']: event.detail.name
    })
  },
  //养殖模式下拉
  breedSelect(event) {
    this.setData({
      breedShow: false,
      ['param.farmingMode']: event.detail.name
    })
  },
  changeIn(event) {
    let name = event.target.dataset.name
    console.log(name)
    console.log(event.detail)
    this.setData({
      ['param.' + name]: event.detail
    })
  },

  //确定按钮
  submit() {
    let that = this
    let param = this.data.param
    let param1 = this.data.param1
  
    let arr = {
      groupname: "请输入塘口名称",
      area: "请输入面积",
      type: "请输入品种",
      farmingMode: '请选择养殖模式',
      tangling: '请输入塘龄',
      provinces: '请省市区全选',
    }
    for (let i in param) {
      if (param[i] == "") {
        $Toast({
          content: arr[i],
          type: 'warning'
        });
        return
      }
    }
    param.userId = "1"
  
    this.data.dcnameActions1.map(function(d, i) {
      if (d.dcname == param.type) {
        param.type = d.dcid
      }
    })
    this.data.breedActions1.map(function(d, i) {
      if (d.dcname == param.farmingMode) {
        param.farmingMode = d.dcid
      }
    })

    // 验证规则
    let {
      grandname,
      area,
      type,
      farmingMode,
      tangling,
      provinces
    } = this.data.param;
    // 面积为整数+小数点后面两位，总长不超过6位
    let areatest = /^(?=[\d.]{1,4})[1-9]\d{0,4}(\.\d\d)?$/;
    // let areatest = /^[1-9]{0,5}(\.[0-9]{1,2})?$/;
    // 塘龄只能为整数
    let tanglingtest = /^(?!0)\d{1,8}$|^0$/;
    if (!areatest.test(area)) {
      Notify('请重新输入,面积总长度不超过7位（含2位小数)')
    } else if (!tanglingtest.test(tangling)) {
      Notify('请输入整数的塘龄')
    }
    else{
      provinces =provinces[0] + "-" + provinces[1] + "-" +provinces[2];
      let param = Object.assign({}, this.data.param, { 'provinces': provinces});
      console.log(provinces)
      this.setData({
        btnloading: true
      })
      wx.request({
        url: app.globalData.serverHYH +'addGroupInfo',
        data: {
          "token": this.token,
          ...param
        },
        header: {
          'content-dcname': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success:(res)=> {
          console.log(res.data)
          this.setData({
            btnloading: false,
            param: [],
            address:''
          });
          if (res.data.resultCode == '0') {
            $Toast({
              content: '添加成功',
              type: 'success'
            });
            
            setTimeout(() => {
              if (param1.from == "塘口添加塘口") {
                wx.navigateBack({
                  url: '../../../pages/pondList/pondList'
                })
              } else if (param1.from == "正式使用页面添加塘口"){
                wx.redirectTo({
                  url: '../../../pages/use/use'
                })
              } else {
                wx.redirectTo({
                  url: '../../../device/pages/choosePond/choosePond?param='+JSON.stringify(param1)
                })
              }
            }, 2000);
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
              content: '添加失败',
              type: 'warning'
            });
          }
      
        }
      })
    }
    
  },
  onClose() {
    this.setData({
      dcnameShow: false
    });
    this.setData({
      breedShow: false
    });
  },
  // getAddressList() {
  //   wx.getSetting({
  //     success: (res) => {
  //       console.log(res)
  //       if (res.authSetting['scope.userLocation'] != undefined && !res.authSetting['scope.userLocation']) {
  //         wx.showModal({
  //           title: '请求授权当前位置',
  //           content: '需要获取您的地理位置，请确认授权',
  //           success: function (res) {
  //             if (res.cancel) {
  //               wx.showToast({
  //                 title: '拒绝授权',
  //                 icon: 'none',
  //                 duration: 1000
  //               })
  //             } else if (res.confirm) {
  //               wx.openSetting({
  //                 success: function (dataAu) {
  //                   if (dataAu.authSetting["scope.userLocation"] == true) {
  //                     wx.showToast({
  //                       title: '授权成功',
  //                       icon: 'success',
  //                       duration: 1000
  //                     })
  //                     wx.getLocation({
  //                       success: function (res) {
  //                         let params = {
  //                           location: res.latitude + "," + res.longitude,
  //                           key: "ADNBZ-6OXKJ-CX2FZ-FQZGV-DHMOT-V5B4L"
  //                         }
  //                         $request({
  //                           url: "https://apis.map.qq.com/ws/geocoder/v1/",
  //                           params: params,
  //                           method: 'GET'
  //                         }).then(res => {
  //                           let addressList = res.data.result.address_component
  //                           this.setData({
  //                             'param.provinces': [addressList.province, addressList.city, addressList.district]
  //                           })
  //                         })
  //                       },
  //                     })
  //                   } else {
  //                     wx.showToast({
  //                       title: '授权失败',
  //                       icon: 'none',
  //                       duration: 1000
  //                     })
  //                   }
  //                 }
  //               })
  //             }
  //           }
  //         })
        
  //       } else if (res.authSetting['scope.userLocation'] == undefined) {
  //         wx.getLocation({
  //           success: function (res) {
  //             let params = {
  //               location: res.latitude + "," + res.longitude,
  //               key: "ADNBZ-6OXKJ-CX2FZ-FQZGV-DHMOT-V5B4L"
  //             }
  //             $request({
  //               url: "https://apis.map.qq.com/ws/geocoder/v1/",
  //               params: params,
  //               method: 'GET'
  //             }).then(res => {
  //               let addressList = res.data.result.address_component
  //               this.setData({
  //                 'param.provinces': [addressList.province, addressList.city, addressList.district]
  //               })
  //             })
  //           },
  //         })
  //       }
  //       else {
  //         wx.getLocation({
  //           success:  (res)=> {
  //             let params = {
  //               location: res.latitude + "," + res.longitude,
  //               key: "ADNBZ-6OXKJ-CX2FZ-FQZGV-DHMOT-V5B4L"
  //             }
  //             $request({
  //               url: "https://apis.map.qq.com/ws/geocoder/v1/",
  //               params: params,
  //               method: 'GET'
  //             }).then(res => {
  //               let addressList = res.data.result.address_component
  //               this.setData({
  //                 'param.provinces': [addressList.province, addressList.city, addressList.district]
  //               })
  //             })
  //           },
  //         })
  //       }
  //     }
  //   })

  // },
  onLoad: function(options) {
    //获取token
    this.token = wx.getStorageSync('token');
    // this.getAddressList();
    let that = this
    if (options && Object.keys(options).length <= 0) { return }
    if (options != undefined) {
      let param = JSON.parse(options.param)
      that.setData({
        param1: param
      })
    }
  },
  onReady: function () {
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
  },

  onShow: function () {
    /**
     * 生命周期函数--监听页面显示
     */
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


 
