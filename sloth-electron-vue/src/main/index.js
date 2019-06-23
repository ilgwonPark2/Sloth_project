import {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut
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

  globalShortcut.register('f5', function() {
    console.log('f5 is pressed')
    mainWindow.reload()
  })
  globalShortcut.register('CommandOrControl+R', function() {
    console.log('CommandOrControl+R is pressed')
    mainWindow.reload()
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







/**
 * *** IPC interaction code ***
 * ipc interaction between server and front
 */



ipcMain.on('server_info', (event, arg) => {
  var jsonFile = require('../../static/node_server/server_config.json')
  event.sender.send('server_info_reply', jsonFile);
})

ipcMain.on('server_start', (event, arg) => {
  const express = require('express')
  const http = require('http')
  const app = express()
  const server = http.createServer(app);

  var jsonFile = require('../../static/node_server/server_config.json')
  const s_name = arg
  var index = 0
  for (var i = 0; i < jsonFile.servers.length; i++) {
    if (jsonFile.servers[i].server_name == s_name) {
      index = i
      break;
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
      server.close();
      console.log('server is termniated');
    });
  });
})

ipcMain.on('server_stop', (event, arg) => {
  const io = require('socket.io-client');
  var jsonFile = require('../../static/node_server/server_config.json')
  const s_name = arg
  var index = 0
  for (var i = 0; i < jsonFile.servers.length; i++) {
    if (jsonFile.servers[i].server_name == s_name) {
      index = i
      break;
    }
  }

  const socketClient = io.connect('http://localhost:' + jsonFile.servers[index].server_port);
  socketClient.on('connect', () => {
    socketClient.emit('serverStop');
    // setTimeout(() => {// process.exit(0); }, 500);
  });
  // console.log('stopped ' + jsonFile.servers[index].server_port)

})

ipcMain.on('server_create', (event, arg) => {
  // console.log("server: receives" + arg.server_port) // prints "ping"
  var exec = require('child_process').exec, child;
  var d_name = arg.server_name
  var jsonFile = require('../../static/node_server/server_config.json')
  var base = './static/node_server/'
  var dir = require('path').join(__dirname, base)
  var dir_exec = process.env.NODE_ENV === 'development' ? base : dir

  child = exec("cp -r " + dir_exec + "node_template " + dir_exec + d_name, function(err, stdout, stderr) {
    if (err !== null) event.sender.send('Error', err);
  });

  var jb = {}, obj = {}
  jb['server_name'] = arg.server_name
  jb['server_address'] = 'localhost'
  jb['server_port'] = parseInt(arg.server_port)
  jsonFile.servers.push(jb)

  obj['servers'] = jsonFile.servers
  var json_str = JSON.stringify(obj, null, "\t")
  var fs = require('fs');

  fs.writeFileSync(dir_exec + 'server_config.json', json_str, function(err) { if (err) throw err; });
  event.returnValue = null
})

ipcMain.on('server_remove', (event, arg) => {
  var exec = require("child_process").exec, child;
  var jsonFile = require('../../static/node_server/server_config.json')
  var d_name = arg
  var base = './static/node_server/'
  var dir = require('path').join(__dirname, base)
  var dir_exec = process.env.NODE_ENV === 'development' ? base : dir

  child = exec("rm -rf " + dir_exec + d_name, function(err, stdout, stderr) {
    if (err !== null) event.sender.send('Error', err);
  });

  for (var i = 0; i < jsonFile.servers.length; i++)  if (d_name == jsonFile.servers[i].server_name) jsonFile.servers.splice(i, 1);

  var obj = {};
  obj['servers'] = jsonFile.servers
  var json_str = JSON.stringify(obj, null, "\t")
  var fs = require('fs');

  fs.writeFile(dir_exec + "server_config.json", json_str, function(err) { if (err) throw err; });
})
