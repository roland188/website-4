<template>
  <view>{{ $t("提现") }}</view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShow() {
    if (!this.$api.isLogin()) {
      uni.navigateTo({
        url: "../Login/Login",
      });
    }
  },
  methods: {},
};
</script>

<style></style>
