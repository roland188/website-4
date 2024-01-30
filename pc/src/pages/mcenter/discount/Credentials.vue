<template>
    <div class="Credentials">
        <div class="header">
            <div class="title tipColor">{{ infoHtml.name }}</div>
            <div class="right" @click="onBack">
                <div class="tips">
                    {{ $t('点击关闭即可返回自助大厅') }}
                    <i class="el-icon-caret-right"></i>
                </div>
                <img loading="lazy"
                    v-lazy="require('../../../assets/images/dze/close.png')"
                    class="closeimg"
                />
            </div>
        </div>

        <div class="card">
            <p class="title fullColor">{{ $t("信息认证红利") }}</p>
            <div class="flexbox borderB" v-if="listData.length > 0">
                <!-- <swiper class="swiper" :options="swiperOption">
                    <swiper-slide v-for="(item, i) of listData" :key="i">
                        <div class="one">
                            <img loading="lazy"
                                v-lazy="require('../../../assets/images/dze/succes.png')"
                                class="img"
                                v-if="item.flag"
                            />
                            <img loading="lazy"
                                v-lazy="require('../../../assets/images/dze/tips.png')"
                                class="img"
                                v-if="!item.flag"
                                alt=""
                            />
                            <p class="textcolor" :class="{ flagF: !item.flag }">
                                {{ item | codeName(that) }}
                            </p>
                        </div>
                    </swiper-slide> -->
                <!-- <div class="swiper-scrollbar" slot="scrollbar"></div> -->
                <!-- </swiper> -->
                <div class="left">
                    <div class="one" v-for="(item, i) of listData" :key="i">
                        <img loading="lazy"
                            v-lazy="require('../../../assets/images/dze/succes.png')"
                            class="img"
                            v-if="item.flag"
                        />
                        <img loading="lazy"
                            v-lazy="require('../../../assets/images/dze/tips.png')"
                            class="img"
                            v-if="!item.flag"
                            alt=""
                        />
                        <p class="textcolor" :class="{ flagF: !item.flag }">
                            {{ item | codeName(that) }}
                        </p>
                    </div>
                </div>

                <div class="right">
                    <p class="money">{{ amount }}</p>
                    <p class="textcolor">{{ $t("认证红利（元）") }}</p>
                </div>
            </div>
            <div class="flexbox space-between">
                <p style="width: 80%;">
                    <span class="tipColor">{{ $t("提示：") }}</span>
                    <span class="textcolor">
                        {{ $t("用户需完成上述所有认证并审核通过后，才能够领取此红利") }}
                    </span>
                    <span class="text" @click="goPage">
                        {{ $t("[完善认证]") }}
                    </span>
                </p>
                <el-button
                    class="btnclear"
                    @click="onRievle"
                    :class="{ btnred: btnShow }"
                >
                    {{ btnText }}
                </el-button>
            </div>
        </div>

        <div class="tipbox">
            <p class="tipColor">
                {{ $t("温馨提示：") }}
            </p>
            <p class="fullColor">
                {{ $t("1. 用户必须完成通过所有认证以及历史累计存款不小于") }}
                <span class="">{{ datainfo.deposit }}</span>
                {{ $t("元后，才达到申领条件！") }}
            </p>
            <p class="fullColor">{{ $t("2. 每个账户只允许申领一次信息认证红利。") }}</p>
            <p class="fullColor">
                {{ $t("3. 如您对此还有疑问，可点击查看") }}
                <span class="remk" @click="openDetail">
                    {{ $t("认证红利") }}
                </span>
                {{ $t("规则。") }}
            </p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        dd: {
        type: Object,
        default: () => ({}),
        },
    },
    filters: {
        codeName(value, that) {
            let str = "";
            switch (value.conditionCode) {
                case "realName":
                    str = that.$t('姓名');
                    break;
                case "email":
                    str = that.$t('绑定邮箱');
                    break;
                case "phone":
                    str = that.$t('绑定手机号');
                    break;
                case "qq":
                    str = that.$t('绑定QQ号');
                    break;
                case "safePassword":
                    str = that.$t('安全密码验证');
                    break;
                case "bank":
                    str = that.$t('银行卡验证');
                    break;
                case "digitalCurrency":
                    str = that.$t('绑定数字货币');
                    break;
                case "origin":
                    str = that.$t('绑定钱包');
                    break;
                case "deposit":
                    str =
                        that.$t('历史累计存款') + that.datainfo.deposit + that.$t('元');
                    break;
            }
            return str;
        },
    },
    data() {
        return {
            id: "",
            datainfo: {},
            amount: 0,
            btnText: this.$t('未达到领取要求'),
            listData: [],
            infoHtml: {},
            that: this,
            swiperOption: {
                slidesPerView: 6,
                spaceBetween: 30,
                freeMode: true,
            },
            btnShow: false,
        };
    },
    computed: {
        // language() {
        //     return this.$t("credentials");
        // },
    },
    created() {
        this.id = this.dd.id;
        this.getData();
    },
    methods: {
        getData() {
            this.$http
                .get(this.$api.getThematicActivitiesByApp + "/" + this.id)
                .then((res) => {
                    if (res.code == 0) {
                        this.infoHtml = res.data;
                        this.datainfo = res.data.infoAuthVO;
                        this.amount = this.datainfo.amount;
                        this.listData = this.datainfo.list.sort((a, b) => a - b)
                        if (this.datainfo.status == 0) {
                            this.btnText = this.$t("未达到领取要求");
                            this.btnShow = false;
                        } else if (this.datainfo.status == 1) {
                            this.btnText = this.$t("领取");
                            this.btnShow = true;
                        } else {
                            this.btnText = this.$t("已领取");
                            this.btnShow = false;
                        }
                    }
                });
        },
        onRievle() {
            if (!this.datainfo.flag) {
                return;
            }
            this.$http.put(this.$api.getReceiveActivities + this.id).then((res) => {
                if (res.code == 0) {
                    this.$message.success(this.$t("领取成功"));
                    this.getData();
                    this.getUserBalance();
                } else {
                    this.$message.error(res.msg)
                }
            });
        },
        async getUserBalance() {
            var _this = this;
            let data = {
                clientId: this.$common.getUser().tenant_id, //tenant_id
                clientIp: this.$config.clientIp,
                memberId: this.$common.getUser().user_id, //userid
                username: this.$common.getUser().username,
            };
            var res = await _this.$http.post(_this.$api.getuserMoney, data);
            if (res.code == 0) {
                //余额存本地
                this.$common.setUserBalance(res.data);
            } else {
            }
        },
        goPage() {
            const paths = []
            this.listData.forEach((element) => {
                if (!element.flag) {
                    switch (element.conditionCode) {
                        case "realName":
                            paths.push('/my/info/account')
                            break;
                        case "email":
                            paths.push('/my/info/account')
                            break;
                        case "phone":
                            paths.push('/my/info/account')
                            break;
                        case "qq":
                            paths.push('/my/info/account')
                            break;
                        case "safePassword":
                            paths.push('/my/security/verification')
                            break;
                        case "bank":
                            paths.push('/my/info/bankCard')
                            break;
                        case "digitalCurrency":
                            paths.push('/my/info/bankCard')
                            break;
                        case "origin":
                            paths.push('/my/info/bankCard')
                            break;
                        case "deposit":
                            paths.push('/my/finance/deposit')
                            break;
                        default:
                            break;
                    }
                }
            });
            if (paths.length) {
                this.$router.push(paths[0])
            }
        },
        openDetail() {
            this.$router.push({
                path: "/discount",
                query: {
                    flag: true,
                    name: this.infoHtml.name,
                    startTime: this.infoHtml.startTime,
                    endTime: this.infoHtml.endTime,
                    forever: this.infoHtml.forever,
                },
            });
            localStorage.setItem("disIntro", this.infoHtml.intro);
        },
        onBack() {
            // this.$router.go(-1);
            this.$router.push({
                path: '/mcenter/discount'
            })
        },
    },
};
</script>
<style lang="scss" scope >
.swiper {
}
.swiper-container {
    margin-left: 0;
}
.Credentials {
    .header {
        // padding: 10px 0;
        margin: 20px 0;
        .title {
            font-size: 14px;
            border-bottom: 2px solid #e91919;
            padding: 0px 60px 20px 60px;
        }
        .right {
            cursor: pointer;
        }
        .tips {
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            color: #999;
            font-size: 12px;
            padding: 5px 10px;
            display: inline-block;
            margin-right: 10px;
        }
        border-bottom: 1px solid #e8e8e8;
    }
    .closeimg {
        width: 31px;
        height: 31px;
    }
    .card {
        border-radius: 4px;
        border: 1px solid #dcdcdc;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        padding: 12px 12px 0px 12px;
        margin-bottom: 58px;
        .title {
            font-size: 14px;
        }
        .flexbox {
            display: flex;
            align-items: center;
            padding: 15px 0;
            .item {
                text-align: center;
                padding: 0 30px;
                line-height: 2;
                margin-right: 60px;
            }
            .left {
                flex-grow: 2;
                display: flex;
                flex-wrap: wrap;
            }
            .one {
                text-align: center;
                line-height: 2;
                min-width: 130px;
                margin-top: 10px;
                margin-bottom: 10px;
            }
            .right {
                text-align: center;
                line-height: 2;
                border-left: 1px solid #dcdcdc;
                padding-left: 44px;
                flex-shrink: 0;
                .money {
                    font-weight: bold;
                    color: #e91919;
                    font-size: 15px;
                }
            }
            .img {
                width: 24px;
                height: 24px;
            }
            .text {
                color: #2ba8ff;
                cursor: pointer;
            }
            .btnclear {
                font-size: 12px;
                width: auto;
                border: none;
                border: 1px solid #e6e6e6;
                background: #f5f5f5;
                color: #909090;
            }
            .btnred {
                background: #e91919;
                color: #fff;
            }
        }
        .borderB {
            border-bottom: 1px solid #e8e8e8;
        }
        .space-between {
            justify-content: space-between;
        }
    }
    .tipColor {
        color: #e91919;
    }
    .fullColor {
        color: #333;
    }
    .textcolor {
        color: #999;
    }
    .flagF {
        color: #ff3a2b !important;
    }
    .font {
        font-size: 12px;
    }
    .remk {
        color: #0066ff;
        cursor: pointer;
        border-bottom: 1px solid;
    }
    .tipbox {
        p {
            line-height: 2.5;
        }
    }
}
</style>