<template>
  <div style="height:88vh;">
  <!-- <paginate name="items" :list="items" :per="5" class="text-center" style="margin-top:30px"> -->
    <div>
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
    <b-list-group style="width:70%; margin-top:40px; margin-left:auto; margin-right:auto;">
      <b-list-group-item variant="light" v-for="(item, index) in items" v-bind:key="index" style="display:inline-block; padding:10px; height:200px;" >          
          <table style="width:100%">
            <tr> 
              <td width="20%">
                <b-img left v-bind:src="item.img" v-bind:alt="item.user" rounded="Rounded image" style="margin-top=10%; width:100px; height:120px"></b-img>
              </td>
              <td width="60%">
                <h4 style="width=15px; margin-left:10%;">{{item.repo}}</h4>
                <p style="margin-left:10%;"> {{item.content}}</p>
              </td>
              <td width="20%"> 
                <b-list-group style="margin-left:10%" vertical >
                <!-- <a  frameborder="0" scrolling="0" width="150px" height="30px">star : {{item.stargazers_count}} </a>
                <a  frameborder="0" scrolling="0" width="150px" height="30px">forks: {{item.forks_count}}</a> -->
                <!-- <a  frameborder="0" scrolling="0" width="150px" height="30px">wathcer: {{item.watchers_count}}</a> -->
                <iframe :src="item.stargazers_count"  frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
                <iframe :src="item.forks_count" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
                <iframe :src="item.watchers_count" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
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
  <!-- </paginate> -->

  <!-- <div @click="scrollToTop()" class="text-center">
    <paginate-links for="items" :limit="3" class="pagination pagination-md justify-content-center pagaination-sloth" :show-step-links="true" :step-links="{next: ' »', prev: '« '}" style="margin-bottom:50px;"></paginate-links>
  </div> -->

  </div>
</template>

<script>
// import GitHub from 'github-api';
const {ipcRenderer, shell} = require('electron')

export default {
  data() {
    return {
      items:[],
      // items: [
      //   {
      //     user: 'asdf',
      //     name: 'hackathon-starter',
      //     content: 'A boilerplate for Node.js web applications', 
      //     watchers_count: 'https://ghbtns.com/github-btn.html?user=sahat&repo=hackathon-starter&type=watch&count=true&v=2',
      //     stargazers_count: 'https://ghbtns.com/github-btn.html?user=sahat&repo=hackathon-starter&type=star&count=true',
      //     forks_count: 'https://ghbtns.com/github-btn.html?user=sahat&repo=hackathon-starter&type=fork&count=true',
      //     img: 'https://avatars0.githubusercontent.com/u/544954?s=400&v=4',
      //     html_url: 'https://github.com/sahat/hackathon-starter'
      //     }
        // {
        //   user: 'alexa ',          
        //   name: 'alexa-skills-kit-sdk-for-nodejs',
        //   content: 'The Alexa Skills Kit SDK for Node.js helps you get a skill up and running quickly, letting you focus on skill logic instead of boilerplate code.', 
        //   watchers_count: 'https://ghbtns.com/github-btn.html?user=alexa&repo=alexa-skills-kit-sdk-for-nodejs&type=watch&count=true&v=2',
        //   stars_count: 'https://ghbtns.com/github-btn.html?user=alexa&repo=alexa-skills-kit-sdk-for-nodejs&type=star&count=true',
        //   forks_count: 'https://ghbtns.com/github-btn.html?user=alexa&repo=alexa-skills-kit-sdk-for-nodejs&type=fork&count=true',
        //   img: "https://avatars3.githubusercontent.com/u/27459759?s=400&v=4",
        //   link: 'https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs'
        //   },
        // {
        //   user: 'icebob ',          
        //   name: 'vue-express-mongo-boilerplate',
        //   watchers_count: 'https://ghbtns.com/github-btn.html?user=icebob&repo=vue-express-mongo-boilerplate&type=watch&count=true&v=2',
        //   stars_count: 'https://ghbtns.com/github-btn.html?user=icebob&repo=vue-express-mongo-boilerplate&type=star&count=true',
        //   forks_count: 'https://ghbtns.com/github-btn.html?user=icebob&repo=vue-express-mongo-boilerplate&type=fork&count=true',
        //   content: ':star: MEVN Full stack JS web app boilerplate with NodeJS, Express, Mongo and VueJS',  
        //   link: 'https://github.com/icebob/vue-express-mongo-boilerplate',
        //   img: "https://avatars0.githubusercontent.com/u/306521?s=400&v=4"
        // },
        // {
        //   user: 'FredericHeem ',
        //   name: 'starhackit',
        //   watchers_count: 'https://ghbtns.com/github-btn.html?user=FredericHeem&repo=starhackit&type=watch&count=true&v=2',
        //   stars_count: 'https://ghbtns.com/github-btn.html?user=FredericHeem&repo=starhackit&type=star&count=true',
        //   forks_count: 'https://ghbtns.com/github-btn.html?user=FredericHeem&repo=starhackit&type=fork&count=true', 
        //   content: 'StarHackIt: Preact/React Native/Node fullstack starter kit with authentication and authorisation, data backed by SQL.',
        //   img: 'https://avatars2.githubusercontent.com/u/4118089?s=400&v=4', 
        //   link: 'https://github.com/FredericHeem/starhackit'
        // }
      // ],
      sort: [
        {'class':'sort-star-down','title':'sort by stars', selected:true},
        {'class':'sort-alpha-down','title':'sort by alphabet', selected:false}
       
      ]
    }

  },
  mounted: function(){
      // boiler_list();
      // ipcRenderer.on('boiler_list_info_reply', (event, arg) => { this.boiler_list_read(arg) });
      // ipcRenderer.send('boiler_list_read')
      this.items=this.boiler_list_read();
      console.log('boiler_ino')

  },
  methods:{
    scrollToTop: function() {
      window.scrollTo(0, 0);
    },
    // boiler_list_read(file){
    //   this.items=file
    //   console.log('ITEMS: '+this.items)
    // },
    boiler_list_read(file){
      var tempArr=[]
      var Octokit = require('@octokit/rest')
      var octokit = new Octokit({
        auth: {
            username: 'jihaeK',
            password: 'rlawlgo12',
        }
        
      })
      octokit.search.repos({
        q: 'nodejs&boilerplates+stars:>=10+forks:>=10+language:javascript&sort=stars&order=desc',
        }).then(({ data }) => {
          console.log(data)
          for(var i=0; i<data.items.length; i++) {
            var temp={}
            var count='https://ghbtns.com/github-btn.html?user='+data.items[i].owner.login+'&repo='+data.items[i].name+'&type='
            temp["user"]=data.items[i].owner.login,
            temp["repo"]=data.items[i].name,
            temp["watchers_count"]=count+'watch&count=true&v=2',
            temp["stargazers_count"]=count+'star&count=true',
            temp["forks_count"]=count+'fork&count=true',
            temp["img"]=data.items[i].owner.avatar_url,
            temp["link"]=data.items[i].html_url,
            temp["content"]=data.items[i].description
            tempArr.push(temp);
          }
      })
      console.log("boiler_list_read: ",tempArr)
      return tempArr
    },
    // boiler_list: function() {
    //   var tempArr=[]
    //   var Octokit = require('@octokit/rest')
    //   var octokit = new Octokit({
    //     auth: {
    //        username: 'jihaeK',
    //        password: 'rlawlgo12',
    //     }
        
    //   })
    //   octokit.search.repos({
    //     q: 'nodejs&boilerplates+stars:>=10+forks:>=10+language:javascript&sort=stars&order=desc',
    //     }).then(({ data }) => {
    //       console.log(data)
    //       for(var i=0; i<data.items.length; i++) {
    //         var temp={}
    //         var count='https://ghbtns.com/github-btn.html?user='+data.items[i].owner.login+'&repo='+data.items[i].name+'&type='
    //         temp["user"]=data.items[i].owner.login,
    //         temp["repo"]=data.items[i].name,
    //         // temp["watchers_count"]=data.items[i].watchers_count,
    //         temp["watchers_count"]=count+'watch&count=true&v=2',
    //         temp["stargazers_count"]=count+'star&count=true',
    //         temp["forks_count"]=count+'fork&count=true',
    //         temp["img"]=data.items[i].owner.avatar_url,
    //         temp["link"]=data.items[i].html_url,
    //         temp["content"]=data.items[i].description
    //         tempArr.push(temp);
    //       }
    //   })
    //   console.log(tempArr)
    //   return tempArr
    // },
    Golink: function(name,link){
      // window.open(link, name, "width=1000, height=800, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes" )
      // this.items=this.boiler_list()
    }
  }
}

  // var GitHub = require('github-api');

      // // basic auth
      // var gh = new GitHub({
      //   username: 'jihaeK',
      //   password: 'rlawlgo12'
      //   /* also acceptable:
      //       token: 'MY_OAUTH_TOKEN'
      //     */
      // });

      // var me = gh.getUser(); // no user specified defaults to the user for whom credentials were provided
      // me.listNotifications(function(err, notifications) {
      //   // do some stuff
      // });

      // // var clayreimann = gh.getUser('nodejs');
      // const clayreimann = gh.getUser('clayreimann');
      // clayreimann.listStarredRepos()
      //   .then(function({data: reposJson}) {
      //     console.log(`clayreimann has ${reposJson.length} repos!`);
      // });
      
</script>
<style lang="css">
</style>

