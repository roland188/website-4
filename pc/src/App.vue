<!--
 * @Description: 项目模块
 * @Version: 1.0
 * @Autor: steFan
 * @Date: 2020-03-10 09:15:03
 * @LastEditors: steFan
 * @LastEditTime: 2020-04-01 14:44:25
 :style="{backgroundImage:`url(${require(''+a)})`}"
 -->
<template>
  <div id="app" :class="['lang-' + locale, 'skin-' + projectImgUrl]">
    <div class="loadingBgc" v-show="splash">
      <transition name="slide-fade" mode="out-in">
        <Splash ref="splash"></Splash>
      </transition>
    </div>
    <transition name="slide-fade" mode="out-in">
      <router-view class></router-view>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import Splash from "./components/splash/splash";
import { _getDeviceInfo } from "./utils/finger.js";
export default {
  name: "App",
  components: { Splash },
  data() {
    return {
      splash: true,
      splashId: "",
      isShow: false,
      locale: window.locale,
      projectImgUrl: window.projectImgUrl,
    };
  },
  created() {
    if (!sessionStorage.getItem("splash")) {
      sessionStorage.setItem("splash", true);
      this.splash = true;
      this.splashId = 1;
    } else {
      this.splashId = 2;
      this.splash = false;
    }
    if (this.$common.isLogin()) {
      this.$store.commit("setToken", this.$common.getToken());
      this.$nkhttp.getUserInfo();
    }
    let host = this.$common.getHost();
    let imgUrl = this.$common.getImgUrlImg();
    if (imgUrl) {
      imgUrl =
        process.env.NODE_ENV !== "production"
          ? imgUrl
          : window.location.origin + "/file";
      this.$config.imgHost = imgUrl;
    }
    this.forDataJson(host);
    this.maintainUrl();
    if (this.$config.themeIndex) {
      let a = this.$config.themeIndex;
      if (a * 1 === 17) a = 16;
      // import("./assets/css/theme" + a + ".css");
    } else {
      import("./assets/css/base.css");
    }
    //  间隔维护
    let interval = window.interval || 180000;
    setInterval(() => {
      this.maintainUrl();
    }, interval);
  },
  mounted() {
    this.loading();
    _getDeviceInfo().then((res) => {
      this.$config.phoneModel = res.browserType;
      this.$ImgStorage.setVersion(this.$config);
    });
    this.getLogin();
  },
  beforeCreate() {},
  methods: {
    getLogin() {
      let href = window.location.href;
      // 判断如果带有token，并且没有空的情况下
      if (href.includes("access_token=")) {
        let res = this.getQuery();
        if (res && res.token_type && res.access_token) {
          this.$common.setToken(res);
          this.$common.setUser(res);
          //登录成功提示
          this.$message({
            message: this.$t("恭喜您，登录成功"),
            type: "success",
          });
        }
      }
    },
    getQuery() {
      let obj = {};
      let str = window.location.search.substr(1);
      let arr = str.split("&");
      arr.forEach((item) => {
        let [k, v] = item.split("=");
        obj[k] = v;
      });
      return obj;
    },
    loading() {
      if (this.splashId != 1) return; //判断是否第一次进入加载
      let that = this;
      let i = 0;
      let step = 3; //执行次数
      let timer = 3; //间隔时间
      let Interval = setInterval(() => {
        i++;
        chek();
        if (i > step * timer) {
          clearInterval(Interval);
          // 提示用户超时
          this.$message.error(this.$t("网络超时，请稍后刷新页面重试"));
        }
      }, 1000);
      function chek() {
        //判断isShow 是否为true, true时结束动画， false 继续获取配置数据
        if (that.isShow) return over();
        //
        if (i % step == 0) that.forDataJson(that.$common.getHost());
      }
      //结束动画
      function over() {
        sessionStorage.setItem("splash", true);
        clearInterval(Interval);
        that.$refs.splash.over();
        setTimeout(() => {
          // 500ms的结束动画
          that.splash = false;
        }, 500);
      }
    },
    maintainUrl() {
      let that = this;
      let clientCode = window.clientCode;
      let clientItem = window.childCode;
      let theme = 1;
      let lang = "zh_EN";
      // let mainUrl = window.maintainUrl;
      let mainUrl = "/clientMaintain/getClientMaintain";
      that.$http.mainPost(mainUrl, false).then((res) => {
        if (res.code == 0) {
          if (res.data.status === 1) {
            //维护
            let u = window.location.protocol + "//" + window.location.host;
            let o = res.data.maintainUrl;
            let str = `${o}?c=${clientCode}&i=${clientItem}&t=${theme}&l=${lang}&u=${u}`;
            window.location.href = str;
          }
        } else {
          // 正常能访问
        }
      });
    },
    // 跳转
    routerActive(item, index) {
      this.routerIndex = index;
    },
    // 获取
    forDataJson(list) {
      let self = this;
      if (list && list.length) {
        let host = "";
        if (self.$config.host == "http://192.168.1.241:9999") {
          host = self.$config.host;
        } else {
          host = list;
        }
        let configs = { isLoading: false };
        axios
          .get(host + "/longm/api/v1/domain/pageList", { configs: configs })
          .then(function (res) {
            self.isShow = true;
            if (res.status == 200) {
              if (res.data.code == 0) {
                self.$config.baseUrl = host;
                self.$common.setConfigHost(host);
                let dataUrl = res.data.data;
                self.$common.setConfigUrl(dataUrl);
                self.clientCode();
                dataUrl.map((item) => {
                  if (item.type == 1) {
                    //web
                    self.$config.codeUrl = item.domain;
                  } else if (item.type == 2) {
                    //图片
                    let imgHost =
                      process.env.NODE_ENV !== "production"
                        ? item.domain
                        : window.location.origin + "/file";
                    self.$config.imgHost = imgHost;
                    self.$common.setImgUrlImg(item.domain);
                  } else if (item.type == 3) {
                    //下载
                    self.$config.dowUrl = item.domain + "/";
                    self.$common.setDowUrl(item.domain + "/");
                  } else if (item.type == 4) {
                    ///彩金
                    self.$config.jackpotUrl = item.domain;
                    self.$common.setJackpotUrl(item.domain);
                  } else if (item.type == 5) {
                    //客服
                    self.$config.customerServiceUrl = item.domain;
                    self.$common.setCustomerServiceUrl(item.domain);
                  } else if (item.type == 6) {
                    //ios下载地址
                    self.$config.iosDownloadUrl = item.domain;
                  } else if (item.type == 7) {
                    //android下载地址
                    self.$config.androidDownloadUrl = item.domain;
                  } else if (item.type == 8) {
                    //pc下载地址
                    self.$config.pcDownloadUrl = item.domain;
                  } else if (item.type == 9) {
                    //pc主站域名
                    self.$config.pcMainUrl = item.domain;
                  } else if (item.type == 10) {
                    // pc 易记域名
                    self.$config.pcDomainImgUrl = item.domain;
                  } else if (item.type == 13) {
                    // pc端logo
                    self.$config.pcLogo = item.domain;
                  }
                });
                sessionStorage.setItem("restraint", false);
                return;
              } else if (res.data.code == 110009) {
                sessionStorage.setItem("restraint", true);
                this.$router.replace({
                  path: "/iplimit",
                  query: {
                    ip: response.data.msg,
                    customer: response.data.data.customer,
                  },
                });
              } else {
                self.$message.error(res.data.msg);
              }
            } else if (res.status == 500 || res.status == 503) {
              self.$message.error(self.$t("服务器维护中,请稍后再试"));
            } else if (res.status == 401) {
              let isToken = self.$common.getToken();
              if (isToken) {
                self.$message.error(
                  self.$t("您的登录账户已经过期，请您重新登录")
                );
              }
              self.$common.clearToken();
            } else {
              // else if (res.status !== 500 || res.status !== 503 || res.status !== 401){
              //  self.forDataJson(list);
              return;
            }
          })
          .catch(function (error) {});
      } else {
      }
    },
    // get clientCode
    clientCode: async function () {
      let self = this;
      let params = "/" + window.clientCode;
      const res = await self.$http.get(self.$api.clientCode, params, false);
      if (res.code == 0) {
        self.$common.setCustomerService(res.data.customerUrl);
        self.$common.setClientCodeRes(res.data);
      } else {
        this.$message.error(res.msg + "");
      }
    },
  },
};
</script>

<style lang="scss">
@import "./assets/css/base.css";
@import "./assets/css/main.css";
@import "./assets/css/commonqq.css";
</style>
