const app = getApp();

Page({
  data: {
    url: ''
  },

  onLoad() {
    this.setData({ url: app.globalData.fortuneUrl });
  },

  // web-view 加载成功
  onWebLoad(e) {
    console.log('web-view loaded', e && e.detail);
  },

  // web-view 加载失败：多半是域名未托管或未配置业务域名
  onWebError(e) {
    console.error('web-view error', e && e.detail);
    wx.showModal({
      title: '页面加载失败',
      content: '请确认：1) fortune.html 已托管到 HTTPS 可访问地址；2) 该域名已在小程序后台「业务域名」中配置。开发阶段可在开发者工具「本地设置」勾选「不校验合法域名」。',
      showCancel: false
    });
  }
});
