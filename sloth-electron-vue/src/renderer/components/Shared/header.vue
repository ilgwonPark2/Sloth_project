<template>
<div class="">
    <b-row style="height:50px; background:#70AE47; padding:5px 0px 0px 50px;">
      <b-col cols = "3">
        <a style="color:white; font-weight:500; font-size:2rem;">Sloth &trade; </a>
        <b-img src="./static/image/sloth_small.png" alt="sloth" style=" height:100%; margin-bottom:20px;"></b-img>
      </b-col>
      <b-col cols = "9">
        <b-link to="/"      class="btn btn-light" style="color: #70AE47; font-weight:700; margin-right:30px;">Home</b-link>
        <b-link to="/server"      class="btn btn-light" style="color: #70AE47; font-weight:700; margin-right:30px;">Server</b-link>
        <b-link to="/mysql" class="btn btn-light" style="color: #70AE47; font-weight:700; margin-right:30px;">MySQL</b-link>
        <b-link to="/npm"      class="btn btn-light" style="color: #70AE47; font-weight:700; margin-right:30px;">npm</b-link>
        <b-link to="/design"      class="btn btn-light" style="color: #70AE47; font-weight:700; margin-right:30px;">Design</b-link>
        <b-link to="/boiler"      class="btn btn-light" style="color: #70AE47; font-weight:700; margin-right:30px;">Boilerplate</b-link>
      </b-col>

    </b-row>
</div>
</template>

<script>
export default {
  name: 'header',
}
</script>

<style lang="css">
</style>
