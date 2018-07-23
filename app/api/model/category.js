function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class extends think.Model {
  getChildCategoryId(parentId) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const childIds = yield _this.where({ parent_id: parentId }).getField('id', 10000);
      return childIds;
    })();
  }

  getCategoryWhereIn(categoryId) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const childIds = yield _this2.getChildCategoryId(categoryId);
      childIds.push(categoryId);
      return childIds;
    })();
  }
};
//# sourceMappingURL=category.js.map