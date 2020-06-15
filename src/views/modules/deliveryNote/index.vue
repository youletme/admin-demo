<template>
  <div>
    <pagination-table
      ref="deliver-note-list"
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
import { allStatusOption } from '../../../../static/enum/index'

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
          prop: 'orderNumber',
          headerAlign: 'center',
          align: 'center',
          width: '200',
          label: '交付单号'
        }, {
          prop: 'evidenceOrderNumbers',
          headerAlign: 'center',
          align: 'center',
          width: '400',
          label: '取证单号'
        }, {
          prop: 'total',
          headerAlign: 'center',
          align: 'center',
          width: '80',
          label: '交付总数'
        }, {
          prop: 'status',
          headerAlign: 'center',
          align: 'center',
          width: '80',
          label: '状态',
          render: (h, params) => {
            const { rowData } = params
            const { status } = rowData
            return h('el-tag', {
              props: {
                size: 'small'
              }
            }, allStatusOption[status])
          }
        }, {
          prop: 'driverUserName',
          headerAlign: 'center',
          align: 'center',
          label: '指派司机'
        }, {
          prop: 'guardUserName',
          headerAlign: 'center',
          align: 'center',
          // width: '200',
          label: '门卫'
        }, {
          prop: 'createTime',
          headerAlign: 'center',
          align: 'center',
          label: '创建时间'
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
