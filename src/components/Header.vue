<template>
  <div class="header">
    <div class="left">
      <el-icon size="20px" style="margin-right:15px" v-if="hasBack" @click="back"><back /></el-icon>
      <span style="font-size: 20px">{{ name }}</span>
    </div>
    <div class="right">
      <el-popover
        placement="bottom"
        :width="320"
        trigger="click"
        popper-class="popper-user-box"
      >
        <template #reference>
          <div class="author">
            <el-icon class="icon"><user /></el-icon>
            {{ userInfo && userInfo.nickname || '' }}
            <el-icon class="icon"><caret-bottom /></el-icon>
          </div>
        </template>
        <div class="nickname">
          <p>登录名: {{ userInfo && userInfo.loginUserName || '' }}</p>
          <p>昵称： {{ userInfo && userInfo.nickname || '' }}</p>
          <el-tag size="small" effect="dark" class="logout" @click="logout">退出</el-tag>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from '@/utils/axios'
import { localRemove,pathMap } from "../utils";

export default {
  name: "Header",
  setup() {
    const router = useRouter();
    const state = reactive({
      name: "dashboard",
      userInfo:null,
      hasBack:false
    })
    onMounted(() => {
      const pathname = window.location.hash.split('/')[1] || ''
      if(!['login'].includes(pathname)){
        getUserInfo()
      }
    })
    router.afterEach(to => {
      const {id} = to.query
      state.name = pathMap[to.name]
      state.hasBack = ['level2','level3'].includes(to.name)
    })
    const back = () => router.back()

    const getUserInfo = async () => {
      const userInfo = axios.get('/adminUser/profile')
      state.userInfo = userInfo
    }

    const logout = () => {
      axios.delete('/logout').then(() => {
        localRemove('token');
        router.push({path:'/login'})
      })
    }
    
    router.afterEach((to) => {
      const { id } = to.query;
      state.name = pathMap[to.name];
    });
    return {
      ...toRefs(state),
      logout,
      back
    };
  },
};
</script>

<style scoped>
.header {
  height: 50px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.right > div > .icon{
  font-size: 18px;
  margin-right: 6px;
}
.author{
  margin-left: 10px;
  cursor: pointer;
}
</style>

<style>
.popper-user-box{
  background: url('https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png') 50% 50% no-repeat!important;
  background-size: cover!important;
  border-radius: 0!important;
}
.popper-user-box .nickname{
  position: relative;
  color: #fff;
}
.popper-user-box .nickname .logout{
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
</style>
