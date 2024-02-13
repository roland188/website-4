<template>
    <div class>
        <div class="headerBg oneBg">
            <div class="my-container">
                <div class="full">
                    <span>{{ $t('会员中心') }}</span>
                    <span class="gohome" @click="goHome">{{ $t('网站首页') }}</span>
                </div>
                <!-- <div class="time">{{ times }}</div> -->
                <span class="time">{{date}} {{time}}</span>
                <div class="service" @click="openServiceUrl">{{ $t('技术支持服务') }}</div>
            </div>
        </div>
        <div class="headerBg">
            <div class="my-container">
                <div class="titleImg">
                    <el-image
                        :src="$common.getTitleImgUrl('Logo')"
                        fit="fit"
                        class="logo-img"
                        @click="goHome"
                    ></el-image>
                </div>

                <div>
                    <span class="title">{{ $t('用户名') }}：</span>
                    <span class="name">{{ userName }}</span>
                    <img loading="lazy"
                        class="vipImg"
                        @click="openVip()"
                        v-lazy="
                            require('../../../assets/image/xfImg/' +
                                vipImg +
                                '.png')
                        "
                        alt=""
                    />
                </div>
                <div class>
                    <span class="title">{{ $t('余额') }}：</span>
                    <span class="money"
                        >{{ $common.setNumFixed(userMoney, 2) }}</span
                    >
                    <img loading="lazy"
                        class="refimg"
                        :class="{ refresReturnAnimation: Balancebtn }"
                        v-lazy="require('../../../assets/image/qqImg/refresh.png')"
                        @click="getUserBalance('refresh')"
                    />
                </div>
                <div class="return-water-box">
                    <span class="line">|</span>
                    <span class="title">{{ $t('累计返水') }}：</span>
                    <span class="money"
                        >{{ $common.setNumFixed(returnWaterMoney, 2) }}</span
                    >
                    <img loading="lazy"
                        :class="{
                            refresReturnAnimation: haveRefreshReturnAnimation,
                        }"
                        v-lazy="require('../../../assets/image/qqImg/refresh.png')"
                        @click="getReturnWater('refresh')"
                        alt
                    />
                    <span
                        class="getBtn"
                        :class="
                            !disabledGetReturnWater
                                ? 'u-btn-undisabled cursorPoint'
                                : 'u-btn-disabled'
                        "
                        @click="returnWaterGet"
                        >{{ $t('领取') }}</span
                    >
                </div>
            </div>
        </div>
        <div class="tabsBox">
            <div class="my-container">
                <div
                    class="item"
                    v-for="(item, i) of tabs"
                    :key="i"
                    :class="{ actitvy: sureUrl === item.url }"
                    @click="openUrl(item.url, i)"
                >
                    {{ item.name }}
                </div>
            </div>
        </div>
        <el-tabs
            @tab-click="handleClick"
            class="activeName"
            v-model="tabName"
            v-show="sureUrl === tabs[0].url || sureUrl === tabs[6].url"
        >
            <el-tab-pane
                v-for="(item, index) in tabList"
                :key="index"
                :label="item.label"
                :name="'name' + index"
            ></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import utils from '@/utils/utils.js'
export default {
    data() {
        return {
            img1: require("../../../assets/image/dze/site_bwin437_ver2.png"),
            tabList: [],
            tabName: "name0",
            //我的账户
            tabList1: [
                {
                    label: this.$t('个人资料'),
                },
                {
                    label: this.$t('安全中心'),
                },
            ],
            //来往记录
            tabList2: [
                {
                    label: this.$t('投注记录'),
                },
                {
                    label: this.$t('充值记录'),
                },
                {
                    label: this.$t('银行转账'),
                },
                {
                    label: this.$t('提款记录'),
                },
                {
                    label: this.$t('其它'),
                },
                {
                    label: this.$t('利息宝记录'),
                },
            ],
            index: 0,
            activeName: "personalData",
            sureUrl: "",
            userName: "",
            userMoney: 0.0,
            label: "",
            timeInterval: "",
            haveRefreshReturnAnimation: false,
            returnWaterMoney: 0.0,
            disabledGetReturnWater: true, //默认不可以领取返水
            userId: "",
            vipImg: "normal_user",
            userName: "",
            Balancebtn: false,
            // 北京时间
            zone: 'UTC+8',
            date: '',
            time: '',
            interval: 0,
            refreshBalanceFlag: true, //不可重复刷新余额
        };
    },
    computed: {
        tabs() {
            const tabsArr = [
                { name: this.$t('我的账户'), url: "/mcenter/myAccount" },
                { name: this.$t('返水记录'), url: "/mcenter/returnWater" },
                { name: this.$t('返水详情'), url: "/mcenter/returnWaterDetail" },
                { name: this.$t('线上存款'), url: "/mcenter/recharge" },
                { name: this.$t('线上取款'), url: "/mcenter/drawing" },
                { name: this.$t('收款方式管理'), url: "/mcenter/bank" },
                { name: this.$t('来往记录'), url: "/mcenter/correspondence" },
                { name: this.$t('信息公告'), url: "/mcenter/news" },
                { name: this.$t('自助优惠'), url: "/mcenter/discount" },
            ]
            console.log("tabsArr====",tabsArr)
            return tabsArr
        }
    },
    created() {
        this.userId = this.$common.getUser() && this.$common.getUser().user_id;
        this.userName =
            this.$common.getUser() && this.$common.getUser().username;
        this.sureUrl = window.location.pathname;
        if (this.sureUrl === this.tabs[0].url) {
            this.tabList = this.tabList1;
        } else {
            let interest = localStorage.getItem("interest");
            if (interest == 5) {
                this.tabName = "name5";
            }
            this.tabList = this.tabList2;
        }
        // this.timeInterval = setInterval(() => {
        //     var d = new Date();
        //     let year = d.getFullYear(); //获取年
        //     let month = d.getMonth() + 1; //获取月
        //     let day = d.getDate(); //获取当日
        //     let hh = d.getHours(); //获取小时
        //     let mm = d.getMinutes(); //获取分钟
        //     let ss = d.getSeconds(); //获取秒
        //     this.times =
        //         year + "." + month + "." + day + " " + hh + ":" + mm + ":" + ss;
        // }, 1000);

        //获取返水+余额
        if(this.$common.getToken()){
            this.getReturnWater();
            this.getUserBalance();
            this.logins();
        }
    },
    beforeDestroy() {
        if (this.interval) clearInterval(this.interval)
    },
    mounted() {
        // this.tabList = this.tabList1;
        // this.$router.push('/mcenter/myAccount');
        this.getTime()
        let interest = localStorage.getItem("interest");
        if (interest == 5) {
            this.$emit("trigger",  this.$t('利息宝记录'));
        } else {
            this.$emit("trigger", this.$t('投注记录'));
        }
    },
    methods: {
        getTime () {
            this.interval = setInterval(() => {
                var bjTime = this.getBjTime();
                this.date = utils._formatDate(bjTime, 'yyyy-MM-dd')
                this.time = utils._formatDate(bjTime, 'HH:mm:ss')
            }, 500)
        },
        getBjTime() {
            //获得当前运行环境时间
            var d = new Date(), currentDate = new Date(), tmpHours = currentDate.getHours();
            //算得时区
            var time_zone = -d.getTimezoneOffset() / 60;
            //少于0的是西区 西区应该用时区绝对值加京八区 重新设置时间（西区时间比东区时间早 所以加时区间隔）
            if (time_zone < 0) {
                time_zone = Math.abs(time_zone) + 7; currentDate.setHours(tmpHours + time_zone);
            } else {
                //大于0的是东区  东区时间直接跟京八区相减
                time_zone -= 7; currentDate.setHours(tmpHours - time_zone);
            }
            return currentDate;
        },
        openVip() {
            this.$router.push({ path: '/vipLevel' })
            // if (['amwnsr','wbgj','xpjgj','amxpj','funw','bqty'].includes(window.projectImgUrl)) {
            //     this.$router.push({ path: '/vipLevel' });
            // } else {
            //     this.$emit("openVip");
            // }
        },
        async logins() {
            let that = this;
            that.userName = that.$common.getUser().username;
            let data = "/" + that.$common.getUser().user_id;
            const res = await that.$http.get(that.$api.members, data);
            if (res.code == 0) {
                that.getVipData(res.data.levelId);
            }
        },
        async getVipData(levelId) {
            let that = this;
            let res = await that.$http.get(that.$api.getvipdata, levelId);
            if (res.code == 0) {
                if (res.data.gradeId === 1) {
                    that.vipImg = "normal_user";
                } else {
                    that.vipImg = res.data.gradeName;
                }
            }
        },
        async getUserBalance() {
            var _this = this;
            //刷新页面
            let data = {
                clientId: this.$common.getUser().tenant_id, //tenant_id
                clientIp: this.$config.clientIp,
                memberId: this.$common.getUser().user_id, //userid
                username: this.$common.getUser().username,
            };
            this.Balancebtn = true;
            
            //手动刷新余额
            if (this.refreshBalanceFlag) {
                var res = await _this.$http.post(_this.$api.getuserMoney, data);
                this.Balancebtn = false;
                if (res.code == 0) {
                    this.refreshBalanceFlag = false;
                    //结束刷新动画
                    this.userMoney =
                        typeof res.data.totalBalance != "undefined"
                            ? res.data.totalBalance
                            : "--/--";
                    //余额存本地
                    this.$common.setUserBalance(res.data);
                    //提示用户,余额请求成功
                    this.$message.success(this.$t("刷新余额成功"));
                } else {
                    //连续刷新不能报错
                    if (res.code != 10041) {
                        this.$message.error(res.msg);
                    }
                }
                setTimeout(() => {
                    //10s后，才可以再次刷新
                    this.refreshBalanceFlag = true;
                }, 10000);
            } else {
                //不可重复请求
                this.refreshBalanceFlag = false;
                this.Balancebtn = false;
                this.$http.showMesasge(this.$t("点击间隔10s，请勿重复操作!"));
            }
        },
        returnWaterGet() {
            //返水领取
            if (this.disabledGetReturnWater) {
                //禁用
                this.$http.showMesasge(this.$t('返水额度低于满足条件，无法领取')+"！");
                return;
            }
            this.$emit("openReturnWater");
        },
        async getReturnWater(type) {
            //返水接口
            var _this = this;
            //手动刷新
            this.haveRefreshReturnAnimation = true;
            if (type == "refresh") {
                var data = "?memberId=" + this.userId;
                var res = await this.$http.get(
                    _this.$api.getReturnWaterMoney,
                    data,
                    true
                );
                this.haveRefreshReturnAnimation = false;
                if (res.code == 0) {
                    //返水金额
                    if (res.data) {
                        //有返回值
                        if (res.data.rebateAmount * 1 > 0) {
                            this.returnWaterMoney = this.$common.setNumFixed(
                                res.data.rebateAmount,
                                2
                            );
                        } else {
                            this.returnWaterMoney = "0.00";
                        }

                        this.rebateDown = res.data.rebateDown;
                        if (
                            Number(this.returnWaterMoney) <
                            Number(this.rebateDown)
                        ) {
                            //待领取返水<最低返水金额
                            this.disabledGetReturnWater = true;
                        } else {
                            this.disabledGetReturnWater = false;
                        }
                        if (this.returnWaterMoney * 1 <= 0) {
                            this.disabledGetReturnWater = true;
                        }
                        //提示用户
                        this.$message.success(this.$t('返水刷新成功')+"！");
                    } else {
                        //无返回值res.data = null
                        this.disabledGetReturnWater = true;
                        this.$message.success(this.$t('返水刷新成功')+"！");
                    }
                } else {
                    this.$message.error(res.msg);
                }
            } else {
                var data = "?memberId=" + this.userId;
                var res = await this.$http.get(
                    _this.$api.getReturnWaterMoney,
                    data
                );
                //页面刷新
                this.haveRefreshReturnAnimation = false;
                if (res.code == 0) {
                    if (res.data) {
                        //有返回值
                        if (res.data.rebateAmount * 1 > 0) {
                            this.returnWaterMoney = this.$common.setNumFixed(
                                res.data.rebateAmount,
                                2
                            );
                        } else {
                            this.returnWaterMoney = "0.00";
                        }
                        this.rebateDown = res.data.rebateDown
                            ? res.data.rebateDown
                            : 0;
                        if (this.returnWaterMoney * 1 < this.rebateDown * 1) {
                            //待领取返水<最低返水金额
                            this.disabledGetReturnWater = true;
                        } else {
                            this.disabledGetReturnWater = false;
                        }
                        if (this.returnWaterMoney * 1 <= 0) {
                            this.disabledGetReturnWater = true;
                        }
                        //提示用户
                        this.haveRefreshReturnAnimation = false;
                        // this.$message.success('返水刷新成功！')
                    } else {
                        //无返回值res.data = null
                        this.disabledGetReturnWater = true;
                    }
                    //提示用户
                } else {
                    this.disabledGetReturnWater = true;
                    this.$message.error(res.msg);
                }
            }
        },
        handleClick(tab) {
            this.label = tab.label;
            this.$emit("trigger", this.label);
            switch (tab.label) {
                case  this.$t('个人资料'):
                    this.tabName = "name0";
                    this.$router.push("/mcenter/myAccount");
                    break;
                case  this.$t('安全中心'):
                    this.tabName = "name1";
                    this.$router.push("/mcenter/securityCenter");
                    break;
            }
        },
        openUrl(e, i) {
            this.index = i;
            this.tabName = "name" + this.index;
            if(e === '/mcenter/recharge' && window.projectImgUrl == 'funw'){
                _paq.push([
                    "trackEvent",
                    "PC_btn",
                    "PC_btn",
                    'PC个人中心充值按钮'
                ]);
                _paq.push(["trackGoal", 1]);
            }
            switch (this.index) {
                case 0:
                    this.tabList = this.tabList1;
                    break;
                case 6:
                    this.tabName = "name0";
                    this.tabList = this.tabList2;
                    //点击大tab初始化当前tab的第一页数据
                    break;
            }

            if (e != "") {
                this.sureUrl = e;
                this.$router.push(e);
            }
            this.$nextTick(() => {
                this.$emit("trigger", this.$t('投注记录'));
            });
            //新窗口跳转
            // const { href } = this.$router.resolve({
            //     name: "mcenter",
            // });
            // window.open(href, '_blank',"toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=400, height=400");
        },
        openServiceUrl() {
            if (['vi'].includes(window.locale)) { // betcome直接跳客服窗口
                const url = this.$common.getCustomerService();
                window.open(url, "_blank");
                return;
            }
            if(window.customerServiceStatus == 1){
                var obj = {};
            obj.host = this.$common.getHost();
            obj.clientCode = window.clientCode;
            obj.clientItem = window.childCode;
            obj.username = this.$common.getUser() && this.$common.getUser().username;
            obj.language = this.$i18n.locale;
            obj.theme = window.theme;
            obj.projectImgUrl = window.projectImgUrl;
            obj.orgin = window.location.origin + "/activity";
            var str = JSON.stringify(obj);
            str = window.btoa(str);
            let url = location.origin + "/func" + "/customerService/pc?s=" +str;
            window.open(url, "_blank");
            }else{
                let url = this.$common.getCustomerService();
            window.open(url, "_blank");
            }
            
        },
        goHome() {
            const { href } = this.$router.resolve({
                name: "Home",
            });
            window.open(href, "_self");
        },
    },
};
</script>
<style>
.activeName .el-tabs__header {
    padding-left: 25%;
    padding-right: 25%;
    display: flex;
    justify-content: center;
    margin: 0;
    box-shadow: inset 0px 20px 5px -20px #000;
}
.activeName .el-tabs__item {
    font-size: 16px;
    color: #7e7e7e;
}
.activeName .el-tabs__item:hover {
    color: #fff;
}
.activeName .is-active {
    color: #fff !important;
}
.activeName .el-tabs__nav-wrap::after {
    background-color: transparent;
}
.activeName .el-tab-pane {
    background-color: #f5f5f5;
    padding: 10px 25%;
}
</style>
<style lang="scss" scoped>
.my-container {
    width: 1180px;
    margin: 0 auto;
    .vipImg{
        vertical-align: middle;
        width: 55px;
        height: 22px;
        margin: auto 5px;
    }
}
.full {
    color: #fff;
    flex-grow: 2;
    .gohome {
        cursor: pointer;
        margin-left: 40px;
        color: #54b9ff;
    }
}
.time {
    color: #fff;
    margin-right: 70px;
}
.service {
    color: $headr-Color;
    cursor: pointer;
}
.oneBg {
    background: $headr-bgColor !important;
}
.activeName {
    background-color: #292829;
}
.activeName .el-tabs__header {
    margin: 0;
}
.padding {
    padding-left: 21%;
    padding-right: 25%;
}
.headerBg {
    color: $headr-Color;
    background: $headr-bgColor1;
}
.headerBg .my-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 50px;
    .titleImg {
        flex-grow: 2;
        vertical-align: middle;
        display: flex;
        padding: 0.1rem 0;
    }
    .logo-img {
        width: 200px;
        display: flex;
        align-items: center;
    }
    .title {
        color: $headr-Color;
        font-size: 14px;
    }
    .name {
        color: #54b9ff;
        font-size: 16px;
    }
    .money {
        color: #54b9ff;
        font-size: 16px;
    }
    .refimg {
        width: 20px;
        height: 20px;
    }
    .return-water-box {
        margin-left: 20px;
        display: flex;
        align-items: center;
        .line {
            color: $headr-Color;
            padding-right: 10px;
            font-size: 18px;
        }
        img {
            width: 20px;
            height: 20px;
        }
        .getBtn {
            display: inline-block;
            width: 60px;
            height: 30px;
            border-radius: 15px;
            line-height: 30px;
            text-align: center;
            margin-left: 20px;
            background-color: $header-btnColor;
            color: $headr-Color;
            font-size: 14px;
        }
        .u-btn-undisabled {
            opacity: 1;
        }
        .u-btn-disabled {
            opacity: 0.5;
        }
        
    }
}

.tabsBox {
    background-color: $nav-bgColor;
}
.tabsBox .my-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    font-size: 20px;
    line-height: 44px;
    .item:hover {
        color:  $header-activeColor;
    }
    .actitvy {
        color:  $header-activeColor;
    }
}

.refresReturnAnimation {
    animation: refresh 0.5s infinite linear;
    -moz-animation: refresh 0.5s infinite linear;
    -webkit-animation: refresh 0.5s infinite linear;
    -o-animation: refreshing 0.5s infinite linear;
}
@keyframes refresh {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@-moz-keyframes refresh {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@-webkit-keyframes refresh {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@-o-keyframes refresh {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
