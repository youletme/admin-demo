<template>
  <div>
    <pagination-table 
      ref="driver-delivery-note-list" 
      :table-columns='tableColumns'
      :search-data='dataForm'
      :get-list-url="'/sys/evidence/list'"
      :delete-url="'/sys/user/delete'"
      :useDefultOperate="false"
      :rowOperate="rowOperate"
    >

    <template slot="headerOperate">
      <el-button type="primary" @click="assignDrivers()">批量指派</el-button>
    </template>

    </pagination-table>

    <el-dialog
      title="选择指派司机"
      width="20%"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="司机姓名" prop="name">
          <el-select v-model="dataForm.driverId" placeholder="请选择">
            <el-option
              v-for="item in driverOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import PaginationTable from '@/components/pagination-table'
import { allStatusOption } from '@/enum/index'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        name: ''
      },
      driverOptions: [{
        label: '测试司机',
        value: 5
      }],
      tableColumns: [
        {
          prop: 'id',
          headerAlign: 'center',
          align: 'center',
          width: '60',
          label: 'ID',
          slot: false
        },
        {
          prop: 'order_number',
          headerAalign: 'center',
          align: 'center',
          width: '250',
          label: '取证单号',
          slot: false
        },
        {
          prop: 'position',
          headerAalign: 'center',
          align: 'center',
          width: '250',
          label: '取证地点',
          slot: false
        },
        {
          prop: 'evidence_user_name',
          headerAalign: 'center',
          align: 'center',
          label: '取证人员',
          slot: false
        },
        {
          prop: 'driver_user_name',
          headerAalign: 'center',
          align: 'center',
          label: '指派司机',
          slot: false
        },
        {
          prop: 'status',
          headerAalign: 'center',
          align: 'center',
          label: '状态',
          slot: true,
          render: (h, params) => {
            const { rowData } = params
            const { status } = rowData
            const type = {
              0: 'info',
              1: 'success',
              3: 'warning'
            }

            return h('div', [
              h('el-tag', {
                props: {
                  size: 'small',
                  type: type[status]
                }
              }, allStatusOption[status])
            ])
          }
        },
        {
          prop: 'create_time',
          headerAalign: 'center',
          align: 'center',
          width: '180',
          label: '创建时间',
          slot: false
        }
      ],
      rowOperate: {
        slot: true,
        render: (h, params) => {
          const { rowData } = params

          return h('div', [
            h('el-button', {
              props: {
                size: 'small',
                type: 'text',
                disabled: rowData.status !== 3
              },
              on: {
                click: () => this.assignDriver(rowData)
              }
            }, '指派')
          ])
        }
      }
    }
  },
  components: {
    PaginationTable
  },
  async mounted () {
    let json = await this.$http({
      url: this.$http.adornUrl('/sys/businessUser/list'),
      method: 'get',
      params: this.$http.adornParams({type: 3})
    })
    const { data } = json
    if (data && data.code === 0) {
      const { records } = data.data
      this.driverOptions = records.map(a => ({
        label: a.username,
        value: a.userId
      }))
    } else {

    }
  },
  methods: {
    assignDriver (data) {
      this.visible = true
      this.chooseData = [data]
    },
    assignDrivers () {
      // this.visible = true
      let chooseDatas = this.$refs['driver-delivery-note-list'].dataListSelections
      if (!chooseDatas.length) {
        this.$message('请至少选择一条数据')
        return
      }

      this.visible = true
      this.chooseData = chooseDatas
    },
    async dataFormSubmit () {
      const { driverId } = this.dataForm

      let json = await Promise.all(this.chooseData.map(a => (this.$http({
        url: this.$http.adornUrl('/sys/evidence/distributionDriver'),
        method: 'post',
        data: this.$http.adornData({
          id: a.id, driverUserId: driverId// 司机id
        })
      }))))

      // let json = await this.$http({
      //   url: this.$http.adornUrl('/sys/evidence/distributionDriver'),
      //   method: 'post',
      //   data: this.$http.adornData({
      //     id, driverUserId: driverId// 司机id
      //   })
      // })
      // const { data } = json
      if (json.every(a => a.data.code === 0)) {
        this.visible = false
        this.$refs['driver-delivery-note-list'].getDataList()
      } else {
        console.log(json)

        this.$message(json.find(a => a.data.code !== 0).data.msg)
      }
    }

  }
}
</script>

<style lang="scss">
  
</style>