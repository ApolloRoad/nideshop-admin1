/* eslint-disable no-multi-spaces */
const fs = require('fs');
const path = require('path');
const rename = think.promisify(fs.rename, fs); // 通过 promisify 方法把 rename 方法包装成 Promise 接口
module.exports = class extends think.Controller {
	//分类查询修改删除
	async admincategorySetAction() {
		const oPost = this.post('oPost');
		let result = null;
		if(oPost.type == 'chack')
		{
			const goodsMax = await this.model('category').max('id'); //最大分类 id
			const res = await this.model('category').where({ parent_id: '1005000' }).page(1, 100).countSelect();
			result = {res:res,goodsMax:goodsMax};
		}
		else if(oPost.type == 'add')
		{
			const sues = await this.model('category').add(oPost.objs);
			result = sues;
		}
		else if(oPost.type == 'del')
		{
			const oId = oPost.oId;
			const deleteInfo = await this.model('category').where({ id: oId }).delete();
    		result = deleteInfo;
		}
		else if(oPost.type == 'checkgoods')
		{
			const goodsList = await this.model('goods').where({ category_id: oPost.categoryId }).page(1, 100).countSelect();
			result = goodsList;
		}

		return this.success(result);
	}
	//添加商品
	async adminAddGoodAction() {
		const goodObj = this.post('forms');
		goodObj.list_pic_url = this.config('rootStatic') + goodObj.list_pic_url;
		goodObj.goods_sn = goodObj.id;
		let str = '';
		for(var i = 1 ; i< goodObj.Uploadimg1.length ;i++)
		{
			str += "<p><img src='" + this.config('rootStatic') + goodObj.Uploadimg1[i] + "' _src='" + this.config('rootStatic') + goodObj.Uploadimg1[i] + "' /></p>";
		}
		str += "<p><br/></p>";
		goodObj.goods_desc = str;
		goodObj.goods_number = 1000;
		delete goodObj.Uploadimg1;

		const goodSet = await this.model('goods').add(goodObj);
		//product
		const productId = await this.model('product').max('id') + 1;
		const sobj = {
			id:productId,
			goods_id: goodObj.id,
			goods_sn: goodObj.id,
			goods_number: 1000,
			retail_price: goodObj.retail_price
		}
		const sues = await this.model('product').add(sobj);
		return this.success(sues);
	}

	//删除商品
	async adminDelGoodAction() {
		const goodId = this.get('goodId');
		const deleteInfo = await this.model('goods').where({ id: goodId }).delete();
    	return this.success(deleteInfo);
	}
	//商品查询
	async adminGoodsAction() {
		const goodsMax = await this.model('goods').max('id'); //最大good id
		const goodsList = await this.model('goods').page(1, 100).countSelect();
		return this.success({goodsMax:goodsMax,goodsList:goodsList});
	}
	//上传图片
	async adminUploadAction() {
		const thisId = this.post('id');
		const file = this.file('file');
		const name = file.path.split('temp\\')[1];
		const filepath = path.join(think.ROOT_PATH, 'www/static/upload/'+name);
		const filesName =  filepath.split("upload\\")[1];
	      //think.mkdir(path.dirname(filepath));
	      await rename(file.path, filepath);
	    if(thisId !== 'undefined')
	    {
	    	const galleryMax = await this.model('goods_gallery').max('id');
	   		await this.model('goods_gallery').add({id:galleryMax + 1, goods_id: thisId,img_url: this.config('rootStatic') + filesName,sort_order:5});
	    }
	    
		return this.success({fileName:filepath});
	}

	//所有订单
	async adminListAction() {
    const orderList = await this.model('order').page(1, 10000).countSelect();
    const newOrderList = [];
    for (const item of orderList.data) {
      // 订单的商品
      item.goodsList = await this.model('order_goods').where({ order_id: item.id }).select();
      item.goodsCount = 0;
      item.goodsList.forEach(v => {
        item.goodsCount += v.number;
      });

      // 订单状态的处理
      item.order_status_text = await this.model('order').getOrderStatusText(item.id);

      // 可操作的选项
      item.handleOption = await this.model('order').getOrderHandleOption(item.id);

      newOrderList.push(item);
    }
    orderList.data = newOrderList;

    return this.success(orderList);
  }
}