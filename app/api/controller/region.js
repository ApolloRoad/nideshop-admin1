function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  infoAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const region = yield _this.model('region').getRegionInfo(_this.get('regionId'));
      return _this.success(region);
    })();
  }

  listAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const regionList = yield _this2.model('region').getRegionList(_this2.get('parentId'));
      return _this2.success(regionList);
    })();
  }
};
//# sourceMappingURL=region.js.map