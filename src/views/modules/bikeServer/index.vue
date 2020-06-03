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

const statusOption = [
  {
    label: '停用',
    type: 'info',
    value: 0
  },
  {
    label: '正常',
    type: 'success',
    value: 1
  }
]

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
          notInForm: true
        }, {
          prop: 'name',
          headerAlign: 'center',
          align: 'center',
          width: '400',
          label: '服务商品牌'
        }, {
          prop: 'mobile',
          headerAlign: 'center',
          align: 'center',
          // width: '200',
          label: '联系电话'
        }, {
          prop: 'status',
          headerAlign: 'center',
          align: 'center',
          // width: '200',
          label: '状态',
          slotFormItem: {
            render: (h, params) => {
              return h('el-radio-group', {
                props: {
                  value: params.rowData
                },
                on: {
                  input: (e) => {
                    this.$refs['bike-server-list'].$refs['addOrUpdate'].dataForm.status = e
                  }
                }
              }, statusOption.map(a => (
                h('el-radio', {
                  props: {
                    label: a.value,
                    value: a.value
                  }
                }, a.label)))
              )
            }
          },
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