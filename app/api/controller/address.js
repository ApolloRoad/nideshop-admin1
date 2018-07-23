function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取用户的收货地址
   * @return {Promise} []
   */
  listAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const addressList = yield _this.model('address').where({ user_id: think.userId }).select();
      let itemKey = 0;
      for (const addressItem of addressList) {
        addressList[itemKey].province_name = yield _this.model('region').getRegionName(addressItem.province_id);
        addressList[itemKey].city_name = yield _this.model('region').getRegionName(addressItem.city_id);
        addressList[itemKey].district_name = yield _this.model('region').getRegionName(addressItem.district_id);
        addressList[itemKey].full_region = addressList[itemKey].province_name + addressList[itemKey].city_name + addressList[itemKey].district_name;
        itemKey += 1;
      }

      return _this.success(addressList);
    })();
  }

  /**
   * 获取收货地址的详情
   * @return {Promise} []
   */
  detailAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const addressId = _this2.get('id');

      const addressInfo = yield _this2.model('address').where({ user_id: think.userId, id: addressId }).find();
      if (!think.isEmpty(addressInfo)) {
        addressInfo.province_name = yield _this2.model('region').getRegionName(addressInfo.province_id);
        addressInfo.city_name = yield _this2.model('region').getRegionName(addressInfo.city_id);
        addressInfo.district_name = yield _this2.model('region').getRegionName(addressInfo.district_id);
        addressInfo.full_region = addressInfo.province_name + addressInfo.city_name + addressInfo.district_name;
      }

      return _this2.success(addressInfo);
    })();
  }

  /**
   * 添加或更新收货地址
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  saveAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let addressId = _this3.post('id');

      const addressData = {
        name: _this3.post('name'),
        mobile: _this3.post('mobile'),
        province_id: _this3.post('province_id'),
        city_id: _this3.post('city_id'),
        district_id: _this3.post('district_id'),
        address: _this3.post('address'),
        user_id: _this3.getLoginUserId(),
        is_default: _this3.post('is_default') === true ? 1 : 0
      };

      if (think.isEmpty(addressId)) {
        addressId = yield _this3.model('address').add(addressData);
      } else {
        yield _this3.model('address').where({ id: addressId, user_id: think.userId }).update(addressData);
      }

      // 如果设置为默认，则取消其它的默认
      if (_this3.post('is_default') === true) {
        yield _this3.model('address').where({ id: ['<>', addressId], user_id: think.userId }).update({
          is_default: 0
        });
      }
      const addressInfo = yield _this3.model('address').where({ id: addressId }).find();

      return _this3.success(addressInfo);
    })();
  }

  /**
   * 删除指定的收货地址
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  deleteAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const addressId = _this4.post('id');

      yield _this4.model('address').where({ id: addressId, user_id: think.userId }).delete();

      return _this4.success('删除成功');
    })();
  }
};
//# sourceMappingURL=address.js.map