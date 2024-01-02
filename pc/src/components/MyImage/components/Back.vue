<template>
  <div :class="className"  @click="handerclick" :style="styles">
  <slot></slot>
  </div>
 </template>
 
 <script>
   export default {
     name:'my-back',
     props:{
       className:{
         type:String,
         default:''
       },
       posx:{
         type:Number,
         default:0
       },
        posy:{
          type:Number,
          default:0
        },
        img:{
          type:String,
          default:''
        },
        multiplier:{
          type:Number,
          default:1
        },
        w:{
          type:Number|String,
          default:0|''
        },
        h:{
          type:Number,
          default:0
        },
        unit:{
          type:String,
          default:'rpx'
        },
        log:{
          type:Boolean,
          default:false
        },
        noStyle:{
          type:Boolean,
          default:false
        }
     },
     data(){
       return {
         styles:{
          width:`${this.w}${this.unit}`,
          height:`${this.h}${this.unit}`,
         },
         url:''
       }
     },
      created(){
        this.getImg()
      },
     methods:{
        handerclick(){
          this.$emit('click')
        },
       getImg(){
        this.$ImgStorage.initRunsToRun((getimg)=>{
          this.url =  getimg.getImg(this.img)
          if(this.log){
            console.log('this.url', this.url)
          }
          this.setStyle()
        })
      },
       setStyle(){
        if(this.noStyle)return this.styles = {
          backgroundImage:`url('${this.url}')`,
          backgroundRepeat:'no-repeat',
        }
        //获取图片的宽高
        const img = new Image()
        img.src =this.url
        img.onload=()=>{
          const style={
            background:`url('${this.url}') no-repeat ${this.posx/(this.multiplier??2)}${this.unit} ${this.posy/this.multiplier??2}${this.unit}/${img.width/this.multiplier??2}${this.unit}`,
            width:`${this.w}${this.unit}`,
            height:`${this.h}${this.unit}`
          }
          if(typeof this.w === 'string') style.width = this.w
          if(!!style.w) delete style.w
          if(typeof this.h === 'string') style.height = this.h
          if(!!style.h) delete style.h
          this.styles = style
        }
       }
     },
   }
 </script>
 
 <style lang="scss" scoped>
 </style>