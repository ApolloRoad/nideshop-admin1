<template>
    <div class="goodLists">
        <el-collapse accordion>
          <el-collapse-item v-for="item in goodList" v-bind:key="item.id">
            <template slot="title">
              <p class="orderTit">
                <span>商品id: {{item.id}}</span>
                <span>名称:{{item.name}}</span>
                <span>所属分类id：{{item.category_id}}</span>
                <span>单价：{{item.retail_price}}</span>
              </p>
            </template>
            <div class="goodInfo">
              <p class="orderTit">
                <span>简介：{{item.goods_brief}}</span>
                <span>操作:  
                      <Delete v-if="isDel" @adminDelGood="adminDelGood" :goodId="item.id"/>
                </span>
              </p>
              <div>
                列表页图片:<img :src="item.list_pic_url" alt="">
              </div>
              <div>
                  商品详情图片：
                <div v-html="item.goods_desc" class="goodHtml">
                  </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import Delete from './Delete.vue'

    export default {
        name:'GoodLists',
        components: {
          Delete
        },
        props:{
          goodList:Array,
          gooddel:null
        },
        data() {
          return {
            isDel:false
          }
        },
        created:function() {
          if (this.gooddel)
          {
            this.isDel = true;
          }
        },
        methods: {
            adminDelGood(id) {
              const This = this;
              This.axios.get(This.config2.apis + 'adminDelGood/?goodId=' + id).then((response) => {
                  if (response.data.data === 1)
                  {
                    this.$emit('getGoodList');
                  }
                })
            }
        }
    }
</script>