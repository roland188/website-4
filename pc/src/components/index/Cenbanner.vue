<template>
    <!-- <div class="CenbannerIndex"> -->
    <div class="Cenbanner index" :style="{ background: `url(${bgImg}) 0 40px no-repeat` }">
        <div class="first-mobile-content">
            <div class="mobile-content-text">{{ title }} {{ $t(`手机APP，随时随地，极致畅享！在这里，有全网最丰富的电子、棋牌、捕鱼、真人、体育、电竞、彩票游戏，行业最全游戏娱乐APP，人性化操作设计，极速存款、取款、优惠领取，财富尽在掌握！`) }}</div>
            <div class="qrcode-box">
                <div class="el-qrcode-wrap" id="el_qrcode_wrap">
                    <div class="img-qrcode-bg1 clearfix">
                        <div id="qrcode1" class="blury-qrcode1" ref="qrcode1"></div>
                    </div>
                </div>
                <div class="first-row-text1">{{ $t('扫码下载APP') }}</div>
                <div>{{ $t('支持iOS & Android 全部移动设备') }}</div>
                <p class="third-row-text"><!--常用連結: 文字型態-->{{ $config.dowUrl[0].apkUrl }}</p>
            </div>
            <div class="mobile-bottom-right">
                <div class="first-row-text">{{ $t('无需下载直接访问') }}</div>
                <div>{{ $t('无需下载，手机输入网址即可访问') }}</div>
                <p class="third-row-text"><!--常用連結: 文字型態-->{{ openUrl }}</p>
            </div>
        </div>
    </div>
    <!-- </div> -->
</template>

<script>
import QRCode from '@keeex/qrcodejs-kx';
import i18n from '@/i18n'
export default {
    'components': { QRCode },
    data() {
        return {
            'openUrl': '',
            'sessData': '',
            'title': ''
        };
    },
    created() {
        setTimeout(() => {
            this.codeList()
        }, 1000)
    },
    computed: {
        bgImg() {
            let bgimg = this.$config.getLocaleImg('container_mobile_img')
            return bgimg
        }
    },
    methods: {
        codeList() {
            var u = window.location.hostname;
            var a = u.split('.');
            if (a.length > 2) {
                a = a.slice(a.length - 2);
            }
            var s = 'http://m.' + a.join('.');
            this.sessData = JSON.parse(sessionStorage.getItem('inviteCode'));
            var arrNew = '';
            if (this.sessData) {
                arrNew = s + '?code=' + this.sessData;
            } else {
                arrNew = s;
            }
            this.openUrl = arrNew;

            let url = window.location.origin + '/downloadUrl?'
            url += 'code=' + window.childCode
            if (this.$config.iosDownloadUrl) {
                url += '&ios=' + encodeURIComponent(this.$config.iosDownloadUrl)
            }
            if (this.$config.androidDownloadUrl) {
                url += '&android=' + encodeURIComponent(this.$config.androidDownloadUrl)
            }
            // if(this.$config.pcDownloadUrl) {
            //   url += '&pc=' + encodeURIComponent(this.$config.pcDownloadUrl)
            // }
            new QRCode(qrcode1, {
                width: 168, // 设置宽度，单位像素
                height: 168, // 设置高度，单位像素
                text: url // 设置二维码内容或跳转地址
            });
            this.title = window.projectName;
        }
    }
};
</script>
<style scoped>
.Cenbanner {
    margin: 0 auto 42px;
    padding-top: 40px;
    width: 1200px;
    height: 523px;
}

.Cenbanner .first-mobile-content {
    float: right;
    padding-top: 160px;
    width: 520px;
    background: url('../../assets/image/gameImg/index/container_img03.png') 50% 40px no-repeat;
}

.Cenbanner .mobile-content-text {
    margin-bottom: 34px;
    color: #c8c8c8;
    font-size: 14px;
    line-height: 30px;
}

.qrcode-box,
.mobile-bottom-right {
    float: left;
    margin-left: 3px;
    color: #969696;
    font-size: 14px;
    line-height: 33px;
    text-align: center;
}

.el-qrcode-wrap {
    display: inline-block;
    background: inherit;
}

.img-qrcode-bg1 {
    width: 168px;
    height: 168px;
    border: 10px solid #fff;
}

.img-qrcode-bg1 img {
    width: 100%;
    height: 100%;
    border: 0;
    outline: none;
}

.first-row-text1 {
    color: #fff;
    font-size: 18px;
    line-height: 18px;
}

.first-row-text {
    color: #fff;
    font-size: 18px;
    line-height: 18px;
}

.qrcode-box .third-row-text {
    display: inline-block;
    margin: 0 auto;
    width: 204px;
    word-wrap: break-word;
}

.third-row-text {
    color: #e9c885;
    line-height: 20px;
    overflow: hidden;
    width: 204px;
    word-wrap: break-word;
    display: inline-block;
}

.mobile-bottom-right {
    margin-left: 77px;
    padding-top: 136px;
    background: url('../../assets/image/gameImg/index/html5_img.png') 50% 0 no-repeat;
}</style>

