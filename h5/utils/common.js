import i18n from '@/i18n/index.js';
// import request from './api.js'
// import server from './server.js'
export default {
    update: function (that, item) {
        //更新第五步
        plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
            if (item.newVersion && item.apkUrl) {
                var downloadTask = uni.downloadFile({
                    url: item.apkUrl, //下载地址
                    success: (downloadResult) => {
                        downloadTask.offProgressUpdate();
                        if (downloadResult.statusCode === 200) {
                            plus.runtime.install(downloadResult.tempFilePath, {
                                force: false
                            }, () => {
                                plus.nativeUI.alert(i18n.$t('安装包安装完成！'), () => {
                                    plus.runtime.restart();
                                });
                            }, (e) => {
                                plus.nativeUI.alert(i18n.$t('下载安装包失败!') + '[' + e.code + ']：' + e.message);
                            });
                        } else {
                            that.$store.commit('update', i18n.$t('下载安装包失败!'))
                        }
                    },
                    fail: (res) => {
                        downloadTask.offProgressUpdate();
                    }
                });
            }
            if (downloadTask) {
                //正在更新,触发update改为1是为了操作当前UI反馈,避免点击立即更新后,网络慢导致页面没有反馈
                that.$store.commit('update', 1)
                downloadTask.onProgressUpdate((res) => {
                    //res.progress为当前更新进度,因为再点击的时候已经为1,在大于等同于2的时候再取改变当前更新进度
                    if (res.progress >= 2) {
                        that.$store.commit('update', res.progress)
                    }
                })
            }
        });
    },
    // 域名处理
    setHostName: function () {
        var u = window.location.hostname;
        var a = u.split(".");
        if (a.length > 2) a = a.slice(a.length - 2);
        var s = 'http://' + a.join(".");
        let sessData = JSON.parse(sessionStorage.getItem('inviteCode'));
        var arrNew = ''
        if (sessData) {
            arrNew = s + '?code=' + sessData
        } else {
            arrNew = s
        }
        return arrNew
    },
    // 位数截取
    setNumFixed: function (num, i) {
        let newNum = num * 1;
        let getNum = ''
        let tempVal = parseFloat(newNum).toFixed(i + 1)
        getNum = tempVal.substring(0, tempVal.length - 1);
        return getNum
    },
    // 时间戳转时间
    conversionTime: function (timeStamp) {
        if (timeStamp > 0) {
            var date = new Date();
            date.setTime(timeStamp);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? '0' + d : d;
            var h = date.getHours();
            h = h < 10 ? '0' + h : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        } else {
            return '';
        }
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
    isToday: function (oldStr, nowStr) {
        if (new Date(oldStr * 1).toDateString() === new Date(nowStr * 1).toDateString()) {
            return true
        } else {
            return false
        }
    },
    // vnd金额转换
    setNumVnd: function (num, i) {
        let newNum = num * i;
        let formattedNumber = newNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return formattedNumber
    },
}