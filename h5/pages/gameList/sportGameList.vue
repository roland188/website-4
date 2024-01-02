<!-- 游戏列表 -->
<template>
  <!-- 右侧列表 -->
  <view class="gameList">
    <scroll-view :scroll-y="true">
      <view>
        <view v-if="gameList.length > 0"  :class="[2,4,6,8].includes(gameId) ? 'gameList-content1' : 'gameList-content'">
          <block v-for="(item, index) in gameList" :key="index">
            <view
              class="inner inner1"
              :class="[2,4,6,8].includes(gameId) ? 'game1' : ''"
              @tap="difference(item, index)"
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
                mode="widthFix"
                alt=""
              ></image>
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
    </scroll-view>
  </view>
</template>
  
  <script>
export default {
  props: {
    gameList: Array,
    gameId: Number,
  },
  data() {
    return {
      noDate: require("@/static/image/gameerror.png"),
      id: 1,
    };
  },
  created() {},
  mounted() {},
  methods: {
    difference(item, index) {
      this.$emit("difference",item, index,);
    },
  },
};
</script>
  
 <style lang="scss" scoped>
.gameList {
  position: relative;
  // padding-left: 25%;
  // max-height: 784upx;
  // overflow-y: auto;
  .gameList-content {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 20upx 4upx 0 20upx;
  }
  .gameList-content1{
    display: flex;
    flex-direction: column;
    padding: 30upx;
  }
  .inner {
    width: 95%;
    position: relative;
    // margin-bottom: 8upx;
  }
  .game1{
    width: 100%;
    position: relative;
  }
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
</style>
  