import cache from './cache.js';
import config from './config.js';
import Base64 from './base64.js'
import i18n from '@/i18n/index';
let _isInit = false;
let _isWait = false;
let _isInvalidation = true;
let _isRequest = true;
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const SET_USER = 'set_user';
const SET_WEBVIEW = 'set_webview';
const GET_WEBVIEW = 'get_webview';
const IS_FIRST = 'is_first';
const SET_CONFIGURL = 'set_config_url';
const CONFIGHOST = 'host';
const ACCOUNTLOGOUT = 'account_logout';
const USERBALANCE = 'user_balance';
const ACTIVITYURL = 'activity_url';
const RECORDURL = 'record_url';
const AGENTURL = 'agent_url';
const CUSTOMERSERVICE = 'customer_service';
const GAMEMENUS = 'game_menus_pc';
const CLIENTCODERES = 'clientCodeRes';
const WINNINGURL = 'winning_url';
const HOTGAME = 'hotGame';
const FISHING = 'fishing';
const INVITECODE = 'inviteCode';
const server = {};
const CODEURL = 'codeUrl';
const IMGHOST = 'imgHost';
const NEWCUSTOMERURL = 'new_customer_url';
const MALLURL = 'mall_url';
// const platform = uni.getStorageSync('platform');
server.request = function (url, data = null, callback = null, isLoading = true, method = 'POST', responseType = 'text',
    contentType = 'application/json') {
    // if (url === '/api/test') {
    // 	config.host = 'http://192.168.1.159:3003'
    // }
    // console.log(config.host + url)
   let lang = {
    'vi': 'vi-VN,vi;q=0.9',
    'en': 'en-CN,en;q=0.9',
    'pt': 'pt-BR,pt;q=0.9'
   }       
    var req = {
        url: config.host + url,
        data: data,
        method: method,
        responseType: responseType,
        header: {
            'content-type': contentType,
            'clientCode': config.clientCode,
			// #ifdef H5
			'Accept-Language': lang[window.locale],
			// #endif
			// #ifdef APP-PLUS
			'Accept-Language': lang[config.locale],
			'appVersion': config.numVer,
			// #endif
        },
        success: (res) => {
            let self = this;
            if (res.statusCode == 200) {
                if (res.data) {
                    if (res.data.code == 0) {
                        if (!_isWait && isLoading) uni.hideLoading();
                        callback && callback(null, res.data.data || {});
                    } else if (res.data.code == 16003) {
                        uni.hideLoading()
                        self.clearToken();
                        self.showModal(i18n.$t('您正在一台新设备登录，为了您的账号安全，请进行安全验证。'))
                        _isInvalidation = false;
                        if (!_isRequest) {
                            return
                        }
                        _isRequest = false;
                    } else if (res.data.code == 130010) {
                        uni.hideLoading();
                        uni.showModal({
                            title: i18n.$t('提示'),
                            content: i18n.$t('项目维护中，请稍后再试'),
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    console.log('用户点击确定');
                                } else if (res.cancel) {
                                    console.log('用户点击取消');
                                }
                            }
                        });
                    } else if (res.data.code == 110009) { //黑名单
                        uni.hideLoading();
                        uni.reLaunch({
                            url: '/pages/iplimit/iplimit?ip=' + res.data.msg + '&custommerUrl=' + res.data.data.customer
                        })
                    } else {
                        if (url != '/pay/api/v1/deposit/entranceDeposit') {
                            onFail(res.data.code, res.data.msg);
                        } else {
                            var err = {
                                'code': res.data.code,
                                'msg': res.data.msg
                            }
                            uni.hideLoading();
                            callback && callback(err);
                        }
                    }
                } else {
                    onFail(-2, i18n.$t('数据请求失败'));
                }
            } else if (res.statusCode == 401) {
                console.log('8888888' + config.host + url, data, config.clientCode)
                uni.hideLoading()
                self.clearToken();
                self.showModal(i18n.$t('您的登录账户已经过期，请您重新登录'))
                _isInvalidation = false;

            } else if (res.statusCode == 500 || res.statusCode == 503) {
                uni.showToast({
                    icon: 'none',
                    title: i18n.$t('系统错误')
                })
            } else {
                console.log(url)
                if (url == '/member/api/v1/members/register' || '/member/api/v1/members/') {
                    //注册报错提示
                    onFail(res.data.code, res.data.msg);
                } else {
                    onFail(-1, i18n.$t('数据请求失败'));
                }
            }
        },
        fail: (res) => {
            // uni.showModal({
            // 	title: '提示',
            // 	content: '请检查您的网络',
            // 	success: function(res) {
            // 		if (res.confirm) {
            // 			uni.navigateTo({
            // 				url: '/pages/login/login?type=0'
            // 			})
            // 		} else if (res.cancel) {
            // 			uni.navigateTo({
            // 				url: '/pages/login/login?type=0'
            // 			})
            // 		}
            // 	}
            // });
            onFail(-1, i18n.$t('网络请求失败'));
        }
    };

    function onFail(code, msg) {
        var err = {
            code,
            msg
        }
        if (!_isWait) {
            uni.hideLoading();
            uni.showToast({
                title: msg || i18n.$t('加载失败请重试'),
                icon: 'none'
            });
        }
        callback && callback(err);
    };
    if (!_isInit) {
        this.accessToken = cache.get(ACCESS_TOKEN);
        _isInit = true;
    }
    if (this.accessToken) {
        // #ifdef  H5
        this.accessToken = this.accessToken.replace(/\"/g, "")
        // #endif
        req.header.Authorization = this.accessToken;
    }
    if (!_isWait && isLoading) {
        uni.showLoading({
            title: i18n.$t('加载中...'),
            mask: true
        });
    }
    let clientItem = '';
    let skinCode = ''
    // #ifdef  H5
	if (window.isMaskApp) {
		req.header.androidmjb = 1;
	} else {
		req.header.h5 = 1;
	}
    clientItem = window.childCode; //子平台id字段
    skinCode = window.theme;
    // #endif
    // #ifdef  APP-PLUS
    uni.getSystemInfo({
        success: function (res) {
            if (res.platform === 'android') {
                req.header.android = 1;
            } else if (res.platform === 'ios') {
                req.header.ios = 1;
            }
        }
    });
    clientItem = config.childCode //客户端id字段 
    skinCode = config.theme;
    // #endif
    req.header.clientItem = clientItem;
    req.header.skinCode = skinCode;
    uni.request(req);
};

server.auth = function (url, data = null, callback = null, isLoading = true, method = 'POST', responseType, contentType) {
    var req = {
        appVer: config.appVer,
        ver: config.protocolVer,
        reqId: config.reqId,
        param: data || {}
    };
    this.request(url, req, callback, isLoading, method, responseType, contentType);
};

server.post = function (url, data = null, callback = null, isLoading = true) {
    _isRequest = true;
    this.auth(url, data, callback, isLoading, 'POST');
};

server.put = function (url, data = null, callback = null, isLoading = true) {
    _isRequest = true;
    this.auth(url, data, callback, isLoading, 'PUT');
};

server.get = function (url, data = null, callback = null, isLoading = true) {
    _isRequest = true;
    this.request(url, data, callback, isLoading, 'GET');
};

server.del = function (url, data = null, callback = null, isLoading = true) {
    _isRequest = true;
    this.request(url, data, callback, isLoading, 'DELETE');
};

server.delArray = function (url, data = null, callback = null, isLoading = true) {
    this.auth(url, data, callback, isLoading, 'DELETE');
};

server.showModal = function (msg) {
    if (_isInvalidation) {
        uni.hideLoading();
        uni.showModal({
            title: i18n.$t('提示'),
            content: msg,
            showCancel: false,
            confirmText: i18n.$t('确定'),
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    uni.navigateTo({
                        url: '/pages/Login/Login?type=0'
                    })
                    _isInvalidation = true;
                } else if (res.cancel) {
                    console.log('用户点击取消');
                    _isInvalidation = true;
                }
            }
        });
    }
};
server.getToken = function () {
    return cache.get(ACCESS_TOKEN);
};

server.upImg = function (url, data = null, callback = null, isLoading = true) {
    this.auth(url, data, callback, isLoading, 'POST', 'text', 'multipart/form-data');
};
server.setToken = function (accessToken, accessTime, refreshToken) {
    this.accessToken = accessToken;
    cache.set(ACCESS_TOKEN, accessToken, accessTime);
    cache.set(REFRESH_TOKEN, refreshToken);
};

server.setUser = function (res) {
    cache.set(SET_USER, res);
};

server.getUser = function () {
    return cache.get(SET_USER);
};

server.clearToken = function () {
    this.accessToken = null;
    cache.remove(ACCESS_TOKEN);
    cache.remove(REFRESH_TOKEN);
    cache.remove(SET_USER);
    cache.remove(USERBALANCE);
};

server.clearLoginOut = function () {
    this.accessToken = null;
    cache.remove(ACCESS_TOKEN);
    cache.remove(REFRESH_TOKEN);
    cache.remove(SET_USER);
    cache.remove(CONFIGHOST);
    cache.remove(USERBALANCE);
};

server.clearAll = function () {
    this.accessToken = null;
    cache.clear()
};
server.getRefreshToken = function () {
    return cache.get(REFRESH_TOKEN);
};
server.setMallUrl = function (res) {
    cache.set(MALLURL, res)
}
server.getMallUrl = function (res) {
    return cache.get(MALLURL)
}
server.wait = function () {
    _isWait = true;
    uni.showLoading({
        title: i18n.$t('加载中...'),
        mask: true
    });
};

server.clearWait = function () {
    uni.hideLoading();
    _isWait = false;
};

server.fail = function () {
    uni.showToast({
        title: i18n.$t('加载失败请重试'),
        icon: 'none'
    });
};

server.encodeURI = function (url) {
    return Base64.Base64.encodeURI(url)
};

server.decode = function (url) {
    return Base64.Base64.decode(url)
};

server.setWebView = function (url, type, title, urlCode = null) {
    // let webUrl = this.encodeURI(url)
    let res = {
        webUrl: url,
        routerType: type,
        title,
        urlCode,
    }
    cache.set(SET_WEBVIEW, res);
};

server.getWebView = function (url, type) {
    return cache.get(SET_WEBVIEW);
};

server.setIsFirst = function (res = false) {
    cache.set(IS_FIRST, res);
};

server.getIsFirst = function () {
    return cache.get(IS_FIRST);
};

server.setConfigUrl = function (res) {
    cache.set(SET_CONFIGURL, res);
}

server.getConfigUrl = function () {
    return cache.get(SET_CONFIGURL);
};
server.setConfigHost = function (res) {
    cache.set(CONFIGHOST, res)
};
server.getConfigHost = function () {
    return cache.get(CONFIGHOST);
};
server.setAccountLogout = function (res) {
    cache.set(ACCOUNTLOGOUT, res)
}
server.getAccountLogout = function (res) {
    return cache.get(ACCOUNTLOGOUT);
}
server.setUserBalance = function (res) {
    cache.set(USERBALANCE, res)
}
server.getUserBalance = function (res) {
    return cache.get(USERBALANCE)
}
server.setActivityUrl = function (res) {
    cache.set(ACTIVITYURL, res)
}
server.getActivityUrl = function (res) {
    return cache.get(ACTIVITYURL)
}
server.setRecordUrl = function (res) {
    cache.set(RECORDURL, res)
}
server.getRecordUrl = function (res) {
    return cache.get(RECORDURL)
}
server.setAgentUrl = function (res) {
    cache.set(AGENTURL, res)
}
server.getAgentUrl = function (res) {
    return cache.get(AGENTURL)
}
server.setWinningUrl = function (res) {
    cache.set(WINNINGURL, res)
}
server.getWinningUrl = function (res) {
    return cache.get(WINNINGURL)
}
server.getTitleImgUrl = function (srcName, type) {
    return 111
}
server.setNewCustomerUrl = function (res) {
    cache.set(NEWCUSTOMERURL, res)
}
server.getNewCustomerUrl = function (res) {
    return cache.get(NEWCUSTOMERURL)
}
server.setCustomerService = function (res) {
        cache.set(CUSTOMERSERVICE, res)
    },
    server.getCustomerService = function () {
        return cache.get(CUSTOMERSERVICE);
    },
    server.setGameMenus = function (res) {
        cache.set(GAMEMENUS, res)
    },
    server.getGameMenus = function () {
        return cache.get(GAMEMENUS);
    },

    server.setClientCodeRes = function (res) {
        cache.set(CLIENTCODERES, res)
    },
    server.getClientCodeRes = function () {
        return cache.get(CLIENTCODERES);
    },
    server.setHotGame = function (res) {
        cache.set(HOTGAME, res)
    },
    server.getHotGame = function () {
        return cache.get(HOTGAME);
    },

    server.setFishing = function (res) {
        cache.set(FISHING, res)
    },
    server.getFishing = function () {
        return cache.get(FISHING);
    },
    server.setImgHost = function (res) {
        cache.set(IMGHOST, res)
    },
    server.getImgHost = function () {
        return cache.get(IMGHOST);
    },
    server.setCodeUrl = function (res) {
        cache.set(CODEURL, res)
    },
    server.getCodeUrl = function () {
        return cache.get(CODEURL);
    },
    // 缓存ios、安卓、pc下载地址----start
    server.setIosDownloadUrl = function (res) {
        cache.set('iosDownloadUrl', res);
    },
    server.setAndroidDownloadUrl = function (res) {
        cache.set('androidDownloadUrl', res);
    },
    server.setPcDownloadUrl = function (res) {
        cache.set('pcDownloadUrl', res);
    },
    server.getIosDownloadUrl = function () {
        return cache.get('iosDownloadUrl');
    },
    server.getAndroidDownloadUrl = function () {
        return cache.get('androidDownloadUrl');
    },
    server.getPcDownloadUrl = function () {
        return cache.get('pcDownloadUrl');
    },
    // 缓存ios、安卓、pc下载地址---end
    module.exports = server;