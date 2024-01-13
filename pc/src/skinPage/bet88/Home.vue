<template>
    <div class="themeColor index">
        <!-- 占位符 -->
        <div class="placeholder"></div>
        <hea-Der
            ref="header"
            @openRegister="openRegister"
            @scrollToCode="scrollToCode"
            @showPopup="showPopup"
            @openVip="openVip"
        ></hea-Der>
        <router-view></router-view>
        <!-- 底部 -->
        <div style="background: #0a0a0a">
            <footer-item></footer-item>
        </div>
        <div v-if="isDomain" class="domain" >
            <img :src="domainImgUrl" alt="">
            <div @click="isDomain=false" class="close"></div>
        </div>
        <Register ref="register" :show="isShowRegister" @hideRegister="hideRegister"></Register>
        <!-- 登录异常验证 -->
        <el-dialog class="validate" width="400px" :title="$t('异常验证')" :visible.sync="dialogFormVisible">
            <p>{{$t('系统检测到您的账户登录地区异常，请填写您的账户真实姓名进行验证！')}}</p>
            <div class="name">
                <span>{{ $t('姓名') }}：</span>
                <el-input v-model="name" autocomplete="off"></el-input>
            </div>
            <div class="operation">
                <el-button class="submitValidation" type="primary" @click="submitName()">{{$t('提交验证')}}</el-button>
                <el-button class="returnLogin" @click="dialogFormVisible = false">{{$t('返回登录')}}</el-button>
            </div>
        </el-dialog>
        <re-Bate ref="rebate"></re-Bate>
        <Mosaic-Gold ref="According"></Mosaic-Gold>
        <VipList ref="vipList"></VipList>
        <!-- 右侧侧边栏 -->
        <div class="rightMenu">
            <floating></floating>
        </div>
        
        <div class="homeUsdt" v-show="$route.path != '/home'">
            <UsdtFloating/>
        </div>
        <LoginDialog />
    </div>
</template>

<script>
// 顶部
// import menuList from "@/components/header/menuList";

//右侧侧边栏
import floating from './components/Floating/floating'

// 首页轮播
import mainSwiper from "../../components/index/mainSwiper";
//vip弹窗
import VipList from "../../components/vipList/vipList";
// 哦公告弹窗
import dialogNotice from "../../components/index/dialogNotice";
// 更多 视讯  体育  电竞  彩票   应有尽有
import moreList from "../../components/index/more";
// 全网最佳  电子  棋牌  捕鱼  游戏平台
import bestList from "../../components/index/best";
import Register from "../../pages/register/register";
import reBate from "@/components/rebate/rebate";
import LoginDialog from '@/components/LoginDialog'
import MosaicGold from "../../components/MosaicGold/MosaicGold";
// 底部
import footerItem from "./components/footer/footer";
import heaDer from "./components/header/header";
//usdt 浮窗
import UsdtFloating from "@/components/usdtFloating";
export default {
    name: "home",
    components: {
        mainSwiper,
        moreList,
        bestList,
        dialogNotice,
        // menuList,
        footerItem,
        heaDer,
        Register,
        MosaicGold,
        reBate,
        VipList,
        floating,
        UsdtFloating,
        LoginDialog,
    },
    data() {
        return {
            noticeSwitch: false,
            openDialog: false,
            isShowRegister: false,
            name: "",
            dialogFormVisible: false,
            isDomain: false,
            domainImgUrl:'',
        };
    },
    computed: {
        noticeClass: function () {
            return {
                notice: !this.noticeSwitch,
                fixed: this.noticeSwitch,
            };
        },
    },
    watch: {
        "$store.state.rebate"(n) {
            if (n) {
                this.$refs.rebate.According();
            }
        },
        "$store.state.mosaicGoldShow"(n) {
            //彩金状态
            if (n) {
                this.$refs.According.According();
            }
        },
        '$route.query'(val){
            if(val.scroll){
                this.scrollToCode()
            }
        }
    },
    mounted() {
        window.scrollTo(500,0)
        // window.projectImgUrl === 'funw'
        // switch (projectImgUrl) {
        //     case 'jryl':
        //         this.domainImgUrl = require('@/assets/image/gameImg/index/'+ projectImgUrl +'.png')
        //         break
        //     case 'qxyl':
        //         this.domainImgUrl = require('@/assets/image/gameImg/index/'+ projectImgUrl +'.gif')
        //         break
        // }
        setTimeout(() => {
            this.getDomain()
        },1000)
        if(window.location?.search && window.location?.search.includes('isShowRegister')){
            this.openRegister()
        }
     },
    methods: {
        getDomain(){
            if(!this.$config.pcDomainImgUrl)return
            this.isDomain = true
            this.domainImgUrl = this.$config.imgHost + this.$config.pcDomainImgUrl;
        },
        scrollToCode(){
            setTimeout(() => {
                document.documentElement.scrollTop = 1700;
            },200)
        },
        openVip() {
            this.$refs.vipList.openDialog();
        },
        openNotice() {
            this.openDialog = true;
        },
        closeNotice() {
            this.openDialog = false;
        },
        openRegister() {
            this.$refs.register.getRegisterSet().then(() => {
                this.isShowRegister = true;
            }).catch(() => {
                this.isShowRegister = true;
            });
        },
        hideRegister(type) {
            //关闭注册
            this.isShowRegister = false;
            if (type) {
                //头部变化
                this.$refs.header.isShow = false;
            }
        },
        showPopup(isShow) {
            this.dialogFormVisible = isShow;
            this.name = "";
        },
        //校验真实姓名
        submitName() {
            this.$refs.header.validateRealName(this.name);
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
    background-color: #0a0a0a;
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

