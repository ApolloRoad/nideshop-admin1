function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class extends think.Model {
  /**
   * 判断用户是否收藏过该对象
   * @param userId
   * @param typeId
   * @param valueId
   * @returns {Promise.<boolean>}
   */
  isUserHasCollect(userId, typeId, valueId) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const hasCollect = yield _this.where({ type_id: typeId, value_id: valueId, user_id: userId }).limit(1).count('id');
      return hasCollect;
    })();
  }
};
//# sourceMappingURL=collect.js.map