import Vue from "vue";
import Vuex from "vuex";
import * as types from "./types";
import utils from '../utils/utils';
import cache from '../utils/cache';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        // ---------腾币商城---------start
        clientMall: {
            name: ''
        },//商城基础信息
        showDialg: false,//是否打开签到弹框
        userRmb: 0,//用户持有的币
        // ---------腾币商城---------end
        userInfo: { //个人信息
            userId: "", //id
            clientId: "",
            avatar: "", //头像
            realName: "", //真实姓名
            nickname: "", //昵称
            phone: "", //手机号
            birthday: "", //生日
            name: "", //登录账户
            email: "", //邮箱
            qq: "", //QQ
            wechat: "", //微信
            gradeName: "", //会员等级
            withdrawPassWordState: false, //资金密码是否设置
            sex: 1, //性别
            levelId: "", //会员中间
            viplv: 'normal_user', //会员等级
            totalBalance: 0, //总余额
            totalBalanceDetail: [], //余额列表
        },
        bankArr: [], //银行卡列表
        token: null,
        title: "",
        count: false,
        provinceId: null,
        windowgame: false,
        fullscreengame: false,
        isShow: null,
        hasBeenOpened: null,
        configHost: null,
        configUrl: null,
        unReadFlag: "",
        msgTotalFlag: false,
        myGame: null,
        swiperNoticeItem: null,
        showGame: null,
        exitLogin: false,
        hideAside: false,
        cancelActive: false,
        actBannerEnterGame: null,
        msgUnReadTotalVuex: 0,
        noticeUnReadTotalVuex: 0,
        firstLogin: false,
        needCheckLogin: false,
        mosaicGoldStatus: '',
        creditCard: 0,
        customerList: [],
        returnWaterMoney: '0.00',
        rebate: false,
        mosaicGoldShow: false,
        showLogin: { show: false, isLogin: true },
        qxylRightShow: cache.get('qxylRightShow') || 0,
    },
    mutations: {
        [types.LOGIN]: (state, data) => {
            localStorage.token = data;
            state.token = data;
        },
        [types.LOGOUT]: state => {
            localStorage.removeItem("token");
            state.token = null;
        },
        [types.TITLE]: (state, data) => {
            state.title = data;
        },
        [types.PID]: (state, data) => {
            state.provinceId = data;
        },
        setToken(state, data) {
            state.token = data;
            if (!data) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("set_user");
            }
        },
        setShowLogin(state, val) {
            state.showLogin = Object.assign(state.showLogin, val)
        },
        //小窗口
        windowgame(state, isTrue) {
            state.windowgame = isTrue;
        },
        //大窗口
        fullscreengame(state, isTrue) {
            state.fullscreengame = isTrue;
        },
        hasBeenOpened(state, isTrue) {
            state.hasBeenOpened = isTrue;
        },
        isShow(state, isShow) {
            state.isShow = isShow;
        },
        configHost(state, data) {
            state.host = data;
        },
        configUrl(state, data) {
            state.configUrl = data;
        },
        //实时更新mypage的未读标志
        updateUnRead(state, data) {
            state.unReadFlag = data;
        },
        // 实时更新通知的总数量
        updateMsgTotal(state, data) {
            state.msgTotalFlag = data;
        },
        myGame(state, data) {
            state.myGame = data;
        },
        //展示轮播公告详情
        showSwiperNoticeDetail(state, data) {
            state.swiperNoticeItem = data;
        },
        showGame(state, data) {
            state.showGame = data;
        },
        exitLogin(state, data) {
            state.exitLogin = data;
        },
        //隐藏myPage的el-aside
        hideAside(state, data) {
            state.hideAside = data;
        },
        //关闭弹窗，取消mypage高亮效果
        cancelActive(state, data) {
            state.cancelActive = data;
        },
        //优惠banner进入mypage游戏
        actBannerEnterGame(state, data) {
            state.actBannerEnterGame = data
        },
        msgUnReadTotalVuex(state, data) {
            state.msgUnReadTotalVuex = data
        },
        noticeUnReadTotalVuex(state, data) {
            state.noticeUnReadTotalVuex = data
        },
        firstLogin(state, data) {
            state.firstLogin = data
        },
        needCheckLogin(state, data) {
            state.needCheckLogin = !state.needCheckLogin
        },
        //彩金状态
        mosaicGoldStatus(state, data) {
            state.mosaicGoldStatus = data
        },
        //登录资料卡
        creditCard(state, data) {
            state.creditCard = data
        },
        //更新个人信息
        updataUserInfo(state, obj) {
            utils.updateObj(state.userInfo, obj, true);
        },
        //清理个人信息
        clearUserInfo() {
            state.userInfo = {
                userId: "",
                avatar: "",
                realName: "",
                nickname: "",
                phone: "",
                birthday: "",
                name: "",
                email: "",
                qq: "",
                wechat: "",
                gradeName: "",
                withdrawPassWordState: false,
                sex: 1
            };
        },
        //设置银行卡列表
        setBankArr(state, data) {
            state.bankArr = data;
        },
        //设置客服列表
        setCustomerList(state, data) {
            state.customerList.splice(0, 0, ...data);
        },
        //设置返水
        setReturnWaterMoney(state, data) {
            state.returnWaterMoney = data;
        },
        rebate(state, data) {
            state.rebate = data;
        },
        mosaicGoldShow(state, data) {
            state.mosaicGoldShow = data;
        },
        setQxylChat(state, data){
            state.qxylRightShow = data;
            cache.set('qxylRightShow',state.qxylRightShow)
        },
        setClientMall(state, value) {
            state.clientMall = value
        },
        setShowDialg(state, value) {
            state.showDialg = value
        },
        setUserRmb(state, value) {
            state.userRmb = value
        },
    },
    getters: {
        userInfo: state => state.userInfo,
        bankArr: state => state.bankArr,
        //获取客服列表
        customerList: state => state.customerList,
        //获取返水
        getReturnWaterMoney: state => state.returnWaterMoney,
        token: state => state.token //判断用户是否登录
    }
});