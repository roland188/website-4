<template>
  <view>
    <uni-nav-bar leftIcon="back" :title="$t('代理加盟')" @clickLeft="BackPage" :fixed="true" :statusBar="true">
    </uni-nav-bar>
    <view class="content-wrap">
      <view class="main" v-html="content">
        
      </view>  
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
		content:''
	};
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$api.getAgentCommissionPlan({}, (err, res) => {
		  this.content = res.rule
      },true);
    },
    BackPage() {
      uni.navigateBacks({})
    }
  },
};
</script>

<style lang="scss">
.content-wrap {
  padding: 17px;
}
</style>
