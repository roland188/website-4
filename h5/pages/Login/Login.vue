<template>
  <view class="Login-layout">
    <view class="close" @click="goBack()" v-if="!['kubet','choibet','phattai68','jun88'].includes(projectImgUrl)"></view>
    <uni-nav-bar
      v-else
      :status-bar="true"
      :fixed="true"
      leftIcon="back"
      @clickLeft="goBack"
      background-color="#0f548b"
      color="#fff"
    >
    <image
        style="width: 220upx; height: 60upx; margin: 0 auto"
        :src="$config.platformLogo('logo')"
        mode="widthFix"
      ></image>
    </uni-nav-bar>
    <view class="languageImg_box">
      <view class="languageList" v-show="isShowLanguage">
        <view
          class="languageItem"
          v-for="item in languageList"
          :key="item.id"
          @tap="switchlanguage(item)"
        >
          <image
            class="languageImg"
            :src="$config.localImgUrl(item.img)"
          ></image>
          <view class="text_name">{{ item.name }}</view>
        </view>
      </view>
    </view>
    <view class="container">
      <image class="logo" v-if="!['kubet','choibet','phattai68','jun88'].includes(projectImgUrl)"
        :src="$config.platformLogo('logo')" mode="widthFix"></image>
      <view class="nav-box">
        <view
          class="item left"
          :class="{ active: navActive == 0 }"
          @click="navActive = 0"
          >{{ $t('会员登入') }}</view
        >
        <view
          class="item right"
          :class="{ active: navActive == 1 }"
          @click="navActive = 1"
          >{{ $t('注册账号') }}</view
        >
      </view>

      <login-comp v-if="navActive == 0" urlType="0"></login-comp>
      <register-comp v-if="navActive == 1" urlType="1"></register-comp>
    </view>
  </view>
</template>

<script>
import loginComp from "../../components/login-comp/login-comp";
import registerComp from "../../components/register-comp/register-comp";
import { setLang } from "@/i18n/index";
export default {
  data() {
    return {
      navActive: 0,
      isShowLanguage: false,
      lang: "",
      projectImgUrl: this.$config.projectImgUrl,
      languageList: [
		{ name: "vietnamese", img: "vi", id: 0 },
        { name: "Bahasa Indonesia", img: "id", id: 1 },
        { name: "中文", img: "zh_CN", id: 2 },
        { name: "English", img: "en", id: 3 },
      ],
    };
  },
  onLoad(options) {
    if (options.type) {
      this.navActive = options.type;
    }
  },
  onShow() {
    // #ifdef APP-PLUS
    this.lang = uni.getStorageSync("lang") || this.$config.locale || "id";
    // #endif
    // #ifdef H5
    this.lang = uni.getStorageSync("lang") || window.locale || "id";
    // #endif
  },
  methods: {
    //切换语言
    switchlanguage(item) {
      this.isShowLanguage = false;
      if(uni.getStorageSync("lang") === item.img) return;
      setLang(item.img);
      this.$store.commit("setState", { lang: item.img });
      this.lang = item.img;
    },
    goBack() {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 1];
      let prePath = pages[pages.length - 2];
      if(prevPage.route === 'pages/Login/Login'){
        uni.$emit('updateLoadData');
      }
      if (prePath.route === 'pages/vipLevel/vipLevel') {
        uni.navigateTo({
          url: "/pages/index/index",
        });
        return
      }
      uni.navigateBacks({
        delta: 1,
      });
    },
  },
  components: {
    loginComp,
    registerComp,
  },
};
</script>

<style lang="scss">
.Login-layout {
  width: 100%;
  min-height: 100%;
  background: var(--loginBg);
  position: relative;
  .close {
    position: absolute;
    z-index: 1;
    width: 34upx;
    height: 34upx;
    background: url("../../static/image/qqImg/close.png") no-repeat;
    background-size: cover;
    /* #ifdef  H5 */
    top: 40upx;
    right: 40upx;
    /* #endif */
    /* #ifdef  APP-PLUS */
    top: 90upx;
    right: 40upx;
    /* #endif */
  }

  .container {
    padding: 70upx 7% 20upx;
    // height: 100%;
    overflow: auto;

    .logo {
      display: block;
      margin: 0 auto 68upx;
      width: 400upx;
      height: 120upx;
    }

    .nav-box {
      display: flex;

      .item {
        flex: 1;
        height: 86upx;
        line-height: 40upx;
        color: #aaa;
        font-size: 30upx;
        text-align: center;
        text-decoration: none;
        color: #868686;
      }

      .active {
        color: var(--loginTab);
        position: relative;
        border-bottom: 2rpx solid var(--loginborderBg);
      }

      .active::after {
        background: url("../../static/image/qqImg/loginArrow.png") no-repeat;
        background-size: cover;
        position: absolute;
        bottom: -2upx;
        left: 50%;
        z-index: 1;
        width: 26upx;
        height: 22upx;
        content: var(--loginContent);
        margin: 0 auto;
      }
    }
  }
  .languageImg_box {
    position: absolute;
    width: 48upx;
    height: 48upx;
    padding: 0 0;
    z-index: 98;
    /* #ifdef  H5 */
    top: 40upx;
    left: 40upx;
    /* #endif */
    /* #ifdef  APP-PLUS */
    top: 90upx;
    left: 40upx;
    /* #endif */
    .languageImg {
      width: 48upx;
      height: 48upx;
    }
    .languageList {
      position: fixed;
      width: 250upx;
      padding: 20rpx;
      background-color: #2d2724;
      border-radius: 14rpx;
      /* #ifdef  H5 */
      top: 105upx;
      left: 40upx;
      /* #endif */
      /* #ifdef  APP-PLUS */
      top: 155upx;
      left: 40upx;
      /* #endif */
      z-index: 99;
      .languageItem {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        .text_name {
          width: 155upx;
          color: #fff;
          margin-left: 15upx;
        }
      }
    }
  }
}
</style>
