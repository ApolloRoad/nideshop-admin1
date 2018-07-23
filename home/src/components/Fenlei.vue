<template>
  <div class="goodset">
        <p>分类管理</p>
          <div style="margin-bottom: 20px;">
          <el-button
            size="small"
            @click="addTab(editableTabsValue2)"
          >
            添加分类
          </el-button>
        </div>
        <el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTabCon" @tab-click="changeTab">
          <el-tab-pane
            v-for="item in editableTabs2"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
          </el-tab-pane>
        </el-tabs>
        <p>当前分类id {{nnn}}</p>
        <GoodLists  :goodList="goodList"/>


        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <span>删除分类之前请确认该分类下商品已删除，不可恢复。</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="removeTabFn">确 定</el-button>
          </span>
        </el-dialog>

  </div>

</template>

<script>
import GoodLists from './GoodLists.vue'

export default {
  name:'Fenlei',
  components: {
      GoodLists
    },
    data() {
      return {
        dialogVisible: false,
        editableTabsValue2: '1',
        editableTabs2: [],
        tabIndex: 2,
        goodList:null,
        nnn:null,
        goodsMax:null,
        targetName:null
      }
    },
    created:function() {
      this.getFenName();
      /*const This = this;
      this.axios.get('http://127.0.0.1:8360/api/adminSet/adminList').then((response) => {
          This.items = response.data.data.data;
          Console.log(response.data.data.data);
        });*/
    },
    methods: {
      changeTab(e) {
        this.nnn = this.editableTabs2[e.name - 1].id
        this.getList(this.nnn);
      },
      getList(id) {
        const This = this;
          This.axios.post(This.config2.apis + 'admincategorySet',{oPost:{type:'checkgoods',categoryId:id}}).then((response) => {

          This.goodList = response.data.data.data
        });
      },
      getFenName() {
        const This = this;
        This.axios.post(This.config2.apis + 'admincategorySet',{oPost:{type:'chack'}}).then((response) => {
          const oArr = response.data.data.res.data;
          this.goodsMax = response.data.data.goodsMax;
          for(var i=0;i<oArr.length;i++)
          {
            This.editableTabs2.push({
              title: oArr[i].name,
              name: String(i+1),
              id: String(oArr[i].id)
            })
          }
          This.nnn = This.editableTabs2[0].id;
          setTimeout(() =>{
              This.getList(This.editableTabs2[0].id);
          },1000)
        });
      },
      addFenlei() {
        const This = this;
        const obj = This.editableTabs2[This.editableTabs2.length-1];
        const objA = {
          id: obj.id,
          name: obj.title,
          front_desc: obj.title,
          sort_order: This.editableTabs2.length,
          front_name: obj.title,
          parent_id: 1005000
        }
        This.axios.post(This.config2.apis + 'admincategorySet',{oPost:{type:'add',objs:objA}}).then((response) => {
          if(response.data.data)
          {
            This.goodsMax = This.goodsMax + 1;
          }
        });
      },
      addTab() {
        const This = this;
        let newTabName = ++this.tabIndex + '';
        This.$prompt('请输入分类名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          This.editableTabs2.push({
            title: value,
            name: newTabName,
            id: This.goodsMax + 1
          });
        }).then(() => {
            This.addFenlei();
        })
        
        //This.editableTabsValue2 = newTabName;
      },
      handleClose() {

      },
      removeTabCon(targetName) {
        this.targetName = targetName;
        this.dialogVisible = true;
      },
      removeTabFn() {
        const This = this;
        const oId = this.editableTabs2[this.targetName - 1].id;
        This.axios.post(This.config2.apis + 'admincategorySet',{oPost:{type:'del',oId:oId}}).then((response) => {
          if(response.data.data)
          {
            console.log('删除成功');
            This.dialogVisible = false;
            This.removeTab(this.targetName);
          }
        });
      },
      removeTab(targetName) {
        let tabs = this.editableTabs2;
        let activeName = this.editableTabsValue2;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue2 = activeName;
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
