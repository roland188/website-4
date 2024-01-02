<template>
  <view>
    <web-view style="background-color: #fff" :webview-styles="webviewStyles" :src="url"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      webviewStyles: {
        progress: {
          color: "#cb3318",
        },
      },
      title: "",
    };
  },
  onLoad(option) {
    if (option) {
      if (option.url == "appurl") {
        this.url = this.$cache.get("seturl");
        return;
      }
      if (option.title) {
        // #ifdef APP-PLUS
        uni.setNavigationBarTitle({
          title: option.title,
        });
        // #endif
      }
      if (option.url == 5) {
        const winning_url = this.$server.getWinningUrl();
        this.url = winning_url;
        uni.setNavigationBarTitle({
          title: option.title,
        });
        return;
      }
      this.url = option.url;
      if (option.type * 1 === 1) {
        console.log("我是客服");
      }
      if (option.url == 1) {
        this.url = this.$cache.get("url");
      }
	  if(option.url === 'newServer24'){
		this.url = uni.getStorageSync('newServer24')
	  }
    }
  },
  methods: {
    BackPage() {
      uni.navigateBacks({});
    },
  },
};
</script>

<style></style>
