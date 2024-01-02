<template>
	<view style="height:100%;overflow: hidden;background-color: #F7F7F7;">
		<cu-custom style="background-color: #ffffff;" :isBack="true" :leftUrl="leftUrl">
			<block slot="backText"></block>
			<block slot="content">{{$t('详情记录')}}</block>
		</cu-custom>
		<details-Comp :ginseng="topupOrTransfer"></details-Comp>
	</view>
</template>
<script>
	import detailsComp from '@/components/detailsComp/detailsComp.vue';
	export default{
		components: { detailsComp },
		data(){
			return{
				topupOrTransfer:{},
				leftUrl:'',
			}
		},
		onLoad(val) {
			this.topupOrTransfer = val
			if(this.id === 'true'){
				this.leftUrl = '../firstRecord/firstRecord?id=3'
			}else{
				this.leftUrl = '../firstRecord/firstRecord?id=3.1'
			}
		},
	}
</script>
