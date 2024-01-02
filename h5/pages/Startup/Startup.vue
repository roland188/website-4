<!-- 启动页 -->
<template>
  <view style="width: 100%; height: 100%">
    <view class="startup-page" v-if="isAmxpj === 'amxpj'"></view>
    <view class="startBox" v-else>
      <image
        class="logo"
        :src="$config.platformLogo('logo')"
        mode="widthFix"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isAmxpj: "",
    };
  },
  onShow() {  
    this.isAmxpj = this.$config.projectImgUrl;
	// #ifdef H5
	this.isAmxpj = window.projectImgUrl
	// #endif
  },
};
</script>

<style scoped>
.startup-page {
  width: 100%;
  height: 100%;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-color: #020101;
  background-position: center center;
  background-image: url("../../static/startup.jpg");
}
.startup_xiaocao {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url("../../static/startup_xiaocao.png");
}
.startBox {
  width: 100%;
  height: 100%;
  background-color: var(--theme);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 60%;
  height: auto;
}
</style>
