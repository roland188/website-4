<!-- 公告 -->
<template>
  <view class="csCon" @tap="openalert2">
    <!-- <uni-icons class="conGif"  type="sound"  color="#fff"></uni-icons> -->
    <view class="conGif"></view>
    <uni-notice-bar
      :speed="speed"
      background-color="transparent"
      color="#666666"
      class="gongList"
      scrollable="true"
      single="true"
      v-if="textWen"
      :text="textWen"
    ></uni-notice-bar>
    <view class="mailbox"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      speed: 30,
      textWen: this.$t("热门推荐 捕鱼达人 电子游艺 体育赛事 棋牌游戏 彩票游戏 视讯直播 电竞赛事"), // 公告数据
    };
  },
  mounted() {
    this.getNotices();

    uni.$on("update", () => {
      this.getNotices();
    });
  },
  beforeDestroy() {
    uni.$off("update");
  },
  methods: {
    // 查看公告
    openalert2() {
      this.$emit("openalert2");
    },
    // 获取公告
    getNotices() {
      let req = [1, 5];
      let self = this;
      let textNav = "";
      self.$api.ptgNotices(
        ...req,
        function (err, res) {
          if (err) {
            console.log("%c" + "notices", "color:#a70a0a;", err);
          } else {
            for (var i = 0; i < res.content.length; i++) {
              textNav += res.content[i].content;
            }
            if(textNav)
              self.textWen = textNav;
            self.$emit("updateNotice", res.content);
            // self.modeldata.notices = res.content;
          }
        },
        false
      );
    },
  },
};
</script>

<style lang="less" scoped>
// 公告
.csCon {
  box-sizing: border-box;  
  overflow: hidden;
  position: relative;
  height: 52upx;
  padding: 0 17upx;
  display: flex;
  background: transparent;
  align-items: center;

  .title {
    position: absolute;
    left: 0;
    top: 0;
    color: #424242;
    font-size: 24upx;
    background: linear-gradient(90deg, #e0b74a, #fce760);
    padding: 0 12upx;
    border-radius: 10upx;
    z-index: 1;
  }
  .conGif {
    display: inline-block;
    vertical-align: middle;
    width: 34upx;
    height: 34upx;
    left: 5px;
    top: 2px;
    display: inline-block;
    vertical-align: middle;
    mask-image: url('@/static/image/indexImg/notice-icon.png');
    mask-size: contain;
    -webkit-mask-position: center;
    mask-position: center;
    mask-repeat: no-repeat;
    background-color: #666666;
  }

  .mailbox {
    width: 40upx;
    height: 40upx;
    background-image: url('@/static/image/indexImg/mailbox.png');
    background-size: contain;
    -webkit-background-position: center;
    background-position: center;
    background-repeat: no-repeat;
  }
  .gongList {
    font: 16px/30px normal;
  }
}
</style>
