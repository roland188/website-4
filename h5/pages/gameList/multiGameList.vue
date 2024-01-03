<!-- 游戏列表 -->
<template>
  <!-- 右侧列表 -->
  <view class="multiGameList" v-bind:class="[laFlag ? 'over' : '']">
    <view class="game-type">
      <view v-if="gameMenus.length > 0">
        <view class="switch">
          <view class="game-type-switch">
            <view
              :class="{ 'all-games': true, active: switchIndex == 1 }"
              @click="changeSwitchIndex(1)"
            >
              {{ $t("全部游戏") }}
            </view>
            <view
              :class="{ 'hot-games': true, active: switchIndex == 2 }"
              @click="changeSwitchIndex(2)"
            >
              {{ $t("热门游戏") }}
            </view>
          </view>
        </view>
        <!-- 左侧列表 -->
        <scroll-view
          class="nav"
          id="scrollContainer"
          :enable-flex="true"
          scroll-with-animation
          :throttle="true"
          :scroll-left="scrollLeft"
          scroll-x
        >
          <view
            class="con"
            :class="subNavIndex == index ? 'con-active' : ''"
            v-for="(item, index) in gameMenus"
            :key="index"
            @click="changeSubNavIndex(index, item)"
          >
            <view class="bgicon">
              <image
                class="img"
                :src="$config.getImgUrl(item.imgUrlApp)"
                mode="acpectFit"
                alt=""
              ></image>
            </view>
            <span>{{ item.name }}</span>
          </view>
        </scroll-view>

        <view class="game-search">
          <input
            class="game-search__input"
            type="text"
            :cursor-spacing="400"
            v-model.trim="keyword"
            :placeholder="$t('请输入游戏名称')"
            placeholder-style="color:#999;font-size:1rem"
          />
          <image
            src="../../static/image/gs2.svg"
            class="game-search_s"
            @click="searchGame()"
          ></image>
        </view>
      </view>
    </view>

    <view v-if="dataList.length > 0" class="games">
      <block v-for="(item, index) in dataList" :key="index">
        <view class="game">
          <view
            class="inner inner1"
            @tap="difference(item, index)"
          >
            <view class="game-image">
              <image
                class="img"
                :src="
                  item.imgUrlApp
                    ? $config.getImgUrl(item.imgUrlApp)
                    : item.pictureUrl
                    ? $config.getImgUrl(item.pictureUrl)
                    : noDate
                "
                alt=""
              ></image>
            </view>

            <view class="title">{{ item.name }}</view>
          </view>
        </view>
      </block>
    </view>
    <view v-else class="search-none">
      <view class="none-con">
        <image
          class="none-img"
          :src="require('../../static/image/mb/null-data.png')"
          mode="widthFix"
        ></image>

        <view class="wen-none">{{ $t("这里空空的") }}</view>
        <view class="wen-none">{{ $t("什么都没有哦") }}</view>
      </view>
    </view>
  </view>
</template>
  
  <script>
export default {
  props: {
    gameMenus: Array,
    gameId: Number,
  },
  watch: {
    gameId(newVal) {
      if (newVal) {
        this.initData();
      }
    },
  },
  data() {
    return {
      noDate: require("@/static/image/gameerror.png"),
      id: 1,
      switchIndex: 0,
      subNavIndex: 0,
      scrollLeft: 0,
      keyword: "",
      containerWidth: 0,
      clientRectWidth: 0,
      subNavItemWidth: 0,
      dataList: [],
      vendorId: "",
      pageNo: 1,
      pageSize: 21,
      gameKindId: "",
      over: false,
      type:'',
      laFlag: false,
    };
  },
  created() {},
  onShow() {},
  mounted() {
    this.$nextTick(() => {
      this.initData();
    });
  },

  onReachBottom() {
    this.getGameList()
  },
  methods: {
    difference(item, index) {
      this.$emit("difference",item, index,);
    },
    getGameList(){
      this.pageNo = this.pageNo + 1;
      if (!this.over) {
        if (this.type == 1) {
          this.getVendorGame();
        } else {
          this.getGameByIds();
        }
      }
    },
    initData() {
      this.subNavIndex = 0;
      this.switchIndex = 1;
      this.getTabItemWidth();
      this.keyword = "";
      this.dataList = [];
      if (this.gameMenus?.length > 0) {
        this.gameKindId = this.gameMenus[0].parentId;
        this.vendorId = this.gameMenus[0].ids;
        this.type = this.gameMenus[0].type;
        if (this.type == 1) {
          this.getVendorGame();
        } else {
          this.getGameByIds();
        }
      } else {
        this.over = true;
      }
    },
    changeSwitchIndex(index) {
      this.pageNo = 1
      this.pageSize = 21
      this.over = false
      this.switchIndex = index;
      this.dataList = [];
      this.keyword = "";
      this.type = this.gameMenus[this.subNavIndex].type;
      this.changeSubNavIndex(0,this.gameMenus[0]);
    },
    changeSubNavIndex(index, item) {
      this.pageNo = 1
      this.pageSize = 21
      this.over = false
      this.subNavIndex = index;
      this.getTabItemWidth();
      this.dataList = [];
      this.keyword = "";
      this.laFlag = false;
      this.vendorId = item.ids || item.id;
      this.gameKindId = item.parentId || ''
      this.type = item.type;
      if (this.type == 1) {
        this.getVendorGame();
      } else {
        this.getGameByIds();
      }
    },
    getTabItemWidth() {
      let query = uni
        .createSelectorQuery()
        // #ifndef MP-ALIPAY
        .in(this);
      // #endif
      // 获取容器的宽度
      query
        .select(`#scrollContainer`)
        .boundingClientRect((data) => {
          if (!this.containerWidth && data) {
            this.containerWidth = data.width;
          }
        })
        .exec();
      this.subNavItemWidth = this.containerWidth / 3;
      // 获取所有的 tab-item 的宽度
      query
        .selectAll(".con")
        .boundingClientRect((data) => {
          if (!data) {
            return;
          }
          let lineLeft = 0;
          let currentWidth = 0;
          let totalWidth = 0;
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              totalWidth += data[i].width;
              if (i < this.subNavIndex) {
                lineLeft += data[i].width;
              } else if (i == this.subNavIndex) {
                currentWidth = data[i].width;
              }
            }
            // 当前滑块的宽度
            this.currentWidth = currentWidth;
            // // 缩放后的滑块宽度
            // this.lineWidth = currentWidth * this.lineScale * 1
            // // 滑块作移动的位置
            // this.lineLeft = lineLeft + currentWidth / 2
            // // 胶囊距离左侧的位置
            // this.pillsLeft = lineLeft
            // 计算滚动的距离左侧的位置
            const center = this.containerWidth / 2 - currentWidth / 2;
            if (lineLeft < center) this.scrollLeft = 0;
            else if (lineLeft > totalWidth - center)
              this.scrollLeft = totalWidth;
            else this.scrollLeft = lineLeft - center;
            // this.scrollLeft = lineLeft + currentWidth / 2 - this.containerWidth / 2
          }
        })
        .exec();
    },
    searchGame() {
      if (this.switchIndex == 1) {
        this.getVendorGame();
      } else {
        this.getGameByIds();
      }
    },
    getVendorGame() {
      let self = this;
      let req = {
        currentPage: self.pageNo,
        pageSize: self.pageSize,
        vendorId: self.vendorId,
        name:self.keyword,
        gameKindId: self.gameKindId,
      }
      console.log(req,'req2');
      self.$api.getVendorGame(req,
        function (err, res) {
          if (err) {
            uni.showToast({
              title: err.msg,
              icon: "none",
            });
          } else {
            self.dataList.push(...res.list);
            if (self.pageNo >= res.pages) {
              self.over = true;
            }
          }
        },
        true
      );
    },
    getGameByIds() {
      let self = this;
      let req = [self.pageNo, self.pageSize, self.vendorId, self.gameKindId];
      self.$api.getGameByIds(
        ...req,
        function (err, res) {
          self.laFlag = false;
          if (err) {
          } else {
            self.dataList.push(...res.list);
            self.isKong = true;
            if (self.pageNo >= res.pages) {
              self.over = true;
            }
          }
        },
        true
      );
    },
  },
};
</script>
  
  <style lang="less" scoped>
::v-deep .nav .uni-scroll-view-content {
  display: flex;
}
.multiGameList {
  position: relative;
  // padding-left: 25%;
  // max-height: 784upx;
  overflow-y: auto;
  .game-type {
    .switch {
      width: 100%;
      padding: 20upx 17upx;
      .game-type-switch {
        display: flex;
        width: 100%;
        color: white;
        font-size: 22upx;
        border: 2upx solid #db9c30;
        border-radius: 6upx;
        .active {
          background: #dc9c30;
        }
        .all-games {
          text-align: center;
          font-size: 100%;
          height: 52upx;
          flex: 1;
          line-height: 52upx;
        }
        .hot-games {
          text-align: center;
          font-size: 100%;
          height: 52upx;
          flex: 1;
          line-height: 52upx;
        }
      }
    }
    .nav {
      z-index: 1;
      color: #9ea9b3;
      overflow-x: auto;
      background-color: #0f0f0f;
      position: relative;
      // height: 92upx;
      // margin-bottom: 16upx;
      padding: 5upx 6upx;
      background-color: #3a3a3a;
      white-space: nowrap;
      line-height: 60rpx;

      .con {
        display: inline-flex;
        vertical-align: middle;
        /* height: 41px; */
        line-height: 33upx;
        padding: 0 14px;
        color: #fff;
        font-size: 22upx;
        width: min-content;
        font-weight: 500;
        border-radius: 30px;
        flex-direction: column;
        align-items: center;
        .bgicon {
          width: 60upx;
          height: 60upx;
          margin-right: 10upx;
          margin-top: 6upx;
          .img {
            width: 100%;
            height: 100%;
          }
        }
        span {
          margin-top: 2upx;
        }
      }

      .con:nth-child(1) {
        margin-top: 0;
      }

      .con-active {
        // background: linear-gradient(85.62deg,#fead00 10.63%,#ffc54a 102.31%);
        background-repeat: no-repeat;
        background-size: cover;
        color: #ff9000;
      }
    }
    .game-search {
      position: relative;
      height: 100rpx;
      padding: 20rpx 30rpx;
      color: white;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      &__input {
        height: 55upx;
        background: #000;
        padding-left: 17upx;
        border-radius: 5upx;
        font-size: 27upx;
        width: 100%;
        border: 2upx solid rgba(255, 172, 48, 0.5);
        flex: 0 0 85%;
        margin-right: 34upx;
      }
      &__empty {
        color: #999;
      }
      ::v-deep .uni-input-wrapper {
        padding-left: 0;
      }
      .game-search_s {
        width: 36rpx;
        height: 36rpx;
        flex: 0 0 10%;
      }
    }

    .nav {
      z-index: 1;
      color: #9ea9b3;
      overflow-x: auto;
      background: #2b3043;
      border-top: 2upx solid rgba(0, 0, 0, 0.5);
      border-bottom: 2upx solid rgba(0, 0, 0, 0.5);
      position: relative;
      height: 76upx;
      // height: 92upx;
      // margin-bottom: 16upx;
      padding: 0;
      white-space: nowrap;
      line-height: 60rpx;

      .con {
        display: inline-flex;
        vertical-align: middle;
        /* height: 41px; */
        line-height: 33upx;
        padding: 0 14px;
        color: #fff;
        background: #171717;
        font-size: 22upx;
        font-weight: 500;
        border-radius: 0px;
        flex-direction: row;
        align-items: center;
        flex: 1 0 auto;
        flex-basis: 34% !important;
        max-width: 34%;

        .bgicon {
          width: 60upx;
          height: 60upx;
          margin-right: 10upx;
          margin-top: 6upx;
          .img {
            width: 100%;
            height: 100%;
          }
        }
        span {
          margin-top: 2upx;
          line-height: 65upx;
          font-weight: 500;
          font-size: 20upx;
        }
      }

      .con:nth-child(1) {
        margin-top: 0;
      }

      .con-active {
        // background: linear-gradient(85.62deg,#fead00 10.63%,#ffc54a 102.31%);

        color: #fff;
        background: #000;
        border-bottom: 5upx solid #ff9000;
      }
    }
  }
  .games {
    display: flex;
    flex-wrap: wrap;
    .game {
      position: relative;
      width: 25%;
      min-height: 225upx;
      padding: 0 17upx 34upx;
      // background: url("../../static/image/indexImg/game-bg.png") no-repeat center/contain;
      .inner {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .game-image {
          padding: 8upx;
          display: flex;
          &::before {
            position: absolute;
            width: 121upx;
            height: 26upx;
            background-image: -webkit-gradient(
              linear,
              left top,
              left bottom,
              from(hsla(0, 0%, 100%, 0.1)),
              to(hsla(0, 0%, 100%, 0))
            );
            border-radius: 8upx;
            top: 1upx;
            left: 50%;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
            content: "";
          }
          .img {
            width: 112upx;
            height: 112upx;
            border-radius: 50%;
          }
        }

        .title {
          font-size: 22upx;
          display: -webkit-box;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 19upx;
          padding-top: 13upx;
          word-break: break-word;
        }
      }
    }
  }

  .search-none {
    width: 100%;
    color: #58576e;
    font-size: 24upx;
    text-align: center;
    margin-top: 50upx;
    .wen-none {
      color: #8a8989;
      font-size: 28upx;
    }
  }
}
.over {
	overflow: hidden;
}
</style>
  