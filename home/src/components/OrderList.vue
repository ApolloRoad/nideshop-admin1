<template>
  <div>
    <p>订单列表</p>

    <el-collapse accordion>
      <el-collapse-item v-for="item in items" v-bind:key="item.order_sn">
        <template slot="title">
          <p class="orderTit">
            <span>订单号：{{item.order_sn}}</span>
            <span>订单总价：{{item.order_price}}元</span>
            <span>订单状态 : <span class="orderType">{{item.order_status_text}}</span></span>
          </p>
        </template>
        <div class="orderInfo">
          <p class="orderTit">
            <span>收货人：{{item.consignee}}</span> 
            <span>手机号码：{{item.mobile}}</span>
            <span>收货地址: {{item.address}}</span>
          </p>

          <div class="goodList">
              <p class="glist orderTit" v-for="item2 in item.goodsList" v-bind:key="item2.goods_id">
                <span>商品id：{{item2.goods_id}}</span>
                <span>名称：{{item2.goods_name}}</span>
                <span>单价：{{item2.retail_price}}</span>
                <span>数量：{{item2.number}}</span>
              </p>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>


  </div>
</template>

<script>
export default {
  name: 'OrderList',
  data () {
    return {
        items:[],
        activeNames: ['1']
      };
  },
  created:function() {
    const This = this;
    this.axios.get('http://127.0.0.1:8360/api/adminSet/adminList').then((response) => {
        This.items = response.data.data.data;
      });
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
