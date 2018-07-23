function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const page = _this.get('page') || 1;
      const size = _this.get('size') || 10;
      const orderSn = _this.get('orderSn') || '';
      const consignee = _this.get('consignee') || '';

      const model = _this.model('order');
      const data = yield model.where({ order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`] }).order(['id DESC']).page(page, size).countSelect();
      const newList = [];
      for (const item of data.data) {
        item.order_status_text = yield _this.model('order').getOrderStatusText(item.id);
        newList.push(item);
      }
      data.data = newList;
      return _this.success(data);
    })();
  }

  infoAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const id = _this2.get('id');
      const model = _this2.model('order');
      const data = yield model.where({ id: id }).find();

      return _this2.success(data);
    })();
  }

  storeAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.isPost) {
        return false;
      }

      const values = _this3.post();
      const id = _this3.post('id');

      const model = _this3.model('order');
      values.is_show = values.is_show ? 1 : 0;
      values.is_new = values.is_new ? 1 : 0;
      if (id > 0) {
        yield model.where({ id: id }).update(values);
      } else {
        delete values.id;
        yield model.add(values);
      }
      return _this3.success(values);
    })();
  }

  destoryAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const id = _this4.post('id');
      yield _this4.model('order').where({ id: id }).limit(1).delete();

      // 删除订单商品
      yield _this4.model('order_goods').where({ order_id: id }).delete();

      // TODO 事务，验证订单是否可删除（只有失效的订单才可以删除）

      return _this4.success();
    })();
  }
};
//# sourceMappingURL=order.js.map