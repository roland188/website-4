<template>
	<view class="ip">
		<image class="ip-img" src="../../static/image/iplimit/h5_restriction_01.png" mode="" />
		<view class="ip-warning">
			<image class="ip-warning-img" src="../../static/image/iplimit/h5_restriction_02.png" mode="" />
			<text class="ip-warning-text">{{ $t('访问受限制') }}</text>
		</view>
		<view class="ip-info">
			<text>
				{{$t('尊敬的用户，由于相关法规限制，您所在的地区无法访问，如有任何疑问，请联系客服，我们将第一时间给您回复，对您造成的不便，我们深表歉意，感谢您的理解和支持！')}}
			</text>
		</view>
		<view class="ip-value">
			<text>{{$t('您的IP地址')}}：{{ip}}</text>
		</view>
		<div @click="gotoCustomer">
			<image class="ip-customer" src="../../static/image/iplimit/h5_customer.png" mode="" />
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ip: '',
				custommerUrl: ''
			};
		},
		onLoad(query) {
			this.ip = query.ip;
			this.custommerUrl = query.custommerUrl;
		},
		methods: {
			gotoCustomer() {
				// #ifdef APP-PLUS
				plus.runtime.openURL(this.custommerUrl)
				// #endif
				// #ifdef H5
				window.open(this.custommerUrl)
				// #endif
			}
		}
	}
</script>
<style lang="scss" scoped>
	.ip {
		padding: 100rpx 75rpx 0;

		&-img {
			width: 600rpx;
			height: 505rpx;
			margin: auto;
			display: block;
		}

		&-customer {
			width: 420rpx;
			height: 110rpx;
			margin: 10rpx auto;
			transform: translateX(10rpx);
			display: block;
		}

		&-warning {
			display: flex;
			justify-content: center;
			align-items: center;
			transform: translateY(-50%);

			&-img {
				width: 74rpx;
				height: 64rpx;
				margin-right: 10rpx;
			}

			&-text {
				font-size: 60rpx;
				background-image: linear-gradient(180deg, #ED8980FF 0%, #EA675CFF 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}
		}

		&-info {
			border-radius: 10px;
			background-color: #FFFFFFFF;
			border: 1px solid #EEEEEEFF;
			box-shadow: 10rpx 10rpx 10rpx rgba(#000, .04);
			padding: 28rpx 53rpx 49rpx 44rpx;
			color: #666;
			font-size: 30rpx;
			margin-bottom: 55rpx;
		}

		&-value {
			color: #ED8980;
			font-size: 24rpx;
			text-align: center;
		}
	}
</style>
