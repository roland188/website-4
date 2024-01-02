<template>
    <div class="more-list">
        <div class="item" v-for="(item,index) in (projectImgUrl==='wbgj' ? list1 : list)" :key=" index" :class="index == cur?'cur':''" @click="transgo(item)" @mouseenter="changeCur(index)">
            <!-- {{item.con}} -->
            <a href="javascript:;">
                <div class="title">
                    <img loading="lazy" :class="index == cur?'cur':''" v-lazy="item.titleImg" alt="">
                </div>
                <div class="con">
                    <img loading="lazy" v-lazy="item.conImg" alt="">
                </div>
            </a>
        </div>
    </div>
</template>
<script>
export default {
    'name':'more',
    data(){
        return {
            'cur':0,
            'list':[
                {
                    'titleImg':require('@/assets/image/gameImg/index/btn_first_livecasino.png'),
                    'conImg':require('@/assets/image/gameImg/index/159131702301.png'),
                    'path':'/casino',
                    'query':{
                        'pid':5,
                        'id':51,
                        'type':2
                    }
                },
                {
                    'titleImg':require('@/assets/image/gameImg/index/btn_first_sports.png'),
                    'conImg':require('@/assets/image/gameImg/index/159131706908.png'),
                    'path':'/sport',
                    'query':{
                        'pid':2,
                        'id':9419,
                        'type':2
                    }
                },
                {
                    'titleImg':require('@/assets/image/gameImg/index/btn_first_esports.png'),
                    'conImg':require('@/assets/image/gameImg/index/159131710517.png'),
                    'path':'/elec',
                    'query':{
                        'pid':6,
                        'id':8800,
                        'type':2
                    }
                },
                {
                    'titleImg':require('@/assets/image/gameImg/index/btn_first_lottery.png'),
                    'conImg':require('@/assets/image/gameImg/index/159131713376.png'),
                    'path':'/lottery',
                    'query':{
                        'pid':4,
                        'id':42,
                        'type':1
                    }
                }
            ],
            'list1':[
                {
                    'titleImg':require('@/assets/image/gameImg/index/btn_first_esports.png'),
                    'conImg':require('@/assets/image/gameImg/index/159131710517.png'),
                    'path':'/elec',
                    'query':{
                        'pid':6,
                        'id':8800,
                        'type':2
                    }
                },
                {
                    'titleImg':require('@/assets/image/gameImg/index/btn_first_livecasino.png'),
                    'conImg':require('@/assets/image/gameImg/index/159131702301.png'),
                    'path':'/casino',
                    'query':{
                        'pid':5,
                        'id':51,
                        'type':2
                    }
                },
                {
                    'titleImg':require('@/assets/image/gameImg/index/btn_first_sports.png'),
                    'conImg':require('@/assets/image/gameImg/index/159131706908.png'),
                    'path':'/sport',
                    'query':{
                        'pid':2,
                        'id':9419,
                        'type':2
                    }
                },
                {
                    'titleImg':require('@/assets/image/gameImg/index/btn_first_lottery.png'),
                    'conImg':require('@/assets/image/gameImg/index/159131713376.png'),
                    'path':'/lottery',
                    'query':{
                        'pid':4,
                        'id':42,
                        'type':1
                    }
                }
            ],
            projectImgUrl: window.projectImgUrl
        };
    },
    'methods':{
        changeCur(val){
            this.cur = val;
        },
        transgo(val){
            this.$router.push({
                'path':val.path,
                'query':val.query
            });
        }
    }
};
</script>
<style lang="less" scoped>

    .more-list {
        width: 1200px;
        height: 440px;
        // background-color: #000;
        padding-top: 98px;
        background: url(../../assets/image/gameImg/index/container_img02.png) 50% 40px no-repeat;
        .item {
            position: relative;
            width: 90px;
            height: 440px;
            margin-right: 10px;
            float: left;
            transition:all .3s;
            // background-color: #000;
            overflow: hidden;
            &:last-child{
                margin-right: 0;
            }
            .title{
                position: absolute;
                left: 0;
                top: 40px;
                width: 90px;
                height: 360px;
                overflow: hidden;
                z-index:9;
                img{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 90px;
                    height: 720px;
                }
                .cur {
                    transform:translateY(-50%);
                }
            }
            .con {
                position: absolute;
                right: 0;
                top: 0;
                width: 810px;
                height: 440px;
                overflow: hidden;
                 img{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .cur {
            width:900px;
        }
    }
</style>