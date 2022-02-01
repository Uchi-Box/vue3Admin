module.exports = {
  app: [
    {
      name:'vue3Admin',
      script:'server.js'
    }
  ],
  deploy:{
    production: {
      user:'root',
      host:'110.42.247.107', //服务器地址
      ref:'origin/main', //git分支
      repo:'git@github.com:Uchi-Box/vue3Amin.git', //git地址
      path:'/projects/vue3Admin', //服务器的文件存放地址
      'post-deploy': 'git reset --hard && git checkout main && git pull && npm i --production=false && npm run build:release && pm2 startOrReload ecosystem.config.js', // 顺序执行这些指令，最后 pm2 startOrReload ecosystem.config.js 会通过 pm2 启动server.js
      env: {
        NODE_ENV:'production'
      }
    }
  }
}