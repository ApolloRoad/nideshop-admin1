function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const rp = require('request-promise');

module.exports = class extends Base {
  loginByWeixinAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const code = _this.post('code');
      const fullUserInfo = _this.post('userInfo');
      const userInfo = fullUserInfo.userInfo;
      const clientIp = ''; // 暂时不记录 ip

      // 获取openid
      const options = {
        method: 'GET',
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        qs: {
          grant_type: 'authorization_code',
          js_code: code,
          secret: think.config('weixin.secret'),
          appid: think.config('weixin.appid')
        }
      };

      let sessionData = yield rp(options);
      sessionData = JSON.parse(sessionData);
      if (!sessionData.openid) {
        return _this.fail('登录失败');
      }

      // 验证用户信息完整性
      const crypto = require('crypto');
      const sha1 = crypto.createHash('sha1').update(fullUserInfo.rawData + sessionData.session_key).digest('hex');
      if (fullUserInfo.signature !== sha1) {
        return _this.fail('登录失败');
      }

      // 解释用户数据
      const WeixinSerivce = _this.service('weixin', 'api');
      const weixinUserInfo = yield WeixinSerivce.decryptUserInfoData(sessionData.session_key, fullUserInfo.encryptedData, fullUserInfo.iv);
      if (think.isEmpty(weixinUserInfo)) {
        return _this.fail('登录失败');
      }

      // 根据openid查找用户是否已经注册
      let userId = yield _this.model('user').where({ weixin_openid: sessionData.openid }).getField('id', true);
      if (think.isEmpty(userId)) {
        // 注册
        userId = yield _this.model('user').add({
          username: '微信用户' + think.uuid(6),
          password: sessionData.openid,
          register_time: parseInt(new Date().getTime() / 1000),
          register_ip: clientIp,
          last_login_time: parseInt(new Date().getTime() / 1000),
          last_login_ip: clientIp,
          mobile: '',
          weixin_openid: sessionData.openid,
          avatar: userInfo.avatarUrl || '',
          gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
          nickname: userInfo.nickName
        });
      }

      sessionData.user_id = userId;

      // 查询用户信息
      const newUserInfo = yield _this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: userId }).find();

      // 更新登录信息
      userId = yield _this.model('user').where({ id: userId }).update({
        last_login_time: parseInt(new Date().getTime() / 1000),
        last_login_ip: clientIp
      });

      const TokenSerivce = _this.service('token', 'api');
      const sessionKey = yield TokenSerivce.create(sessionData);

      if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
        return _this.fail('登录失败');
      }

      return _this.success({ token: sessionKey, userInfo: newUserInfo });
    })();
  }

  logoutAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return _this2.success();
    })();
  }
};
//# sourceMappingURL=auth.js.map