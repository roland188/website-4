<!-- 客服中心-头部 -->
<template>
	<view class="scs-back" :class="{'amjs-bg': ['amjs','viet'].includes($config.clientCode)}">
		<image v-if="!isHideBack" @click="goBack()" class="scs-back-icon" src="../../lib/image/head-back.png" />
		<text>{{title}}</text>
	</view>
</template>

<script>
import header from "../common/header"
	export default {
		props: {
			title: '',
			currPage: '',
      isHideBack:{
        type: Boolean,
        default: false
      }
		},
    mixins: [header],
	
	}
</script>

<style scoped>
	.scs-back {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 700;
		color: #323233;
		position: relative;
		border-bottom: 1rpx solid #eee;
		background-color: #fff;
	}

	.amjs-bg{
		color: #fff;
		background-color: rgb(23, 23, 23);
	}

	.scs-back-icon {
		width: 26rpx;
		height: 26rpx;
		position: absolute;
		top: 26rpx;
		left: 26rpx;
	}
</style>
