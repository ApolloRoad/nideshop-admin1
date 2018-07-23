function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取分类栏目数据
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const categoryId = _this.get('id');

      const model = _this.model('category');
      const data = yield model.limit(10).where({ parent_id: 0 }).select();

      let currentCategory = null;
      if (categoryId) {
        currentCategory = yield model.where({ 'id': categoryId }).find();
      }

      if (think.isEmpty(currentCategory)) {
        currentCategory = data[0];
      }

      // 获取子分类数据
      if (currentCategory && currentCategory.id) {
        currentCategory.subCategoryList = yield model.where({ 'parent_id': currentCategory.id }).select();
      }

      return _this.success({
        categoryList: data,
        currentCategory: currentCategory
      });
    })();
  }

  currentAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const categoryId = _this2.get('id');
      const model = _this2.model('category');

      let currentCategory = null;
      if (categoryId) {
        currentCategory = yield model.where({ 'id': categoryId }).find();
      }
      // 获取子分类数据
      if (currentCategory && currentCategory.id) {
        currentCategory.subCategoryList = yield model.where({ 'parent_id': currentCategory.id }).select();
      }

      return _this2.success({
        currentCategory: currentCategory
      });
    })();
  }
};
//# sourceMappingURL=catalog.js.map