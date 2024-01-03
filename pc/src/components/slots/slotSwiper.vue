<template>
    <div class="slotswiper">
        <div class="leftTitle">

        </div>
        <div class="inner">
            <swiper :options="swiperOption" @click-slide="clkItem">

                <swiper-slide class="item" :class="{'img-wrap1':item.status == 0}" v-for="(item,index) in hotList" :key="index">
                    <div class="mask">
                        <div class="maskword">{{item.status == 1 ? $t('进入游戏') : $t('维护中')}}</div>
                    </div>
                    <img v-if="item.pictureUrl" loading="lazy" class="img" :src="item.topWebUrl ? $config.imgHost+item.topWebUrl : $config.imgHost+item.pictureUrl" :onError="noData">
                    <p class="title">{{item.name}}</p>
                </swiper-slide>
            </swiper>
                <!--以下看需要添加-->
                <div class="swiper-pagination" slot="pagination"></div>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
        </div>
    </div>
</template>
<script>
import api from "../../utils/api"; //接口名字
export default {
    name:'slotswiper',
    props:['gameKindId','vendorId'],
    data(){
        return {
            swiperOption: {//swiper3
                autoplay: {
                    delay: 3000
                },
                speed: 1000,
                slidesPerView: 6,
                spaceBetween: 30,
                loop:true,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction',
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
            },
            hotList:[],
            noData: 'this.src="' + require("@/assets/image/pubilc/searchlost.png") + '"',
        }
    },
    mounted(){
        setTimeout(()=>{
            this.hotGameData(this.gameKindId,this.vendorId)
        },500)
    },
    methods:{
        clkItem(index, realIndex){
            let item = this.hotList[realIndex]
            this.jump(item)
        },
        jump(val){
            this.getToken(val,1)
        },
        // 获取热门游戏数据
        hotGameData: async function(gameKindId,vendorId) {
            let self = this;
            let data = {
                gameKindId: gameKindId,
                vendorId: vendorId,
            };
            // hotGame
            const res = await self.$http.get(self.$api.recommendGame + '?gameKindId=' + vendorId +'&vendorId=' + gameKindId, false);
            if (res.code == 0) {
                self.hotList = res.data;
            } else {
                this.$message.error(res.msg);
            }
        },
        // 进入游戏
        getToken: async function(req,index) {
        // return
            let self = this;
                var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

            if (!self.$common.getUser()) {
                // self.showLogin = true;
                // self.$message.warning(this.$t('请登录'))
                this.$common.openLogin()
                return
            }
            self.tenantId = self.$common.getUser().tenant_id
            self.username = self.$common.getUser().username
            self.uid = self.$common.getUser().user_id
            let datas = {
                tenantId: self.tenantId,
                username: self.username,
                gameId: index == 2?req.ids:req.id,
                clientIp: self.$config.clientIp,
                memberId: self.uid,
                terminalType: 1
            }
            self.$common.setGameRequestData(datas)

            const res = await self.$http.post(api.getToken, datas, true)
            if (res.code == 0) {
                self.gameUrl = res.data;
                if (req.openMode === 1) {
                // if(issafariBrowser) {
                    //  self.winOpen.location.href = self.gameUrl;
                // }else{
                    window.open(self.gameUrl)
                // }

                }else{
                    window.open(self.gameUrl)
                }

            } else {
                if (req.openMode === 1) {
                window.open('/error.html?type=1')
                // self.winOpen.location.href = '/error.html?type=1';
                }

                if (req.status === 0) {
                self.$message.error(this.$t('维护中'))
                }else{
                self.$message.error(this.$t('进入游戏失败，请稍后重试'))
                }
            }
        },
    }
}
</script>
<style lang="less" scoped>
    .swiper-button-prev {
        left: -134px;
    }
    .swiper-button-next {
        left: -22px;
    }
    .swiper-button-next, .swiper-button-prev {
        background-size: 10px 24px;
        top:65%;

    }

.swiper-button-prev:after, .swiper-button-next:after {

        font-size: 16px!important;

    }
    .swiper-pagination-fraction {
        bottom: 47px;
        left: -96px;
        width: 65px;
        color:white;
    }
    .slotswiper {
        position: relative;
        width: 1200px;
        height: 160px;
        padding-left: 100px;
        background-color: #ccc;
        box-sizing: border-box;
        overflow: hidden;
        .leftTitle {
            position: absolute;
            left: 0;
            top: 0;
            background: #963032 url('../../assets/image/gameImg/hot_logo.png') 50% 25% no-repeat;
            width: 140px;
            height: 160px;
        }
        .inner {
            position: relative;
            width: 1060px;
            height: 160px;
            margin-left: 30px;
            background-color: #ccc;
            z-index:10;
            .item {
                width: 150px !important;
                height: 140px;
                margin-top: 10px;
                border:1px solid pink;
                border-radius:5px;
                background-color: #d5d9de;
                // overflow: hidden;
                cursor: pointer;

                .mask {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 150px;
                    height: 110px;
                    background-color: rgba(0,0,0,.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index:99;
                    opacity: 0;
                    .maskword {
                        width: 85px;
                        padding: 0 5px;
                        height: 30px;
                        line-height: 30px;
                        border-radius: 6px;
                        font-size: 14px;
                        color: #fff;
                        background: #43688d;
                        transition: all .3s;
                        text-align: center;
                        &:hover {
                            background-color: #d5373a;
                        }
                    }
                }
                &:hover .mask {
                    opacity:1;
                }
                .img {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 150px;
                    height: 125px;
                    object-fit: contain;
                }
                .title {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 30px;
                    font:14px/30px normal;
                    background-color: #963032;
                    text-align: center;
                    color:white;
                }

            }
            .img-wrap1{
                .mask {
                    opacity:1 !important;
                }
            }
        }
    }
</style>
