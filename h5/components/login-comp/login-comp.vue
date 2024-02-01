<template>
  <view class="login-comp">
    <view class="container">
      <view class="logRow logAccountNumber">
        <view class="iconcontainer">
          <view
            v-if="['kubet','choibet','phattai68','jun88'].includes(projectImgUrl)"
            class="icon"
            style="width: 32rpx;height: 32rpx;backgroundImage: url('../../static/image/qqImg/loginicon1.png');"
          ></view>
          <view v-else
            class="icon"
            style="width: 32rpx;height: 32rpx;backgroundImage: url('../../static/image/qqImg/loginicon11.png');"></view>
        </view>
        <input
          class="accountNumInput"
          type="text"
          :placeholder="$t('请输入账号')"
          v-model="accountNumber"
          placeholder-class="themeTextTwo"
          placeholder-style="font-size:30upx;"
          @blur="accountNumberBlurFn"
        />
      </view>

      <view class="logRow logPassword">
        <view class="iconcontainer">
          <view
            class="icon"
            v-if="['kubet','choibet','phattai68','jun88'].includes(projectImgUrl)"
            style="
              width: 32rpx;
              height: 32rpx;
              backgroundImage: url('../../static/image/qqImg/loginicon2.png');
            "
          ></view>
          <view
            class="icon"
            v-else
            style="
              width: 32rpx;
              height: 32rpx;
              backgroundImage: url('../../static/image/qqImg/loginicon22.png');
            "
          ></view>
        </view>
        <!-- 密码显示隐藏 -->
        <input
          type="password"
          :placeholder="$t('请输入登录密码')"
          placeholder-class="themeTextTwo"
          placeholder-style="font-size:30upx;"
          v-model="password"
          v-show="defaultType"
          @blur="passwordBlurFn"
        />
        <input
          type="text"
          :placeholder="$t('请输入登录密码')"
          placeholder-class="themeTextTwo"
          placeholder-style="font-size:30upx;"
          v-model="password"
          v-show="!defaultType"
          @blur="passwordBlurFn"
        />
        <view class="isVisible u-flex-all" @tap="switchVisible">
          <image
            :src="
              defaultType
                ? '../../static/image/qqImg/eyesNotVisible.png'
                : '../../static/image/qqImg/eyes.png'
            "
            mode="widthFix"
            lazy-load
          ></image>
        </view>
      </view>
      <view class="platform">
        <text class="pt-tips">{{ loginTipObj.title }}</text>
        <text class="pt-tips">{{ loginTipObj.content }}</text>
      </view>

      <view v-if="type === 0" class="codeContainer">
        <view class="logRow logverifyCode" style="margin: 0">
          <view class="iconcontainer">
            <view
              class="icon"
              style="
                backgroundImage: url('../../static/image/qqImg/loginicon3.png');
              "
            ></view>
          </view>
          <input
            type="text"
            :placeholder="$t('请输入图形验证码')"
            placeholder-class="themeTextTwo"
            placeholder-style="font-size:30upx;"
            v-model="verifyCode"
            @blur="verifyCodeBlurFn"
            @confirm="login()"
          />
        </view>
        <view
          class="verifyCode"
          :style="'background-image:url(' + verifyCodeImg + ')'"
          @tap="regainVerifyCode"
        >
          <view
            class="reGetDefaultStatus reGetVerifyCode"
            v-if="!getVerifyCodeFlag"
          >
            <image
              class="refreshImg"
              src="../../static/image/qqImg/refresh1.png"
              mode=""
            ></image>
            <text>{{ $t('重新获取') }}</text>
          </view>
        </view>
      </view>

      <!-- #ifdef H5 -->
      <!-- 行为校验  树莓 -->
      <view
        v-if="type === 2"
        id="captcha"
        class="loginBtn captchaStyle"
        @click="captchaClick"
        >{{ captchaText }}</view
      >
      <!--  行为验证 急眼 -->
      <view
        v-if="type === 1 && getCaptchaFlag == 1"
        id="captcha1"
        class="loginBtn"
      ></view>
	  <!--  行为验证 极验4 -->
	  <view v-if="type === 3" id="gt41" class="loginBtn mt-20"></view>
      <!-- #endif -->

      <!-- #ifdef APP-PLUS -->
      <GtView
        :gtShow="typeIsShow"
        v-if="type == 1"
        :type="gtType"
        @fromChild="getChildData"
        :text="gtText"
      ></GtView>
      <SmApp
        :gtShow="typeIsShow"
        v-if="type == 2"
        :type="gtType"
        @fromChild="getChildData"
        :smData="smData"
        :smText="gtText"
      ></SmApp>
	  <!-- 极验4 -->
	  <gt4-app v-if="type === 3" @fromChild="getChildData" :gtText.sync="gtText"></gt4-app>
      <!-- #endif -->

      <!-- getDefaultStatus接口请求错误 -->
      <view
        v-if="type === -1 || getCaptchaFlag === 0"
        class="loginBtn reGetDefaultStatus"
        @click="reGetHandler()"
      >
        <image
          class="refreshImg"
          src="../../static/image/qqImg/refresh1.png"
          mode=""
        ></image>
        <text>{{ $t('重新获取') }}</text>
      </view>

      <navigator
        class="forgetPsw"
        url="../../pages/forgetPsw/forgetPsw"
        hover-class="none"
        >{{ $t('忘记密码？') }}</navigator
      >
    </view>

    <!-- 登入按钮 -->
    <view
      class="submit-btn u-flex-all"
      style="margin-top: 40upx"
      @click="login"
      >{{ $t('登入') }}</view
    >

    <view class="bottom-box">
      <view class="left" @click="goBack">
        <image 
            v-if="['kubet','choibet','phattai68','jun88'].includes(projectImgUrl)"
             src="../../static/image/qqImg/wandering1.png" mode=""></image>
        <image v-else src="../../static/image/qqImg/wandering.png" mode=""></image>
        <text>{{ $t('随便逛逛') }}</text>
      </view>
      <!-- <view class="right">
        <image src="../../static/image/qqImg/computer.png" mode=""></image>
        <text>{{ $t('去电脑版') }}</text>
      </view> -->
    </view>

    <view v-if="validateStatus === 0" class="validateBox">
      <view class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <view class="header">
        <image
          src="../../static/image/qqImg/back1.png"
          mode=""
          @click="closeMask"
        ></image>
        {{ $t('异常验证') }}
      </view>
      <view class="tipText">
        {{ $t('系统检测到您的账户登录地区异常，请填写你的账户真实姓名进行验证！') }}
      </view>
      <view class="realName">
        <text>{{ $t('姓名') }}</text>
        <input type="text" :placeholder="$t('请输入姓名')" v-model="realName" />
      </view>
      <view
        class="submitValid submit-btn"
        :class="{ validDis: validIsDis }"
        @click="validateRealName"
        >{{ $t('提交验证') }}</view
      >
    </view>

    <tips :msg="modalData" @childFn="onchildFn"></tips>
    <view v-if="isShowVerifyIdentidy" class="verifyIdentidyBox">
      <verify-identidy
        @closeVerifyIden="closeVerifyIden"
        :accountNumber="accountNumber"
        @login="login"
      ></verify-identidy>
    </view>
  </view>
</template>

<script>
import verifyIdentidy from "../verify-identidy/verify-identidy";
import MyAes from "../../utils/myAes.js";
import tips from "../../components/tips/tips.vue";
// import { _getDeviceId } from "../../utils/finger.js";
// #ifdef  APP-PLUS
import GtView from "../tg/tg.vue";
import SmApp from "@/components/sm-app/sm-app.vue";
// #endif

// #ifdef  H5
import gt from "../../utils/gt.js";
import "../../utils/smcp.min.js";
import "../../utils/boc.js"
// #endif
export default {
  data() {
    return {
      isShowVerifyIdentidy: false,
      accountNumber: "",
      password: "",
      captchaKey: "", //验证码唯一key值
      verifyCode: "", //验证码值
      defaultType: true,
      errors: {},
      verifyCodeImg: "",
      projectImgUrl: this.$config.projectImgUrl,
      // 一开始禁用，只有都有内容时，解除禁用
      disabled: true,
      isClickLogin: true, //只有第一次登录生效，除非登录失败
      themePreBtnFlag: false, //按钮是否被点击（非禁用状态时的点击）
      window: window,
      modalData: {
        isShow: false,
        types: 1, //类型是带标题的弹窗、
        content: "",
        showCancel: false, //显示取消按钮
        confirmText: this.$t("确定"),
        success: 200, //100为取消  200为确定
      },
      loginJson: null,
      type: 0, //行为校验2
      captcha: null, //行为校验
      captchaBox: null,
      captchaText: "",
      captchaMask: false,
      getVerifyCodeFlag: true, //请求图片验证码（默认成功）
      getCaptchaFlag: -1,
      regRemove: true,
      validateStatus: -1, //默认Login异常
      validIsDis: true, //提交验证默认禁用
      realName: "",
      validateRealNameStatus: true,
      typeIsShow: false, //
      gtType: 0, //0登录
      appGtData: null,
      gtText: this.$t('点击按钮验证'),
      loginTipObj: {
		  title: '',
		  content: ''
	  },
      // 数美请求参数
      smData: {
        lang: "",
        mode: "",
        organization: "",
        product: "",
        appId: "",
        channel: "",
      },
    };
  },
  props: {
    urlType: "",
  },
  mounted() {
    this.getLoginTip();
    // #ifdef H5
    // 获取通过什么验证
    this.getDefaultStatus();
    // #endif

    this.platform = uni.getSystemInfoSync().platform;
    // #ifdef APP-PLUS
    let self = this;
    //获取验证码图片

    this.getDefaultStatus();

    uni.$on("fromChild0", function (data) {
      self.appGtData = data.postData;
    });
    uni.$on("fromChildRes0", function (data) {
      self.getDefaultStatusFlag = true;
      self.getDefaultStatusText = self.$t('重试');
    });
    // #endif
  },
  methods: {
    //关闭身份验证
    closeVerifyIden() {
      this.isShowVerifyIdentidy = false;
      this.validateStatus = -1;
    },
    getAutoJoinAct() {
      const userinfo = this.$cache.get("set_user");
      const req = [userinfo.user_id];
      this.$api.getAutoJoinAct(...req, (err, res) => {
        console.log(res);
      });
    },
    goBack() {
      uni.reLaunch({
        url: "../../pages/index/index",
      });
    },
    getChildData(v) {
      this.appGtData = v;
    },
    reGetHandler() {
      var _this = this;
      if (this.type == -1) {
        this.getDefaultStatus();
      } else if (_this.type === 1 && !this.getCaptchaFlag) {
        _this.disabled = false;
        this.reset();
      }
    },
    getLoginTip() {
      this.$api.loginTip((err, res) => {
        //setTimeout(()=>{
        this.loginTipObj = res.svalue || {};
        //},1000)
      });
    },
    // 获取   getDefaultStatus
    getDefaultStatus() {
      var _this = this;
      this.$api.getDefaultStatus(function (err, res) {
        if (res) {
          // type   0：默认验证码  1：极验  2：数美"
          _this.type = res.type;
          // _this.type = 2
          if (_this.type === 0) {
            //图片验证码
            //获取验证码图片
            _this.typeIsShow = false;
            _this.getVerifyCode();
          } else if (_this.type === 1 || _this.type === 3) {
            //1：极验
            _this.disabled = false;
            _this.typeIsShow = true;
            _this.reset();
          } else if (_this.type === 2) {
            //2：数美"
            _this.disabled = false;
            _this.typeIsShow = true;
            Object.assign(_this.smData, res);
            _this.reset();
          }
          // _getDeviceId(res.fingerprintId).then((ress) => {
          //   _this.$config.fingerprint = ress;
          //   uni.setStorageSync("fingerprint", ress);
          // });
        } else {
          //接口报错
          _this.type = -1;
        }
      });
    },
    //行为校验↓
    reset() {
      // #ifdef H5
      // 获取通过什么验证
      this.check();
      this.getCaptcha();
      // #endif
    },
    check() {
      if (this.captcha) {
        this.captchaText = "";
      } else {
        this.captchaText = this.$t("正在加载...");
      }
    },
    getCaptcha() {
      let lang = "vie";
      if (this.$config.locale == "en") {
        lang = "en";
      } else if (this.$config.locale == "id") {
        lang = "id";
      } else if (this.$config.locale == "zh_CN") {
        lang = "zh-cn";
      } else if (this.$config.locale == "zh_HK") {
        lang = "zh-hk";
      }
      if (this.type == 1) {
        let _this = this;
        this.$api.geetFirstRegister(window.childCode, function (err, res) {
          if (res) {
            _this.getCaptchaFlag = 1;

            window.initGeetest(
              {
                gt: res.gt,
                challenge: res.challenge,
                new_captcha: res.newCaptcha, // 用于宕机时表示是新验证码的宕机
                offline: res.success === 1 ? false : true, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                product: "float", // 产品形式，包括：float，popup
                width: "100%",
                lang: lang,
              },
              _this.onCaptcha
            );
          } else {
            //请求错误
            _this.getCaptchaFlag = 0;
          }
        });
      } else if (this.type == 2) {
        let data = {
          ...this.smData,
          width: 300,
          https: location.protocol == "https:",
        };
        initSMCaptcha(data, this.onCaptcha);
      }	else if (this.type === 3) {
		   console.log("lang======",lang)
			if (!this.captcha) {
				initBotion({
					captchaId: this.$config.captchaId(),//腾博会校验id
					product: 'popup',//float  popup
					language: lang,
					nativeButton: {
						width: '100%',
						height: '40px',
						
					}
				}, this.onCaptcha)
			}
		}

    },
    onCaptcha(res) {
      //res是验证实例，可以调用res的示例方法
      var _this = this;
      this.captcha = res;
      if (this.type == 1) {
        // #ifdef H5
        let captcha1 = document.querySelector("#captcha1");

        if (captcha1 && this.urlType * 1 === 0) {
          res.appendTo("#captcha1");
          res.onReady(_this.check);
        }
        // #endif
      } else if (this.type == 2) {
        this.captchaText = this.$t('点击验证');
        this.captcha.onSuccess(function (data) {
          if (data.pass) {
            _this.disabled = false;
            _this.captcha.rid = data.rid;
            _this.captchaText = this.$t('验证成功');
            _this.captchaMask = false;
          } else {
            _this.captcha.rid = null;
            _this.captchaText = this.$t('验证失败');
          }
        });

        this.captcha.onError(function (errType, errMsg) {
          _this.captcha.rid = null;
          _this.captchaText = this.$t('验证失败');
          _this.captchaMask = false;
        });

        this.captcha.onClose(function () {
          _this.captchaMask = false;
        });
      } else if (this.type === 3) {
			res.appendTo("#gt41");
	   }

    },
    captchaClick() {
      if (this.type == 2) {
        var result = this.captcha.getResult();
        var pass = result.pass;
        if (!pass) {
          this.captcha.verify();
          //行为验证bug:点击关闭按钮，会点击穿透
          //解决：手动再添加一个遮罩层
          this.captchaMask = true;
        }
      }
    },
    loginSet() {
      var _this = this;
      this.$api.getRegisterSet("member_login_tip", function (err, res) {
        if (res) {
          _this.loginJson = res.svalue;
        }
      });
    },
    accountNumberBlurFn(e) {
      this.accountNumber = e.detail.value;
      this.accountNumber = this.accountNumber.toLowerCase();
      this.accountNumber = this.accountNumber.replace(/\ /g, "");
    },
    passwordBlurFn(e) {
      this.password = e.detail.value;
      // this.password = this.password.toLowerCase();
      // this.password = this.password.replace(/\ /g, "");
    },
    verifyCodeBlurFn(e) {
      this.verifyCode = e.detail.value;
    },
    getVerifyCode(type) {
      //获取图片验证码
      var _this = this;
      this.$api.captcha(function (err, res) {
        if (err) {
          // console.log(err, '获取图片验证码失败');
          _this.getVerifyCodeFlag = false;
        } else {
          _this.getVerifyCodeFlag = true;
          // console.log(res, '获取图片验证码成功');
          _this.verifyCodeImg = res.captcha_image_content;
          _this.captchaKey = res.captchaKey;
          if (type == "errRefresh") {
            _this.isClickLogin = true;
          }
        }
      }, true);
    },
    regainVerifyCode(type) {
      //重新获取验证码
      this.getVerifyCode(type);
    },
    loginIsDisabled() {
      //实时监听accountNumber,password,verifyCode,判断登录按钮是否可以点击（是否禁用）
      if (this.type === 0) {
        if (this.accountNumber && this.password && this.verifyCode) {
          this.disabled = false;
          return;
        }
        this.disabled = true;
      }
    },
    // accountNumberIsValid() {
    // 	//账号校验
    // 	return (/^[a-zA-Z0-9]{4,20}$/).test(this.accountNumber);
    // },
    // passwordIsValid() {
    // 	//密码验证
    // 	return (/^[a-zA-Z0-9]{6,15}$/).test(this.password)
    // },
    accountNumberFocusFn(e) {
      this.accountNumber = e.target.value;
    },
    login(num) {
      if (num == 1) {
        this.validateStatus = 1;
      }
      // #ifdef H5
      let captcha1 = document.querySelector("#captcha1");
      // #endif
      var _this = this;
      if (_this.type != 0) {
        if (!_this.accountNumber) {
          uni.showToast({
            icon: "none",
            title: this.$t('账号不能为空'),
            duration: 3000,
          });
          return;
        } else if (!_this.password) {
          uni.showToast({
            icon: "none",
            title: _this.$t('密码不能为空'),
            duration: 3000,
          });
          return;
        }
      }

      //行为校验
      let result;
      // #ifdef H5
      if (this.type != 0) {
        result = this.captcha.getValidate();

        if (!result) {
          uni.showToast({
            icon: "none",
            title: this.$t('请先通过行为验证'),
          });
          return;
        }
      }
      // #endif
      // #ifdef APP-PLUS
      if (this.type != 0) {
        result = this.appGtData;

        if (!result) {
          uni.showToast({
            icon: "none",
            title: this.$t('请先通过行为验证'),
          });
          return;
        }
      }
      // #endif

      _this.errors = {};
      //禁用
      if (_this.disabled) {
        return;
      }
      //
      _this.themePreBtnFlag = true;

      //密码加密
      var aseKey = "pigxpigxpigxpigx"; //秘钥
      // Encrypt 加密
      let encodePassword = MyAes.encrypt(this.password, aseKey);
      // console.log(encodePassword)
      // Decrypt 解密
      // let decodePassword = MyAes.decrypt(encodePassword, aseKey);
      // console.log('解密后' + decodePassword);

      // if (!this.isClickLogin) {
      // 	return;
      // }

      this.isClickLogin = false;

      if (this.validateStatus === -1) {
        //登录异常验证
        this.validateLogin(encodePassword);
        return;
      }

      var data = {
        name: this.accountNumber,
        password: encodePassword,
        validateType: this.type,
        lastLoginVersion: this.$config.loginVersion,
        fingerprint: this.$config.fingerprint,
        phoneModel: this.$config.phoneModel,
      };

      if (this.type === 1) {
        let geetest_challenge,
          geetest_seccode,
          geetest_validate = null;
        // #ifdef H5
        geetest_challenge = result.geetest_challenge;
        geetest_seccode = result.geetest_seccode;
        geetest_validate = result.geetest_validate;
        // #endif
        // #ifdef APP-PLUS
        if (this.platform === "ios") {
          geetest_challenge = result.result.geetest_challenge;
          geetest_seccode = result.result.geetest_seccode;
          geetest_validate = result.result.geetest_validate;
        } else {
          geetest_challenge = result.geetest_challenge;
          geetest_seccode = result.geetest_seccode;
          geetest_validate = result.geetest_validate;
        }
        // #endif

        console.log(result, 222222222222222222);
        data.geeTestQueryVO = {
          challenge: geetest_challenge,
          seccode: geetest_seccode,
          validate: geetest_validate,
        };
      } else if (this.type === 2) {
        data.shuMeiQueryVO = {
          rid: result.rid,
        };
      } else if (this.type === 0) {
        data.captchaKey = this.captchaKey;
        data.captchaCode = this.verifyCode;
      } else if (this.type === 3) {
			data.geeTestQueryVO = result
	  }


      //login账号处理(+login异常账号处理)
      // #ifdef H5
      if (window.mergeAccount) {
        data.name = this.accountNumber + window.mergeAccount;
      }
      // #endif
      // #ifdef APP-PLUS
      if (this.$config.mergeAccount) {
        data.name = this.accountNumber + this.$config.mergeAccount;
      }
      //#endif

      this.$api.login(
        data,
        function (err, res) {
          if (err) {
            _this.validateStatus = -1;
            uni.showToast({
              icon: "none",
              title: err.msg,
              duration: 3000,
            });
            setTimeout(function () {
              // #ifdef H5
              //重置行为校验
              if (_this.type === 1) {
                captcha1.innerHTML = "";
              }
              _this.getDefaultStatus();
              // #endif
              // #ifdef APP-PLUS
              if (_this.type === 1) {
                _this.appGtData = null; //
                _this.gtText = this.$t('点击按钮验证');
              }
              _this.getDefaultStatus();
              // #endif
              _this.themePreBtnFlag = false;
            }, 3000);
          } else {
            // _this.getAutoJoinAct()
            // console.log(res, '登录成功');
            uni.showToast({
              icon: "none",
              title: _this.$t('登录成功'),
              duration: 3000,
            });
            setTimeout(()=>{
              // #ifdef  H5
              // 新版
              maskAppToNative("login");
              //老版
              maskAppOldToNative("login");
              // #endif
              // #ifdef  H5
              if(localStorage.getItem('fbPixelId') && window.fbq){
                fbq('trackCustom', 'h5-login',{username:res.username})
              }
              sessionStorage.setItem("pullKingShow", false);
              // #endif
              // #ifdef APP-PLUS
              _this.$store.commit("advertisingShow", false);
              // #endif
            },3000)

            if (res.firstLogin) {
              _this.modalData.content = _this.$t('您的登录密码已确认，请及时修改密码，以防泄露！');
              _this.modalData.isShow = true;
            } else {
              uni.navigateTo({
                url: "../index/index",
                success: function () {
                  uni.$emit("update", {
                    msg: _this.$t('页面更新'),
                  });

                  _this.themePreBtnFlag = false;
                },
              });
            }
          }
        },
        true
      );
    },
    //弹窗操作
    onchildFn(e) {
      if (e === 200) {
        uni.navigateTo({
          url: "../index/index",
          success: function () {
            uni.$emit("update", {
              msg: _this.$t('页面更新'),
            });
          },
        });
      } else {
        this.modalData.isShow = false;
      }
    },
    switchVisible() {
      this.defaultType = !this.defaultType;
    },
    toCustomerService() {
      uni.navigateTo({
        url: "../customerService/customerService",
      });
    },
    //先去逛逛
    firstLook() {
      uni.navigateTo({
        url: "../index/index",
      });
      //测试缺省页
    },
    closeMask() {
      this.validateStatus = -1;
    },
    validateLogin(encodePassword) {
      var _this = this;
      var data = {
        name: _this.accountNumber,
        password: encodePassword,
        fingerprint: this.$config.fingerprint,
      };
      //账号处理
      // #ifdef H5
      if (window.mergeAccount) {
        data.name = this.accountNumber + window.mergeAccount;
      }
      // #endif
      // #ifdef APP-PLUS
      if (this.$config.mergeAccount) {
        data.name = this.accountNumber + this.$config.mergeAccount;
      }
      // #endif

      this.$api.validateLogin(data, function (err, res) {
        if (err) {
          uni.showToast({
            icon: "none",
            title: err.msg,
          });
          // #ifdef H5
          //重置行为校验
          if (_this.type === 1) {
            captcha1.innerHTML = "";
          }
          _this.getDefaultStatus();
          // #endif
          // #ifdef APP-PLUS
          if (_this.type === 1) {
            _this.appGtData = null; //
            _this.gtText = _this.$t('点击按钮验证');
          }
          _this.getDefaultStatus();
          // #endif
        } else {
          // res.validateStatus = false
          // res.validateWay = "device"
          if (res.validateStatus) {
            _this.validateStatus = 1;
            _this.isShowVerifyIdentidy = false;
            //无异常
            _this.login();
          } else {
            if (res.validateWay == "ip") {
              _this.validateStatus = 0;
            } else {
              _this.validateStatus = 1;
            }
            if (res.validateWay == "device") {
              _this.isShowVerifyIdentidy = true;
            }
          }
        }
      });
    },
    validateRealName() {
      var _this = this;
      let data = {
        name: _this.accountNumber,
        realName: _this.realName,
      };
      //账号处理
      // #ifdef H5
      if (window.mergeAccount) {
        data.name = this.accountNumber + window.mergeAccount;
      }
      // #endif
      // #ifdef APP-PLUS
      if (this.$config.mergeAccount) {
        data.name = this.accountNumber + this.$config.mergeAccount;
      }
      // #endif

      this.$api.validateRealName(data, function (err, res) {
        if (err) {
          uni.showToast({
            icon: "none",
            title: err.msg,
          });
        } else {
          _this.validateRealNameStatus = res.validateStatus;
          if (_this.validateRealNameStatus) {
            //验证通过
            _this.login();
          } else {
            uni.showToast({
              icon: "none",
              title: _this.$t("您的验证信息错误，还有{surplusCount}次验证机会，超过次数会冻结账号哦！", { surplusCount: res.surplusCount }),
            });
          }
        }
      });
    },
  },
  watch: {
    //实时监听，判断登录按钮是否解除禁用
    accountNumber(newVal) {
      this.loginIsDisabled();
    },
    password(newVal) {
      this.loginIsDisabled();
    },
    verifyCode(newVal) {
      if (this.type === 0) {
        this.loginIsDisabled();
      }
    },
    realName() {
      this.validIsDis = false;
    },
  },
  components: {
    verifyIdentidy,
    // #ifdef  APP-PLUS
    GtView,
    SmApp,
    // #endif
  },
};
</script>

<style lang="scss">
.login-comp {
  .container {
    background: var(--loginFromBg);
    border-radius: 8upx;
    padding: var(--loginPd);
    border: 1px solid transparent;
    border-image: var(--loginborderBg);
    border-image-slice: 1;
    position: relative;

    .logRow {
      width: 100%;
      height: 76rpx;
      margin-top: 32rpx;
      border-radius: 44rpx;
      line-height: 76rpx;
      display: flex;
      align-items: center;
      background-color: var(--loginInput);
      border: var(--loginInputBoder);
      color: var(--loginInputColor);
    }

    input {
      /* color: #fff; */
    }

    .iconcontainer {
      width: 76rpx;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .icon {
      width: 32rpx;
      height: 32rpx;
      background-size: 100% 100%;
    }

    .logRow input {
      flex: 1;
      height: 100%;
    }

    .platform {
      width: 600upx;
      margin-top: 30upx;
      opacity: 0.6;

      .pt-tips {
        font-size: 24upx;
        color: #fff;
      }

      .pt-tips:first-child {
        color: #deb549;
      }
    }

    .accountNumInput {
      flex: none !important;
      width: calc(100% - 176upx);
    }

    .logPassword {
      position: relative;
    }

    .logPassword input {
      box-sizing: border-box;
    }

    .logPassword .isVisible {
      width: 88upx;
      height: 100%;
      /*防止手指点击时，触发input框*/
      z-index: 999;
    }

    .logPassword .isVisible image {
      width: 44upx;
      height: 28upx;
      object-fit: cover;
      flex-shrink: 0;
    }

    .codeContainer {
      width: 100%;
      height: 76rpx;
      position: relative;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
    }

    .logverifyCode {
      min-width: 362rpx;
      width: calc(100% - 260upx);
    }

    .logverifyCode input {
      box-sizing: border-box;
    }

    .codeContainer .verifyCode {
      width: 228rpx;
      height: 76rpx;
      background-size: 100% 100%;
      border-radius: 10rpx;

      .reGetVerifyCode {
        height: 100%;
        margin-top: 0;
        border-radius: 10rpx;
      }
    }

    .loginBtn {
      height: 80upx;
      font-size: 30upx;
      border-radius: 40upx;
      color: #fff;
    }

    .reGetDefaultStatus {
      background-color: #fff;
      border-radius: 8upx;
      margin-top: 32upx;
      color: #6c716b;
      font-size: 32upx;
      display: flex;
      justify-content: center;
      align-items: center;

      .refreshImg {
        width: 40upx;
        height: 40upx;
        vertical-align: middle;
      }
    }

    #captcha1 {
      width: 100%;
      height: 88upx;
      background-color: #fff;
      border-radius: 4upx;
      margin-top: 32upx;
    }

    .forgetPsw {
      padding: 0 30upx;
      margin-top: 32upx;
      font-size: 28upx;
      text-align: right;
      color: #ff615a;
    }
  }

  .submit-btn {
    height: 80upx;
    margin: 50upx 0 160upx;
    font-size: 28upx;
    border-radius: 50upx;
    border: none;
    background: var(--loginBtn);
    color: #fff;
  }

  .bottom-box {
    display: flex;

    > view {
      flex: 1;
      padding: 5px;
      border-radius: 0;
      color: var(--loginInputColor);
      font-size: 26upx;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      box-sizing: border-box;

      image {
        width: 54upx;
        height: 54upx;
        margin-right: 14upx;
        vertical-align: middle;
      }
    }

    .right {
      border-left: 1px solid #fff;
    }
  }

  .validateBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    z-index: 999;

    .header {
      height: 80upx;
      line-height: 80upx;
      text-align: center;
      background-color: #fff;
      position: relative;
      font-size: 36upx;
      font-weight: bold;
      color: #1d1717;

      image {
        position: absolute;
        top: 50%;
        left: 30upx;
        transform: translateY(-50%);
        width: 44upx;
        height: 44upx;
      }
    }

    .tipText {
      font-size: 26upx;
      font-weight: 500;
      line-height: 36upx;
      color: #7d7d7d;
      padding: 20upx 30upx;
    }

    .realName {
      background-color: #fff;
      padding: 32upx 30upx;
      display: flex;
      align-items: center;

      text {
        width: 180upx;
        font-size: 30upx;
        font-weight: bold;
      }

      input {
        flex: 1;
      }
    }

    .submitValid {
      margin: 56upx 30upx;
      width: 690upx;
      height: 88upx;
      text-align: center;
      line-height: 88upx;
      font-size: 30upx;
    }

    .validDis {
      opacity: 0.5;
    }
  }

  .verifyIdentidyBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    z-index: 999;
  }
}
</style>
