function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class extends think.Model {
  /**
   * 获取商品的product
   * @param goodsId
   * @returns {Promise.<*>}
   */
  getProductList(goodsId) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const goods = yield _this.model('product').where({ goods_id: goodsId }).select();
      return goods;
    })();
  }

  /**
   * 获取商品的规格信息
   * @param goodsId
   * @returns {Promise.<Array>}
   */
  getSpecificationList(goodsId) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      // 根据sku商品信息，查找规格值列表
      const specificationRes = yield _this2.model('goods_specification').alias('gs').field(['gs.*', 's.name']).join({
        table: 'specification',
        join: 'inner',
        as: 's',
        on: ['specification_id', 'id']
      }).where({ goods_id: goodsId }).select();

      const specificationList = [];
      const hasSpecificationList = {};
      // 按规格名称分组
      for (let i = 0; i < specificationRes.length; i++) {
        const specItem = specificationRes[i];
        if (!hasSpecificationList[specItem.specification_id]) {
          specificationList.push({
            specification_id: specItem.specification_id,
            name: specItem.name,
            valueList: [specItem]
          });
          hasSpecificationList[specItem.specification_id] = specItem;
        } else {
          for (let j = 0; j < specificationList.length; j++) {
            if (specificationList[j].specification_id === specItem.specification_id) {
              specificationList[j].valueList.push(specItem);
              break;
            }
          }
        }
      }

      return specificationList;
    })();
  }
};
//# sourceMappingURL=goods.js.map