<template>
  <div class="themeColor index">
    <!-- 公告 -->
    <div :class="noticeClass" @click="openNotice">
      <!-- <Notice></Notice> -->
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
            class="noticeContent themeDarkClass"
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
                @click="openNotice"
                >{{ item.content }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 顶部轮播 -->
    <div style="height: 520px; overflow: hidden">
      <div ref="notice" class="main_swiper">
        <main-swiper @getluckyWheelSimple="getluckyWheelSimple"></main-swiper>
      </div>
    </div>
    <!-- 公告弹窗 -->
    <dialog-notice v-if="openDialog" @close="closeNotice"></dialog-notice>
    <!-- 公告 -->
    <ActDetail ref="actDetails" v-if="isShowActDetail" 
    :isShowActDetail.sync="isShowActDetail"></ActDetail>

    <div class="ng-scope">
      <div class="ng-isolate-scope">
        <div class="ng-isolate-title">{{ $t('游戏列表') }}</div>
        <div class="ng-isolate-content">
          <div class="ng-isolate-list">
            <div class="menuList-isolate" v-for="(item,i) in gameMenuList" :key="i" @click="changeCur(item)">
              <div class="icon" :class="'icon' + item.id"></div>
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="gameSport">
      <div class="gameSport-info">
        <div class="title">{{ $t('体育') }}</div>
        <div class="title2">{{ $t('全球领先的体育博彩平台，玩法多样，每天都有礼物') }}</div>
        <div class="sportList">
          <swiper ref="mySwiper" :options="swiperOptionSports" v-show="sportList.length>0" @click.native="getToken">
              <swiper-slide class="list" v-for="(item,i) in sportList" :key="i">
              <img :src="item.imgUrlOne ? ($config.imgHost + item.imgUrlOne) : ($config.imgHost + item.imgUrl)" alt="" srcset="">
            </swiper-slide>
          </swiper>
        </div>
        <div class="btn">{{ $t('CHƠI NGAY') }}</div>
      </div>
    </div>
    <!-- 热门游戏 -->
    <div class="hotgame" v-if="hotGameList.length > 0">
      <div class="game-title">
        <div class="title-left">{{ $t('热门游戏') }}</div>
      </div>
      <hotGame :hotGameList="hotGameList" :index="0" :swiperOption="swiperOption"></hotGame>
    </div>
    <!-- jili -->
    <div class="hotgame jiliGame" v-if="JiliGameList.length > 0">
      <div class="game-title">
        <div class="title-left">{{ $t('吉力电子') }}</div>
      </div>
      <hotGame :hotGameList="JiliGameList" :index="1" :swiperOption="swiperOption1"></hotGame>
    </div>
    <!-- pg -->
    <div class="hotgame pgGame" v-if="PgGameList.length > 0">
      <div class="game-title">
        <div class="title-left">{{ $t('PG电子') }}</div>
      </div>
      <hotGame :hotGameList="PgGameList" :index="2" :swiperOption="swiperOption2"></hotGame>
    </div>

    <!-- 消息 -->
    <div class="newContent">
      <div class="newsLeft">{{$t('TIN TỨC')}}</div>
      <div class="newsRight">
        <swiper :options="swiperOption3">
            <swiper-slide class="item" v-for="(item,index) in newsList" :key="index">
              <img  loading="lazy" class="img" @click="noticesGo()" v-lazy="$config.imgHost + item.pictureApp" />
              <p class="title">{{item.title}}</p>
            </swiper-slide>
        </swiper>
        <!--以下看需要添加-->
        <!-- <div class="swiper-button-prev3 swiper-button-prev"></div> -->
        <div class="swiper-button-next3 swiper-button-next"></div>
      </div>
    </div>

    <!-- 左侧浮窗，热门游戏 -->
    <!-- <div class="hotGameData">
      <hotGameData></hotGameData>
    </div> -->

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
    <!-- 大转盘 -->
    <div class="prize-btn" v-if="showPrize">
      <div class="close-btn" @click="showPrize = false"></div>
      <div class="cur-btn" @click="toWorldCupSports(luckyWheelSimple)"></div>
    </div>
    <!-- 红包 -->
    <!-- <leftAward /> -->
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
import mainSwiper from "./components/index/mainSwiper";
// 公告
import Notice from "./components/index/notice";
// 公告弹窗
import dialogNotice from "../../components/index/dialogNotice";
// 更多 视讯  体育  电竞  彩票   应有尽有
import moreList from "../../components/index/more";
// 全网最佳  电子  棋牌  捕鱼  游戏平台
import bestList from "../../components/index/best";
//超级大奖，累计奖池等你来拿
import superPage from "../../components/index/superPage";
//高额返利

import JackPotNew from "../../components/jackPot/jackPotNew";
// 抢红包活动
// import leftAward from "@/components/leftAward/index";
import doubleDenier from "@/components/doubleDenier/index";
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
    superPage,
    Notice,
    dialogNotice,
    hotGameData,
    hotGame,
    ActDetail,
    JackPotNew,
    // leftAward,
    HomeSbw,
    doubleDenier,
    UsdtFloating,
  },
  data() {
    return {
      rebateShow: false,
      noticeSwitch: false,
      openDialog: false,
      positionNum: 1,
      announcement: {},
      container: "",
      content: "",
      containerWidth: "",
      contentWidth: "",
      mobileLeft: 0,
      left: 0,
      raf: "",
      isShowActDetail: true,
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
      JiliGameList: [],
      PgGameList: [],
      projectImgUrl: window.projectImgUrl,
      gameMenuList:[],
      swiperOptionSports:{
          simulateTouch: true,
          loop: false,
          autoplay: false,
          slidesPerView: 5,
          spaceBetween: 15,
          freeMode: true,
      },
      swiperOption: {
          loop: false,
          slidesPerView: 5,
          navigation: {
              nextEl: '.swiper-button-next0',
              prevEl: '.swiper-button-prev0',
          },
          slidesPerView: 5,
          spaceBetween: 15,
          freeMode: true,
      },
      
      swiperOption1: {
          loop: false,
          navigation: {
              nextEl: '.swiper-button-next1',
              prevEl: '.swiper-button-prev1',
          },
          slidesPerView: 5,
          spaceBetween: 15,
          freeMode: true,
      },
      swiperOption2: {
          loop: false,
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
      gameList:[],
      showPrize:false,
      luckyWheelSimple:{},
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
    this.getGameMenuListData();
    this.getSettings();
    this.hotGameData()
    this.getGuideAd()
  },
  mounted() {
    let _this = this;
    window.onscroll = function () {
      if (document.documentElement.scrollTop > 551) {
        _this.noticeSwitch = true;
      } else {
        _this.noticeSwitch = false;
      }
    };
    // 赋值 总列表
    // this.gameMenuList = JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH"));
    // console.log('xxxxxxxx',this.gameMenuList)
    // setTimeout(()=>{
    //   this.getHotGame('JILI')
    // },300)
    // setTimeout(()=>{
    //   this.getHotGame('PG')
    //   this.getSports()
    // },600)
    // this.getSports()
  },
  watch: {
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
    getluckyWheelSimple(data){
      this.showPrize = true
      this.luckyWheelSimple = data
    },
	    // 转盘活动
    toWorldCupSports(item) {
        if (!this.$common.getUser()) {
            this.$message.warning(this.$t('请先登录'));
            return;
        }
        const obj = {
          activityId: item.urlId,
          token: this.$common.getToken(),
          clientCode: window.clientCode,
          clientItem: window.childCode,
          username: this.$common.getUser().username,
          language: this.$i18n.locale,
          theme: window.theme,
          host: this.$config.baseUrl,
        };
        const str = window.btoa(JSON.stringify(obj));
        const url = window.location.origin + '/func/' + item.expand.actFolder + "/pc/index.html?s=" + str;
        window.open(url);
    },
    getGameMenuListData: async function () {
      let self = this;
      const res = await self.$http.get(self.$api.menusList);
      if (res.code == 0) {
        this.gameList = res.data
        this.gameMenuSort()
      } else {
        this.$message.error(res.msg);
      }
    },
       // 游戏菜单排序
       gameMenuSort() {
      let menuArr = this.gameList
      let menueList = []
      let list= [
  
        {
          name: this.$t("优惠活动"),
          id: 14,
          path: '/activity'
        },
        {
          name: this.$t('VIP'),
          id: 13,
          path: "/vipLevel",
        },
      ]
      menueList = menuArr.sort((pre, cur) => pre.sort - cur.sort);
      let menue = [...menueList, ...list]
      menue.push({ name: this.$t('积分商城'),id: 12,})
      this.gameMenuList = menue
      localStorage.setItem(
        "ALLMENUE_EXCEPT_FISH",
        JSON.stringify(menue)
      );
      // 复制以前的逻辑代码乱的一批
      setTimeout(()=>{
        this.getHotGame('JILI')
      },300)
      setTimeout(()=>{
        this.getHotGame('PG')
        this.getSports()
      },600)
      this.getSports()
    },
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
        // this.swiperOptionSports.loop = this.hotGameList.length > 5 ? true : false
      } else {
          this.$message.error(res.msg);
      }
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
            // this.swiperOption1.loop = this.JiliGameList.length > 4 ? true : false
          }else{
            this.PgGameList = res.data.data.list
            // this.swiperOption2.loop = this.PgGameList.length > 4 ? true : false
          }
        }
      )
      return list
    },
    
    changeCur(item) {
      // let data = (JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH"))).filter(v => {
      //     if (v) {return v.id == item.id}
      // });
      // data = data[0]
      // console.log(item,data,JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH")))
      // const { ids: id, type, imgUrlOne } = data.children && data.children[0] ? data.children[0] : {}
      // const query = { pid: data.id, id, type, imgUrlOne }
      // if (item.id == 1) {
      //   this.$router.push({
      //     path: "/slots",
      //     query
      //   });
      // } else if (item.id == 2) {
      //   this.$router.push({
      //     path: "/sport",
      //     query
      //   });
      // } else if (item.id == 3) {
      //   this.$router.push({
      //     path: "/chess",
      //     query
      //   });
      // } else if (item.id == 4) {
      //   this.$router.push({
      //     path: "/lottery",
      //     query
      //   });
      // } else if (item.id == 5) {
      //   this.$router.push({
      //     path: "/casino",
      //     query
      //   });
      // } else if (item.id == 6 || item.id === 8) {
      //   this.$router.push({
      //     path: "/elec",
      //     query
      //   });
      // } else if (item.id == 7) {
      //   // this.childSwitch = true;
      //   // return
      //   // 捕鱼专用标注
      //   query.id = data.children[0].ids
      //   this.$router.push({path: "/slot", query,});
      // } else {
      //   this.$router.push({ path: "/home" });
      // }
      const { ids: id, type, imgUrlOne } = item.children && item.children[0] ? item.children[0] : {}
      this.childSwitch = false;
      const query = { pid: item.id, id, type, imgUrlOne }
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
        query.id = item.children[0].ids
        this.$router.push({path: "/slot", query,});
      } else if (item.id == 10) {
        this.$router.push({
          path: "/activity",
        });
      } else if (item.id == 11) {
        if (this.$common.getUser()) {
          this.$store.commit("rebate", true);
        } else {
          // this.$message.error(this.$t("请登录"));
          this.$common.openLogin()
        }
      } else if (item.id == 12) {
        if (!this.$common.getUser()) return this.$common.openLogin()
        this.$router.push({
          path: "/mall",
        });
      } else if (item.id == 13) {
        if (!this.$common.getUser()) return this.$common.openLogin()
        this.$router.push({
          path: "/vipLevel",
        });
      } else if (item.id == 9) {
        this.$router.push({
          path: "/home",
          query: {
            scroll: this.num++,
          },
        });
        this.$emit("scrollToCode");
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
        let realIndex = this.$refs.mySwiper.$swiper.clickedIndex
        let req = this.sportList[realIndex]
        console.log(this.sportList,req,'req')
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
            if(req.name == 'CMD') return window.location.href = res.data
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
  display: flex;
  align-items: center;
}

.uniqueShuffling i {
  width: 30px;
  height: 30px;
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

  color: var(--themeDark);
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
      color: #fead00;
      font-size: 16px;
      text-decoration: none;
      line-height: 34px;
    }
  }
}

.index {
  position: relative;
  min-width: 1200px;

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
    height: 520px;
    // background-color: pink;
    text-align: center;
  }

  .notice {
    // position: absolute;
    // left: 0;
    // top: 0;
    width: 100%;
    background-color: $notice-bg;
    z-index: 90;
    cursor: pointer;
  }

  .fixed {
    position: fixed;
    left: 0;
    top: 130px;
    width: 100%;
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
    padding: 10px 0;
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
            // @for $i from 1 to 8{
            //   .icon#{$i}{
            //     background: url(../../assets/image/qqImg/menu-islotae#{$i}.png) no-repeat 0px -70px/70px #fff;
            //   }
            // }
          }
          .icon{
            display: block;
            width: 50px;
            height: 50px;
            margin: 0 auto 30px;
            // border-radius: 50%;
          }
         
          @for $i from 1 to 15{
            .icon#{$i}{

              background: url(~@/assets/image/qqImg/menuicon-#{$i}.png) no-repeat center/contain;
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
  width: 1200px;
  margin: 30px auto 0;
  position: relative;
  .game-title{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 20px;
    font-size: 25px;
    font-weight: bold;
    color: #fead00;
    .title-left{
      padding-left: 50px;
      background: url(../../assets/image/qqImg/hot-icon.png) no-repeat left center/contain;
    }
  }
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

.prize-btn{
  position:fixed;
  width:194px;
  height:200px;
  left:20px;
  bottom:20px;
  background:url('~@/assets/image/price-bg.gif') no-repeat center/contain;
  z-index:1000;

}
.close-btn{
  position: absolute;
    width: 23px;
    height: 34px;
    left: 0;
    top: -20px;
    cursor: pointer;
    z-index: 900;
    background: url('~@/assets/image/close.png') no-repeat center center;
    background-size: contain;
    
}
.cur-btn{
  position:absolute;
  width:270px;
  height:200px;
  cursor:pointer;
  bottom:0;
}
</style>

