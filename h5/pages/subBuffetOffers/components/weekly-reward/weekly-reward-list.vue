<template>
	<view class="weekly-reward-container margin-top">
		<tagTitle :tagContent="tagContent"></tagTitle>
		<view class="list">
			<!-- 标题 -->
			<view v-if="isShowPopup" class="list-title">
				{{isBen ? $t('本') : $t('上')}}{{$t('周已出勤')}}<text class="num">{{thisObj ? thisObj.totalSignCount : ''}}</text>
				{{$t('天')}},{{$t('累计有效投注')}}<text class="num">{{thisObj.totalBetAmountValid ? thisObj.totalBetAmountValid.toFixed(2) : '0.00'}}</text>{{$t('元')}}</view>
			<!-- 列表 -->
			<view class="list-ul">
				<view class="list-li" v-for="(items,i) in list" :key="i">
						<image class="list-img" :src="!items.status ? '../image/close.png': '../image/gou.png' " mode="widthFix"></image>
					<view class="list-row">
						<view class="list-left">
							<!-- week -->
							<view class="list-week">{{items.week}}</view>
							<view>{{$t('已投注')}}<text class="num">{{items.betAmountValid ? items.betAmountValid.toFixed(2) : '0.00'}}</text>{{$t('元')}}</view>
						</view>
						<view class="list-right">{{items.status === 0 ? $t('未完成') : $t('已完成')}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tagTitle from '../tag-title.vue'
	import i18n from "@/i18n"
	export default {
		components:{
			tagTitle
		},
		props:{
			// 控制显示弹窗文本和图标
			isShowPopup:{
				type: Boolean,
				default: false
			},
			isBen:{
				type: Boolean,
				default: false
			},
			list:{
				type:Array,
				default:()=>[]
			},
			thisObj:{
				type:Object,
				default:()=>{
					return {
						totalSignCount: 0,
						totalBetAmountValid:0,
					}
				}
			},
			tagContent:{
				type:Object,
				default:()=>{
				  return {
					  titleLeft:i18n.$t('本周周勤'),
					  titleBottomText: i18n.$t('累计有效投注0.00')
				  }
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.margin-top{
	margin:20upx 0 10upx 0;
}
.list{
	font-size: 24upx;
	line-height: 36upx;
	color: #aaa;
	padding:16upx 0 10upx;
}
.num{
	color:#323233;
}
.list-li{
	border-left: 2upx solid #f7f7f7;
	padding-left: 28upx;
	box-sizing: border-box;
	height: 132upx;
	position: relative;
	&:last-child{
		border-left:0
	}
}
.list-img{
	position: absolute;
	left: -14upx;
	top: 22upx;
	width: 26upx;
	height: 26upx;
}
.list-row{
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 80upx;
	padding: 16upx 0 26upx;
	border-bottom: 2upx solid #f7f7f7;
}
.list-week{
	font-size: 28upx;
	line-height: 38upx;
	color: #55555f;
	margin-bottom: 10upx;
}
.list-right{
	background: #fff;
	border: 2upx solid var(--themeBtnBg);
	opacity: .5;
	color: var(--themeBtnBg);
	padding: 6upx 10upx;
	border-radius: 28px;
	box-sizing: border-box;
	text-align: center;
}
</style>
