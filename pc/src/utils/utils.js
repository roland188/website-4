import i18n from '../i18n/index'

export default {
    //根据参数更新过滤对象
    updateObj(main, obj, filter = false) {
        for (let key in obj) {
            if (!filter) main[key] = obj[key];
            else(main[key] != null) && (main[key] = obj[key]);
        }
        return main;
    },
    // 获取转换时间
    getTime(val) {
        if (val) {
            var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + "-";
            var M =
                (date.getMonth() + 1 < 10 ?
                    "0" + (date.getMonth() + 1) :
                    date.getMonth() + 1) + "-";
            var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var time = Y + M + D;
            return time;
        }
    },
    // 获取随机数指定区间
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
    },
    //隐藏字符串中间内容（*）
    hideMiddle(str) {
        if (!str) return null;
        let num1 = Math.ceil(str.length / 3);
        let num2 = Math.floor(str.length / 3);
        return str.substr(0, num2) + "*".repeat(num1) + str.substr(num1 + num2);
    },
    //判断手机号
    checkPhone(value) {
        return /^\d{10,11}$/.test(value);
    },
    //判断名字
    checkName(value) {
        return /^[\u4e00-\u9fa5]{2,6}$/.test(value);
    },
    //判断QQ
    checkQQ(value) {
        return /^[1-9][0-9]{4,12}$/.test(value);
    },
    checkWeChat(value) {
        //微信号校验(支持纯数字)
        return /^[a-zA-Z0-9][a-zA-Z0-9_-]{5,19}$/.test(value);
    },
    checkEmail(value) {
        // email校验
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
    },
    //密码校验
    isPassword(value) {
        return /^[a-zA-Z0-9]{6,15}$/.test(value);
    },
    bankNumber(value) {
        value.replace(/\D/g, "").replace(/....(?!$)/g, "$& ");
    },
     //格式化时间
     _formatDate (timeStamp, str = 'yyyy-MM-dd HH:mm:ss') {
        try {
            timeStamp = timeStamp * 1
        } catch {}
        const t = new Date(timeStamp)
        const obj = {
            yyyy: t.getFullYear(),
            yy: ('' + t.getFullYear()).slice(-2),
            M: t.getMonth() + 1,
            MM: ('0' + (t.getMonth() + 1)).slice(-2),
            d: t.getDate(),
            dd: ('0' + t.getDate()).slice(-2),
            H: t.getHours(),
            HH: ('0' + t.getHours()).slice(-2),
            h: t.getHours() % 12,
            hh: ('0' + t.getHours() % 12).slice(-2),
            m: t.getMinutes(),
            mm: ('0' + t.getMinutes()).slice(-2),
            s: t.getSeconds(),
            ss: ('0' + t.getSeconds()).slice(-2),
            w: [i18n.$t('日'), i18n.$t('一'), i18n.$t('二'), i18n.$t('三'), i18n.$t('四'), i18n.$t('五'), i18n.$t('六')][t.getDay()]
        }
        const reg = /([a-z])+/ig
        return str.replace(reg, a => obj[a])
    },
    //数字转换
    _toThousands(num) {
        var result = '', counter = 0;
        num = (num || 0).toString();
        for (var i = num.length - 1; i >= 0; i--) {
            counter++;
            result = num.charAt(i) + result;
            if (!(counter % 3) && i != 0) { result = ',' + result; }
        }
        return result;
    }
}