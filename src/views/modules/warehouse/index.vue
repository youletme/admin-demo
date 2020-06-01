<template>
  <div>
    <pagination-table 
      ref="warehouse-list"
      :table-columns='tableColumns'
      :get-list-url="'/sys/warehouse/list'"
      :delete-url="''"
      :useDefultOperate="true"
      :addOrUpdateDialogWidth="'30%'"
      :onlyCanSaveAndChange="false"
    >

    </pagination-table>
  </div>
</template>

<script>
import PaginationTable from '@/components/pagination-table'

export default {
  data () {
    return {
      tableColumns: [
        {
          prop: 'id',
          headerAlign: 'center',
          align: 'center',
          width: '80',
          label: 'ID',
          notInForm: true
        }, {
          prop: 'number',
          headerAlign: 'center',
          align: 'center',
          width: '100',
          label: '仓库编号'
        }, {
          prop: 'name',
          headerAlign: 'center',
          align: 'center',
          label: '仓库名称'
        }, {
          prop: 'address',
          headerAlign: 'center',
          align: 'center',
          label: '仓库地址'
        }, {
          prop: 'longitude',
          headerAlign: 'center',
          align: 'center',
          label: '经度'
        }, {
          prop: 'latitudes',
          headerAlign: 'center',
          align: 'center',
          label: '纬度'
        }, {
          prop: 'createTime',
          headerAlign: 'center',
          align: 'center',
          label: '创建时间',
          notInForm: true
        }
      ]

    }
  },
  components: {
    PaginationTable
  }
}
</script>

<style>

</style>