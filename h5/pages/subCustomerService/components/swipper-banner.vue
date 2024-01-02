<template>
	<view>
		<!-- 轮播 -->
		<view scroll-y="true" upperThreshold="upperThreshold">
			<view class="swiper-wrapper" :style="{height:heightBox+ 'upx'}">
				<swiper class="swiper" :style="{height:heightBox+ 'upx'}" :current="currentIndex" :indicator-dots="indicatorDots" indicator-active-color="#fff" indicator-color="rgba(0, 0, 0, 0.2)" :circular="true" :autoplay="autoplay" interval="5000" :duration="500">
					<swiper-item class="swiper-item" v-for="(items,index) in swiperList" :key="index" @tap="handleSwipperItem(items)">
						<view class="swiper-item-img" :style="{height:heightBox+ 'upx'}">
							<image :src="$config.getImgUrl(items.pictureApp)" class="img" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import { goBannerMixin } from "@/mixin/goBanner.js";
	export default {
		props: {
			swiperList: {
				type: Array,
				default: () => []
			},
			heightBox: {
				type: Number,
				default: 330,
			},
			autoplay: {
				type:Boolean,
				default: true
			},
			indicatorDots:{
				type:Boolean,
				default: false
			},
		},
		data(){
			return{
				currentIndex:0
			}
		},
		mixins:[goBannerMixin],
		methods:{
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-wrapper {
		border-radius: 12upx;
		margin: 0 auto;
		width: 96%;
		// background: url(../../static/imgs/loading.d63517a.gif) no-repeat;
		// background: url(../../static/imgs/home/bannerLoading.png) no-repeat;
		background-size: 50% 100%;
		background-position: 50%;
		overflow: hidden;
		border-radius: 20upx;
	}

	.swiper {
		width: 100%;
	}
	.swiper-item-img {
		border-radius: 20upx;
		margin: 0 auto;
		position: relative;
		width: 99%;
		// background: url(../../static/imgs/home/bannerLoading.png) no-repeat;
		background-size: contain;
		background-position: 50%;
		overflow: hidden;
		.img {
			width: 100%;
			height: 100%;
			border-radius: 20upx;
			background-size: 100% 100%;
		}
	}
::v-deep {
	uni-swiper .uni-swiper-dots-horizontal{
		display: none;
	}
}
</style>
