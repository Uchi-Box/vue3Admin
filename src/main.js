import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'


const app = createApp(App)

const orderStatus = {
  0: '待支付',
  1: '已支付',
  2: '配货完成',
  3: '出库成功',
  4: '交易成功',
  '-1': '手动关闭',
  '-2': '超时关闭',
  '-3': '商家关闭'
}

app.config.globalProperties.$filters = {
  orderMap(status) {
    return orderStatus[status] || '未知状态'
  },
  prefix(url){
    if(url && url.startsWith('http')){
      return url
    } else {
      url = `http://backend-api-02.newbee.ltd${url}`
      return url
    }
  }
}


Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

app
.use(router)
.use(ElementPlus)
.mount('#app')