<template>
  <div>
    <el-dialog    
    title="详情"
    :close-on-click-modal="false"
    :width="width"
    :visible.sync="visible">
    <el-form :model="dataForm" class="show-detail" ref="dataForm" label-width="80px">
      <el-form-item v-for="(a,i) in detailFormItems" :key="i" :label="a.label" :prop="a.prop">
        <render-slot v-if="a.render" :render="a.render" :rowData="dataForm[a.prop]"></render-slot>
        <el-input v-else v-model="dataForm[a.prop]" readonly></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>      
    </el-dialog>
  </div>
</template>

<script>
import RenderSlot from '../renderSlot'
export default {
  props: {
    detailData: Object,
    detailFormItems: Array,
    width: {
      type: String,
      default: '50%'
    }
  },
  data () {
    return {
      visible: false,
      dataForm: {}
    }
  },
  components: {
    RenderSlot
  }
}
</script>

<style>
  .show-detail .el-form-item__label{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
</style>