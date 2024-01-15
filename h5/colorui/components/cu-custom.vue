<template>
  <view>
    <view class="cu-custom" :style="[{ height: CustomBar + 'px' }]" style="background-color: #ffffff; z-index: 99; font-size: 18px">
      <view class="cu-bar fixed" :style="style" :class="[bgImage != '' ? 'none-bg text-white bg-img' : '', bgColor]">
        <view class="action" @tap="BackPage" v-if="isBack">
          <uni-icons :color="''" :type="'back'" size="24" :style="{ fontWeight: 'bold' }" />
        </view>
        <view class="content" :style="[{ top: StatusBar + 'px' }]"><slot name="content"></slot></view>
        <view class="right" @tap="right" style="margin-right: 34rpx"><slot name="right"></slot></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
    };
  },
  name: "cu-custom",
  computed: {
    style() {
      var StatusBar = this.StatusBar;
      var CustomBar = this.CustomBar;
      var bgImage = this.bgImage;
      var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
      if (this.bgImage) {
        style = `${style}background-image:url(${bgImage});`;
      }
      return style;
    },
  },
  props: {
    textColor: "",
    bgColor: {
      type: String,
      default: "",
    },
    isBack: {
      type: [Boolean, String],
      default: false,
    },
    bgImage: {
      type: String,
      default: "",
    },
    leftUrl: {
      type: String,
      default: "",
    },
    rightId: {
      type: String,
      default: "",
    },
    tabbarId: {
      type: String,
      default: "",
    },
    routerType: {
      type: Number,
    },
    urlCode: {
      type: String,
      default: "",
    },
  },
  methods: {
    BackPage() {
      if (this.leftUrl === "hidden") {
        this.$emit("show", false);
      } else {
        if (this.routerType) {
          if (this.routerType == 1) {
            //1首页 ，2搜索，3游戏列表，4活动，5公告
            uni.navigateTo({
              url: this.leftUrl,
            });
          } else {
            uni.redirectTo({
              url: this.leftUrl,
            });
          }
        } else {
          //修改页面刷新后不能反回问题
          //#ifdef H5
          window.history.go(-1);
          //#endif
          //#ifdef APP-PLUS
          uni.navigateBacks({
            delta: 1,
          });
          //#endif
        }
      }

      // if(this.tabbarId === '0'){
      // 	uni.navigateTo({
      // 		url: this.leftUrl
      // 	});
      // }else{
      // 	uni.redirectTo({
      // 		url: this.leftUrl
      // 	});
      // }
    },
    right() {
      this.$emit("show", true);
      this.$emit("distinguish", this.rightId);
      // uni.navigateTo({
      // 	url: this.right
      // });
    },
  },
};
</script>

<style lang="scss">
.cu-bar {
  border-bottom: 1px solid #f7f7f7;
  background: var(--themeActTopBg);
  color: var(--themeActTitleBg);
  height: 50px;
  .action{
    color: var(--themeActTitleBg);
  }
}
.bankHeaderLeft {
  width: 44upx;
  height: 44upx;
}
.barOne {
  color: #ffffff !important;
}
.barTwo {
  color: #000000 !important;
}
</style>
