<template>
	<view>
        <web-view style="background-color: #fff;" :webview-styles="webviewStyles" :src="url" ></web-view>
    </view>
</template>

<script>
import i18n from './lib/i18n'
export default {
	data() {
		return {
			url: '',
			webviewStyles: {
				progress: {
					color: '#cb3318'
				}
			},
			title: '',
			loading:true
		};
	},
    created(){
		if(this.$config.childCode==='aygj' || this.$config.childCode==='ffyl' || this.$config.childCode==='wnsr' || this.$config.childCode==='"yyyl'|| this.$config.childCode==='wyyl'|| this.$config.childCode==='wbgj'){
			this.url = uni.getStorageSync('newServer24')
		} else {
			this.url = uni.getStorageSync('customer_service')
		}
        uni.showLoading({
        	title: i18n.$t('加载中'),
        })
        setTimeout(()=>{
        	uni.hideLoading()
        },3000)
    }
};
</script>

<style >
	.preGuide-header{
		color: #fff;
	}
</style>
