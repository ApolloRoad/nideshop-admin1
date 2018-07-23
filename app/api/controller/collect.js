function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const typeId = _this.get('typeId');

      const list = yield _this.model('collect').field(['c.*', 'g.name', 'g.list_pic_url', 'g.goods_brief', 'g.retail_price']).alias('c').join({
        table: 'goods',
        join: 'left',
        as: 'g',
        on: ['c.value_id', 'g.id']
      }).where({ user_id: think.userId, type_id: parseInt(typeId) }).countSelect();

      return _this.success(list);
    })();
  }

  addordeleteAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const typeId = _this2.post('typeId');
      const valueId = _this2.post('valueId');

      const collect = yield _this2.model('collect').where({ type_id: typeId, value_id: valueId, user_id: think.userId }).find();
      let collectRes = null;
      let handleType = 'add';
      if (think.isEmpty(collect)) {
        // 添加收藏
        collectRes = yield _this2.model('collect').add({
          type_id: typeId,
          value_id: valueId,
          user_id: think.userId,
          add_time: parseInt(new Date().getTime() / 1000)
        });
      } else {
        // 取消收藏
        collectRes = yield _this2.model('collect').where({ id: collect.id }).delete();
        handleType = 'delete';
      }

      if (collectRes > 0) {
        return _this2.success({ type: handleType });
      }

      return _this2.fail('操作失败');
    })();
  }
};
//# sourceMappingURL=collect.js.map