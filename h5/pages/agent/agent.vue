<template>
  <view class="agent-wrap">
    <uni-nav-bar leftIcon="back" :title="$t('代理加盟')" @clickLeft="BackPage" :fixed="true" :statusBar="true">
    </uni-nav-bar>
    <view class="card">
      <view class="item" @click="openUrl('../../pages/agent/union/union')">
        <view class="item-title"> {{ $t('代理加盟') }} </view>
        <image
          src="@/static/image/indexImg/agent-jt.png"
          style="width: 25px; height: 25px"
        ></image>
      </view>
      <view
        class="item"
        @click="openUrl('../../pages/agent/register/register')"
      >
        <view class="item-title"> {{ $t('代理注册') }} </view>
        <image
          src="@/static/image/indexImg/agent-jt.png"
          style="width: 25px; height: 25px"
        ></image>
      </view>
      <view class="item" @click="goLogin">
        <view class="item-title"> {{ $t('代理登录') }} </view>
        <image
          src="@/static/image/indexImg/agent-jt.png"
          style="width: 25px; height: 25px"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    goLogin() {
        let getClientCodeRes = this.$server.getClientCodeRes()
        console.log(getClientCodeRes,'getClientCodeRes')
        if(!getClientCodeRes.agentDomain) return
        // #ifdef APP-PLUS
        plus.runtime.openURL(getClientCodeRes.agentDomain);
        // #endif
        // #ifdef H5
        uni.navigateTo({
          url: (window.location.href = getClientCodeRes.agentDomain),
        });
        // #endif
    },
    openUrl(e) {
      uni.navigateTo({
        url: e,
      });
    },
    BackPage() {
      uni.navigateBacks({})
    }
  },
};
</script>

<style lang="scss">
.agent-wrap {
  width: 100%;
  height: 100%;

  .card {
    // background: #fff;
    border-radius: 8px;
    margin: 17px;
    padding: 0 15px;
    // box-shadow: 0 2px 0 0 #fff, 0 -2px 0 0 #fff;

    .item {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e2ebf2;

      .item-title {
        color: #250f00;
        font-size: 14px;
      }
    }
  }
}
</style>
