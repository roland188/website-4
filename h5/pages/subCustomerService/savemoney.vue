<!-- 入款未到账 -->
<template>
	<view>
		<view class="scs-back">
			<image @click="goBack()" class="scs-back-icon" src="./lib/image/head-back.png" />
			<text>{{ $t1('入款未到账') }}</text>
			<text class="goDetail" @tap="tapConfirm">{{ $t1('进度查询') }}</text>
		</view>
		<view class="scs-content">
			<view>
				<input type="text" v-model="account" class="inputStyle" :placeholder="$t1('请输入入款姓名')" />
			</view>
			<view>
				<input type="text" v-model="nickname" class="inputStyle" :placeholder="$t1('请输入真实姓名')" />
			</view>
			<view>
				<input type="number" v-model="money" class="inputStyle" :placeholder="$t1('请输入入款金额')" />
			</view>
			<view class="">
				<text class="upload-text">{{ $t1('上传订单截图') }}</text>

				<uniFilePicker v-model="imageValue" file-extname="png,jpg" :limit="1" fileMediatype="image" mode="grid" @select="select"
				 @progress="progress" @success="success" @fail="fail" />
			</view>

			<view class="submit" hover-class="bg-click" @click="onSubmit">
				{{ $t1('提交') }}
			</view>
			<view class="tips">
				{{ $t1('温馨提示：近期由于风控严重转账会有延迟情况，请您在提交入款资料后耐心等待，5-10分钟后点击进度查询确认是否成功，若成功但没有收到款项请联系24H在线客服咨询处理') }}
			</view>
			<uni-popup ref="showDlg" type="dialog">
				<view class='get-high-rebate-box' @tap.stop>
					<view class='title'>{{ $t1('提示') }}</view>
					<view class='money'> {{ $t1('提交成功，请点击进度查询查看处理状态') }} </view>
					<view class='btns'>
						<view class='themeTextTwo u-flex-all' @click='tapCancel'>{{ $t1('取消') }}</view>
						<view class='themeColor u-flex-all' @click='tapConfirm'>{{ $t1('进度查询') }}</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>
<script>
		import uniFilePicker from './components/uni-file-picker/uni-file-picker.vue'
	import config from './lib/config'
	import api from './lib/api'
	import i18nT from './mixins/i18n'
	import {
		_get,
		_post
	} from './lib/server'
	export default {
		components:{uniFilePicker},
		mixins: [i18nT],
		data() {
			return {
				account: "", // 用户名
				money: "", // 金额
				nickname: "", // 姓名
				subSwitch: false,
				imageValue: [],

			}
		},

		mounted() {

			console.log(config)
			if (config.username) {
				this.account = config.username;
			}
		},

		methods: {

			// 获取上传状态
			select(e) {
				let _this = this;
				const tempFilePaths = e.tempFilePaths;
				uni.uploadFile({
					url: config.baseURL + '/longm/api/v1/file/upload',
					filePath: tempFilePaths[0],
					name: 'file',
					formData: {},
					success: (uploadFileRes) => {
						
						const imageValue = JSON.parse(uploadFileRes.data).data.url;
						// console.log(imageValue)
						 _this.imageValue[0] = imageValue
					}
				});
			},
			// 获取上传进度
			progress(e) {
				console.log('上传进度：', e)
			},

			// 上传成功
			success(e) {
				console.log('上传成功')

			},

			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			},
			// 提交
			onSubmit() {
				console.log(this.imageValue)
				if (this.account == '') {
					uni.showToast({
						icon: "none",
						title: this.$t1("请输入会员账号"),
						duration: 2000,
					})
					return
				} else if (this.nickname == '') {
					uni.showToast({
						icon: "none",
						title: this.$t1("请输入入款姓名"),
						duration: 2000,
					})
					return
				} else if (this.money == '') {
					uni.showToast({
						icon: "none",
						title: this.$t1("请输入入款金额"),
						duration: 2000,
					})
					return
				} else if (this.imageValue == '') {
					uni.showToast({
						icon: "none",
						title: this.$t1("请上传图片"),
						duration: 2000,
					})
					return
				}

				const query = {
					amount: this.money,
					annex: this.imageValue[0],
					memeberName: config.dealaccount(this.account),
					realName: this.nickname,
				}
				if (this.subSwitch) {
					return
				} else {
					this.subSwitch = true;
				}
				_post(api.addSaveApply, query).then(res => {
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
					this.$emit('jump', 'Saverecord')
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

	.upload-text {
		display: block;
		margin-bottom: 30upx;
		font-size: 26upx;
		font-family: PingFang SC;
		font-weight: 700;
		color: #161616;
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
