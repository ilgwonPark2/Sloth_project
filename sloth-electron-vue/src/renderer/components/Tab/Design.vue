<template>
  <div class="" style="height:88vh;">
    <paginate  name="items" :list="items" :per="4" class="text-center">
      <li class="col-sm-6" v-for="item in paginated('items')" style="list-style: none; padding:30px">
        <b-img-lazy :src="'https://templated.co/items/thumbnails/'+item + '.jpg'" alt="item" style="width:43%;"></b-img-lazy>
      </li>
    </paginate>

    <div @click="scrollToTop()" class="text-center" >
      <paginate-links for="items" :limit="3"
      class="pagination justify-content-center"
      :show-step-links="true"
      :step-links="{next: 'Next »', prev: '« Prev'}"
      ></paginate-links>
    </div>
  </div>


</template>

<script>
export default {
  data() {
    return {
      paginate: ['items'],
      items: [
        "hielo", "industrious", "snapshot", "roadtrip",
        "urban", "broadcast", "projection", "intensify",
        "theory", "fullmotion", "binary", "introspect",
        "radius", "epilogue", "prism", "typify",
        "retrospect", "spatial", "grassygrass", "assembly",
        "undeviating", "barbedflower", "lorikeet", "widerange"
      ],
      links: [
        "https://templated.co/hielo",
        "https://templated.co/industrious",
        "https://templated.co/snapshot",
        "https://templated.co/roadtrip",
        "https://templated.co/urban",
        "https://templated.co/broadcast",
        "https://templated.co/projection",
        "https://templated.co/intensify",
      ]
    }
  },
  computed: {
    rows() {
      return this.items.length
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
    }
  }
}
</script>
