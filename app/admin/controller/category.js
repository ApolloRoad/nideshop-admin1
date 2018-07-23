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
      const model = _this.model('category');
      const data = yield model.where({ is_show: 1 }).order(['sort_order ASC']).select();
      const topCategory = data.filter(function (item) {
        return item.parent_id === 0;
      });
      const categoryList = [];
      topCategory.map(function (item) {
        item.level = 1;
        categoryList.push(item);
        data.map(function (child) {
          if (child.parent_id === item.id) {
            child.level = 2;
            categoryList.push(child);
          }
        });
      });
      return _this.success(categoryList);
    })();
  }

  topCategoryAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const model = _this2.model('category');
      const data = yield model.where({ parent_id: 0 }).order(['id ASC']).select();

      return _this2.success(data);
    })();
  }

  infoAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const id = _this3.get('id');
      const model = _this3.model('category');
      const data = yield model.where({ id: id }).find();

      return _this3.success(data);
    })();
  }

  storeAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!_this4.isPost) {
        return false;
      }

      const values = _this4.post();
      const id = _this4.post('id');

      const model = _this4.model('category');
      values.is_show = values.is_show ? 1 : 0;
      if (id > 0) {
        yield model.where({ id: id }).update(values);
      } else {
        delete values.id;
        yield model.add(values);
      }
      return _this4.success(values);
    })();
  }

  destoryAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const id = _this5.post('id');
      yield _this5.model('category').where({ id: id }).limit(1).delete();
      // TODO 删除图片

      return _this5.success();
    })();
  }
};
//# sourceMappingURL=category.js.map