<template>
  <view class="highmargin-Box conetn-bg">
    <view class="perHeader headerbg">
      <view class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <view class="perHeaderReal headerbg">
        <view
          style="
            background: url('../../static/image/qqImg/bankback.png');
            background-size: cover;
          "
          @tap="goBack"
        ></view>
        <view class="textOne setMoneyColor">{{ $t("全民返利") }}</view>
      </view>
    </view>

    <view class="content">
      <view class="flex-fan borderColor">
        <view class="">
          <image
            src="../../static/image/dze/fanimg.png"
            class="fan-img"
            mode=""
          ></image>
        </view>
        <view class="text-box">
          <view class="text-zong">
            {{ $t('累计返利') }}：{{ money + $t('元') }}
            <image
              src="../../static/image/dze/refresh.png"
              class="refresh-img"
              @click="getMoneyF(1)"
              mode=""
            ></image>
          </view>
          <view class="text-money">
            {{ $t('满') + minCount + $t('元，且有效会员人数≥')
            }}{{ minValidCount + $t('人，即可领取') }}
          </view>
        </view>
        <view
          class="receive-but codeBtn u-flex-all"
          @click="onReceive"
          :class="!isGet ? 'disabledBtn' : ''"
        >
          {{ $t('领取') }}
        </view>
      </view>

      <view
        class="invite-member-box"
        @click="toPage('../highRebateMember/highRebateMember')"
      >
        <view>
          <image
            class="merber-img"
            src="../../static/image/qqImg/highRebate11.png"
            mode=""
          ></image>
          <text
            >{{ $t('会员（会员总数') }}：{{ inviteMemberNum }}，{{
              $t('有效会员')
            }}：{{ validMember }}）</text
          >
        </view>
        <image
          class="more-img"
          src="../../static/image/qqImg/perMore.png"
          mode=""
        ></image>
      </view>

      <view class="img-box">
        <image
          src="../../static/image/dze/chess.png"
          class="chess-img"
          mode=""
        ></image>
        <image
          :src="$config.getThemeUrl('frienfd')"
          class="frienfd-img"
        ></image>
      </view>
      <view
        class="card"
        style="backgroundimage: url('../../static/image/dze/bgcard.png')"
      >
        <view class="handle-box">
          <image
            src="../../static/image/dze/left.png"
            class="left-img"
            mode=""
          ></image>
          <view class="title shareText"> {{ $t('分享邀请码或链接给好友吧') }} </view>
          <image
            src="../../static/image/dze/right.png"
            class="right-img"
            mode=""
          ></image>
        </view>
        <view
          class="card-border"
          style="backgroundimage: url('../../static/image/dze/bgborder.png')"
        >
          <canvas canvas-id="qrcode" class="code-img" />
          <!-- <image src="../../static/image/dze/code.png" style="width: 354px;height: 354px;" mode=""></image> -->
        </view>

        <view class="flex-img-box">
          <image
            src="../../static/image/dze/taiqiu.png"
            class="tai-img"
            mode=""
          ></image>
          <view class="text-marging">
            <view class="text-my codeTexts"> {{ $t('我的邀请码') }} </view>
            <view class="text-code codeTexts">
              {{ codeText }}
            </view>
          </view>
          <image
            src="../../static/image/dze/grli.png"
            class="grli-img"
            mode=""
          ></image>
        </view>
      </view>

      <view class="flex-btn">
        <button
          class="alt-btn linkBtn"
          @click="onLink"
          v-clipboard:copy="linkText"
          v-clipboard:success="(type) => onCopyResult('success')"
          v-clipboard:error="(type) => onCopyResult('error')"
        >
          {{ $t('复制邀请链接') }}
        </button>
        <button
          class="code-btn codeBtn"
          @click="onCode"
          v-clipboard:copy="codeText"
          v-clipboard:success="(type) => onCopyResult('success')"
          v-clipboard:error="(type) => onCopyResult('error')"
        >
          {{ $t('复制邀请码') }}
        </button>
      </view>
      <view class="rule-text">
        <text class="line"></text>
        <text class="text-su codeTexts">{{ $t('规则说明') }}</text>
        <text class="line"></text>
      </view>
      <view class="explainStyle codeTexts" v-html="explains"> </view>
      <view class="" style="height: 100px"> </view>
    </view>

    <uni-popup ref="popup" type="center" @tap.stop>
      <view class="alert-box">
        <view class="popup-header"> {{ $t('返利领取') }} </view>
        <view class="padding-xl">
          <view class="money">
            {{ money }}
          </view>
          <view class="money-text">
            {{ $t('流水要求') + auditFactor + $t('倍') }}
          </view>
        </view>
        <view class="btn-box">
          <view class="cancel" @click="onCancel">
            {{ $t('取消') }}
          </view>
          <view class="shareText" @click="getItNow">
            {{ $t('立即领取') }}
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uQRCode from "@/common/uqrcode.js";
export default {
  components: {
    uniPopup,
  },
  data() {
    return {
      linkText: "",
      codeText: "",
      money: "0.00",
      auditFactor: "0.00", //流水倍数
      btnDis: true, //默认禁止领取
      minCount: "0.00",
      explains: "",
      inviteMemberNum: 0,
      minValidCount: "", //最小有效会员人数
      validMember: 0, //有效会员人数
      maxReceive: "", //领取上限
      isGet: false, //是否可以领取
    };
  },
  onShow() {
    this.$api.getReferralLink(
      {
        clientCode: this.$config.clientCode,
      },
      (err, res) => {
        console.log(err, res);
        if (res) {
          this.codeText = res.code;
          this.linkText = res.h5Links[0];
          // let getClientCode = this.$config.clientCode + window.theme;
          // let appDowDataUrl = this.$config.dowUrl + getClientCode + this.codeText;
          // this.make(appDowDataUrl);
          // console.log(appDowDataUrl)
          // #ifdef APP-PLUS
          let getClientCode = this.$config.clientCode + this.$config.theme;
          let appDowDataUrl =
            res.h5Links[0] + "/" + getClientCode + "/" + this.codeText;
          this.make(appDowDataUrl);
          this.linkText = appDowDataUrl;
          // #endif
          // #ifdef H5
          let url = window.location.origin + "?code=" + this.codeText;
          this.linkText = url;
          this.make(url);
          // #endif
        }
      }
    );

    this.$api.ExplainRule(
      {
        clientCode: this.$config.clientCode,
      },
      (err, res) => {
        console.log(err, res);
        if (res) {
          this.explains = res.explains;
        }
      }
    );

    this.memberAllowanceCount();
    this.validMemberCount();
  },
  methods: {
    //获取返利金额
    getMoneyF(e = 0) {
      const self = this;
      this.$api.availableAmount(
        {
          clientCode: this.$config.clientCode,
        },
        (err, res) => {
          console.log(err, res);
          if (res) {
            this.minCount = res.minCount;
            this.money = res.allowance.toFixed(2); //总奖励
            this.minValidCount = res.minValidCount;
            this.maxReceive = res.maxReceive;
            this.auditFactor = res.auditFactor; //稽核倍数
            this.btnDis = res.allowance > res.minCount ? true : false;

            //满足 1.最低领取金额  2.最低有效会员人数 3.领取上限
            if (
              this.validMember >= this.minValidCount &&
              this.money <= this.maxReceive &&
              this.btnDis
            ) {
              this.isGet = true;
            }
            if (e == 1) {
              uni.showToast({
                title: self.$t('刷新成功'),
                duration: 2000,
                position: "center",
                icon: "none",
              });
            }
          }
        }
      );
    },
    //生成二维码
    async make(text) {
      // 回调方式
      uQRCode.make({
        canvasId: "qrcode",
        componentInstance: this,
        text: text,
        size: 210,
        margin: 10,
        backgroundColor: "#ffffff",
        foregroundColor: "#000000",
        fileType: "jpg",
        correctLevel: uQRCode.errorCorrectLevel.H,
        success: (res) => {
          //
        },
      });
    },
    //复制链接
    onLink() {
      this.ClipboardData(this.linkText);
    },
    //复制邀请码
    onCode() {
      this.ClipboardData(this.codeText);
    },
    onCopyResult(type) {
      const self = this;
      if (type === "success") {
        uni.showToast({
          title: self.$t('复制成功'),
          duration: 2000,
          position: "center",
          icon: "none",
        });
      } else {
        uni.showToast({
          title: self.$t('复制失败'),
          duration: 2000,
          position: "center",
          icon: "none",
        });
      }
    },

    ClipboardData(data) {
      const self = this;
      // #ifdef H5

      // #endif
      // #ifdef APP-PLUS
      uni.setClipboardData({
        data: data,
        success: function () {
          console.log("success");
          uni.showToast({
            title: self.$t('复制成功'),
            duration: 2000,
            position: "center",
            icon: "none",
          });
        },
      });
      // #endif
    },
    //打开领取弹框
    onReceive() {
      const self = this;
      if (this.isGet) {
        this.$refs.popup.open();
      } else {
        //禁用提示
        uni.showToast({
          icon: "none",
          title:
            self.$t('未满足领取要求，最低领取金额') +
            self.minCount +
            self.$t('元，有效会员人数≥') +
            self.minValidCount +
            self.$t('人，领取上限') +
            self.maxReceive +
            self.$t('元'),
        });
      }
    },
    //立即领取
    getItNow() {
      const self = this;
      this.$api.setReceive(
        {
          clientCode: this.$config.clientCode,
        },
        (err, res) => {
          console.log(err, res);
          if (res) {
            uni.showToast({
              title: self.$t('领取成功'),
              duration: 2000,
              position: "center",
              icon: "none",
            });
            this.onCancel();
            //刷新返利
            this.getMoneyF();
          } else {
            uni.showToast({
              title: err.msg,
              duration: 2000,
              position: "center",
              icon: "none",
            });
          }
        }
      );
    },
    onCancel() {
      this.$refs.popup.close();
    },
    goBack() {
      uni.navigateBacks();
    },
    toPage(url) {
      uni.navigateTo({
        url: url,
      });
    },
    memberAllowanceCount() {
      //会员个数
      var _this = this;
      this.$api.memberAllowanceCount(function (err, res) {
        if (err) {
        } else {
          _this.inviteMemberNum = res;
        }
      });
    },
    validMemberCount() {
      //有效会员个数
      var _this = this;
      this.$api.validMemberCount(function (err, res) {
        if (err) {
        } else {
          _this.validMember = Number(res.validMemberCount);

          _this.getMoneyF();
        }
      });
    },
  },
};
</script>

<style lang="scss">
.highmargin-Box {
  .alert-box {
    background: #ffffff;
    width: 80vw;
    border-radius: 8px;

    .popup-header {
      text-align: center;
      line-height: 90upx;
      color: #1d1717;
      font-weight: bold;
      font-size: 36rpx;
      padding-top: 10rpx;
    }

    .padding-xl {
      text-align: center;

      .money {
        color: #1d1717;
        font-size: 50rpx;
        line-height: 60rpx;
      }

      .money-text {
        color: #1d1717;
        font-size: 36rpx;
        line-height: 42rpx;
        margin-top: 8px;
      }
    }

    .btn-box {
      display: flex;
      justify-content: space-around;
      font-size: 30rpx;
      border-top: 1px solid #f4f4f4;
      margin-top: 24rpx;

      view {
        line-height: 90upx;
        flex: 1;
        text-align: center;
      }

      .cancel {
        color: #a7a7a7;
        border-right: 2upx solid #f4f4f4;
      }
    }
  }

  .content {
    /* #ifdef APP-PLUS */
    padding-top: calc(88upx + var(--status-bar-height));
    /* #endif */
    /* #ifdef H5 */
    padding-top: 88upx;
    /* #endif */
    background-color: #fff;

    .flex-fan {
      margin: 30rpx;
      padding: 20rpx;
      display: flex;
      align-items: center;
      border: 1px solid #ceb06e;
      border-radius: 13px;

      .text-box {
        flex-grow: 2;
      }

      .fan-img {
        width: 64rpx;
        height: 64rpx;
      }

      .text-zong {
        font-size: 30rpx;

        .refresh-img {
          width: 26rpx;
          height: 30rpx;
          margin-left: 10px;
        }
      }

      .text-money {
        font-size: 24rpx;
        line-height: 32upx;
      }

      .receive-but {
        font-size: 22rpx;
        width: 120upx;
        height: 50upx;
        border-radius: 50upx;
        background-color: #cd2b1e;
        color: #fff;
      }

      .disabledBtn {
        opacity: 0.3;
      }
    }

    .invite-member-box {
      padding: 0 16upx;
      box-sizing: border-box;
      background: #ffffff;
      height: 104upx;
      box-shadow: 0px 6upx 12upx rgba(0, 0, 0, 0.06);
      border-radius: 16upx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 32upx 32upx;

      > view {
        display: flex;
        align-items: center;

        .merber-img {
          width: 40upx;
          height: 40upx;
          margin-right: 16upx;
        }

        text {
          font-size: 30upx;
        }
      }

      .more-img {
        width: 40upx;
        height: 40upx;
      }
    }

    .img-box {
      display: flex;
      justify-content: center;

      .chess-img {
        width: 38rpx;
        height: 38rpx;
      }

      .frienfd-img {
        height: 136rpx;
      }
    }

    .card {
      background-size: 100% auto;
      background-repeat: no-repeat;
      margin: 30rpx;

      //
      .card-border {
        background-size: contain;
        background-repeat: no-repeat;
        width: 480upx;
        height: 480upx;
        margin: 100upx auto 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .code-img {
          width: 210px;
          height: 210px;
        }
      }

      .handle-box {
        display: flex;
        align-items: center;
        justify-content: center;

        .left-img {
          height: 6rpx;
          width: 72rpx;
        }

        .title {
          font-size: 32rpx;
          font-weight: 500;
          white-space: nowrap;
          line-height: 22px;
        }

        .right-img {
          height: 6rpx;
          width: 72rpx;
        }
      }

      .flex-img-box {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: -84px;

        .tai-img {
          width: 176rpx;
          height: 156rpx;
        }

        .grli-img {
          width: 230rpx;
          height: 276rpx;
        }

        .text-marging {
          margin-bottom: 20rpx;
          text-align: center;
        }

        .text-my {
          font-size: 36rpx;
          color: #ffffff;
          line-height: 1.2;
        }

        .text-code {
          line-height: 1.2;
          font-size: 28rpx;
          color: #ffffff;
        }
      }
    }

    .flex-btn {
      display: flex;
      justify-content: space-around;
      margin-top: 42rpx;

      .alt-btn {
        font-size: 30rpx;
        text-align: center;
        width: 40%;
        line-height: 40rpx;
        padding-top: 20rpx;
        padding-bottom: 20rpx;
      }

      .code-btn {
        font-size: 30rpx;
        text-align: center;
        width: 40%;
        line-height: 40rpx;
        padding-top: 20rpx;
        padding-bottom: 20rpx;
      }
    }

    .rule-text {
      text-align: center;
      margin: 50rpx 0rpx;
      font-size: 26rpx;

      .text-su {
        margin: 0 20rpx;
      }

      .line {
        display: inline-block;
        width: 250rpx;
        border-top: 1px solid #cccccc;
        vertical-align: middle;
      }
    }

    .explainStyle {
      padding: 32rpx;

      ::v-deep img {
        max-width: 100% !important;
      }
    }
  }

  .perHeader {
    width: 100%;
    /* #ifdef APP-PLUS */
    height: calc(88upx + var(--status-bar-height));
    /* #endif */
    /* #ifdef H5 */
    height: 88upx;
    /* #endif */
    color: var(--themeActTitleBg);
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 99;
    background-color: var(--themeActTopBg);

    .perHeaderReal {
      width: 100%;
      display: flex;
      align-items: center;
      height: 88upx;
      padding: 0 30upx;
      box-sizing: border-box;
      color: var(--themeActTitleBg);
      background-color: var(--themeActTopBg);
    }
  }

  .perHeaderReal view:nth-child(1) {
    width: 44upx;
    height: 44upx;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
  }

  .perHeaderReal view:nth-child(2) {
    flex: 1;
    font-size: 36upx;
    font-weight: bold;
    text-align: center;
  }

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
}
</style>
