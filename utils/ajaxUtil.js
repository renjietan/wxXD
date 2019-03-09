const app = getApp();
var ajaxUtil = {

  /**
   * post 请求
   * @param url
   * @param params
   * @param type
   * @param successcallback
   * @param failcallback
  
   */
  post(url, params, type, successcallback, failcallback) {
    let urls = url == "findInfomation" ? `${app.globalData.serverEncry}${url}` : `${this.getlocation()}${url}`
    // let urls = `${this.getlocation()}${url}`
    let token = this.getTokenData();
    let posttype = type == 'form' ? 'application/x-www-form-urlencoded' : 'application/json';
    let data = params ? {
      token,
      ...params
    } : { token };
    wx.request({
      url: urls,
      data: data,
      method: 'POST',
      header: {
        'Cookie': 'JSESSIONID=' + this.getsessionId(),
        'content-type': posttype
      },
      success: (result) => {
        successcallback(result);
      },
      fail: ({ errMsg }) => {
        failcallback(errMsg)
      }
    })
  },
  /*获取域名*/
  getlocation() {
    // return 'https://cj.datasurge.cn:9095'
    return 'http://192.168.3.189:9095'
  },
  /*
    获取sessionId
  */
  getsessionId() {
    return wx.getStorageSync('sessionId')
  },

  /**
   * 获取Token参数
   * @returns {{}}
   */
  getTokenData() {
    let timeStamp = Date.parse(new Date());
    let expiration = wx.getStorageSync('expiration');
    let token = wx.getStorageSync('token');
    
    if (token) {
      return token;
    } else {
      //console.log('token不存在返回登录页面');
      wx.reLaunch({
        url: '../login/login'
      })
    }
  },

}
export default ajaxUtil;