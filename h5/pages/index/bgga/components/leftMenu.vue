<template>
  <view>
    <!-- 侧边栏 -->
    <chunLei-modal
      type="left"
      v-model="isShow"
      :maskEnable="true"
      :tabbarHeight="50"
      :navHeight="0"
  
    >
      <view class="flex-box">
        <view class="titleBox">
          <image
            style="width: 260upx; height: 90upx; margin: 0 auto"
            :src="$config.platformLogo('logo')"
            mode="aspectFit"
          ></image>
          <text class="close" @click="cancel">×</text>
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
            @click="toPreferen('../preferential/preferential')"
          >
          {{$t('彩金')}}
          </view>
          <view
            class="item"
            @click="
              openUrl('../../pages/returnWaterRecords/returnWaterRecords?id=5')
            "
          >
          {{$t('我的分红')}}
            
          </view>
          <view class="item" @click="openUrl('../../pages/recharge/recharge')">
            {{$t('充值')}}
            
          </view>
          <view class="item" @click="openUrl('../../pages/account/account')">
            {{$t('取款')}}
            
          </view>
          <view class="item" @click="goAgentPath('/pages/agent/agent')">
            {{$t('代理')}}
            
          </view>
          <!-- #ifdef H5 -->
          <view class="item" @click="dowApp()" v-if="isMaskApp">{{$t('下载app地址')}}</view>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <view class="item" @click="update()">
            {{$t('现在版本')}} {{ version }}
          </view>
          <!-- #endif -->
          <!-- <view
            class="item"
            @click="goAgentPath('/pages/customerService/customerService', true)"
          >
          {{$t('在线客服')}}
          
          </view> -->
          <view class="item language-warp" @click="openLang">
            
            {{$t('语言')}}
		      	<image class="chooseIcon" src="@/static/image/morelang.svg" mode=""></image>
            <view class="languageList" v-show="isShowLanguage">
            <view
              class="languageItem"
              v-for="item in languageList"
              :key="item.id"
              @tap="switchlanguage(item)"
            >
              <view class="text_name">{{ item.name }}</view>
            </view>
          </view>
          </view>
        </view>
      </view>
    </chunLei-modal>
  </view>
</template>

<script>
import { setLang } from "@/lang";
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
      lang: "",
      isShowLanguage:false,
      languageList: [
        { name: "Português", img: "pt", id: 1 },
        { name: "English", img: "en", id: 2 },
      ],
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
    openLang(){
      this.isShow = true
      this.isShowLanguage = !this.isShowLanguage
    },
        //切换语言
     switchlanguage(item) {
      if(uni.getStorageSync("lang") === item.img) return;
      setLang(item.img);
      this.$store.commit("setState", { lang: item.img });
      this.lang = item.img;
      uni.reLaunch({
        url: "/pages/index/index",
      });
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
      this.isShow = false;
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
      this.isShow = false;
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
  .language-warp{
    position: relative;
	.chooseIcon{
		width: 26upx;
		height: 26upx;
		margin-left:20upx;
		padding-top: 10upx;
	}
    .languageList {
      position: absolute;
      width: 250upx;
      padding: 20rpx;
      background-color: #1a222f;
      border-radius: 14rpx;

      // top:60upx;
      // left: 52upx;
      z-index: 99;
      .languageItem {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        .text_name {
          width: 155upx;
          color: #fff;
          margin-left: 15upx;
        }
      }
    }
  }
}
</style>
