<template>
	<view class="vipLayout-wrap">
		<uni-nav-bar left-icon="back" :fixed="true" background-color="#22211f" color="#fff" @clickLeft="goBack"
			:title="$t('VIP特权')" @clickRight="goInfo">
			<view slot="right">
				{{$t('详情')}}
			</view>
		</uni-nav-bar>
		<view class="content-box">
			<view class="userPic-wrap">
				<view class="pic-inner-box">
					<image class="user-img" src="./image/userHeadImg.jpg" mode="" />
					<view class="vip-name">{{ vipLevelData.vipName }}</view>
					<view class="user-name">{{ username }}</view>
				</view>
			</view>
			<view class="page-section">
				<swiper class="swiper-item-wrap" :current="vipLevelData.vipLevel" :style="{
					height: config.height + 'rpx',
					}" :display-multiple-items="config.multiple" :next-margin="config.nextMargin + 'rpx'" v-if="listData.length > 0">
					<swiper-item v-for="swip in listData" :key="swip.id">
						<view class="swiper-item">
							<text class="flag-tag"
								:class="[swip.status == 2 ? 'locked-bg' : '']">{{ cardStatus(swip.status) }}</text>
							<view class="vip-level-icon">
								<text class="level-num">LV{{ levelShow(swip.vipLevel)}}</text>
							</view>
							<view class="member-content">
								<view class="member-level font700">
									{{
										swip.vipLevel == 0 ? $t('普通会员') : $t('VIP') + swip.vipLevel
									}}
								</view>
								<template v-if="['vi'].includes(locale)">
									<view class="member-info" v-if="(vipLevelData.recharge - vipLevelData.upgradeRecharge  >= 0)">
										{{$t('您已达到最高等级')}}
									</view>
									<!-- 未解锁 -->
									<view class="member-info"
										v-if="[2,0].includes(swip.status) && swip.vipLevel != vipLevelData.maxVipLevel">
										{{$t('您需要')}}
										<text class="font700">{{ swip.upgradeRecharge }}</text>
										{{$t('流水升级至')}}
										<text class="font700">VIP{{ swip.vipLevel + 1 }}</text>
									</view>
									<!-- 当前 -->
									<view class="member-info"
										v-if="[1].includes(swip.status) && swip.vipLevel != vipLevelData.maxVipLevel">
										{{$t('您需要')}}
										<text class="font700">{{ Math.abs(vipLevelData.recharge - vipLevelData.upgradeRecharge) }}</text>
										{{$t('流水升级至')}}
										<text class="font700">VIP{{ vipLevelData.vipLevel + 1 }}</text>
									</view>

									<view class="deposit-bottom-wrap"
										v-if="swip.status == 1 && vipLevelData.vipLevel != vipLevelData.maxVipLevel" style="margin-top: 40upx;">
										<view class="deposit-bottom-title">
											<text>{{$t('存款积累历史')}}</text>
												<text style="color: #F7881B;">
													{{Math.floor(vipLevelData.recharge)}}/<text style="color: #000;">{{　vipLevelData.upgradeRecharge　}}
												</text>
											</text>
										</view>
										<view class="deposit-process-wrap">
											<view class="step-num step-bg02" :style="{
												width: getPercent(vipLevelData.recharge, vipLevelData.upgradeRecharge　) + '%',
											}">
											</view>
										</view>
									</view>
								</template>

								<template v-else>
									<view class="member-info" v-if="
										[1, 2].includes(swip.status) &&
										(swip.vipLevel == vipLevelData.maxVipLevel || vipLevelData.vipLevel == vipLevelData.maxVipLevel)
										">
										{{$t('您已达到最高等级')}}
									</view>
									<!-- 未解锁 -->
									<view class="member-info"
										v-if="[2,0].includes(swip.status) && swip.vipLevel != vipLevelData.maxVipLevel">
										{{$t('您需要')}}
										<text class="font700">{{ swip.upgradeRecharge }}</text>
										{{$t('流水升级至')}}
										<text class="font700">VIP{{ swip.vipLevel + 1 }}</text>
									</view>
									<!-- 当前 -->
									<view class="member-info"
										v-if="[1].includes(swip.status) && swip.vipLevel != vipLevelData.maxVipLevel">
										{{$t('您需要')}}
										<text class="font700">{{ vipLevelData.upgradeBet }}</text>
										{{$t('流水升级至')}}
										<text class="font700">VIP{{ vipLevelData.vipLevel + 1 }}</text>
									</view>
									<view class="deposit-bottom-wrap"
										v-if="swip.status == 1 && vipLevelData.vipLevel != vipLevelData.maxVipLevel" style="margin-top: 40upx;">
										<view class="deposit-bottom-title">
											<text>{{$t('历史累计有效流水')}}</text>
											<text style="color: #F7881B;">{{Math.floor(vipLevelData.bet)}}/<text style="color: #000;">{{vipLevelData.upgradeBet}}</text></text>
										</view>
										<view class="deposit-process-wrap">
											<view class="step-num step-bg02" :style="{
												width: getPercent(vipLevelData.bet, vipLevelData.upgradeBet) + '%',
											}">
											</view>
										</view>
									</view>
								</template>
							</view>
						</view>
					</swiper-item>
				</swiper>
				<!-- 我的特权 -->
				<view class="my-privilege">
					<view class="my-privilege-title font700">{{$t('我享有的特权')}}</view>
					<view class="items-wrap">
						<view class="icon-item" v-for="icon in iconList" :key="icon.id">
							<view class="icon-img-wrap">
								<image class="icon-img" :src="require('./image/'+icon.file+'')" alt="" />
							</view>

							<view class="icon-info">
								<text class="price-text">{{ icon.price }}</text>
								<text class="info-title">{{ icon.text }}</text>
							</view>
						</view>
					</view>

					<view class="my-privilege-title font700">{{$t('我享有的返水')}}</view>
					
					<template v-if="['vi'].includes(locale)">
						<view class="my-backRecharge betc88Style">
							<view class="icon-item-wrap">
								<text class="name font700">{{$t('体育返水')}}:<text class="price-text-betc88">{{rebateData.rebate6 }}</text></text>
							</view>
							<view class="icon-item-wrap">
								<text class="name font700">{{$t('电竞返水')}}:<text class="price-text-betc88">{{rebateData.rebate3 }}</text></text>
							</view>
							<view class="icon-item-wrap">
								<text class="name font700">{{$t('篮球返水')}}:<text class="price-text-betc88">{{rebateData.rebate5 }}</text></text>
							</view>
							<view class="icon-item-wrap">
								<text class="name font700">{{$t('真人返水')}}:<text class="price-text-betc88">{{rebateData.rebate4 }}</text></text>
							</view>
							<view class="icon-item-wrap">
								<text class="name font700">{{$t('棋牌返水')}}:<text class="price-text-betc88">{{rebateData.rebate1 }}</text></text>
							</view>
							<view class="icon-item-wrap">
								<text class="name font700">{{$t('电子返水')}}:<text class="price-text-betc88">{{rebateData.rebate2 }}</text></text>
							</view>
						</view>
					</template>
					<template v-else>
						<view class="my-backRecharge">
							<view class="icon-item-wrap">
								<text class="price-text">{{rebateData.rebate1 }}</text>
								<text class="name font700">{{$t('体育返水')}}</text>
								<text class="most-price">{{ rebateData.rebateMax  || 0}}</text>
							</view>
							<view class="icon-item-wrap">
								<text class="price-text">{{rebateData.rebate2 }}</text>
								<text class="name font700">{{$t('电竞返水')}}</text>
								<text class="most-price">{{ rebateData.rebateMax || 0 }}</text>
							</view>
							<view class="icon-item-wrap">
								<text class="price-text">{{ rebateData.rebate3 }}</text>
								<text class="name font700">{{$t('篮球返水')}}</text>
								<text class="most-price">{{ rebateData.rebateMax || 0 }}</text>
							</view>
							<view class="icon-item-wrap">
								<text class="price-text">{{ rebateData.rebate4 }}</text>
								<text class="name font700">{{$t('真人返水')}}</text>
								<text class="most-price">{{ rebateData.rebateMax || 0 }}</text>
							</view>
							<view class="icon-item-wrap">
								<text class="price-text">{{ rebateData.rebate5 }}</text>
								<text class="name font700">{{$t('棋牌返水')}}</text>
								<text class="most-price">{{ rebateData.rebateMax || 0 }}</text>
							</view>
							<view class="icon-item-wrap">
								<text class="price-text">{{rebateData.rebate6}}</text>
								<text class="name font700">{{$t('电子返水')}}</text>
								<text class="most-price">{{ rebateData.rebateMax || 0}}</text>
							</view>
						</view>
					</template>
				</view>
			</view>
		</view>
		<myTabBar :current="3" ref="menuBar" />
	</view>
</template>

<script>
	import cache from "@/utils/cache.js";
	import myTabBar from '@/components/myTabBar/index.vue';
	export default {
		components: {
			myTabBar,
		},
		data() {
			return {
				config: {
					multiple: 1,
					nextMargin: 60, // 图片间距
					height: 340,
				},
				rebateData: {
					id: 0,
					rebate1: 0,
					rebate2: 0,
					rebate3: 0,
					rebate4: 0,
					rebate5: 0,
					rebate6: 0,
					rebateMax: 0,
					vipLevel: 0,
				},
				username: '',
				vipLevelData: {},
				// 2:未解锁 1:当前 0 已解锁
				listData: [],
				iconList: [
					// {
					// 	id: 2,
					// 	file: "vip_tq_icon02.png",
					// 	text: "VIP每月红包",
					// 	price: "0.00",
					// },
					{
						id: 3,
						file: "vip_tq_icon03.png",
						text: this.$t('晋级礼金'),
						price: "1.00",
					},
					{
						id: 4,
						file: "vip_tq_icon04.png",
						text: this.$t('生日礼金'),
						price: "0.00",
					},
				],
				locale: this.$config.locale
			};
		},
		onShow() {
			if(!this.$api.isLogin()) {
				uni.navigateTo({
					url: "/pages/Login/Login",
				});
				return
			}
			this.getVipData()
			this.getUserdata()
		},
		onLoad() {

		},
		mounted(){
			const username = cache.get("set_user").username;
			if (username) this.username = username
			 else
				this.getUserdata()
		},
		methods: {
			cardStatus(val) {
				const statusMap = {
					0: this.$t('已解锁'),
					1: this.$t('解锁'),
					2: this.$t('未解锁'),
				};
				return statusMap[val];
			},
			levelShow(val) {
				// 如果大于等于最高等级展示最高
				if (val >= this.vipLevelData.maxVipLevel) return this.vipLevelData.maxVipLevel;
				return val
			},
			getPercent(start, total) {
				if (start >= total) {
					return 100
				}
				return Math.floor((start / total) * 100);
			},
			getVipData() {
				this.$api.getUserLevel({}, (err, res) => {
					if(err) return
					// 当前等级配置
					this.vipLevelData = res.mnv;
					// 返水
					this.rebateData = res.mnvlr
					let list = res.mnvlrList.slice(0, res.mnv.maxVipLevel + 1)
					this.curDataInfo = list.find(
						(item) => item.vipLevel == this.vipLevelData.vipLevel
					);
					this.listData = list.map((item) => {
						let obj = {};
						if (item.vipLevel < this.vipLevelData.vipLevel) {
							// 已解锁
							obj["status"] = 0;
						} else if (item.vipLevel === this.vipLevelData.vipLevel) {
							// 当前
							obj["status"] = 1;
						} else {
							// 未解锁
							obj["status"] = 2;
						}
						obj["vipLevel"] = item.vipLevel;
						obj["id"] = item.id;
						// 未解锁和已解锁
						obj["upgradeRecharge"] = item.upgradeRecharge;
						obj["upgradeBet"] = item.upgradeBet;
						console.log('--',this.listData)
						return obj;
					});
					// 海里赠送
					// this.iconList[0].price =
					// 	this.curDataInfo.gitDesc;
					//  每月红包
					// this.iconList[0].price = this.curDataInfo.monthGit;
					// 晋级礼金
					this.iconList[0].price = this.curDataInfo?.levelGift || 0;
					// 生日礼金
					this.iconList[1].price = this.curDataInfo?.birthGift || 0;
				})
			},
			//获取个人信息
			getUserdata() {
				this.$api.userInfo(cache.get("set_user").user_id, (err, res) => {
					if (err) {
						return;
					}
					if (res) {
						console.log(res)
						this.username = res.name
					}
				});
			},

			// VIP详情
			goInfo() {
				uni.navigateTo({
					url: "/pages/vipDetail/vipDetail",
				});
			},
			goBack() {
				uni.navigateBacks({});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.page-btn {
		width: 222rpx;
		height: 114rpx;
		line-height: 100rpx;
		background-image: url("./image/top-bottom.png");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		border-color: #e1edff;
		color: #ffffff;
		position: absolute;
		right: -8rpx;
		top: -4rpx;
	}

	.vipLayout-wrap {}

	.userPic-wrap {
		width: 100%;
		height: 300rpx;
		// background-color: #ffff;
		display: flex;
		align-items: center;
		justify-content: center;

		.pic-inner-box {
			display: flex;
			flex-direction: column;

			.user-img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				display: block;
				align-self: center;
			}

			.vip-name {
				width: 140rpx;
				height: 40rpx;
				line-height: 40rpx;
				margin: 20rpx 0;
				text-align: center;
				background: var(--vipLevelColor);
				border-radius: 90px;
				font-size: 24rpx;
				color: #Fff;
			}

			.user-name {
				text-align: center;
				font-size: 28rpx;
				color: #000;
			}
		}
	}

	.swiper-item {
		position: relative;
		height: 100%;
		background: #fff;
		background-size: 100%;
		border:1px solid #FFF4EA;
		border-radius: 8upx;
		margin-right: 16upx;
		box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.04);

		.member-content {
			padding-top: 40rpx;
			color: #000;


			.member-level {
				font-size: 44rpx;
				color: #ebcc45;
				padding: 10rpx;
				padding-left: 30rpx;
			}

			.member-info {
				width: calc(100% - 320rpx);
				line-height: 1.2;
				margin-left: 30rpx;
				margin-bottom: 10rpx;
			}

			.deposit-bottom-wrap {
				padding-top: 10rpx;
				// color: #666666;
				font-size: 24rpx;
				padding: 0 32rpx;

				.deposit-bottom-title {
					display: flex;
					justify-content: space-between;
				}

				.deposit-process-wrap {
					position: relative;
					width: 100%;
					height: 20rpx;
					background-color: #e2e2e2;
					border-radius: 90px;

					.step-num {
						position: absolute;
						height: 100%;
						border-radius: 90px;

						transition: all 0.5s cubic-bezier(0, 0.64, 0.36, 1);
					}
				}
			}
		}

		.step-bg01 {
			background-color:#5090FF;
		}

		.step-bg02 {
			background-color: #FF7E7E;
		}

		.flag-tag {
			position: absolute;
			left: 20rpx;
			top: 10rpx;
			min-width: 120rpx;
			padding: 0 10rpx;
			height: 48rpx;
			background: var(--vipLevelBtnColor);
			border-radius: 8upx;
			color: #ffffff;
			text-align: center;

			&.locked-bg {
				background: #ccd6dd !important;
				color: #000;
			}
		}

		.vip-level-icon {
			position: absolute;
			right: 20rpx;
			top: 0;
			height: 198rpx;
			width: 160rpx;
			background: url("./image/VIPbg.png") no-repeat;
			background-size: 100% 100%;

			.level-num {
				position: absolute;
				top: 50rpx;
				left: 58rpx;
				color: #ebcc45;
				font-weight: 700;
			}
		}
	}

	.font700 {
		font-weight: 700;
	}

	.my-privilege {
		&-title {
			padding-left: 48rpx;
			height: 88rpx;
			line-height: 88rpx;
			color: #000;
			font-size: 32rpx;
			position: relative;

			&::before {
				position: absolute;
				content: "";
				width: 4rpx;
				height: 32rpx;
				background: #879daf;
				border-radius: 90px;
				top: 26rpx;
				left: 28rpx;
			}
		}

		.items-wrap {
			display: flex;
			flex-wrap: wrap;
		}

		.items-wrap .icon-item {
			display: flex;
			width: 50%;
			padding-left: 34rpx;
			box-sizing: border-box;
			align-items: center;

			image {
				width: 36rpx;
				height: 32rpx;
			}

			.icon-info {
				display: flex;
				flex-direction: column;
				margin-left: 10rpx;

				.info-title {
					color: #333333;
					font-size: 24rpx;
				}

				text {
					height: 40rpx;
					line-height: 40rpx;
				}
			}
		}

		.my-backRecharge {
			display: flex;
			flex-wrap: wrap;
			padding: 0 30rpx;
			gap: 20rpx 0;
			justify-content: space-between;
			.icon-item-wrap {
				width: 47%;
				min-height: 140rpx;
				background-color: #ffffff;
				border-radius: 8upx;
				border: 1px solid #333333;
				box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.06);
				border: 1px solid #eeeeeec2;
				display: flex;
				flex-direction: column;
				text-align: center;
				text {
					align-self: center;
				}

				.most-price {
					font-size: 24rpx;
					// color: var(--color-accent-1);
					opacity: .7;
				}
			}
		}
   .my-backRecharge .icon-item-wrap{
     padding-top: 50upx;
   }
		.price-text {
			color: #ebcc45;
			font-weight: 700;
			font-size: 30rpx;
		}
    .price-text-betc88 {
      color: #ebcc45;
      font-weight: 700;
      font-size: 30rpx;
      padding-left: 10rpx;
    }
	}

	.right-btn {
		color: #22211f !important;
	}

	.content-box {
		padding-top: var(--status-bar-height);
		padding-bottom: 120upx;
	}

	.icon-img-wrap {
		background: #22211f;
		height: 60upx;
		padding: 12upx;
		border-radius: 108upx;
	}

	.swiper-item-wrap {
		padding-left: 20upx;
	}
</style>
