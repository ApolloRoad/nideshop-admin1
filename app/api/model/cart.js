function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class extends think.Model {
  /**
   * 获取购物车的商品
   * @returns {Promise.<*>}
   */
  getGoodsList() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const goodsList = yield _this.model('cart').where({ user_id: think.userId, session_id: 1 }).select();
      return goodsList;
    })();
  }

  /**
   * 获取购物车的选中的商品
   * @returns {Promise.<*>}
   */
  getCheckedGoodsList() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const goodsList = yield _this2.model('cart').where({ user_id: think.userId, session_id: 1, checked: 1 }).select();
      return goodsList;
    })();
  }

  /**
   * 清空已购买的商品
   * @returns {Promise.<*>}
   */
  clearBuyGoods() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const $res = yield _this3.model('cart').where({ user_id: think.userId, session_id: 1, checked: 1 }).delete();
      return $res;
    })();
  }
};
//# sourceMappingURL=cart.js.map