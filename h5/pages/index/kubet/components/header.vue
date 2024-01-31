<!-- 顶部下载 -->
<template>
  <view class="home_header" 
      :class="showTop ? 'fixedShow' : 'fixedHide'">
    <image :src="$config.platformLogo('logo')"  mode="aspectFit"></image>

    <view class="right" v-if="!islogin">
      <view class="register" @click="toPage('../Login/Login?type=1')">
        {{ $t("注册") }}
      </view>
      <view class="login" @click="toPage('../Login/Login?type=0')">
        {{ $t("登录") }}
      </view>
    </view>
    <view class="user" v-if="islogin">
      <view class="username">
        {{ this.$cache.get("set_user").username }}
      </view>
      <view class="userMoney" @click="openMoney">
        <text class="currency">{{ $config.currency }} </text> {{ userMoney }}
      </view>
      <image
        @click="toPage('../Message/Message')"
        :class="unreadCount > 0 ? 'unActive' : ''"
        src="@/static/image/indexImg/btn_inforMail.svg"></image>
    </view>
    <uni-popup ref="moneyPopup" type="top" class="moneyPopup">
      <view class="money_content">
      <view class="money_item">
        <view class="money_list" 
          v-for="(item, index) in gameList"
          :key="index">
          <view class="name">{{ item.vendorName }}</view>
          <view class="num">{{ item.totalMoney.toFixed(2) }}</view>
        </view>
      </view>
      <view class="money_bottom">
        <view class="money_list">
          <view class="name t_yellow">{{ $t('全部') }}</view>
          <view class="num t_yellow">{{ '1' }}</view>
        </view>
        <view class="money_list">
          <view class="name t_purple">{{ $t('免费礼品') }}</view>
          <view class="num t_purple">{{ '1' }}</view>
        </view>
        <view class="btn" @click="onekey">{{ $t('全部转入主账户') }}</view>
      </view>
    </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  props:['showTop'],
  data() {
    return {
      islogin: "",
      userMoney: '0.00',
      gameList: [],
      unreadCount: 0,
      isMoney: true, //false可以点击归集    true不可以点击归集
    };
  },
  created() {
    this.islogin = this.$api.isLogin()
    if (this.islogin && this.$cache.get("set_user")) {
      this.username = this.$cache.get("set_user").username;
      this.getMessages()
      if (this.$server.getUserBalance()) {
        let res = this.$server.getUserBalance();
        this.userMoney = this.$common.setNumFixed(res.totalBalance, 2);
        this.gameList = res.totalBalanceDetail;
      } else {
        this.getMoneyGame();
      }
    }
  },
  methods: {
    closeTop() {
      this.$emit("closeDownload");
    },
    openMoney(){
      this.$refs.moneyPopup.open()
    },
    toPage(name, isLoginIntercept) {
      // isLoginIntercept  是否登录拦截   1是
      if (!isLoginIntercept) {
        //登录、注册
        uni.navigateTo({
          url: name,
        });
      } else {
        //登录拦截
        if (!this.islogin) {
          uni.navigateTo({
            url: "../Login/Login",
          });
        } else {
          uni.navigateTo({
            url: name,
          });
        }
      }
    },
    //一键归集
    onekey() {
      if (this.isbutOne) {
        this.textGui = true;
        uni.showLoading({
          title: this.$t("归集中！"),
        });
        this.guiGetOneMerge();
      } else {
        uni.showToast({
          title: this.$t("点击间隔10s，请勿重复操作！"),
          icon: "none",
        });
        setTimeout(function () {
          this.isbutOne = true;
        }, 10000);
      }
    },
    //一键归集
    guiGetOneMerge(type) {
      var data = {
        clientId: cache.get("set_user").tenant_id, //tenant_id
        clientIp: "101.231.217.194",
        memberId: cache.get("set_user").user_id, //userid
        username: cache.get("set_user").username,
      };
      this.$api.getOneMerge(data, (err, res) => {
        uni.hideLoading();
        this.isbutOne = false;
        if (res) {
          uni.showToast({
            title: this.$t("归集成功！"),
            duration: 3000,
            position: "center",
            icon: "none",
          });
          this.getMoneyGame();
        } else {
          uni.showToast({
            title: this.$t("归集失败，请重新尝试！"),
            duration: 3000,
            position: "center",
            icon: "none",
          });
        }
      });
    },
    // 获取站内信列表
    getMessages () {
      this.$api.message(1, 100, 0, (err, res) => {
        if (err) return
        this.unreadCount = res.unreadCount
      },false)
    },
    //游戏厂商余额
    getMoneyGame(type) {
      this.refreshimg = true;
      this.$api.getGameBalance(
        this.option,
        (err, res) => {
          this.refreshimg = false;
          this.isMoney = false;
          this.shuaFlag = false;
          if (err) {
            if (type == 1) {
              uni.showToast({
                title: err.msg,
                icon: "none",
              });
            }
          } else {
            this.$server.setUserBalance(res);
            this.userMoney = res.totalBalance.toFixed(2);
            this.gameList = res.totalBalanceDetail;

            if (type == 1) {
              uni.showToast({
                title: this.$t("刷新余额成功"),
                duration: 3000,
                position: "center",
                icon: "none",
              });
            }
          }
        },
        false
      );
    },
  },
};
</script>

<style lang="less" scoped>
.home_header {
  width: 100%;
  height: 80upx;
  background: #fff;
  z-index: 9999 !important;
  display: flex;
  justify-content: space-between;
  /* #ifdef  H5 */
  &.fixedShow {
    position: relative;
    margin-top: 80upx;
  }
  /* #endif */

  /* #ifdef  H5 */
  &.fixedHide {
    position: relative;
    margin-top: 0px;
    transition: 0.3s;
  }
  /* #endif */
  uni-image{
    width: 200upx;
    height: 100%;
  }
  .right{
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .login {
      color: #fff;
      padding: 4rpx 20rpx 4rpx 50rpx;
      text-align: center;
      border-radius: 20px;
      display: inline-block;
      margin-right: 15rpx;
      margin-left: 20rpx;
      background: url(@/static/image/indexImg/btn_login.svg) no-repeat 10upx center/30upx #399fda;
    }

    .register {
      color: #fff;
      background: #fff;
      padding: 4rpx 20rpx 4rpx 50rpx;
      text-align: center;
      border-radius: 20px;
      display: inline-block;
      background: url(@/static/image/indexImg/btn_join.svg) no-repeat 10upx center/30upx #ffa84d;
    }
  }
  .user{
    display: flex;
    justify-content: center;
    align-items: center;
    .username{
      font-size: 30rpx;
      color: #8695b9;
      margin-right: 14rpx;
    }
    .userMoney{
      font-weight: 600;
      font-size: 34rpx;
      color: #535867;
      padding-right: 30rpx;
      margin-right: 10rpx;
      background: url(@/static/image/indexImg/icon_arrowGray.svg) no-repeat right center/20upx;
      .currency{
        display: inline-block;
        font-size: 34rpx;
      }
    }
    uni-image{
      margin-left: 10rpx;
      width: 40rpx;
      height: 40rpx;
    }
    .unActive{
      position: relative;
      &::after{
        content: "";
        position: absolute;
        top: 0;
        right: 6rpx;
        width: 12rpx;
        height: 12rpx;
        display: block;
        border-radius: 10rpx;
        background-color: #ff0000;
      }
    }
  }
}
::v-deep{
  .moneyPopup{
  .uni-transition{
    background-color: transparent !important;
    .money_content{
      position: absolute;
      top: 80rpx;
      right: 0;
      width: 80%;
      padding: 10rpx 0 0;
      background-color: #49484b;
      border-radius: 20rpx;
      overflow: hidden;
      &::after{
        content: "";
        border-style: solid;
        border-width: 0 6px 6px 6px;
        border-color: transparent transparent #49484b transparent;
        position: fixed;
        right: 70rpx;
        top: 40px;
      }
    }
    .money_item{
      max-height: 800rpx;
      overflow-y: auto;
      padding: 0 20rpx;
    }
    .money_bottom{
      padding: 0 20rpx 20rpx;
      background-color: #272727;
    }
    .btn{
      color: #fff;
      width: 90%; 
      margin: 20rpx auto 0;
      background-color: #ffa406;
      border-radius: 50rpx;
      line-height: 72rpx;
      height: auto;
      cursor: pointer;
      text-align: center;
    }
    .t_yellow {
      color: yellow !important;
    }
    .t_purple {
      color: rgb(203, 131, 255) !important;
    }
    .money_list{
      display: flex;
      align-items: center;
      text-align: left;
      justify-content: flex-start;
      border-bottom: 2rpx solid #59585b;
      .name{
        width: 40%;
        line-height: 90rpx;
        font-size: 26rpx;
        color: #fff;
      }
      .num{
        line-height: 90rpx;
        flex: 1;
        color: #91ff6d;
        font-size: 28rpx;
        padding-left: 20rpx;
        position: relative;
        &::before{
          content: '';
          position: absolute;
          border-right: 1px solid #59585b;
          top: 0;
          bottom: 0;
          left: 0;
          height: 35%;
          margin: auto;
        }
      }
    }
  }
}
}
</style>
