<template>
    <div class="header_container">
        <div class="headerWidth">
            <div class="headerRight" v-show="!isLogin">
                <div
                    v-show="!showPicture"
                    style="width: 260px;display: flex;justify-content: center;align-items: center;"
                >
                </div>
                <!-- <div>点击登入表示同意<span>协议与规则</span></div> -->
                <div class="rightButton">
                    <div class="rightButtonOne" @click="loginAction('register')">
                        <span>{{ $t('注册') }}</span>
                    </div>
                </div>
                <div class="leftButton">
                    <div class="leftButtonOne" @click="loginAction">
                        <span>{{ $t('登入') }}</span>
                    </div>
                </div>
            </div>
            <div class="loginSuccessfulRight" v-show="isLogin">
                <div class="user">
                    <span>{{ $t('账号') }}：</span>
                    <span class="name">{{userName}}</span>
                </div>
                <img loading="lazy"
                    class="vipImg"
                    @click="openVip()"
                    v-lazy="require('../../../../assets/image/xfImg/'+vipImg+'.png')"
                    alt
                />
                <div class="balance">
                    <span>{{ $t('余额') }}：</span>
                    <span
                        class="amount"
                    >{{ $common.setNumFixed($store.state.userInfo.totalBalance,2) }}</span>
                    <i
                        :class="{ refreshAnimation: haveRefreshAnimation }"
                        @click="getUserBalance('refresh')"
                    ></i>
                </div>
                <ul class="other">
                    <li @click="to('myAccount')">{{ $t('会员中心') }}</li>
                    <li @click="to('recharge')">{{ $t('线上存款') }}</li>
                    <li @click="to('drawing')">{{ $t('线上取款') }}</li>
                    <li @click="onGetMoney">{{ $t('一键归户') }}</li>
                    <li @click="to('news')">{{ $t('未读讯息') }}(<span style="color:red;">{{msgUnReadNum + noticeUnReadNum }}</span>)</li>
                    <li class="logout" @click="logout()">{{ $t('登出') }}</li>
                </ul>
            </div>
            <div class="loginLeft">
                <ul>
                    <li v-for="(item, index) in headerList" :key="index" @click="jump(item)" class="liCenter">
                        <i v-show="item.hotStatus"
                            :style="'background-image:url(' + $common.getImgUrl(item.hotPic) +')'"
                        ></i>
                        <span
                            :style="{
                                color: `${
                                    flashing && item.shineStatus
                                        ? item.shineColor
                                        : item.bottomColor
                                }`,
                            }"
                        >{{ item.name }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!-- eslint-disable-next-line vue/custom-event-name-casing -->
        <menu-list @setregister="$emit('openRegister')" @scrollToCode="$emit('scrollToCode')"></menu-list>
        <verifyIdentidy ref="verifyIdentidy" @loginAction="loginAction" :account="account"></verifyIdentidy>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import menuList from "./menuList";
import verifyIdentidy from '@/components/verifyIdentidy/verifyIdentidy';
import MyAes from "@/utils/myAes.js";
import utils from '@/utils/utils.js'
import { _getDeviceId }  from '@/utils/finger.js';
import store from "@/store/store";
import "@/utils/smcp.min.js";
import "@/utils/boc.js"
import { mapGetters } from "vuex";
export default {
    components: {
        menuList,
        verifyIdentidy
    },
    data() {
        return {
            isLogin: false,
            userName: "",
            pwd: "",
            // time: "--年--日--月 --:--:--",
            zone: 'UTC+8',
            date: '',
            time: '',
            interval: 0,
            captchaKey: "",
            setInt: null,
            isClickLogin: true, //只有第一次登录生效，除非登录失败
            code: "",
            balance: "0.00",
            account: "",
            verifyCodeImg: "",
            type: 0, //行为校验2
            captcha: null, //行为校验
            captchaBox: null,
            captchaText: "",
            captchaMask: false,
            headerList:[],
            flashing: false,
            errorCode: false,
            showPicture: true,
            haveRefreshAnimation: false, //开始刷新动画
            refreshBalanceFlag: true, //不可重复刷新余额
            msgUnReadNum: 0,
            noticeUnReadNum: 0,
            vipList: [],
            vipImg: "normal_user",
            userName: "",
            proxyUrl: "",
            codeshow:true,
            // 数美请求参数
            smData:{
                lang: '',
                mode: '',
                organization: '',
                product: '',
                appId: '',
                channel: '',
            },
            fingerprintState:false,
            projectImgUrl: window.projectImgUrl
        };
    },
    created() {
        this.getServer()
        if (this.$common.isLogin()) {
            this.isLogin = true;
            this.setupLoginInfo();
            //未读条数
            this.getMessages();
            this.getNotices();
            this.logins(this.isLogin);
        }
        this.listQuickEntry();
        this.codeShow();
    },
    computed: {
        ...mapGetters(["userInfo"]),
        needCheckLogin() {
            return this.$store.state.needCheckLogin;
        }
    },
    mounted() {
        this.getDefaultStatus();
        this.getTime()
    },
    methods: {
        ...mapMutations(['setShowLogin']),
        transgo() {
            this.$router.push({ path: "/home" });
        },
        // 客服问题
        async getServer(){
            const res = await this.$http.get(this.$api.allHour);
            if(res.code===0){
                this.$cache.set('wnsrServerUrl',res.data.domain)
            }
        },
        getTime () {
            this.interval = setInterval(() => {
                var bjTime = this.getBjTime();
                this.date = utils._formatDate(bjTime, 'yyyy-MM-dd')
                this.time = utils._formatDate(bjTime, 'HH:mm:ss')
            }, 500)
        },
        getBjTime() {
            //获得当前运行环境时间
            var d = new Date(), currentDate = new Date(), tmpHours = currentDate.getHours();
            //算得时区
            var time_zone = -d.getTimezoneOffset() / 60;
            //少于0的是西区 西区应该用时区绝对值加京八区 重新设置时间（西区时间比东区时间早 所以加时区间隔）
            if (time_zone < 0) {
                time_zone = Math.abs(time_zone) + 8; currentDate.setHours(tmpHours + time_zone);
            } else {
                //大于0的是东区  东区时间直接跟京八区相减
                time_zone -= 8; currentDate.setHours(tmpHours - time_zone);
            }
            return currentDate;
        },
        codeShow(){
            if(window.projectImgUrl == 'jryl'){
                this.codeshow = false;
            }
            else{

            }
        },
        listQuickEntry: async function() {
            const res = await this.$http.get(this.$api.listQuickEntry, false);
            if (res.code === 0 && res.data.length != 0) {
                res.data.sort((item1, item2) => {
                    return item1.sort - item2.sort;
                });
                this.headerList = res.data;
                setInterval(() => {
                    this.flashing = true;
                }, 200);
                setInterval(() => {
                    this.flashing = false;
                }, 400);
            }
        },
        openVip() {
            if (!['jryl','tyca','jramjs','jrwnsr'].includes(window.projectImgUrl)) {
                this.$router.push({ path: '/vipLevel' });
            } else {
                this.$emit("openVip");
            }
        },
        async logins(isLogin) {
            let that = this;
            if (isLogin) {
                that.userName = that.$common.getUser().username;
                let data = "/" + that.$common.getUser().user_id;
                const res = await that.$http.get(that.$api.members, data);
                if (res.code == 0) {
                    that.getVipData(res.data.levelId);
                }
            }
        },
        async getVipData(levelId) {
            let that = this;
            let res = await that.$http.get(that.$api.getvipdata, levelId);
            if (res.code == 0) {
                if (res.data.gradeId === 1) {
                    that.vipImg = "normal_user";
                } else {
                    that.vipImg = res.data.gradeName;
                }
            }
        },
        toHome() {
            this.$router.push({ path: "/home" });
        },
        toProxy() {
            const proxyUrl =  this.$common.getClientCodeRes()?.agentDomain;
            
            // switch (window.projectImgUrl) {
            //     case 'tyca':
            //         this.proxyUrl = 'https://jragent.715536.com'
            //     case 'jryl':
            //         this.proxyUrl = 'https://jragent.715536.com'
            //         break
            //     case 'qxyl':
            //         this.proxyUrl = 'https://qxylagent.bets888803.com'
            //         break
            //     case 'amxpj':
            //         this.proxyUrl = 'https://agent.tp9km5qt.vip'
            //         break
            //     case 'amwnsr':
            //         this.proxyUrl = 'https://agent.715639.com'
            //         break
            //     case 'funw':
            //         this.proxyUrl = 'https://agent.6hqpxiwqfg.com'// funw 泛游
            //         break
            //     case 'bqty':
            //         this.proxyUrl = 'https://agent.6hqpxiwqfg.com'// bqty
            //         break
       
            // }
            let win = window.open()
            setTimeout(()=>{
                 win.location.href = proxyUrl
            },100)
            // window.open(proxyUrl, "_blank");
        },
        toService() {
            this.$common.toService()
        },
        to(name) {
            //新窗口跳转
            // this.$router.push({
            //     name: name
            // })
            //  澳门威尼斯人统计
            if(window.projectImgUrl == 'funw' && name== 'recharge'){
				_paq.push([
				  "trackEvent",
				  "PC_btn",
				  "PC_btn",
				  this.$t('PC首页充值按钮')
				]);
				_paq.push(["trackGoal", 1]);
            }
            const { href } = this.$router.resolve({
                name: name
            });
            window.open(href, "_self");
        },
        loginAction(type) {
            this.setShowLogin({ show: true, isLogin: type !== 'register' })
            return
            var _this = this;
            var aseKey = "pigxpigxpigxpigx"; //秘钥
            // Encrypt 加密·
            let encryptionPassword = MyAes.encrypt(this.pwd, aseKey);
            let param = {
                name: this.account,
                password: encryptionPassword,
                fingerprint: this.$config.fingerprint
            };

            //账号处理
            if (window.mergeAccount) {
                param.name = this.account + window.mergeAccount;
            }
            this.$http.post(this.$api.validateLogin, param).then(res => {
                // res.data.validateWay = "device"
                // res.data.validateStatus = false;
                if (res.code == 0) {
                    this.validateStatus = res.data.validateStatus ? 1 : 0;
                    if (this.validateStatus === 1) {
                        //无异常
                        this.Login();
                    } else {
                        if(res.data.validateWay == "ip") {
                            // 验证真实姓名
                            this.$emit("showPopup", true);
                        } 
                        if(res.data.validateWay == "device") {
                            // 验证设备
                            this.$refs.verifyIdentidy.openDialog();
                        }
                    }
                } else {
                    this.$message.error(res.msg);
                    if (this.type === 1) {
                        captcha1.innerHTML = "";
                    }
                    this.getDefaultStatus();
                }
            });
        },
        validateRealName(name) {
            let param = {
                name: this.account,
                realName: name
            };

            //账号处理
            if (window.mergeAccount) {
                param.name = this.account + window.mergeAccount;
            }
            this.$http.post(this.$api.validateRealName, param).then(res => {
                if (res.code == 1) {
                    this.$message.error(res.msg);
                } else if (res.data.validateStatus) {
                    this.Login();
                    // eslint-disable-next-line vue/custom-event-name-casing
                    this.$emit("showPopup", false);
                } else {
                    this.$message.error(
                        this.$t(`您的输入有误，还有{x}次验证机会，超过次数会冻结账号哦！`, { x: res.data.surplusCount })
                    );
                }
            });
        },
        // 获取   getDefaultStatus
        getDefaultStatus() {
            let _this = this;
            this.$http.get(this.$api.getDefaultStatus, false).then(res => {
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
                        this.showPicture = false;
                        _this.reset();
                    } else if (_this.type === 2) {
                        //2：数美"
                        this.showPicture = false;
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
            if(this.type ===1){
                if (this.captcha) {
                    this.captchaText = "";
                } else {
                    this.captchaText = this.$t('正在加载') + "...";
                }
            } else {
                this.captcha && this.captcha.reset()
            }
        },
        getCaptcha() {
            if (this.type == 1) {
                let _this = this;
                this.$http
                    .get(
                        this.$api.geetFirstRegister,
                        "?t=" + window.childCode,
                        false
                    )
                    .then(res => {
                        if (res.code == 0) {
                            window.initGeetest(
                                {
                                    gt: res.data.gt,
                                    challenge: res.data.challenge,
                                    new_captcha: res.data.newCaptcha, // 用于宕机时表示是新验证码的宕机
                                    offline: res.data.success !== 1, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                                    product: "float", // 产品形式，包括：float，popup
                                    width: "100%",
                                    lang: "cn"
                                },
                                _this.onCaptcha
                            );
                        } else {
                            this.$message.error(this.$t('获取错误'));
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
            } else if(this.type ===3) {
                if(!this.captcha){
                    initBotion({
                        captchaId: this.$config.captchaId,
                        product: 'popup',//float  popup
                        language: 'vie',
                        nativeButton:{
                            width: '180px',
                            height: '30px'
                        }
                    }, this.onCaptcha);
                }
            }
        },
        onCaptcha(res) {
            //res是验证实例，可以调用res的示例方法
            var _this = this;
            this.captcha = res;
            console.log(res,"res");
            if (_this.type == 1) {
                res.appendTo("#captcha1");
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

                this.captcha.onError(function() {
                    _this.captcha.rid = null;
                    _this.captchaText = this.$t("验证失败");
                    _this.captchaMask = false;
                });

                this.captcha.onClose(function() {
                    _this.captchaMask = false;
                });
            } else if(this.type === 3){
                res.appendTo("#gt4")
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
        captchaData: async function() {
            let _this = this;
            const res = await this.$http.get(_this.$api.captcha);
            if (res.code == 0) {
                _this.verifyCodeImg = res.data.captcha_image_content;
                // _this.captchaCode = res.data.captchaCode;
                _this.captchaKey = res.data.captchaKey;
                _this.showPicture = false;
            } else {
                // this.$message.error(res.msg + "");
            }
        },
        accountBlur() {
            //大写转小写
            this.account = this.account.toLowerCase();
            //空格处理
            this.account = this.account.replace(/\ /g, "");
        },
        passwordBlur() {
            //空格处理
            // this.pwd = this.pwd.replace(/\ /g, "");
        },
        Login: async function() {
            let _this = this;

            if (!this.account) {
                // this.$message.error("请输入账号");
                const msg = this.$message.error(this.$t("请输入账号"));
                   setTimeout(() => {
                        msg.close();
                    }, 2000); 
                return;
            }
            if (!this.pwd) {
                // this.$message.error("请输入密码");
                const msg = this.$message.error(this.$t("请输入密码"));
                   setTimeout(() => {
                        msg.close();
                    }, 2000); 
                return;
            }

            if (!this.code && this.type == 0) {
                // this.$message.error("请输入验证码");
                const msg = this.$message.error(this.$t("请输入验证码"));
                   setTimeout(() => {
                        msg.close();
                    }, 2000); 
                    return;
            }

            if (this.type != 0) {
                var result = this.captcha.getValidate();
                if (!result) {
                       // this.$message.error("请先通过行为验证");
                   const msg = this.$message.error(this.$t("请先通过行为验证"));
                   setTimeout(() => {
                        msg.close();
                    }, 2000); 
                    return;
                }
            }

            //登录接口
            var aseKey = "pigxpigxpigxpigx"; //秘钥
            // Encrypt 加密
            let encodePassword = MyAes.encrypt(this.pwd, aseKey);
            // Decrypt 解密
            let decodePassword = MyAes.decrypt(encodePassword, aseKey);

            //   if (!this.isClickLogin) {
            //     return;
            //   }

            this.isClickLogin = false;

            let params = {
                name: this.account,
                password: encodePassword,
                lastLoginVersion: this.$config.loginVersion,
                validateType: this.type,
            };

            //账号处理
            if (window.mergeAccount) {
                params.name = this.account + window.mergeAccount;
            }
            if (this.type === 1) {
                params.geeTestQueryVO = {
                    challenge: result.geetest_challenge,
                    seccode: result.geetest_seccode,
                    validate: result.geetest_validate
                };
            } else if (this.type === 2) {
                params.shuMeiQueryVO = {
                    rid: result.rid
                };
            } else if (this.type === 0) {
                params.captchaKey = this.captchaKey;
                params.captchaCode = this.code;
            } else if (this.type === 3){
                params.geeTestQueryVO = result
            }   

            if(this.fingerprintState){
                params.fingerprint =  this.$config.fingerprint;
                params.phoneModel =  this.$config.phoneModel;
            }
            const res = await _this.$http.post(_this.$api.login, params);
            if (res.code == 0) {
                _this.$common.setToken(res.data);
                _this.$common.setUser(res.data);
                //登陆成功提示
                this.$message({
                    message: this.$t("恭喜您，登录成功"),
                    type: "success"
                });

                this.$router.push("/");
                //第一次登陆
                sessionStorage.setItem("firstLogin", true);

                store.commit("firstLogin", true);
                this.$common.showLogin();
                //获取余额
                // this.getUserBalance();
                //获取用户信息
                this.$nkhttp.getUserInfo();
                //
                // this.$emit("ensureLogin", "");
                this.code = "";
                this.getMessages();
                this.getNotices();
                this.$store.commit('setQxylChat',1)
            } else {
                this.isClickLogin = true;
                this.validateStatus === -1
                this.$common.clearToken();
                this.$message.error(res.msg);
                if (_this.type === 1) {
                    captcha1.innerHTML = "";
                }
                this.getDefaultStatus();
            }
        },
        async getUserBalance(type) {
            var _this = this;
            //只针对手动点击刷新（10s内不可以重复刷新）
            if (!type) {
                _this.haveRefreshAnimation = true;

                let data = {
                    clientId: this.$common.getUser().tenant_id, //tenant_id
                    clientIp: this.$config.clientIp,
                    memberId: this.$common.getUser().user_id, //userid
                    username: this.$common.getUser().username
                };
                var res = await _this.$http.post(_this.$api.getuserMoney, data);
                if (res.code == 0) {
                    this.balance =
                        typeof res.data.totalBalance != "undefined"
                            ? res.data.totalBalance
                            : "0.00";
                    //结束刷新动画
                    _this.haveRefreshAnimation = false;
                    //余额存本地
                    this.$store.commit("updataUserInfo", res.data);

                    this.$common.setUserBalance(res.data);
                    this.$common.showLogin();
                } else {
                    //结束刷新动画
                    _this.haveRefreshAnimation = false;
                    //连续刷新不能报错
                    if (res.code != 10041) {
                        this.$message.error(res.msg);
                    }
                }
            } else {
                //手动刷新余额
                if (_this.refreshBalanceFlag) {
                    _this.haveRefreshAnimation = true;
                    _this.refreshBalanceFlag = false;

                    let data = {
                        clientId: this.$common.getUser().tenant_id, //tenant_id
                        clientIp: this.$config.clientIp,
                        memberId: this.$common.getUser().user_id, //userid
                        username: this.$common.getUser().username
                    };
                    var res = await _this.$http.post(
                        _this.$api.getuserMoney,
                        data,
                        true
                    );
                    if (res.code == 0) {
                        this.balance =
                            typeof res.data.totalBalance != "undefined"
                                ? res.data.totalBalance
                                : "0.00";
                        //结束刷新动画
                        _this.haveRefreshAnimation = false;
                        //余额存本地
                        this.$store.commit("updataUserInfo", res.data);
                        this.$common.setUserBalance(res.data);
                        this.$common.showLogin();

                        //提示用户,余额请求成功
                        this.$message.success(this.$t("刷新余额成功"));
                    } else {
                        this.$message.error(res.msg);
                        //结束刷新动画
                        _this.haveRefreshAnimation = true;
                    }

                    setTimeout(() => {
                        //10s后，才可以再次刷新
                        _this.refreshBalanceFlag = true;
                    }, 10000);
                } else {
                    //不可重复请求
                    this.$http.showMesasge(this.$t("点击间隔10s，请勿重复操作!"));
                }
            }
        },
        logout() {
            sessionStorage.setItem("firstLogin", false);
            this.$store.commit("firstLogin", false);
            this.$http.delete(this.$api.logout).then(res => {
                if (res.data === true) {
                    this.$common.clearToken();
                    this.$store.commit("setToken", null);
                    this.balance = "0.00";
                    //数据初始化
                    this.account = "";
                    this.pwd = "";
                    this.$router.push({ path: "/home" });
                }
            });
        },
        setupLoginInfo() {
            if (this.$common.getUser()) {
                this.userName = this.$common.getUser().username;
            }
            // this.getUserBalance();
        },
        async getMessages() {
            var _this = this;
            var data = {
                currentPage: "",
                pageSize: "",
                receiverType: 0
            };
            var res = await _this.$http.post(_this.$api.message, data);
            if (res.code == 0) {
                let messages = res.data.content;
                _this.msgUnReadNum = res.data.unreadCount;
            } else {
                this.$message.error(res.msg);
            }
        },
        async getNotices() {
            var _this = this;
            var data = {
                createdAt: "",
                currentPage: "",
                pageSize: "",
                publishedAt: "",
                subject: "",
                type: ""
            };
            var res = await _this.$http.post(_this.$api.noticeList, data);
            if (res.code == 0) {
                let noticesData = res.data.content;
                _this.noticeUnReadNum = res.data.unreadCount;
            } else {
                this.$message.error(res.msg);
            }
        },
        //一键归户
        onGetMoney() {
            let option = {
                clientId: this.$common.getUser().tenant_id, //tenant_id
                clientIp: this.$config.clientIp,
                memberId: this.$common.getUser().user_id, //userid
                username: this.$common.getUser().username
            };
            this.$http.post(this.$api.oneKeyBalance, option, true).then(res => {
                if (res.code == 0) {
                    this.$message.success(this.$t("归集成功"));
                    this.getUserBalance();
                }
            });
        },
        // 头部动态跳转
        jump(item) {
            if (item.editStatus === 0) {
                switch (item.fixedCode) {
                    case this.$t("充值中心"):
                        if (this.$common.getUser()) {
                            this.$router.push("/rechange");
                        } else {
                            // this.$message.error('您还未登录请前往登录');
                            this.$common.openLogin()
                        }
                        break;
                    case this.$t("合作伙伴"):
                        this.$router.push("/cooperation");
                        break;
                    case this.$t('APP下载'):
                        this.$router.push("/app");
                        break;
                }
            } else {
                // if (this.$common.getUser()) {
                    switch (item.jumpType) {
                        case 0: //路径
                            if (item.openType === 0) {
                                window.open(item.jumpContent, "_self");
                            } else {
                                window.open(item.jumpContent, "_blank");
                            }
                            break;
                        case 1: //公告(打开的是公告详情)
                            // eslint-disable-next-line no-case-declarations
                            this.openNotice()
                            // this.$router.push("/noticeInfo?type=2");
                            // let items = {
                            //     id: item.jumpContent
                            // };
                            // this.$store.commit("showSwiperNoticeDetail", items);
                            // break;
                        case 2: //活动(打开的是优惠活动详情)id
                            // eslint-disable-next-line no-case-declarations
                            this.$router.push(
                                "/actDetail?id=" + item.jumpContent
                            );
                            break;
                        case 3: //专题活动(打开的是限时优惠详情)
                            this.$http.get(this.$api.getThematicActivitiesByApp + '/' + item.jumpContent,'',true).then((res) => {
                                if (res.code == 0 && res.data) {
                                    if (res.data.type == 2) {
                                        if (this.$common.getUser()) {
                                            this.$router.push({
                                                path: "/signInPage",
                                                query: {
                                                    id: res.data.id
                                                }
                                            });
                                        } else {
                                            // this.$message.error(this.$t('您还未登录请前往登录'));
                                            this.$common.openLogin()
                                            this.$store.commit("loginNavId", 0);
                                            showLogin({
                                                show: true
                                            });
                                        }
                                    } else {
                                        this.$router.push({
                                        // 从专题活动进入
                                            path: "/actDetail",
                                            query: {
                                                byAppId: item.jumpContent
                                            }
                                        });
                                    }
                                }
                            });
                            break;
                        case 4: //游戏
                                // 进入游戏
                                if (this.$common.getUser()) {
                                    let that = this;

                                    that.tenantId = that.$common.getUser().tenant_id;
                                    that.username = that.$common.getUser().username;
                                    that.uid = that.$common.getUser().user_id;
                                    let data = {
                                        tenantId: that.tenantId,
                                        username: that.username,
                                        gameId: item.jumpContent,
                                        clientIp: that.$config.clientIp,
                                        memberId: that.uid,
                                        terminalType: 1
                                    };
                                    that.$common.setGameRequestData(data);
                                    that.$http.post(that.$api.getToken, data, true).then((res) => {
                                        if (res.code == 0) {
                                            that.gameUrl = res.data;
                                            window.open(that.gameUrl);
                                        } else {
                                            if (item.openType === 1) {
                                                window.open("/error.html?type=1");
                                            }
                                            let msg = that.$t(`errorCode.${res.code}`) + `(${res.code})` || this.$t('网络响应异常，请稍后再试，或联系客服咨询');
                                            that.$http.errMsg(msg);
                                        }
                                    })
                                } else {
                                    // this.$message.error(this.$t('您还未登录请前往登录'));
                                    this.$common.openLogin()
                                    this.$store.commit("loginNavId", 0);
                                    showLogin({
                                        show: true
                                    });
                                }
                            break;

                        case 7:
                            if(item.url){
                                this.$router.push({path: item.url})
                            }
                    }
            }
        },
    },
    watch: {
        isLogin(n) {
            if (n) {
                this.setupLoginInfo();
            } else {
                //账号在其他地方登陆（被踢）
                //数据重置
                if (this.type == 1) {
                    captcha1.innerHTML = "";
                }
                this.getDefaultStatus();
            }
        },
        "$store.state.token"(n) {
            //监听token，判断是否登录
            this.isLogin = !!n;
            this.logins(n);
        }
    },
    beforeDestroy () {
        if (this.interval) clearInterval(this.interval)
    }
};
</script>

<style lang='less' scoped>
.vipImg {
    width: 55px;
    height: 22px;
    margin: auto 5px;
}
.header-time-text{
    margin: 0 5px;
}
.header_container {
    width: 100%;
    height: 105px;
    position: fixed;
    left: 0;
    top: 0;
    background: url('~@/assets/image/qqImg/bg_topCtrl.jpg') no-repeat center/cover #06396a;
    z-index: 999;
    text-align: center;
    line-height: 50px;
    color: #fff;
}
.headerWidth {
    width: 1200px;
    height: 40px;
    margin: 0 auto;
    display: flex;
    position: relative;
    align-items: center;
}
.header_container .headerLeft {
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
}
.world-left,.world-right {
    width: 369px;
    height: 76px;
    position: absolute;
    bottom: 0;
    background: url("~@/assets/image/qqImg/cupLeft.png") no-repeat;
    background-size: 100% 100%;
}
.world-right {
    right: 0;
    background: url("~@/assets/image/qqImg/cupRight.png") no-repeat;
}
.headerLeft span.times {
    color: rgba(239, 199, 122);
    margin-left: 10px;
}

.logo {
    .popup-list {
      display: none;
    }
  }
  .title-logo{
    width: 150px;
    font-size: 16px;
    line-height: 1.2;
    text-align: center;
    color: #fead00;
  }
.headerLeft ul {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.headerLeft ul li {
    margin: 0 10px;
    line-height: 30px;
}
.headerLeft ul li:hover {
    color: rgba(239, 199, 122);
}
.headerLeft ul .liCenter {
    border-left: 1px solid #fff;
    height: 10px;
    line-height: 10px;
    padding: 0 10px;
    margin: 0;
    box-sizing: border-box;
}
.headerRight {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    .captchaStyle{
        cursor:pointer;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        width: 80%;
        height: 34px;
        padding: 0 9px;
        border-radius: 10px;
        line-height: 28px;
        background-color: #000;
        border: 1px solid #3c3c3c;
        color: #fff;
        box-shadow: 0px 3px 6px 0px #595959;
        &:hover{
            color: #000;
            background: linear-gradient(225deg, #9b7c4c 0%, #ffe7c1 100%);
        }
    }
}
.headerRight input {
    width: 128px;
    height: 30px;
    padding: 0 9px;
    border-radius: 10px;
    line-height: 28px;
    background-color: #000;
    border: none;
    border: 1px solid #3c3c3c;
    box-sizing: border-box;
    margin-right: 10px;
    color: #fff;
}
.headerRight input:focus {
    border-color: #e2c285;
}
.headerRight .password {
    border-radius: 10px;
    border: 1px solid #3c3c3c;
    line-height: 28px;
    margin-right: 10px;
    position: relative;
    display: flex;
}
.password input {
    margin: 0;
    flex: 1;
    padding-right: 45px;
    box-sizing: border-box;
}
.password span {
    position: absolute;
    top: 0;
    right: 0;
    color: rgba(239, 199, 122);
}
.password span:hover {
    color: red;
}
input::-webkit-input-placeholder {
    /* 修改字体颜色 */
    color: #fff;
    padding-left: 4px;
}
.leftButton,
.rightButton {
    overflow: hidden;
    margin-right: 10px;
}
.leftButtonOne, .rightButtonOne {
    display: flex;
    flex-direction: column;
    transition: transform 0.5s ease;
}
.rightButtonOne span{
    width: 90px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    padding-right: 20px;
    border-radius: 20px;
    background: url("~@/assets/image/qqImg/btn_addMember.png") no-repeat center 0px/90px;
}
.leftButtonOne span {
    width: 90px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    border-radius: 3px;
    background-color: #00b2b9;
}
.leftButtonOne span:hover,
.rightButtonOne span:hover {
}
.loginSuccessfulRight .user {
    display: flex;
    align-items: center;
    span{
        line-height: 1;
    }
}
/* 登录成功后右侧 */
.loginSuccessfulRight {
    display: flex;
    margin: 0 0 0 auto;
}
.balance,
.other {
    margin-right: 10px;
}
.loginSuccessfulRight .name,
.loginSuccessfulRight .amount {
    display: inline-block;
    color: rgba(239, 199, 122);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: top;
}
.loginSuccessfulRight .name {
    max-width: 100px;
    min-width: 70px;
}
.loginSuccessfulRight .amount {
    max-width: 100px;
}
.balance {
    display: flex;
    align-items: center;
}
.balance i {
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url("~@/assets/image/myRefresh.png") no-repeat;
    background-size: cover;
    margin-left: 5px;
}

// 余额刷新动画
.refreshAnimation,
.refresReturnAnimation {
    animation: refresh 0.5s infinite linear;
    -moz-animation: refresh 0.5s infinite linear;
    -webkit-animation: refresh 0.5s infinite linear;
    -o-animation: refreshing 0.5s infinite linear;
}
@keyframes refresh {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@-moz-keyframes refresh {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@-webkit-keyframes refresh {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@-o-keyframes refresh {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loginSuccessfulRight ul {
    display: flex;
    justify-content: center;
    align-items: center;
}
.other li {
    border-right: 1px solid #fff;
    height: 15px;
    line-height: 15px;
    padding: 0 5px;
    box-sizing: border-box;
}
.other li:hover {
    color: rgba(239, 199, 122);
}
.other .logout {
    border: none;
    margin: 0;
}

.loginBorder {
    border-radius: 5px;
    margin: 5px 10px;
    display: flex;
    align-items: center;
}

.codeimg {
    width: 100px;
    height: 30px;
    background-repeat: no-repeat;
}
.defaultPicture {
    width: 180px;
    height: 30px;
    margin: 5px 10px;
    background-color: #e5e5e5;
    text-align: center;
    color: #b4b4b4;
    line-height: 30px;
    font-size: 12px;
}
// 极验ui调整
.header_container .geetest_holder.geetest_wind {
    height: 30px;
    min-width: 180px;
    .geetest_radar {
        width: 20px;
        height: 20px;
        margin: 5px;
    }
    .geetest_success_btn {
        .geetest_success_box {
            top: 2px;
            left: 5px;
        }
    }
    .geetest_radar_tip.geetest_multi_line {
        line-height: 30px;
    }
    .geetest_radar_tip,
    .geetest_success_radar_tip {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        padding: 0 30px 0 40px;
    }
}

// 极验4 调整
// #gt4{
//     .botion_captcha .botion_holder, .botion_popup_wrap .botion_holder{
//         height: 30px;
//     }
// }
</style>