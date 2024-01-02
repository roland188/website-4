<!-- 小夫 -->
<template>
  <view style="background-color: #f5f6f8; height: 100%">
    <view class="page">
      <view class="amountInformation">
        <view style="border: 0">
          <text class="oneTitleColor8">{{ $t('当前语言') }}</text>
          <text class="flexRight">{{ data.language }}</text>
        </view>
        <view style="border: 0">
          <text class="oneTitleColor8">{{ $t('当前版本') }}</text>
          <text class="flexRight">v{{ $config.numVer }}</text>
        </view>
        <view @click="clearCache" v-if="isShow">
          <text class="oneTitleColor8">{{ $t('清除缓存') }}</text>
          <text class="flexRight">{{ data.cache }}</text>
          <!-- <i :style="{backgroundImage:'url('+$config.themeImgUrl('more')+')'}"></i> -->
        </view>
      </view>
    </view>
    <view class="exit gameListActive" @click="exit" v-show="exitShow">{{
      $t('退出登录')
    }}</view>
    <view class="yu-datetime-picker">
      <view
        class="yu-datetime-mask"
        :class="{ show: showPicker }"
        @tap="maskClick"
      ></view>
      <view
        class="yu-datetime-content cache-popup"
        :class="{ show: showPicker }"
      >
        <view class="yu-datetime-view cache-popup-content">
          <view class="title">{{ $t('确定清除缓存？') }}</view>
          <view class="remove" @tap="determineRemove">{{
            $t('确认')
          }}</view>
          <view @tap="maskClick">{{ $t('取消') }}</view>
        </view>
      </view>
    </view>
    <tips :msg="modalData" @childFn="onchildFn"></tips>
  </view>
</template>

<script>
import tips from "@/components/tips/tips.vue";
export default {
  components: {
    tips,
  },
  data() {
    return {
      modalData: {
        isShow: false,
        types: 1, //类型是带标题的弹窗、
        content: this.$t('确认需要退出吗？'),
        showCancel: true, //显示取消按钮
        cancelText: this.$t('取消'),
        confirmText: this.$t('确认'),
        success: 200, //100为取消  200为确定
      },
      isShow: false,
      showPicker: false,
      exitShow: false,
      numVer: "",
      data: {
        language: this.$t('简体中文'),
        cache: "",
        update: this.$t('检测新版本'),
        version: "",
      },
    };
  },
  onReady() {
    uni.setNavigationBarTitle({
      title: this.$t("设置"),
    });
  },
  onShow() {
    if (!this.$api.isLogin()) {
      this.exitShow = false;
    } else {
      this.exitShow = true;
    }
    // #ifdef APP-PLUS
    this.formatSize();
    this.isShow = true;
    // #endif
  },

  methods: {
    //获取缓存
    // #ifdef APP-PLUS
    formatSize() {
      let self = this;
      plus.cache.calculate((size) => {
        //size是多少个字节单位是b
        if (size < 1024) {
          self.data.cache = `${size}.00B`;
        } else if (size / 1024 >= 1 && size / 1024 / 1024 < 1) {
          self.data.cache = `${Math.floor((size / 1024) * 100) / 100}KB`;
        } else if (size / 1024 / 1024 >= 1) {
          self.data.cache = `${Math.floor((size / 1024 / 1024) * 100) / 100}MB`;
        }
      });
    },
    // 清除缓存
    determineRemove() {
      plus.cache.clear(() => {
        uni.showToast({
          title: this.$t('缓存清理完成'),
          duration: 2000,
        });
        this.formatSize(); // 重新计算缓存
      });

      this.showPicker = false;
    },
    // #endif
    maskClick() {
      //遮罩
      this.showPicker = false;
    },
    hide() {
      //隐藏
      this.showPicker = false;
    },
    clearCache() {
      this.showPicker = true;
    },
    exit() {
      this.modalData.isShow = true;
    },
    onchildFn(e) {
      // #ifdef  H5
      // 新版
      maskAppToNative("loginout");
      //老版
      maskAppOldToNative("loginout");
      // #endif
      if (e === 200) {
        this.$api.logout((err, res) => {
          this.$server.clearToken();
          uni.navigateTo({
            url: "../Login/Login",
          });
        }, true);
      } else {
        this.modalData.isShow = false;
      }
    },
  },
};
</script>
<style scoped>
@import url("./setting.css");
@import url("../../components/yu-datetime-picker/yu-datetime-picker.css");

.cache-popup {
  height: 286rpx;
}

.cache-popup-content {
  background-color: #ffffff;
  border-radius: 12rpx 12rpx 0 0;
}

.cache-popup-content view {
  text-align: center;
  height: 108rpx;
  line-height: 108rpx;
  font-size: 14px;
  color: #484440;
  border-top: 2rpx solid var(--separator);
  font-family: PingFang SC;
  font-weight: 500;
  color: var(--textOne);
}

.cache-popup-content .title {
  font-size: 14px;
  height: 72rpx;
  line-height: 72rpx;
  border: 0;
}

.cache-popup-content .remove {
  color: var(--themeBtn);
}
</style>
