<template>
  <div>
    <pagination-table 
      ref="app-user-list"
      :table-columns='tableColumns'
      :get-list-url="'/sys/businessUser/list'"
      :saveOrUpdateUrl="'/sys/businessUser'"
      :getFormDateUrl="'/sys/businessUser/view'"
      :useDefultOperate="false"
      :addOrUpdateDialogWidth="'40%'"
      :onlyCanSaveAndChange="true"
      @initCallBack="initCallBack"
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
}, {
  value: 5,
  label: '清运审核员'
}]

export default {

  data () {
    return {
      localData: {},
      bicycleList: [],
      warehouseList: [],
      selectOptions: [],
      tableColumns: [{
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
        prop: 'password',
        headerAlign: 'center',
        align: 'center',
        width: '200',
        label: '密码',
        notIntable: true,
        slotFormItem: {
          render: (h, params) => {
            const { rowData } = params
            return h('el-input', {
              props: {
                showPassword: true,

                value: rowData,
                type: 'password'
              },
              attrs: {
                placeholder: '请输入密码'
              },
              on: {
                input: (e) => {
                  this.$refs['app-user-list'].$refs['addOrUpdate'].dataForm.password = e
                }
              }
            }, [])
          }
        }
      }, {
        prop: 'type',
        headerAlign: 'center',
        align: 'center',
        width: '200',
        label: '用户类型',
        slotFormItem: {
          render: (h, params) => {
            const { rowData } = params

            return h('el-radio-group', {
              props: {
                value: rowData
              },
              on: {
                input: (e) => {
                  this.$refs['app-user-list'].$refs['addOrUpdate'].dataForm.type = e
                  this.changeSelectOptions(e)
                  this.$refs['app-user-list'].$refs['addOrUpdate'].dataForm.relationalId = ''
                }
              }
            }, userOption.map((a, i) => (
                h('el-radio', {
                  props: {
                    label: a.value
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
      }, {
        prop: 'relationalName',
        headerAlign: 'center',
        align: 'center',
        width: '',
        label: '关联单车服务商/仓库',
        notInForm: true

      }, {
        prop: 'relationalId',
        headerAlign: 'center',
        align: 'center',
        width: '',
        label: '关联单车服务商/仓库ID',
        slotFormItem: {
          render: (h, params) => {
            const { rowData } = params

            return h('el-select', {
              props: {
                value: rowData
              },
              on: {
                input: (e) => {
                  this.$refs['app-user-list'].$refs['addOrUpdate'].dataForm.relationalName = this.selectOptions.find(a => a.value === e).label
                  this.$refs['app-user-list'].$refs['addOrUpdate'].dataForm.relationalId = e
                }
              }
            }, this.selectOptions.map(a => (
                h('el-option', {
                  props: {
                    label: a.label,
                    value: a.value
                  }
                })
              ))
            )
          }
        }
      }
      ]

    }
  },
  components: {
    PaginationTable
  },
  async mounted () {
    let json1 = await this.$http({
      url: this.$http.adornUrl('/sys/bicycleProvider/list'),
      method: 'get'
    })
    const { data } = json1
    if (data && data.code === 0) {
      this.bicycleList = data.data.records
    }

    let json = await this.$http({
      url: this.$http.adornUrl('/sys/warehouse/list'),
      method: 'get'
    })
    const { data: warehouseData } = json
    if (warehouseData && warehouseData.code === 0) {
      this.warehouseList = warehouseData.data.records
    }
  },
  methods: {
    initCallBack (a) {
      if (a) {
        const { type, id } = a

        if (id !== 0) {
          this.changeSelectOptions(type)
          this.$refs['app-user-list'].$refs['addOrUpdate'].dataForm.password = null
        } else {
          this.selectOptions = []
        }
      }
    },
    changeSelectOptions (type) {
      switch (type) {
        case 2:
          this.selectOptions = this.bicycleList.map(a => ({label: a.name, value: a.bicycleProviderId}))
          break
        case 4:
          this.selectOptions = this.warehouseList.map(a => ({label: a.name, value: a.id}))
          break
        default:
          this.selectOptions = []
          break
      }
    }
  }
}
</script>

