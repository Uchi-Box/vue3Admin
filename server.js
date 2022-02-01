const server = require('pushstate-server')

server.start({
  port:3030,
  directory:'./dist'
})