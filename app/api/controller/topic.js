function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const model = _this.model('topic');
      const data = yield model.field(['id', 'title', 'price_info', 'scene_pic_url', 'subtitle']).page(_this.get('page') || 1, _this.get('size') || 10).countSelect();

      return _this.success(data);
    })();
  }

  detailAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const model = _this2.model('topic');
      const data = yield model.where({ id: _this2.get('id') }).find();

      return _this2.success(data);
    })();
  }

  relatedAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const model = _this3.model('topic');
      const data = yield model.field(['id', 'title', 'price_info', 'scene_pic_url', 'subtitle']).limit(4).select();

      return _this3.success(data);
    })();
  }
};
//# sourceMappingURL=topic.js.map