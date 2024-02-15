<template>
  <view>
    <!-- 侧边栏 -->
    <chunLei-modal
      type="left"
      v-model="isShow"
      :maskEnable="true"
      :tabbarHeight="50"
      :navHeight="0"
      @cancel="cancel"
    >
      <view class="flex-box">
        <view class="titleBox">
          <text class="close">×</text>
        </view>
        <view class="listBox">
          <view
            class="item"
            @click="menuLink"
            v-show="this.$config.clientCode == 'amjs'"
          >
            {{$t('网站导航')}}
          </view>
          <view
            class="item"
            @click="toPreferen('../preferential/preferential')"
          >
            {{ $t('优惠活动') }}
          </view>
          <view
            class="item"
            @click="
              openUrl('../../pages/returnWaterRecords/returnWaterRecords?id=5')
            "
          >
            {{ $t('我的返水') }}
          </view>
          <view class="item" @click="openUrl('../../pages/recharge/recharge')">
            {{ $t('快速存款') }}
          </view>
          <view class="item" @click="openUrl('../../pages/account/account')">
            {{ $t('线上取款') }}
          </view>
          <view class="item" @click="goAgentPath('/pages/agent/agent')">
            {{ $t('代理加盟') }}
          </view>
          <!-- #ifdef H5 -->
          <view class="item" @click="dowApp()" v-if="isMaskApp">
            {{ $t('APP下载地址') }}
           </view>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <view class="item" @click="update()">
            {{ $t('当前版本号') }}{{ version }}
          </view>
          <!-- #endif -->
          <view
            class="item"
            @click="toPreferen('../customerService/customerService')"
          >
            {{ $t("在线客服") }}
          </view>
        </view>
      </view>
    </chunLei-modal>
  </view>
</template>

<script>
import chunLeiModal from "@/components/chunLei-modal/chunLei-modal.vue";
export default {
  components: {
    chunLeiModal,
  },
  data() {
    return {
      isShow: false,
      version: "",
	  isMaskApp: true
    };
  },
  mounted() {
	// #ifdef H5
	  	this.isMaskApp = window.isMaskApp ? false : true
      this.setInviteCode()
	// #endif
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
      this.version = wgtinfo.version;
    });
    // #endif
  },
  methods: {
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
    update() {
      // #ifdef APP-PLUS
      this.isShow = false;
      this.$emit("Appupdate");
      // #endif
    },
    menuLink() {
      let href = "https://dh9001.me";
      // #ifdef APP-PLUS
      plus.runtime.openURL(href);
      // #endif
      // #ifdef H5
      window.open(href);
      // #endif
    },
    //跳转到优惠页面.代理页
    toPreferen(url) {
      uni.switchTab({
        url: url,
      });
    },
    // 跳转到代理页
    goAgentPath(url) {
      uni.navigateTo({
        url: url,
      });
    },
    openUrl(e) {
      if (!this.$api.isLogin()) {
        uni.navigateTo({
          url: "../Login/Login?type=0",
        });
      } else {
        uni.navigateTo({
          url: e,
        });
      }
    },
    cancel(e) {
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss">
.flex-box {
  position: absolute;
  left: 0;
  /* #ifdef H5 */
  top: 0;
  /* #endif */
  /* #ifdef APP-PLUS */
  top: var(--status-bar-height);
  /* #endif */
  height: 100%;
  bottom: 0;
  background: #fff;
  width: 70%;

  .titleBox {
    background: #333;
    padding-bottom: 30px;
    padding-top: 20px;
  }

  .close {
    color: #ffffff;
    font-size: 80rpx;
    margin-left: 30rpx;
  }

  .listBox {
    background: #ffffff;
  }

  .item {
    color: #868686;
    font-size: 28rpx;
    border-bottom: 1px solid #f3f3f3;
    line-height: 3;
    padding-left: 60rpx;
  }
}
</style>
