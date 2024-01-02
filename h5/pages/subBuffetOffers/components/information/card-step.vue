<template>
	<view class="card">
		<!-- header -->
		<view class="card-header">
			<text>{{$t('完成进度')}}</text>
			<view>
				<text class="themeSizeColor">{{flagStep.length}}</text>/{{num}}
			</view>
		</view>
		<!-- 内容 -->
		<view class="card-content">
			{{$t('完成以下所有任务可领取')}}<text class="themeSizeColor">{{items && items.amount}}{{$t('元')}}</text>{{$t('奖励')}}
		</view>
		<!-- 按钮 -->
		<view class="card-btn" :class="{'active': items && items.status === 1}" @tap="handleTap(items)">
			{{ getStatus(items)}}
		</view>
	</view>
</template>

<script>
	import childStore from '../../utils/store.js'
	export default {
		props:{
			items:{
				type:Object,
				default: () => {}
			},
			flagStep:{
				type:Array,
				default: ()=>[]
			},
			num:{
				type:Number,
				default:0 
			}
		},
		data() {
			return {
				btnListText:[this.$t('未达到领取要求'),this.$t('领取'),this.$t('已领取')]
			};
		},
		computed: {
			selfHelpItem(){
				return  childStore.state.selfHelpItem || {}
				
			}
		},
		methods:{
			// 获取状态
			getStatus(items){
				return items ? this.btnListText[items.status || 0] : this.btnListText[0]
			},
			// 领取接口
			handleTap(items){
				if(items.status !==1 ) return
				let betNo = ''
				this.$api.putReceive(this.selfHelpItem.id, betNo, (err, res) => {
					if(err) return false
					if(res){
						uni.showToast({
							icon:'success',
							title:this.$t('领取成功')
						})
						// 个人信息认证
						// uni.$emit('handleUpdata',4)
						this._getThematicActivitiesByApp(this.selfHelpItem.id)
					}
				},false)
			},
			// 数据处理所有
			_getThematicActivitiesByApp(id){
				this.$api.getThematicActivitiesByApp(id,(err,res)=>{
					if(err) return 
					if(res){
						childStore.commit('setSelfHelpItem',res)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.card{
    background-color: #fff;
    border-radius: 16upx;
    margin: 22upx 0;
    padding: 30upx;
	font-size: 30upx;
}
.card-header{
	display: flex;
	justify-content: space-between;
	font-size: 30upx;
	font-weight: bold;
}
.card-content{
	padding: 22upx 0;
	font-size: 26upx;
	color: #999;
}
.card-btn{
	background: #d2d2d2;
	box-shadow: 0 6upx 12upx #e6e4e4;
	border-radius: 8upx;
	color: #fff;
	margin: 22upx;
	text-align: center;
	height: 80upx;
	line-height: 80upx;
	&.active{
		background: var(--themeBtnBg);
		box-shadow: 0 6upx 12upx #e6e4e4;
		color: #fff;
	}
}

</style>
