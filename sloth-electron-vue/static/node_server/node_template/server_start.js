const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app);

var jsonFile = require('../server_config.json')
var s_name_list = __dirname.split('/')
const s_name = s_name_list[s_name_list.length-1]

var index = 0
for (var i = 0; i < jsonFile.servers.length; i++) {
  if (jsonFile.servers[i].server_name == s_name) {
    index = i
    break;
  } else {
    console.log("no server")
  }
}
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  next();
});

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/test', (req, res) => res.send('test page, it is,' + jsonFile.servers[index].server_port))
server.listen(jsonFile.servers[index].server_port, () => console.log(`Example app listening on port ${jsonFile.servers[index].server_port }!`))
const io = require('socket.io')(server)
io.on('connection', (socketServer) => {
  socketServer.on('serverStop', () => {
    server.close()
    socketServer.disconnect(true)
    console.log('server is termniated');
    process.exit(0)
  });
});
