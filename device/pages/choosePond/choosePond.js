const {
  $Toast
} = require('../../../dist1/base/index');

const app = getApp(); Page({
  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    obj: ["塘口一", "塘口二"],
    param: {}
  },
  //选择塘口
  choose(event) {
    let that = this
    that.data.param.groupname = event.currentTarget.dataset['groupname']
    that.data.param.groupid = event.currentTarget.dataset['groupid']
    // that.data.param.text = "选择塘口"

    let item = JSON.stringify(that.data.param);
    console.log(that.data.param)
    if (that.data.buttonClicked) {
      return
    }
    if(that.data.param.urlParam){
      // wx.redirectTo({
      //   url: '../../../accountBook/pages/' + that.data.param.urlParam + '/' + that.data.param.urlParam+'?param=' + item
      // })
      let pages = getCurrentPages();
      let currPage = null; //当前页面
      let prevPage = null; //上一个页面

      if (pages.length >= 2) {
        currPage = pages[pages.length - 1]; //当前页面
        prevPage = pages[pages.length - 2]; //上一个页面
      }
      if (prevPage) {
        prevPage.setData({
          'groupName': event.currentTarget.dataset['groupname'],
          ['formdata.groupId']: event.currentTarget.dataset['groupid']
        });
      }
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.redirectTo({
        url: '../add/add?param=' + item
      })
    }
    app.buttonClicked(that);
  },
  //添加塘口按钮
  next() {
    let that = this
    let param = JSON.stringify(that.data.param)
    wx.redirectTo({
      url: '../../../pond/pages/addPond/addPond?param=' + param
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    if (options && Object.keys(options).length <= 0) {
      return
    }
    // console.log(options)
    if (options != undefined) {
      let param = JSON.parse(options.param)
      console.log(param)
      that.setData({
        param: param
      })
    }
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
    let that = this
    wx.getStorage({
      key: 'token',
      success: function(res1) {
        wx.request({
          url:  app.globalData.serverHYH+'QueryAllGroupInfo',
          data: {
            "token": res1.data,
            //"token": "32b4e8c261bbfa74049561cd974b1011"
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success(res) {
            console.log(res.data)
            let d = res.data
            if (d.resultCode == "0") {
              that.setData({
                obj: d.data
              })
            }else if(d.resultCode == "0013"){
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
                content: d.value,
                type: 'error'
              });
              setTimeout(() => {
                wx.redirectTo({
                  url: '../add/add?param' + JSON.stringify(that.data.param)
                })
              }, 2000)
            }
          },
          error(err) {
            console.log(err)
          }
        })
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