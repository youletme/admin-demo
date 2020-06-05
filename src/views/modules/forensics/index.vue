<template>
  <div>
    <pagination-table 
      ref="forensics-list" 
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
      width="70%"
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
import { allStatusOption } from '../../../../static/enum/index'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        name: ''
      },
      tableColumns: [{
        prop: 'id',
        headerAlign: 'center',
        align: 'center',
        width: '60',
        label: 'ID',
        notInForm: true
      }, {
        prop: 'order_number',
        headerAalign: 'center',
        align: 'center',
        width: '250',
        label: '取证单号'
      }, {
        prop: 'position',
        headerAalign: 'center',
        align: 'center',
        width: '250',
        label: '取证地点'
      }, {
        prop: 'longitude',
        headerAalign: 'center',
        align: 'center',
        width: '100',
        label: '取证点经度'
      }, {
        prop: 'latitudes',
        headerAalign: 'center',
        align: 'center',
        width: '100',
        label: '取证点维度'
      }, {
        prop: 'evidence_user_name',
        headerAalign: 'center',
        align: 'center',
        width: '100',
        label: '取证人员'
      }, {
        prop: 'driver_user_name',
        headerAalign: 'center',
        align: 'center',
        label: '指派司机'
      }, {
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
      }, {
        prop: 'create_time',
        headerAalign: 'center',
        align: 'center',
        width: '180',
        label: '取证时间',
        notInForm: true
      }],
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
      let chooseDatas = this.$refs['forensics-list'].dataListSelections
      if (!chooseDatas.length) {
        this.$message('请至少选择一条数据')
        return
      }

      this.visible = true
      this.chooseData = chooseDatas
    },
    async showDetail (data) {
      let json = await this.$http({
        url: this.$http.adornUrl('/sys/evidence/view'),
        method: 'post',
        params: this.$http.adornParams({id: data.id})
      })

      const { data: detail } = json
      if (detail && detail.code === 0) {
        this.detailData = detail.data
        this.$refs['show-detail'].dataForm = detail.data
        this.$refs['show-detail'].visible = true

        this.detailFormItems = [{
          colNum: 3,
          cols: [{
            label: '取证单号',
            prop: 'orderNumber'
          }, {
            label: '状态',
            prop: 'status',
            render: (h, params) => {
              const { rowData } = params
              return h('el-tag', {style: 'margin-right:10px'}, allStatusOption[rowData])
            }
          }, {
            label: '地图位置',
            prop: 'map',
            render: (h, params) => {
              const { latitudes, longitude } = data

              return h('el-amap', {
                style: {
                  width: '100%',
                  height: '200px',
                  position: 'absolute',
                  zIndex: '999'
                },
                props: {
                  zoom: 15,
                  center: [longitude, latitudes]
                }
              }, [
                h('el-amap-marker', {
                  props: {
                    position: [longitude, latitudes],
                    visible: true,
                    draggable: false
                  }
                })
              ])
            }
          }]
        }, {
          colNum: 3,
          cols: [{
            label: '交付单号',
            prop: 'deliverOrderNumber'
          }, {
            label: '创建时间',
            prop: 'createTime'
          }]
        }, {
          colNum: 3,
          cols: [{
            label: '取证员',
            prop: 'evidenceUserName'
          }, {
            label: '地点',
            prop: 'position'
          }]
        }, {
          colNum: 3,
          cols: [ {
            label: '司机',
            prop: 'driverUserName'
          }, {
            label: '备注',
            prop: 'remark'
          }]
        }, {
          colNum: 1,
          cols: [{
            label: '服务商',
            prop: 'bicycleProviderIds',
            render: (h, params) => {
              const { rowData } = params
              const ids = rowData.split(',')

              return h('div',
            ids.map(a => this.bicycleProviderList
            .find(b => b.bicycleProviderId.toString() === a))
            .map(a => h('el-tag', {style: 'margin-right:10px'}, a.name)))
            }
          }]
        }, {
          colNum: 1,
          cols: [{
            label: '清运清单',
            prop: 'clearInventory',
            render: (h, params) => {
              const { rowData } = params
              return rowData ? rowData.map(a =>
              h('el-tag', {
                style: 'margin-right:10px'
              },
              `${this.bicycleProviderList
                .find(b => b.bicycleProviderId.toString() === a.bicycleProviderId.toString()).name}X${a.number}`
              )) : ''
            }
          }]
        }, {
          colNum: 1,
          cols: [{
            label: '取证照片',
            prop: 'evidencePhoto',
            render: (h, params) => {
              return this.renderImage(h, params)
            }
          }]
        }, {
          colNum: 1,
          cols: [{
            label: '清运前',
            prop: 'clearPhotoBefore',
            render: (h, params) => {
              return this.renderImage(h, params)
            }
          }]
        }, {
          colNum: 1,
          cols: [{
            label: '清运后',
            prop: 'clearPhotoAfter',
            render: (h, params) => {
              return this.renderImage(h, params)
            }
          }]
        }]
      } else {

      }
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
        this.$refs['forensics-list'].getDataList()
      } else {
        this.$message(json.find(a => a.data.code !== 0).data.msg)
      }
    },
    renderImage: (h, params) => {
      const { rowData } = params
      const imgs = (rowData || '').split(',')

      return rowData ? imgs.map(a => h('el-image', {
        style: {
          width: '100px',
          height: '100px'
        },
        props: {
          src: `${a}?x-oss-process=image/resize,m_pad,h_100,w_100`,
          'preview-src-list': [a]
        }
      })) : ''
    }
  }
}
</script>

<style lang="scss">
  
</style>