<!-- 平头哥 -->
<template>
	<view class="centerBox">
		<uni-nav-bar leftIcon="back" :title="$t('安全中心')" @clickLeft="BackPage"  :fixed="true" :statusBar="true">
		</uni-nav-bar>
		<view class="centerList" @tap='goLink(1)'>
			<view class="listLeft">
				<!-- <image class="listIcon" src="../../static/image/centerImg/c11.png" mode="widthFix"></image> -->
				<view class="listName themeTextOne oneTitleColor8">
					{{ $t('登录密码') }}
				</view>
			</view>
			<view class="listRight">
				<view class="rightName">
					{{ $t('去修改') }}
				</view>
				<image class="more" src="../../static/image/qqImg/cMore.png" mode="widthFix"></image>
			</view>
		</view>
		
		<view class="centerList" @tap='goLink(2)'>
			<view class="listLeft">
				<!-- <image class="listIcon listIcon3" src="../../static/image/centerImg/c22.png" mode="widthFix"></image> -->
				<view class="listName themeTextOne oneTitleColor8">
					{{ $t('取款密码') }}
				</view>
			</view>
			<view class="listRight">
				<view class="rightName">
					{{withdrawPassWordState? $t('去修改'):$t('去设置')}}
				</view>
				<image class="more" src="../../static/image/qqImg/cMore.png" mode=""></image>
			</view>
		</view>
		
		<view class="centerList centerList1" @tap='goLoginPhone'>
			<view class="listLeft">
				<!-- <image class="listIcon listIcon3" src="../../static/image/centerImg/c22.png" mode="widthFix"></image> -->
				<view class="listName themeTextOne oneTitleColor8">
					{{ $t('登录设备管理') }}
				</view>
			</view>
			<view class="listRight">
				<image class="more" src="../../static/image/qqImg/cMore.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				withdrawPassWordState:false,
			}
		},
		onLoad(options) {
			if(options){
				this.withdrawPassWordState=options.withdrawPassWordState
			}
			console.log(this.withdrawPassWordState)
		},
		methods: {
			goLoginPhone() {
				uni.navigateTo({
				    url: '../loginPhone/loginPhone'
				});
			},
			goLink(type){
				let passStatus = true;
				if(type==2){
					passStatus = this.withdrawPassWordState
				}
				uni.navigateTo({
				    url: '../upPassword/upPassword?type='+type+'&isPassWord='+passStatus
				});
			},
			BackPage() {
				uni.navigateBacks({})
			}
		}
	}
</script>

<style scoped>
 @import url("./index.css");
</style>
