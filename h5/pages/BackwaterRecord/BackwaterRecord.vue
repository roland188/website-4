<template>
  <view class="BackwateRrecord">
    <uni-nav-bar left-icon="back" :title="$t('返水记录')" @clickLeft="onBack" @clickRight="openDrawer" :fixed="true" :statusBar="true">
      <view slot="right">
        <text class="header-r">{{ $t('筛选') }}</text>
      </view>
    </uni-nav-bar>
    <view class="">
      <view class="ul-box" v-for="(item, i) of dataList" :key="i" @click="openDetail">
        <view class="">
          <image v-if="item.gameIcon" :src="$config.getImgUrl(item.gameIcon)" class="title-img" mode=""></image>
          <image v-if="!item.gameIcon" src="../../static/image/xf/game_lost.png" class="title-img" mode=""></image>
        </view>
        <view class="item-r">
          <view class="name">
            {{ item.gameName }}
          </view>
          <view class="time" v-if="item.createdAt">
            {{ item.createdAt | ftime }}
          </view>
          <view class="money">
            <text class="text">{{ $t('流水') }}</text>
            <text class="text rmb">{{ $config.currency }}</text>
            <text class="money-text">{{ item.effectiveBet }}</text>
            <text class="text">{{ $t('返水') }}</text>
            <text class="text rmb">{{ $config.currency }}</text>
            <text class="money-text">{{ item.rebateAmount }}</text>
          </view>
        </view>
      </view>
      <view v-if="dataList.length == 0 || dataList.length == undefined" class="data-null">
        <image src="../../static/image/xf/null.png" class="null-img"></image>
        <text class="null-text">{{ $t('一条记录都没呢...') }}</text>
      </view>
    </view>
    <!-- 顶部弹框 -->
    <view class="">
      <uni-popup ref="showtip" type="top" :mask-click="true" :style="{ 'margin-top': top + 'rpx' }">
        <view class="uni-tip-default">
          <view class="title"> {{ $t('返水时间') }} </view>
          <view class="input-box">
            <view class="">
              <input type="text" v-model="dateStart" class="uni-input time" :placeholder="$t('开始时间')" @tap="toggleTab" />
            </view>
            <view class="zhi"> {{ $t('至') }} </view>
            <view class="">
              <input type="text" v-model="dateEnd" class="uni-input time" :placeholder="$t('截止时间')" @tap="toggleTabs" />
            </view>
          </view>

          <!-- 	<view class="title">
						返水类型
					</view>
					<view class="type-btn">
						<view class="btn" :class="{'gameListActive':typeBtn==0}" @click="onChangebtn(0)">
							实时返水
						</view>
						<view class="btn" :class="{'gameListActive':typeBtn==1}" @click="onChangebtn(1)">
							批次返水
						</view>

					</view> -->
          <view class="title"> {{ $t('返水金额') }} </view>
          <view class="input-box">
            <view class="">
              <text class="rmb">{{ $config.currency }}</text>
              <input type="number" v-model="minMoney" class="uni-input time" :placeholder="$t('最低金额')" />
            </view>
            <view class="zhi"> {{ $t('至') }} </view>
            <view class="">
              <text class="rmb">{{ $config.currency }}</text>
              <input type="number" v-model="maxMoney" class="uni-input time" :placeholder="$t('最高金额')" />
            </view>
          </view>
        </view>
        <view class="btn-box">
          <view class="grow res" @click="onColse"> {{$t('重置')}} </view>
          <view class="grow submit-btn gameListActive" @click="onTopData"> {{ $t('确定') }} </view>
        </view>
      </uni-popup>
    </view>
    <yu-datetime-picker @confirm="onConfirm" startYear="2010" ref="dateTime" :isAll="true" :current="true"></yu-datetime-picker>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import yuDatetimePicker from "@/components/yu-datetime-picker/yu-datetime-picker.vue";
import cache from "../../utils/cache.js";
export default {
  components: {
    uniNavBar,
    uniPopup,
    yuDatetimePicker,
  },
  data() {
    return {
      dateStart: "",
      dateEnd: "",
      inputindex: 1,
      typeBtn: 0,
      topPupop: false,
      minMoney: "",
      maxMoney: "",
      dataList: [],
      betNo: "",
      type: "",
      top: 0,
    };
  },
  filters: {
    ftime: function (value) {
      var date = new Date(value);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      let hh = date.getHours();
      let mm = date.getMinutes();
      // date.getSeconds());
      return year + "-" + month + "-" + day + " " + hh + ":" + mm;
    },
  },
  onLoad(e) {
    if (e.type) {
      this.type = e.type;
      let data = {
        status: 0,
        memberId: cache.get("set_user").user_id,
      };
      this.getuserFanshui(data);
    } else {
      this.betNo = e.betNo;
      let betNo = {
        betNo: this.betNo,
      };
      this.getDetail(betNo);
    }
    // #ifdef APP-PLUS
    this.top = 60;
    // #endif
  },
  methods: {
    getDetail(betNo) {
      this.$api.getDetailByBetNo(betNo, (err, res) => {
        console.log("返水", res, err);
        if (res) {
          this.dataList = res;
        }
      });
    },
    getuserFanshui(data) {
      this.$api.getRebateAmountDetail(data, (err, res) => {
        console.log("返水--查看详情", res, err);
        if (res) {
          this.dataList = res.list;
        }
      });
    },
    openDrawer() {
      this.topPupop = true;
      this.$refs.showtip.open();
    },
    openDetail() {},
    onColse() {
      if (this.type) {
        let data = {
          delFlag: 0,
          status: 0,
          memberId: cache.get("set_user").user_id,
        };
        this.getuserFanshui(data);
      } else {
        let betNo = {
          betNo: this.betNo,
        };
        this.getDetail(betNo);
      }

      this.topPupop = false;
      this.$refs.showtip.close();
    },
    onTopData() {
      let data = {
        betNo: this.betNo,
        startTime: this.dateStart ? this.dateStart + " 00:00:00" : "",
        endTime: this.dateEnd ? this.dateEnd + " 23:59:59" : "",
        moneyMax: this.maxMoney ? this.maxMoney : null,
        moneyMin: this.minMoney ? this.minMoney : null,
      };

      if (this.type) {
        data.status = 0;
        data.memberId = cache.get("set_user").user_id;
        data.betNo = null;
        this.getuserFanshui(data);
      } else {
        this.getDetail(data);
      }
      this.topPupop = false;
      this.$refs.showtip.close();
    },
    onChangebtn(e) {
      this.typeBtn = e;
    },
    //开始日期弹窗
    toggleTab(item, index) {
      this.$refs.dateTime.show();
      this.inputindex = 1;
    },
    //结束日期弹窗
    toggleTabs(item, index) {
      this.$refs.dateTime.show();
      this.inputindex = 2;
    },
    //选择日期
    onConfirm(val) {
      this.inputindex === 1 ? (this.dateStart = val.selectRes) : (this.dateEnd = val.selectRes);
    },
    onBack(e) {
      if (this.topPupop) {
        this.topPupop = false;
        this.$refs.showtip.close();
      } else {
        uni.navigateBacks();
      }
    },
  },
};
</script>

<style lang="scss">
.BackwateRrecord {
  background-color: #fff;
  height: 100% !important;
  .header-r {
    color: #1d1717;
    font-size: 28rpx;
  }
  .data-null {
    text-align: center;
    margin-top: 200rpx;
    .null-img {
      width: 40%;
      display: block;
      margin: 0 auto;
      height: 320rpx;
    }
    .null-text {
      color: #a7a7a7;
      font-size: 28rpx;
    }
  }

  .ul-box {
    display: flex;
    padding: 22rpx 30rpx;
    border-bottom: 1px solid #f4f4f4;

    .title-img {
      width: 96rpx;
      height: 82rpx;
      border-radius: 10px;
      margin-right: 16rpx;
    }

    .item-r {
      flex-grow: 1;

      .name {
        color: #1d1717;
        font-size: 30rpx;
        font-weight: bold;
      }

      .time {
        color: #a7a7a7;
        font-size: 24rpx;
      }

      .money {
        .text {
          color: #1d1717;
          font-size: 28rpx;
        }

        .money-text {
          color: #1d1717;
          font-size: 36rpx;
          margin-right: 80rpx;
          font-weight: bold;
        }

        .rmb {
          margin-left: 16rpx;
          font-weight: bold;
        }
      }
    }
  }

  .btn-box {
    display: flex;

    .grow {
      flex-grow: 1;
      font-size: 15px;
      text-align: center;
      height: 88rpx;
      line-height: 88rpx;
      background-color: #ead4ac;
    }

    .submit-btn {
    }

    .res {
      background-color: #434039;
      color: #fff;
    }
  }

  .uni-tip-default {
    background-color: #fff;
    padding: 128rpx 30rpx 150px 30rpx;

    .title {
      color: #1d1717;
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 32rpx;
    }

    .type-btn {
      display: flex;
      margin-bottom: 48rpx;

      .btn {
        border-radius: 8px;
        border: 1px solid #e1e1e1;
        padding: 12rpx 20rpx;
        font-size: 26rpx;
        color: #a7a7a7;
        margin-right: 52rpx;
      }
    }

    .input-box {
      display: flex;
      align-items: center;
      margin-bottom: 48rpx;

      .time {
        border: 1px solid #e1e1e1;
        border-radius: 8px;
        text-align: center;
        height: 80rpx;
      }

      .zhi {
        margin: 0px 80rpx;
      }

      .rmb {
        color: #1d1717;
        font-size: 50rpx;
        font-weight: bold;
        position: absolute;
        margin-left: 8rpx;
      }
    }
  }
}
</style>
