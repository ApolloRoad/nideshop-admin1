function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const fs = require('fs');
const _ = require('lodash');

module.exports = class extends Base {
  infoAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const userInfo = yield _this.model('user').where({ mobile: '15989389319' }).find();
      delete userInfo.password;
      return _this.json(userInfo);
    })();
  }

  /**
   * 保存用户头像
   * @returns {Promise.<void>}
   */
  saveAvatarAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const avatar = _this2.file('avatar');
      if (think.isEmpty(avatar)) {
        return _this2.fail('保存失败');
      }

      const avatarPath = think.RESOURCE_PATH + '/static/user/avatar/1.' + _.last(_.split(avatar.path, '.'));

      fs.rename(avatar.path, avatarPath, function (res) {
        return this.success();
      });
    })();
  }
};
//# sourceMappingURL=user.js.map