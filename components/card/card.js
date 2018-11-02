// components/card.js
var APP = getApp( );
import util from '../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 名片信息
    cardInfo: {
      type: Object,
      value: {}
    },
    // 是否能删除
    hasRemove: {
      type: Boolean,
      value: false
    },
    // 是否显示时间
    hasTime: {
      type: Boolean,
      value: false
    },
    // 是否有点击事件
    hasTap: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qrcodeUrl : ""
  },
  ready () {
    this.format();
    this.getRQcode();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 格式化名片信息
    format(){
      var cardInfo = this.data.cardInfo;
      console.log(cardInfo);
      if(!cardInfo.id)return;
      var position = cardInfo.jobPositions && cardInfo.jobPositions.split(',') || [cardInfo.primaryJobName];
      this.setData({
        "cardInfo.code": cardInfo.code.replace(/\s/g,""),
        "cardInfo.createTime": util.formatTimeStamp(cardInfo.createTime, 'Y-M-D h:m:s'),
        "cardInfo.orgName": cardInfo.orgName || "广东中盈盛达融资担保投资股份有限公司",
        "cardInfo.website": cardInfo.website || "www.join-share.net",
        "cardInfo.address": cardInfo.jobAddress || "佛山市顺德区乐从镇岭南大道南2号中欧中心D栋5楼",
        "cardInfo.jobPositions": position,
        "cardInfo.jobPositionsStr": position.join(',')
      },() => {
        // 触发格式化事件
        this.triggerEvent('format', this.data.cardInfo);
      });
    },
    // 获取场景二维码
    getRQcode() {
      if (!this.data.cardInfo.id)return;
      // var page = 'pages%5ccard_info%5ccard_info';
      var page = '';
      wx.request({
        url: APP.globalData.pathPrefix + '/cardController.do?getQRCode&page='+page+'&scene=' + this.data.cardInfo.id,
        header: {
          'content-type': 'application/octet-stream',
        },
        success: res => {
          this.setData({
            "qrcodeUrl": "data:image/png;base64," + res.data
          })
          // this.data.qrcodeUrl = res.data;
        },
        fail: res => {
          console.log(res);
        }
      })
    },
    // 点击
    _tap(e){
      if(this.data.hasTap)
        this.triggerEvent("tap", { 'id': e.currentTarget.dataset.id});
    },
    // 删除
    _remove(e){
      if(this.data.hasRemove)
        this.triggerEvent("remove", { 'id': e.currentTarget.dataset.id });
    }
  }
})
