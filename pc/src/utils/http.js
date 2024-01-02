/*
 * @Description: 项目模块
 * @Version: 1.0
 * @Autor: steFan
 * @Date: 2020-03-19 14:01:03
 * @LastEditors: steFan
 * @LastEditTime: 2020-04-06 08:57:09
 */
/* jshint esversion: 6 */
'use strict';
import axios from 'axios';
import common from './common'; //公共js
import ElementUI from 'element-ui';
import config from './config';
import {
    Loading
} from 'element-ui';
import i18n from '../i18n/index'
import store from '../store/store';
import router from '../router/index'
// axios.defaults.withCredentials=true;
axios.defaults.timeout = 30 * 1000;
let loading; //定义loading变量
let baseUrl = common.getHost();
const ACCESS_TOKEN = 'access_token';
let messageInstance = null; //定义弹框

function startLoading() {
    //使用Element loading-start 方法
    if (!loading) {
        loading = Loading.service({
            'lock': true,
            'text': i18n.$t('加载中') + '...',
            'background': 'rgba(0, 0, 0, 0.3)'
        });
    }
}

function endLoading() {
    //使用Element loading-close 方法
    if (loading) {
        loading.close();
        loading = null;
    }
}

//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0;

export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
}
export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) {
        return;
    }
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        setTimeout(() => {
            endLoading();
        }, 300);
    }
}
// http request 拦截器
let locale = {
    'vi': 'vi-VN,vi;q=0.9',
    'zh_CN': 'zh-CN,zh;q=0.9',
    'en': 'en-US,en;q=0.9',
    'pt': 'pt-BR,pt;q=0.9',
}
axios.interceptors.request.use(
    (config) => {
        config.headers = {
            'X-Frame-Options': 'SAMEORIGIN',
            'Accept-Language': locale[window.locale],
        };
        config.headers.contentType = 'application/json';
        config.headers.clientCode = window.clientCode;
        config.headers.pc = 1;
        config.headers.clientItem = window.childCode //子平台id字段
        config.headers.skinCode = window.theme
        config.headers.appId = window.theme
        if (common.getToken()) {
            config.headers.Authorization = common.getToken();
        }
        if (config.configs.isLoading) {
            showFullScreenLoading();
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// http response 拦截器
axios.interceptors.response.use(
    (response) => {
        if (response.config.configs.isLoading) {
            tryHideFullScreenLoading();
        }
        if (response.data.code == 16003) {
            common.clearToken();
            store.commit('setToken', null);
            showMesasge(i18n.$t('您的账户已经在其他设备登录，为保证账户安全请及时登录并修改密码') + '!');
            router.replace({
                path:'/'
            })
            // setTimeout(()=>{
            //     location.reload();
            // },1000);
        } else if (response.data.code == 110009) {
            common.clearToken();
            sessionStorage.setItem('restraint', true);
            router.replace({
            	path: '/iplimit',
                query:{
                    ip: response.data.msg,
                    customer: response.data.data.customer
                }
            })
            // showMesasge('访问被限制');
        } else {
            return response;
        }
    },
    (error) => {
        tryHideFullScreenLoading();
        //403处理    （去掉先）
        if (error.response) {
            if (loading) {
                loading.close();
            }
            switch (error.response.status) {
                case 503:
                    // showMesasge('系统维护中');
                    break;
                case 500:
                    // showMesasge('系统维护中');
                    break;
                case 401:
                    common.clearToken();
                    store.commit("setToken", null);
                    showMesasge(i18n.$t('您的登录账户已经过期，请您重新登录'));
                    router.replace({
                        path:'/'
                    })
                    // setTimeout(()=>{
                    //     location.reload();
                    // },200);
                    break;
                    // 404请求不存在
                case 404:
                    showMesasge(error.response.data.msg);
                    break;
                    // 其他错误，直接抛出错误提示
                default:
                    this.showMesasge(error.response.data.msg);
            }
        }
        return Promise.resolve(error.response);
    }
);

function showMesasge(msg, type = 'error') {
    if (messageInstance) {
        //如果有已经打开的弹框就先关闭
        // messageInstance.close();
        // messageInstance = null;
    } else {
        messageInstance = ElementUI.Message({
            'showClose': true,
            'message': msg || i18n.$t('请求出错，请重试'),
            'type': type,
            'duration': 3000,
            'onClose': () => {
                messageInstance = null;
            }
        });
    }
}

export default {
    showMesasge(msg, type = 'error') {
        if (messageInstance) {
            //如果有已经打开的弹框就先关闭
            // messageInstance.close();
            // messageInstance = null;
        } else {
            messageInstance = ElementUI.Message({
                'showClose': true,
                'message': msg || i18n.$t('请求出错，请重试'),
                'type': type,
                'duration': 3000,
                'onClose': () => {
                    messageInstance = null;
                }

            });
        }
    },
    // post
    post(url, data, isLoading = false) {
        let requestUrl = baseUrl + url;
        return new Promise((resolve, reject) => {
            let req = {
                'appVer': config.appVer,
                'ver': config.protocolVer,
                'reqId': config.reqId,
                'param': data || {}
            };
            let loading = {
                'configs': {
                    'isLoading': isLoading
                }
            };
            axios
                .post(requestUrl, req, loading)
                .then((response) => {
                    if (response) {
                        resolve(response.data);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    // post
    mainPost(url, data, isLoading = false) {
        let requestUrl = url;
        return new Promise((resolve, reject) => {
            let req = {
                appVer: config.appVer,
                ver: config.protocolVer,
                reqId: config.reqId,
                param: data || {},
            };
            let loading = {
                configs: {
                    isLoading: isLoading,
                },
            };
            axios
                .post(requestUrl, req, loading)
                .then((response) => {
                    if (response) {
                        resolve(response.data);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    // get
    get(url, params, isLoading = false) {
        let paramsStr = '';
        if (params) {
            paramsStr = params;
        }
        let requestUrl = baseUrl + url + paramsStr;
        let configs = {
            'isLoading': isLoading
        };

        return new Promise((resolve, reject) => {
            axios
                .get(requestUrl, {
                    'configs': configs
                })
                .then((response) => {
                    if (response.data) {
                        resolve(response.data);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    // patch
    patch(url, data) {
        let requestUrl = baseUrl + url;
        return new Promise((resolve, reject) => {
            let req = {
                'appVer': config.appVer,
                'ver': config.protocolVer,
                'reqId': config.reqId,
                'param': data || {}
            };
            let configs = {
                'isLoading': isLoading
            };
            axios
                .patch(requestUrl, req, configs)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    //put
    put(url, data, isLoading = false) {
        let requestUrl = baseUrl + url;
        return new Promise((resolve, reject) => {
            let req = {
                'appVer': config.appVer,
                'ver': config.protocolVer,
                'reqId': config.reqId,
                'param': data || {}
            };
            let loading = {
                'configs': {
                    'isLoading': isLoading
                }
            };
            axios
                .put(requestUrl, req, loading)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    //putUrl  将请求参数拼接在URL中
    putUrl(url, data, isLoading = false) {
        let requestUrl = baseUrl + url;
        return new Promise((resolve, reject) => {
            let req = data || {};
            let configs = {
                'isLoading': isLoading
            };

            axios
                .put(requestUrl, null, {
                    'params': req,
                    configs
                })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    //delete
    delete(url, params, isLoading = false) {
        let paramsStr = '';
        if (params) {
            paramsStr = params;
        }
        let requestUrl = baseUrl + url + paramsStr;
        let configs = {
            'isLoading': isLoading
        };
        return new Promise((resolve, reject) => {
            axios
                .delete(requestUrl, {
                    'configs': configs
                })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    //deleteArray
    deleteArray(url, params, isLoading = false) {
        let requestUrl = baseUrl + url;
        return new Promise((resolve, reject) => {
            let req = {
                'appVer': config.appVer,
                'ver': config.protocolVer,
                'reqId': config.reqId,
                'clientCode': 'string',
                'operator': 'string',
                'param': params || {}
            };

            let configs = {
                'isLoading': isLoading
            };
            axios
                .delete(requestUrl, {
                    'data': req,
                    configs
                })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    pnPost(url, data, isLoading = false, cb) {
        let requestUrl = baseUrl + url;
        let req = {
            'appVer': config.appVer,
            'ver': config.protocolVer,
            'reqId': config.reqId,
            'param': data || {}
        };
        let loading = {
            'configs': {
                'isLoading': isLoading
            }
        };
        axios
            .post(requestUrl, req, loading)
            .then((res) => {
                if (res) {
                    cb(res);
                }
            })
            .catch((err) => {
                reject(err);
            });
    }
};