<!-- 小夫 -->
<template>
	<view class="page" style="height:100%;overflow: hidden;">
		<cu-custom style="background-color: #ffffff;" :isBack="true" :leftUrl="leftUrl" :rightId="rightId" @show="show" @distinguish="distinguish">
			<block slot="backText"></block>
			<block slot="content">{{ $t('充值记录') }}</block>
			<block slot="right" v-if="isTrue != 2">{{ $t('筛选') }}</block>
			<!-- <block slot="right">筛选</block> -->
		</cu-custom>
		<view class="header">
			<view :class="{ borderBottom: isTrue === 0}" @tap="switchs(0)">
				<text>{{ $t('充值记录') }}</text>
			</view>
			<view :class="{ borderBottom: isTrue === 1 }" @tap="switchs(1)">
				<text>{{ $t('银行卡转账') }}</text>
			</view>
			<view :class="{ borderBottom: isTrue === 2 }" @tap="switchs(2)">
				<text>{{ $t('数字货币') }}</text>
			</view>
		</view>
		<view class="scrollComponent">
			<re-Cord ref="changeData" :record="isTrue" :parameters="parameterData"></re-Cord>
		</view>
		<view class="screening" :class="{screeningShowStyle:screeingShow}" :style="{'margin-top':top+'rpx'}">
			<view class="screeingContent">
				<screen-Ing ref="screeing" :screeingId="value" @show="show"></screen-Ing>
			</view>
		</view>
	</view>
</template>

<script>
import reCord from '@/components/record/record.vue';
import screenIng from '@/components/screening/screening.vue';
export default {
	components: { reCord,screenIng },
	data() {
		return {
			tabbarId:0,
			isTrue: true,
			value: '',
			leftUrl:'../report/report',
			rightId:'',
			recordData: '',
			parameterData:{},
			screeingShow:'',
            top:0,
		};
	},
	methods: {
		switchs(val) {
			this.isTrue = val;
			this.parameters = {
				highestAmount:'',
				minimumAmount:'',
				dateStart:'',
				dateEnd:'',
				val:'',
				conversion:''
			};
			if(val === 0){
				this.value = '3'
				this.rightId = 'prepaidScreen'
				this.$refs.changeData.change(this.value,0,1);
			}else if(val === 1){
				this.value = '3.1'
				this.rightId = 'transferScreen'
				this.$refs.changeData.change(this.value,1,1);
			}else{
				this.value = '3.2'
				this.rightId = 'currency'
				this.$refs.changeData.change('3.2',2,1);
			}
		},
		//头部传过来的值，是否弹出筛选页面
		show(showId,parameter,data){
			this.screeingShow = showId
			if(showId){
				this.$refs.screeing.trigger()
				//筛选弹出 让后退按钮变为隐藏，而非路径
				this.leftUrl = 'hidden'
			}else{
				if(parameter == 'parameter'){
					this.parameterData = data
					this.$refs.changeData.change(this.value,this.isTrue,'',this.parameterData);
				}
				// switch(this.rightId){
				// 	case 'GameScreening':
				this.leftUrl = '../report/report'
				// 	break;
				// }
				
			}
		},
		distinguish(value){
			if(value === 'prepaidScreen'){
				this.isTrue = 0
			}else if(value === 'transferScreen'){
				this.isTrue = 1
			}else if(value === 'currency'){
				this.isTrue = 2
			}
		}
	},
	onLoad(value) {
		this.value = value.id
		this.isTrue = 0;
        // #ifdef APP-PLUS
            this.top = 70
        // #endif
		// 判断列表是否有数据,没有就沾是空列表页面
	},
	mounted() {
		this.$refs.changeData.change(this.value,0);
		this.isTrue = 0
	}
};
</script>

<style scoped>
@import url('./firstRecord.css');
page {
	position: relative;
	width: auto;
	height: 100%;
	background-color: #ffffff;
	box-sizing: border-box;
	border-top: 2rpx solid #f0f0f0;
}
.page {
	display: flex;
	flex-direction: column;
}
.screening{
	display: none;
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	background:rgba(0,0,0,0.3);
	top: 90rpx;
	z-index: 999;
}
.screeingContent{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 70%;
	background-color: #fff;
}
.screeningShowStyle{
	display: inline-block;
}
</style>
