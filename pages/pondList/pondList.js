// pages/pondList/pondList.js
const {
  $Toast
} = require('../../dist1/base/index');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',
    ballBottom: 30,
    ballRight: 20,
    screenHeight: 0,
    screenWidth: 0,
    show: 0,
    isshow: false,
    count: '',
    newgroupid: null,
    array: null,
    devicecount: 0,
    noPond: '',
    allPond:'0',
    visible: false,
    actions: [
      {
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ],
    groupid:''
  },

  // 百叶窗效果
  togglefunc: function(event) {
    // console.log('百叶窗', event.currentTarget.dataset.index);
    this.devicegroupid = event.currentTarget.dataset.groupid;
    var index = event.currentTarget.dataset.index;
    console.log(index, this.data.show);
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
    this.getdevicecount(this.devicegroupid)

  },
  // 修改塘口
  modifyPond: function(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pond/pages/modifyPond/modifyPond?groupid=' + id
    })

  },

  //打开提示
  show: function(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../device/pages/addDevice/addDevice?groupid=' + id,
    })
  },

  //添加设备二维码
  scanCode(event) {
    this.isFromScan = true //防止触发onshow，onhide
    // console.log(this.data.array)
    let groupId = event.currentTarget.dataset.id;
    let groupname = event.currentTarget.dataset.groupname;
    let that = this
    //console.log(that)
    wx.scanCode({
      success: (res) => {
        wx.getStorage({
          key: 'token',
          success(res1) {
            wx.request({
              url: app.globalData.serverLKJ + 'device2/selectDevice',
              data: {
                "deviceCode": res.result,
                token: res1.data
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success(res3) {
                if (res3.data.resultCode == 0) {
                  res3.data.data.text = "添加"
                  res3.data.data.from = "塘口添加设备"
                  res3.data.data.groupId = groupId
                  res3.data.data.groupname = groupname
                  let param = JSON.stringify(res3.data.data)
                  wx.navigateTo({
                    url: '../../device/pages/add/add?param=' + param
                  })
                } else {
                  $Toast({
                    content: res3.data.resultDesc,
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
  focusFunc: function(event) {
    this.groupId = event.currentTarget.dataset.groupid;
    let newarr = this.data.array;
    for (let i in newarr) {
      if (newarr[i].groupid == this.groupId) {
        this.iscare = newarr[i].iscare == 0 ? 1 : 0
        // this.iscare = newarr[index]['iscare']
      }
    }

    wx.request({
      url: app.globalData.serverHYH + 'updateisCare',
      header: {
        'Cookie': 'JSESSIONID=' + this.sessionId
      },
      data: {
        "token": this.token,
        "groupid": this.groupId,
        "iscare": this.iscare
      },
      success: (result) => {
        // console.log('关注按钮', result.data);
        wx.request({
          url: app.globalData.serverHYH + 'QueryAllGroupInfo',
          data: {
            "token": this.token
          },
          header: {
            'content-dcName': 'application/json' // 默认值
          },
          success: (res) => {
            console.log(res.data.data);
            
            this.setData({
              show: false
            })
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
            if (result.data.resultCode == 0) {
              this.setData({
                array: res.data.data
              })
            } else if (result.data.resultCode == '0013') {
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
            } else {
              $Toast({
                content: result.data.value,
                type: 'error'
              });
            }
            this.updata = true;

          }
        });
      },
      fail: function({
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

  ballMoveEvent: function(e) {
    var touchs = e.touches[0];
    var pageX = touchs.pageX;
    var pageY = touchs.pageY;

    //防止坐标越界,view宽高的一般
    if (pageX < 30) return;
    if (pageX > this.data.screenWidth - 30) return;
    if (this.data.screenHeight - pageY <= 30) return;
    if (pageY <= 30) return;
    //这里用right和bottom.所以需要将pageX pageY转换
    var x = this.data.screenWidth - pageX - 30;
    var y = this.data.screenHeight - pageY - 30;

    this.setData({
      ballBottom: y,
      ballRight: x
    });
  },

  // 添加塘口
  ballClickEvent: function() {
    let param = {
      id: 1,
      from: "塘口添加塘口"
    }
    wx.navigateTo({
      url: '../../pond/pages/addPond/addPond?param=' + JSON.stringify(param)
    })

  },

  // 删除塘口
  // handleDelete:function(event){
  //   console.log(event)
  //   this.delgroupid = event.currentTarget.dataset.groupid;
  //   console.log('groupid', this.delgroupid);
  //   this.setData({
  //     visible: true
  //   })
  // },
  // 点击Model选项
  handleClick({ detail }) {
    console.log(detail)
    if (detail.index === 0) {
      this.setData({
        visible: false
      });
    } else {
      const action = [...this.data.actions];
      action[1].loading = true;
      console.log(action[1])
      this.setData({
        actions: action
      });

      wx.request({
        url: app.globalData.serverHYH + 'deleteGroupInfo',
        data: {
          "token": this.token,
          "groupid": this.delgroupid
        },
        success: (res) => {
          if (res.data.resultCode == 0) {
            action[1].loading = false;
            this.setData({
              visible: false,
              actions: action
            }, () => {
              setTimeout(function () {
                $Toast({
                  content: '删除成功',
                  type: 'success'
                });
              }, 500)

            });
            this.getList()
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
              content: res.data.value,
              type: 'error'
            });
          }
        }, fail: (res) => {
          $Toast({
            content: res,
            type: 'error'
          });
        }
      })

    }
  },

  // 获取已添加设备数量
  getdevicecount(groupid) {
    let groupids = '[' + groupid + ']'
    wx.request({
      url: app.globalData.serverLKJ + 'device2/selectTangkouDevice',
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
        } else if (res.data.resultCode == '0013') {
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
        } else {
          $Toast({
            content: res.data.resultDesc,
            type: 'error'
          });
        }
      }
    })
  },
  getList(){
    wx.request({
      url: app.globalData.serverHYH + 'QueryAllGroupInfo',
      data: {
        "token": this.token
      },
      header: {
        'content-dcName': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.resultCode == 0) {
          this.setData({
            allPond: res.data.data.length,

          })
          for (var i = 0; i < res.data.data.length; i++) {
            var item = res.data.data[i];
            if (item.city == '省直辖县级行政区划') {
              item.city = ''
            }
          }
          $Toast.hide();
          this.updata = true;
          let resData = res.data.data;
          console.log(resData)
          if (resData.length !== 0) {
            this.setData({
              noPond: '',
              array: res.data.data,
            })

            if (this.data.show || this.data.show === 0) {
              console.log(this.data.show)
              this.setData({
                newgroupid: res.data.data[this.data.show].groupid
              })
              this.getdevicecount(this.data.newgroupid)
            }
          } else {
            this.setData({
              noPond: '暂未添加塘口',
              array: null,
            })
          }
        } else if (res.data.resultCode == '0013') {
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

        } else {
          $Toast({
            content: res.data.value,
            type: 'error'
          });
        }
      }
    });
  },
  onLoad: function(options) {
    //获取token
    this.token = wx.getStorageSync('token');
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    //获取塘口列表
    wx.request({
      url: app.globalData.serverHYH + 'QueryAllGroupInfo',
      data: {
        "token": this.token
      },
      header: {
        'content-dcName': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data.data)
        // let res = res.data.data;
       
        if (res.data.resultCode == 0) {
          this.setData({
            allPond: res.data.data.length
          })
          for (var i = 0; i < res.data.data.length; i++) {
            var item = res.data.data[i];
            if (item.city == '省直辖县级行政区划') {
              item.city = ''
            }
          }
          $Toast.hide();
          this.updata = true;
          let resData = res.data.data;
          // console.log(resData)
          // for(var i = 0;i<resData.length;i++){
          //   var item = resData[i];
          //   if(item.address=='null'){
          //     item.address=''
          //   }
          // }
          // console.log(resData)
          if (resData.length !== 0) {
            this.setData({              
              noPond: '',
              array: res.data.data,
              newgroupid: res.data.data[0].groupid
            }, function() {
              $Toast.hide();
            })
            this.getdevicecount(this.data.newgroupid)
          } else {
            this.setData({
              noPond: '暂未添加塘口',
              array: null,
            })
          }
        } else if (res.data.resultCode == '0013') {
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

        } else {
          $Toast({
            content: res.data.value,
            type: 'error'
          });
        }
      }
    });

    //获取屏幕宽高
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },
  onShow: function() {
    if (this.isFromScan) {
      this.isFromScan = false;
      return
    }
    if (this.updata) {
      $Toast({
        content: '加载中',
        type: 'loading',
        duration: 0,
      });
      console.log('onShow');
      let that = this;
      //获取塘口列表
      this.getList();
      
    }
  }
})