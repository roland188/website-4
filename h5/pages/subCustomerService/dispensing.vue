<!-- 出款未到账 -->
<template>
	<view>
		<view class="scs-back">
			<image @click="goBack()" class="scs-back-icon" src="./lib/image/head-back.png" />
			<text>{{ $t1('出款未到账') }}</text>
			<text class="goDetail" @tap="tapConfirm">{{ $t1('进度查询') }}</text>
		</view>
		<view class="scs-content">
			<view>
				<input type="text" v-model="account" class="inputStyle" :placeholder="$t1('请输入会员账号')" />
			</view>
			<view>
				<input type="number" v-model="money" class="inputStyle" :placeholder="$t1('请输入提款金额')" />
			</view>
			<view>
				<uniDatetimePicker type="date" :value="datetime" @change="changeDatetime" />
			</view>
			<view class="codewrap">
				<input type="text" v-model="captchaCode" class="inputStyle" :placeholder="$t1('请输入验证码')" />
				<image class="code" :src="captcha_image_content" mode="" @click="getImgCode()"></image>
			</view>

			<view class="submit" hover-class="bg-click" @click="onSubmit">
				{{ $t1('提交') }}
			</view>
			<view class="tips">
				{{ $t1('温馨提示：近期由于风控严重转账会有延迟情况，请您在提交出款资料后耐心等待，5-10分钟后点击进度查询确认是否成功，若成功但没有收到款项请联系24H在线客服咨询处理') }}
			</view>
			<uniPopup ref="showDlg" type="dialog">
				<view class='get-high-rebate-box' @tap.stop>
					<view class='title'>{{ $t1('提示') }}</view>
					<view class='money'> {{ $t1('提交成功，请点击进度查询查看处理状态') }} </view>
					<!-- 	<view class='multiple'>请点击进度查询查看处理状态倍</view> -->
					<view class='btns'>
						<view class='themeTextTwo u-flex-all' @click='tapCancel'>{{ $t1('取消') }}</view>
						<view class='themeColor u-flex-all' @click='tapConfirm'>{{ $t1('进度查询') }}</view>
					</view>
				</view>
			</uniPopup>
		</view>
	</view>
</template>
<script>
	import uniDatetimePicker from "./components/uni-datetime-picker/uni-datetime-picker.vue";
	import uniPopup from './components/uni-popup/uni-popup.vue';
	import config from './lib/config'
	import api from './lib/api'
	import i18nT from './mixins/i18n'
	import {
		_get,
		_post
	} from './lib/server'
	export default {
		components: {
			uniDatetimePicker,
			uniPopup
		},
		mixins: [i18nT],
		data() {
			return {
				account: "", // 用户名
				money: "", // 金额
				captchaKey: '', // 验证码key值
				captcha_image_content: "",
				captchaCode: '', // 图片验证码
				datetime: '', // 申请出款时间
				subSwitch: false,

			}
		},

		mounted() {
			this.getImgCode()
			console.log(config)
			if (config.username) {
				this.account = config.username;
			}
		},

		methods: {
			// 获取图片验证码
			getImgCode() {
				_get(api.getImgCode).then(res => {
					if (res) {
						this.captchaKey = res.data.captchaKey;
						this.captcha_image_content = res.data.captcha_image_content;
					}
				})
			},
			// 提交
			onSubmit() {
				if (this.account == '') {
					uni.showToast({
						icon: "none",
						title: this.$t1("请输入会员账号"),
						duration: 2000,
					})
					return
				} else if (this.money == '') {
					uni.showToast({
						icon: "none",
						title: this.$t1("请输入提款金额"),
						duration: 2000,
					})
					return
				} else if (this.captchaCode == '') {
					uni.showToast({
						icon: "none",
						title: this.$t1("请输入验证码"),
						duration: 2000,
					})
					return
				}
				const query = {
					memberName: config.dealaccount(this.account),
					withdrawalAmount: this.money,
					applyWithdrawalTime: this.datetime,
					captchaKey: this.captchaKey,
					captchaCode: this.captchaCode
				}
				if (this.subSwitch) {
					return
				} else {
					this.subSwitch = true;
				}
				_post(api.addDespening, query).then(res => {
					this.getImgCode();
					if (res.code == 0) {
						this.$refs.showDlg.open();
						setTimeout(() => {
							this.subSwitch = false;
						}, 1000)
					} else {
						this.subSwitch = false;
						uni.showToast({
							icon: "none",
							title: res.msg,
							duration: 2000,
						})
					}
				})
			},
			// 时间新增
			changeDatetime(time) {
				this.datetime = time;
			},
			// 取消弹窗
			tapCancel() {
				this.$refs.showDlg.close()
			},
			// 跳转到记录
			tapConfirm() {
				if (config.username == "" || !config.username) {
					uni.showToast({
						icon: "none",
						title: this.$t1("您还未登录"),
						duration: 2000,
					})
					this.$refs.showDlg.close()
					return
				} else {
					this.$emit('jump', 'Disrecord')
				}
			},
			goBack() {
				uni.navigateBack()	
				// this.$emit('jump', 'Home')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.scs-back {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 700;
		color: #323233;
		position: relative;
		border-bottom: 1rpx solid #eee;
		background-color: #fff;

		.scs-back-icon {
			width: 26rpx;
			height: 26rpx;
			position: absolute;
			top: 26rpx;
			left: 26rpx;
		}

		.goDetail {
			position: absolute;
			right: 30upx;
			font-size: 26upx;
			color: #2d2b4d;
		}
	}

	.get-high-rebate-box {
		width: 536upx;
		background-color: #fff;
		border-radius: 16upx;
		color: #1D1717;
		padding: 16upx 0;

		view {
			text-align: center;
		}

		.title {
			height: 50upx;
			font-size: 36upx;
			font-weight: bold;
			line-height: 50upx;
			margin: 32upx 0 8upx 0;
		}

		.money {
			height: 60upx;
			font-size: 26upx;
			line-height: 60upx;
			margin: 20upx 0;

		}

		.multiple {
			height: 42upx;
			font-size: 30upx;
			font-weight: 500;
			line-height: 42upx;
			margin: 16upx 0 24upx 0;
		}

		.btns {
			width: 100%;
			display: flex;
			border-top: 1px solid #F4F4F4;

			view {
				flex: 1;
				font-size: 30upx;
				height: 80upx;
			}

			view:nth-child(1) {
				border-right: 1px solid #F4F4F4;
			}

		}
	}

	.tips {
		margin: 0 auto;
		font-size: 24upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #F9A425;
		opacity: 1;
		text-align: left;
	}
</style>
<style lang="scss" scoped src="./scs.scss"></style>

</style>
