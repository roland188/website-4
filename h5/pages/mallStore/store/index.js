import Vue from 'vue'
import Vuex from 'vuex'
import cache from '@/utils/cache.js'
Vue.use(Vuex)
const mailStore = new Vuex.Store({
	state: {
		userName: '',
		userRmb: '',
		currency: '',
		memberId: cache.get('memberId') || '', // 获取memberId
		changeItem:{},  //兑换商品信息
		editItem:{},   //编辑的用户信息
	},
	mutations: {
		updateMallUserName (state, val) {
			state.userName = val
		},
		updateMallUserRmb (state, val) {
			state.userRmb = val
		},
		updateMallCurrency (state, val) {
			state.currency = val
		},
		updateMemberId(state,val){
			cache.set('memberId', val)
			state.memberId = val
		},
		setChangeItem(state, value) {
			state.changeItem = value
		},
		setEditItem(state, value) {
			state.editItem = value
		},
	},
	getters: {
		getMallUserName: state => state.userName,
		getMallUserRmb: state => state.userRmb,
		getMallCurrency: state => state.currency,
		getMallChangeItem: state => state.changeItem,
		getMallEditItem: state => state.editItem
	}

})
export default mailStore
