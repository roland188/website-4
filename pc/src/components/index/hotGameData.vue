<template>
    <div class="hotGameData"  ref='hotGameData'>
        <div class="showPing" @click='hideHot'>
            <img loading="lazy" v-lazy="require('../../assets/image/gameImg/login-close.png')" alt />
        </div>
        <swiper :options="swiperOption" class="swiper-container" ref="mySwiper" @click-slide="onClick">
            <swiper-slide class="swiper-item" v-for='(item,index) in hotPlayList' :key='index'>
                <img loading="lazy" class='swiper-img' :src='$config.imgHost+item.pictureUrl' :onerror="noData"/>
            </swiper-slide>
            <!-- <div class="swiper-button-next" @click="next"></div>
            <div class="swiper-button-prev" @click="prev"></div> -->
            <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
    </div>
</template>
<script>
import api from '../../utils/api'; //接口名字
let _this = this;
export default {
    data(){
        _this = this;
        return {
            'hotPlayList':[],
            'swiperOption': {
                'notNextTick': true,
                'speed': 1000,
                'effect' : 'fade',
                'loop':true,
                'grabCursor': true, //小手抓取滑动
                'pagination': '.swiper-pagination',
                'paginationClickable':true,
                'autoplay': {
                    'delay': 2000, //等4秒下一个
                    'disableOnInteraction': false // 用户操作后继续自动轮播
                },
            },
            'noData': 'this.src="' + require('../../assets/image/pubilc/searchlost.png') + '"'
        };
    },
    created(){
        this.hotGameData();
    },
    'computed': {
        // swiper() {
        //     return this.$refs.mySwiper.swiper
        // }
    },
    methods:{
        onClick(index,realIndex) {
            let item = this.hotPlayList[realIndex];
            this.getToken(item);
        },
        hideHot(){
            this.$refs.hotGameData.style.display = 'none';
        },
        // 获取热门游戏数据
        'hotGameData': async function(){
            let self = this;
            let data = '';
            const res = await self.$http.get(self.$api.hotGame, data, false);
            if (res.code == 0) {
                self.hotPlayList = res.data;
            } else {
                this.$message.error(res.msg);
            }
        },
        //点击进入游戏
        'getToken': async function(req) {
            let self = this;
            var issafariBrowser =
                /Safari/.test(navigator.userAgent) &&
                !/Chrome/.test(navigator.userAgent);
            if (!self.$common.getUser()) {
                // self.showLogin = true;
                // self.$message.warning(self.$t('请先进行登录'));
                this.$common.openLogin()
                return;
            }
            let tenantId = self.$common.getUser().tenant_id;
            let username = self.$common.getUser().username;
            let uid = self.$common.getUser().user_id;
            let datas = {
                'tenantId': tenantId,
                'username': username,
                'gameId': req.id,
                'clientIp': self.$config.clientIp,
                'memberId': uid,
                'terminalType': 1
            };
            self.$common.setGameRequestData(datas);

            const res = await self.$http.post(api.getToken, datas, true);
            if (res.code == 0) {
                window.open(res.data);
            } else {
                if (req.openMode === 1) {
                    self.winOpen.location.href = '/error.html?type=1';
                }

                if (req.status === 0) {
                    self.$message.error(self.$t('维护中'));
                } else {
                    self.$message.error(self.$t('进入游戏失败，请稍后重试'));
                }
            }
        }

        // prev() {
        //     this.swiper.slidePrev();
        // },
        // next() {
        //      this.swiper.slideNext()
        // }
    }
};
</script>
<style scoped lang="less">
  .hotGameData:hover .showPing{
    display: block;
  }
.hotGameData{
    color: #fff;
    position: relative;
    padding-top: 30px;
    .showPing{
        display: none;
        position: absolute;
        width: 24px;
        height: 24px;
        top: 0px;
        left: 10px;
        img{
            width: 100%;
            height: 100%;
        }
        }
    img{
        border-radius: 10px;
        width: 300px;
        height: 300px;
    }
    .swiper-pagination{
        // background-color: #fea;
    }

}
</style>