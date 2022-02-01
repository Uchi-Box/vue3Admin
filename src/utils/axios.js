import axios from "axios";
import router from "../router";
import config from '~/config'
import {localGet,localSet} from './index'

//根据环境切换baseurl
axios.defaults.baseURL = config[import.meta.env.MODE].baseUrl
//携带cookieimport { localGet } from './index';

axios.defaults.withCredentials = true
//header设置
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localGet('token') || ''
//默认post时使用application/json形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object'){
        alert('服务端异常！')
        return Promise.reject(res)
    }
    if (res.data.resultCode !== 200){
        if (res.data.message) alert(res.data.message)
        if (res.data.resultCode == 419){
            router.push({ path:'/login' })
        }
        return Promise.reject(res.data)
    }

    return res.data.data
})

export default axios