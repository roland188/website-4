<!-- 这是游戏记录 -->
<template>
	<view style="height:100%;overflow: hidden;">
		<cu-custom style="background-color: #ffffff;" :isBack="true" :leftUrl="leftUrl" :rightId="rightId" @show="show">
			<block slot="backText"></block>
			<block slot="content">{{ $t('游戏记录') }}</block>
			<block slot="right" v-if="!screeingShow">{{ $t('筛选') }}</block>
		</cu-custom>
		<view class="combined" v-if="topsVal">
			<view class="combinedOne">
				<view>{{ $t('总投注') }}：{{ $config.currency }}{{totalBet}}</view>
				<view>{{ $t('总有效投注') }}：{{ $config.currency }}{{effective}}</view>
			</view>
			<view class="combinedTwo">
				<view>{{ $t('总派彩') }}：{{ $config.currency }}{{distributed}}</view>
				<view>{{ $t('总盈亏金额') }}：{{ $config.currency }}{{profit}}</view>
			</view>
		</view>
		<re-Cord ref="changeData" :parameters="parameterData" :tops="topsVal" @tops="tops"></re-Cord>
		<view class="screening" :class="{screeningShowStyle:screeingShow}" :style="{'margin-top':top+'rpx'}">
			<view class="screeingContent">
				<screen-Ing :screeingId="value" @show="show"></screen-Ing>
			</view>
		</view>
	</view>
</template>

<script>
import reCord from '@/components/record/record.vue';
import screenIng from '@/components/screening/screening.vue';
export default {
	components: { reCord ,screenIng},
	data() {
		return {
			tabbarId:0,
			value: '',
			leftUrl:'../report/report',
			rightId:'GameScreening',
			parameterData: {},
			topsVal:false,
			totalBet:'',//总投注
			effective:'',//有效投注
			distributed:'',//派彩
			profit:'',//盈亏
			screeingShow:'',
            top:0,
		};
	},
	onLoad(val) {
		if (val.id) {
			this.value = val.id;
		}
        // #ifdef APP-PLUS
            this.top = 70
        // #endif
	},
	mounted() {
		this.$refs.changeData.change(this.value);
	},
	methods:{
		//头部传过来的值，是否弹出筛选页面
		show(showId,parameter,data){
			this.screeingShow = showId
			if(showId){
				//筛选弹出 让后退按钮变为隐藏，而非路径
				this.leftUrl = 'hidden'
			}else{
				if(parameter == 'parameter'){
					this.parameterData = data
					this.$refs.changeData.change(this.value,'','',data);
				}
				switch(this.rightId){
					case 'GameScreening':
						this.leftUrl = '../report/report'
					break;
				}
			}
		},
		tops(isTrue,res){
			this.topsVal = isTrue
			if(res){
				this.totalBet = this.$common.setNumFixed(Math.abs(res.totalBetAmount),2);
				this.effective = this.$common.setNumFixed(res.totalBetAmountValid,2)
				this.distributed = this.$common.setNumFixed(res.totalPayoff,2)
				this.profit = this.$common.setNumFixed(this.distributed - this.totalBet,2)
			}
		}
	}
};
</script>

<style>
page {
	position: relative;
	width: auto;
	height: 100%;
	background-color: #ffffff;
	box-sizing: border-box;
	overflow: hidden;
	border-top: 2rpx solid var(--separator);
}
.combined{
	width: 100%;
	background: #f7f7f7;
	height: 200rpx;
    /* margin-top: 100rpx; */
}
.combinedOne,.combinedTwo{
	display: flex;
	margin-left: 30rpx;
	flex-direction: column;
}
.combinedOne view,.combinedTwo view{
	margin-right: 50rpx;
	font-size: 12px;
	color: var(--textTwo);
}
.combinedOne view{
	margin-top: 16rpx;
}
.combinedTwo view{
	margin-bottom: 16rpx;
}
.screening{
	display: none;
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	background:rgba(0,0,0,0.3);
	top: 90rpx;
	z-index: 999;
}
.screeingContent{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 70%;
	background-color: #fff;
}
.screeningShowStyle{
	display: inline-block;
}
</style>
