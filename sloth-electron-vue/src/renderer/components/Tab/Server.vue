<template>
<div style="height:88vh;">
  <!-- <b-img src="./static/image/logo_medium.png" alt="sloth" style=" margin-bottom:20px; position:fixed; top:30%; left:25%;"></b-img> -->
  <b-container style="margin-top:50px;">
    <b-row align-h="end">
      <b-button v-b-modal.new-node-server-modal pill variant="warning">New Node Server</b-button>
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
      </b-table>
    </b-row>
  </b-container>

  <b-modal id="new-node-server-modal" ref="modal" title="Create new node server" @show="resetModal" @hidden="resetModal" @ok="onSubmit">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-1" label="Server Name:" label-for="input-1">
      <!-- <b-form-group id="input-group-1" label="Email address:" label-for="input-1" description="We'll never share your email with anyone else."> -->
        <b-form-input id="input-1" v-model="form.server_name" required placeholder="Enter server name"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Server Port:" label-for="input-2" description="Port range: 0 to 65535.">
        <b-form-input id="input-2" v-model="form.server_port" required placeholder="Enter server port" ></b-form-input>
      </b-form-group>

    </b-form>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
     <!-- Emulate built in modal footer ok and cancel button actions -->
     <b-button size="sm" variant="success" @click="ok()">
       Create
     </b-button>
     <b-button size="sm" variant="danger" @click="cancel()">
       Cancel
     </b-button>
   </template>
  </b-modal>
</div>
</template>

<script>
const {
  ipcRenderer
} = require('electron')
// console.log('front: sends ping ');
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping'))
// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
var jsonFile = require('../../../../static/node_server/test_config.json')
var jsonArr=[]

for (var i = 0; i < jsonFile.servers.length; i++) {
  var a = {}
  a["server_control"]=false
  a["server"]=jsonFile.servers[i].server_name
  a["port"]=jsonFile.servers[i].port
  a["performance"]= { memory: '20.33MB', cpu: i+'%', size:'200MB' }

  jsonArr.push(a)
}

export default {
  name: 'home',
  data() {
    return {
      // Note 'age' is left out and will not appear in the rendered table
      fields: {
        server_control: {
          label: 'Start/Stop'
        },
        server: {
          label: 'Server'
        },
        port: {
          label: 'Port'
        },
        "performance.memory": {
          label: 'Memory'
        },
        "performance.cpu": {
          label: 'CPU'
        },
        "performance.size": {
          label: 'Size'
        },
        removal: {
          label: 'Remove'
        }
      },
      items : jsonArr,
      form: {
        server_name: '',
        server_port: ''
      },
      show: true
    }
  },
  mounted: function() {

  },
  methods: {
    server_toggle(item) {
      console.log(item);
      console.log(item.server);
      var index = this.find_elem(item);
      if (this.items[index].server_control) {
        ipcRenderer.send('server_stop', item.server);
      } else {
        ipcRenderer.send('server_start', item.server);
      }
      this.items[index].server_control = !this.items[index].server_control;
    },
    server_control(item) {},
    server_create(item){
      console.log(item);
      ipcRenderer.send('server_create', item);
    },
    find_elem(item_find) {
      var result;
      this.items.forEach(function(item, index, arr) {
        if (JSON.stringify(item_find) === JSON.stringify(item)) result = index;
      })
      console.log(result);
      return result;
    },
    onSubmit(evt) {
      evt.preventDefault()
      // console.log(typeof(this.form));
      this.server_create(this.form);
      // alert(JSON.stringify(this.form));
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
