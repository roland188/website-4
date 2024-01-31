<template>
	<view class="home-wrap" :class="{ 'old-service': $config.customerServiceStatus !== 1 }">
		<header-service :isHideBack="$config.isShowCustomerServiceBack ? false : true"
			v-show="!['Dispensing', 'Savemoney'].includes(currPage)" :title="getShowTitle()" @jump="jump" />
		<view v-if="$config.customerServiceStatus === 1" style="width: 100%;">
			<view class="home-up" v-if="showList">
				<view class="home-title">
					<view class="left-icon"> </view>
					<view class="right-text">
						{{
              $config.projectImgUrl == "tbh"
                ? $t1("会员服务中心")
                : $t1("客服自助处理中心")
            }}
					</view>
				</view>
				<view class="content-wrap">
					<view class="content-item" :class="item.w_100 ? 'w_100' : ''" v-show="item.isShow == 1"
						v-for="(item, index) in serverList" :key="index" @click="gotoDetail(item)">
						<image :src="item.icon" mode="aspectFill" class="content-icon"></image>
						<view class="content-title">
							{{ item.title }}
						</view>
					</view>
				</view>
				<view class="home-down" v-if="showList">
					<view class="center">
						<view v-show="customer == 1" @tap="go24serve">
							<image src="../lib/image/index-icon11.png" mode="aspectFill"
								style="width: 40upx; height: 40upx"></image>
							<view class="customer flash"> {{ $t1('24H客服中心') }} </view>
						</view>
						<view v-show="customer_phone == 1" @tap="goToPhoneser">
							<image src="../lib/image/index-icon12.png" mode="aspectFill"
								style="width: 40upx; height: 40upx"></image>
							<view class="customer" style="color: #1d1717"> {{ $t1('电话客服') }} </view>
						</view>
					</view>
				</view>
			</view>
			<!-- 轮播 -->
			<swipper-banner 
				:swiperList="bannerList" 
				v-if="bannerList.length > 0"
				@handleSwipperItem="handleSwipperItem" 
				:autoplay="autoplay" 
				indicatorDots :heightBox="182"></swipper-banner>
			<view class="home-down">
				<view class="tips">
					{{ $t1('政府颁发执照，安全有保障！支持微信、支付宝、银联服务，24小时取款，5分钟到账！受国际协会认可的合法公司。进行注册并娱乐前，请确保您年满18周岁！！') }}
				</view>
			</view>
		</view>
		<view v-if="$config.customerServiceStatus !== 1" class="bg-theme-1" style="width: 100%">
			<view class="customeList" v-for="(item, index) in customerData" :key="index">
				<view class="customeLeft">
					<image class="customeImg" v-if="$config.clientCode === 'tyca'" src="../lib/image/imgUrl1.png"
						mode="widthFix"></image>
					<image class="customeImg" v-else :src="require('../lib/image/imgUrl' + (index + 1) + '.png')"
						mode="widthFix"></image>
					<view class="customeCon">
						<view class="customName" v-if="item.name">
							{{ item.name }}
						</view>
						<view class="customeNumber" v-if="item.number">
							{{ item.number }}
						</view>
					</view>
				</view>
				<view class="customeRight">
					<view @click="goCustomer(item.url, item.name)" v-if="item.url" class="customeBtn bgCol3"
						:class="{'bgco20': ['amjs'].includes($config.clientCode)}">
						{{ $t1('联系客服') }}
					</view>
					<view class="customeBtn " :class="{'bgco20': ['amjs'].includes($config.clientCode)}"
						@click="copy(item.number)" v-else>
						{{ $t1('复制账号') }}
					</view>
				</view>
			</view>
		</view>
		<service-popup ref="serDialog" :list="domainList" />
		<myTabBar v-if="$config.myTabBar" :current="$config.myTabBar.index" />
	</view>
</template>

<script>



	import {
		_get
	} from "../lib/server.js";
	import api from "../lib/api";
	import headerService from "./header/header1.vue";
	import theme from "./common/theme";
	import myTabBar from "@/components/myTabBar/index.vue";
	import i18nT from '../mixins/i18n'
	import servicePopup from "../components/servicePopup.vue"
	import swipperBanner from "../components/swipper-banner.vue"
	export default {
		components: {
			headerService,
			myTabBar,
			servicePopup,
			swipperBanner
		},
		mixins: [i18nT, theme],
		data() {
			return {
				// serviceShow:false,
				server24: '',
				domainList: [],
				serverList: [{
						id: 1,
						icon: require("../lib/image/index-icon1.png"),
						title: this.$t1("忘记登录密码"),
						w_100: false,
						path: "ForgetPassword",
						isShow: 1,
					},
					{
						id: 2,
						icon: require("../lib/image/index-icon2.png"),
						title: this.$t1("出款未到账"),
						w_100: false,
						path: "Dispensing",
						isShow: 1,
					},
					{
						id: 3,
						icon: require("../lib/image/index-icon3.png"),
						title: this.$t1("账号解冻"),
						w_100: false,
						path: "AccountThaw",
						isShow: 1,
					},
					{
						id: 4,
						icon: require("../lib/image/index-icon4.png"),
						title: this.$t1("忘记取款密码"),
						w_100: false,
						path: "Withdrawal",
						isShow: 1,
					},
					{
						id: 5,
						icon: require("../lib/image/index-icon5.png"),
						title: this.$t1("修改银行名称"),
						w_100: false,
						path: "Bankname",
						isShow: 1,
					},
					{
						id: 6,
						icon: require("../lib/image/index-icon6.png"),
						title: this.$t1("修改银行卡号"),
						w_100: false,
						path: "Bankcard",
						isShow: 1,
					},
					{
						id: 7,
						icon: require("../lib/image/index-icon7.png"),
						title: this.$t1("入款未到账"),
						w_100: false,
						path: "Savemoney",
						isShow: 1,
					},
					{
						id: 8,
						icon: require("../lib/image/index-icon8.png"),
						title: this.$t1("投诉与建议"),
						w_100: false,
						path: "Suggestion",
						isShow: 1,
					},
					{
						id: 9,
						icon: require("../lib/image/index-icon9.png"),
						title: this.$t1("自助优惠申请"),
						w_100: true,
						path: "Apply",
						isShow: 1,
					},
					{
						id: 10,
						icon: require("../lib/image/index-icon10.png"),
						title: this.$t1("常见问题帮助中心"),
						w_100: true,
						path: "Problem",
						isShow: 1,
					},
				],
				bannerList:[],
				autoplay:false,
			};
		},
		created() {
		},
		mounted() {
			// #ifdef H5
			document.title = window.projectName
			// #endif
			this.initDataConfig(this.option.data);
			if (!this.showList) {
				uni.showLoading({
					title: this.$t1("加载中..."),
					mask: true,
				});
			}
			this.getBanner()
			setTimeout(() => {
				this.getFrontList();
				this.getLink();

			}, 0);
			// 旧客服
			if (this.$config.customerServiceStatus == 0) {
				this.customerGetList();
			}
		},
		methods: {
			// 点击开始swiper
			handleSwipperItem(items) {

			},
			// 获取轮播图
			getBanner() {
				this.$server.get("/longm/api/v1/banners/app/list/16", null, (err,res)=>{
					if(err) {
						this.autoplay = false
					} else {
						this.bannerList = res;
						this.autoplay = true
					}
				}, false);
			},
			jumpDomain(domain) {
				// #ifdef APP-PLUS
				this.setLinkApp(domain)
				// #endif
				// #ifdef H5
				this.setLinkH5(domain)
				// #endif
			},
			getLink() {
				_get(api.allHour).then(res => {
					if (res.code == 0) {
						if (this.$config.childCode === 'wyyl' || this.$config.childCode === 'amjs' || this.$config.childCode === 'wyjt') {
							this.server24 = res.data.domain
						} else {
							this.domainList = res.data.list
							if (res.data.list.length === 1) {
								// #ifdef APP-PLUS
								this.setLinkApp(res.data.domain)
								// #endif
								// #ifdef H5
								this.setLinkH5(res.data.domain)
								// #endif
							}
						}
					}
				})
			},
			setLinkH5(domain) {
				if (domain.startsWith('http')) {
					if (domain.includes('/chat/index.html')) {
						let startIndex = domain.indexOf("/chat/");
						if (startIndex !== -1) {
							let result = domain.substring(startIndex);
							this.server24 = result;
							console.log('server24', this.server24)
						} else {
							this.server24 = domain;
						}
					} else {
						this.server24 = domain;
					}
				} else {
					this.server24 = domain;
				}
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
			},
			jumpType() {
				// #ifdef H5
				window.location.href = this.server24
				// #endif
				// #ifdef APP-PLUS
				uni.setStorageSync('newServer24', this.server24)
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/webView/webView?url=" + 'newServer24'
					});
				}, 300)
				// #endif
			},
			go24serve() {
				// aygj  ffyl 增加埋点
				if(['aygj','ffyl','ffty'].includes(this.$config.childCode)){
					// #ifdef H5
					_paq.push(['trackEvent',  'H5_clickServerInit_' + this.$config.childCode, 'H5_clickServerInit_' + this.$config.childCode, this.$t1('点击客服开始'), '775599']);
					// #endif
					// #ifdef APP-PLUS
					this.$matomoRequest('','',['clickServerInit_' + this.$config.childCode,this.$t1('点击客服开始'), '775599'])	
					// #endif
				}
				if (['wyyl','amjs','wyjt'].includes(this.$config.childCode)) {
					this.jumpType()
				} else {
					if (this.domainList.length === 1) {
						this.jumpType()
					} else {
						this.$refs.serDialog.open()
						return
					}
				}

			}
		},
	};
</script>

<style lang="scss" scoped>
	.home-wrap {
		// min-height: calc(100vh - 90upx);
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		border-top: 1px solid #f7f8f9;
		padding-top: var(--status-bar-height);

		.home-up {
			width: 100%;
			background-color: #fff;

			.home-title {
				display: flex;
				align-items: center;
				height: 106upx;
				line-height: 106upx;

				.left-icon {
					width: 8upx;
					height: 40upx;
					background-color: #e91919;
					border-radius: 8upx;
					margin: 0 20upx;
				}

				.right-text {
					color: #2c3e50;
					font-size: 28upx;
				}
			}

			.content-wrap {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-content: flex-start;
				flex-wrap: wrap;

				.content-item {
					width: 370upx;
					height: 134upx;
					border-bottom: 1px solid #f7f8f9;
					border-right: 1px solid #f7f8f9;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;

					.content-icon {
						width: 40upx;
						height: 40upx;
					}

					.content-title {
						font-size: 30upx;
						font-family: PingFang SC;
						font-weight: 700;
						color: #1d1717;
						opacity: 1;
						padding-left: 20upx;
					}
				}

				// .content-item:nth-child(2n + 1) {
				// 	border-right: 1px solid #f7f8f9;
				// }

				.w_100 {
					width: 100%;
				}
			}
		}

		.home-down {
			width: 100%;
			height: 220upx;
			background-color: #fff;
			position: relative;

			.center {
				display: flex;
				// flex-direction: column;
				justify-content: center;
				align-items: center;
				padding-top: 20upx;

				&>uni-view {
					text-align: center;
					width: 50%;
					line-height: 1.1 !important;
				}

				.customer {
					font-family: PingFang SC;
					color: red;
					font-weight: 500;
					font-size: 28upx;
				}

				.flash {
					animation: flashing 2s linear infinite;
				}

				@keyframes flashing {
					0% {
						color: red;
					}

					25% {
						color: #fff;
					}

					50% {
						color: red;
					}

					75% {
						color: #fff;
					}

					100% {
						color: red;
					}
				}
			}

			.tips {
				width: 120%;
				height: 90upx;
				font-size: 24upx;
				transform: scale(0.76);
				position: absolute;
				left: -60upx;
				bottom: 10upx;
				opacity: 0.8;
				overflow-y: auto;
			}
		}

		.customerService {
			width: 100%;
			height: 100%;
			overflow-y: auto;
		}

		.customerService ::v-deep .uni-navbar__header {
			height: 88upx;
		}

		.customerUl {
			overflow-y: auto;
			padding: 20upx;
		}

		.customeList {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30upx;
			background-color: #fff;
			border-radius: 12upx;
			height: 160rpx;
			font-size: 28upx;
			width: 94%;
			margin: 20upx auto;
		}

		.bgco20 {
			background: linear-gradient(225deg, #9B7C4C 0%, #FFE7C1 100%);
			color: #2d2b4d !important;
		}

		.customeLeft {
			flex-grow: 1;
			display: flex;
			align-items: center;
		}

		.customeRight {
			flex-grow: 0;
			flex-shrink: 0;
		}

		.customeImg {
			width: 100upx;
			margin-right: 20upx;
			height: auto;
		}

		.customName {
			font-size: 30upx;
		}

		.customeNumber {
			font-size: 24upx;
			margin-top: 4upx;
			color: #666;
		}

		.customeBtn {
			width: 170upx;
			height: 76upx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 64upx;
			color: #fff;
		}
	}

	.bg-theme-1 {
		background: rgba(244, 244, 244, 1);
		height: calc(100vh - 90rpx - var(--status-bar-height));
	}

	.old-service {
		height: auto;
	}
	.uni-swiper-dots{
		display: none;
	}
</style>
