<template>
  <div style="height:86vh;" v-if="status_apply">
    <div style=" margin-top:20px; margin-left: 1100px">
      <a style="font-weight:700; color:#424242; font-size:0.8em;">project name </a>
      <button class="fa fa-sort-alpha-desc"  aria-hidden="true" @click="strDesc()"></button>
      <a style="font-weight:700; color:#424242; font-size:0.8em;">num of stars </a>
      <button class="fa fa-sort-numeric-desc" style="margin-right:50px;" aria-hidden="true" @click="intDesc()"></button>
    </div>
  <paginate name="items" :list="items" :per="4" class="text-center" style="margin-top:30px">
    <div>
      <b-card-group columns class="card-sloth">
        <b-card no-body v-for="item in paginated('items')"  style="margin-top: 20px; width: 650px; height: 280px;" v-bind:key="item">
          <b-row >
            <b-col cols="2" style="margin-top:30px; margin-left:30px;">
              <img class="card-img-top" center v-bind:src="item.img" v-bind:alt="item.user"  >   
            </b-col>
            <b-col cols ="7">
              <div class="card-body">
                <h5 class="card-title">{{item.repo}}</h5>
                <p class="card-text">{{item.content}}</p>
              </div>
             </b-col>
            <b-col cols="1" style="margin-top:20px;">
              <iframe v-bind:src="item.stargazers_count"  frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
              <iframe v-bind:src="item.forks_count" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
              <iframe v-bind:src="item.watchers_count" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
            </b-col>
          </b-row>
          <div class="text-center">
            <b-button class="btn btn-success" @click="Golink(item.name, item.link)">More Detail +</b-button>
          </div>
        </b-card>
      </b-card-group>
    </div>
  </paginate>
    <div @click="scrollToTop()" class="text-center">
      <paginate-links for="items" :limit="3" class="pagination pagination-md justify-content-center pagaination-sloth" :show-step-links="true" :step-links="{next: ' »', prev: '« '}" style="margin-bottom:50px;"></paginate-links>
    </div>
  </div>
  <div style="height:72vh;" v-else >
    <h5 v-if="!status_apply" class="text-center"
    style="margin-top: 150px; margin-left:40px; font-weight:700; color:#424242; font-size:1.6em;" > Loading GitHub information ... </h5>
    <div class="d-flex justify-content-center" style="width:100%">
      <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem; margin-top: 10px" variant="success" key="success" type="grow"></div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      paginate: ['items'],
      items:[],
      sort: [
        {'class':'sort-star-down','title':'sort by stars', selected:true},
        {'class':'sort-alpha-down','title':'sort by alphabet', selected:false}
       
      ],
      status_apply: false    
      }
  },
  mounted: function(){
      this.github_info();
      // console.log('boiler_ino')
  },
  methods:{
    scrollToTop: function() {
      window.scrollTo(0, 0);
    },
    github_info: function(){
      var tempArr=[]
      const request = require("request");
      const self = this
      const options = {
        // url:'https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc',
        url: 'https://api.github.com/search/repositories?q=nodejs&boilerplates+stars:>=1000+language:javascript&sort=stars&order=desc',
        headers: {
        "Autorization": "token b12d59da18ca9f268312e489599d178f8412e4b0",
        'Accept': 'application/vnd.github.mercy-preview+json',
        "User-Agent": "abc"
        }
      }
      request.get(options, function (error, response, body) {
        // var result = new Object(body) 
        var obj = JSON.parse(body)
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.

        for(var i=0; i<obj.items.length; i++) {
            var temp={}
            var count='https://ghbtns.com/github-btn.html?user='+obj.items[i].owner.login+'&repo='+obj.items[i].name+'&type='
            temp["user"]=obj.items[i].owner.login,
            temp["repo"]=obj.items[i].name,
            temp["star_value"]=obj.items[i].stargazers_count,
            temp["watchers_count"]=count+'watch&count=true&v=2',
            temp["stargazers_count"]=count+'star&count=true',
            temp["forks_count"]=count+'fork&count=true',
            temp["img"]=obj.items[i].owner.avatar_url,
            temp["link"]=obj.items[i].html_url,
            temp["content"]=obj.items[i].description
            tempArr.push(temp);
          }
        self.items=tempArr;
        console.log(tempArr)
        self.status_apply=true    
      });
    },
    Golink: function(name,link){
      window.open(link, name, "width=1000, height=800, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes" )
    },
    strDesc: function() {
      console.log("str")
      this.items.sort(function(a, b){
        return a.repo > b.repo ? 1 : -1;
      })
    },
    intDesc: function(){
      console.log("int")
      this.items.sort(function(a, b){
        return a.star_value < b.star_value ? 1 : -1;
      })
    }
  }
}

</script>
<style lang="css">
</style>

