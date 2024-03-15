<template>
  <el-dialog width="684px" :show-close="false" :visible="showLogin.show">
    <div class="login-box">
      <div class="left-img">
        <img v-if="projectImgUrl == 'bgga' && tabName=='login'" src="./img/login-l.png" alt="">
        <img v-else-if="projectImgUrl == 'bgga' && tabName=='register'" src="./img/reg-l.png" alt="">
        <img v-else src="./img/left.png" alt="">
      </div>
      <div class="login-msg">
        <img class="pointer login-close" 
        :src="require(['kubet','choibet','phattai68','jun88'].includes(projectImgUrl) ? './img/close1.png' : './img/close.png')"
        alt="" @click="() => setShowLogin({ show: false })">
        <div class="login-logo">
          <img width="100%" :src="$config.pcLogo
            ? $config.imgHost + $config.pcLogo
            : $common.getTitleImgUrl('Logo')" alt="">
        </div>
        <el-tabs v-model="tabName" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('登入')" name="login"></el-tab-pane>
          <el-tab-pane :label="$t('注册')" name="register"></el-tab-pane>
        </el-tabs>
        <div class="form-i">
          <img class="form-img" src="./img/user.png" alt="">
          <input v-if="tabName != 'register'" class="form-input" :placeholder="$t('请输入账号')" type="text" v-model="form.username" />
          <input v-else class="form-input" :placeholder="$t('请输入账号（长度4到10位）')" type="text" v-model="form.username" :maxlength="10" />
        </div>
        <div class="form-i">
          <img class="form-img" src="./img/pass.png" alt="">
          <input class="form-input" :placeholder="$t('请输入登录密码')" :type="isSee ? 'text' : 'password'" v-model="form.pwd" />
          <img v-if="isSee" class="pointer form-img" src="./img/eye2.png" alt="" @click="isSee = false">
          <img v-else class="pointer form-img" src="./img/eye1.png" alt="" @click="isSee = true">
        </div>
        <template v-if="tabName === 'register'">
          <div class="form-i">
            <img class="form-img" src="./img/pass.png" alt="">
            <input class="form-input" :placeholder="$t('请再次输入登录密码')" :type="isSee2 ? 'text' : 'password'" v-model="form.pwd2" />
            <img v-if="isSee2" class="pointer form-img" src="./img/eye2.png" alt="" @click="isSee2 = false">
            <img v-else class="pointer form-img" src="./img/eye1.png" alt="" @click="isSee2 = true">
          </div>
          <div class="form-i" v-if="regFlag.realName">
            <img class="form-img" src="./img/invite.png" alt="">
            <input class="form-input" :placeholder="`${$t('请输入姓名')}(${regFlag.realName === 2 ? $t('必填') : $t('选填')})`" type="text"
              v-model="form.realName" />
          </div>
          <div class="form-i" v-if="regFlag.phone">
            <img class="form-img" src="./img/invite.png" alt="">
            <div class="codePrefix" v-if="form.codePrefix">+{{ form.codePrefix }}</div>
            <input class="form-input" :placeholder="`${$t('请输入手机号')}(${regFlag.phone === 2 ? $t('必填') : $t('选填')})`" type="text"
              v-model="form.phone"
              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </div>
          <div class="form-i" v-if="regFlag.phone == 2 && regFlag.smsCode == 1">
            <img class="form-img" src="./img/invite.png" alt="">
            <input class="form-input" :placeholder="$t('请输入短信验证码')" type="text" v-model="form.smsCode" />
            <span class="pointer fs10 get-code" @click="getPhoneCode">{{ codeButtext }}</span>
          </div>
          <div class="form-i" v-if="regFlag.email">
            <img class="form-img" src="./img/invite.png" alt="">
            <input class="form-input" :placeholder="`${$t('请输入邮箱地址')}(${regFlag.email === 2 ? $t('必填') : $t('选填')})`" type="text"
              v-model="form.email" />
          </div>
          <div class="form-i" v-if="regFlag.qq">
            <img class="form-img" src="./img/invite.png" alt="">
            <input class="form-input" :placeholder="`${$t('请输入QQ')}(${regFlag.qq === 2 ? $t('必填') : $t('选填')})`" type="text"
              v-model="form.qq" />
          </div>
          <div class="form-i" v-if="regFlag.wechat">
            <img class="form-img" src="./img/invite.png" alt="">
            <input class="form-input" :placeholder="`${$t('请输入微信')}(${regFlag.wechat === 2 ? $t('必填') : $t('选填')})`" type="text"
              v-model="form.wechat" />
          </div>
          <div class="form-i" v-if="regFlag.address">
            <img class="form-img" src="./img/invite.png" alt="">
            <input class="form-input" :placeholder="`${$t('请输入联系地址')}(${regFlag.address === 2 ? $t('必填') : $t('选填')})`" type="text"
              v-model="form.address" />
          </div>
          <div class="form-i" v-if="regFlag.inviteCode">
            <img class="form-img" src="./img/invite.png" alt="">
            <input class="form-input" :placeholder="`${$t('请输入邀请码')}(${regFlag.inviteCode === 2 ? $t('必填') : $t('选填')})`" type="text"
              :disabled="sessData ? true : false"
              v-model="form.inviteCode" />
          </div>
          <div class="form-i" v-if="regFlag.birthday">
            <img class="form-img" src="./img/invite.png" alt="">
            <el-date-picker class="form-input" v-model="form.birthday" type="date"
              :placeholder="`${$t('请输入生日')}(${regFlag.birthday === 2 ? $t('必填') : $t('选填')})`"></el-date-picker>
          </div>
        </template>

        <div class="form-i" v-if="type === 0">
          <input class="form-input" :placeholder="$t('请输入验证码')" type="text" v-model="form.verify" />
          <img class="pointer" v-if="verifyCodeImg" :src="verifyCodeImg" height="" alt="" @click="captchaData">
          <span v-else class="pointer fs10 get-code" @click="captchaData">{{ $t('获取验证码') }}</span>
        </div>
        <!--  行为验证 急眼 -->
        <div v-if="type === 1" id="captcha2"></div>
        <!-- 行为校验  树莓 -->
        <div v-if="type === 2" id="captcha" class="loginBtn captchaStyle" @click="captchaClick">
          {{ captchaText }}
        </div>
        <!-- 极验4 -->
        <div v-if="type === 3" id="gt41"></div>
        <el-button class="form-btn" @click="handleLogin" :loading="loading">{{ tabName === 'login' ? $t('登入') :
          $t('注册') }}</el-button>
        <div class="center fs10 forget-p" v-show="tabName === 'login'"><span class="pointer"
            @click="to('pwdforget')">{{ $t('忘记登录账号') }}?</span></div>
        <div class="fs10 center service-box">
          <div class="pointer inline-block" @click="toService">
            <img class="service-img" src="./img/service.png" alt="">
            <span>{{ $t('联系客服') }}</span>
          </div>
        </div>
        <div class="center agree-b">
          <el-checkbox v-model="agree"><span class="fs10">{{ $t('我已经阅读并同意《用户协议条款》') }}</span></el-checkbox>
        </div>
      </div>
    </div>
    <verifyIdentidy ref="verifyIdentidy" @loginAction="handleLogin" :account="form.username"></verifyIdentidy>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import MyAes from '@/utils/myAes.js'
import verifyIdentidy from '@/components/verifyIdentidy/verifyIdentidy'

const aseKey = "pigxpigxpigxpigx" //秘钥
export default {
  components: { verifyIdentidy },
  data() {
    return {
      tabName: 'login',
      agree: true,
      form: {
        username: '',
        pwd: '',
        pwd2: '',
        phone: '',
        smsCode: '',
        qq: '',
        email: '',
        realName: '',
        address: '',
        birthday: '',
        wechat: '',
        inviteCode: '',
        verify: '',
        codePrefix: this.$config.codePrefix
      },
      isSee: false,
      isSee2: false,
      loading: false,
      captchaMask: false,
      fingerprintState: false,
      verifyCodeImg: '',
      captchaKey: '',
      codeButtext: this.$t("获取验证码"),
      intervalID: '', //计时器
      type: 0,
      time: 60,
      regFlag: {},
      sessData:'',
      projectImgUrl: window.projectImgUrl
    }
  },
  computed: {
    ...mapState(['showLogin']),
    token() {
      return this.$store.state.token
    }
  },
  watch: {
    'showLogin.isLogin'(v) {
      this.tabName = v ? 'login' : 'register'
    }
  },
  mounted() {
    this.getDefaultStatus()
    this.getRegisterSet()
    this.sessData = JSON.parse(sessionStorage.getItem("inviteCode")) || ""
    this.form.inviteCode =  JSON.parse(sessionStorage.getItem("inviteCode")) || ""
    if (!this.$common.getUser()) {
      this.setShowLogin({ show: true })
    }
  },
  beforeDestory() {
    this.clearTimer()
  },
  methods: {
    ...mapMutations(['setShowLogin']),
    captchaClick() {
      if (this.type == 2) {
        var result = this.captcha.getResult()
        var pass = result.pass
        if (!pass) {
          this.captcha.verify()
          //行为验证bug:点击关闭按钮，会点击穿透
          //解决：手动再添加一个遮罩层
          this.captchaMask = true
        }
      }
    },
    onCaptcha(res) {
      //res是验证实例，可以调用res的示例方法
      this.captcha = res
      if (this.type == 1) {
        res.appendTo("#captcha2")
        res.onReady(this.check)
        // this.isClickRegister = true;
      } else if (this.type == 2) {
        this.captchaText = this.$t('点击验证')
        this.captcha.onSuccess((data) => {
          if (data.pass) {
            this.disabled = false
            this.captcha.rid = data.rid
            this.captchaText = this.$t('验证成功')
            this.captchaMask = false
          } else {
            this.captcha.rid = null
            this.captchaText = this.$t('验证失败')
          }
        });

        this.captcha.onError((errType, errMsg) => {
          this.captcha.rid = null
          this.captchaText = this.$t('验证失败')
          this.captchaMask = false
        });

        this.captcha.onClose(function () {
          this.captchaMask = false
        });
      } else if (this.type === 3) {
        res.appendTo("#gt41")
      }
    },
    async gologin() {
      const { username, pwd, verify } = this.form
      const tipsFn = (msg, type = 'error') => this.$message[type](msg)
      if (!username) {
        return tipsFn(this.$t("请输入账号"))
      }
      if (!pwd) {
        return tipsFn(this.$t("请输入密码"))
      }

      if (!verify && this.type == 0) {
        return tipsFn(this.$t('请输入验证码'))
      }

      if (this.type != 0) {
        const result = this.captcha.getValidate()
        if (!result) {
          return tipsFn(this.$t("请先通过行为验证"))
        }
      }

      //登录接口
      // Encrypt 加密
      const password = MyAes.encrypt(pwd, aseKey)
      // Decrypt 解密
      // let decodePassword = MyAes.decrypt(encodePassword, aseKey);


      const params = {
        name: username + (window.mergeAccount || ''), //账号处理
        password,
        lastLoginVersion: this.$config.loginVersion,
        validateType: this.type,
      }
      if (this.type === 1) {
        params.geeTestQueryVO = {
          challenge: result.geetest_challenge,
          seccode: result.geetest_seccode,
          validate: result.geetest_validate
        }
      } else if (this.type === 2) {
        params.shuMeiQueryVO = {
          rid: result.rid
        }
      } else if (this.type === 0) {
        params.captchaKey = this.captchaKey
        params.captchaCode = verify
      } else if (this.type === 3) {
        const result = this.captcha.getValidate()
        params.geeTestQueryVO = result
      }

      if (this.fingerprintState) {
        params.fingerprint = this.$config.fingerprint
        params.phoneModel = this.$config.phoneModel
      }

      const res = await this.$http.post(this.$api.login, params)

      if (res.code == 0) {
        const { data } = res
        this.$common.setToken(data)
        this.$common.setUser(data)
        //登陆成功提示
        tipsFn(this.$t("恭喜您，登录成功"), 'success')

        this.$router.push("/")
        //第一次登陆
        sessionStorage.setItem("firstLogin", true)

        this.$store.commit("firstLogin", true)
        this.$common.showLogin()
        //获取余额
        this.getUserBalance()
        //获取用户信息
        this.$nkhttp.getUserInfo()
        //
        // this.$emit("ensureLogin", "");
        this.form.verify = ""
        // this.getMessages()
        // this.getNotices()
        this.$store.commit('setQxylChat', 1)
        this.setShowLogin({ show: false })
      } else {
        this.isClickLogin = true
        this.validateStatus === -1
        this.$common.clearToken()
        tipsFn(res.msg)
        if (this.type === 1) {
          captcha1.innerHTML = ""
        }
        this.getDefaultStatus()
      }
    },
    handleTabClick() {
      this.setShowLogin({ isLogin: this.tabName === 'login' })
      this.form = {
        username: '',
        pwd: '',
        pwd2: '',
        phone: '',
        smsCode: '',
        qq: '',
        email: '',
        realName: '',
        address: '',
        birthday: '',
        wechat: '',
        inviteCode: this.sessData,
        verify: '',
        codePrefix: this.$config.codePrefix
      }
    },
    async handleRegister() {
      let captcha2 = document.querySelector("#captcha2")
      const {
        username,
        pwd,
        pwd2,
        phone,
        realName,
        birthday,
        wechat,
        email,
        qq,
        address,
        smsCode,
        inviteCode,
        verify,
        codePrefix,
      } = this.form
      let tips
      const tipsFn = msg => this.$http.showMesasge(msg)
      if (this.regFlag.inviteCode == 2 && !inviteCode.trim()) {
        //必填却没值
        tips = this.$t('邀请码不能为空')
      } else if (!username) {
        tips = this.$t('账号不能为空')
      } else if (!pwd) {
        tips = this.$t('密码不能为空')
      } else if (!pwd2) {
        tips = this.$t('确认密码不能为空')
      } else if (this.regFlag.phone == 2 && !phone.trim()) {
        tips = this.$t('手机号不能为空')
      } else if (this.regFlag.phone == 2 && this.regFlag.smsCode == 1 && !smsCode.trim()) {
        tips = this.$t('请输入短信验证码')
      } else if (this.regFlag.realName == 2 && !realName.trim()) {
        tips = this.$t('姓名不能为空！')
      } else if (this.regFlag.birthday == 2 && !birthday) {
        tips = this.$t('生日不能为空')
      } else if (this.regFlag.wechat == 2 && !wechat.trim()) {
        tips = this.$t('微信号不能为空')
      } else if (this.regFlag.qq == 2 && !qq.trim()) {
        tips = this.$t('QQ号不能为空')
      } else if (this.regFlag.email == 2 && !email.trim()) {
        tips = this.$t('邮箱不能为空')
      } else if (this.regFlag.address == 2 && !address.trim()) {
        tips = this.$t('地址不能为空')
      } else if (!verify.trim() && this.type == 0) {
        tips = this.$t('验证码不能为空')
      } else if (!this.agree) {
        tips = this.$t('请先勾选开户条约')
      }
      //正则校验
      else if (!this.accountIsValid()) {
        tips = this.$t('账号必须为6-15位数字与字母组合')
      } else if (!this.passwordIsValid()) {
        tips = this.$t('密码必须为6-15位小写字母或数字')
      } else if (pwd !== pwd2) {
        tips = this.$t('密码与确认密码必须一致')
      }
      else if (verify && !this.inviteCodeValid()) {
        tips = this.$t('邀请码格式不正确')
      }
      else if (wechat && !this.WeChatIsValid()) {
        tips = this.$t('微信号码不存在')
      } else if (qq && !this.qqIsValid()) {
        tips = this.$t('QQ号码不存在')
      } else if (email && !this.emailIsValid()) {
        tips = this.$t('邮箱地址不存在')
      }

      if (tips) return tipsFn(tips)

      if (this.type != 0) {
        var result = this.captcha.getValidate()
        if (!result) {
          return tipsFn(this.$t('请先通过行为验证'))
        }
      }
      const getSubmitValue = key => {
        const val = this.form[key]
        if (this.regFlag[key] == 0 || val == "") {
          return null //不显示
        } else {
          //选填或必填
          if (key == "birthday") {
            return this.timeSwitch(val)
          } else {
            return val
          }
        }
      }
      //注册接口
      var params = {
        phone: getSubmitValue("phone"),
        smsCode: getSubmitValue('smsCode'),
        username: username + (window.mergeAccount || ''), //账号处理
        password: pwd,
        inviteCode: inviteCode,
        lastLoginVersion: this.$config.loginVersion,
        realName: getSubmitValue("realName"),
        sex: getSubmitValue("sex"),
        birthday: getSubmitValue("birthday"),
        wechat: getSubmitValue("wechat"),
        qq: getSubmitValue("qq"),
        email: getSubmitValue("email"),
        address: getSubmitValue("address"),
        validateType: this.type,
        codePrefix: codePrefix,
        clientItem: window.childCode || '',
        appId: window.theme || ''
      }

      if (this.type === 1) {
        params.geeTestQueryVO = {
          challenge: result.geetest_challenge,
          seccode: result.geetest_seccode,
          validate: result.geetest_validate,
        }
      } else if (this.type === 2) {
        params.shuMeiQueryVO = {
          rid: result.rid,
        }
      } else if (this.type === 0) {
        params.captchaKey = this.captchaKey
        params.captchaCode = verify
      } else if (this.type === 3) {
        params.geeTestQueryVO = result
      }
      if (this.fingerprintState) {
        params.fingerprint = this.$config.fingerprint
        params.phoneModel = this.$config.phoneModel
      }
      this.loading = true
      const res = await this.$http.post(this.$api.register, params)
      this.loading = false
      if (res.code == 0) {
        this.$common.setToken(res.data)
        this.$common.setUser(res.data)
        //注册成功
        this.$message.success(this.$t('恭喜您，注册成功'))

        sessionStorage.setItem("firstLogin", true)
        // sessionStorage.removeItem("inviteCode");
        this.$store.commit("firstLogin", true)
        //获取余额
        this.getUserBalance()
        //register隐藏
        this.setShowLogin({ show: false })
      } else {
        this.$common.clearToken()
        tipsFn(res.msg)

        if (this.type === 1) {
          captcha2.innerHTML = ""
        }
        this.getDefaultStatus()
      }
    },
    async getUserBalance() {
      let data = {
        clientId: this.$common.getUser().tenant_id, //tenant_id
        clientIp: this.$config.clientIp,
        memberId: this.$common.getUser().user_id, //userid
        username: this.$common.getUser().username,
      };
      const res = await this.$http.post(this.$api.getuserMoney, data)
      if (res.code == 0) {
        //余额存本地
        this.$common.setUserBalance(res.data)
      }
    },
    timeSwitch(val) {
      if (val) {
        const date = new Date(val) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const Y = date.getFullYear() + "-"
        const M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-"
        const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
        const time = Y + M + D
        return time
      }
    },
    inviteCodeValid() {
      //邀请码校验
      return /^[a-zA-Z0-9]*$/.test(this.form.inviteCode)
    },
    accountIsValid() {
      //账号校验
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$/.test(this.form.username)
    },
    passwordIsValid() {
      //密码校验
      // return /^[a-zA-Z0-9]{6,15}$/.test(this.form.pwd);
      return this.form.pwd
    },
    phoneIsValid() {
      //手机格式校验
      return /^1[3456789]\d{9}$/.test(this.form.phone)
    },
    WeChatIsValid() {
      //微信号校验
      return /^[a-zA-Z0-9][a-zA-Z0-9_-]{5,19}$/.test(this.form.wechat)
    },
    qqIsValid() {
      //qq校验
      return /^[1-9][0-9]{4,14}$/.test(this.form.qq)
    },
    emailIsValid() {
      // email校验
      return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this.form.email)
    },
    async getPhoneCode() {
      if (this.codeButDis) return
      const { phone } = this.form
      if (!phone) return this.$message.error(this.$t('请输入手机号'))
      const res = await this.$http
        .get(
          this.$api.sendSmsCode +
          "/" +
          this.phone +
          `?functionId=8&codePrefix=${this.$config.codePrefix}&codeFlag=1`
        )
      if (res.code == 0) {
        this.$message.success(this.$t('获取验证码成功'))
        this.codeButDis = true
        this.time = 60
        this.intervalID = setInterval(() => {
          this.time--
          this.codeButtext = this.time + ' s'
          if (this.time == 0) {
            this.codeButDis = false
            this.clearTimer()
            this.codeButtext = this.$t('获取验证码')
            this.time = 60
          }
        }, 1000)
      } else {
        this.$message.error(res.msg)
      }
    },
    clearTimer() {
      this.intervalID && clearInterval(this.intervalID)
    },
    async handleLogin() {
      if (this.tabName !== 'login') return this.handleRegister()
      const { pwd, username } = this.form
      //秘钥
      // Encrypt 加密·
      const password = MyAes.encrypt(pwd, aseKey)
      const param = {
        name: username + (window.mergeAccount || ''), //账号处理
        password,
        fingerprint: this.$config.fingerprint
      }
      this.loading = true
      const res = await this.$http.post(this.$api.validateLogin, param)
      if (res.code == 0) {
        const { validateStatus, validateWay } = res.data
        this.validateStatus = +validateStatus
        if (validateStatus) {
          //无异常
          await this.gologin()
        } else {
          if (validateWay == "ip") {
            // 验证真实姓名
            this.$emit("showPopup", true)
          }
          if (validateWay == "device") {
            // 验证设备
            this.$refs.verifyIdentidy.openDialog()
          }
        }
      } else {
        this.$message.error(res.msg)
        if (this.type === 1) {
          // captcha1?.innerHTML = ""
        }
        this.getDefaultStatus()
      }
      this.loading = false
    },
    check() {
      if (this.type === 1) {
        if (this.captcha) {
          this.captchaText = "";
        } else {
          this.captchaText = this.$t('正在加载') + "...";
        }
      } else if (this.type === 3) {
        this.captcha && this.captcha.reset()
      }
    },
    // 获取   getDefaultStatus
    async getDefaultStatus() {
      const res = await this.$http.get(this.$api.getDefaultStatus, false)
      if (res.code == 0) {
        const { type, fingerprintState } = res.data
        // type   0：默认验证码  1：极验  2：数美"
        this.type = type
        if (type === 0) {
          //图片验证码
          //获取验证码图片
          this.captchaData()
        } else if (type === 1 || type === 3) {
          //1：极验
          this.disabled = false
          this.showPicture = false
          this.reset()
        } else if (type === 2) {
          //2：数美"
          this.showPicture = false;
          Object.assign(this.smData, res.data)
          this.reset()

        }
        this.fingerprintState = fingerprintState
        if (fingerprintState) {
          // _getDeviceId(res.data.fingerprintId).then(res => {
          //   this.$config.fingerprint = res
          //   sessionStorage.setItem('fingerprint', res);
          // })
        }
      } else {
        this.type = null
        this.$message.error(this.$t('加载失败，请重试'))
      }
    },
    async getRegisterSet() {
      const key = "member_register"
      const res = await this.$http.get(this.$api.getRegisterSet, key)
      if (res.code == 0) {
        this.regFlag = res.data.svalue
      }
    },
    to(name) {
      this.$router.push({ name })
    },
    toService() {
      // this.$common.toService()
      if (['vi'].includes(window.locale)) { // betcome直接跳客服窗口
        const url = this.$common.getCustomerService();
        window.open(url, "_blank");
        return;
      }
      // 新旧客服判断
      if (window.customerServiceStatus == 1) {
          //新客服
          var obj = {};
          obj.host = this.$common.getHost();
          obj.clientCode = window.clientCode;
          obj.clientItem = window.childCode;
          obj.username =
              this.$common.getUser() && this.$common.getUser().username;
          obj.language = this.$i18n.locale;
          obj.theme = window.theme;
          obj.projectImgUrl = window.projectImgUrl;
          obj.orgin = window.location.origin + "/activity";
          var str = JSON.stringify(obj);
          str = window.btoa(str);
          let url = location.origin  + "/func" + "/customerService/pc?s=" + str;
          window.open(url, "_blank");
      } else {
          //旧客服
          const url = this.$common.getCustomerService();
          window.open(url, "_blank");
      }
    },
    //行为校验↓
    reset() {
      this.check()
      this.getCaptcha()
    },
    async getCaptcha() {
      if (this.type == 1) {
        const res = await this.$http.get(this.$api.geetFirstRegister, "?t=" + window.childCode, false)
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
            this.onCaptcha
          )
        } else {
          this.$http.showMesasge(this.$t('获取错误'))
        }
      } else if (this.type == 2) {
        let data = {
          ...this.smData,
          width: 300,
          https: location.protocol == "https:"
        }
        initSMCaptcha(
          data,
          this.onCaptcha
        )
      } else if (this.type === 3) {
        if (!this.captcha) {
          initBotion({
            captchaId: this.$config.captchaId,
            product: 'popup',//float  popup
            language: 'vie',
            nativeButton: {
              width: '100%',
              height: '42px'
            }
          }, this.onCaptcha)
        }
      }
    },
    async captchaData() {
      const res = await this.$http.get(this.$api.captcha)
      if (res.code == 0) {
        const { captcha_image_content, captchaKey } = res.data
        this.verifyCodeImg = captcha_image_content
        this.captchaKey = captchaKey
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.login-box {
  display: flex;
  min-height: 450px;
  color: $loginColor;

  .center {
    text-align: center;
  }

  .fs10 {
    font-size: 10px;
    color: $loginColor;
  }

  .pointer {
    cursor: pointer;
  }

  .inline-block {
    display: inline-block;
  }

  .left-img {
    width: 319px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
  }

  .login-msg {
    position: relative;
    flex: 2;
    background-color: $login-bgColor;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 0 40px;

    .login-close {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 22px;
      height: 22px;
    }

    .login-logo {
      width: 150px;
      margin: 30px auto 10px;
    }

    .service-box {
      margin: 18px 0 35px;

      .service-img {
        width: 24px;
        margin-right: 5px;
        vertical-align: middle;
      }
    }

    .form-i {
      background-color: $login-inputBgColor;
      height: 33px;
      line-height: 33px;
      border-radius: 6px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .form-img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
      }
      .codePrefix{
        font-size: 14px;
        color: $login-inputColor;
        padding: 0 5px;
        margin-right: 5px;
        background-color:#dadada;
      }
      .form-input {
        border: 0;
        padding: 0;
        flex: 2;
        background-color: transparent;
        &::placeholder {
          padding: 0;
          color: $login-inputColor; 
        }
      }

      .form-input {
        border: 0;
        padding: 0;
        flex: 2;

        &::placeholder {
          padding: 0;
          color: $login-inputColor;
        }
      }

      .get-code {
        color: #444;
      }
    }

    .form-btn {
      width: 100%;
      line-height: 33px;
      background: $login-linerColor;
      border-radius: 6px;
      color: $login-textColor;
      font-weight: bold;
      margin-top: 36px;
      padding: 0;
      border: 0;
    }

    .forget-p {
      margin-top: 18px;
      color: $theme-color;
    }

    .agree-b {
      padding-bottom: 18px;
    }
  }
}
::v-deep{
  .el-dialog {
    background-color: transparent;
  }
  .el-dialog__header {
    padding: 0;
  }

  .el-input__inner {
    padding: 0;
    height: 32px;
    border: 0;
    &::placeholder {
      color: $login-inputColor;
    }
  }
  .el-dialog__body {
    padding: 0;
  }

  .el-tabs__item {
    color: $loginColor;
    font-size: 18px;
    font-weight: 600;

    &.is-active {
      color: $login-tabColor;
    }

    &:hover {
      color: $login-tabColor;
    }
  }

  .el-tabs__item {
    padding: 0 6px;
    line-height: 50px;
  }

  .el-tabs__active-bar {
    background-color: $login-tabColor;
    ;
  }

  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }

  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: $loginColor;
  }

  .el-checkbox__label {
    color: $loginColor;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: $login-tabColor;
    border-color: $login-tabColor;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner::after {
    border: 1px solid $login-textColor;
    border-left: 0;
    border-top: 0;
  }
}

</style>
