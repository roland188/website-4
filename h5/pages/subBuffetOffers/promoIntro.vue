<!-- 规则 -->
<template>
	<view>
		<uni-nav-bar left-icon="back" :title="selfHelpItem.name" @clickLeft="goBack"></uni-nav-bar>
		<view class="simi-content">
			<view v-html="selfHelpItem.intro"></view>
		</view>
	</view>
</template>

<script>
	import childStore from './utils/store.js'
	export default {
		data() {
			return {
				headerTitle: this.$t('详情'),
				content: '<div><h2>标题</h2>内容</div>',
			};
		},
		computed:{
			selfHelpItem(){
				return  childStore.state.selfHelpItem || {}
				
			},
		},
		methods: {
			goBack() {
				uni.navigateBacks({})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.simi-content {
		padding: 20upx;
		font-size: 22upx !important;
	}

	::v-deep .simi-content h1 {
		font-size: 26upx;
	}

	::v-deep .simi-content h2 {
		font-size: 32upx;
		text-align: left !important;
	}

	::v-deep .simi-content p {
		font-size: 22upx;
		line-height: 2.5;
	}

	.simi-content li {
		font-size: 22upx;
		line-height: 2.5;
	}

	::v-deep .simi-content table {
		width: 100%;
		/* margin: 0 auto !important; */
		box-sizing: border-box;
	}

	::v-deep .simi-content th {
		background-color: #f2f2f2;
		height: 80upx;
		line-height: 80upx;
		border: 1upx solid #e6e6e6;
	}

	::v-deep .simi-content td {
		background-color: #fff;
		height: 60upx;
		line-height: 60upx;
		border: 1upx solid #e6e6e6;
		text-align: center;
	}
</style>
