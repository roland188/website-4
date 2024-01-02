<template>
	<view class="login-phone-layout">
		<uni-nav-bar leftIcon="back" :title="$t('登录设备管理')" @clickLeft="BackPage"  :fixed="true" :statusBar="true">
		</uni-nav-bar>
		<view class="remark">
			{{ $t('最近登录设备：你可以删除列表中的设备，删除后在该设备登录游戏时需要进行身份验证。') }}
		</view>
		<view class="conent">
			<view class="cu-list menu-avatar">
				<uni-swipe-action>
					<uni-swipe-action-item   v-for="(item,index) in phoneList" :key="index">
						<view class="cu-item" >
							<view class="content">
								<view class="title-text themeTextOne oneTitleColor8" >{{ item.lastLoginEquipment }}   
								</view>
								<view class="text-sm title-code themeTextTwo">
									{{ $t('最近登录') }}：{{ conversionTime(item.updatedAt) }}
									<text>ip:{{ item.sourceClientIp }}</text>
								</view>
								<view class="phoneText">{{ item.thisMachine ? $t('本机') : ''}}</view>
							</view>
							<view  class="cardYuan vipBorder" v-if="!isEdit && !item.select" @click="select(item,index)"> </view>
							<view v-if="!isEdit && item.select" @click="select(item,index)">
								<image   class="cardYuan cardYuanSelect vipBorder"  :src="$config.themeImgUrl('z1')" mode="widthFix" ></image>
							</view>
						</view>
						<template v-slot:right>
							<view class="delete" @click="deletePhone(item.id)"><text>{{ $t('删除') }}</text></view>
						</template>
					</uni-swipe-action-item>
				</uni-swipe-action>
				
			</view>
			<view class="" v-if="phoneList.length == 0">
				<view class="img-null">
					<image :src="$config.themeImgUrl('n1')" mode="widthFix"></image><br>
					<text>{{ $t('这里空空的什么都没有') }}</text>
				</view>
			</view>
			<view class="add-card">
				<view class="add-card-btn gameListActive" @click="deletePhone" :class="{'themeDisBtn':removeList.length == 0}"  v-if="!isEdit" >
					<text class="add-card-text">{{ $t('删除') }}</text>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				isEdit: true,
				isAllChecked: true,
				removeList:[],
				phoneList: []
			}
		},
		onShow() {
			this.getphoneList()
		},
		methods: {
			//获取绑定设备
			getphoneList() {
				let fingerprint = uni.getStorageSync('fingerprint');
				fingerprint? '' :  fingerprint = "123"
				this.$api.getPhonelist(fingerprint,(err, res) => {
					if(res) {
						this.phoneList = res;
					}
				})
			},
			deletePhone(id) {
				const self = this
				if(id) {
					this.$api.deletePhoneid(id, (err, res) => {
						if (err) {
							uni.showToast({
								icon:"none",
								duration: 2000,
								title: err.msg,
								position:"center"
							});
						}
						if (res) {
							uni.showToast({
								icon:"success",
								title: self.$t('删除成功'),
								duration: 2000,
								position:"center"
							});
							this.getphoneList();
						}
					})
				}
			},
			conversionTime(timeStamp) {
				if (timeStamp > 0) {
					var date = new Date();
					date.setTime(timeStamp);
					var y = date.getFullYear();
					var m = date.getMonth() + 1;
					m = m < 10 ? '0' + m : m;
					var d = date.getDate();
					d = d < 10 ? '0' + d : d;
					var h = date.getHours();
					h = h < 10 ? '0' + h : h;
					var minute = date.getMinutes();
					var second = date.getSeconds();
					minute = minute < 10 ? '0' + minute : minute;
					second = second < 10 ? '0' + second : second;
					return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
				} else {
					return '';
				}
			},
			select(item,index) {
				this.phoneList[index].select = !item.select
				let i = this.removeList.indexOf(item.id)
				if( i >= 0) {
					this.removeList.splice(i,1);
				} else {
					this.removeList.push(item.id)
				}
			},
			checkAll(){		
				this.isAllChecked = !this.isAllChecked;	
				this.removeList = [];	
				if(!this.isAllChecked){
						this.phoneList.map(item =>{
							item.select = true;
							this.removeList.push(item.id)
						})
				}else{
					this.phoneList.map(item =>{
						item.select = false;
						this.removeList = [];
					})
				}
			},
			BackPage() {
				uni.navigateBacks({})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.login-phone-layout ::v-deep .uni-navbar__header {
		width: 100%;
		height:100upx;
		line-height: 100upx;
		text-align: center;
		background-color:#ffffff;
		font-weight:700;
		color:#333333;
		font-size:18px;
	}
	
	.login-phone-layout ::v-deep .uni-navbar__header-btns-right {
		width: 160upx;
	}
	.login-phone-layout{
		width: 100%;
		height: 100%;
		padding-bottom: 130rpx;
		background-color: rgba(217, 219, 226, 0.25);
		.uni-navbar {
			height:100upx;
		}
		.remark {
			padding: 45px 20px 20px;
			color: #666666;
			font-size: 12px;
		}
		.bankheaderTitle {
			font-size: 16px;
			font-weight: 600;
			-webkit-box-flex: 1;
			-webkit-flex-grow: 1;
			flex-grow: 1;
			text-align: center;
		}
		.card {
			margin: 15px;
			background-color: #fff;
			border-radius: 8px;
			padding: 2px;
			padding-bottom: 15px;
			
		}
		.bankAdd {
			width: 36upx;
			height: 36upx;
		}

	}
	.p-centent{
		text-align: center;
		background-color: #FFFFFF;
		.item{
			line-height: 100rpx;
		}
		.line{
			border-bottom: 1px solid #f4f4f4;
		}
	}
	

	.title-img {
		flex-grow: 1;
		text-align: center;
	}

	.title-img image {
		width: 40px;
		height: 40px;
		vertical-align: text-top;
	}

	.code-name-code {
		flex-grow: 6;
		line-height: 1.5;
	}

	.title-code {
		font-size: 24rpx;
		color: #9a9a9a;
	}

	.title-text {
		font-size: 30rpx;
		color: #000;
		font-weight: 700;
		
	}
	.text-sm {
		text {
			margin-left: 30rpx;
		}
		
	}
	.phoneText {
		position: absolute;
		right: 20rpx;
		top: 24rpx;
		color: #fff;
	}
	.img-null {
		text-align: center;
		margin: 40px 0px;
	}

	.img-null image {
		width: 528rpx;
		height: auto;
	}

	.img-null text {
		font-size: 28rpx;
		font-family: PingFangSC;
		font-weight: 400;
		color: rgba(138, 137, 137, 1);
		line-height: 38rpx;
	}

	.add-card {
		position: fixed;
		bottom: 20upx;
		width: 100%;
		text-align: center;
	}
	.add-card-btn{
		border-radius: 60rpx;
		height: 80rpx;
		line-height: 70rpx;
		font-size: 30rpx;
		width: 90%;
		margin-left: 5%;
	}

	.add-card-text {
		// color: #000;
		font-size: 28rpx;
		display: inline-block;
		line-height: 1;
		vertical-align: middle;
	}

	.add-card-img {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10px;
		display: inline-block;
		vertical-align: middle;
	}

	.mycardtext {
		font-size: 30rpx;
		font-family: PingFangSC;
		font-weight: 400;
		color: rgba(72, 68, 64, 1);
		line-height: 43rpx;
		margin: 19rpx 0px 0px 34rpx;
		display: block;
	}
	.menu-avatar {
		::v-deep .button-group--right {
			display: flex;
			flex: 1;
			justify-content: center;
			align-items: center;
			width: 260rpx;
			background-color: #e54d42;
    		color: #fff;
			.delete {
				width: 100%;
				text-align: center;
			}
		}
	}
	.cu-item {
		display: flex;
		position: relative;
		width: 100%;
		height: 100rpx;
		background-color:#fff;
		padding: 20rpx 40rpx;
		align-items: center;
		border-top: 1px solid #ccc;
		.cardYuan {
			width: 20px;
			height: 20px;
			position: absolute;
			right: 16px;
			top: 50%;
			margin-top: -10px;
			border-radius: 50%;
		}
		.cardYuanSelect {
			background-size: cover;
		}

	}
	
</style>