function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const moment = require('moment');

module.exports = class extends Base {
  /**
  * 获取订单列表
  * @return {Promise} []
  */
  adminListAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const orderList = yield _this.model('order').page(1, 10000).countSelect();
      const newOrderList = [];
      for (const item of orderList.data) {
        // 订单的商品
        item.goodsList = yield _this.model('order_goods').where({ order_id: item.id }).select();
        item.goodsCount = 0;
        item.goodsList.forEach(function (v) {
          item.goodsCount += v.number;
        });

        // 订单状态的处理
        item.order_status_text = yield _this.model('order').getOrderStatusText(item.id);

        // 可操作的选项
        item.handleOption = yield _this.model('order').getOrderHandleOption(item.id);

        newOrderList.push(item);
      }
      orderList.data = newOrderList;

      return _this.success(orderList);
    })();
  }
  /**
   * 获取订单列表
   * @return {Promise} []
   */
  listAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const orderList = yield _this2.model('order').where({ user_id: think.userId }).page(1, 10).countSelect();
      const newOrderList = [];
      for (const item of orderList.data) {
        // 订单的商品
        item.goodsList = yield _this2.model('order_goods').where({ order_id: item.id }).select();
        item.goodsCount = 0;
        item.goodsList.forEach(function (v) {
          item.goodsCount += v.number;
        });

        // 订单状态的处理
        item.order_status_text = yield _this2.model('order').getOrderStatusText(item.id);

        // 可操作的选项
        item.handleOption = yield _this2.model('order').getOrderHandleOption(item.id);

        newOrderList.push(item);
      }
      orderList.data = newOrderList;

      return _this2.success(orderList);
    })();
  }

  detailAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const orderId = _this3.get('orderId');
      const orderInfo = yield _this3.model('order').where({ user_id: think.userId, id: orderId }).find();

      if (think.isEmpty(orderInfo)) {
        return _this3.fail('订单不存在');
      }

      orderInfo.province_name = yield _this3.model('region').where({ id: orderInfo.province }).getField('name', true);
      orderInfo.city_name = yield _this3.model('region').where({ id: orderInfo.city }).getField('name', true);
      orderInfo.district_name = yield _this3.model('region').where({ id: orderInfo.district }).getField('name', true);
      orderInfo.full_region = orderInfo.province_name + orderInfo.city_name + orderInfo.district_name;

      const latestExpressInfo = yield _this3.model('order_express').getLatestOrderExpress(orderId);
      orderInfo.express = latestExpressInfo;

      const orderGoods = yield _this3.model('order_goods').where({ order_id: orderId }).select();

      // 订单状态的处理
      orderInfo.order_status_text = yield _this3.model('order').getOrderStatusText(orderId);
      orderInfo.add_time = moment.unix(orderInfo.add_time).format('YYYY-MM-DD HH:mm:ss');
      orderInfo.final_pay_time = moment('001234', 'Hmmss').format('mm:ss');
      // 订单最后支付时间
      if (orderInfo.order_status === 0) {
        // if (moment().subtract(60, 'minutes') < moment(orderInfo.add_time)) {
        orderInfo.final_pay_time = moment('001234', 'Hmmss').format('mm:ss');
        // } else {
        //     //超过时间不支付，更新订单状态为取消
        // }
      }

      // 订单可操作的选择,删除，支付，收货，评论，退换货
      const handleOption = yield _this3.model('order').getOrderHandleOption(orderId);

      return _this3.success({
        orderInfo: orderInfo,
        orderGoods: orderGoods,
        handleOption: handleOption
      });
    })();
  }

  /**
   * 提交订单
   * @returns {Promise.<void>}
   */
  submitAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      // 获取收货地址信息和计算运费
      const addressId = _this4.post('addressId');
      const checkedAddress = yield _this4.model('address').where({ id: addressId }).find();
      if (think.isEmpty(checkedAddress)) {
        return _this4.fail('请选择收货地址');
      }
      const freightPrice = 0.00;

      // 获取要购买的商品
      const checkedGoodsList = yield _this4.model('cart').where({ user_id: think.userId, session_id: 1, checked: 1 }).select();
      if (think.isEmpty(checkedGoodsList)) {
        return _this4.fail('请选择商品');
      }

      // 统计商品总价
      let goodsTotalPrice = 0.00;
      for (const cartItem of checkedGoodsList) {
        goodsTotalPrice += cartItem.number * cartItem.retail_price;
      }

      // 获取订单使用的优惠券
      const couponId = _this4.post('couponId');
      const couponPrice = 0.00;
      if (!think.isEmpty(couponId)) {}

      // 订单价格计算
      const orderTotalPrice = goodsTotalPrice + freightPrice - couponPrice; // 订单的总价
      const actualPrice = orderTotalPrice - 0.00; // 减去其它支付的金额后，要实际支付的金额
      const currentTime = parseInt(_this4.getTime() / 1000);

      const orderInfo = {
        order_sn: _this4.model('order').generateOrderNumber(),
        user_id: think.userId,

        // 收货地址和运费
        consignee: checkedAddress.name,
        mobile: checkedAddress.mobile,
        province: checkedAddress.province_id,
        city: checkedAddress.city_id,
        district: checkedAddress.district_id,
        address: checkedAddress.address,
        freight_price: 0.00,

        // 留言
        postscript: _this4.post('postscript'),

        // 使用的优惠券
        coupon_id: 0,
        coupon_price: couponPrice,

        add_time: currentTime,
        goods_price: goodsTotalPrice,
        order_price: orderTotalPrice,
        actual_price: actualPrice
      };

      // 开启事务，插入订单信息和订单商品
      const orderId = yield _this4.model('order').add(orderInfo);
      orderInfo.id = orderId;
      if (!orderId) {
        return _this4.fail('订单提交失败');
      }

      // 统计商品总价
      const orderGoodsData = [];
      for (const goodsItem of checkedGoodsList) {
        orderGoodsData.push({
          order_id: orderId,
          goods_id: goodsItem.goods_id,
          goods_sn: goodsItem.goods_sn,
          product_id: goodsItem.product_id,
          goods_name: goodsItem.goods_name,
          list_pic_url: goodsItem.list_pic_url,
          market_price: goodsItem.market_price,
          retail_price: goodsItem.retail_price,
          number: goodsItem.number,
          goods_specifition_name_value: goodsItem.goods_specifition_name_value,
          goods_specifition_ids: goodsItem.goods_specifition_ids
        });
      }

      yield _this4.model('order_goods').addMany(orderGoodsData);
      yield _this4.model('cart').clearBuyGoods();

      return _this4.success({ orderInfo: orderInfo });
    })();
  }

  /**
   * 查询物流信息
   * @returns {Promise.<void>}
   */
  expressAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const orderId = _this5.get('orderId');
      if (think.isEmpty(orderId)) {
        return _this5.fail('订单不存在');
      }
      const latestExpressInfo = yield _this5.model('order_express').getLatestOrderExpress(orderId);
      return _this5.success(latestExpressInfo);
    })();
  }

  // 取消订单
  cancelAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const orderId = _this6.get('orderId');
      const deleteInfo = yield _this6.model('order').where({ id: orderId }).delete();
      return _this6.success(deleteInfo);
    })();
  }
};
//# sourceMappingURL=order.js.map