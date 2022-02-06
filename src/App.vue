<template>
  <div class="layout">
    <el-container v-if="showMenu" class="container">
      <el-aside class="aside">
        <div class="head">
          <div>
            <img src="./assets/vlogo.png" alt="logo" />
            <span>Vue3管理平台</span>
          </div>
        </div>
        <div class="line">
          <el-menu 
            background-color="#222832" 
            text-color="#fff"
            :router="true"
            :default-openeds="defaultOpen"
            :default-active="currentPath"
           >
            <el-sub-menu index="1">
              <template #title>
                <span>仪表盘</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/">
                  <el-icon>
                    <data-line />
                  </el-icon>
                  首页
                </el-menu-item>
                <el-menu-item index="/add">
                  <el-icon>
                    <data-line />
                  </el-icon>
                  添加商品
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                 <span>首页配置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/swiper">
                  <el-icon size="18" color="#fff"><picture-filled /></el-icon>
                  轮播图配置
                </el-menu-item>
                <el-menu-item index="/hot">
                  <el-icon><star /></el-icon>
                  热销商品配置
                </el-menu-item>
                <el-menu-item index="/new">
                  <el-icon><sell /></el-icon>
                  新品上线配置
                </el-menu-item>
                <el-menu-item index="/recommend">
                  <el-icon><pointer /></el-icon>
                  为你推荐配置
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <span>模块管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/category">
                  <el-icon><list /></el-icon>
                  分类管理
                </el-menu-item>
                <el-menu-item index="/good">
                  <el-icon><goods /></el-icon>      
                  商品管理
                </el-menu-item>
                <el-menu-item index="/order">
                  <el-icon><tickets /></el-icon>
                  订单管理
                </el-menu-item>
                <el-menu-item index="/guest">
                  <el-icon><user /></el-icon>
                  会员管理
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>
      <el-container class="content">
        <Header />
        <div class="main">
          <router-view />
        </div>
        <Footer />
      </el-container>
    </el-container>
    <el-container class="container" v-else>
      <router-view />
    </el-container>
  </div>
</template>

<script>
import { DataLine } from "@element-plus/icons-vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useRouter } from "vue-router";
import { reactive,toRefs } from "vue";
import { localGet, pathMap } from "./utils";

export default {
  name: "App",
  components: {
    DataLine,
    Header,
    Footer,
  },
  setup(){
    const noMenu = ['/login']
    const router = useRouter()
    const state = reactive({
      showMenu:true,
      defaultOpen:['1','2','3'],
      currentPath:'/'
    })
    router.beforeEach((to,from,next) => {
      if(to.path == '/login'){
        next()
      }else{
        if(!localGet('token')){
          next({path:'/login'})
        }else{
          next()
        }
      }
      state.showMenu = !noMenu.includes(to.path)
      state.currentPath = to.path
      document.title = pathMap[to.name]
    })

    return {
      ...toRefs(state)
    }
  }
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #fff;
}
.container {
  height: 100vh;
}
.aside {
  width: 200px !important;
  background-color: #222832;
}
.head {
  display: flex;
  align-items: center;
  height: 50px;
}
.head > div {
  display: flex;
  align-items: center;
}
.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.head span {
  font-size: 20px;
  color: #fff;
}
.line {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.content {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}
.main {
  height: calc(100vh-100px);
  overflow: auto;
  padding: 10px;
}
</style>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.el-menu {
  border-right: none !important;
}
.el-submenu {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.el-submenu:first-child {
  border-top: none;
}
.el-submenu [class^="el-icon-"] {
  vertical-align: -1px !important;
}
a {
  color: #409eff;
  text-decoration: none;
}
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
.el-popper__arrow {
  display: none;
}
</style>
