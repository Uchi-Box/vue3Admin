<template>
  <el-card class="category-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" @click="handleAdd">
          <el-icon><plus /></el-icon>
          添加
        </el-button>
        <el-popconfirm
          title="确定删除吗"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="handleDelete"
        >
          <template #reference>
          <el-button type="danger" size="small">
            <el-icon><delete /></el-icon>批量删除
          </el-button>
          </template>
        </el-popconfirm>
      </div>
    </template>
    <el-table
      :loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="categoryName" label="分类名称" />
      <el-table-column prop="categoryRank" label="排序值" width="120" />
      <el-table-column prop="createTime" label="添加时间" width="200" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.categoryId)">修改</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleNext(scope.row)">下级分类</a>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleSingleDelete(scope.row.categoryId)"
          >
            <template #reference>
              <a style="cursor:pointer">删除</a>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev,pager,next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
    <DialogAddCategory ref="addCate" :reload="getCategory" :type="type" />
  </el-card>
</template>

<script>
import {onMounted, reactive, ref, toRefs, onUnmounted} from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'
import DialogAddCategory from '../components/DialogAddCategory.vue'

export default {
  name:'Category',
  components:{
    DialogAddCategory
  },
  setup(){
    const addCate = ref(null)
    const route = useRoute() //路由参数
    const router = useRouter() //路由实例
    const state = reactive({
      loading:false,
      tableData:[],
      total:0,
      currentPage:1,
      pageSize:10,
      type:'add',
      level:1,
      parent_id:0,
      multipleSelection:[]
    })
    const handleAdd = () => {
      state.type='add'
      addCate.value.open()
    }
    const handleEdit = id => {
      state.type='edit'
      addCate.value.open(id)
    }
    const handleSelectionChange = val => state.multipleSelection = val
    const handleDelete = () => {
      if(!state.multipleSelection.length){
        ElMessage.error('请选择项')
        return
      }
      axios.delete('/categories', {
          data: {
            ids: state.multipleSelection.map(i => i.categoryId)
          }
        }).then(() => {
          ElMessage.success('删除成功')
          getCategory()
      })
    }
    const handleSingleDelete = id => {
      axios.delete('/categories', {
          data: {
            ids:[id]
          }
        }).then(() => {
          ElMessage.success('删除成功')
          getCategory()
        })
    }
    onMounted(() => getCategory())
    const getCategory = () => {
      const { level = 1, parent_id = 0 } = route.query
      state.loading = true
      axios.get('/categories', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize,
          categoryLevel: level,
          parentId: parent_id
        }
      }).then(res => {
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
        state.loading = false
        state.level = level
        state.parentId = parent_id
      })
    }
    const changePage = val => {
      state.currentPage = val
      getCategory()
    }
    const unwatch = router.afterEach(to => {
      //每次路由变化，判断并重新获取列表数据
      if(['category','level2','level3'].includes(to.name)){
        getCategory()
      }
    })
    const handleNext = item => {
      const levelNumber = item.categoryLevel + 1
      if(levelNumber == 4){
        ElMessage.error('没有下一级')
        return
      }
      router.push({
        name:`level${levelNumber}`,
        query:{
          level:levelNumber,
          parent_id:item.categoryId
        }
      })
    }

    onUnmounted(()=>unwatch())

    return {
      ...toRefs(state),
      getCategory,
      changePage,
      handleNext,
      handleSelectionChange,
      addCate,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSingleDelete
    }
  }
}
</script>