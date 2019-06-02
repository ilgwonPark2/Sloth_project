<template>
  <div style="height:88vh;">
    <!-- <b-img src="./static/image/logo_medium.png" alt="sloth" style=" margin-bottom:20px; position:fixed; top:30%; left:25%;"></b-img> -->
    <b-container style="margin-top:50px;">
      <b-row align-h="end">
        <b-button  pill variant="warning" >New Node Server</b-button>
        <b-button style="margin-left:15px;" pill variant="success">Start All</b-button>
        <b-button style="margin-left:15px;" pill variant="success">Stop All</b-button>
      </b-row>
    </b-container>
    <b-container style="margin-top:50px;">
      <b-row>
        <b-table hover big :items="items" :fields="fields">
          <template slot="server_control" slot-scope="row" >
            <b-button size="sm" class="mr-2">
              <i class="fa" :class="[row.item.server_control? 'fa-toggle-on': 'fa-toggle-off']" @click="toggle_server(row.item)"  aria-hidden="true"></i>
            </b-button>
          </template>
        </b-table>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
     return {
       // Note 'age' is left out and will not appear in the rendered table
       fields: {
         server_control:{
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
       items: [
         {
           server_control: true,
           server: 'Node_server1',
           port: '8080',
           performance : { memory: '20.33MB', cpu: '2%', size:'200MB' }
         },
         {
           server_control: false,
           server: 'Node_server2',
           port: '8080',
           performance : { memory: '114.2MB', cpu: '9%', size:'970MB' }
         },
         {
           server_control: true,
           server: 'MySQL',
           port: '8080',
           performance : { memory: '10.31MB', cpu: '5%', size:'29MB' }
         },
         {
           server_control: false,
           server: 'NPM_GUI',
           port: '8080',
           performance : { memory: '122.33MB', cpu: '1.5%', size:'889MB' }
         }
       ]
     }
   },
   methods: {
     toggle_server(item){
       var index2 = this.control_server(item);
       this.items[index2].server_control = !this.items[index2].server_control;
     },
     find_elem(item){
     },
     control_server(item_find){
       var result;
       this.items.forEach(function(item, index, arr){
         if(JSON.stringify(item_find) === JSON.stringify(item)) result = index;
       })
     return result;
     }
   }
}
</script>

<style lang="css">
</style>
