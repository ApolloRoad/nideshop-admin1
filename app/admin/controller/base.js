function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class extends think.Controller {
  __before() {
    var _this = this;

    return _asyncToGenerator(function* () {
      // 根据token值获取用户id
      think.token = _this.ctx.header['x-nideshop-token'] || '';
      const tokenSerivce = think.service('token', 'admin');
      think.userId = yield tokenSerivce.getUserId();

      // 只允许登录操作
      if (_this.ctx.controller !== 'auth') {
        if (think.userId <= 0) {
          return _this.fail(401, '请先登录');
        }
      }
    })();
  }
};
//# sourceMappingURL=base.js.map