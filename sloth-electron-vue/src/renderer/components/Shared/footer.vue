<template>
<div class="footer" >
    <!-- <b-row style="background:#00FFFF; height:15px">
        <b-col class="col-1"></b-col>
        <b-alert show variant="light" class="col-4">© 2019 Capstone Design</b-alert>
        <b-alert show variant="light" class="col-4"><a href="#" class="alert-link">Donate us!</a></b-alert>
        <b-alert show variant="light" class="col-3">Created by jihae, ilkwon</b-alert>
    </b-row> -->


        <b-row class="text-center" style="background:#D8D8D8; height:55px">
            <b-col style="font: monosapce; color:#2E2E2E; font-size:1.1em">© 2019 Capstone Design</b-col>
            <b-col cols="6">
                <a href="#" class="alert-link" style="font-family: monosapce; color:#70AE47; font-size:1.8em" @click="test()">
                Donate us!</a>
            </b-col>
            <b-col style="font: monosapce; color:#2E2E2E; font-size:1.1em"> Created by jihae, ilkwon</b-col>
        </b-row>


</div>



</template>

<script>
import axios from 'axios'
export default {
  name: 'footer',
  // components: { SystemInformation },
  methods: {
    // open (link) {
    //   this.$electron.shell.openExternal(link)
    // }
    test(){
      axios
         .get('https://api.coindesk.com/v1/bpi/currentprice.json')
         .then(response => (console.log(response)))
    }
  }
}
</script>

<style lang="css">
</style>
