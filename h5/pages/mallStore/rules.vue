<template>
    <view class="rules-layout">
        <uni-nav-bar  class="rules-nav"  left-icon="back" :title="$t('优惠详情')" @clickLeft="goBack"  right-icon="headphones" @clickRight="handleGoServe('/pages/customerService/customerService')"></uni-nav-bar>
        <view class="ruleContent" v-html="ruleContent"></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            headerTitle: this.$t('优惠详情'),
            showArrow: true,
            ruleContent: ""
        };
    },
    onLoad() {
        //获取规则
        this.getRules();
    },
    methods: {
      clear(e) {
        // TODO nvue 取消冒泡
        e.stopPropagation()
      },
      handleGoServe(url){
        uni.navigateTo({
          url: "/pages/subCustomerService/subCustomerService",
        });
      },
        // 返回
        goBack () {
          uni.navigateBacks();
			// this.$pageBack.pageBack()
            // uni.navigateBack({
            //      delta: 1
            // })
        },
        // // 联系客服
        // goServer () {
        //     uni.navigateTo({
        //         url: '/pages/customerService/customerService'
        //     })
        // },
        getRules() {
            this.$api.getClientMall((err, res) => {
                if (err) return
                this.ruleContent = res.ruleContent
            })
        }
    }
};
</script>

<style lang='scss' scoped>
.rules-layout {
    width: 100vw;
    height: 100vh;
    padding: 0 16px 16px;
    box-sizing: border-box;
    overflow: auto;
    background: #FFFFFF;
    overflow-x: hidden;
    .rules-nav {
      transform: translateX(-16px);
    }
}
.ruleContent{
	margin-top: 20px;
	font-size: 22upx;
}
</style>
