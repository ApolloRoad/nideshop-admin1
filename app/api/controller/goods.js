function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const model = _this.model('goods');
      const goodsList = yield model.select();

      return _this.success(goodsList);
    })();
  }

  /**
   * 获取sku信息，用于购物车编辑时选择规格
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  skuAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const goodsId = _this2.get('id');
      const model = _this2.model('goods');

      return _this2.success({
        specificationList: yield model.getSpecificationList(goodsId),
        productList: yield model.getProductList(goodsId)
      });
    })();
  }

  /**
   * 商品详情页数据
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  detailAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const goodsId = _this3.get('id');
      const model = _this3.model('goods');

      const info = yield model.where({ 'id': goodsId }).find();
      const gallery = yield _this3.model('goods_gallery').where({ goods_id: goodsId }).limit(4).select();
      const attribute = yield _this3.model('goods_attribute').field('nideshop_goods_attribute.value, nideshop_attribute.name').join('nideshop_attribute ON nideshop_goods_attribute.attribute_id=nideshop_attribute.id').order({ 'nideshop_goods_attribute.id': 'asc' }).where({ 'nideshop_goods_attribute.goods_id': goodsId }).select();
      const issue = yield _this3.model('goods_issue').select();
      const brand = yield _this3.model('brand').where({ id: info.brand_id }).find();
      const commentCount = yield _this3.model('comment').where({ value_id: goodsId, type_id: 0 }).count();
      const hotComment = yield _this3.model('comment').where({ value_id: goodsId, type_id: 0 }).find();
      let commentInfo = {};
      if (!think.isEmpty(hotComment)) {
        const commentUser = yield _this3.model('user').field(['nickname', 'username', 'avatar']).where({ id: hotComment.user_id }).find();
        commentInfo = {
          content: Buffer.from(hotComment.content, 'base64').toString(),
          add_time: think.datetime(new Date(hotComment.add_time * 1000)),
          nickname: commentUser.nickname,
          avatar: commentUser.avatar,
          pic_list: yield _this3.model('comment_picture').where({ comment_id: hotComment.id }).select()
        };
      }

      const comment = {
        count: commentCount,
        data: commentInfo
      };

      // 当前用户是否收藏
      const userHasCollect = yield _this3.model('collect').isUserHasCollect(think.userId, 0, goodsId);

      // 记录用户的足迹 TODO
      yield yield _this3.model('footprint').addFootprint(think.userId, goodsId);

      // return this.json(jsonData);
      return _this3.success({
        info: info,
        gallery: gallery,
        attribute: attribute,
        userHasCollect: userHasCollect,
        issue: issue,
        comment: comment,
        brand: brand,
        specificationList: yield model.getSpecificationList(goodsId),
        productList: yield model.getProductList(goodsId)
      });
    })();
  }

  /**
   * 获取分类下的商品
   * @returns {Promise.<*>}
   */
  categoryAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const model = _this4.model('category');
      const currentCategory = yield model.where({ id: _this4.get('id') }).find();
      const parentCategory = yield model.where({ id: currentCategory.parent_id }).find();
      const brotherCategory = yield model.where({ parent_id: currentCategory.parent_id }).select();

      return _this4.success({
        currentCategory: currentCategory,
        parentCategory: parentCategory,
        brotherCategory: brotherCategory
      });
    })();
  }

  /**
   * 获取商品列表
   * @returns {Promise.<*>}
   */
  listAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const categoryId = _this5.get('categoryId');
      const brandId = _this5.get('brandId');
      const keyword = _this5.get('keyword');
      const isNew = _this5.get('isNew');
      const isHot = _this5.get('isHot');
      const page = _this5.get('page');
      const size = _this5.get('size');
      const sort = _this5.get('sort');
      const order = _this5.get('order');

      const goodsQuery = _this5.model('goods');

      const whereMap = {};
      if (!think.isEmpty(isNew)) {
        whereMap.is_new = isNew;
      }

      if (!think.isEmpty(isHot)) {
        whereMap.is_hot = isHot;
      }

      if (!think.isEmpty(keyword)) {
        whereMap.name = ['like', `%${keyword}%`];
        // 添加到搜索历史
        yield _this5.model('search_history').add({
          keyword: keyword,
          user_id: think.userId,
          add_time: parseInt(new Date().getTime() / 1000)
        });
      }

      if (!think.isEmpty(brandId)) {
        whereMap.brand_id = brandId;
      }

      // 排序
      let orderMap = {};
      if (sort === 'price') {
        // 按价格
        orderMap = {
          retail_price: order
        };
      } else {
        // 按商品添加时间
        orderMap = {
          id: 'desc'
        };
      }

      // 筛选的分类
      let filterCategory = [{
        'id': 0,
        'name': '全部',
        'checked': false
      }];

      const categoryIds = yield goodsQuery.where(whereMap).getField('category_id', 10000);
      if (!think.isEmpty(categoryIds)) {
        // 查找二级分类的parent_id
        const parentIds = yield _this5.model('category').where({ id: { 'in': categoryIds } }).getField('parent_id', 10000);
        // 一级分类
        const parentCategory = yield _this5.model('category').field(['id', 'name']).order({ 'sort_order': 'asc' }).where({ 'id': { 'in': parentIds } }).select();

        if (!think.isEmpty(parentCategory)) {
          filterCategory = filterCategory.concat(parentCategory);
        }
      }

      // 加入分类条件
      if (!think.isEmpty(categoryId) && parseInt(categoryId) > 0) {
        whereMap.category_id = ['in', yield _this5.model('category').getCategoryWhereIn(categoryId)];
      }

      // 搜索到的商品
      const goodsData = yield goodsQuery.where(whereMap).field(['id', 'name', 'list_pic_url', 'retail_price', 'goods_brief']).order(orderMap).page(page, size).countSelect();
      goodsData.filterCategory = filterCategory.map(function (v) {
        v.checked = think.isEmpty(categoryId) && v.id === 0 || v.id === parseInt(categoryId);
        return v;
      });
      goodsData.goodsList = goodsData.data;

      return _this5.success(goodsData);
    })();
  }

  /**
   * 商品列表筛选的分类列表
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  filterAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const categoryId = _this6.get('categoryId');
      const keyword = _this6.get('keyword');
      const isNew = _this6.get('isNew');
      const isHot = _this6.get('isHot');

      const goodsQuery = _this6.model('goods');

      if (!think.isEmpty(categoryId)) {
        goodsQuery.where({ category_id: { 'in': yield _this6.model('category').getChildCategoryId(categoryId) } });
      }

      if (!think.isEmpty(isNew)) {
        goodsQuery.where({ is_new: isNew });
      }

      if (!think.isEmpty(isHot)) {
        goodsQuery.where({ is_hot: isHot });
      }

      if (!think.isEmpty(keyword)) {
        goodsQuery.where({ name: { 'like': `%${keyword}%` } });
      }

      let filterCategory = [{
        'id': 0,
        'name': '全部'
      }];

      // 二级分类id
      const categoryIds = yield goodsQuery.getField('category_id', 10000);
      if (!think.isEmpty(categoryIds)) {
        // 查找二级分类的parent_id
        const parentIds = yield _this6.model('category').where({ id: { 'in': categoryIds } }).getField('parent_id', 10000);
        // 一级分类
        const parentCategory = yield _this6.model('category').field(['id', 'name']).order({ 'sort_order': 'asc' }).where({ 'id': { 'in': parentIds } }).select();

        if (!think.isEmpty(parentCategory)) {
          filterCategory = filterCategory.concat(parentCategory);
        }
      }

      return _this6.success(filterCategory);
    })();
  }

  /**
   * 新品首发
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  newAction() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      return _this7.success({
        bannerInfo: {
          url: '',
          name: '坚持初心，为你寻觅世间好物',
          img_url: 'http://yanxuan.nosdn.127.net/8976116db321744084774643a933c5ce.png'
        }
      });
    })();
  }

  /**
   * 人气推荐
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  hotAction() {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      return _this8.success({
        bannerInfo: {
          url: '',
          name: '大家都在买的严选好物',
          img_url: 'http://yanxuan.nosdn.127.net/8976116db321744084774643a933c5ce.png'
        }
      });
    })();
  }

  /**
   * 商品详情页的大家都在看的商品
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  relatedAction() {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      // 大家都在看商品,取出关联表的商品，如果没有则随机取同分类下的商品
      const model = _this9.model('goods');
      const goodsId = _this9.get('id');
      const relatedGoodsIds = yield _this9.model('related_goods').where({ goods_id: goodsId }).getField('related_goods_id');
      let relatedGoods = null;
      if (think.isEmpty(relatedGoodsIds)) {
        // 查找同分类下的商品
        const goodsCategory = yield model.where({ id: goodsId }).find();
        relatedGoods = yield model.where({ category_id: goodsCategory.category_id }).field(['id', 'name', 'list_pic_url', 'retail_price']).limit(8).select();
      } else {
        relatedGoods = yield model.where({ id: ['IN', relatedGoodsIds] }).field(['id', 'name', 'list_pic_url', 'retail_price']).select();
      }

      return _this9.success({
        goodsList: relatedGoods
      });
    })();
  }

  /**
   * 在售的商品总数
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  countAction() {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      const goodsCount = yield _this10.model('goods').where({ is_delete: 0, is_on_sale: 1 }).count('id');

      return _this10.success({
        goodsCount: goodsCount
      });
    })();
  }
};
//# sourceMappingURL=goods.js.map