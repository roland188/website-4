<template>
  <view class="maintainBox">
    <view class="maintainCon">
      <image
        class="mainCode"
        src="../../static/image/maintain.png"
        mode="widthFix"
      ></image>
      <view class="mainTitle"> {{ $t('平台进行升级工作，给您带来的不便深表歉意') }} </view>
      <view class="mainTime">
        <text>{{ $t('预计开启时间：') }}{{ maintianTime }}</text>
      </view>

      <image
        @click="customerUrlWeb()"
        v-show="customerUrl"
        class="btn"
        src="../../static/image/k.png"
        mode="widthFix"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      maintianTime: "",
      customerUrl: "",
    };
  },
  onLoad() {
    this.maintianTime = this.$config.maintianTime;
    this.getCustomer();
  },
  methods: {
    getCustomer() {
      let self = this;
      let mainCustomer = self.$config.maintainUrl;
      console.log(mainCustomer);
      let clientCode = "";
      let clientItem = "";
      let url = "";
      // #ifdef  APP-PLUS
      clientCode = self.$config.clientCode;
      clientItem = self.$config.childCode;
      mainCustomer = self.$config.maintainUrl;
      url = this.$config.maintainUrl;
      // #endif
      // #ifdef  H5
      clientCode = window.clientCode;
      clientItem = window.childCode;
      mainCustomer = window.maintainUrl;
      url = "/clientMaintain/getClientMaintain";
      // #endif
      console.log("1", url);
      uni.request({
        url: url,
        method: "POST",
        header: {
          clientCode: clientCode,
          clientItem: clientItem,
        },
        complete: (res) => {
          let statusCode = res.statusCode;
          self.maintianTime = res.data.data.endTime;
          self.customerUrl = res.data.data.customerUrl;
          if (statusCode * 1 === 200) {
            if (res.data.data.status === 0) {
              //1维护  0不维护
              uni.setStorageSync("setStatusIndexFunc", 0);
              uni.reLaunch({
                url: "/pages/index/index",
              });
            } else {
            }
          } else {
          }

          setTimeout(function () {
            uni.stopPullDownRefresh();
          }, 1000);
        },
      });
    },
    customerUrlWeb() {
      uni.navigateTo({
        url: "../webView/webView?url=" + this.customerUrl,
      });
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
</style>
