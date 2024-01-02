<!-- 大转盘 -->
<template>
	<view class="customerService">
		<view class="web">
			<web-view class="getHeight" :webview-styles="webviewStyles"  :src="customerServiceUrl" @message="getH5Message"></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				headerTitle: this.$t('大转盘'),
				customerServiceUrl:'',
				wbeHeight:'600',
				statusBarHeight: 20,
				webviewStyles: {
					progress: {
						color: '#cb3318'
					}
				},
				info:{}
			};
		},
		onLoad(option) {
			let activityItem = this.$cache.get('activityItem')
			uni.getSystemInfo({
			    success: (res)=> {   
					this.wbeHeight = res.screenHeight - res.statusBarHeight - 20;
					this.statusBarHeight = res.statusBarHeight
					this.info = res
			    }  
			});  
			let _this = this
			let obj = {};
			obj.host = _this.$config.host;
			obj.clientCode = _this.$config.clientCode;
			obj.username = _this.$server.getUser() && _this.$server.getUser().username;
			obj.language = uni.getStorageSync('lang') || 'zh_CN';
			obj.initpage = option.initpage || ''
			obj.token = this.$cache.get('access_token')
			obj.activityId = activityItem.urlId
			//#ifdef H5
			obj.type = 1;
			obj.theme = window.theme || 'a024';
			obj.isShowBack = 1
			obj.clientItem = window.childCode;
			obj.projectImgUrl = window.projectImgUrl;
			var str = JSON.stringify(obj);
			str = window.btoa(str);
			// let url = activityUrl + "/h5/index.html?s=" + str;
			let url = window.location.origin + '/func/'+ activityItem.expand.actFolder + "/h5/index.html?s=" + str;
			this.customerServiceUrl = url;
			// #endif
			
			// #ifdef APP-PLUS
			//新客服
			obj.type = 2;
			obj.statusHeight = this.statusBarHeight
			obj.theme = _this.$config.theme || 'a024';
			obj.clientItem = _this.$config.childCode;
			obj.projectImgUrl = _this.$config.projectImgUrl;
			obj.isShowBack = 1
			var str = JSON.stringify(obj);
			str = new Buffer(str).toString('base64')
			let url = activityItem.expand.actUrl + "/h5/index.html?s=" + str;
			console.log(url,'url')
			this.customerServiceUrl = url;
			//	#endif
		},
		methods:{
			goBack(){
				this.$pageBack.pageBack()
				// uni.navigateBack({
				// 	delta: 1
				// })
			},
			getH5Message(message){
				// #ifdef APP-PLUS
				console.log(message.detail,'message.detail')
				if(message.detail.data[0].action ==='back'){
					uni.navigateBack({
						delta:1
					})
				}
				//	#endif
			}
		}
	}
</script>

<style lang="scss" scoped>	
.customerService{
	padding-top: 80upx;
	// position: relative;
}
.back{
	position: absolute;
	top: 0;
	left: 0;
	width: 120upx;
	height: 82upx;
	line-height: 82upx;
	text-align: center;
	z-index: 999;
	background-color: #fff;
	
}

.status_bar {
      height: var(--status-bar-height);
      width: 100%;
  }

</style>
