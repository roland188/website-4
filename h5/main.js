import Vue from "vue";
import App from "./App";
import store from "./utils/store.js";
import cuCustom from "./colorui/components/cu-custom.vue";
import VueClipboard from "vue-clipboard2";
import i18n,{lang} from './i18n/index'
Vue.use(VueClipboard);

Vue.prototype.$server = require("utils/server.js");
Vue.prototype.$api = require("utils/api.js");
Vue.prototype.$config = require("utils/config.js");
Vue.prototype.$cache = require("utils/cache.js");
Vue.prototype.$common = require("utils/common.js").default;
Vue.prototype.$store = store;

Vue.config.productionTip = false;
uni.navigateBacks = (params) => {
    if (getCurrentPages().length > 1) {
        uni.navigateBack(params);
    } else {
        uni.reLaunch({
            url: "/pages/index/index",
        });
    }
};

Vue.prototype.$t = i18n.$t
App.mpType = "app";
Vue.component("cu-custom", cuCustom);
// Vue.use(i18n)
if (process.env.NODE_ENV !== "development") {
    console.log = () => {};
}
const app = new Vue({
	i18n,
    ...App,
});
app.$mount();