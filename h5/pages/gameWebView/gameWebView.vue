<template>
	<view class="webView">
		<view class="p-d-100">
			<!-- 竖屏显示 -->
			<web-view  :webview-styles="webviewStyles"  :src="url"></web-view>
			<!-- 横屏显示 -->
			<movable-area class="movableArea">
				<movable-view class="movableView" direction="all" :x="'0rpx'" :y="'300rpx'">
					<button @click="goToHomePage" class="floating-button">{{$t('返回')}}</button>
				</movable-view>
			</movable-area>
			
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			webviewStyles: {
				progress: {
					color: '#D6AE66'
				}
			},
			url: '',
			routerType: '',
			urlCode: '',
			sh:0,
			modalShow :true,
			screenHeight:'',
			newUrl:'',
			widthH:'100%',
		};
	},
	onBackPress(event) {
		console.log(event);
	},
	onLoad() {
		// #ifdef APP-PLUS
		//取消锁定屏幕方向
		plus.screen.unlockOrientation();
		// #endif
		let getWebView = this.$server.getWebView();
		console.log("getWebView",getWebView)
		if (getWebView) {
			let webUrl = getWebView.webUrl //this.$server.decode(getWebView.webUrl);
			this.url = webUrl;
			this.routerType = getWebView.routerType;
			this.urlCode = getWebView.urlCode;
			uni.setNavigationBarTitle({
				title: getWebView.title ? getWebView.title : this.$config.appName
			});
		}
		// #ifdef H5
		const element = document.documentElement; // 或者任何你想要全屏的元素
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
			// document.webkitFullscreenElement.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if(element.webkitEnterFullscreen) {
			element.webkitEnterFullscreen(); // Safari-specific
		}
		// #endif
	},
	onReady(){
		
	},
	onUnload() {
		// #ifdef APP-PLUS
		// 锁定屏幕方向
		plus.screen.lockOrientation('portrait-primary');
		// #endif
		// #ifdef H5
		// 锁定屏幕方向
		// plus.screen.lockOrientation('portrait-primary');
		if (document.exitFullscreen) {
		   document.exitFullscreen();
		 } else if (document.mozCancelFullScreen) {
		   document.mozCancelFullScreen();
		 } else if (document.webkitExitFullscreen) {
		   document.webkitExitFullscreen();
		 } else if (document.msExitFullscreen) {
		   document.msExitFullscreen();
		 }
		// #endif

		// this.afterGameTransfer();
	},
	methods: {
		goToHomePage(){
			// this.handleOrientationChange()
			uni.navigateBacks()
		},
		 handleOrientationChange() {
		      if (window.orientation === 90 || window.orientation === -90) {
		        // 如果方向是横屏，强制切换回竖屏
		        window.orientation === 90
		          ? (document.body.style.transform = "rotate(90deg)")
		          : (document.body.style.transform = "rotate(-90deg)");
		      } else {
		        // 如果方向是竖屏，恢复正常
		        document.body.style.transform = "none";
		      }
		}
	}
};
</script>

<style lang="scss" scoped>
	.webView{
		width: 100%;
		height: 100vh;
		// display: flex;
		// flex-direction: column;
		// justify-content: center;
		// align-items: center;
	 //    position: relative;
	}
	.p-d-100{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// width: 100%;
		// height: 100vh;
	
	}
	.floating-button {
		border: none;
		border-radius: 100%;
		cursor: pointer;
		z-index: 9999;
		width: 120rpx;
		height: 120rpx;
		line-height: 120rpx;
		font-size: 22rpx;
		text-align: center;
		border: 2px solid #4d72d9;
		box-shadow: 3px 1px 4px 1px #fff;
	}
	.movableArea {
		position: absolute;
		top: 100rpx;
		left: 0;
		width: 100%;
		height: calc(100% - 220rpx);
		pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素
		z-index: 99999;
		.movableView {
			pointer-events: auto; //可以点击
			width: 146rpx;
			height: auto;
		}
	}
	.webViewlink-1{
		// position: absolute;
		// top: 0;
		// left: 0;
		// right: 0;
		// bottom: 0;
		// z-index: 99999;
		width: 100%;
		height: 100vh;
		// background: red;
		// width: 100%;
		// height:  calc(100% - 150rpx);
	}
    
</style>
