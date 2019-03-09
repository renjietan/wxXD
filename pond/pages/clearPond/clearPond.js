// pages/clearPond/clearPond.js
const { $Toast } = require('../../../dist1/base/index');

const app = getApp(); Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
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
  },
  onLoad: function (e) {
    //获取token
    this.token = wx.getStorageSync('token');
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
    });
    this.getList()
  },
  getList() {
    wx.request({
      url:  app.globalData.serverHYH+'QueryAllGroupInfo',
      data: {
        "token": this.token
      },
      header: {
        'content-dcName': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.resultCode == 0){
          var newArray = [];
          for (let i = 0; i < res.data.data.length; i++) {
            newArray.push({
              'name': res.data.data[i].groupname,
              'id': res.data.data[i].groupid
            })
          }
          this.setData({
            items: newArray
          },function(){
            $Toast.hide();
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
    })
  },

  //点击删除
  clearPond: function (event) {
    this.delgroupid = event.currentTarget.dataset.groupid;
    // console.log('groupid', this.delgroupid);
    this.setData({
      visible: true
    })
  },
  //点击model选项
  handleClick({ detail }) {
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
        url:  app.globalData.serverHYH+'deleteGroupInfo',
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
              setTimeout(function(){
                $Toast({
                  content: '删除成功',
                  type: 'success'
                });
              },500)
              
            });
            this.getList()
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
        } ,fail: (res) => {
          $Toast({
            content: res,
            type: 'error'
          });
        }
      })

    }
  }

})