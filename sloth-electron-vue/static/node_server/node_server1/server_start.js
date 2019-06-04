const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app);
const jsonFile = require('../test_config')
const s_name='node_server1'

var index=0
for(i=0; i<jsonFile.servers.length; i++) {
        if(jsonFile.servers[i].server_name == s_name) {
                index=i
                break;
        }
}


app.get('/', (req, res) => res.send('Hello World!'))
app.get('/test', (req, res) => res.send('test page, it is' + jsonFile.servers[index].port ))

server.listen(jsonFile.servers[index].port, () => console.log(`Example app listening on port ${jsonFile.servers[index].port }!`))


const io = require('socket.io')(server)
io.on('connection', (socketServer) => {
  socketServer.on('serverStop', () => {
    process.exit(0);
  });
  console.log('server is termniated');
});
