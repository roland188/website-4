<template>
	<view class="prodetail">
		<view class="title">
			{{dataDetail.questionTitle}}
		</view>
		<view class="content" v-html="dataDetail.questionContent">

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataDetail: {},
			}
		},
		mounted() {
			this.dataDetail = uni.getStorageSync('faqList')
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.prodetail {
		width: 100%;
		height: 100%;

		.title {
			border-top: 1px solid #ccc;
			border-bottom: 1px solid #ccc;
			font-size: 36upx;
			font-weight: 700;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #1d1717;
			padding: 20upx;
		}

		.content {
			font-size: 26upx;
			padding: 30upx;
		}
	}
</style>
