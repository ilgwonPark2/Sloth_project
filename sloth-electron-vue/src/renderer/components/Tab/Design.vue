<template>
<div class="" style="height:88vh;">
  <paginate name="items" :list="items" :per="4" class="text-center" style="margin-top:30px">
    <div>
       <b-card-group columns class="card-sloth">
        <b-card no-body
        class="overflow-hidden col-md-6"
        v-for="item in paginated('items')"
        img-alt="Image"
        style="max-width: 620px;">
          <b-row no-gutters>
            <b-col sm="7">
              <b-card-img :src="'https://templated.co/items/thumbnails/'+item + '.jpg'" class="rounded-0"></b-card-img>
            </b-col>
            <b-col sm="5">
              <b-card-body :title="item.toUpperCase()">
                <b-card-text class="card-text-sloth" >
                  <b-row align-h="around">
                    <b-button class="col-sm-9" variant="primary" @click="openDemo(item)"> Demo</b-button>
                  </b-row>
                  <b-row align-h="around" style="margin-top:20%;">
                    <b-button class="col-sm-9" variant="success" @click="applyDemo(item)"  ref="btnShow">  Apply  </b-button>
                  </b-row>
                </b-card-text>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
    </b-card-group>

    <b-modal centered id="design-server-modal" title="Apply Design">
      <div class="">
        <b-container >
          <b-row>
            <b-table hover big :items="servers" :fields="fields">
              <template slot="server_apply" slot-scope="row">
                <b-button size="md" class="fa fa-check-circle" @click="apply_design(row.item.server_name)"  aria-hidden="true">
                </b-button>
              </template>
              <template slot="server_clear" slot-scope="row">
                <b-button size="md" class="fa fa-trash"  @click="clear_design(row.item)" v-b-modal.design-server-modal pill aria-hidden="true"></b-button>
              </template>
            </b-table>
          </b-row>
        </b-container>
      </div>
    </b-modal>
    </div>
  </paginate>

  <div @click="scrollToTop()" class="text-center">
    <paginate-links for="items" :limit="3" class="pagination pagination-md justify-content-center pagaination-sloth" :show-step-links="true" :step-links="{next: ' »', prev: '« '}" style="margin-bottom:50px;"></paginate-links>
  </div>
</div>
</template>

<script>
const {ipcRenderer} = require('electron')
const axios = require('axios');
export default {
  data() {
    return {
      paginate: ['items'],
      items: [
        "hielo", "industrious", "snapshot", "roadtrip",
        "urban", "broadcast", "projection", "intensify",
        "theory", "fullmotion", "binary", "introspect",
        "radius", "epilogue", "prism", "typify",
        "retrospect", "spatial", "grassygrass", "assembly",
        "undeviating", "barbedflower", "lorikeet", "widerange"
      ],
      servers: [],
      fields: {
        server_name: { label: 'Server' },
        server_port: { label: 'Port' },
        server_apply: {label: 'Apply'},
        server_clear: {label: 'Clear'}
      },
      template: ''
    }
  },
  mounted() {
    setTimeout(() => {
      this.shown = true
      ipcRenderer.send('server_info');
    }, 1000)

    ipcRenderer.on('Error', (event, arg) => { alert(JSON.stringify(arg)) });
    ipcRenderer.on('server_info_reply', (event, arg) => {
      this.server_info(arg)
    });
    ipcRenderer.on('apply_design_reply', (event, arg) => {
      alert('success to apply')
    });
    ipcRenderer.on('clear_design_reply', (event, arg) => {
      alert('success to clear')
    });

  },
  methods: {
    scrollToTop: function() {
      window.scrollTo(0, 0);
    },
    openDemo: function(item){
      window.open('https://templated.co/'+item)
    },
    applyDemo: function(item){
      this.$root.$emit('bv::show::modal', 'design-server-modal', '#btnShow')
      this.template = item
    },
    server_info(file){
      this.servers = {}
      var jsonFile = file;
      var jsonArr = []
      for (var i = 0; i < jsonFile.servers.length; i++) {
        var item = {}, perform = {}
        item["server_control"] = false
        item["server_name"] = jsonFile.servers[i].server_name
        item["server_port"] = jsonFile.servers[i].server_port
        jsonArr.push(item);
        console.log(item)
      }
      this.servers = jsonArr
    },
    apply_design(item){
      ipcRenderer.send('apply_design', [this.template, item]);
    },
    clear_design(item){
      // ipcRenderer.send('clear_design', [this.template, item]);
      ipcRenderer.send('server_remove', item.server_name)
      setTimeout(() => ipcRenderer.send('server_create', item), 3000)
      setTimeout(() => ipcRenderer.send('server_start', item.server_name),3000)

    }
  }
}
</script>
