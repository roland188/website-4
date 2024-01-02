import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        update: '立即更新',
        advertisingShow: false,
        lang: 'vi'
    },
    mutations: {
        update(state, val) {
            state.update = val
        },
        advertisingShow(state, val) {
            state.advertisingShow = val
        },
        setState(state, value) {
            console.log(value, '设置语言')
            state.lang = value.lang
        }
    },
})
export default store