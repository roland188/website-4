<!-- 首页 -->
<template>
    <view class="content">
   
        <!-- #ifdef H5 -->
        <Download @closeDownload="showDownload = false" v-if="showDownload" />
        <!-- #endif -->
        <NavBar ref="NavBar" @onLeft="openLeftMenu" v-on:updateLoadData="updateLoadData" :langType="langType" :showTop="showDownload" />
        <!-- 易记域名 -->
        <view class="site-name-wrap">
                <image v-if="$config.yiJiUrl" class="yijiImg" :src="$config.getImgUrl($config.yiJiUrl)" mode="heightFix"/>
        </view>
        <!-- banner -->
        <Banner @goPlayGame="goPlayGame" />
        <!-- 主体容器 -->
        <view class="container" :class="{'p-bottom-40': isAndroid}">
            <!-- 功能登录区域 -->
            <LoginBox ref="loginBox" @routerLink="routerLink" :login="login" />
            <!-- 公告 -->
            <NoticeBar @openalert2="openalert2" @updateNotice="e => modeldata.notices = e" />
            <!-- 熱門 常玩 推薦 tab -->
            <!-- <HomeTabs ref="HomeTabs" :hotList="hotList" :tuiList="tuiList" :changList="changList" :goToGame="difference" :isLogin="login" /> -->
             <!-- 游戏菜单 -->
            <GameList ref="gameList" :arr="arr" @difference="differencePre" @changeRightData="changeRightData" :leftArray="leftArray" :gamemenus="gamemenus" :gamemenusparent="gamemenusparent" :leftMenuIcon="leftMenuIcon" />
            <PrizePool></PrizePool>
            <OtherInfo></OtherInfo>
          </view>

        <!-- 左侧菜单 -->
        <LeftMenu ref="leftmenus" @Appupdate="Appupdate"></LeftMenu>

        <!-- 弹窗 -->
        <chunLei-modal v-model="modelvalue" :indexData="rules" ref="pullKing" @enterGame="enterGame" :mData="modeldata" :type="modeltype"
		 :maskEnable="maskEnable" @onConfirm="onConfirm" @cancel="cancel" :tabbarHeight="tabbarHeight" @modelToast="modelToast"
		 @routerLink="routerLink" @doShowRelief="doShowRelief" @goGameNew="goGameNew" navMask></chunLei-modal>
      <!-- 红包雨 -->
      <view class="popup_world"
        v-if="isWorldPop" @click="onluckyWheelSimple">
          <view class="popup_close" @click.stop="isWorldPop = false"></view>
          <view class="popup_bg"></view>
      </view>
        <!-- 春节福袋入口 -->
        <!-- <LuckyBag /> -->

        <!-- 右侧浮窗 -->
		<RightFloatingFrame :login="login" @goPlayGame="goPlayGame" />
    </view>
</template>

<script>
import Download from "./components/download.vue";
import NavBar from "./components/navBar.vue";
import Banner from "./components/banner.vue";
import NoticeBar from "./components/noticeBar.vue";
import LoginBox from "./components/loginBox.vue";
import HomeTabs from "@/components/home-tabs.vue";
import GameList from "./components/gameList.vue";
import PrizePool from './components/PrizePool.vue'
import OtherInfo from './components/otherInfo.vue'
import { updateApp } from "../components/updateApp.js";
// import LuckyBag from './components/luckyBag.vue'
import RightFloatingFrame from "@/components/rightFloatingFrame/rightFloatingFrame.vue";
import LeftMenu from "./components//leftMenu.vue";
export default {
  mixins: [updateApp],
  components: {
    Download,
    NavBar,
    Banner,
    NoticeBar,
    LeftMenu,
    LoginBox,
    HomeTabs,
    GameList,
    OtherInfo,
    PrizePool,
    // LuckyBag
    RightFloatingFrame,
  },
  computed: {
    maskEnable() {
      if (["advertising"].includes(this.modeltype)) return false; // 这个数组里的弹窗遮罩就不开启了
      return true;
    },
  },
  watch: {
    "$store.state.lang": {
      handler(newVal, oldVal) {
        this.langType = newVal;
      },
      deep: true,
    },
  },
  data() {
    return {
      isWorldPop: false,
      // #ifdef H5
      showDownload: true, // 是否展示顶部下载组件
      // #endif
      // #ifdef APP-PLUS
      showDownload: false, // 是否展示顶部下载组件
      // #endif

      goGameData: {}, // 跳转的目标游戏
      isAndroid: false, // 是否是安卓系统
      isIos: false, // 是否是ios系统

      modeldata: {}, // 弹窗数据

      /* 用户信息 */
      uid: "",
      tenetid: "",
      username: "",
      login: false, //登录状态
      centerWalletStatus: null, //冻结状态
      /* 用户信息结束 */

      winOpen: null, // 新开的子窗口实例
      parensRes: "", // 父窗口url

      /* 弹窗 */
      modelvalue: false, // 弹窗是否打开
      modeltype: "share",
      rules: [], //弹出规则
      tabbarHeight: 50, // tabBar的高度
      modelToastFlag: false, // 互动标识
      /* 弹窗结束 */

      forceUpdate: false, // 是否是强更
      updatePackage: {}, // 更新包对象
      updateShow: false,
      isToday: false, // 是否是今天
      idVersion: "",
      timeApp: null, // 下载app定时器
      isShowHighRebate: false, // 全民返利是否开启
      allPeopleMoney: "0.00", // 全民返利金额
      vipImg: "normal_user", // vip等级图片

      originList: [], //原始游戏列表
      hotList: [], // 热门游戏列表
      buyuList: [], // 捕鱼游戏列表
      smallShow: false,
      leftArray: [], // 左侧列表
      leftMenuIcon: [], // 左侧列表图标
      gamemenusparent: {}, // 右侧列表之父
      gamemenus: [], // 游戏列表
      tuiList: [], // 推荐列表
      changList: [], // 常玩游戏
      // 图片规则
      arr: [],
      langType: this.$store.state.lang,
      worldCupData:{},
      
    };
  },
  onPullDownRefresh() {
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 3000);
  },
  onReachBottom() {},
  // 热更返回问题
  // onBackPress() {
  //     // #ifdef APP-PLUS
  //     // forceUpdate 1是强更新，不给退出
  //     // forceUpdate 0不是强制更新，可以退出
  //     if (this.forceUpdate === 1) {
  //         return true;
  //     } else {
  //         return false;
  //     }
  //     // #endif
  // },
  mounted() {
    // #ifdef H5
    this.showDownload = window.isMaskApp ? false : true
    // #endif
    // 获取登录状态
    let self = this;
    self.login = self.$api.isLogin();
    this.rechargeComplete();
    //判断全民返利功能是否开启
    self.getRegisterSet();
    if (self.login) {
      if (self.$server.getUser()) {
        self.uid = self.$server.getUser().user_id;
        self.username = self.$server.getUser().username;
        self.tenetid = self.$server.getUser().tenant_id;
      }
      self.getPlayerRecentGame(); //常玩
      //获取用户信息
      self.getUserdata();
      setTimeout(() => {
        self.$refs.loginBox.currMember();
      }, 500);
	  console.log("启动首页")
    }
    // #ifdef APP-PLUS
    this.langType = uni.getStorageSync("lang") || this.$config.locale || "vi";
    // #endif
    // #ifdef H5
    this.langType = uni.getStorageSync("lang") || window.locale || "vi";
    // #endif
  },
  created() {
    // #ifdef APP-PLUS
    // this.Appupdate(true);
    const res = uni.getSystemInfoSync();
    if (res.platform !== "ios") {
      this.isAndrod = true;
    }
    // #endif
    //#ifdef H5
    let skin = window.projectImgUrl;
    if(skin === 'wynn') {
      uni.setNavigationBarTitle({
        title: 'wynn - best bet coming｜Thương hiệu Casino chuyên nghiệp số 1 Việt Nam｜chuyên trang tổng hợp cá độ bóng đá, xổ số lô đề, casino trực tuyến, game bài, bắn cá giải trí',
      });
    }
    // #endif

    // 获取数据
    let self = this;
    self.hotGame(); //热门游戏
    self.recommendGame(); //推荐
    self.getBanner()
    uni.$on("advertising", function (data) {
      self.getPopUpAdsSetting();
    });

    // #ifdef H5
    this.getPopUpAdsSetting();
    // #endif

    // uni.$once("modelUp", (data) => {
    //     // 更新第四步,触发common.js更新逻辑,传入的分别为当前实例及更新对象
    //     this.$common.update(this, this.updatePackage);
    // });

    // 触发页面数据更新
    uni.$on("update", function (data) {
      if (self.$server.getUser()) {
        self.uid = self.$server.getUser().user_id;
        self.username = self.$server.getUser().username;
        self.tenetid = self.$server.getUser().tenant_id;
      }
      self.login = self.$api.isLogin();
      self.getGameMenu(); //获取菜单
      self.hotGame(); //热门游戏
      self.recommendGame(); //推荐
      self.getBanner()
      if (self.login) {
        self.getPlayerRecentGame(); //常玩
      }
      self.tabId = 1;
    });
    uni.$on("updateLoadData", () => {
      this.updateLoadData();
      this.$refs.NavBar.lang = this.langType;
    });
  },
  destroyed() {
    uni.$off("modelUp");
    uni.$off("advertising");
    uni.$off("update");
  },
  methods: {
    search(){

    },
    // 获取轮播
		getBanner() {
			this.$api.banners((err, res) => {
				if (err) return
				else{
					if (res?.length) {
						 this.worldCupData =  res.find((item) => item?.expand?.actFolder === "vi-redPacketRain") || {}
						if(Object.keys(this.worldCupData).length > 0){
              this.isWorldPop = true
							this.getThematicActivitiesByApp(this.worldCupData.urlId)
            }
					} else {
					  this.isWorldPop = false;
					}
				}

			}, false);
		},
    getThematicActivitiesByApp(urlId){
			this.$api.getThematicActivitiesByApp(urlId,(err,res)=>{})
		},
    onluckyWheelSimple() {
			if (!this.$api.isLogin()) {
			  uni.showToast({
        title: this.$t('请先登录'),
				icon: "none",
			  });
			} else {
			  let data = this.worldCupData;
			  if (data?.expand?.actType == 3) {
          this.$cache.set("activityId", data.urlId);
          this.$cache.set("activityItem", data);
          uni.navigateTo({
            url: "/pages/activity/activity",
          });
			  }
			}
    },
    rechargeComplete() {
      console.log("rechargeComplete:");
      if (!this.$api.isLogin()) {
        return;
      }
      this.$api._getAppNotSendLatestSuccessRecord(
        { memberId: this.$server.getUser().user_id },
        (err, res) => {
          console.log("rechargeComplete:", res);
          if (res) {
            if (!res.id) {
              return;
            }
            if (window.isMaskApp) {
              maskAppToNative(
                "rechargeComplete",
                '{"price":' + res.amount + "}"
              );
              maskAppOldToNative(
                "rechargeComplete",
                '{"price":' + res.amount + "}"
              );
            }

            this.$api._updateNotSendLatestSuccessRecord(
              { id: res.id },
              (err, res) => {
                console.log(
                  "rechargeComplete:_updateNotSendLatestSuccessRecord：",
                  res
                );
              }
            );
            this.firstRecharge(res.orderNo);
          }
        }
      );
    },
    firstRecharge(orderNo) {
      console.log("firstrecharge: orderNo=", orderNo);
      if (!orderNo) {
        return;
      }
      this.$api._getByOrderNo({ orderNo }, (err, res) => {
        if (!res) {
          return;
        }
        console.log("firstrecharge: payFirst=", res.payFirst);
        if (res.payFirst !== 0) {
          return;
        }
        if (window.isMaskApp) {
          maskAppToNative("firstrecharge");
          maskAppOldToNative("firstrecharge");
        }
      });
    },
    //
    updateLoadData() {
      this.getadd(); //获取菜单
      this.hotGame(); //热门游戏
      this.recommendGame(); //推荐
      if (this.login) {
        this.getPlayerRecentGame(); //常玩
      }
      this.$refs.HomeTabs && this.$refs.HomeTabs.setTab();
      this.tabId = 1;
    },
    // 获取用户数据
    getUserdata() {
      this.$api.userInfo(this.$server.getUser().user_id, (err, res) => {
        if (err) {
          return;
        }
        if (res) {
          this.getVipData(res.levelId);
        }
      });
    },
    //获取VIP信息
    getVipData(vip) {
      this.$api.getvipdata(vip, (err, res) => {
        if (res) {
          this.vipImg = res.gradeId - 1;
          if (this.vipImg == 0) {
            this.vipImg = "normal_user";
          }
        }
      });
    },
    // 匹配游戏
    differencePre(datas) {
      this.difference(
        datas.gamemenusparent,
        datas.item,
        datas.navIndex,
        datas.index
      );
    },
    difference(item, item2, index, j) {
      //#ifdef H5
      this.routerWeb(item, item2, index, j);
      // #endif
      //#ifdef APP-PLUS
      // 判断登录状态
      if (!this.login) {
        console.log("还未登录,请登录");
        uni.navigateTo({
          url: "../Login/Login",
        });
        return;
      }
      // 此状态跳转到列表
      if (item2.type == 1 || item2.type == 3) {
        // let gameList2 = this.listMe(item.children, 1)
        let gameList2 = item.children;
        let newJ = gameList2.findIndex((element) => element.name == item2.name); //返回的是索引下标：2
        let type = item2.type;
        uni.setStorageSync("gameList", gameList2);
        uni.navigateTo({
          url:
            "../gameList/gameList?index=" +
            index +
            "&j=" +
            newJ +
            "&type=" +
            type +
            "&gameKindId=" +
            item.id,
        });
      } else {
        if (index == 0) {
          this.dataClick1(item2, 1);
        } else {
          this.dataClick1(item2, 2);
        }
      }
      // #endif
    },
    // 跳转详情 bmw
    dataClick1(reqData, type) {
      console.log(reqData);
      let self = this;
      if (!this.login) {
        uni.navigateTo({
          url: "../login/login?type=0",
        });
        return;
      }
      uni.showLoading({
        title: "",
        mask: true,
      });
      let ids = "";

      if (type == 4) {
        ids = reqData.bannerGame.id;
      } else {
        ids = reqData.ids || reqData.id || reqData.gameId;
      }
      var req = [
        self.tenetid,
        self.username,
        reqData.vendorId,
        ids,
        self.$config.clientIp,
        self.uid,
        2,
      ];
      self.$api.getTokenUrl(
        ...req,
        function (err, res) {
          if (err) {
            uni.showToast({
              title: "",
              icon: "none",
            });
            // #ifdef H5
            self.winOpen.close();
            // self.winOpen = window.open('/error.html?type=1', '_blank');
            // #endif
          } else {
            let title = reqData.name;
            if (type == 4) {
              title = reqData.bannerGame.name;
            }
            //   ;
            // #ifdef H5
            self.winOpen.location.href = res.gameUrl; //改变页面的location
            console.log("准备进入游戏...");
            // #endif
            // #ifdef APP-PLUS
            let dataGame = {
              url: res,
              type: 1,
              title: title,
              req: req,
            };

            let platform = uni.getSystemInfoSync().platform;
            uni.setStorageSync("cutScreenFlag", true);
            uni.setStorageSync("platform", platform);
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
    // 跳转项目   判断是跳转到列表还是直接进入游戏
    routerWeb(item, item2, index, j) {
      // return
      // 判断登录状态
      if (!this.login) {
        uni.navigateTo({
          url: "/pages/Login/Login",
        });
        return;
      }
      // debugger
      // 此状态跳转到列表
      if (item2.type == 1 || item2.type == 3) {
        // let gameList2 = this.listMe(item.children, 1)
        let gameList2 = item.children;
        let newJ = gameList2.findIndex((element) => element.name == item2.name); //返回的是索引下标：2
        let type = item2.type;
        uni.setStorageSync("gameList", gameList2);
        uni.navigateTo({
          url:
            "/pages/gameList/gameList?index=" +
            index +
            "&j=" +
            newJ +
            "&type=" +
            type +
            "&gameKindId=" +
            item.id,
        });
      } else {
        this.dataClick(item2, 2);
      }
    },
    // 常玩游戏
    getPlayerRecentGame(index) {
      let self = this;
      let param = [
        self.tenetid,
        self.$config.clientIp,
        self.uid,
        self.username,
      ];
      self.$api.getPlayerRecentGame(
        ...param,
        function (err, res) {
          if (err) {
            console.log("%c" + "getPlayerRecentGame", "color:#a70a0a;", err);
          } else {
            self.changList = res;
          }
        },
        false
      );
    },
    // 推荐游戏
    recommendGame(index) {
      let self = this;
      self.$api.recommendGame(function (err, res) {
        if (err) {
          console.log("%c" + "recommendGame", "color:#a70a0a;", err);
        } else {
          self.tuiList = res;
        }
      }, false);
    },
    // 热门游戏
    hotGame(index) {
      let self = this;
      self.$api.hotGame(function (err, res) {
        if (err) {
          console.log("%c" + "hotGame", "color:#a70a0a;", err);
        } else {
          self.hotList = res;
          self.getGameMenu(); // 获取游戏列表
        }
      }, false);
    },
    // 获取游戏菜单
    getGameMenu() {
      let self = this;
      self.$api.gameMenu(async function (err, res) {
        if (err) {
          console.log("%c" + "menusList", "color:#a70a0a;", err);
        } else {
          // res = self.changeGameList(res);
          let item = {
            activeUrl: "/static/image/theme/a018/indexYiactzh_CN.png",
            defaultUrl: "/static/image/theme/a018/indexYidefzh_CN.png",
            children: [],
            clientId: 1,
            createdAt: 1573145245000,
            defaultUrl: "/static/image/theme/a018/indexYidefzh_CN.png",
            delFlag: 0,
            id: 1,
            ids: "",
            imgUrl: "",
            lft: 0,
            name: self.$t('热门推荐'),
            nameEn: "CASINO",
            openMode: null,
            parentId: null,
            rgt: 0,
            sort: 0,
            status: 1,
            tagsId: "",
            target: 0,
            type: 1,
            updatedAt: 1602656395000,
            url: "/slots",
          };
          item.children = self.hotList;
          self.originList = res;
          self.$server.setGameMenus(res);
          // let param = "";
          // res.forEach((parentArr) => {
          //   parentArr.children.forEach((childrendArr) => {
          //     if (childrendArr.nameEn == "fishing") {
          //       param = childrendArr;
          //     }
          //   });
          // });
          // await self.getGameByIds(param);
          // this.getGameByIds 放这里
          // 用 promise把getGameByIds包装一下，这里 await 请求成功再执行下边的self.getadd
          self.getadd();
        }
      }, false);
    },
    getGameByIds(param) {
      let self = this;
      let req = [1, 100000, param.ids, param.id];
      return new Promise((resolve) => {
        self.$api.getGameByIds(
          ...req,
          function (err, res) {
            if (err) {
              console.log("%c" + "menusList", "color:#a70a0a;", err);
            } else {
              self.buyuList = res.list;
              resolve(true);
              // console.log("------------------------------------", self.buyuList);
            }
          },
          false
        );
      });
    },
    getadd() {
      let arrLeft = this.originList;
      let lastArr = arrLeft[arrLeft.length - 1];
      if(!lastArr) return
      if (lastArr.children.length <= 1) {
        this.smallShow = true;
      }
      arrLeft = arrLeft.sort((a,b)=>{
        return a.sort - b.sort
      })
      // 热门
      let hotList = {
        name: 'Game Hot',
        id: 0,
        menuIconActiveApp: require("@/static/image/indexImg/menu-icon0.png"),
        children: this.hotList
      }
      arrLeft.unshift(hotList)
      this.leftArray = arrLeft; 
      // console.log(arrLeft,'arrleft')
      this.$refs.gameList.changeRightData(this.leftArray);
        // setTimeout(() => {
        //   this.leftArray = sortMap;
        //   this.$refs.gameList.changeRightData(this.leftArray);
        // }, 100);
    },
    // 更改右侧数据
    changeRightData(val) {
      // debugger
      this.gamemenusparent = val;
      this.gamemenus = val.children;
    },
    // 更改数组顺序
    changeGameList(val) {
      let newSort = [];
      // #ifdef  H5
      newSort = [1, 5, 3, 2, 4, 6];
      // #endif

      // #ifdef APP-PLUS
      newSort = [1, 5, 3, 2, 4, 6];
      // #endif

      let newArr = [];
      for (let i = 0; i < newSort.length; i++) {
        newArr = newArr.concat(val.filter((v) => v.id == newSort[i]));
      }
      return newArr;
    },
    // 打开救济金
    doShowRelief() {
      document.getElementById("relief").style.display = "block";
      this.showRelief = true;
    },
    // 点击跳转
    routerLink(type, id, subType) {
      const self = this
      if (!this.login) {
        uni.showToast({
          icon: "none",
          title: self.$t('请先登录'),
        });
        return;
      }
      if (!this.login && type !== 6) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      if (type == 1) {
        //充值
        uni.navigateTo({
          url: "/pages/recharge/recharge",
        });
      } else if (type == 2) {
        //转账
        uni.navigateTo({
          url: "/pages/transferAccounts/transferAccounts",
        });
      } else if (type == 3) {
        //提款
        uni.navigateTo({
          url: "/pages/account/account",
        });
      } else if (type == 4) {
        //返水
        uni.navigateTo({
          url: "/pages/returnWaterRecords/returnWaterRecords?id=5",
        });
      } else if (type == 5) {
        //彩金
        uni.navigateTo({
          url: "/pages/jackpot/jackpot",
        });
      } else if (type == 6) {
        //救济金
        this.showRelief = false;
        //救济金
        var title;
        // 跳转到vue项目
        var obj = {};
        var _this = this;
        // #ifdef H5
        obj.client = "h5";
        // #endif
        // #ifdef APP-PLUS
        obj.client = isIos ? "ios" : "android";
        // #endif
        obj.host = _this.$config.host;
        obj.clientCode = _this.$config.clientCode;
        obj.token = _this.$server.getToken();
        obj.col = _this.$config.themeIndex;
        obj.imgHost = _this.$config.imgHost;
        if (subType == 2) {
          obj.pageType = "signIn";
          obj.id = id;
          title = "签到";
          if (this.$api.isLogin()) {
            obj.memberId = cache.get("set_user").user_id;
          } else {
            uni.navigateTo({
              url: "/pages/login/login",
            });
            return;
          }
        } else if (subType == 1) {
          obj.pageType = "benefits";
          obj.id = id;
          title = "救济金详情";
        }
        var str = JSON.stringify(obj);
        // #ifdef H5
        str = window.btoa(str);
        // #endif
        // #ifdef APP-PLUS
        str = new Buffer(str).toString("base64");
        // #endif
        var url = _this.$config.codeUrl + "/webProject/index.html?s=" + str;
        _this.$server.setWinningUrl(url);
        uni.navigateTo({
          url: "/pages/webViewQQ/webViewQQ?url=6&title=" + title,
        });
      } else if (type == 7) {
        //积分商城
        uni.navigateTo({
          url: "/pages/mallStore/mallStore",
        });
      }
    },
    // 互动
    modelToast(e) {
      this.modelToastFlag = e;
      if (e === true) {
        uni.setStorageSync("modelGoApp", e);
      }
    },
    // 弹窗确认
    onConfirm(e) {
      let self = this;
      if (e === "update") {
        // #ifdef  APP-PLUS
        self.$common.update(this);
        // #endif
      }
      if (self.modeltype == "default") {
        let getClientCode = self.$config.clientCode;
        let ids = "";
        let code = self.code ? "/" + self.code : "";
        let appDowDataUrl = self.$config.dowUrl + getClientCode + code;
        if (self.goGameType == 1) {
          ids = self.goGameData.id;
        } else if (self.goGameType == 3) {
          ids = self.goGameData.gameId;
        } else if (self.goGameType == 4) {
          ids = self.goGameData.bannerGame.id;
        } else {
          ids = self.goGameData.ids;
        }
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
          winOpenNew = window.open("/waitPage.html", "_blank");
          setTimeout(function () {
            //这里使用setTimeout非常重要，没有将无法实现
            //原因是window.open会中断正在执行的进程，这样能保证其它代码执行完成再执行这个。
            winOpenNew.location.href = parensRes; //改变页面的location
          }, 100);
        } else {
          uni.navigateTo({
            url: "/pages/gameWebView/gameWebView",
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
    // 弹窗取消
    cancel(e) {
      this.modelvalue = false;
      if (e === "default") {
        this.goGame(this.goGameData, this.goGameType);
      }
      if (e === "centerWallet") {
        console.log(999, "取消");
      }
    },
    //立即进入
    enterGame(res) {
      this.dataClick(res, 3);
    },
    // 跳转详情
    dataClick(reqData, type) {
      const self = this
      if (!this.login) {
        if (type == 1) {
          uni.showToast({
            icon: "none",
            title: self.$t('请先登录'),
          });
        } else {
          uni.navigateTo({
            url: "/pages/login/login",
          });
        }
        return;
      }
      this.goGameData = reqData;
      this.goGameType = type;

      this.goGame(reqData, type);
    },
    // 打开左侧菜单
    openLeftMenu() {
      this.$refs.leftmenus.isShow = true;
    },
    // 进入游戏
    goPlayGame(reqData) {
      const self = this
      this.goGameData = null;
      if (!this.login) {
        uni.showToast({
          title: self.$t('请先登录'),
          icon: "none",
        });
        return;
      }
      this.goGameData = reqData;
      this.goGameDataClick(reqData);
    },
    // 进入游戏action
    goGameDataClick(reqData) {
      let self = this;
      let isIos = "";
      uni.showLoading({
        title: self.$t('正在进入游戏...'),
        mask: true,
      });

      var req = [
        self.tenetid,
        self.username,
        reqData.vendorId,
        reqData.ids,
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
            self.winOpen = window.open("", "_blank"); //首先打开一个新页面
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
                  title: self.$t('维护中'),
                  icon: "none",
                });
              } else {
                uni.showToast({
                  title: self.$t('进入游戏失败，请稍后重试！'),
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
                }, 100);
              } else {
                localStorage.setItem("newGameUrl", res.gameUrl);
                self.winOpen.location.href = "/error.html?type=2"; //改变页面的location
              }
            } else {
              self.$server.setWebView(res.gameUrl, 3, title, strCode); //1首页 ，2搜索，3游戏列表，4活动，5公告  6缺省页
              if (res.status === 1) {
                uni.navigateTo({
                  url: "/pages/gameWebView/gameWebView",
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
    // 打开公告弹窗
    openalert2() {
      this.modeltype = "share";
      this.modelvalue = true;
      this.$refs.pullKing.mDatas();
    },
    // 更新安装包
    openalert3() {
      this.modeltype = "update";
      this.modelvalue = true;
    },
    // 拉霸
    openalert4() {
      this.modeltype = "pullKing";
      this.modelvalue = true;
    },
    // 升级弹窗
    //     upModel() {
    // // #ifdef APP-PLUS
    // uni.navigateTo({
    // 	url: "/pages/modelPage/modelPage",
    // });
    // let modelJson = {
    // 	title: this.modeldata.title,
    // 	content: this.modeldata.content,
    // 	forceUpdate: this.forceUpdate,
    // 	url: this.modeldata.url,
    // };
    // uni.setStorageSync("modelJson", modelJson);
    // // #endif
    // // #ifdef  H5
    // self.modeldata.title = "发现新版本V" + res.newVersion + "，更新内容：";
    // self.modeldata.content = res.updateDescription;
    // self.modeldata.cancel = res.forceUpdate;
    // self.openalert3();
    // // #endif
    //     },
    //获取弹出规则
    getPopUpAdsSetting() {
      this.$api.getPopUpAdsSetting((err, res) => {
        if (res) {
          this.rules = res;
          if (res.length) {
            this.advertisingShow();
          }
          //0是弹JP 1是弹广告
          // if (this.rules.adType === 0 || this.rules.adType === 1) {
          // 	this.advertisingShow();
          // }
        }
      });
    },
    advertisingShow() {
      //弹出逻辑,popUpRule为0 1 2 分别对应弹出次数
      let that = this;
      if (that.rules[0].popUpRule === 0) {
        //不弹
        return;
      } else if (that.rules[0].popUpRule === 1) {
        //弹一次
        // 区分APP-PLUS和H5是因为App中没有sessionStorage方法,在APP中采用了vuex存储
        // #ifdef APP-PLUS
        if (!that.$store.state.advertisingShow) {
          let t = localStorage.getItem("isToday");
          if (t) {
            //有时间
            let nowt = new Date().getTime();
            that.isToday = that.$common.isToday(t, nowt);
            if (!that.isToday) {
              that.pullKing(); //调用弹出方法
              that.$store.commit("advertisingShow", true);
            }
          } else {
            //没时间
            that.pullKing();
            let timestamp = new Date().getTime();
            localStorage.setItem("isToday", timestamp);
            that.$store.commit("advertisingShow", true);
          }
        }
        // #endif

        // #ifdef H5
        const pullKingShow = sessionStorage.getItem("pullKingShow");
        if (pullKingShow == "false" || pullKingShow == null) {
          let t = localStorage.getItem("isToday");

          if (t) {
            //有时间
            let nowt = new Date().getTime();
            that.isToday = that.$common.isToday(t, nowt);
            if (!that.isToday) {
              that.pullKing();
              sessionStorage.setItem("pullKingShow", true);
            }
          } else {
            //没时间
            that.pullKing();
            let timestamp = new Date().getTime();
            localStorage.setItem("isToday", timestamp);
            sessionStorage.setItem("pullKingShow", true);
          }
        }
        // #endif
      } else if (that.rules[0].popUpRule === 2) {
        //每次打开都弹
        // #ifdef APP-PLUS
        if (!that.$store.state.advertisingShow) {
          that.pullKing();
          that.$store.commit("advertisingShow", true);
        }
        // #endif
        // #ifdef H5
        // that.pullKing(); 测试每次打开都弹
        const pullKingShow = sessionStorage.getItem("pullKingShow");
        if (pullKingShow == "false" || pullKingShow == null) {
          that.pullKing();
          sessionStorage.setItem("pullKingShow", true);
        }
        // #endif
      }
    },
    // JP和广告
    pullKing() {
      //弹出第三步,adType区分弹出的是JP还是广告 0是JP  1是广告
      let self = this;
      if (self.rules.adType === 0) {
        self.$api.getJackpot(function (err, res) {
          if (res) {
            res.dataList = self.spArray(3, res.dataList);
            self.modeldata = res;
            self.openalert4(); //这个方法传的modeltype值来判断弹出chunlei组件的哪个部分 传pullKing弹出JP
            self.$refs.pullKing.pullKing(self.rules); //调用JP逻辑,chunlei组件
          }
        }, false);
      } else {
        self.modeltype = "advertising"; //传advertising弹广告
        self.modelvalue = true;
        self.$refs.pullKing.advertising(self.rules); //调用广告逻辑,chunlei组件
      }
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
    // 进入游戏
    goGame(reqData, type) {
      let isIos = "";
      uni.showLoading({
        title: this.$t('正在进入游戏...'),
        mask: true,
      });
      let self = this;
      let ids = "";
      if (type == 4) {
        ids = reqData.bannerGame.id;
      } else {
        ids = reqData.ids || reqData.id || reqData.gameId;
      }
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
      var req = [
        self.tenetid,
        self.username,
        reqData.vendorId,
        ids,
        self.$config.clientIp,
        self.uid,
        2,
      ];
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
            let title = reqData.name;
            if (type == 4) {
              title = reqData.bannerGame.name;
            }
            // #ifdef H5
            if (isIos === "ios") {
              self.parensRes = res.gameUrl;
              if (res.status === 1) {
                //未冻结
                setTimeout(function () {
                  //这里使用setTimeout非常重要，没有将无法实现
                  console.log(self.winOpen);
                  self.winOpen.location.href = res.gameUrl; //改变页面的location
                }, 100);
              } else {
                localStorage.setItem("newGameUrl", res.gameUrl);
                self.winOpen.location.href = "/error.html?type=2"; //改变页面的location
              }
            } else {
              self.$server.setWebView(res.gameUrl, 1, title); //1首页 ，2搜索，3游戏列表，4活动，5公告  6缺省页
              if (res.status === 1) {
                uni.navigateTo({
                  url: "/pages/gameWebView/gameWebView",
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
            };
            uni.setStorageSync("dataGame", dataGame);
            if (self.centerWalletStatus) {
              uni.navigateTo({
                url: "/pages/webNvue/webNvue",
              });
            } else {
              self.openalert6();
            }
            // #endif
          }
        },
        true
      );
    },
    
    goGameNew(reqData, type) {
      let isIos = "";
      uni.showLoading({
        title: this.$t('正在进入游戏...'),
        mask: true,
      });
      let self = this;
      // let winOpen = ''
      // winOpen = window.open("aa", "_blank");
      let ids = "";
      if (type == 1) {
        //
        ids = reqData.id;
      } else if (type == 3) {
        ids = reqData.gameId;
      } else if (type == 4) {
        ids = reqData.bannerGame.id;
      } else {
        ids = reqData.ids;
      }

      // #ifdef H5
      uni.getSystemInfo({
        success: function (resNew) {
          // alert(res.platform)
          if (resNew.platform == "ios" || resNew.platform == "other") {
            isIos = "ios";
            self.isIos = true;
            if (self.centerWalletStatus === true) {
              self.winOpen = window.open("/waitPage.html", "_blank"); //首先打开一个新页面
              // winOpen = window.open("", "_blank"); //首先打开一个新页面
            }
          } else {
            isIos = "android";
            self.isIos = false;
          }
        },
      });
      // #endif
      var req = [
        self.tenetid,
        self.username,
        reqData.vendorId,
        ids,
        self.$config.clientIp,
        self.uid,
        2,
      ];
      self.$api.getTokenUrl(
        ...req,
        function (err, res) {
          // console.log('winOpen',winOpen)
          // winOpen.location.href = '/error.html'; //改变页面的location
          if (err) {
            if (isIos === "ios") {
              if (self.centerWalletStatus === true) {
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
            let title = reqData.name;
            if (type == 4) {
              title = reqData.bannerGame.name;
            }

            // #ifdef H5
            if (isIos === "ios") {
              // self.getCenterWallet(res, title)
              self.parensRes = res.gameUrl;
              if (self.centerWalletStatus) {
                setTimeout(function () {
                  //这里使用setTimeout非常重要，没有将无法实现

                  self.winOpen.location.href = res.gameUrl; //改变页面的location
                  // self.winOpen.location.href = res; //改变页面的location
                }, 100);
              } else {
                self.openalert6();
              }
            } else {
              self.$server.setWebView(res.gameUrl, 1, title); //1首页 ，2搜索，3游戏列表，4活动，5公告  6缺省页
              if (self.centerWalletStatus) {
                uni.navigateTo({
                  url: "/pages/gameWebView/gameWebView",
                });
              } else {
                self.openalert6();
              }
            }
            // #endif
            // #ifdef APP-PLUS
            let dataGame = {
              url: res.gameUrl,
              type: 1,
              title: title,
              req: req,
            };
            uni.setStorageSync("dataGame", dataGame);
            if (self.centerWalletStatus) {
              uni.navigateTo({
                url: "/pages/webNvue/webNvue",
              });
            } else {
              self.openalert6();
            }

            // #endif
          }
        },
        true
      );
    },
    // 获取系统配置-全民返利
    getRegisterSet() {
      const _this = this;
      this.$api.getRegisterSet("allowance_on", function (err, res) {
        if (res) {
          _this.isShowHighRebate = res.svalue && res.svalue.allowance_on;
          if (_this.isShowHighRebate) {
            if (_this.login) {
              _this.getMoneyF();
            }
          }
        }
      });
    },
    //获取返利金额
    getMoneyF() {
      this.$api.availableAmount(
        {
          clientCode: this.$config.clientCode,
        },
        (err, res) => {
          // console.log(err, res);
          if (res) {
            this.allPeopleMoney = res.allowance; //总奖励
          }
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  min-height: 100%;
  background-color: var(--hometheme);
  .site-name-wrap {
    width: 100%;
    background-color: #1d1c1c;
    text-align: center;
    line-height: 1;

    .yijiImg {
      height: 20px;
      width: auto;
      margin: 5px 0;
    }

    .goToPath {
      width: 35%;
      .selectUrl {
        text-align: center;
        border-radius: 40upx;
        color: #f9dc75;
        border: 1px solid #f9dc75;
        position: absolute;
        right: 20upx;
        line-height: 44upx;
        top: 12upx;
        padding: 0 16upx;
        font-size: 24upx;
      }
    }
  }

  .container {
    position: relative;
    padding: 7px 2% 0;
    /* #ifdef H5 */
    padding-bottom: 120upx;
    /* #endif */
    /* #ifdef APP-PLUS */
    padding-bottom: 100upx;
    /* #endif */
  }

  .p-bottom-40 {
    padding-bottom: 30upx !important;
  }
}

.popup_world {
	position: fixed;
	bottom: 160rpx;
	right: 16rpx;
	z-index: 99;
	width: 200rpx;
	height: 200rpx;
	z-index: 9;
	background: url("~@/static/image/price-bg.gif") no-repeat center/contain;
	.popup_close {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 10;
		width: 30rpx;
		height: 30rpx;
		background: url("~@/static/image/tNone.png") no-repeat center/contain;
	}
	.popup_bg {
		width: 100%;
		height: 100%;
	}
}
</style>