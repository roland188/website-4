<template>
	<view class="scroll-swiper-page">
		<view class="nav-point">
			<view class="title">
				{{$t('供应商')}}
			</view>
			<view class="arrow">
				<view class="swiper-arrow swiper-arrow-left" @click="prevItem1">
					<image src="@/static/image/indexImg/arrow-l.png" mode=""></image>
				</view>
				<view class="swiper-arrow swiper-arrow-right" @click="nextItem1">
					<image src="@/static/image/indexImg/arrow-r.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="scroll-warp">
			<swiper class="swiper" circular :style="{ height: itemHeight + 'px' }" :display-multiple-items="4"
				:autoplay="autoplay" :interval="interval" :duration="duration" @change="swiperChange1"
				:current="currentIndex1">
				<swiper-item v-for="(item,index) in itemList1" :key="index">
					<view class="item">
						<image :src="item" mode="aspectFill" class="bg-1"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="nav-point">
			<view class="title">
				{{$t('付款方式')}}
			</view>
			<view class="arrow">
				<view class="swiper-arrow swiper-arrow-left" @click="prevItem2">
					<image src="@/static/image/indexImg/arrow-l.png" mode=""></image>
				</view>
				<view class="swiper-arrow swiper-arrow-right" @click="nextItem2">
					<image src="@/static/image/indexImg/arrow-r.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="scroll-warp">
			<swiper class="swiper" circular :style="{ height: itemHeight + 'px' }" :display-multiple-items="4"
				:autoplay="autoplay" :interval="interval" :duration="duration" @change="swiperChange2"
				:current="currentIndex2">
				<swiper-item v-for="(item,index) in itemList2" :key="index">
					<view class="item">
						<image :src="item" mode="widthFix" class="bg-2"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoplay: true,
				interval: 2000,
				duration: 500,
				itemHeight: 65,
				currentIndex1: 0,
				currentIndex2: 0,
				itemList1: [
					require("@/static/image/indexImg/supplier/t1.png"),
					require("@/static/image/indexImg/supplier/t2.png"),
					require("@/static/image/indexImg/supplier/t3.png"),
					require("@/static/image/indexImg/supplier/t4.png"),
					require("@/static/image/indexImg/supplier/t5.png"),
					
				],
				itemList2: [
					require("@/static/image/indexImg/supplier/p1.png"),
					require("@/static/image/indexImg/supplier/p2.png"),
					require("@/static/image/indexImg/supplier/p3.png"),
					require("@/static/image/indexImg/supplier/p4.png"),
					require("@/static/image/indexImg/supplier/p5.png"),
					require("@/static/image/indexImg/supplier/p6.png"),
					require("@/static/image/indexImg/supplier/p7.png"),
					require("@/static/image/indexImg/supplier/p8.png"),
					require("@/static/image/indexImg/supplier/p9.png"),
					require("@/static/image/indexImg/supplier/p10.png"),
					require("@/static/image/indexImg/supplier/p11.png"),
					require("@/static/image/indexImg/supplier/p12.png"),
					require("@/static/image/indexImg/supplier/p13.png")
				]
			};
		},
		created() {
		},
		methods: {
			// 切换到上一张图片
			prevItem1() {
				if (this.currentIndex1 > 0) {
					this.currentIndex1--;
				} else {
					this.currentIndex1 = this.itemList1.length - 1;
				}
			},
			// 切换到下一张图片
			nextItem1() {
				if (this.currentIndex1 < this.itemList1.length - 1) {
					this.currentIndex1++;
				} else {
					this.currentIndex1 = 0;
				}
			},
			// swiper 切换时更新当前索引
			swiperChange1(e) {
				this.currentIndex1 = e.detail.current;
			},
			// 切换到上一张图片
			prevItem2() {
				if (this.currentIndex2 > 0) {
					this.currentIndex2--;
				} else {
					this.currentIndex2 = this.itemList2.length - 1;
				}
			},
			// 切换到下一张图片
			nextItem2() {
				if (this.currentIndex2 < this.itemList2.length - 1) {
					this.currentIndex2++;
				} else {
					this.currentIndex2 = 0;
				}
			},
			// swiper 切换时更新当前索引
			swiperChange2(e) {
				this.currentIndex2 = e.detail.current;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.scroll-swiper-page {
		margin-top:30upx;
		.nav-point {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.arrow {
				display: flex;
				margin-right: 34upx;

				.swiper-arrow {
					width: 14upx;
					height: 26upx;

					&>uni-image {
						width: 100%;
						height: 100%;
					}
				}

				.swiper-arrow-left {
					margin-right: 40upx;
				}
			}
		}

		.scroll-warp {
			margin: 30upx 0;

			.item {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 154upx;
				height: 126upx;
				flex-shrink: 0;
				border-radius: 22upx;
				background: #0F0F0F;
			}

			.bg-1 {
				width: 120upx;
				height: 65upx;
			}

			.bg-2 {
				width: 100upx;
				height: 60upx;
			}
		}
	}
</style>
