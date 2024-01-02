<template>
  <view class="hr-member-layout">
    <view class="perHeader">
      <view class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <view class="perHeaderReal">
        <view style="backgroundImage: url('../../static/image/qqImg/back1.png')" @tap="goBack"></view>
        <view>{{ $t('邀请会员') }}</view>
        <view @click="openScreen">{{$t('筛选')}}</view>
      </view>
    </view>

    <view class="container">
      <view class="total-betting">{{$t('总投注')}}:{{ totalBetting + $t('元')}}</view>
      <view class="total-rebate">{{ $t('累计获得总返利') }}:{{ totalRebate + $t('元')}}</view>

      <view class="table">
        <view class="th tr">
          <view>{{$t('会员账号')}}</view>
          <view>{{$t('注册时间')}}</view>
          <view>{{ $t('总有效投注') }}</view>
          <view>{{$t('返利金(元)')}}</view>
        </view>
        <view class="tbody">
          <view class="tr" v-for="(item, i) in memberList" :key="i">
            <view class="highMemberColor">{{ item.memberName | memberNameEncode }}</view>
            <view class="highMemberColor">
              <view class="date-top">{{ timeSwitch(item.registerDate) }}</view>
              <view class="data-bot">{{ timeSwitch(item.registerDate, 1) }}</view>
            </view>
            <view class="highMemberColor">{{ item.validAmount }}</view>
            <view class="highMemberColor">{{ item.allowance }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 筛选 -->
    <view class="screen-container" v-show="isShowScreen">
      <view class="perHeader">
        <view class="status_bar">
          <!-- 这里是状态栏 -->
        </view>
        <view class="perHeaderReal">
          <view style="backgroundImage: url('../../static/image/qqImg/back1.png')" @tap="closeScreen"></view>
          <view class="textOne setMoneyColor">{{$t('邀请会员')}}</view>
        </view>
      </view>
      <view class="content">
        <view class="text time">{{$t('时间')}}</view>
        <view class="input-box">
          <input type="text" :placeholder="$t('开始时间')" v-model="startTime" @tap="toggleTab()" />
          <text class="text thought">{{$t('至')}}</text>
          <input type="text" :placeholder="$t('结束时间')" v-model="endTime" @tap="toggleTabs()" />
        </view>
      </view>
      <view class="btns">
        <view class="u-flex-all screenResetBtn" @click="resetFn">{{$t('重置')}}</view>
        <view class="u-flex-all screenConfirmBtn" @click="confirmFn">{{$t('确定')}}</view>
      </view>
    </view>

    <yu-datetime-picker @confirm="onConfirm" startYear="2010" ref="dateTime" :isAll="true" :current="true"></yu-datetime-picker>
  </view>
</template>

<script>
import cache from "../../utils/cache.js";
import yuDatetimePicker from "@/components/yu-datetime-picker/yu-datetime-picker.vue";
export default {
  data() {
    return {
      totalBetting: "",
      totalRebate: "",
      startTime: "",
      endTime: "",
      isShowScreen: false,
      memberId: "",
      memberList: "",
      startOrEnd: "", //开始时间还是结束时间
    };
  },
  filters: {
    memberNameEncode(val) {
      //会员账号加密
      if (val) {
        return val.substr(0, 2) + "****" + val.substr(-1);
      }
    },
  },
  onLoad() {
    this.memberId = cache.get("set_user") && cache.get("set_user").user_id;
    this.memberAllowanceRecord();
  },
  methods: {
    timeSwitch(val, type) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M = this.add0(date.getMonth() + 1) + "-";
        var D = this.add0(date.getDate()) + " ";
        var h = this.add0(date.getHours()) + ":";
        var m = this.add0(date.getMinutes()) + ":";
        var s = this.add0(date.getSeconds());
        if (!type) {
          return Y + M + D;
        } else {
          return h + m + s;
        }
      }
    },
    add0(val) {
      return val < 10 ? "0" + val : val;
    },
    goBack() {
      uni.navigateBacks({
        delta: 1,
      });
    },
    openScreen() {
      this.isShowScreen = true;
    },
    closeScreen() {
      this.isShowScreen = false;
    },
    resetFn() {
      this.startTime = "";
      this.endTime = "";
    },
    confirmFn() {
      this.memberAllowanceRecord();
      this.closeScreen();
    },
    memberAllowanceRecord() {
      var _this = this;
      var data = {
        currentPage: 1,
        endTime: this.endTime && this.endTime + " 23:59:59",
        memberId: this.memberId,
        pageSize: 20,
        startTime: this.startTime && this.startTime + " 00:00:00",
      };
      this.$api.memberAllowanceRecord(data, function (err, res) {
        if (err) {
        } else {
          _this.totalBetting = res.totalBetValid;
          _this.totalRebate = res.totalAllowance;
          _this.memberList = res.content;
        }
      });
    },
    //开始日期弹窗
    toggleTab(item, index) {
      this.$refs.dateTime.show();
      this.startOrEnd = "1";
    },
    //结束日期弹窗
    toggleTabs(item, index) {
      this.$refs.dateTime.show();
      this.startOrEnd = "2";
    },
    //选择日期
    onConfirm(val) {
      this.startOrEnd === "1" ? (this.startTime = val.selectRes) : (this.endTime = val.selectRes);
    },
  },
  components: {
    yuDatetimePicker,
  },
};
</script>

<style lang="scss">
.hr-member-layout {
  width: 100%;
  height: 100%;
  /* #ifdef APP-PLUS */
  padding-top: calc(88upx + var(--status-bar-height));
  /* #endif */
  /* #ifdef H5 */
  padding-top: 88upx;
  /* #endif */
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .perHeader {
    width: 100%;
    /* #ifdef APP-PLUS */
    height: calc(88upx + var(--status-bar-height));
    /* #endif */
    /* #ifdef H5 */
    height: 88upx;
    /* #endif */
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 99;

    .perHeaderReal {
      width: 100%;
      display: flex;
      align-items: center;
      height: 88upx;
      padding: 0 30upx;
      box-sizing: border-box;
      border-bottom: 2upx solid #f4f4f4;
    }
  }

  .perHeaderReal view:nth-child(1) {
    width: 44upx;
    height: 44upx;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    left: 30upx;
  }

  .perHeaderReal view:nth-child(2) {
    flex: 1;
    font-size: 36upx;
    font-weight: bold;
    text-align: center;
  }

  .perHeader view:nth-child(3) {
    position: absolute;
    right: 30upx;
    width: 88upx;
    font-size: 28upx;
    text-align: right;
  }

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .container {
    flex: 1;
    padding: 20upx 30upx;
    box-sizing: border-box;

    .total-betting {
      margin-bottom: 12upx;
      height: 42upx;
      line-height: 42upx;
      font-size: 30upx;
    }

    .total-rebate {
      height: 42upx;
      line-height: 42upx;
      font-size: 30upx;
      margin-bottom: 32upx;
    }

    .table {
      border-bottom: 2upx solid #e1e1e1;

      .tr {
        display: flex;

        > view {
          flex: 1;
          height: 80upx;
          border-left: 2upx solid #e1e1e1;
          border-top: 2upx solid #e1e1e1;
          font-size: 28upx;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        > view:last-child {
          border-right: 2upx solid #e1e1e1;
        }

        .highMemberColor {
          color: #b2b2b2;
        }
      }

      .th {
        view {
          font-size: 28upx;
          font-weight: bold;
        }
      }

      .tbody {
        .tr {
          view {
            font-size: 26upx;
            font-weight: normal;
            flex-direction: column;

            > view {
              text-align: center;
              line-height: 34upx;
            }
          }
        }
      }
    }
  }

  .screen-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 100;

    .content {
      padding: 138upx 30upx;
      box-sizing: border-box;

      .text {
        height: 42upx;
        font-size: 30upx;
        font-weight: bold;
        line-height: 42upx;
      }

      .time {
        margin-bottom: 32upx;
      }

      .input-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 316upx;

        input {
          width: 244upx;
          height: 80upx;
          line-height: 80upx;
          border: 1px solid #e1e1e1;
          border-radius: 10upx;
          text-align: center;
        }
      }
    }

    .btns {
      display: flex;
      align-items: center;

      view {
        flex: 1;
        height: 88upx;
        font-size: 30upx;
      }

      /*筛选重置 */
      .screenResetBtn {
        background-color: #ffefef;
        color: #cb3318;
      }

      .screenConfirmBtn {
        background-color: #cb3318;
        color: #fff;
      }
    }
  }
}
</style>
