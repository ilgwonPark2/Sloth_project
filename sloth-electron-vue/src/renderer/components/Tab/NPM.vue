<template>
  <div class="" style="height:88vh;">
    <iframe src="http://localhost:1337" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
const {ipcRenderer} = require('electron')

export default {
  name: 'menu-npm',
  data() {
    return {
    }
  },
  mounted: function(){
    ipcRenderer.on('npm-gui-reply', (event, arg) => { alert(JSON.stringify(arg)) })
  }
}
</script>

<style lang="css">
</style>
