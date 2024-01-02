<template>
	<!-- 设置银行卡名称 -->
	<view class="scs-content">
		<view class="positon_r">
			<input type="text" v-model="phoneNumber" class="inputStyle" :placeholder="$t1('请输入绑定的手机号')" />
		</view>
		<view class="positon_r" @tap="changeQuestionType">
			<input type="text" v-model="questionType" class="inputStyle" :placeholder="$t1('请选择您的问题')" />
			<image src="./lib/image/more.png" mode="aspectFit" class="right-more"></image>
		</view>
		<view class="submit" hover-class="bg-click" @click="onSubmit">
			{{ $t1('提交') }}
		</view>
		<uni-popup ref="popup" type="bottom" @tap.stop>
			<view class="popup-header">
				<view class="header-title"> {{ $t1('选择问题') }} </view>
				<view class="">
					<image src="./lib/image/close.png" class="closeImg" @click="onClosePopup" mode=""></image>
				</view>
			</view>
			<view class="padding-xl">
				<scroll-view scroll-y="true" class="scroll-Y">
					<view class="view-list" v-for="(item, index) in showList" :key="index" @click="getQuestionList(item, index)">
						<text class="radio-item-text">{{item}}</text>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
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
				phoneNumber: '',
				questionType: '',
				showList: [this.$t1('存取款问题'), this.$t1('优惠问题'), this.$t1('账户信息问题'), this.$t1('游戏问题'), this.$t1('其他问题')],
				subSwitch: false,
			}
		},
		mounted() {},
		methods: {
			changeQuestionType() {
				this.$refs.popup.open();
			},

			getQuestionList(row) {
				console.log(row)
				this.questionType = row;
				this.$refs.popup.close();
			},
			onClosePopup() {
				this.$refs.popup.close();
			},
			onSubmit() {
				const query = {
					phone: this.phoneNumber,
					questionTypeName: this.questionType
				}
				if (this.subSwitch) {
					return
				} else {
					this.subSwitch = true;
				}
				_post(api.phoneUser, query).then(res => {
					if (res.code == 0) {
						uni.showToast({
							icon: "success",
							title: this.$t1("提交成功"),
							duration: 2000,
						})
						setTimeout(() => {
							this.subSwitch = false;
							uni.navigateBack()
						}, 1000)
					} else {
						console.log(res.msg)
						uni.showToast({
							icon: "none",
							title: res.msg,
							duration: 2000,
						})
						this.subSwitch = false;
					}
				})
			}
		}
	}
</script>

<style lang="scss"  scoped src="./scs.scss"></style>
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
			justify-content: flex-end;
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
