<template>
	<view class="service-page">
		<uni-popup ref="popup" type="bottom" @change="change">
			<view class="popup-wrap">
				<view class="head-line"></view>
				<view class="popup-title">
					<image src="../lib/image/tTips.png" class="title-icon">
						<text class="title-text">{{ $t1('如遇到无法访问请及时更换客服线路') }}</text>
				</view>
				<view class="contaiter">
					<scroll-view scroll-y="true" class="scroll-Y">
						<view class="item" v-for="(item,index) in list" :key="item.id" @click="jumpDomain(item.domain,item.showName)">
							<view class="item-left">
								<image :src="$config.getImgUrl(item.imgUrl)" class="left-icon">
									<view class="name">{{item.showName}}</view>
							</view>
							<view class="item-right">
								<image src="../lib/image/previous.png" class="right-icon">
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import theme from "../customerServiceTheme/common/theme.js";
	import config from "../lib/config";
	import i18nT from '../mixins/i18n'
	import {
		_get
	} from "../lib/server";
	export default {
		mixins: [i18nT, theme],
		components: {

		},
		props: {
			list: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				server24: ''
			}
		},

		methods: {
			change(e){
				console.log('eee',e)
				// #ifdef APP-PLUS

				if(e.show){
					setTimeout(() => {
						uni.hideTabBar();
					}, 100);
				}else{
					setTimeout(() => {
						uni.showTabBar();
					}, 100); 
				}
				// #endif
			},
			jumpDomain(domain,name) {
				// aygj  ffyl 增加埋点
				if(['aygj','ffyl','ffty'].includes(this.$config.childCode)){
					// #ifdef H5
					_paq.push(['trackEvent',  'H5_clickServer_' + this.$config.childCode, 'H5_clickServer_' + this.$config.childCode, name, '7755991']);
					// #endif
					// #ifdef APP-PLUS
					this.$matomoRequest('','',['clickServer_' + this.$config.childCode, name , '7755991'])	
					// #endif
				}
				this.$refs.popup.close()
				// #ifdef APP-PLUS
				this.setLinkApp(domain)
				// #endif
				// #ifdef H5
				this.setLinkH5(domain)
				// #endif
			},
			setLinkH5(domain) {
				if (domain.startsWith('http')) {
					if (domain.includes('/chat/index.html')) {
						let startIndex = domain.indexOf("/chat/");
						if (startIndex !== -1) {
							let result = domain.substring(startIndex);
							this.server24 = result;
						} else {
							this.server24 = domain;
						}
					} else {
						this.server24 = domain;
					}
				} else {
					this.server24 = domain;
				}
				window.location.href = this.server24

			},
			setLinkApp(domain) {
				if (domain.startsWith('http')) {
					if (domain.includes('/chat/index.html')) {
						let startIndex = domain.indexOf("/chat/");
						if (startIndex !== -1) {
							let result = domain.substring(startIndex);
							this.server24 = this.$config.host + result;
						} else {
							this.server24 = domain;
						}
					} else {
						this.server24 = domain
					}
				} else if (domain.startsWith('/chat/')) {
					this.server24 = this.$config.host + domain;
				} else {
					this.server24 = domain
				}
				uni.setStorageSync('newServer24',this.server24)
				setTimeout(()=>{
					uni.navigateTo({
						url: "/pages/webView/webView?url="+'newServer24'
					});
				},300)
			},

			open() {
			 
				this.$refs.popup.open()
			},
			close() {
		
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.service-page {
		.popup-wrap {
			width: 100%;
			background-color: #fff;
			border-radius: 16upx 16upx 0 0;
			padding: 16upx 40upx 40upx 40upx;
			box-sizing: border-box;
			.head-line {
				width: 84upx;
				height: 8upx;
				background: #82848f;
				margin: 0 auto;
				border-radius: 40upx;
				margin-bottom: 16upx;
			}

			.popup-title {
				display: flex;
				justify-content: center;
				align-items: center;

				.title-icon {
					width: 40upx;
					height: 40upx;
					margin-right: 8upx;
				}

				.title-text {
					color: #ACADB4;
					font-size: 32upx;
				}
			}

			.contaiter {
				margin-top: 20upx;

				.scroll-Y {
					max-height: 548upx;
				}

				.item {
					height: 96upx;
					border-radius: 16upx;
					background: #F5F5F5;
					margin-top: 12upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 26upx;
				}


				.item-left {
					display: flex;
					align-items: center;
				}

				.item-right {
					display: flex;
				}

				.right-icon {
					width: 48upx;
					height: 48upx;
				}

				.left-icon {
					width: 36upx;
					height: 36upx;
					margin-right: 32upx;
					border-radius: 300upx;
				}

				.name {
					width: 500upx;
					color: #2F3244;
					font-size: 32upx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

		}

		::v-deep .uni-popup {
			z-index: 9999 !important;
		}
	}
</style>
