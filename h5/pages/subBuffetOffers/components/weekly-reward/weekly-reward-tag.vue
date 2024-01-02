<!-- 上周数据 -->
<template>
	<view class="weekly-reward-container" :class="{padding30:!isTagContent}">
		<!-- 不显示tag -->
		<view v-if="isTagContent">
			<view class="tag-none" v-if="!isShowTag"></view>
			<tag-title v-else :type="type" :tagContent="tagContent"></tag-title>
		</view>
		<view class="tag-content-ul" :class="{margin30:type==='1'}">
			<view class="tag-content-li" v-for="(item,i) in weeklyList" :key="i">
				<view class="tag-num" :class="{colorRed:i===2,fontNone:type==='1'}">{{item.totalMoney}}</view>
				<text>{{item.text}}</text>
			</view>
		</view>
		<!-- 时间 -->
		<view class="tag-content-time" :class="{timeHeight:isTimeUp && !type}">
			<image class="time-img" src="../../image/time.png" mode="widthFix"></image>
			<text v-if="timeText" :class="{active:isTimeUp}">{{timeText}}<text v-if="type==='1' || type==='2'" class="themeDisableColor">{{$t('领取')}}</text></text>
			<slot name="down"></slot>
		</view>
	</view>
</template>

<script>
	import tagTitle from '../tag-title.vue'
	export default {
		components:{
			tagTitle
		},
		props:{
			timeText:{
				type:String,
				default: ''
			},
			weeklyList:{
				type:Array,
				default:()=>[]
			},
			isShowTag:{
				type:Boolean,
				default:true
			},
			isTimeUp:{
				type:Boolean,
				default:false
			},
			// 类型如 周年礼金、棋牌奖励、棋牌救援等等
			type:{
				type:String,
				default: ''
			},
			tagContent:{
				type:Object,
				default:()=> {}
			},
			isTagContent:{
				type:Boolean,
				default:true
			},
			daoTime:{
				type:Object,
				default:()=>{}
			}
		},
		data() {
			return {
			};
		}
	}
</script>

<style lang="scss" scoped>
	.tag-content-ul{
		display: flex;
		border-bottom: 2upx solid #f7f7f7;
		padding: 16upx 0 34upx;
		color: #aaa;
		font-size: 24upx;
	}
	.padding30{
		padding-top: 20upx !important;
	}
	.margin30{
		margin-top: 30upx;
	}
	.tag-content-li{
		flex: 1;
		text-align: center;
	}
	.tag-num{
		font-size: 38upx;
		font-weight: 700;
		font-family: DIN;
		line-height:38upx;
		color: #323233;
		margin-bottom: 10px;
	}
	.fontNone{
		font-weight: 300;
		font-size: 34upx;
		line-height: 20upx;
	}
	.colorRed{
		color: var(--themeBtnBg);
	}
	.tag-content-time{
		// line-height: 68upx;
		display: flex;
		align-items: center;
		height: 68upx;
		font-size: 22upx;
		color: #aaa;
	}
	.time-img{
		width: 24upx;
		height: 24upx;
		margin-right: 8upx;
		vertical-align: middle;
	}
	.tag-none{
		height: 60upx;
		border-bottom: 2upx solid #f7f7f7;
		margin-bottom: 20upx;
	}
	.active{
		color: #333;
		font-weight: 600;
	}
	.timeHeight{
		line-height: 100upx;
		height: 100upx;
	}
</style>
