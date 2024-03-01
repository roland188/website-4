<template>
    <div class="themeColor index">
        <BgGame v-if="['bgga','betc88','wynn','sovip','dola789'].includes(projectImgUrl)"></BgGame>
        <KuBet v-if="['kubet','choibet','phattai68'].includes(projectImgUrl)"></KuBet>
        <Bet88 v-if="['xiaocao','g9bet'].includes(projectImgUrl)"></Bet88>
        <Jun88 v-if="projectImgUrl == 'jun88'"></Jun88>
        <xoc88 v-if="projectImgUrl == 'xoc88'"></xoc88>
        <!-- <mergeNewRed v-if="projectImgUrl === 'betc88'" /> -->
    </div>
</template>

<script>
import BgGame from "../../skinPage/bggame/Home.vue";
import KuBet from "../../skinPage/kubet/Home.vue";
import Bet88 from "../../skinPage/bet88/Home.vue"
import Jun88 from "../../skinPage/jun88/Home.vue"
import xoc88 from "../../skinPage/xoc88/Home.vue"
// 红包活动+大转盘合并，需要时解开注释就好
// import mergeNewRed from '@/components/newRed/index.vue';
export default {
    name: "home",
    components: {
        BgGame,
        KuBet,
        Bet88,
        Jun88,
        xoc88,
        // mergeNewRed
    },
    data() {
        return {
            projectImgUrl: window.projectImgUrl,
        };
    },
    computed: {
    },
    watch: {
    },
    mounted() {
     },
    methods: {
        getDomain(){
            if(!this.$config.pcDomainImgUrl)return
            this.isDomain = true
            this.domainImgUrl = this.$config.imgHost + this.$config.pcDomainImgUrl;
        },
    },
};
</script>
<style lang="scss" scoped>
.header_container {
    width: 100%;
    height: 196px;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    background: $activity-bg;
    z-index: 998;
}

.index {
    position: relative;
    min-width: 1200px;
    overflow: auto;
    .rightMenu{
        position: fixed;
        right: 10px;
        top: 30%;
        z-index: 999;
    }
    .leftMenu{
        position: fixed;
        left: 10px;
        top: 20%;
        z-index: 99;
        background: #000;
    }
    .placeholder {
        width: 100%;
        height: 196px;
    }

    .main_swiper {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        height: 520px;
        background-color: pink;
        text-align: center;
    }
    .notice {
        width: 100%;
        background-color: $notice-bg;
        z-index: 99;
        cursor: pointer;
    }
    .fixed {
        position: fixed;
        left: 0;
        top: 130px;
        width: 100%;
        z-index: 99;
        cursor: pointer;
    }
    .best_platform {
        position: relative;
        padding-bottom: 40px;
        border-bottom: 1px solid #1a1a1a;
        .best_inner {
            margin: 0 auto;
            margin-top: 0;
            width: 1200px;
            .title {
                position: relative;
                width: 1200px;
                height: 58px;
                margin: 40px auto 37px;
                background: url(../../assets/image/gameImg/index/container_img01.png)
                    50% 0 no-repeat;
                .quick_recharge {
                    float: left;
                    margin-top: 3px;
                    width: 180px;
                    height: 50px;
                    background: url(../../assets/image/gameImg/index/btn_add_credit.png)
                        50% 0 no-repeat;
                    &:hover {
                        background-position: 50% 100%;
                    }
                }
                .service_online {
                    float: right;
                    margin-top: 3px;
                    width: 180px;
                    height: 50px;
                    background: url(../../assets/image/gameImg/index/btn_service.png)
                        50% 0 no-repeat;
                    &:hover {
                        background-position: 50% 100%;
                    }
                }
            }
        }
    }
    .more_pro {
        position: relative;
        background-color: #000;
        .best_inner {
            margin: 0 auto;
            width: 1200px;
        }
    }
    .domain {
        max-height: 63px;
        background-color: transparent;
        position: fixed;
        right: 0;
        bottom: 11%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        z-index: 9999;
    }
    .domain .close{
        position: absolute;
        right: 5px;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 99999;
    }
}

// 异常登录弹窗
.validate {
    .el-dialog {
        width: 300px !important;
        z-index: 9999;
        .el-dialog__header {
            text-align: center;
            padding-bottom: 0;
        }
        .el-dialog__body {
            padding: 10px 30px;
        }
        .name {
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                width: 55px;
            }
        }
        p {
            padding-bottom: 20px;
        }
        .operation {
            display: flex;
            align-items: center;
            flex-direction: column;
            .returnLogin,
            .submitValidation {
                width: 160px;
                margin-top: 20px;
                margin-left: 0;
            }
            .submitValidation {
                background-color: #333;
                border: none;
            }
        }
    }
}

.homeUsdt{
  position: fixed;
  left: 0;
  top: 20%;
  z-index: 9999;
}
</style>

