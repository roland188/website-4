
<template>
	<view class="scs-back">
		<image @click="goBack()" class="scs-back-icon" :src="require(`../image/back.png`)" />
		<text>{{title}}</text>
		 <slot name="center"></slot>
	</view>
</template>

<script>
	export default {
		props: {
			title: '',
		},
		methods: {
			goBack() {
				this.$emit('goBackHead')
			},
		},
	
	}
</script>

<style scoped>
	.scs-back {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-weight: 700;
		color:var(--themeBlack);
		position: relative;
		background: var(--themeWhite);
	}

	.scs-back-icon {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		top: 26rpx;
		left: 26rpx;
	}
</style>
