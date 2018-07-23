function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 评论类型说明：
   * 0 商品
   * 1 专题
   */

  /**
   * 发表评论
   * @returns {Promise.<*|PreventPromise|void|Promise>}
   */
  postAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const typeId = _this.post('typeId');
      const valueId = _this.post('valueId');
      const content = _this.post('content');
      const buffer = Buffer.from(content);
      const insertId = yield _this.model('comment').add({
        type_id: typeId,
        value_id: valueId,
        content: buffer.toString('base64'),
        add_time: _this.getTime(),
        user_id: _this.getLoginUserId()
      });

      if (insertId) {
        return _this.success('评论添加成功');
      } else {
        return _this.fail('评论保存失败');
      }
    })();
  }

  countAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const typeId = _this2.get('typeId');
      const valueId = _this2.get('valueId');

      const allCount = yield _this2.model('comment').where({ type_id: typeId, value_id: valueId }).count('id');

      const hasPicCount = yield _this2.model('comment').alias('comment').join({
        table: 'comment_picture',
        join: 'right',
        alias: 'comment_picture',
        on: ['id', 'comment_id']
      }).where({ 'comment.type_id': typeId, 'comment.value_id': valueId }).count('comment.id');

      return _this2.success({
        allCount: allCount,
        hasPicCount: hasPicCount
      });
    })();
  }

  listAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const typeId = _this3.get('typeId');
      const valueId = _this3.get('valueId');
      const showType = _this3.get('showType'); // 选择评论的类型 0 全部， 1 只显示图片

      const page = _this3.get('page');
      const size = _this3.get('size');

      let comments = [];
      if (showType !== 1) {
        comments = yield _this3.model('comment').where({
          type_id: typeId,
          value_id: valueId
        }).page(page, size).countSelect();
      } else {
        comments = yield _this3.model('comment').alias('comment').field(['comment.*']).join({
          table: 'comment_picture',
          join: 'right',
          alias: 'comment_picture',
          on: ['id', 'comment_id']
        }).page(page, size).where({ 'comment.type_id': typeId, 'comment.value_id': valueId }).countSelect();
      }

      const commentList = [];
      for (const commentItem of comments.data) {
        const comment = {};
        comment.content = Buffer.from(commentItem.content, 'base64').toString();
        comment.type_id = commentItem.type_id;
        comment.value_id = commentItem.value_id;
        comment.id = commentItem.id;
        comment.add_time = think.datetime(new Date(commentItem.add_time * 1000));
        comment.user_info = yield _this3.model('user').field(['username', 'avatar', 'nickname']).where({ id: commentItem.user_id }).find();
        comment.pic_list = yield _this3.model('comment_picture').where({ comment_id: commentItem.id }).select();
        commentList.push(comment);
      }
      comments.data = commentList;
      return _this3.success(comments);
    })();
  }
};
//# sourceMappingURL=comment.js.map