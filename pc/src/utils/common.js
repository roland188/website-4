/*
 * @Description: 项目模块
 * @Version: 1.0
 * @Autor: steFan
 * @Date: 2020-03-10 11:16:44
 * @LastEditors: steFan
 * @LastEditTime: 2020-03-28 19:46:46
 */
import cache from './cache.js';
import Base64 from './base64.js';
import config from './config'
import store from '../store/store'
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const SET_USER = 'set_user';
const QXYLRIGHT = 'qxylRight';
const GAME_MENUS = 'game_menus_pc';
const SET_WEBVIEW = 'set_webview_pc';
const SET_CONFIGURL = 'set_config_url_pc';
const CONFIGHOST = 'config_host_pc';
const REQHOSTURL = 'host';
const USERBALANCE = 'user_balance';
const CUSTOMERSERVICE = 'customer_service'
const GAMEREQUESTDATA = 'gameRequestData';
const IMGURL = 'imgUrl'
const CLIENTCODERES = 'clientCodeRes';
const DOWURL = 'dowUrl';
const jackpotUrl = 'jackpotUrl';
const customerServiceUrl = 'customerServiceUrl'
export default {
    // 页面标题
    getTitleImgUrl(srcName, type) {
        let lang = config.local;
        let nameStr = srcName ? srcName : '';
        let urlTypr = type ? '.gif' : '.png';
        let projectImgUrl = window.projectImgUrl + nameStr + urlTypr + '';
        return require("@/assets/image/pubilc/" + projectImgUrl);
    },
    // 是否一天
    isToday(oldStr, nowStr) {
        if (new Date(oldStr * 1).toDateString() === new Date(nowStr * 1).toDateString()) {
            return true
        } else {
            return false
        }
    },
    // 设置token
    setToken(res) {
        if (res && res.token_type && res.access_token) {
            var accessToken = res.token_type + ' ' + res.access_token;
            var accessTime = res.expires_in;
            var refreshToken = res.refresh_token;
            cache.set(ACCESS_TOKEN, accessToken, accessTime);
            cache.set(REFRESH_TOKEN, refreshToken);
            store.commit('setToken', accessToken);
        }
    },
    // 获取token
    getToken() {
        return cache.get(ACCESS_TOKEN);
    },
    setUser(res) {
        cache.set(SET_USER, res);
    },
    getUser() {
        return cache.get(SET_USER);
    },
    setDowUrl(res) {
        cache.set(DOWURL, res);
    },
    getDowUrl() {
        return cache.get(DOWURL);
    },

    setJackpotUrl(res) {
        cache.set(jackpotUrl, res);
    },
    getJackpotUrl() {
        return cache.get(jackpotUrl);
    },

    setCustomerServiceUrl(res) {
        cache.set(customerServiceUrl, res);
    },
    getCustomerServiceUrl() {
        return cache.get(customerServiceUrl);
    },
    openLogin(isRegister) {
        store.commit('setShowLogin', { show: true, isLogin: !isRegister })
    },
    // 清除
    clearToken() {
        this.accessToken = null;
        cache.remove(ACCESS_TOKEN);
        cache.remove(REFRESH_TOKEN);
        cache.remove(SET_USER);
        cache.remove(QXYLRIGHT);
        cache.remove(USERBALANCE);
        store.commit('setToken', null);
    },
    // 是否登录
    isLogin() {
        var token = this.getToken();
        return token && token.length;
    },
    //显示登录弹框
    showLogin() {
        store.commit("needCheckLogin", true);
    },
    // 设置游戏列表
    setGameList(res) {
        cache.set(GAME_MENUS, res);
    },
    // 获取游戏列表
    getGameList() {
        return cache.get(GAME_MENUS);
    },
    encodeURI(url) {
        return Base64.Base64.encodeURI(url)
    },
    decode(url) {
        return Base64.Base64.decode(url)
    },
    setWebView(url, title, linkType) {
        // let webUrl = this.encodeURI(url)
        let res = {
            webUrl: url,
            title,
            linkType
        }
        cache.set(SET_WEBVIEW, res);
    },
    getWebView() {
        return cache.get(SET_WEBVIEW);
    },
    getImgUrl(path) {
        if (path !== '') {
            let imgUrl = process.env.NODE_ENV !== 'production' ? config.imgHost : window.location.origin + '/file'
            return imgUrl + path;
            // return 'https://tc20014.com/file' + path;
        }
    },
    setConfigUrl(res) {
        cache.set(SET_CONFIGURL, res);
    },
    getConfigUrl() {
        return cache.get(SET_CONFIGURL);
    },
    setImgUrlImg(res) {
        cache.set(IMGURL, res);
    },
    getImgUrlImg() {
        return cache.get(IMGURL);
    },
    setConfigHost(res) {
        cache.set(CONFIGHOST, res)
    },
    setUserBalance(res) {
        cache.set(USERBALANCE, res)
    },
    getUserBalance() {
        return cache.get(USERBALANCE);
    },
    setClientCodeRes(res) {
        cache.set(CLIENTCODERES, res)
    },
    getClientCodeRes() {
        return cache.get(CLIENTCODERES);
    },

    getConfigHost() {
        return cache.get(CONFIGHOST);
    },
    getHost() {
        return localStorage.getItem(REQHOSTURL);
        // return config.host
    },
    //  
    setCustomerService(res) {
        cache.set(CUSTOMERSERVICE, res)
    },

    getCustomerService() {
        return cache.get(CUSTOMERSERVICE);
    },
    // GAMEREQUESTDATA
    setGameRequestData(res) {
        cache.set(GAMEREQUESTDATA, res)
    },
    getGameRequestData() {
        return cache.get(GAMEREQUESTDATA);
    },
    spArray(N, Q) {
        var R = [],
            F;
        for (F = 0; F < Q.length;) {
            R.push(Q.slice(F, F += N))
        }
        return R
    },
    // 域名处理
    setHostName() {
        var u = window.location.hostname;
        var a = u.split(".");
        if (a.length > 2) a = a.slice(a.length - 2);
        var s = 'http://m.' + a.join(".");
        let sessData = JSON.parse(sessionStorage.getItem('inviteCode'))
        var arrNew = ''
        if (sessData) {
            arrNew = s + '?code=' + sessData
        } else {
            arrNew = s
        }
        return arrNew
    },
    conversionTime(timeStamp) {
        if (timeStamp > 0) {
            var date = new Date()
            date.setTime(timeStamp)
            var y = date.getFullYear()
            var m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m
            var d = date.getDate()
            d = d < 10 ? '0' + d : d
            var h = date.getHours()
            h = h < 10 ? '0' + h : h
            var minute = date.getMinutes()
            var second = date.getSeconds()
            minute = minute < 10 ? '0' + minute : minute
            second = second < 10 ? '0' + second : second
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
            // return y + '-' + m + '-' + d
        } else {
            return ''
        }
    },
    // 位数截取
    setNumFixed(num, i, tok) {
        if([0,'0'].includes(num)) return '0.00'
        if (num == '--/--') {
            num = '0.00'
        }
        let newNum = num * 1;
        let getNum = ''
        let tempVal = parseFloat(newNum).toFixed(i + 1)
        getNum = tempVal.substring(0, tempVal.length - 1);
        return getNum
    },
    toService() {
        const wnsrUrl = cache.get('wnsrServerUrl')
        const win = window.open()
        win.location.href = wnsrUrl
    },
    /*
    可以处理数字或字符串中的数字。
    可以指定要保留的小数位数，默认为 2。
    将整数部分转换为千分位格式。
    根据需要截取或补充小数部分的位数
    */
    numToThousandAndFixed(number, decimalPlaces = 2) {
        
        if([0,'0'].includes(number) || isNaN(number)) return '0.00'
        // 检查输入是否为字符串
        let formattedNumber = number.toString();
        // 检查是否存在小数部分
        const decimalIndex = formattedNumber.indexOf('.');
        let integerPart, decimalPart;
        if (decimalIndex !== -1) {
          integerPart = formattedNumber.slice(0, decimalIndex);
          decimalPart = formattedNumber.slice(decimalIndex + 1);
        } else {
          integerPart = formattedNumber;
          decimalPart = '';
        }
      
        // 转换整数部分为千分位格式
        const integerRegex = /\B(?=(\d{3})+(?!\d))/g;
        integerPart = integerPart.replace(integerRegex, ',');
      
        // 截取或补充小数部分的位数
        decimalPart = decimalPart.padEnd(decimalPlaces, '0');
        decimalPart = decimalPart.slice(0, decimalPlaces);
      
        // 格式化结果
        return decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : integerPart;
      }

}