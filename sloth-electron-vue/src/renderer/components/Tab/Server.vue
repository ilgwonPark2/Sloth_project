<template>
<div style="height:88vh;">
  <b-container style="margin-top:50px;">
    <b-row align-h="end">
      <b-button v-b-modal.node-server-create-modal pill variant="warning">New Node Server</b-button>
      <b-button style="margin-left:15px;" pill variant="success">Start All</b-button>
      <b-button style="margin-left:15px;" pill variant="success">Stop All</b-button>
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
          <b-button size="md" class="fa fa-trash" @click="item_remove = row.item;" v-b-modal.node-server-remove-modal pill aria-hidden="true">
          </b-button>
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
     <b-button size="sm" variant="success" @click="ok();cancel()">
       Create
     </b-button>
     <b-button size="sm" variant="danger" @click="cancel()">
       Cancel
     </b-button>
   </template>
  </b-modal>

  <b-modal centered id="node-server-remove-modal" ref="node-server-remove-modal" title="Remove new node server" @ok="onSubmit">
    Are you sure to remove this server?
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
     <!-- Emulate built in modal footer ok and cancel button actions -->
     <b-button size="sm" variant="success" @click="ok();cancel()">
       Remove
     </b-button>
     <b-button size="sm" variant="danger" @click="cancel()">
       Cancel
     </b-button>
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
      show: true
    }
  },
  mounted: function() {
    ipcRenderer.on('Error', (event, arg) => {
      alert(JSON.stringify(arg))
    });

    ipcRenderer.send('server_info');
    ipcRenderer.on('server_info_reply', (event, arg) => {
      this.server_info(arg)
    });
  },
  methods: {
    server_info(file){
      this.items = {}
      var jsonFile = file;
      var jsonArr = []

      for (var i = 0; i < jsonFile.servers.length; i++) {
        var item = {}
        item["server_control"] = false
        item["server_name"] = jsonFile.servers[i].server_name
        item["server_port"] = jsonFile.servers[i].server_port
        item["performance"] = {
          memory: '20.33MB',
          cpu: i + '%',
          size: '200MB'
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
    },
    server_create(item) {
      ipcRenderer.send('server_create', item);
      ipcRenderer.send('server_info');
    },
    server_remove(item) {
      if(item.server_control === true) this.server_toggle(item);
      ipcRenderer.send('server_remove', item.server_name);
      ipcRenderer.send('server_info');
    },
    server_ControlAll(status){
      if(status === "StartAll"){
        // fr
      } else {

      }
    },
    server_status_check(server_port, idx){
      // Make a request for a user with a given ID
      // var index = this.find_elem(item);
      axios.get('http://localhost:' + server_port)
        .then(response => {
          // handle success
          // console.log("response: " + JSON.stringify(response));
          // var index = this.find_elem(item);
          this.items[idx].server_control = true;
          // this.items[i].server
        })
        .catch(error => {
          // handle error
          // console.log("error: " + error);
          this.items[idx].server_control = false;
        })
        // setTimeout(function(){
        //     console.log(result)
        //   }, 200);
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
