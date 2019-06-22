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
          <b-button size="md" class="fa fa-trash" @click="item_remove = row.item.server_name;"v-b-modal.node-server-remove-modal pill aria-hidden="true">
          </b-button>
        </template>
      </b-table>
    </b-row>
  </b-container>

  <b-modal centered id="node-server-create-modal" ref="modal" title="Create new node server" @show="resetModal" @hidden="resetModal" @ok="onSubmit">
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
     <b-button size="sm" variant="success" @click="ok()">
       Create
     </b-button>
     <b-button size="sm" variant="danger" @click="cancel()">
       Cancel
     </b-button>
   </template>
  </b-modal>

  <b-modal centered id="node-server-remove-modal" ref="modal" title="Remove new node server" @show="resetModal" @hidden="resetModal" @ok="onSubmit">
    Are you sure to remove this server?
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
     <!-- Emulate built in modal footer ok and cancel button actions -->
     <b-button size="sm" variant="success" @click="ok()">
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


export default {
  name: 'home',
  data() {
    return {
      // Note 'age' is left out and will not appear in the rendered table
      fields: {
        server_control: {
          label: 'Start/Stop'
        },
        server_name: {
          label: 'Server'
        },
        server_port: {
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
        server_removal: {
          label: 'Remove'
        }
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
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      alert(JSON.stringify(arg))
    });

    ipcRenderer.send('server_info');
    ipcRenderer.on('server_info_reply', (event, arg) => {
      this.server_info(arg)
    });
  },
  methods: {
    server_info(file){
      alert("hey, server_info" + file)
      this.items = null
      var jsonFile = file;
      var jsonArr = []

      for (var i = 0; i < jsonFile.servers.length; i++) {
        var a = {}
        a["server_control"] = false
        a["server_name"] = jsonFile.servers[i].server_name
        a["server_port"] = jsonFile.servers[i].server_port
        a["performance"] = {
          memory: '20.33MB',
          cpu: i + '%',
          size: '200MB'
        }
        jsonArr.push(a);
      }
      alert(JSON.stringify(jsonArr))
      this.items = jsonArr
    },
    server_toggle(item) {
      var index = this.find_elem(item);
      if (this.items[index].server_control) {
        ipcRenderer.send('server_stop', item.server_name);
      } else {
        ipcRenderer.send('server_start', item.server_name);
      }
      this.items[index].server_control = !this.items[index].server_control;
    },
    server_control(item) {},
    server_create(item) {
      console.log(item);
      ipcRenderer.send('server_create', item);
      ipcRenderer.send('server_info');
    },
    server_remove(item) {
      // console.log(this.item_remove);
      ipcRenderer.send('server_remove', this.item_remove);
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
      evt.preventDefault();
      // console.log(evt);
      // console.log(evt.componentId);
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
      this.show = !this.show;
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.server_name = ''
      this.form.server_port = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      // this.$nextTick(() => {
      //   this.show = true
      // })
    }
  }
}
</script>

<style lang="css">
</style>
