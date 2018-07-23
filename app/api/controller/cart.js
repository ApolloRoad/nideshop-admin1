function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取购物车中的数据
   * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
   */
  getCart() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const cartList = yield _this.model('cart').where({ user_id: think.userId, session_id: 1 }).select();
      // 获取购物车统计信息
      let goodsCount = 0;
      let goodsAmount = 0.00;
      let checkedGoodsCount = 0;
      let checkedGoodsAmount = 0.00;
      for (const cartItem of cartList) {
        goodsCount += cartItem.number;
        goodsAmount += cartItem.number * cartItem.retail_price;
        if (!think.isEmpty(cartItem.checked)) {
          checkedGoodsCount += cartItem.number;
          checkedGoodsAmount += cartItem.number * cartItem.retail_price;
        }

        // 查找商品的图片
        cartItem.list_pic_url = yield _this.model('goods').where({ id: cartItem.goods_id }).getField('list_pic_url', true);
      }

      return {
        cartList: cartList,
        cartTotal: {
          goodsCount: goodsCount,
          goodsAmount: goodsAmount,
          checkedGoodsCount: checkedGoodsCount,
          checkedGoodsAmount: checkedGoodsAmount
        }
      };
    })();
  }

  /**
   * 获取购物车信息，所有对购物车的增删改操作，都要重新返回购物车的信息
   * @return {Promise} []
   */
  indexAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return _this2.success((yield _this2.getCart()));
    })();
  }

  /**
   * 添加商品到购物车
   * @returns {Promise.<*>}
   */
  addAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const goodsId = _this3.post('goodsId');
      const productId = _this3.post('productId');
      const number = _this3.post('number');

      // 判断商品是否可以购买
      const goodsInfo = yield _this3.model('goods').where({ id: goodsId }).find();
      if (think.isEmpty(goodsInfo) || goodsInfo.is_delete === 1) {
        return _this3.fail(400, '商品已下架');
      }

      // 取得规格的信息,判断规格库存
      const productInfo = yield _this3.model('product').where({ goods_id: goodsId, id: productId }).find();
      if (think.isEmpty(productInfo) || productInfo.goods_number < number) {
        return _this3.fail(400, '库存不足');
      }

      // 判断购物车中是否存在此规格商品
      const cartInfo = yield _this3.model('cart').where({ goods_id: goodsId, product_id: productId }).find();
      if (think.isEmpty(cartInfo)) {
        // 添加操作

        // 添加规格名和值
        let goodsSepcifitionValue = [];
        if (!think.isEmpty(productInfo.goods_specification_ids)) {
          goodsSepcifitionValue = yield _this3.model('goods_specification').where({
            goods_id: goodsId,
            id: { 'in': productInfo.goods_specification_ids.split('_') }
          }).getField('value');
        }

        // 添加到购物车
        const cartData = {
          goods_id: goodsId,
          product_id: productId,
          goods_sn: productInfo.goods_sn,
          goods_name: goodsInfo.name,
          list_pic_url: goodsInfo.list_pic_url,
          number: number,
          session_id: 1,
          user_id: think.userId,
          retail_price: productInfo.retail_price,
          market_price: productInfo.retail_price,
          goods_specifition_name_value: goodsSepcifitionValue.join(';'),
          goods_specifition_ids: productInfo.goods_specification_ids,
          checked: 1
        };

        yield _this3.model('cart').thenAdd(cartData, { product_id: productId });
      } else {
        // 如果已经存在购物车中，则数量增加
        if (productInfo.goods_number < number + cartInfo.number) {
          return _this3.fail(400, '库存不足');
        }

        yield _this3.model('cart').where({
          goods_id: goodsId,
          product_id: productId,
          id: cartInfo.id
        }).increment('number', number);
      }
      return _this3.success((yield _this3.getCart()));
    })();
  }

  // 更新指定的购物车信息
  updateAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const goodsId = _this4.post('goodsId');
      const productId = _this4.post('productId'); // 新的product_id
      const id = _this4.post('id'); // cart.id
      const number = parseInt(_this4.post('number')); // 不是

      // 取得规格的信息,判断规格库存
      const productInfo = yield _this4.model('product').where({ goods_id: goodsId, id: productId }).find();
      if (think.isEmpty(productInfo) || productInfo.goods_number < number) {
        return _this4.fail(400, '库存不足');
      }

      // 判断是否已经存在product_id购物车商品
      const cartInfo = yield _this4.model('cart').where({ id: id }).find();
      // 只是更新number
      if (cartInfo.product_id === productId) {
        yield _this4.model('cart').where({ id: id }).update({
          number: number
        });

        return _this4.success((yield _this4.getCart()));
      }

      const newCartInfo = yield _this4.model('cart').where({ goods_id: goodsId, product_id: productId }).find();
      if (think.isEmpty(newCartInfo)) {
        // 直接更新原来的cartInfo

        // 添加规格名和值
        let goodsSepcifition = [];
        if (!think.isEmpty(productInfo.goods_specification_ids)) {
          goodsSepcifition = yield _this4.model('goods_specification').field(['nideshop_goods_specification.*', 'nideshop_specification.name']).join('nideshop_specification ON nideshop_specification.id=nideshop_goods_specification.specification_id').where({
            'nideshop_goods_specification.goods_id': goodsId,
            'nideshop_goods_specification.id': { 'in': productInfo.goods_specification_ids.split('_') }
          }).select();
        }

        const cartData = {
          number: number,
          goods_specifition_name_value: JSON.stringify(goodsSepcifition),
          goods_specifition_ids: productInfo.goods_specification_ids,
          retail_price: productInfo.retail_price,
          market_price: productInfo.retail_price,
          product_id: productId,
          goods_sn: productInfo.goods_sn
        };

        yield _this4.model('cart').where({ id: id }).update(cartData);
      } else {
        // 合并购物车已有的product信息，删除已有的数据
        const newNumber = number + newCartInfo.number;

        if (think.isEmpty(productInfo) || productInfo.goods_number < newNumber) {
          return _this4.fail(400, '库存不足');
        }

        yield _this4.model('cart').where({ id: newCartInfo.id }).delete();

        const cartData = {
          number: newNumber,
          goods_specifition_name_value: newCartInfo.goods_specifition_name_value,
          goods_specifition_ids: newCartInfo.goods_specification_ids,
          retail_price: productInfo.retail_price,
          market_price: productInfo.retail_price,
          product_id: productId,
          goods_sn: productInfo.goods_sn
        };

        yield _this4.model('cart').where({ id: id }).update(cartData);
      }

      return _this4.success((yield _this4.getCart()));
    })();
  }

  // 是否选择商品，如果已经选择，则取消选择，批量操作
  checkedAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let productId = _this5.post('productIds').toString();
      const isChecked = _this5.post('isChecked');

      if (think.isEmpty(productId)) {
        return _this5.fail('删除出错');
      }

      productId = productId.split(',');
      yield _this5.model('cart').where({ product_id: { 'in': productId } }).update({ checked: parseInt(isChecked) });

      return _this5.success((yield _this5.getCart()));
    })();
  }

  // 删除选中的购物车商品，批量删除
  deleteAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      let productId = _this6.post('productIds');
      if (!think.isString(productId)) {
        return _this6.fail('删除出错');
      }

      productId = productId.split(',');

      yield _this6.model('cart').where({ product_id: { 'in': productId } }).delete();

      return _this6.success((yield _this6.getCart()));
    })();
  }

  // 获取购物车商品的总件件数
  goodscountAction() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const cartData = yield _this7.getCart();
      return _this7.success({
        cartTotal: {
          goodsCount: cartData.cartTotal.goodsCount
        }
      });
    })();
  }

  /**
   * 订单提交前的检验和填写相关订单信息
   * @returns {Promise.<void>}
   */
  checkoutAction() {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const addressId = _this8.get('addressId'); // 收货地址id
      // const couponId = this.get('couponId'); // 使用的优惠券id

      // 选择的收货地址
      let checkedAddress = null;
      if (addressId) {
        checkedAddress = yield _this8.model('address').where({ is_default: 1, user_id: think.userId }).find();
      } else {
        checkedAddress = yield _this8.model('address').where({ id: addressId, user_id: think.userId }).find();
      }

      if (!think.isEmpty(checkedAddress)) {
        checkedAddress.province_name = yield _this8.model('region').getRegionName(checkedAddress.province_id);
        checkedAddress.city_name = yield _this8.model('region').getRegionName(checkedAddress.city_id);
        checkedAddress.district_name = yield _this8.model('region').getRegionName(checkedAddress.district_id);
        checkedAddress.full_region = checkedAddress.province_name + checkedAddress.city_name + checkedAddress.district_name;
      }

      // 根据收货地址计算运费
      const freightPrice = 0.00;

      // 获取要购买的商品
      const cartData = yield _this8.getCart();
      const checkedGoodsList = cartData.cartList.filter(function (v) {
        return v.checked === 1;
      });

      // 获取可用的优惠券信息，功能还示实现
      const couponList = yield _this8.model('user_coupon').select();
      const couponPrice = 0.00; // 使用优惠券减免的金额

      // 计算订单的费用
      const goodsTotalPrice = cartData.cartTotal.checkedGoodsAmount; // 商品总价
      const orderTotalPrice = cartData.cartTotal.checkedGoodsAmount + freightPrice - couponPrice; // 订单的总价
      const actualPrice = orderTotalPrice - 0.00; // 减去其它支付的金额后，要实际支付的金额

      return _this8.success({
        checkedAddress: checkedAddress,
        freightPrice: freightPrice,
        checkedCoupon: {},
        couponList: couponList,
        couponPrice: couponPrice,
        checkedGoodsList: checkedGoodsList,
        goodsTotalPrice: goodsTotalPrice,
        orderTotalPrice: orderTotalPrice,
        actualPrice: actualPrice
      });
    })();
  }
};
//# sourceMappingURL=cart.js.map