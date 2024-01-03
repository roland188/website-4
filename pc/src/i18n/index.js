import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { crc32 } from 'crc'
import ElementLocale from 'element-ui/lib/locale'
Vue.use(VueI18n);

import en from './json/en';
import zh_CN from './json/zh_CN';
import vi from './json/vi';
import pt from './json/pt';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import viLocale from 'element-ui/lib/locale/lang/vi'
import ptLocale from 'element-ui/lib/locale/lang/pt'
/*---------使用语言包-----------*/ 
let locale = window.locale || 'vi'
console.log(locale,"locale")

const i18n = new VueI18n({
  locale, // 语言标识 
  messages: { 
    zh_CN: {
      ...zhLocale,
      ...zh_CN
    },//中文简体
    vi: {
      ...viLocale,
      ...vi
    },
    en: {
      ...enLocale,
      ...en,
    },
    pt:{
      ...ptLocale,
      ...pt,
    }
  },
//   silentTranslationWarn: true,
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

const lang = (key, o) => {
  const hashKey = process.env.NODE_ENV !== 'production' ? `k${crc32(key).toString(16)}` : key;//production已经在外部用 crc.js 计算过了
  // console.log("hashKey===",hashKey,key,"=====key",i18n)
  let words = i18n.t(hashKey, o)
  if (words === hashKey) {
    words = key
    // console.log(key, '-没翻译')
  }
  return words
}

i18n.$t = lang

export default i18n