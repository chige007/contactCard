// pages/card_info/card_info.js
var APP = getApp();
import util from '../../utils/util.js'
Page({
  data: {
    // 名片信息
    cardInfo: {},
    allowLoad: true,
    current_empId: null
  },
  // 拨打电话
  makePhoneCall(e) {
    console.log('makePhoneCall');
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenum,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 复制到剪贴板
  setClipboardData(e) {
    console.log('setClipboardData');
    wx.setClipboardData({
      data: e.currentTarget.dataset.clipboarddata,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  // 添加到手机通讯录
  addPhoneContact() {
    console.log('addPhoneContact');
    wx.addPhoneContact({
      firstName: this.data.cardInfo.name,
      // lastName: this.data.cardInfo.name,
      mobilePhoneNumber: this.data.cardInfo.phone,
      weChatNumber: '',
      addressState: '广东省',
      addressCity: '佛山市',
      addressStreet: this.data.cardInfo.address.replace(/广东省|佛山市|广州市|云浮市|安徽省|肇庆市|中山市/g,""),
      addressPostalCode: this.data.cardInfo.post,
      organization: this.data.cardInfo.orgName,
      title: this.data.cardInfo.jobPositionsStr,
      workFaxNumber: this.data.cardInfo.jobFax,
      workPhoneNumber: this.data.cardInfo.jobPhone,
      hostNumber: this.data.cardInfo.jobPhone,
      email: this.data.cardInfo.jobEmail,
      url: this.data.cardInfo.website,
      success: res => {
        console.log(res);
      },
      fail: res => {
        console.log(res);
      }
    })
  },
  // 分享名片
  shareCard() {
    console.log('shareCard');
    wx.showShareMenu({
      withShareTicket: true,
      success: res => {
        console.log(res);
      }
    });
    // wx.showActionSheet({
    //   itemList: ['微信好友', '保存名片'],
    //   itemColor: '',
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // });
  },
  // 返回列表页
  backToList(){
    console.log('backToList');
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  // 格式化名片信息
  format(e){
    console.log('format');
    this.setData({
      "cardInfo": e.detail
    });
  },
  // 获取名片详情
  getCardInfo(empId, isBind){
    console.log('getCardInfo');
    this.setData({
      'cardInfo': null
    });
    wx.showLoading({// 弹出加载提示
      title: '加载卡片信息...',
      success: (res) => {
        wx.request({
          url: APP.globalData.pathPrefix + '/cardController.do?getCardInfo&empId=' + empId,
          success: res => {
            wx.hideLoading();// 隐藏加载提示
            this.setData({
              "cardInfo": res.data.obj
            });
            this.data.allowLoad = true;
          },
          fail: res => { }
        });
        if(isBind){//是否需要绑定用户
          // 获取微信用户openId
          APP.getOpenId(openId => {
            // 绑定微信用户与名片的关联
            wx.request({
              url: APP.globalData.pathPrefix + '/cardController.do?bindCardInfo&openId=' + openId + '&empId=' + empId,
              success: res => { 
                console.log(res.data.msg);
              },
              fail: res => {
                console.log(res);
              }
            })
          });
        }
      }
    });
  },
  _onload(options){
    this.data.allowLoad = false;
    var empId = (options && options.empId) || APP.globalData.current_empId;
    // if (this.data.current_empId === empId)return;
    this.data.current_empId = empId;
    if (empId) {// 有传员工id
      this.getCardInfo(empId, (options && options.empId) ? true : false);//获取名片详情
    } else {//没传员工id
      // wx.showToast({
      //   title: '参数错误！',
      //   icon: 'none'
      // });
    }
  },
  onShareAppMessage(ops){
    return{
      title: '中盈盛达员工名片',
      path: 'pages/card_info/card_info?empId=' + this.data.cardInfo.id,
      success: function (res) {
      }
    }
  },
  onLoad(options) {
    this._onload(options);
  },
  onShow(options){
    if (this.data.allowLoad)
      this._onload(options);
  }
})
