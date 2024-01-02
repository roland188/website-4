<template>
    <div class="play">
        <div class="title">
            <i class="el-icon-arrow-left el-icon--left menu-arrow"></i>
            <span>{{ $t('Back') }}</span>
            <div class="titleName">
                <img class="leftMark" src="../../assets/image/qqImg/img_title_decor.png" alt="">
                <span>Slot</span>
                <img class="rightMark" src="../../assets/image/qqImg/img_title_decor.png" alt="">
            </div>
        </div>
        <div class="search">
            <div class="search-input">
                <input :placeholder="$t('Search Games')">
                <i aria-label="icon: search" tabindex="-1" class="search-icon"><svg viewBox="64 64 896 896" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg></i>
            </div>
            <div class="search-button">
                {{ $t('Search') }}
            </div>
        </div>
        <div class="playList">            
            <!-- 游戏二级列表 -->
            <div class="secondList" v-if="curMenuList?.length > 0 ? true : false">
                <div class="abs-panel" ref="subMenuList">
                    <ul class="card-vendor" :class="fixedListSwitch?'fixedList':''">
                        <!-- <li class="vendor-item current" v-for="(item,index) in curMenuList" :key='index' @click="clickTab(index)" :class="index == ind ? 'setColor':''">{{item.name}}</li> -->
                        <li class="vendor-item" 
                            v-for="(item,index) in curMenuList" 
                            :key='index' 
                            @click="clickTab(item)" 
                            :class="item.ids == dataInfo.id ? 'current':''">
                            <img class="img-back" :src="require(item.ids == dataInfo.id ? '../../assets/image/qqImg/btn_zc2_1.png' : '../../assets/image/qqImg/btn_zc2_2.png')" alt="">
                            <img class="sub-img" :src="$config.getImgUrl(item.pictureUrl ?? item.imgUrl)">
                            <span class="sub-title">{{item.name}}</span>
                            
                            
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 游戏展示列表 -->
            <div class="showPlayList" :style="{'margin-left': curMenuList?.length > 0 ? '0.2rem' : '0' }">
                <!--鼠标经过显示进入游戏动画HTML   开始-->
                <div class="play-content">
                    <div class="ele-card-box has-link"  v-for="(item1,ind) in gameList" :key='ind' @click="getToken(item1,1)">
                        <div class="img-wrap" :class="{'img-wrap1':item1.status == 0}">
                            <img loading="lazy" v-lazy="item1.pictureUrl?($config.imgHost+item1.pictureUrl):item1.imgUrl?($config.imgHost+item1.pictureUrl):''" :onError="noData" />
                        </div>
                        <div  class="ele-card-bottom">{{item1.name}}</div>
                    </div>
                </div>
                <div style="display:flex;width:100%;height:400px;color:white;justify-content:center;align-items:center;letter-spacing:2px;font:18px/36px normal;" v-show="dataInfo.total == 0">
                   {{$t('暂无数据')}}
                </div>
            <!--鼠标经过显示进入游戏动画HTML   结束-->
            </div>
        </div>
        <div class="playlist-bottom">
            <div class="secondList-bottom">
                <i class="el-icon-arrow-down el-icon--right" v-show="subMenuHasScroll"></i>
                <i class="el-icon-arrow-down el-icon--right" v-show="subMenuHasScroll"></i>
            </div>
            <div class="pagination" v-show="dataInfo.total > 0">
                <el-pagination
                    background
                    :page-size='dataInfo.pageSize'
                    @current-change="changePage"
                    :current-page="dataInfo.curPage"
                    layout="prev, pager, next"
                    :total="dataInfo.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import api from "../../utils/api"; //接口名字
// 公告
import Notice from '../../components/index/notice'
// 公告弹窗
import dialogNotice from '../../components/index/dialogNotice'

export default {
    components:{
        Notice,
        dialogNotice
    },
    data(){
        return {
            menuList:[], // 总列表
            curMenuList:null, // 当前选中二级列表
            gameList:[], // 游戏列表
            // 重要参数
            dataInfo:{
                pid:'', // 父id
                id:'', //子id
                type:'', // 类型
                curPage:1, //当前页
                pageSize:60, // 展示数量
                total:0,//游戏列表总数量
            },
            noData:'this.src="' + require("@/assets/image/pubilc/searchlost.png") + '"',
            fixedListSwitch:false, // 二级列表固定开关
            openDialog:false,
            noticeSwitch:false,
            data:[],
            subMenuHasScroll: false,
            ind:null,   //点击li的索引,
            img: require('@/assets/image/gameImg/Game_49220.png')
        }
    },
    mounted(){
        let _this = this;
        // 滚动公告
        window.onscroll = function(){
            if(document.documentElement.scrollTop > 251){
                _this.noticeSwitch = true;
            }else{
                _this.noticeSwitch = false;
            }
             if(document.documentElement.scrollTop > 280){
                _this.fixedListSwitch = false;
            }else{
                _this.fixedListSwitch = false;
            }
        }
        // 赋值 总列表
        this.menuList = JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH")).filter(v => {return v.id == 1});
        // return

        // 获取捕鱼参数
        let curMenu1 = this.menuList[0].children.filter(v => {
            return v.nameEn == 'fishing';
        })

        // 获取传参数据
        let value = curMenu1[0] ? curMenu1[0].ids : '';
        let {pid,id,type} = this.$route.query;
        this.dataInfo.pid = pid;
        // this.dataInfo.id = id == '100010001'?value:id;
        this.dataInfo.id = id;
        this.dataInfo.type = type;
        this.curMenu = this.menuList.filter(v => {
            return v.id == this.$route.query.pid;
        })
        let idx = '';
        this.curMenu[0].children.forEach((item,index) =>{
          if (item.nameEn == 'fishing'){
                idx = index
            }
        })
        if(this.curMenu[0].children) {
            this.curMenuList = this.curMenu[0].children
            this.curMenuList.forEach((item,index) =>{
            if (item.nameEn == 'fishing'){
                    this.curMenuList.splice(index,1)
                }
            })
        } else {
            this.curMenuList = [];
        }
        
        this.getGameList();
        this.checkSubMenuHasScroll();
    },
    update() {
        this.checkSubMenuHasScroll();
    },
    computed:{
        noticeClass:function(){
          return {
            notice:!this.noticeSwitch,
            fixed:this.noticeSwitch
          }
        },
    },
    watch:{
        '$route.query'(val){
            let {pid,id,type} = val;
            this.dataInfo.pid = pid;
            this.dataInfo.id = id;
            this.dataInfo.type = type;
            this.dataInfo.curPage = 1;
            this.curMenu = this.menuList.filter(v => {
                return v.id == this.$route.query.pid;
            })
            this.curMenuList = this.curMenu[0].children;
            this.getGameList()
        }
    },
    methods:{
        clickTab(item){
            let {parentId:pid,ids:id,type} = item;
            this.dataInfo.pid = pid;
            this.dataInfo.id = id;
            this.dataInfo.type = type;
            this.dataInfo.curPage = 1;
            this.getGameList()
            this.$refs.onHotGame.hotGameData(id,pid)
        },
        openNotice(){
            this.openDialog = true;
        },
        closeNotice(){
            this.openDialog = false;
        },
        checkSubMenuHasScroll() {
            this.$nextTick(() => {
                if(this.$refs.subMenuList) {
                    this.subMenuHasScroll = this.$refs.subMenuList.scrollHeight > this.$refs.subMenuList.clientHeight;
                } else {
                    this.subMenuHasScroll = false;
                }
            });
        },
        // 修改页码
        changePage(val){
            this.dataInfo.curPage = val;
            this.getGameList()
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
                        self.gameList = res.data.data.list;
                        // self.gameList.forEach((item,index) =>{
                        //     if(item.name == '捕鱼专区'){
                        //         self.gameList.splice(index,1)
                        //     }
                        // })
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
                        self.gameList = res.data.data.list;
                        // self.gameList.forEach((item,index) =>{
                        //     if(item.name == '捕鱼专区'){
                        //         self.gameList.splice(index,1)
                        //     }
                        // })
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
<style>
    .play .el-pagination.is-background{
        text-align: center;
        padding-top:15px;
    }
    .play .el-pager li, .play .el-pagination.is-background .btn-prev,.play .el-pagination.is-background .btn-next{
        background-color: #FFFFFF !important;
        border: 1px solid #866638 !important;
        border-radius: 5px !important;
        color: #866638 !important;
    }
    .play .el-pager .number:hover,.play .btn-prev:hover,.play .btn-next:hover{
        
        color: #333333 !important;
    }

    .play .el-pager .number.active {
        color: #FFF !important;
        background-color: #866638 !important;
    }
</style>
<style lang="scss" scoped>
    .fixed {
        position: fixed;
        left: 0;
        top:130px;
        width: 100%;
        background-color: rgba(0,0,0,.85);
        z-index:99;
        cursor: pointer;
      }
    .play{
        margin-bottom: 0.5rem;
        .title {
            height: 0.6rem;
            align-items: center;
            display: flex;
            justify-content: start;
            background-color: #FFF;
            margin: 0.2rem 0;
            border-radius: 0.1rem;
            color: #666;
            box-shadow: rgba(0, 0, 0, 0.06) 0px 0.03rem 0.09rem 0px;
            padding-left: 0.2rem;
            font-size: 0.2rem;
            position: relative;
            i {
                font-size: 0.3rem;
                cursor: pointer;
            }
            span {
                cursor: pointer;
            }
            .titleName {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                .leftMark {
                    width: 0.7433rem;
                    height: 0.0867rem;
                }
                span {
                    color: #222;
                    line-height: 1.2;
                    font-size: 18.88px;
                    padding: 0 0.1rem;
                }
                .rightMark {
                    width: 0.7433rem;
                    height: 0.0867rem;
                    transform: rotate(180deg);
                }


            }
        }
        .search {
            border-radius: 0.1rem;
            background-color: #FFF;
            box-shadow: rgba(0, 0, 0, 0.06) 0px 0.03rem 0.09rem 0px;
            margin-bottom: 0.2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.15rem;
            .search-input {
                border-radius: 0.3rem;
                color: #333;
                font-size: 0.18rem;
                height: 0.5rem;
                padding: 0px 0.15rem;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: start;
                border: 1px solid #E3E3E3;
                transition: border .2s ease-in-out;
                &:hover {
                    border: 1px solid #866638;
                }
                input {
                    flex: 1;
                    border: none;
                    line-height: 0.4rem;
                    &::placeholder{
                        color: #E3E3E3;
                        font-size: 0.2rem;
                        line-height: 0.4rem;
                    }
                }
                .search-icon {     
                    font-size: 0.26rem; 
                    color: #866638;  
                    width: 0.3rem;      
                    height: 100%;
                    justify-content: end;
                    align-items: center;
                    display: flex;
                }
            }
            .search-button {
                font-size: 0.18rem;
                height: 0.5rem;
                margin-left: 0.2rem;
                width: 1rem;
                background: #866638;
                border-color: #866638;
                border-radius: 0.1rem;
                padding: 0px 0.1rem;
                color: #FFF;
                font-size: 0.18rem;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .playList{
            width: 100%;
            display: flex;
            .secondList {
                width: 1.3rem;
                flex-shrink: 0;
                position: relative;
                .abs-panel {
                    position:absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    overflow-y: auto;
                    .card-vendor {
                        overflow: hidden;
                        .vendor-item{
                            width: 1.3rem;
                            height: 0.9rem;
                            cursor: pointer;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: relative;
                            flex-direction: column;
                            .img-back {
                                width: 100%;
                                height: 100%;
                                position: absolute;
                                left: 0;
                                top: 0;
                            }                        
                            .sub-title {
                                background: transparent;
                                color: #999999;
                                z-index: 2;
                                &:hover {
                                    color: #866638;
                                }
                            }
                            .sub-img {
                                width: 0.4rem;
                                height: 0.4rem;
                                z-index: 2;
                            }
                        }
                        .vendor-item.current .sub-title{
                            color: #FFF;
                        }
                    }
                }
            }
            .showPlayList {
                margin-left: 0.2rem;
                min-height: 6.2rem;
                flex-grow: 1;
                display: flex;
                width: 100%;
                background: #FFF;
                box-shadow: rgba(0, 0, 0, 0.06) 0px 0.03rem 0.09rem 0px;
                border-radius: 0.1rem;

                .play-content {
                    width: 100%;
                    height: fit-content;
                    flex-wrap: wrap;
                    display: flex;
                    .ele-card-box {
                        width: 16.6667%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin: 0.15rem 0;
                        .img-wrap {
                            width: 1rem;
                            height: 1rem;
                            cursor: pointer;
                            img {
                                border-radius: 0.2rem;
                            }
                        }
                        .ele-card-bottom {
                            cursor: pointer;
                            text-align: center;
                            color: #666666;
                            display: -webkit-box;
                            font-family: 'MicrosoftYaHei';
                            line-height: 1.2;
                            max-height: 2.4rem;
                            margin-top: 0.1rem;
                            max-width: 100%;
                            overflow: hidden;
                            text-align: center;
                            text-overflow: ellipsis;
                            vertical-align: middle;
                        }
                    }
                }
                
            }

        }

        .playlist-bottom {
            width: 100%;
            display: flex;
            .secondList-bottom {
                width: 1.3rem;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                i {
                    font-size: 0.25rem;
                    color: #b6a48a;
                }
                i:nth-child(2){
                    margin-top: -0.17rem;
                    color: #866638;
                }
            }
            .pagination {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
            }
        }
    }
    
    
</style>