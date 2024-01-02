<!-- 周勤奖励 -->
<template>
	<view class="reward">
		<Marquee :text="selfHelpItem.marquee" />
		<!-- <view class="header-tip">{{tip}}</view> -->
		<!-- 上周勤奖励卡片 -->
		<weekly-reward-tag :timeText="timeText" :tagContent="tagContent" :weeklyList="weeklyList"></weekly-reward-tag>
		<!-- 本周数据周勤奖励列表 -->
		<weekly-reward-list :list="lastWeekSignData.weekSignRecordList" :isShowPopup="true" :thisObj="thisObj" isBen></weekly-reward-list>
	</view>
</template>

<script>
	import childStore from '../../utils/store.js'
	import weeklyRewardTag from './weekly-reward-tag.vue'
	import weeklyRewardList from './weekly-reward-list.vue'
	import Marquee from '../marquee/index.vue'
	export default {
		components:{
			weeklyRewardTag,
			weeklyRewardList,
			Marquee
		},
		data() {
			return {
				tip:this.$t('温馨提示：每天14点统计更新上一天的有效投注额！'),
				thisWeekSignData:[], // 本周考勤数据
				weeklyList:[
					{text:this.$t('累计出勤（天）'),totalMoney:0,props:'totalSignCount'},
					{text:this.$t('累计投注（元）'),totalMoney:0.00,props:'totalBetAmountValid'},
					{text:this.$t('周勤奖励（元）'),totalMoney:0.00,props:'amount'},
				],
				timeText:this.$t('每周二发放上周奖金'),
				weekText:[this.$t('周一'),this.$t('周二'),this.$t('周三'),this.$t('周四'),this.$t('周五'),this.$t('周六'),this.$t('周日')],
				tagContent:{
					titleLeft:this.$t('上周周勤'),
					isShowImg: true,
				},
				thisObj:{
					totalSignCount: 0,
					totalBetAmountValid: 0
				}
				
			};
		},
		computed:{
			selfHelpItem(){
				return  childStore.state.selfHelpItem || {}
				
			},
			lastWeekSignData(){
				let list = []
				try{
					this.thisObj = this.selfHelpItem?.speActWeekSignVO?.thisWeekSignData || {}
					let obj = this.selfHelpItem.speActWeekSignVO
					if(obj){
						// 当前时间数据
						list = this.getWeekData(obj,'thisWeekSignData')
						let res = this.getWeekData(obj,'lastWeekSignData')
						childStore.commit('setThisWeekSignDataList',res.weekSignRecordList)
						// this.setThisWeekSignDataList(res.weekSignRecordList)
					}
				}catch(e){
					this.thisObj = {}
					//TODO handle the exception
				}
				return list
			}
		},
		methods:{
			// 处理数据 上周和下周
			getWeekData(obj,name){
				// 处理 tag数据
				this.weeklyList.forEach((items,i)=>{
					if(obj[name].hasOwnProperty(items.props)){
						items.totalMoney = obj[name][items.props]
					}
				})
				// 处理列表数据
				if(obj[name] && obj[name].weekSignRecordList.length > 0){
					obj[name].weekSignRecordList.forEach((item,idx)=>{
						item.week = this.weekText[item.weekType-1]
					})
				}
				
				return {...obj[name]}
			},
		}
	}
</script>

<style lang="scss">
.reward{
	height: calc(100vh - 200rpx);
	width: 100%;
	// background-color: red;
	padding: 10upx 30upx;
	box-sizing: border-box;
	// margin-top: 60px;
}
.header-tip{
	height: 36upx;
	font-size: 26upx;
	line-height: 36upx;
	color: #e91919;
	margin-bottom: 16upx;
}
.weekly-reward-container{
	padding: 0 24upx;
	box-sizing: border-box;
	background: #fff;
	border-radius: 16upx;
}
</style>
