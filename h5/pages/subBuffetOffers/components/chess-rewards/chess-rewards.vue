<!-- 棋牌奖励 -->
<template>
	<view class="chess">
		<Marquee :text="selfHelpItem.marquee" />
		<!-- <view class="gift-tip">
			发放时间：首次存款日期开始，每满一整年满足要求后开始发放,请及时查看！
		</view> -->
		<!-- <weekly-reward-tag :timeText="timeText" type="2" :isTagContent="false" :showCotentTag="false" :weeklyList="list"> -->
		<!-- 棋牌奖励卡片 -->
		<weekly-reward-tag isTimeUp :timeText="timeText" type="1" :tagContent="tagContent" :weeklyList="list">
			<view class="down" slot="down">
				<view v-if="daoTime && !timeText" class="count-down">
					<uni-countdown :start="daoTime.istart" :showColon="false" :day="daoTime.day" :hour="daoTime.hour"
						:minute="daoTime.minute" :second="daoTime.second"></uni-countdown>
					<text>{{$t('领取')}}</text>
				</view>
			</view>
		</weekly-reward-tag>
		<!-- 按钮 -->
		<view class="box-btn">
			<view class="card-btn" :class="{'active':status===0 && isPass}" @tap="handleTap(status)">{{btnText}}</view>
		</view>
	</view>
</template>

<script>
	import childStore from '../../utils/store.js'
	import Marquee from '../marquee/index.vue'
	import uniCountdown from '../uni-countdown/uni-countdown.vue'
	import {
		moment
	} from '../../utils/moment.js'
	import weeklyRewardTag from '../weekly-reward/weekly-reward-tag.vue'
	export default {
		components: {
			weeklyRewardTag,
			Marquee,
			uniCountdown
		},
		data() {
			return {
				timeText: this.$t('00天00时00分00秒'),
				btnText: this.$t('未达到领取条件'),
				weeklyList: [{
						text: this.$t('总完成局数'),
						totalMoney: 0,
						props: 'gameInnings'
					},
					{
						text: this.$t('有效投注(元)'),
						totalMoney: '0.00',
						props: 'betAmountValid'
					},
					{
						text: this.$t('奖励金(元)'),
						totalMoney: '0.00',
						props: 'amountReward'
					},
				],
				weeklyLists: [{
						text: this.$t('总完成局数'),
						totalMoney: 0,
						props: 'gameInnings'
					},
					{
						text: this.$t('有效投注(元)'),
						totalMoney: '0.00',
						props: 'betAmountValid'
					},
					{
						text: this.$t('奖励金(元)'),
						totalMoney: '0.00',
						props: 'amountReward'
					},
				],
				tagContent: {
					titleLeft: moment(new Date()).before(1).format('MM-DD'),
					isShowImg: false,
				},
				betNo: '',
				rewardItems: {}, // 存储数据
				status: 1,
				daoTime: {
					istart: false
				},
				compensationVO: {}
			};
		},
		computed: {
			selfHelpItem(){
				return  childStore.state.selfHelpItem || {}
				
			},
			isPass() {
				const now = new Date().getTime()
				try {
					return now >= this.compensationVO.validTimeStartApp && now <= this.compensationVO.validTimeStopApp
				} catch (e) {
					//TODO handle the exception
				}
				return false
			},
			list() {
				try {
					let compensationVO = this.selfHelpItem && this.selfHelpItem.compensationVO
					this.compensationVO = this.selfHelpItem && this.selfHelpItem.compensationVO
					if (compensationVO) {
						// 隔天有效2  1长期有效
						if (compensationVO.validType === 2) {
							this.daoTime.istart = false
							this.tagContent.titleLeft = compensationVO.validTimeStartApp ? moment(new Date(
								compensationVO.validTimeStartApp)).before(1).format('MM-DD') : moment(
							new Date()).before(1).format('MM-DD')
							this.timeText = moment(new Date(compensationVO.validTimeStartApp)).format(
									'YYYY-MM-DD hh:mm:ss') + '-' + moment(new Date(compensationVO.validTimeStopApp))
								.format('hh:mm:ss')
						} else if (compensationVO.validType === 1) {
							// let timeText = moment(new Date(compensationVO.validTimeStopApp)).format('hh时mm分ss秒')
							let titleLeft = moment(new Date(compensationVO.validTimeStopApp)).before(1).format(
								'MM-DD')
							this.getCounDownTime(compensationVO.validTimeStopApp)
							this.timeText = ''
							this.tagContent.titleLeft = titleLeft;
							console.log(titleLeft,'titleLeft')
						} else {
							this.daoTime.istart = false
							this.timeText = this.timeText
						}
						// 当列表有值时处理列表数据
						if (compensationVO && compensationVO.receivedList.length > 0) {
							this.betNo = compensationVO.receivedList[0].recordsNumber;
							let obj = compensationVO.receivedList[0]
							this.status = compensationVO.receivedList[0].status
							// status 0领取   status 1 已领取  未达到领取状态
							let text = obj.status === 1 ? this.$t('已领取') : this.$t('未达到领取条件')
							this.btnText = obj.status === 0 ? this.$t('领取') : text
							this.weeklyList.forEach((items, i) => {
								if (obj.hasOwnProperty(items.props)) {
									items.totalMoney = obj[items.props] || 0
								}
							})

						} else {
							this.weeklyList = this.weeklyLists
							this.btnText = this.$t('未达到领取条件')
							// 获取的是前一天日期
							// this.tagContent.titleLeft = this.getDay(1)
						}
					}
					return this.weeklyList
				} catch (e) {
					//TODO handle the exception
				}
				return this.weeklyList

			}
		},
		methods: {
			// 领取按钮
			handleTap(status) {
				if (status !== 0) return false
				let betNo = encodeURIComponent(this.betNo)
				this.$api.putReceive(this.selfHelpItem.id, betNo, (err, res) => {
					if (err) return false
					if (res) {
						uni.showToast({
							icon: 'success',
							title: this.$t('领取成功')
						})
						// 棋牌奖励
						// uni.$emit('handleUpdata',9)
						this._getThematicActivitiesByApp(this.selfHelpItem.id)
					}
				}, false)
			},
			_getThematicActivitiesByApp(id) {
				this.$api.getThematicActivitiesByApp(id, (err, res) => {
					if (err) return
					if (res) {
						childStore.commit('setSelfHelpItem', res)
						// this.setSelfHelpItem(res)
					}
				})
			},
			// 计算倒计时间
			getCounDownTime(mss) {
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
					istart: true
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.chess {
		padding: 20upx 30upx;
		padding-bottom: 160upx;
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
</style>
