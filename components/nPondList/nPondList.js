// components/nPondList/nPondList.js
const { $Toast } = require('../../dist1/base/index');
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    ballBottom: 30,
    ballRight: 20,
    screenHeight: 0,  
    screenWidth: 0,
    show: 0,
    isshow: false,
    count: '',
    newgroupid: null,
    array:null,
    array: [
      {
        groupid: '',
        area: '',
        farmingMode: '',
        dcName: '',
        tangling: '',
        groupname: '',
        address: ''
      }
    ],
    devicecount: null

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 百叶窗
    togglefunc: function (event) {
      let groupid = event.currentTarget.dataset.groupid;
      var index = event.currentTarget.dataset.index;
      // console.log(index, this.data.show);
      if (this.data.show === index) {
        this.setData({
          show: false
        })
      } else {
        this.setData({
          show: index
        })
      }
      //获取对应塘口的设备总数
      this.getdevicecount(groupid)

    },
    // modifyPond: function (event) {
    //   let id = event.currentTarget.dataset.id;
    //   console.log(id);
    //   wx.navigateTo({
    //     url: '../modifyPond/modifyPond?groupid=' + id
    //   })

    // },
    // 打开提示
    // show: function (event) {
    //   let id = event.currentTarget.dataset.id;
    //   console.log(id);
    //   wx.navigateTo({
    //     url: '../addDevice/addDevice?groupid=' + id,
    //   })
    // },
    //添加设备二维码
    scanCode() {
      let that = this
      console.log(that)
      wx.scanCode({
        success: (res) => {
          console.log(res.result)
          wx.getStorage({
            key: 'token',
            success(res1) {
              wx.request({
                url:  app.globalData.serverLKJ +'device2/selectDevice',
                data: {
                  "deviceCode": res.result,
                  token: res1.data
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                success(res3) {
                  console.log(res3.data)
                if (res3.data.resultCode == 0) {
                    res3.data.data.text = "添加"
                    res3.data.data.from = "塘口添加设备"
                    let param = JSON.stringify(res3.data.data)
                    wx.navigateTo({
                      url: '../add/add?param=' + param
                    })
                  } else {
                    $Toast({
                      content: '1111',
                      type: 'error'
                    });
                  }
                }
              })
            }
          })
        },
        fail: (err) => {
          // $Toast({
          //   content: err,
          //   type: 'error'
          // });
        }
      })
    },
    /*关注塘口按钮*/
    focusFunc: function (event) {
      this.groupId = event.currentTarget.dataset.groupid;
      let newarr = this.data.array;
      for (let i in newarr) {
        if (newarr[i].groupid == this.groupId) {
          this.iscare = newarr[i].iscare == 0 ? 1 : 0
          // this.iscare = newarr[index]['iscare']
        }
      }
      console.log(this.iscare);
      wx.request({
        url:  app.globalData.serverHYH+'updateisCare',
        header: {
          'Cookie': 'JSESSIONID=' + this.sessionId
        },
        data: {
          "token": this.token,
          "groupid": this.groupId,
          "iscare": this.iscare
        },
        success: (result) => {
          console.log('关注按钮', result.data);
          wx.request({
            url:  app.globalData.serverHYH+'QueryGroupgudingInfoKey',
            data: {
              "token": this.token
            },
            header: {
              'content-dcName': 'application/json' // 默认值
            },
            success: (res) => {
              console.log(res.data.data)
              if (this.iscare == 0) {
                $Toast({
                  content: '关注成功',
                  type: 'success'
                });
              } else {
                $Toast({
                  content: '取消关注',
                  type: 'success'
                });
              }
              this.updata = true;
              this.setData({
                array: res.data.data
              })
            }
          });
        },
        fail: function ({
          errMsg
        }) {
          $Toast({
            content: errMsg,
            type: 'error'
          });
          console.log('request fail', errMsg)
        }
      })
    },
    // 获取已添加设备数量
    getdevicecount(groupid) {
      let groupids = '[' + groupid + ']'
      wx.request({
        url:  app.globalData.serverLKJ +'device2/selectTangkouDevice',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          "token": this.token,
          groupIds: groupids
        },

        success: (res) => {
          if (res.data.resultCode == 0) {
            this.setData({
              devicecount: res.data.data[0].count
            })
            console.log(this.data.devicecount);
          } else if (res.data.resultCode == '0013'){
            wx.clearStorage();
            $Toast({
              content: '登录过期',
              type: 'error'
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '../login/login'
              })
            }, 500)
          }
        }
      })
    }
    
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.token = wx.getStorageSync('token');
      $Toast({
        content: '加载中',
        type: 'loading',
        duration: 0,
      });
      //获取塘口列表
      wx.request({
        url:  app.globalData.serverHYH+'QueryGroupgudingInfoKey',
        method:'POST',
        data: {
          "token": this.token
        },
        header: {
          'content-dcName': 'application/json' // 默认值
        },
        success: (res) => {
          console.log(res.data);
          $Toast.hide();
          this.updata = true;
          let resData = res.data.data;
          if (resData.length !== 0) {
            this.setData({
              noPond: '',
              array: res.data.data,
              newgroupid: res.data.data[0].groupid
            }, function () {
              $Toast.hide();
            })
            this.getdevicecount(this.data.newgroupid)
          } else {
            this.setData({
              noPond: '暂未添加塘口',
              array: null,
            })
          }
        }
      });

      //获取屏幕宽高
      var _this = this;
      wx.getSystemInfo({
        success: function (res) {
          _this.setData({
            screenHeight: res.windowHeight,
            screenWidth: res.windowWidth,
          });
        }
      });
      

    },

    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
