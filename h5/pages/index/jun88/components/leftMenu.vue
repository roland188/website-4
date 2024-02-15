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
            :src="$config.platformLogo('logo1')"
            mode="aspectFit"
          ></image>
          <text class="close">×</text>
        </view>
        <view class="time_text">{{ date }} {{ time }}</view>
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
      date: '',
      time: '',
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
    this.getTime()
  },
  destroy(){
    this.timeInerval = null
    clearInterval(this.timeInerval);
  },
  methods: {
      getTime () {
        this.interval = setInterval(() => {
            var bjTime = this.getBjTime();
            this.date = this.$common._formatDate(bjTime, 'yyyy-MM-dd')
            this.time = this.$common._formatDate(bjTime, 'HH:mm:ss')
        }, 500)
      },
      getBjTime() {
        //获得当前运行环境时间
        var d = new Date(), currentDate = new Date(), tmpHours = currentDate.getHours();
        //算得时区
        var time_zone = -d.getTimezoneOffset() / 60;
        //少于0的是西区 西区应该用时区绝对值加京八区 重新设置时间（西区时间比东区时间早 所以加时区间隔）
        if (time_zone < 0) {
        time_zone = Math.abs(time_zone) + 7; currentDate.setHours(tmpHours + time_zone);
        } else {
        //大于0的是东区  东区时间直接跟京八区相减
        time_zone -= 7; currentDate.setHours(tmpHours - time_zone);
        }
        return currentDate;
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
  /* #ifdef H5 */
  top: 0;
  /* #endif */
  /* #ifdef APP-PLUS */
  top: var(--status-bar-height);
  /* #endif */
  height: 100%;
  bottom: 0;
  background: #fff;
  width: 360upx;

  .titleBox {
    background: #fff;
    padding-bottom: 30px 20upx 20px;
  }

  .close {
    color: #ffffff;
    font-size: 80rpx;
    margin-left: 30rpx;
  }

  .listBox {
    height: 100%;
    background: #fff;
  }
  .time_text{
    background-color: #fff;
    color: #000;
    text-align: center;
    font-size: 28rpx;
  }

  .item {
    color: #000;
    font-size: 28rpx;
    line-height: 3;
    padding-left: 60rpx;
  }
}
</style>
