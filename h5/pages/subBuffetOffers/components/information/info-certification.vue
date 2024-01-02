<!-- 信息认证 -->
<template>
	<view class="info-container">
		<Marquee :text="selfHelpItem.marquee" />
		<card-step :items="selfHelpItem.infoAuthVO" :flagStep="flagStep" :num="listData.length"></card-step>
		<view class="info-content-box" >
			<!-- 信息列表 -->
			<block v-for="(item,i) in listData" :key="i">
				<info-list :items="item"></info-list>
			</block>
		</view>
	</view>
</template>

<script>
	import childStore from '../../utils/store.js'
	import cardStep from './card-step.vue'
	import infoList from './info-list.vue'
	import Marquee from '../marquee/index.vue'
	export default {
		components:{cardStep,infoList,Marquee},
		data() {
			return {
				infoAuthVO:{},
				list:[],
				flagStep:[],
				infoList:[
					{
						title:this.$t('银行卡绑定'),
						text: this.$t('用户提款操作'),
						status: 0 ,// 显示按钮没有完成操作
						btnTxt: this.$t('去绑定'),
						href:'/pages/addBank/addBank?type=0',
						conditionCode:"bank"
					},
					{
						title:this.$t('银行卡管理'),
						text: this.$t('用户提款操作'),
						status: 0 ,// 显示按钮没有完成操作
						btnTxt: this.$t('去绑定'),
						href:'/pages/bankList/bankList',
						conditionCode:"origin"
					},
					{
						title:this.$t('资金密码'),
						text: this.$t('用于提现或设置个人资料信息'),
						status: 0 , // 显示按钮没有完成操作
						btnTxt: this.$t('去设置'),
						href:'/pages/upPassword/upPassword',
						conditionCode: "safePassword"
					},
					{
						title:this.$t('绑定手机'),
						text: this.$t('用于账户验证信息'),
						status: 1 , // 1 完成
						btnTxt: this.$t('去绑定'),
						href:'/pages/personal/personal',
						conditionCode:"phone"
					},
					{
						title:this.$t('绑定qq'),
						text: this.$t('用于账户验证信息'),
						status: 1 , // 1 完成
						btnTxt: this.$t('去绑定'),
						href:'/pages/personal/personal',
						conditionCode:"qq"
					},
					{
						title:this.$t('绑定邮箱地址'),
						text: this.$t('用于账户验证信息'),
						status: 1 , // 1 完成
						btnTxt: this.$t('去绑定'),
						href:'/pages/personal/personal',
						conditionCode:"email"
					},
					{
						title:this.$t('绑定用户昵称'),
						text: this.$t('用于账户验证信息'),
						status: 1 , // 1 完成
						btnTxt: this.$t('去绑定'),
						href:'/pages/personal/personal',
						conditionCode:"realName"
					},
					{
						title:this.$t('绑定数字货币'),
						text: this.$t('用于数字货币交易'),
						status: 1 , // 1 完成
						btnTxt: this.$t('去绑定'),
						href:'/pages/addBank/addBank?type=1',
						conditionCode:"digitalCurrency"
					},
					{
						title:this.$t('累计存款'),
						text: this.$t('历史累计存款需达'),
						status: 1 , // 1 完成
						btnTxt: this.$t('去存款'),
						href:'/pages/recharge/recharge',
						conditionCode:"deposit"
					},
				]
			};
		},
		computed:{
			selfHelpItem(){
				return  childStore.state.selfHelpItem || {}
				
			},
			listData(){
				let list = [];
				try{
					console.log('信息认证列表数据===>',this.selfHelpItem)
					let res = this.selfHelpItem.infoAuthVO
					if(res && res.list.length > 0){
						this.infoList.forEach((items,i)=>{
							if(items.conditionCode === 'deposit'){
								items.text +=  res.deposit + this.$t('元以上')
							}
							res.list.map((row,i)=>{
								if(row.conditionCode === items.conditionCode){
									list.push({...items,flag:row.flag})
								}
							})
						})
						this.flagStep = res.list.filter(items=>items.flag)
					} 
				}catch(e){
					//TODO handle the exception
				}
				
				return list
			},
		}
	}
</script>

<style lang="scss" scoped>
.info-container{
	margin: 40upx 32upx;
}
.info-content-box{
	padding: 20upx 30upx;
	background-color: #fff;
	border-radius: 16upx;
}
</style>
