<template>
	<view class="self-help-detail themef7">

		<sub-header :title="headerTitle" @goBackHead="handleClickLeft">
			<text slot="center" class="rule" v-if="tabType!==99999">
				<navigator url="/pages/subBuffetOffers/promoIntro" class="header-right-text">{{$t('规则')}}</navigator>
			</text>
			<text slot="center" class="rule" @click="handleGomore" v-else>{{$t('规则')}}</text>
		</sub-header>
		<!-- tab标签切换 -->
		<sub-tab v-model="currentIndex" bgColor="#fff" :tabs="tabs" field="name" isShowMore :scroll="true"
			@handleOpenPopup="handleOpenPopup" @change="handleTab" :lineColor="'var(--themeBtnBg)'" fixed></sub-tab>
		<!-- 内容区域 -->
		<view class="self-help-list-flex">
			<component :is="componentName" :datasource='dataToChild' :typeTab="tabType" :key='time'></component>
		</view>
		<!-- 弹窗 -->
		<subPopup ref="popup" type="center" :backgroundColor="showMore ? '#ffffff' : '#f8f8f8'">
			<view class="popup-continar-slider" :style="{width:popupWidth + 'px'}" v-if="!showMore">
				<popup-header :popupHeaderText="popupHeaderText" @handleClose="handleClose"></popup-header>
				<view class="weekly-content">
					<weekly-reward-list :list="thisWeekSignDataList" :tagContent="tagContent" isShowPopup>
						
					</weekly-reward-list>
				</view>
			</view>
			<view class="more-container" v-else>
				<view class="status_bar">

				</view>
				<view class="more-header">{{$t('全部优惠')}}</view>
				<view class="more-list-ul">
					<view class="more-list-li" 
						:style="{'width': ['betc88','kubet','bgga','choibet','phattai68'].includes($config.projectImgUrl) ? '48%' : '30%'}" 
						v-for="(items,i) in tabList" :key="i"
						:class="{active: currentIndex === i}" @tap="handleTab({...items,index:i})">
						{{items.title}}
					</view>
				</view>
			</view>
		</subPopup>
	</view>
</template>

<script>
	import childStore from './utils/store.js'
	import subTab from './components/subTab.vue'
	import subHeader from './components/header.vue'
	import popupHeader from './components/popupHeader.vue'
	import wPicker from './components/w-picker/w-picker.vue'
	import information from './components/information/info-certification.vue'
	import weeklyReward from './components/weekly-reward/weekly-reward.vue'
	import luckyBet from './components/lucky-bet/lucky-bet.vue'
	import anniversaryGift from './components/anniversary-gift/anniversary-gift.vue'
	import chessRewards from './components/chess-rewards/chess-rewards.vue'
	import chessRescue from './components/chess-rescue/chess-rescue.vue'
	import thousands from './components/thousands/thousands.vue'
	import giveBack from './components/give-back/give-back.vue'
	// import promo from './components/promo/promo.vue'
	import specialVvent from './components/specialVvent.vue'
	import subPopup from './components/sub-popup/sub-popup.vue'
	// import eventBus from './utils/eventBus.js'
	export default {
		name: 'details',
		components: {
			subTab,
			subHeader,
			popupHeader,
			information, // 信息认证
			weeklyReward, // 周勤奖励
			luckyBet, // 幸运注单
			anniversaryGift, // 周年礼金
			chessRewards, // 棋牌奖励
			chessRescue, // 棋牌救援 
			thousands, // 千百百倍
			giveBack, // 亿元回馈
			// promo, // 洗码积分
			specialVvent, // 专题活动
			subPopup
		},
		data() {
			return {
				rangeVisible: false,
				result: {
					result: ""
				},
				time: null,
				currentIndex: 0,
				tabType: '11',
				popupWidth: 0, // 弹窗的宽度
				headerTitle: "888",
				tabList: [],
				popupHeaderText: '',
				promoData: {
					memberId: '',
					currentPage: 1,
					endTime: "",
					memberId: '',
					moneyMax: "",
					moneyMin: "",
					pageSize: 10,
					startTime: "",
					type: "",
				},
				showMore: false, // 显示更多
				tagContent: {
					titleLeft: this.$t('上周周勤'),
					titleBottomText: this.$t('累计有效投注0.00')
				},
				componentName: 'information',
				resetIndex:0,
				dataToChild: null
			};
		},
		computed: {
			selfHelpItem(){
				return childStore.state.selfHelpItem
			},
			thisWeekSignDataList(){
				return childStore.state.thisWeekSignDataList
			},
			tabs() {
				let tabList = uni.getStorageSync('cardList') ? uni.getStorageSync('cardList') : []
				// 增加更多图标
				// if (tabList.length >= 4) {
				// 	tabList.push({
				// 		name: '更多'
				// 	})
				// }
				return tabList
			},
			

		},
		mounted() {
		},
		onShow() {
			// 监听事件处理
			uni.$on('handleShowOpen', (data) => {
				this.showMore = false
				this.popupHeaderText = data.popupHeaderText
				this.$refs.popup.open(data.postition)
			})
			// #ifdef H5
			require("./css/theme/" + (this.$config.theme) + ".css");
			// #endif
			
		},
		onLoad(option) {
			this.resetIndex = parseInt(option.index)
			this.tabList = uni.getStorageSync('cardList') ? uni.getStorageSync('cardList') : []

			if (JSON.stringify(this.selfHelpItem) !== '{}') {
				// debugger
				this.headerTitle = this.selfHelpItem.name
				this.currentIndex = this.selfHelpItem.currnetIndex * 1
				console.log(this.selfHelpItem, "this.selfHelpItem")
				this.handleTab(this.selfHelpItem)
			}

			
			// this.handleTab(curTab)
			// 获取设备width
			uni.getSystemInfo({
				success: (res) => {
					// console.log(res)
					this.popupWidth = res.windowWidth;
				}
			})

		},

		methods: {
			handleClickLeft() {
				uni.navigateBacks({})
			},
			// 数据处理所有

			_getThematicActivitiesByApp(id) {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$api.getThematicActivitiesByApp(id, (err, res) => {
					if (err) {
						uni.hideLoading()
						return
					}
					if (res) {
						this.datasource = res
						console.log('获取数据', 89898, res);
						// eventBus.$emit('dataReady', res)
						childStore.commit('setSelfHelpItem', res)
						uni.hideLoading()
					}
				})
			},
			// 切换tab
			handleTab(obj) {
				if(!obj.component){
					const cardList = uni.getStorageSync('cardList')
					this.currentIndex = this.resetIndex
					this.headerTitle = cardList[this.resetIndex].name
					this.tabType = cardList[this.resetIndex].id
					this.componentName = cardList[this.resetIndex].component
				}else{
					this.currentIndex = obj.index
					this.headerTitle = obj.name
					this.tabType = obj.id
					this.componentName = obj.component
				}

				// 不等于洗码积分
				if (obj.component !== "promo") {
					childStore.commit('setSelfHelpItem', null)
					// console.log(obj,'tab切换数据---------')
					this._getThematicActivitiesByApp(obj.id)
				} else {
					// 获取洗码积分数据
					this.getPromoData();
				}
			},
			// 获取洗码数据接口
			getPromoData() {
				this.$api.getUserFanshui(this.memberId, (err, res) => {
					if (res) {
						childStore.commit('setPromoWashCodeItem', res)
					}
				})
			},
			// 头部关闭事件
			handleClose() {
				this.$refs.popup.close()
			},
			// 打开更多操作
			handleOpenPopup(obj) {
				this._getThematicActivitiesByApp(obj.id)
				this.currentIndex = obj.index
				this.time = new Date().getTime()
				this.showMore = true
				this.$refs.popup.open('right')
			},

		},

	}
</script>
<style>
	/* #ifdef APP-PLUS */
		@import url("./css/theme/a023.css");
	/* #endif */
	
</style>
<style lang="scss" scoped>
	.self-help-detail {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #F7F7F7;
		padding-top: var(--status-bar-height);
	}

	.self-help-list-flex {
		flex: 1;
		overflow-y: auto;
		position: relative;
		// box-sizing: border-box;
		padding-bottom: 160upx;
	}

	.list-scroll {
		height: 100%;
	}

	.header-right-text {
		color: rgb(77, 98, 225);
		font-size: 24upx;
		font-weight: normal;
	}

	.popup-continar-slider {
		width: 100%;
		height: 100Vh;
	}

	.weekly-content {
		margin: 0 30upx;
		padding: 0 24upx;
		background: #fff;
		border-radius: 16upx;
	}

	.more-container {
		width: 600upx;
		height: 100%;
	}

	.more-header {
		text-align: center;
		height: 90upx;
		line-height: 90upx;
		font-size: 28upx;
		font-weight: 700;
	}

	.more-list-ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 20upx;
		padding: 0 22upx;
		// box-sizing: border-box
	}

	.more-list-li {
		width: 30%;
		height: 120upx;
		border-radius: 10upx;
		border: 2upx solid #dcdcdc;
		text-align: center;
		font-size: 26upx;
		box-shadow: 0 5px 5px 0 #f3eeee;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
		padding: 0 10upx;
		box-sizing: border-box;
		margin-bottom: 22upx;

		// margin: 22upx 28upx 0 0;
		// &:nth-child(3n){
		// 	margin:22upx 0 0 0;
		// }
		&.active {
			color: #e64f4f;
			border: 0.5upx solid #e64f4f;
			background-color: #fef4f3;
			box-shadow: 0 16upx 16upx 0 #f9d5d5;
		}
	}

	.rule {
		position: absolute;
		right: 20upx;
		color: var(--rlueColFont);
		font-size: 24upx;
	}
</style>
