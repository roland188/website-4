<!-- 周年礼金 -->
<template>
	<view class="gift-container">
		<!-- <view class="gift-tip">
			温馨提示：如果您在周年礼金领取日开始之前累积未达到存款，将无法获得此优惠！
		</view>
		<view class="gift-tip">
			发放时间：首次存款日期开始，每满一整年满足要求后开始发放,请及时查看！
		</view> -->
		<Marquee :text="selfHelpItem.marquee" />
		<!-- 周勤奖励卡片 -->
		<view class="weekly-reward-container">
			<!-- 不显示tag -->
			<view class="tag-none" ></view>
			<view class="tag-content-ul">
				<view class="tag-content-li" v-for="(item,i) in list" :key="i">
					<view class="tag-num" :class="{colorRed:i===2}">{{item.giveTotalMoney}}</view>
					<text>{{item.text}}</text>
				</view>
			</view>
			<!-- 时间 -->
			<view class="tag-content-time" >
				<image class="time-img" src="../../image/time.png" mode="widthFix"></image>
				<text v-if="yearlyGiftVO && !yearlyGiftVO.firstDepositDate">{{timeText}}</text>
				<view v-if="yearlyGiftVO && yearlyGiftVO.countdown" class="count-down">
					<text>{{$t('距满年时间还有')}}</text>
					<uni-countdown :start="istart" :showColon="false" :day="daoTime.day" :hour="daoTime.hour" :minute="daoTime.minute" :second="daoTime.second"></uni-countdown> 
				</view>
				<!-- 有首存款但是领取时间不到 -->
			</view>
		</view>
		<!-- 按钮 -->
		<view class="box-btn">
			<view class="card-btn" :class="{'active-btn':yearlyGiftVO && yearlyGiftVO.status==1}" @tap="handleTapGetYear(yearlyGiftVO)">
				{{yearlyGiftVO && yearlyGiftVO.status ? btnTextList[yearlyGiftVO.status] :btnTextList[0]}}
			</view>
		</view>
	</view>
</template>

<script>
	import childStore from '../../utils/store.js'
	import {moment} from '../../utils/moment'
	import uniCountdown from './uni-countdown.vue'
	import Marquee from '../marquee/index.vue'
	export default {
		components: { Marquee },
		props:{
			typeTab:{
				type:Number,
				required: true,
				istart: false
			}
		},
		components:{uniCountdown},
		data() {
			return {
				timeText:this.$t('00天00时00分00秒'),
				btnTextList:[this.$t('未达到领取条件'),this.$t('领取'),this.$t('已领取')],
				daoTime:{},
				yearlyGiftVO:{},
				timeId:null,
				weeklyList:[
					{text:this.$t('第1次存款日'),giveTotalMoney:0,props:'firstDepositDate'},
					{text:this.$t('当前会员等级'),giveTotalMoney:'0.00',props:'levelName'},
					{text:this.$t('预发放周年礼金'),giveTotalMoney:'0.00',props:'amount'}],
			};
		},
		computed:{
			selfHelpItem(){
				return  childStore.state.selfHelpItem || {}
				
			},
			list(){
				try{
					// let list = [];
					let yearlyGiftVO = this.selfHelpItem.yearlyGiftVO
					this.yearlyGiftVO = yearlyGiftVO
					if(yearlyGiftVO){
						this.weeklyList.forEach((items,i)=>{
							if(yearlyGiftVO.hasOwnProperty(items.props)){
								let time = yearlyGiftVO[items.props] ? moment(new Date(yearlyGiftVO[items.props])).format('YYYY-MM-DD') : '00-00-00'
								items.giveTotalMoney = items.props ==='firstDepositDate' ? time : yearlyGiftVO[items.props] 
							}
						})
						 // countdown有值，说明有倒计时时间  无值说明倒时时间为0
						if(yearlyGiftVO && yearlyGiftVO.countdown){  //进来先判断一下时间渲染是为了避免一秒后渲染bug
							this.istart = true
							let mss = yearlyGiftVO.countdown;
							this.getCounDownTime(mss)
						} else {
							this.timeId = null
							this.istart = false
						} 
						if(!yearlyGiftVO.firstDepositDate){  //没有首存款
							this.daoTime = {};
							this.istart = false
						}
					}
					return this.weeklyList
				}catch(e){
					//TODO handle the exception
					return []
				}
				return []
				
			}
		},

		methods:{
			// 计算倒计时间
			getCounDownTime(mss){
				let day = parseInt(mss / (1000 * 60 * 60 * 24))
				let hour = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
				let minute = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
				let second = parseInt((mss % (1000 * 60)) / 1000)
				this.daoTime = {
					day,
					hour,
					minute,
					second,
					mss: mss,
				} 
			},
			// 点击按钮提交
			handleTapGetYear(items){
				if(items.status !== 1) return false
				this.$api.putReceive(this.selfHelpItem.id,(err,res)=>{
					if(err) return false
					if(res){
						uni.showToast({
							icon:'success',
							title:this.$t('领取成功')
						})
						// uni.$emit('handleUpdata',7)
						this._getThematicActivitiesByApp(this.selfHelpItem.id)
					}
				},false)
			},
			
			// 数据处理所有
			_getThematicActivitiesByApp(id){
				this.$api.getThematicActivitiesByApp(id,(err,res)=>{
					if(err) return 
					if(res){
						childStore.commit('setSelfHelpItem',res)
						// this.setSelfHelpItem(res)
					}
				})
			},
		},
		
	}
</script>

<style lang="scss" scoped>
.gift-container{
	padding: 20upx 30upx;
	padding-bottom: 160upx;
}
.gift-tip{
	font-size: 24upx;
    font-weight: 500;
    color: var(--themeBtnBg);
    margin-bottom: 22upx;
}
.weekly-reward-container{
	padding: 0 24upx;
	box-sizing: border-box;
	background: #fff;
	border-radius: 16upx;
}
.box-btn{
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	z-index: 1;
	background-color: #fff;
	padding: 34upx 32upx ;
	box-sizing: border-box;
}
.card-btn{
	color: #fff;
	background: #d2d2d2;
	box-shadow: 0 3px 6px #d2d2d2;
	border-radius: 8upx;
	text-align: center;
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	font-size: 28upx;
	&.active-btn{
		background-color: var(--themeBtnBg);
		color: #fff;
	}
}
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
		font-size: 22upx;
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
		display: flex;
		width: 100%;
		height: 68upx;
		align-items: center;
		font-size: 24upx;
		color: #aaa;
	}
	.count-down{
		display: flex;
		height: 68upx;
		align-items: center;
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
	::v-deep .uni-countdown__number{
		width: 36upx;
	}
</style>
