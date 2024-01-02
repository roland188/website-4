<template>
  <view class="content">
    <view v-if="gtShow" class="button_attr">
      <button type="primary" class="btn" @tap="startgt">{{ text }}</button>
    </view>
  </view>
</template>

<script>
var smSDKModule = uni.requireNativePlugin("SM-SMCaptchaModule");
export default {
  data() {
    return {
      result: null,
      text: "",
    };
  },
  props: {
    smData: {
      type: Object,
      default: () => {},
    },
    gtShow: false,
    type: null,
    smText: {
      type: String,
      default: "",
    },
  },
  created() {
    this.text = this.smText;
  },
  mounted() {
    if (!smSDKModule) {
      console.log("sm:smSDKModule is null.");
      return;
    }
    console.log("sm:init:", this.smData);
    smSDKModule.init(this.smData);
  },
  methods: {
    startgt() {
      if (!smSDKModule) {
        console.log("sm:smSDKModule is null.");
        return;
      }
      smSDKModule.show((res) => {
        // var res = {code:0,rid:1111}
        console.log("sm:show", res);
        if (res.code == 0) {
          this.text = this.$t("验证成功");
          this.$emit("fromChild", res);
        } else {
          this.text = this.$t("验证失败");
        }
      });
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
