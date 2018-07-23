function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  loginAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const username = _this.post('username');
      const password = _this.post('password');

      const admin = yield _this.model('admin').where({ username: username }).find();
      if (think.isEmpty(admin)) {
        return _this.fail(401, '用户名或密码不正确1');
      }

      if (think.md5(password + '' + admin.password_salt) !== admin.password) {
        return _this.fail(400, '用户名或密码不正确2');
      }

      // 更新登录信息
      yield _this.model('admin').where({ id: admin.id }).update({
        last_login_time: parseInt(Date.now() / 1000),
        last_login_ip: _this.ctx.ip
      });

      const TokenSerivce = _this.service('token', 'admin');
      const sessionKey = yield TokenSerivce.create({
        user_id: admin.id
      });

      if (think.isEmpty(sessionKey)) {
        return _this.fail('登录失败');
      }

      const userInfo = {
        id: admin.id,
        username: admin.username,
        avatar: admin.avatar,
        admin_role_id: admin.admin_role_id
      };

      return _this.success({ token: sessionKey, userInfo: userInfo });
    })();
  }
};
//# sourceMappingURL=auth.js.map