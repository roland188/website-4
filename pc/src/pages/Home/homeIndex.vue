<template>
  <div class="themeColor index">
    
    <!-- 顶部轮播 -->
    <div style="height: 3rem; overflow: hidden">
      <div ref="notice" class="main_swiper">
        <main-swiper></main-swiper>
      </div>
    </div>

    <!-- 公告 -->
    <div :class="noticeClass" @click="openNotice">
      <!-- <Notice></Notice> -->
      <div style=" width: calc(100% - 0.6rem)">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1200px;
            margin: 0 auto;
          "
        >
          <div
            class="header-left-information uniqueShuffling"
            style="width: 1200px"
          >
            <i></i>
            <div
              class="noticeContent themeLightClass"
              style="text-align: left; color: #ffffff"
              ref="external"
              @mouseleave="removed"
              @mouseenter="move"
            >
              <div ref="animationContainer">
                <span
                  style="margin-right: 100%"
                  class="uniqueShufflingColor"
                  ref="animationContent"
                  v-for="(item, index) in announcement.content"
                  :key="index"
                  @click="openNoticeInfo(2, item)"
                  >{{ item.content }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mailbox">
        <img
          loading="lazy"
          v-lazy="require('../../assets/image/qqImg/mailbox.png')"
          alt
        />
      </div>
      
    </div>

    <!-- 公告弹窗 -->
    <dialog-notice v-if="openDialog" @close="closeNotice"></dialog-notice>
    <!-- 公告 -->
    <ActDetail ref="actDetails"></ActDetail>
    <div class="game-list">
      <div class="top-games">
        <div class="game-tab">
          <div :class="{'tab-item' : true, 'active':curTabIndex == 0}" @click="curTabIndex=0">
            <img :src="require('../../assets/image/qqImg/icon_dtfl_2rm_1.png')"/>
            <div class="tab-title">{{ $t('热门游戏') }}</div>
          </div>
          <div :class="{'tab-item' : true, 'active':curTabIndex == 1}" @click="curTabIndex=1">
            <img :src="require('../../assets/image/qqImg/icon_dtfl_2zj_1.png')"/>
            <div class="tab-title">{{ $t('最近') }}</div>
          </div>
          <div :class="{'tab-item' : true, 'active':curTabIndex == 2}" @click="curTabIndex=2">
            <img :src="require('../../assets/image/qqImg/icon_dtfl_2sc_1.png')"/>
            <div class="tab-title">{{ $t('最喜欢') }}</div>

          </div>
        </div>
        <!-- 热门游戏 -->
        <div class="hotgame" v-if="curTabIndex == 0">
          <hotGame :hotGameList="hotGameList" :index="0" :swiperOption="swiperOption"></hotGame>
        </div>
        <div class="hotgame" v-if="curTabIndex == 1">
          <hotGame :hotGameList="recentGameList" :index="0" :swiperOption="swiperOption"></hotGame>
        </div>
        <div class="hotgame" v-if="curTabIndex == 2">
          <hotGame :hotGameList="favoriteGameList" :index="0" :swiperOption="swiperOption"></hotGame>
        </div>
      </div>
      
      <div class="category-games">
        <div class="games-group">
          <div v-for="(item, i) in gameMenuList" :key="i" ref="scrollMenuItems">          
            <div class="group-item" v-if="i > 0">
              <div class="game-title">
                <span :class="'game-icon' + item.id"></span>
                <span class="game-label">{{ item.name }}</span>   
              </div>
              <div class="game-content">
                <div v-for="(childItem, childIdx) in childrens(i)" :key="childIdx" class="game">
                  <div class="game1">
                    <img :src="$config.getImgUrl(childItem.imgUrl)"/>
                    <div class="hover">
                      <span>{{ $t('进入游戏') }}</span>                      
                    </div>
                  </div>
                </div>              
              </div>
              <div class="show-more" v-if="expandedFlag[i] === false">
                <span>{{ $t('显示')  + item.children?.length + $t('个') + item.name  + $t('游戏中的')+ (item.children.length > 3 ? 3 : item.children.length) + $t('个') }}</span>
                <span class="btn-more" @click="expandList(i)">{{ $t('下载更多') }} <i class="el-icon-arrow-down"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>

    <!-- 回到顶部按钮 -->
    <el-backtop :visibility-height="50" :right="10">
      <div class="actToTop">
        <img
          loading="lazy"
          v-lazy="require('../../assets/image/qqImg/act-toTop-hover.png')"
          alt
        />
      </div>
    </el-backtop>
    <JackPotNew />
    <Home-sbw> </Home-sbw>
     <!-- usdt浮窗 -->
    <UsdtFloating  v-show="$route.path == '/home'"/>
    <!-- 红包 -->
    <leftAward />
    <!-- 电子闯关 -->
    <doubleDenier />
  </div>
</template>

<script>
let vm = null
// 顶部
//左侧浮窗，热门游戏
import hotGameData from "@/components/index/hotGameData";
import hotGame from './hotGame.vue'
// 首页轮播
import mainSwiper from "../../components/index/mainSwiper";
// 公告
import Notice from "../../components/index/notice";
// 公告弹窗
import dialogNotice from "../../components/index/dialogNotice";
// 更多 视讯  体育  电竞  彩票   应有尽有
import moreList from "../../components/index/more";
// 全网最佳  电子  棋牌  捕鱼  游戏平台
import bestList from "../../components/index/best";
//业内最顶尖的手机投注app
import Cenbanner from "../../components/index/Cenbanner";
//超级大奖，累计奖池等你来拿
import superPage from "../../components/index/superPage";
//高额返利

import JackPotNew from "../../components/jackPot/jackPotNew";
// 抢红包活动
import leftAward from "@/components/leftAward/index";
import doubleDenier from "@/components/doubleDenier/index";
// 底部
// import footerItem from '@/components/footer'
// import heaDer from '../../components/index/header'
import ActDetail from "@/pages/actDetail/actDetail";
// import UsdtFloating from "@/components/usdtFloating";
// 水球打码活动
import HomeSbw from '../../components/homeSbw/sbw.vue';
//usdt 浮窗
import UsdtFloating from "@/components/usdtFloating/index.vue"
import api from '../../utils/api'; //接口名字

export default {
  name: "home",
  components: {
    mainSwiper,
    moreList,
    bestList,
    Cenbanner,
    superPage,
    Notice,
    dialogNotice,
    // floating,
    hotGameData,
    hotGame,
    ActDetail,
    JackPotNew,
    leftAward,
    HomeSbw,
    doubleDenier,
    UsdtFloating
    // footerItem,
    // heaDer,
  },
  data() {
    return {
      rebateShow: false,
      noticeSwitch: false,
      openDialog: false,
      positionNum: 1,
      curTabIndex: 0,
      announcement: {},
      container: "",
      content: "",
      containerWidth: "",
      contentWidth: "",
      mobileLeft: 0,
      left: 0,
      raf: "",
      scrollIsTrue: true,
      noData: require('../../assets/image/pubilc/searchlost.png'),
      sportList:[
        {
          type:1,
          iconUrl: require("../../assets/image/qqImg/sports-icon1.png"),
        },
        {
          type:2,
          iconUrl: require("../../assets/image/qqImg/sports-icon2.png"),
        },
        {
          type:3,
          iconUrl: require("../../assets/image/qqImg/sports-icon3.png"),
        },
        {
          type:4,
          iconUrl: require("../../assets/image/qqImg/sports-icon4.png"),
        },
      ],
      menuList:[
        {
          id: 5,
          title: this.$t('真人视讯')
        },
        {
          id: 1,
          title: this.$t('电子游戏')
        },
        {
          id: 3,
          title: this.$t('棋牌游戏')
        },
        // {
        //   id: 6,
        //   title: this.$t('电竞赛事')
        // },
        {
        	id: 7,
        	title: this.$t('捕鱼游戏')
        },
        {
          id: 2,
          title: this.$t('体育赛事')
        },
        {
        	id: 8,
        	title: this.$t('斗鸡')
        },
        {
          id: 4,
          title: this.$t('彩票游戏')
        },
      ],
      
      hotGameList: [],
      recentGameList: [],
      favoriteGameList: [],
      JiliGameList: [],
      PgGameList: [],
      gameMenuList:[],
      expandedFlag: [],
      swiperOptionSports:{
          simulateTouch: true,
          loop: false,
          autoplay: false,
          slidesPerView: 5,
          spaceBetween: 15,
          freeMode: true,
      },
      swiperOption: {
          simulateTouch: false,
          loop: true,
          autoplay: false,
          navigation: {
              nextEl: '.swiper-button-next0',
              prevEl: '.swiper-button-prev0',
          },
          slidesPerView: 5,
          spaceBetween: 15,
          freeMode: true,
      },
      
      swiperOption1: {
          loop: true,
          autoplay: false,
          simulateTouch: false,
          navigation: {
              nextEl: '.swiper-button-next1',
              prevEl: '.swiper-button-prev1',
          },
          slidesPerView: 5,
          spaceBetween: 15,
          freeMode: true,
      },
      swiperOption2: {
          loop: true,
          autoplay: false,
          simulateTouch: false,
          navigation: {
              nextEl: '.swiper-button-next2',
              prevEl: '.swiper-button-prev2',
          },
          slidesPerView: 5,
          spaceBetween: 15,
          freeMode: true,
      },
      swiperOption3:{
        loop: false,
        autoplay: false,
        navigation: {
            nextEl: '.swiper-button-next3',
            prevEl: '.swiper-button-prev3',
        },
        slidesPerView: 3,
        spaceBetween: 30,
        freeMode: true,
      },
      newsList:[],
    };
  },

  computed: {
    noticeClass: function () {
      return {
        notice: !this.noticeSwitch,
        fixed: this.noticeSwitch,
      };
    },
  },
  created() {
    vm = this
    let data = {
      currentPage: 1,
      pageSize: 10,
    };
    let i = 0;
    let setIntval = setInterval(() => {
      i++;
      if (i > 3) {
        clearInterval(setIntval);
      } else {
        this.$http.post(this.$api.announcement, data).then((res) => {
          if (res && res.data && res.data.content.length > 0) {
            this.announcement = res.data;
            clearInterval(setIntval);
          }
        });
      }
    }, 10);
    window.requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 6000 / 60);
        }
      );
    })();
    this.getSettings();
    this.hotGameData()
    this.getGuideAd()
  },
  mounted() {
    let _this = this;
    
    // 赋值 总列表
    this.gameMenuList = JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH"));    
    this.gameMenuList = this.gameMenuList?.map((item) => {
      if(item?.children?.length > 3){
        this.expandedFlag.push(false);
      } else {                
        this.expandedFlag.push(true);
      }
      return item;
    });
    
    window.addEventListener('scroll', this.handleWindowScroll);

    setTimeout(()=>{
      this.getHotGame('JILI')
    },300)
    setTimeout(()=>{
      this.getHotGame('PG')
      this.getSports()
    },600)
    this.getSports()
  }, 
  beforeDestroy() {
    // Remove the scroll event listener when the component is destroyed
    window.removeEventListener('scroll', this.handleWindowScroll);
  },
  watch: {    
    "$store.state.curScrollFromMenuIdx"(indexToScroll) {
      //彩金状态
      if (indexToScroll >= 1) {
        const elementToScroll = this.$refs.scrollMenuItems[indexToScroll];
        if (elementToScroll) {
          const elementTop = elementToScroll.offsetTop;
          window.scrollTo({ top: elementTop});
        }
        
      } else {
        window.scrollTo({ top: 0});
        
      }
    },
    // '$route.query'(val){
    //   if(val.scroll){
    //     this.scrollToCode()
    //   }
    // }
  },
  updated() {
    this.$nextTick(() => {
      this.container = this.$refs.animationContainer; //外部盒子
      this.content = this.$refs.animationContent; //内容盒子
      this.external = this.$refs.external;
      this.containerWidth = this.container.offsetWidth; //外部容器宽度
      if (this.content) {
        this.contentWidth = this.content[0].offsetWidth; //内容宽度
      }
      this.externalWidth = this.external.offsetWidth;
      setTimeout(() => {
        window.requestAnimationFrame = (function () {
          return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
              window.setTimeout(callback, 6000 / 60);
            }
          );
        })();
        if (
          this.contentWidth < this.containerWidth &&
          this.scrollIsTrue == true &&
          this.announcement.content &&
          this.announcement.content.length > 0
        ) {
          this.scrollIsTrue = false;
          this.announcement.content.push(...this.announcement.content);
        }
        if (this.announcement.content && this.announcement.content.length > 0) {
          this.raf = requestAnimationFrame(this.animation);
        }
      }, 500);
    });
  },
  methods: {
    // 公告信息
    getGuideAd() {
      let self = this;
      self.$http.get(self.$api.getGuideAd).then((res) => {
        if (res && res.code == 0) {
          self.newsList = res.data;
          this.swiperOption3.loop = this.newsList.length > 2 ? true : false
        }
      });
    },
    // 获取热门游戏数据
    async hotGameData(){
      let data = '';
      const res = await this.$http.get(this.$api.hotGame, data, false);
      if (res.code == 0) {
        this.hotGameList = res.data;
        this.swiperOptionSports.loop = this.hotGameList.length > 5 ? true : false
      } else {
          this.$message.error(res.msg);
      }
    },
    expandList(idx) {
      this.$set(this.expandedFlag, idx, true);
    },
    handleWindowScroll() {
      const currentScrollTop = window.scrollY;
      let curGameIdx = 0;
      this.$refs.scrollMenuItems?.forEach((elementToScroll, idx) => {
        if (elementToScroll) {
          const elementTop = elementToScroll.offsetTop;
          if(elementTop - 60 < currentScrollTop)
            curGameIdx = idx;
        }
      });
      this.$store.commit('curMenuIdxFromScroll', curGameIdx);
    },
    childrens(id) {
      if(!this.gameMenuList[id].children) return [];
      if(this.expandedFlag[id])
        return this.gameMenuList[id].children;
      else
        return this.gameMenuList[id].children.slice(0, 3);
    },
    getSports(){
      // 体育
      let sportsList = this.gameMenuList.find(v => {
          return v.id == 2;
      })
      this.sportList = sportsList.children
    },
    getHotGame(type){
      // 电子游戏
      console.log(this.gameMenuList);
      let casinoData = this.gameMenuList.find(v => {
          return v.id == 1;
      })
      let gameData = casinoData.children.find(li => {
        return li.nameEn == type
      });;
      let  data = {
        currentPage: 1,
        pageSize: 18,
        gameKindId: 1,
        vendorId: gameData.ids,
      }
      let list = []
      let self = this;
      self.$http.pnPost(
        self.$api.vendorGame,data,true,(res) => {
          list = res.data.data.list
          if(type == 'JILI'){
            this.JiliGameList = res.data.data.list
            this.swiperOption1.loop = this.JiliGameList.length > 4 ? true : false
          }else{
            this.PgGameList = res.data.data.list
            this.swiperOption2.loop = this.PgGameList.length > 4 ? true : false
          }
        }
      )
      return list
    },
    
    changeCur(item) {
      let data = (JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH"))).filter(v => {
          if (v) {return v.id == item.id}
      });
      data = data[0]
      console.log(item,data,JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH")))
      const { ids: id, type, imgUrlOne } = data.children && data.children[0] ? data.children[0] : {}
      const query = { pid: data.id, id, type, imgUrlOne }
      if (item.id == 1) {
        this.$router.push({
          path: "/slots",
          query
        });
      } else if (item.id == 2) {
        this.$router.push({
          path: "/sport",
          query
        });
      } else if (item.id == 3) {
        this.$router.push({
          path: "/chess",
          query
        });
      } else if (item.id == 4) {
        this.$router.push({
          path: "/lottery",
          query
        });
      } else if (item.id == 5) {
        this.$router.push({
          path: "/casino",
          query
        });
      } else if (item.id == 6 || item.id === 8) {
        this.$router.push({
          path: "/elec",
          query
        });
      } else if (item.id == 7) {
        // this.childSwitch = true;
        // return
        // 捕鱼专用标注
        query.id = data.children[0].ids
        this.$router.push({path: "/slot", query,});
      } else {
        this.$router.push({ path: "/home" });
      }
    },
    // 全民返利
    getSettings() {
      this.$http.get(this.$api.getSettings, "allowance_on").then((res) => {
        if (res.code === 0) {
          if (res.data.svalue) {
            if (res.data.svalue.allowance_on === 0) {
              this.rebateShow = false;
            } else {
              // this.list.push({ name: "全民返利",id:10 });
              this.rebateShow = true;
            }
          } else {
            this.rebateShow = false;
          }
        }
      });
    },
    //点击进入游戏
    async getToken() {
        let realIndex = this.$refs.mySwiper.$swiper.realIndex
        let req = this.sportList[realIndex]
        let self = this;
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
            'gameId':  req.type == 2 ? req.ids : req.id,
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
    },
    rebateInfo() {
      if (!this.rebateShow) {
        return this.$message.warning(this.$t("未开启"));
      } else if (this.$common.getUser() && this.rebateShow) {
        this.$store.commit("rebate", true);
      } else {
        // this.$message.warning(this.$t("请登录"));
        this.$common.openLogin()
      }
    },
    move() {
      cancelAnimationFrame(this.raf);
    },
    removed() {
      requestAnimationFrame(this.animation);
    },
    animation() {
      cancelAnimationFrame(this.raf);
      if (this.container.style.left === "") {
        this.container.style.left = 0;
      }
      if (parseInt(this.container.style.left, 10) > -this.contentWidth) {
        this.mobileLeft = this.mobileLeft - 1;
        this.container.style.left = `${this.mobileLeft}px`;
        this.raf = requestAnimationFrame(this.animation);
      } else {
        this.announcement.content.push(this.announcement.content.shift());
        this.mobileLeft = this.containerWidth;
        this.mobileLeft = this.mobileLeft - 1;
        this.addData = true;
        this.container.style.left = `${this.mobileLeft}px`;
        this.raf = requestAnimationFrame(this.animation);
      }
    },
    showMosaic() {
      this.$refs.According.According();
    },
    // 快速充值
    quickRecharge() {
      if (!this.$common.getUser()) {
        // this.$message({
        //   message: this.$t("请先登录"),
        //   type: "warning",
        // });
        this.$common.openLogin()
        return;
      }
      //新窗口跳转
      const { href } = this.$router.resolve({
        name: "recharge",
      });
      window.open(href, "_blank");
    },
    // 在线客服
    onlineTalk() {
      let url = this.$common.getCustomerService();
      window.open(url, "_blank");
    },
    openNotice() {
      this.openDialog = true;
    },
    closeNotice() {
      this.openDialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.uniqueShuffling {
  padding: .06rem .2rem;
  display: flex;
  align-items: center;
}

.uniqueShuffling i {
  width: .30rem;
  height: .32rem;
  display: inline-block;
  background: url("../../assets/image/notice-icon.png") no-repeat center/contain;;
}

.noticeContent {
  width: 100%;
  height: 37px;
  line-height: 37px;
  font-size: 0.12rem;
  font-weight: 500;
  white-space: nowrap;

  color: var(--themeLight);
  overflow: hidden;
  position: relative;

  div {
    display: inline-block;
    width: 100%;
    position: absolute;
    white-space: nowrap;

    span {
      display: inline-block;
      vertical-align: middle;
      margin: 0 5px;
      color: #666666;
      font-size: 16px;
      text-decoration: none;
      line-height: 34px;
    }
  }
}

.index {
  position: relative;
  width: 100%;
  
  .game-list {
    width: 100%;
    margin-top: .2rem;
    background-color: white;
    box-shadow: 0 0.03rem 0.09rem 0 rgba(0,0,0,.06);
    z-index: 90;
    border-radius: 0.1rem;
    color:#666666;
    display: flex;
    align-items: center;
    flex-direction: column;
    .top-games {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin: .2rem .2rem 0;
      width: 100%;
      .game-tab {
        display: flex;
        height: 0.7rem;
        width: 100%;
        border-bottom: 1px solid #e3e3e3;
        .tab-item {
          display: flex;
          align-items: center;
          position: relative;
          width: max-content;
          margin-right: .6rem;
          img {
            width: 0.3rem;
            height: 0.3rem;
          }
          .tab-title {
            margin-left: 0.1rem;
            font-size: 0.25rem;
            text-align: center;
            white-space: pre-line;
            word-break: break-word;
          }
        }
        .tab-item.active {
          &::after {
            background-color: #866638;
            bottom: -0.01rem;
            content: "";
            display: block;
            height: 0.03rem;
            left: 0px;
            position: absolute;
            width: 100%;
          }
        }
        
      }
    }
    .category-games {
      flex: 1;
      display: flex;    
      flex-direction: column;
      margin: 0.2rem 0.2rem 0;
      width: 100%;
      .games-group {
        padding: .2rem;
        .group-item {
          border-top: 1px solid #e3e3e3;
          display: flex;      
          justify-content: flex-start;  
          padding: .3rem 0;
          flex-direction: column;
          .game-title {
            display: flex;
            margin-bottom: .3rem;
            .game-label {
              font-size: 0.26rem;
              color: #333333;
            }
          }
          .game-content {
            display: flex;
            flex-wrap: wrap;
            .game {
              width: 33%;
              display: flex;
              justify-content: center;
              align-items: center;
              .game1 {
                width: fit-content;
                height: fit-content;
                border-radius: 0.1rem;
                border: thin solid #FFF;
                margin: 0.1rem;
                position: relative;
                cursor: pointer;
                img {
                  width: 3.74rem;
                  height: 1.46rem;
                  border-radius: 0.1rem;
                  object-fit: cover;
                }

                .hover {
                  background-color: transparent;
                  transition: background-color 400ms linear;
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  left: 0;
                  top: 0;
                  border-radius: .1rem;
                  display: flex; 
                  justify-content: center;                 
                  align-items: center;
                  span {
                    border: 1px solid #FFF;
                    color: #FFF;
                    padding: 0.1rem 0.04rem;
                    border-radius: 0.1rem;
                    display: none;      
                    transition: display 400ms linear;              
                  }
                  &:hover {
                    background-color: rgb(134 102 56 / 66%);
                    span {
                      display: block;
                    }
                  }
                }
              }
              
            }

          }
          .show-more {
            text-align: center;
            margin-top: 0.3rem;
            .btn-more{
              font-weight: 700;
              cursor: pointer;
            }
          }
        }
      }
    }
    
    
  }
  // overflow:auto;
  // z-index: 98;
  .hotGameData {
    z-index: 999;
    width: 300px;
    height: 250px;
    position: fixed;
    left: 0;
    bottom: 10px;
  }

  .el-backtop {
    border-radius: 0;
  }

  .actToTop {
    img {
      width: 100%;
    }
  }

  .placeholder {
    width: 100%;
    height: 196px;
  }

  .main_swiper {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 3rem;
    // background-color: pink;
    text-align: center;
  }

  .notice {
    // position: absolute;
    // left: 0;
    // top: 0;
    width: 100%;
    margin-top: .2rem;
    background-color: white;
    box-shadow: 0 0.03rem 0.09rem 0 rgba(0,0,0,.06);
    z-index: 90;
    border-radius: 0.1rem;
    color:#666666;
    cursor: pointer;
    display: flex;
    align-items: center;
    .mailbox {
      width: 0.6rem;
      height: 100%;
      background: white;
      padding-right: 0.15rem;
      z-index: 5;
      img {
        width: 0.44rem;
        height: 100%;
      }
    }
  }

  .fixed {
    position: fixed;
    left: 0;
    top: 130px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 99;
    cursor: pointer;
  }

  .best_platform {
    position: relative;
    padding-bottom: 40px;
    border-bottom: 1px solid #1a1a1a;

    .best_inner {
      margin: 0 auto;
      margin-top: 0;
      width: 1200px;

      .title {
        position: relative;
        width: 1200px;
        height: 58px;
        margin: 40px auto 37px;
        background: url(../../assets/image/gameImg/index/container_img01.png)
          50% 0 no-repeat;

        .quick_recharge {
          float: left;
          margin-top: 3px;
          width: 180px;
          height: 50px;
          background: url(../../assets/image/gameImg/index/btn_add_credit.png)
            50% 0 no-repeat;

          &:hover {
            background-position: 50% 100%;
          }
        }
      }

      .service_online {
        float: right;
        margin-top: 3px;
        width: 180px;
        height: 50px;
        background: url(../../assets/image/gameImg/index/btn_service.png)
          50% 0 no-repeat;

        &:hover {
          background-position: 50% 100%;
        }
      }
    }
  }
}

.more_pro {
  position: relative;
  background-color: #000;

  .best_inner {
    margin: 0 auto;
    width: 1200px;
  }
}
.left-floating-container {
  position: fixed;
  left: 0;
  top: 20%;
  z-index: 9999;
}
.ng-scope{
    margin: 0 center;
  .ng-isolate-scope{ 
    width: 1200px;
    margin:  auto;
    padding: 50px 0;
    .ng-isolate-title{
      margin: 50px auto 30px;
      color: #fead00;
      font-size: 46px;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      position: relative;
      &::after,&::before{
        content: '';
        position: absolute;
        width: 358px;
        height: 24px;
        background-position: center;
        background-repeat: no-repeat;
      }
      &::after{
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: url(../../assets/image/qqImg/ng-isolate-title-right.png) no-repeat right center/80%;
      }
      &::before{
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: url(../../assets/image/qqImg/ng-isolate-title-left.png) no-repeat left center/80%;
      }
    }
    .ng-isolate-content{
      width: 100%;
      .ng-isolate-list{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .menuList-isolate{
          color: #fff;
          width: 152px;
          height: 180px;
          cursor: pointer;
          border-radius: 20px;
          border: solid 1px #feac00;
          background-color: #111;
          padding: 25px 20px;
          box-sizing: border-box;
          position: relative;
          text-align: center;
          &:hover{
            color: #000;
            background-color: #feac00;
            @for $i from 1 to 8{
              .icon#{$i}{
                background: url(../../assets/image/qqImg/menu-islotae#{$i}.png) no-repeat 0px -70px/70px #fff;
              }
            }
          }
          .icon{
            display: block;
            width: 70px;
            height: 70px;
            margin: 0 auto 20px;
            border-radius: 50%;
          }
          @for $i from 1 to 8{
            .icon#{$i}{
              background: url(../../assets/image/qqImg/menu-islotae#{$i}.png) no-repeat 0px 0px/70px #fead00;
            }
          }
        }
      }
    }
  }
}
.gameSport{
  width: 1200px;
  height: 505px;
  margin: 50px auto 0;
  background: url(../../assets/image/qqImg/game-bg.png) no-repeat center/contain;
  .gameSport-info{
    float: right;
    width: 500px;
    margin: 40px 25px 0 0;
    color: #fff;
    .btn{
      display: block;
      width: 155px;
      height: 55px;
      line-height: 55px;
      text-align: center;
      color: #fff;
      cursor: pointer;
      border-radius: 25px;
      background: #fead00;
    }
    .title{
      font-size: 60px;
      font-weight: bold;
      color: #fead00;
    }
    .title2{
      font-size: 18px;
    }
    .sportList{
      display: flex;
      align-items: center;
      margin: 20px 0;
      justify-content: space-between;
      .list{
          width: 71px;
          height: 83px;
          margin-right: 30px;
          cursor: pointer;
          background: url(../../assets/image/qqImg/sports-gamebg.png) no-repeat 0px 1px/70px;
          &:hover{
            background: url(../../assets/image/qqImg/sports-gamebg.png) no-repeat 0px -81px/70px;
          }
          img{
            width: 71px;
            height: 83px;
          }
      }
    }
  }
}
.hotgame{
  width: 100%;
  margin: 0.1rem auto 0;
  position: relative;
  
}
.jiliGame{
  .game-title{
    .title-left{
      background: url(../../assets/image/qqImg/hot-icon.png) no-repeat left center/contain;
    }
  }
}
.jiliGame .game-title .title-left{
  background: url(../../assets/image/qqImg/jili-icon.png) no-repeat left center/contain;
}
.pgGame .game-title .title-left{
  padding-left: 60px;
  background: url(../../assets/image/qqImg/pg-icon.png) no-repeat left center/contain;
}

.newsRight .swiper-button-next{
  --swiper-navigation-color: #fead00 !important;
  border-left: none;
  &::after{
    font-size: 50px;
    font-weight: 600;
  }
}
.newContent{
  width: 1200px;
  position: relative;
  margin: 20px auto;
  padding: 30px 0 60px;
  border-radius: 37px;
  border-bottom: 1px solid #fead00;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .newsLeft{
    width: 10%;
    color: #fead00;
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    transform: rotate(180deg);
    writing-mode: vertical-rl;
  }
  .newsRight{
    width: 90%;
    height: 420px;
    padding: 0 40px 0 0;
  }
  .swiper-slide{
    width: 333px !important;
    border: 1px solid #fead00;
    &:hover .title{
      color: #111;
      background: #fead00;
    }
    img{
      width: 100%;
      height: 196px;
    }
    .title{
      width: 100%;
      position: relative;
      display: flex;
      align-items: top;
      display: inline-block;
      height: 250px;
      margin: 0;
      padding: 10px 20px;
      color: #fff;
      font-size: 15px;
      text-align: justify;
      border-top: 1px solid #fead00;
      background: #111;
      box-sizing: border-box;
      &::after{
        content: 'xem thêm >>>';
        position: absolute;
        right: 20px;
        bottom: 10px;
        font-size: 14px;
        text-transform: uppercase;
      }
    }
  }
}

@for $i from 0 to 13 {
  .game-icon#{$i} {
    width: 0.5rem;
    height: 0.36rem;
    display: block;
    background: url("../../assets/image/qqImg/menuicon-#{$i}-active.png")
      no-repeat
      center/contain;
  }
}

</style>

