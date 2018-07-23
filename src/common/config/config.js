// default config
module.exports = {
  rootStatic:'http://127.0.0.1:8360/static/upload/',
  resource_on: true, //是否开启静态资源解析功能
  resource_reg: /^(static\/|[^\/]+\.(?!js|html)\w+$)/, //判断为静态资源请求的正则
  default_module: 'api',
  weixin: {
    appid: 'wxa4287caddc1530fb', // 小程序 appid
    secret: 'ed80e1b303bd9cd452cd11c86db9b0dd', // 小程序密钥
    mch_id: '', // 商户帐号ID
    partner_key: '', // 微信支付密钥
    notify_url: '' // 微信异步通知，例：https://www.nideshop.com/api/pay/notify
  },
  express: {
    // 快递物流信息查询使用的是快递鸟接口，申请地址：http://www.kdniao.com/
    appid: '', // 对应快递鸟用户后台 用户ID
    appkey: '', // 对应快递鸟用户后台 API key
    request_url: 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx'
  }
};
