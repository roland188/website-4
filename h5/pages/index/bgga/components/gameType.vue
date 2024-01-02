<!-- 游戏列表 -->
<template>
    <view class="gamelist">
      <!-- 左侧列表 -->
      <scroll-view class="nav" 
          :enable-flex="true"
          scroll-with-animation
          :throttle="false"
          :scroll-left="0" scroll-x
        >
        <view
          class="con"
          v-for="(item, index) in menuList"
          :key="index"
          @click="toGamePage(item.id)"
        >
          <view class="bgicon">
            <image
              class="img"
              :src="$config.getImgUrl(item.menuIconApp)"
              mode="acpectFit"
              alt=""
            ></image>
          </view>
          {{ item.name }}
        </view>
      </scroll-view>
    </view>
  </template>
  
  <script>
  import cache from "@/utils/cache.js";
  export default {
    data() {
      return {
        menuList:[]
      };
    },
    created(){
        setTimeout(()=>{
            if(cache.get('game_menus')){
                this.menuList = cache.get('game_menus')
                this.menuList = this.menuList.filter(v =>{ return v.id != 0})
            }
        },500)
    },
    methods: {
        toGamePage(id){
            uni.navigateTo({
                url: `/pages/gamePage/gamePage?index=${id}`,
            });
        },
    },
  };
  </script>
  
  <style lang="less" scoped>
  // 游戏列表
  .gamelist {
    margin: 10upx 0;
    width: 100%;
    .nav {
      z-index: 1;
      color: #9ea9b3;
      overflow-x: auto;
      position: relative;
      padding: 0upx 20upx;
      border-radius: 106upx;
      white-space: nowrap;
  
      .con {
        display: inline-flex;
        vertical-align: middle;
        margin-right: 20rpx;
        color: #fff;
        font-size: 32upx;
        font-weight: 500;
        background-color: #3a3a3a;
        border-radius: 40upx;
        padding: 10rpx 20upx;
        .bgicon {
          width: 40upx;
          height: 40upx;
          margin-right: 10upx;
          margin-right: 4upx;
          .img {
            width: 100%;
            height: 100%;
          }
        }
      }
  
      .con:nth-child(1) {
        margin-top: 0;
      }
    }
  }
  </style>
  