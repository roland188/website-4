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
          <image
            style="width: 260upx; height: 90upx; margin: 0 auto"
            :src="$config.platformLogo('logo')"
            mode="aspectFit"
          ></image>
          <text class="close">×</text>
        </view>
        <view class="time_text">{{ dataTime }}</view>
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
              @click="jumpJackpot"
          >
          <!-- CODE KHUYẾN MÃI -->
            {{ $t('兑换码') }}
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
            @click="goAgentPath('/pages/subCustomerService/subCustomerService', true)"
          >
            CSKH
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
      isMaskApp: true,
      dataTime: '',
      timeInerval: null,
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
    this.timeInerval = setInterval(()=>{
      this.dataTime = this.timeSwitch(new Date())
    },100)
  },
  destroy(){
    this.timeInerval = null
    clearInterval(this.timeInerval);
  },
  methods: {
    timeSwitch(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + ".";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + ".";
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var h, mm, ss;
        h = date.getHours();
        mm = date.getMinutes();
        ss = date.getSeconds();
        h = h < 10 ? "0" + h : h;
        mm = mm < 10 ? "0" + mm : mm;
        ss = ss < 10 ? "0" + ss : ss;
        var time = Y + M + D + " " + h + ":" + mm + ":" + ss;
        return time;
      }
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
    goAgentPath(url, isSwicth) {
      if(isSwicth) {
        uni.switchTab({
          url: url,
        });
        return
      }
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
    jumpJackpot (){
      uni.setStorageSync('jackpotPopup1', 1);
      this.openUrl('../../pages/jackpot/jackpot')
    },
  },

};
</script>

<style lang="scss">
.flex-box {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  bottom: 0;
  background: #fff;
  width: 360upx;

  .titleBox {
    background: #000;
    padding-bottom: 30px 20upx 20px;
  }

  .close {
    color: #ffffff;
    font-size: 80rpx;
    margin-left: 30rpx;
  }

  .listBox {
    height: 100%;
    background: #000;
  }
  .time_text{
    background-color: #000;
    color: #fff;
    text-align: center;
    font-size: 28rpx;
  }

  .item {
    color: #fff;
    font-size: 28rpx;
    line-height: 3;
    padding-left: 60rpx;
  }
}
</style>
