<template>
  <view class="jackpot-page">
    <!-- <view class="header-box">
      <view class="header">
        <image @tap="BackPage" class="back-icon" src="./image/back.png" />
        <text>{{ $t("奖励") }}</text>
      </view>
    </view> -->
    <uni-nav-bar
      :title="$t('奖励')"
	    leftIcon="back"
      :status-bar="true"
      :fixed="true"
      color="#fff"
      :shadow="false"
      :rightText="$t('兑换码')"
      :showRightBtn="true"
      @clickRight="handleClickRight"
      @clickLeft="BackPage"
    ></uni-nav-bar>
    <view class="container-wrap flex-f-d-c">
      <view class="nav-wrap">
        <view
          class="nav"
          :class="navActive == index ? 'navActive' : ''"
          v-for="(nav, index) in navList"
          :key="index"
          @tap="switchTab(nav, index)"
        >
          {{ nav.title }}
        </view>
      </view>
      <view class="conent" v-if="jackpotLiat.length > 0">
        <view class="item-wrap">
          <view
            :class="`item  item-state-${item.state}`"
            v-for="(item, index) in jackpotLiat"
            :key="index"
          >
            <image
              class="item-bg"
              src="./image/winningBai.png"
              mode="aspectFill"
            ></image>
            <image
              v-show="item.state == 2"
              class="item-expired"
              :src="$config.getThemeUrl('winningGuo')"
              mode="aspectFill"
            ></image>
            <view class="text-detail-box flex-f-d-c">
              <view class="text-detail-up flex-f-d-c">
                <text class="f14 textShadow">{{
                  timeSwitch(item.createdAt)
                }}</text>
                <text class="f20 textShadow">{{ item.name }} </text>
              </view>
              <view class="text-detail-center">
                {{ $config.currency }}<text class="f28">{{ item.amount }}</text>
              </view>
              <view class="text-detail-down">
                <view class="left-deso flex-f-d-c">
                  <text class="f12">{{ $t('领取有效期截止') }}：</text>
                  <text class="f12">{{ timeSwitch(item.overdueTime) }}</text>
                </view>
                <view class="right-receive" @tap="showPopup(item)">
                  <text class="receive-btn f14">{{
                    isExpired(item.state)
                  }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="noData" v-else>
        <image src="./image/noDataJackpot.png" mode="aspectFill"></image>
      </view>
      <uni-popup ref="jackpotPopup" type="center" class="jackpotPopup">
        <view class="content-wrap flex-f-d-c">
          <view class="head">
            {{ $t('领取') }}
          </view>
          <view class="content">
            <view class="popNumber">
              {{ popNumber + $t('元') }}
            </view>
            <view class="popUpText">
              {{ $t('流水要求') + totalNum.toFixed(2) + $t('倍') }}
            </view>
          </view>
          <view class="receive" @tap="onReceive()">
            <text class="receive-sub">
              {{ $t('立即领取') }}
            </text>
          </view>
        </view>
      </uni-popup>
	  <uni-popup ref="jackpotPopup1" type="center" class="jackpotPopup">
	    <view class="content-wrap flex-f-d-c">
	      <view class="head ps-0">
	        {{ $t('温馨提示') }}
			<view class="colse" @click="hanldColse">
				<image src="../../static/image/close.png" style="width:30rpx;height:30rpx;"></image>
			</view>
	      </view>
	      <view class="content-1">
			<input class="pl-dh" v-model="redeemCode" type="text" :placeholder="$t('请输入兑换码')">
	      </view>
		  <view class="receive" @tap="handleReceive()">
		    <text class="receive-sub">
		      {{ $t('兑换') }}
		    </text>
		  </view>
	    </view>
	  </uni-popup>
    </view>
  </view>
</template>
<script src="./index.js"></script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
<style lang="scss">
::v-deep{
  .uni-navbar{
    .right_btn {
      border-radius: 31rpx;
      background: linear-gradient(270deg, #F3D798 0%, #F0C079 100%);
      width: 120rpx;
      height: 48rpx;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
