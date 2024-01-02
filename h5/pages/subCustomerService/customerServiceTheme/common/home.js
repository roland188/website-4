/* 由于是子项目，为了尽量少的影响主项目，这里就使用单页面来做 */
export default {
	data(){
		return {
			router: [{
				components: 'Home',
				title: this.$t1('客服中心')
			},
				{
					components: 'ForgetPassword',
					title: this.$t1('忘记登录密码')
				},
				{
					components: 'Dispensing',
					title: this.$t1('出款未到账')
				},
				{
					components: 'AccountThaw',
					title: this.$t1('账号解冻')
				},
				{
					components: 'UpdatePassword',
					title: this.$t1('设置新密码')
				},
				{
					components: 'Disrecord',
					title: this.$t1('出款未到账')
				},
				{
					components: 'Saverecord',
					title: this.$t1('申请记录')
				},
				{
					components: 'Withdrawal',
					title: this.$t1('忘记取款密码')
				},
				{
					components: 'SetWithdrawalpsd',
					title: this.$t1('设置取款密码')
				},
				{
					components: 'Bankname',
					title: this.$t1('修改银行卡名称')
				},
				{
					components: 'UpdateBankName',
					title: this.$t1('修改银行卡名称')
				},
				{
					components: 'Bankcard',
					title: this.$t1('修改银行卡号')
				},
				{
					components: 'Savemoney',
					title: this.$t1('入款未到账')
				},
				{
					components: 'Suggestion',
					title: this.$t1('投诉与建议')
				},
				{
					components: 'Problem',
					title: this.$t1('常见问题帮助中心')
				},
				{
					components: 'ProblemDetail',
					title: this.$t1('问题中心')
				},
				{
					components: 'Phoneser',
					title: this.$t1('电话客服')
				},
				{
					components: 'serverWebView',
					title: this.$t1('24H客服中心')
				}
			]
		}
	},
	methods: {
		// 返回
		jump(name) {
			uni.navigateBack()
		},
		jumpPage(name) {
			this.currPage = name
		}
	},
	computed: {
		// 当前路由页面
		getShowPage() {
			const target = this.router.find(e => e.components == this.currPage)
			console.log("target",target)
			if (target) {
				return target.components
			}
			return 'Home'
		},
		// 当前标题
		getShowTitle() {
			const target = this.router.find(e => e.components == this.currPage)
			if (target) {
				return target.title
			}
			return this.$t1('客服中心')
		}
	},
	onBackPress(event) {
		if (this.currPage == 'Home') {
			uni.redirectTo({
				url: '/pages/index/index'
			});
			return true;
		}
	},
	onShow(){
		// #ifdef H5
		uni.setNavigationBarTitle({
			title: window.projectName
		})
		// #endif
	},
	onLoad(option) {
		uni.setStorageSync('pagesId', option.id)
		console.log("option",option)
		this.currPage = option.name
		// this.$emit('jump', option.name)
	}
}
