function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class extends think.Model {
  addFootprint(userId, goodsId) {
    var _this = this;

    return _asyncToGenerator(function* () {
      // 用户已经登录才可以添加到足迹
      if (userId > 0 && goodsId > 0) {
        yield _this.add({
          goods_id: goodsId,
          user_id: userId,
          add_time: parseInt(Date.now() / 1000)
        });
      }
    })();
  }
};
//# sourceMappingURL=footprint.js.map