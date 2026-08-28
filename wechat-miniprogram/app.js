// 小程序入口：把 fortune.html 托管到 HTTPS 后，把地址填到 fortuneUrl。
// 同时必须到「微信公众平台 → 开发管理 → 开发设置 → 业务域名」添加该域名（需上传校验文件）。
// 开发阶段可在微信开发者工具「详情 → 本地设置」勾选「不校验合法域名」直接预览。
App({
  globalData: {
    // CloudStudio 部署的测试地址（开发者工具勾「不校验合法域名」即可预览）
    // 生产上线请替换为你的自有域名（并在小程序后台「业务域名」配置）
    fortuneUrl: 'https://0279ad797a3b478488df88c02cee5abe.gz4.agentos-app.net'
  }
});
