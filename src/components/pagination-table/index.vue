单词拼写<template>
  <div>
    <el-form
      v-if="filterFormItems.length"
      class="filter-form"
      :model="searchData"
      ref="filterForm"
      @submit.native.prevent
      @keyup.enter.native="getDataList('search')"
      label-width="80px"
    >
      <div v-if="filterFormItems.length">
        <el-row v-for="(a, i) in filterFormItems" :key="i" :gutter="10">
          <el-col :span="b.colSpan" v-for="(b, j) in a" :key="`col${i}${j}`">
            <el-form-item :label="b.label" :prop="b.prop">
              <render-slot
                v-if="b.slotFormItem"
                :render="b.slotFormItem.render"
                :rowData="searchData[b.prop]"
              ></render-slot>
              <el-input
                v-else
                v-model="searchData[b.prop]"
                :placeholder="`请输入${b.label}`"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="5"
            style="padding-left:20px"
            v-if="i === filterFormItems.length - 1"
          >
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getDataList('search')"
            >
              搜索
            </el-button>
            <el-button icon="el-icon-refresh-right" @click="restSearchData()"
              >重置</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-form>

    <div style="margin-bottom:20px">
      <el-button
        v-if="isAuth('sys:user:create') && useDefaultOperate"
        type="primary"
        @click="addOrUpdateHandle()"
        >新增</el-button
      >
      <el-button
        v-if="isAuth('sys:user:delete') && useDefaultOperate"
        type="danger"
        @click="deleteHandle()"
        :disabled="!dataListSelections.length"
        >批量删除</el-button
      >
      <el-button
        v-if="isAuth('sys:user:create') && onlyCanSaveAndChange"
        type="primary"
        @click="addOrUpdateHandle()"
        >新增</el-button
      >
      <slot name="headerOperate"></slot>
    </div>

    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        v-for="(a, i) in tableColumns.filter(a => !a.notInTable)"
        :key="i"
        :prop="a.prop"
        :header-align="a.headerAlign"
        :align="a.align"
        :width="a.width"
        :label="a.label"
      >
        <template slot-scope="scope">
          <render-slot
            v-if="a.render"
            :render="a.render"
            :rowData="scope.row"
          ></render-slot>
          <span v-else>{{ scope.row[a.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <render-slot
            v-if="rowOperate"
            :render="rowOperate.render"
            :rowData="scope.row"
          ></render-slot>

          <el-button
            v-if="isAuth('sys:user:save') && useDefaultOperate"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row[rowIdName])"
            >修改</el-button
          >
          <el-button
            v-if="isAuth('sys:user:delete') && useDefaultOperate"
            type="text"
            size="small"
            @click="deleteHandle(scope.row[rowIdName])"
            >删除</el-button
          >
          <el-button
            v-if="isAuth('sys:user:save') && onlyCanSaveAndChange"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row[rowIdName])"
            >修改</el-button
          >
          <el-button
            v-if="isAuth('sys:user:save') && onlyCanChange"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row[rowIdName])"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      :formItems="formItems"
      :getFormDateUrl="getFormDateUrl"
      :saveOrUpdateUrl="saveOrUpdateUrl"
      :width="addOrUpdateDialogWidth"
      @initCallBack="initCallBack"
    ></add-or-update>
  </div>
</template>

<script>
import RenderSlot from "../renderSlot";
import AddOrUpdate from "../add-or-update";
export default {
  props: {
    tableColumns: {
      type: Array,
      default: () => {
        return [
          {
            prop: "",
            headerAlign: "",
            align: "",
            width: "",
            label: "",
            slot: false
          }
        ];
      }
    },
    filterFormItems: {
      type: Array,
      default: () => {
        return [];
      }
    },
    getListUrl: String,
    deleteUrl: String,
    useDefaultOperate: {
      type: Boolean,
      default: true
    },
    onlyCanChange: {
      type: Boolean,
      default: false
    },
    onlyCanSaveAndChange: {
      type: Boolean,
      default: false
    },
    rowOperate: {
      type: null
    },
    addOrUpdateDialogWidth: {
      type: String,
      default: "50%"
    },
    getFormDateUrl: String,
    saveOrUpdateUrl: String
  },
  data() {
    return {
      addOrUpdateVisible: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      formItems: [],
      rowIdName: "",
      searchData: {}
    };
  },
  components: {
    RenderSlot,
    AddOrUpdate
  },
  created() {
    this.formItems = this.tableColumns
      .filter(a => !a.notInForm)
      .map(a => ({
        label: a.label,
        prop: a.prop,
        slotFormItem: a.slotFormItem
      }));

    if (this.tableColumns.find(a => a.label === "ID")) {
      this.rowIdName = this.tableColumns.find(a => a.label === "ID").prop;
    } else {
      console.log("tableColumn must has ID for label");
    }

    if (this.filterFormItems?.[0]?.prop) {
      this.searchData = this.filterFormItems.reduce(
        (a, b) => ({ ...a, ...{ [b.prop]: "" } }),
        {}
      );
    }
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList(type) {
      if (type === "search") {
        this.pageIndex = 1;
      }

      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(this.getListUrl),
        method: "post",
        data: this.$http.adornData({
          ...{
            page: this.pageIndex,
            limit: this.pageSize
          },
          ...this.searchData
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          const { data: json } = data;
          const { list, totalCount } = json;

          this.dataList = list;
          this.totalCount = totalCount;
        } else {
          this.dataList = [];
          this.totalCount = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.userId;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(this.deleteUrl),
            method: "post",
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    initCallBack(a) {
      this.$emit("initCallBack", a);
    },
    restSearchData() {
      this.$refs["filterForm"].resetFields();
    }
  }
};
</script>
