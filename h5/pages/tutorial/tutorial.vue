<template>
	<view class="content">
		<view class="nav">
			<view class="nav-item">
				<text :class="{'nav-active' : navActive ==1}" @tap="onswitch(1)">
					{{$t('苹果手机')}}
				</text>

			</view>
			<view class="nav-item">
				<text :class="{'nav-active' : navActive ==2}" @tap="onswitch(2)">{{$t('安卓手机')}}</text>
			</view>
		</view>
		<view class="anzWrap" v-show="navActive===2">
			<image v-if="this.$config.clientCode === 'ylba'" mode="widthFix" src="@/static/image/mb/android_01.png">
			<image v-if="this.$config.clientCode === 'xpja'" mode="widthFix" src="@/static/image/mb/android_01_xpj.png">
			<image mode="widthFix" src="@/static/image/mb/android_02.png">
			<image v-if="this.$config.clientCode === 'ylba'" mode="widthFix" src="@/static/image/mb/android_03.png">
			<image v-if="this.$config.clientCode === 'xpja'" mode="widthFix" src="@/static/image/mb/android_03_xpj.png">
		</view>
		<view class="anzWrap" v-show="navActive===1">
			<image mode="widthFix" src="@/static/image/mb/ios_01.png">
			<image mode="widthFix" src="@/static/image/mb/ios_02.png">
			<image v-if="this.$config.clientCode === 'ylba'" mode="widthFix" src="@/static/image/mb/ios_03.png">
			<image v-if="this.$config.clientCode === 'xpja'" mode="widthFix" src="@/static/image/mb/ios_03_xpj.png">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navActive: 1,
				isShow: true
			};
		},
		methods: {
			onswitch(index) {
				this.navActive = index
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100%;

		.nav {
			width: 100%;
			height: 100upx;

			display: flex;

			flex-shrink: 0;

			&>uni-view {
				flex: 1;
				font-size: 30upx;
				font-weight: 600;
				text-align: center;
				line-height: 90upx;
				border-bottom: 1px solid transparent;
				background-color: #fff;

				&>uni-text {
					padding: 12upx;
				}
			}

			.nav-active {
				color: #df0000;
				border-bottom: 1px solid #df0000;
			}
		}

		.anzWrap {
			padding: 20upx 0;

			&>uni-image {
				width: 100%;
				// height: 100%;
			}
		}
	}
</style>
