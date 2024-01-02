<script>
import Vue from "vue";
import Cookie from "./utils/cookie.js";
export default {
  onLaunch: function () {
    uni.getSystemInfo({
      success: function (e) {
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
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif
      },
    });

    // #ifdef H5
    window.routes = {};
    if (__uniRoutes && __uniRoutes.length) {
      for (var i = 0; i < __uniRoutes.length; i++) {
        var route = __uniRoutes[i];
        window.routes[route.path] = true;
      }
    }
    // #endif
    // #ifdef APP-PLUS
    // 锁定屏幕方向
    plus.screen.lockOrientation("portrait-primary");

    let inviteCode = uni.getStorageSync('inviteCode') || this.$config.inviteCode;
			if(!inviteCode){
				var dbModule = uni.requireNativePlugin("DB-DBModule")
				if(dbModule){
								inviteCode = dbModule.getInviteCode()
								console.log('onLaunch:getInviteCode:', inviteCode)
								if(inviteCode){
									uni.setStorageSync('inviteCode', inviteCode);
								}
				}
			}
			if (!inviteCode) {
      uni.getClipboardData({
        success: function (res) {
          uni.hideToast();
          var aa = res.data;
          if (aa != null && aa.length) {
            var arr = aa.split("");
            var aa1 = arr.shift().charCodeAt(0);
            var aa2 = arr.pop().charCodeAt(0);
            if (arr.length > 0 && aa1 == 8203 && aa2 == 8203) {
              var bb = arr.join("");

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
    // #endif
  },
  onShow: function () {
    let login = this.$api.isLogin();
    if (login) {
      setTimeout(() => {
        //  this.getAutoJoinAct()
      }, 1000);
    }
    // #ifdef H5
    if (this.$config.theme) {
      this.$config.theme = "a001";
      require("@/common/theme/" + this.$config.theme + ".css");
    } else {
      require("@/common/theme/a001.css");
    }

    var ck = new Cookie("HasLoaded");
    if (ck.Read() == null) {
      //未加载过，Cookie内容为空
      if (navigator.userAgent.toLowerCase().indexOf("iphone") > 0 && navigator.userAgent.toLowerCase().indexOf("crios" || "chrome") > 0) {
        //ios谷歌 强制刷新
        window.open(window.location.href);
      }
      ck.Write("true"); //设置Cookie。只要IE不关闭，Cookie就一直存在
    }
    let getConfigHost = this.$server.getConfigHost();
    if (getConfigHost) {
      this.$config.host = getConfigHost;
    }
    let codeUrl = this.$server.getCodeUrl();
    this.$config.codeUrl = codeUrl;
    let imgHost = this.$server.getImgHost();
    this.$config.imgHost = imgHost;
    // 913调整
    this.$config.clientCode = window.clientCode;
    let theme = window.theme;
    if (theme) {
      this.$config.theme = theme;
    }
    if (window.projectName) this.$config.appName = window.projectName;
    let t = localStorage.getItem("domainName");
    if (t) {
      this.$config.domainName = t;
    }
    let self = this;
    let host = this.$server.getConfigHost();
    let newHost = [host];

    let clientItem = "";
    let skinCode = "";
    // #ifdef  H5
    clientItem = window.childCode; //子平台id字段
    skinCode = window.theme;
    // #endif
    // #ifdef  APP-PLUS
    clientItem = self.$config.childCode; //客户端id字段
    skinCode = self.$config.theme;
    // #endif
    var req = {
      url: host + "/longm/api/v1/domain/pageList",
      header: {
        clientCode: self.$config.clientCode,
        // #ifdef  H5
        h5: 1,
        // #endif
        clientItem: clientItem,
        skinCode: skinCode,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            self.$config.host = host;
            self.$server.setConfigHost(host);
            let dataUrl = res.data.data;
            self.$server.setConfigUrl(dataUrl);
            dataUrl.map((item) => {
              if (item.type == 1) {
                //web
                self.$config.codeUrl = item.domain;
                self.$server.setCodeUrl(item.domain);
              } else if (item.type == 2) {
                //图片
                self.$config.imgHost = item.domain;
                self.$server.setImgHost(item.domain);
              } else if (item.type == 3) {
                //图片
                self.$config.dowUrl = item.domain + "/";
              } else if (item.type == 4) {
                //彩金
                self.$config.jackpotUrl = item.domain;
              } else if (item.type == 5) {
                //客服
                uni.setStorageSync("customerServiceUrl", item.domain);
                self.$config.customerServiceUrl = item.domain;
              } else if (item.type == 6) {
                // ios下载地址
                self.$config.iosDownloadUrl = item.domain;
                self.$server.setIosDownloadUrl(item.domain);
              } else if (item.type == 7) {
                // 安卓下载地址
                self.$config.androidDownloadUrl = item.domain;
                self.$server.setAndroidDownloadUrl(item.domain);
              } else if (item.type == 8) {
                // pc下载地址
                self.$config.pcDownloadUrl = item.domain;
                self.$server.setPcDownloadUrl(item.domain);
              } else if (item.type == 9) {
                // pc主站域名
                self.$config.pcMainUrl = item.domain;
              }
            });
            return;
          } else if (res.data.code == 110009) {
						//黑名单
						uni.reLaunch({
							url:'/pages/iplimit/iplimit?ip='+ res.data.msg + '&custommerUrl=' + res.data.data.customer
						})
					} else if (res.data.code == 130010) {
            // uni.navigateTo({
            // 	url:'/pages/maintain/maintain'
            // })
          } else {
            uni.showToast({
              title: res.data.msg,
              icon: "none",
            });
          }
        } else if (res.statusCode == 500 || res.statusCode == 503) {
          uni.showToast({
            title: "系统错误请稍后...",
            icon: "none",
          });
        } else {
          // self.getJsonData();
        }
      },
      fail: function (res) {
        // self.getJsonData();
      },
    };
    uni.request(req);
    //#endif
    // // #ifdef APP-PLUS
    // let self = this;
    // let maintainUrl = self.$config.maintainUrl;
    // let maintian = uni.getStorageSync("maintian");
    // uni.request({
    //   url: maintainUrl,
    //   header: {
    //     "Cache-Control": "no-cache",
    //   },
    //   complete: (res) => {
    //     if (res.statusCode == 200) {
    //       self.$config.maintianTime = res.data.time;
    //       // debugger
    //       if (res.data.status === "1") {
    //         uni.setStorageSync("maintian", true);
    //         uni.reLaunch({
    //           url: "../maintain/maintain",
    //         });
    //       } else {
    //         if (maintian) {
    //           uni.setStorageSync("maintian", false);
    //           self.$server.clearToken();
    //           uni.navigateTo({
    //             url: "/pages/index/index",
    //             success: function () {
    //               uni.$emit("update", {
    //                 msg: "页面更新",
    //               });
    //             },
    //           });
    //         }
    //       }
    //     } else {
    //     }
    //   },
    // });
    // //#endif
    this.maintian = false;
    this.getCustomer();
    //  间隔维护
    let interval = 180000;
    // #ifdef  APP-PLUS
    interval = this.$config.interval || 180000;
    // #endif
    // #ifdef  H5
    interval = window.interval || 180000;
    // #endif
    setInterval(() => {
      this.getCustomer();
    }, interval);
  },
  onHide: function () {},
  methods: {
    getAutoJoinAct() {
      const userinfo = this.$cache.get("set_user");
      const req = [userinfo.user_id];
      this.$api.getAutoJoinAct(...req, (err, res) => {
        console.log("APP", res);
      });
    },
    getCustomer() {
      let self = this;
      let mainCustomer = self.$config.maintainUrl;
      let clientCode = "";
      let clientItem = "";
      let theme = 1;
      let lang = "en";
      // #ifdef  APP-PLUS
      clientCode = self.$config.clientCode;
      clientItem = self.$config.childCode;
      mainCustomer = self.$config.maintainUrl;
      // #endif
      // #ifdef  H5
      clientCode = window.clientCode;
      clientItem = window.childCode;
      mainCustomer = '/clientMaintain/getClientMaintain'
      // #endif
      uni.request({
        url: mainCustomer,
        method: "POST",
        header: {
          clientCode: clientCode,
          clientItem: clientItem,
        },
        complete: (res) => {
          //
          let statusCode = res.statusCode;
          if (statusCode * 1 === 200) {
            if (res.data.data.status === 1) {
              if (self.maintian) {
                return;
              }
              self.maintian = true;

              //1维护  0不维护
              // #ifdef  H5
              let u = window.location.protocol + "//" + window.location.host;
              let o = res.data.data.maintainUrl;
              let str = `${o}?c=${clientCode}&i=${clientItem}&t=${theme}&l=${lang}&u=${u}`;
              window.location.href = str;
              // #endif
              // #ifdef  APP-PLUS
              uni.reLaunch({
                url: "/pages/maintain/maintain",
              });
              // #endif
            }
          } else {
            if (!self.maintian) {
              return;
            }
            self.maintian = false;
            uni.reLaunch({
              url: "/pages/index/index",
            });
          }
        },
      });
    },
  },
};
</script>

<style>
/*每个页面公共css */
/*  #ifdef  APP-PLUS  */
@import url("./common/theme/a001.css");
/*  #endif  */
@import "./common/commonqq.css";
/*每个页面公共css */
@import "colorui/main.css";
@import "colorui/icon.css";
/* 引入官方css库    uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import "./common/uni.css";
/* 引入自定义图标库*/
@import "./common/icon.css";
/* 引入自己的css */
@import "./common/commonqq.css";

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
</style>
