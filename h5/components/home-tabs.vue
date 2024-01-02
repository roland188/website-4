<template>
  <view>
    <view class="tabsBox">
      <view class="wrap">
        <view class="homeBox">
          <scroll-view
            :enable-flex="true"
            scroll-with-animation
            :throttle="false"
            :scroll-left="scrollLeft"
            scroll-x
          >
            <view class="tabBox">
              <view
                class="tab-item"
                :key="index"
                v-for="(item, index) in navList"
                @tap="changeIndex(index)"
              >
                <view :class="tabIndex == index ? 'tab-choice' : ''">{{
                  item.title
                }}</view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view>
          <scroll-view scroll-x="true" class="bookshelf-content">
            <!-- 	<uni-transition :mode-class="modeClass" :duration="200" :show="show" @change="changeTab"> -->
            <block
              v-for="(item, index) in hotList"
              :key="index"
              v-if="tabIndex === 0"
            >
              <view class="item">
                <view class="img" @click="goToGame(hot, item, tabIndex, index)">
                  <image
                    :src="$config.getImgUrl(item.pictureUrl)"
                    style="width: 55px; height: 50px; border-radius: 2px"
                  ></image>
                </view>
                <text class="item-title text-over-1">{{ item.name }}</text>
              </view>
            </block>

            <block
              v-for="(item, index) in changList"
              :key="index"
              v-if="tabIndex === 1"
            >
              <view class="item" if="isLogin">
                <view
                  class="img"
                  @click="goToGame(change, item, tabIndex, index)"
                >
                  <image
                    :src="$config.getImgUrl(item.pictureUrl)"
                    style="width: 55px; height: 50px; border-radius: 2px"
                  ></image>
                </view>
                <text class="item-title text-over-1">{{ item.name }}</text>
              </view>
            </block>
            <block
              v-for="(item, index) in tuiList"
              :key="index"
              v-if="tabIndex === 2"
            >
              <view class="item">
                <view class="img" @click="goToGame(tui, item, tabIndex, index)">
                  <image
                    :src="$config.getImgUrl(item.pictureUrl)"
                    style="width: 55px; height: 50px; border-radius: 2px"
                  ></image>
                </view>
                <text class="item-title text-over-1">{{ item.name }}</text>
              </view>
            </block>
            <!-- 	</uni-transition> -->
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    hotList: {
      type: Array,
      required: true,
    },
    tuiList: {
      type: Array,
      required: true,
    },
    changList: {
      type: Array,
      required: true,
    },
    isLogin: {
      type: [Boolean, Number],
      default: null,
    },
    goToGame: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      tabIndex: 0,
      hot: {},
      tui: {},
      change: {},
      navList: [
        {
          title: this.$t('热门'),
        },
        {
          title: this.$t('常玩'),
        },
        {
          title: this.$t('推荐'),
        },
      ],
      scrollLeft: 0,
      show: false,

      modeClass: ["fade", "slide-right"],
    };
  },
  mounted() {
    //初始化左侧的数据给方法
    this.hot.children = this.hotList;
    this.tui.children = this.tuiList;
    this.change.children = this.changList;
  },
  onReady() {
    this.$refs.ani.init({
      duration: 1000,
      timingFunction: "linear",
      transformOrigin: "50% 50%",
      delay: 500,
    });
  },
  methods: {
    setTab() {
      this.navList = [
        {
          title: this.$t('热门'),
        },
        {
          title: this.$t('常玩'),
        },
        {
          title: this.$t('推荐'),
        },
      ];
    },
    changeIndex(index) {
      this.show = !this.show;
      this.tabIndex = index;
      if (!this.isLogin && index === 1) {
        this.tabIndex = 0;
        uni.navigateTo({
          url: "/pages/Login/Login",
        });
        uni.showToast({
          icon: "none",
          title: this.$t('请先登录'),
        });
        return;
      }
    },
    changeTab() {
      // console.log('触发动画')
      this.show = true;
    },
  },
};
</script>

<style lang="scss">
$tabChoiceColor: #f9dc75;
$max: 100%;

.tabsBox {
  .wrap {
    position: relative;
    width: $max;

    .homeBox {
      .tabBox {
        position: relative;
        white-space: nowrap;
        line-height: 60rpx;

        /* #ifdef MP-TOUTIAO */
        /* #endif */
        .tab-item {
          padding: 10rpx 16rpx;
          position: relative;
          display: inline-block;
          text-align: center;
          font-size: 24upx;
          color: #fff;
          transition-property: background-color, width;
        }

        .tab-choice {
          position: relative;
          color: $tabChoiceColor;
        }

        .tab-choice:before {
          content: "";
          position: absolute;
          left: 0;
          bottom: -12rpx;
          width: 100%;
          height: 6rpx;
          border-radius: 1rpx;
          background: $tabChoiceColor;
        }
      }
    }

    .bookshelf-content {
      white-space: nowrap;
      width: 100%;
      padding: 20upx 0;
      // margin: 0 25upx;

      .item {
        // width: 20%;
        margin-right: 20upx;
        display: inline-block;
        vertical-align: top;

        .img {
          display: inline-block;

          image {
            width: 170upx;
            height: 220upx;
            border-radius: 6upx;
          }
        }

        .item-title {
          display: block; // 让字体换行
          width: 114upx;
          font-size: 26upx;
          line-height: 40upx;
          color: #fff;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .tab-content {
      padding-top: 40px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
      background-color: #fff;
      text-align: center;

      .content-item {
        width: 33%;
        margin-top: 10px;

        .game-name {
          width: 100%;
          height: 17px;
          text-align: center;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 12px;
          color: #333;
          opacity: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

// // 删除 底部滚动条
/* #ifndef APP-NVUE */
::-webkit-scrollbar,
::-webkit-scrollbar,
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

/* #endif */
/* #ifdef H5 */

scroll-view ::v-deep ::-webkit-scrollbar {
  display: none;
}

/* #endif */
</style>
