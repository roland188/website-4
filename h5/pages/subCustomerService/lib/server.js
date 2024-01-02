import config from './config'
import i18n from './i18n'

let server
try {
    server = require('../../../utils/server')
} catch(e) {}


const _request = (url, data = {}, method = 'POST', responseType = 'text') => {
    return new Promise(resolve => {
        if (server) {
            const m = method.toLowerCase()
            const reqMethod = server[m]
            const isAllowAes = ['ffbc', 'aygj']
            if (reqMethod && isAllowAes.includes(config.projectImgUrl)) {
                reqMethod.bind(server)(url, data ? data.param : data, (err, res) => {
                    resolve(err || { code: 0, data: res })
                })
                return
            }
        }
        
        const req = {
            url: config.baseURL + url,
            data: data,
            method: method,
            responseType: responseType,
            header: {
                'Content-Type':'application/json',
                clientCode: config.clientCode,
                h5: 1,
                lang: config.lang,
                clientItem: config.clientItem,
                appid: config.theme,
                Authorization: ''
            },
            fail: () => {
                uni.showToast({
                    title: i18n.$t("请求错误..."),
                    icon: "none",
                })
                resolve(false)
            },
            success: res => {
                if (res.statusCode == 200 && res.data) {
                    if (res.data.errCode == 2) {
                        uni.showToast({
                            title: i18n.$t("登录信息已过期..."),
                            icon: "none",
                        })
                        setTimeout(() => {
                            uni.navigateBacks({
                                delta: 100,
                            })
                        }, 2000)
                        return
                    }
                    resolve(res.data)
                    return
                }
                resolve(res.data)
            }
        }
        uni.request(req)
    })
}

// post请求
export const _post = (url, data = null) => {
    const req = {
        'appVer': '1',
        'ver': '1',
        'reqId': '1',
        'param': data
    }
    return _request(url, req)
}

// get请求
export const _get = (url, data = null) => {
    let str = ''
    for (let key in data) {
        str += (key + '=' + data[key] + '&')
    }
    if (str) {
        url += ('?' + str)
    }
    return _request(url, null, 'GET')
}