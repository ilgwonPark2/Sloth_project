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
    <b-list-group style="width:80%; margin-top:50px; margin-left:auto; margin-right:auto;">
      <b-list-group-item variant="light" v-for="(item, index) in items" v-bind:key="index" v-bind:href="item.link" style="margin-top=10vh;" >
          <div class="img">
            <b-img left v-bind:src="item.img" v-bind:alt="item.name" rounded="Rounded image" style="width:9%; height:15%"></b-img>
          </div>
          <div class="content">
            <h4 style="width=15px; margin-left:10%;">{{item.name}}</h4>
          </div>
          <p class="mb-1" style="margin-left:10%;">{{item.content}}</p>
          <hr>
          <b-list-group horizontal>
            <b-badge style="margin-left:10%;" variant="success" pill>Watch: {{item.watch}}</b-badge>
            <b-badge style="margin-left:5px;" variant="primary" pill>Star: {{item.star}} </b-badge>
            <b-badge style="margin-left:5px;" variant="success" pill>Fork: {{item.fork}}</b-badge>
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
          name: 'hielo',
          watch: '836',
          star: '1234',
          fork: '5029',
          img: "https://avatars1.githubusercontent.com/u/544954?v=4",
          content: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.', 
          link: 'https://templated.co/hielo'
          },
        {
          name: 'industrious',          
          watch: '836',
          star: '1234',
          fork: '5029',
          content: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.', 
          link: 'https://templated.co/industrious',
          img: "https://avatars1.githubusercontent.com/u/544954?v=4"
          },
        {
          name: 'snapshot',
          watch: '836',
          star: '1234',
          fork: '5029',
          content: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.',          
          link: 'https://templated.co/snapshot',
          img: "https://avatars1.githubusercontent.com/u/544954?v=4"
          },
        {
          name: 'roadtrip',          
          watch: '836',
          star: '1234',
          fork: '5029',
          content: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.',  
          link: 'https://templated.co/roadtrip',
          img: "https://avatars1.githubusercontent.com/u/544954?v=4"
        },
        {
          name: 'urban',
          watch: '836',
          star: '1234',
          fork: '5029', 
          content: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.',
          img: "https://avatars1.githubusercontent.com/u/544954?v=4", 
          link: 'https://templated.co/urban'
        },
        {
          name: 'broadcast',
          watch: '836',
          star: '1234',
          fork: '5029',
          content: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.',  
          img: "https://avatars1.githubusercontent.com/u/544954?v=4",
          link: 'https://templated.co/broadcast'
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
    Golink: function(){


    }
  }
}
</script>
<style lang="css">
</style>