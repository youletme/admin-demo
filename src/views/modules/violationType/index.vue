<template>
  <div>
    <pagination-table
      ref="violation-type"
      :table-columns="tableColumns"
      :get-list-url="'/sys/violationCategory/list'"
      :saveOrUpdateUrl="'/sys/violationCategory'"
      :getFormDateUrl="'/sys/violationCategory/view'"
      :useDefaultOperate="false"
      :addOrUpdateDialogWidth="'40%'"
      :onlyCanSaveAndChange="true"
    >
    </pagination-table>
  </div>
</template>

<script>
import PaginationTable from "@/components/pagination-table";
const statusOption = [
  {
    label: "停用",
    type: "info",
    value: 0
  },
  {
    label: "正常",
    type: "success",
    value: 1
  }
];
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
          prop: "number",
          headerAlign: "center",
          align: "center",
          width: "100",
          label: "编号"
        },
        {
          prop: "name",
          headerAlign: "center",
          align: "center",
          width: "",
          label: "违规条例"
        },
        {
          prop: "status",
          headerAlign: "center",
          align: "center",
          width: "80",
          label: "状态",
          slotFormItem: {
            render: (h, params) => {
              return h(
                "el-radio-group",
                {
                  props: {
                    value: params.rowData
                  },
                  on: {
                    input: e => {
                      this.$refs["bike-server-list"].$refs[
                        "addOrUpdate"
                      ].dataForm.status = e;
                    }
                  }
                },
                statusOption.map(a =>
                  h(
                    "el-radio",
                    {
                      props: {
                        label: a.value,
                        value: a.value
                      }
                    },
                    a.label
                  )
                )
              );
            }
          },
          render: (h, params) => {
            const { rowData } = params;
            const { status } = rowData;

            return h("div", [
              h(
                "el-tag",
                {
                  props: {
                    size: "small",
                    type: statusOption[status].type
                  }
                },
                statusOption[status].label
              )
            ]);
          }
        },
        {
          prop: "createTime",
          headerAlign: "center",
          align: "center",
          width: "",
          label: "创建时间",
          notInForm: true
        }
      ]
    };
  },
  components: {
    PaginationTable
  }
};
</script>

<style></style>
