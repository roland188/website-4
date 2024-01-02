<!-- 等待页面 -->
<template>
  <view style="line-height: 300rpx; text-align: center">
    {{ $t(' 充值跳转中，请耐心等待...') }}
  </view>
</template>

<script>
export default {
  mounted() {
    const self =this
    setTimeout(() => {
      const form = localStorage.getItem("waitForm");
      if (form != "recharge") {
        window.close();
        return;
      }
      localStorage.setItem("waitForm", "");
      const data = JSON.parse(localStorage.getItem("waitData"));
      this.$api.getPaymentNextStep(data, (err, res) => {
        if (err) {
          uni.showModal({
            title: self.$t('提示'),
            content: `${self.$t("该通道不可用请重试！")}(code: ${err.code})`,
            confirmText: self.$t("知道了"),
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                window.close();
                uni.redirectTo({
                  url: "/pages/recharge/recharge",
                });
              }
            },
          });
        } else {
          // 处理微信协议
          if (res.url.includes("weixin://")) {
            const a = document.createElement("a");
            a.href = res.url;
            document.body.appendChild(a);
            a.click();
            return;
          }
          // 正常能新开窗口的情况
          localStorage.setItem("waitUrl", res.url);

          // 不能打开新窗口的情况
          if (res.url.includes("https")) {
            // https的情况
            window.location.href = res.url;
          } else {
            // http的情况
            setTimeout(() => {
              // 1s之后原网页没有执行跳转，则手动跳转
              const waitRes = localStorage.getItem("waitRes");
              if (!waitRes) {
                const result = window.open(res.url);
                if (!result) {
                  window.location.href = res.url;
                }
              }
            }, 1000);
          }
        }
      });
    }, 500);
  },
};
</script>
