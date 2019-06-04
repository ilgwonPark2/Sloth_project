import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9070` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 1200,
    useContentSize: true,
    width: 1400
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


// ipc interaction between server and front

ipcMain.on('server_start', (event, arg) => {
  const express = require('express')
  const http = require('http')
  const app = express()
  const server = http.createServer(app);

  var jsonFile = require('../../static/node_server/test_config')
  const s_name = arg
  var index = 0
  for (var i = 0; i < jsonFile.servers.length; i++) {
    if (jsonFile.servers[i].server_name == s_name) {
      index = i
      break;
    }
  }
  app.get('/', (req, res) => res.send('Hello World!'))
  app.get('/test', (req, res) => res.send('test page, it is,' + jsonFile.servers[index].port))
  server.listen(jsonFile.servers[index].port, () => console.log(`Example app listening on port ${jsonFile.servers[index].port }!`))
  const io = require('socket.io')(server)
  io.on('connection', (socketServer) => {
    socketServer.on('serverStop', () => {
      // process.exit(0);
      server.close();
      console.log('server is termniated');
    });
  });
})

ipcMain.on('server_stop', (event, arg) => {
  const io = require('socket.io-client');
  var jsonFile = require('../../static/node_server/test_config')
  const s_name = arg
  var index = 0
  for (var i = 0; i < jsonFile.servers.length; i++) {
    if (jsonFile.servers[i].server_name == s_name) {
      index = i
      break;
    }
  }

  // console.log(jsonFile.servers[index].port);
  const socketClient = io.connect('http://localhost:' + jsonFile.servers[index].port);
  socketClient.on('connect', () => {
    socketClient.emit('serverStop');
    setTimeout(() => {
      // process.exit(0);
    }, 500);
  });
  console.log('stopped '+jsonFile.servers[index].port)
})

ipcMain.on('server_create', (event, arg) => {
  console.log("server: receives" + arg.port) // prints "ping"
  var exec = require('child_process').exec,
    child;
  var d_name = arg.server_name
  var jsonFile = require('../../static/node_server/test_config')
  // console.log(exec("pwd"))
  console.log(jsonFile)
  child = exec("cp -r ./static/node_server/node_server1 ./static/node_server/" + d_name, function(err, stdout, stderr) {
    if (err !== null) {
      console.log('exec error:' + err);
    }
  });

  var jb = {};
  jb['server_name'] = arg.server_name
  jb['address'] = 'localhost'
  jb['port'] = parseInt(arg.server_port)
  jsonFile.servers.push(jb)

  var obj = {};
  obj['servers'] = jsonFile.servers

  var json_str = JSON.stringify(obj, null, "\t")

  var fs = require('fs');
  fs.writeFile('./static/node_server/test_config.json', json_str, function(err) {
    if (err) throw err;
    console.log('Saved!');
  });
  event.returnValue = null
})

ipcMain.on('server_delete', (event, arg) => {
  var exec = require("child_process").exec, child;
  var jsonFile = require('../../static/node_server/test_config')
  var d_name = arg
  
  child = exec("rm -rf ./static/node_server/"+ d_name, function(err, stdout, stderr) {
     // console.log('stdout: ' + stdout);
     // console.log('stderr: ' + stderr);
      if(err !== null) {
          console.log('exec error: ' + err);
      }
  });
  
  for(i=0; i<jsonFile.servers.length; i++) {
      if(d_name == jsonFile.servers[i].server_name) {
         jsonFile.servers.splice(i, 1);
      }
  }
  
  var obj={};
  obj['servers']=jsonFile.servers
  
  var json_str=JSON.stringify(obj, null, "\t")
  
  var fs = require('fs');
  fs.writeFile('../../static/node_server/test_config', json_str, function (err) {
      if(err) throw err;
      console.log('Success');
  });
})