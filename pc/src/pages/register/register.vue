<template>
  <div class="registerLayout">
    <el-dialog
      custom-class="regDialog"
      :visible.sync="show"
      width="7rem"
      :show-close="isShowClose"
      :before-close="notHideDialog"
      :modal-append-to-body="false"
    >
      <div class="logDialog-title">
        <span
          class="loginClose"
          :style="
            'background-image:url(' +
              require('../../assets/image/close.png') +
              ')'
          "
          @click="hideDialog"
        ></span>
      </div>

      <div class="register-title">{{ $t('注册账号') }}</div>

      <!-- 内容列表 -->
      <div class="regList">
        <el-scrollbar ref="multipleTable">
          <div class="regRow regAccountNumber">
            <div class="rowkey"><span class="required">★</span> {{ $t('账号') }}：</div>
            <input
              class="input"
              :placeholder="$t('请输入账号')"
              v-model="accountNumber"
              :maxlength="accountLength"
              @focus="accountFocus"
              @blur="accountBlur"
              autofocus
            />
          </div>
          <div class="logErrMsg u-flex-a">{{ errors.account }}</div>

          <div class="regRow regPassword">
            <div class="rowkey"><span class="required">★</span>{{ $t('密码') }}：</div>
            <input
              type="password"
              class="input"
              :placeholder="$t('请输入密码')"
              v-model="password"
              @focus="passwordFocus"
              @blur="passwordBlur"
            />
          </div>
          <div class="logErrMsg u-flex-a">{{ errors.password }}</div>

          <div class="regRow regPassword">
            <div class="rowkey"><span class="required">★</span>{{ $t('确认密码') }}：</div>
            <input
              type="password"
              class="input"
              :placeholder="$t('请输入确认密码')"
              v-model="confirmPassword"
              @blur="confirmPasswordBlur"
            />
          </div>
          <div class="logErrMsg u-flex-a">{{ errors.confirmPassword }}</div>

          <div class="regRow regPhone" v-if="regFlag && regFlag.phone">
            <div class="rowkey">
              <span class="required" v-if="regFlag.phone == 2">★</span>{{ $t('手机号') }}：
            </div>
            <input
              type="text"
              class="input"
              :placeholder="
                regFlag.phone == 1 ? $t('请输入手机号') + '（' + $t('选填') + '）' : $t('请输入手机号')
              "
              @blur="phone = toCDB(phone)"
              v-model="phone"
            />
            <!--  maxlength="11" -->
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag && regFlag.phone">
            {{ errors.phone }}
          </div>
          <div class="regRow regPhone" style="margin-bottom: 20px" v-if="regFlag&&regFlag.phone == 2&&regFlag.smsCode == 1">
            <div class="rowkey">
              <span class="required">*</span>{{ $t('验证码') }}:
            </div>
            <input
              type="text"
              class="input"
              v-model="smsCode"
              :placeholder="$t('请输入短信验证码')"
            />
            <el-button
              type="primary"
              :disabled="codeButDis"
              class="butCode themeBtn btnBuy verPCode"
              @click="getPhoneCode"
            >
               {{ codeButtext }}
            </el-button>
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag&&regFlag.phone == 2&&regFlag.smsCode == 1"></div>
          <div class="regRow regCode" v-if="regFlag && regFlag.inviteCode">
            <div class="rowkey">
              <span class="required" v-if="regFlag.inviteCode == 2">★</span
              >{{ $t('邀请码') }}：
            </div>
            <input
              v-if="sessData"
              type="text"
              class="input"
              :placeholder="
                regFlag.inviteCode == 1
                  ? $t('请输入邀请码') + '（' + $t('选填') + '）'
                  : $t('请输入邀请码')
              "
              v-model="inviteCode"
              @focus="inviteCodeFocus"
              @blur="inviteCodeBlur"
              :disabled="sessData ? true : false"
            />
            <input
              v-else
              type="text"
              class="input"
              :placeholder="
                regFlag.inviteCode == 1
                  ? $t('请输入邀请码')+ '（' + $t('选填') + '）'
                  : $t('请输入邀请码')
              "
              v-model="inviteCode"
              @focus="inviteCodeFocus"
              @blur="inviteCodeBlur"
            />
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag && regFlag.inviteCode">
            {{ errors.inviteCode }}
          </div>

          <!-- 姓名 -->
          <div class="regRow regRealName" v-if="regFlag && regFlag.realName">
            <div class="rowkey">
              <span class="required" v-if="regFlag.realName == 2">★</span>{{ $t('姓名') }}：
            </div>

            <input
              type="text"
              class="input"
              :placeholder="
                regFlag.realName == 1 ? $t('请输入姓名') + '（' + $t('选填') + '）' : $t('请输入姓名')
              "
              v-model="realName"
            />
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag && regFlag.realName">
            {{ errors.realName }}
          </div>

          <!-- 性别 -->
          <div class="regRow regSex" v-if="regFlag && regFlag.sex">
            <div class="rowkey">
              <span class="required" v-if="regFlag.sex == 2">★</span>{{ $t('性别') }}：
            </div>
            <!-- <div class="btnTextColor">请选择性别：</div> -->
            <div class="maleSex" @click="sex = 1">
              <img loading="lazy"
                class="sexImg"
                v-lazy="
                  sex == 1
                    ? require('@/assets/image/gameImg/regChecked.png')
                    : require('@/assets/image/gameImg/regUnCheck.png')
                "
              />
              <span class="btnTextColor">{{ $t('男') }}</span>
            </div>

            <div class="femaleSex" @click="sex = 0" style="margin-left:0.5rem;">
              <img loading="lazy"
                class="sexImg"
                v-lazy="
                  sex == 0
                    ? require('@/assets/image/gameImg/regChecked.png')
                    : require('@/assets/image/gameImg/regUnCheck.png')
                "
              />
              <span class="btnTextColor">{{ $t('女') }}</span>
            </div>
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag && regFlag.sex">
            {{ errors.phone }}
          </div>

          <!--生日 -->
          <div class="regRow regBirthday" v-if="regFlag && regFlag.birthday">
            <div class="rowkey">
              <span class="required" v-if="regFlag.birthday == 2">★</span>{{ $t('生日') }}：
            </div>
            <!-- <input type="text" class="input" placeholder="请输入生日" v-model="birthday" /> -->
            <el-date-picker
              v-model="birthday"
              type="date"
              :placeholder="
                regFlag.birthday == 1 ? $t('请输入生日') + '（' + $t('选填') + '）' : $t('请输入生日')
              "
            ></el-date-picker>
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag && regFlag.birthday">
            {{ errors.birthday }}
          </div>

          <!-- 微信 -->
          <!-- <div class="regRow regWechat" v-if="regFlag && regFlag.wechat">
            <div class="rowkey">
              <span class="required" v-if="regFlag.wechat == 2">★</span>{{ $t('微信号') }}：
            </div>
            <input
              type="text"
              class="input"
              maxlength="20"
              :placeholder="
                regFlag.wechat == 1
                  ? $t('请输入微信号码') + '（' + $t('选填') + '）'
                  : $t('请输入微信号码')
              "
              v-model="wechat"
            />
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag && regFlag.wechat">
            {{ errors.wechat }}
          </div> -->

          <!-- qq -->
          <div class="regRow regQQ" v-if="regFlag && regFlag.qq">
            <div class="rowkey">
              <span class="required" v-if="regFlag.qq == 2">★</span>{{ $t('QQ号') }}：
            </div>
            <input
              type="text"
              class="input"
              maxlength="15"
              :placeholder="
                regFlag.qq == 1 ? $t('请输入QQ号码') + '（' + $t('选填') + '）' : $t('请输入QQ号码')
              "
              v-model="qq"
            />
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag && regFlag.qq">
            {{ errors.qq }}
          </div>

          <!-- email -->
          <div class="regRow regEmail" v-if="regFlag && regFlag.email">
            <div class="rowkey">
              <span class="required" v-if="regFlag.email == 2">★</span>{{ $t('邮箱') }}：
            </div>
            <input
              type="text"
              class="input"
              :placeholder="
                regFlag.email == 1 ? $t('请输入邮箱地址') + '（' + $t('选填') + '）' : $t('请输入邮箱地址')
              "
              v-model="email"
            />
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag && regFlag.email">
            {{ errors.email }}
          </div>

          <!-- 地址 -->
          <div class="regRow regAddress" v-if="regFlag && regFlag.address">
            <div class="rowkey">
              <span class="required" v-if="regFlag.address == 2">★</span>{{ $t('地址') }}：
            </div>
            <input
              type="text"
              class="input"
              :placeholder="
                regFlag.address == 1 ? $t('请输入联系地址') + '（' + $t('选填') + '）' : $t('请输入联系地址')
              "
              v-model="address"
            />
          </div>
          <div class="logErrMsg u-flex-a" v-if="regFlag && regFlag.address">
            {{ errors.address }}
          </div>

          <!-- 验证码 -->

          <div v-show="type === 0" class="logRow logVerifyCode">
            <div class="rowkey updateColor">
              <span class="required">★</span>{{ $t('验证码') }}：
            </div>
            <input
              type="text"
              class="input"
              :placeholder="$t('请输入验证码')"
              v-model="captchaCode"
              @keyup.enter="register()"
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
              <img loading="lazy" v-lazy="require('../../assets/image/refresh.png')" class="refimg" />
              {{ $t('重新获取') }}
            </div>
          </div>
          <!-- 行为校验  树莓 -->
          <div
            v-show="type === 2"
            id="captcha"
            class="loginBtn captchaStyle"
            @click="captchaClick"
          >
            {{ captchaText }}
          </div>
          <!--  行为验证 急眼 -->
          <div v-show="type === 1" id="captcha2" class></div>
          <!-- 极验4 -->
          <div v-if="type === 3" id="gt41"></div>
          <div>
            <div v-if="errorCode" class="getCode" @click="getDefaultStatus">
              <img loading="lazy" v-lazy="require('../../assets/image/refresh.png')" class="refimg" alt />
              {{ $t('重新获取') }}
            </div>
          </div>
        </el-scrollbar>
      </div>

      <div class="regAgreement u-flex-all" style="padding-right:0.2rem;">
        <div
          class="regCheckBox u-flex-all"
          :style="
            !isSelect
              ? 'background-image:url(' +
                require('../../assets/image/regUnCheck.png') +
                ')'
              : 'background-image:url(' +
                require('../../assets/image/regChecked.png') +
                ')'
          "
          @click="switchSelect"
        >
          <!-- <div class="regSelected" v-if="isSelect"></div> -->
        </div>
        <div class="regAgreementCont" style="margin-left:0.12rem;">
          {{ $t('我已届满合法博彩年龄，且同意各项开户条约') }}
        </div>
      </div>

      <div class="registerBtn u-flex-all" @click="register()">{{ $t('注册') }}</div>
    </el-dialog>
  </div>
</template>
<script>
import store from "../../store/store";
import gt from "../../utils/gt.js";
import { _getDeviceId }  from '../../utils/finger.js';
import "../../utils/smcp.min.js";
import "../../utils/boc"
export default {
  name: "register",
  data() {
    return {
      isShowClose: false,
      accountNumber: "",
      password: "",
      confirmPassword: "",
      phone: "",
      smsCode:'',
      inviteCode: "",
      codeButDis: false,
      isSelect: true, //默认选中协议
      disabled: true,
      errors: {},
      isClickRegister: true, //只有第一次注册生效
      window: window,
      sessData: "",
      realName: "",
      sex: 1,
      birthday: "",
      wechat: "",
      qq: "",
      email: "",
      address: "",
      regFlag: null, //注册设置
      captchaCode: "",
      captchaKey: "",
      verifyCodeImg: "",
      type: 2, //行为校验2
      captcha: null, //行为校验
      captchaBox: null,
      captchaText: "",
      captchaMask: false,
      errorCode: false,
      codeButtext: this.$t("获取验证码"),
      intervalID: "", //计时器
      // 数美请求参数
      smData: {
        lang: '',
        mode: '',
        organization: '',
        product: '',
        appId: '',
        channel: '',
      },
      fingerprintState:false,
      accountLength:10,//默认账号限制
      accountTips:'',
    };
  },
  props: {
    show: Boolean,
  },
  mounted() {
    // this.getDefaultStatus();
    this.accountLength = 10
    this.accountTips = this.$t("请输入{x}位数字与字母组合", { x: '4~10' })
  },
  methods: {
//获取验证码
    getPhoneCode() {
        // if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        //     // this.$message.error('手机号格式错误');
        //     this.$message.error(this.$t('手机号格式错误'));
        //     return;
        // }
        if (!this.phone) {
          this.$message.error(this.$t('请输入手机号'));
          return;
        }
        this.$http
            .get(
                this.$api.sendSmsCode + "/" + this.phone +`?functionId=8&codePrefix=${this.$config.codePrefix}&codeFlag=1`)
            .then((res) => {
                if (res.code == 0) {
                    this.$message.success(this.$t('获取验证码成功'));
                    this.codeButDis = true;
                    var time = 60;
                    this.intervalID = setInterval(() => {
                        time--;
                        this.codeButtext = this.$t('获取验证码') + "(" + time + ")";
                        if (time == 0) {
                            this.codeButDis = false;
                            clearInterval(this.intervalID);
                            this.codeButtext = this.$t('获取验证码');
                            time = 60;
                        }
                    }, 1000);
                } else {
                    let msg =res.msg
                    this.$message.error(msg);
                }
            });
    },
    getDefaultStatus() {
      let _this = this;
      this.$http.get(this.$api.getDefaultStatus, false).then((res) => {
        if (res.code == 0) {
          // type   0：默认验证码  1：极验  2：数美"
          _this.type = res.data.type;
          //  _this.type = 2
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
          this.fingerprintState = res.data.fingerprintState
          if(this.fingerprintState){
              _getDeviceId(res.data.fingerprintId).then( res => {
                  this.$config.fingerprint = res
                  sessionStorage.setItem('fingerprint', res);
              })
          }
        } else {
          this.errorCode = true;
          this.type = null;
          this.moneyModeListReqSuccess = false;
          this.$http.showMesasge(this.$t("加载失败，请重试"));
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
              this.$http.showMesasge(this.$t('获取错误'));
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
        res.appendTo("#captcha2");
        res.onReady(_this.check);
        // this.isClickRegister = true;
      } else if (this.type == 2) {
        this.captchaText = this.$t('点击验证');
        this.captcha.onSuccess(function(data) {
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

        this.captcha.onError(function(errType, errMsg) {
          _this.captcha.rid = null;
          _this.captchaText = this.$t('验证失败');
          _this.captchaMask = false;
        });

        this.captcha.onClose(function() {
          _this.captchaMask = false;
        });
      } else if(this.type === 3){
        res.appendTo("#gt41")
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
      // this.isClickRegister = true;
      if (res.code == 0) {
        _this.verifyCodeImg = res.data.captcha_image_content;
        // _this.captchaCode = res.data.captchaCode;
        _this.captchaKey = res.data.captchaKey;
      } else {
        // this.$http.showMesasge(res.msg + "");
      }
    },
    async getRegisterSet() {
      var _this = this;
      var key = "member_register";
      let res = await this.$http.get(this.$api.getRegisterSet, key);
      if (res.code == 0) {
        _this.regFlag = res.data.svalue;
      }
    },
    switchSelect() {
      this.isSelect = !this.isSelect;
    },
    hideDialog() {
      //隐藏
      this.$emit("hideRegister");
      this.smsCode = '';
    },
    notHideDialog() {},
    registerIsDisabled() {
      //注册按钮是否禁用
      var oldIsDisable = true;
      if (this.type === 0) {
        oldIsDisable =
          this.accountNumber &&
          this.password &&
          this.confirmPassword &&
          this.isSelect &&
          this.captchaCode;
      }
      var requiredFields = [];
      var flag = false;
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
            boolean *= Boolean(this[requiredFields[i]]);
          }
        }
      }

      var newIsDisable = boolean;
      if (oldIsDisable && newIsDisable) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    accountFocus() {
      //聚焦，提示
      this.errors = {};
      this.$set(this.errors, "account", this.accountTips);
    },
    accountBlur() {
      //大写字母强制转化为小写
      this.accountNumber = this.accountNumber.toLowerCase();
      //全角转半角
      this.accountNumber = this.toCDB(this.accountNumber);
      //删除所有空格
      this.accountNumber = this.accountNumber.replace(/\ /g, "");
      this.errors.account = "";
    },
    passwordFocus() {
      //聚焦，提示
      this.errors = {};
      this.$set(this.errors, "password", this.$t('请输入密码'));
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
    inviteCodeFocus() {
      //聚焦，提示
      this.errors = {};
      this.$set(this.errors, "inviteCode", this.$t('请输入字母或数字'));
    },
    inviteCodeBlur() {
      //全角转半角
      this.inviteCode = this.toCDB(this.inviteCode);
      this.errors.inviteCode = "";
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
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,10}$/.test(
        this.accountNumber
      );
    },
    passwordIsValid() {
      //密码校验
      // return /^[a-zA-Z0-9]{6,15}$/.test(this.password);
      return this.password
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
    //   //真实姓名校验
    //   if (this.realName) {
    //     return /^.{0,8}$/.test(this.realName);
    //   } else {
    //     return true;
    //   }
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
    timeSwitch(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var time = Y + M + D;
        return time;
      }
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
        if (key == "birthday") {
          return _this.timeSwitch(_this.birthday);
        } else {
          return _this[key];
        }
      }
    },
    async register() {
      //禁止重复点击
      if (!this.isClickRegister) {
        return;
      }
      this.isClickRegister = false;

      setTimeout(() => {
        this.isClickRegister = true;
      }, 3000);

      let captcha2 = document.querySelector("#captcha2");
      var _this = this;
      //禁用
      // if (_this.disabled) {
      if (this.regFlag.inviteCode == 2 && !this.inviteCode.trim()) {
        //必填却没值
        this.$http.showMesasge(this.$t('邀请码不能为空'));
        return;
      } else if (!_this.accountNumber) {
        this.$http.showMesasge(this.$t('账号不能为空'));
        return;
      } else if (!_this.password) {
        this.$http.showMesasge(this.$t('密码不能为空'));
        return;
      } else if (!_this.confirmPassword) {
        this.$http.showMesasge(this.$t('确认密码不能为空'));
        return;
      } else if (this.regFlag.phone == 2 && !this.phone.trim()) {
        this.$http.showMesasge(this.$t('手机号不能为空'));
        return;
        } else if (this.regFlag.phone == 2&&this.regFlag.smsCode == 1&& !this.smsCode.trim()) {
        this.$http.showMesasge(this.$t('请输入短信验证码'));
        return;
      } else if (this.regFlag.realName == 2 && !this.realName.trim()) {
        this.$http.showMesasge("姓名不能为空！");
        return;
      } else if (this.regFlag.birthday == 2 && !this.birthday) {
        this.$http.showMesasge(this.$t('生日不能为空'));
        return;
      } else if (this.regFlag.wechat == 2 && !this.wechat.trim()) {
        this.$http.showMesasge(this.$t('微信号不能为空'));
        return;
      } else if (this.regFlag.qq == 2 && !this.qq.trim()) {
        this.$http.showMesasge(this.$t('QQ号不能为空'));
        return;
      } else if (this.regFlag.email == 2 && !this.email.trim()) {
        this.$http.showMesasge(this.$t('邮箱不能为空'));
        return;
      } else if (this.regFlag.address == 2 && !this.address.trim()) {
        this.$http.showMesasge(this.$t('地址不能为空'));
        return;
      } else if (!this.captchaCode.trim() && this.type == 0) {
        this.$http.showMesasge(this.$t('验证码不能为空'));
        return;
      } else if (!this.isSelect) {
        this.$http.showMesasge(this.$t('请先勾选开户条约'));
        return;
      }

      //   return;
      // }
      //正则校验
      if (!_this.accountIsValid()) {
        this.errors = {};
        this.$http.showMesasge(this.$t('账号必须为4-10位数字与字母组合'));
        return;
      } else if (!_this.passwordIsValid()) {
        this.errors = {};
        this.$http.showMesasge(this.$t('密码必须为6-15位小写字母或数字'));
        return;
      } else if (!_this.passwordIsconfirmPassword()) {
        this.errors = {};
        this.$http.showMesasge(this.$t('密码与确认密码必须一致'));
        return;
      } 
      // else if (!_this.phoneIsValid()) {
      //   this.errors = {};
      //   this.$http.showMesasge(this.$t('手机格式不正确'));
      //   return;
      // } 
      else if (!_this.inviteCodeValid()) {
        this.errors = {};
        this.$http.showMesasge(this.$t('邀请码格式不正确'));
        return;
      }
      // else if (!this.realNameIsValid()) {
      //   this.errors = {};
      //   this.$http.showMesasge("姓名不能超过8位！");
      //   return;
      // }
      else if (!this.WeChatIsValid()) {
        this.errors = {};
        this.$http.showMesasge(this.$t('微信号码不存在'));
        return;
      } else if (!this.qqIsValid()) {
        this.errors = {};
        this.$http.showMesasge(this.$t('QQ号码不存在'));
        return;
      } else if (!this.emailIsValid()) {
        this.errors = {};
        this.$http.showMesasge(this.$t('邮箱地址不存在'));
        return;
      }
      if (this.type != 0) {
        var result = this.captcha.getValidate();
        if (!result) {
          this.$http.showMesasge(this.$t('请先通过行为验证'));
          return;
        }
      }

      //注册接口
      this.errors = {};
      var params = {
        phone: _this.getSubmitValue("phone"),
        smsCode: _this.getSubmitValue('smsCode'),
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
        validateType: this.type,
        codePrefix: this.$config.codePrefix,
      };

      //账号处理
      if (window.mergeAccount) {
        params.username = this.accountNumber + window.mergeAccount;
      }
      this.$set(params, "clientItem", window.childCode);
      this.$set(params, "appId", window.theme);

      if (this.type === 1) {
        params.geeTestQueryVO = {
          challenge: result.geetest_challenge,
          seccode: result.geetest_seccode,
          validate: result.geetest_validate,
        };
      } else if (this.type === 2) {
        params.shuMeiQueryVO = {
          rid: result.rid,
        };
      } else if (this.type === 0) {
        params.captchaKey = this.captchaKey;
        params.captchaCode = this.captchaCode;
      } else if(this.type === 3){
         params.geeTestQueryVO = result
      }
      if(this.fingerprintState){
          params.fingerprint =  this.$config.fingerprint;
          params.phoneModel =  this.$config.phoneModel;
      }
      let res = await _this.$http.post(_this.$api.register, params);
      if (res.code == 0) {
        this.$common.setToken(res.data);
        this.$common.setUser(res.data);
        //注册成功
        this.$message({
          message: this.$t('恭喜您，注册成功'),
          type: "success",
        });

        sessionStorage.setItem("firstLogin", true);
        // sessionStorage.removeItem("inviteCode");
        store.commit("firstLogin", true);
        //获取余额
        this.getUserBalance();
        //register隐藏
        _this.$emit("hideRegister", true);
      } else {
        // this.isClickRegister = true;
        this.$common.clearToken();
        this.$http.showMesasge(res.msg);

        if (_this.type === 1) {
          captcha2.innerHTML = "";
        }
        this.getDefaultStatus();
      }
    },
    async getUserBalance() {
      var _this = this;
      let data = {
        clientId: this.$common.getUser().tenant_id, //tenant_id
        clientIp: this.$config.clientIp,
        memberId: this.$common.getUser().user_id, //userid
        username: this.$common.getUser().username,
      };
      var res = await _this.$http.post(_this.$api.getuserMoney, data);
      if (res.code == 0) {
        //余额存本地
        this.$common.setUserBalance(res.data);
      } else {
      }
    },
    keyDownHandler(e) {
      //只能输入数字
      // if (e.keyCode >= 65 && e.keyCode <= 90) {
      //   e.preventDefault();
      // }
    },
  },
  watch: {
    accountNumber() {
      this.registerIsDisabled();
    },
    password() {
      this.registerIsDisabled();
    },
    confirmPassword() {
      this.registerIsDisabled();
    },
    phone() {
      this.registerIsDisabled();
    },
    isSelect() {
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
    captchaCode() {
      this.registerIsDisabled();
    },
    show(n) {
      if (n) {
        //初始化数据
        this.accountNumber = "";
        this.password = "";
        this.confirmPassword = "";
        this.phone = "";
        this.sessData = JSON.parse(sessionStorage.getItem("inviteCode"));
        this.inviteCode = this.sessData || "";
        this.realName = "";
        this.sex = 1;
        this.birthday = "";
        this.wechat = "";
        this.qq = "";
        this.email = "";
        this.address = "";
        this.captchaCode = "";
        this.isSelect = true;
        this.disabled = true;
        // this.isClickRegister = true;
        // let captcha2 = document.querySelector("#captcha2");
        // captcha2.innerHTML = '';
        this.getDefaultStatus();
        var _this = this;
        this.$nextTick(() => {
          var container = document.querySelector(".regList");
          if (container.offsetHeight > 500) {
            container.style.height = "5rem";
          }
        });
      } else {
        let captcha2 = document.querySelector("#captcha2");
        captcha2.innerHTML = "";
      }
    },
  },
};
</script>

<style scoped lang="scss">
// .el-button--primary.is-disabled,
// .el-button--primary.is-disabled:active,
// .el-button--primary.is-disabled:focus,
// .el-button--primary.is-disabled:hover {
//     color: #fff;
//     background-color: var(--DisableBtn) !important;
//     border-color: var(--DisableBtn) !important;
// }

.getCode {
  background: #e4e4e4 !important;
  line-height: 3;
  width: 100%;
  color: #6c716b;
}
.refimg {
  width: 0.22rem;
  vertical-align: middle;
}
.registerLayout {
  /* min-width: 9.8rem; */
}

.logDialog-title {
  position: absolute;
  width: 100%;
  height: 0.47rem;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #ffffff;
}
.loginClose {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  width: 0.32rem;
  height: 0.32rem;
  background-size: cover;
  cursor: pointer;
  transition: 1s;
}
.loginClose:hover {
  transform: rotate(180deg);
}
.register-title {
  margin: 10px 0 14px;
  font-size: 20px;
  font-weight: 400;
  color: #fff;
}
.regRow {
  position: relative;
  display: flex;
  align-items: center;
}
.regRow > .img {
  position: absolute;
  top: 0;
  right: 0.2rem;
  height: 100%;
  box-sizing: border-box;
}
.img > img {
  width: 0.14rem;
  height: 0.14rem;
}
.regRow .rowkey {
  width: 1.6rem;
  text-align: left;
  padding-left: 0.2rem;
  box-sizing: border-box;
  position: relative;
  color: #fff;
}
.regRow .required {
  position: absolute;
  left: 0;
  color: #a58f5a;
}
.regRow > input {
  /* width: 100%; */
  flex: 1;
}

.regSex {
  display: flex;
  /* padding-left: 0.1rem; */
}
.regSex .sexImg {
  width: 0.14rem;
  height: 0.14rem;
  object-fit: cover;
  margin: 0 0.1rem 0 0.1rem;
}

.regCheckBox {
  width: 0.14rem;
  height: 0.14rem;
  background-size: cover;
  background-repeat: no-repeat;
}
.regAgreementCont {
  height: 0.13rem;
  font-size: 0.13rem;
  line-height: 0.13rem;
  color: #fff;
}
.registerBtn {
  margin: 0.15rem 0 0.16rem 0;
  padding-right: 0.2rem;
  width: calc(100% - 0.4rem);
  height: 0.46rem;
  border-radius: 0.25rem;
  font-size: 0.16rem;
  border: 1px solid #eac888;
  color: #eac888;
}
.registerBtn:hover {
  background-color: #eac888;
  color: #000;
}

.regRegister {
  width: calc(100% - 0.4rem);
  padding-right: 0.2rem;
  font-size: 0.12rem;
  color: var(--themeDark);
  height: 0.12rem;
  line-height: 0.13rem;
}
.regRegister:hover {
  color: #4a6fc3;
}

.logErrMsg {
  color: #eac888;
  font-size: 0.11rem;
  height: 0.24rem;
  padding-left: 1.6rem;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"] {
  -moz-appearance: textfield !important;
}
.butCode {
    font-size: 0.15rem;
    padding: 0.12rem 0.2rem;
    height: 0.4rem;
    margin: auto;
    border: 1px solid #eac888;
    color: #eac888;
    background: transparent;
    &:hover,&:active,&:focus{
      border: 1px solid #eac888 !important;
      background: linear-gradient(225deg, #9b7c4c 0%, #ffe7c1 100%) !important;
    }
}
.logRow {
  display: flex;
  align-items: center;
}
.logRow .rowkey {
  width: 1.6rem;
  text-align: left;
  padding-left: 0.2rem;
  box-sizing: border-box;
  position: relative;
  color: #fff;
}
.logRow .required {
  position: absolute;
  left: 0;
  color: #a58f5a;
}
.logRow input {
  /* width: 100%; */
  flex: 1;
}

.logVerifyCode {
  display: flex;
  margin-bottom: 0.25rem;
}
.logVerifyCode input {
  flex: 1;
  margin-right: 0.08rem;
}
.logVerifyCode .verifyCodeImg {
  width: 1.27rem;
  height: 0.44rem;
  border-radius: 0.08rem;
  background-color: #eeeeee;
  background-size: 100% 100%;
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
    background-color: #1e1e1e;
    border: 1px solid #3c3c3c;
    color: #fff;
    margin-bottom: 0.2rem;
    box-shadow: 0px 3px 6px 0px #595959;
    &:hover{
        color: #000;
        background: linear-gradient(225deg, #9b7c4c 0%, #ffe7c1 100%);
    }
}
.input {
    color: #fff !important;
}
</style>
<style>
.registerLayout .el-dialog {
  border-radius: 0.1rem !important;
}
.registerLayout .el-dialog__wrapper {
  overflow: hidden;
}
.regDialog .el-dialog__header {
  padding: 0 !important;
}

.regDialog .el-dialog__body {
  padding: 0.47rem 0.6rem 0.4rem 0.6rem !important;
  background-color: #000 !important;
  border: 1px solid #eac888;
  border-radius: 0.1rem;
}
.loginDongBox {
  width: 2.8rem;
  position: relative;
  margin: 0 auto 0.48rem;
}
.defaultUserImgDong {
  width: 100% !important;
  position: absolute;
  left: 0px;
  top: 0px;
  animation: defaultUserImgDong 5s linear infinite;
}

.regList {
  height: auto;
  overflow: auto;
  margin-bottom: 0.3rem;
  max-height: 5rem;
}

/* 生日 */
.el-date-editor.el-input {
  /* width: 100% !important; */
  flex: 1;
}
.el-input__icon.el-icon-date {
  width: 0 !important;
}
.el-input__icon.el-icon-date::before {
  content: "" !important;
}
.regDialog .el-input__inner {
  height: 0.44rem !important;
  line-height: 0.44rem !important;
  padding-left: 0.08rem !important;
  border-radius: 0.08rem !important;
}
.registerLayout .el-scrollbar__wrap {
  overflow-x: hidden;
  padding-right: 0.2rem;
  max-height: 5rem;
}
.registerLayout .el-scrollbar__thumb {
  background-color: #4b4b4b !important;
  max-height: 5rem;
}
.registerLayout .el-scrollbar__bar.is-vertical {
  background: #4b4b4b;
}
</style>
