import Vue from 'vue'
import Vuex from 'vuex'
import cache from '@/utils/cache.js'
Vue.use(Vuex)
const childStore = new Vuex.Store({
	state: {
		selfHelpItem: cache.get('selfHelpItem') || {},
		thisWeekSignDataList: cache.get('thisWeekSignDataList') || [], // 提供给上周弹窗组件数据使用
		cardList: cache.get('cardList') || [],
		promoWashCodeList: cache.get('promoWashCodeList') || [], // 洗码列表数据
		promoWashCodeItem: cache.get('promoWashCodeItem') || {}, // 洗码明细数据
	},
	mutations: {
		// 设置首页页面数据
		setSelfHelpItem(state, val) {
			cache.set('selfHelpItem', val)
			state.selfHelpItem = val
		},
		// 再周勤奖励设置数据
		setThisWeekSignDataList(state, val) {
			cache.set('thisWeekSignDataList', val)
			state.thisWeekSignDataList = val
		},
		// 设置tab列表数据
		setCardList(state, val) {
			cache.set('cardList', val)
			state.cardList = val
		},
		// 设置洗码积分列表数据
		setPromoWashCodeList(state, val) {
			cache.set('promoWashCodeList', val)
			state.promoWashCodeList = val
		},
		// 设置洗码积分详情数据
		setPromoWashCodeItem(state, val) {
			cache.set('promoWashCodeItem', val)
			state.promoWashCodeItem = val
		},

	},

})
export default childStore
