// farmingCarlendar/pages/addWorker/addWorker.js
import Toast from '../../../dist/toast/toast';
import Notify from '../../../dist/notify/notify';
// import {
//   addressList
// } from '../../../utils/area';
import {
  $request,
  $parseArray
} from "../../../utils/util.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    groupListInfo: "",
    tableHead: [
      "塘口名称",
      "面积",
      "品种",
      "养殖模式",
      "塘龄",
      "地址"
    ],
    _Url: app.globalData.serverHYH,
    formData: {
      provinces: [], //地址
      area: "", //区域
      farmingMode: "", //养殖模式
      groupname: "", //塘口名称
      tangling: "", //塘龄
      type: "", //品种
      kindName: "", //品种的name
      breedName: "", //养殖模式的name
      address: "",
      groupid: "",
    },
    //品种信息
    KindInfo: {
      isVisiable: false,
      data: null
    },
    address: "",
    //养殖模式信息
    BreedInfo: {
      isVisiable: false,
      data: null
    },
  },
  handleAddressChange(e) {
    this.setData({
      'formData.provinces': e.detail.value
    })
  },
  getAddressList(that) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && !res.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      wx.getLocation({
                        success: function(res) {
                          let params = {
                            location: res.latitude + "," + res.longitude,
                            key: "ADNBZ-6OXKJ-CX2FZ-FQZGV-DHMOT-V5B4L"
                          }
                          $request({
                            url: "https://apis.map.qq.com/ws/geocoder/v1/",
                            params: params,
                            method: 'GET'
                          }).then(res => {
                            let addressList = res.data.result.address_component
                            that.setData({
                              'formData.provinces': [addressList.province, addressList.city, addressList.district]
                            })
                          })
                        },
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          wx.getLocation({
            success: function(res) {
              let params = {
                location: res.latitude + "," + res.longitude,
                key: "ADNBZ-6OXKJ-CX2FZ-FQZGV-DHMOT-V5B4L"
              }
              $request({
                url: "https://apis.map.qq.com/ws/geocoder/v1/",
                params: params,
                method: 'GET'
              }).then(res => {
                let addressList = res.data.result.address_component
                that.setData({
                  'formData.provinces': [addressList.province, addressList.city, addressList.district]
                })
              })
            },
          })
        } else {
          wx.getLocation({
            success: function(res) {
              let params = {
                location: res.latitude + "," + res.longitude,
                key: "ADNBZ-6OXKJ-CX2FZ-FQZGV-DHMOT-V5B4L"
              }
              $request({
                url: "https://apis.map.qq.com/ws/geocoder/v1/",
                params: params,
                method: 'GET'
              }).then(res => {
                let addressList = res.data.result.address_component
                that.setData({
                  'formData.provinces': [addressList.province, addressList.city, addressList.district]
                })
              })
            },
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    let params = options.groupInfo.indexOf("groupid") > -1? JSON.parse(options.groupInfo) : {}
    console.log(params)
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    let kindInfo = $request({
      url: that.data._Url + "Querydictionarycontent",
      method: "GET"
    });
    let breedInfo = $request({
      url: that.data._Url + "Querydymodel",
      method: "GET"
    });
    let groupListInfo = $request({
      url: that.data._Url + "QueryAllGroupInfo",
      method: "GET"
    });
    wx.setNavigationBarTitle({
      title: params.groupid ? "塘口编辑" : "塘口添加",
      success: () => {
        Promise.all([kindInfo, breedInfo, groupListInfo]).then(result => {
          setTimeout(function() {
            let KindInfo = result[0].data.data.map(item => {
              item.name = item.dcname
              return item
            })
            let BreedInfo = result[1].data.data.map(item => {
              item.name = item.dcname
              return item
            })
            let GroupInfo = result[2].data.data.map(item => {
              item.isChecked = false
              return item
            })
            if (!params.groupid) {
              that.setData({
                'KindInfo.data': KindInfo,
                'BreedInfo.data': BreedInfo,
                "groupListInfo": GroupInfo,
                'formData.type': KindInfo[0].dcid,
                'formData.kindName': KindInfo[0].dcname,
                'formData.farmingMode': BreedInfo[1].dcid,
                'formData.breedName': BreedInfo[1].dcname,
                'formData.provinces': ['湖北省','省直辖县级行政区划',"潜江市"],
              })
              // that.getAddressList(that)
            } else {
              wx.setNavigationBarTitle({
                title: '塘口编辑',
                success:() => {
                  that.setData({
                    'KindInfo.data': KindInfo,
                    'BreedInfo.data': BreedInfo,
                    "groupListInfo": GroupInfo,

                    'formData.provinces': [params.province, params.city, params.county],
                    'formData.area': params.area,
                    'formData.breedName': params.farmingMode,
                    'formData.farmingMode': params.dcId1,
                    'formData.groupname': params.groupname,
                    'formData.kindName': params.dcName,
                    'formData.tangling': params.tangling,
                    'formData.groupid': params.groupid,
                    'formData.address': params.address,
                    'formData.type': params.dcId,
                  })
                }
              })

            }
            Toast.clear()
          }, 600)
        }).catch(error => {
          Toast.clear()
        })
      }
    })
  },
  isOpenKind() {
    this.setData({
      'KindInfo.isVisiable': !this.data.KindInfo.isVisiable
    })
  },
  isOpenBreed() {
    this.setData({
      'BreedInfo.isVisiable': !this.data.BreedInfo.isVisiable
    })
  },
  getAddress(e) {
    let _addressList = e.detail.detail
    this.setData({
      'addressList.isVisiable': false,
      'formData.provinces': _addressList.province + " " + _addressList.city + " " + _addressList.county
    })
  },
  handleTextChange(e) {
    let key = 'formData'.concat('.', e.currentTarget.id)
    this.setData({
      [key]: e.detail
    })
  },
  handleChangeKind(e) {
    this.setData({
      'formData.type': e.detail.dcid,
      'formData.kindName': e.detail.dcname,
      'KindInfo.isVisiable': false
    })
  },
  handleChangeBreed(e) {
    this.setData({
      'formData.farmingMode': e.detail.dcid,
      'formData.breedName': e.detail.dcname,
      'BreedInfo.isVisiable': false
    })
  },
  handleReset() {
    let that = this
    // this.getAddressList(that)
    this.setData({
      formData: {
        area: "", //区域
        farmingMode: this.data.BreedInfo.data[0].dcid, //养殖模式
        groupname: "", //塘口名称
        tangling: "", //塘龄
        type: this.data.KindInfo.data[0].dcid, //品种
        kindName: this.data.KindInfo.data[0].dcname, //品种名称
        breedName: this.data.BreedInfo.data[0].dcname, //养殖模式名称
        groupid: "",
        address: "",
        provinces: ['湖北省', '省直辖县级行政区划', "潜江市"]
      }
    })
  },
  handleTdClick(e) {
    let index = e.currentTarget.dataset.name
    let groupList = this.data.groupListInfo
    for (var i in groupList) {
      i == index ? groupList[i].isChecked = !groupList[i].isChecked : groupList[i].isChecked = false
    }
    let getSelectGroup = groupList[index]
    this.setData({
      'formData.provinces': [getSelectGroup.province, getSelectGroup.city, getSelectGroup.county],
      'formData.area': getSelectGroup.area,
      'formData.breedName': getSelectGroup.farmingMode,
      'formData.farmingMode': getSelectGroup.dcId1,
      'formData.groupname': getSelectGroup.groupname,
      'formData.kindName': getSelectGroup.dcName,
      'formData.tangling': getSelectGroup.tangling,
      'formData.groupid': getSelectGroup.groupid,
      'formData.address': getSelectGroup.address,
      'formData.type': getSelectGroup.dcId,
      'groupListInfo': groupList
    })
  },
  // http://192.168.3.189:11110/deleteGroupInfo
  handleDelete(e) {
    let index = e.currentTarget.dataset.name
    let that = this
    Toast.loading({
      mask: true,
      message: "加载中...",
      duration: 0
    })
    let formData = this.data.formData
    $request({
      url: that.data._Url + "deleteGroupInfo",
      type: "form",
      params: {
        "groupid": that.data.groupListInfo[index].groupid
      }
    }).then(res => {
      if (res.data.resultCode == "0") {
        if (formData.groupid == that.data.groupListInfo[index].groupid) {
          this.handleReset()
        }
        return $request({
          url: that.data._Url + "QueryAllGroupInfo",
          method: "GET"
        })
      } else {
        setTimeout(function() {
          Toast.clear();
          setTimeout(function() {
            Toast.fail("操作失败")
          }, 600)
        }, 600)
      }
    }).then(result => {
      setTimeout(function() {
        if (result.data.resultCode == "0") {
          setTimeout(function() {
            Toast.clear();
            setTimeout(function() {
              that.setData({
                groupListInfo: result.data.data
              })
              Toast.success("操作成功")
            }, 600)
          }, 600)
        } else {
          setTimeout(function() {
            Toast.clear();
            setTimeout(function() {
              Toast.fail("操作失败")
            }, 600)
          }, 600)
        }
      }, 600)
    })

  },
  handleSubmit(e) {
    let that = this
    let fd = that.data.formData;
    let tanglingtest = /^(?!0)\d{1,4}$/;
    let areatest = /^\d{1,8}(?:\.\d{1,2})?$/;
    let name = e.currentTarget.dataset.name
    for (let i in fd) {
      if (fd[i] == "" && i != "groupid") {
        Notify("必填项不可为空")
        return false
      } else if (fd[i].length > 20) {
        Notify("字符串长度超出")
        return false
      } else if (i == "tangling" && !tanglingtest.test(fd[i])) {
        Notify('请重新输入塘龄（1-4位正整数)')
        return false
      } else if (i == "area" && !areatest.test(fd[i])) {
        Notify('请重新输入面积（1-8位整数或小数,且小数部分不可超过2位）')
        return false
      }
    }
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    let params = {
      ...that.data.formData
    }
    params.provinces = params.provinces[0] + "-" + params.provinces[1] + "-" + params.provinces[2]
    let url;
    params.groupid == "" ? url = that.data._Url + 'addGroupInfo' : url = that.data._Url + 'updategroupinfo'
    $request({
      url: url,
      params: params,
      method: "POST",
    }).then(res => {
      setTimeout(function () {
        Toast.clear()
        if (res.data.resultCode == "0") {
          setTimeout(function () {
            Toast.success("操作成功")
            setTimeout(function () {
              name != "save2" ? wx.navigateBack({
                delta: 1,
              }) : that.handleReset()
            }, 1000)
          }, 600)
        } else {
          setTimeout(function () {
            Toast.fail("操作失败")
          }, 600)
        }
      }, 600)
    }).catch(error => {
      setTimeout(function() {
        Toast.clear()
      }, 600)
    })
  },

  onReady: function() {
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
  },

  onShow: function() {
    /**
     * 生命周期函数--监听页面显示
     */
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