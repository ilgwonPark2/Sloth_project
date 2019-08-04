<template>
    <b-row align-h="end" style="margin-top:15px;" >
      <button class="fa fa-sort-alpha-desc"  aria-hidden="true" @click="strDesc()"></button>
      <button class="fa fa-sort-numeric-desc" style="margin-right:50px;" aria-hidden="true" @click="intDesc()"></button>
  <div style="height:88vh;">
  <paginate name="items" :list="items" :per="4" class="text-center" style="margin-top:30px">
    <div>
      <b-card-group columns class="card-sloth">
        <b-card no-body v-for="item in paginated('items')"  style="margin-top: 20px; width: 650px; height: 280px;" v-bind:key="item">
          <b-row >
            <b-col sm="3" style="margin-top:15px; margin-left:15px;">
              <img class="card-img-top" center v-bind:src="item.img" v-bind:alt="item.user"  >   
            </b-col>
            <b-col sm ="6">
              <div class="card-body">
                <h5 class="card-title">{{item.repo}}</h5>
                <p class="card-text">{{item.content}}</p>
              </div>
             </b-col>
            <b-col sm="1" style="margin-top:20px;">
              <iframe v-bind:src="item.forks_count" frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
              <iframe v-bind:src="item.stargazers_count"  frameborder="0" scrolling="0" width="150px" height="30px"></iframe>
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
</b-row>
</template>

<script>
// import GitHub from 'github-api';
export default {
  data() {
    return {
      paginate: ['items'],
      items:[],
      sort: [
        {'class':'sort-star-down','title':'sort by stars', selected:true},
        {'class':'sort-alpha-down','title':'sort by alphabet', selected:false}
       
      ]
    }

  },
  mounted: function(){
      this.boiler_list_read();
      console.log('boiler_ino')

  },
  methods:{
    scrollToTop: function() {
      window.scrollTo(0, 0);
    },
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
        q: 'nodejs&boilerplates+stars:>=10+forks:>=12+language:javascript&sort=stars&order=desc',
        }).then(({ data }) => {
          console.log(data)
          for(var i=0; i<data.items.length; i++) {
            var temp={}
            var count='https://ghbtns.com/github-btn.html?user='+data.items[i].owner.login+'&repo='+data.items[i].name+'&type='
            temp["user"]=data.items[i].owner.login,
            temp["repo"]=data.items[i].name,
            temp["star_value"]=data.items[i].stargazers_count,
            temp["watchers_count"]=count+'watch&count=true&v=2',
            temp["stargazers_count"]=count+'star&count=true',
            temp["forks_count"]=count+'fork&count=true',
            temp["img"]=data.items[i].owner.avatar_url,
            temp["link"]=data.items[i].html_url,
            temp["content"]=data.items[i].description
            tempArr.push(temp);
          }
          this.items=tempArr;
      })
      console.log("boiler_list_read: ",tempArr)
      // return tempArr
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

