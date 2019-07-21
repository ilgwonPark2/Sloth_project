<template>
<div class="" style="height:88vh;">
  <paginate name="items" :list="items" :per="4" class="text-center" style="margin-top:30px">
    <div>
       <b-card-group columns class="card-sloth">
        <b-card no-body
        class="overflow-hidden col-md-6"
        v-for="item in paginated('items')"
        img-alt="Image"
        style="max-width: 620px;">
          <b-row no-gutters>
            <b-col sm="7">
              <b-card-img :src="'https://templated.co/items/thumbnails/'+item + '.jpg'" class="rounded-0"></b-card-img>
            </b-col>
            <b-col sm="5">
              <b-card-body :title="item.toUpperCase()">
                <b-card-text class="card-text-sloth" >
                  <!-- <b-row align-h="around">
                    <b-button class="col-sm-5"variant="primary" @click="openDemo(item)">Live Demo</b-button>
                    <b-button class="col-sm-5"variant="success" @click="openDemo(item)">Apply</b-button>
                  </b-row> -->
                  <b-row align-h="around">
                    <b-button class="col-sm-9" variant="primary" @click="openDemo(item)"> Demo</b-button>
                  </b-row>
                  <b-row align-h="around" style="margin-top:20%;">
                    <b-button class="col-sm-9" variant="success" @click="openDemo(item)">  Apply  </b-button>
                  </b-row>
                </b-card-text>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
    </b-card-group>
    </div>
  </paginate>

  <div @click="scrollToTop()" class="text-center">
    <paginate-links for="items" :limit="2" class="pagination pagination-md justify-content-center pagaination-sloth" :show-step-links="true" :step-links="{next: ' »', prev: '« '}" style="margin-bottom:50px;"></paginate-links>
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
    mounted() {
      setTimeout(() => {
        this.shown = true
      }, 1000)
    }
  },
  methods: {
    scrollToTop: function() {
      window.scrollTo(0, 0);
    },
    openDemo: function(item){
      window.open('https://templated.co/'+item)
    }
  }
}
</script>
