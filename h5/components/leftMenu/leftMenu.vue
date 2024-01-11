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
          Điều hướng Trang web
          </view>
          <view
            class="item"
            @click="toPreferen('../preferential/preferential')"
          >
            Khuyến mãi
          </view>
          <view
            class="item"
            @click="
              openUrl('../../pages/returnWaterRecords/returnWaterRecords?id=5')
            "
          >
            Hoa hồng của tôi
          </view>
          <view class="item" @click="openUrl('../../pages/recharge/recharge')">
            Nạp tiền nhanh
          </view>
          <view class="item" @click="openUrl('../../pages/account/account')">
            Rút tiền trực tuyến
          </view>
          <view class="item" @click="goAgentPath('/pages/agent/agent')">
            Đại lí
          </view>
          <!-- #ifdef H5 -->
          <view class="item" @click="dowApp()" v-if="isMaskApp">Địa chỉ tải xuống APP</view>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <view class="item" @click="update()">
            Số phiên bản hiện tại{{ version }}
          </view>
          <!-- #endif -->
          <view
            class="item"
            @click="goAgentPath('/pages/subCustomerService/subCustomerService', true)"
          >
            CSKH
          </view>
          
          <view
            class="item"
            @click="goAgentPath('/pages/index/index', true)"
          >
            Phiên bản PC
          </view>
        </view>
      </view>
    </chunLei-modal>
  </view>
</template>

<script>
import chunLeiModal from "../chunLei-modal/chunLei-modal.vue";
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
    dowApp() {
      // let self = this;
      // let getClientCode = self.$config.clientCode;
      // let theme = self.$config.theme;
      // let sessInviteCode = JSON.parse(sessionStorage.getItem("inviteCode"));
      // let code = sessInviteCode ? "/" + sessInviteCode : "";
      // let appDowDataUrl = self.$config.dowUrl + getClientCode + theme + code;
      // window.location.href = appDowDataUrl;
      let u = navigator.userAgent;
      if (
        (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) &&
        this.$config.androidDownloadUrl
      ) {
        window.location.href = this.$config.androidDownloadUrl;
      }
      if (
        !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) &&
        this.$config.iosDownloadUrl
      ) {
        window.location.href = this.$config.iosDownloadUrl;
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
      uni.navigateTo({
        url: url,
      });
    },
    // 跳转到代理页
    goAgentPath(url, isSwicth) {
      if(isSwicth) {
        uni.navigateTo({
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
