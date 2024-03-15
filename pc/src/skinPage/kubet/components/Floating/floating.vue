<template>
    <div>
        <!-- 新客服 -->
        <div class="fwDownload">
            <div class="icon serviceBg" @click="toNewCustomerService"></div>
        </div>
        <div class="fwDownload">
            <div class="icon tg" @click="jump('tg')"></div>
        </div>
        <div class="fwDownload" v-if="projectImgUrl != 'phattai68'">
            <div class="icon fb" @click="jump('fb')"></div>
        </div>
        <!-- <div class="fwDownload">
            <div class="icon phone" @click="jump('phone')"></div>
        </div> -->
        <!-- <div class="fwDownload">
            <div class="icon icon_rComputerHelp"></div>
        </div> -->
        <el-popover popper-class="appDown"
                    placement="left-start"
                    width="128"
                    trigger="hover">
            <div class="qrCode">
                <div class="qr iosQrCode">
                    <div id="qrcode3"
                         ref="qrcode3"
                         style="display: inline-flex;"></div>
                    <div class="qrText">{{$t('APP下载')}}</div>
                </div>
            </div>

            <div slot="reference"
                 class="fwDownload" >
                <div class="icon icon_rComplaint"></div>
            </div>
        </el-popover>
        <!-- 彩金 -->
        <div slot="reference" 
             class="fwDownload"
             @click="mosaicGold">
            <div class="icon mosaicGold1"
                 :class="{mosaicGold2:mosaicGoldImg == 2}" ></div>
        </div>
        <interestTreasure ref="refDiag"></interestTreasure>
    </div>
</template>

<script>
import QRCode from '@keeex/qrcodejs-kx'
import InterestTreasure from '@/components/InterestTreasure/InterestTreasure'
import { mapState } from 'vuex'
export default {
    components: {
        interestTreasure: InterestTreasure,
    },
    data() {
        return {
            customerList: [],
            sessData: '',
            serviceUrl: '',
            mosaicGoldImg: 1,
            getQxylSkin: '',
            showLibao: false, //是否显示利息宝
            showRedL: false, //利息宝红点
            window:window,
            rebateShow:false, // 是否展示全民返利
            rebateRemind:false, // 全民返利小红点
            projectImgUrl: window.projectImgUrl,
        }
    },
    created() {
        this.getList()
        // this.showLi()
        setTimeout(() => {
            this.codeList()
        }, 500)
        if (this.$store.state.token) {
            this.mosaicGoldPush()
            this.availableAmount();
        }
        this.getSettings();
        this.getQxylSkin =  window.projectImgUrl
    },
    watch: {
        '$store.state.mosaicGoldStatus'(n) {
            //彩金状态
            if (n) {
                this.mosaicGoldImg = n
            }
        },
    },
    computed:{
        ...mapState(['qxylRightShow'])
    },
    mounted(){
    },
    methods: {
        closeQxylRight(){
            this.$store.commit('setQxylChat',0)
        },
        rebateInfo(){
            if (this.$common.getUser()) {
                if(window.projectImgUrl == 'funw'){
                    _paq.push(["trackEvent","PC_rightFloatingWindow","PC_rightFloatingWindow",'PC右侧全民返利按钮']);
                }
                this.$store.commit("rebate", true);
            } else {
                this.$common.openLogin()
                // this.$message.warning($t("请登录"));
            }
        },
        // 全民返利
        getSettings() {
            this.$http.get(this.$api.getSettings, "allowance_on").then(res => {
                if (res.code === 0) {
                if (res.data.svalue) {
                    if (res.data.svalue.allowance_on === 0) {
                    this.rebateShow = false;
                    } else {
                    // this.list.push({ name: "全民返利",id:10 });
                    this.rebateShow = true;
                    
                    }
                } else {
                    this.rebateShow = false;
                }
                }
            });
        },
        // 全民返利领取金额是否满足要求，满足则给红点提示
        availableAmount() {
            let that = this;
            that.$http.post(that.$api.availableAmount).then((res) => {
                if (res.code === 0) {
                    if (res.data.allowance - 0 >= res.data.minCount - 0) {
                        that.rebateRemind = true;
                    } else {
                        that.rebateRemind = false;
                    }
                }
            });
        },
        jump(type) {
            if (type === 'app' || type == 'zalo') return
            let obj = {}
            if(type == 'yq') {
                if (!this.$common.getUser()) {
                    this.$common.openLogin()
                    return
                }
                this.$store.commit('rebate',true)
                return
            }
            if(this.projectImgUrl == 'phattai68'){
                obj = {
                    tg: 'https://t.me/cskhphattai1',
                }
            }
            window.open(obj[type])
        },
        //新客服
         toNewCustomerService() {
            const wnsrUrl = this.$cache.get('wnsrServerUrl')
            const win = window.open()
            win.location.href = wnsrUrl
            // if(window.projectImgUrl === 'funw'){
            //     _paq.push(["trackEvent","PC_rightFloatingWindow","PC_rightFloatingWindow",'PC右侧客服中心']);
            //     let wnsrUrl = this.$cache.get('wnsrServerUrl')
            //      window.open(wnsrUrl, "_blank");
            //      return 
            //      // 统计有问题暂时先注释避免影响线上功能
            // }
            // var obj = {};
            // obj.host = this.$common.getHost();
            // obj.clientCode = window.clientCode;
            // obj.clientItem = window.childCode;
            // obj.username = this.$common.getUser() && this.$common.getUser().username;
            // obj.language = 'vi';
            // obj.theme = window.theme;
            // obj.projectImgUrl = window.projectImgUrl;
            // obj.orgin = window.location.origin + "/activity";
            // var str = JSON.stringify(obj);
            // str = window.btoa(str);
            // let url = location.origin + "/func" + "/customerService/pc?s=" +str;
            // window.open(url, "_blank");
        },
        
        //彩金推送
        mosaicGoldPush() {
            this.$http.get(this.$api.getNotReceive).then((res) => {
                if (res.code === 0) {
                    if (res.data.notReceiveState) {
                        this.mosaicGoldImg = 2
                    } else {
                        this.mosaicGoldImg = 1
                    }
                }
            })
        },
        mosaicGold() {
            if (!this.$common.getUser()) {
                // this.$message({
                //     message: this.$t('请先登录'),
                //     type: 'warning',
                // })
                this.$common.openLogin()
                return
            }
            if(window.projectImgUrl == 'funw'){
				_paq.push(["trackEvent","PC_rightFloatingWindow","PC_rightFloatingWindow",'PC右侧彩金按钮']);
            }
            this.$store.commit('mosaicGoldShow', true)
        },
        getFloating() {
            this.$http.get(this.$api.getListFloatingWindows).then((res) => {
                if (res.code == 0) {
                    this.typeList = res.data.sort((item1, item2) => {
                        return item2.sort - item1.sort
                    })
                    setTimeout(() => {
                        this.loadDom()
                    }, 500)
                }
            })
        },
        //获取客服地址
        getList() {
            let params = '/' + window.clientCode
            this.$http.get(this.$api.clientCode, params, false).then((res) => {
                if (res.code == 0) {
                    this.serviceUrl = res.data.customerUrl
                    this.$common.setCustomerService(res.data.customerUrl)
                }
            })
        },
        //转换二维码
        codeList() {
            let that = this
            this.sessData = JSON.parse(sessionStorage.getItem('inviteCode'))
            // var qrCodeAddress = ''
            // if (this.sessData) {
            //     qrCodeAddress =
            //         this.$config.dowUrl +
            //         `${window.clientCode}${window.theme}` +
            //         '/' +
            //         this.sessData
            // } else {
            //     qrCodeAddress =
            //         this.$config.dowUrl + `${window.clientCode}${window.theme}`
            // }
            let url = window.location.origin + '/downloadUrl?'
            if(window.projectImgUrl === 'jramjs' || window.projectImgUrl === 'jrwnsr') {
                url += 'code=' + window.projectImgUrl
            } else {
                url += 'code=' + window.childCode
            }
            if(this.$config.iosDownloadUrl) {
              url += '&ios=' + encodeURIComponent(this.$config.iosDownloadUrl)
            }
            if(this.$config.androidDownloadUrl) {
              url += '&android=' + encodeURIComponent(this.$config.androidDownloadUrl)
            }
            if (this.sessData) {
              url += '&agentCode=' + this.sessData
            }
            // if(this.$config.pcDownloadUrl) {
            //   url += '&pc=' + encodeURIComponent(this.$config.pcDownloadUrl)
            // }
            if (this.$refs.qrcode3) {
                that.qrcode("qrcode3", url);
            }
        },
        qrcode(qrcodeId, qrcode) {
            new QRCode(qrcodeId, {
                width: 168, // 设置宽度，单位像素
                height: 168, // 设置高度，单位像素
                text: qrcode, // 设置二维码内容或跳转地址
            })
        },
        toCustomerService() {
            if(window.projectImgUrl == 'funw'){
				_paq.push(["trackEvent","PC_rightFloatingWindow","PC_rightFloatingWindow",'PC右侧在线客服']);
            }
            // window.open(this.serviceUrl, '_blank')
            let url = this.$common.getCustomerService();
            window.open(url, "_blank");
        },
        getImgUrl(icon) {
            return require('@/assets/image/dze/c' + icon + '.png')
        },
        openUrl(name) {
            if (!this.$common.getUser()) {
                // this.$message({
                //     message: this.$t('请先登录'),
                //     type: 'warning',
                // })
                this.$common.openLogin()
                return
            }
            if(window.projectImgUrl == 'funw' && name == 'recharge'){
				_paq.push([
				  "trackEvent",
				  "PC_recharge",
				  "PC_recharge",
				  'PC右侧充值按钮'
				]);
				_paq.push(["trackGoal", 1]);
            }
            //新窗口跳转
            const { href } = this.$router.resolve({
                name: name,
            })
            window.open(href, '_blank')
        },
        openpage(url) {
            this.$router.push({ path: url })
        },
        //打开利息宝
        onLixi() {
            this.$refs.refDiag.open()
        },
        //利息宝红点展示
        showRed() {
            this.$http.get(this.$api.existRunningStatus, '').then((res) => {
                if (res.code == 0) {
                    this.showRedL = res.data
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.qrCode {
    .iosQrCode {
        text-align: center;
    }
    .qrText {
        text-align: center;
    }
}
.Suspensionframe {
    padding: 0px;
    border: none;
    background: #000;
}
.serviceBox {
    border: 2px solid #e4c074;
    border-radius: 5px;
    background: #0a0a0a;
    .list {
        display: flex;
        align-items: center;
        padding: 20px;
    }
    .avater {
        width: 20px;
        height: 20px;
    }
    .serviceBtn {
        margin-left: 15px;
        color: #fff;
        .btnSpan {
            color: #e4c074;
        }
    }
}
.serviceBox:hover {
    .serviceBtn {
        color: #e4c074;
    }
}
.fwDownload {
    width: 80px;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    border-bottom: 1px solid rgba(255,255,255,0.3);
    &:hover{
        background-color: rgba($color: #fff, $alpha: .3);
    }
    .icon {
        width: 40px !important;
        height: 40px !important;
        background: url('~@/assets/image/qqImg/icon_indexImg.png') no-repeat !important;
    }
    .serviceBg {
        background-position: -2px -744px !important;
    }
    
    .viber {
        background-position: -201px -746px !important;
    }
    .tg {
        background-position: -251px -746px !important;
    }
    .fb {
        background-position: -202px -746px !important;
    }
    .phone {
        background-position: -51px -745px !important;
    }
    
    .icon_rComputerHelp {
        background-position: -101px -746px !important;
    }
    .icon_rComplaint {
        background-position: -151px -746px !important;
    }
    .mosaicGold1 {
        background-position: -301px -748px !important;
    }
}
#qrcode0{
    border: 5px solid #fff;
    border-radius: 10px;
    overflow: hidden;
}
</style>