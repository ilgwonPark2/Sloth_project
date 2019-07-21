<template>
<div style="height:88vh;">
  <b-container style="margin-top:50px;">
    <b-row align-h="end">
      <b-button v-b-modal.node-server-create-modal pill variant="warning">New Node Server</b-button>
      <b-button style="margin-left:15px;" pill variant="info" @click="server_refresh()">Refresh</b-button>
      <b-button style="margin-left:15px;" pill variant="success" @click="server_controlAll('start')">Start All</b-button>
      <b-button style="margin-left:15px;" pill variant="success" @click="server_controlAll('stop')">Stop All</b-button>
    </b-row>
  </b-container>
  <b-container style="margin-top:50px;">
    <b-row>
      <b-table hover big :items="items" :fields="fields">
        <template slot="server_control" slot-scope="row">
          <b-button size="sm" class="mr-2">
            <i class="fa" :class="[row.item.server_control? 'fa-toggle-on': 'fa-toggle-off']" @click="server_toggle(row.item)"  aria-hidden="true"></i>
          </b-button>
        </template>
        <template slot="server_removal" slot-scope="row">
          <b-button size="md" class="fa fa-trash" @click="item_remove = row.item;" v-b-modal.node-server-remove-modal pill aria-hidden="true"></b-button>
        </template>
      </b-table>
    </b-row>
  </b-container>

  <b-modal centered id="node-server-create-modal" ref="node-server-create-modal" title="Create new node server" @ok="onSubmit">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-1" label="Server Name:" label-for="input-1">
        <!-- <b-form-group id="input-group-1" label="Email address:" label-for="input-1" description="We'll never share your email with anyone else."> -->
        <b-form-input id="input-1" v-model="form.server_name" required placeholder="Enter server name"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Server Port:" label-for="input-2" description="Port range: 0 to 65535.">
        <b-form-input id="input-2" v-model="form.server_port" required placeholder="Enter server port"></b-form-input>
      </b-form-group>

    </b-form>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
     <!-- Emulate built in modal footer ok and cancel button actions -->
     <b-button size="sm" variant="success" @click="ok();cancel()"> Create </b-button>
     <b-button size="sm" variant="danger" @click="cancel()"> Cancel </b-button>
   </template>
  </b-modal>

  <b-modal centered id="node-server-remove-modal" ref="node-server-remove-modal" title="Remove new node server" @ok="onSubmit">
    Are you sure to remove this server?
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
     <!-- Emulate built in modal footer ok and cancel button actions -->
     <b-button size="sm" variant="success" @click="ok();cancel()"> Remove </b-button>
     <b-button size="sm" variant="danger" @click="cancel()"> Cancel </b-button>
   </template>
  </b-modal>
</div>
</template>

<script>
const {ipcRenderer} = require('electron')
const axios = require('axios');


export default {
  name: 'home',
  data() {
    return {
      // Note 'age' is left out and will not appear in the rendered table
      fields: {
        server_control: { label: 'Start/Stop' },
        server_name: { label: 'Server' },
        server_port: { label: 'Port' },
        "performance.memory": { label: 'Memory' },
        "performance.cpu": { label: 'CPU'},
        "performance.size": { label: 'Size' },
        server_removal: {label: 'Remove'}
      },
      items: [],
      form: {
        server_name: '',
        server_port: ''
      },
      item_remove: '',
      show: true,
      timer: ''
    }
  },
  mounted: function() {
    this.server_refresh()
    this.timer = this.server_refresh()
    ipcRenderer.on('Error', (event, arg) => { alert(JSON.stringify(arg)) });
    ipcRenderer.on('server_info_reply', (event, arg) => { this.server_info(arg) });

    // refresh timer
    setInterval(this.server_refresh, 15000);
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    server_info_memory(name, port) {
      var s_name = name, s_port = port
      var base = './static/node_server/'
      var dir = require('path').join(__dirname, base)
      var dir_exec = (process.env.NODE_ENV === 'development') ? base : dir
      let info = {}
      info["cpu"] = "0.0 "
      info["memory"] = "0.0M"
      let pid_list = []
      let fileSize = '', fileArr = '', tmp_ids = '', tmp = '',
          pid = '', tmp_size='', stdout = ''
      // alert("server_info_memory function")
      const execSync = require('child_process').execSync
      try {
        stdout = execSync('du -hs ' + dir_exec + s_name);
        fileSize = stdout.toString().trim()
        var tmp_filesize = fileSize.split('/')
        fileArr = tmp_filesize[0].split('\t')[0]
        info["size"] = fileArr
      } catch (error) { console.log(error) }

      try {
        console.log(s_port)
        stdout = execSync('lsof -iTCP:' + s_port);
        tmp_ids = String.fromCharCode.apply(null, stdout)
        console.log(tmp_ids)
      } catch (error) { console.log("error:  "  + error) }

      try{
        if (tmp_ids === '') { } // alert('error: ' + err);
        else {
          pid_list = tmp_ids.split("\n")
          for (var i = 0; i < pid_list.length; i++) {
            if(pid_list[i].includes("LISTEN")) {
              pid_list = pid_list[i].split(" ")
              break
            }
          }
          for (var i = 0; i < pid_list.length; i++) {
            if(Number.isInteger(parseInt(pid_list[i]))) {
              pid = pid_list[i]
              break
            }
          }
          stdout = execSync('ps -eo pid,rss,vsize,pmem,pcpu | grep ' + pid)
          tmp_ids = String.fromCharCode.apply(null, stdout)
          var performance = tmp_ids.split('  ')
          info["cpu"] = performance.pop()
          info["memory"] = performance.pop() + "M"
        }
      } catch (error) {}
      return info;
    },
    server_info(file){
      this.items = {}
      var jsonFile = file;
      var jsonArr = []
      for (var i = 0; i < jsonFile.servers.length; i++) {
        var item = {}, perform = {}
        item["server_control"] = false
        item["server_name"] = jsonFile.servers[i].server_name
        item["server_port"] = jsonFile.servers[i].server_port
        perform = this.server_info_memory(item["server_name"], item["server_port"])
        item["performance"] = {
          memory: perform.memory,
          cpu: perform.cpu + "%",
          size: perform.size
        }
        jsonArr.push(item);
      }
      this.items = jsonArr
      for (var i = 0; i < jsonFile.servers.length; i++) {
        this.server_status_check(jsonFile.servers[i].server_port, i)
      }
    },
    server_toggle(item) {
      var index = this.find_elem(item);
      if (this.items[index].server_control) ipcRenderer.send('server_stop', item.server_name);
      else ipcRenderer.send('server_start', item.server_name);
      this.items[index].server_control = !this.items[index].server_control;
      setTimeout(() => { ipcRenderer.send('server_info') }, 500);
    },
    server_refresh(){
      ipcRenderer.send('server_info')
    },
    server_create(item) {
      ipcRenderer.send('server_create', item)
      this.server_refresh()
    },
    server_remove(item) {
      if(item.server_control === true) this.server_toggle(item)
      ipcRenderer.send('server_remove', item.server_name)
      this.server_refresh()
    },
    server_controlAll(status){
      var param_toggle = (status === "start") ? 'server_start' : 'server_stop'
      this.items.forEach(function(item, arr) { ipcRenderer.send( param_toggle, item.server_name) })
      setTimeout(() => { this.server_refresh() }, 500);
    },
    server_status_check(server_port, idx){
      // Make a request for a user with a given ID
      axios.get('http://localhost:' + server_port)
        .then(response => { this.items[idx].server_control = true })
        .catch(error => { this.items[idx].server_control = false })
    },
    find_elem(item_find) {
      var result;
      this.items.forEach(function(item, index, arr) {
        if (JSON.stringify(item_find.server_name) === JSON.stringify(item.server_name)) result = index;
      })
      return result;
    },
    onSubmit(evt) {
      evt.preventDefault();
      switch (evt.componentId) {
        case "node-server-create-modal":
          this.server_create(this.form);
          break;
        case "node-server-remove-modal":
          this.server_remove(this.item_remove);
          this.item_remove="";
          break;
        default:
          // code block
      }
      this.form.server_name = ''
      this.form.server_port = ''
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.server_name = ''
      this.form.server_port = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>

<style lang="css">
</style>
