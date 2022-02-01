<template>
  <el-dialog
    :title="type == 'add' ? '添加分类' : '修改分类'"
    v-model="visible"
    width="400px"
  >
    <el-form
      :model="ruleForm" :rules="rules"
      ref="formRef" label-width="100px"
      class="good-form"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="rank">
        <el-input type="number" v-model="ruleForm.rank"></el-input>
      </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
    </el-form>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'DialogAddCategory',
  props: {
    type: String,
    reload: Function
  },
  setup(props){
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const state = reactive({
      visible: false,
      categoryLevel: 1,
      parentId: 0,
      ruleForm: {
        name: '',
        rank: ''
      },
      rules:{
        name: [
          { required: 'true', message: '名称不能为空', trigger: ['change'] }
        ],
        rank: [
          { required: 'true', message: '编号不能为空', trigger: ['change'] }
        ]
      },
      id:''
    })
    const getDetail = id => {
      axios.get(`/categories/${id}`).then(res => {
        state.ruleForm = {
          name: res.categoryName,
          rank: res.categoryRank
        }
        state.parentId = res.parentId
        state.categoryLevel = res.categoryLevel
      })
    }
    const open = id => {
      state.visible = true
      if(id){
        //有id传入，即为修改模式
        state.id = id
        getDetail(id)
      }else{
        //无id，则为新增模式
        //新增类目，从路由获取分类参数
        const { level = 1, parent_id = 0 } = route.query
        state.ruleForm = {
          name: '',
          rank: ''
        }
        state.parentId = parent_id
        state.categoryLevel = level
      }
    }
    const close = () => state.visible = false
    const submitForm = () => {
      formRef.value.validate(valid => {
        if(valid){
          if(props.type == 'add'){
            //添加
            axios.post('/categories',{
              categoryLevel: state.categoryLevel,
              parentId: state.parentId,
              categoryName: state.ruleForm.name,
              categoryRank: state.ruleForm.rank
            }).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              if(props.reload) props.reload()
            })
          }else{
            //修改
            axios.put('/categories',{
              categoryId: state.id,
              categoryLevel: state.categoryLevel,
              parentId: state.parentId,
              categoryName: state.ruleForm.categoryName,
              categoryRank: state.ruleForm.rank
            }).then(() => {
              ElMessage.success('修改成功')
              state.visible = false
              if(props.reload) props.reload()
            })
          }
        }
      })
    }

    return {
        ...toRefs(state),
        open,
        close,
        formRef,
        submitForm
      }
  }
}
</script>