<!-- 客服页面  by 琦琦-->
<template>
  <view class="customerService">
    <!-- 老客服才显示头部导航 -->
    <uni-nav-bar
      v-if="ServiceStatus !== 1"
      fixed
      :title="$t('在线客服')"
      :border="false"
      :statusBar="true"
      color="#fff"
      background-color="#0f0f0f"
    ></uni-nav-bar>
    <!-- #ifdef APP-PLUS -->
    <!-- 新客服 -->
    <web-view
      v-if="ServiceStatus == 1"
      :webview-styles="webviewStyles"
      :src="customerServiceUrl"
      @message="getH5Message"
    ></web-view>
    <!-- 老客服 -->
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <!-- 新客服 -->
    <!-- <web-view v-if="ServiceStatus == 1" :webview-styles="webviewStyles" :src="customerServiceUrl"></web-view> -->
    <!-- 老客服 -->
    <web-view
      style="margin-top: 88rpx"
      v-if="ServiceStatus === 1"
      :webview-styles="webviewStyles"
      :src="customerServiceUrl"
    ></web-view>
    <!-- #endif -->
    <view class="customerUl" v-if="ServiceStatus !== 1">
      <view v-if="appMerge" class="customeList">
        <view class="customeLeft">
          <image
            class="customeImg"
            :src="'../../static/image/imgUrl1.png'"
            mode="widthFix"
          ></image>
          <view class="customeCon">
            <view class="customName"> {{ $t('在线客服') }} </view>
            <view class="customeNumber"> </view>
          </view>
        </view>
        <view class="customeRight">
          <view @click="goCustomer(appMergeUrl)" class="customeBtn">
            {{ $t('联系客服') }}
          </view>
        </view>
      </view>
      <view
        class="customeList"
        v-for="(item, index) in customerData"
        :key="index"
      >
        <view class="customeLeft">
          <image
            class="customeImg"
            :src="'../../static/image/imgUrl' + item.typeId + '.png'"
            mode="widthFix"
          ></image>
          <view class="customeCon">
            <view class="customName">
              {{ item.name }}
            </view>
            <view class="customeNumber">
              {{ item.number }}
            </view>
          </view>
        </view>
        <view class="customeRight">
          <view
            @click="goCustomer(item.url, item.name)"
            v-if="item.url"
            class="customeBtn"
          >
            {{ $t('在线客服') }}
          </view>
          <view v-else class="customeBtn" @click="copy(item.number)">
            {{ $t('复制账号') }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: "#D6AE66",
        },
      },
      customerServiceUrl: "",
      customerData: [],
      appMerge: false,
      appMergeUrl: "",
      ServiceStatus: 0,
    };
  },
  created() {
    // #ifdef APP-PLUS
    if (this.$config.customerServiceStatus == 1) {
      var currentWebview = this.$mp.page.$getAppWebview(); //获取当前web-view
      var height = 0;
      uni.getSystemInfo({
        //成功获取的回调函数，返回值为系统信息
        success: (res) => {
          height = res.windowHeight - res.statusBarHeight; //自行修改，自己需要的高度
        },
        complete: () => {},
      });
      //遮挡状态栏 :top
      //tabbar遮住web-view的问题：height
      setTimeout(function () {
        var wv = currentWebview.children()[0];
        wv.setStyle({
          //设置web-view距离顶部的距离以及自己的高度，单位为px
          top: uni.getSystemInfoSync().statusBarHeight,
          height: height,
        });
      }, 1000);
    }
    // #endif
  },
  onShow() {
    //#ifdef H5
    var _this = this;
    this.ServiceStatus = window.customerServiceStatus;
    if (window.customerServiceStatus == 1) {
      //新客服
      let obj = {};
      obj.host = _this.$config.host;
      obj.clientCode = _this.$config.clientCode;
      obj.language = uni.getStorageSync("lang")
        ? uni.getStorageSync("lang")
        : "zh_CN"; //语言包
      obj.type = 1;
      obj.username =
        _this.$server.getUser() && _this.$server.getUser().username;
      obj.clientItem = window.childCode;
      obj.theme = window.theme || "a030";
      obj.projectImgUrl = window.projectImgUrl;
      window.addEventListener("message", this.getH5Message);
      // var str = JSON.stringify(obj);
      // str = window.btoa(str);
      // let url = this.$config.customerServiceUrl + "/customerService/h5?s=" + str;
      // this.customerServiceUrl = url;
      uni.navigateTo({
        url:
          "/pages/subCustomerService/subCustomerService?data=" +
          JSON.stringify(obj),
      });
    } else {
      //旧客服
      // let obj = {};
      // obj.type = "h5";
      // obj.col = sessionStorage.getItem("theme");
      // obj.host = this.$server.getConfigHost();
      // obj.clientCode = this.$config.clientCode;
      // obj.cid = window.mergeCustomerService;
      // obj.childCode = window.childCode;
      // obj.theme = window.theme;
      // obj.language = uni.getStorageSync("lang")
      //   ? uni.getStorageSync("lang")
      //   : "zh_CN"; //语言包
      //  obj.language = 'zh_CN';
      // var str = JSON.stringify(obj);
      // str = window.btoa(str);
      // var url = this.$config.codeUrl + "/page/customer.html?s=" + str;
      // var url = window.location.origin + "/func/page/customer.html?s=" + str;
      // this.customerServiceUrl = url;
      this.customerGetList();
    }
    // #endif
    // #ifdef APP-PLUS
    this.ServiceStatus = this.$config.customerServiceStatus;
    if (this.$config.customerServiceStatus == 1) {
      //新客服
      var _this = this;
      var obj = {};
      obj.host = _this.$config.host;
      obj.clientCode = _this.$config.clientCode;
      obj.language = uni.getStorageSync("lang")
        ? uni.getStorageSync("lang")
        : "zh_CN"; //语言包
      obj.username =
        _this.$server.getUser() && _this.$server.getUser().username;
      obj.clientItem = _this.$config.childCode;
      obj.theme = _this.$config.theme || "a030";
      obj.type = 2;
      obj.projectImgUrl = _this.$config.projectImgUrl;
      // var str = JSON.stringify(obj);
      // str = new Buffer(str).toString("base64");
      // let url = this.$config.customerServiceUrl + "/customerService/h5?s=" + str;
      // this.customerServiceUrl = url;
      uni.navigateTo({
        url:
          "/pages/subCustomerService/subCustomerService?data=" +
          JSON.stringify(obj),
      });
    } else {
      //旧客服
      this.customerGetList();
    }
    //	#endif
  },
  onReady() {
    // var iframe = document.getElementsByTagName('iframe')[0];
    // iframe.style.borderBottom = '1px solid #000';
    // iframe.id = 'iframeId';
    // iframe.onload = function() {
    //不能跨域修改iframe下的dom样式
    // console.log(document.getElementById('iframeId').contentWindow.document.getElementsByClassName('chat-header'))
    // }
  },
  onNavigationBarButtonTap() {
    //自定义返回按钮,返回首页
    // uni.navigateTo({
    // 	url: '../index/index'
    // })
    uni.navigateBacks();
  },
  methods: {
    getH5Message(e) {
      uni.navigateTo({
        url: "../preferential/preferential",
        success: () => {
          //避免重复注册
          // #ifdef H5
          window.removeEventListener("message", this.getH5Message);
          // #endif
        },
      });
    },
    customerGetList() {
      let self = this;
      self.$api.customerGetList(function (err, res) {
        if (err) {
          console.log("%c" + "customerGetList", "color:#a70a0a;", err);
        } else {
          if (self.$config.childCode === "jsht") {
            self.appMerge = true;
            self.appMergeUrl = res[0].url.replace("200001", "200000");
          }
          self.customerData = res;
        }
      }, false);
    },
    goCustomer(url, title) {
      // #ifdef H5
      window.open(url,'_blank');
      // #endif
      // #ifdef APP-PLUS
      plus.runtime.openURL(url, function (res) {});
      // #endif
    },
    copy(num) {
      console.log(num);
      uni.setClipboardData({
        data: num,
        success: function () {
          uni.showToast({
            title: "复制成功",
          });
        },
      });
    },
  },
  // onNavigationBarButtonTap(options) {
  // 	//从登录来，回登录。从其他页面来，回首页
  // 	var token = this.$store.state.token;
  // 	console.log(token);
  // 	if (!token) {
  // 		uni.navigateTo({
  // 			url: "../login/login"
  // 		})
  // 	} else {
  // 		uni.navigateTo({
  // 			url: '../index/index'
  // 		})
  // 	}
  // }
};
</script>

<style scoped>
@import url("./index.css");
</style>
