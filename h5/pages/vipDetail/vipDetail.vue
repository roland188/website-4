<template>
	<view class="viDetail-page" :style="{ minHeight: '100%',}">
		<uni-nav-bar left-icon="back" :fixed="true" background-color="#22211f" color="#fff" @clickLeft="goBack"
			:title="$t('VIP特权')">
		</uni-nav-bar>
		<view class="vip-detail-body">
			<view class="vipDetail-layout">
				<view class="item" v-html="descriptionList.vipFaqContent">
				</view>
				<view class="item" v-html="descriptionList.vipRuleContent">
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		components: {},
		data() {
			return {
				descriptionList: [], // 活动说明
			}
		},
		onLoad() {
			this.getVipfaq()
		},
		mounted() {},
		methods: {
			getVipfaq() {
				this.$api.getVipfaq((err, res) => {
					if (err) return
					else {
						this.descriptionList = res
					}

				})
			},
			goBack() {
				uni.navigateBacks({

				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.viDetail-page {
		width: 100%;
		min-height: 100%;
		background: #fff;

		.vip-detail-body {
			position: relative;
			top: 0;
			left: 0;
			overflow: hidden;
			border-top: 1px solid #f2f3f5;

			.vipDetail-layout {
				padding: 30upx 30upx 80upx 30upx;
				box-sizing: border-box;
			}

			.item {
				margin-top: 30upx;
			}
		}

	}
</style>
