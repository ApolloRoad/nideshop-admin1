function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const jwt = require('jsonwebtoken');
const secret = 'SLDLKKDS323ssdd@#@@gf';

module.exports = class extends think.Service {
  /**
   * 根据header中的X-Nideshop-Token值获取用户id
   */
  getUserId() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const token = think.token;
      if (!token) {
        return 0;
      }

      const result = yield _this.parse();
      if (think.isEmpty(result) || result.user_id <= 0) {
        return 0;
      }

      return result.user_id;
    })();
  }

  /**
   * 根据值获取用户信息
   */
  getUserInfo() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const userId = yield _this2.getUserId();
      if (userId <= 0) {
        return null;
      }

      const userInfo = yield _this2.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: userId }).find();

      return think.isEmpty(userInfo) ? null : userInfo;
    })();
  }

  create(userInfo) {
    return _asyncToGenerator(function* () {
      const token = jwt.sign(userInfo, secret);
      return token;
    })();
  }

  parse() {
    return _asyncToGenerator(function* () {
      if (think.token) {
        try {
          return jwt.verify(think.token, secret);
        } catch (err) {
          return null;
        }
      }
      return null;
    })();
  }

  verify() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const result = yield _this3.parse();
      if (think.isEmpty(result)) {
        return false;
      }

      return true;
    })();
  }
};
//# sourceMappingURL=token.js.map