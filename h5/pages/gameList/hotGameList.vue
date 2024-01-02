<!-- 游戏列表 -->
<template>
      <!-- 右侧列表 -->
    <view class="hotGameList">
      <view>
        <image
          class="banner-img"        
          :src="require('../../static/image/indexImg/hot-banner.png')"
          mode="widthFix"
          alt=""
          ></image>
      </view>
      <view v-for="(item, index) in gameList" 
        :key="index" 
        class="gameItem"
        @tap="difference(item, index)">
        
          <image
              class="img"
              :src="
                  item.topUrl
                  ? $config.getImgUrl(item.topUrl)
                  : item.pictureUrl
                  ? $config.getImgUrl(item.pictureUrl)
                  : noDate
              "
              mode="widthFix"
              alt=""
              ></image>

          <!-- <view class="title">{{ item.name }}</view> -->
              
        </view>
      <view class="content-about">
        <span class="title">{{ $t('关于在线娱乐场') }}{{ $config.appName }}</span>
        <span class="content">{{$config.appName}}{{ $t('在线娱乐场是一家获得马恩岛经济特区和卡加延省经济特区自由港授权的合法在线博彩许可证的娱乐场。在线娱乐场的目标是确保客户与公司之间的公平，并充分展示客观品质和能力...') }}</span>        
      </view>
    </view>
  </template>
  
  <script>
  export default {
    props: {
      gameList: Array,
    },
    data() {
      return {
        noDate: require("@/static/image/gameerror.png"),
        id: 1,
      };
    },
    created(){
    },
    mounted() {    
             
    },
    methods: {
      difference(item, index) {
        console.log(item,index,' item, navIndex, index')
        this.$emit("difference",item, index,);
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  .hotGameList {
    width: 100%;
    background: url("../../static/image/indexImg/hot-back.png");
    .banner-img {
      width: 100%;
    }
    .gameItem {
      padding: 5upx 17upx;
      position: relative;
      margin-bottom: 8upx;
      .img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .title {
        position: absolute;
        right: 9%;
        bottom: 17%;
        width: 225upx;
        height: 64upx;
        font-size: 22upx;
        display: -webkit-box;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
      }
    }

    .content-about {
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .title {
        font-size: 34upx;
        align-items: center;
        margin-bottom: 17upx;
        padding: 0 26upx;
      }
      .content {
        padding: 0 26upx 156upx;
        font-size: 24upx;
        line-height: 52upx;
      }
    }
  }
    
  </style>
  