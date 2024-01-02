import VueI18n from 'vue-i18n'
import Vue from 'vue'
import store from '@/utils/store'
import langZhCN from '@/lang/zh_CN'
import langEn from '@/lang/en'
import langVi from '@/lang/vi'
import langId from '@/lang/id'
Vue.use(VueI18n)
let locale = uni.getStorageSync("lang") || 'vi'
console.log(locale)
const i18n = new VueI18n({
    // 默认选择的语言
    locale,
    messages: {
        'zh_CN': langZhCN,
        'zh_EN': langEn,
        'vi': langVi,
		'en': langEn,
        'id': langId
    },
})
export const setLang = (locale) => {
    // uni.setLocale(locale)
    uni.setStorageSync("lang", locale);
    // #ifdef H5
    document.querySelector('html').setAttribute('lang', locale)
    // #endif
	i18n.locale = locale
	console.log("ggggkhkhkh",locale)
    store.commit('setState', {
        lang: locale,
    })
    setTabbarItem()
    //测试需要回调tabbar页面瞬间设置
    //App TabBar组件是keepalive
    // setTabbarItem()
}

export const setTabbarItem = () => {
    const tabbar = []
    console.log(tabbar);
    Object.keys(tabbar).forEach(index => {
        uni.setTabBarItem({
            index: +index,
            text: tabbar[index],
        });
    })
}

export default i18n