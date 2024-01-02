<template>
  <view class="content">
    <botion ref="captcha" :config="config" @captchaSuccess="captchaSuccess" @captchaError="captchaError"></botion>
    <view class="button_attr">
      <button type="primary" class="btn" @tap="btnSubmit">{{gtText}}</button>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      config: {
		language: this.$config.locale !== 'vi' ? this.$config.locale : 'vie',
        captchaId: this.$config.captchaId(),
        riskType: "slide",
      },
      result: null,
    }
  },
  props: {
    gtText: '',
  },
  methods: {
    captchaSuccess(result) { 
      console.log('captchaSuccess:')
	  this.$emit('update:gtText',this.$t('验证成功'))
      this.$emit('fromChild',result)
    },
    captchaError(e) { 
      let msg = JSON.stringify(e)
      console.log('captchaError:', msg)
			this.$emit('update:gtText',this.$t('验证失败'))
    },
    btnSubmit() {
      console.log('btnSubmit:')
      this.$refs.captcha.showCaptcha();
    },
  }
}
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
