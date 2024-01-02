import i18n from '@/i18n/index'
export default {
		data() {
			return {
				navActive: 0,
				styleIndex: 0,
				currentPage: 1,
				pageSize: 5,
				popNumber: '',
				multipleNum: '',
				rid: '',
				jackpotLiat: [],
				lang:'',
				redeemCode: '',
				navList: [{
						id: 3,
						title: i18n.$t('全部'),
					},
					{
						id: 0,
						title: i18n.$t('可领取'),
					},
					{
						id: 1,
						title: i18n.$t('已领取'),
					},
					{
						id: 2,
						title: i18n.$t('已过期'),
					},
				],
			};
		},
		onLoad() {

		},
		onShow(){
			this.lang = uni.getStorageSync('lang');
			this.getJackpotList();
		},
		computed: {
			totalNum() {
				return this.multipleNum / this.popNumber
			}
		},
		mounted() {
		},
		methods: {
			hanldColse(){
				this.redeemCode = ''
				this.$refs.jackpotPopup1.close()
			},
			// 领取
			handleReceive(){
				if(!this.redeemCode){
					uni.showToast({
						icon:'none',
						title: i18n.$t("请输入兑换码")
					})
					return
				}
				let data = {
					redeemCode:this.redeemCode
				}
				this.$api.exchangeRedeemCode(data,(err,res)=>{
					this.getJackpotList();
					if(res){
						this.redeemCode = ''
						uni.showToast({
							icon:'none',
							title:i18n.$t("兑换成功")
						})
					}
				})
			},
			handleClickRight(){
				this.redeemCode =  ''
				this.$refs.jackpotPopup1.open()
			},
			isExpired(value) {
				let result = "";
				switch (value) {
					case 0:
						result = i18n.$t('立即领取');
						break;
					case 1:
						result = i18n.$t('已领取');
						break;
					case 2:
						result = i18n.$t('已过期');
						break;
					case 3:
						result = i18n.$t('立即领取');
						break;
				}
				return result
			},
			// 导航切换
			switchTab(item, index) {
				this.navActive = index;
				this.getJackpotList(item.id)
			},
			// 获取数据 state 0可领取 1已领取 2已过期 3全部
			getJackpotList(stateType) {
				this.jackpotLiat = [];
				const query = {
					currentPage: 1,
					state: stateType == "" ? stateType : stateType,
				};
				this.$api.getJackpotList(query, (err, res) => {
					if (res) {
						this.jackpotLiat = res.content
					}

				}, true)
			},
			// 领取弹窗
			showPopup(item) {
				const self = this
				const stateType = item.state;
				this.popNumber = item.amount;
				this.multipleNum = item.amountAudit;
				if (stateType == 2) {
					uni.showToast({
						title: i18n.$t('已过期'),
						icon: 'none'
					})
				} else if (stateType == 1) {
					uni.showToast({
						title: i18n.$t('您已领取过啦'),
						icon: 'none'
					})
				} else {
					this.rid = item.id;
					this.$refs.jackpotPopup.open()
				}

			},
			// 立即领取
			onReceive() {
				const self = this
				this.$refs.jackpotPopup.close()
				const rid = this.rid;
				this.$api.getJackpotReceive(rid, (err, res) => {
					if (res) {
						// #ifdef  H5
						// 新版
						maskAppToNative("otpcode");
						//老版
						maskAppOldToNative("otpcode");
						// #endif
						uni.showModal({
							title: i18n.$t('领取成功'),
							content: i18n.$t('具体优惠详情请参阅！\n官网对应的活动细则'),
							confirmText: i18n.$t('关闭'),
							showCancel: false,
							success: (res => {
								if (res.confirm) {
									console.log('用户点击确定')
									this.getJackpotList()
								}
							})
						});
					}
				})
			},

			// 时间转换
			timeSwitch(val) {
				if (val) {
					var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
					var Y = date.getFullYear() + "-";
					var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
					var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
					var h, mm;
					h = date.getHours();
					mm = date.getMinutes();
					h = h < 10 ? "0" + h : h;
					mm = mm < 10 ? "0" + mm : mm;
					var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
					var time = Y + M + D + " " + h + ":" + mm + ":" + s;
					return time;
				}
			},
			BackPage() {
				uni.navigateBacks();
			},
		},
	};
