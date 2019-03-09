  // pages/use/use.js
const { $Toast } = require('../../dist1/base/index');
const app = getApp(); Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  skip:function(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  goTo:function(){
    let param = {
      id: 1,
      from: "正式使用页面添加塘口"
    }
    wx.navigateTo({
      url: '../../pond/pages/addPond/addPond?param=' + JSON.stringify(param)
    })
  },
 
  //添加设备二维码
  scanCode(event) {
    // console.log(this.data.array)
    console.log(event)
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
                console.log(res3)
                if (res3.data.resultCode == 0) {
                  res3.data.data.text = "添加"
                  res3.data.data.from = "首页添加设备"
                  res3.data.data.groupId = groupId
                  res3.data.data.groupname = groupname
                  let param = JSON.stringify(res3.data.data)
                  wx.navigateTo({
                    url: '../../device/pages/add/add?param=' + param
                  })
                } else if (res3.data.resultCode == '0013'){
                  wx.clearStorage();
                  $Toast({
                    content: '登录超时',
                    type: 'error'
                  });
                  setTimeout(() => {
                    wx.reLaunch({
                      url: '../login/login'
                    })
                  }, 500)}else{
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
  }

})