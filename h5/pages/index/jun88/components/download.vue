<!-- 顶部下载 -->
<template>
  <view
    class="fixedCon"
    v-show="showTop"
    style="
      width: 100%;
      height: 80upx;
      background: #fff;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 9;
    "
  >
    <image
      class="close"
      @click="closeTop()"
      src="@/static/image/mb/close_jun88.png"
      mode="aspectFit"
    ></image>
    <view class="con">
      <view class="title1" v-if="this.$config.clientCode == 'amjs'"
        >{{ $t("掌上APP 千款游戏 随时随地 想玩就玩") }}
      </view>
      <view class="title1" v-else>{{ $t("千款游戏 随时随地 想玩就玩") }} </view>
    </view>
    <view class="btn" @click="dowApp()">
      <image
        src="@/static/image/mb/btn_jun88.png"
        style="width: 68px; height: 22px"
        mode="aspectFit"
      ></image>
    </view>
    <view
      class="tutorial"
      @click="gotutorial"
      v-show="
        this.$config.clientCode === 'ylba' || this.$config.clientCode === 'xpja'
      "
    >
      <image
        src="@/static/image/mb/bm_img_d2.png"
        style="width: 68px; height: 22px"
        mode="aspectFit"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showTop: true,
      isIos: false,
      isAndroid: false
    };
  },
  created() {
    const u = navigator.userAgent
    this.isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1
    this.isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if ((this.isAndroid && !this.$config.androidDownloadUrl) || (this.isIos && !this.$config.iosDownloadUrl)) {
      this.closeTop()
    }
	  // #ifdef H5
		this.showTop = window.isMaskApp ? false : true
    this.setInviteCode()
	 // #endif
  },
  methods: {
    closeTop() {
      this.showTop = false;
      this.$emit("closeDownload");
    },
    // 下载APP
    setInviteCode() {
        let inviteCode = "";
        inviteCode = JSON.parse(sessionStorage.getItem("inviteCode"));
        if (inviteCode && inviteCode !='null' ) {
            this.getInviteCode(inviteCode)
            inviteCode  = String.fromCharCode(8203) + inviteCode + String.fromCharCode(8203)
            this.$copyText(inviteCode)
        }
    },
    // 请求绑定邀请码
    async getInviteCode(code){
        let params = {
            agentCode: code,
        }
        console.log(code,'code')
        await this.$api.bindAgentCode(params,(err,res) => {
            if(err){
                console.log(err.msg)
            }
        })
    },
    dowApp() {
        let u = navigator.userAgent;
        // #ifdef H5
        if(localStorage.getItem('fbPixelId') && window.fbq){
            fbq('trackCustom', 'h5-downApp')
        }
        // #endif
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
            //安卓手机
            if (this.$config.androidDownloadUrl) window.location.href = this.$config.androidDownloadUrl;
        }
        if (u.indexOf('iPhone') > -1) {
            //苹果手机
            if (this.$config.iosDownloadUrl) window.location.href = this.$config.iosDownloadUrl;

        }
    },
  },
};
</script>

<style lang="less" scoped>
.fixedCon {
  width: 100%;
  height: 100upx;
  background: #fff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999 !important;
  display: flex;
  justify-content: center;
  padding: 0 17upx;

  .close {
    width: 50upx;
    height: 50upx;
    margin-top: 18upx;
  }

  .con {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    margin-top: 20upx;

    .title1 {
      font-size: 26upx;
      color: #000;
    }
  }

  .btn {
    margin-top: 20upx;
    width: 128upx;
    height: 58upx;
    line-height: 58upx;
    text-align: center;
    font-size: 24upx;
    color: #444;
    border-radius: 8upx;
  }

  .tutorial {
    margin-top: 20upx;
  }
}
</style>
