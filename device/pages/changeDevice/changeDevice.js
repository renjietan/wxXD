// pages/changeDevice/changeDevice.js
import Notify from '../../../dist/notify/notify';
const {
  $Toast
} = require('../../../dist1/base/index');
const app = getApp(); Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceCode: '',
    deviceId: '',
    groupId: '',
    groupName: '',
    deleteShow: false,
    deleteButtons: [{
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ]
  },
  onClose(event) {
    this.setData({
      deleteShow: false
    })
  },

  btnClick(e) {
    console.log(e)
    let that = this
    let name = e.target.dataset.name
    let deviceCode = e.target.dataset.devicecode
    let deviceId = e.target.dataset.deviceid
    let groupId = e.target.dataset.groupid
    let groupName = e.target.dataset.groupname
    if (name == '查看' || name == '编辑') {
      wx.request({
        url:  app.globalData.serverLKJ +'device2/selectDeviceToUpdate',
        data: {
          "deviceCode": deviceCode,
          "token": that.data.token
          // "token": "32b4e8c261bbfa74049561cd974b1011"
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success(res) {
          console.log(res.data)
          if (res.data.resultCode == 0) {
            res.data.data.text = name
            res.data.data.groupname = groupName
            res.data.data.groupid = groupId
            res.data.data.from = "编辑"
            console.log(res.data.data)
            let param = JSON.stringify(res.data.data)
            if (name == "编辑") {
              wx.redirectTo({
                url: '../add/add?param=' + param
              })

            } else {
              wx.navigateTo({
                url: '../seeDevice/seeDevice?param=' + param
              })
            }
          } else if (res.data.resultCode == 13) {
            $Toast({
              content: "登陆过期",
              type: 'error'
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '../../../pages/login/login',
              })
            }, 2000)
          } else {
            $Toast({
              content: res.data.resultDesc,
              type: 'warning'
            });
          }
        }
      })
    } else if (name == '删除') {
      that.setData({
        deviceCode: deviceCode,
        deviceId: deviceId,
        groupId: groupId,
        deleteShow: true
      })
    }
  },
  //确认删除
  confirm(options) {
    console.log(options)
    let that = this
    console.log(this.data.devicekCode)
    let deviceCode = this.data.deviceCode
    let deviceId = this.data.deviceId
    let groupId = this.data.groupId
    if (options.detail.index === 0) {
      this.setData({
        deleteShow: false
      });
    } else {
      const action = [...this.data.deleteButtons];
      action[1].loading = true;
      this.setData({
        deleteButtons: action
      });
      wx.request({
        url:  app.globalData.serverLKJ +'device2/deleteDevice',
        data: {
          "deviceId": deviceId, //设备编码
          "groupId": groupId, //塘口id
          "token": that.data.token
          //"token": "32b4e8c261bbfa74049561cd974b1011"
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success(res) {
          console.log(res.data)
          if (res.data.resultCode == 0) {
            action[1].loading = false;
            that.setData({
              deleteShow: false,
              deleteButtons: action
            });
            $Toast({
              content: '删除成功',
              type: 'success',
              duration: 2
            });
            that.getDevice()
          } else if (res.data.resultCode == 13) {
            $Toast({
              content: "登陆过期",
              type: 'error'
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '../../../pages/login/login',
              })
            }, 2000)
          } else {

          }

        }
      })
    }
  },
  //塘口数据
  getgroup() {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'token',
        success: function(res1) {
          wx.request({
            url:  app.globalData.serverHYH+'QueryAllGroupInfo',
            data: {
              "token": res1.data,
              // "token": "32b4e8c261bbfa74049561cd974b1011"
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success(res) {
              let d = res.data
              if (d.resultCode == "0") {
                resolve(d)
              } else if (d.resultCode == "0013") {
                $Toast({
                  content: "登陆过期",
                  type: 'error'
                });
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../../../pages/login/login',
                  })
                }, 2000)
              } else {
                reject(d)
              }
            },
            error(err) {
              reject(err)
            }
          })
        }
      })
    })
  },
  //设备数据
  getDevice() {
    let that = this
    that.getgroup().then(res => {
      console.log(res)
      let arr = res.data
      wx.request({
        url:  app.globalData.serverLKJ +'device2/selectTangkouDeviceByUserId',
        data: {
          "token": that.data.token
          // "token": "32b4e8c261bbfa74049561cd974b1011"
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success(res) {
          console.log(res.data)
          if (res.data.resultCode == 0) {
            let pond = res.data.data
            for (let i = 0; i < pond.length; i++) {
              for (let j = 0; j < arr.length; j++) {
                if (pond[i].groupId == arr[j].groupid) {
                  pond[i].groupName = arr[j].groupname
                } else {}
              }
              if (pond[i].groupId == "-1") {
                pond[i].groupName = "未分组"
              }
            }
            console.log(pond)
            that.setData({
              pond: pond
            })
          } else if (res.data.resultCode == 13) {
            $Toast({
              content: "登陆过期",
              type: 'error'
            });
            setTimeout(()=>{
              wx.reLaunch({
                url: '../../../pages/login/login',
              })
            },2000)
          } else {
            $Toast({
              content: d.value,
              type: 'error'
            });
          }
        }
      })
    }).catch(err => {

      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    console.log('show')
    let that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        console.log(res.data)
        that.setData({
          token: res.data
        })
        console.log('show')
        that.getDevice()
      }
    })
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