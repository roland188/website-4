import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { crc32 } from 'crc'
import store from '@/utils/store'
import config from '@/utils/config.js'
Vue.use(VueI18n);
import en from './json/en';
import zh_CN from './json/zh_CN';
import vi from './json/vi'
import pt from "./json/pt.json"
/*---------使用语言包-----------*/ 
let locale = uni.getStorageSync("lang") || 'vi'
// #ifdef H5
 locale = window.locale
// #endif
// #ifdef APP-PLUS
locale = config.locale
// #endif

const i18n = new VueI18n({
  locale: locale, // 语言标识 
  lazy:true,
  silentTranslationWarn: true, // process.env.NODE_ENV === 'production',
  messages: { 
    zh_CN: {
      ...zh_CN
    },//中文简体
    en: {
      ...en,
    },
    vi:{
      ...vi
    },
    pt:{
      ...pt
    }
  },

})



export const setLang = (locale) => {
  // uni.setLocale(locale)
  uni.setStorageSync("lang", locale);
  // #ifdef H5
  document.querySelector('html').setAttribute('lang', locale)
  // #endif
  i18n.locale = locale
  store.commit('setState', {
      lang: locale,
  })
  setTabbarItem()
  //测试需要回调tabbar页面瞬间设置
  //App TabBar组件是keepalive
  // setTabbarItem()
}


export const lang = (key, o) => {
  let hashKey = `k${crc32(key).toString(16)}`
  // #ifdef H5
  if(process.env.NODE_ENV === 'production'){
     hashKey = key; //已经在外部用 crc.js 计算过了
  } 
  // #endif
  let words = i18n.t(hashKey, o)
  // console.log(words,"key, o=====",key, o)
  if (words === hashKey) {
    words = key
    // console.log(key, '-没翻译')
  }
  return words
}

const replaceValues = (str, values) => {
  if(!values) return str
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] ?? match
  });
};

i18n.$t = lang;

export const setTabbarItem = () => {
  console.log("i18n.$t",store.state)
  const tabbar = [i18n.$t('首页'),i18n.$t('在线客服'),i18n.$t('优惠'),i18n.$t('VIP'),i18n.$t('会员中心')];
  console.log(tabbar);
  Object.keys(tabbar).forEach(index => {
      uni.setTabBarItem({
          index: +index,
          text: tabbar[index],
      });
  })
}

export default i18n;