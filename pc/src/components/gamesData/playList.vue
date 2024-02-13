<template>
    <div class="play">
        <div class="playList">
            <ul class="card-vendor">
                <li class="vendor-item current" v-for="(item,index) in data" :key='index' @click="clickTab(index)" :class="index == ind ? 'setColor':''">{{item.title}}</li>
            </ul>
            <div class="showPlayList">
                <!--鼠标经过显示进入游戏动画HTML   开始-->
                <ul style="overflow:hidden">
                    <!-- <li class="ele-card-box has-link"  v-for="(item1,ind) in gameList" :key='ind'>
                        <div class="img-wrap">
                            <img loading="lazy" :src="item1.img" />
                            <div  class="mask">
                            <div  class="mask-word">进入游戏</div>
                            </div>
                        </div>
                        <div  class="ele-card-bottom">{{item1.title}}</div>
                    </li> -->
                    <li class="ele-card-box has-link"  v-for="(item1,ind) in 24" :key='ind'>
                        <div class="img-wrap">
                            <img loading="lazy" v-lazy="img" />
                            <div  class="mask">
                            <div  class="mask-word">{{$t('进入游戏')}}</div>
                            </div>
                        </div>
                        <div  class="ele-card-bottom">{{$t('五人牛牛')}}</div>
                    </li>
                </ul>
            <!--鼠标经过显示进入游戏动画HTML   结束-->
            </div>  
            <div>
                <el-pagination
                    background
                    :page-size='24'
                    layout="prev, pager, next"
                    :total="100">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            data:[{
                title:$t('BB天豪棋牌')
            },
            {
                title:$t('开元棋牌')
            },
            {
                title:$t('JDB棋牌')
            },
            {
                title:$t('乐游棋牌')
            },
            {
                title:$t('易游棋牌')
            },
            {
                title:$t('FG棋牌')
            },
            {
                title:$t('MT棋牌')
            },
            {
                title:$t('ACE棋牌')
            },
            {
                title:$t('幸运棋牌')
            }],
            ind:null,   //点击li的索引,
            img: require('@/assets/image/gameImg/Game_49220.png'),
            gameList:[
                {
                    img: require('@/assets/image/gameImg/Game_49220.png'),
                    title:$t('五人牛牛')
                }
            ]
        }
    },
    methods:{
        clickTab(index){
            this.ind = index
        }
    }
    
}
</script>
<style>
    .play .el-pagination.is-background{
        text-align: center;
        padding-top:15px;
    }
    .play .el-pager li, .play .el-pagination.is-background .btn-prev,.play .el-pagination.is-background .btn-next{
        background-color: #2a2a2a!important;
    }
    .play .el-pager .number:hover,.play .btn-prev:hover,.play .btn-next:hover{
        color: #fff!important;
    }
</style>
<style scoped lang="scss">
    .play{
        background: $activity-bg;
    }
    .playList{
        width: 1200px;
        margin: 0 auto;
    }
    .card-vendor {
        background: $game-tabBg;
        overflow: hidden;
    }
    .card-vendor .vendor-item{
        position: relative;
        float: left;
        width: 16.66%;
        height: 43px;
        line-height: 43px;
        padding: 0 10px;
        box-sizing: border-box;
        color: $game-textColor;
        font-size: 16px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
    }
    .card-vendor .vendor-item::before{
        position: absolute;
        top: 0;
        right: 0;
        width: 2px;
        height: 100%;
        content: "";
        background-color: $game-Bg;
        border-left: 1px solid $game-Rborder;
    }
    .card-vendor .vendor-item::after{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        content: "";
        background-color: $game-Rborder;
        border-bottom: 2px solid $game-Bg;
    }
    .card-vendor .vendor-item:hover{
        color: $game-tabColor;
    }
   .playList .card-vendor .setColor{
        color: $game-tabColor;
    }
    /*鼠标经过显示进入游戏动画CSS   开始*/
    .has-link{
        cursor: pointer;
        float: left;
        width: 15.83%;
        margin: 0 1% 10px 0;
        background: rgba(44,44,44,.1);
        z-index: 10;
    }
    .has-link:nth-child(6n+6){
        margin-right: 0;
    }
    .has-link:hover .img-wrap .mask{
        opacity:0.9;
    }
    .ele-card-box .img-wrap {
        position: relative;
        text-align: center;
        padding-top: 100%;
    }
    .ele-card-box .img-wrap img {
    position: absolute;
        left: 0;
        top: 0;
        max-width: 100%;
        padding: 3%;
        box-sizing: border-box;
    }
    .ele-card-box .img-wrap .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #29e5c1;
        background: linear-gradient(135deg,#29e5c1,#28bbcb 50%,#2772dc);
        opacity: 0;
        -moz-transition: opacity .5s ease-in-out;
        -o-transition: opacity .5s ease-in-out;
        transition: opacity .5s ease-in-out;
    }
    .ele-card-box .img-wrap .mask .mask-word {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 20px;
        line-height: 20px;
        padding-top: 70px;
        margin-top: -45px;
        text-align: center;
        letter-spacing: 1px;
        font-size: 18px;
        color: #fff;
        background: url('../../assets/image/gameImg/bordergame_play_icon.png') top no-repeat;
        background-size: auto 68%;
    }
    .ele-card-box .ele-card-bottom {
        background: #ddd;
        background: rgba(58,61,63,.3);
        padding: 0 4px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 17px;
        text-shadow: 1px 1px 2px rgba(0,0,0,.2);
        color: #fff;
        letter-spacing: 1px;
        text-decoration: none;
        overflow: hidden;
        text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        white-space: nowrap;
    }
    /*鼠标经过显示进入游戏动画CSS   结束*/
</style>