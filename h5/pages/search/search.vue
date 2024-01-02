<template>
  <view class="searchBox">
    <view class="searchTop">
      <image
        class="back"
        src="../../static/image/back1.png"
        mode="widthFix"
        @click="navBack()"
      ></image>
      <view class="searchLeft" :class="[listLength > 0 ? 'searchTsTop' : '']">
        <text class="searchIcon cuIcon-search"></text>
        <input
          @focus="inputfocus()"
          @blur="inputBlur()"
          v-model="val"
          focus="true"
          class="uni-input-input searchInput"
          confirm-type="search"
          @confirm="searchCon()"
          @input="inputSearch"
          type="text"
          placeholder-class="searchPlace"
          :placeholder="$t('请输入你要搜索的内容')"
        />

        <image
          @click="textTrim()"
          class="inputClearn"
          src="@/static/image/mb/inputClearn.png"
          mode=""
        ></image>

        <view v-if="listLength > 0" class="searchTsBox">
          <scroll-view
            scroll-y="true"
            class="scroll-Y searchTsBoxScroll"
            @scrolltolower="lower"
          >
            <view
              class="tsBoxList"
              v-for="(item, index) in tsData"
              :key="index"
              @tap="tapActive(item.name)"
            >
              <view class="tsListLeft">
                {{ item.name }}
              </view>
              <image
                class="tsListRight"
                src="../../static/image/centerImg/ts1.png"
                mode=""
              ></image>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="searchRight" @click="searchCon()">
        <text class="searchGo">{{ $t('搜索') }}</text>
      </view>
    </view>
    <view class="searchKl"></view>
    <!-- 历史 -->
    <view v-if="navFlag" class="searchNavBox">
      <view class="navUl" v-if="historyLength > 0">
        <view class="navTitle">
          <text class="navNei themeTextOne">{{ $t('历史搜索') }}</text>
          <text @click="clear()" class="allClear">{{ $t('清除搜索记录') }}</text>
        </view>
        <view class="navListBox">
          <view
            class="navList searchColor"
            v-for="(item, index) in historyData"
            :key="index"
            @tap="clickTab(1, item)"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </view>
    <view v-else class="">
      <view v-if="dataList.length > 0" class="search-show searchContent">
        <view class="seacchList" v-for="(item, index) in dataList" :key="index">
          <view class="dataLoad" @tap="goPlayGame(item)">
            <image
              v-show="item.status == 0"
              class="weihu"
              src="../../static/image/indexImg/weihu.png"
              mode="aspectFit"
            ></image>

            <image
              :src="
                item.pictureUrl
                  ? $config.getImgUrl(item.pictureUrl)
                  : searchNoneImg
              "
              :class="item.picture ? '' : 'searchBgImg'"
              mode=""
              @error="searchImg(index)"
            ></image>
          </view>
          <text>{{ item.name }}</text>
          <view
            class="lable"
            v-if="item.nameEn !== '' || item.vendorName !== ''"
          >
            <view class="size">{{ item.nameEn || item.vendorName }}</view>
            <view class="label-round"></view>
            <view class="label-small-round"></view>
          </view>
        </view>
        <view class="kongW" style="height: 0"></view>
        <view v-if="over" class="meiBox">
          <view class="meiXian"></view>
          <view class="meiWen">
            {{ $t('没有更多了哦') }}
          </view>
          <view class="meiXian"></view>
        </view>
      </view>
      <view v-else class="search-none">
        <view class="none-con">
          <!-- <view class="none-img"> -->
          <image
            class="none-img"
            :src="$config.themeImgUrl('no_content_1')"
            mode="widthFix"
          ></image>
          <!-- </view> -->
          <view class="none-wen">
            <view class="wen-none themeTextTwo">
              {{ $t('这里空空的，什么都没有呢...') }}
            </view>
            <view class="wen-none"> </view>
          </view>
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
    >
    </chunLei-modal>
  </view>
</template>
<script>
import cache from "../../utils/cache.js";
export default {
  data() {
    return {
      modelvalue: false,
      modeldata: {
        notices: {
          moname: "",
        },
      },
      modeltype: "share",
      searchNoneImg: "../../static/image/indexImg/searchlost.png",
      pageNo: 1,
      pageNots: 1,
      pageSize: 21,
      navFlag: true,
      over: false,
      tsOver: false,
      historyData: [
        {
          name: this.$t('鱼'),
          id: 99,
        },
        {
          name: this.$t('棋牌'),
          id: 99,
        },
        {
          name: this.$t('体育'),
          id: 99,
        },
      ], //历史数据
      thinkData: [
        {
          name: this.$t('斗地主'),
          id: 99,
        },
        {
          name: this.$t('真人视讯'),
          id: 99,
        },
        {
          name: this.$t('电子游艺'),
          id: 99,
        },
      ], //猜你想要数据
      tsData: [], //搜索提示数据
      val: "",
      dataSource: [
        {
          id: 1,
          name: this.$t('耐克1'),
        },
        {
          id: 2,
          name: this.$t('耐克2'),
        },
      ],
      dataList: [],
      username: "",
      tenetid: "",
      uid: "",
      tabbarHeight: 50,
      goGameData: null,
      goGameType: null,
      appDowDataUrl: "", //app下载
      appaDowData: [],
      timeApp: null,
      winOpen: "",
      parensRes: "",
      isIos: "",
      inputActive: false,
    };
  },
  computed: {
    listLength() {
      return this.tsData.length;
    },
    historyLength() {
      return this.historyData.length;
    },
    activeUsers: function () {
      return this.dataList.filter(function (user) {
        return user.h5 == 1;
      });
    },
  },
  onShow() {
    this.username = cache.get("set_user").username;
    this.tenetid = cache.get("set_user").tenant_id;
    this.uid = cache.get("set_user").user_id;
  },
  onLoad(option) {
    this.historyData = uni.getStorageSync("historyData")
      ? uni.getStorageSync("historyData").slice(0, 20)
      : [];
    if (option.searchName) {
      this.val = option.searchName;
      this.searchCon();
    }
    this.modelToastFlag = uni.getStorageSync("modelGoApp")
      ? uni.getStorageSync("modelGoApp")
      : false;
    this.appDowDataUrl = uni.getStorageSync("appRouterDow");
    this.appCodeList();
  },
  onReady() {
    uni.hideLoading();
  },
  onReachBottom() {
    this.pageNo = this.pageNo + 1;
    if (!this.over) {
      this.getData();
    }
  },
  onHide() {
    clearTimeout(this.timeApp);
  },
  methods: {
    clear() {
      this.historyData = [];
      uni.removeStorageSync("historyData");
    },
    inputBlur() {
      this.inputActive = false;
    },
    inputfocus() {
      this.inputActive = true;
    },
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
        let code = self.code ? "/" + self.code : "";
        let appDowDataUrl = self.$config.dowUrl + getClientCode + code;
        let ids = self.goGameData.id;
        let tenetid = self.tenetid;
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

        self.timeApp = setTimeout(function () {
          let hidden =
            window.document.hidden ||
            window.document.mozHidden ||
            window.document.msHidden ||
            window.document.webkitHidden;

          if (typeof hidden == "undefined" || hidden == false) {
            window.location.href = appDowDataUrl;
          }
        }, 4000);
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
      console.log(e, this.goGameData);
      if (e === "default") {
        this.modelvalue = false;
        let gameData = this.goGameData;
        console.log(this.goGameData);
        this.goGameDataClick(gameData);
      }
      if (e === "centerWallet") {
        this.modelvalue = false;
        console.log(999, "取消");
      }
    },
    // 互动
    modelToast(e) {
      this.modelToastFlag = e;
      if (e === true) {
        uni.setStorageSync("modelGoApp", e);
      }
      console.log(e);
    },
    // 提示上拉加载
    lower: function (e) {
      this.pageNots = this.pageNots + 1;
      if (!this.tsOver) {
        this.getTsData();
      }
    },
    // 点击选中
    tapActive(name) {
      let self = this;
      self.val = name;
      self.pageNo = 1;
      self.over = false;
      self.tsData = [];
      self.tsOver = false;
      self.pageNots = 1;
      self.getData();
      // setTimeout(function(){

      // },200)
    },
    // fanhui
    navBack() {
      uni.navigateTo({
        url: "../index/index",
      });
    },
    // 清空搜索栏
    textTrim() {
      this.val = "";
      this.tsData = [];
      this.navFlag = true;
      this.over = false;
      this.pageNo = 1;
    },
    // inputSearch
    inputSearch(event) {
      this.val = event.target.value;
      console.log(this.val);
      if (this.val === "") {
        this.navFlag = true;
      } else {
        this.pageNots = 1;
        this.tsData = [];
        this.tsOver = false;
        this.getTsData();
      }
    },
    // ss
    searchCon() {
      this.val = this.val.trim();
      if (this.val === "") {
        uni.showToast({
          icon: "none",
          title: this.$t('您搜索的内容为空'),
        });
        this.navFlag = true;
        return;
      }
      let iconRule2 =
        /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
      if (iconRule2.test(this.val)) {
        uni.showToast({
          icon: "none",
          title: this.$t('您搜索的内容包含表情请重新输入'),
        });
        this.val = "";
        return;
      }
      let historyData = [];
      historyData = this.historyData;
      historyData.unshift(this.val);
      historyData = [...new Set(historyData)];
      historyData = historyData.slice(0, 20);
      uni.setStorageSync("historyData", historyData);
      this.historyData = historyData;
      this.pageNo = 1;
      this.over = false;
      this.dataList = [];
      this.tsData = [];
      this.getData();
    },
    // 获取数据
    getData() {
      this.dataList = [];
      let self = this;
      let req = [self.pageNo, self.pageSize, self.val];
      self.$api.gameSearch(
        ...req,
        function (err, res) {
          if (err) {
            console.log("%c" + "gameSearch", "color:#a70a0a;", err);
          } else {
            self.navFlag = false;
            self.dataList.push(...res.list);
            if (self.pageNo >= res.pages) {
              self.over = true;
            }
          }
        },
        true
      );
    },
    // 获取提示数据
    getTsData() {
      let self = this;
      let req = [self.pageNots, self.pageSize, self.val];
      self.$api.gameSearch(
        ...req,
        function (err, res) {
          if (err) {
            console.log("%c" + "gameSearch", "color:#a70a0a;", err);
          } else {
            console.log("%c" + "gameSearch", "color:#228d09;", res);
            for (var i = 0; i < res.list.length; i++) {
              self.tsData.push(res.list[i]);
            }
            if (self.pageNots >= res.pages) {
              self.tsOver = true;
            }
          }
        },
        false
      );
    },
    // 点击历史和想要
    clickTab(type, item) {
      uni.hideKeyboard();
      if (type == 1) {
        this.val = item;
      } else {
        this.val = item.name;
      }
      this.dataList = [];
      this.over = false;
      this.pageNo = 1;
      this.getData();
      let historyData = [];
      historyData = this.historyData;
      historyData.unshift(this.val);
      historyData = [...new Set(historyData)];
      console.log("this.resultArr:", historyData);
      uni.setStorageSync("historyData", historyData);
      this.historyData = historyData.slice(0, 20);
    },
    // 报错处理
    searchImg(i) {
      this.dataList[i].picture = "../../static/image/centerImg/loading.png";
    },
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
    // 跳转详情
    goGameDataClick(reqData) {
      let isIos = "";
      uni.showLoading({
        title: this.$t('正在进入游戏...'),
        mask: true,
      });
      console.log(reqData);
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
            self.winOpen = window.open("/waitPage.html?type=1", "_blank");
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
              console.log("%c" + "gameDetail", "color:#a70a0a;", err);
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
            let strCode = "?searchName=" + self.val;
            let title = reqData.name;
            // #ifdef H5
            if (isIos === "ios") {
              self.parensRes = res.gameUrl;
              if (res.status === 1) {
                //未冻结
                setTimeout(function () {
                  //这里使用setTimeout非常重要，没有将无法实现
                  console.log(self.winOpen);
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
              self.$server.setWebView(res.gameUrl, 2, title, strCode); //1首页 ，2搜索，3游戏列表，4活动，5公告  6缺省页
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
              type: 2,
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
  },
};
</script>

<style scoped>
@import url("./index.css");
</style>
