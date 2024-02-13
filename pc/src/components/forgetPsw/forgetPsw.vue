<template>
  <div class="forgetPswLayout">
    <div v-show="forPswArticle == 1">
      <div class="f-title">
        <div class="first-article">{{ $t('第一步:验证账号信息') }}</div>
      </div>

      <div class="regRow regAccountNumber">
        <div class="rowkey">{{ $t('账号') }}：</div>
        <input
          class="input"
          :placeholder="$t('请输入账号')"
          v-model="accountNumber"
          maxlength="15"
          @blur="accountBlur"
          autofocus
        />
      </div>
      <!-- <div class="logErrMsg u-flex-a"></div> -->
      <!-- 验证码 -->

      <div v-if="type === 0" class="logRow logVerifyCode">
        <div class="rowkey updateColor">{{ $t('验证码') }}：</div>
        <input
          type="text"
          class="input"
          :placeholder="$t('请输入验证码')"
          v-model="captchaCode"
          @keyup.enter="submit()"
          @blur="captchaCode = toCDB(captchaCode)"
        />
        <div
          class="verifyCodeImg"
          v-if="verifyCodeImg"
          :style="'background-image:url(' + verifyCodeImg + ')'"
          @click="captchaData"
        ></div>
        <div
          class="verifyCodeImg getCode"
          v-if="!verifyCodeImg"
          @click="captchaData"
        >
          <img loading="lazy" v-lazy="require('../../assets/image/dze/refresh.png')" class="refimg" />
          {{ $t('重新获取') }}
        </div>
      </div>
      <!-- 行为校验  树莓 -->
      <div
        v-if="type === 2"
        id="captcha"
        class="loginBtn captchaStyle"
        @click="captchaClick"
      >
        {{ captchaText }}
      </div>
      <!-- 极验4 -->
      <div v-if="type === 3" id="gt42"></div>
      <!--  行为验证 极验 -->
      <div v-if="type === 1" id="captcha3" class></div>

      <div class="getCode" v-if="errorCode" @click="getDefaultStatus">
        <img loading="lazy" v-lazy="require('../../assets/image/dze/refresh.png')" class="refimg" />
        {{ $t('重新获取') }}
      </div>

      <div class="errTips">{{ modalData.content }}</div>
      <div
        class="registerBtn u-flex-all themeColorkBgc"
        :class="disabled ? 'u-btn-disabled' : 'u-btn-undisabled cursorPoint'"
        @click="submit()"
      >
        {{ $t('确认提交') }}
      </div>

      <div class="regRegister u-flex-all cursorPoint" @click="customerService">
        {{ $t('忘记账号？请联系') }}
        <span class="themeTextColor">{{ $t('在线客服') }}</span>
      </div>
    </div>

    <div v-show="forPswArticle == 2">
      <div class="f-title">
        <div class="first-article">{{ $t('第二步:短信验证') }}</div>
      </div>

      <div class="regRow regPhone">
        <div class="rowkey">{{ $t('用户名') }}：</div>
        <div class="rowVal phone">{{ account  }}</div>
      </div>
      <!-- <div class="logErrMsg u-flex-a"></div> -->

      <div class="logRow logVerifyCode">
        <div class="rowkey updateColor">{{ $t('验证码') }}：</div>
        <input
          type="text"
          class="input"
          :placeholder=" $t('请输入验证码')"
          v-model="phoneCode"
          @keyup.enter="submit()"
        />
        <div
          class="getPhoneCode u-flex-all"
          :class="!isDisable ? 'themeColorkBgc' : 'disabledPhone'"
          @click="getPhoneCode"
        >
          {{ count == 0 ? $t('获取验证码') : count + "s" }}
        </div>
      </div>
      <div class="errTips">{{ modalData.content }}</div>

      <div
        class="registerBtn u-flex-all themeColorkBgc"
        :class="pDisabled ? 'u-btn-disabled' : 'u-btn-undisabled cursorPoint'"
        @click="submit()"
      >
        {{ $t('确认提交') }}
      </div>

      <div class="regRegister u-flex-all cursorPoint" @click="customerService">
        {{ $t('忘记账号？请联系') }}
        <span class="themeTextColor">{{ $t('在线客服') }}</span>
      </div>
    </div>

    <template v-if="forPswArticle == 3">
      <div class="f-title">
        <div class="first-article">{{ $t('第三步:修改新密码') }}</div>
      </div>

      <div class="regRow regPassword">
        <div class="rowkey">{{ $t('新密码') }}：</div>
        <input
          type="password"
          class="input"
          :placeholder="$t('请输入新密码')"
          v-model="password"
          @focus="passwordFocus"
          @blur="passwordBlur"
        />
      </div>
      <!-- <div class="logErrMsg u-flex-a">{{ errors.password }}</div> -->

      <div class="regRow regPassword">
        <div class="rowkey">{{ $t('确认密码') }}：</div>
        <input
          type="password"
          class="input"
          :placeholder="$t('请输入确认密码')"
          v-model="confirmPassword"
          @blur="confirmPasswordBlur"
        />
      </div>
      <!-- <div class="logErrMsg u-flex-a">{{ errors.confirmPassword }}</div> -->
      <div class="errTips">{{ modalData.content }}</div>

      <div
        class="registerBtn u-flex-all"
        :class="pswDisabled ? 'u-btn-disabled' : 'u-btn-undisabled cursorPoint'"
        @click="submit()"
      >
        {{ $t('确认提交') }}
      </div>

      <div class="regRegister u-flex-all cursorPoint" @click="customerService">
        {{ $t('忘记账号？请联系') }}
        <span class="themeTextColor">{{ $t('在线客服') }}</span>
      </div>
    </template>

    <!-- <tips ref="tips" :modalData="modalData" @confirm="confirmFn"></tips> -->
  </div>
</template>

<script>
import gt from "../../utils/gt.js";
import "../../utils/smcp.min.js";
import "../../utils/boc.js"
export default {
  name: "returnWater",
  data() {
    return {
      show: false,
      isShowClose: false,
      forPswArticle: 1,
      accountNumber: "",
      captchaCode: "",
      captchaKey: "",
      verifyCodeImg: "",
      isClickRegister: true,
      disabled: true,
      errors: {},
      modalData: {
        content: "",
      },
      isClickLogin: true,
      account:'',
      phone: "12345678900",
      phoneCode: "",
      count: 0,
      timer: null,
      isDisable: false, //禁止再次发送短信验证码
      pDisabled: true,
      password: "",
      confirmPassword: "",
      pswDisabled: true,
      memberId: "", //用户id
      countSec: 0, //几秒后跳转登录
      timerId: null,
      handLoginFlag: false, //手动点击去登录页面
      type: 2, //行为校验2
      captcha: null, //行为校验
      captchaBox: null,
      captchaText: "",
      captchaMask: false,
      errorCode: false,
      // 数美验证码
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
  mounted() {
    this.getDefaultStatus();
  },
  filters: {
    phoneEncode(val) {
      //手机号加密
      if (val) {
        return val.substr(0, 3) + "****" + val.substr(-4);
      }
    },
  },
  methods: {
    // 获取   getDefaultStatus
    getDefaultStatus() {
      let _this = this;
      this.$http.get(this.$api.getDefaultStatus, false).then((res) => {
        if (res.code == 0) {
          // type   0：默认验证码  1：极验  2：数美"
          _this.type = res.data.type;
          // _this.type = 1;
          if (_this.type === 0) {
            //图片验证码
            //获取验证码图片
            this.captchaData();
          } else if (_this.type === 1 || _this.type === 3) {
            //1：极验
            _this.disabled = false;
            _this.reset();
          } else if (_this.type === 2) {
            //2：数美"
            Object.assign(_this.smData,res.data)
            _this.reset();
          }
        } else {
          this.errorCode = true;
          this.type = null;
          this.moneyModeListReqSuccess = false;
          this.$message.error(this.$t('加载失败，请重试'));
        }
      });
    },
    //行为校验↓
    reset() {
      this.check();
      this.getCaptcha();
    },
    check() {
      if(this.type === 1){
         if (this.captcha) {
            this.captchaText = "";
          } else {
            this.captchaText = this.$t('正在加载') + "...";
          }
      } else if(this.type ===3){
         this.captcha && this.captcha.reset()
      }
     
    },
    getCaptcha() {
      if (this.type == 1) {
        let _this = this;
        this.$http
          .get(this.$api.geetFirstRegister, "?t=" + window.childCode, false)
          .then((res) => {
            if (res.code == 0) {
              window.initGeetest(
                {
                  gt: res.data.gt,
                  challenge: res.data.challenge,
                  new_captcha: res.data.newCaptcha, // 用于宕机时表示是新验证码的宕机
                  offline: res.data.success === 1 ? false : true, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                  product: "float", // 产品形式，包括：float，popup
                  width: "100%",
                  lang: "cn",
                },
                _this.onCaptcha
              );
            } else {
              this.$message.error(this.$t("获取错误"));
            }
          });
      } else if (this.type == 2) {
          let data ={
            ...this.smData,
            width:300,
            https:location.protocol == "https:"
				  }
        initSMCaptcha(
            data,
            this.onCaptcha
        );
      } else if(this.type === 3){
         if(!this.captcha){
              initBotion({
                  captchaId: this.$config.captchaId,
                  product: 'popup',//float  popup
                  language: 'vie',
                  nativeButton:{
                      width: '100%',
                      height: '42px'
                  }
              }, this.onCaptcha);
          }
      }
    },
    onCaptcha(res) {
      //res是验证实例，可以调用res的示例方法
      var _this = this;
      this.captcha = res;
      if (_this.type == 1) {
        res.appendTo("#captcha3");
        res.onReady(_this.check);
      } else if (this.type == 2) {
        this.captchaText = this.$t("点击验证");
        this.captcha.onSuccess(function(data) {
          if (data.pass) {
            _this.disabled = false;
            _this.captcha.rid = data.rid;
            _this.captchaText = this.$t("验证成功");
            _this.captchaMask = false;
          } else {
            _this.captcha.rid = null;
            _this.captchaText = this.$t("验证失败");
          }
        });

        this.captcha.onError(function(errType, errMsg) {
          _this.captcha.rid = null;
          _this.captchaText = this.$t("验证失败");
          _this.captchaMask = false;
        });

        this.captcha.onClose(function() {
          _this.captchaMask = false;
        });
      }else if(this.type === 3){
        res.appendTo("#gt42")
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
    captchaData: async function(type) {
      let _this = this;
      const res = await this.$http.get(_this.$api.captcha);
      if (res.code == 0) {
        _this.verifyCodeImg = res.data.captcha_image_content;
        // _this.captchaCode = res.data.captchaCode;
        _this.captchaKey = res.data.captchaKey;

        if (type == "errRefresh") {
          _this.isClickRegister = true;
        }
      } else {
        //  this.$http.showMesasge(res.msg + "");
      }
    },
    accountBlur() {
      //大写字母强制转化为小写
      this.accountNumber = this.accountNumber.toLowerCase();
      //全角转半角
      this.accountNumber = this.toCDB(this.accountNumber);
      //删除所有空格
      this.accountNumber = this.accountNumber.replace(/\ /g, "");
    },
    toCDB(str) {
      //全角转为半角
      var tmp = "";
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) == 12288) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
        }
        if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        } else {
          tmp += String.fromCharCode(str.charCodeAt(i));
        }
      }
      return tmp;
    },
    accountIsDisabled() {
      //注册按钮是否禁用
      if (this.type === 0) {
        this.disabled = !(this.accountNumber && this.captchaCode);
      }
    },
    pVerifyIsDisabled() {
      this.pDisabled = !Boolean(this.phoneCode);
    },
    async submit() {
      let captcha3 = document.querySelector("#captcha3");
      var _this = this;
      if (this.forPswArticle == 1) {
        let result = null;
        //禁用
        // if (_this.disabled) {
        if (!_this.accountNumber) {
          _this.$http.showMesasge(this.$t("账号不能为空"));
        } else if (!this.captchaCode && this.type === 0) {
          _this.$http.showMesasge(this.$t("验证码不能为空"));
        }
        //   return;
        // }

        if (_this.type != 0) {
          result = _this.captcha.getValidate();
          if (!result) {
            _this.$http.showMesasge(this.$t("请先通过行为验证"));
            return;
          }
        }
        if (!this.isClickLogin) {
          return;
        }
        this.isClickLogin = false;

        var params = {
          validateType: _this.type,
          name: _this.accountNumber,
        };

        //账号处理
        if (window.mergeAccount) {
          params.name = this.accountNumber + window.mergeAccount;
        }

        if (this.type === 0) {
          params.captchaKey = this.captchaKey;
          params.captchaCode = this.captchaCode;
        } else if (this.type === 1) {
          params.geeTestQueryVO = {
            challenge: result.geetest_challenge,
            seccode: result.geetest_seccode,
            validate: result.geetest_validate,
          };
        } else if (this.type === 2) {
          params.shuMeiQueryVO = {
            rid: result.rid,
          };
        } else if(this.type === 3){
          params.geeTestQueryVO = result
        }
        var res = await _this.$http.post(_this.$api.getMemberByName, params);
        if (res.code == 0) {
          // _this.phone = res.data.phone;
          _this.account = res.data.name
          _this.memberId = res.data.memberId;

          //第一步验证通过
          _this.forPswArticle = 2;
          //数据初始化
          _this.modalData.content = "";
          _this.accountNumber = "";
          _this.captchaCode = "";
          _this.isClickLogin = true;
          _this.captchaData();
        } else {
          this.isClickLogin = true;
          //重置行为校验
          if (_this.type === 1) {
            captcha3.innerHTML = "";
          }
          _this.getDefaultStatus();
          //账号有误或者手机未绑定
          _this.modalData.content = res.msg;
        }
      } else if (this.forPswArticle == 2) {
        //禁用
        if (_this.pDisabled) {
          if (!_this.phoneCode) {
            _this.$http.showMesasge(this.$t('短信验证码不能为空'));
          }
          return;
        }
        var params = {
          phone: _this.phone,
          name:_this.account,
          smsCode: _this.phoneCode,
        };

        var res = await _this.$http.post(_this.$api.checkSmsCode, params);
        if (res.code == 0) {
          //第二步验证通过
          _this.forPswArticle = 3;
          //数据初始化
          _this.modalData.content = "";
          _this.count = 0;
          clearInterval(_this.timer);
          _this.timer = null;
          _this.isDisable = false;
        } else {
          //短信验证失败
          _this.modalData.content = res.msg;

          _this.count = 0;
          clearInterval(_this.timer);
          _this.timer = null;
          _this.isDisable = false;
        }
      } else if (this.forPswArticle == 3) {
        if (_this.pswDisabled) {
          //禁用
          if (!_this.password) {
            _this.$http.showMesasge(this.$t('新密码不能为空'));
          } else if (!_this.confirmPsw) {
            _this.$http.showMesasge(this.$t('请再次输入新密码'));
          }
          return;
        } else {
          //正则校验
          // if (!_this.passwordIsValid()) {
          //   _this.$http.showMesasge("新密码必须为6-15位字母或数字");
          //   return;
          // } 
          if (!_this.passwordIsconfirmPsw()) {
            _this.$http.showMesasge(this.$t("新密码与确认密码必须一致"));
            return;
          }
        }
        var params = {
          memberId: _this.memberId,
          password: _this.password,
          code: _this.phoneCode,
          name: _this.account,
        };

        var res = await _this.$http.post(
          _this.$api.resetMemberPwdByClient,
          params
        );

        if (res.code == 0) {
          //找回密码成功
          this.modalData.content = this.$t("修改成功，5S后进入登录界面");

          //5秒倒计时
          const allSec = 5;
          if (!this.timerId) {
            this.countSec = allSec;
            this.timerId = setInterval(() => {
              if (this.countSec > 1 && this.countSec <= allSec) {
                this.countSec--;
                if (this.handLoginFlag) {
                  //手动点击跳转
                  clearInterval(this.timerId);
                  this.timerId = null;
                } else {
                  this.modalData.content =
                   this.$t( "修改成功，{x}S后进入登录界面", { x: this.countSec });
                }
              } else {
                clearInterval(this.timerId);
                this.timerId = null;
                _this.show = false;
                this.$router.push("/");
              }
            }, 1000);
          }
        } else {
          //修改新密码失败
          this.modalData.content = res.msg;
        }
      }
    },
    customerService() {
      if (['vi'].includes(window.locale)) { // betcome直接跳客服窗口
        const url = this.$common.getCustomerService();
        window.open(url, "_blank");
        return;
      }
         //新旧客服判断
           if(window.customerServiceStatus == 1){  //新客服
              var obj = {};
              obj.host = this.$common.getHost();
              obj.clientCode = window.clientCode;
              obj.clientItem = window.childCode;
              obj.username = this.$common.getUser() && this.$common.getUser().username;
              obj.language = this.$i18n.locale;
              obj.theme = window.theme;
              obj.projectImgUrl = window.projectImgUrl;
              obj.orgin = window.location.origin + "/activity";
              var str = JSON.stringify(obj);
              str = window.btoa(str);
              let url = location.origin + "/func" + "/customerService/pc?s=" +str;
              window.open(url, "_blank");
          }else{ //旧客服
                const url = this.$common.getCustomerService();
                window.open(url, "_blank");
          }
    },
    confirmFn(successCode) {
      this.isClickLogin = true;
      if (this.timerId && successCode == 200) {
        //定时器跳login， 就不再次触发了
        this.handLoginFlag = true;
        this.show = false;
        this.$router.push("/");
      }
    },
    async getPhoneCode() {
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
        const res = await _this.$http.get(
          _this.$api.mobilebyacc,
          "/" + _this.account + "?functionId=" + 2
        );
        if (res.code == 0) {
          console.log(this.$t("获取手机验证码成功"));
        } else {
          console.log(res.msg, this.$t("获取手机验证码失败"));
        }
      }
    },
    passwordFocus() {
      //聚焦，提示
      this.modalData = {};
      this.$set(this.modalData, "content", this.$t("请输入密码"));
    },
    passwordBlur() {
      // this.password = this.password.toLowerCase();
      //全角转半角
      this.password = this.toCDB(this.password);
      //删除所有空格
      // this.password = this.password.replace(/\ /g, "");
      this.errors.password = "";
    },
    confirmPasswordBlur() {
      // this.confirmPassword = this.confirmPassword.toLowerCase();
      //全角转半角
      this.confirmPassword = this.toCDB(this.confirmPassword);
      // this.confirmPassword = this.confirmPassword.replace(/\ /g, "");
    },
    passwordIsValid() {
      //密码校验
      return this.password
    },
    passwordIsconfirmPsw() {
      //密码和确认密码是否相同
      return this.password == this.confirmPassword;
    },
    pswVerifyIsDisabled() {
      if (this.password && this.confirmPassword) {
        this.pswDisabled = false;
        return;
      }
      this.pswDisabled = true;
    },
  },
  watch: {
    accountNumber() {
      this.accountIsDisabled();
    },
    captchaCode() {
      this.accountIsDisabled();
    },
    phoneCode() {
      this.pVerifyIsDisabled();
    },
    password() {
      this.pswVerifyIsDisabled();
    },
    confirmPassword() {
      this.pswVerifyIsDisabled();
    },
  },
};
</script>
<style lang="less">
.getCode {
  background: #e4e4e4 !important;
  line-height: 3;
  width: 100%;
  color: #6c716b;
  .refimg {
    width: 0.22rem;
    vertical-align: middle;
  }
}
.forgetPswLayout {
  position: relative;
  padding: 20px;

  .forgetPswClose {
    position: absolute;
    top: 0.14rem;
    right: 0.14rem;
    width: 0.17rem;
    height: 0.17rem;
    transition: 1s;
    cursor: pointer;
  }
  .forgetPswClose:hover {
    transform: rotate(180deg);
  }
  .f-title {
    margin-bottom: 0.38rem;
    .logTitle {
      height: 0.4rem;
      font-size: 0.28rem;
      font-weight: bold;
      color: #2d2b4d;
      margin-bottom: 0.16rem;
    }

    .first-article {
      font-size: 0.22rem;
      font-weight: 500;
      text-align: center;
      color: #333333;
    }
  }

  .regRow {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .rowkey {
      width: 80px;
      text-align: left;
      position: relative;
    }
    input {
      /* width: 100%; */
      flex: 1;
    }
    .rowVal {
      flex: 1;
      text-align: left;
    }
    .phone {
      height: 40px;
      line-height: 40px;
      background: #f4f4f4;
      border: 1px solid #ccd6e4;
      border-radius: 5px;
      font-size: 15px;
      color: #9695a6;
      padding-left: 8px;
      box-sizing: border-box;
    }
  }

  .errTips {
    width: 100%;
    padding: 0.05rem 0;
    color: red;
    font-size: 16px;
    background-color: #fff;
    margin: 10px 0;
  }
  .logRow {
    width: 100%;
    display: flex;
    align-items: center;
    .rowkey {
      width: 80px;
      text-align: left;
      word-break: keep-all;
    }
    input {
      /* width: 100%; */
      flex: 1;
    }
    .getPhoneCode {
      width: 90px;
      height: 40px;
      border-radius: 5px;
      color: #fff;
      font-size: 12px;
      padding: 0px 5px;
      word-break: keep-all;
    }

    .disabledPhone {
      background: #f4f4f4;
      border: 1px solid #ccd6e4;
      border-radius: 0.08rem;
      color: #9695a6;
    }
  }
  .logVerifyCode {
    display: flex;
    input {
      flex: 1;
      margin-right: 0.08rem;
    }
    .verifyCodeImg {
      width: 1.27rem;
      height: 0.44rem;
      border-radius: 0.08rem;
      background-color: #eeeeee;
      background-size: 100% 100%;
    }
  }
  .captchaStyle{
      cursor:pointer;
      justify-content: center;
      align-items: center;
      display: flex;
      align-items: center;
      height: 0.36rem;
      padding-left: 0.08rem;
      border-radius: 0.08rem;
      font-size: .16rem;
      background: #ecf0f1;
      color: #616161;
      margin-bottom: 0.2rem;
      box-shadow: 0px 3px 6px 0px #bababa;
      &:hover{
          color: #fff;
          background: #e34543;
      }
  }
  .logErrMsg {
    width: 100%;
    color: #f5726e;
    font-size: 0.11rem;
    height: 0.3rem;
    padding-left: 1rem;
    box-sizing: border-box;
  }
  .registerBtn {
    margin: 20px 0 16px 0;
    padding-right: 0.2rem;
    width: 100%;
    height: 50px;
    border-radius: 5px;
    font-size: 15px;
    background-color: #e34543;
    color: #fff;
    box-sizing: border-box;
  }

  .regRegister {
    width: calc(100% - 0.4rem);
    padding-right: 0.2rem;
    font-size: 0.12rem;
    height: 0.12rem;
    line-height: 0.13rem;
  }
  .input {
    height: 40px;
    background-color: rgb(236, 240, 241);
  }
  .themeColorkBgc {
    background-color: #e34543;
  }
}
</style>
