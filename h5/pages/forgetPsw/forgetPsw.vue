<!-- 登录页面  by 琦琦-->
<template>
  <view class="LoginContainer">
    <view class="perHeader">
      <view class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <view class="perHeaderReal">
        <view style="backgroundImage: url('../../static/image/qqImg/bankback.png')" @tap="goBack"></view>
        <view>{{ $t('忘记密码') }}</view>
      </view>
    </view>

    <view class="loginInner">
      <view class="Login">
        <!-- 第一步 -->
        <view v-show="forPswArticle == 1">
          <view class="f-title">
            <view class="first-article">{{$t('第一步:验证账号信息') }}</view>
          </view>

          <view class="logRow logAccountNumber">
            <view class="iconcontainer">
              <view class="icon" style="backgroundImage: url('../../static/image/qqImg/loginicon1.png')"></view>
            </view>
            <input
              class="accountNumInput"
              type="text"
              :placeholder="$t('请输入账号')"
              v-model="accountNumber"
              placeholder-class="placeholder-color"
              placeholder-style="font-size:30upx;"
              @blur="accountNumberBlurFn"
            />
          </view>
          <view v-if="getDefaultStatusFlag" class="btnBoxType" @click="getDefaultStatusTap()">
            <view class="btnBoxTypeBox">
              <image class="btnShua" src="../../static/image/qqImg/refresh1.png" mode="widthFix"></image>
              <view class="getDefaultStatusText">
                {{ getDefaultStatusText }}
              </view>
            </view>
          </view>
          <view v-else class="">
            <view v-show="type === 0" class="codeContainer">
              <view class="logRow logverifyCode" style="margin: 0">
                <view class="iconcontainer">
                  <view class="icon" style="backgroundImage: url('../../static/image/qqImg/loginicon3.png')"></view>
                </view>
                <input
                  type="text"
                  :placeholder="$t('请输入图形验证码')"
                  placeholder-class="placeholder-color"
                  placeholder-style="font-size:30upx;"
                  v-model="verifyCode"
                  @blur="verifyCodeBlurFn"
                  @confirm="submit()"
                />
              </view>
              <view class="verifyCode" :style="'background-image:url(' + verifyCodeImg + ')'" @tap="regainVerifyCode"> </view>
            </view>
            <!-- #ifdef APP-PLUS -->
				<GtView :gtShow='typeIsShow' v-if="type==1" :type='gtType' @fromChild="getChildData" :text="gtText"></GtView>
				<SmApp :gtShow='typeIsShow' v-if="type==2" :type='gtType' @fromChild="getChildData" :smData="smData" :smText="gtText"></SmApp>
				<!-- 极验4 -->
				<gt4-app v-if="type === 3" @fromChild="getChildData" :gtText.sync="gtText"></gt4-app>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <!-- 行为校验  树莓 -->
            <view v-show="type === 2 && forPswArticle === 1" id="captcha" class="loginBtn captchaStyle" @click="captchaClick">{{
              captchaText
            }}</view>
            <!--  行为验证 急眼 -->
            <view v-show="type === 1 && forPswArticle === 1" id="captcha3" class="loginBtn captchaStyle"></view>
			<!--  行为验证 极验4 -->
			<view v-if="type === 3" id="gt42" class="loginBtn1 mt-20"></view>
            <!-- #endif -->
          </view>

          <view class="logHelp customerService btnTextColor fontWhite8">
            {{$t('忘记密码？请联系')}}<text @tap="toCustomerService">{{$t('在线客服')}}</text>
          </view>

          <view class="loginBtn u-flex-all" @tap="submit()">{{$t('确认提交')}}</view>
        </view>

        <!-- 第二步 -->
        <view v-show="forPswArticle == 2">
          <view class="f-title">
            <view class="first-article">{{$t('第二步:短信验证')}}</view>
          </view>

          <view class="logRow logAccountNumber">
            <view class="iconcontainer">
              <view class="icon" style="backgroundImage: url('../../static/image/qqImg/loginicon1.png')"></view>
            </view>
            <view>{{ myAccount }}</view>
          </view>

          <view class="codeContainer phoneCodeContainer">
            <view class="logRow logverifyCode phoneVerifyCode" style="margin: 0">
              <view class="iconcontainer">
                <view class="icon" style="backgroundImage: url('../../static/image/qqImg/loginicon3.png')"></view>
              </view>
              <input
                type="text"
                :placeholder="$t('请输入短信验证码')"
                placeholder-class="placeholder-color"
                placeholder-style="font-size:30upx;"
                v-model="phoneCode"
                @blur="verifyCodeBlurFn"
                @confirm="submit()"
              />
            </view>
            <view class="verifyCode" :class="!isDisable ? 'themeColor' : 'disabledPhone'" @tap="getPhoneCode">{{
              count == 0 ? $t('获取验证码') : count + "S"
            }}</view>
          </view>

          <view class="logHelp customerService btnTextColor fontWhite8">
            {{$t('忘记密码？请联系')}}<text @tap="toCustomerService">{{$t('在线客服')}}</text>
          </view>

          <view class="loginBtn u-flex-all" @tap="submit()">{{$t('确认提交')}}</view>
        </view>

        <!-- 第三步 -->
        <template v-if="forPswArticle == 3">
          <view class="f-title">
            <view class="first-article">{{$t('第三步:修改新密码')}}</view>
          </view>
          <view class="logRow logPassword">
            <view class="iconcontainer">
              <view
                class="icon"
                style="width: 24rpx; height: 32rpx; backgroundImage: url('../../static/image/qqImg/loginicon2.png')"
              ></view>
            </view>
            <!-- 密码显示隐藏 -->
            <input
              type="password"
              :placeholder="$t('请输入新密码')"
              placeholder-class="placeholder-color"
              placeholder-style="font-size:30upx;"
              v-model="password"
              v-show="defaultType"
              @blur="passwordBlurFn"
            />
            <input
              type="text"
              :placeholder="$t('请输入新密码')"
              placeholder-class="placeholder-color"
              placeholder-style="font-size:30upx;"
              v-model="password"
              v-show="!defaultType"
              @blur="passwordBlurFn"
            />
            <view class="isVisible u-flex-all" @tap="switchVisible">
              <image
                :src="defaultType ? '../../static/image/qqImg/eyesNotVisible.png' : '../../static/image/qqImg/eyes.png'"
                mode="widthFix"
                lazy-load
              ></image>
            </view>
          </view>

          <view class="logRow logPassword">
            <view class="iconcontainer">
              <view
                class="icon"
                style="width: 24rpx; height: 32rpx; backgroundImage: url('../../static/image/qqImg/loginicon2.png')"
              ></view>
            </view>
            <!-- 确认密码显示隐藏 -->
            <input
              type="password"
              :placeholder="$t('请再次输入新密码')"
              placeholder-class="placeholder-color"
              placeholder-style="font-size:30upx;"
              v-model="confirmPsw"
              v-show="confirmPswDefaultType"
              @blur="confirmPswBlurFn"
              @confirm="submit()"
            />
            <input
              type="text"
              :placeholder="$t('请再次输入新密码')"
              placeholder-class="placeholder-color"
              placeholder-style="font-size:30upx;"
              v-model="confirmPsw"
              v-show="!confirmPswDefaultType"
              @blur="confirmPswBlurFn"
              @confirm="submit()"
            />
            <view class="isVisible u-flex-all" @tap="cSwitchVisible">
              <image
                :src="confirmPswDefaultType ? '../../static/image/qqImg/eyesNotVisible.png' : '../../static/image/qqImg/eyes.png'"
                mode="widthFix"
                lazy-load
              ></image>
            </view>
          </view>

          <view class="logHelp customerService btnTextColor fontWhite8">
            {{$t('忘记密码？请联系')}}<text @tap="toCustomerService">{{$t('在线客服')}}</text>
          </view>

          <view class="loginBtn u-flex-all" @tap="submit()">{{$t('确认提交')}}</view>
        </template>
      </view>
    </view>

    <!-- 退出登录弹窗-->
    <uni-popup ref="popup" type="center" @tap.stop>
      <view class="chuiLei-container">
        <view class="title u-flex-all">{{$t('温馨提示')}}</view>
        <view class="content u-flex-all">{{ modalData.content }}</view>
        <view class="bottom-box">
          <view class="cancelBtn" @click="toIndex" v-if="modalData.showCancel">{{$t('去首页')}}</view>
          <view class="confirmBtn" @click="onchildFn">{{ modalData.confirmText }}</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import MyAes from "../../utils/myAes.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
// #ifdef  APP-PLUS
import GtView from "../../components/tg/tg.vue";
import SmApp from '@/components/sm-app/sm-app.vue'
// #endif

// #ifdef  H5
import gt from "../../utils/gt.js";
import "../../utils/smcp.min.js";
import "../../utils/boc.js"
// #endif
export default {
  data() {
    return {
      accountNumber: "",
      password: "",
      confirmPsw: "",
      captchaKey: "", //验证码唯一key值
      verifyCode: "", //验证码值
      defaultType: true,
      confirmPswDefaultType: true,
      verifyCodeImg: "",
      // 一开始禁用，只有都有内容时，解除禁用
      disabled: true,
      isClickLogin: true, //只有第一次登录生效，除非登录失败
      themePreBtnFlag: false, //按钮是否被点击（非禁用状态时的点击）
      window: window,
      modalData: {
        content: "",
        showCancel: false, //显示取消按钮
        confirmText: "",
        success: 200, //100为取消  200为确定
      },
      forPswArticle: 1, //找回密码的步骤（第一步...）
      phone: "15618001111",
      phoneCode: "",
      count: 0,
      isDisable: false, //禁止再次发送短信验证码
      timer: null,
      pDisabled: true, // 短信验证，禁止提交
      pswDisabled: true, //修改密码，禁止提交
      themePreBtnFlag2: false,
      themePreBtnFlag3: false,
      memberId: "",
      timerId: null,
      countSec: 0,
      handLoginFlag: false,
      type: 2, //行为校验2
      captcha: null, //行为校验
      captchaBox: null,
      captchaText: "",
      captchaMask: false,
      typeIsShow: false, //
      gtType: 2, //找回密码
      appGtData: null,
      gtText: this.$t('点击按钮验证'),
      platform: null,
      getDefaultStatusFlag: true, //获取类型开关
      getDefaultStatusText: this.$t('获取中'),
      getCodeFlag: false, //获取验证码开关
      getCodeText: this.$t('重新获取'),
      myAccount: '', // 获取验证码时需要的账号
      // 数美请求参数
      smData: {
        lang: '',
        mode: '',
        organization: '',
        product: '',
        appId: '',
        channel: '',
      }
    };
  },
  onLoad() {
    this.platform = uni.getSystemInfoSync().platform;
    // #ifdef APP-PLUS
    let self = this;
    //获取验证码图片
    this.getDefaultStatus();
    uni.$on("fromChild2", function (data) {
      self.appGtData = data.postData;
      console.log("监听到事件来自 update ，携带参数 msg 为：" + data.postData);
    });
    uni.$on("fromChildRes2", function (data) {
      self.getDefaultStatusFlag = true;
      self.getDefaultStatusText = "重试";
      console.log("监听到事件来自 update ，携带参数 msg 为：" + data.postData);
    });

    // #endif
    // #ifdef H5
    // 获取通过什么验证
    this.getDefaultStatus();
    // #endif
  },
  methods: {
    getDefaultStatusTap() {
      if (this.getDefaultStatusText != this.$t('获取中')) {
        this.getDefaultStatus();
      }
    },
    getChildData(v) {
      this.appGtData = v;
    },
    // 获取   getDefaultStatus
    getDefaultStatus() {
      var _this = this;
      this.$api.getDefaultStatus(function (err, res) {
        console.log(res, err);
        if (res) {
          // type   0：默认验证码  1：极验  2：数美"
          _this.getDefaultStatusFlag = false;
          _this.getDefaultStatusText = _this.$t('获取中');
          _this.type = res.type;
          // _this.type = 1;
          if (_this.type === 0) {
            //图片验证码
            //获取验证码图片
            _this.typeIsShow = false;
            _this.getVerifyCode();
          } else if (_this.type === 1  || _this.type === 3) {
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
        } else {
          _this.getDefaultStatusFlag = true;
          _this.getDefaultStatusText = this.$t('重试');
        }
      }, false);
    },
    //行为校验↓
    reset() {
      // #ifdef APP-PLUS
      console.log(111, this.appGtData);
      // #endif
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
        this.captchaText = this.$t('正在加载...');
      }
    },
    getCaptcha() {
      let lang = "vie";
      if (this.$config.locale == "en_US") {
        lang = "en";
      } else if (this.$config.locale == "zh_CN") {
        lang = "zh-cn";
      } else if (this.$config.locale == "zh_HK") {
        lang = "zh-hk";
      } 
      if (this.type == 1) {
        let _this = this;
        this.$api.geetFirstRegister(window.childCode, function (err, res) {
          console.log(res, err);
          if (res) {
            console.log(res, gt);
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
            _this.getDefaultStatusFlag = true;
            _this.getDefaultStatusText = this.$t('重试');
          }
        });
      } else if (this.type == 2) {
        let data = {
          ...this.smData,
          width: 300,
          https: location.protocol == "https:"
        };
        initSMCaptcha(
          data,
          this.onCaptcha
        );
      } else if(this.type === 3){
		  if(!this.captcha){
			initBotion({
				captchaId: this.$config.captchaId(),//腾博会校验id
				product: 'popup',//float  popup
				language: lang,
				lang,
				nativeButton:{
					width: '100%',
					height: '45px'
				}
			},this.onCaptcha)
		  }
	  }
    },
    onCaptcha(res) {
      //res是验证实例，可以调用res的示例方法
      var _this = this;
      this.captcha = res;
      console.log(this.captcha, "yyyyyyyyyyyyyyyyyyyyy");
      if (this.type == 1) {
        let captcha3 = document.querySelector("#captcha3");
        let routes = getCurrentPages();
        let curRoute = routes[routes.length - 1].route;
        if (captcha3 && curRoute === "pages/forgetPsw/forgetPsw") {
          res.appendTo("#captcha3");
          res.onReady(_this.check);
        }
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
      } else if(this.type === 3){
		  res.appendTo("#gt42");
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
    confirmPswBlurFn(e) {
      this.confirmPsw = e.detail.value;
      // this.confirmPsw = this.confirmPsw.toLowerCase();
      // this.confirmPsw = this.confirmPsw.replace(/\ /g, "");
    },
    verifyCodeBlurFn(e) {
      this.verifyCode = e.detail.value;
    },
    passwordIsValid() {
      //密码校验
      // return /^[a-zA-Z0-9]{6,15}$/.test(this.password);
      return true;
    },
    passwordIsconfirmPsw() {
      //密码和确认密码是否相同
      return this.password == this.confirmPsw;
    },
    goBack() {
      uni.navigateBacks({
        delta: 1,
      });
    },
    getVerifyCode(type) {
      //获取图片验证码
      var _this = this;
      this.$api.captcha(function (err, res) {
        if (err) {
          // console.log(err, '获取图片验证码失败');
          _this.getDefaultStatusFlag = true;
          _this.getDefaultStatusText = _this.$t('重试');
        } else {
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
    aVerifyIsDisable() {
      //实时监听accountNumber,verifyCode,判断登录按钮是否可以点击（是否禁用）
      if (this.type === 0) {
        if (this.accountNumber && this.verifyCode) {
          this.disabled = false;
          return;
        }
        this.disabled = true;
      }
    },
    pVerifyIsDisabled() {
      this.pDisabled = !Boolean(this.phoneCode);
    },
    pswVerifyIsDisabled() {
      if (this.password && this.confirmPsw) {
        this.pswDisabled = false;
        return;
      }
      this.pswDisabled = true;
    },
    accountNumberFocusFn(e) {
      this.accountNumber = e.target.value;
    },
    submit() {
      var _this = this;
      if (this.forPswArticle == 1) {
        let result = null;
        //禁用
        if (!_this.accountNumber) {
          uni.showToast({
            icon: "none",
            title: _this.$t('账号不能为空'),
            duration: 2000,
          });
          return;
        } else if (!this.verifyCode && this.type === 0) {
          uni.showToast({
            icon: "none",
            title: _this.$t('验证码不能为空'),
            duration: 2000,
          });
          return;
        }
        // #ifdef H5
        if (_this.type != 0) {
          result = _this.captcha.getValidate();
          if (!result) {
            uni.showToast({
              icon: "none",
              title: _this.$t('请先通过行为验证'),
            });
            return;
          }
        }
        // #endif
        // #ifdef APP-PLUS
        if (_this.type != 0) {
          result = _this.appGtData;
          if (!result) {
            uni.showToast({
              icon: "none",
              title: _this.$t('请先通过行为验证'),
            });
            return;
          }
        }
        // #endif
        _this.themePreBtnFlag = true;
        // if (!this.isClickLogin) {
        // 	return;
        // }
        this.isClickLogin = false;
        var data = {
          validateType: _this.type,
          name: this.accountNumber,
        };
        if (this.type === 0) {
          data.captchaKey = this.captchaKey;
          data.captchaCode = this.verifyCode;
        } else if (this.type === 1) {
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
        } else if(this.type === 3){
		   data.geeTestQueryVO = result
		}



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

        _this.$api.getMemberByName(data, function (err, res) {
          if (err) {
            //账号有误或者手机未绑定
            _this.modalData.content = err.msg;
            _this.modalData.confirmText = _this.$t('知道了');
            _this.modalData.success = "100";
            _this.$refs.popup.open();
            // #ifdef H5
            //重置行为校验
            if (_this.type === 1) {
              captcha3.innerHTML = "";
            }
            _this.getDefaultStatus();
            // #endif
            // #ifdef APP-PLUS
            if (_this.type === 1) {
              _this.appGtData = null; //
              _this.gtText = _this.$t('点击按钮验证');
              console.log(_this.appGtData);
            }

            _this.getDefaultStatus();
            // #endif
            //重置行为校验

            _this.themePreBtnFlag = false;
          } else {
            _this.phone = res.phone;
            _this.memberId = res.memberId;
            _this.myAccount = _this.accountNumber
            //第一步验证通过
            _this.forPswArticle = 2;
            //数据初始化
            _this.accountNumber = "";
            _this.verifyCode = "";
            _this.isClickLogin = true;
            if (_this.type == 0) {
              _this.regainVerifyCode();
            }

            _this.themePreBtnFlag = false;
          }
        });
      } else if (this.forPswArticle == 2) {
        //禁用
        if (_this.pDisabled) {
          if (!_this.phoneCode) {
            uni.showToast({
              icon: "none",
              title: _this.$t('短信验证码不能为空'),
              duration: 2000,
            });
          }
          return;
        }
        _this.themePreBtnFlag2 = true;
        _this.$api.checkSmsCode(this.myAccount, this.phone, this.phoneCode, function (err, res) {
          if (err) {
            //短信验证码错误
            // _this.modalData.content = err.msg;
            // _this.modalData.confirmText = "知道了";
            // _this.modalData.success = "100";
            // _this.$refs.popup.open();
          } else {
            //第二步验证通过
            _this.forPswArticle = 3;
            //数据初始化
            _this.count = 0;
            clearInterval(_this.timer);
            _this.timer = null;
            _this.isDisable = false;
          }
          _this.themePreBtnFlag2 = false;
        });
      } else if (this.forPswArticle == 3) {
        if (_this.pswDisabled) {
          //禁用
          if (!_this.password) {
            uni.showToast({
              icon: "none",
              title: _this.$t('新密码不能为空'),
              duration: 2000,
            });
          } else if (!_this.confirmPsw) {
            uni.showToast({
              icon: "none",
              title: _this.$t('请再次输入新密码'),
              duration: 2000,
            });
          }
          return;
        } else {
          //正则校验
          if (!_this.passwordIsValid()) {
            uni.showToast({
              icon: "none",
              title: _this.$t('新密码必须为4-10位,字母数字符号至少两种组合'),
              duration: 2000,
            });
            return;
          } else if (!_this.passwordIsconfirmPsw()) {
            uni.showToast({
              icon: "none",
              title: _this.$t('新密码与确认密码必须一致'),
              duration: 2000,
            });
            return;
          }
        }
        _this.themePreBtnFlag3 = true;
        _this.$api.resetMemberPwdByClient(this.memberId, this.password, this.phoneCode, _this.myAccount, function (err, res) {
          if (err) {
            //新密码有误错误
            // _this.modalData.content = err.msg;
            // _this.modalData.confirmText = "知道了";
            // _this.modalData.success = "100";
            // _this.$refs.popup.open();
          } else {
            //找回密码成功
            _this.modalData.content = _this.$t('修改成功，5S后进入登录界面');
            _this.modalData.confirmText = _this.$t('进入登录页');
            _this.$refs.popup.open();

            const allSec = 5;
            if (!_this.timerId) {
              _this.countSec = allSec;
              _this.timerId = setInterval(() => {
                if (_this.countSec > 1 && _this.countSec <= allSec) {
                  _this.countSec--;
                  if (_this.handLoginFlag) {
                    //手动点击跳转
                    clearInterval(_this.timerId);
                    _this.timerId = null;
                  } else {
                    _this.modalData.content = _this.$t('修改成功') + "，" + _this.countSec + _this.$t('S后进入登录界面');
                  }
                } else {
                  clearInterval(_this.timerId);
                  _this.timerId = null;
                  _this.$refs.popup.close();
                  uni.navigateTo({
                    url: "../Login/Login",
                  });
                }
              }, 1000);
            }
          }

          _this.themePreBtnFlag3 = false;
        });
      }
    },
    //弹窗操作
    onchildFn() {
      if (this.timerId && this.modalData.success === 200) {
        //点击知道了
        this.handLoginFlag = true;
        uni.navigateTo({
          url: "../Login/Login",
        });
      } else {
        this.$refs.popup.close();
        if (this.forPswArticle == 1 && this.type == 0) {
          this.regainVerifyCode("errRefresh");
        }

        if (this.modalData.success === 200) {
          //点击空白区域  e=100  success=200
          //定时器清除
          this.handLoginFlag = true;
          uni.navigateTo({
            url: "../Login/Login",
          });
        }
      }
    },
    switchVisible() {
      this.defaultType = !this.defaultType;
    },
    cSwitchVisible() {
      this.confirmPswDefaultType = !this.confirmPswDefaultType;
    },
    toCustomerService() {
      uni.navigateTo({
        url: "/pages/subCustomerService/subCustomerService",
      });
    },
    getPhoneCode() {
      //获取短信验证码
      var _this = this;
      const TIME_COUNT = 59;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.isDisable = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            clearInterval(this.timer);
            this.timer = null;
            this.isDisable = false;
          }
        }, 1000);
        //手机验证码接口
        this.$api.mobilebyacc(
          this.myAccount,
          2,
          function (err, res) {
            if (err) {
              uni.showToast({
                icon: "none",
                title: err.msg,
              });
            } else {
              console.log(res, "获取手机验证码完成");
            }
          },
          false
        );
      }
    },
    //
  },
  watch: {
    //实时监听，判断登录按钮是否解除禁用
    accountNumber(newVal) {
      this.aVerifyIsDisable();
    },
    verifyCode(newVal) {
      if (this.type === 0) {
        this.aVerifyIsDisable();
      }
    },
    phoneCode() {
      this.pVerifyIsDisabled();
    },
    password() {
      this.pswVerifyIsDisabled();
    },
    confirmPsw() {
      this.pswVerifyIsDisabled();
    },
  },
  filters: {
    phoneEncode(val) {
      //手机号加密
      if (val) {
        return val.substr(0, 3) + "****" + val.substr(-4);
      }
    },
  },
  components: {
    uniPopup,
    // #ifdef  APP-PLUS
    GtView,
    SmApp
    // #endif
  },
};
</script>

<style lang="scss" scoped>
.LoginContainer {
  width: 100%;
  height: 100%;
  display: flex;
  /* 垂直居中 */
  align-items: center;
  overflow-y: auto;
  background-size: 100% 100%;
  flex-direction: column;
  position: relative;
  background-color: #f3f3f3;

  /* 解决 ：溢出滚动，align-items:center;只能从中间滚动，内容不完整 */
  .loginInner {
    width: 100%;
    padding-top: 120upx;
    max-height: 100%;
    overflow-y: auto;

    .Login {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 64upx;
      box-sizing: border-box;
    }

    .iconReturn {
      position: relative;
      width: 44upx;
      height: 44upx;
      margin: 44upx 0 50upx 0;
      transform: translateX(-34upx);
    }

    .iconReturn image {
      width: 44upx;
      height: 44upx;
    }

    .f-title {
      padding: 0 0 48upx 12upx;
      box-sizing: border-box;

      .logTitle {
        font-size: 60upx;
        height: 84upx;
        line-height: 84upx;
      }

      .first-article {
        height: 40upx;
        font-size: 32upx;
        font-weight: 700;
        line-height: 40upx;
      }
    }

    .logRow {
      width: 100%;
      height: 88rpx;
      background-color: #ffffff;
      margin-top: 32rpx;
      border-radius: 44rpx;
      line-height: 88rpx;
      display: flex;
      align-items: center;
      border: 1px solid #aaa;
    }

    .iconcontainer {
      width: 88rpx;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .icon {
      width: 40rpx;
      height: 40rpx;
      background-size: 100% 100%;
    }

    .logRow input {
      flex: 1;
      height: 100%;
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
      height: 88rpx;
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
      height: 88rpx;
      background-size: 100% 100%;
      border-radius: 10rpx;
      color: var(--loginTab);
    }

    .phoneVerifyCode {
      min-width: 100%;
      width: 100%;
      position: relative;
    }

    .phoneVerifyCode input {
      padding-right: 228rpx;
      box-sizing: border-box;
    }

    .phoneCodeContainer .verifyCode {
      position: absolute;
      top: 0;
      right: 0;
      text-align: center;
      line-height: 88rpx;
      border-radius: 0;
    }

    .disabledPhone {
      color: #b2b2b2;
    }

    .loginBtn {
      height: 88upx;
      line-height: 88upx;
      border-radius: 8upx;
      font-size: 28upx;
      background: linear-gradient(#ffea8f, #ffd530);
      color: #444;
    }

    .captchaStyle {
      margin-top: 32upx;
      background-color: #fff !important;
    }

    .logHelp {
      font-size: 28upx;
      text {
        color: red;
      }
    }

    .customerService {
      margin: 64rpx 0 64rpx 32rpx;
      font-weight: 500;
    }

    .customerService text {
      margin-left: 7upx;
    }

    .logRegister {
      text-align: center;
      margin-top: 32rpx;
      margin-bottom: 147upx;
      line-height: 1;
      font-size: 28upx;
      display: flex;
      justify-content: space-around;
    }
  }

  .u-flex-all {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  //退出弹窗
  .chuiLei-container {
    background-color: #fff;
    width: 536upx;
    height: 312upx;
    border-radius: 16upx;
    padding-top: 32upx;
    box-sizing: border-box;

    .title {
      height: 50upx;
      font-size: 36upx;
      font-weight: bold;
      color: #1d1717;
    }

    .content {
      height: 150upx;
      font-size: 30upx;
      font-weight: 500;
      padding: 0 48upx;
      box-sizing: border-box;
      text-align: center;
      color: #1d1717;
    }

    .bottom-box {
      height: 80upx;
      display: flex;
      align-items: center;
      font-size: 30upx;
      border-top: 1px solid #f4f4f4;
      box-sizing: border-box;

      view {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #f4f4f4;
      }

      .confirmBtn {
        color: #cb3318;
      }
    }
  }

  .btnBoxTypeBox {
    width: 100%;
    height: 80upx;
    border: 1px solid #dfdfdf;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12upx;
    margin-top: 32upx;
  }

  .btnShua {
    width: 40upx;
    height: auto;
  }

  .getDefaultStatusText {
    font-size: 24upx;
    margin-left: 10upx;
  }

  #captcha3 {
    width: 100%;
    height: 80upx;
    background-image: linear-gradient(180deg, #ffffff 0%, #f3f3f3 100%);
    border: 1px solid #f3f3f3;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8upx;
  }

  //导航栏
  .perHeader {
    width: 100%;
    /* #ifdef APP-PLUS */
    height: calc(88upx + var(--status-bar-height));
    /* #endif */
    /* #ifdef H5 */
    height: 88upx;
    /* #endif */
    background-color: #22211f;
    color: #fff;
  }

  .perHeaderReal {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 88upx;
    padding: 0 30upx;
    box-sizing: border-box;
    color: var(--themeActTitleBg);
    background-color: var(--themeActTopBg);
    font-size: 32upx;
    position: relative;

    view:nth-child(1) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 30upx;
      width: 40upx;
      height: 40upx;
      background-size: cover;
    }
  }

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
}

.mt-20{
	margin: 20rpx 0;
}

</style>
