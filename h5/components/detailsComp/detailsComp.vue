<template>
  <view style="height: 100%">
    <view class="header" style="height: 100%">
      <view class="headerMoney">
        <view class="amount">
          <i>{{ $config.currency }}</i>
          <text class="recordTextOne">{{ data.amount }}</text>
        </view>
        <view class="flexLayout top-up">
          <text class="leftText">{{ $t('订单编号') }}</text>
          <view class="orderNo">
            <text class="recordTextOne">{{ data.orderNo }}</text>
            <i
              @click="copy"
              :style="{
                backgroundImage: 'url(/static/image/xf/copy.png)',
              }"
            ></i>
          </view>
        </view>
      </view>

      <view v-if="topupOrTransfer.record == 0" class="content">
        <view class="flexLayout">
          <text class="leftText">{{ $t('充值金额：') }}</text>
          <view class="orderNo recordTextOne">{{ $config.currency }}{{ data.amount }}</view>
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('充值状态：') }}</text>
          <view
            class="orderNo colors"
            :class="{ color: data.status === $t('已支付') }"
            >{{ data.status }}</view
          >
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('充值时间：') }}</text>
          <view class="orderNo">{{ data.createdAt }}</view>
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('支付方式：') }}</text>
          <view class="orderNo">{{ data.payment }}</view>
        </view>
      </view>
      <view style="margin-top: 20rpx" v-else>
        <view class="flexLayout">
          <text class="leftText">{{ $t('转账银行：') }}</text>
          <view class="orderNo">{{ data.bankName }}</view>
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('银行卡号：') }}：</text>
          <view class="orderNo">{{ data.card }}</view>
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('转账金额：') }}</text>
          <view class="orderNo">{{ $config.currency }}{{ data.amount }}</view>
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('转账状态：') }}</text>
          <view
            class="orderNo colors"
            :class="{ color: data.status === $t('审核通过') }"
            >{{ data.status }}</view
          >
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('转账时间：') }}</text>
          <view class="orderNo">{{ data.createdAt }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ["ginseng"],
  data() {
    return {
      state: "",
      topupOrTransfer: {},
      data: {
        amount: "",
        orderNo: "",
        bankName: "",
        card: "",
        createdAt: "",
        status: "",
        payment: "",
      },
    };
  },
  methods: {
    copy() {
      let that = this;
      uni.setClipboardData({
        data: this.data.orderNo,
        success: function (success) {
          uni.showToast({
            title: that.$t("复制成功"),
            icon: "none",
            duration: 2000,
          });
        },
      });
    },
    conversionTime(timeStamp) {
      if (timeStamp > 0) {
        var date = new Date();
        date.setTime(timeStamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        var h = date.getHours();
        h = h < 10 ? "0" + h : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      } else {
        return "";
      }
    },
  },
  props: ["ginseng"],
  mounted() {
    this.topupOrTransfer = JSON.parse(this.ginseng.topupOrTransfer);
    if (this.topupOrTransfer.record === 0) {
      //充值详情
      this.$api.appOnlinePayDetail(
        this.topupOrTransfer.detailsIds,
        (err, res) => {
          if (res) {
            this.data.createdAt = this.conversionTime(res.createdAt);
            if (res.type === 41) {
              switch (res.status) {
                case 0:
                  this.data.name = this.$t("未处理");
                  break;
                case 1:
                case 5:
                case 6:
                case 7:
                  this.data.name = this.$t("处理中");
                  break;
                case 2:
                  this.data.name = this.$t("出款成功");
                  break;
                case 3:
                  this.data.name = this.$t("出款失败");
                  break;
                case 4:
                  this.data.name = this.$t("关闭");
                  break;
              }
            } else {
              if (res.status === 2) {
                this.data.status = this.$t("已支付");
              } else {
                this.data.status = this.$t("未支付");
              }
            }
            switch (res.type) {
              case 4:
                this.data.payment = this.$t("线下二维码支付");
                break;
              case 5:
                this.data.payment = this.$t("线上支付");
                break;
              case 11:
                this.data.payment = this.$t("手动上分");
                break;
              case 41:
                this.data.payment = this.$t("数值货币支付");
                break;
              default:
                this.data.payment = "";
                break;
            }
            this.data.amount = res.amount;
            this.data.orderNo = res.orderNo;
          }
        },
        true
      );
    } else {
      //转账详情
      this.$api.appOfflineRecordsDetail(
        this.topupOrTransfer.detailsIds,
        (err, res) => {
          if (res) {
            this.data.createdAt = this.conversionTime(res.createdAt);
            if (res.status === 2) {
              this.data.status = this.$t("审核通过");
            } else if (res.status === 0) {
              this.data.status = this.$t("未处理");
            } else {
              this.data.status = this.$t("审核未通过");
            }
            this.data.amount = res.amount;
            this.data.orderNo = res.orderNo;
            this.data.bankName = res.bankName;
            this.data.card = res.card;
          }
        },
        true
      );
    }
  },
};
</script>

<style scoped>
@import url("./detailsComp.css");
</style>
