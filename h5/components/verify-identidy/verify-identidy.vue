<template>
  <view class="verify-identidy-layout">
    <uni-nav-bar
      :title="$t('验证身份')"
      @clickLeft="close"
      :fixed="true"
      :statusBar="true"
    >
      <block slot="left">
        <view>
          <image
            class="close-img"
            src="/static/image/verify/close@2x.png"
            mode=""
          ></image>
        </view>
      </block>
    </uni-nav-bar>
    <view class="content-box">
      <view class="start-verify" v-if="showStep === 1">
        <image
          class="content-img"
          src="/static/image/verify/sigh@2x.png"
          mode=""
        ></image>
        <view class="content-text1">{{ $t('安全验证') }}</view>
        <view class="content-text2">{{ $t('您正在一台新设备登录，为了您的账号安全，请进行安全验证。') }}</view>
        <view class="verify-btn" @tap="showStep = 2">{{
          $t('开始验证')
        }}</view>
      </view>
      <view class="verify-phone" v-if="showStep === 2">
        <view v-if="!showSuccessModel">
          <!-- 手机号 -->
          <view class="regRow">
            <input
              type="number"
              v-model.number="phone"
              :placeholder="$t('请输入您绑定的手机号')"
              maxlength="11"
              placeholder-class="themeTextTwo"
              @blur="commonblurFn($event, 'phone')"
            />
          </view>
          <!-- 短信驗證碼 -->
          <view class="regRow sms-input">
            <input
              type="text"
              :placeholder="$t('请输入短信验证码')"
              placeholder-class="themeTextTwo"
              v-model="smsCode"
              @blur="verifyCodeBlurFn"
            />
            <view class="smsCode" @tap="getPhoneCode">{{
              count == 0 ? $t('获取验证码') : count + "S"
            }}</view>
          </view>
          <view class="verify-btn" @tap="verify">{{ $t('确定') }}</view>
        </view>
        <view v-else>
          <image
            class="success-img"
            src="/static/image/verify/success2@2x.png"
            mode=""
          ></image>
          <view class="success-text">{{ $t('校验成功') }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    accountNumber: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showSuccessModel: false,
      showStep: 1,
      count: 0,
      phone: "",
      smsCode: "",
      timer: null,
      text1: "",
    };
  },
  onLoad() {},
  methods: {
    close() {
      this.$emit("closeVerifyIden");
      this.showSuccessModel = false;
      this.showStep = 1;
      this.phone = "";
      this.smsCode = "";
    },
    verify() {
      const self = this
      if (!this.phone) {
        uni.showToast({
          icon: "none",
          title: self.$t('请输入手机号码'),
        });
        return;
      }
      if (this.phone && !/^1[3456789]\d{9}$/.test(this.phone)) {
        uni.showToast({
          icon: "none",
          title: self.$t('手机格式不正确'),
        });
        return;
      }
      if (!this.smsCode) {
        uni.showToast({
          icon: "none",
          title: self.$t('短信验证码不能为空！'),
        });
        return;
      }
      let params = {
        mobile: this.phone,
        name: this.accountNumber,
        smsCode: this.smsCode,
        fingerprint: this.$config.fingerprint,
        phoneModel: this.$config.phoneModel,
      };
      this.$api.checkValidateSmsCode(
        params,
        (err, res) => {
          if (err) {
            uni.showToast({
              icon: "none",
              title: err.msg,
            });
          } else {
            this.showSuccessModel = true;
            setTimeout(() => {
              this.close();
              this.$emit("login", "1");
            }, 1000);
          }
        },
        false
      );
    },
    getPhoneCode() {
      const self = this
      if (!this.phone) {
        uni.showToast({
          icon: "none",
          title: self.$t('请输入手机号码'),
        });
        return;
      }
      if (this.phone && !/^1[3456789]\d{9}$/.test(this.phone)) {
        uni.showToast({
          icon: "none",
          title: self.$t('手机格式不正确'),
        });
        return;
      }
      //获取短信验证码
      const TIME_COUNT = 59;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
        let params = {
          mobile: this.phone,
          name: this.accountNumber,
        };
        //手机验证码接口
        this.$api.sendValidateSmsCode(
          params,
          (err, res) => {
            if (err) {
              uni.showToast({
                icon: "none",
                title: err.msg,
              });
              clearInterval(this.timer);
              this.timer = null;
              this.count = 0;
            } else {
              uni.showToast({
                title: self.$t('获取验证码成功'),
                icon: "none",
              });
            }
          },
          false
        );
      }
    },
    verifyCodeBlurFn(e) {
      this.smsCode = e.detail.value;
    },
    commonblurFn(e, key) {
      this[key] = e.detail.value;
    },
  },
};
</script>

<style lang="scss" scoped>
.verify-identidy-layout ::v-deep .uni-navbar__header {
  width: 100%;
  height: 100upx;
  line-height: 100upx;
  text-align: center;
  background-color: #ffffff;
  font-weight: 700;
  color: #333333;
  font-size: 18px;
}
.verify-identidy-layout {
  width: 100%;
  height: 100%;
  .uni-navbar {
    height: 100upx;
  }
  .close-img {
    width: 40upx;
    height: 40upx;
  }
  .content-box {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #000;
    .verify-btn {
      position: absolute;
      top: 860upx;
      left: 50%;
      transform: translateX(-50%);
      bottom: 200upx;
      width: 540upx;
      height: 80upx;
      line-height: 80upx;
      background-color: #fce961;
      background-image: linear-gradient(#deb549, #fce961);
      border-radius: 10upx;
      font-weight: 700;
      color: #000;
      font-size: 18px;
      text-align: center;
    }
    .start-verify {
      .content-img {
        width: 280upx;
        height: 280upx;
        margin-top: 100upx;
      }
      .content-text1 {
        font-weight: 700;
        color: #fff;
        font-size: 30px;
        margin-top: 50upx;
      }
      .content-text2 {
        width: 100%;
        padding: 0 92upx;
        text-align: left;
        color: #fff;
        font-size: 14px;
        line-height: 40upx;
        margin-top: 40upx;
      }
    }
    .verify-phone {
      padding-top: 60upx;
      /*  #ifdef  APP-PLUS  */
      padding-top: 140upx;
      /*  #endif  */
      .regRow {
        width: 100%;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        margin-bottom: 30upx;
        input {
          margin: 0 auto;
          width: 540upx;
          height: 80upx;
          font-size: 14px;
          box-sizing: border-box;
          background-color: #282828;
          color: #fff;
          border-radius: 160upx;
          border: 1px solid #464646;
          text-align: left;
          padding-left: 40upx;
        }
      }
      .sms-input {
        width: 540upx;
        margin: 0 auto;
        input {
          width: 320upx;
          margin-left: -4upx;
        }
        .smsCode {
          width: 160upx;
          height: 80upx;
          line-height: 80upx;
          background-color: #fce961;
          background-image: linear-gradient(#deb549, #fce961);
          border-radius: 160upx;
          font-weight: 700;
          font-size: 12px;
          color: #000;
          text-align: center;
        }
      }
      .success-img {
        width: 280upx;
        height: 280upx;
        margin-top: 100upx;
      }
      .success-text {
        margin-top: 40upx;
        color: #fff;
        font-weight: 700;
        font-size: 24px;
      }
    }
  }
}
</style>
