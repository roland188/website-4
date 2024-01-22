<!-- 顶部导航 -->
<template>
  <view>
    <uni-nav-bar
      title=""
      :status-bar="true"
      :fixed="true"     
      background-color="#FFF"
      color="#e3e3e3"      
      :shadow="false"
      @clickLeft="onLeft" 
      :class="showTop ? 'fixedShow' : 'fixedHide'"
    >
      <image
        style="height: 60upx; margin: auto 0"
        :src="$config.platformLogo('logo')"
        mode="aspectFit"
      ></image>
      <view slot="right" class="right-nav">
        <!-- <image
          v-if="lang"
          class="languageImg"
          @tap="localeChange"
          :src="$config.localImgUrl(lang)"
        ></image> -->
        <view class="right-nav-search">
          <image class="languageImg" @tap="toPage('../Message/Message')" :src="'../../static/image/indexImg/nav-search.png'" mode="aspectFit"></image>
          <span>{{$t('查询')}}</span>
        </view>
        <view class="right-nav-music">
          <image class="languageImg" @tap="toPage('../Message/Message')" :src="'../../static/image/indexImg/nav-music.png'" mode="aspectFit"></image>
          <span>{{$t('音乐')}}</span>
        </view>
      </view>
    </uni-nav-bar>
    <view
      class="languageList"
      :class="showTop ? 'fixedShow' : 'fixedHide'"
      v-show="isShowLanguage"
    >
      <view
        class="languageItem"
        v-for="item in languageList"
        :key="item.id"
        @tap="switchlanguage(item)"
      >
        <image class="languageImg" :src="$config.localImgUrl(item.img)"></image>
        <view class="text_name">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { setLang } from "@/i18n/index";
import cache from "@/utils/cache.js";
export default {
  props: {
    showTop: true,
    langType: {
      type: String,
      default: "vi",
    },
  },
  data() {
    return {
      isShowLanguage: false,
      lang: "",
      languageList: [
		{ name: "vietnamese", img: "vi", id: 0 },
        { name: "Bahasa Indonesia", img: "id", id: 1 },
        { name: "中文", img: "zh_CN", id: 2 },
        { name: "English", img: "en", id: 3 },
      ],
    };
  },
  mounted() {
    this.lang = this.langType;
  },
  methods: {
    //切换语言
    switchlanguage(item) {
      this.isShowLanguage = false;
      // uni.setLang(item.img);
      setLang(item.img);
      this.$store.commit("setState", { lang: item.img });
      this.lang = item.img;
      this.$emit("updateLoadData");
    },
    toPage(name) {
      if (!this.$api.isLogin()) {
        uni.navigateTo({
          url: "../Login/Login",
        });
      } else {
        uni.navigateTo({
          url: name,
        });
      }
    },
    // 登出
    localeChange() {
      // this.$api.logout();
      // uni.clearStorageSync();
      this.isShowLanguage = !this.isShowLanguage;
    },
    onLeft() {
      this.$emit("onLeft");
    },
  },
};
</script>

<style lang="scss" scoped>
/* #ifdef  H5 */
.fixedShow {
  position: relative;
  margin-top: 80upx;
}
/* #endif */

/* #ifdef  H5 */
.fixedHide {
  position: relative;
  margin-top: 0px;
  transition: 0.3s;
}
/* #endif */
.right-nav {
  display: flex;  
  align-items: center;
  height: 100%;  
  margin-right: 40upx;
}
.right-nav-search {
  line-height: 1;
  display: flex;
  flex-direction: column;
  color: #666666;
  margin-right: 10upx;
  image {
    width: 44upx;
    height: 44upx;
  }
  span {
    height: 38upx;
    line-height: 38upx;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 22upx;
  }
}
.right-nav-music {
  line-height: 1;
  display: flex;
  flex-direction: column;
  color: #666666;
  padding-left: 40upx;
  image {
    width: 44upx;
    height: 44upx;
  }
  span {
    height: 38upx;
    line-height: 38upx;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 22upx;
  }
}

.languageList {
  position: fixed;
  right: 10upx;
  /* #ifdef APP-PLUS */
  top: 128upx;
  /* #endif */
  /* #ifdef H5 */
  top: 88upx;
  /* #endif */
  width: 250upx;
  padding: 20rpx;
  background-color: #2d2724;
  border-radius: 14rpx;
  z-index: 999;
  .languageItem {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    .languageImg {
      width: 48upx;
      height: 48upx;
    }
    .text_name {
      width: 155upx;
      color: #fff;
      margin-left: 15upx;
    }
  }
}
</style>