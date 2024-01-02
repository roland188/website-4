<template>
	<view class="dhsp-container">
		<uni-nav-bar left-icon="back" :title="headerTitle" @clickLeft="goBack"  right-icon="headphones" @clickRight="goServer"></uni-nav-bar>
		<view class="dhsp-content">
			<image class="img-box" src="" mode=""></image>
			<view class="dhsp-row">
				<view class="dhsp-col dhsp-1">{{$t('宝马')}}</view>
				<view class="dhsp-col dhsp-2 dhsp-title">
					{{$t('提示')}}
				</view>
				<view class="dhsp-col dhsp-3">
					{{$t('单价')}}
				</view>
				<view>{{$t('数量：')}}</view>
				<view class="dhsp-col dhsp-4">
					<input type="text"/> <text>{{$t('最大')}}</text>
				</view>
				<view class="dhsp-col dhsp-5">{{$t('积分总计')}}</view>
			</view>
		</view>
		<view class="hdq-address-row" v-if="list.length > 0">
			 <view class="hdq-address-item" v-for="(shop,i) in list" :key="i">
				 <view class="hdq-address-col" @click="clickItem(shop,i)">
					 <view class="hdq-address-label">
						 <uni-icons :type="chosenAddressId===shop.id ? 'checkbox-filled' : 'circle'" size="24" :color="chosenAddressId===shop.id ? '#ff2a2a' : '#c8c9cc'"></uni-icons>
					 </view>
					 <view class="hdq-address-dl">
					 	<view class="hdq-address-dd"><text style="marginRight: 5px;">{{shop.recipient}}</text>{{shop.phoneNumber}}
					 		<text class="hdq-address-default" v-show="shop.status===1">默认</text>
					 	</view>
					 	<view class="hdq-address-dt">{{shop.address}}</view>
					 </view>
				 </view>
				 <view class="hdq-address-edit" @click="onEdit(shop,i)">
					  <uni-icons  type="compose" size="24"></uni-icons>
				 </view>
			 </view>
		 </view>
		<view class="address" @click="onAdd" v-if="list.length === 0">{{$t('请添加收货地址')}}</view>
		<view class="hdq-footerBtn">
			<view class="hdq-vant-button cancel" @click="goBack">{{$t('取消')}}</view>
			<view class="hdq-vant-button confirm" @click="submit">{{$t('立即兑换')}}</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data(){
			return {
				headerTitle: this.$t('积分商城'),
				list:[],
				selectItem: {},
				chosenAddressId: '',
			}
		},
		onLoad() {
			this.selectItem = this.getMallChangeItem()
			this.addressList()
		},
		methods:{
			//点击某项地址时
			clickItem(val) {
				this.selectItem = val;
				this.chosenAddressId = val.id
				console.log(val)
			},
			//新增地址
			onAdd(item) {
				this.$store.commit('setEditItem', {})
				uni.navigateTo({
					url: './PersonInfo'
				})
			},
			//编辑地址
			onEdit(item, index) {
				this.$store.commit('setEditItem', item)
				uni.navigateTo({
					url: './PersonInfo?index=' + index
				})
			},
			//获取收货地址列表
			addressList() {
				this.list = [];
				this.$api.shoppingExchangeAddress((err, res) => {
					if (err) return
					// let data = res
					this.list = res
					if(res.length > 0){
						let arr = res.filter(items=>items.status ===1)
						this.chosenAddressId = arr.length > 0 ? arr[0].id : ''
					}
				})
			},
			...mapGetters(['getMallChangeItem'])
		}
	}
</script>

<style lang="scss" scoped>
	.dhsp-container{
		background-color: #f7f7f7;
		height: 100%;
		padding: 4px;
	}
	.dhsp-content{
		display: flex;
		width: 100%;
		// padding:0 10px;
		background-color: #FFFFFF;
		margin: 8upx auto 10upx auto;
		font-size: 26upx;
		border-radius: 6upx;
	}
	.img-box{
		width:200upx;
		height: 200upx;
		background-size: 100% 100%;
	}
	.dhsp-col{
		line-height: 80upx;
	}
	.dhsp-1{
		color: #333;
	}
	.dhsp-2{
		color: #ff2a2a;
		line-height: 0.5;
	}

	.hdq-address-row{
		background-color: #fff;
	}
	.hdq-address-item{
		display: flex;
		padding: 12px;
		margin-bottom: 12px;
		align-items: center;
	}
	.hdq-footerBtn {
		padding: 20px 0;
		box-sizing: border-box;
		text-align: center;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;
		background-color: #fff;
		width: 100%;
		z-index: 2;
	}
	.hdq-address-label{
		margin-right: 12px;
	}

	.hdq-address-check{
		width: 1.25em;
		height: 1.25em;
	}
	.hdq-address-col{
		display: flex;
		align-items: center;
		flex: 1;
	}
	.hdq-address-dl{
		flex: 1;
		color: #323233;
		/* line-height: 20px */
	}
	.hdq-address-default{
		padding: 3px 10upx;
		background-color: #ff2a2a;
		border-radius: 20px;
		font-size: 12px;
		color: #fff;
		margin-left: 10px;
		vertical-align: text-top;
		/* margin-top: 10px; */
	}
	.hdq-address-dd{
		font-size: 18px;
		margin-bottom: 14upx;
		/* line-height: 30upx; */
	}
	.hdq-address-dt{
		font-size: 14px;
		color: #5b5b5d;
		/* line-height: 20upx; */
	}
	.hdq-address-edit{
		width: 120upx;
		text-align: right;
		margin-right: 10px;
	}
	.hdq-vant-button {
		width: 80px;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		border-radius: 5px;
		margin: 0 20upx;
	}

	.cancel {
		color: #323233;
		background-color: #fff;
		border: 1px solid #ebedf0;
	}

	.confirm {
		margin-left: 10upx;
		color: #fff;
		background-color: #ff2a2a;
		border: 1px solid #ee0a24;
	}
</style>
