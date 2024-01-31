<template>
	<view class="tag-title">
		<view class="tag-title-left">
			<text v-if="type" class="themeDisableColor">{{$t('日期')}}：</text>{{tagContent.titleLeft}}
			<view class="tag-title-bottom" v-if="tagContent.titleBottomText">{{tagContent.titleBottomText}}{{ $t('元') }}</view>
		</view>
		<view class="tag-title-img" @tap="handleShow">
			<image v-if="tagContent.isShowImg" class="img" src="../image/right.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import i18n from "@/i18n"
	export default {
		name: 'tagTitle',
		props:{
			tagContent:{
				type:Object,
				default:()=>{
					return {
						titleLeft: i18n.$t('上周周勤'),
						isShowImg: false,
						titleBottomText: ''
					}
				}
			},
			// 类型如 周年礼金、棋牌奖励、棋牌救援等等
			type:{
				type:String,
				default: ''
			},
		},
		data() {
			return {};
		},
		mounted () {
		  
		},
		methods:{
			handleShow(){
				if(this.tagContent.isShowImg){
					uni.$emit('handleShowOpen',{postition:'right',popupHeaderText:this.tagContent.titleLeft})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.tag-title{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 34upx 10upx;
	height: 46upx;
	font-size: 30upx;
	font-weight: 700;
	color: #323233;
	border-bottom: 2upx solid #f7f7f7;
}
.tag-title-img{
	width: 30%;
	text-align: right;
	.img{
		width: 16upx;
		height: 32upx;
		background-size: 100% 100%;
		vertical-align: middle;
	}
}
.tag-title-bottom{
	font-size: 22upx;
	line-height: 34upx;
	color: #aaa;
	font-weight: 400;
}
</style>
