<template>
    <div class="play">
        <div class="playList">
            <div style="height:36px;">
                <!-- 公告 -->
                <div :class="noticeClass" @click="openNotice">
                    <Notice></Notice>
                </div>
                <!-- 公告弹窗 -->
                <dialog-notice v-if="openDialog" @close="closeNotice"></dialog-notice>
            </div>
            <!-- 顶部背景图片 -->
            <div class="bg">
                <img loading="lazy" class="img" v-lazy="$config.getLocaleImg('listbg3','jpg')" alt="">
            </div>
            <!-- 游戏二级列表 -->
            <!-- <ul class="card-vendor">
                <li class="vendor-item current" v-for="(item,index) in curMenuList" :key='index' @click="clickTab(item)" :class="item.ids == dataInfo.id ? 'setColor':''">{{item.name}}</li>
            </ul> -->

            <!-- 游戏展示列表 -->
            <div class="showPlayList">
                <ul class="gamelist" style="overflow:hidden;margin-top:15px;">
                    <li class="sportItem"  v-for="(item1,ind) in curMenuList" :key='ind' @click="getToken(item1,2)">
                        <div class="img-wrap">
                            <img loading="lazy" class="img" v-lazy="$config.imgHost+item1.imgUrl" :onerror='noData' />
                        </div>
                        <div  class="sportName">{{item1.name}}</div>
                        <div class="sportIntro">
                            {{item1.status == 1 ? item1.name : $t('维护中')}}
                        </div>
                    </li>
                </ul>
            
            </div>
            <!-- <div>
                <el-pagination
                    background
                    :page-size='dataInfo.pageSize'
                    @current-change="changePage"
                    layout="prev, pager, next"
                    :total="dataInfo.total">
                </el-pagination>
            </div> -->
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
                pageSize:18, // 展示数量
                total:1,//游戏列表总数量
            },
            noData: 'this.src="' + require("@/assets/image/pubilc/searchlost.png") + '"',
            openDialog:false,
            noticeSwitch:false,
            data:[],
            ind:null,   //点击li的索引,
            
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
        }
        // 赋值 总列表
        this.menuList = JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH"));

        // 获取传参数据
        let {pid,id,type} = this.$route.query;
        this.dataInfo.pid = pid;
        this.dataInfo.id = id;
        this.dataInfo.type = type;
        this.curMenu = this.menuList.filter(v => {
            return v.id == this.$route.query.pid;
        })
        this.curMenuList = this.curMenu[0].children;
        // this.getGameList()
    },
    computed:{
        noticeClass:function(){
          return {
            notice:!this.noticeSwitch,
            fixed:this.noticeSwitch
          }
        }
    },
    methods:{
        clickTab(item){
            let {parentId:pid,ids:id,type} = item;
            this.dataInfo.pid = pid;
            this.dataInfo.id = id;
            this.dataInfo.type = type;
            this.getGameList()
        },
        openNotice(){
            this.openDialog = true;
        },
        closeNotice(){
            this.openDialog = false;
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
                self.$message.error(this.$t('进入游戏失败，请稍后重试！'))
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
        background-color: #2a2a2a!important;
    }
    .play .el-pager .number:hover,.play .btn-prev:hover,.play .btn-next:hover{
        color: #fff!important;
    }
</style>
<style scoped lang="scss">
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
        background: $activity-bg;
    }
    .playList{
        width: 1200px;
        margin: 0 auto;
    }
    .playList .bg {
        position: relative;
        width: 100%;
        min-width: 1920px;
        height: 260px;
        left: -360px;
        background-color: #fff;

    }
    .playList .bg .img {
        position: absolute;
        width: 100%;
        min-width: 1920px;
        left: 50%;
        top: 0;
        transform:translateX(-50%);
    }
    .searchSwiper {
        width: 1200px;
        height: 400px;
        background-color: pink;
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
    .showPlayList {
        margin-top: 40px;
    }
    .showPlayList .gamelist {
        background: url('../../assets/image/gameImg/lottery-bg.png');
    }
    .sportItem {
        position: relative;
        width: 186px;
        height: 161px;
        overflow: hidden;
        margin-right: 10px;
        margin-bottom: 10px;
        float: left;
        cursor:pointer;
        border:1px solid transparent;
    }
    .sportItem img {
        position: absolute;
        left: 0;
        top: 0;
        object-fit: contain;
        width: 100%;
        height: 100%;
    }
   
    .sportItem .sportName {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding-left: 20px;
        height: 56px;
        line-height: 56px;
        font-size: 16px;
        color:white;
        display: block;
    }
    .sportItem:hover {
        border-color:gold;
    }
     .sportItem:hover .sportName {
        display: none;
    }
    .sportItem .sportIntro {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        color: #bdbec3;
        background: linear-gradient(90deg,#282d3e 0,rgba(40,45,62,.2));
        background-color: #282d3e;
        box-sizing: border-box;
        opacity: .8;
        display: none;
        justify-content: center;
        align-items: center;
        font-size:16px;

    }
    .sportItem:hover .sportIntro {
        display: flex;
    }
</style>