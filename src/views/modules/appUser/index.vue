<template>
  <div>
    <pagination-table
      ref="appUserList"
      :table-columns="tableColumns"
      :get-list-url="'/sys/businessUser/list'"
      :saveOrUpdateUrl="'/sys/businessUser'"
      :getFormDateUrl="'/sys/businessUser/view'"
      :useDefaultOperate="false"
      :addOrUpdateDialogWidth="'40%'"
      :onlyCanSaveAndChange="true"
      @initCallBack="initCallBack"
    >
    </pagination-table>
  </div>
</template>

<script>
import PaginationTable from "@/components/pagination-table";
import { userOption } from "../../../../static/enum/index";

export default {
  data() {
    return {
      localData: {},
      bicycleList: [],
      warehouseList: [],
      selectOptions: [],
      tableColumns: [
        {
          prop: "userId",
          headerAlign: "center",
          align: "center",
          width: "80",
          label: "ID",
          notInForm: true
        },
        {
          prop: "username",
          headerAlign: "center",
          align: "center",
          width: "300",
          label: "登录名"
        },
        {
          prop: "password",
          headerAlign: "center",
          align: "center",
          width: "200",
          label: "密码",
          notIntable: true,
          slotFormItem: {
            render: (h, params) => {
              const { rowData } = params;
              return h("el-input", {
                props: {
                  showPassword: true,
                  value: rowData,
                  type: "password"
                },
                attrs: {
                  placeholder: "请输入新密码"
                },
                on: {
                  input: e => {
                    this.$refs.appUserList.$refs[
                      "addOrUpdate"
                    ].dataForm.password = e;
                  }
                }
              });
            }
          }
        },
        {
          prop: "type",
          headerAlign: "center",
          align: "center",
          width: "200",
          label: "用户类型",
          slotFormItem: {
            render: (h, params) => {
              const { rowData } = params;

              return (
                <el-radio-group
                  value={rowData}
                  onInput={e => {
                    const dataForm = this.$refs.appUserList.$refs.addOrUpdate
                      .dataForm;
                    dataForm.type = e;
                    this.changeSelectOptions(e);
                    dataForm.relationalId = null;
                  }}
                >
                  {userOption.map((a, i) => (
                    <el-radio label={a.value} key={i}>
                      {a.label}
                    </el-radio>
                  ))}
                </el-radio-group>
              );
            }
          },
          render: (h, params) => {
            const { rowData } = params;
            const { type } = rowData;
            return (
              <el-tag size="small">
                {userOption.find(a => a.value === type)?.label}
              </el-tag>
            );
          }
        },
        {
          prop: "createTime",
          headerAlign: "center",
          align: "center",
          label: "创建时间",
          notInForm: true
        },
        {
          prop: "relationalName",
          headerAlign: "center",
          align: "center",
          width: "",
          label: "关联单车服务商/仓库",
          notInForm: true
        },
        {
          prop: "relationalId",
          headerAlign: "center",
          align: "center",
          width: "",
          label: "关联单车服务商/仓库ID",
          slotFormItem: {
            render: (h, params) => {
              const { rowData } = params;
              return (
                <el-select
                  value={rowData}
                  onInput={e => {
                    const dataForm = this.$refs.appUserList.$refs.addOrUpdate
                      .dataForm;

                    dataForm.relationalName = this.selectOptions.find(
                      a => a.value === e
                    )?.label;

                    dataForm.relationalId = e;
                  }}
                >
                  {this.selectOptions.map((a, i) => (
                    <el-option
                      key={i}
                      label={a.label}
                      value={a.value}
                    ></el-option>
                  ))}
                </el-select>
              );
            }
          }
        }
      ]
    };
  },
  components: {
    PaginationTable
  },
  async mounted() {
    const json1 = await this.$http({
      url: this.$http.adornUrl("/sys/bicycleProvider/list"),
      method: "get"
    });
    const { data } = json1;
    if (data && data.code === 0) {
      this.bicycleList = data.data.records;
    }

    const json = await this.$http({
      url: this.$http.adornUrl("/sys/warehouse/list"),
      method: "get"
    });
    const { data: warehouseData } = json;
    if (warehouseData && warehouseData.code === 0) {
      this.warehouseList = warehouseData.data.records;
    }
  },
  methods: {
    initCallBack(a) {
      if (a) {
        const { type, id } = a;

        if (id !== 0) {
          this.changeSelectOptions(type);
          this.$refs.appUserList.$refs["addOrUpdate"].dataForm.password = "";
        } else {
          this.selectOptions = [];
        }
      }
    },
    changeSelectOptions(type) {
      switch (type) {
        case 2:
          this.selectOptions = this.bicycleList.map(a => ({
            label: a.name,
            value: a.bicycleProviderId
          }));
          break;
        case 4:
          this.selectOptions = this.warehouseList.map(a => ({
            label: a.name,
            value: a.id
          }));
          break;
        default:
          this.selectOptions = [];
          break;
      }
    }
  }
};
</script>
