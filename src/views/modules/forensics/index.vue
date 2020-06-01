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

    <show-detail
      :detailData="detailData"
      :detailFormItems="detailFormItems"
      ref="show-detail"
    >

    </show-detail>

    <div class="demo-image__preview">
</div>
    
  </div>
</template>

<script>
import PaginationTable from '@/components/pagination-table'
import ShowDetail from '@/components/show-detail'
import { allStatusOption } from '@/enum/index'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        name: ''
      },
      tableColumns: [
        {
          prop: 'id',
          headerAlign: 'center',
          align: 'center',
          width: '60',
          label: 'ID',
          notInForm: true
        },
        {
          prop: 'order_number',
          headerAalign: 'center',
          align: 'center',
          width: '250',
          label: '取证单号'
        },
        {
          prop: 'position',
          headerAalign: 'center',
          align: 'center',
          width: '250',
          label: '取证地点'
        },
        {
          prop: 'longitude',
          headerAalign: 'center',
          align: 'center',
          width: '100',
          label: '取证点经度'
        },
        {
          prop: 'latitudes',
          headerAalign: 'center',
          align: 'center',
          width: '100',
          label: '取证点维度'
        },
        {
          prop: 'evidence_user_name',
          headerAalign: 'center',
          align: 'center',
          width: '100',
          label: '取证人员'
        },
        {
          prop: 'driver_user_name',
          headerAalign: 'center',
          align: 'center',
          label: '指派司机'
        },
        {
          prop: 'status',
          headerAalign: 'center',
          align: 'center',
          label: '状态',
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
          label: '取证时间',
          notInForm: true
        }
      ],
      rowOperate: {
        render: (h, params) => {
          const { rowData } = params

          return h('div', {
            style: {
              display: 'inline-block'
            }
          }, [
            h('el-button', {
              props: {
                size: 'small',
                type: 'text'
              },
              on: {
                click: () => this.showDetail(rowData)
              }
            }, '详情'),
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
      },
      driverOptions: [],
      detailData: {},
      detailFormItems: [],
      bicycleProviderList: []
    }
  },
  components: {
    PaginationTable,
    ShowDetail
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
    }

    let bicycleProviderList = await this.$http({
      url: this.$http.adornUrl('/sys/bicycleProvider/list'),
      method: 'get'
    })
    const { data: bikeList } = bicycleProviderList
    if (bikeList && bikeList.code === 0) {
      const { records } = bikeList.data
      this.bicycleProviderList = records.map(a => ({
        bicycleProviderId: a.bicycleProviderId,
        name: a.name
      }))
    }
  },
  methods: {
    assignDriver (data) {
      this.visible = true
      this.chooseData = [data]
    },
    assignDrivers () {
      let chooseDatas = this.$refs['driver-delivery-note-list'].dataListSelections
      if (!chooseDatas.length) {
        this.$message('请至少选择一条数据')
        return
      }

      this.visible = true
      this.chooseData = chooseDatas
    },
    showDetail (data) {
      this.detailData = data
      this.$refs['show-detail'].dataForm = data
      this.$refs['show-detail'].visible = true

      this.detailFormItems = [{
        label: '取证单号',
        prop: 'order_number'
      }, {
        label: '司机',
        prop: 'driver_user_name'
      }, {
        label: '取证员',
        prop: 'evidence_user_name'
      }, {
        label: '单车服务商',
        prop: 'bicycle_provider_ids',
        render: (h, params) => {
          const { rowData } = params
          const ids = rowData.split(',')

          return h('div',
            ids.map(a => this.bicycleProviderList
            .find(b => b.bicycleProviderId.toString() === a))
            .map(a => h('el-tag', {style: 'margin-right:10px'}, a.name))
          )
        }
      }, {
        label: '取证照片',
        prop: 'evidence_photo',
        render: (h, params) => {
          return this.renderImage(h, params)
        }
      }, {
        label: '清运前照片',
        prop: 'clear_photo_before',
        render: (h, params) => {
          return this.renderImage(h, params)
        }
      }, {
        label: '清运后照片',
        prop: 'clear_photo_after',
        render: (h, params) => {
          return this.renderImage(h, params)
        }
      }, {
        label: '地点',
        prop: 'position'
      }, {
        label: '状态',
        prop: 'status',
        render: (h, params) => {
          const { rowData } = params
          return h('el-tag', {style: 'margin-right:10px'}, allStatusOption[rowData])
        }
      }, {
        label: '备注',
        prop: 'remark'
      }, {
        label: '创建时间',
        prop: 'create_time'
      }]
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

      if (json.every(a => a.data.code === 0)) {
        this.visible = false
        this.$refs['driver-delivery-note-list'].getDataList()
      } else {
        this.$message(json.find(a => a.data.code !== 0).data.msg)
      }
    },
    renderImage: (h, params) => {
      const { rowData } = params
      const imgs = (rowData || '').split(',')

      return h('el-image', {
        style: {
          width: '100px',
          height: '100px'
        },
        props: {
          src: `${imgs[0]}?x-oss-process=image/resize,m_pad,h_100,w_100`,
          'preview-src-list': imgs
        }
      })
    }
  }
}
</script>

<style lang="scss">
  
</style>