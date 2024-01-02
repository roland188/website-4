<!-- 顶部下载 -->
<template>
  <view class="luckyBag">
    <view v-if="isShow" class="luckyBox">
      <image
        class="bag"
        @click="goLucky()"
        src="@/static/image/mb/lucky_bag.png"
        mode="aspectFit"
      ></image>
      <image
        class="close"
        @click="isShow = false"
        src="@/static/image/mb/lucky_close.png"
        mode="aspectFit"
      ></image>
    </view>
    <image
      v-else
      class="showBtn"
      @click="isShow = true"
      src="@/static/image/mb/lucky_open.png"
      mode="aspectFit"
    ></image>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
    };
  },
  methods: {
    goLucky() {
      const self = this
      if (!this.$api.isLogin()) {
        uni.showModal({
          title: self.$t('未登录或者登录超时'),
          content: self.$t('请您登录，再进行操作！'),
          showCancel: true,
          cancelText: self.$t('取消'),
          confirmText: self.$t('确认'),
          confirmColor: "#ee0a24",
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/Login/Login",
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
        return;
      }
      this.$cache.set("activityId", 6);
      this.$cache.set("activityUrl", "https://spring.306167.com/");
      uni.navigateTo({
        url: "/pages/activity/activity",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.luckyBag {
  position: fixed;
  max-width: 200upx;
  max-height: 200upx;
  right: 0;
  bottom: 20%;
  z-index: 99;
  .luckyBox {
    position: relative;
    .bag {
      width: 200upx;
      height: 200upx;
    }
    .close {
      width: 40upx;
      height: 40upx;
      position: absolute;
      top: -25upx;
      right: 20upx;
    }
  }
  .showBtn {
    width: 26upx;
    height: 98upx;
  }
}
</style>
