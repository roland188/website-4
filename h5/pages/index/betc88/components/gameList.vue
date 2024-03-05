<!-- 游戏列表 -->
<template>
  <view class="gamelist">
    <!-- 左侧列表 -->
    <view class="navList" v-if="leftArray.length > 0">
      <view class="left" @click="slideLeft">
        <uni-icons type="arrowleft" size="26" color="#ff9000"></uni-icons>
      </view>

      <scroll-view class="nav" 
          :enable-flex="true"
          ref="scrollView"
          @scroll="onScroll"
          scroll-with-animation
          :scroll-into-view="viewIdx"
          :throttle="false"
          :scroll-left="0" scroll-x
        >
        <view
          class="con"
          v-for="(item, index) in leftArray"
          :key="index"
          :id="'idx'+(index+1)"
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
      <view class="right" @click="slideRight">
        <uni-icons type="arrowright" size="26" color="#ff9000"></uni-icons>
      </view>
    </view>
    <!-- 搜索游戏 -->
    <view class="searchTab" @click="toSearch">
      <text class="searchIcon cuIcon-search"></text>
      <input
        class="uni-input-input searchInput"
        confirm-type="search"
        type="text"
        placeholder-class="searchPlace"
        :placeholder="$t('请输入你要搜索的内容')"
      />
    </view>
    <!-- 右侧列表 -->
    <scroll-view class="secondList" :scroll-top="navTop" scroll-y="false">
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
          </view>
          <view class="title">{{ item.name }}</view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
import uniIcons from "@/components/uni-icons/uni-icons.vue";
export default {
  props: {
    arr: Array,
    leftArray: Array,
    gamemenus: Array,
    leftMenuIcon: Array,
    gameHot: Array,
    gamemenusparent: [Object, Array],
  },
  components:{
    uniIcons
  },
  data() {
    return {
      navTop: 0, // 滚动的高度
      navIndex: 0, //左侧列表索引
      viewId: 1,
      viewIdx:'',
      noDate: require("@/static/image/gameerror.png"),
      id: 1,
      gameList:[]
    };
  },
  created(){
	  this.gameList = this.leftArray[this.navIndex]?.children
	  this.id = this.leftArray[this.navIndex]?.id
  },
  watch:{
  },
  methods: {
    toSearch(){
      if (!this.$api.isLogin()) {
        uni.navigateTo({
          url: "/pages/Login/Login",
        });
        return;
      }
      uni.navigateTo({url:"/pages/search/search"})
    },
    slideLeft(){
      if(this.viewId > 0){
        this.viewId = this.viewId - 1
        this.viewIdx = 'idx' + this.viewId;
      }
    },
    slideRight(){
      if(this.viewId <= this.leftArray.length){
        this.viewId = this.viewId + 1
        this.viewIdx = 'idx' + this.viewId;
      }
    },
    onScroll(e){
      console.log(e)
    },
    // 更改左侧列表选中
    changeRightData(leftArray) {
      setTimeout(() => {
		this.gameList = leftArray[this.navIndex]?.children
		this.id = leftArray[this.navIndex]?.id
        this.$emit("changeRightData", leftArray[this.navIndex]);
      }, 0);
    },
    changeIndex(val) {
      this.viewId = val
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
  .navList{
    position: relative;
   .left {
      position: absolute;
      left: 0rpx;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9;
      color: #ff9000;
    }
    .right {
      position: absolute;
      right: 0rpx;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9;
      color: #ff9000;
    }
  }
  .nav {
    z-index: 1;
    color: #9ea9b3;
    overflow-x: auto;
    background-color: #0f0f0f;
    position: relative;
    height: 92upx;
    margin-bottom: 16upx;
    padding: 16upx 34upx;
    background-color: #3a3a3a;
    border-radius: 106upx;
    white-space: nowrap;
    line-height: 60rpx;

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
  .searchTab{
	padding: 20rpx 20rpx; 
  margin-bottom: 16rpx;
  background: #22211f;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  .searchIcon {
    margin-right: 10rpx;
    font-size: 36upx;
    color: #767676;
  }

    .search{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .secondList {
    position: relative;
    // padding-left: 25%;
    // max-height: 784upx;
    height: auto;
    .game {
      flex: 1;
      // height: 226upx;
      margin-bottom: 2%;
      overflow: hidden;
      // background: url("@/static/image/indexImg/game-bg.png") no-repeat center/contain;
      // background-size: 100% 100%;
      .inner {
        position: relative;
        width: 100%;
        padding-top: 100%;
        border-radius: 25upx;
        overflow: hidden;
        .img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .title {
          // position: absolute;
          // bottom: 0;
          // left: 0px;
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
          // background: #414141;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
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
