function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable no-multi-spaces */
const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取支付的请求参数
   * @returns {Promise<PreventPromise|void|Promise>}
   */
  prepayAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const orderId = _this.get('orderId');

      const orderInfo = yield _this.model('order').where({ id: orderId }).find();
      if (think.isEmpty(orderInfo)) {
        return _this.fail(400, '订单已取消');
      }
      if (parseInt(orderInfo.pay_status) !== 0) {
        return _this.fail(400, '订单已支付，请不要重复操作');
      }
      const openid = yield _this.model('user').where({ id: orderInfo.user_id }).getField('weixin_openid', true);
      if (think.isEmpty(openid)) {
        return _this.fail('微信支付失败');
      }
      const WeixinSerivce = _this.service('weixin', 'api');
      try {
        const returnParams = yield WeixinSerivce.createUnifiedOrder({
          openid: openid,
          body: '订单编号：' + orderInfo.order_sn,
          out_trade_no: orderInfo.order_sn,
          total_fee: parseInt(orderInfo.actual_price * 100),
          spbill_create_ip: ''
        });
        return _this.success(returnParams);
      } catch (err) {
        return _this.fail('微信支付失败');
      }
    })();
  }

  notifyAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const WeixinSerivce = _this2.service('weixin', 'api');
      const result = WeixinSerivce.payNotify(_this2.post('xml'));
      if (!result) {
        return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>`;
      }

      const orderModel = _this2.model('order');
      const orderInfo = yield orderModel.getOrderByOrderSn(result.out_trade_no);
      if (think.isEmpty(orderInfo)) {
        return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>`;
      }

      if (orderModel.updatePayStatus(orderInfo.id, 2)) {} else {
        return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>`;
      }

      return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
    })();
  }
};
//# sourceMappingURL=pay.js.map