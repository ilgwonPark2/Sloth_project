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

app.on('ready', () => {
  create_window()
  start_npm_gui()
  start_mysql_gui()
  mysql_check()
  // console.log("test22: " + mysql_status())
})
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('will-quit', () => {
   stop_npm_gui()
   stop_mysql_gui()
 })
app.on('activate', () => { if (mainWindow === null) create_window() })






/**
 * *** IPC interaction code ***
 * ipc interaction between server and front
 */



ipcMain.on('server_node_info', (event, arg) => {
  var jsonFile = read_server_config()
  event.sender.send('server_node_info_reply', jsonFile);
})

ipcMain.on('server_node_start', (event, arg) => {
  var exec = require('child_process').exec, child
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

ipcMain.on('server_node_stop', (event, arg) => {
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

ipcMain.on('server_node_create', (event, arg) => {
  var exec = require('child_process').exec, child
  const d_name = arg.server_name
  const dir_exec = get_path()
  const jsonFile = read_server_config()
  const fs = require('fs')

  child = exec("mkdir " + dir_exec + d_name, function(err, stdout, stderr) {
    if (err !== null) event.sender.send('Error', err);
  });
  child = exec("cp -r " + dir_exec + "node_template/* " + dir_exec + d_name, function(err, stdout, stderr) {
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

ipcMain.on('server_node_remove', (event, arg) => {
  var exec = require("child_process").exec, child
  const jsonFile = read_server_config()
  const d_name = arg
  const dir_exec = get_path()
  const fs = require('fs');

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
  var d_name = arg[1]
  var exec = require('child_process').exec, child
  var dir_exec = get_path()
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
   else console.log('tar');
  });
  event.sender.send('apply_design_reply', '')
}, 8000);
})

// ipcMain.on('npm_start', (event, arg) => { start_npm_gui() })

ipcMain.on('npm_stop', (event, arg) => { stop_npm_gui() })

ipcMain.on('server_mysql_status', (event, arg) => {
  const execSync = require('child_process').execSync
  var result
  try {
    var parm = execSync("lsof -i:3306")
    event.sender.send('server_mysql_status_reply', true);
  } catch(err){
    console.log('no server detected')
    event.sender.send('server_mysql_status_reply', false);
  }
})

ipcMain.on('server_mysql_start', (event, arg) =>{
  console.log('server_mysql_start');
  mysql_start();
})

ipcMain.on('server_mysql_stop', (event, arg) =>{
  console.log('server_mysql_stop');
  mysql_stop(); })






function create_window() {
  // Initial window options
  mainWindow = new BrowserWindow({
    height: 1200,
    useContentSize: true,
    width: 1400
  })
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => mainWindow = null )
}


function read_server_config() {
  var fs = require('fs')
  const dir_exec = get_path()
  var jsonFile = fs.readFileSync(dir_exec + 'server_config.json');
  jsonFile = JSON.parse(jsonFile)
  return jsonFile
}

function get_path() {
  var base = './static/node_server/'
  var dir = require('path').join(__dirname, base)
  var dir_exec = (process.env.NODE_ENV === 'development') ? base : dir
  return dir_exec
}

function start_npm_gui(event, arg) {
  var exec = require('child_process').exec, child
  var base = './node_modules/npm-gui/'
  var dir = require('path').join(__dirname)
  var dir_exec = process.env.NODE_ENV === 'development' ? base : dir
  var d_name = "index.js"
  var dir_value = ''
  // console.log('start/ build: '+dir+'/node_modules/npm-gui/')
  // console.log('start/ dev: '+ dir_exec)

  var command = (process.env.NODE_ENV === 'development') ?
  "node " + dir_exec + d_name :
  dir_exec + "/../../../../../../nodejs/bin/node "  + dir_exec + '/../../node_modules/npm-gui/' + d_name
  // console.log('command/ build: '+ command)
  // console.log('command/ dev: '+ dir + "/../../../../../../nodejs/bin/node "  + dir + '/../../node_modules/npm-gui/' + d_name )
  child = exec(command, function(err, stdout, stderr) {
    if (err !== null) {
      console.log(err)
    }
  });
}

function stop_npm_gui() {
  let fileSize = '', fileArr = '', stdout = ''
  // alert("server_node_info_memory function")
  const execSync = require('child_process').execSync
  try {
    stdout = execSync('ps -ef | grep npm-gui/index.js');
    fileSize = stdout.toString().trim()
    console.log('fileSzie: ' + fileSize)
    var tmp_filesize = fileSize.split('/')
    console.log('tmp_filesize: ' + tmp_filesize)
    fileArr = tmp_filesize[0].split('  ')[1]
    console.log('fileArr: ' + fileArr)
  } catch (error) { console.log(error) }

  try {
    stdout = execSync('kill -9 ' + fileArr);
  } catch (error) { console.log("error:  "  + error) }
}

function start_mysql_gui(event, arg) {
  var exec = require('child_process').exec, child
  var base = './node_modules/nodeadmin/'
  var dir = require('path').join(__dirname)
  var dir_exec = process.env.NODE_ENV === 'development' ? base : dir
  var d_name = "app.js"
  var dir_value = ''
  console.log('start/ build: ' + dir + '/node_modules/nodeadmin/')
  console.log('start/ dev: '+ dir_exec)

  var command = (process.env.NODE_ENV === 'development') ?
  "node " + dir_exec + d_name :
  dir_exec + "/../../../../../../nodejs/bin/node "  + dir_exec + '/../../node_modules/nodeadmin/' + d_name
  console.log('command/ build: '+ command)
  console.log('command/ dev: '+ dir + "/../../../../../../nodejs/bin/node "  + dir + '/../../node_modules/nodeadmin/' + d_name )
  child = exec(command, function(err, stdout, stderr) {
    if (err !== null) {
      console.log(err)
    }
  });
}

function stop_mysql_gui() {
  let fileSize = '', fileArr = '', stdout = ''
  // alert("server_node_info_memory function")
  const execSync = require('child_process').execSync
  try {
    stdout = execSync('ps -ef | grep nodeadmin/app.js');
    fileSize = stdout.toString().trim()
    console.log('fileSzie: ' + fileSize)
    var tmp_filesize = fileSize.split('/')
    console.log('tmp_filesize: ' + tmp_filesize)
    fileArr = tmp_filesize[0].split('  ')[1]
    console.log('fileArr: ' + fileArr)
  } catch (error) { console.log(error) }

  try {
    stdout = execSync('kill -9 ' + fileArr);
  } catch (error) { console.log("error:  "  + error) }
}

function mysql_check() {
  var exec = require('child_process').exec, child
  var command = "test -e /tmp/mysql.sock && echo true || echo false"
  var result
  child = exec(command, function(err, stdout, stderr) {
    if (err !== null) console.log(err)
    if (stdout !== null) console.log(err)
    if (stderr !== null) console.log(err)
    if (stdout === "false") console.log("false!!: "+ result)
    // console.log('stdout : ' + stdout.trim() + ", " + typeof(stdout))

    if(stdout.trim() === "false") {
      mysql_setup()
      console.log('no sql')
    } else {
      console.log('yes sql')
    }
  });
}

function mysql_setup() {
  var exec = require('child_process').exec, child
  var dir = require('path').join(__dirname)
  var command = (process.env.NODE_ENV === 'development') ?
    "cd " + require('path').resolve(dir) + "/../../build/mac/mysql; ./scripts/mysql_install_db":
    "cd " + dir + "/../../../../../../mysql; ./scripts/mysql_install_db "

  child = exec(command, function(err, stdout, stderr) {
    // if (err !== null) event.sender.send('Error', err);
    // if (stdout !== null) event.sender.send('Error', stdout);
    // if (stderr !== null) event.sender.send('Error', stderr);
    if (err !== null) console.log(err)
    if (stdout !== null) console.log(err)
    if (stderr !== null) console.log(err)
  });
}

function mysql_start() {
  var exec = require('child_process').exec, child
  var dir = require('path').join(__dirname)
  console.log('in the fucntion mysql_start')
  var command = (process.env.NODE_ENV === 'development') ?
    "cd "+require('path').resolve(dir) + "/../../build/mac/mysql ; ./bin/mysqld_safe":
    "cd " + dir + "/../../../../../../mysql; ./bin/mysqld_safe"

  child = exec(command, function(err, stdout, stderr) {
    // if (err !== null) event.sender.send('Error', err);
    // if (stdout !== null) event.sender.send('Error', stdout);
    // if (stderr !== null) event.sender.send('Error', stderr);
    if (err !== null) console.log(err)
    if (stdout !== null) console.log(stdout)
    if (stderr !== null) console.log(stderr)

  });
}

function mysql_stop() {
  var exec = require('child_process').exec, child
  var dir = require('path').join(__dirname)
  var command = (process.env.NODE_ENV === 'development') ?
    require('path').resolve(dir) + "/../../build/mac/mysql/bin/mysqladmin -u root shutdown":
    "cd " + dir + "/../../../../../../mysql; ./bin/mysqladmin -u root shutdown"

  child = exec(command, function(err, stdout, stderr) {
    // if (err !== null) event.sender.send('Error', err);
    // if (stdout !== null) event.sender.send('Error', stdout);
    // if (stderr !== null) event.sender.send('Error', stderr);
    if (err !== null) console.log(err)
    if (stdout !== null) console.log(err)
    if (stderr !== null) console.log(err)
  });
}

function mysql_status() {
  var result = true
  var exec = require('child_process').exec, child
  var dir = require('path').join(__dirname)
  var command = (process.env.NODE_ENV === 'development') ?
    "echo `" + require('path').resolve(dir) + "/../../build/mac/mysql/bin/mysqladmin -u root processlist`":
    "echo `cd "+ dir + "/../../../../../../mysql; ./bin/mysqladmin -u root processlist`"
  child = exec(command, function(err, stdout, stderr) {
    if (err !== null) console.log("err: " + err)
    if (stdout !== null) console.log("stdout: " + stdout)
    if (stderr !== null) console.log("stderr: " + stderr)
    console.log(stdout)
    // if (stdout.includes("error: 'Can't connect to local MySQL server through socket '/tmp/mysql.sock'")) result = false
    // else result = true
    console.log('stdout includes: ' +  result)
  });
  console.log('before return from mysql_status()')
  return result
}
