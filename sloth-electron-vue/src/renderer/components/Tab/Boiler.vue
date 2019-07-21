<template>
  <div style="height:88vh;">
    <!-- <div class="buttons">
        <span>sort</span>
        <button v-for="b in sort" v-bind:title="b.title" 
        v-bind:class="sortType == b.class?'selected':''"
        v-on:click="toggleList('sort',b.class)">
        <i class="fas" v-bind:class="'fa-'+b.class"></i>
        </button>
    </div> -->
    <!--   -->
    <b-list-group style="width:75%; margin-top:50px; margin-left:auto; margin-right:auto;">
      <b-list-group-item variant="light" v-for="(item, index) in items" v-bind:key="index" style="margin-top=10vh;" >
          <div class="img">
            <b-img left v-bind:src="item.img" v-bind:alt="item.name" rounded="Rounded image" style="margin-top=10%; width:9%; height:13%"></b-img>
          </div>
          <div class="content" @click="Golink(item.name, item.link)">
            <h4 style="width=15px; margin-left:10%;">{{item.name}}</h4>
          </div>
          <p class="mb-1" style="margin-left:10%;">{{item.content}}</p>
          <hr>
          <b-list-group horizontal>
            <!-- Place this tag where you want the button to render. -->
            <!-- <a class="github-button" href="https://github.com/ntkme/github-buttons/fork" data-icon="octicon-repo-forked" data-show-count="true" aria-label="Fork ntkme/github-buttons on GitHub">Fork</a> -->
            <!-- <github-button href="https://github.com/ntkme">Follow @ntkme</github-button> -->
            <!-- <b-badge style="margin-left:10%;" variant="success" pill>Watch: {{item.watch}}</b-badge>
            <b-badge style="margin-left:5px;" variant="success" pill>Star: {{item.star}} </b-badge>
            <b-badge style="margin-left:5px;" variant="success" pill>Fork: {{item.fork}}</b-badge> -->
            <iframe style="margin-left:10%" v-bind:src="item.fork" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
            <iframe style="margin-left:10%" v-bind:src="item.star"  frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
            <iframe style="margin-left:10%" v-bind:src="item.watch" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>

          </b-list-group>
        <!-- <div class="content" style="margin-top=10%;">
          
        </div> -->
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
          content: 'A boilerplate for Node.js web applications', 
          watch: 'https://ghbtns.com/github-btn.html?user=sahat&repo=hackathon-starter&type=watch&count=true&v=2',
          star: 'https://ghbtns.com/github-btn.html?user=sahat&repo=hackathon-starter&type=star&count=true',
          fork: 'https://ghbtns.com/github-btn.html?user=sahat&repo=hackathon-starter&type=fork&count=true',
          img: 'https://avatars0.githubusercontent.com/u/544954?s=400&v=4',
          link: 'https://github.com/sahat/hackathon-starter'
          },
        {
          name: 'alexa',          
          content: 'The Alexa Skills Kit SDK for Node.js helps you get a skill up and running quickly, letting you focus on skill logic instead of boilerplate code.', 
          watch: 'https://ghbtns.com/github-btn.html?user=alexa&repo=alexa-skills-kit-sdk-for-nodejs&type=watch&count=true&v=2',
          star: 'https://ghbtns.com/github-btn.html?user=alexa&repo=alexa-skills-kit-sdk-for-nodejs&type=star&count=true',
          fork: 'https://ghbtns.com/github-btn.html?user=alexa&repo=alexa-skills-kit-sdk-for-nodejs&type=fork&count=true',
          img: "https://avatars3.githubusercontent.com/u/27459759?s=400&v=4",
          link: 'https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs'
          },
        {
          name: 'kriasoft',
          watch: 'https://ghbtns.com/github-btn.html?user=kriasoft&repo=nodejs-api-starter&type=watch&count=true&v=2',
          star: 'https://ghbtns.com/github-btn.html?user=kriasoft&repo=nodejs-api-starter&type=star&count=true',
          fork: 'https://ghbtns.com/github-btn.html?user=kriasoft&repo=nodejs-api-starter&type=fork&count=true',
          content: 'Boilerplate and tooling for authoring data API backends with Node.js and GraphQL',          
          link: 'https://github.com/kriasoft/nodejs-api-starter',
          img: "https://kriasoft.githubusercontent.com/u/544954?v=4"
          },
        {
          name: 'icebob',          
          watch: 'https://ghbtns.com/github-btn.html?user=icebob&repo=vue-express-mongo-boilerplate&type=watch&count=true&v=2',
          star: 'https://ghbtns.com/github-btn.html?user=icebob&repo=vue-express-mongo-boilerplate&type=star&count=true',
          fork: 'https://ghbtns.com/github-btn.html?user=icebob&repo=vue-express-mongo-boilerplate&type=fork&count=true',
          content: ':star: MEVN Full stack JS web app boilerplate with NodeJS, Express, Mongo and VueJS',  
          link: 'https://github.com/icebob/vue-express-mongo-boilerplate',
          img: "https://avatars0.githubusercontent.com/u/306521?s=400&v=4"
        },
        {
          name: 'FredericHeem',
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