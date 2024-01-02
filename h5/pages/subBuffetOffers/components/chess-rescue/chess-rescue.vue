<!-- 棋牌救援 -->
<template>
	<view class="chess chess-rescue">
		<Marquee :text="selfHelpItem.marquee" />
		<weekly-reward-tag-new :List="dataList" v-if='dataList.length'/>
		<!-- 按钮 -->
		<view class="give-none" v-else>{{$t('-暂无记录-')}}</view>
		<view class="box-btn" v-if="dataList.length">
			<view class="card-btn active" @tap="handleTap">{{$t('领取奖励')}}</view>
		</view>
		<view v-if="$config.projectImgUrl == 'amxpj'" class="fullColor">
				{{$t('温馨提示：如遇网络因素不显示当前符合的订单，且刷新网络后依然无法显示请点击')}}
				<text class="tipColor" @click="customerService">这里</text>
				{{$t('联系在线客服进行处理')}}
		</view>

	</view>
</template>

<script>
	import childStore from '../../utils/store.js'
	import Marquee from '../marquee/index.vue'
	import {
		moment
	} from '../../utils/moment.js'
	import weeklyRewardTagNew from '../weekly-reward/weekly-reward-tag-new.vue'
	export default {
		name: 'chess-rescue',
		props: ['datasource'],
		components: {
			weeklyRewardTagNew,
			Marquee
		},
		data() {
			return {
				status: 1,
				receiveList: [],
				dataList: []
			};
		},
		computed: {
			selfHelpItem() {
				if(childStore.state.selfHelpItem) this.list()
				return childStore.state.selfHelpItem || {}
			}
		},
		methods: {
			formatSeconds(value) {
				if(value === -1) return this.$t('已过期')
				if(!value) return this.$t('剩余领取时间') + '：00:00:00'
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
				return `${this.$t('剩余领取时间')}：${result}`
			},
			list() {
				// this.selfHelpItem = Object.assign({}, this.datasource)
				const compensationVO = childStore.state.selfHelpItem.compensationVO
				let temp = []
				if (compensationVO && compensationVO.receivedList.length) {
					this.receiveList = compensationVO.receivedList
					this.receiveList.forEach(el => {
						temp.push({
							amountLoss: el.amountLoss,
							amountReward: el.amountReward,
							time: el.checkTimeStop ? moment(new Date(el.checkTimeStop)).format('MM月DD日') :
							moment(new Date()).before(1).format('MM月DD日'),
							leftTime: this.formatSeconds(el.remainTime)
						})
					})
				}
				console.log(temp, 787878);
				this.dataList = temp
			},
			// 领取按钮
			handleTap() {
				let recordNum = ''
				this.receiveList.forEach(el => {
					recordNum += el.recordsNumber + ','
				})
				let betNo = encodeURIComponent(recordNum)
				this.$api.putReceive(this.selfHelpItem.id, betNo, (err, res) => {
					if (err) return false
					if (res) {
						uni.showToast({
							icon: 'success',
							title: this.$t('领取成功')
						})
						// 棋牌救援
						// uni.$emit('handleUpdata',9)
						this._getThematicActivitiesByApp(this.selfHelpItem.id)
					}
				}, false)
			},
			_getThematicActivitiesByApp(id) {
				childStore.commit('setSelfHelpItem', null)
				this.$api.getThematicActivitiesByApp(id, (err, res) => {
					if (err) return
					if (res) {
						childStore.commit('setSelfHelpItem', res)
						this.list()
					}
				})
			},
			customerService() {
				uni.navigateTo({
					url: "/pages/subCustomerService/subCustomerService",
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.give-none{
		color: #999;
		text-align: center;
		margin: 32upx;
		font-size: 28upx;
	}
	.chess {
		padding: 20upx 30upx;
	}

	.gift-tip {
		font-size: 24upx;
		font-weight: 500;
		color: var(--themeBtnBg);
		margin-bottom: 22upx;
	}

	.weekly-reward-container {
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
	.card-btn {
		color: #fff;
		background: #d2d2d2;
		box-shadow: 0 3px 6px #d2d2d2;
		border-radius: 8upx;
		text-align: center;
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;

		&.active {
			background-color: var(--themeBtnBg);
			color: #fff;
		}
	}

	.count-down {
		display: flex;
		height: 68upx;
		align-items: center;
	}
	.fullColor{
			text-align: center;
        color: #9A9A9A;
			.tipColor{
			
        margin: 0 4upx;
        padding: 10upx 20upx;
        border-radius: 10upx;
        background-color: rgba(189, 49, 36, 1);
        color: rgba(255, 255, 255, 1);
        font-size: 26upx;
        text-align: center;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
			}
		}
</style>
