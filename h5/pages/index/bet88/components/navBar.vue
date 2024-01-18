<!-- 顶部导航 -->
<template>
  <view>
    <uni-nav-bar
      title=""
      :status-bar="true"
      :fixed="true"
      background-color="#0f0f0f"
      color="#f9dc75"
      :shadow="false"
      left-icon="bars"
      @clickLeft="onLeft"
      :class="showTop ? 'fixedShow' : 'fixedHide'"
    >
      <image
        style="width: 260upx; height: 90upx; margin: 0 auto"
        :src="$config.platformLogo('logo')"
        mode="aspectFit"
      ></image>
      <view slot="right" v-if="langList.lenght > 0" class="languageImg_box" @tap="handleLangTap">
        <image
          class="languageImg"
          src="@/static/image/lang/lang.png"
        ></image>
        <text>{{ langShortLabel }}</text>
      </view>
    </uni-nav-bar>
    <!-- <uni-popup ref="popup_lang" type="bottom" style="z-index: 9999;">
			<view class="popup_lang_b">
        <view class="title_lang">
          <text>Choose a language</text>
          <image src="@/static/image/lang/close.png" class="close_l" @tap.stop="handleLangClose"></image>
        </view>
        <view class="lang_list">
          <view v-for="(item, i) in langList" :key="i" class="lang_item" :class="{act: langObj[item.languageCode] === selLangVal}" @tap="handleLangSelect(item)">
            <image :src="$config.getImgUrl(item.countryFlag)" class="lang_i"></image>
            <text class="label">{{ item.languageName }}</text>
            <text class="label2">{{ item.languageAbbr }}</text>
          </view>
        </view>
			</view>
		</uni-popup> -->
  </view>
</template>

<script>
import { setLang, langObj } from "@/lang";
import cache from "@/utils/cache.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue"
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
      langList: [
        { label: 'Trang chủ', shortLabel: 'TC', value: 'vi', icon: 'vi' },
        { label: 'English', shortLabel: 'EN', value: 'en', icon: 'en' },
        { label: '中文-简体', shortLabel: '简', value: 'zh_CN', icon: 'zh_cn' },
        // { label: '中文-繁体', shortLabel: '繁', value: 'zh_TW', icon: 'zh_tw' },
      ],
      langObj,
      selLangVal: '',
    };
  },
  components: {
    uniPopup
  },
  mounted() {
    this.getLang()
    this.getLangList()
  },
  computed: {
    langShortLabel() {
      const obj = this.langList.find(o => langObj[o.languageCode] === this.selLangVal) || {}
      return obj.languageAbbr
    }
  },
  methods: {
    getLangList() {
      this.$api.getLangList((err, res) => {
        if (res) {
          this.langList = res
        }
      })
    },
    getLang() {
      this.selLangVal = this.$i18n.locale
    },
    handleLangClose() {
      this.$refs.popup_lang.close()
    },
    handleLangSelect({ languageCode }) {
      languageCode = langObj[languageCode] || languageCode
      this.selLangVal = languageCode
      setLang(languageCode)
      this.$store.commit("setState", { lang: languageCode })
      this.$emit("updateLoadData")
      this.handleLangClose()
      uni.reLaunch({ url: "/pages/index/index" })
    },
    handleLangTap() {
      this.$refs.popup_lang.open()
    },
    //切换语言
    switchlanguage(item) {
      this.isShowLanguage = false;
      // uni.setLang(item.img);
      setLang(item.img);
      this.$store.commit("setState", { lang: item.img });
      this.lang = item.img;
      this.$emit("updateLoadData");
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

<style lang="less" scoped>
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
.languageImg_box {
  position: relative;
  padding: 16upx 6upx;
  display: flex;
  align-items: center;
  .languageImg {
    width: 30upx;
    height: 30upx;
    margin-right: 10upx;
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

.popup_lang_b {
  background-color: #0F0F0F;
  border-top: 1px solid #F1C650;
  border-top-left-radius: 30upx;
  border-top-right-radius: 30upx;
  padding: 0 40upx;
  .title_lang {
    padding-top: 26upx;
    text-align: center;
    color: #F1C650;
    font-size: 36upx;
    .close_l {
      width: 36upx;
      height: 36upx;
      float: right;
    }
    
  }
  .lang_list {
    padding: 40upx 0 50upx;
    .lang_item {
      text-align: center;
      padding: 20upx 10upx;
      color: #fff;
      .lang_i {
        width: 40upx;
        height: 40upx;
        margin-right: 30upx;
        vertical-align: middle;
      }
      .label {
        display: inline-block;
        width: 150upx;
        text-align: left;
      }
      .label2 {
        display: inline-block;
        text-align: left;
      }
      &.act {
        border-radius: 20upx;
        background-color: #F1C650;
      }
    }
  }
}
</style>