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
        v-for="(item, index) in leftArray"
        :key="index"
        :class="navIndex == index ? 'con-active' : ''"
        @click="changeIndex(index)"
      >
        <view class="bgicon" v-show="navIndex === index">
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
		      :class="'game1'"
          v-if="item.name !== $t('捕鱼达人')"
        >
          <view
            class="inner inner1"
            @tap="difference(gamemenusparent, item, navIndex, index)"
          >
            <image
              class="img"
              :src="
                item.imgUrlApp
                  ? $config.getImgUrl(item.imgUrlApp)
                  : item.pictureUrl
                  ? $config.getImgUrl(item.pictureUrl)
                  : noDate
              "
              mode="aspectFit"
              alt=""
            ></image>

            <view class="title">{{ item.name }}</view>
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
    gameHot: Array,
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
    getMyImg(item, navIndex,index) {
		if(navIndex===index){
      if(item.id == 0) {
			  return item.menuIconActiveApp
      }
			return this.$config.getImgUrl(item.menuIconActiveApp)
		}
    // else {
		// 	return this.$config.getImgUrl(item.menuIconApp)
		// }
      // if (!this.leftMenuIcon[index]) return "";
      // return this.leftMenuIcon[index][index == navIndex ? "imgs" : "img"];
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
::v-deep  .secondList .uni-scroll-view-content{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 20upx 24upx;
    align-content: flex-start;
  }
// 游戏列表
.gamelist {
  width: 100%;
  .nav {
    z-index: 1;
    color: #9ea9b3;
    overflow-x: auto;
    background-color: #0f0f0f;
    position: relative;
    height: 92upx;
    margin-bottom: 16upx;
    padding: 16upx 6upx;
    background-color: #3a3a3a;
    border-radius: 106upx;
    white-space: nowrap;
    line-height: 60rpx;
    &::before {
      content: '《';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 999;
      color: #ff9000;
    }
    &::after {
      content: '》';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 999;
      color: #ff9000;
    }

    .con {
      display: inline-flex;
      vertical-align: middle;
      height: 54upx;
      line-height: 54upx;
      margin: 0 14px;
      color: #fff;
      font-size: 32upx;
      font-weight: 500;
      border-radius: 40upx;
      padding: 0 10upx;
      .bgicon {
        width: 40upx;
        height: 40upx;
        margin-right: 10upx;
        margin-top: 6upx;
        .img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .con:nth-child(1) {
      margin-top: 0;
    }

    .con-active {
      background: linear-gradient(85.62deg,#fead00 10.63%,#ffc54a 102.31%);
      background-repeat: no-repeat;
      background-size: cover;
      color: #5b2805;
    }
  }
  .secondList {
    position: relative;
    // padding-left: 25%;
    max-height: 784upx;
    overflow-y: auto;
    .game {
      flex: 1;
      height: 226upx;
      margin-bottom: 2%;
      overflow: hidden;
      border-radius: 25upx;
      background: url("@/static/image/indexImg/game-bg.png") no-repeat center/contain;
      background-size: 100% 100%;
      .inner {
        position: relative;
        width: 100%;
        padding-top: 100%;
        .img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .title {
          position: absolute;
          bottom: 0;
          left: 0px;
          width: 100%;
          line-height: 40upx;
          height: 40upx;
          padding: 0 20upx;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          text-transform: uppercase;
          background: #414141;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    // .game1 {
    //   float: left;
    //   width: 98%;
    //   margin-left: 2%;
    //   margin-bottom: 2%;
    //   background: url("@/static/image/indexImg/game1-bg.png") no-repeat center/contain;
    //   .inner1 {
    //     width: 100%;
    //     padding-top: 44%;
    //   }
    // }
  }
}
</style>
