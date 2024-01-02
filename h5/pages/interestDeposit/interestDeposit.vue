<template>
  <view class="toDeposit">
    <view class="perHeader">
      <view class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <view class="perHeaderReal">
        <view style="backgroundImage: url('../../static/image/qqImg/bankback.png')" @tap="goBack"></view>
        <view>存款</view>
      </view>
    </view>

    <view class="container">
      <view class="content">
        <view class="firstTitle">活动名称：{{ DetailObj.name }}</view>
        <view class="Title">存款总额：{{ filterNumber(DetailObj.totalDeposit) }}元/可再存入{{ filterNumber(totalLimit) }}元</view>
        <view class="Title">存款笔数：{{ DetailObj.totalDepositRoll }}笔/可再存入{{ keRollLimit }}笔</view>
        <view class="Title">存入金额：</view>
        <view class="inputmOn">
          <input
            type="number"
            v-model="amount"
            :placeholder="'单笔最低额度：' + filterNumber(amountMin) + '元'"
            @blur="profitForecast()"
            placeholder-class="placeholderInput"
            class="input"
          />
        </view>
        <view class="tip">预计最高利率{{ filterNumber(apr) }}%,最高可获利息：{{ filterNumber(interest) }}元</view>
        <!-- 立即存入 -->
        <view class="btn" v-if="DetailObj.status == 4" @click="toDeposit">立即存入</view>
        <!-- 未开放 -->
        <view class="btn disables" v-if="DetailObj.status == 3">未开放</view>
        <!-- 结束申请 -->
        <view class="btn disables" v-if="DetailObj.status == 2">结束申请</view>
        <!-- 结束计息 -->
        <view class="btn disables" v-if="DetailObj.status == 1">结束计息</view>

        <view class="Title shuom">购买利率说明：</view>
      </view>
      <view class="lidetail" v-for="(item, index) in DetailObj.levelData" :key="index">
        <view class="shuoList" @click="openDetail(item)">
          <image
            :src="item.showDetail == false ? '../../static/image/qqImg/righticon.png' : '../../static/image/qqImg/pullIcon.png'"
            class="right-more"
            mode=""
          ></image>
          <text class="demeon">存款{{ filterNumber(item.amount) }}元</text>
          <text class="toright">最高年利率：{{ item.apr ? filterNumber(item.apr) : 0.0 }}%</text>
        </view>
        <view class="detail" v-show="item.showDetail">
          <view class="lisy" v-for="(item1, index1) in item.detail" :key="index1">
            <text> {{ item1.time }}小时</text>
            <text class="nian">年利率：{{ item1.apr ? filterNumber(item1.apr) : 0.0 }}%</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 存款成功弹窗 -->
    <uni-popup ref="popup">
      <view class="dailog">
        <view class="title">存款成功</view>
        <view class="tip">恭喜你，完成存款操作！您可在利息宝记录中查看投注详情以及奖金信息！</view>
        <view class="btn" @click="closeDialog">知道了</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupMessage from "@/components/uni-popup/uni-popup-message.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
export default {
  components: {
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },
  data() {
    return {
      id: null,
      DetailObj: {},
      amount: "",
      interest: 0,
      amountMin: 0, //最低可存入多少钱
      apr: 0,
      keRollLimit: 0, //可存笔数
      totalLimit: 0, //可在存入多少钱
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.interestDetail();
  },
  methods: {
    goBack() {
      uni.navigateBacks({
        delta: 1,
      });
    },
    //过滤数据
    filterNumber(num) {
      return (num * 1).toFixed(2);
    },
    //返回上一步
    onBack() {
      uni.navigateTo({
        url: "../interestList/interestList",
      });
    },
    //获取详情
    interestDetail() {
      this.$api.interestDetail(this.id, (err, res) => {
        if (res) {
          this.DetailObj = res;
          this.DetailObj.levelData.forEach((element) => {
            this.$set(element, "showDetail", false);
          });
          this.keRollLimit = this.DetailObj.depositRollLimit - this.DetailObj.totalDepositRoll;
          this.totalLimit = this.DetailObj.totalDepositLimit - this.DetailObj.totalDeposit;
          this.amountMin = this.DetailObj.minDepositLimit;
        }
      });
    },
    //获取预计盈利
    profitForecast() {
      if (!this.amount) {
        this.interest = 0;
        this.apr = 0;
        return;
      }
      this.$api.profitForecast(this.amount, this.id, (err, res) => {
        if (res) {
          this.interest = res.interest;
          this.apr = res.apr;
        }
      });
    },
    //展开、关闭购买利率说明
    openDetail(item) {
      item.showDetail = !item.showDetail;
    },
    //立即存款
    toDeposit() {
      if (!this.amount) {
        uni.showToast({
          icon: "none",
          title: "请输入最低额度",
        });
        return;
      }
      if (this.amount < this.amountMin || this.amount > this.totalLimit) {
        uni.showToast({
          icon: "none",
          title: "存入金额不能小于" + this.filterNumber(this.amountMin) + "元，不能大于" + this.filterNumber(this.totalLimit) + "元",
        });
        return;
      }
      //单次最大限额
      if (this.amount > this.DetailObj.maxDepositLimit) {
        uni.showToast({
          icon: "none",
          title: "单次最大限额：" + this.DetailObj.maxDepositLimit,
        });

        return;
      }
      //存入笔数超限
      if (this.keRollLimit <= 0) {
        uni.showToast({
          icon: "none",
          title: "存入笔数超限",
        });
        return;
      }

      this.$api.interestJoin(this.amount, this.id, (err, res) => {
        if (err) {
          console.log(err);
          if (err.code == 120070) {
            uni.showToast({
              icon: "none",
              title: "用户余额不足",
            });
            return;
          }
        } else {
          this.interestDetail();
          this.amount = "";
          this.$refs.popup.open();
        }
      });
    },
    closeDialog() {
      this.$refs.popup.close();
    },
  },
};
</script>
<style lang="less" scoped>
.toDeposit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  //行高
  view {
    line-height: normal;
  }

  .perHeader {
    width: 100%;
    /* #ifdef APP-PLUS */
    height: calc(88upx + var(--status-bar-height));
    /* #endif */
    /* #ifdef H5 */
    height: 88upx;
    /* #endif */
    color: #fff;
    background-color: #000;

    .status_bar {
      height: var(--status-bar-height);
      width: 100%;
    }

    .perHeaderReal {
      width: 100%;
      display: flex;
      align-items: center;
      height: 88upx;
      padding: 0 30upx;
      box-sizing: border-box;
      border-bottom: 2upx solid #f4f4f4;
      position: relative;
      color: #fff;
      background-color: #000;

      view:nth-child(1) {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 30upx;
        width: 44upx;
        height: 44upx;
        background-size: cover;
        background-repeat: no-repeat;
      }

      view:nth-child(2) {
        flex: 1;
        font-size: 36upx;
        font-weight: bold;
        text-align: center;
      }
    }
  }

  .container {
    flex: 1;
    overflow: auto;

    .content {
      padding: 30upx 30upx 0;

      .firstTitle {
        font-size: 32upx;
        font-weight: bold;
        line-height: 42px;
        color: #1d1717;
      }

      .Title {
        font-size: 30upx;
        font-weight: 500;
        line-height: 42px;
        color: #1d1717;
      }

      .inputmOn {
        margin-bottom: 10upx;

        input {
          padding: 10upx;
          box-sizing: border-box;
          height: 80upx;
          line-height: 80upx;
          border: 1px solid #e1e1e1;
          border-radius: 10upx;
        }
      }

      .tip {
        text-align: right;
        font-size: 26upx;
        font-weight: 500;
        line-height: 36px;
        color: #f9a425;
        margin-bottom: 64upx;
      }

      .btn {
        height: 88upx;
        border-radius: 50upx;
        line-height: 88upx;
        text-align: center;
        font-size: 30upx;
        margin-bottom: 32upx;
        background-color: #cb3318;
        color: #fff;
      }

      .disables {
        opacity: 0.5;
      }

      .shuom {
        font-size: 26upx;
      }
    }

    .lidetail {
      .shuoList {
        padding: 0 30upx;
        font-size: 30upx;
        line-height: 100upx;
        height: 100upx;
        border-bottom: 1px solid #f7f7f7ff;
        color: #1d1717;

        .right-more {
          width: 14upx;
          height: 16upx;
          margin-right: 15upx;
        }

        .demeon {
          font-weight: bold;
        }

        .toright {
          float: right;
          margin-right: 30upx;
        }
      }

      .detail {
        width: 100%;
        box-sizing: border-box;
        padding: 28upx 58upx;
        background: #f7f7f7;
        overflow: hidden;
        font-size: 30upx;
        font-weight: 500;
        line-height: 42upx;
        color: #7d7d7d;

        .lisy {
          margin-bottom: 10upx;
        }

        .nian {
          float: right;
          margin-right: 80upx;
        }
      }
    }
  }

  .dailog {
    width: 536upx;
    background: #ffffff;
    border-radius: 16px;
    text-align: center;
    padding: 32upx 56upx;
    box-sizing: border-box;
    color: #1d1717;

    .title {
      font-size: 36upx;
      font-weight: bold;
      line-height: 60upx;
    }

    .tip {
      text-align: left;
      font-size: 30upx;
      font-weight: 500;
      line-height: 30px;
    }

    .btn {
      font-size: 30upx;
      font-weight: 500;
      line-height: 42px;
      color: #d95139;
      margin-top: 20upx;
    }
  }
}
</style>
