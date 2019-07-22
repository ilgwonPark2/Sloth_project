import {
  app,
  BrowserWindow,
  ipcMain
  // ,globalShortcut
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
    // stopNpm()
  })
}

function startNpm() {
  var exec = require("child_process").exec, child;
  var base = './node_modules/npm-gui/'
  var dir = require('path').join(__dirname, base)
  var dir_exec = process.env.NODE_ENV === 'development' ? base : dir
  var d_name = "index.js"
  console.log(dir_exec);

  // +  dir_exec + d_name
  child = exec("node " + dir_exec + d_name, function(err, stdout, stderr) {
    if (err !== null) console.log('Error', err);
  });
}

// function stopNpm() {
//   let fileSize = '', fileArr = '', stdout = ''
//   // alert("server_info_memory function")
//   const execSync = require('child_process').execSync
//   try {
//     stdout = execSync('ps -ef | grep index.js');
//     fileSize = stdout.toString().trim()
//     var tmp_filesize = fileSize.split('/')
//     fileArr = tmp_filesize[0].split('  ')[1]
//   } catch (error) { console.log(error) }

//   try {
//     stdout = execSync('kill -9 ' + fileArr);
//   } catch (error) { console.log("error:  "  + error) }
// }

app.on('ready', createWindow)
app.on('ready', startNpm)
// app.on('ready', stopNpm)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
    // startNpm()
  }
})






/**
 * *** IPC interaction code ***
 * ipc interaction between server and front
 */



ipcMain.on('server_info', (event, arg) => {
  var jsonFile = read_server_config()
  event.sender.send('server_info_reply', jsonFile);
})

ipcMain.on('server_start', (event, arg) => {
  var exec = require('child_process').exec, child;
  const s_name = arg
  var base = '/static/node_server/'
  var dir = require('path').join(__dirname)
  var dir_exec = (process.env.NODE_ENV === 'development') ? base : dir
  var command = (process.env.NODE_ENV === 'development') ?
    "node ." + dir_exec + s_name + "/server_start.js":
    dir_exec + "/../../../../../../nodejs/bin/node " + dir_exec + base + s_name + "/server_start.js"

  child = exec(command, function(err, stdout, stderr) {
    // if (err !== null) event.sender.send('Error', err);
    // if (stdout !== null) event.sender.send('Error', stdout);
    // if (stderr !== null) event.sender.send('Error', stderr);
    if (err !== null) console.log(err)
    if (stdout !== null) console.log(err)
    if (stderr !== null) console.log(err)
  });
})

ipcMain.on('server_stop', (event, arg) => {
  const io = require('socket.io-client');
  var jsonFile = read_server_config()
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
    socketClient.emit('serverStop')
    socketClient.close()
  });

})

ipcMain.on('server_create', (event, arg) => {
  var exec = require('child_process').exec, child;
  var d_name = arg.server_name
  var base = './static/node_server/'
  var dir = require('path').join(__dirname, base)
  var dir_exec = process.env.NODE_ENV === 'development' ? base : dir
  var jsonFile = read_server_config()
  var fs = require('fs');

  child = exec("mkdir " + dir_exec + d_name, function(err, stdout, stderr) {
    if (err !== null) event.sender.send('Error', err);
  });
  child = exec("cp " + dir_exec + "node_template/* " + dir_exec + d_name, function(err, stdout, stderr) {
    if (err !== null) event.sender.send('Error', err);
  });

  var jb = {}, obj = {}
  jb['server_name'] = arg.server_name
  jb['server_address'] = 'localhost'
  jb['server_port'] = parseInt(arg.server_port)
  jsonFile.servers.push(jb)

  obj['servers'] = jsonFile.servers
  var json_str = JSON.stringify(obj, null, "\t")
  fs.writeFileSync(dir_exec + 'server_config.json', json_str, function(err) { if (err) throw err; });
  event.returnValue = null
})

ipcMain.on('server_remove', (event, arg) => {
  var exec = require("child_process").exec, child;
  var jsonFile = read_server_config()
  var d_name = arg
  var base = './static/node_server/'
  var dir = require('path').join(__dirname, base)
  var dir_exec = process.env.NODE_ENV === 'development' ? base : dir
  var fs = require('fs');

  child = exec("rm -rf " + dir_exec + d_name, function(err, stdout, stderr) {
    if (err !== null) event.sender.send('Error', err);
  });

  for (var i = 0; i < jsonFile.servers.length; i++)  if (d_name == jsonFile.servers[i].server_name) jsonFile.servers.splice(i, 1);

  var obj = {};
  obj['servers'] = jsonFile.servers
  var json_str = JSON.stringify(obj, null, "\t")
  fs.writeFileSync(dir_exec + 'server_config.json', json_str, function(err) { if (err) throw err; });
})

ipcMain.on('apply_design', (event, arg) => {
  var wget = require('wget')
  var exec = require('child_process').exec, child;
  var d_name = arg[1]
  var base = './static/node_server/'
  var dir = require('path').join(__dirname, base)
  var dir_exec = process.env.NODE_ENV === 'development' ? base : dir
  var DOWNLOAD_DIR = "https://templated.co/" + arg[0] + "/download"

  var output = dir_exec + d_name + "/template.tar.gz"
  var options = {};
  var download = wget.download(DOWNLOAD_DIR, output, options);
  download.on('error', function(err) {
      console.log(err);
  });
  download.on('end', function(output) {
      console.log(output);
  });
  download.on('progress', function(progress) {
  });

setTimeout( () => {
  var tar = 'cd '+ dir_exec + d_name +' && tar -xvzf ./template.tar.gz && rm -rf ./template.tar.gz'
  console.log(tar)
  child = exec(tar, function(err, stdout, stderr) {
   if (err) throw err;
   else console.log('tar tar');
  });
}, 10000);
event.sender.send('apply_design_reply', '');
})


// ipcMain.on('start_npm_gui', (event) => {
//   var exec = require("child_process").exec, child;
//   var base = './node_modules/npm-gui'
//   var dir = require('path').join(__dirname, base)
//   var dir_exec = process.env.NODE_ENV === 'development' ? base : dir
//   var d_name = "index.js"
//   console.log(dir_exec);

//   // +  dir_exec + d_name
//   child = exec("node node_modules/npm-gui/index.js" , function(err, stdout, stderr) {
//     if (err !== null) event.sender.send('Error', err);
//   });

// // })

// ipcMain.on('stop_npm_gui', (event) => {
//   const io = require('socket.io-client');

//   const socketClient = io.connect('http://localhost:1337');
//   socketClient.on('connect', () => {
//     socketClient.emit('serverStop')
//     socketClient.close()
//   });

// })





function read_server_config(){
  var fs = require('fs');
  var base = './static/node_server/'
  var dir = require('path').join(__dirname, base)
  var dir_exec = process.env.NODE_ENV === 'development' ? base : dir
  var jsonFile = fs.readFileSync(dir_exec + 'server_config.json');
  jsonFile = JSON.parse(jsonFile)
  return jsonFile
}
