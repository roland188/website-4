<!-- 这是游戏记录详情 -->
<template>
	<view style="background-color: var(--separator);height: 100%;">
		<cu-custom style="background-color: #ffffff;" :isBack="true" :leftUrl="leftUrl">
			<block slot="backText"></block>
			<block slot="content">{{ $t('详情记录') }}</block>
		</cu-custom>
		<view class="header">
			<view class="amount">
				<i v-if="smallBetAmount==0">{{ $t('待结算') }}</i>
				<i v-if="smallBetAmount==1">{{ $t('已结算') }}</i>
				<!-- <text class="recordTextOne">{{ $config.currency }}{{betAmount.toFixed(2)}}</text> -->
			</view>
			<view class="flexLayout headerHeight">
				<text class="leftText">{{ $t('订单编号') }}</text>
				<view class="orderNo">
					<text class="recordTextOne">{{ betNo }}</text>
					<i @click="copy" :style="{backgroundImage:'url(/static/image/xf/copy.png)'}"></i>
					<!-- <i @click="copy"></i> -->
				</view>
			</view>
		</view>
		<view class="flexLayout upDown">
			<view>
				<text class="leftText">{{ $t('游戏平台') }}</text>
				<text class="recordTextOne">{{vendorName}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('游戏名称') }}</text>
				<text class="recordTextOne">{{gameName}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('投注金额') }}</text>
				<text class="recordTextOne">{{ $config.currency }}{{betAmount}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('有效金额') }}</text>
				<text class="recordTextOne">{{ $config.currency }}{{betAmountValid}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('有效投注') }}</text>
				<text class="recordTextOne" v-if="smallBetAmount==1">{{ $config.currency }}{{betAmountValid}}</text>
				<text class="recordTextOne" v-else>--</text>
			</view>
			<view>
				<text class="leftText">{{ $t('派奖金额') }}</text>
				<text class="recordTextOne" v-if="smallBetAmount==1">{{ $config.currency }}{{payoff}}</text>
				<text class="recordTextOne" v-else>--</text>
			</view>
			<view>
				<text class="leftText">{{ $t('盈亏金额') }}</text>
				<text class="recordTextOne" v-if="smallBetAmount==1">{{ $config.currency }}{{winLoss}}</text>
				<text class="recordTextOne" v-else>--</text>
			</view>
			<view>
				<text class="leftText">{{ $t('投注时间') }}</text>
				<text class="recordTextOne">{{betTime}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('派奖时间') }}</text>
				<text class="recordTextOne" v-if="smallBetAmount==1">{{payoutTime}}</text>
					<text class="recordTextOne" v-else> </text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			leftUrl:'../../gameRecord/gameRecord?id=1',
			betNo: '', //订单编号
			gameName: '',
			vendorName: '',
            smallBetAmount:'',
			betAmount: '',
			betAmountValid: '',
			betAmountValid: '', // 有效投注
			payoff: '', // 派奖金额
			winLoss: '', // 盈亏金额
			betTime: '', // 投注时间
			payoutTime: '' // 派奖时间
		};
	},
	methods: {
		copy() {
			const self = this
			uni.setClipboardData({
				data: this.betNo,
				success: function(success) {
					uni.showToast({
						title: self.$t('复制成功'),
						icon:'none',
						duration: 2000
					});
				}
			});
		},
		conversionTime(timeStamp) {
			if(timeStamp > 0){
			        var date = new Date();  
			        date.setTime(timeStamp);  
			        var y = date.getFullYear();      
			        var m = date.getMonth() + 1;      
			        m = m < 10 ? ('0' + m) : m;      
			        var d = date.getDate();      
			        d = d < 10 ? ('0' + d) : d;      
			        var h = date.getHours();    
			        h = h < 10 ? ('0' + h) : h;
			        var minute = date.getMinutes();
			        var second = date.getSeconds();
			        minute = minute < 10 ? ('0' + minute) : minute;      
			        second = second < 10 ? ('0' + second) : second;     
			        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;       
			    }else{
			        return "";
			    }
		},
	},
	onLoad(detailsId){
		detailsId.id = (detailsId.id).replace(/#/g, '%23');   
		this.$api.queryBetRecordsById(
			detailsId.id,
			(err, res) => {
				if (res) {
					this.betNo = res.betNo;
					this.gameName = res.gameName;
					this.vendorName = res.vendorName;
                    this.smallBetAmount = res.status;
					this.betAmount = res.betAmount;
					this.betAmountValid = res.betAmountValid;
					this.betAmountValid = res.betAmountValid;
					this.payoff = res.payoff;
					this.winLoss = res.winLoss;
					this.betTime = this.conversionTime(res.betTime)
                    this.payoutTime = this.conversionTime(res.payoutTime);
				}
			},
			true
		);
	}
};
</script>

<style>
@import url('./GameDetails.css');
</style>
