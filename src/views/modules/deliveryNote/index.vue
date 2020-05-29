<template>
  <div>
    <pagination-table 
      ref="bike-server-list" 
      :table-columns='tableColumns'
      :get-list-url="'/sys/deliver/list'"
      :delete-url="'/sys/user/delete'"
      :useDefultOperate="false"
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
          slot: false
        }, {
          prop: 'orderNumber',
          headerAlign: 'center',
          align: 'center',
          width: '400',
          label: '交付单号',
          slot: false
        }, {
          prop: 'evidenceOrderNumbers',
          headerAlign: 'center',
          align: 'center',
          // width: '200',
          label: '取证单号',
          slot: false
        }, {
          prop: 'driverUserName',
          headerAlign: 'center',
          align: 'center',
          // width: '200',
          label: '司机姓名',
          // slotFormItem: {
          //   render: (h, params) => {
          //     const { rowData } = params
          //     console.log(rowData)

          //     return h('div', [
          //       h('el-select', {
          //         props: {
          //           size: 'small',
          //           placeholder: `请输入${rowData.label}`
          //         }
          //       })
          //     ])
          //   }
          // },
          slot: false
        }, {
          prop: 'guardUserName',
          headerAlign: 'center',
          align: 'center',
          // width: '200',
          label: '测试门卫',
          slot: false
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