<template>
    <div>
        <div class="newred-page">
        <swiper :options="swiperOption" @click-slide="onClick">
            <swiper-slide class="swiper-item" v-if="isShowRed">
             <img src="./img/redBg.gif" alt="">
            </swiper-slide>
            <swiper-slide class="swiper-item" v-if="isShowDzp">
             <img src="./img/worldSports.gif" alt="">
            </swiper-slide>
        </swiper>
    </div>

        <left-award ref="leftAward" />
    </div>

</template>
<script>
import leftAward from '../leftAward/index.vue'
export default {
    components:{
        leftAward
    },
    data() {
        return {
            'swiperOption': {
                'speed': 1000,
                'loop':true,
                'grabCursor': true, //小手抓取滑动
                'autoplay': {
                    'delay': 2000, //等4秒下一个
                    'disableOnInteraction': false // 用户操作后继续自动轮播
                },
            },
            swiperData:[],
            worldCupData:{}
        };
    },
    computed:{
			isShowRed(){
				return this.swiperData.find(item => item?.expand?.actFolder === 'worldcupRed') || false
			},
			isShowDzp(){
                this.worldCupData = this.swiperData.find(item => item?.expand?.actFolder === "luckyWheelSimple") || {}
				return this.swiperData.find(item => item?.expand?.actFolder === "luckyWheelSimple") || false
			}
		},
    created() {
        this.banner()
    },
    methods: {
		
        banner: async function () {
            let _this = this;
            let res = await _this.$http.get(_this.$api.banner);
            _this.swiperData = res.data;
            
        
        },
        onClick(i,realIndex){
            if(realIndex==0){
                this.$refs.leftAward.goReceive()
            }else{
                this.toWorldCupSports()
            }
        
        },
        toWorldCupSports() {
            if (!this.$common.getUser()) {
                this.$message.warning(this.$t('请先登录'));
                return;
            }
            const obj = {
                activityId: this.worldCupData.urlId,
                token: this.$common.getToken(),
                clientCode: window.clientCode,
                clientItem: window.childCode,
                username: this.$common.getUser().username,
                language: this.$i18n.locale,
                theme: window.theme,
                host: this.$config.baseUrl,
            };
            const str = window.btoa(JSON.stringify(obj));
            const url = window.location.origin + '/func/' + this.worldCupData.expand.actFolder + "/pc/index.html?s=" + str;
            // const url = 'https://2mzk83kc8r.com' + '/func/' + this.worldCupData.expand.actFolder + "/pc/index.html?s=" + str;
            window.open(url);
        },
		getActivitiesData(urlId) {
			this.$http.get(this.$api.getThematicActivitiesByApp + "/" + urlId).then((res) => { });
		},

    },

    watch: {
        "$store.state.token"(n) {
            if (n) {
                this.banner();
            } else {
                // this.isShow = false;
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.newred-page{
    width: 1.3rem;
		height: 1.3rem;
		position: fixed;
		bottom: .1rem;
		right: .3rem;
		z-index: 2;
}
</style>
