<template>
	<view style="height:100%;background-color: #F7F7F7;">
		<cu-custom style="background-color: #ffffff;" :isBack="true" :leftUrl="leftUrl">
			<block slot="backText"></block>
			<block slot="content">{{ $t('详情记录') }}</block>
		</cu-custom>
		<dra-Wal :detailsId="detailsId"></dra-Wal>
	</view>
</template>
<script>
	import draWal from '@/components/drawal/drawal.vue';
	export default{
		components: { draWal },
		data(){
			return{
				detailsId:'',
				leftUrl:'../../withdrawalRecord/withdrawalRecord?id=4',
			}
		},
		onLoad(val) {
			this.detailsId = val.id
		},
	}
</script>
