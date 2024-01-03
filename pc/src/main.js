/*
 * @Description: 项目模块
 * @Version: 1.0
 * @Autor: steFan
 * @Date: 2020-03-10 09:15:03
 * @LastEditors: steFan
 * @LastEditTime: 2020-04-01 15:19:13
 */
// import '@babel/polyfill'
import Vue from 'vue';
import router from './router/index';
import './element.js'
import App from './App.vue';
import i18n from './i18n/index'
import VueClipboard from 'vue-clipboard2'; //用于复制到粘贴板的插件
Vue.use(VueClipboard);
import {
    Swiper as SwiperClass,
    Pagination, //使用那个组件就在这里面添加
    Mousewheel,
    Autoplay,
    Navigation,
    EffectFade,
} from "swiper/core";
import getAwesomeSwiper from "vue-awesome-swiper/dist/exporter";
import 'swiper/swiper-bundle.css'
import axios from 'axios'
// 文字滚动
import scroll from 'vue-seamless-scroll';
Vue.use(scroll);

// 滚动条
import HappyScroll from 'vue-happy-scroll'
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'
Vue.use(HappyScroll)

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
import store from './store/store';

//nk
import utils from './utils/utils';
import nkhttp from './utils/nkhttp';
import './assets/iconfont/iconfont.css';
import "./assets/skin/skin.scss";

import { ApiIntegration, ImgStorage } from '@nypkg/interface'
import { vueBaberrage } from 'vue-baberrage'
Vue.use(vueBaberrage)
import MyImage from '@/components/MyImage';
import Back from '@/components/MyImage/components/Back';
Vue.component('MyImage', MyImage,);
Vue.component('Back', Back,);

import './assets/js/rem';
    // 导入图片预加载方法以及图片列表
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
    loading: require('./assets/image/loading.gif'),
    error: require('./assets/image/loading_error.svg'),
    attempt: 1
})


import 'animate.css';
import { clear } from './utils/cache.js';
SwiperClass.use([Pagination, Mousewheel, Autoplay, Navigation, EffectFade]);
Vue.use(getAwesomeSwiper(SwiperClass));
Vue.prototype.$axios = axios
Vue.prototype.$http = require('./utils/http.js').default;
Vue.prototype.$api = require('./utils/api.js');
Vue.prototype.$cache = require('./utils/cache.js');
Vue.prototype.$common = require('./utils/common.js').default;
Vue.prototype.$config = require('./utils/config.js').default;
Vue.prototype.$freeze = require('./utils/freeze.js').default;
Vue.prototype.$utils = utils;
Vue.prototype.$nkhttp = nkhttp;
Vue.prototype.$t = i18n.$t
Vue.prototype.$ApiIntegration = ApiIntegration;
Vue.prototype.$ImgStorage = ImgStorage;
Vue.config.productionTip = false;
(async() => {
    //关闭加载弹框
    new Vue({
        router,
        store,
        render: (h) => h(App),
        i18n,
    }).$mount('#app');
})();
