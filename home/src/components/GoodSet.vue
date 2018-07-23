<template>
  <div class="goodset">
        <p>商品管理-所有商品</p>
          <div style="margin-bottom: 20px;">
          <el-button
            size="small"
            @click="addTab(goodList.length)"
          >
            添加商品
          </el-button>
        </div>
          <el-dialog title="添加商品" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="新增商品id" :label-width="formLabelWidth">
                <el-input v-model="form.id" auto-complete="off"  disabled readonly ></el-input>
              </el-form-item>
              <el-form-item label="商品名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="商品简介" :label-width="formLabelWidth">
                <el-input v-model="form.goods_brief" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="所属分类id" :label-width="formLabelWidth">
                <el-input v-model="form.category_id" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="商品单价" :label-width="formLabelWidth">
                <el-input v-model="form.retail_price" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="商品列表图片(单张，最佳尺寸750px*750px,等宽高)" :label-width="formLabelWidth">
                <Uploadimg @getImageUrl="getImageUrl" :goodId="goodsMax+1"/>
              </el-form-item>

              <el-form-item label="商品详情图片(多张,尺寸宽750px,高不限，大小2M以内)" :label-width="formLabelWidth">
                <Uploadimg v-for="todo in form.Uploadimg1" :key="todo" @getImageUrl="pushImageUrl"/>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogForm(true)">确 定</el-button>
            </div>
          </el-dialog>

        <GoodLists @getGoodList="getGoodList" :goodList="goodList" :gooddel="gooddel"/>

        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>请确保所有内容已经填写完整，保存后不可修改只能删除。。（尤其检查所属分类id是否对应）</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisibleCoifm(true)">确 定</el-button>
            </span>
          </el-dialog>
  </div>

</template>

<script>
import Uploadimg from './Uploadimg.vue'
import GoodLists from './GoodLists.vue'

export default {
    name:'GoodSet',
    components: {
      Uploadimg,
      GoodLists
    },
    data() {
      return {
        imageUrl: '',
        tabIndex: 2,
        goodList: [],
        gooddel:true,
        goods_desc: null,
        goodsMax: null,
        dialogFormVisible: false,
        dialogVisible: false,
        form: {
          id:'',
          name: '',
          goods_brief:'',
          category_id:'',
          retail_price:'',
          list_pic_url:'',
          Uploadimg1: [1],
        },
        formLabelWidth: '200px',
      }
    },
    created:function() {
      this.getGoodList();

      /*const This = this;
      this.axios.get('http://127.0.0.1:8360/api/adminSet/adminList').then((response) => {
          This.items = response.data.data.data;
          Console.log(response.data.data.data);
        });*/
    },
    methods: {
      getGoodList(){
        const This = this;
        This.axios.get(This.config2.apis + 'adminGoods').then((response) => {
              const oData = response.data.data;
              This.goodsMax = oData.goodsMax;
              This.goodList = oData.goodsList.data;
          })
      },
      dialogVisibleCoifm(type) {
        const This = this;
        if(type)
        {
          This.axios.post(This.config2.apis + 'adminAddGood',{forms:This.form}).then((response) => {
            if (response.data.data > 0)
            {
              This.dialogFormVisible = This.dialogVisible = false;
              this.getGoodList();
            }
          })
          
        }
      },
      dialogForm(type) {
        if(type)
        {
          this.dialogVisible = true;
        }
        
      },
      pushImageUrl(name) {
        this.form.Uploadimg1.push(name);
      },
      getImageUrl(attr) {
        this.form.list_pic_url = attr;
      },
      addTab() {
        const This = this;
        This.form.id = This.goodsMax + 1;
        This.dialogFormVisible = true;
        
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .goodInfo img{max-width: 100px;border:1px solid #ccc;vertical-align: text-top;}
  .goodHtml {font-size: 14px;padding-bottom: 0px !important;}
  .goodLists .el-collapse-item__content{padding-bottom:0px;font-size: 14px}

</style>
