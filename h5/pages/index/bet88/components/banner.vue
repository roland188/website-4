<!-- 顶部banner -->
<template>
  <view class="banner-wrap">
    <swiper
      class="screen-swiper"
      :circular="true"
      :autoplay="true"
      :indicator-dots="true"
      @change="change"
      interval="5000"
      duration="500"
    >
      <swiper-item
        class="bannerSwiper"
        v-for="(item, index) in swiperData"
        :key="index"
        @click="bannerTransGo(item)"
      >
        <image
          :src="$config.getImgUrl(item.pictureApp)"
          mode="aspectFill"
        ></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      swiperData: [],
    };
  },
  mounted() {
    this.getBanner();
    uni.$on("update", () => {
      this.getBanner();
    });
  },
  beforeDestroy() {
    uni.$off("update");
  },
  methods: {
    // 获取轮播图
    getBanner() {
      this.$api.banners((err, res) => {
        if (err) {
        } else {
          this.swiperData = res;
        }
      }, false);
    },
    // 轮播图变化
    change(e) {
      this.current = e.detail.current;
    },
    // banner图跳转
    bannerTransGo(item) {
      const self = this
      //1:外链 2:公告 3:活动 4:游戏 5:专题活动
      if (item.type === 1) {
        if (item.url) {
          uni.navigateTo({
            url: "/pages/webViewQQ/webViewQQ?url=" + item.url,
          });
        }
      } else if (item.type === 2) {
        uni.navigateTo({
          url: "/pages/messageDetail/messageDetail?type=2&id=" + item.urlId,
        });
      } else if (item.type === 3) {
        if (item.urlId) {
          uni.navigateTo({
            url: "/pages/actDetail/actDetail?id=" + item.urlId,
          });
        }
      } else if (item.type === 4) {
        if (this.$api.isLogin() && item.bannerGame.id) {
          // this.goPlayGame(item.bannerGame);
          this.$emit("goPlayGame", item.bannerGame);
        } else {
          uni.showToast({
            title: self.$t("请先登录"),
            icon: "none",
          });
        }
      } else if (item.type === 5) {
        if (item?.expand?.actType == 3) {
          if (!this.$api.isLogin()) {
            uni.showModal({
              title: self.$t("未登录或者登录超时"),
              content: self.$t("请您登录，再进行操作！"),
              showCancel: true,
              cancelText: self.$t("取消"),
              confirmText: self.$t("确认"),
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
          this.$cache.set("activityItem", item);
          uni.navigateTo({
            url: "/pages/activity/activity",
          });
        } else {
          if (item.urlId) {
            uni.navigateTo({
              //专题
              url: "/pages/actDetail/actDetail?ByAppFlag=" + item.urlId,
            });
          }
        }
      } else if (item.type === 7) {
        if (item.url) {
          uni.navigateTo({
            url: item.url,
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.banner-wrap {
  width: 100%;
  height: 330upx;

  ::v-deep .screen-swiper {
    min-height: 330upx;
  }
}
</style>
