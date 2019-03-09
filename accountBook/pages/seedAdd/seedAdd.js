// accountBook/pages/craylist/craylist.js
import {
  formatData
} from "../../../utils/util.js"
import Toast from '../../../dist/toast/toast';
const {
  $request
} = require('../../../utils/util.js');
const {
  $Message
} = require('../../../dist1/base/index');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    form: {
      amount: "", //苗种价格
      billing_time: "", //账单时间
      kind: "", //种类
      quantity: "", //购买量
      remarks: "", //补充说明
    },
    showKind: false,
    kindName: "",
    show: false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    btnColor: "0",
    unit: ["尾", "斤"],
    actions: [{
        name: '小龙虾',
        id: "1"
      },
      {
        name: '螃蟹',
        id: "2"
      },
      {
        name: '鱼',
        id: "3"
      }
    ]
  },
  //弹出选择
  handleClick(event) {
    console.log(event)
    let name = event.target.dataset.name
    if (name == "farmingMode") {
      this.setData({
        show: true
      })
    } else if (name == "kind") {
      this.setData({
        showKind: true
      })
    }
  },
  //时间点击确定
  onOk(event) {
    // console.log(event.detail)
    let date = new Date(event.detail)
    date = formatData(date)
    this.setData({
      show: false,
      ['form.billing_time']: date
    });
  },
  //时间点击取消
  onNo(event) {
    console.log(event)
    this.setData({
      show: false
    });
  },
  //种类点确定
  onSelect(event) {
    console.log(event.detail)
    this.setData({
      showKind: false,
      ['form.kind']: event.detail.id,
      kindName: event.detail.name
    });
  },
  //种类点取消
  onClose(event) {
    this.setData({
      showKind: false
    });
  },
  //选择单位
  changeColor(event) {
    // console.log(event)
    // console.log(event.target.dataset.bg)
    this.setData({
      btnColor: event.target.dataset.bg,

    });
  },
  //输入框双向绑定
  changeIn(event) {
    let name = event.target.dataset.name
    this.setData({
      ['form.' + name]: event.detail
    })
  },
  changeInn(event) {
    let name = event.target.dataset.name
    this.setData({
      ['form.' + name]: event.detail.value
    })
  },
  //提交
  submit() {
    let {
      amount,
      kind,
      quantity
    } = this.data.form
    let inputtest = /^\d{1,9}(\.\d{1,2})?$/;
    if (amount == "" || amount == null) {
      $Message({
        content: '请输入价格',
        type: 'error'
      });
    } else if (kind == "" || kind == null) {
      $Message({
        content: '请选择种类',
        type: 'error'
      });
    } else if (quantity == "" || quantity == null) {
      $Message({
        content: '请输入购买量',
        type: 'error'
      });
    } else {
      Toast.loading({
        mask: true,
        duration: 0,
        message: '加载中...'
      });
      if (this.data.id) {
        //编辑
        $request({
          url: app.globalData.server9696 + "seed/updSeed",
          type: "form",
          params: Object.assign(this.data.form, {

            unit: this.data.unit[this.data.btnColor]
          })
        }).then(res => {
          console.log(res)
          if (res.data.resultCode == "0") {
            Toast.success("操作成功")
            setTimeout(() => {
              wx.navigateBack({
                url: '../list/list?type=seed',
                delta:1
              })
            }, 2000)
          } else {
            Toast.fail(res.data.resultDesc)
          }
        })
      } else {
        //添加
        console.log(this.data.form)
        $request({
          url: app.globalData.server9696 + "seed/addSeed",
          type: "form",
          params: Object.assign(this.data.form, {

            unit: this.data.unit[this.data.btnColor]
          })
        }).then(res => {
          console.log(res)
          if (res.data.resultCode == "0") {
            Toast.success("操作成功")
            setTimeout(() => {
              wx.navigateBack({
                url: '../list/list?type=seed',
                delta:1
              })
            }, 2000)
          } else { Toast.fail(res.data.resultDesc)}
        })
      }
    }

  },
  //查询字典
  searchDic() {
    $request({
      url: app.globalData.server9696 + "drug/findDictionarycontent",
      type: "form",
      params: {

        diId: "111"
      }
    }).then(res => {
      console.log(res)
      if (res.data.resultCode == "0") {
        let actions = []
        res.data.data.map((d, i) => {
          actions.push({
            name: d.dcName,
            id: d.dcId
          })
        })
        this.setData({
          actions: actions
        })
      } else {
        Toast.fail(res.data.resultDesc)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let date = formatData(new Date())
    this.searchDic()
    if (options.id) {
      this.setData({
        id: options.id
      })
      wx.setNavigationBarTitle({
        title: '编辑'
      })
      $request({
        url: app.globalData.server9696 + "seed/findSeedOne",
        type: "form",
        params: {

          seeId: this.data.id
        }
      }).then(res => {
        console.log(res)
        delete res.data.data.token
        if (res.data.resultCode == "0") {
          let index = this.data.unit.indexOf(res.data.data.unit)
          let kindIndex = this.data.actions.findIndex(item => {
            return item.id == res.data.data.kind
          })
          this.setData({
            form: res.data.data,
            btnColor: index,
            kindName: this.data.actions[kindIndex].name || "",
          })
        } else {
          Toast.fail(res.data.resultDesc)
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加'
      })
      this.setData({
        'form.billing_time': date
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