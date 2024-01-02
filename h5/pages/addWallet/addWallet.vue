<!-- 
 页面：添加银行卡
 作者：丹泽尔
 -->
<template>
  <view class="conent pageBackground">
    <uni-nav-bar
      title="origo钱包"
      leftIcon="back"
      :status-bar="true"
      :fixed="true"
      :shadow="false"
      @clickLeft="BackPage"
    ></uni-nav-bar>

    <view class="addCardUl">
      <view class="uni-flex border-item">
        <view class="flex-item">
          <text class="name oneTitleColor8">{{ $t('origo钱包') }}</text>
        </view>
        <view class="flex-item-right">
          <input
            class="inputColor themeTextOne oneTitleColor8"
            :placeholder="labelName"
            placeholder-class="placeholder-class"
            v-model="bankData.number"
          />
        </view>
      </view>

      <view class="uni-flex border-item">
        <view class="flex-item">
          <text class="name oneTitleColor8">{{ $t('选择币种') }}</text>
        </view>
        <view class="flex-item-right">
          <view class="cu-item arrow" @click="onSetBank">
            <view class="content">
              <text class="text-grey oneTitleColor8">{{ bankCodeName }}</text>
              <image
                src="../../static/image/more.png"
                class="right-more"
                mode=""
              ></image>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="submit-view">
      <button class="but-submit" :disabled="successBtn" @click="submit()">
        {{ $t('确定添加') }}
      </button>
      <view class="app-dwa" @click="onOpenApp">
        {{ $t('点击这里')
        }}<text class="org">{{ $t('下载origo钱包') }}</text>
      </view>
    </view>

    <uni-popup ref="popup" type="bottom">
      <view class="select-p">
        <view class="header"> {{ $t('选择币种') }} </view>
        <view class="padding-xl">
          <view class="view-list" @click="getbank()">
            <text class="radio-item-text">USDT</text>
            <!-- <image src="../../static/image/select2.png" v-show="index == current" class="radio-item-img-activty" mode=""></image> -->
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";

export default {
  components: {
    uniPopup,
  },
  data() {
    return {
      labelName: this.$t('请输入origo钱包'),
      radioItems: [],
      bankCodeName: this.$t('请选择币种类型'),
      bankData: {
        account: "",
        name: "",
        branch: "",
        number: "",
        withdrawpassword: "",
        phone: "",
        sms_key: "",
        sms_code: "",
      },
      disabledBut: false,
      modeldata: "",
      bindPhone: 0,
      memberId: "",
      isLabel: 0,
      successBtn: false,
      current: 0,
    };
  },
  onShow() {
    const self = this
    this.$api.userInfo(this.$cache.get("set_user").user_id, (err, res) => {
      this.memberId = res.userId;
      this.bankData.phone = res.phone;
      if (res.realName) {
        this.bankData.account = res.realName;
      } else {
        uni.showModal({
          title: self.$t('提示'),
          content: self.$t('请填写真实姓名再添加银行卡'),
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log("用户点击确定");
              uni.navigateTo({
                url: "../personal/personal",
              });
            }
          },
        });
        return;
      }
      if (!res.withdrawPassWordState) {
        uni.showModal({
          title: self.$t('提示'),
          content: self.$t('请先设置取款密码再添加银行卡'),
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log("用户点击确定");
              uni.navigateTo({
                url: "../upPassword/upPassword?type=2&isPassWord=false",
              });
            }
          },
        });
        return;
      }
    });
  },
  methods: {
    onOpenApp() {
      // #ifdef H5
      window.open("https://website.origowallet.info", "_blank");
      // #endif
      // #ifdef APP-PLUS
      plus.runtime.openURL("https://website.origowallet.info");
      // #endif
    },
    BackPage() {
      uni.navigateBacks();
    },
    submit() {
      const self = this
      if (!this.bankData.number) {
        this.showToast(this.$t('请输入origo钱包'));
        return;
      }
      if (this.bankCodeName != "USDT") {
        this.showToast(this.$t('选择币种'));
        return;
      }
      var data = {
        account: this.bankData.account, //	银行卡账户名
        branch: "USDT", //	支行
        memberId: this.memberId, //	会员id
        name: "USDT", //	银行名称
        number: this.bankData.number, //卡号
        // #ifdef H5
        clientItem: window.childCode, //子平台id字段
        // #endif
        // #ifdef APP-PLUS
        clientItem: this.$config.childCode, //客户端id字段
        // #endif
        type: 2,
      };
      this.successBtn = true;
      this.$api.addbankcard(data, (err, res) => {
        this.successBtn = false;
        if (err) {
          let msg = err.msg;
          let code = err.code;
          this.showToast(msg + `(${code})`);
        }
        if (res) {
          uni.navigateBacks();
          uni.showToast({
            title: self.$t('添加成功'),
            duration: 2000,
            position: "center",
          });
        }
      });
    },
    onSetBank() {
      this.$refs.popup.open();
    },
    getbank() {
      this.bankCodeName = "USDT";
      this.$refs.popup.close();
    },
    showToast(title) {
      uni.showToast({
        title: title,
        duration: 2000,
        icon: "none",
        position: "center",
      });
    },
  },
};
</script>

<style lang="scss">
.app-dwa {
  text-align: center;
  font-size: 15px;
  margin-top: 10px;
  .org {
    color: #ebcc45;
  }
}
.select-p {
  background: #ffffff;
  .header {
    text-align: center;
    height: 90rpx;
    line-height: 90rpx;
  }
  .padding-xl {
    overflow: scroll;
    max-height: 300px;
    padding: 15px;
    .view-list {
      text-align: left;
      line-height: 3.5;
    }

    .radio-item-img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      vertical-align: middle;
    }

    .radio-item-text {
      width: 90%;
      text-align: left;
    }

    .radio-item-img-activty {
      width: 13px;
      height: 10px;
      margin-left: 46rpx;
    }
  }
}
.conent {
  border-top: 1px solid #f5f6f8;
}
.addCardUl {
  border-radius: 10px;
  background: #ffffff;
  margin: 30rpx;
}

.uni-flex {
  display: -webkit-flex;
  /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  line-height: 2;
}

.flex-item {
  flex-grow: 1;
  width: 28%;
  /* default 0 */
}

.flex-item-right {
  flex-grow: 3;
  width: 75%;
  align-items: center;
  justify-content: space-between;

  /* padding-top: 5px; */
  .sms-with {
    display: inline-block;
    width: 50%;
  }

  .flex-Code {
    text-align: right;
    // width: 40%;
    display: inline-block;
  }
}

.border-item {
  border-bottom: 1px solid var(--separator);
  padding: 32upx 16upx;
  display: flex;
  align-items: center;
}

.submit-view {
  width: 75%;
  position: fixed;
  left: 12%;
  bottom: 3%;
}

.but-submit {
  background: #ebcc45; //linear-gradient(to right, #F0C171, #F3DA9E);
  color: #1f1f1f;
  border-radius: 60rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
}

.visible-img {
  width: 26px;
  height: 16px;
}

.but-submit-code {
  color: #d6ae66;
  border: 1px solid #d6ae66;
  border-radius: 60rpx;
  padding: 0px 8px;
  height: 42rpx;
  line-height: 40rpx;
  text-align: center;
  font-size: 22rpx;
  background: #fff;
}

.tip-text {
  color: #f4333c;
  font-size: 22rpx;
  padding-left: 50rpx;
}

.bank-code {
  line-height: 4;
  border-bottom: 1px solid #f5f6f8;
}

.png {
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  padding-right: 5px;
}

.cu-item {
  display: inline-block;
}

.right-more {
  width: 13px;
  height: 13px;
  margin-left: 10px;
  vertical-align: middle;
}

.name {
  font-size: 30rpx;
  vertical-align: middle;
  color: var(--textOne);
  font-weight: 600;
}

button::after {
  border: none;
}

.text-grey {
  color: var(--textOne);
  font-size: 30rpx;
  vertical-align: middle;
  font-weight: 600;
}

.placeholder-class {
  font-size: 28rpx !important;
  color: var(--textTwo);
  font-weight: 500;
}
.disabledStyle {
  color: var(--textTwo) !important;
}

.uni-radio-input-checked {
  background-color: red !important;
}
</style>
<style></style>
