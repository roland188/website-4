/*
 * @Description: 项目模块
 * @Version: 1.0
 * @Autor: steFan
 * @Date: 2020-03-10 11:16:05
 * @LastEditors: steFan
 * @LastEditTime: 2020-03-24 17:43:54
 */
let str = localStorage.getItem('dowUrl');
try {
    str = str ? JSON.parse(str) : '';  
} catch {
    str = '';
}

let jackpotUrl = localStorage.getItem('jackpotUrl');
try {
    jackpotUrl = jackpotUrl ? JSON.parse(jackpotUrl) : ''; 
} catch {
    jackpotUrl = '';
}


let customerServiceUrl = localStorage.getItem('customerServiceUrl') || "";
const getCaptchaId = ()=>{
	return {
		'ff10': 'b7f5fc9ea916acc391a2f8f8c1738d4a', // ff10
		'tyjt': '1a48bfc3218e084cef101bf18263b29e', 
		'grty': '1a48bfc3218e084cef101bf18263b29e',
        "wnsr": "03e82ad34c486de33dff9d7665785358",
        'xpjf': 'd64b9552e16d0e5267cd4b0c2ea130fe',
        'funw': '6835c88f96927d75518446e19dfbcd20',
        'fwin': '03e82ad34c486de33dff9d7665785358',
        'xcao': 'd64b9552e16d0e5267cd4b0c2ea130fe'
	}[window.childCode]
}

// 区号、货币
const getConfing = () => {
    return {
        'ff10': {code: '86',currency: '￥' }, // ff10
        'new8': {code: '84',currency: '' }, // betcom
        'bgga': {code: '55',currency: 'R$' }, // BG.GAME
        'kbet': {code: '84',currency: '' }, // kubet
        'svip': {code: '84',currency: '' }, // 
        'choi': {code: '84',currency: '' }, // 
        'phat': {code: '84',currency: '' }, // 
        'g9bt': {code: '84',currency: '' }, // 
        'jun8': {code: '84',currency: '' }, // 
        'xcao': {code: '84',currency: '' }, //
        'wynn': {code: '84',currency: '' }, //
        'dola': {code: '84',currency: '' }
    }[window.childCode]
}
export default {
    'host': 'http://159.138.131.189', //新测试环境
    'loginVersion': 'v1.0.0',
    'baseUrl': '',
    'dowUrl': str || 'https://appdownload.011312.com/',
    'jackpotUrl': jackpotUrl,
    'customerServiceUrl': customerServiceUrl,
    'ws': 500,
    'hs': 500,
    'scales': 0.8,
    // 页面服务器
    'codeUrl': '',
    // 图片服务器
    'imgHost': '/file',
    'appVer': '1.0.0',
    'protocolVer': '1.0',
    'reqId': 0,
    'numVer': 'v2.0.1',
    // themeIndex: sessionStorage.getItem("theme") || 1,
    'themeIndex': 1,
    'clientIp': '101.231.217.194',
    'iosDownloadUrl': '',
    'androidDownloadUrl': '',
    'pcDownloadUrl': '',
    'pcMainUrl': '',
    'pcDomainImgUrl':'',
    'pcLogo': '', // pc端logo
    'phoneModel': '', //手机型号
    'fingerprint': '123', //设备唯一标识
    "captchaId": getCaptchaId(), // 获取极验4id
    'codePrefix': getConfing().code,//区号
    'currency': getConfing().currency,//货币
    themeImgUrl(imgName, fileType) {
        let locale = window.locale
        let M = fileType ? fileType : 'png';
        let skin = window.projectImgUrl
        return require('@/assets/image/locale/' + locale + '/' + skin +'/' + imgName + '.' + M);
    },
    getImgUrl(path) {
        if (process.env.NODE_ENV === 'development' && path !== '') {
            return '/img' + path;
        }
        if (path !== '') {
            let imgUrl = process.env.NODE_ENV !== 'production' ? this.imgHost : window.location.origin + '/file'
            return imgUrl + path;
        }
    },
    getLocaleImg(imgName,fileType){
        let locale = window.locale
        let M = fileType ? fileType : 'png';
        return require('@/assets/image/locale/' + locale + '/' + imgName + '.' + M);
    },
};