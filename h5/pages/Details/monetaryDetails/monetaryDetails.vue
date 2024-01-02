<!-- 这是游戏记录详情 -->
<template>
	<view style="background-color: #ffffff;height: 100%;overflow: hidden;">
		<cu-custom style="background-color: var(--separator);" :isBack="true" :leftUrl="leftUrl">
			<block slot="backText"></block>
			<block slot="content">{{ $t('详情记录') }}</block>
		</cu-custom>
		<view class="header">
			<view class="amount recordTextOne">
				<i>{{ $config.currency }}</i>
				<text class="recordTextOne">{{paragraphAmount}}</text>
			</view>
			<view class="flexLayout" style="height: 104rpx;line-height: 104rpx;padding: 0 30rpx;">
				<text class="leftText">{{ $t('订单编号') }}</text>
				<view class="orderNo">
					<text class="recordTextOne">{{ betNo }}</text>
					<i @click="copy" :style="{backgroundImage:'url(/static/image/xf/copy.png)'}"></i>
				</view>
			</view>
		</view>
		<view class="flexLayout upDown" style="margin: 0;">
			<view>
				<text class="leftText">{{ $t('交易币种') }}</text>
				<text class="recordTextOne">{{currency}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('链名称') }}</text>
				<text class="recordTextOne">{{digitLink}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('币种金额') }}</text>
				<text class="recordTextOne">{{currencyAmount}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('交易汇率') }}</text>
				<text class="recordTextOne">{{exchange}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('入款金额') }}</text>
				<text class="recordTextOne">{{paragraphAmount}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('充值状态') }}</text>
				<text class="recordTextOne">{{state}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('充值时间') }}</text>
				<text class="recordTextOne">{{time}}</text>
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
			currency:'',
			digitLink:'',
			currencyAmount:'',
			exchange:'',
			paragraphAmount:'',
			state:'',
			time:'',
		};
	},
	methods: {
		copy() {
			uni.setClipboardData({
				data: this.betNo,
				success: function(success) {
					uni.showToast({
						title: this.$t('复制成功'),
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
	onLoad(data){
		this.$api.appDigitPayDetail(
			data.currency,
			(err, res) => {
				if (res) {
					this.betNo = res.orderNo;//订单号
					this.currency = res.digitCcy;//币种
					this.currencyAmount = res.digitCount;//币种金额
					this.exchange = res.digitRate;//汇率
					this.paragraphAmount = res.amount;//入款金额
					this.digitLink = res.digitLink
					this.state = this.$t('成功');//状态
					this.time = this.conversionTime(res.createdAt)//时间
				}
			},
			true
		);
	}
};
</script>

<style>
@import url('../GameDetails/GameDetails.css');
</style>
