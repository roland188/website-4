<template>
    <div class="small-swiper">
         <div class="wrap">
            <div class="inner">
                <swiper :options="swiperOption" v-show="dataList.length>0">
                  
                    <swiper-slide class="item" v-for="(item,index) in dataList" :key="index">
                        <img loading="lazy" class="img" @click="jump(item)" :src="item.pictureUrl?($config.imgHost+item.pictureUrl) : item.imgUrl?($config.imgHost+item.imgUrl):''" :onError="noData">
                        <p class="title" @click="jump(item)">{{item.name}}</p>
                    </swiper-slide>
                </swiper>
                <!--以下看需要添加-->
                <div v-if="info.index == 0" class="swiper-button-prev"></div>
                <div v-if="info.index  == 3" class="swiper-button-next"></div>
            </div>
         </div>
    </div>
</template>
<script>
import api from "../../utils/api"; //接口名字
export default {
    name:'smallswoper',
    props:['info','gameList'],
    data(){
        return {
            dataList: [],
            swiperOption: {//swiper3
                autoplay: 1000,
                speed: 1000,
                slidesPerView: 3,
                loop:true,
                autoplay: {
                    delay: 3000, //等4秒下一个
                    disableOnInteraction: false // 用户操作后继续自动轮播
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },
            dataInfo:{
                pid:'', // 父id
                id:'', //子id
                type:'', // 类型
                curPage:1, //当前页
                pageSize:18, // 展示数量
                total:0,//游戏列表总数量
            },
            noData: 'this.src="' + require("@/assets/image/pubilc/searchlost.png") + '"',
        }
    },
    mounted(){
            setTimeout(() => {
                this.mountFun(this.gameList)
            },2500)
            // // 赋值 总列表
            // this.menuList = JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH"));

            // // 获取捕鱼参数
            // let curMenu1 = this.menuList[0].children.filter(v => {
            //     return v.nameEn == 'fishing';
            // })
            // let value = curMenu1[0].ids;
            // // 获取传参数据
            // let {pid,id,type,index} = this.info;
            // this.dataInfo.pid = pid;
            // this.dataInfo.id = id == '100010001'?value:id;
            // this.dataInfo.type = type;
            // this.curMenu = this.menuList.filter(v => {
            //     return v.id == this.info.pid;
            // })
            // if(index == 0){
            //     this.gameList = this.curMenu[0].children;
            // }else{
            //     this.getGameList()
            // }
        
    },
    methods:{
        mountFun(val){
             // 赋值 总列表
             try {
                 this.menuList1 = (JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH")) || val).filter(v => {
                     if (v) {return v.id == 1}
                 });
             } catch {
                 this.menuList1 = []
                 console.log('menuList1 获取失败')
             }
            
            this.menuList = (JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH")) || val);
            // 获取捕鱼参数
            let curMenu1 = []
            if(this.menuList1.length > 0){
                curMenu1 = this.menuList1[0].children.filter(v => {
                    return v.nameEn == 'fishing';
                })
            }
            console.log("curMenu1",curMenu1)
            let value = curMenu1[0] ? curMenu1[0].ids : '';
            // 获取传参数据
            let {pid,id,type,index} = this.info;
            this.dataInfo.pid = pid;
            this.dataInfo.id = id;
            this.dataInfo.type = type;
            this.curMenu = this.menuList.filter(v => {
                if (v) {
                    return v.id == this.info.pid;
                }
            })
            if(index == 0){
                this.dataList = this.curMenu[0].children;
            }else{
                this.getGameList()
            }

        },

        jump(val){
            this.getToken(val,this.info.type)
        },
        // 获取游戏列表数据
        getGameList(){
            let self = this;
            let {pid,id,type,curPage,pageSize} = this.dataInfo;
            if(type == 1){
                    self.$http.pnPost(
                        self.$api.vendorGame,
                        {
                          currentPage: curPage,
                          pageSize: pageSize,
                          gameKindId: pid,
                          vendorId: id,
                        },
                        true,
                        (res) => {
                          self.dataList = res.data.data.list;
                          self.dataInfo.total = res.data.data.total;
                        }
                      );
            }else if(type == 3){
                self.$http.pnPost(
                    self.$api.getGameByIds,
                    {
                        currentPage: curPage,
                        pageSize: pageSize,
                        gameKindId: pid,
                        ids: id,
                    },
                    true,
                    (res) => {
                        self.dataList = res.data.data.list;
                        self.dataInfo.total = res.data.data.total;
                    }
                );
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
    .small-swiper {
        .wrap {
            width:280px;
            height:86px;
            position:absolute;
            left:0;
            bottom:18px;
            .inner {
                width:234px;
                height:86px;
                overflow:hidden;
                margin:0 auto;
                .item {
                    width:78px;
                    height:86px;
                    text-align:center;
                    .img {
                        width:64px;
                        height:64px;
                        object-fit:contain;
                    }
                    .title {
                        color:white;
                        text-align:center;
                        font:14px/26px normal;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                .swiper-button-next, .swiper-button-prev {
                    position: absolute;
                    top: 50%;
                    width: 10px;
                    height: 30px;
                    margin-top: -22px;
                    z-index: 10;
                    cursor: pointer;
                    background-size: 10px 18px;
                    background-position: center;
                    background-repeat: no-repeat;
                    --swiper-navigation-size:18px;
                }
            }
        }
    }
</style>