/* 获取设备唯一id 和相关信息 */
// npm install @fingerprintjs/fingerprintjs-pro —save

// #ifdef H5
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import i18n from '@/i18n/index'
// #endif

// 获取设备唯一id   h5获取的时候需要把后端返回的token传进来
export const _getDeviceId = (token) => {
    return new Promise(resolve => {

        // #ifdef H5
        // const token = 'g2gvkJsrBkVVdEU211bD'
        let id = localStorage.getItem('dfeivnigceer') // 缓存
        if (id) {
            resolve(id)
            return
        }
        // 获取新的
        const fpPromise = FingerprintJS.load({
            token: token
        })
        fpPromise
            .then(fp => fp.get()).catch(() => {
                // warningTip()
                resolve(token.split('').reverse().join('') + new Date().getTime().toString().slice(-12))
            })
            .then(result => {
                // device finger
                localStorage.setItem('dfeivnigceer', result.visitorId)
                resolve(result.visitorId)
            }).catch(() => {
                // warningTip()
                resolve(token.split('').reverse().join('') + new Date().getTime().toString().slice(-12))
            })
        // #endif

        // #ifdef APP-PLUS
        plus.device.getInfo({
            success: result => {
                resolve(result.uuid || result.aaid)
            },
            fail: result => {
                resolve(result.uuid || result.aaid)
            },
        })
        // plus.device.getInfo({
        //     success: result => {

        //         uni.showModal({
        //             title: "提示",
        //             content: "111"+JSON.stringify(result),
        //         })
        //         resolve(result.uuid || result.aaid)
        //     },
        //     fail: result => {

        //         uni.showModal({
        //             title: "提示",
        //             content: "222"+JSON.stringify(result),
        //         })
        //         resolve(result.uuid || result.aaid)
        //     },
        // })
        // #endif

    })
}

function warningTip(token) {
    uni.showToast({
        icon: 'none',
        title: i18n.$t('当前浏览器存在安全风险'),
        duration: 5000
    })
}

// 获取设备详情  从header里面传
// 手机型号 phoneModel
// 操作系统类型 systemType
// 浏览器类型 browserType
export const _getDeviceInfo = () => {
    return new Promise(resolve => {
        uni.getSystemInfo({
            success: res => {
                // #ifdef H5
                resolve({
                    phoneModel: res.model,
                    systemType: res.platform,
                    browserType: myBrowser()
                })
                // #endif

                // #ifdef APP-PLUS
                resolve({
                    phoneModel: res.brand + '-' + res.model,
                    systemType: res.platform,
                    browserType: ''
                })
                // #endif
            }
        })
    })
}


function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 &&
        userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1 &&
        userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1 &&
        userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return "IE7";
        } else if (fIEVersion == 8) {
            return "IE8";
        } else if (fIEVersion == 9) {
            return "IE9";
        } else if (fIEVersion == 10) {
            return "IE10";
        } else if (fIEVersion == 11) {
            return "IE11";
        } else {
            return "IE";
        }
    }
    if (isOpera) {
        return "Opera";
    }
    if (isEdge) {
        return "Edge";
    }
    if (isFF) {
        return "FF";
    }
    if (isSafari) {
        return "Safari";
    }
    if (isChrome) {
        return "Chrome";
    }
    return 'Unknown'
}