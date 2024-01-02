<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="url"></web-view>
  </view>
</template>

<script>
import cache from "../../utils/cache.js";
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: "#D6AE66",
        },
      },
      url: "",
    };
  },
  onLoad(options) {
    if (options.title) {
      uni.setNavigationBarTitle({
        title: options.title,
      });
    }

    if (options.url == 4) {
      const agent_url = this.$server.getAgentUrl();
      this.url = agent_url;
    } else if (options.url == 5) {
      this.url = this.$server.getWinningUrl();
    } else if (options.url) {
      this.url = options.url;
    }
    console.log("webViewQQ:options=", options, this.url);
    // if(options.url == "appurl"){
    // 	this.url = this.$cache.get("seturl").url;
    // 	console.log('连接',this.url)

    // }
  },
  methods: {},
};
</script>

<style></style>
