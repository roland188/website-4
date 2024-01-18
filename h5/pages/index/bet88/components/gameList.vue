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
          :class="$config.projectImgUrl == 'g9be' ? 'game1' : ''"
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
			return this.$config.getImgUrl(item.menuIconActiveApp)
		} else {
			return this.$config.getImgUrl(item.menuIconApp)
		} 
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
// 游戏列表
.gamelist {
  width: 100%;

  .nav {
    position: absolute;
    width: 21%;
    height: 784upx;
    z-index: 1;
    color: #9ea9b3;
    overflow-y: auto;
    background-color: #0f0f0f;

    .con {
      position: relative;
      height: 115upx;
      line-height: 165upx;
      text-align: center;
      font-size: 12px;
      background-color: #2a2a2a;
      color: #e6d7b4;
      margin: 10px auto;
      box-sizing: border-box;

      border-radius: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .bgicon {
        position: absolute;
        left: 35%;
        top: 15upx;
        width: 50upx;
        height: 50upx;

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
      background: url("../../../../static/image/indexImg/left-active-bg.png");
      background-repeat: no-repeat;
      background-size: cover;
      color: #5b2805;
    }
  }

  .secondList {
    position: relative;
    padding-left: 25%;
    height: 784upx;
    overflow-y: auto;

    .game {
      float: left;
      width: 48%;
      margin-left: 2%;
      margin-bottom: 2%;
      border-radius: 25upx;
      background: url("../../../../static/image/indexImg/game-bg.png") no-repeat center/contain;

      .inner {
        position: relative;
        width: 100%;
        padding-top: 88%;

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
          top: 7px;
          left: 6px;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
        }
      }
    }

    .game1 {
      float: left;
      width: 98%;
      margin-left: 2%;
      margin-bottom: 2%;
      background: url("../../../../static/image/indexImg/game1-bg.png") no-repeat center/contain;
      .inner1 {
        width: 100%;
        padding-top: 44%;
      }
    }
  }
}
</style>
