<template>
  <div>
    <pagination-table 
      ref="bike-server-list" 
      :table-columns='tableColumns'
      :get-list-url="'/sys/bicycleProvider/list'"
      :delete-url="'/sys/user/delete'"
      :useDefultOperate="false"
      :addOrUpdateDialogWidth="'30%'"
      :saveOrUpdateUrl="'/sys/bicycleProvider'"
      :getFormDateUrl="'/sys/bicycleProvider/view'"
      :onlyCanSaveAndChange="true"
    >

    </pagination-table>
  </div>
</template>

<script>
import PaginationTable from '@/components/pagination-table'
const statusOption = {
  0: {
    label: '停用',
    type: 'info'
  },
  1: {
    label: '正常',
    type: 'success'
  }
}

export default {
  data () {
    return {
      tableColumns: [
        {
          prop: 'bicycleProviderId',
          headerAlign: 'center',
          align: 'center',
          width: '80',
          label: 'ID',
          slot: false
        }, {
          prop: 'name',
          headerAlign: 'center',
          align: 'center',
          width: '400',
          label: '服务商品牌',
          slot: false
        }, {
          prop: 'mobile',
          headerAlign: 'center',
          align: 'center',
          // width: '200',
          label: '联系电话',
          slot: false
        }, {
          prop: 'status',
          headerAlign: 'center',
          align: 'center',
          // width: '200',
          label: '状态',
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
          slot: true,
          render: (h, params) => {
            const { rowData } = params
            const { status } = rowData

            return h('div', [
              h('el-tag', {
                props: {
                  size: 'small',
                  type: statusOption[status].type
                }
              }, statusOption[status].label)
            ])
          }
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