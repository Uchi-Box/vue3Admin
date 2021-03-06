import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default ({mode}) => defineConfig({
  plugins: [
    vue(),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // }),
  ],
  resolve:{
    alias:{
      '~':path.resolve(__dirname,'./'),
      '@':path.resolve(__dirname,'src')
    },
    extensions:['.vue','.js','jsx','.json']
  },
  server:{
    proxy:{
      '/api':{      
        target: 'http://backend-api-02.newbee.ltd/manage-api/v1', // 凡是遇到 /api 路径的请求，都映射到 target 属性
        changeOrigin:true,
        rewrite: path => path.replace(/^\/api/, '') //去掉api
      }
    }
  }
})