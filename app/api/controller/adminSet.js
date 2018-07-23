function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable no-multi-spaces */
const fs = require('fs');
const path = require('path');
const rename = think.promisify(fs.rename, fs); // 通过 promisify 方法把 rename 方法包装成 Promise 接口
module.exports = class extends think.Controller {
	//分类查询修改删除
	admincategorySetAction() {
		var _this = this;

		return _asyncToGenerator(function* () {
			const oPost = _this.post('oPost');
			let result = null;
			if (oPost.type == 'chack') {
				const goodsMax = yield _this.model('category').max('id'); //最大分类 id
				const res = yield _this.model('category').where({ parent_id: '1005000' }).page(1, 100).countSelect();
				result = { res: res, goodsMax: goodsMax };
			} else if (oPost.type == 'add') {
				const sues = yield _this.model('category').add(oPost.objs);
				result = sues;
			} else if (oPost.type == 'del') {
				const oId = oPost.oId;
				const deleteInfo = yield _this.model('category').where({ id: oId }).delete();
				result = deleteInfo;
			} else if (oPost.type == 'checkgoods') {
				const goodsList = yield _this.model('goods').where({ category_id: oPost.categoryId }).page(1, 100).countSelect();
				result = goodsList;
			}

			return _this.success(result);
		})();
	}
	//添加商品
	adminAddGoodAction() {
		var _this2 = this;

		return _asyncToGenerator(function* () {
			const goodObj = _this2.post('forms');
			goodObj.list_pic_url = _this2.config('rootStatic') + goodObj.list_pic_url;
			goodObj.goods_sn = goodObj.id;
			let str = '';
			for (var i = 1; i < goodObj.Uploadimg1.length; i++) {
				str += "<p><img src='" + _this2.config('rootStatic') + goodObj.Uploadimg1[i] + "' _src='" + _this2.config('rootStatic') + goodObj.Uploadimg1[i] + "' /></p>";
			}
			str += "<p><br/></p>";
			goodObj.goods_desc = str;
			goodObj.goods_number = 1000;
			delete goodObj.Uploadimg1;

			const goodSet = yield _this2.model('goods').add(goodObj);
			//product
			const productId = (yield _this2.model('product').max('id')) + 1;
			const sobj = {
				id: productId,
				goods_id: goodObj.id,
				goods_sn: goodObj.id,
				goods_number: 1000,
				retail_price: goodObj.retail_price
			};
			const sues = yield _this2.model('product').add(sobj);
			return _this2.success(sues);
		})();
	}

	//删除商品
	adminDelGoodAction() {
		var _this3 = this;

		return _asyncToGenerator(function* () {
			const goodId = _this3.get('goodId');
			const deleteInfo = yield _this3.model('goods').where({ id: goodId }).delete();
			return _this3.success(deleteInfo);
		})();
	}
	//商品查询
	adminGoodsAction() {
		var _this4 = this;

		return _asyncToGenerator(function* () {
			const goodsMax = yield _this4.model('goods').max('id'); //最大good id
			const goodsList = yield _this4.model('goods').page(1, 100).countSelect();
			return _this4.success({ goodsMax: goodsMax, goodsList: goodsList });
		})();
	}
	//上传图片
	adminUploadAction() {
		var _this5 = this;

		return _asyncToGenerator(function* () {
			const thisId = _this5.post('id');
			const file = _this5.file('file');
			const name = file.path.split('temp\\')[1];
			const filepath = path.join(think.ROOT_PATH, 'www/static/upload/' + name);
			const filesName = filepath.split("upload\\")[1];
			//think.mkdir(path.dirname(filepath));
			yield rename(file.path, filepath);
			if (thisId !== 'undefined') {
				const galleryMax = yield _this5.model('goods_gallery').max('id');
				yield _this5.model('goods_gallery').add({ id: galleryMax + 1, goods_id: thisId, img_url: _this5.config('rootStatic') + filesName, sort_order: 5 });
			}

			return _this5.success({ fileName: filepath });
		})();
	}

	//所有订单
	adminListAction() {
		var _this6 = this;

		return _asyncToGenerator(function* () {
			const orderList = yield _this6.model('order').page(1, 10000).countSelect();
			const newOrderList = [];
			for (const item of orderList.data) {
				// 订单的商品
				item.goodsList = yield _this6.model('order_goods').where({ order_id: item.id }).select();
				item.goodsCount = 0;
				item.goodsList.forEach(function (v) {
					item.goodsCount += v.number;
				});

				// 订单状态的处理
				item.order_status_text = yield _this6.model('order').getOrderStatusText(item.id);

				// 可操作的选项
				item.handleOption = yield _this6.model('order').getOrderHandleOption(item.id);

				newOrderList.push(item);
			}
			orderList.data = newOrderList;

			return _this6.success(orderList);
		})();
	}
};
//# sourceMappingURL=adminSet.js.map