<!-- 游戏列表 -->
<template>
  <view class="gamelist">
    <!-- 左侧列表 -->
    <scroll-view class="nav" :scroll-top="navTop" scroll-y="true">
      <view
        class="con"
        v-for="(item, index) in leftArray"
        :key="index"
        :class="navIndex == index ? 'con-active' : ''"
        @click="changeIndex(index)"
      >
        <view class="bgicon">
          <image
            class="img"
            :src="getMyImg(item, navIndex,index)"
            mode="acpectFit"
            alt=""
          ></image>
        </view>
        {{ item.name }}
      </view>
    </scroll-view>
    <!-- 右侧列表 -->
    <scroll-view class="secondList" :scroll-top="navTop" scroll-y="true">
      <block v-for="(item, index) in gameList" :key="index">
        <!-- :class="[1,2,4,6].includes(id) ? 'game1' : ''"  -->
        <view
          class="game"
		      :class="getGameClas(gameList)"
          v-if="item.name !== $t('捕鱼达人')"
        >
          <view
            class="inner"
            @tap="difference(gamemenusparent, item, navIndex, index)"
          >
            <image v-if="navIndex === 0"
              class="img" 
              :src="
              item.topUrl
                  ? $config.getImgUrl(item.topUrl)
                  : item.pictureUrl
                  ? $config.getImgUrl(item.pictureUrl)
                  : noDate
              "
              mode="aspectFit"></image>
            <image v-else
              class="img" :src=" item.imgUrlApp
                  ? $config.getImgUrl(item.imgUrlApp)
                  : item.pictureUrl
                  ? $config.getImgUrl(item.pictureUrl)
                  : noDate
              "
              mode="aspectFit"></image>
            <view class="title_content">
              <view class="title" v-if="navIndex !== 0">{{ item.name }}</view>
              <image class="icon" :src="item.imgUrlAppOne? $config.getImgUrl(item.imgUrlAppOne) : ''" mode="aspectFit"></image>
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    arr: Array,
    leftArray: Array,
    gamemenus: Array,
    leftMenuIcon: Array,
    gamemenusparent: [Object, Array],
  },
  data() {
    return {
      navTop: 0, // 滚动的高度
      navIndex: 0, //左侧列表索引
      noDate: require("@/static/image/gameerror.png"),
	  id: 1,
	  gameList:[]
    };
  },
  created(){
	  this.gameList = this.leftArray[this.navIndex]?.children
	  this.id = this.leftArray[this.navIndex]?.id
  },
  methods: {
    // 更改左侧列表选中
    changeRightData(leftArray) {
      setTimeout(() => {
		this.gameList = leftArray[this.navIndex]?.children
		this.id = leftArray[this.navIndex]?.id
        this.$emit("changeRightData", leftArray[this.navIndex]);
      }, 0);
    },
    changeIndex(val) {
      this.navIndex = val;
      this.gameList = this.leftArray[val]?.children
      this.id = this.leftArray[val].id
      this.$emit("changeRightData", this.leftArray[this.navIndex]);
    },
    // 游戏排版
    getGameClas(data){
      let gameNum = data.length
      if(gameNum == 0) return ''
      if(gameNum < 4){
        return 'game1'
      }else if(gameNum%2 == 0 ){
        return 'game2'
      }else if(gameNum%2 != 0){
        return 'game3'
      }
    },
    getMyImg(item, navIndex,index) {
      if(item.id == 0){
        if(navIndex===index){
          return item.menuIconActiveApp
        } else {
          return item.menuIconApp
        }
      }
      if(navIndex===index){
        return this.$config.getImgUrl(item.menuIconActiveApp)
      } else {
        return this.$config.getImgUrl(item.menuIconApp)
      }
    },
    difference(gamemenusparent, item, navIndex, index) {
      this.$emit("difference", {
        gamemenusparent,
        item,
        navIndex,
        index,
      });
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep{
  .uni-scroll-view-content{
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    justify-content: space-between;
    -ms-overflow-style: none;
    scrollbar-width: none;
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    position: relative;
    transition-property: transform;
  }
}
// 游戏列表
.gamelist {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  .nav {
    height: 100%;
    z-index: 1;
    color: #9ea9b3;
    overflow-y: auto;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    padding-right: 2%;
    padding-top: 6px;
    flex: 18%;

    .con {
      width: 100%;
      position: relative;
      min-height: 96rpx;
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;
      text-align: center;
      font-size: 12px;
      background-color: #e7f1fb;
      color: #535867;
      margin: 10px auto;
      box-sizing: border-box;
      border-radius: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .bgicon {
        width: 40upx;
        height: 40upx;
        margin: 0 auto;
        position: relative;
        .img {
          width: 100%;
          height: 100%;
          margin: auto;
          position: absolute;
          left: calc(50% - 20rpx);
          z-index: 2;
        }
      }
    }

    .con:nth-child(1) {
      margin-top: 0;
    }

    .con-active {
      border: 1px solid #3281d0;
      .bgicon{
        &::before{
        background: url('~@/static/image/indexImg/ic_GLshadow.png') no-repeat center;
          background-size: 100% auto !important;
          display: block;
          width: 4vh;
          height: 4px;
          content: " ";
          margin: auto;
          opacity: .8;
          position: absolute;
          left: calc(50% - 2vh);
          bottom: -0.2vh;
          z-index: 1;
          animation: aniShadow 0.8s ease-out infinite;
          -webkit-animation: aniShadow 0.8s ease-out infinite;
        }
        .img{
          animation: aniGame 0.8s ease-out infinite;
          -webkit-animation: aniGame 0.8s ease-out infinite;
        }
      }
    }
  }

  .secondList {
    position: relative;
    height: 100%;
    overflow-y: auto;
    flex: 82%;
    margin-right: -2%;
    padding-right: 2%;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    justify-content: space-between;
    -ms-overflow-style: none;
    scrollbar-width: none;
    .game {
      width: 50%;
      margin-bottom: 2%;
      border-radius: 25upx;
      // background: url("@/static/image/indexImg/game-bg.png") no-repeat center/cover;
      display: flex;
      align-items: center;
      background: #b2d2ed;
      background: -moz-linear-gradient(top, #b2d2ed 0%, #d1e6f6 100%);
      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#b2d2ed), color-stop(100%,#d1e6f6));
      background: -webkit-linear-gradient(top, #b2d2ed 0%,#d1e6f6 100%);
      background: -o-linear-gradient(top, #b2d2ed 0%,#d1e6f6 100%);
      background: -ms-linear-gradient(top, #b2d2ed 0%,#d1e6f6 100%);
      background: linear-gradient(to bottom, #b2d2ed 0%,#d1e6f6 100%);
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b2d2ed', endColorstr='#d1e6f6',GradientType=0 );
      .inner {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 20rpx;
        min-height: 218rpx;
        .img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .title_content {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 18rpx;
          width: 110rpx;
          .title{
            color: #535867;
            font-size: 26rpx;
            font-weight: 700;
            text-align: center;
          }
          .icon{
            height: 110rpx;
          }
        }
      }
    }

    .game1 {
      width: 100%;
      .inner{
        display: flex;
        align-items: center;
        .title_content{
          width: 45%;
        }
      }
    }
    .game2 {
      width: calc(50% - 4px);
    }
    .game3 {
      width: calc(50% - 4px);
      &:first-child{
        width: 100%;
      }
    }
  }
}
@keyframes aniGame {
    0% {
        bottom: 10rpx;
    }

    50% {
        bottom: 0rpx;
    }

    100% {
        bottom: 10rpx;
    }
}

@-webkit-keyframes aniGame {
    0% {
        bottom: 10rpx;
    }

    50% {
        bottom: 0rpx;
    }

    100% {
        bottom: 10rpx;
    }
}

@keyframes aniShadow {
    0% {
        width: 50rpx;
        left: calc(50% - 25rpx);
    }

    50% {
        width: 25rpx;
        left: calc(50% - 12rpx);
        opacity: .5;
    }

    100% {
        width: 50rpx;
        left: calc(50% - 25rpx);
    }
}

@-webkit-keyframes aniShadow {
    0% {
        width: 3.6vh;
        left: calc(50% - 1.8vh);
    }

    50% {
        width: 1.4vh;
        left: calc(50% - .7vh);
        opacity: .5;
    }

    100% {
        width: 3.6vh;
        left: calc(50% - 1.8vh);
    }
}
</style>
