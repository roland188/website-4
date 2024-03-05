<template>
  <view>
    <view class="tabbar__content" v-if="projectImgUrl !== 'sovip'">
      <view
        class="tabar-item"
        v-for="tabbar in tabbarList"
        :key="tabbar.id"
        :data="$cache.get('activeUnread')"
        :data1="$cache.get('msgUnredCount')"
        :data2="login"
        @click="navigatorTo(tabbar)"
      >
        <view
          class="icon"
          v-if="current !== tabbar.id"
          :style="{
            background:
              'url(' +
              require('@/static/image/tabbar/' +
                projectImgUrl +
                '/' +
                tabbar.icon) +
              ') no-repeat center top/27px',
          }"
        >
        </view>
        <view class="yuan" v-if="current == tabbar.id">
          <view
            class="icon"
            :class="current == tabbar.id &&
              ['kubet','choibet','phattai68'].includes(projectImgUrl) &&
              tabbar.id != 2 && tabbar.id != 3 ? 'active' : ''"
            :style="{
              background:
                'url(' +
                require('@/static/image/tabbar/' +
                  projectImgUrl +
                  '/' +
                  tabbar.activeIcon) +
                ') no-repeat center top/27px',
            }"
          ></view>
        </view>
        <text :class="{ 'active-text': current == tabbar.id }">{{
          tabbar.name
        }}</text>
      </view>
    </view>
    <view class="sovip-tabBar" v-else>
      <view class="tabBar-active">
        <view
          class="selected-tabBar-mark"
          v-for="(item, index) in tabbarList"
          :key="index"
        >
          <image
            src="@/static/image/tabbar/sovip/selectedTab.png"
            v-show="current == index"
            mode="widthFix"
          />
        </view>
      </view>
      <view class="tabBar-box">
        <view
          class="tabBar-item"
          v-for="(item, index) in tabbarList"
          :key="index"
          @click="toIndex(item, index)"
        >
          <view :class="{ rabLabel: true, active: current == index }">
            <view class="transaction" v-if="dispTransaction && index == 1">
              <view
                class="transaction-item"
                @click="goToPage('/pages/recharge/recharge')"
              >
                <image
                  class="img"
                  src="@/static/image/tabbar/sovip/deposit.svg"
                />
                <span>{{ $t("充值") }}</span>
              </view>
              <view
                class="transaction-item"
                @click="goToPage('/pages/account/account')"
              >
                <image
                  class="img"
                  src="@/static/image/tabbar/sovip/withdraw.svg"
                />
                <span>{{ $t("提现") }}</span>
              </view>
            </view>
            <view class="tab-icon">
              <image
				class="tab-img"
                :src="current == index ? item.selectedIconPath : item.iconPath"
                mode="widthFix"
              />
            </view>
            <text class="title">{{ item.text }}</text>
            <!--<view class="tabIcon">2</view>-->
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import config from "@/utils/config";
export default {
  name: "my-tabbar",
  props: {
    current: {
      type: Number,
      default: config.projectImgUrl === 'sovip' ? 0 : 1,
    },
  },
  data() {
    return {
      login: false,
      baseUrl: "/static/img/tabBar/",
      unreadFlagActive: 0,
      projectImgUrl: config.projectImgUrl,
	    dispTransaction: false,
      tabbarList: [
        {
          //首页
          id: 0,
          name: this.$t("首页"), //'Trang chủ',
          icon: "indexIcon.png",
          activeIcon: "indexIcon_active.png",
          path: "/pages/index/index",
        },
        {
          //客服
          id: 1,
          name: this.$t("客服"), //'CSKH',
          icon: "customerService.png",
          activeIcon: "customerService_active.png",
          path: "/pages/subCustomerService/subCustomerService",
        },
        {
          //优惠
          id: 2,
          name: this.$t("优惠"), //'Khuyến Mãi',
          icon: "preferential.png",
          activeIcon: "preferential_active.png",
          path: "/pages/preferential/preferential",
        },
        {
          //vip
          id: 3,
          name: this.$t("VIP"), //'CAO CẤP',
          icon: "vip.png",
          activeIcon: "vip_active.png",
          path: "/pages/vipLevel/vipLevel",
        },
        {
          //会员中心
          id: 4,
          name: this.$t("会员中心"), //'Của tôi',
          icon: "member.png",
          activeIcon: "member_active.png",
          path: "/pages/my/my",
        },
      ],
    };
  },
  created() {
    if (['kubet','choibet','phattai68'].includes(this.projectImgUrl)) {
      this.tabbarList = [
        {
          //首页
          id: 0,
          name: this.$t("首页"), //'Trang chủ',
          icon: "home.svg",
          activeIcon: "home.svg",
          path: "/pages/index/index",
        },
        {
          //客服
          id: 1,
          name: this.$t("客服"), //'CSKH',
          icon: "service.svg",
          activeIcon: "service.svg",
          path: "/pages/subCustomerService/subCustomerService",
        },
        {
          //优惠
          id: 2,
          name: this.$t("优惠"), //'Khuyến Mãi',
          icon: "preferential.png",
          activeIcon: "preferential_active.png",
          path: "/pages/preferential/preferential",
        },
        {
          //vip
          id: 3,
          name: this.$t("VIP"), //'CAO CẤP',
          icon: "vip.png",
          activeIcon: "vip_active.png",
          path: "/pages/vipLevel/vipLevel",
        },
        {
          //会员中心
          id: 4,
          name: this.$t("会员中心"), //'Của tôi',
          icon: "menber.svg",
          activeIcon: "menber.svg",
          path: "/pages/my/my",
        },
      ];
    }
    if (this.projectImgUrl === "sovip") {
      this.tabbarList = [
        {
          pagePath: "/pages/index/index",
          iconPath: require("@/static/image/tabbar/sovip/indexIcon.png"),
          selectedIconPath: require("@/static/image/tabbar/sovip/indexIcon_active.png"),
          text: this.$t("首页"),
        },
        {
          pagePath: "",
          iconPath: require("@/static/image/tabbar/sovip/transaction.svg"),
          selectedIconPath: require("@/static/image/tabbar/sovip/transaction.svg"),
          text: this.$t("交易"),
        },
        {
          pagePath: "/pages/preferential/preferential",
          iconPath: require("@/static/image/tabbar/sovip/preferential.png"),
          selectedIconPath: require("@/static/image/tabbar/sovip/preferential_active.png"),
          text: this.$t("优惠"),
        },
        {
          pagePath: "/pages/subCustomerService/subCustomerService",
          iconPath: require("@/static/image/tabbar/sovip/customerService.png"),
          selectedIconPath:
           require("@/static/image/tabbar/sovip/customerService_active.png"),
          text: this.$t("在线客服"),
        },
        {
          pagePath: "/pages/my/my",
          iconPath:require("@/static/image/tabbar/sovip/member.png"),
          selectedIconPath: require("@/static/image/tabbar/sovip/member_active.png"),
          text: this.$t("会员中心"),
        },
      ];
    }
    if(['xiaocao','g9bet',].includes(this.projectImgUrl)){
      this.tabbarList.splice(3, 1);
    }
    if (this.projectImgUrl === "bgga") {
      this.tabbarList.splice(1, 1);
    }
    if (this.projectImgUrl === "g9bet") {
      this.tabbarList = [
        {
          //首页
          id: 0,
          name: this.$t("首页"), //'Trang chủ',
          icon: "indexIcon.png",
          activeIcon: "indexIcon_active.png",
          path: "/pages/index/index",
        },
        {
          //客服
          id: 1,
          name: this.$t("客服"), //'CSKH',
          icon: "customerService.png",
          activeIcon: "customerService_active.png",
          path: "/pages/subCustomerService/subCustomerService",
        },
        {
          //vip
          id: 3,
          name: this.$t("VIP"), //'CAO CẤP',
          icon: "vip.png",
          activeIcon: "vip_active.png",
          path: "/pages/vipLevel/vipLevel",
        },
        {
          //优惠
          id: 2,
          name: this.$t("优惠"), //'Khuyến Mãi',
          icon: "preferential.png",
          activeIcon: "preferential_active.png",
          path: "/pages/preferential/preferential",
        },
        {
          //会员中心
          id: 4,
          name: this.$t("会员中心"), //'Của tôi',
          icon: "member.png",
          activeIcon: "member_active.png",
          path: "/pages/my/my",
        },
      ];
    }
    
    if (this.projectImgUrl === "jun88") {
      this.tabbarList = [
      {
          //首页
          id: 0,
          name: this.$t("首页"), //'Trang chủ',
          icon: "indexIcon.png",
          activeIcon: "indexIcon.png",
          path: "/pages/index/index",
        },
        {
          //优惠
          id: 2,
          name: this.$t("优惠"), //'Khuyến Mãi',
          icon: "preferential.png",
          activeIcon: "preferential.png",
          path: "/pages/preferential/preferential",
        },
        {
          //客服
          id: 1,
          name: this.$t("客服"), //'CSKH',
          icon: "customerService.png",
          activeIcon: "customerService.png",
          path: "/pages/subCustomerService/subCustomerService",
        },
        {
          //vip
          id: 3,
          name: this.$t("VIP"), //'CAO CẤP',
          icon: "vip.png",
          activeIcon: "vip.png",
          path: "/pages/vipLevel/vipLevel",
        },
        {
          //会员中心
          id: 4,
          name: this.$t("会员中心"), //'Của tôi',
          icon: "member.png",
          activeIcon: "member.png",
          path: "/pages/my/my",
        },
      ];
    }
    console.log("this.projectImgUrl ====", this.tabbarList);
  },
  mounted() {
    
    console.log("mounted ====",this.$config.myTabBar.index);
	if(this.projectImgUrl !== 'sovip'){
		setTimeout(() => {
		this.checkUnread();
		}, 10);
	}
  },
  methods: {
    toIndex(item, index) {
      if (index == 1) {
        this.dispTransaction = !this.dispTransaction;
      } else {
		if(index == 3){
			this.$config.myTabBar.index = 3
		}
        uni.navigateTo({
          url: item.pagePath,
          animationType: "pop-in",
          animationDuration: 200,
        });
      }
    },
    goToPage(url) {
      console.log(url);
      uni.navigateTo({
        url,
      });
    },
    checkUnread() {
      this.login = this.$api.isLogin();
      console.log(this.login, "this.login设置");
      if (this.login) {
        console.log(
          this.$cache.get("activeUnread"),
          this.$cache.get("msgUnredCount")
        );
        this.unreadFlagActive =
          this.$cache.get("activeUnread") ||
          this.$cache.get("msgUnredCount") ||
          0;
      } else this.unreadFlagActive = 0;
      console.log(this.unreadFlagActive, "this.unreadFlagActive");
    },
    navigatorTo(item) {
      console.log(item, "gggggg");
      let routes = getCurrentPages();
      let curRoute = "/" + routes[routes.length - 1].route;
      console.log(curRoute);
      const index = item.id;
      if (
        (index === 2 && ['kubet','choibet','phattai68'].includes(this.projectImgUrl) && !this.login) ||
        (index === 3 && !this.login)
      ) {
        uni.navigateTo({
          url: "/pages/Login/Login",
        });
        return;
      } else {
        if (curRoute == item.path) {
          return;
        } else {
          uni.navigateTo({
            url: item.path,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.tabbar__content {
  width: 100%;
  height: 100upx;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid var(--tbbarBorderColor);
  background-color: var(--theme);
  z-index: 991;
  .tabar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      width: 50upx;
      height: 50upx;
    }
    .dw-icon {
      height: 80upx;
      width: 80upx;
      margin-top: -34upx;
      background-size: 80upx !important;
    }
    .yuan {
      image {
        position: absolute;
        width: 100rpx;
        height: 100rpx;
        bottom: 0;
        left: 0;
        right: 0;
        animation-name: bounce;
        animation-duration: 1.2s;
      }
    }
  }
  .unActiveRead {
    position: relative;
    &::after {
      content: "";
      width: 14upx;
      height: 14upx;
      background: red;
      position: absolute;
      border-radius: 50%;
      top: 10upx;
      right: 54upx;
    }
  }
  .isUnActive {
    &::after {
      content: "";
      top: 12rpx !important;
      right: 54rpx !important;
    }
  }

  text {
    padding-top: 3rpx;
    font-size: 24rpx;
    color: var(--tabarText);
  }
  .active-text {
    color: var(--tabarActiveText);
  }

  image {
    display: inline-block;
    width: 50rpx;
    height: 50rpx;
  }
}

@keyframes bounce {
  0%,
  20%,
  53%,
  100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  40%,
  43% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -15px, 0) scaleY(1.1);
    transform: translate3d(0, -15px, 0) scaleY(1.1);
  }

  70% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -5px, 0) scaleY(1.05);
    transform: translate3d(0, -5px, 0) scaleY(1.05);
  }

  80% {
    -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transform: translateZ(0) scaleY(0.95);
    transform: translateZ(0) scaleY(0.95);
  }

  90% {
    -webkit-transform: translate3d(0, -4px, 0) scaleY(1.02);
    transform: translate3d(0, -4px, 0) scaleY(1.02);
  }
}

.sovip-tabBar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 91upx;
  background: linear-gradient(180deg, #363636, #121212);
  border-top: 1upx solid #db9c30;
  position: fixed;
  width: 100%;
  z-index: 100;
  left: 0;
  .transaction {
    position: absolute;
    bottom: 0;
    z-index: 101;
    display: flex;
    background: url("@/static/image/tabbar/sovip/transaction_back.png");
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    top: -121upx;
    font-size: 20upx;
    color: #aaa;
    width: 260upx;
    height: 100upx;
    padding: 0.375rem 0.625rem 0.75rem;
    .transaction-item {
      display: flex;
      flex: 0 0 50%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .img {
        width: 30upx;
        height: 30upx;
      }
      span {
        font-size: 20upx;
      }
    }
  }
  .tabBar-active {
    display: flex;
    position: absolute;
    bottom: 84upx;
    width: 100%;
    .selected-tabBar-mark {
      width: 20%;
      display: flex;
    }
  }

  @media screen and (min-width: 560px) {
    .tabBar {
      width: 750upx;
      max-width: 750upx;
    }
  }

  .tabBar-box {
    display: flex;
    width: 100%;
    height: 100%;
  }
  .tabBar-item {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex: 1;
    height: 100%;
    color: #aaa;
  }
  .rabLabel {
    position: relative;
    font-size: 20upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .tab-icon {
      padding: 12upx 0 0;
      width: 41upx;
    }
	.tab-img{
		width: 41upx;
	}
    .title {
      margin-top: -5px;
    }
  }
  .rabLabel.active {
    .title {
      color: #ff9000;
    }
  }
  .tabIcon {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);
    width: 100rpx;
    height: 100rpx;
    border: solid 2px red;
    border-radius: 50%;
    text-align: center;
    line-height: 100rpx;
    background: #f0ad4e;
    box-sizing: border-box;
  }
}
.active{
  background-position: 0 -27px !important;
}
</style>
