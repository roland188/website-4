<template>
	<view class='register-comp'>

		<!-- 邀请码 -->
		<view class='regRow inviteCode' v-if='regFlag&&regFlag.inviteCode'>
			<view v-if='regFlag.inviteCode == 2' class='required'> ★ </view>
			<input type="text" :placeholder="regFlag.inviteCode == 1 ?$t('请输入邀请码（选填）'): $t('请输入邀请码')" placeholder-class="themeTextTwo"
			 v-model='inviteCode' @focus='inviteCodeFocus' @blur='inviteCodeBlurFn' @confirm='Register' :disabled="inviteCode ? true : false"
			 v-if='sessData' />
			<input type="text" :placeholder="regFlag.inviteCode == 1 ? $t('请输入邀请码（选填）'): $t('请输入邀请码')" placeholder-class="themeTextTwo"
			 v-model='inviteCode' @focus='inviteCodeFocus' @blur='inviteCodeBlurFn' @confirm='Register' v-else />
		</view>

		<!-- 账号 -->
		<view class='regRow accountNumber flex'>
			<view class='required'> ★ </view>
			<!-- #ifdef APP-PLUS -->
			<input type="text" v-if="$config.mergeAccount" :placeholder="$t('请输入账号（长度4到10位）')" maxlength="10" placeholder-class="themeTextTwo"
			 v-model='accountNumber' @focus='accountFocus' @blur='accountNumberBlurFn' @confirm='Register' />
			<input type="text" v-else :placeholder="$t('请输入账号（长度4到10位）')" maxlength="10" placeholder-class="themeTextTwo" v-model='accountNumber'
			 @focus='accountFocus' @blur='accountNumberBlurFn' @confirm='Register' />
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<input type="text" v-if="window.mergeAccount" :placeholder="$t('请输入账号（长度4到10位）')" maxlength="10" placeholder-class="themeTextTwo"
			 v-model='accountNumber' @focus='accountFocus' @blur='accountNumberBlurFn' @confirm='Register' />
			<input type="text" v-else :placeholder="$t('请输入账号（长度4到10位）')" maxlength="10" placeholder-class="themeTextTwo" v-model='accountNumber'
			 @focus='accountFocus' @blur='accountNumberBlurFn' @confirm='Register' />
			<!-- #endif -->

		</view>


		<!-- 密码 -->
		<!-- 密码显示隐藏 -->
		<view class='regRow password'>
			<view class='required'> ★ </view>
			<input type="password" :placeholder="$t('请输入登录密码')" placeholder-class="themeTextTwo" v-model='password'
			 v-show="pswDefaultType" @focus='passwordFocus' @blur='passwordBlurFn' @confirm='Register' />
			<input type="text" :placeholder="$t('请输入登录密码')" placeholder-class="themeTextTwo" v-model='password'
			 v-show="!pswDefaultType" @focus='passwordFocus' @blur='passwordBlurFn' @confirm='Register' />
			<view class="isVisible  u-flex-all" @tap='pswSwitchVisible'>
				<image :src="pswDefaultType ? '../../static/image/qqImg/eyesNotVisible.png' : '../../static/image/qqImg/eyes.png'"
				 mode="widthFix" lazy-load></image>
			</view>
		</view>


		<!-- 确认密码 -->
		<!-- 密码显示隐藏 -->
		<view class='regRow password'>
			<view class='required'> ★ </view>
			<input type="password" :placeholder="$t('请确认登录密码')" placeholder-class="themeTextTwo" v-model='confirmPassword'
			 v-show="cpswDefaultType" @focus='confirmPasswordFocus' @blur='confirmPasswordBlurFn' @confirm='Register' />
			<input type="text" :placeholder="$t('请确认登录密码')" placeholder-class="themeTextTwo" v-model='confirmPassword'
			 v-show="!cpswDefaultType" @focus='confirmPasswordFocus' @blur='confirmPasswordBlurFn' @confirm='Register' />
			<view class="isVisible  u-flex-all" @tap='cpswSwitchVisible'>
				<image :src="cpswDefaultType ? '../../static/image/qqImg/eyesNotVisible.png' : '../../static/image/qqImg/eyes.png'"
				 mode="widthFix" lazy-load></image>
			</view>
		</view>


		<!-- 手机号 -->
		<view class='regRow phone' v-if='regFlag&&regFlag.phone'>
			<view v-if='regFlag.phone == 2' class='required'> ★ </view>
      <view class="codePrefix">{{ $config.codePrefix }}</view>
			<input type="number" v-model='phone' :placeholder="regFlag.phone == 1 ? $t('请输入手机号码（选填）'):  $t('请输入手机号码')" maxlength="10"
			 placeholder-class="themeTextTwo" @focus='phoneFocus' @blur="commonblurFn($event,'phone')" @confirm='Register' />
		</view>

		<!-- 手机验证码 -->
		<view class="regRow isPhoneCode" v-show="isPhoneCode">
			<view class='required'> ★ </view>
			<input type="text" class="themeTextTwo" v-model="verify_code" :placeholder="$t('请输入短信验证码')" />
			<button class="code-time" :class="{ 'time-text': disabledBut }" :disabled="disabledBut" @click="getPhoneCode">
				{{ code_text }}
			</button>
		</view>

		<!-- 姓名 -->
		<view class='regRow realName' v-if='regFlag&&regFlag.realName'>
			<view v-if='regFlag.realName == 2' class='required'> ★ </view>
			<input type="text" v-model='realName' :placeholder="regFlag.realName == 1 ? $t('请输入姓名（选填）'): $t('请输入姓名')" @blur="commonblurFn($event,'realName')"
			 placeholder-class="themeTextTwo" />
		</view>

		<!-- 性别 -->
		<view class='regRow sex' v-if='regFlag&&regFlag.sex'>
			<view v-if='regFlag.sex == 2' class='required'> ★ </view>
			<view class='btnTextColor'>{{$t('请选择性别：')}}</view>
			<view class='maleSex' @click="sex = 1">
				<image :src="sex == 1 ?  '../../static/image/qqImg/checked.png' :  '../../static/image/qqImg/unCheck.png'">
					<text class='btnTextColor'>{{$t('男')}}</text>
			</view>

			<view class='femaleSex' @click="sex = 0">
				<image :src="sex == 0 ? '../../static/image/qqImg/checked.png' : '../../static/image/qqImg/unCheck.png'"></image>
				<text class='btnTextColor'>{{$t('女')}}</text>
			</view>

		</view>

		<!-- 生日 -->
		<view class="uni-list-cell-db regRow birthday" v-if='regFlag&&regFlag.birthday'>
			<view v-if='regFlag.birthday == 2' class='required'> ★ </view>
			<!-- <picker class='regPicker' mode="date" :value="birthday" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="uni-input themeTextOne" :placeholder="regFlag.birthday == 1 ? $t('请输入生日（选填）'):$t('请输入生日') ">{{birthday}}</view>
			</picker> -->
			<input type="text" @tap="toggleTab" v-model='birthday' :placeholder="regFlag.birthday == 1 ? $t('请输入生日（选填）'): $t('请输入生日') " maxlength="20"
			 placeholder-class="themeTextTwo" />
		</view>


		<!-- 微信号 -->
		<view class='regRow wechat' v-if='regFlag&&regFlag.wechat'>
			<view v-if='regFlag.wechat == 2' class='required'> ★ </view>
			<input type="text" v-model='wechat' :placeholder="regFlag.wechat == 1 ? $t('请输入WhatsApp（选填）'): $t('请输入WhatsApp号码') " maxlength="20"
			 @blur="commonblurFn($event,'wechat')" placeholder-class="themeTextTwo" />
		</view>


		<!-- QQ号 -->
		<view class='regRow qq' v-if='regFlag&&regFlag.qq'>
			<view v-if='regFlag.qq == 2' class='required'> ★ </view>
			<input type="text" v-model='qq' :placeholder="regFlag.qq == 1 ? $t('请输入telegram（选填）') : $t('请输入请输入telegram（选填）')" maxlength="12" @blur="commonblurFn($event,'qq')"
			 placeholder-class="themeTextTwo" />
		</view>



		<!-- 邮箱-->
		<view class='regRow email' v-if='regFlag&&regFlag.email'>
			<view v-if='regFlag.email == 2' class='required'> ★ </view>
			<input type="text" v-model='email' @blur="commonblurFn($event,'email')" :placeholder="regFlag.email == 1 ? $t('请输入邮箱地址（选填）'): $t('请输入邮箱地址') "
			 placeholder-class="themeTextTwo" />
		</view>


		<!-- 地址-->
		<view class='regRow address' v-if='regFlag&&regFlag.address'>
			<view v-if='regFlag.address == 2' class='required'> ★ </view>
			<input type="text" v-model='address' @blur="commonblurFn($event,'address')" :placeholder="regFlag.address == 1 ? $t('请输入联系地址（选填）') :$t('请输入联系地址') "
			 placeholder-class="themeTextTwo" />
		</view>

		<!-- 验证码 -->
		<view v-show="type === 0" class="codeContainer">
			<view class='logRow logverifyCode' style="margin: 0;">
				<view class='required'> ★ </view>
				<input type="text" :placeholder="$t('请输入图形验证码')" placeholder-class="themeTextTwo" placeholder-style="font-size:30upx;"
				 v-model='verifyCode' @blur="commonblurFn($event,'verifyCode')" @confirm='Register' />
			</view>
			<view class='verifyCode' :style="'background-image:url('+verifyCodeImg+')'" @tap='regainVerifyCode'>
				<view class='reGetDefaultStatus reGetVerifyCode' v-if='!getVerifyCodeFlag'>
					<image class='refreshImg' src="../../static/image/refresh1.png" mode=""></image>
					<text>{{$t('重新获取')}}</text>
				</view>
			</view>
		</view>

		<!-- 验证码 -->
		<!-- #ifdef APP-PLUS -->
		<GtView :gtShow='typeIsShow' v-if="type==1" :type='gtType' @fromChild="getChildData" :text="gtText"></GtView>
		<SmApp :gtShow='typeIsShow' v-if="type==2" :type='gtType' @fromChild="getChildData" :smData="smData" :smText="gtText"></SmApp>
		<gt4-app v-if="type === 3" @fromChild="getChildData" :gtText.sync="gtText"></gt4-app>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<!-- 行为校验  树莓 -->
		<view v-show="type === 2" id="captcha" class='loginBtn captchaStyle' @click='captchaClick'>{{captchaText}}</view>
		<!--  行为验证 急眼 -->
		<view v-show="type === 1 && getCaptchaFlag == 1" id="captcha2" class="loginBtn"></view>
		<!--  行为验证 极验4 -->
		<view v-if="type === 3" id="gt4" class="loginBtn mt-20"></view>
		<!-- #endif -->

		<!-- getDefaultStatus接口请求错误 -->
		<view v-if="type === -1 || getCaptchaFlag === 0" class="loginBtn reGetDefaultStatus" @click='reGetHandler()'>
		
			<image class='refreshImg' src="../../static/image/refresh1.png" mode=""></image>
			<text>{{$t('重新获取')}}</text>
		</view>




		<view class='regAgreement  u-flex-a' @tap='CheckboxChange'>
			<view class='regCheckBox'>
				<image :src="isChecked ? '../../static/image/qqImg/checked.png' : '../../static/image/qqImg/unCheck.png' " mode=""></image>
			</view>
			<text class='btnTextColor fontWhite8' style='margin-left:16upx;font-size: 28upx;line-height: 36upx;'>{{$t('《用户使用协议》')}}<text
				class='themeColor linkTextColor'>{{$t('《用户使用协议》')}}</text></text>
		</view>


		<view class='regBtn u-flex-all' :class="disabled ?'themeDisBtn themeDisBtn8':(!themePreBtnFlag ? 'themeBtn loginBgColor8':'themePreBtn' )"
		 @tap='Register'>{{$t('注册')}}</view>
     
    <yuDatetimePicker @confirm="changeBirthday" 
        startYear="2010" ref="dateTime" 
        :isAll="true" :current="true"></yuDatetimePicker>
	</view>
</template>

<script>
//引入模态框
// import tips from '../../components/tips/tips.vue'
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
import yuDatetimePicker from "@/components/yu-datetime-picker/yu-datetime-picker.vue";
function getDate(type) {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (type === "start") {
    year = year - 60;
  } else if (type === "end") {
    year = year + 2;
  }
  month = month > 9 ? month : "0" + month;
  day = day > 9 ? day : "0" + day;

  return `${year}-${month}-${day}`;
}
export default {
  data() {
    return {
      inputindex:1,
      inviteCode: '',
      accountNumber: "",
      phone: "",
      password: "",
      confirmPassword: "",
      pswDefaultType: true, //密码默认类型（隐藏）
      cpswDefaultType: true, //确认密码默认类型（隐藏）
      disabled: true,
      isChecked: true,
      //模态框数据
      modalData: {
        isShow: false,
        types: 1, //类型是带标题的弹窗、
        content: "",
        showCancel: false, //显示取消按钮
        confirmText: "",
        icon: 1, //默认为错误图片
        success: "", //传递点击按钮的类型
      },
      registerInfo: "",
      modalBtnTitle: "",
      errors: {
        inviteCode: "",
        phone: "",
        confirmPassword: "",
        password: "",
        account: "",
      },
      isClickRegister: true, //只有第一次注册生效
      sessData: "",
      themePreBtnFlag: false, //按钮是否被点击（非禁用状态时的点击）
      realName: "",
      sex: 1,
      wechat: "",
      qq: "",
      email: "",
      address: "",
      regFlag: null, //注册设置
      birthday: "",
      startDate: getDate("start"),
      endDate: getDate("end"),
      captchaKey: "", //验证码唯一key值
      verifyCode: "", //验证码值
      verifyCodeImg: "",
      type: 0,
      captcha: null, //行为校验
      captchaBox: null,
      captchaText: "",
      captchaMask: false,
      getVerifyCodeFlag: true, //请求图片验证码（默认成功）
      getCaptchaFlag: -1,
      window: window,
      typeIsShow: false, //
      gtType: 1, //1注册
      appGtData: null,
      gtText: this.$t('点击按钮验证'),
      platform: null,
      isPhoneCode: false, // 是否开启验证码
      disabledBut: false,
      verify_code: "", // 手机验证码
      code_text: this.$t('获取验证码'),
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
  mounted() {
    this.platform = uni.getSystemInfoSync().platform;
    let self = this;
    let inviteCode = ''
    // #ifdef H5
    inviteCode = JSON.parse(sessionStorage.getItem("inviteCode")) == 'null' || !JSON.parse(sessionStorage.getItem(
      "inviteCode")) ? '' : JSON.parse(sessionStorage.getItem("inviteCode"))
    // #endif
    // #ifdef APP-PLUS
    inviteCode = uni.getStorageSync('inviteCode') == 'null' || !uni.getStorageSync('inviteCode') ? '' : uni
      .getStorageSync('inviteCode')
    // #endif
    this.inviteCode = inviteCode;
    this.sessData = inviteCode;
    // #ifdef H5
    this.getDefaultStatus();
    // #endif

    // #ifdef APP-PLUS
    //获取验证码图片
    //获取验证码图片
    this.getDefaultStatus();
    uni.$on("fromChild1", function (data) {
      self.appGtData = data.postData;
    });
    uni.$on("fromChildRes1", function (data) {
      self.getDefaultStatusFlag = true;
      self.getDefaultStatusText = this.$t('银行卡号');
    });
    // #endif
    this.getRegisterSet();
  },
  methods: {
    // 获取充值验证码
    getPhoneCode() {
      let self = this;
      if (this.phone == "") {
        uni.showToast({
          icon: "none",
          title: self.$t('请输入手机号'),
        });
        return;
      }
      // if (!/^1[3456789]\d{9}$/.test(this.phone)) {
      //   uni.showToast({
      //     icon: "none",
      //     title: this.$t('请输入正确的手机号'),
      //   });
      //   return;
      // }

      this.$api.sendSmsCode(this.phone, 8, (err, res) => {
        console.log(res);
        if (res) {
          this.disabledBut = true;
          this.code_text = "60S";
          let time = 60;
          let intervalID = setInterval(() => {
            time--;
            this.code_text = time + "S";
            if (time == 0) {
              this.disabledBut = false;
              clearInterval(intervalID);
              this.code_text = this.$t('获取验证码');
              time = 60;
            }
          }, 1000);
          uni.showToast({
            icon: "success",
            title: self.$t('验证码发送成功'),
          });
        } else {
          uni.showToast({
            icon: "none",
            title: res.msg,
          });
        }
      });
    },
    
    toggleTab() {
      this.$refs.dateTime.show();
      this.inputindex = 1;
    },
    
    //选择日期
    changeBirthday(time) {
      this.birthday =  time.selectRes;
    },
    getChildData(v) {
      this.appGtData = v;
    },
    reGetHandler() {
      var _this = this;
      if (this.type == -1) {
        this.getDefaultStatus();
      } else if (_this.type === 1 && !this.getCaptchaFlag) {
        // _this.disabled = false;
        this.reset();
      }
    },
    // 获取   getDefaultStatus
    getDefaultStatus() {
      var _this = this;
      this.$api.getDefaultStatus(function (err, res) {
        if (res) {
          // type   0：默认验证码  1：极验  2：数美"
          _this.type = res.type;
          if (_this.type === 0) {
            //图片验证码
            //获取验证码图片
            _this.typeIsShow = false;
            _this.getVerifyCode();
          } else if (_this.type === 1 || _this.type === 3) {
            //1：极验
            // _this.disabled = false;
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
      // #ifdef APP-PLUS

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
      if (this.$config.locale == "en_US" ) {
        lang = "en";
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
      } else if(this.type === 3){
			if(!this.captcha){
				initBotion({
					captchaId: this.$config.captchaId(),//腾博会校验id
					product: 'popup',//float  popup
					language: lang,
					lang,
					nativeButton:{
						width: '100%',
						height: '40px'
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
        res.appendTo("#captcha2");
        res.onReady(_this.check);
      } else if (this.type == 2) {
        this.captchaText = _this.$t('点击验证');
        this.captcha.onSuccess(function (data) {
          if (data.pass) {
            _this.disabled = false;
            _this.captcha.rid = data.rid;
            _this.captchaText = _this.$t('验证成功');
            _this.captchaMask = false;
          } else {
            _this.captcha.rid = null;
            _this.captchaText = _this.$t('验证失败');
          }
        });

        this.captcha.onError(function (errType, errMsg) {
          _this.captcha.rid = null;
          _this.captchaText = _this.$t('验证失败');
          _this.captchaMask = false;
        });

        this.captcha.onClose(function () {
          _this.captchaMask = false;
        });
      } else if(this.type === 3){
		  res.appendTo("#gt4");
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
            _this.isClickRegister = true;
          }
        }
      }, true);
    },
    regainVerifyCode(type) {
      //重新获取验证码
      this.getVerifyCode(type);
    },
    inviteCodeBlurFn(e) {
      this.inviteCode = e.detail.value;
    },
    accountNumberBlurFn(e) {
      this.accountNumber = e.detail.value;
      this.accountNumber = this.accountNumber.toLowerCase();
      this.accountNumber = this.accountNumber.replace(/\ /g, "");
    },
    passwordBlurFn(e) {
      this.password = e.detail.value;
      // this.password = this.password.toLowerCase()
      // this.password = this.password.replace(/\ /g, "");
    },
    confirmPasswordBlurFn(e) {
      this.confirmPassword = e.detail.value;
      // this.confirmPassword = this.confirmPassword.toLowerCase()
      // this.confirmPassword = this.confirmPassword.replace(/\ /g, "");
    },
    commonblurFn(e, key) {
      this[key] = e.detail.value;
    },
    getRegisterSet() {
      var _this = this;
      this.$api.getRegisterSet("member_register", function (err, res) {
        console.log(res, err);
        if (res) {
          _this.regFlag = res.svalue;
          if (res.svalue.phone == 2 && res.svalue.smsCode == 1) {
            _this.isPhoneCode = true;
          }
        }
      });
    },
    bindDateChange: function (e) {
      this.birthday = e.detail.value;
    },
    registerIsDisabled() {
      //注册按钮是否禁用
      var oldIsDisable = true;
      if (this.type === 0) {
        oldIsDisable =
          this.accountNumber &&
          this.password &&
          this.confirmPassword &&
          this.isChecked &&
          this.verifyCode;
      }

      var requiredFields = [];
      var flag = false;
      // console.log(this.regFlag)

      if (this.regFlag) {
        for (var k in this.regFlag) {
          flag = true;
          if (this.regFlag[k] == 2) {
            requiredFields.push(k);
          }
        }
      }
      if (flag) {
        var boolean = true;
        for (var i = 0; i < requiredFields.length; i++) {
          if (requiredFields[i] != "sex") {
            // console.log(requiredFields[i] ,this[requiredFields[i]])
            // console.log(Boolean(this[requiredFields[i]]));
            boolean *= Boolean(this[requiredFields[i]]);
          }
        }
      }
      var newIsDisable = boolean;
      // console.log(requiredFields, boolean, '88888888888888888877777777777777777')
      if (oldIsDisable && newIsDisable) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    inviteCodeValid() {
      //邀请码校验
      if (this.inviteCode) {
        return /^[a-zA-Z0-9]*$/.test(this.inviteCode);
      } else {
        return true;
      }
    },
    accountIsValid() {
      //账号校验
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$/.test(
        this.accountNumber
      );
    },
    passwordIsValid() {
      //密码校验
      // return (/^[a-zA-Z0-9]{6,15}$/).test(this.password)
      return true;
    },
    passwordIsconfirmPassword() {
      //密码和确认密码是否相同
      return this.password == this.confirmPassword;
    },
    phoneIsValid() {
      //手机格式校验
      if (this.phone) {
        return /^1[3456789]\d{9}$/.test(this.phone);
      } else {
        return true;
      }
    },
    // realNameIsValid() {
    // 	//真实姓名校验
    // 	if (this.realName) {
    // 		return (/^.{0,8}$/.test(this.realName));
    // 	} else {
    // 		return true;
    // 	}

    // },
    WeChatIsValid() {
      //微信号校验
      if (this.wechat) {
        return /^[a-zA-Z0-9][a-zA-Z0-9_-]{5,19}$/.test(this.wechat);
      } else {
        return true;
      }
    },
    qqIsValid() {
      //qq校验
      if (this.qq) {
        return /^[1-9][0-9]{4,14}$/.test(this.qq);
      } else {
        return true;
      }
    },
    emailIsValid() {
      // email校验
      if (this.email) {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(
          this.email
        );
      } else {
        return true;
      }
    },
    pswSwitchVisible() {
      //切换密码的显示与隐藏
      this.pswDefaultType = !this.pswDefaultType;
    },
    cpswSwitchVisible() {
      //切换密码的显示与隐藏
      this.cpswDefaultType = !this.cpswDefaultType;
    },
    //多选按钮，选中状态变化
    CheckboxChange(e) {
      this.isChecked = !this.isChecked;
    },
    //模态框的显示与隐藏
    showModal() {
      this.modalData.isShow = true;
    },
    hideModal() {
      this.modalData.isShow = false;
    },
    getSubmitValue(key) {
      var _this = this;

      if (this.regFlag[key] == 0) {
        //不显示
        return null;
      } else if (_this[key] == "") {
        //选填未填
        return null;
      } else {
        //选填或必填
        return _this[key];
      }
    },
    Register() {
      var _this = this;
      //禁用
      // if (_this.disabled) {
      if (this.regFlag.inviteCode == 2 && !this.inviteCode.trim()) {
        //必填却没值
        uni.showToast({
          icon: "none",
          title: _this.$t('邀请码不能为空！'),
        });
        return;
      } else if (!_this.accountNumber.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('账号不能为空！'),
        });
        return;
      } else if (!_this.password.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('密码不能为空！'),
        });
        return;
      } else if (!_this.confirmPassword.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('确认密码不能为空！'),
        });
        return;
      } else if (this.regFlag.phone == 2 && !this.phone.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('手机号不能为空！'),
        });
        return;
      } else if (this.regFlag.realName == 2 && !this.realName.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('姓名不能为空！'),
        });
        return;
      } else if (this.regFlag.birthday == 2 && !this.birthday.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('生日不能为空！'),
        });
        return;
      } else if (this.regFlag.wechat == 2 && !this.wechat.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('WhatsApp能为空！'),
        });
        return;
      } else if (this.regFlag.qq == 2 && !this.qq.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('Telegram不能为空！'),
        });
        return;
      } else if (this.regFlag.email == 2 && !this.email.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('邮箱不能为空！'),
        });
        return;
      } else if (this.regFlag.address == 2 && !this.address.trim()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('地址不能为空！'),
        });
        return;
      } else if (!this.verifyCode.trim() && this.type === 0) {
        uni.showToast({
          icon: "none",
          title: _this.$t('验证码不能为空！'),
        });
        return;
      } else if (!this.isChecked) {
        uni.showToast({
          icon: "none",
          title: _this.$t('请先勾选用户使用协议！'),
        });
        return;
      }
      // 	return;
      // }

      // #ifdef H5
      let captcha2 = document.querySelector("#captcha2");
      // #endif
      let result = null;
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
        result = this.appGtData;

        if (!result) {
          uni.showToast({
            icon: "none",
            title: _this.$t('请先通过行为验证'),
          });
          return;
        }
      }

      // #endif

      //正则校验
      if (!_this.inviteCodeValid()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('邀请码必须为字母或数字'),
          duration: 2000,
        });
        return;
      } else if (!_this.accountIsValid()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('账号必须为6~15位数字与字母组合'),
          duration: 2000,
        });
        return;
      } else if (!_this.passwordIsValid()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('密码4-10位,字母数字符号至少两种组合'),
          duration: 2000,
        });
        return;
      } else if (!_this.passwordIsconfirmPassword()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('密码与确认密码必须一致'),
          duration: 2000,
        });

        return;
      }
      //  else if (!_this.phoneIsValid()) {
      //   uni.showToast({
      //     icon: "none",
      //     title: _this.$t('手机格式不正确'),
      //     duration: 2000,
      //   });
      //   return;
      // }
      // else if (!this.realNameIsValid()) {
      // 	uni.showToast({
      // 		icon: "none",
      // 		title: '姓名不能超过8位！',
      // 		duration: 2000
      // 	})
      // 	return;
      // }
      else if (!this.WeChatIsValid()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('WhatsApp号码不存在！'),
          duration: 2000,
        });
        return;
      } else if (!this.qqIsValid()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('Telegram不存在！'),
          duration: 2000,
        });
        return;
      } else if (!this.emailIsValid()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('邮箱地址不存在！'),
          duration: 2000,
        });
        return;
      }

      // if (!this.isClickRegister) {
      // 	return;
      // }
      //
      this.themePreBtnFlag = true;

      this.isClickRegister = false;

      //注册接口
      var data = {
        phone: _this.getSubmitValue("phone"),
        username: _this.accountNumber,
        password: _this.password,
        inviteCode: _this.inviteCode,
        lastLoginVersion: _this.$config.loginVersion,
        realName: _this.getSubmitValue("realName"),
        sex: _this.getSubmitValue("sex"),
        birthday: _this.getSubmitValue("birthday"),
        wechat: _this.getSubmitValue("wechat"),
        qq: _this.getSubmitValue("qq"),
        email: _this.getSubmitValue("email"),
        address: _this.getSubmitValue("address"),
        validateType: _this.type,
        smsCode: this.verify_code ? this.verify_code : null,
        fingerprint: _this.$config.fingerprint,
        phoneModel: _this.$config.phoneModel,
        codePrefix:'84'
      };

      // #ifdef H5
      if (window.mergeAccount) {
        data.username = this.accountNumber + window.mergeAccount;
      }
      this.$set(data, "clientItem", window.childCode);
      this.$set(data, "appId", window.theme);
      // #endif
      // #ifdef APP-PLUS
      if (this.$config.mergeAccount) {
        data.username = this.accountNumber + this.$config.mergeAccount;
      }
      this.$set(data, "clientItem", this.$config.childCode);
      this.$set(data, "appId", this.$config.theme);
      // #endif

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
        data.geeTestQueryVO = {
          challenge: geetest_challenge,
          seccode: geetest_seccode,
          validate: geetest_validate,
        };
      } else if (this.type === 2) {
        data.shuMeiQueryVO = {
          rid: result.rid,
        };
      }	else if(this.type === 3){
		  data.geeTestQueryVO = result
	  }

      this.$api.register(
        data,
        function (err, res) {
          if (err) {
            if (err.code == -1) {
              //网络请求失败
              uni.showToast({
                icon: "none",
                title: err.msg,
                duration: 2000,
              });
            } else if (err.code) {
              uni.showToast({
                icon: "none",
                title: err.msg,
                duration: 2000,
              });
            }

            // #ifdef H5
            //重置行为校验
            if (_this.type === 1) {
              captcha2.innerHTML = "";
              result = null;
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

            _this.themePreBtnFlag = false;
          } else {
            // #ifdef  H5
            // 新版
            // maskAppToNative("register");
            //老版
            // maskAppOldToNative("register");
            if (window.isMaskApp && window.ANDROID_JS_BRIDGE) {
              window.ANDROID_JS_BRIDGE.register_success(); // adjust埋
              window.ANDROID_JS_BRIDGE.CompleteRegistration(); // 脸书埋
                window.ANDROID_JS_BRIDGE.completeRegistration()  // 快手埋
            }
            if(localStorage.getItem('fbPixelId') && window.fbq){
              fbq('trackCustom', 'h5-register',{registerName: res.username})
            }
            // #endif
            // sessionStorage.removeItem('inviteCode');
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
        },
        true
      );
    },

    onchildFn(data) {
      if (data == 200) {
        //重新输入
        this.hideModal();
      } else if (data == 300) {
        //进入首页
        this.hideModal();
        uni.navigateTo({
          url: "../index/index",
          success: function () {
            uni.$emit("update", {
              msg: this.$t('页面更新'),
            });
          },
        });
      }
    },
    inviteCodeFocus() {
      //聚焦，提示
      this.errors = {};
      this.$set(this.errors, "inviteCode", this.$t('请输入邀请码'));
    },
    accountFocus() {
      //聚焦，提示
      this.errors = {};
      this.$set(this.errors, "account", this.$t('请输入账号'));
    },
    passwordFocus() {
      //聚焦，提示
      this.errors = {};
      this.$set(this.errors, "password", this.$t('请输入密码'));
    },
    confirmPasswordFocus() {
      this.errors = {};
    },
    phoneFocus() {
      this.errors = {};
    },
    returnPrevPage() {
      // uni.navigateBacks()
      history.back();
    },
  },
  components: {
    yuDatetimePicker,
    // tips
    // #ifdef  APP-PLUS
    GtView,
    SmApp,
    // #endif
  },
  watch: {
    accountNumber() {
      this.registerIsDisabled();
    },
    phone() {
      this.registerIsDisabled();
    },
    password() {
      this.registerIsDisabled();
    },
    confirmPassword() {
      this.registerIsDisabled();
    },
    isChecked() {
      this.registerIsDisabled();
    },
    realName() {
      this.registerIsDisabled();
    },
    sex() {
      this.registerIsDisabled();
    },
    birthday() {
      this.registerIsDisabled();
    },
    wechat() {
      this.registerIsDisabled();
    },
    qq() {
      this.registerIsDisabled();
    },
    email() {
      this.registerIsDisabled();
    },
    address() {
      this.registerIsDisabled();
    },
    verifyCode() {
      if (this.type === 0) {
        this.registerIsDisabled();
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.register-comp {
  border-radius: 8upx;
  padding: var(--loginPd);
  background: var(--loginFromBg);
  border: 1px solid transparent;
  border-image: var(--loginborderBg);
  border-image-slice: 1;

  .regList {
    overflow: auto;
    padding: 0 64upx;
  }

  .regTitle {
    font-size: 60upx;
    color: var(--loginInputColor);
    padding-bottom: 80upx;
    box-sizing: border-box;
  }

  .regRow {
    display: flex;
    align-items: center;
    margin-bottom: 32upx;
    position: relative;
    color: #fff;
    
    &.phone{
      position: relative;
      .codePrefix{
        position: absolute;
        left: 40rpx;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10rpx;
        border: var(--loginInputBoder);
        border-left: 0;
        border-right: 0;
        color: var(--loginInputColor);
        background: var(--loginFromBg);
      }
      uni-input{
        padding-left:100rpx;
      }
    } 
  }

  /* 手机短信验证码 */
  .isPhoneCode {
    display: flex;

    .themeTextTwo {
      padding: 0 50upx;
    }

    .code-time {
      font-size: 26upx;
      color: #fff;
      border-radius: 8rpx;
      text-align: center;
      margin-right: 20upx;
      background: linear-gradient(to bottom, #cfa65f, #eac27c);

      .code-text {
        color: #fff;
        font-size: 22rpx;
      }
    }

    .time-text {
      color: #f1ebeb;
    }
  }

  .regRow .required {
    position: absolute;
    top: 50%;
    left: 20upx;
    transform: translate(-50%, -50%);
    font-size: 40upx;
    color: #ebcc45;
    width: 20upx;
    font-size: 32upx;
    height: 72upx;
    line-height: 72upx;
  }

  .realName {
  }

  .regRow .regRowName {
    width: 130upx;
    font-size: 30upx;
    height: 28upx;
    /* line-height:38upx; */
    text-align-last: justify;
    text-align: justify;
    text-justify: distribute-all-lines;
    /*  这行必加，兼容ie浏览器 */
  }

  /* 文字分散对齐 ：ios */
  .regRow .regRowName::after {
    content: "";
    width: 100%;
    height: 0;
    display: inline-block;
  }

  .regRow input {
    flex: 1;
    height: 72upx;
    font-size: 28upx;
    padding-left: 40upx;
    box-sizing: border-box;
    background-color: #000;
    border-radius: 44upx;
    border: 1px solid #444;
    background-color: var(--loginInput);
    border: var(--loginInputBoder);
    color: var(--loginInputColor);
  }

  .password {
    position: relative;
  }

  .password input {
    padding-right: 84upx;
    box-sizing: border-box;
  }

  .password .isVisible {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 72upx;
    height: 72upx;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    /*防止手指点击时，触发input框*/
    z-index: 999;
  }

  .password .isVisible image {
    width: 44upx;
    height: 28upx;
    flex-shrink: 0;
  }

  .sex {
    padding-left: 40upx;
    box-sizing: border-box;
  }

  .sex > view {
    display: flex;
    align-items: center;
  }

  .sex image {
    width: 40upx;
    height: 40upx;
    margin: 0 20upx 0 40upx;
  }

  .regHelp {
    margin-top: 29upx;
    font-size: 28upx;
  }

  .regLogin {
    text-align: center;
    margin-bottom: 60upx;
  }

  .regBtn {
    width: 400upx;
    height: 72upx;
    line-height: 72upx;
    border-radius: 40upx;
    background: var(--loginBtn);
    color: #fff;
    margin: 0 auto;
  }

  .regAgreement {
    position: relative;
    transform: translateX(-18upx);
    font-size: 24upx;
    margin-bottom: 60upx;
    width: calc(100% + 18upx);
    display: flex;
  }

  /* 模拟checkbox */
  /* 一开始 */
  .regCheckBox {
    width: 32upx;
    height: 32upx;
    line-height: 32upx;
  }

  .regCheckBox > image {
    width: 32upx;
    height: 32upx;
    object-fit: cover;
  }

  uni-picker {
    width: 100%;
  }

  .uni-input {
    height: 72upx !important;
    border-radius: 44upx;
    padding-left: 40upx;
    display: flex;
    align-items: center;
    color: #868686;
  }

  /* 添加placeholder */
  .uni-input:empty:before {
    content: attr(placeholder);
    color: var(--textTwo);
    color: var(--birthPlaceholderColor16);
    font-size: 14px;
  }

  .logRow {
    width: 100%;
    height: 88rpx;
    margin-top: 32rpx;
    border-radius: 44rpx;
    line-height: 88rpx;
    display: flex;
    align-items: center;
    position: relative;
    background-color: var(--loginInput);
    border: var(--loginInputBoder);
    color: var(--loginInputColor);
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

  .logRow .required {
    position: absolute;
    top: 50%;
    left: 20upx;
    transform: translate(-50%, -50%);
    font-size: 32upx;
    color: #ebcc45;
    width: 20upx;
    height: 72upx;
    line-height: 72upx;
  }

  .logRow input {
    flex: 1;
    height: 100%;
    padding: 0 40upx;
    box-sizing: border-box;
  }

  .codeContainer {
    width: 100%;
    height: 88rpx;
    position: relative;
    margin-bottom: 32rpx;
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
  }

  #captcha2 {
    width: 100%;
    height: 72upx;
    background-color: #fff;
    border-radius: 4upx;
    margin-bottom: 32upx;
  }

  .reGetDefaultStatus {
    height: 80upx;
    background-color: #fff;
    border-radius: 8upx;
    margin-bottom: 32upx;
    color: #6c716b;
    font-size: 32upx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .refreshImg {
    width: 40upx;
    height: 40upx;
    vertical-align: middle;
  }

  .verifyCode .reGetVerifyCode {
    height: 100%;
    margin-bottom: 0;
    border-radius: 10rpx;
  }

  .btnTextColor {
    color: #868686;
  }
}
</style>
