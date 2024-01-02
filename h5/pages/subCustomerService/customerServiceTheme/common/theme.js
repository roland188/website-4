import config from "../../lib/config";
import {
	_get
} from "../../lib/server";
import api from "../../lib/api";
export default {
	props: {
		option: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			showList: false,
			customer_phone: 1,
			customer: 1,
			currPage: 'Home',
			server24: '', // 24小时客服地址
			customerData: [],
			domainList:[],
			serviceShow:false
		};
	},
	methods: {
		// 返回
		jump(name) {
			if (getCurrentPages().length > 1) {
				uni.navigateBack(params);
			} else {
				uni.reLaunch({
					url: "/pages/index/index",
				});
			}
		},
		initDataConfig(data) {
			const req = data ? JSON.parse(data) : this.$config
			config.host = req.host
			config.clientCode = req.clientCode; // 平台id
			config.baseURL = req.host; // 域名
			config.clientItem = req.clientItem || req.childCode; // 子平台id
			config.theme = req.theme; // 主题色 appid
			config.projectImgUrl = req.projectImgUrl; // projectImgUrl

			config.haveValue = true;
			if (config.clientItem == 'aygj') {
				config.suffix = 'ay'
			} else {
				config.suffix = ''
			}
			if (data) {
				config.initpage = req.initpage
				config.username = req.username || ''; // 用户名
				config.isShowBack = req.isShowBack || 0; // 是否需要返回按钮 android ios    h5（腾博会）
				config.applyUrl = req.applyUrl || false; // 废弃
				config.type = req.type || 0; // 传入类型 1 h5  2 app  3 android  4. ios
				config.lang = req.language || 'zh_CN'; // 语言
				config.statusHeight = req.statusHeight || 0
				// config.lang = 'zh_HK';
				// window.localStorage.setItem('lang',config.lang);
			} else {
				config.username = this.$server.getUser() && this.$server.getUser()?.username; // 用户名
				config.isShowBack = 0; // 是否需要返回按钮 android ios    h5（腾博会）
				// config.applyUrl = req.applyUrl || false; // 废弃
				// #ifdef H5
				config.type = 1; // 传入类型 1 h5  2 app  3 android  4. ios
				// #endif
				// #ifdef APP-PLUS
				config.type = 2; // 传入类型 1 h5  2 app  3 android  4. ios
				// #endif
				config.lang = req.local || req.locale || 'zh_CN'; // 语言
				// config.statusHeight = req.statusHeight || 0
				//#ifdef H5
				// uni.setNavigationBarTitle({
				//   title: windiw.projectName
				// })
				//#endif
			}
		},
		// 获取列表
		getFrontList() {
			_get(api.getFrontList).then(res => {
				if (res) {
					uni.hideLoading();
					const data = res.data.svalue;
					this.serverList[0].isShow = data.forget_login_password;
					this.serverList[1].isShow = data.withdrawal_not_arrived;
					this.serverList[2].isShow = data.account_thaw;
					this.serverList[3].isShow = data.forget_withdrawal_password;
					this.serverList[4].isShow = data.update_bank_name;
					this.serverList[5].isShow = data.update_bank_number;
					this.serverList[6].isShow = data.deposit_not_arrived;
					this.serverList[7].isShow = data.complaints_suggestions;
					this.serverList[8].isShow = data.self_help_offer;
					this.serverList[9].isShow = data.help_center;
					this.customer = data.customer;
					this.customer_phone = data.customer_phone;
					this.showList = true;
				}
			})
		},
		//  旧客服数据
		customerGetList() {
			let self = this;
			_get(api.list).then(res => {
				if (res) self.customerData = res.data
			})
		},
		// 当前标题
		getShowTitle() {
			return this.$t1('客服中心')
		},
		// 进入下一个页面
		gotoNext(item) {
			let home = this.$config?.isRxpjProject === 1 ? 'home2' : 'home1'
			console.log("home", home)
			uni.navigateTo({
				url: `/pages/subCustomerService/customerServiceTheme/home/${home}?name=${item.path}&id=${item.id}`
			})
		},
		// 进入
		gotoDetail(item) {
			if (item.path == 'Apply') {
				this.getApplyLink()
			} else {
				this.gotoNext(item)
			}
		},
		// 自助优惠申请
		getApplyLink() {
			_get(api.applyUrl).then(res => {
				if (res.code == 0) {
					if (res.data.domain.includes('http')) {
						// #ifdef APP-PLUS
						plus.runtime.openURL(res.data.domain);
						// #endif
						// #ifdef H5
						location.href = res.data.domain
						// #endif
					} else {
						if (config.host.includes('/xxa')) {
							// #ifdef APP-PLUS
							plus.runtime.openURL(config.host.replace('/xxa', res.data.domain));
							// #endif
							// #ifdef H5
							location.href = config.host.replace('/xxa', res.data.domain)
							// #endif
						} else {
							// #ifdef APP-PLUS
							plus.runtime.openURL(config.host + res.data.domain);
							// #endif
							// #ifdef H5
							location.href = config.host + res.data.domain
							// #endif
						}
					}
				}
			})
		},
	
	
		copy(num) {
			console.log(num);
			uni.setClipboardData({
				data: num,
				success: () => {
					uni.showToast({
						title: this.$t1("复制成功"),
					});
				},
			});
		},
		// 电话客服
		goToPhoneser() {
			this.gotoNext({
				path: 'Phoneser'
			})
		},
		// 老客服跳转逻辑
		goCustomer(url, title) {
			console.log(url)
			// #ifdef H5
			if (url) location.href = url
			// #endif
			// #ifdef APP-PLUS
			if (this.$config.projectImgUrl === 'wyyl') {
				uni.navigateTo({
					url: "../webViewQQ/webViewQQ?url=" + url + "&title=" + this.$t1('在线客服')
				})
			} else {
				plus.runtime.openURL(url, function(res) {
					console.log(res);
				})
			}
			// #endif
		},
	},
}
