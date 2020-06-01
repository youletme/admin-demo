<template>
  <div>
    <pagination-table 
      ref="app-user-list"
      :table-columns='tableColumns'
      :get-list-url="'/sys/businessUser/list'"
      :saveOrUpdateUrl="'/sys/businessUser'"
      :getFormDateUrl="'/sys/businessUser/view'"
      :delete-url="''"
      :useDefultOperate="false"
      :addOrUpdateDialogWidth="'40%'"
      :onlyCanSaveAndChange="true"
    >

    </pagination-table>
  </div>
</template>

<script>
import PaginationTable from '@/components/pagination-table'
const userOption = [{
  value: 1,
  label: '取证员'
}, {
  value: 2,
  label: '单车服务商'
}, {
  value: 3,
  label: '司机'
}, {
  value: 4,
  label: '门卫'
}]

export default {
  data () {
    return {
      tableColumns: [
        {
          prop: 'userId',
          headerAlign: 'center',
          align: 'center',
          width: '80',
          label: 'ID',
          notInForm: true
        }, {
          prop: 'username',
          headerAlign: 'center',
          align: 'center',
          width: '300',
          label: '登录名'
        }, {
          prop: 'type',
          headerAlign: 'center',
          align: 'center',
          width: '200',
          label: '用户类型',
          slotFormItem: {
            render: (h, params) => {
              return h('el-radio-group', {
                props: {
                  value: params.rowData
                },
                on: {
                  input: (e) => {
                    console.log(e)

                    this.$refs['app-user-list'].$refs['addOrUpdate'].dataForm.type = e
                  }
                }
              }, userOption.map((a, i) => (
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
            const { type } = rowData

            return h('div', [
              h('el-tag', {
                props: {
                  size: 'small'
                }
              }, userOption.find(a => a.value === type).label)
            ])
          }
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