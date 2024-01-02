<template>
	<view class="info-list">
		<!-- 图标和文本 -->
		<view class="info-list-left">
			<view class="info-img-box">
				<image class="info-img" src="../../image/info-list.png" mode=""></image>
			</view>
			<view class="info-text">
				<view>{{items.title}}</view>
				<text class="color99">{{items.text}}</text>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="info-list-right">
			<text v-if="items.flag" class="themeDisableColor">{{$t('已完成')}}</text>
			<view v-else class="info-list-btn" @tap="handleTap(items)">{{items.btnTxt}}</view>
		</view>
	</view>
</template>

<script>
	import childStore from '../../utils/store.js'
	export default {
		props:{
			items:{
				type:Object,
				defalut:()=>{}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			handleTap(items){
				if(items.conditionCode==='deposit'){
					childStore.commit('setPageCode','deposit')
					uni.navigateTo({
						url: "/pages/recharge/recharge",
					});
					// if(this.$config.theme == 'a023' || this.$config.theme == 'a024'){
					// 	uni.navigateTo({
					// 		url: "/pages/recharge/recharge",
					// 	});
					// }else{
					// 	// 腾博会
					// 	uni.switchTab({
					// 		url: '/pages/deposit/deposit'
					// 	})
					// }
	
				}else {
					uni.navigateTo({
						url: items.href
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.info-list{
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 154upx;
	background-color: #fff;
	border-bottom: 1px solid #f7f7f7;
}
.info-list-left{
	display: flex;
}
.info-img-box{
	width: 80upx;
	height: 80upx;
	overflow: hidden;
	vertical-align: middle;
	margin-right: 20upx;
	.info-img{
		width: 100%;
		height: 100%;
		background-size: 100% 100%;
		vertical-align: middle;
	}
}
.info-text{
	font-size: 26upx;
	margin-top: 8upx;
}
.info-list-right{
	width: 170upx;
	text-align: center;
	font-size: 28upx;
}
.info-list-btn{
	width: 100%;
	height: 76upx;
	line-height: 76upx;
	color: #FFFFFF;
	background-color: var(--themeBtnBg);
	border-radius: 40upx;
}
.color99{
	color: #999;
	font-size: 24upx;
}
</style>
