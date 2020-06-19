<template>
  <div>
    <pagination-table
      ref="deliver-note-list"
      :table-columns="tableColumns"
      :get-list-url="'/sys/deliver/list'"
      :delete-url="'/sys/user/delete'"
      :useDefultOperate="false"
      :addOrUpdateDialogWidth="'30%'"
      :onlyCanSaveAndChange="false"
      :rowOperate="rowOperate"
    >
    </pagination-table>

    <show-detail
      :detailData="detailData"
      :detailFormItems="detailFormItems"
      ref="deliveryNote-show-detail"
    >
    </show-detail>
  </div>
</template>

<script>
import PaginationTable from "@/components/pagination-table";
import { allStatusOption } from "../../../../static/enum/index";
import ShowDetail from "@/components/show-detail";

export default {
  data() {
    return {
      tableColumns: [
        {
          prop: "id",
          headerAlign: "center",
          align: "center",
          width: "80",
          label: "ID",
          notInForm: true
        },
        {
          prop: "orderNumber",
          headerAlign: "center",
          align: "center",
          width: "200",
          label: "交付单号"
        },
        {
          prop: "total",
          headerAlign: "center",
          align: "center",
          width: "150",
          label: "交付总数"
        },
        {
          prop: "status",
          headerAlign: "center",
          align: "center",
          width: "80",
          label: "状态",
          render: (h, params) => {
            return (
              <el-tag size="small">
                {allStatusOption[params.rowData?.status]}
              </el-tag>
            );
          }
        },
        {
          prop: "driverUserName",
          headerAlign: "center",
          align: "center",
          label: "指派司机"
        },
        {
          prop: "guardUserName",
          headerAlign: "center",
          align: "center",
          // width: '200',
          label: "门卫"
        },
        {
          prop: "createTime",
          headerAlign: "center",
          align: "center",
          label: "创建时间"
        }
      ],
      rowOperate: {
        render: (h, params) => {
          const { rowData } = params;
          return (
            <el-button
              size="small"
              type="text"
              onClick={() => this.showDetail(rowData)}
            >
              详情
            </el-button>
          );
        }
      },
      detailData: {},
      bicycleProviderList: [],
      detailFormItems: []
    };
  },
  components: {
    PaginationTable,
    ShowDetail
  },
  async mounted() {
    const bicycleProviderList = await this.$http({
      url: this.$http.adornUrl("/sys/bicycleProvider/list"),
      method: "get"
    });
    const { data: bikeList } = bicycleProviderList;
    if (bikeList && bikeList.code === 0) {
      const { records } = bikeList.data;
      this.bicycleProviderList = records.map(a => ({
        bicycleProviderId: a.bicycleProviderId,
        name: a.name
      }));
    }
  },
  methods: {
    async showDetail(data) {
      const json = await this.$http({
        url: this.$http.adornUrl("/sys/deliver/view"),
        method: "post",
        params: this.$http.adornParams({ id: data.id })
      });

      const { data: detail } = json;
      if (detail && detail.code === 0) {
        this.detailData = detail.data;
        this.$refs["deliveryNote-show-detail"].dataForm = detail.data;
        this.$refs["deliveryNote-show-detail"].visible = true;

        this.detailFormItems = [
          {
            colNum: 3,
            cols: [
              {
                label: "交付单号",
                prop: "orderNumber"
              },
              {
                label: "交付总数",
                prop: "total"
              },
              {
                label: "状态",
                prop: "status",
                render: (h, params) => {
                  const { rowData } = params;
                  return (
                    <el-tag style="margin-right:10px">
                      {allStatusOption[rowData]}
                    </el-tag>
                  );
                }
              }
            ]
          },
          {
            colNum: 1,
            cols: [
              {
                label: "取证单号",
                prop: "evidenceOrderNumbers"
              }
            ]
          },
          {
            colNum: 1,
            cols: [
              {
                label: "清运清单",
                prop: "deliverInventory",
                render: (h, params) => {
                  const { rowData } = params;

                  return (
                    rowData?.map(a => (
                      <el-tag style="margin-right:10px">
                        {
                          this.bicycleProviderList.find(
                            b =>
                              b.bicycleProviderId.toString() ===
                              a.bicycleProviderId.toString()
                          ).name
                        }
                        X{a.number}
                      </el-tag>
                    )) ?? ""
                  );
                }
              }
            ]
          },
          {
            colNum: 3,
            cols: [
              {
                label: "司机",
                prop: "driverUserName"
              },
              {
                label: "门卫",
                prop: "guardUserName"
              },
              {
                label: "创建时间",
                prop: "createTime"
              }
            ]
          }
        ];
      }
    }
  }
};
</script>

<style></style>
