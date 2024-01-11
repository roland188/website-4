<template>
  <view class="content">
    <!-- 头部下载 -->
    <!-- #ifdef H5 -->
    <view
      class="fixedCon"
      v-show="showTop"
      style="
        width: 100%;
        height: 80upx;
        background: #000;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9;
      "
    >
      <image
        class="close"
        @click="closeTop()"
        src="@/static/image/mb/close-icon.png"
        mode="aspectFit"
      ></image>
      <view class="con">
        <view class="title1" v-if="this.$config.clientCode == 'amjs'"
          >{{ $t("掌上APP 千款游戏 随时随地 想玩就玩") }}
        </view>
        <view class="title1" v-else>{{ $t("千款游戏 随时随地 想玩就玩") }} </view>
      </view>
      <view class="btn" @click="dowApp()">
        <image
          src="@/static/image/mb/bm_img_d1.png"
          style="width: 68px; height: 22px"
          mode="aspectFit"
        ></image>
      </view>
      <view
        class="tutorial"
        @click="gotutorial"
        v-show="
          this.$config.clientCode === 'ylba' ||
          this.$config.clientCode === 'xpja'
        "
      >
        <image
          src="@/static/image/mb/bm_img_d2.png"
          style="width: 68px; height: 22px"
          mode="aspectFit"
        ></image>
      </view>
    </view>
    <!-- #endif -->

    <uni-nav-bar
      title=""
      :status-bar="true"
      :fixed="true"
      background-color="#0f0f0f"
      color="#f9dc75"
      :shadow="false"
      @clickRight="logout"
      left-icon="bars"
      @clickLeft="onLeft"
      :class="showTop ? 'fixedShow' : 'fixedHide'"
    >
      <image
        style="width: 260upx; height: 90upx; margin: 0 auto"
        :src="$config.platformLogo('logo')"
        mode="aspectFit"
      ></image>
    </uni-nav-bar>

    <!-- 易记域名 -->
    <view class="site-name-wrap" v-show="this.$config.clientCode == 'amjs'">
      <view class="siteName">
        易记域名: {{ $config.domainName }}
        <!-- <image src="../../static/image/indexImg/domain_new.gif" style="width: 340upx;height: 55upx;"></image> -->
      </view>
      <!-- 	<view class="goToPath">
				<view class="selectUrl" @click="dandelLine"> 选择线路 </view>
			</view> -->
    </view>
    <!-- 顶部 -->
    <view class="banner-wrap">
      <swiper
        class="screen-swiper"
        :circular="true"
        :autoplay="true"
        :indicator-dots="true"
        @change="change"
        interval="5000"
        duration="500"
      >
        <swiper-item
          class="bannerSwiper"
          v-for="(item, index) in swiperData"
          :key="index"
          @click="bannerTransGo(item)"
        >
          <image
            :src="$config.getImgUrl(item.pictureApp)"
            mode="aspectFill"
            @error="bannerImageError(index, item)"
          ></image>
        </swiper-item>
      </swiper>
    </view>
    <!-- 外壳 -->
    <view class="container" :class="{ 'p-bottom-40': isAndrod }">
      <!-- 公告 -->
      <view class="csCon" @tap="openalert2">
        <view class="title">最新动态 </view>
        <image src="@/static/image/indexImg/yuyi.gif" class="conGif"></image>
        <uni-notice-bar
          color="#fff"
          :speed="speed"
          background-color="transparent "
          class="gongList"
          scrollable="true"
          single="true"
          v-if="textWen"
          :text="textWen"
        ></uni-notice-bar>
      </view>
      <!-- 功能登录区域 -->
      <view class="conBgBox">
        <view class="conBox">
          <view class="usertitle" v-show="!login">
            <view class="welcome">
              {{ this.getTimeState() }}<text style="margin-left: 2px">!</text>
            </view>
            <view class="login-wrap">
              <view
                class="btns loginBtn"
                @click="toPage('../Login/Login?type=0')"
              >
                {{ $t('登录') }}
              </view>
              <view
                class="btns regBtn"
                @click="toPage('../Login/Login?type=1')"
              >
                {{ $t('注册') }}
              </view>
            </view>
          </view>
          <view class="conLeft" v-show="login">
            <view class="leftNone">
              <view class="leftTop moneyFlex">
                <image
                  src="../../static/image/indexImg/md.png"
                  mode=""
                  class="moenyIcon"
                ></image>
                <view class="moneyNum indexMoneyColor">
                  {{ $t('总余额') }}
                </view>
                <image
                  src="../../static/image/indexImg/requt.png"
                  mode=""
                  class="shuaImg"
                  :class="{ scroller: infoSwitch }"
                  @click="currMemberCheck"
                ></image>
              </view>

              <view class="leftBottom moneyTop">
                <view class="money indexMoneyColor">
                  <text class="textM">{{ $config.currency }}{{ dataJson.balance || "0.00" }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="conRight">
            <view class="rightLi" @tap="routerLink(1)">
              <view class="liIconBox">
                <image
                  src="../../static/image/indexImg/cz1.png"
                  mode="widthFix"
                  class="liIcon iconOne"
                ></image>
              </view>
              <view class="liName liNameTop threeColor">
                {{ $t('充值') }}
              </view>
            </view>
            <view class="rightLi" @tap="routerLink(3)">
              <view class="liIconBox">
                <image
                  src="../../static/image/indexImg/cz2.png"
                  mode="widthFix"
                  class="liIcon iconOne"
                ></image>
              </view>
              <view class="liName liNameTop threeColor">
                {{ $t('提现') }}
              </view>
            </view>
            <view class="rightLi" @tap="routerLink(4)">
              <view class="liIconBox">
                <image
                  src="../../static/image/indexImg/cz3.png"
                  mode="widthFix"
                  class="liIcon iconOne"
                ></image>
              </view>
              <view class="liName liNameTop threeColor">
                {{ $t('洗码') }}
              </view>
            </view>
            <view class="rightLi" @tap="routerLink(5)">
              <view class="liIconBox">
                <image
                  src="../../static/image/indexImg/cz4.png"
                  mode="widthFix"
                  class="liIcon iconOne"
                ></image>
              </view>
              <view class="liName liNameTop threeColor">
                {{ $t('奖励') }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 熱門 常玩 推薦 tab -->
      <HomeTabs
        :hotList="hotList"
        :tuiList="tuiList"
        :changList="changList"
        :goToGame="difference"
        :isLogin="this.login"
      />
      <!-- 游戏列表展示 -->
      <view class="gamelist">
        <!-- 左侧列表 -->
        <scroll-view class="nav" :scroll-top="navTop" scroll-y="true">
          <view
            class="con"
            v-for="(item, index) in leftArray"
            :key="index"
            :class="navIndex == index ? 'con-active' : ''"
            @click="changeIndex(index)"
          >
            <view class="bgicon">
              <image
                class="img"
                :src="getMyImg(index, navIndex)"
                mode="acpectFit"
                alt=""
              ></image>
            </view>
            {{ item.uiName }}
          </view>
        </scroll-view>
        <!-- 右侧列表 -->
        <scroll-view class="secondList" :scroll-top="navTop" scroll-y="true">
          <block v-for="(item, index) in gamemenus" :key="index">
            <view
              class="game"
              :class="arr[navIndex].includes(index) ? 'game1' : ''"
              v-if="item.name !== $t('捕鱼达人')"
            >
              <view
                class="inner inner1"
                @tap="difference(gamemenusparent, item, navIndex, index)"
              >
                <image
                  class="img"
                  :src="
                    item.imgUrlApp
                      ? $config.getImgUrl(item.imgUrlApp)
                      : item.pictureUrl
                      ? $config.getImgUrl(item.pictureUrl)
                      : noDate
                  "
                  mode="aspectFit"
                  alt=""
                ></image>

                <view class="title">{{ item.name }}</view>
              </view>
            </view>
          </block>
        </scroll-view>
      </view>
    </view>

    <!-- chunlei-modal -->
    <chunLei-modal
      v-model="modelvalue"
      :indexData="rules"
      ref="pullKing"
      @enterGame="enterGame"
      :mData="modeldata"
      :type="modeltype"
      :maskEnable="maskEnable"
      @onConfirm="onConfirm"
      @cancel="cancel"
      :tabbarHeight="tabbarHeight"
      @modelToast="modelToast"
      @routerLink="routerLink"
      @doShowRelief="doShowRelief"
      @goGameNew="goGameNew"
      navMask
    ></chunLei-modal>
    <LeftMenu ref="leftmenus" @Appupdate="Appupdate"></LeftMenu>
  </view>
</template>
<script>
import uniNoticeBar from "@/components/uni-notice-bar/uni-notice-bar.vue";
// import {uniCard} from '@dcloudio/uni-ui'
import LeftMenu from "../../components/leftMenu/leftMenu.vue";
import HomeTabs from "@/components/home-tabs.vue";
// const jyJPush = uni.requireNativePlugin("JY-JPush");
export default {
  components: {
    uniNoticeBar,
    LeftMenu,
    HomeTabs,
  },
  data() {
    return {
      // reliefNoticeChecked: JSON.parse(localStorage.getItem('reliefShow')), //选中不再提示
      pageNo: 1,
      pageSize: 21,
      vendorId: "",
      gameKindId: "",
      ids: "",
      showRelief: false, //显示救济金
      reliefData: [],
      vipImg: "normal_user",
      caiFlag: false,
      dowShow: "true",
      idVersion: "",
      diWebFlag: true,
      appBottom: false,
      tabImgNone: "../../static/image/indexImg/tabNoneImg.png",
      tabbarHeight: 50,
      dingWai: false,
      scrollFlag: false,
      upperThreshold: 100,
      scrollNew: 0,
      lastScrollTop: 0,
      scrollTopVer: 0,
      tabFlag: false,
      uid: "",
      tenetid: "",
      username: "",
      dataUrl: "",
      maskFlag: false,
      indicatorDots: false,
      current: 0,
      textWen: false,
      tabCur: 0,
      mainCur: 0,
      verticalNavTop: 0,
      load: true,
      login: false, //登录状态
      tabCurrentIndex: 0,
      toggleDelay: false, //横向滚动动画

      tabList: [],
      hotList: [],
      changList: [],
      tuiList: [],
      tabId: 1, //tabId
      scrollHeight: "500px",
      leftArray: [
        {
          no: 0,
        },
      ],
      // 新的list
      newArrayData: [
        {
          name: "电子游艺",
          id: "1",
          type: "游艺",
          defaultUrl:
            "../../static/image/theme/theme" +
            this.$config.themeIndex +
            "/indexYidef.png",
          activeUrl:
            "../../static/image/theme/theme" +
            this.$config.themeIndex +
            "/indexYiact.png",
          children: [
            {
              name: "",
              id: 0,
              isHot: 0,
              imgUrl: "",
            },
          ],
        },
        {
          type: "棋牌游戏",
          name: "tiyu",
          id: "88",
          defaultUrl: "../../static/image/indexImg/indexPai1.png",
          activeUrl: "../../static/image/indexImg/indexPai2.png",
          children: [
            {
              name: "",
              id: 0,
              isHot: 0,
              imgUrl: "",
            },
          ],
        },
        {
          type: "彩票游戏",
          name: "qipai",
          id: "3",
          defaultUrl: "../../static/image/indexImg/indexCai1.png",
          activeUrl: "../../static/image/indexImg/indexCai2.png",
          list: [
            {
              name: "幸运棋牌",
              id: 0,
              isHot: 0,
              imgUrl: "",
            },
          ],
        },
        {
          type: "视讯直播",
          name: "caipiao",
          defaultUrl: "../../static/image/indexImg/indexShi1.png",
          activeUrl: "../../static/image/indexImg/indexShi2.png",
          id: "3",
          list: [
            {
              name: "东森彩票",
              id: 0,
              isHot: 0,
              imgUrl: "",
            },
          ],
        },
        {
          type: "体育赛事",
          name: "shixun",
          id: "3",
          defaultUrl: "../../static/image/indexImg/indexTi1.png",
          activeUrl: "../../static/image/indexImg/indexTi2.png",
          list: [
            {
              name: "WM",
              id: 0,
              isHot: 0,
              imgUrl: "",
            },
          ],
        },
        {
          type: "电竞赛事",
          name: "dianjing",
          id: "3",
          defaultUrl: "../../static/image/indexImg/indexDian1.png",
          activeUrl: "../../static/image/indexImg/indexDian2.png",
          list: [
            {
              name: "东森电竞",
              id: 0,
              isHot: 1,
              imgUrl: "",
            },
          ],
        },
      ],
      leftIndex: 0,
      swiperData: [],
      getNoticesData: "",
      dataJson: {
        balance: "0.00",
        name: "xxx",
      },
      mainToggle: true, //中栏动画
      bottomShow: false, //大屏幕处理底部
      title: "Hello",
      modelvalue: false,
      modeltype: "share",
      modelvalue2: false,
      modeldata: {},
      modeltype2: "update",
      smallShow: false,
      scrollLeft: 0,
      old: {
        scrollLeft: 0,
        lastScrollTop: 0,
      },
      forceUpdate: null,
      intervalID: 0,
      hoursTip: "",
      windowHeight: 0,
      platform: "",
      verHeight: 364,
      shuaFlag: true,
      shuaTap: false,
      sw: "",
      ww: "",
      newScrollTop: 0,
      bottomHeight: 300,
      goGameData: {},
      rules: [], //弹出规则
      goGameType: null,
      appDowDataUrl: "", //app下载
      appaDowData: [],
      buyuList: [],
      modelToastFlag: false,
      code: "",
      sessInviteCode: "",
      timeApp: null,
      isIos: null,
      parensRes: "",
      winOpen: "",
      centerWalletStatus: null, //冻结状态
      // array: ['红色', '绿色', '流行', '月夜', '灰蓝色', '云', '黄色'],
      array: ["红色", "云"],
      indexA: 1,
      isToday: null,
      langData: [
        {
          name: "中文/简体",
          id: 1,
          val: "zh_CN",
        },
        {
          name: "中文/繁体",
          id: 2,
          val: "zh_HK",
        },
        {
          name: "英文",
          id: 3,
          val: "en",
        },
      ],
      langAct: 0,

      // 图片规则
      arr: [],

      // arr:[0,1,2,5],
      // 左侧列表图标
      leftMenuIcon: [],
      fishingCode: [],
      title: "bwin",
      swiperData: [],
      str: "",
      current: 0,
      speed: 30,
      textWen:
        "热门推荐 捕鱼达人 电子游艺 体育赛事 棋牌游戏 彩票游戏 视讯直播 电竞赛事", // 公告数据
      navTop: 0,
      originList: [], //原始游戏列表
      leftArray: [], // 左侧列表
      gamemenusparent: {}, // 右侧列表之父
      gamemenus: [], // 游戏列表
      navIndex: 0, //左侧列表索引
      login: false, // 登录状态
      noDate: require("@/static/image/gameerror.png"),
      updatePackage: {},
      updateShow: false,
      idVersion: "",
      tenMinuteSwitch: false,
      infoSwitch: false, // 刷新金额开关
      allPeopleMoney: "0.00", // 全民返利金额
      isShowHighRebate: false,
      showTop: true,
      isAndrod: false,
    };
  },
  computed: {
    maskEnable() {
      if (["advertising"].includes(this.modeltype)) return false; // 这个数组里的弹窗遮罩就不开启了
      return true;
    },
  },
  onPullDownRefresh() {
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 3000);
  },
  // 到达底部
  onReachBottom() {},
  onShow() {
    // 获取登录状态
    self = this;
    self.tenMinuteSwitch = false;
    self.login = self.$api.isLogin();

    if (self.login) {
      if (self.$server.getUser()) {
        self.uid = self.$server.getUser().user_id;
        self.username = self.$server.getUser().username;
        self.tenetid = self.$server.getUser().tenant_id;
      }
      self.getPlayerRecentGame(); //常玩
      //self.userBalanceAllVendor();
      //获取用户信息
      self.getUserdata();
      self.currMember();
    }

    //判断全民返利功能是否开启
    self.getRegisterSet();
  },
  // 热更返回问题
  onBackPress() {
    // #ifdef APP-PLUS
    // forceUpdate 1是强更新，不给退出
    // forceUpdate 0不是强制更新，可以退出
    if (this.forceUpdate === 1) {
      return true;
    } else {
      return false;
    }
    // #endif
  },
  onLoad(option) {
    console.log(this.$config);
    // #ifdef APP-PLUS
    this.Appupdate(true);
    const res = uni.getSystemInfoSync(); //g
    if (res.platform !== "ios") {
      this.isAndrod = true;
    }
    // #endif
    if (this.$config.clientCode == "amjs") {
      uni.setNavigationBarTitle({
        title: "以诚为本，赢在信誉",
      });
    } else if (this.$config.clientCode == "xpja") {
      uni.setNavigationBarTitle({
        title: "澳门新葡京",
      });
    } else if (this.$config.clientCode == "qxyl") {
      uni.setNavigationBarTitle({
        title: "千禧娱乐",
      });
    } else {
      uni.setNavigationBarTitle({
        title: "博美娱乐",
      });
    }
    let self = this;
    self.hotGame(); //热门游戏
    self.getBanner(); //获取banner图
    self.getNotices(); //获取公告
    self.recommendGame(); //推荐
    uni.$on("advertising", function (data) {
      self.getPopUpAdsSetting();
    });

    self.login = self.$api.isLogin();
    if (self.login) {
      if (self.$server.getUser()) {
        self.uid = self.$server.getUser().user_id;
        self.username = self.$server.getUser().username;
        self.tenetid = self.$server.getUser().tenant_id;
      }
      // self.getPlayerRecentGame(); //常玩
      // self.userBalanceAllVendor();
      //this.currMember(); //获取用户信息
    }
    uni.$on("update", function (data) {
      if (self.$server.getUser()) {
        self.uid = self.$server.getUser().user_id;
        self.username = self.$server.getUser().username;
        self.tenetid = self.$server.getUser().tenant_id;
      }
      self.login = self.$api.isLogin();
      self.getBanner(); //获取banner图
      self.getGameMenu(); //获取菜单
      self.getNotices(); //获取公告
      self.hotGame(); //热门游戏

      self.recommendGame(); //推荐
      if (self.login) {
        self.getPlayerRecentGame(); //常玩
        // self.userBalanceAllVendor();
      }
      self.tabId = 1;
    });
  },
  mounted() {
    // #ifdef H5
    this.getPopUpAdsSetting();
    // #endif

    uni.$once("modelUp", (data) => {
      // 更新第四步,触发common.js更新逻辑,传入的分别为当前实例及更新对象
      this.$common.update(this, this.updatePackage);
    });
  },
  onUnload() {
    uni.$off("modelUp");
  },

  methods: {
    getMyImg(index, navIndex) {
      if (!this.leftMenuIcon[index]) return "";
      return this.leftMenuIcon[index][index == navIndex ? "imgs" : "img"];
    },
    getTimeState() {
      // 获取当前时间
      let timeNow = new Date();
      // 获取当前小时
      let hours = timeNow.getHours();
      // 设置默认文字
      let text = ``;
      // 判断当前时间段
      if (hours >= 0 && hours <= 10) {
        text = `早上好`;
      } else if (hours > 10 && hours <= 14) {
        text = `中午好`;
      } else if (hours > 14 && hours <= 18) {
        text = `下午好`;
      } else if (hours > 18 && hours <= 24) {
        text = `晚上好`;
      }
      // 返回当前时间段对应的状态
      return text;
    },
    toPage(name, isLoginIntercept) {
      // isLoginIntercept  是否登录拦截   1是
      if (!isLoginIntercept) {
        //登录、注册
        uni.navigateTo({
          url: name,
        });
      } else {
        //登录拦截
        if (!this.islogin) {
          uni.navigateTo({
            url: "../Login/Login",
          });
        } else {
          uni.navigateTo({
            url: name,
          });
        }
      }
    },
    //线路选择
    dandelLine() {
      let href = "https://amjs.0054yb.com/";
      // #ifdef APP-PLUS
      plus.runtime.openURL(href);
      // #endif
      // #ifdef H5
      window.open(href);
      // #endif
    },

    // tui() {
    //   jyJPush.setJYJPushAlias(
    //     {
    //       userAlias: "testAlias",
    //     },
    //     (result) => {
    //       //  设置成功或者失败，都会通过这个result回调返回数据；数据格式保持极光返回的安卓/iOS数据一致
    //       //  注：若没有返回任何数据，考虑是否初始化完成

    //       uni.showModal({
    //         content: JSON.stringify(result),
    //       });
    //     }
    //   );
    // },
    // jyData() {
    //   jyJPush.addJYJPushReceiveNotificationListener((result) => {
    //     //  监听成功后，若收到推送，会在result返回对应的数据；数据格式保持极光返回的安卓/iOS数据一致
    //     uni.showToast({
    //       icon: "none",
    //       title: JSON.stringify(result),
    //     });
    //     alert(111, result);
    //   });

    //   jyJPush.setJYJPushAlias(
    //     {
    //       //  按照自己的业务需求来设置
    //       userAlias: "这里是需要设置的userAlias",
    //     },
    //     (result) => {
    //       //  设置成功或者失败，都会通过这个result回调返回数据；数据格式保持极光返回的安卓/iOS数据一致
    //       //  注：若没有返回任何数据，考虑是否初始化完成
    //       uni.showToast({
    //         icon: "none",
    //         title: JSON.stringify(result),
    //       });
    //     }
    //   );
    // },
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
    // 关闭顶部
    closeTop() {
      this.showTop = !this.showTop;
    },
    //救济金数据
    // getThematicActivitiesList() {
    // 	this.$api.getThematicActivitiesList({}, (err, res) => {
    // 		this.reliefData = res.content;
    // 		// if (!JSON.parse(localStorage.getItem('reliefShow'))) {
    // 		if (!JSON.parse(localStorage.getItem('reliefShow')) && !JSON.parse(sessionStorage.getItem('reliefShow')) && this.reliefData.length > 0) {
    // 			this.doShowRelief();
    // 		} else {
    //                   const pullKingShow = sessionStorage.getItem('pullKingShow');
    //                   if(this.rules.popUpRule === 0){//不弹
    //                       return;
    //                   }else if(this.rules.popUpRule === 1){//弹一次
    //                       if (pullKingShow == 'false' || pullKingShow == null) {
    //                           let t = localStorage.getItem('isToday');

    //                           if (t) {//有时间
    //                             let nowt = (new Date()).getTime();
    //                             this.isToday = this.$common.isToday(t,nowt);
    //                             if (!this.isToday) {
    //                               this.pullKing();
    //                               sessionStorage.setItem('pullKingShow', true);
    //                             }
    //                           }else{//没时间
    //                             let timestamp = (new Date()).getTime();
    //                             localStorage.setItem('isToday',timestamp);
    //                             sessionStorage.setItem('pullKingShow', true);
    //                             this.pullKing();
    //                           }
    //                       }
    //                   }else if(this.rules.popUpRule === 2){//每次打开都弹
    //                       if (pullKingShow == 'false' || pullKingShow == null) {
    //                           this.pullKing();
    //                           sessionStorage.setItem('pullKingShow', true);
    //                       }
    //                   }
    // 		}
    // 	});
    // },
    getPopUpAdsSetting() {
      //获取弹出规则
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
    // 关闭救济金
    // closeRelief() {
    // 	this.showRelief = false;

    // 	// #ifdef  H5
    // 	const pullKingShow = sessionStorage.getItem('pullKingShow');
    // 	if(this.rules.popUpRule === 0){//不弹
    // 	    return;
    // 	}else if(this.rules.popUpRule === 1){//弹一次
    // 	    if (pullKingShow == 'false' || pullKingShow == null) {
    // 	        let t = localStorage.getItem('isToday');

    // 	        if (t) {//有时间
    // 	          let nowt = (new Date()).getTime();
    // 	          this.isToday = this.$common.isToday(t,nowt);
    // 	          if (!this.isToday) {
    // 	            this.pullKing();
    // 	            sessionStorage.setItem('pullKingShow', true);
    // 	          }
    // 	        }else{//没时间
    // 	          let timestamp = (new Date()).getTime();
    // 	          localStorage.setItem('isToday',timestamp);
    // 	          sessionStorage.setItem('pullKingShow', true);
    // 	          this.pullKing();
    // 	        }
    // 	    }
    // 	}else if(this.rules.popUpRule === 2){//每次打开都弹
    // 	    if (pullKingShow == 'false' || pullKingShow == null) {
    // 	        this.pullKing();
    // 	        sessionStorage.setItem('pullKingShow', true);
    // 	    }
    // 	}
    // 	// #endif
    // },
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
    Appupdate(promptShow) {
      // console.log('Appupdate')
      //this.getPopUpAdsSetting() //测试
      // 更新第二步，调用方法，
      let that = this;
      var data = {
        appId: that.$config.theme,
        versionType: 2,
      };
      that.$api.appVersion(data, (err, res) => {
        if (res) {
          plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
            const models = uni.getSystemInfoSync();
            let code = Number(wgtinfo.version.replace(/\./g, ""));
            let pro = new Promise((resolve, reject) => {
              let arrays = res.map((item) => {
                return item.versionType;
              });
              resolve(arrays);
            });
            pro.then((arr) => {
              if (arr.includes(2)) {
                res.forEach((item) => {
                  if (item.versionType === 2) {
                    if (item.versionCode > code) {
                      that.$store.commit("update", that.$t('前往更新'));
                      that.modeldata.title =
                        that.$t('发现新版本V') + item.newVersion;
                      that.modeldata.content = item.updateDescription;
                      that.forceUpdate = item.forceUpdate;
                      that.modeldata.url = item.apkUrl;

                      if (item.versionCode - code > 1) {
                        that.modeldata.cancel = 1;
                      } else {
                        that.modeldata.cancel = item.forceUpdate;
                      }
                      that.idVersion = item.id;

                      that.updatePackage = item;
                      that.updateShow = true;
                      that.upModel();
                    } else {
                      // 判断返回数组的当前对象是ios还是安卓还是其它包，再用models.platform匹配当前机型，决定下载哪个对象的包
                      if (item.versionType === 4 && models.platform === "ios") {
                        //wgtinfo.versionCode是本机当前本版号，为string，-0字符串变数字方便判断
                        if (item.versionCode > code) {
                          // 需要更新,that.$store.commit('update', '前往更新')改变更新按钮的文本，前往更新和立即更新，分别对应跳外链和热更新
                          that.$store.commit("update", that.$t('立即更新'));
                          that.modeldata.title =
                            that.$t('发现新版本V') + item.newVersion;
                          that.modeldata.content = item.updateDescription;
                          that.forceUpdate = item.forceUpdate;
                          if (item.versionCode - code > 1) {
                            that.modeldata.cancel = 1;
                          } else {
                            that.modeldata.cancel = item.forceUpdate;
                          }

                          that.idVersion = item.id;
                          that.updatePackage = item;
                          that.updateShow = true;
                          //弹出更新弹窗
                          that.upModel();
                        } else {
                          //调用时传过来的true,区分弹出最新版本还是弹出jp和广告
                          if (!promptShow) {
                            uni.showToast({
                              title: that.$t('当前已是最新版本！'),
                              icon: "none",
                              duration: 2000,
                            });
                          } else {
                            //弹出规则第二步,如果不需要更新则获取弹出规则,此处为APP逻辑,H5则在第一步的时候直接调用getPopUpAdsSetting方法,H5不走Appupdate方法,在Appupdate函数里有APP-PLUS的判断只有APP会走更新代码
                            that.getPopUpAdsSetting(); //获取弹出规则
                          }
                        }
                      } else if (
                        item.versionType === 3 &&
                        models.platform === "android"
                      ) {
                        if (item.versionCode > code) {
                          that.$store.commit("update", that.$t('立即更新'));
                          that.modeldata.title =
                            that.$t('发现新版本V') + item.newVersion;
                          that.modeldata.content = item.updateDescription;
                          if (item.versionCode - code > 1) {
                            that.modeldata.cancel = 1;
                          } else {
                            that.modeldata.cancel = item.forceUpdate;
                          }
                          that.idVersion = item.id;
                          that.updatePackage = item;
                          that.updateShow = true;
                          that.upModel();
                        } else {
                          if (!promptShow) {
                            uni.showToast({
                              title: that.$t('当前已是最新版本！'),
                              icon: "none",
                              duration: 2000,
                            });
                          } else {
                            that.getPopUpAdsSetting(); //获取弹出规则
                          }
                        }
                      }
                    }
                  }
                });
              } else {
                res.forEach((item) => {
                  // 判断返回数组的当前对象是ios还是安卓还是其它包，再用models.platform匹配当前机型，决定下载哪个对象的包
                  if (item.versionType === 4 && models.platform === "ios") {
                    //wgtinfo.versionCode是本机当前本版号，为string，-0字符串变数字方便判断
                    if (item.versionCode > code) {
                      // 需要更新,that.$store.commit('update', '前往更新')改变更新按钮的文本，前往更新和立即更新，分别对应跳外链和热更新
                      that.$store.commit("update", that.$t('立即更新'));
                      that.modeldata.title =
                        that.$t('发现新版本V') + item.newVersion;
                      that.modeldata.content = item.updateDescription;
                      that.forceUpdate = item.forceUpdate;
                      if (item.versionCode - code > 1) {
                        that.modeldata.cancel = 1;
                      } else {
                        that.modeldata.cancel = item.forceUpdate;
                      }

                      that.idVersion = item.id;
                      that.updatePackage = item;
                      that.updateShow = true;
                      //弹出更新弹窗
                      that.upModel();
                    } else {
                      //调用时传过来的true,区分弹出最新版本还是弹出jp和广告
                      if (!promptShow) {
                        uni.showToast({
                          title: that.$t('当前已是最新版本！'),
                          icon: "none",
                          duration: 2000,
                        });
                      } else {
                        //弹出规则第二步,如果不需要更新则获取弹出规则,此处为APP逻辑,H5则在第一步的时候直接调用getPopUpAdsSetting方法,H5不走Appupdate方法,在Appupdate函数里有APP-PLUS的判断只有APP会走更新代码
                        that.getPopUpAdsSetting(); //获取弹出规则
                      }
                    }
                  } else if (
                    item.versionType === 3 &&
                    models.platform === "android"
                  ) {
                    if (item.versionCode > code) {
                      that.$store.commit("update", that.$t('立即更新'));
                      that.modeldata.title =
                        that.$t('发现新版本V') + item.newVersion;
                      that.modeldata.content = item.updateDescription;
                      that.forceUpdate = item.forceUpdate;
                      if (item.versionCode - code > 1) {
                        that.modeldata.cancel = 1;
                      } else {
                        that.modeldata.cancel = item.forceUpdate;
                      }
                      that.idVersion = item.id;
                      that.updatePackage = item;
                      that.updateShow = true;
                      that.upModel();
                    } else {
                      if (!promptShow) {
                        uni.showToast({
                          title: that.$t('当前已是最新版本！'),
                          icon: "none",
                          duration: 2000,
                        });
                      } else {
                        that.getPopUpAdsSetting(); //获取弹出规则
                      }
                    }
                  }
                });
              }
            });
          });
        }
      });
    },
    // 打开救济金
    doShowRelief() {
      sessionStorage.setItem("reliefShow", true);
      document.getElementById("relief").style.display = "block";
      this.showRelief = true;
    },
    bindPickerChange: function (e) {
      this.indexA = e.target.value;
      let aa = this.indexA + 1;
      if (this.array[e.target.value] === "云") {
        aa = 6;
      }
      sessionStorage.setItem("theme", aa);
      this.$config.themeIndex = aa;
      this.$router.go(0);
    },
    // 下载APP
    dowApp() {
      // let self = this;
      // let getClientCode = self.$config.clientCode + window.theme;
      // let code = self.sessInviteCode ? "/" + self.sessInviteCode : "";
      // let appDowDataUrl = self.$config.dowUrl + getClientCode + code;
      let url = location.origin + "/downloadUrl?",
        iosUrl = this.$server.getIosDownloadUrl(),
        androidUrl = this.$server.getAndroidDownloadUrl(),
        pcUrl = this.$server.getPcDownloadUrl();
      url += "code=" + window.childCode;
      if (iosUrl) {
        url += "&ios=" + encodeURIComponent(iosUrl);
      }
      if (androidUrl) {
        url += "&android=" + encodeURIComponent(androidUrl);
      }
      // if (pcUrl) {
      // 	url += '&pc=' + encodeURIComponent(pcUrl)
      // }

      window.location.href = url;
    },
    //关闭下载
    dowNone() {
      this.dowShow = false;
      sessionStorage.setItem("dowShow", false);
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
    // 获取彩金状态
    getNotReceive() {
      let self = this;
      self.$api.getNotReceive(function (err, res) {
        if (err) {
          console.log(err);
        } else {
          self.caiFlag = res.notReceiveState;
        }
      }, false);
    },
    // 刷新金额
    upMoney() {
      let self = this;
      if (self.shuaFlag) {
        self.shuaTap = true;
        self.shuaFlag = false;
        self.userBalanceAllVendor(1);
      } else {
        uni.showToast({
          title: self.$t('点击间隔10s，请勿重复操作！'),
          icon: "none",
        });
        self.shuaTap = false;
        setTimeout(function () {
          self.shuaFlag = true;
        }, 10000);
      }
    },
    // 跳转banner外部
    bannerWeb(item) {
      //1:外链 2:公告 3:活动 4:游戏 5:专题活动

      // item.adType?item.Type = item.adType:item.Type
      if (item.type === 1) {
        if (item.url) {
          uni.navigateTo({
            url: "../webViewQQ/webViewQQ?url=" + item.url,
          });
        }
      } else if (item.type === 2) {
        if (item.urlId) {
          // this.goNotices(item);
          uni.navigateTo({
            url: "../actDetail/actDetail?actId=" + item.urlId,
          });
        }
      } else if (item.type === 3) {
        if (item.urlId) {
          this.goActivitie(item);
        }
      } else if (item.type === 4) {
        // item.bannerGame.id?item.bannerGame.id:item.bannerGame.id = item.urlId
        if (this.$api.isLogin() && item.bannerGame.id) {
          this.goGame(item, 4);
        } else {
          uni.navigateTo({
            url: "../login/login",
          });
        }
      } else if (item.type === 5) {
        if (item.urlId) {
          this.routerLink(6, item.urlId);
        }
      }
      // if(item.url){
      // 	uni.navigateTo({
      // 		url:'../webViewQQ/webViewQQ?url='+item.url+'&title='+item.title
      // 	})
      // }
    },
    // banner图跳转
    bannerTransGo(item) {
      let self = this;
      //1:外链 2:公告 3:活动 4:游戏 5:专题活动
      if (item.type === 1) {
        if (item.url) {
          uni.navigateTo({
            url: "../webViewQQ/webViewQQ?url=" + item.url,
          });
        }
      } else if (item.type === 2) {
        // if (item.urlId) {
        // 	this.$sk.navigateTo('../MessageDetail/MessageDetail?id='+ item.urlId+'&type=2');
        // }

        uni.navigateTo({
          url: "../messageDetail/messageDetail?type=2&id=" + item.urlId,
        });
      } else if (item.type === 3) {
        if (item.urlId) {
          uni.navigateTo({
            url: "../actDetail/actDetail?id=" + item.urlId,
          });
        }
      } else if (item.type === 4) {
        if (this.$api.isLogin() && item.bannerGame.id) {
          this.goPlayGame(item.bannerGame);
        } else {
          uni.showToast({
            title: self.$t('请先登录'),
            icon: "none",
          });
        }
      } else if (item.type === 5) {
        if (item?.expand?.actType == 3) {
          if (!this.$api.isLogin()) {
            uni.showModal({
              title: self.$t('未登录或者登录超时'),
              content: self.$t('请您登录，再进行操作！'),
              showCancel: true,
              cancelText: self.$t('取消'),
              confirmText: self.$t('确认'),
              confirmColor: "#ee0a24",
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: "../Login/Login",
                  });
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              },
            });
            return;
          }
          this.$cache.set("activityId", item.urlId);
          this.$cache.set("activityUrl", item.expand.actUrl);
          uni.navigateTo({
            url: "/pages/activity/activity",
          });
        } else {
          if (item.urlId) {
            uni.navigateTo({
              //专题
              url: "../actDetail/actDetail?ByAppFlag=" + item.urlId,
            });
          }
        }
      }
    },
    // 进入游戏
    goPlayGame(reqData) {
      const self =this
      this.goGameData = null;

      // return
      if (!this.login) {
        uni.showToast({
          title: self.$t('请先登录'),
          icon: "none",
        });
        return;
      }
      // this.isLogin();
      // this.goGameDataClick(reqData)
      this.goGameData = reqData;

      // #ifdef H5

      let switchTip = uni.getStorageSync("noTipEnterGame");
      this.goGameDataClick(reqData);
      // if(switchTip){
      // 	this.goGameDataClick(reqData)
      // }else{
      // 	uni.$emit('openenterGame',1);
      // }
      // #endif

      // #ifdef APP-PLUS

      this.goGameDataClick(reqData);
      // #endif
    },
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
            // self.winOpen =  window.open("/waitPage.html?type=1", "_blank"); //首先打开一个新页面
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
    // 跳转到登录页面
    transGoLogin(router) {
      uni.navigateTo({
        url: router,
      });
    },
    readNotice(id) {
      //标记公告为已读
      var _this = this;
      var noticeIds = [id];
      this.$api.readNotice(
        "",
        "",
        "",
        "",
        _this.uid,
        noticeIds,
        "",
        "",
        0,
        0,
        0,
        "",
        function (err, res) {
          if (err) {
          } else {
          }
        },
        false
      );
    },
    goNotices(item) {
      // 跳转到外部页面
      if (this.$api.isLogin()) {
        this.readNotice(item.urlId);
      }
      let _this = this;
      var obj = {};
      obj.client = "h5";
      obj.token = _this.$server.getToken();
      obj.host = _this.$config.host;
      //图片服务器地址
      obj.imgHost = _this.$config.imgHost;
      obj.id = item.urlId;
      obj.clientCode = _this.$config.clientCode;
      obj.col = _this.$config.themeIndex;
      obj.type = 3;

      var str = JSON.stringify(obj);
      // #ifdef H5
      str = window.btoa(str);
      // #endif
      // #ifdef APP-PLUS
      str = new Buffer(str).toString("base64");
      // #endif
      var url = _this.$config.codeUrl + "/page/view.html?s=" + str;
      uni.navigateTo({
        url:
          "../webViewQQ/webViewQQ?url=" +
          url +
          "&title=" +
          _this.$t('公告信息'),
      });
    },
    goActivitie(item) {
      let _this = this;
      var obj = {};
      obj.client = "h5";
      obj.token = _this.$server.getToken();
      obj.host = _this.$config.host;
      obj.userId = _this.uid;
      //图片服务器地址
      obj.imgHost = _this.$config.imgHost;
      obj.type = 1;
      obj.id = item.urlId;
      obj.clientCode = _this.$config.clientCode;
      obj.col = _this.$config.themeIndex;
      var str = JSON.stringify(obj);

      // #ifdef H5
      str = window.btoa(str);
      // #endif
      // #ifdef APP-PLUS
      str = new Buffer(str).toString("base64");
      // #endif
      var url = _this.$config.codeUrl + "/page/view.html?s=" + str;
      //url太长，会被截取,存本地
      _this.$server.setActivityUrl(url);
      let title = item.urlName;
      uni.navigateTo({
        url: "../webViewQQ/webViewQQ?url=2" + "&title=" + title,
      });
    },
    phone() {
      let self = this;
      uni.getSystemInfo({
        success: function (res) {
          self.sw = res.screenHeight;
          self.ww = res.windowHeight;
          self.windowHeight = res.windowHeight;
          // #ifdef  APP-PLUS
          if (res.screenHeight >= 710) {
            self.scrollFlag = true;
          }
          // #endif

          // #ifdef  H5
          if (res.screenHeight > 710) {
            self.scrollFlag = true;
            // self.verHeight = res.screenHeight - 400;
          }
          // #endif
        },
      });
    },
    queryUp() {
      let self = this;
      self.$api.appVersion(
        2,
        function (err, res) {
          if (res) {
            if (res.versionCode > plus.runtime.versionCode) {
              //更新

              self.idVersion = res.id;
              self.forceUpdate = res.forceUpdate; //是否强制更新 0   1
              self.upModel();
            }
          }
        },
        false
      );
    },
    upModel() {
      let self = this
      // #ifdef APP-PLUS
      uni.navigateTo({
        url: "/pages/modelPage/modelPage",
      });
      let modelJson = {
        title: this.modeldata.title,
        content: this.modeldata.content,
        forceUpdate: this.forceUpdate,
        url: this.modeldata.url,
      };
      uni.setStorageSync("modelJson", modelJson);
      // #endif
      // #ifdef  H5
      self.modeldata.title =
      self.$t('发现新版本V') + res.newVersion + self.$t('，更新内容：');
      self.modeldata.content = res.updateDescription;
      self.modeldata.cancel = res.forceUpdate;
      self.openalert3();
      // #endif
    },
    onConfirm(e) {
      let self = this;
      if (e === "update") {
        // #ifdef  APP-PLUS
        self.$common.update(this);
        // #endif
      }
      if (self.modeltype == "default") {
        let getClientCode = self.$config.clientCode;
        // getClientCode = 'ybyl'
        let ids = "";
        let code = self.code ? "/" + self.code : "";
        let appDowDataUrl = self.$config.dowUrl + getClientCode + code;
        if (self.goGameType == 1) {
          //
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
          winOpenNew = window.open("/waitPage.html", "_blank");
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
    //立即进入
    enterGame(res) {
      this.dataClick(res, 3);
    },
    cancel(e) {
      this.modelvalue = false;
      if (e === "default") {
        this.goGame(this.goGameData, this.goGameType);
      }
      if (e === "centerWallet") {
        console.log(999, "取消");
      }
    },
    // 互动
    modelToast(e) {
      this.modelToastFlag = e;
      if (e === true) {
        uni.setStorageSync("modelGoApp", e);
      }
    },
    // banner图错误处理
    bannerImageError(i, t) {},
    getMycount() {
      let self = this;
      let date = new Date();
      if (date.getHours() >= 0 && date.getHours() < 11) {
        self.hoursTip = "上午好";
      } else if (date.getHours() >= 11 && date.getHours() < 13) {
        self.hoursTip = "中午好";
      } else if (date.getHours() >= 13 && date.getHours() < 18) {
        self.hoursTip = "下午好";
      } else {
        self.hoursTip = "晚上好";
      }
    },
    // 登出
    logout() {
      this.$api.logout();
      uni.clearStorageSync();
    },
    scrollTab: function (e) {
      this.old.scrollLeft = e.detail.scrollLeft;
    },

    //首页公告
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
    // 检测刷新
    currMemberCheck() {
      if (this.login) {
        this.currMember();
      } else {
        this.tologin();
      }
    },
    // 获取用户信息
    currMember() {
      let self = this;
      if (self.tenMinuteSwitch) {
        uni.showToast({
          title: "点击间隔10S,请勿重复操作",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      self.tenMinuteSwitch = true;
      self.infoSwitch = true;
      // self.$api.membersUser(
      //   self.uid,
      //   function (err, res) {
      //     if (err) {
      //     } else {
      //         ;
      //       let resData = res;
      //       resData.balance = self.$common.setNumFixed(res.balance, 2);
      //       // resData.balance = 3.33;
      //       self.dataJson = resData;
      //       // self.currMember1()
      //     }
      //     self.infoSwitch = false;
      //     setTimeout(() => {
      //       self.tenMinuteSwitch = false;
      //     }, 10000);
      //   },
      //   false
      // );
      let option = {
        clientId: this.$cache.get("set_user").tenant_id, //tenant_id
        clientIp: this.$config.clientIp,
        memberId: this.$cache.get("set_user").user_id, //userid
        username: this.$cache.get("set_user").username,
      };
      this.$api.getGameBalance(
        option,
        (err, res) => {
          if (err) {
          } else {
            // debugger;
            this.$server.setUserBalance(res);

            this.dataJson.balance = res.totalBalance.toFixed(2);
            this.dataJson.name = res.username;
          }
          self.infoSwitch = false;
          setTimeout(() => {
            self.tenMinuteSwitch = false;
          }, 10000);
        },
        false
      );
    },

    // 查询余额
    userBalanceAllVendor(type) {
      let self = this;
      self.shuaTap = true;
      let req = [self.uid, self.tenetid, self.username, self.$config.clientIp];
      self.$api.userBalanceAllVendor(
        ...req,
        function (err, res) {
          self.shuaTap = false;
          if (err) {
            if (type == 1) {
              uni.showToast({
                title: err.msg,
                icon: "none",
              });
            }
          } else {
            let resData = res;

            self.$server.setUserBalance(resData);
            resData.money = self.$common.setNumFixed(res.totalBalance, 2);
            self.dataJson.money = resData.money;
          }
        },
        false
      );
    },
    // 关闭弹窗
    maskNone() {
      this.maskFlag = false;
      // #ifdef  APP-PLUS
      uni.showTabBar();
      // #endif
    },
    // 图片健在完毕处理
    onImageLoad(e, i, j, item) {},
    // 图片报错处理
    imageError: function (i, j, item) {},
    // 轮播图变化
    change(e) {
      this.current = e.detail.current;
    },
    // 获取轮播图
    getBanner() {
      let req = [];
      let self = this;
      self.$api.banners(function (err, res) {
        if (err) {
        } else {
          self.swiperData = res;
          let str = self.$config.getImgUrl("/image/1.png");
        }
      }, false);
    },

    spArray(N, Q) {
      var R = [],
        F;
      for (F = 0; F < Q.length; ) {
        R.push(Q.slice(F, (F += N)));
      }
      return R;
    },
    advertising() {},

    // bian
    getadd() {
      let arrLeft = this.leftArray;
      let arrNewData = arrLeft.map((item) => {
        switch (item.name) {
          case "电子游艺":
            (item.defaultUrl = this.$config.themeImgUrl("indexYidef")),
              (item.activeUrl = this.$config.themeImgUrl("indexYiact"));
            break;
          case "棋牌游戏":
            (item.defaultUrl = this.$config.themeImgUrl("indexPaidef")),
              (item.activeUrl = this.$config.themeImgUrl("indexPaiact"));
            break;
          case "彩票游戏":
            (item.defaultUrl = this.$config.themeImgUrl("indexCaidef")),
              (item.activeUrl = this.$config.themeImgUrl("indexCaiact"));
            break;
          case "视讯直播":
            (item.defaultUrl = this.$config.themeImgUrl("indexShidef")),
              (item.activeUrl = this.$config.themeImgUrl("indexShiact"));
            break;
          case "体育赛事":
            (item.defaultUrl = this.$config.themeImgUrl("indexTidef")),
              (item.activeUrl = this.$config.themeImgUrl("indexTiact"));
            break;
          case "电竞赛事":
            (item.defaultUrl = this.$config.themeImgUrl("indexDiandef")),
              (item.activeUrl = this.$config.themeImgUrl("indexDianact"));
            break;
        }
      });
      let lastArr = arrLeft[arrLeft.length - 1];
      console.log(lastArr);
      if (lastArr.children.length <= 1) {
        this.smallShow = true;
      }
      this.newArrayData = arrLeft;
    },
    gotutorial() {
      uni.navigateTo({
        url: "/pages/tutorial/tutorial",
      });
    },
    // 去登陆  1登录2注册
    goLogin(type) {
      console.log("提交测试");
      if (type == 1) {
        uni.navigateTo({
          url: "../login/login",
        });
      } else {
        uni.navigateTo({
          url: "../Register/Register",
        });
      }
    },
    listMe: function (list, type) {
      return list.filter(function (item) {
        return item.type == type;
      });
    },
    listIndex: function (list, name) {
      return list.filter(function (item, index) {
        return item.name == name ? index : "";
      });
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
                  url: "../gameWebView/gameWebView",
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
    getCenterWalletNew(parensRes, panersTitle) {
      let self = this;
      let flag = self.$common.getCenterWallet();

      if (flag) {
        // #ifdef H5
        self.$server.setWebView(parensRes, 1, panersTitle); //1首页 ，2搜索，3游戏列表，4活动，5公告  6缺省页
        uni.navigateTo({
          url: "../gameWebView/gameWebView",
        });
        // #endif
        // #ifdef APP-PLUS
        uni.navigateTo({
          url: "/pages/webNvue/webNvue",
        });
        // #endif
      } else {
        self.openalert6();
      }
    },
    // 查询冻结状态
    getCenterWallet(parensRes, panersTitle) {
      let self = this;
      let memberId = self.$server.getUser().user_id;

      self.$api.getCenterWallet(
        memberId,
        function (err, res) {
          if (err) {
            console.log("99999", err);
          } else {
            if (res.status === 1) {
              //正常
              self.openalert6();
              // #ifdef H5
              if (self.isIos) {
                setTimeout(function () {
                  //这里使用setTimeout非常重要，没有将无法实现
                  //原因是window.open会中断正在执行的进程，这样能保证其它代码执行完成再执行这个。
                  winOpen.location.href = parensRes; //改变页面的location
                }, 100);
              } else {
                // uni.navigateTo({
                // 	url: '../gameWebView/gameWebView'
                // })
              }

              // #endif
              // #ifdef APP-PLUS
              uni.navigateTo({
                url: "/pages/webNvue/webNvue",
              });
              // #endif
            } else {
              //不正常
              self.openalert6();
            }
          }
        },
        false
      );
    },
    //
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
    // 前往搜索
    search() {
      if (!this.login) {
        uni.navigateTo({
          url: "../login/login",
        });
        return;
      }
      uni.navigateTo({
        url: "../search/search",
      });
    },
    // 点击跳转
    routerLink(type, id, subType) {
      if (!this.login) {
        // console.log('请登录----在跳转')
        uni.showToast({
          icon: "none",
          title: "请先登录",
        });
        return;
      }

      if (!this.login && type !== 6) {
        uni.navigateTo({
          url: "../login/login",
        });
        return;
      }
      if (type == 1) {
        //充值
        uni.navigateTo({
          url: "../recharge/recharge",
        });
      } else if (type == 2) {
        //转账
        uni.navigateTo({
          url: "../transferAccounts/transferAccounts",
        });
      } else if (type == 3) {
        //提款
        uni.navigateTo({
          url: "../account/account",
        });
      } else if (type == 4) {
        //返水
        uni.navigateTo({
          url: "../returnWaterRecords/returnWaterRecords?id=5",
        });
      } else if (type == 5) {
        //彩金

        uni.navigateTo({
          url: "/pages/jackpot/jackpot",
        });
      } else if (type == 6) {
        //救济金
        this.showRelief = false;
        // document.getElementById('relief').style.display = 'none';
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
        // -------------------subType 2为签到

        if (subType == 2) {
          obj.pageType = "signIn";
          obj.id = id;
          title = "签到";
          if (this.$api.isLogin()) {
            obj.memberId = cache.get("set_user").user_id;
          } else {
            uni.navigateTo({
              url: "../login/login",
            });
            return;
          }
        } else if (subType == 1) {
          obj.pageType = "benefits";
          obj.id = id;
          title = "救济金详情";
        }
        var str = JSON.stringify(obj);
        // console.log(str);
        // #ifdef H5
        str = window.btoa(str);
        // #endif
        // #ifdef APP-PLUS
        str = new Buffer(str).toString("base64");
        // #endif
        // --------------------------

        var url = _this.$config.codeUrl + "/webProject/index.html?s=" + str;
        // var url = 'http://localhost:3000/webProject/index.html?s=' + str;
        _this.$server.setWinningUrl(url);
        // if (subType == 1) {
        uni.navigateTo({
          url: "../webViewQQ/webViewQQ?url=6&title=" + title,
        });
        // } else if (subType == 2) {
        // 跳转到签到
        // uni.navigateTo({
        // 	url: '../webviewSignIn/webviewSignIn'
        // });
        // }
      }
    },
    //顶部tab点击
    // tabClick(index, id) {
    // 	if (this.toggleDelay) {
    // 		return;
    // 	}
    // 	if (!this.login && id == 2) {
    // 		// uni.navigateTo({
    // 		// 	url:'../login/login'
    // 		// })
    // 		uni.showToast({
    // 			icon: 'none',
    // 			title: '请先登录'
    // 		});
    // 		return;
    // 	}
    // 	this.scrollLeft = this.old.scrollLeft;
    // 	this.$nextTick(function() {
    // 		this.scrollLeft = 0;
    // 	});
    // 	this.tabId = id;
    // 	this.tabCurrentIndex = index;
    // 	this.tabList = [];
    // 	if (id == 1) {
    // 		//热门
    // 		this.tabList = this.hotList;
    // 	} else if (id == 2) {
    // 		//常玩
    // 		this.getPlayerRecentGame(index);
    // 		this.tabList = this.changList;
    // 	} else if (id == 3) {
    // 		//推荐
    // 		// this.recommendGame(index)
    // 		this.tabList = this.tuiList;
    // 	}
    // 	this.toggleDelay = true;
    // 	setTimeout(() => {
    // 		this.toggleDelay = false;
    // 	}, 1000);
    // },
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
    // 热门游戏
    hotGame(index) {
      let self = this;
      self.$api.hotGame(function (err, res) {
        if (err) {
          console.log("%c" + "hotGame", "color:#a70a0a;", err);
        } else {
          self.hotList = res;
          self.tabList = self.hotList;
          // console.log("热门游戏", res);
          // console.log("---热----", self.tabList);
          self.getGameMenu(); // 获取游戏列表
        }
      }, false);
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
    // 点击左边栏目
    TabSelect(e, index) {
      this.tabCur = index;
      this.mainCur = index;
      this.verticalNavTop = (index - 1) * 54;
      this.mainToggle = true;
      uni.pageScrollTo({
        scrollTop: 300,
        duration: 300,
      });
      this.scrollFlag = true;
    },
    // 外部壳子   滚动
    lastScroll(e) {
      this.old.lastScrollTop = e.detail.scrollTop;
      if (this.platform == 0 && this.scrollFlag) {
        var _detailY = e.detail.deltaY;
        if (_detailY >= 5) {
          this.scrollFlag = false;
        }
      }
    },
    // 外部壳子到底部
    lastLower(e) {
      this.scrollFlag = true;
    },
    // 外不刻字  顶部
    lastUpper() {
      this.dingWai = true;
    },
    VerticalMain(e) {
      // #ifdef MP-ALIPAY
      return false; //支付宝小程序暂时不支持双向联动
      // #endif
      // #ifdef H5
      if (this.newScrollTop <= 0) {
        this.scrollFlag = false;
      } else {
        this.scrollFlag = true;
      }
      // #endif
      let that = this;
      that.scrollTopVer = e.detail.scrollTop;
      that.scrollNew = that.scrollTopVer;
      let tabHeight = 0;
      if (this.load) {
        for (let i = 0; i < this.newArrayData.length; i++) {
          let view = uni.createSelectorQuery().select("#main-" + i);
          view
            .fields(
              {
                size: true,
              },
              (data) => {
                this.newArrayData[i].top = tabHeight;
                tabHeight = tabHeight + data.height;
                this.newArrayData[i].bottom = tabHeight;
              }
            )
            .exec();
        }
        this.load = false;
      }
      let scrollTop = e.detail.scrollTop + 10;
      for (let i = 0; i < this.newArrayData.length; i++) {
        if (
          scrollTop > this.newArrayData[i].top &&
          scrollTop < this.newArrayData[i].bottom
        ) {
          this.verticalNavTop = (i - 1) * 54;
          this.tabCur = i;
          this.mainCur = -1;
          if (this.tabCur != 0) {
            this.mainToggle = true;
          }
          return false;
        }
      }
    },
    // 滚动到顶部
    verticalToupper(e) {
      let that = this;
      console.log(88);
      if (that.platform == 1) {
        console.log(99);
        if (that.sw <= 736) {
          that.scrollFlag = false;
        } else {
          console.log(12);
          that.scrollFlag = true;
        }
      }
    },
    onPageScroll(obj) {
      this.newScrollTop = obj.scrollTop;
    },

    // 获取轮播图
    getBanner() {
      let req = [];
      let self = this;
      self.$api.banners(function (err, res) {
        if (err) {
        } else {
          self.swiperData = res;
          let str = self.$config.getImgUrl("/image/1.png");
        }
      }, false);
    },
    // 获取公告
    getNotices() {
      let req = [1, 5];
      let self = this;
      let textNav = "";
      self.$api.ptgNotices(
        ...req,
        function (err, res) {
          if (err) {
            console.log("%c" + "notices", "color:#a70a0a;", err);
          } else {
            for (var i = 0; i < res.content.length; i++) {
              textNav += res.content[i].content;
            }
            self.textWen = textNav;
            // console.log('获取公告数据',self.textWen)
            self.modeldata.notices = res.content;
          }
        },
        false
      );
    },

    // 获取游戏菜单
    getGameMenu() {
      let self = this;
      self.$api.gameMenu(async function (err, res) {
        if (err) {
          console.log("%c" + "menusList", "color:#a70a0a;", err);
        } else {
          res = self.changeGameList(res);
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
            name: "热门推荐",
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
          // res.unshift(item); //热门

          self.originList = res;
          let fish = res[1].children.filter((v) => {
            return v.id == "406";
          });

          // console.log('获取的原始数据',res)
          self.$server.setGameMenus(res);
          let param = "";
          res.forEach((parentArr) => {
            parentArr.children.forEach((childrendArr) => {
              if (childrendArr.nameEn == "fishing") {
                param = childrendArr;
              }
            });
          });
          await self.getGameByIds(param);
          // this.getGameByIds 放这里
          // 用 promise把getGameByIds包装一下，这里 await 请求成功再执行下边的self.getadd
          self.getadd();
        }
      }, false);
    },

    // 更改数组顺序
    changeGameList(val) {
      // this.fishingCode = val;
      // let param = val[0].children[12];

      // let newSort = [1,7,5,2,6,4,3];
      let newSort = [];
      // #ifdef  H5
      // newSort = window.sortArr || [1, 2, 3, 4, 5, 6];
      newSort = [1, 5, 3, 2, 4, 6];

      // #endif
      // console.log(this.$config.sortArr,99999999999999)
      // #ifdef APP-PLUS
      // newSort = this.$config.sortArr || [1, 2, 3, 4, 5, 6];
      newSort = [1, 5, 3, 2, 4, 6];
      // #endif
      let newArr = [];
      for (let i = 0; i < newSort.length; i++) {
        newArr = newArr.concat(val.filter((v) => v.id == newSort[i]));
      }
      // console.log("新组成的数组", newArr);

      return newArr;
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
    // bian
    getadd() {
      // console.log('得到的列表', this.originList)
      let arrLeft = this.originList;
      let lang = "zh_CN";
      // console.log("测试语言", lang);
      let arrNewData = arrLeft.map((item) => {
        switch (item.name) {
          case "电子游艺":
            (item.defaultUrl = this.$config.themeImgUrl("indexYidef" + lang)),
              (item.activeUrl = this.$config.themeImgUrl("indexYiact" + lang));
            break;
          case "棋牌游戏":
            (item.defaultUrl = this.$config.themeImgUrl("indexPaidef" + lang)),
              (item.activeUrl = this.$config.themeImgUrl("indexPaiact" + lang));
            break;
          case "彩票游戏":
            (item.defaultUrl = this.$config.themeImgUrl("indexCaidef" + lang)),
              (item.activeUrl = this.$config.themeImgUrl("indexCaiact" + lang));
            break;
          case "视讯直播":
            (item.defaultUrl = this.$config.themeImgUrl("indexShidef" + lang)),
              (item.activeUrl = this.$config.themeImgUrl("indexShiact" + lang));
            break;
          case "体育赛事":
            (item.defaultUrl = this.$config.themeImgUrl("indexTidef" + lang)),
              (item.activeUrl = this.$config.themeImgUrl("indexTiact" + lang));
            break;
          case "电竞赛事":
            (item.defaultUrl = this.$config.themeImgUrl("indexDiandef" + lang)),
              (item.activeUrl = this.$config.themeImgUrl(
                "indexDianact" + lang
              ));
            break;
        }
      });
      // console.log("123列表", arrNewData);
      let lastArr = arrLeft[arrLeft.length - 1];
      if (lastArr.children.length <= 1) {
        this.smallShow = true;
      }
      // console.log('arrLeft', arrLeft);
      this.leftArray = arrLeft;
      // console.log("左侧数据---------------------", this.leftArray);

      let childs = [];
      this.buyuList.forEach((item) => {
        childs.push(item);
      });
      var fish = {};
      fish.id = 4;
      fish.name = "捕鱼游戏";
      fish.children = childs;
      this.leftArray.push(fish);

      if (
        this.$config.clientCode == "amjs" ||
        this.$config.clientCode == "xpja" ||
        this.$config.clientCode == "qxyl"
      ) {
        //   //体育电竞 真人视讯 电子游艺  棋牌游戏 捕鱼游戏  彩票游戏
        this.arr = [
          [0],
          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20,
          ],
          [],
          [],
          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20,
          ],
          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20,
          ],
        ];
        this.leftMenuIcon = [
          {
            img: require("@/static/image/indexImg/dz.png"),
            imgs: require("@/static/image/indexImg/dz-active.png"),
          },
          {
            img: require("@/static/image/indexImg/zr.png"),
            imgs: require("@/static/image/indexImg/zr-active.png"),
          },
          {
            img: require("@/static/image/indexImg/qp.png"),
            imgs: require("@/static/image/indexImg/qp-active.png"),
          },
          {
            img: require("@/static/image/indexImg/by.png"),
            imgs: require("@/static/image/indexImg/by-active.png"),
          },
          {
            img: require("@/static/image/indexImg/ty.png"),
            imgs: require("@/static/image/indexImg/ty-active.png"),
          },
          {
            img: require("@/static/image/indexImg/cp.png"),
            imgs: require("@/static/image/indexImg/cp-active.png"),
          },
        ];
        const sortMap = [
          {
            uiName: "电子游艺",
            originName: ["电子游艺"],
          },
          {
            uiName: "真人视讯",
            originName: ["视讯直播"],
          },
          {
            uiName: "棋牌游戏",
            originName: ["棋牌游戏"],
          },
          {
            uiName: "捕鱼游戏",
            originName: ["捕鱼游戏"],
          },
          {
            uiName: "体育电竞",
            originName: ["体育赛事", "电竞赛事"],
          },
          {
            uiName: "彩票游戏",
            originName: ["彩票游戏"],
          },
        ];
        sortMap.forEach((a) => {
          this.leftArray.forEach((b) => {
            if (a.originName.includes(b.name)) {
              if (a.name) {
                // 已经赋值第一个分类了，合并后来数据的children
                a.children.push(...b.children);
              } else {
                Object.assign(a, b);
              }
            }
          });
        });

        setTimeout(() => {
          this.leftArray = sortMap;
          this.changeRightData(this.leftArray);
        }, 100);
      } else {
        // !=amjs 体育电竞 真人视讯 电子游艺  棋牌游戏 捕鱼游戏  彩票游戏
        this.arr = [
          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20,
          ],
          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20,
          ],
          [0],

          [],
          [],

          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20,
          ],
        ];
        this.leftMenuIcon = [
          {
            img: require("@/static/image/indexImg/ty.png"),
            imgs: require("@/static/image/indexImg/ty-active.png"),
          },
          {
            img: require("@/static/image/indexImg/zr.png"),
            imgs: require("@/static/image/indexImg/zr-active.png"),
          },
          {
            img: require("@/static/image/indexImg/dz.png"),
            imgs: require("@/static/image/indexImg/dz-active.png"),
          },

          {
            img: require("@/static/image/indexImg/qp.png"),
            imgs: require("@/static/image/indexImg/qp-active.png"),
          },
          {
            img: require("@/static/image/indexImg/by.png"),
            imgs: require("@/static/image/indexImg/by-active.png"),
          },

          {
            img: require("@/static/image/indexImg/cp.png"),
            imgs: require("@/static/image/indexImg/cp-active.png"),
          },
        ];
        const sortMap = [
          {
            uiName: "体育电竞",
            originName: ["体育赛事", "电竞赛事"],
          },
          {
            uiName: "真人视讯",
            originName: ["视讯直播"],
          },
          {
            uiName: "电子游艺",
            originName: ["电子游艺"],
          },

          {
            uiName: "棋牌游戏",
            originName: ["棋牌游戏"],
          },
          {
            uiName: "捕鱼游戏",
            originName: ["捕鱼游戏"],
          },

          {
            uiName: "彩票游戏",
            originName: ["彩票游戏"],
          },
        ];
        sortMap.forEach((a) => {
          this.leftArray.forEach((b) => {
            if (a.originName.includes(b.name)) {
              if (a.name) {
                // 已经赋值第一个分类了，合并后来数据的children
                a.children.push(...b.children);
              } else {
                Object.assign(a, b);
              }
            }
          });
        });

        setTimeout(() => {
          this.leftArray = sortMap;
          this.changeRightData(this.leftArray);
        }, 100);
      }

      // const sortMap = [
      //   {
      //     uiName: "电子游艺",
      //     originName: ["电子游艺"],
      //   },
      //   {
      //     uiName: "真人视讯",
      //     originName: ["视讯直播"],
      //   },
      //   {
      //     uiName: "棋牌游戏",
      //     originName: ["棋牌游戏"],
      //   },
      //   {
      //     uiName: "捕鱼游戏",
      //     originName: ["捕鱼游戏"],
      //   },
      //   {
      //     uiName: "体育电竞",
      //     originName: ["体育赛事", "电竞赛事"],
      //   },
      //   {
      //     uiName: "彩票游戏",
      //     originName: ["彩票游戏"],
      //   },
      // ];
      // sortMap.forEach((a) => {
      //   this.leftArray.forEach((b) => {
      //     if (a.originName.includes(b.name)) {
      //       if (a.name) {
      //         // 已经赋值第一个分类了，合并后来数据的children
      //         a.children.push(...b.children);
      //       } else {
      //         Object.assign(a, b);
      //       }
      //     }
      //   });
      // });

      // setTimeout(() => {
      //   this.leftArray = sortMap;
      //   this.changeRightData(this.leftArray);
      // }, 100);
    },

    // 更改右侧数据
    changeRightData(val) {
      // debugger
      this.gamemenusparent = val[this.navIndex];
      this.gamemenus = val[this.navIndex].children;
      // console.log(this.gamemenus);
    },
    // 更改左侧列表选中
    changeIndex(val) {
      this.navIndex = val;
      this.changeRightData(this.leftArray);
    },

    // 跳转项目   判断是跳转到列表还是直接进入游戏
    routerWeb(item, item2, index, j) {
      // return
      // 判断登录状态
      if (!this.login) {
        uni.navigateTo({
          url: "../Login/Login",
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
        this.dataClick(item2, 2);
      }
    },
    // 跳转详情
    dataClick(reqData, type) {
      // console.log(reqData);
      if (!this.login) {
        if (type == 1) {
          uni.showToast({
            icon: "none",
            title: "请先登录",
          });
        } else {
          uni.navigateTo({
            url: "../login/login",
          });
        }
        return;
      }
      this.goGameData = reqData;
      this.goGameType = type;

      this.goGame(reqData, type);
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

    goGame(reqData, type) {
      // console.log(reqData, "000000000000000000000");
      let isIos = "";
      uni.showLoading({
        title: this.$t('正在进入游戏...'),
        mask: true,
      });
      let self = this;

      // let winOpen = ''
      // winOpen = window.open("aa", "_blank");
      let ids = "";
      // if (type == 1) {
      // 	//
      // 	ids = reqData.id;
      // } else if (type == 3) {
      // 	ids = reqData.gameId;
      // } else if (type == 4) {
      // 	ids = reqData.bannerGame.id;
      // } else {
      // 	ids = reqData.ids;
      // }

      if (type == 4) {
        ids = reqData.bannerGame.id;
      } else {
        ids = reqData.ids || reqData.id || reqData.gameId;
      }

      // #ifdef H5
      uni.getSystemInfo({
        success: function (resNew) {
          // alert(res.platform)
          if (reqData.openMode === 1) {
            isIos = "ios";
            self.isIos = true;

            // if(self.centerWalletStatus === true){
            self.winOpen = window.open("/waitPage.html?type=1", "_blank"); //首先打开一个新页面
            // winOpen = window.open("", "_blank"); //首先打开一个新页面
            // }
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
              // if(self.centerWalletStatus === true){
              self.winOpen.location.href = "/error.html?type=1"; //改变页面的location
              // }
              // else{
              // 	uni.showToast({
              // 		title: '维护中',
              // 		icon: 'none',
              // 	})
              // }
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
            // console.log("dizhi", res);

            // #ifdef H5
            if (isIos === "ios") {
              // alert('ios')
              // self.getCenterWallet(res, title)
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
                // alert(2222)
                localStorage.setItem("newGameUrl", res.gameUrl);
                self.winOpen.location.href = "/error.html?type=2"; //改变页面的location
                // self.winOpen.close()
                // self.openalert6()
              }
            } else {
              // alert('else')
              self.$server.setWebView(res.gameUrl, 1, title); //1首页 ，2搜索，3游戏列表，4活动，5公告  6缺省页
              if (res.status === 1) {
                // alert('进入1')
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
    //立即进入
    enterGame(res) {
      this.dataClick(res, 3);
    },
    change(e) {
      this.current = e.detail.current;
    },

    // 登录
    tologin() {
      uni.navigateTo({
        url: "../Login/Login",
      });
    },
    // 跳转全民返利
    allpeople() {
      if (this.login) {
        console.log("已登陆");
        console.log("跳转全民返利");
        uni.navigateTo({
          url: "../highMargin/highMargin",
        });
      } else {
        console.log("未登录");
        this.tologin();
      }
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

    onKeyInput: function (event) {
      console.log(event);
      this.$nextTick(function () {
        this.aa = 33;
      });
    },
    aas() {
      console.log(88);
      uni.navigateTo({
        url: "../my/my",
        animationType: "zoom-fade-out",
        animationDuration: 300,
      });
    },
    onLeft() {
      this.$refs.leftmenus.isShow = true;
    },
    getRegisterSet() {
      var _this = this;
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
  },
};
</script>
<style lang="less" scoped>
.content {
  min-height: 100%;
  background-color: #0f0f0f;

  .my-jb-img {
    width: 114rpx;
    height: auto;
    vertical-align: bottom;
    margin-left: 10upx;
    position: absolute;
    margin-top: 4upx;
  }

  .fixedCon {
    width: 100%;
    height: 100upx;
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999 !important;
    display: flex;
    justify-content: center;
    padding: 0 17upx;

    .close {
      width: 50upx;
      height: 50upx;
      margin-top: 10upx;
    }

    .con {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      margin-top: 20upx;

      .title1 {
        font-size: 26upx;
        color: #e4e4e4;
      }
    }

    .btn {
      margin-top: 20upx;
      width: 166upx;
      height: 58upx;
      line-height: 58upx;
      text-align: center;
      font-size: 24upx;
      color: #444;
      border-radius: 8upx;
    }

    .tutorial {
      margin-top: 20upx;
    }
  }

  // 顶部
  .topView {
    width: 100%;
    height: 42px;
    font: 16px/42px normal;
    text-align: center;
    color: white;
  }

  // 轮播
  .screen-swiper {
    width: 100%;
  }

  .site-name-wrap {
    width: 100%;
    // position: relative;
    // display: flex;
    // justify-content: center;
    background-color: #1d1c1c;
    opacity: 0.8;
    text-align: center;

    .siteName {
      // width: 65%;
      color: #f9dc75;
      font-size: 24upx;
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

  .banner-wrap {
    width: 100%;
    height: 330upx;

    ::v-deep .screen-swiper {
      min-height: 330upx;
    }
  }

  .container {
    position: relative;
    padding: 7px 4% 0;
    /* #ifdef H5 */
    padding-bottom: 120upx;
    /* #endif */
    /* #ifdef APP-PLUS */
    padding-bottom: 100upx;
    /* #endif */

    // 公告
    .csCon {
      box-sizing: border-box;
      padding-left: 170upx;
      overflow: hidden;
      position: relative;
      height: 23px;

      .title {
        position: absolute;
        left: 0;
        top: 0;
        color: #424242;
        font-size: 24upx;
        background: linear-gradient(90deg, #e0b74a, #fce760);
        padding: 0 12upx;
        border-radius: 10upx;
      }

      .conGif {
        width: 26upx;
        height: 30upx;
        position: absolute;
        left: 62px;
        top: 3px;
      }

      .gongList {
        font: 16px/30px normal;
      }
    }

    // 功能登录区域
    .conBgBox {
      // padding: 0upx 30upx;
      margin-top: 5px;
      height: 100upx;

      .conBox {
        display: flex;

        /* border-bottom: 1px solid #F5F6F8; */
        .usertitle {
          width: 35%;
          font: 14px/26px normal;
          position: relative;

          .welcome {
            color: #fce760;
            font-size: 24upx;
            margin-left: 10upx;
          }

          .login-wrap {
            width: 100%;
            display: flex;

            .btns {
              width: 40%;

              font-size: 24upx;
              border-radius: 50upx;
              text-align: center;
            }

            .loginBtn {
              color: #000;
              border: none;
              background: linear-gradient(90deg, #e0b74a, #fce760);
            }

            .regBtn {
              margin-left: 20upx;
              color: #fce760;
              border: 1px solid #fce760;
            }
          }

          .userinfo {
            float: left;
            margin-left: 10px;
            width: 100%;
            position: relative;
          }

          .com {
            float: right;
            margin-right: 10px;
          }
        }

        .conLeft {
          flex-grow: 0;
          width: 106px;
          padding: 0px 4px;

          .leftNone {
            .leftTop {
              color: #888787;
              font-size: 10px;
              padding-left: 2px;

              .moenyIcon {
                width: 17px;
                height: 17px;
              }

              .moneyNum {
                font-size: 24upx;
                margin-left: 4px;
                margin-top: 2px;
                font-weight: 700;
              }

              .indexMoneyColor {
                color: #c2c2c2;
              }

              .shuaImg {
                width: 28upx;
                height: 28upx;
                margin-left: 4px;
              }
            }

            .leftBottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: -6px;

              .money {
                font-size: 40upx;
                font-weight: bold;
                color: #fbe18e;
                padding-left: 2px;
              }
            }

            .moneyFlex {
              display: flex;
              align-items: center;
            }
          }
        }

        .conRight {
          display: flex;
          flex-grow: 1;
          align-items: center;

          justify-content: flex-end;

          .rightLi {
            width: 25%;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            position: relative;

            .liIconBox {
              display: -webkit-box;
              display: -webkit-flex;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 50upx;

              .liIcon {
                display: block;
                width: 70upx;
              }
            }

            .liName {
              width: 100%;
              text-align: center;
              font-size: 28upx;
              margin-top: 4px;
              color: #e6d7b4;
            }
          }
        }

        .beforelogin {
          position: relative;
          width: 100%;
          height: 52px;
          line-height: 52px;

          .btn {
            font: 12px/24px normal;
            float: left;
            height: 24px;
            width: 80px;
            border: 1px solid #868686;
            color: #868686;
            border-radius: 15px;
            text-align: center;
            margin-left: 10px;
          }
        }

        .title {
          float: left;
          overflow: hidden;

          .mIcon {
            width: 20px;
            height: 20px;
            float: left;
            margin-top: 2px;
          }

          .scroller {
            animation: scroller 2s infinite linear;
          }

          .mIcon:nth-last-child(1) {
            margin-left: 5px;
          }

          .total {
            float: left;
            margin-left: 5px;
          }
        }

        .discount {
          float: right;
          min-width: 72px;
          text-align: center;
          border: 1px solid #fb0;
          border-radius: 4px;
          font: 12px/18px normal;
          overflow: hidden;

          view {
            line-height: 18px;
          }

          .distitle {
            background-color: #22211f;
            color: #ebcc45;
          }

          .dismoney {
            color: #22211f;
            background-color: #ebcc45;
          }
        }
      }

      // 未改版之前樣式
      // .conBtm {
      // 	display: flex;
      // 	justify-content: center;
      // 	align-items: center;
      // 	width: 100%;
      // 	height: 30px;
      // 	float: right;
      // 	color: #868686;
      // 	margin-top: 5px;

      // 	.rightLi {
      // 		width: 33.3%;
      // 		height: 30px;
      // 		text-align: center;
      // 		border-top: 1px solid #555;
      // 		border-right: 1px solid #555;
      // 		display: flex;
      // 		justify-content: center;
      // 		align-items: center;

      // 		.liIconBox {
      // 			width: 20px;
      // 			margin-top: 6px;
      // 			// margin: 0 auto;
      // 			// float: left;
      // 		}

      // 		.liName {
      // 			font-size: 14px;
      // 			// float: left;
      // 			width: 30px;
      // 		}
      // 	}

      // 	.rightLi:nth-last-child(1) {
      // 		border-right: 0 none;
      // 	}
      // }
    }
  }

  .p-bottom-40 {
    padding-bottom: 30upx !important;
  }

  // 游戏列表
  .gamelist {
    width: 100%;
    // height: 704upx;

    .nav {
      position: absolute;
      width: 21%;
      height: 784upx;
      z-index: 1;
      color: #9ea9b3;
      overflow-y: auto;
      background-color: #0f0f0f;

      .con {
        position: relative;
        // width: 60px;
        height: 115upx;
        line-height: 165upx;
        text-align: center;
        font-size: 12px;
        background-color: #2a2a2a;
        color: #e6d7b4;
        margin: 10px auto;
        box-sizing: border-box;

        border-radius: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .bgicon {
          position: absolute;
          left: 35%;
          top: 15upx;
          width: 50upx;
          height: 50upx;

          .img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .con:nth-child(1) {
        margin-top: 0;
      }

      // .con:nth-child(6) {
      // 	display: none;
      // }

      .con-active {
        background: url("../../static/image/indexImg/left-active-bg.png");
        background-repeat: no-repeat;
        background-size: cover;
        color: #5b2805;
      }
    }

    .secondList {
      position: relative;
      padding-left: 25%;
      height: 784upx;
      overflow-y: auto;

      // background-color: #fff;
      .game {
        float: left;
        width: 48%;
        margin-left: 2%;
        margin-bottom: 2%;
        // background: linear-gradient(#000, #ccc);
        border-radius: 25upx;

        // background-color: pink;
        .inner {
          position: relative;
          width: 100%;
          padding-top: 88%;

          .img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .title {
            position: absolute;
            top: 7px;
            left: 6px;
            color: #fff;
            font-size: 14px;
            font-weight: 700;
          }
        }
      }

      .game1 {
        float: left;
        width: 98%;
        margin-left: 2%;
        margin-bottom: 2%;

        // background-color: pink;
        .inner1 {
          width: 100%;
          padding-top: 44%;
        }
      }
    }
  }
}

.scroller {
  animation: scroller 0.5s infinite linear;
}

/* #ifdef  H5 */
.fixedShow {
  position: relative;
  margin-top: 80upx;
}

/* #endif */
/* #ifdef  H5 */
.fixedHide {
  position: relative;
  margin-top: 0px;
  transition: 0.3s;
}

/* #endif */
@keyframes scroller {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(240deg);
  }

  100% {
    transform: rotate(480deg);
  }
}
</style>
