<template>
  <el-card class="swiper-container">
    <div class="header">
      <el-button type="primary" size="small" @click="handleAdd">
        <el-icon><plus /></el-icon>增加
      </el-button>
      <el-popconfirm
        title="确定删除吗"
        confirmButtonText="确定"
        cancelButtonText="取消"
        @confirm="handleDelete"
      >
        <template #reference>
          <el-button type="danger" size="small">
            <el-icon><delete /></el-icon>
            批量删除
          </el-button>
        </template>
      </el-popconfirm>
    </div>
    <el-table
      :loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column label="轮播图" width="200">
        <template #default="scope">
          <img style="width: 150px;height: 150px" :src="scope.row.carouselUrl" alt="轮播图">
        </template>
      </el-table-column>
      <el-table-column label="跳转链接">
        <template #default="scope">
          <a target="_blank" :href="scope.row.redirectUrl">{{scope.row.redirectUrl}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="carouseRank" label="排序值" width="120" />
      <el-table-column prop="createTime" label="添加时间" width="200" />
    </el-table>
    <el-pagination
     background layout="prev, pager, next" 
     :total="total" :page-size="pageSize"
     :current-page="currentPage" @current-change="changePage"
    />
  </el-card>
  <DialogAddSwiper ref='addSwiper' :reload="getCarousels" :type="type" />
</template>

<script>
import { onMounted, reactive,toRefs,ref } from "vue"
import axios from '@/utils/axios'
import DialogAddSwiper from "../components/DialogAddSwiper.vue"
import { ElMessage } from 'element-plus'

export default {
    name:'Swiper',
    components:{
      DialogAddSwiper
    },
    setup(){
      const addSwiper = ref(null)

      const state = reactive({
        loading:false,
        tableData:[],
        total:0,
        currentPage:1,
        pageSize:10,
        type:'add',
        multipleSelection:[]
      })

      onMounted(() => {
        getCarousels()
      })

      const getCarousels = () => {
        state.loading = true
        axios.get('/carousels',{
          params:{
            pageNumber: state.currentPage,
            pageSize: state.pageSize
          }
        }).then(res => {
          state.tableData = res.list
          state.total = res.totalCount
          state.currentPage = res.currentPage
          state.loading = false
        })
      }

      const handleAdd = () => {
        console.log(addSwiper.value)
        state.type = 'add'
        addSwiper.value.open()
      }

      const handleEdit = id => {
        state.type = 'edit'
        addSwiper.value.open(id)
      }

      const handleSelectionChange = value => {
        state.multipleSelection = value
      }

      const handleDelete = () => {
        if(!state.multipleSelection.length){
          ElMessage.error('请选择项')
          return
        }
        axios.delete('/carousels',{
          data:{
            ids:state.multipleSelection.map(i=>i.carouselId)
          }
        }).then(() => {
          ElMessage.success('删除成功')
          getCarousels()
        })
      }

      const changePage = (val) => {
        state.currentPage = val
        getCarousels()
      }

      return {
        ...toRefs(state),
        addSwiper,
        handleAdd,
        handleEdit,
        getCarousels,
        handleDelete,
        handleSelectionChange,
        changePage
      }
    }
}

</script>