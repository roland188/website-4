<template>
	<view class="special">
		<view class="dec">{{selfHelpItem.summary}}</view>
		<view class="btn" @click="handleSubmit">{{$t('去领取')}}</view>
	</view>
</template>

<script>
	import childStore from '../utils/store.js'
	export default {
		data() {
			return {
			};
		},
		computed: {
			selfHelpItem(){
				return  childStore.state.selfHelpItem || {}
				
			}
		},
		methods:{
			handleSubmit(){
				try{
					this.$cache.set("activityId", this.selfHelpItem.id);
					this.$cache.set("activityUrl", this.selfHelpItem.speActBigWheelVO.thematicActivitiesUrl);
					uni.navigateTo({
						// url: "/pages/activity/activity",
						url: "/pages/thematic/thematic",
					});
				}catch(e){
					//TODO handle the exception
				}
			
			}
		}
	}
</script>

<style scoped>
	.special{
		padding: 30upx;
	}
	.dec{
		font-size: 28upx;
		color: #999;
	}
	.btn{
		background-color: var(--themeBtnBg);
		color: #fff;
		box-shadow: 0 3px 6px #e6e4e4;
		border-radius: 4px;
		margin: 40px 0;
		text-align: center;
		height: 45px;
		line-height: 45px;
		font-size: 15px;
	}
</style>
