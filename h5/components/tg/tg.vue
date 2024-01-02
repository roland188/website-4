<template>
  <view class="content">
    <view v-if="gtShow" class="button_attr">
      <button type="primary" class="btn" @tap="startgt">
        {{ text }}
      </button>
    </view>
  </view>
</template>

<script>
var gtSDKModule = uni.requireNativePlugin("Geetest-GT3CaptchaModule");
export default {
  data() {
    return {
      result: null,
    };
  },
  props: {
    gtShow: false,
    type: null,
    text: "",
  },
  onLoad() {},
  mounted() {
    Vue.prototype.$customAPI1Response = this.customAPI1Response;
    Vue.prototype.$startRegisterTask = this.startRegisterTask;
    Vue.prototype.$startValidateTask = this.startValidateTask;
    Vue.prototype.$showAsyncTaskValidateResult =
      this.showAsyncTaskValidateResult;
    let platform = uni.getSystemInfoSync().platform;
    if (platform == "android") {
      this.initAsyncTaskGT3Captcha();
    } else if (platform == "ios") {
      this.initGT3Captcha();
    }
  },
  methods: {
    startgt() {
      let platform = uni.getSystemInfoSync().platform;
      if (platform == "android") {
        this.startAsyncTaskCaptcha();
      } else if (platform == "ios") {
        this.startCaptcha();
      }
    },
    /** ios */
    initGT3Captcha() {
      if (gtSDKModule == undefined) {
        console.log("gt3:load plugin failed ");
        return;
      }

      let sdkVersion = gtSDKModule.sdkVersion();
      console.log("gt3: sdkVersion:  " + sdkVersion);

      // 打开日志开关，方便调试
      gtSDKModule.setLogEnabled(true);
      console.log("gt3: set log enabled ");

      // 传入 api1、api2, timeout
      let api1 =
        this.$config.host +
        "/member/api/v1/geeTest/firstRegister?t=" +
        this.$config.childCode;
      let api2 = "http://www.geetest.com/demo/gt/validate-slide"; // no
      gtSDKModule.initWithAPI1(api1, api2, 5.0);
      // gtSDKModule.initWithAPI1('https://second.bets8888.in/member/api/v1/geeTest/firstRegister?t=tbyl',
      // 	'http://www.geetest.com/demo/gt/validate-slide', 5.0);
      // gtSDKModule.initWithAPI1('https://first.bets888801.com/member/api/v1/geeTest/firstRegister?t=aygj', 'http://www.geetest.com/demo/gt/validate-slide', 5.0);
      console.log("gt3: api1 =" + api1);

      gtSDKModule.useLanguage(0);
      console.log("gt3: use language:0 zh,5 en ");

      // 设置服务器节点
      /**
       * 0 - 中国服务集群
       * 1 - 北美服务集群
       */
      gtSDKModule.useServiceNode(0);
      console.log("gt3: use chinese service node  ");

      // 设置验证弹窗圆角
      gtSDKModule.useGTViewWithCornerRadius(5.0);
      console.log("gt3: corner radius is 5.0  ");

      // 设置是否禁用弹窗蒙板交互，为 false 时，点击弹窗蒙板可关闭弹窗，为 true 时，点击弹窗蒙板不能关闭弹窗
      gtSDKModule.disableBackgroundUserInteraction(true);
      console.log("gt3: disable background user interaction ");

      /** 若要修改 api1 的请求或者响应，需要在 registerCaptchaWithCallback 方法前调用 */
      // 修改 api1 的请求
      gtSDKModule.setModifyAPI1Request(true);
      gtSDKModule.customAPI1Request({
        url: "",
        cachePolicy: 4,
        timeInterval: 5.0,
        HTTPMethod: "GET",
        HTTPHeaderFields: {
          clientCode: this.$config.clientCode,
          // clientCode:'ffbc'
        },
        HTTPBody: {},
      });

      // 修改 api1 的响应，配合 customAPI1Response 方法完成修改 api1 响应的功能
      gtSDKModule.setModifyAPI1Response(false);

      // 注册
      gtSDKModule.registerCaptchaWithCallback((result) => {
        console.log("gt3: register captcha =========== ");
      });
    },
    startCaptcha() {
      const self = this
      if (gtSDKModule == undefined) {
        console.log("gt3: load plugin failed  ");
        return;
      }

      console.log("gt3: did touch start  ");
      // 是否使用默认的 api2 请求
      gtSDKModule.setShouldUseDefaultSecondaryValidate(false); // true

      // 处理验证弹窗关闭情况
      gtSDKModule.handleGTViewClose((result) => {
        console.log("gt3: gt view is closed ");
      });

      // 开启验证
      gtSDKModule.startGTCaptchaWithAnimated(
        true,
        (result) => {
          let strRes = JSON.stringify(result);
          console.log("gt3: captcha result= " + strRes);
          let status = result.status;
          let info = result.info;
          // 判断是否验证成功
          if (status == "success") {
            uni.showToast({
              icon: "none",
              title: self.$t('验证成功'),
              duration: 2000,
            });
          } else {
            // uni.showModal({
            // 	title: 'tip',
            // 	content: '验证失败:' + strRes,
            // });
            uni.showToast({
              icon: "none",
              title: self.$t('验证失败') + ":" + info,
              duration: 2000,
            });
          }
        },
        (jsResult) => {
          console.log("gt3: captcha js result= ", jsResult);
          // let code = jsResult.code;
          // let result = jsResult.result;
          // if (result == null)
          // 	return
          // let geetest_challenge = result.geetest_challenge;
          // let geetest_seccode = result.geetest_seccode;
          // let geetest_validate = result.geetest_validate;
          // console.log("gt3: code: " + code + ", geetest_challenge: " + geetest_challenge +
          // 	", geetest_seccode: " + geetest_seccode + ", geetest_validate: " + geetest_validate);

          if (jsResult.code == 1) {
            this.text = self.$t('验证成功');
            uni.$emit("fromChild" + this.type, {
              postData: jsResult,
            });
          } else {
            this.text = self.$t('验证失败');
          }

          // if ("1" == code) {
          //   console.log("gt3: custom api2 request");
          //   var postData = "code=" + code + "&";
          //   for (var key in result) {
          //     postData += (key + "=" + result[key] + "&");
          //   }
          //   if (postData.length > 1) {
          //     postData = postData.substring(0, postData.length - 1);
          //   }
          //   console.log("gt3: postData: " + postData);

          // 修改 api2 的请求
          // gtSDKModule.setModifyAPI2Request(true);
          // gtSDKModule.customAPI2Request({
          //   "url": "",
          //   "cachePolicy": 4,
          //   "timeInterval": 5.0,
          //   "HTTPMethod": "POST",
          //   "HTTPHeaderFields": {
          //     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
          //   },
          //   "HTTPBody": postData
          // });
          // }
        }
      );
    },
    // async
    initAsyncTaskGT3Captcha() {
      if (gtSDKModule == undefined) {
        console.log("=========== load plugin failed =========== ");
        return;
      }
      console.log("=========== load plugin success ======= ");

      // 异步集成 api1、2 地址可不传，但此方法请务必调用
      gtSDKModule.initWithAPI1();

      // 获取极验 SDK 当前版本号
      let sdkVersion = gtSDKModule.sdkVersion();
      console.log("=========== sdkVersion: =========== " + sdkVersion);
      // gtSDKModule.setLang("en");
      console.log("=========== setLang: =========== ");

      // 设置点击灰色区域是否消失，默认不消失
      gtSDKModule.setCanceledOnTouchOutside(false);
      console.log("=========== setCanceledOnTouchOutside: =========== ");

      // 设置服务集群节点
      /*
       * 0为中国集群
       * 1为北美集群，北美集群请联系极验完成相关配置方可使用
       */
      gtSDKModule.setGt3ServiceNode(0);
      console.log("=========== setGt3ServiceNode: =========== ");

      // 设置 webview 答案校验接口超时时间
      gtSDKModule.setWebviewTimeout(9000);
      console.log("=========== setWebviewTimeout: =========== ");

      // 设置 webview 资源加载超时
      gtSDKModule.setTimeout(6000);
      console.log("=========== setTimeout: =========== ");
    },
    startAsyncTaskCaptcha() {
      let self = this;
      if (gtSDKModule == undefined) {
        console.log("=========== load plugin failed =========== ");
        return;
      }
      this.result = null;
      this.text = this.$t('点击按钮验证');
      uni.$emit("fromChild" + this.type, { postData: null });
      if (this.type === 0) {
        // uni.$emit('fromChild'+this.type,{postData:null})
      }

      // 开启验证
      gtSDKModule.startAsyncTaskCaptcha(
        (result) => {
          // result为验证成功与否结果回调
          console.log(
            "=========== captcha result ======= " + JSON.stringify(result)
          );
          if (
            typeof result.error_code == "undefined" ||
            result.error_code == null ||
            result.error_code == ""
          ) {
            uni.showToast({
              icon: "none",
              title: self.$t('验证成功'),
              duration: 2000,
            });
          } else {
            uni.showToast({
              icon: "none",
              title: self.$t('验证失败') + ":" + result.error_code,
              duration: 2000,
            });
          }
        },
        (api1CallBack) => {
          // api1CallBack为 api1 请求开启回调
          // this.$options.methods.startRegisterTask();
          this.startRegisterTask();
        },
        (api2CallBack) => {
          // api2CallBack为二次验证请求参数回调
          console.log(
            "=========== captcha js result ======= " +
              JSON.stringify(api2CallBack)
          );
          // this.$options.methods.startValidateTask(JSON.stringify(api2CallBack));
          this.startValidateTask(JSON.stringify(api2CallBack));
        },
        (closedResult) => {
          // closedResult为关闭弹框方式回调
          // 1 点击验证码的关闭按钮来关闭验证码, 2 点击屏幕关闭验证码, 3 点击返回键关闭验证码
          console.log(
            "=========== captcha js result ======= " + closedResult.closedNumber
          );
          // this.text = '立即验证'
          console.log(self);
          if (!this.result) {
            // this.text = '验证失败'
          }
        }
      );
    },
    customAPI1Response(apiResponse) {
      // 修改 api1 的响应
      if (typeof apiResponse === "string") {
        console.log("=========== apiResponse: ======= " + apiResponse);
        let apiResponseJson = JSON.parse(apiResponse);
        console.log(
          "=========== apiResponseJson's type: ======= " +
            typeof apiResponseJson
        );

        let gt = apiResponseJson.gt;
        let challenge = apiResponseJson.challenge;
        let success = apiResponseJson.success;
        console.log(
          "=========== apiResponse, gt: " +
            gt +
            "challenge: " +
            challenge +
            "success: " +
            success +
            " ======="
        );

        // 自定义 api1 的 response
        if (gt !== null && challenge !== null && success !== null) {
          let json = {
            gt: gt,
            challenge: challenge,
            success: success,
          };
          gtSDKModule.customAPI1Response(json);
        }
      }
    },
    startRegisterTask() {
      // 通过 api1 请求拉取 gt、challenge、success 参数
      let timestamp = 1;
      var _this = this;
      this.$api.geetFirstRegister(
        _this.$config.childCode,
        function (err, res) {
          console.log(res, err);
          if (res) {
            console.log("=========== async task api1 result ======= ");
            let gt = res.gt;
            let challenge = res.challenge;
            let success = res.success;
            if (null != gt && null != challenge && null != success) {
              gtSDKModule.setAsyncTaskRegisterResult({
                gt: gt,
                challenge: challenge,
                success: success,
              });
            } else {
              gtSDKModule.setAsyncTaskRegisterResult({
                error: "invalidate response from api1",
              });
            }
          } else {
            console.log("=========== async task api1 error ======= ");
            console.log(error);
            gtSDKModule.setAsyncTaskRegisterResult({
              error: error.description,
            });
            uni.$emit("fromChildRes" + this.type, { postData: "shauxin" });
          }
        },
        false
      );
    },
    startValidateTask(result) {
      console.log(result, 6666666666666666);
      // 行为验证弹窗上手动操作验证通过之后，进行二次验证
      console.log("=========== start async validate task ======= ");
      if (typeof result === "string") {
        console.log(result);
        let json = JSON.parse(result);
        console.log(json);
        this.result = result;
        console.log("=========== postData: " + json + " =======", this);
        if (result) {
          this.text = this.$t('验证成功');
          gtSDKModule.setAsyncTaskValidateResult({
            result: "true",
          });
        } else {
          this.text = this.$t('验证失败');
          // 将二次验证结果回传给插件
          gtSDKModule.setAsyncTaskValidateResult({
            result: "fasle",
            error: info,
          });
        }
        uni.$emit("fromChild" + this.type, { postData: json });
      } else {
        gtSDKModule.setAsyncTaskValidateResult({
          result: "false",
          error: "api2 validate failed",
        });
      }
    },
    showAsyncTaskValidateResult(result) {
      // 二次验证结果展示
      console.log(
        "=========== async validate task result: " + result + " ======= "
      );
      let status = result.status;
      let info = result.info;
      if (status == "success") {
        // uni.showToast({
        // 	icon: "none",
        // 	title: "验证成功",
        // 	duration: 2000
        // });
      } else {
        // uni.showToast({
        // 	icon: "none",
        // 	title: "验证失败:" + info,
        // 	duration: 2000
        // });
      }
    },
  },
};
</script>

<style>
.result_group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #b9f6ca;
  margin: 0 10upx;
  border-radius: 10upx;
}

.action-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 10upx;
  border-radius: 10upx;
  width: 100%;
}

.text_attr {
  width: 95%;
  margin-left: 30upx;
  margin-top: 10upx;
  margin-bottom: 10upx;
  margin-right: 30upx;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 30upx;
}
.btn {
  color: #606266;
  background-image: linear-gradient(180deg, #ffffff 0%, #f3f3f3 100%);
}
.button_attr {
  justify-content: center;
  margin-top: 30upx;
  margin-left: 15upx;
  margin-right: 15upx;
  margin-bottom: 30upx;
  /* background-color: #8C57E3; */
}

.tableTitle {
  position: relative;
  margin-top: 50upx;
  margin-bottom: 50upx;
  width: 100%;
  height: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
}

.midText {
  position: absolute;
  left: 50%;
  background-color: #f2f2f5;
  transform: translateX(-50%) translateY(-50%);
}
</style>
