<template>
    <div class="best-list">
        <div class="item" v-for="(item,index) in list" :key=" index" :class="index == cur?'cur':''" :style="'background-image:url('+item.titleImg+')'" @click.self="transgo(item)" @mouseenter="changeCur(index)" @mouseleave="changeCur(-1)">
            <small-swiper1 :info="item.query"></small-swiper1>
        </div>
    </div>
</template>
<script>
import smallSwiper1 from './smallSwiper'

export default {
    name:'more',
    components:{
        smallSwiper1,
      
    },
    data(){
        return {
            cur:-1,
            list:[
                {
                    titleImg:require(`@/assets/image/gameImg/index/game01.png`),
                    conImg:require('@/assets/image/gameImg/index/159131702301.png'),
                    path:'/casino',
                    query:{
                        pid:5,
                        id:51,
                        type:2,
                        index:0
                    }
                },
                {
                    titleImg:require('@/assets/image/gameImg/index/game02.png'),
                    conImg:require('@/assets/image/gameImg/index/swiper1.png'),
                    path:'/slots',
                    query:{
                        pid:1,
                        id:  221,
                        type:1,
                        index:1
                    }
                },
                 {
                    titleImg:require('@/assets/image/gameImg/index/game03.png'),
                    conImg:require('@/assets/image/gameImg/index/159131710517.png'),
                    path:'/slot',
                    query:{
                        pid:1,
                        id: 212,
                        type:1,
                        index:2
                    }
                },
                 {
                    titleImg:require('@/assets/image/gameImg/index/game04.png'),
                    conImg:require('@/assets/image/gameImg/index/159131713376.png'),
                    path:'/chess',
                    query:{
                        pid:3,
                        id: 217,
                        type:1,
                        index:3
                    }
                },
            ]
        }
    },
    created(){
        
    },
    methods:{
        changeCur(val){
            this.cur = val;
        },
        transgo(val){
            this.$router.push({
                path:val.path,
                query:val.query
            })
        }
    }
}
</script>
<style lang="less" scoped>

    .best-list {
        width: 1200px;
        height: 489px;
        // background-color: #000;
        // background: #000 url(../../assets/image/gameImg/index/container_img02.png) 50% 40px no-repeat;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item {
            position: relative;
            width: 280px;
            height: 489px;
            overflow: hidden;
            background:url(../../assets/image/gameImg/index/game01.png) 0 0 no-repeat;
            cursor:pointer;
            .title {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            img {
                width: 280px;
                height: 978px;
            }
        }
        .cur{
            background-position:0 100%;
        }
        
    }
</style>