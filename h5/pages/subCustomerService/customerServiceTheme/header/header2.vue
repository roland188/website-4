<!-- 客服中心-头部 -->
<template>
	<view class="scs-back">
		<image v-if="isHideBack" @click="goBack()"  class="scs-back-icon" :src="$config.themeImgUrl('back')"/>
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
        default: true
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
		/* color: #323233; */
		position: relative;
		/* border-bottom: 1rpx solid var(--border1); */
		/* background-color: #fff; */
	}

	.scs-back-icon {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		top: 26rpx;
		left: 26rpx;
	}
</style>
