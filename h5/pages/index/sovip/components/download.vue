<!-- 顶部下载 -->
<template>
  <view
    class="fixedCon"
    v-show="showTop"
  >
    <image
      class="close"
      @click="closeTop()"
      src="@/static/image/mb/close-icon.png"
      mode="aspectFit"
    ></image>
    <view class="con">
      <view class="title1" v-if="this.$config.clientCode == 'amjs'"
        >{{ $t("掌上APP 千款游戏 随时随地 想玩就玩") }}
      </view>
      <view class="title1" v-else>{{ $t("千款游戏 随时随地 想玩就玩") }} </view>
    </view>
    <view class="btn" @click="dowApp()">
      <!-- <image
        src="@/static/image/mb/bm_img_d1.png"
        style="width: 68px; height: 22px"
        mode="aspectFit"
      ></image> -->
      
      <span>{{ $t("下载APP") }}</span>
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
		// this.showTop = window.isMaskApp ? false : true
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
      inviteCode = uni.getStorageSync("inviteCode")
      // #ifdef H5
      inviteCode = JSON.parse(sessionStorage.getItem("inviteCode"));
      // #endif
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
  height: 69upx;
  margin-top: 52px;
  background: rgba(51,51,51,.9);
  position: fixed;
  top: 0;
  z-index: 99 !important;
  display: flex;
  justify-content: center;
  padding: 0 17upx;  
  align-items: center;

  .close {
    width: 27upx;
    height: 27upx;
  }

  .con {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;

    .title1 {
      font-size: 24upx;
      color: #e4e4e4;
    }
  }

  .btn {
    height: 45upx;
    line-height: 45upx;
    text-align: center;
    font-size: 21upx;
    text-transform: uppercase;
    color: white;
    border-radius: 8upx;
    padding: 0 5upx;
    border: 1px solid white;
  }

  .tutorial {
    margin-top: 20upx;
  }
}


@media screen and (min-width: 560px) {
  .fixedCon {
    width: 750upx;
    max-width: 750upx;
  }
}
</style>
