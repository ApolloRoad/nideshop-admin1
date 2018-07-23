function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class extends think.Model {
  /**
   * 根据快递公司编码获取名称
   * @param shipperCode
   * @returns {Promise.<*>}
   */
  getShipperNameByCode(shipperCode) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _this.where({ code: shipperCode }).getField('name', true);
    })();
  }

  /**
   * 根据 id 获取快递公司信息
   * @param shipperId
   * @returns {Promise.<*>}
   */
  getShipperById(shipperId) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return _this2.where({ id: shipperId }).find();
    })();
  }
};
//# sourceMappingURL=shipper.js.map