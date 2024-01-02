<template>
	 <!-- 侧边栏 -->
	<view class="footer-page">
		<view class="row-1">
			<image src="@/static/image/indexImg/foot-icon1.png" class="s1" mode="widthFix"></image>
			<image :src="$config.platformLogo('logo')" class="s2" mode="widthFix"></image>
		</view>
		<view style="margin: 20upx 0;">
			{{projectName}}{{$t('是线上最佳国际博彩平台。我们平台提供多服务；上体育到各种小游戏；我们体育拥有最全面的赛事滚球盘服务。我们每日，每周和每月都享有活动和赛事。玩家可通过电脑，平板和手机上在观看各种免费体育赛事直播。')}}
		</view>
		<view class="join-box">
			<view style="font-size: 32upx;">
				{{$t('点击加入我们社交群')}}
			</view>
			<view class="join-icons">
				<image src="@/static/image/indexImg/join-1.png" mode="" @click="jump('https://www.facebook.com/profile.php?id=61554022412665')"></image>
				<image src="@/static/image/indexImg/join-2.png" mode="" @click="jump('https://twitter.com/bg_jogos')"></image>
				<image src="@/static/image/indexImg/join-3.png" mode="" @click="jump('https://t.me/offcial_bg_game')"></image>
				<image src="@/static/image/indexImg/join-4.png" mode="" @click="jump('https://www.instagram.com/bg.jogos/')"></image>
			</view>
			<view style="padding: 20upx 0;">
				<image style="width: 128upx;height: 128upx;" src="@/static/image/indexImg/foot-2.png" mode=""></image>
				<view style="color: #b5b6b6;">
					{{projectName}}{{$t('由 Ocean Gaming Ltd. 运营（注册号：000028773），地址位于贝利兹城，巴拉克路 9 号，其拥有在安祖安（Anjouan）许可证号 ALSI-092309010-F14 下运营游戏软件和/或提供游戏机会的所有权。支付由注册于赛普勒斯尼科西亚 2063 号 3 楼 Oneworld Parkview House Prodromou Avenue 75 号的 Ocean Gaming Limited（ΗΕ 436201）处理，作为两家公司间协议约定的支付代理。')}}
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// #ifdef H5
				projectName: window.projectName,
				// #endif 
				// #ifdef APP_PLUS
				projectName:this.$config.projectName
				// #endif
			};
		},

		methods: {
			jump(url){
				// #ifdef APP-PLUS
				plus.runtime.openURL(url);
				// #endif
				// #ifdef H5
				const newWin = window.open()
				newWin.location.href = url
				// #endif
			}
		},
	};
</script>

<style lang="scss" scoped>
	.footer-page {
		.row-1 {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.s1 {
				width: 48upx;
				height: 48upx;
				margin-right: 6upx;
			}

			.s2 {
				width: 246upx;
				height: 76upx;
			}
		}

		.join-icons {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin: 24upx 0;

			&>uni-image {
				width: 62upx;
				height: 62upx;
				margin-right: 30upx;
			}
		}

	}
</style>
