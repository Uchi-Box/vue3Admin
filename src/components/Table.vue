<template>
  <el-table
    :loading="loading"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%;"
    @selection-change="handleSelectionChange"
  >
    <slot name="column" />
  </el-table>
  <el-pagination 
    background
    layout="prev,pager,next"
    :total="total"
    :page-size="pageSize"
    :current-page="currentPage"
    @current-change="changePage"
  />
</template>

<script>
import axios from "@/utils/axios"
import { onMounted, reactive, toRefs } from "vue"

export default {
  name:'Table',
  props:{
    action:String //列表请求地址
  },
  setup(props){
    const state = reactive({
      loading:false,
      tableData:[],
      total:0,
      currentPage:1,
      pageSize:10,
      multipleSelection:[]
    })
    onMounted(()=>getList())
    const getList = () => {
      state.loading = true
      axios.get(props.action,{
        params:{
          pageNumber:state.currentPage,
          pageSize:state.pageSize
        }
      }).then(res => {
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currentPage
        state.loading = false
      })
    }
    const handleSelectionChange = val => state.multipleSelection = val
    const changePage = val => {
      state.currentPage = val
      getList()
    }

    return {
      ...toRefs(state),
      changePage,
      handleSelectionChange,
      getList
    }
  }
}
</script>