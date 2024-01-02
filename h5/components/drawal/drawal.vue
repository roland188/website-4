<!-- 这是游戏记录详情 -->
<template>
  <view style="height: 100%">
    <view class="header" style="height: 100%">
      <view class="headerMoney">
        <view class="amount">
          <i>{{ $config.currency }}</i>
          <text class="recordTextOne">{{ data.amount }}</text>
        </view>
        <view class="flexLayout top-up">
          <text class="leftText">{{ $t("订单编号") }}</text>
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
      <view class="content">
        <view class="flexLayout" v-if="data.type != 10">
          <text class="leftText"
            >{{
              data.payType === "digit" ? $t('提现货币') : $t('提现银行')
            }}：</text
          >
          <text class="recordTextOne">{{ data.bankName }}</text>
        </view>
        <view class="flexLayout chain" v-if="data.type != 10">
          <text class="leftText"
            >{{
              data.payType === "digit" ? $t("钱包地址") : $t("银行卡号")
            }}：</text
          >
          <text
            class="recordTextOne"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            >{{ data.bankNo }}</text
          >
        </view>
        <view
          v-show="data.payType === 'digit'"
          v-if="data.type != 10"
          class="flexLayout"
        >
          <text class="leftText">{{ $t('链名称：') }}</text>
          <text class="recordTextOne">{{ data.bankBranch }}</text>
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('提现金额：') }}</text>
          <text class="recordTextOne">{{ $config.currency }}{{ data.amount }}</text>
        </view>
        <view class="flexLayout" v-if="data.type != 10">
          <text class="leftText">{{ $t('提款手续费：') }}</text>
          <text class="recordTextOne">{{ $config.currency }}{{ data.administrativeCosts }}</text>
        </view>
        <view class="flexLayout" v-if="data.type != 10">
          <text class="leftText">{{ $t('行政费用：') }}</text>
          <text class="recordTextOne">{{ $config.currency }}{{ data.handlingfee }}</text>
        </view>
        <view class="flexLayout" v-if="data.type != 10">
          <text class="leftText">{{ $t('优惠扣除：') }}</text>
          <text class="recordTextOne">{{ $config.currency }}{{ data.discountDeduction }}</text>
        </view>
        <view class="flexLayout" v-if="data.type != 10">
          <text class="leftText">{{ $t('到账货币额度：') }}</text>
          <text class="recordTextOne">{{ $config.currency }}{{ data.realAmount }}</text>
        </view>
        <view
          class="flexLayout"
          v-if="data.type != 10"
          v-show="data.payType === 'digit'"
        >
          <text class="leftText">{{ $t('实际到账货币：') }}</text>
          <text class="recordTextOne">{{ data.account }}</text>
        </view>

        <view
          class="flexLayout"
          v-if="data.type != 10"
          v-show="data.payType === 'digit'"
        >
          <text class="leftText">{{ $t('提现汇率：') }}</text>
          <text class="recordTextOne">{{ data.exchange }}</text>
        </view>

        <view class="flexLayout">
          <text class="leftText">{{ $t('提现状态：') }}</text>
          <text
            class="recordTextOne"
            :class="{ colors: data.status !== $t('出款成功') }"
            >{{ data.status }}</text
          >
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('提现时间：') }}</text>
          <text class="recordTextOne">{{ data.createdAt }}</text>
        </view>
        <view class="flexLayout">
          <text class="leftText">{{ $t('提款方式：') }}</text>
          <text class="recordTextOne">{{ data.payment }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ["detailsId"],
  data() {
    return {
      data: {
        administrativeCosts: "", //手续费
        orderNo: "", //订单号
        amount: "", //金额
        bankName: "", //银行名称
        bankNo: "", //银行卡号
        createdAt: "", //时间
        discountDeduction: "", //优惠扣除
        realAmount: "", //到账货币额度
        handlingfee: "", //行政费
        status: "", //状态
        type: "",
        payment: "",
        payType: "",
        exchange: "", //汇率
        account: "", //实际到账货币
      },
    };
  },
  methods: {
    copy() {
      const selt = this
      uni.setClipboardData({
        data: this.data.orderNo,
        success: function (success) {
          uni.showToast({
            title: selt.$t("复制成功"),
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
  mounted() {
    const t = this.$t;
    this.$api.appWithdrawRecordsDetail(
      this.detailsId,
      (err, res) => {
        if (res) {
          this.data.administrativeCosts = res.administrativeCosts;
          this.data.amount = res.amount;
          this.data.bankName = res.bankName;
          this.data.bankNo = res.bankNo;
          this.data.discountDeduction = res.discountDeduction;
          this.data.handlingfee = res.handlingfee;
          this.data.realAmount = res.realAmount;
          this.data.orderNo = res.orderNo;
          this.data.createdAt = this.conversionTime(res.createdAt);
          this.data.type = res.type;
          this.data.payType = res.payType;
          this.data.bankBranch = res.bankBranch;
          this.data.exchange = res.digitRate;
          this.data.account = res.digitCount;
          if (res.type === 43) {
            switch (res.status) {
              case 0:
                this.data.status = this.$t("未处理");
                break;
              case 1:
              case 5:
              case 6:
              case 7:
                this.data.status = this.$t("处理中");
                break;
              case 2:
                this.data.status = this.$t("出款成功");
                break;
              case 3:
                this.data.status = this.$t("出款失败");
                break;
              case 4:
                this.data.status = this.$t("关闭");
                break;
            }
          } else {
            switch (res.status) {
              case 3:
              case 4:
                this.data.status = this.$t("出款失败");
                break;
              case 0:
              case 1:
                this.data.status = this.$t("处理中");
                break;
              case 2:
                this.data.status = this.$t("出款成功");
                break;
            }
          }
          switch (res.type) {
            case 8:
              this.data.payment = this.$t("银行卡提款");
              break;
            case 10:
              this.data.payment = this.$t("手动下分");
              break;
            case 43:
              this.data.payment = this.$t("数值货币提款申请");
              break;
            case 47:
              this.data.payment = this.$t("origo钱包提款");
              break;
            default:
              this.data.payment = "";
              break;
          }
        }
      },
      true
    );
  },
};
</script>

<style scoped>
@import url("../detailsComp/detailsComp.css");
</style>
