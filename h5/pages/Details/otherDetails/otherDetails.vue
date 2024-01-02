<template>
	<view style="background-color: var(--separator);height: 100%;overflow: hidden;">
		<cu-custom style="background-color: #ffffff;" :isBack="true" :leftUrl="leftUrl">
			<block slot="backText"></block>
			<block slot="content">{{ $t('详情记录') }}</block>
		</cu-custom>
		<view class="header">
			<view class="amount recordTextOne">
				<i>{{ $config.currency }}</i>
				<text class="recordTextOne">{{amount}}</text>
			</view>
			<view class="flexLayout headerHeight">
				<text class="leftText">{{ $t('订单编号') }}</text>
				<view class="orderNo">
					<text class="recordTextOne">{{ orderNo }}</text>
					<i @click="copy" :style="{backgroundImage:'url(/static/image/xf/copy.png)'}"></i>
				</view>
			</view>
		</view>
		<view class="flexLayout upDown">
			<view>
				<text class="leftText">{{ $t('交易时间') }}</text>
				<text class="recordTextOne">{{time}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('金额') }}</text>
				<text class="recordTextOne">{{amount}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('状态') }}</text>
				<text class="recordTextOne">{{state}}</text>
			</view>
			<view>
				<text class="leftText">{{ $t('类型') }}</text>
				<text class="recordTextOne">{{payment}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			leftUrl:'../../other/other?id=1',
			orderNo: '', //订单编号
			time:'',//交易时间
			payment:'',//支付方式
			amount:'',//金额
			state:'',//状态
			status:'',
		};
	},
	methods: {
		copy() {
			let self = this
			uni.setClipboardData({
				data: this.orderNo,
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
	onLoad(item){
		let data = JSON.parse(item.data);
		this.status = data.status
		this.orderNo = data.orderNo
		this.time = data.createdAt
		this.amount = this.$common.setNumFixed(data.amount,2);
		switch (data.type) {
			case 6:
				this.payment = this.$t('线下入款优惠')
				break
			case 7:
				this.payment = this.$t('线上入款优惠')
				break
			case 11:
				this.payment = this.$t('手动上分')
				break
			case 12:
				this.payment = this.$t('手动存款优惠上分')
				break
			case 13:
				this.payment = this.$t('手动返水优惠上分')
				break
			case 14:
				this.payment = this.$t('手动活动优惠上分')
				break
			case 15:
				this.payment = this.$t('自动活动优惠上分')
				break
			case 20:
				this.payment = this.$t('手动下分-存款')
				break
			case 21:
				this.payment = this.$t('手动下分-优惠活动')
				break
			case 22:
				this.payment = this.$t('手动下分-人工存款反水')
				break
			case 23:
				this.payment = this.$t('手动下分-存款优惠')
				break
            case 25:
            	this.payment = this.$t('手动上分-优惠活动')
            	break
            case 26:
            	this.payment = this.$t('手动上分-人工存款返水')
            	break
            case 27:
            	this.payment = this.$t('手动上分-存款优惠')
            	break
            case 28:
            	this.payment = this.$t('手动上分-其他')
            	break
			case 31:
				this.payment = this.$t('手动上分彩金')
				break
			case 32:
				this.payment = this.$t('活动上分彩金')
				break
			case 33:
				this.payment = this.$t('手动上分彩金-人工存款返水')
				break
			case 34:
				this.payment = this.$t('手动上分彩金-存款优惠')
				break
			case 35:
				this.payment = this.$t('手动上分彩金-优惠活动')
				break
			case 36:
				this.payment = this.$t('手动上分-其他彩金')
				break
			case 42:
				this.payment = this.$t('数值货币优惠上分')
				break
			case 44:
				this.payment = this.$t('救济金上分')
				break
			case 45:
				this.payment = this.$t('救济金彩金')
				break
			case 46:
				this.payment = this.$t('每日签到上分')
				break
            case 50:
                this.payment = this.$t('全民返利')
                break
            case 51:
                this.payment = this.$t('利息宝存入')
                break
            case 52:
                this.payment = this.$t('利息宝本金提取')
                break
            case 53:
                this.payment = this.$t('利息宝利息提取')
                break
			case 99:
				this.payment = this.$t('其他')
				break
			case 62:
				this.payment = this.$t('信息认证');
				break;
			case 63:
				this.payment = this.$t('周勤奖励');
				break;
			case 64:
				this.payment = this.$t('幸运注单');
				break;
			case 65:
				this.payment = this.$t('周年礼金');
				break;
			case 66:
				this.payment = this.$t('棋牌奖励');
				break;
			case 67:
				this.payment = this.$t('棋牌救援');
				break;
			case 68:
				this.payment = this.$t('千倍百倍');
				break;
			case 69:
				this.payment = this.$t('亿元回馈')
				break;
			case 70:
				this.payment = this.$t('大转盘');
				break;
			case 73:
				this.payment = this.$t('站内活动');
				break;
		}
		if(data.type === 42){
			switch(data.status){
				case 0:
					this.state = this.$t('未处理')
					break;
				case 1:
				case 5:
				case 6:
				case 7:
					this.state = this.$t('处理中')
					break;
				case 2:
					this.state = this.$t('出款成功')
					break;
				case 3:
					this.state = this.$t('出款失败')
					break;
				case 4:
					this.state = this.$t('关闭')
					break;
			}
		}else{
			switch(data.status){
				case 0:
					this.state = this.$t('待领取')
					break;
				case 1:
					this.state = this.$t('已过期')
					break;
				case 2:
					this.state = this.$t('成功')
					break;
				case 3:
					this.state = this.$t('失败')
					break;
			}
		}
		
	}
};
</script>

<style>
@import url('../GameDetails/GameDetails.css');
</style>
