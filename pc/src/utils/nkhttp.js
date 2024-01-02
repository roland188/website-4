import $store from "../store/store";
import $http from "./http";
import $api from "./api";
import $config from "./config";
import $common from "./common";
import i18n from '../i18n/index'
import {
    Message,
    Loading
} from 'element-ui';

function http(url, _obj = null, mode = 'post', cb = null, isload = false, receipt = false) {
    $http[mode](url, _obj, isload).then(res => {
        if (receipt) {
            cb && cb(res);
        } else {
            if (res.code == 0) {
                cb && cb(res.data);
            } else {
                Message.error(res.msg || i18n.$t('请求失败'));
            }
        }
    })
}

function getUserInfo() { //获取个人信息
    http($api.members + '/' + $common.getUser().user_id, null, 'get', data => {
        $store.commit("updataUserInfo", data);
        getvipdata();
        getuserMoney();
        getBank();
    });
}

function getuserMoney(cb = null, isload = false, receipt = false) { //获取总余额 and 余额列表
    let _obj = {
        clientId: $store.getters.userInfo.clientId,
        clientIp: $config.clientIp,
        memberId: $store.getters.userInfo.userId,
        username: $store.getters.userInfo.name
    };
    http($api.getuserMoney, _obj, 'post', data => {
        let _data = data;
        if (receipt) _data = data.data;
        $store.commit("updataUserInfo", _data);
        cb && cb(data);
    }, isload, receipt);
}

function getvipdata() { //获取会员信息
    http($api.getvipdata + '/' + $store.getters.userInfo.levelId, null, 'get', data => {
        let _str = data.gradeName.startsWith('LV') ? data.gradeName : 'normal_user';
        $store.commit("updataUserInfo", {
            viplv: _str
        });
    });
}

function getBank() { //获取银行卡列表
    http($api.banklist, null, 'get', data => {
        $store.commit("setBankArr", data);
    });
}

function oneKeyBalance() { //一键归集
    let loadingInstance = Loading.service({
        fullscreen: true,
        text: i18n.$t("加载中"),
        background: "#0000008f"
    });
    let _obj = {
        clientId: $store.getters.userInfo.clientId,
        clientIp: $config.clientIp,
        memberId: $store.getters.userInfo.userId,
        username: $store.getters.userInfo.name
    };
    http($api.oneKeyBalance, _obj, 'post', data => {
        Message.success(i18n.$t("归集成功"));
        loadingInstance.close();
        getuserMoney();
        getGameMoneyList();
    });
}
//获取游戏厂商列表
function getGameMoneyList() {
    let option = {
        clientId: $common.getUser().tenant_id, //tenant_id
        clientIp: $config.clientIp,
        memberId: $common.getUser().user_id, //userid
        username: $common.getUser().username,
    };
    $http.post($api.getGameMoneyList, option, true)
        .then((res) => {
            if (res.code == 0 && res.data) {
                $store.commit("updataUserInfo", res.data);

                $common.setUserBalance(res.data);
                // this.gameList = res.data.totalBalanceDetail;

            }
        });
}

export default {
    http,
    getUserInfo,
    getuserMoney,
    getvipdata,
    getBank,
    oneKeyBalance
}