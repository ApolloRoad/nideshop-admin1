function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');

module.exports = class extends think.Model {
  /**
   * 获取完整的省市区名称组成的字符串
   * @param provinceId
   * @param cityId
   * @param districtId
   * @returns {Promise.<*>}
   */
  getFullRegionName(provinceId, cityId, districtId) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const isFullRegion = yield _this.checkFullRegion(provinceId, cityId, districtId);
      if (!isFullRegion) {
        return '';
      }

      const regionList = yield _this.limit(3).order({ 'id': 'asc' }).where({ id: { 'in': [provinceId, cityId, districtId] } }).select();
      if (think.isEmpty(regionList) || regionList.length !== 3) {
        return '';
      }

      return _.flatMap(regionList, 'name').join('');
    })();
  }

  /**
   * 检查省市区信息是否完整和正确
   * @param provinceId
   * @param cityId
   * @param districtId
   * @returns {Promise.<boolean>}
   */
  checkFullRegion(provinceId, cityId, districtId) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (think.isEmpty(provinceId) || think.isEmpty(cityId) || think.isEmpty(districtId)) {
        return false;
      }

      const regionList = yield _this2.limit(3).order({ 'id': 'asc' }).where({ id: { 'in': [provinceId, cityId, districtId] } }).select();
      if (think.isEmpty(regionList) || regionList.length !== 3) {
        return false;
      }

      // 上下级关系检查
      if (_.get(regionList, ['0', 'id']) !== _.get(regionList, ['1', 'parent_id'])) {
        return false;
      }

      if (_.get(regionList, ['1', 'id']) !== _.get(regionList, ['2', 'parent_id'])) {
        return false;
      }

      return true;
    })();
  }

  /**
   * 获取区域的名称
   * @param regionId
   * @returns {Promise.<*>}
   */
  getRegionName(regionId) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return _this3.where({ id: regionId }).getField('name', true);
    })();
  }

  /**
   * 获取下级的地区列表
   * @param parentId
   * @returns {Promise.<*>}
   */
  getRegionList(parentId) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return _this4.where({ parent_id: parentId }).select();
    })();
  }

  /**
   * 获取区域的信息
   * @param regionId
   * @returns {Promise.<*>}
   */
  getRegionInfo(regionId) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      return _this5.where({ id: regionId }).find();
    })();
  }
};
//# sourceMappingURL=region.js.map