<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <p>{{str}}</p>
    <OrderList msg="Welcome to Your Vue.js"/> -->
    <el-container>
      <el-header>
        
      </el-header>
      <el-container>
        <el-aside width="200px">
              <el-menu  class="el-menu-vertical-demo" default-active="1-2-1" @select="handselect">
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">菜单</span>
                  </template>
                  <el-submenu index="1-1">
                    <span slot="title">订单管理</span>
                    <el-menu-item index="1-1-1">所有订单</el-menu-item>
                  </el-submenu>
                  
                  <el-submenu index="1-2">
                    <span slot="title">商品管理</span>
                    <!-- <el-menu-item index="1-2-1">添加商品</el-menu-item> -->
                    <el-menu-item index="1-2-1">分类管理</el-menu-item>
                    <el-menu-item index="1-2-2">商品管理</el-menu-item>
                  </el-submenu>

                </el-submenu>
              </el-menu>
        </el-aside>
        <el-main>
            <OrderList v-if="menuKey === '1-1-1'" />
            <GoodSet  v-if="menuKey === '1-2-2'" />
            <Fenlei  v-if="menuKey === '1-2-1'" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import OrderList from './components/OrderList.vue'
import GoodSet from './components/GoodSet.vue'
import Fenlei from './components/Fenlei.vue'

export default {
  name: 'app',
  components: {
    OrderList,
    GoodSet,
    Fenlei
  },
  data () {
    return {
      str: null,
      menuKey:'1-2-1'
    }
  },
  created:function(){
    document.title = '哥哥叫酒';
  },
  methods: {
      handselect(key) {
        this.menuKey = key;
      }
  }
}
</script>

<style>
*{margin: 0;padding: 0}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;/* 
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0; */
  overflow: hidden;
}

 .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    overflow-y: auto; 
  }
  
  .el-container {
    height: 100% !important;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
.el-tabs{background-color: #fff}
.goodset .el-icon-close{margin-left: 20px}
.orderTit{
  display: flex;
  padding-left: 30px;
  justify-content:space-around;
}
.orderType{color: #f90}
.goodList{background-color: #D3DCE6}
.el-upload{border:1px solid #ccc;}
.goodset .avatar{width:300px;height: auto;}
</style>
