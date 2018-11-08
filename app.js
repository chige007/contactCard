//app.js
App({
  onLaunch: function () {
    this.login();
  },
  // 登录
  login (callback) {
    console.log('login');
    if (this.globalData.jsCode) {//已有jsCode
      callback && callback(this.globalData.jsCode);
    } else {//没有jsCode
      wx.login({
        success: res => {
          this.globalData.jsCode = res.code;//存入全局
          callback && callback(this.globalData.jsCode);
        },
        fail: res => {
          console.log(res);
        }
      });
    }
  },
  // 获取accessToken
  /*
  getAccessToken(callback){
    if (this.globalData.accessToken) {//已有accessToken
      callback && callback(this.globalData.accessToken);
    } else {//没有accessToken
      wx.request({
        url: this.globalData.pathPrefix + '/cardController.do?getWXAccessToken',
        success: res => {
          this.globalData.accessToken = res;//存入全局
          callback && callback(res);
        },
        fail: function (res) { 
          console.log(res) 
        }
      });
    }
  },*/
  // 获取openId
  getOpenId (callback) {
    if(this.globalData.openId){//已有openId
      callback && callback(this.globalData.openId);
    }else{
      this.login(jsCode => {
        wx.request({
          url: this.globalData.pathPrefix + '/cardController.do?getWXSessionKey&jsCode=' + jsCode,
          success: res => {
            this.globalData.openId = res.data.obj.openid;
            callback && callback(res.data.obj.openid);
          },
          fail: res => {
            console.log(res);
          }
        });
      });
    }
  },
  // 获取用户信息
  getUserInfo (callback) {
    if(this.globalData.userInfo){
      callback && callback(this.globalData.userInfo);
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo//存入全局
                callback && callback(res.userInfo);
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              },
              fail: res => {
                console.log(res);
              }
            })
          } else {
            console.log('else');
          }
        }
      });
    }
  },
  // 获取地理位置
  getLocation(callback) {
    if (this.globalData.location) {//已有location
      callback && callback(this.globalData.location);
    } else {//没有location
      wx.getLocation({
        type: 'wgs84',
        altitude: true,
        success: function (res) {
          this.globalData.location = res;
          callback && callback(res);
        },
        fail: function (res) { },
        complete: function (res) { },
      });
    }
  },
  globalData: {
    userInfo: null,
    openId: null,
    accessToken: null,
    location: null,
    jsCode: null,
    current_empId: null,
    pathPrefix: 'http://192.168.13.200:8087/UCG_OSS'
    // pathPrefix: 'http://202.104.31.178:8080/UCG_OSS'
    // pathPrefix: 'http://127.0.0.0:8080/UCG_OSS'
    // pathPrefix: 'http://192.168.13.64:8080/UCG_OSS'
  }
})