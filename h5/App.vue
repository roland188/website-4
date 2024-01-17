<script>
import Vue from "vue";
import Cookie from "./utils/cookie.js";
import { setLang, setTabbarItem } from "@/i18n/index";
export default {
  data() {
    return {
      interval: 0,
      isMaintain: false,
      isAppInit: false,
      tabbar: [this.$t('首页'),this.$t('在线客服'),this.$t('优惠'),this.$t('VIP'),this.$t('会员中心')]
    };
  },
  onLaunch() {
    // #ifdef APP-PLUS
    plus.screen.lockOrientation("portrait-primary");
    // #endif
    this.getSystemInfo();
    this.inviteCodeDeal();
    // #ifdef APP-PLUS
    const serveLang = uni.getStorageSync("lang") || this.$config.locale || "vi";
    // #endif
    // #ifdef H5
    const serveLang = uni.getStorageSync("lang") || window.locale || "vi";
    setLang(serveLang);
	if(location.href.includes('platformMjb=ios')){
		window.isMaskApp = true
		this.$cache.set('platformMjb',1)
	}
	if (navigator.userAgent.endsWith('platform=ios') || this.$cache.get('platformMjb')) {
		window.isMaskApp = true
		window.oldOpen = window.open
		window.open = (url) => {
			if(url && !url.endsWith('wait/wait')) location.href = url
			else {
			const win = {
				close:() => win.location = {},
				location:window.location
			}
				return win
			}
		}
	}
    // #endif

    // #ifdef APP-PLUS
    plus.screen.lockOrientation("portrait-primary");
    // #endif
    // 获取服务配置
    setTimeout(() => {
      // 设置语言
      // setLang(serveLang);
      this.$store.commit("setState", { lang: serveLang });
      /* H5平台直接获取配置信息 */
      // #ifdef H5
      const list = [this.$server.getConfigHost()]; // h5不用遍历获取，只有一个host，从url.js里面来
      this.forDataJson(list);
      // #endif

      /* APP需要先从json中获取真实host */
      // #ifdef APP-PLUS
      if (!this.isMaintain) {
        if (this.$server.getConfigHost()) {
          this.isAppInit = true;
          this.appInit();
        }
        this.getJsonData();
      }
      // #endif
    }, 0);
  },
  onShow() {
    // #ifdef H5
    // 获取样式文件
    this.$config.theme = window.theme;
    console.log(this.$config.theme,"this.$config.theme============")
    require("@/common/theme/" + (this.$config.theme || "a001") + ".css");
    this.iosChrome();
    // #endif
    this.initConfig();

    // 维护检测
    let interval = 180000;
    // #ifdef  APP-PLUS
    interval = this.$config.interval || 180000;
    // #endif
    // #ifdef  H5
    interval = window.interval || 18000;
    // #endif
    this.getMaintain();
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.getMaintain();
    }, interval);
    setTabbarItem();
  },
  onHide() {},
  methods: {
    // 获取维护信息
    getMaintain() {
      let maintainUrl = this.$config.maintainUrl;
      let clientCode = this.$config.clientCode;
      let clientItem = this.$config.childCode;
      // #ifdef  H5
      maintainUrl = "/clientMaintain/getClientMaintain";
      clientCode = window.clientCode;
      clientItem = window.childCode;
      // #endif
      uni.request({
        // url: 'https://m.bets888806.com/clientMaintain/getClientMaintain',
        url: maintainUrl,
        method: "post",
        header: {
          clientCode: clientCode,
          clientItem: clientItem,
        },
        complete: (res) => {
          // 获取维护信息失败
          let selft = this;
          if (!(res && res.statusCode == 200 && res.data && res.data.data)) {
            this.isMaintain = false;
            return;
          }
          console.log("维护==================", res);
          // 维护中
          if (res.data.data.status === 1) {
            this.isMaintain = true;
            // #ifdef  H5
            let lang = "en";
            let theme = 1;
            let u = window.location.protocol + "//" + window.location.host;
            let o = res.data.data.maintainUrl;
            let str = `${o}?c=${clientCode}&i=${clientItem}&t=${theme}&l=${lang}&u=${u}`;
            window.location.href = str;
            // #endif

            // #ifdef  APP-PLUS
            if (!this.isMaintain) {
              uni.reLaunch({
                url: "/pages/maintain/maintain",
              });
            }
            this.isMaintain = true;
            // #endif
          } else {
            // #ifdef APP-PLUS
            if (this.isMaintain) {
              uni.reLaunch({
                url: "/pages/index/index",
              });
            }
            this.isMaintain = false;
            // #endif
          }
        },
      });
    },
    // 初始化配置
    initConfig() {
      // host
      const getConfigHost = this.$server.getConfigHost();
      if (getConfigHost) {
        this.$config.host = getConfigHost;
      }

      // codeUrl
      const codeUrl = this.$server.getCodeUrl();
      this.$config.codeUrl = codeUrl;

      // imgHost
      let imgHost = this.$server.getImgHost();
      // #ifdef APP-PLUS
      this.$config.imgHost = imgHost;
      // #endif

      // #ifdef  H5
      this.$config.imgHost = process.env.NODE_ENV === 'development' ? this.$server.getImgHost() : window.location.origin + "/file";
      this.$config.clientCode = window.clientCode;
      this.$config.childCode = window.childCode;
      this.$config.projectImgUrl = window.projectImgUrl
      this.$config.customerServiceStatus =  window.customerServiceStatus
      const theme = window.theme;
      if (theme) {
        this.$config.theme = theme;
      }
      if (window.projectName) this.$config.appName = window.projectName;
      const t = localStorage.getItem("domainName");
      if (t) {
        this.$config.domainName = t;
      }
      // #endif
    },
    // 获取并配置系统信息
    getSystemInfo() {
      uni.getSystemInfo({
        success: (e) => {
          // #ifdef H5
          this.$config.phoneModel = e.model;
          // #endif
          // #ifdef APP-PLUS
          this.$config.phoneModel = e.brand + "-" + e.model;
          // #endif

          // #ifndef MP
          Vue.prototype.StatusBar = e.statusBarHeight;
          if (e.platform == "android") {
            Vue.prototype.CustomBar = e.statusBarHeight + 50;
          } else {
            Vue.prototype.CustomBar = e.statusBarHeight + 45;
          }
          // #endif
          // #ifdef MP-WEIXIN
          Vue.prototype.StatusBar = e.statusBarHeight;
          const custom = wx.getMenuButtonBoundingClientRect();
          Vue.prototype.Custom = custom;
          Vue.prototype.CustomBar =
            custom.bottom + custom.top - e.statusBarHeight;
          // #endif
          // #ifdef MP-ALIPAY
          Vue.prototype.StatusBar = e.statusBarHeight;
          Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
          // #endif
        },
      });
    },
    // 处理邀请码
    inviteCodeDeal() {
      const inviteCode =
        this.$config.inviteCode || uni.getStorageSync("inviteCode");
      if (inviteCode) {
        uni.setStorageSync("inviteCode", inviteCode);
      } else {
        uni.getClipboardData({
          success: (res) => {
            uni.hideToast();
            const aa = res.data;
            if (aa != null && aa.length) {
              const arr = aa.split("");
              const aa1 = arr.shift().charCodeAt(0);
              const aa2 = arr.pop().charCodeAt(0);
              if (arr.length > 0 && aa1 == 8203 && aa2 == 8203) {
                const bb = arr.join("");
                console.log("你的邀请码是: " + bb);
                uni.setStorageSync("inviteCode", bb);
                uni.setClipboardData({
                  data: "",
                  success: function () {
                    uni.hideToast();
                  },
                });
              }
            }
          },
        });
      }
    },
    // ios下chrome浏览器 强制刷新
    iosChrome() {
      const ck = new Cookie("HasLoaded");
      if (ck.Read() == null) {
        // 未加载过，Cookie内容为空
        if (
          navigator.userAgent.toLowerCase().indexOf("iphone") > 0 &&
          navigator.userAgent.toLowerCase().indexOf('crios" || "chrome') > 0
        ) {
          // ios谷歌 强制刷新
          window.open(window.location.href);
        }
        ck.Write("true"); // 设置Cookie。只要IE不关闭，Cookie就一直存在
      }
    },
    // 获取配置信息
    // 通过传进来的host数组，来遍历获取配置，获取到了就停止
    async forDataJson(list) {
      let result;
      for (let i = 0; i < list.length; i++) {
        result = await this.forDataJsonReq(list[i]);
        if (result) {
          // 获取到了配置
          break;
        }
      }
      // 获取配置信息失败
      if (!result) {
        uni.showModal({
          title: this.$t('提示'),
          content: this.$t('服务器错误，请联系客服'),
          confirmText: this.$t('确定'),
          cancelText: this.$t('取消'),
          showCancel: false,
        });
        return;
      }
      // 获取配置成功，分发各项配置
      console.log("---成功", result);
      result.data.map((item) => {
        switch (
          item.type // 根据配置项的type来设置各个配置
        ) {
          case 1: // web
            this.$config.codeUrl = item.domain;
            this.$server.setCodeUrl(item.domain);

            break;
          case 2: // 图片
            // #ifdef H5
            this.$config.imgHost = process.env.NODE_ENV === 'development' ? item.domain :  window.location.origin + "/file";
            // #endif
            // #ifdef APP-PLUS
            this.$config.imgHost = item.domain;
            // #endif
			 this.$server.setImgHost(item.domain);
            break;
          case 3: // 上传下载
            this.$config.dowUrl = item.domain + "/";
            break;
          case 4: // 彩金
            this.$config.jackpotUrl = item.domain;
            break;
          case 5: // 客服
            uni.setStorageSync("customerServiceUrl", item.domain);
            this.$config.customerServiceUrl = item.domain;
            break;
          case 6: // 苹果下载
            this.$config.iosDownloadUrl = item.domain;
            this.$server.setIosDownloadUrl(item.domain);
            break;
          case 7: // 安卓下载
            this.$config.androidDownloadUrl = item.domain;
            this.$server.setAndroidDownloadUrl(item.domain);
            break;
          case 8: // pc
            this.$config.pcDownloadUrl = item.domain;
            this.$server.setPcDownloadUrl(item.domain);
            break;
          case 9: // 主域名
            this.$config.pcMainUrl = item.domain;
            uni.setStorageSync("pcMainUrl", item.domain);
            break;
          case 11: // H5易记域名
            this.$config.yiJiUrl = item.domain;
            break;
        }
      });
      // 可以进入app
      if (!this.isAppInit) {
        this.appInit();
      }
      this.clientCode();
    },
    // 获取配置信息请求
    forDataJsonReq(host) {
      return new Promise((resolve) => {
        let clientItem = "";
        let skinCode = "";

        // #ifdef H5
        clientItem = window.childCode;
        skinCode = window.theme;
        // #endif

        // #ifdef APP-PLUS
        clientItem = this.$config.childCode;
        skinCode = this.$config.theme;
        // #endif

        // 请求体
        const req = {
          url: host + "/longm/api/v1/domain/pageList",
          header: {
            clientCode: this.$config.clientCode,
            clientItem: clientItem,
            skinCode: skinCode,
          },
          success: (res) => {
            if (res.statusCode == 200 && res.data.code == 0) {
              // 处理一些配置
              this.$config.host = host;
              this.$server.setConfigHost(host);
              this.$server.setConfigUrl(res.data.data);
              resolve(res.data);
            } else if (res.data.code == 110009) {
              //黑名单
              uni.reLaunch({
                url:
                  "/pages/iplimit/iplimit?ip=" +
                  res.data.msg +
                  "&custommerUrl=" +
                  res.data.data.customer,
              });
            } else {
              resolve(false);
            }
          },
          fail: () => {
            resolve(false);
          },
        };

        // 平台参数

        // #ifdef H5
        req.header.h5 = 1;
        // #endif

        // #ifdef APP-PLUS
        try {
          const systemInfo = uni.getSystemInfoSync();
          if (systemInfo.platform === "android") {
            req.header.android = 1;
          } else if (systemInfo.platform === "ios") {
            req.header.ios = 1;
          }
        } catch (e) {
          let selft = this;
          uni.showToast({
            title: selft.$t('获取维护信息失败'),
            icon: "none",
          });
        }
        // #endif

        uni.request(req);
      });
    },
    // 进入app
    appInit() {
      // #ifdef APP-PLUS
      this.getGoIndex();
      // #endif
      // #ifdef H5
      const routes = getCurrentPages();
      const currPage = routes[routes.length - 1].route;
      if (currPage == "pages/Startup/Startup") {
        // 在启动页才执行跳转首页
        this.getGoIndex();
      }
      // #endif
    },
    getGoIndex() {
      uni.navigateTo({
        url: "/pages/index/index",
        success: () => {
          uni.$emit("update", {
            // 这个估计有的项目需要通过这个事件做页面处理，本项目没有
            msg: "页面更新",
          });
        },
      });
    },
    // 获取客服信息
    clientCode() {
      let selft = this;
      this.$api.clientCode(this.$config.clientCode, (err, res) => {
        if (err) {
          uni.showToast({
            icon: "none",
            title: selft.$t('获取维护信息失败'),
          });
          return;
        }
        const inviteCode =
        this.$config.inviteCode || uni.getStorageSync("inviteCode");
        if (inviteCode) {
          uni.setStorageSync("inviteCode", inviteCode);
        } else {
          // 邀请码
          uni.setStorageSync("inviteCode", res.remark);
        }
        this.$server.setClientCodeRes(res);
        this.$server.setCustomerService(res.customerUrl);
      });
    },
    // 获取服务信息
    async getJsonData() {
      const list = this.$config.appUrlJson;
      // 循环解析json文件，直到获取到了包含host的数组
      let result;
      for (let i = 0; i < list.length; i++) {
        result = await this.getJsonDataSync(list[i]);
        if (result) {
          break;
        }
      }

      // 没有获取到服务信息
      if (!result) {
        setTimeout(() => {
          this.getJsonData();
        }, 1000);
        return;
      }
      // 获取到了hos的数组，去获取服务器配置
      this.forDataJson(result);
    },
    // 获取服务器请求
    getJsonDataSync(url) {
      return new Promise((resolve) => {
        uni.request({
          url: url,
          header: {
            "Cache-Control": "no-cache",
          },
          complete: (res) => {
            if (res && res.statusCode == 200) {
              // 获取到了
              resolve(res.data);
            } else {
              resolve(false);
            }
          },
        });
      });
    },
  },
};
</script>

<style>
/*每个页面公共css */
/*  #ifdef  APP-PLUS  */
@import url("./common/theme/a053.css");
/*  #endif  */
@import "./common/commonqq.css";
/*  #ifndef  APP-PLUS-NVUE  */
/*每个页面公共css */
@import "colorui/main.css";
@import "colorui/icon.css";
/* 引入官方css库    uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import "./common/uni.css";
/* 引入自定义图标库*/
@import "./common/icon.css";
/* 引入自己的css */
/*  #endif  */



page {
  height: 100%;
  background: #fafafa;
}

.uni-swiper-dot-active {
  background-color: #b9006d !important;
}

.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  /* background: var(--statusBg); */
}

::-webkit-scrollbar {
  display: none;
}

uni-page-head .uni-page-head{
  background: var(--themeActTitleBg);
}
</style>
