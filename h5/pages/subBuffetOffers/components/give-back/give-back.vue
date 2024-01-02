<!-- 亿元回馈 -->
<template>
	<view>
	<view class="give-container">
		<Marquee :text="selfHelpItem.marquee" />
		<view class="give-none" v-if="!giveBackList.length">{{$t('-暂无记录-')}}</view>
		<view class="give-content" v-if="giveBackList.length">
			<view class="give-items" v-for="(items,i) in giveBackList" :key="i" >
				<!-- 开始和结束时间 -->
				<view class="give-time">
					<view class="give-start give-box">
						<text class="coloraa">
							{{$t('开始时间')}}
						</text>
						<view class="color32">
							{{items.checkTimeStart}}
						</view>
						<!-- <view class="lucky-radio" :class="{'active-img': flag}"></view> -->
					</view>
					<view class="give-start">
						<text class="coloraa">{{$t('结束时间')}}</text>
						<view class="color32">
							{{items.checkTimeStop}}
						</view>
					</view>
				</view>
				<!-- 出款流水、盈亏总额、奖励金额 -->
				<view class="give-row">
					<view class="give-col">
						<text class="coloraa">{{$t('流水倍数')}}</text>
						<view class="color32">
							{{items.audit}}
							<text>{{$t('倍')}}</text>
						</view>
					</view>
					<view class="give-col">
						<text class="coloraa">{{$t('盈亏总额')}}</text>
						<view class="color32">
							{{items.amountRwLoss}}
						</view>
					</view>
					<view class="give-col">
						<text class="coloraa">{{$t('奖励金额')}}</text>
						<view class="color32">
							{{items.amountReward}}
						</view>
					</view>
				</view>
				<view class="timelimit">·
					<image class="time-img" src="../../image/time.png"></image>
					<view class="actimes">{{$t('剩余领取时间：')}} {{ items.remainTime  }}</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="tip">{{$t('温馨提示')}}</view>
			<view class="text" v-if="$config.projectImgUrl == 'amxpj'">
				{{$t('1.《亿元回馈》分三期，结算区间为每月1日-9日、10日-19日、20日-29日，对应派彩时间每月10日、20日、30日；')}}
				{{$t('2.亏损或盈利：存款-取款；')}}
				{{$t('3.《亿元回馈》彩金无需申请，请前往会员中心自助领取，派发时间10日、20日、30日北京时间当天03:00之后派送；')}}
				{{$t('4.活动彩金一倍流水即可取款；')}}
				{{$t('5.参与该优惠即表示您同意《优惠规则与条款》。')}}
			</view>
			<view class="text" v-else>
				{{$t('1.活动对象：所有普通VIP及以上的会员。')}}
				{{$t('2.所获礼金1倍流水出款。')}}
				{{$t('3.领取时间：每月1日，11日，21日，即可领取。')}}
				{{$t('4.此活动可以所有优惠同时共享。')}}
				<!-- {{$t('5.所有客户只能拥有一个账号：同一个IP，同一个存/提款卡，同一个手机号码，同一个邮箱都承认同一个客户，如果发现同一个拥有两个或以上的账户，重复的账户将会被冻结，保留索回重复账户的奖励及盈利的权利。')}}
				{{$t('6.参与该优惠，即表示您同意《优惠规则与条款》')}} -->
			</view>
		</view>
	</view>
	<view class="btn-box" @tap="handleTapBtn" v-show="giveBackList.filter(el => el.status === 0).length">
			<view class="btn" :class="{'active': giveBackList.length}">{{$t('领取奖励')}}</view>
		</view>
	</view>
</template>

<script>
	import childStore from '../../utils/store.js'
	import Marquee from '../marquee/index.vue'
	import {
		moment
	} from '../../utils/moment.js'
	export default {
		name: 'giveback',
		components: { Marquee },
		data() {
			return {
				getIdList:[],
				recordsNumberList:[],
				recordsNumber: '',
				flag: false,
				received:false,
				status:3 //可以领取
			};
		},
		mounted() {
			this.getIdList = []
		},
		computed:{
			selfHelpItem(){
				return  childStore.state.selfHelpItem || {}
			},
			giveBackList(){ 
				let receivedList = this.selfHelpItem.compensationVO ? this.selfHelpItem.compensationVO.receivedList : []
				try{
					receivedList.forEach(el => {
						el.checkTimeStart = el.checkTimeStart ? moment(new Date(el.checkTimeStart)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')
						el.checkTimeStop = el.checkTimeStop ? moment(new Date(el.checkTimeStop)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')
						el.remainTime = this.formatSeconds(el.remainTime)
					})
				}catch(e){
					//TODO handle the exception
				}
				return receivedList
			}
		},
		methods:{
			// 领取礼金
			handleTapBtn(){
				let temp = []
				this.giveBackList.forEach(el => {
					if(el.status === 0) temp.push(encodeURIComponent(el.recordsNumber))
				})
				if(!temp.length) return
				this.$api.putReceive(this.selfHelpItem.id,temp.join(','),(err,res)=>{
					if(res){
						uni.showToast({
							icon:'none',
							title:this.$t('领取成功')
						})
						this.status = 3
						// uni.$emit('handleUpdata',11)
						this._getThematicActivitiesByApp(this.selfHelpItem.id)
					}
				},false)
			},
			formatSeconds(value) {
				if(value === -1) return '已过期'
				if(!value) return '00:00:00'
				var secondTime = parseInt(value) // 秒
				var minuteTime = 0 // 分
				var hourTime = 0 // 小时
				var result = ''
				if (value < 60) {
					result = secondTime
				} else {
					if (secondTime >= 60) { // 如果秒数大于60，将秒数转换成整数
						// 获取分钟，除以60取整数，得到整数分钟
						minuteTime = parseInt(secondTime / 60)
						// 获取秒数，秒数取佘，得到整数秒数
						secondTime = parseInt(secondTime % 60)
						// 如果分钟大于60，将分钟转换成小时
						if (minuteTime >= 60) {
							// 获取小时，获取分钟除以60，得到整数小时
							hourTime = parseInt(minuteTime / 60)
							// 获取小时后取佘的分，获取分钟除以60取佘的分
							minuteTime = parseInt(minuteTime % 60)
						}
					}
					secondTime = parseInt(secondTime) >= 10 ? secondTime : '0' + secondTime
					minuteTime = parseInt(minuteTime) >= 10 ? minuteTime : '0' + minuteTime
					hourTime = parseInt(hourTime) >= 10 ? hourTime : '0' + hourTime
					result = hourTime + ':' + minuteTime + ':' + secondTime
				}
				return result
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
			// 点击激活
			handleTapGive(items){
				// 判断有相同的值不加入数组
				this.flag = !this.flag
				this.status = items.status
				this.recordsNumber = items.recordsNumber
				// 判断有相同的值不加入数组
				// if(this.getIdList.includes(items.id)) return false
				// this.getIdList.push(items.id)
				// this.recordsNumberList.push(items.recordsNumber)
			},
		}
	}
</script>

<style lang="scss" scoped>
.timelimit{
	display: flex;
	align-items: center;
	padding: 20upx 0;
	color: #b0b0b0;
	.time-img{
		width: 30upx;
		height: 30upx;
		margin-right: 20upx;
	}
}
	.give-container{
		background: #f7f7f7;
		padding: 32upx;
	}
	.give-none{
		color: #999;
		text-align: center;
		margin: 32upx;
		font-size: 28upx;
	}
	.content{
		margin-top: 34upx
	}
	.tip{
		color: #e91919;
		font-size: 28upx;
	}
	.text{
		color: #999;
		font-size: 26upx;
		white-space: pre-line;
		line-height: 2;
		margin-top: 22upx;
		margin-bottom: 110upx;
	}
	.btn-box{
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 1;
		background-color: #fff;
		padding: 34upx 32upx ;
		box-sizing: border-box;
	}
	.btn{
		color: #fff;
		background: #d2d2d2;
		box-shadow: 0 3px 6px #d2d2d2;
		border-radius: 8upx;
		text-align: center;
		// line-height: 3;
		// position: fixed;
		// bottom: 20upx;
		width: 80%;
		height: 80upx;
		line-height: 80upx;
		// left: 10%;
		font-size: 28upx;
		margin: 0 auto;
		&.active{
			background-color: var(--themeBtnBg);
			color: #fff;
		}
	}
	.give-content{
	
	}
	.give-items{
		// margin: 20upx;
		padding: 0 30upx 0 30upx;
		background-color: #fff;
		font-size: 22upx;
		border-radius: 16upx;
		margin-bottom: 20upx;
	}
	.give-time{
		display: flex;
		justify-content: space-around;
		height: 110upx;
		align-items: center;
		border-bottom: 1upx solid #f2f2f2;
	}
	.give-start{
		wdith: 50%;
		text-align: center;
	}
	.give-row{
		display: flex;
		justify-content: space-between;
		height: 130upx;
		width: 100%;
		align-items: center;
		border-bottom:  1upx solid #f2f2f2;
		// margin-bottom: 50upx;
	}
	.give-col{
		text-align: center;
	}
	.give-box{
		position: relative;
	}
	.lucky-radio{
		width: 32upx;
		height: 32upx;
		background-color: #F2F2F2;
		border: 2upx solid #efeded;
		border-radius: 100%;
		vertical-align: bottom;
		margin-right: 20upx;
		margin-top: 4upx;
		position: absolute;
		top: -4upx;
		left: -80upx;
		&.active-img{
			background: url(../../image/lucky-right.png) no-repeat;
			background-size: 100% 100%;
			border: none;
		}
	}
</style>
