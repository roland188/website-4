
export default {
	data(){
		return {
		}
	},
	methods: {
		// 返回
		goBack() {
			console.log(this.currPage)
			if (!this.currPage || this.currPage == 'Home') {
				uni.reLaunch({
					url: "/pages/index/index",
				})
			} else {
				this.$emit('jump', 'Home')
			}
		},
	},
}
