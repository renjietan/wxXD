// accountBook/pages/crayadd/crayadd.js
import { $request, formatData } from "../../../utils/util.js";
const { $Message } = require('../../../dist1/base/index');
const { $Toast } = require('../../../dist1/base/index');
import Toast from '../../../dist/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datatime: new Date().getTime(),
    groupData:null,
    crayTypeData:null,
    groupName: null,
    isShowDate:false,
    isShowGroup: false,
    isShowType:false,
    btnloading:false,
    crayTypeName:null,
    isVisiableText: true, //多行文本显示隐藏
    formdata:{
      output:null,
      unit_price: null,
      purchaser: null,
      sales_time: formatData(new Date()),
      groupId: null,
      remarks: null,
      standardId:null
    }  
  },
  isOpenDate(){
    this.setData({
      isShowDate: !this.data.isShowDate,
    })
  },
  isOpenGroup(){
    let that = this
    this.data.param = {urlParam:"crayadd"}
    wx.navigateTo({
      url: '../../../device/pages/choosePond/choosePond?param=' + JSON.stringify(this.data.param)
    })
  },
  isOpenType() {
    this.setData({
      isShowType: !this.data.isShowType,
    })
  },
  //操作时间
  handleDateConfirm(e) {
    this.setData({
      ['formdata.sales_time']: formatData(new Date(e.detail)),
      datatime: e.detail,
      isShowDate: false
    })
  },
  //获取塘口列表
  getpondlist() {
    $request({
      url: app.globalData.serverHYH + "QueryAllGroupInfo",
      method: "GET"
    }).then(res => {
      console.log('塘口列表', res.data)
      if (res.data.resultCode == 0) {
        let groupData = res.data.data;
        if (groupData.length > 0 && res.data) {
          let newlistpond = [];
          groupData.forEach(item => {
            newlistpond.push({
              'name': item.groupname,
              'groupid': item.groupid
            })
          })
          this.setData({
            groupData: newlistpond,
            groupName: newlistpond[0].name,
            ['formdata.groupId']: newlistpond[0].groupid,
          },()=>{
            if(this.edit){
              console.log(this.edit)
              this.getlistdata(this.optionsid);
            }
          })
        }
      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  //获取规格
  getType() {
    $request({
      url: app.globalData.serverBook + "crayfish_production_marketing/selectCrayfishType",
      method: "POST",
      type:'form'
    }).then(res => {
      console.log('塘口列表', res.data)
      if (res.data.resultCode == 0) {
        let newlistpond = [];
        res.data.data.forEach(item => {
          newlistpond.push({
            'name': item.dictionarie_type_name,
            'crayTypeId': item.dictionarie_id
          })
        })
        this.setData({
          crayTypeData: newlistpond,
          crayTypeName: newlistpond[0].name,
          ['formdata.standardId']: newlistpond[0].crayTypeId,
        })
      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  //选择塘口
  handleGroupConfirm(event){
    this.setData({
      groupName: event.detail.name,
      ['formdata.groupId']: event.detail.groupid,
      isShowGroup:false
    })
  },
  //选择规格
  handleTypeConfirm(event) {
    this.setData({
      crayTypeName: event.detail.name,
      ['formdata.standardId']: event.detail.crayTypeId,
      isShowType: false
    })
  },
  //输入框
  changeIn(event) {
    let name = event.target.dataset.name
    this.setData({
      ['formdata.' + name]: event.detail
    })
  },
  //点击保存按钮
  handleClick(){
    let { output, sales_time, unit_price, purchaser, groupId, remarks } = this.data.formdata;
    let inputtest = /^\d{1,9}(\.\d{1,2})?$/;
    let inputtest2 = /^\d{1,3}(\.\d{1,2})?$/;
    if (output == null || output == '' || output ==' '){
      $Message({
        content: '请选择输入小龙虾销量',
        type: 'error'
      });
    } else if (!inputtest.test(output) ||output==0){
      $Message({
        content: '销量小数点前9位，后2位,且不能为0',
        type: 'error'
      });
    } else if (unit_price == null || unit_price == '' || unit_price == ' '){
      $Message({
        content: '请选择输入小龙虾预估价',
        type: 'error'
      });
    } else if (!inputtest2.test(unit_price)){
      $Message({
        content: '预估价保留两位小数，且长度范围1-3位',
        type: 'error'
      });
    } else if (purchaser == null || purchaser == '' || purchaser == ' '){
      $Message({
        content: '请选择输入购买方',
        type: 'error'
      });
    } else if (groupId == null || groupId == '' || groupId == ' ') {
      $Message({
        content: '请选择塘口',
        type: 'error'
      });
    }else{
      this.setData({
        btnloading:true
      })
      Toast.loading({
        mask: true,
        duration: 0,
        message: "加载中..."
      })
      if (this.edit) {
        $request({
          url: app.globalData.serverBook + "crayfish_production_marketing/updateCrayfish",
          method: "POST",
          type: 'form',
          params: {
            ...this.data.formdata,
            "cfId": this.optionsid
          }
        }).then(res => {
          this.setData({
            btnloading: false
          })
          if (res.data.resultCode == 0) {
            setTimeout(function () {
              Toast.clear();
              setTimeout(function () {
                Toast.success("操作成功")
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }, 600)
            }, 600)
          } else {
            $Toast({
              content: res.data.resultDesc,
              type: 'error'
            });
          }
        }).catch(error => { })
      }else{
      $request({
        url: app.globalData.serverBook + "crayfish_production_marketing/insertCrayfish",
        method: "POST",
        type: 'form',
        params:{
          ...this.data.formdata
        }
      }).then(res => {
        this.setData({
          btnloading: false
        })
        if (res.data.resultCode == 0) {
          setTimeout(function () {
            Toast.clear();
            setTimeout(function () {
              Toast.success("操作成功")
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }, 600)
          }, 600)
        } else {
          $Toast({
            content: res.data.resultDesc,
            type: 'error'
          });
        }
      }).catch(error => { })
      }
    }
  },
  //获取以前的数据
  getlistdata(id){
    Toast.loading({
      mask: true,
      duration: 0,
      message: "加载中..."
    })
    $request({
      url: app.globalData.serverBook + "crayfish_production_marketing/selectCrayfishById",
      method: "POST",
      type: 'form',
      params: {
        id: id
      }
    }).then(res => {
      setTimeout(() => {
        Toast.clear();
        this.setData({
          isVisiableText: !this.data.isVisiableText
        })
      }, 600)
      console.log('获取以前的数据', res.data)
      if (res.data.resultCode == 0) {
        let newdata = this.data.groupData.filter((item) => {
          return item.groupid == res.data.data.groupId;
        });
        if (newdata.length!=0){
          this.setData({
            ['formdata.output']: res.data.data.output,
            ['formdata.sales_time']: res.data.data.sales_time,
            ['formdata.standardId']: res.data.data.standardId,
            ['formdata.unit_price']: res.data.data.unit_price,
            ['formdata.purchaser']: res.data.data.purchaser,
            'formdata.groupId': res.data.data.groupId,
            'formdata.remarks': res.data.data.remarks == "null" ? null : res.data.data.remarks,
            'groupName': newdata[0].name,
            'datatime': new Date(res.data.data.sales_time).getTime(),
            'crayTypeName': res.data.data.dictionarie_type_name
          })

        }else{
          $Message({
            content: '该塘口已经被删除，请重新选择塘口',
            type: 'warning'
          });
          this.setData({
            ['formdata.output']: res.data.data.output,
            ['formdata.sales_time']: res.data.data.sales_time,
            ['formdata.standardId']: res.data.data.standardId,
            ['formdata.unit_price']: res.data.data.unit_price,
            ['formdata.purchaser']: res.data.data.purchaser,
            ['formdata.groupId']: '',
            ['formdata.remarks']: res.data.data.remarks == "null" ? null : res.data.data.remarks,
            'groupName':'',
            'datatime': new Date(res.data.data.sales_time).getTime(),
            'crayTypeName': res.data.data.dictionarie_type_name
          })
        }
        
        
      } else {
        $Toast({
          content: res.data.resultDesc,
          type: 'error'
        });
      }
    }).catch(error => { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getpondlist();
    this.getType();
    if (options.type=='edit'){
      this.edit=true;
      this.optionsid = options.id;
      wx.setNavigationBarTitle({
        title: '编辑小龙虾'
      })
    }else{
      this.edit = false;
      this.setData({
        isVisiableText: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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