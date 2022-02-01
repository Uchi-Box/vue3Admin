<template>
  <el-card class="index-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" @click="handleAdd">
          <el-icon><plus /></el-icon>增加</el-button>
      <el-popconfirm
        title="确定删除吗？"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="handleDelete"
      >
        <template #reference>
          <el-button type="danger" size="small">
          <el-icon><delete /></el-icon>批量删除</el-button>
        </template>
      </el-popconfirm>
      </div>
    </template>
    <el-table
      :loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55px"/>
      <el-table-column prop="configName" label="商品名称" />
      <el-table-column label="跳转链接">
        <template #default="scope">
          <a target="_blank" :href="scope.row.redirectUrl">{{
            scope.row.redirectUrl
          }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="configRank" label="排序值" width="120" />
      <el-table-column prop="goodsId" label="商品编号" width="200" />
      <el-table-column prop="createTime" label="添加时间" width="200" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <a
            style="cursor: pointer; margin-right: 10px"
            @click="handleEdit(scope.row.configId)"
            >修改</a>
          <el-popconfirm
            title="确定删除吗"
            confirmButtontext="确定"
            cancelButtonText="取消"
            @confirm="handleSingleDelete(scope.row.configId)"
          >
            <template #reference>
              <a style="cursor: pointer">删除</a>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
  </el-card>
  <DialogAddGood
    ref="addGood"
    :reload="getIndexConfig"
    :type="type"
    :configType="configType"
  />
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, toRefs } from "vue";
import axios from "@/utils/axios";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import DialogAddGood from "../components/DialogAddGood.vue";

const configTypeMap = {
  hot: 3,
  new: 4,
  recommend: 5,
};
const addGood = ref(null);

export default {
    name: "IndexConfig",
    setup() {
        const router = useRouter();
        const route = useRoute();
        const state = reactive({
            loading: false,
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            type: "add",
            configType: 3,
            multipleSelection: [],
        });
        router.beforeEach((to) => {
            if (["hot", "new", "recommend"].includes(to.name)) {
                state.configType = configTypeMap[to.name];
                state.currentPage = 1;
                getIndexConfig();
            }
        });
        onMounted(() => {
            state.configType = configTypeMap[route.name];
            getIndexConfig();
        });
        const getIndexConfig = () => {
            state.loading = true;
            axios
                .get("/indexConfigs", {
                params: {
                    pageNumber: state.currentPage,
                    pageSize: state.pageSize,
                    configType: state.configType,
                },
            })
                .then((res) => {
                state.tableData = res.list;
                state.total = res.totalCount;
                state.currentPage = res.currentPage;
                state.loading = false;
            });
        };
        const changePage = (val) => {
            state.currentPage = val;
            getIndexConfig();
        };
        const handleAdd = () => {
            state.type = "add";
            addGood.value.open()
        };
        const handleEdit = (id) => {
            state.type = "edit";
            addGood.value.open(id);
        };
        const handleSelectionChange = (val) => (state.multipleSelection = val);
        const handleDelete = () => {
            if (!state.multipleSelection.length) {
                ElMessage.error("请选择项");
                return;
            }
            axios
                .post("/indexConfigs/delete", {
                ids: state.multipleSelection.map((i) => i.configId),
            })
                .then(() => {
                ElMessage.success("删除成功");
                getIndexConfig();
            })
        };
        const handleSingleDelete = id => {
            axios.post("/indexConfigs/delete", {
                ids: [id]
            }).then(() => {
                ElMessage.success("删除成功");
                getIndexConfig();
            });
        };
        return {
            ...toRefs(state),
            getIndexConfig,
            changePage,
            handleSelectionChange,
            addGood,
            handleAdd,
            handleEdit,
            handleDelete,
            handleSingleDelete
        };
    },
    components: { DialogAddGood }
};
</script>
