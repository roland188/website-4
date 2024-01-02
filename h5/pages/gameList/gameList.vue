<template>
  <view class="searchBox" v-bind:class="[laFlag ? 'over' : '']">
    <!-- triangledownfill -->
    <view class="searchTop" :class="laFlag ? 'searchTopLa' : ''">
      <image
        class="back"
        :src="require('@/static/image/gs1.png')"
        mode="widthFix"
        @click="navBack()"
      ></image>
      <view class="searchLeft">
        <view class="gameCon" @click="laBian()">
          <view class="gameName themeTextOne">{{ indexName }}</view>
          <!-- <text class="cuIcon-triangledownfill wenJiao"></text> -->
          <image
            class="wenJiao"
            :src="require('@/static/image/wenJiao.png')"
            mode="widthFix"
          ></image>
        </view>
      </view>
      <image
        class="searchRight"
        @click="searchCon()"
        :src="require('@/static/image/gs2.png')"
        mode="widthFix"
      ></image>
      <view
        v-if="laFlag"
        class="gameLaMask"
        @click.stop="laBian()"
        v-bind:style="{ height: curHeight + 'px' }"
      >
        <view class="gameLaBox">
          <view
            @tap="gameClick(item, index)"
            class="gameLaList"
            :class="[j == index ? 'gameListActive' : '', 'themeTextTwo']"
            v-for="(item, index) in gameList"
            :key="index"
            >{{ item.name }}</view
          >
          <view style="height: 0"></view>
          <view style="height: 0"></view>
          <view style="height: 0"></view>
        </view>
      </view>
    </view>
    <view class="searchKl"></view>
    <view v-if="!isKong" class="iskong"></view>
    <view v-else class="k">
      <view v-if="dataList.length > 0" class="search-show searchContent">
        <view class="seacchList" v-for="(item, index) in dataList" :key="index">
          <view class="dataLoad" @tap="goPlayGame(item)">
            <image
              v-show="item.status == 0"
              class="weihu"
              src="../../static/image/indexImg/weihu.png"
              mode="aspectFit"
            ></image>
            <!-- v-bind:style="{backgroundImage:'url(../../static/image/centerImg/loading.png)', backgroundRepeat:'no-repeat', backgroundPosition:'center center', backgroundSize: '100%'}" -->
            <image
              :src="
                item.pictureUrl
                  ? $config.getImgUrl(item.pictureUrl)
                  : gameNoneImg
              "
              :class="$config.getImgUrl(item.picture) ? '' : 'searchBgImg'"
              mode="widthFix"
            ></image>
          </view>
          <text>{{ item.name }}</text>
          <view class="lable" v-if="item.vendorCode !== ''">
            <view class="size">{{ item.vendorCode }}</view>
            <view class="label-round"></view>
            <view class="label-small-round"></view>
          </view>
        </view>
        <view class="kongW" style="height: 0"></view>
        <view v-if="over" class="meiBox">
          <view class="meiXian"></view>
          <view class="meiWen">{{ $t('没有更多了哦') }}</view>
          <view class="meiXian"></view>
        </view>
      </view>
      <view v-else class="search-none">
        <view class="none-con">
          <image
            class="none-img"
            :src="$config.themeImgUrl('no_content_1')"
            mode="widthFix"
          ></image>

          <view class="wen-none">{{ $t('这里空空的') }}</view>
          <view class="wen-none">{{ $t('什么都没有哦') }}</view>
        </view>
      </view>
    </view>
    <chunLei-modal
      v-model="modelvalue"
      :mData="modeldata"
      :type="modeltype"
      :maskEnable="false"
      @onConfirm="onConfirm"
      @cancel="cancel"
      :tabbarHeight="tabbarHeight"
      @modelToast="modelToast"
      navMask
    ></chunLei-modal>
  </view>
</template>

<script>
import cache from "@/utils/cache.js";
export default {
  data() {
    return {
      gameNoneImg: "../../static/image/indexImg/searchlost.png",
      indexName: "22",
      curHeight: 0,
      gameList: [],
      laFlag: false,
      dataList: [],
      index: 0,
      j: 0,
      vendorId: "",
      pageNo: 1,
      pageSize: 21,
      over: false,
      username: "",
      tenetid: "",
      uid: "",
      isKong: false,
      type: "",
      gameKindId: "",
      modelvalue: false,
      modeldata: {
        notices: {
          moname: "",
        },
      },
      modeltype: "share",
      tabbarHeight: 50,
      goGameData: null,
      goGameType: null,
      appDowDataUrl: "", //app下载
      appaDowData: [],
      code: "",
      timeApp: null,
      winOpen: "",
      parensRes: "",
      isIos: "",
    };
  },
  //点击完成（导航栏自定义按钮）
  onNavigationBarButtonTap() {},
  onLoad(option) {
    this.gameList = uni.getStorageSync("gameList");
    this.getHeight();
    this.index = option.index;
    this.j = option.j;
    this.type = option.type;
    this.indexName = this.gameList[this.j].name;
    this.vendorId = this.gameList[this.j].ids;
    this.gameKindId = option.gameKindId;
    // this.

    if (option.type == 1) {
      this.getVendorGame();
    } else {
      this.getGameByIds();
    }
    this.modelToastFlag = uni.getStorageSync("modelGoApp")
      ? uni.getStorageSync("modelGoApp")
      : false;
    // this.appCodeList();
    if (option.code) {
      this.code = option.code;
    }
  },
  computed: {
    activeUsers: function () {
      return this.dataList.filter(function (user) {
        return user.h5 == 1;
      });
    },
  },
  onShow() {
    if (this.$server.getUser()) {
      this.uid = this.$server.getUser().user_id;
      this.username = this.$server.getUser().username;
      this.tenetid = this.$server.getUser().tenant_id;
    }
    // #ifdef APP-PLUS
    // 锁定屏幕方向
    plus.screen.unlockOrientation();
    plus.screen.lockOrientation("portrait-primary");
    // #endif
  },
  onReady() {
    uni.hideLoading();
  },
  onHide() {
    clearTimeout(this.timeApp);
  },
  onReachBottom() {
    this.pageNo = this.pageNo + 1;
    if (!this.over) {
      if (this.type == 1) {
        this.getVendorGame();
      } else {
        this.getGameByIds();
      }
    }
  },

  methods: {
    // 获取游戏的下载地址
    appCodeList() {
      let self = this;
      self.$api.appCodeList(function (err, res) {
        if (res) {
          self.appaDowData = res;
          let appMap = self.appaDowData;
          let appRouterAndroid,
            appRouterIos = "";
          appMap.forEach(function (value, key, map) {
            if (value.versionType == 0) {
              appRouterAndroid = value.apkUrl;
            } else if (value.versionType == 1) {
              appRouterIos = value.apkUrl;
            }
          });
          uni.getSystemInfo({
            success: function (res) {
              if (res.platform == "ios") {
                self.appDowDataUrl = appRouterIos;
              } else if (res.platform == "android") {
                self.appDowDataUrl = appRouterAndroid;
              }
              uni.setStorageSync("appRouterDow", self.appDowDataUrl);
            },
          });
        }
      }, false);
    },
    onConfirm(e) {
      let self = this;
      if (self.modeltype == "default") {
        let getClientCode = self.$config.clientCode;
        // getClientCode = 'ybyl'
        let ids = self.goGameData.id;
        let tenetid = self.tenetid;
        let code = self.code ? "/" + self.code : "";
        let appDowDataUrl = self.$config.dowUrl + getClientCode + code;
        let gameName = self.goGameData.name;
        let scheme =
          getClientCode +
          "://" +
          getClientCode +
          ".app/openwith?tenantId=" +
          tenetid +
          "&gameId=" +
          ids +
          "&gameTitle=" +
          gameName;
        window.location.href = scheme;
        // window.open(scheme)
        self.timeApp = setTimeout(function () {
          let hidden =
            window.document.hidden ||
            window.document.mozHidden ||
            window.document.msHidden ||
            window.document.webkitHidden;

          if (typeof hidden == "undefined" || hidden == false) {
            window.location.href = appDowDataUrl;
          }
        }, 3000);
      }
      // 冻结
      if (e === "centerWallet") {
        let parensRes = this.parensRes;
        let winOpenNew = "";
        let self = this;
        // H5
        // #ifdef  H5
        if (self.isIos === true) {
          winOpenNew = window.open("/waitPage.html?type=1", "_blank");
          setTimeout(function () {
            //这里使用setTimeout非常重要，没有将无法实现
            //原因是window.open会中断正在执行的进程，这样能保证其它代码执行完成再执行这个。
            winOpenNew.location.href = parensRes; //改变页面的location
          }, 100);
        } else {
          uni.navigateTo({
            url: "../gameWebView/gameWebView",
          });
        }
        // #endif
        // APP
        // #ifdef  APP-PLUS
        uni.navigateTo({
          url: "/pages/webNvue/webNvue",
        });
        // #endif
      }
    },
    cancel(e) {
      if (e === "default") {
        this.modelvalue = false;
        let gameData = this.goGameData;

        this.goGameDataClick(gameData);
      }
      if (e === "centerWallet") {
        this.modelvalue = false;
      }
    },
    // 互动
    modelToast(e) {
      this.modelToastFlag = e;
      if (e === true) {
        uni.setStorageSync("modelGoApp", e);
      }
    },
    //
    goPlayGame(reqData) {
      // this.goGameDataClick(reqData)
      this.goGameData = reqData;
      //#ifdef APP-PLUS
      this.goGameDataClick(reqData);
      //#endif
      //#ifdef H5
       this.goGameDataClick(reqData);
      // if (!this.modelToastFlag) {
      //   this.openalert5();
      // } else {
      //   this.goGameDataClick(reqData);
      // }
      //#endif
    },
    // 进入游戏提示
    openalert5() {
      this.modeltype = "default";
      this.modelvalue = true;
      this.modeldata.title = this.$t('温馨提示');
      this.modeldata.content = this.$t('为了获得更好的游戏体验，建议您在APP内打开游戏');
      this.modeldata.toast = true;
      this.modeldata.cancelText  = this.$t('H5浏览器');
      this.modeldata.confirmText   = this.$t('APP打开');
    },
    goGameDataClick(reqData) {
      let isIos = "";
      uni.showLoading({
        title: this.$t('正在进入游戏...'),
        mask: true,
      });

      let self = this;
      var req = [
        self.tenetid,
        self.username,
        reqData.vendorId,
        reqData.id,
        self.$config.clientIp,
        self.uid,
        2,
      ];
      // #ifdef H5
      uni.getSystemInfo({
        success: function (resNew) {
          if (reqData.openMode === 1) {
            isIos = "ios";
            self.isIos = true;
            self.winOpen = window.open("/waitPage.html?type=1", "_blank"); //首先打开一个新页面
          } else {
            isIos = "android";
            self.isIos = false;
          }
        },
      });
      // #endif
      self.$api.getTokenUrl(
        ...req,
        function (err, res) {
          if (err) {
            if (isIos === "ios") {
              self.winOpen.location.href = "/error.html?type=1"; //改变页面的location
            } else {
              if (reqData.status === 0) {
                uni.showToast({
                  title:  this.$t('维护中'),
                  icon: "none",
                });
              } else {
                uni.showToast({
                  title:  this.$t('进入游戏失败，请稍后重试！'),
                  icon: "none",
                });
              }
            }
          } else {
            let strCode =
              "?index=" +
              self.index +
              "&j=" +
              self.j +
              "&type=" +
              self.type +
              "&gameKindId=" +
              self.gameKindId;
            let title = reqData.name;
            // #ifdef H5
            if (isIos === "ios") {
              self.parensRes = res.gameUrl;
              if (res.status === 1) {
                //未冻结
                setTimeout(function () {
                  //这里使用setTimeout非常重要，没有将无法实现

                  self.winOpen.location.href = res.gameUrl; //改变页面的location
                  // self.winOpen.location.href = res; //改变页面的location
                }, 100);
              } else {
                localStorage.setItem("newGameUrl", res.gameUrl);
                self.winOpen.location.href = "/error.html?type=2"; //改变页面的location
                // self.winOpen.close()
                // self.openalert6()
              }
            } else {
              self.$server.setWebView(res.gameUrl, 3, title, strCode); //1首页 ，2搜索，3游戏列表，4活动，5公告  6缺省页
              if (res.status === 1) {
                uni.navigateTo({
                  url: "../gameWebView/gameWebView",
                });
              } else {
                self.openalert6();
              }
            }
            // #endif
            // #ifdef APP-PLUS
            let dataGame = {
              url: res,
              type: 1,
              title: title,
              req: req,
              urlCode: strCode,
            };
            uni.setStorageSync("dataGame", dataGame);
            uni.navigateTo({
              url: "/pages/webNvue/webNvue",
            });
            // #endif
          }
        },
        true
      );
    },

    // 进入游戏前状态冻结
    openalert6() {
      this.modeltype = "centerWallet";
      this.modelvalue = true;
      this.modeldata.title = this.$t('温馨提示');
      this.modeldata.content = this.$t('您的钱包已被冻结，无法带入金额！'),
      this.modeldata.toast = true;
      this.modeldata.cancelText = this.$t('取消'),
      this.modeldata.confirmText = this.$t('确认');
    },
    navBack() {
      // uni.navigateBacks({
      //     delta: 1
      // });
      uni.switchTab({
        url: "../index/index",
      });
    },
    //
    getHeight() {
      // var h = document.documentElement.clientHeight || document.body.clientHeight;
      // this.curHeight =h - 62; //减去页面上固定高度heigh
      let ret = uni.getSystemInfoSync();
      this.curHeight = ret.screenHeight - 62;
    },
    laBian() {
      this.laFlag = !this.laFlag;
    },
    // 去搜索
    searchCon() {
      uni.navigateTo({
        url: "../search/search",
      });
    },
    gameClick(item, index) {
      this.indexName = item.name;
      this.j = index;
      this.laFlag = false;
      this.vendorId = this.gameList[this.j].ids;
      this.gameKindId = this.gameList[this.j].parentId;
      this.dataList = [];
      this.pageNo = 1;
      this.over = false;
      this.isKong = false;
      this.type = item.type;
      if (this.type == 1) {
        this.getVendorGame();
      } else {
        this.getGameByIds();
      }
    },
    // 获取数据
    getVendorGame() {
      let self = this;
      // let req = [self.pageNo, self.pageSize, self.vendorId, self.gameKindId];
      let req = {
        currentPage: self.pageNo,
        pageSize: self.pageSize,
        vendorId: self.vendorId,
        gameKindId: self.gameKindId,
      }
      console.log(req,'req1');
      self.$api.getVendorGame(req,
        function (err, res) {
          self.laFlag = false;
          if (err) {
            uni.showToast({
              title: err.msg,
              icon: "none",
            });
          } else {
            self.dataList.push(...res.list);
            self.isKong = true;
            if (self.pageNo >= res.pages) {
              self.over = true;
            }
          }
        },
        false
      );
    },
    getGameByIds() {
      let self = this;
      let req = [self.pageNo, self.pageSize, self.vendorId, self.gameKindId];
      self.$api.getGameByIds(
        ...req,
        function (err, res) {
          self.laFlag = false;
          if (err) {
          } else {
            self.dataList.push(...res.list);
            self.isKong = true;
            if (self.pageNo >= res.pages) {
              self.over = true;
            }
          }
        },
        true
      );
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
</style>
