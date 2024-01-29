<template>
    <div class="search-header">
        <div class="search">
            <input data-v-28f627b1="" id="search_btn" type="button" />
          <input
            autocomplete="off"
            data-v-28f627b1=""
            id="searchstr"
            type="text"
            v-model="searchValue"
            :placeholder="$t('搜索')"
            size="10"
            @blur="clearValue"
          />
          <!-- <input data-v-28f627b1="" id="search_btn" @click="clickToShow(searchValue)" type="button" /> -->
          
          <div class="searchBox" v-show="searchBoxSwitch && searchList.length" v-loading="searchLoading">
            <div class="item" v-for="(item,index) in searchList" :key="index" @click="gameInfo(item)">
                {{item.name}}
                <span class="nameEn">{{ item.nameEn || item.vendorName }}</span>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            showSearchSwitch:false,
            loading:false,
            searchList:[], // 搜索栏列表
            isSearchData:false, // 当前是否为搜索数据
            saveSearch:'',
            searchValue:'',
            searchBoxSwitch:false,
            searchLoading:false,
            pageInfo: {
                pid:'', // 父id
                id:'', //子id
                type:'', // 类型
                curPage:1, //当前页
                pageSize:24, // 展示数量
                total:0,//游戏列表总数量
            },
        }
    },
    watch:{
        searchValue(val){
            if(val.length){
                this.searchBoxSwitch = true;
                if(this.$common.getUser()){
                let data = {
                    currentPage:1,
                    pageSize:this.pageInfo.pageSize,
                    name:val
                }
                    this.saveSearch = val;
                    this.searchGame(data)
                }else{
                    // this.$message.warning(this.$t('请登录'))
                    this.$common.openLogin()
                    this.searchValue = '';
                }
            }else{
                this.searchBoxSwitch = false;
            }
        }
    },
    methods:{
        clearValue(){
            setTimeout(() => {
                this.searchValue = ''
            },500);
        },
        // 点击展示列表
        clickToShow(val){
            if(!val){
                this.$message.warning(this.$t('当前输入为空'));
                return
            }
            this.pageInfo.curPage = 1;
            let data = {
                currentPage:1,
                pageSize:this.pageInfo.pageSize,
                name:val
            };
            this.saveSearch = val;
            this.gameList = [];
            this.entrySearch(data)
        },
        gameInfo(val){
            this.searchValue = '';
            this.getToken(val);
        },
        // 搜索列表返回值展示
        entrySearch(data){
        this.isSearchData = true;
            let self = this;
            self.$http.post(self.$api.searchGame,data).then((res,err) => {
                if(err){}else{
                    self.searchValue = '';
                    self.showSearchSwitch = true;
                    // self.entrySearchList = res.data.list;
                    self.gameList = res.data.list;
                    self.pageInfo.total = res.data.total;
                    // self.hasNextPage = res.data.hasNextPage;
                }
            });
        },
        // 输入框搜索列表
        searchGame(data){
            let self = this;
            self.$http.post(self.$api.searchGame,data).then((res,err) => {
                if(err){}else{
                    self.searchList = res.data.list;
                }
            });
        },
        // 进入游戏
        getToken: async function(req,index) {
        // return
            let self = this;
                var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
                
            if (!self.$common.getUser()) {
                // self.showLogin = true;
                // self.$message.warning(this.$t('请登录'));
                this.$common.openLogin()
                return
            }
            self.tenantId = self.$common.getUser().tenant_id
            self.username = self.$common.getUser().username
            self.uid = self.$common.getUser().user_id
            let datas = {
                tenantId: self.tenantId,
                username: self.username,
                gameId: req.ids || req.id,
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
.search-header {
    position: relative;
    width: 160px;
    height: 40px;
    color:#000;
    font-weight:normal;
    .search {
        position: absolute;
        width: 180px;
        right: -10px;
        top: 5px;
        margin-left: 20px;
        background: #fff;
        border: 1px solid #fff;
        box-shadow: 0 0 3px rgba(0, 0, 0, .03);
        min-width: 32px;
        height: 24px;
        border-radius: 2px;
        line-height: 24px;
        display: flex;
        #searchstr {
            height: 22px;
            // border-radius:32px 0 0 32px;
            &:-internal-autofill-selected {
                background-color: #fff !important;
            }
        }
        
        input:nth-child(2) {
            height: 24px;
            line-height: 24px;
            background: none;
            border: none;
            font-size: 12px;
            width: 160px;
            text-indent: 3em;
        }
        input:nth-child(1) {
            position: absolute;
            width: 32px;
            height: 32px;
            background: none;
            border: none;
            margin: 0;
            padding: 0;
            background: url(../../assets/image/icons.png) no-repeat -505px -364px;
            cursor: pointer;
            margin-right: 5px;
            margin-top: -4px;
        }
        .searchBox {
            position: absolute;
            left: 0;
            top: 26px;
            width: 100%;
            height: 200px;
            background-color: #fff;
            border-radius:8px;
            overflow-x: hidden;
            overflow-y: auto;
            border:1px solid #ccc;
            z-index: 999;
            .item {
                width: 100%;
                height: 35px;
                text-align: left;
                border-bottom: 1px dotted #ddd;
                box-sizing: border-box;
                padding: 0 10px;
                cursor:pointer;
                font-size: 12px;
                display: flex;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                align-items: center;
                justify-content:space-between;
                border-bottom: 1px dashed #ccc;
                .nameEn{
                    color: #efc77a;
                }
            }
        }
    }
}
</style>