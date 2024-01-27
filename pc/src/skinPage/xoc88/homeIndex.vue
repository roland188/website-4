<template>
  <div class="themeColor index">
    <!-- 占位符 -->
    <!-- <div class="placeholder"></div>
    
    <hea-Der></hea-Der>-->
    <!-- 顶部轮播 -->
    <div style="height: 520px; overflow: hidden">
      <div ref="notice" class="main_swiper">
        <main-swiper></main-swiper>
      </div>
    </div>
  
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
    <!-- 公告弹窗 -->
    <dialog-notice v-if="openDialog" @close="closeNotice"></dialog-notice>
    <!-- 公告 -->
    <ActDetail ref="actDetails"></ActDetail>
    <!-- 全网最佳游戏平台 -->
    <div class="best_platform">
      <div class="best_inner">
        <div class="title">
          <!-- 快速充值 -->
          <a
            href="javascript:;"
            class="quick_recharge"
            @click="quickRecharge"
          ></a>
          <!-- 在线客服 -->
          <!-- <a href="javascript:;" class="service_online" @click="onlineTalk"></a> -->
          <!-- 全民代理 -->
          <a href="javascript:;" class="service_online" @click="rebateInfo"></a>
        </div>
        <best-list></best-list>
      </div>
    </div>
    <!-- 更多 项目 应有尽有 -->
    <div class="more_pro">
      <div class="best_inner">
        <more-list></more-list>
      </div>
    </div>
    <!-- 方寸之间尽显从容 -->
    <div class ref="down" id="downloadCode">
      <Cenbanner />
    </div>
    <!-- 超级大奖，累计奖池等你来拿 -->
    <div class>
      <superPage />
    </div>

    <!-- 底部 -->
    <!-- <div style="background:#0A0A0A;">
          <footer-item></footer-item>
    </div>-->

    <!-- 左侧浮窗，热门游戏 -->
    <div class="hotGameData">
      <hotGameData></hotGameData>
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
// 顶部
//左侧浮窗，热门游戏
import hotGameData from "@/components/index/hotGameData";
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
      announcement: {},
      container: "",
      content: "",
      containerWidth: "",
      contentWidth: "",
      mobileLeft: 0,
      left: 0,
      raf: "",
      scrollIsTrue: true,
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
  background: url("../../assets/image/pubilc/icons.png") no-repeat 0;
  background-position: -145px -133px;
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
      font-size: 12px;
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
    height: 133px;
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
    position: absolute;
    left: 0;
    top: 520px;
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
</style>

