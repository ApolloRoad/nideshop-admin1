<template>
    <el-popover
        placement="top"
        width="160"
        v-model="visible2">
        <p>删除后不可恢复,确定删除吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
          <el-button type="primary" size="mini" @click="adminDelGood">确定</el-button>
        </div>
        <el-button slot="reference">删除</el-button>
    </el-popover>
</template>

<script>
    export default {
        name:'Delete',
        props:{
          goodId:Number
        },
        data() {
          return {
              visible2:false
          }
        },
        methods: {
            adminDelGood() {
                this.visible2 = false;
                this.$emit('adminDelGood',this.goodId);
            }
        }
    }
</script>