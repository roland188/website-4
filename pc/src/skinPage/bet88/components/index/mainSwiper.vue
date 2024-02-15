<template>
    <div class="main_swiper" @mouseenter="enter" @mouseleave="leave">
        <swiper class="container" :options="swiperOption" ref="mySwiper">
            <swiper-slide class="item" style="cursor:pointer;" v-for="(item, index) in gameImgs" :key="index">
                <div style="overflow:hidden;" @click.stop="bannerTransgo(item)">
                    <div v-for="i in 10" :key="i * 100" class="img" :class="'img' + i"
                        :style="'background:url(' + $common.getImgUrl(item.picture) + ') no-repeat ' + ((1 - i) * 192) + 'px 0;animation-delay:' + (-0.04 * (10 - i)) + 's;'">
                    </div>
                </div>
            </swiper-slide>
            <div style="visibility:hidden;" class="swiper-button-next"></div>
            <div style="visibility:hidden;" class="swiper-button-prev"></div>
            <div class="swiper-pagination"></div>
        </swiper>

    </div>
</template>
<script>

export default {
    'name': 'mainswiper',
    data() {
        return {
            swiperOption: {//swiper3    
                speed: 1000,
                effect: 'fade',
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                autoplay: {
                    delay: 4000, //等4秒下一个
                    disableOnInteraction: false // 用户操作后继续自动轮播
                },
                paginationClickable: true, // 分页点击事件
                autoplayDisableOnInteraction: false //用户操作后继续自动轮播
            },
            'list': [
                {
                    'img': require('@/assets/image/gameImg/index/main_swiper1.png')
                },
                {
                    'img': require('@/assets/image/gameImg/index/main_swiper2.jpg')
                },
                {
                    'img': require('@/assets/image/gameImg/index/main_swiper3.jpg')
                },
                {
                    'img': require('@/assets/image/gameImg/index/main_swiper4.jpg')
                },
                {
                    'img': require('@/assets/image/gameImg/index/main_swiper5.jpg')
                }
            ],
            'gameImgs': []
        };
    },
    mounted() {
        this.banner();
    },
    'methods': {
        enter() {
            this.$refs.mySwiper.$swiper.autoplay.stop()
        },
        leave() {
            this.$refs.mySwiper.$swiper.autoplay.start()
        },
        'banner': async function () {
            let _this = this;
            try {
                var res = await _this.$http.get(_this.$api.banner);
            } catch {
                //接口报错处理
                _this.bannerReqSuccess = false;
            }

            if (res.code == 0) {
                _this.gameImgs = res.data;
                let luckyWheelSimple = res.data.find((item) => item?.expand?.actFolder === "vi-redPacketRain") || {};
                if(Object.keys(luckyWheelSimple).length > 0){
                    this.$emit('getluckyWheelSimple',luckyWheelSimple)
                }
                //不足3个，补足3个
                // if (this.gameImgs.length > 0 && this.gameImgs.length < 3) {
                //     var arr = [];
                //     var flag = false;
                //     for (let i = 0; i < 3 - this.gameImgs.length; i++) {
                //         flag = true;
                //         arr.push(this.gameImgs[this.gameImgs.length - 1]);
                //     }
                //     if (flag) {
                //         this.gameImgs.push(...arr);
                //     }
                // }
                if (res.data.length > 0) {
                    _this.bannerReqSuccess = true;
                } else {
                    _this.bannerReqSuccess = false;
                }
            } else {
                _this.bannerReqSuccess = false;
                this.$message.error(res.msg);
            }
        },
        // banner图跳转
        bannerTransgo(item) {
            // 抽奖活动红包不跳转
            if (item?.expand?.actFolder === 'worldcupRed') return

            // 澳门威尼斯人统计
            if (window.projectImgUrl == 'funw') {
                let ids = item.ids || item.id
                _paq.push([
                    "trackEvent",
                    "PC_banner",
                    "PC_banner",
                    item.title,
                    ids,
                ]);
                _paq.push(["trackGoal", 1]);
            }
            //1:外链 2:公告 3:活动 4:游戏 5:专题活动
            if (item.type === 1) {
                if (item.url) {
                    window.open(item.url)
                }
            } else if (item.type === 2) {
                if (!this.$common.getUser()) {
                    // this.$message.warning(this.$t('请先登录'))
                    this.$common.openLogin()
                    return
                }
                if (item.id) {
                    const { href } = this.$router.resolve({
                        name: 'news',
                        query: {
                            isNavActive: 2
                        }
                    });
                    window.open(href, "_blank");
                    let items = {
                        id: item.id,
                    };
                    this.$store.commit("showSwiperNoticeDetail", items);
                    // this.$router.push("/my/service/notice");
                    //     let items = {
                    //         id: item.id
                    //     };
                    // this.$store.commit("showSwiperNoticeDetail", items);
                }
            } else if (item.type === 3) {
                if (item.urlId) {
                    // this.$router.push({ //从活动列表进入
                    //     path:'/activity',
                    //     query:{
                    //         id:item.urlId
                    //     }
                    // })
                    this.$parent.$refs.actDetails.openDialog(item.urlId);
                }
            } else if (item.type === 4) {
                if (this.$common.getUser() && item.bannerGame.id) {
                    this.getToken(item.bannerGame, 1);
                } else {
                    // this.$message.warning(this.$t('请先登录'))
                    this.$common.openLogin()
                }
            } else if (item.type === 5) {
                if (item.expand && item.expand.actType == 3) {
                    // 双旦活动
                    this.jump11(item);
                    return;
                }
                if (item.urlId) {
                    this.$parent.$refs.actDetails.openDialog(item.urlId, 2);
                }
                // this.$http.get(this.$api.getThematicActivitiesByApp + "/" + item.urlId,"",true).then((res) => {
                //   if (res.code == 0) {
                //       this.$refs.refTimeDiscountDetail.pageData = res.data;
                //       this.$refs.refTimeDiscountDetail.dialogVisible = true;

                //   }
                // });
            } else if (item.type === 6 && (window.projectImgUrl === 'amwnsr' || window.projectImgUrl === 'funw')) {
                if (this.$common.getUser()) {
                    this.$router.push('/activation');
                } else {
                    // this.$message.warning(this.$t("请先登录"));
                    this.$common.openLogin()
                }
            } else if (item.type === 7) {
                const needLogin = item.needLogin == 1
                const isLogin = !!this.$common.getUser()
                if (needLogin && !isLogin) {
                    // this.$message.warning(this.$t('请先登录'))
                    this.$common.openLogin()
                    return
                }
                this.$router.push({ path: item.url })
            }
        },
        // 跳转双11
        jump11(item) {
            if (!this.$common.getUser()) {
                // this.$message.warning(this.$t('请先登录'));
                this.$common.openLogin()
                return;
            }
            const obj = {
                activityId: item.urlId,
                token: this.$common.getToken(),
                clientCode: window.clientCode,
                clientItem: window.childCode,
                username: this.$common.getUser().username,
                language: this.$i18n.locale,
                theme: window.theme,
                host: this.$config.baseUrl,
            };
            const str = window.btoa(JSON.stringify(obj));
            // const url = item.expand.actUrl + "/pc/index.html?s=" + str;
            // const url = window.location.origin  + '/func/springFestivalActivities' + "/pc/index.html?s=" + str;
            const url = window.location.origin + '/func/' + item.expand.actFolder + "/pc/index.html?s=" + str;
            window.open(url);
        },
        // 进入游戏
        getToken: async function (req, index) {
            // return
            let self = this;
            var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

            if (!self.$common.getUser()) {
                // self.showLogin = true;
                self.$message.warning(self.$t('indexPage.pleaseLogin'))
                return
            }
            self.tenantId = self.$common.getUser().tenant_id
            self.username = self.$common.getUser().username
            self.uid = self.$common.getUser().user_id
            let datas = {
                tenantId: self.tenantId,
                username: self.username,
                gameId: index == 2 ? req.ids : req.id,
                clientIp: self.$config.clientIp,
                memberId: self.uid,
                terminalType: 1
            }
            self.$common.setGameRequestData(datas)

            const res = await self.$http.post(this.$api.getToken, datas, true)
            if (res.code == 0) {
                self.gameUrl = res.data;
                if (req.openMode === 1) {
                    // if(issafariBrowser) {
                    //  self.winOpen.location.href = self.gameUrl;
                    // }else{
                    window.open(self.gameUrl)
                    // }

                } else {
                    window.open(self.gameUrl)
                }

            } else {
                if (req.openMode === 1) {
                    window.open('/error.html?type=1')
                    // self.winOpen.location.href = '/error.html?type=1';
                }

                if (req.status === 0) {
                    self.$message.error(self.$t('indexPage.repair'))
                } else {
                    self.$message.error(self.$t('indexPage.failed'))
                }
            }
        },
    }
};
</script>
<style lang="less" scoped>
.main_swiper {
    width: 1920px;
    height: 520px;
    .container {
        position: relative;

        .swiper-pagination {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);

            /deep/ .swiper-pagination-bullet {
                width: 20px;
                height: 20px;
                border-radius: 10px;
                background: #c7c7c7;
                opacity: 1;
                margin-right: 5px;
            }

            /deep/ .swiper-pagination-bullet-active {
                width: 57px;
                background: #e9c885;
            }

        }

        /deep/ .swiper-slide .img {
            width: 192px;
            height: 520px;
            float: left;
            overflow: hidden;
            // transform: translateY(100%);
        }

        /deep/ .swiper-slide-active .img {
            animation: btmToTop 1.5s;
        }
    }
}

@keyframes btmToTop {
    0% {
        transform: translateY(100%);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>