<template>
  <div class="themeColor index">
    <!-- 顶部轮播 -->
    <div style="height: 520px; overflow: hidden">
      <div ref="notice" class="main_swiper">
        <main-swiper @getluckyWheelSimple="getluckyWheelSimple"></main-swiper>
      </div>
    </div>
    <!-- 公告 -->
    <div class="notice" @click="openNotice">
      <!-- <Notice></Notice> -->
      <div class="runMsg">
        <div
          class="header-left-information uniqueShuffling"
          style="width: 1200px"
        >
          <i></i>
          <span>{{$t('通知')}}</span>
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
          <PrizePool></PrizePool>
        </div>
      </div>
    </div>
    <!-- 公告弹窗 -->
    <dialog-notice v-if="openDialog" @close="closeNotice"></dialog-notice>
    <!-- 公告 -->
    <ActDetail ref="actDetails"></ActDetail>
    <div class="ng-scope">
      <div class="ng-isolate-scope">
        <div class="ng-isolate-content">
          <div class="ng-isolate-list">
            <div class="menuList-isolate" v-for="(item,i) in menuList" :key="i" @click="changeCur(item)">
              <div class="exterior">
                <div class="icon" :class="'icon'+(i+1)"></div>
                <div class="title">{{ item.title }}</div>
              </div>
              <div class="in">
                <div class="game_in" :class="'game_in'+(i+1)">
                    <div :class="'gamebg_'+(i+1)"></div>
                    <div class="game_text1">{{ item.text1 }}</div>
                    <div class="game_text2">
                      <p>{{ item.text2 }}</p>
                      <p>{{ item.text3 }}</p>
                    </div>
                    <div class="game_btn">{{ $t('访问') }}</div>
                </div>
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
          v-lazy="require('@/assets/image/qqImg/act-toTop-hover.png')"
          alt
        />
      </div>
    </el-backtop>
    <JackPotNew />
    <Home-sbw> </Home-sbw>
     <!-- usdt浮窗 -->
    <UsdtFloating  v-show="$route.path == '/home'"/>
    <!-- 红包 -->
    <!-- <leftAward /> -->
    <!-- 电子闯关 -->
    <doubleDenier />
    <!-- 大转盘 -->
    <div class="prize-btn" v-if="showPrize">
      <div class="close-btn" @click="showPrize = false"></div>
      <div class="cur-btn" @click="toWorldCupSports(luckyWheelSimple)"></div>
    </div>
  </div>
</template>

<script>
let vm = null
// 顶部
// 首页轮播
import mainSwiper from "../../components/index/mainSwiper";
// 公告
import Notice from "./components/index/notice";
// 公告弹窗
import dialogNotice from '@/components/index/dialogNotice'
// 全网最佳  电子  棋牌  捕鱼  游戏平台
import bestList from "../../components/index/best";
//高额返利
import JackPotNew from "../../components/jackPot/jackPotNew";
// 抢红包活动
// import leftAward from "@/components/leftAward/index";
import doubleDenier from "@/components/doubleDenier/index";
import ActDetail from "@/pages/actDetail/actDetail";
// 水球打码活动
import HomeSbw from '../../components/homeSbw/sbw.vue';
//usdt 浮窗
import UsdtFloating from "@/components/usdtFloating/index.vue"
import PrizePool from './prizePool.vue'
import api from '../../utils/api'; //接口名字

export default {
  name: "home",
  components: {
    mainSwiper,
    bestList,
    Notice,
    dialogNotice,
    ActDetail,
    JackPotNew,
    // leftAward,
    HomeSbw,
    doubleDenier,
    UsdtFloating,
    PrizePool,
    // footerItem,
    // heaDer,
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
      scrollIsTrue: true,
      noData: require('@/assets/image/pubilc/searchlost.png'),
      sportList:[
        {
          type:1,
          iconUrl: require("@/assets/image/qqImg/sports-icon1.png"),
        },
        {
          type:2,
          iconUrl: require("@/assets/image/qqImg/sports-icon2.png"),
        },
        {
          type:3,
          iconUrl: require("@/assets/image/qqImg/sports-icon3.png"),
        },
        {
          type:4,
          iconUrl: require("@/assets/image/qqImg/sports-icon4.png"),
        },
      ],
      menuList:[
        {
          id: 5,
          title: this.$t('西甲合作伙伴'),
          text1:'SPAIN PRIMERA LALIGA',
          text2:'TOP 5 GIẢI ĐẤU HÀNG ĐẦU CHÂU ÂU',
          text3:'ĐỐI TÁC CHÍNH THỨC DUY NHẤT TẠI CHÂU Á',
        },
        {
          id: 1,
          title: this.$t('现场清凉'),
          text1:'Sự kiện',
          text2:'thể thao đặc sắc',
          text3:'MC nữ gợi cảm',
        },
        {
          id: 2,
          title: this.$t('电影'),
          text1:'Phim Ảnh',
          text2:'Xem mọi lúc ',
        },
        {
          id: 4,
          title: this.$t('幕后活动'),
          text1:'Hậu trường hoạt động',
        },
      ],
      
      hotGameList: [],
      JiliGameList: [],
      PgGameList: [],
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
      dataList:[],
      showPrize:false,
      luckyWheelSimple:{},
    };
  },

  computed: {
    noticeClass: function () {
      return {
        notice: !this.noticeSwitch,
        // fixed: this.noticeSwitch,
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
    this.gameMenuList = JSON.parse(localStorage.getItem("ALLMENUE_EXCEPT_FISH"));
    this.getSports()
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
    getSports(){
      // 体育
      let sportsList = this.gameMenuList.find(v => {
          return v.id == 2;
      })
      this.sportList = sportsList.children
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
.notice{
  position: relative;
  height: 50px;
}
.runMsg{
  display: flex;
  height: 100%;
  left: calc(50% - 500px);
  bottom: 0;
  position: absolute;
  width: calc(50% + 500px);
  min-width: 1000px;
}
.uniqueShuffling {
  display: flex;
  flex: 1;
  align-items: center;
}

.uniqueShuffling>span {
  margin: 0 10px;
  white-space: nowrap;
  cursor: pointer;
  color: #9f9d9d;
  line-height: 50px;
  font-size: 14px;
}

.uniqueShuffling i {
  width: 19px;
  height: 18px;
  display: inline-block;
  background: url("~@/assets/image/qqImg/icon_indexImg.png") no-repeat -17px -819px;
}
.noticeContent {
  width: 100%;
  height: 50px;
  line-height: 50px;
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
      color: #fff;
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
    height: 105px;
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
    width: 100%;
    background-color: $notice-bg;
    z-index: 90;
    cursor: pointer;
  }

  .fixed {
    position: fixed;
    left: 0;
    top: 105px;
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
        background: url(~@/assets/image/gameImg/index/container_img01.png)
          50% 0 no-repeat;

        .quick_recharge {
          float: left;
          margin-top: 3px;
          width: 180px;
          height: 50px;
          background: url('~@/assets/image/gameImg/index/btn_add_credit.png') 50% 0 no-repeat;
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
        background: url(~@/assets/image/gameImg/index/btn_service.png)
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
    padding: 15px 0;
    background: url("~@/assets/image/qqImg/bg_index.jpg");
  .ng-isolate-scope{ 
    width: 1000px;
    margin:  auto;
    padding: 50px 0;
    .ng-isolate-content{
      width: 100%;
      .ng-isolate-list{
        display: table;
        margin: 0 auto;
        width: 1000px;
        .menuList-isolate{
          color: #000;
          height: 250px;
          cursor: pointer;
          border-radius: 20px;
          padding: 25px 20px;
          box-sizing: border-box;
          position: relative;
          text-align: center;
          display: table-cell;
          text-align: center;
          vertical-align: middle;
          position: relative;
          height: 250px;
          &:hover{
              animation: liveGame 0.5s forwards;
              cursor: pointer;
            .exterior{
              opacity: 0;
            }
            .in{
              display: block;
              opacity: 1;
            }
          }
          .in {
              opacity: 0;
              transition: all 0.3s ease-in-out;
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              display: none;
              .game_in{
                position: relative;
                height: 250px;
                left: 0;
              }
              .game_btn{
                border-radius: 3px;
                color: #fff;
                position: absolute;
                bottom: -4px;
                right: -50px;
                font-size: 16px;
                z-index: 10;
                animation: LG01_people 0.5s ease 1.3s forwards;
                opacity: 0;
                white-space: nowrap;
                background-color: #af1818;
                padding: 6px 9px 7px 28px;
                &::before{
                    content: '';
                    width: 0;
                    height: 0;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 10px;
                    margin: auto 0;
                    border-style: solid;
                    border-width: 5px 0 5px 7px;
                    border-color: transparent transparent transparent rgba(255,255,255,0.8);
                }
              }
          }
          .icon{
            display: block;
          }
          .title{
            margin: 25px 0;
            color: #333;
            font-weight: normal;
            font-size: 15px;
          }
          .game_in1{
            .gamebg_1{
                  background: url("~@/assets/image/qqImg/icon_indexImg.png") no-repeat left -172px;
                  width: 460px;
                  height: 195px;
                  position: absolute;
                  top: -6px;
                  left: -52px;
                  animation: LG01_people 1.1s ease 0.3s forwards;
                  -webkit-animation: LG01_people 1.1s ease 0.3s forwards;
                  opacity: 0;
              }
            .game_text1{
              left: 0;
              bottom: 48px;
              color: #003e9f;
              font-weight: bold;
              font-size: 25px;
              line-height: 1em;
              width: 100%;
              animation: LG_text01 1s ease 0.7s forwards;
              position: absolute;
              display: block;
              z-index: 2;
              opacity: 0;
            }
            .game_text2 {
                left: 0;
                bottom: -8px;
                color: #052c4f;
                font-weight: bold;
                font-size: 15px;
                line-height: 1.2em;
                letter-spacing: -0.8px;
                word-spacing: -0.5px;
                width: 90%;
                animation: LG_text02 1s ease 0.7s forwards;
                position: absolute;
                display: block;
                z-index: 2;
                opacity: 0;
            }
          }
          .game_in2{
            .gamebg_2{
              background: url("~@/assets/image/qqImg/icon_indexImg.png") no-repeat left -415px;
              width: 353px;
              height: 203px;
              position: absolute;
              bottom: 44px;
              left: 0;
              right: 0;
              margin: 0 auto;
              opacity: 0;
              animation: SL_bg 0.15s ease-in 0.5s forwards;
            }
            .game_text1,.game_text2{
              color: #ff8485;
              font-weight: bold;
              animation: SL_text01 0.9s ease 0.6s forwards;
              left: 32px;
              top: 134px;
              text-shadow: 1px 1px 2px #000, -1px -1px 3px rgba(0,0,0,0.1);
              font-size: 23px;
              font-weight: bold;
              position: absolute;
              z-index: 5;
              opacity: 0;
            }
            .game_text2{
              left: 56px;
              top: 152px;
            }
            .game_btn{
              bottom: 0;
              background-color: #ffa5a6;
              right: 65px;
            }
          }
          .game_in3{
            .game_btn{
              bottom: 0;
              background-color: #007eff;
              right: 15px;
            }
            .gamebg_3{
              background: url("~@/assets/image/qqImg/icon_indexImg.png") no-repeat  -358px -439px;
              width: 353px;
              height: 212px;
              position: absolute;
              right: 38px;
              bottom: 0;
              animation: LG01_people 0.4s ease-out 0.4s forwards;
              opacity: 0;
              z-index: 2;
            }
            .game_text1{
              color: #00c2ff;
              text-shadow: 1px 1px 2px #000;
              font-size: 32px;
              font-weight: bold;
              animation: LG_text02 1s ease 0.7s forwards;
              position: absolute;
              right: 70px;
              top: 75px;
              z-index: 5;
              opacity: 0;
            }
            .game_text2{
              color: #fff;
              text-shadow: 1px 1px 2px #000;
              font-size: 25px;
              font-weight: bold;
              animation: LG_text02 1s ease 0.7s forwards;
              position: absolute;
              right: 70px;
              top: 120px;
              z-index: 5;
              opacity: 0;
            }
          }
          .game_in4{
            .game_btn{
              bottom: 13px;
              background-color: #f6299b;
              right: -60px;
            }
            .gamebg_4{
              background: url("~@/assets/image/qqImg/icon_indexImg.png") no-repeat -490px -200px;
              width: 346px;
              height: 180px;
              position: absolute;
              top: 15px;
              left: 90px;
              animation: LG01_people 1.1s ease 0.3s forwards;
              -webkit-animation: LG01_people 1.1s ease 0.3s forwards;
              opacity: 0;
            }
            .game_text1{
              color: #e4007f;
              font-size: 23px;
              letter-spacing: -1px;
              font-weight: bold;
              animation: outtake_text 0.5s ease 0.8s forwards;
              position: absolute;
              left: 80px;
              bottom: 18px;
              display: block;
              z-index: 2;
              opacity: 0;
            }
          }
          .icon1{
            width: 200px;
            height: 180px;
            margin: -7px auto;
            position: relative;
            &::after{
              content: '';
              visibility: initial;
              background: url("~@/assets/image/qqImg/icon_indexImg.png") no-repeat -727px -456px;
              width: 265px;
              height: 180px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-52%,-50%);
              -webkit-transform: translate(-52%,-50%);
            }
          }
          .icon2{
            background: url("~@/assets/image/qqImg/icon_indexImg.png") no-repeat -179px 8px;
            width: 165px;
            height: 165px;
            margin: 0 auto;
          }
          .icon3{
            background: url("~@/assets/image/qqImg/icon_indexImg.png") no-repeat -345px 5px;
            width: 155px;
            height: 165px;
            margin: auto;
          }
          .icon4{
            background: url("~@/assets/image/qqImg/icon_indexImg.png") no-repeat -506px 8px;
            width: 165px;
            height: 165px;
            margin: 0 auto;
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
  background: url(~@/assets/image/qqImg/game-bg.png) no-repeat center/contain;
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
          background: url(~@/assets/image/qqImg/sports-gamebg.png) no-repeat 0px 1px/70px;
          &:hover{
            background: url(~@/assets/image/qqImg/sports-gamebg.png) no-repeat 0px -81px/70px;
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
      background: url(~@/assets/image/qqImg/hot-icon.png) no-repeat left center/contain;
    }
  }
}
.jiliGame{
  .game-title{
    .title-left{
      background: url(~@/assets/image/qqImg/hot-icon.png) no-repeat left center/contain;
    }
  }
}
.jiliGame .game-title .title-left{
  background: url(~@/assets/image/qqImg/jili-icon.png) no-repeat left center/contain;
}
.pgGame .game-title .title-left{
  padding-left: 60px;
  background: url(~@/assets/image/qqImg/pg-icon.png) no-repeat left center/contain;
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
@keyframes LG01_people {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes LG_text01 {
  from {
      -webkit-transform: translate(10%,0);
      opacity: 0;
  }

  to {
      -webkit-transform: translate(0,0);
      opacity: 1;
  }
}
@keyframes LG_text02 {
    from {
        transform: translate(-10%,0);
        opacity: 0;
    }

    to {
        transform: translate(0,0);
        opacity: 1;
    }
}

@keyframes SL_bg {
    0% {
        transform: translate(0,-20%);
        opacity: 0;
    }

    50% {
        transform: translate(0,0);
        opacity: 1;
    }

    75% {
        transform: translate(0,-4%);
        opacity: 1;
    }

    100% {
        transform: translate(0,0);
        opacity: 1;
    }
}
@keyframes SL_text01 {
    from {
        transform: skew(0,-6deg) translate(-2%,0);
        opacity: 0;
    }

    to {
        transform: skew(0,-6deg) translate(3%,0);
        opacity: 1;
    }
}
@keyframes liveGame {
    from {
        width: auto;
    }

    to {
        width: 430px;
    }
}
@keyframes outtake_text {
    from {
        transform: translate(-8%,0);
        transform-origin: 0% 100%;
        opacity: 0;
    }

    to {
        transform: translate(0,0);
        transform-origin: 0% 100%;
        opacity: 1;
    }
}

.prize-btn{
  position:fixed;
  width:194px;
  height:200px;
  right:20px;
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

