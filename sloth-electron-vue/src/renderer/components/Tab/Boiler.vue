<template>
  <div style="height:88vh;">

    <!-- <b-list-group style="width:75%; margin-top:50px; margin-left:auto; margin-right:auto;">
      <b-list-group-item variant="light" v-for="(item, index) in items" v-bind:key="index" style="margin-top=10vh;" >          
          <div class="img">
            <b-img left v-bind:src="item.img" v-bind:alt="item.name" rounded="Rounded image" style="margin-top=10%; width:9%; height:13%"></b-img>
          </div>
          <div class="content" @click="Golink(item.name, item.link)">
            <h4 style="width=15px; margin-left:10%;">{{item.name}}</h4>
            <p class="mb-1" style="margin-left:10%;">{{item.content}}</p>
          </div>

          <hr>
          <b-list-group style="margin-left:10%" vertical >
            <iframe v-bind:src="item.fork" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
            <iframe v-bind:src="item.star"  frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
            <iframe v-bind:src="item.watch" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>

          </b-list-group>
      </b-list-group-item>
    </b-list-group> -->

    <!-- <div class="buttons">
      <table style="margin-left:85%; margin-top:10px;">
      <tr>
        <td><b-button variant="info" @click="Golink(item.name, item.link)">Star</b-button></td>
        <td><b-button variant="info" @click="Golink(item.name, item.link)">Fork</b-button></td>
      </tr>
      </table>
    </div> -->
    <b-list-group style="width:80%; margin-top:40px; margin-left:auto; margin-right:auto;">
      <b-list-group-item variant="light" v-for="(item, index) in items" v-bind:key="index" style="display:inline-block; padding:10px; height:220px;" >          
          <table style="width:100%">
            <tr> 
              <td width="20%">
                <b-img left v-bind:src="item.img" v-bind:alt="item.name" rounded="Rounded image" style="margin-top=10%; width:100px; height:120px"></b-img>
              </td>
              <td width="60%">
                <h4 style="width=15px; margin-left:10%;">{{item.name}}</h4>
                <p style="margin-left:10%;"> {{item.content}}</p>
              </td>
              <td width="20%"> 
                <b-list-group style="margin-left:10%" vertical >
                <iframe v-bind:src="item.star"  frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
                <iframe v-bind:src="item.fork" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
                <iframe v-bind:src="item.watch" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
                </b-list-group>
              </td>
            </tr>
            <tr>
              <th colspan=3>
              <hr>
              <b-button style= "width:70%; margin-left:15%; margin-top:0%;" variant="success" @click="Golink(item.name, item.link)">More Detail +</b-button></th>
            </tr>
          </table>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          name: 'sahat',
          repo: 'hackathon-starter',
          content: 'A boilerplate for Node.js web applications', 
          watch: 'https://ghbtns.com/github-btn.html?user=sahat&repo=hackathon-starter&type=watch&count=true&v=2',
          star: 'https://ghbtns.com/github-btn.html?user=sahat&repo=hackathon-starter&type=star&count=true',
          fork: 'https://ghbtns.com/github-btn.html?user=sahat&repo=hackathon-starter&type=fork&count=true',
          img: 'https://avatars0.githubusercontent.com/u/544954?s=400&v=4',
          link: 'https://github.com/sahat/hackathon-starter'
          },
        {
          name: 'alexa ',          
          repo: 'alexa-skills-kit-sdk-for-nodejs',
          content: 'The Alexa Skills Kit SDK for Node.js helps you get a skill up and running quickly, letting you focus on skill logic instead of boilerplate code.', 
          watch: 'https://ghbtns.com/github-btn.html?user=alexa&repo=alexa-skills-kit-sdk-for-nodejs&type=watch&count=true&v=2',
          star: 'https://ghbtns.com/github-btn.html?user=alexa&repo=alexa-skills-kit-sdk-for-nodejs&type=star&count=true',
          fork: 'https://ghbtns.com/github-btn.html?user=alexa&repo=alexa-skills-kit-sdk-for-nodejs&type=fork&count=true',
          img: "https://avatars3.githubusercontent.com/u/27459759?s=400&v=4",
          link: 'https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs'
          },
        {
          name: 'icebob ',          
          repo: 'vue-express-mongo-boilerplate',
          watch: 'https://ghbtns.com/github-btn.html?user=icebob&repo=vue-express-mongo-boilerplate&type=watch&count=true&v=2',
          star: 'https://ghbtns.com/github-btn.html?user=icebob&repo=vue-express-mongo-boilerplate&type=star&count=true',
          fork: 'https://ghbtns.com/github-btn.html?user=icebob&repo=vue-express-mongo-boilerplate&type=fork&count=true',
          content: ':star: MEVN Full stack JS web app boilerplate with NodeJS, Express, Mongo and VueJS',  
          link: 'https://github.com/icebob/vue-express-mongo-boilerplate',
          img: "https://avatars0.githubusercontent.com/u/306521?s=400&v=4"
        },
        {
          name: 'FredericHeem ',
          repo: 'starhackit',
          watch: 'https://ghbtns.com/github-btn.html?user=FredericHeem&repo=starhackit&type=watch&count=true&v=2',
          star: 'https://ghbtns.com/github-btn.html?user=FredericHeem&repo=starhackit&type=star&count=true',
          fork: 'https://ghbtns.com/github-btn.html?user=FredericHeem&repo=starhackit&type=fork&count=true', 
          content: 'StarHackIt: Preact/React Native/Node fullstack starter kit with authentication and authorisation, data backed by SQL.',
          img: 'https://avatars2.githubusercontent.com/u/4118089?s=400&v=4', 
          link: 'https://github.com/FredericHeem/starhackit'
        }
      ],
      sort: [
        {'class':'sort-star-down','title':'sort by stars', selected:true},
        {'class':'sort-alpha-down','title':'sort by alphabet', selected:false}
       
      ]
    }

  },
  mounted: {
    mounted () {
      setTimeout(() => {
        this.shown = true
    }, 1000)
    }
  },
  methods:{
    scrollToTop: function() {
      window.scrollTo(0, 0);
    },
    Golink: function(name,link){
      window.open(link, name, "width=1000, height=800, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes" )
    }
  }
}
</script>
<style lang="css">
</style>