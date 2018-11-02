//index.js
var APP = getApp();
Page({
  data: {
    session_key: "",
    // 是否无名片
    noData: false,
    // 名片列表
    contact_card_list: []
  },
  // 获取名片列表
  getCardList(openId, page = 1, rows = 10){
    wx.showLoading({//加载提示
      title: '加载列表...',
      mask: true,
      success: res => {
        //加载名片列表
        wx.request({
          url: APP.globalData.pathPrefix + '/cardController.do?getBindCardInfos&openId=' + openId + '&page=' + page + '&rows=' + rows,
          success: res => {
            wx.hideLoading();//隐藏加载提示
            var rows = res.data.obj;
            if (!rows.length) {//没有绑定名片
              this.setData({
                noData: true
              });
            } else {//触发视图渲染
              this.setData({
                contact_card_list: rows
              });
            }
          }
        });
      }
    });
  },
  // 查看名片详情
  checkCardDetail(data) {
    var id = data.detail.id;
    wx.navigateTo({//调整名片详情页
      url: '../card_info/card_info?empId=' + id + '&from=list'
    })
  },
  // 删除名片
  removeCard(data) {
    wx.showModal({
      title: '提示',
      content: '是否确认删除该名片？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      confirmColor: '#D0021B',
      success: res => {
        if (res.confirm) {
          var id = data.detail.id;
          APP.getOpenId(openId => {
            wx.request({
              url: APP.pathPrefix + '/cardController.do?unbindCardInfo&openId'+openId+'&empId='+id,
              success: function (res) {
                console.log(res);
              },
              fail: function (res) {
                console.log(res);
              }
            });
          });
        }
      },
      fail: res => {
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取微信用户openId
    APP.getOpenId(openId => {
      this.getCardList(openId, 1, 10);
    });
    // 检查session是否有效
    // wx.checkSession({
    //   success: (res) => {
    //     console.log(res);
    //     console.log(this);
    //     this.gerUserInfo();
    //   },
    //   fail: (res) => {
    //     this.login();
    //   }
    // });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: function(res) {
    //     console.log(res);
    //   },
    //   fail: function(res){
    //     console.log(res);
    //   }
    // })
  },
})
