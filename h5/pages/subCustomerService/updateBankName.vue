<template>
	
	<view class="scs-content">
		<!-- 设置银行卡名称 -->
		<view v-if="pagesId==5">
			<view class="positon_r" @tap="changeCardNum">
				<input type="text" v-model="cardValue" class="inputStyle" :placeholder="$t1('请选择银行卡号')" />
				<image src="./lib/image/more.png" mode="aspectFit" class="right-more"></image>
			</view>
			<view class="positon_r" @tap="changeCardName">
				<input type="text" v-model="nameValue" class="inputStyle" :placeholder="$t1('请选择银行名称')" />
				<image src="./lib/image/more.png" mode="aspectFit" class="right-more"></image>
			</view>
		</view>
		<!-- 设置银行卡号 -->
		<view v-else>
			<view class="positon_r" @tap="changeCardNum">
				<input type="text" v-model="cardValue" class="inputStyle" :placeholder="$t1('请选择银行卡号')" />
				<image src="./lib/image/more.png" mode="aspectFit" class="right-more"></image>
			</view>
			<view class="positon_r">
				<input type="text" v-model="changecard" class="inputStyle" :placeholder="$t1('请修改银行卡号')" />
			</view>
		</view>
		<view class="submit" hover-class="bg-click" @click="onSubmit">
			{{ $t1('确认修改') }}
		</view>
		<uni-popup ref="card_name_popup" type="bottom" @tap.stop>
			<view class="popup-header">
				<view class="header-title"> {{ $t1('选择银行') }} </view>
				<view class="">
					<image src="./lib/image/close.png" class="closeImg" @click="onClosePopup" mode=""></image>
				</view>
			</view>
			<view class="padding-xl">
				<scroll-view scroll-y="true" class="scroll-Y">
					<view class="view-list" v-for="(item, index) in bankList" :key="index" @click="getCardName(item, index)">
						<text class="radio-item-text">{{item.name}}</text>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		<uni-popup ref="card_num_popup" type="bottom" @tap.stop>
			<view class="popup-header">
				<view class="header-title"> {{ $t1('选择银行卡号') }} </view>
				<view class="">
					<image src="./lib/image/close.png" class="closeImg" @click="onClosePopup" mode=""></image>
				</view>
			</view>
			<view class="padding-xl">
				<scroll-view scroll-y="true" class="scroll-Y">
					<view class="view-list" v-for="(item, index) in memberList" :key="index" @click="getCardNum(item, index)">
						<text class="radio-item-text">{{item}}</text>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import MyAes from "./lib/myAes.js"
	import api from './lib/api'
	import {
		_get,
		_post
	} from './lib/server'
	import i18nT from './mixins/i18n'
	export default {
		mixins: [i18nT],
		data() {
			return {
				cardValue: '', // 银行卡号
				nameValue: '', // 银行名称
				changecard: '', // 修改卡号
				bankList: [], // 
				memberList: [],
				memberListMore: [],
				originMemberInfo: [],
				subSwitch: false,
				pagesId: '', // 跳转的id标识
				test: ''
			}
		},
		mounted() {
			this.pagesId = uni.getStorageSync('pagesId');
			console.log(this.pagesId)
			this.getBankInfo()
		},
		methods: {
			// 获取数据信息
			getBankInfo() {
				let data = {
					sign: uni.getStorageSync('sign')
				};
				_post(api.bankInfo, data).then(res => {
					if (res.data) {
						console.log(res)
						this.originMemberInfo = res.data.memberBanks;
						this.bankList = res.data.bankLists;
						this.memberListMore = Array.from(res.data.memberBanks, x => x.number)
						this.memberList = Array.from(res.data.memberBanks, x => x.name + '-' + x.number.substr(x.number.length - 4));
					}
				})
			},

			// 选择卡号
			changeCardNum() {
				this.$refs.card_num_popup.open();
			},
			// 选择名称
			changeCardName() {
				this.$refs.card_name_popup.open();
			},
			// 获取银行卡名称
			getCardName(row) {
				console.log(row)
				this.nameValue = row.name;
				this.$refs.card_name_popup.close();
			},
			// 获取银行卡卡号
			getCardNum(row) {
				console.log(row)
				this.cardValue = row;
				this.$refs.card_num_popup.close();
			},

			onClosePopup() {
				this.$refs.card_num_popup.close();
				this.$refs.card_name_popup.close();
			},

			onSubmit() {
				console.log('进入')
				console.log('this.pagesId', this.pagesId)
				let card = this.memberListMore[this.memberList.indexOf(this.cardValue)];
				let newid = this.originMemberInfo.filter(v => v.number == card)[0].id;
				let data = {};
				console.log('id1', newid)
				if (this.pagesId == 5) {
					if(this.cardValue == '' || this.nameValue == ''){
						uni.showToast({
							icon: "none",
							title: this.$t1("请选择银行卡号或名称"),
							duration: 2000,
						})
						return
					}
					console.log('1')
					 data = {
						id: newid,
						name: this.nameValue,
						type:1,// 更新卡名称
						sign: uni.getStorageSync('sign'),
						smsCode: uni.getStorageSync('smsCode')
					};
				} else {
					console.log('2')
					const num = this.changecard.length;
					if (!this.cardValue) {
						uni.showToast({
							icon: "none",
							title: this.$t1("请选择银行卡"),
							duration: 2000,
						})
						return
					} else if (num > 19 || num < 12) {
						uni.showToast({
							icon: "none",
							title: this.$t1("设置成功请输入12位到19位的卡号"),
							duration: 2000,
						})
						return
					}
					console.log('id2', newid)
					 data = {
						id: newid,
						type:2,// 更新卡号
						number: this.changecard,
						sign: uni.getStorageSync('sign'),
						smsCode: uni.getStorageSync('smsCode')
					};
				}
				if (this.subSwitch) {
					return
				} else {
					this.subSwitch = true;
				}
				_post(api.updateBankInfo, data).then(res => {
					if (res.code == 0) {
						uni.showToast({
							icon: "success",
							title: this.$t1("设置成功"),
							duration: 2000,
						})
						setTimeout(() => {
							this.subSwitch = false;
							uni.navigateBacks();
						}, 1000)
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg,
							duration: 2000,
						})
						this.subSwitch = false;
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped src="./scs.scss"></style>
<style lang="scss" scoped>
	.scs-content {
		.positon_r {
			position: relative;

			.right-more {
				width: 50upx;
				height: 50upx;
				position: absolute;
				top: 20upx;
				right: 20upx;
			}
		}

		.popup-header {
			background: #ffffff;
			display: flex;
			justify-content:flex-end;
			padding: 25rpx 10rpx;
			border-bottom: 1px solid #f5f6f8;

			.header-title {
				flex-grow: 2;
				text-align: center;
			}

			.closeImg {
				width: 40rpx;
				height: 40rpx;
				vertical-align: middle;
				// float: right;
			}
		}

		.padding-xl {
			padding: 0px;
			background: #ffffff;

			.scroll-Y {
				max-height: 300px;
				padding: 0px 15px;
			}

			.view-list {
				text-align: left;
				line-height: 3.5;
			}

			.radio-item-img {
				width: 30px;
				height: 30px;
				margin-right: 10px;
				vertical-align: middle;
			}

			.radio-item-text {
				width: 90%;
				text-align: left;
			}

			.radio-item-img-activty {
				width: 13px;
				height: 10px;
				margin-left: 46rpx;
			}
		}
	}
</style>
