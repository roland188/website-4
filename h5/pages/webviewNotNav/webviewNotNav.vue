<template>
	<view>
		<!-- 没有导航栏 -->
		<web-view :webview-styles="webviewStyles" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				webviewStyles: {
					progress: {
						color: '#cb3318'
					}
				},
			}
		},
		onLoad(option) {
			if (option) {
				if (option.url == 'mall') {
					//积分商城
					console.log(this.$server.getMallUrl(),'cccccccccccccccc')
					this.url = this.$server.getMallUrl();
					return;
				}
				
			}
		},
	}
</script>

<style>

</style>
