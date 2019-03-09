// pages/add/add.js
const {
  $Toast
} = require('../../../dist1/base/index');

const app = getApp(); Page({

  /**
   * 页面的初始数据
   */
  data: {
    note: "", //
    noteShow: false,
    buttonClicked: false,
    param: {
      deviceId: '', //设备id
      groupname: "", //塘口名称
      // deviceName: "", //设备名称
      device_type_name: "", //设备类型
      deviceCode: "", //设备编码
      supplier: "", //生产厂家
      model: "", //设备型号
      longitude: "", //经度
      latitude: "", //纬度
    },
    // pondShow: false, //塘口右拉
    // pondActions: [{name:"塘口一"},{name: "塘口二"}],
    typeShow: false, //设备类型下拉
    typeActions: [{
      name: "类型一"
    }, {
      name: "类型二"
    }]
  },
  changeIn(e) {
    let that = this
    let key = e.currentTarget.dataset.name
    console.log(e)
    this.setData({
      ['param.' + key]: e.detail
    })
  },
  //点击塘口
  pondClick(e) {
    let that = this
    app.globalData.urlParam = "add"
    wx.redirectTo({
      url: '../choosePond/choosePond?param=' + JSON.stringify(that.data.param)
    })
  },
  //点击设备类型
  typeClick(e) {
    this.setData({
      typeShow: true
    });
  },
  onClose() {
    this.setData({
      typeShow: false
    });
  },
  //下一步
  next() {
    let that = this
    console.log(that.data.buttonClicked)
    let param = that.data.param
    if(that.data.buttonClicked){return}
    console.log(param)
    if (param.hasOwnProperty("groupId") || param.hasOwnProperty("groupid")) {
      wx.redirectTo({
        url: '../addEnd/addEnd?param=' + JSON.stringify(param)
      })
      console.log('跳转')
    } else {
      $Toast({
        content: '请选择塘口',
        type: 'warning'
      });
    }
    app.buttonClicked(that);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    // console.log(Object.keys(options))
    if (options && Object.keys(options).length <= 0) {
      return
    }
    let that = this
    let param = JSON.parse(options.param)
    if (param.text == "编辑") {
      that.setData({
        param: param,
        note: "",
        noteShow: true
      })
      wx.setNavigationBarTitle({
        title: '编辑设备'
      })
    } else if (param.text == "添加") {
      that.setData({
        param: param,
        note: "本页面进行设备的添加工作，选好塘口名称后，即可在本塘口查看设备的数据"
      })
      wx.getLocation({
        success(res) {
          that.setData({
            ['param.latitude']: res.latitude,
            ['param.longitude']: res.longitude
          })
        },
        fail(err) {
          that.setData({
            ['param.latitude']: 0,
            ['param.longitude']: 0
          })
        }
      })
      
      wx.setNavigationBarTitle({
        title: '添加设备'
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