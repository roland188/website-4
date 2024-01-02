<template>
	<view>
	<view class="promo-container">
		<view class="promo-list">
			<!-- <view class="give-none" v-if="promoWashCodeList.length===0">-暂无记录-</view> -->
			<view class="promo-item">
				<view class="promo-top-common">
					<text class="color32">{{$t('洗码积分')}}</text>
					<text class="color33 font-w">{{promoWashCodeItem.rebateAmount||'0'}}{{$t('元')}}</text>
				</view>
				<view class="promo-top-common">
					<text class="coloraa font-12" v-if="promoWashCodeItem.rebateDown">{{promoWashCodeItem.rebateDown}}{{$t('元起领')}}</text>
					<text class="coloraa font-12" v-else></text>
					<text class="coloraa font-12">{{$t('奖励金额')}}</text>
				</view>
				<view class="promo-bet-content">
					<view class="promo-top-common">
						<text class="color33 font-w"><text class="coloraa font-12">{{$t('总有效投注')}}：</text>{{promoWashCodeItem.totalEffect}}</text>
						<text class="color33 font-w" v-show="isRebate"><text class="coloraa font-12">{{$t('返点比例')}}：</text>{{rebatePercent}}</text>
					</view>
					<view class="promo-detail" @tap="hanldleDetail(promoWashCodeItem)">{{$t('查看明细')}}</view>
				</view>
			</view>
		</view>
	</view>
	<view class="btn-box">
			<view class="lucky-lin" v-if="isStatus">
				<text class="themeSizeColor" >{{$t('当前尚未达到领取条件')}}</text> <uni-icons type="help" size="14" color="#f00"></uni-icons>
			</view>
			<view class="btn" :class="{'active-btn': rebateAmount}" @tap="handleGet">
				{{rebateAmount ? $t('领取') : $t('不可领取') }}
			</view>
		</view>
</view>
</template>

<script>

	export default {
		data(){
			return {
				statusText:[this.$t('未领取'),this.$t('领取'),this.$t('已领取')],
				isStatus: false,
				isGet:false,
				isRebate: false
			}
		},
		computed:{
			rebatePercent(){
				try{
					const {nowMemberVip} =  this.userdata || {}
					let vip = {
						0: '0.80%',
						1: '0.80%',
						2: '0.85%',
						3: '0.85%',
						4: '1.00%',
						5: '1.10%',
						6: '1.20%',
					}[nowMemberVip.vipLevel]
					return vip
				}catch(e){
					return ''
				}
				
			},
			rebateAmount(){
				// 当前返水金额 小于最小值 提示文本 当前尚未达到领取条件
				let flag = this.promoWashCodeItem.rebateAmount * 1 > this.promoWashCodeItem.rebateDown * 1
				this.isGet = flag
				return flag
			},
			...mapState({
				promoWashCodeItem:state=>state.selfHelp.promoWashCodeItem,
				memberId:state=>state.mall.memberId,
				userdata:state=>state.myPage.userdata
			})
		},
		methods:{
			// 点击调整详情
			hanldleDetail(items){
				if(items){
					// this.setPromoWashCodeItem(items)
					uni.navigateTo({
						url:'/pages/customerReport/customerReport?tab='+ 2
					})
				}
			},
			// 点击领取返水 
			handleGet(){
				if(this.isGet){
					this.$api.getUserReceiveFanshui(this.memberId,(err,res)=>{
						if(res){
							uni.showToast({
								icon:'none',
								title:'领取成功'
							})
							this.getPromoData()
							// uni.$emit('handleUpdata',2)
						}
					})
				}
			},
			getPromoData(){
				this.$api.getUserFanshui(this.memberId,(err,res)=>{
					if(res){
						// const {rebateAmount,remark,status,totalDeducted,totalEffect,totalReceived,rebateDown,rebateAmount} = res || {} 
						this.setPromoWashCodeItem(res)
					}
				})
			},
			...mapMutations(['setPromoWashCodeItem'])
		}
	}
</script>

<style scoped>
	.promo-container{
		padding-bottom: 160upx;
	}
	.give-none{
		color: #999;
		text-align: center;
		margin: 32upx;
		font-size: 28upx;
	}
	.promo-list{
		padding: 20upx;
	}
	.promo-item{
		border-radius: 16upx;
		padding: 30upx 30upx 10upx 30upx;
		background-color: #FFFFFF;
		font-size: 26upx;
	}
	.promo-top-common{
		display: flex;
		justify-content: space-between;
		/* text-align: center; */
	}
	.font-w{
		font-weight: 700;
	}
	.font-12{
		font-size: 22upx;
	}
	.promo-bet-content{
		margin: 25upx 0;
		border-top: 1upx solid #f2f2f2;
		padding-top: 30upx;
	}
	.promo-detail{
		opacity: .68;
		border-color: #627be4;
		color: #627be4;
		box-shadow: 0 4upx 10upx rgb(105 145 230 / 10%);
		width: 260upx;
		height: 72upx;
		line-height: 72upx;
		font-size: 24upx;
		margin-top: 20upx;
		text-align: center;
		margin: 20upx auto;
		border-radius: 40upx;
	}
	.promo-btn{
		box-shadow: 0 4upx 10upx rgb(0 0 0 / 10%);
		width: 260upx;
		height: 72upx;
		line-height: 72upx;
		font-size: 24upx;
		margin-top: 20upx;
		text-align: center;
		margin:0 auto;
		border-radius: 40upx;
		opacity: 1;
		background-color: #d2d2d2;
		border-color: #d2d2d2;
		color: #888;
	}
	.btn-box{
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 1;
		background-color: #fff;
		padding: 12upx 34upx 32upx ;
		box-sizing: border-box;
	}
	.lucky-lin{
		height: 40upx;
		line-height: 30upx;
		font-size: 22upx;
		color: #aaa;
	}
	.btn{
		color: #fff;
		background: #d2d2d2;
		box-shadow: 0 3px 6px #d2d2d2;
		border-radius: 8upx;
		text-align: center;
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
	}
	.active-btn{
		background-color: var(--themeBtnBg);
		color: #FFFFFF;
	     /* box-shadow: 0 3px 6px #d2d2d2; */
	}
</style>
