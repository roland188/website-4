<script>
export default /*#__PURE__*/{
  name: 'Image2indexdbNy', // vue component name
  props : {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
    lazyLoad: {
      type: Boolean,
      default: false,
    },
    log: {
      type: Boolean,
      default: false,
    },
    loading:{
      type: String,
      default: '',
    },
    lazy:{
      type: Boolean,
      default: false,
    },
    run:{
      type: Boolean,
      default: true,
    },
    errImg:{
      type: String,
      default: '',
    }
  },
  data() {
    return {
      url: '',
      finsh:false,
      err:false
    };
  },
  computed:{
    otherUrl(){
      if(this.err&&this.url){
        return this.url
      }else if(this.finsh&&this.url){
        return this.url
      }
      return require('@/assets/image/loading.gif')
    },
    classNames(){
      if(this.err){
        return this.className+' err'
      }
      return this.className
    }
  },
  created() {
    this.getImg(this.src)
  },
  methods: {
    handerClick(){
      this.$emit('click')
    },
     getImg(src){
      this.$ImgStorage.initRunsToRun( (getimg)=>{
        const url = getimg.getImg(src,this.error)
        this.url=url
        if(this.log){
          console.log('this.url', this.url)
          console.log('src', src)
        }
      })
    },
    error(){
      if(!this.run||this.err)return
      this.finsh=true
      this.err=true
      this.url=this.errImg?this.errImg:require('@/assets/image/loading_error.jpg')
    },
    load(){
      if(this.err) {
        this.finsh=true
        return
      } 
      this.finsh=true
      this.err=false
    }
  },
};
</script>

<template v-if="lazy">
  <img :alt="alt" @click="handerClick" :loading="loading" v-lazy="url" :class="className" :style="styles" :lazy-load="lazyLoad"/>
</template>
<template v-else>
  <img @error="error" @click="handerClick" @load="load" :alt="alt" :loading="loading" :src="otherUrl" :class="classNames" :style="styles" :lazy-load="lazyLoad"/>
</template>

<style scoped>
.err{
  object-fit: contain;
}
img {
  max-height: 100%;
}
</style>
