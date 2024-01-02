<!-- 千百百倍 -->
<template>
	<view class="give-container">
		<Marquee :text="selfHelpItem.marquee" />
		<view class="give-none" v-if="luckyList.length===0">-{{$t('暂无中奖记录')}}-</view>
		<view class="content">
			<view class="content" v-if="luckyList.length > 0">
				<view class="lucky-items" v-for="(items,i) in luckyList" :key="i" @tap="handleTapLucky(items)">
					<view class="lucky-header">
						<view class="lucky-box">
							<view class="lucky-radio" :class="{'active-img':betNo === items.betNo && flag}"></view>
							<text  class="font-19">{{items.vendorCode}}</text>
						</view>
						<view class="lucky-text coloraa">
							{{getTime(items)}}
						</view>
					</view>
					<view class="lucky-row">
						<view class="lucky-col">
							<view class="coloraa line-6">{{$t('下注金额')}}</view>
							<text class="font-19">{{items.betAmount}}.00</text>
						</view>
						<view class="lucky-col">
							<view class="coloraa line-6">{{$t('中奖倍数')}}</view>
							<text class="font-19">{{items.rewardTimes}}</text>
						</view>
						<view class="lucky-col">
							<view class="coloraa line-6">{{$t('获奖奖金')}}</view>
							<text class="font-19">{{items.amount}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="tip">{{$t('温馨提示')}}</view>
			<view class="text">
				{{ $t('每天（00:00 至当天 23:59:59）只能领取1次千百倍奖金！（提交错误信息超过5次，取消当日申请资格）') }}
			</view>
		</view>
		<view class="btn-box">
			<view class="btn"  :class="{'active-btn':flag && luckyList.length > 0 && !received }" @tap="handleTapBtn">
				{{$t('领取礼金')}}
			</view>
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
		components: { Marquee },
		data() {
			return {
				vendorIdList: [],
				luckyItem:{},
				betNoList:[],
				betNo: '',
				flag: false,
				received: false
			};
		},
		computed:{
			selfHelpItem(){
				return  childStore.state.selfHelpItem || {}
				
			},
			luckyList(){
				let list = []
				try{
					this.received = this.selfHelpItem.speActLuckyTimesVO.received
					// 如果已经领取清空列表
					if(this.received){
						list = []
					} else {
						let unreceivedList = this.selfHelpItem.speActLuckyTimesVO ? this.selfHelpItem.speActLuckyTimesVO.unreceivedList : []
						if(unreceivedList.length > 0){
							list = unreceivedList
						} 
					}
				}catch(e){
					//TODO handle the exception
				}
				return list
			},
	
		},

		methods:{
			// 领取礼金
			handleTapBtn(){
				if(this.luckyList.length === 0)  return 
				let betNo = encodeURIComponent(this.betNo)
				this.$api.putReceive(this.selfHelpItem.id,betNo,(err,res)=>{
					if(res){
						uni.showToast({
							icon:'none',
							title:this.$t('领取成功')
						})
						this.betNo = ''
						this.flag = false
						// uni.$emit('handleUpdata',10)
						this._getThematicActivitiesByApp(this.selfHelpItem.id)
					} else {
						this.flag = false
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
			// 点击激活
			handleTapLucky(items){
				// 判断有相同的值不加入数组
				this.flag = !this.flag
				if(this.flag){
					this.betNo = items.betNo
				}
				// if(this.vendorIdList.includes(items.vendorId)) return false
				// this.vendorIdList.push(items.vendorId)
				// this.betNoList.push(items.betNo)
			},
			getTime(items){
				return items.betTime ? moment(new Date(items.betTime)).format('YYYY-MM-DD hh:mm'): ''
			}
		}
	}
</script>

<style lang="scss" scoped>
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
		// margin-top: 34upx
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
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		&.active-btn{
			background-color: var(--themeBtnBg);
			color: #FFFFFF;
			// box-shadow: 0 3px 6px #d2d2d2;
		}
	}
	
	.lucky-items{
		width: 100%;
		border-radius: 16upx;
		background-color: #FFFFFF;
		font-size: 24upx;
		margin-bottom: 20upx;
	}
	
	.lucky-header{
		display: flex;
		justify-content: space-between;
		padding: 30upx;
		height: 44upx;
		align-items: center;
	}
	.lucky-box{
		display: flex;
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
		&.active-img{
			background: url(../../image/lucky-right.png) no-repeat;
			background-size: 100% 100%;
			border: none;
		}
	}
	
	.lucky-text{
		// font-size: ;
	}
	.lucky-row{
		display: flex;
		align-items: center;
		// height: 200upx;
		padding: 32upx 0;
		height: 88upx;
		border-top: 1upx solid #F2F2F2;
	}
	.lucky-col{
		flex: 1;
		text-align: center;
	}
	.font-19{
		color: #323233;
		font-weight: 700;
		font-size: 36upx;
	}
	.line-6{
		// height: 30upx;
		margin-bottom: 4upx;
	}
	.lucky-tip-content{
		font-size: 24upx;
	}
	.lucky-tip{
		font-size: 30upx;
		margin: 30upx 0;
	}
</style>
