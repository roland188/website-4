<!-- 客服-忘记登录密码 -->
<template>
  <view :class="{thme1: !$config.isRxpjProject, thme2: $config.isRxpjProject}" >
    <view class="scs-content">
      <view v-show='firstSwitch'>
        <view>
          <input type="text" v-model="name" class="inputStyle" :placeholder="$t1('请输入会员账号')" />
        </view>
        <view>
          <input type="text" v-model="realName" class="inputStyle" :placeholder="$t1('请输入真实姓名')" />
        </view>
        <view class="codewrap">
          <input type="text" v-model="captchaCode" class="inputStyle" :placeholder="$t1('请输入验证码')" />
          <image class="code" :src="captcha_image_content" mode="" @click="getImgCode()"></image>
        </view>
      </view>
      <view v-show="secondSwitch">
        <view>
          <input type="text" disabled v-model="name" class="inputStyle" :placeholder="$t1('请输入手机号')" />
        </view>
        <view class="codewrap">
          <input type="text" v-model="smsCode" class="inputStyle" :placeholder="$t1('请输入验证码')" />
          <text class="code" v-if="codeSwitch" @click="getCode()">{{ $t1('获取验证码') }}</text>
          <text class="code codeTime" v-else>{{time}} S{{ $t1('后重新获取') }} </text>
        </view>
      </view>
      <view :class="{submit: !$config.isRxpjProject, 'ny-button ny-button-primary': $config.isRxpjProject}"  @tap="onSubmit" hover-class="bg-click" v-if="this.pagesId==3">
        {{ $t1('自助解冻') }}
      </view>
      <view :class="{submit: !$config.isRxpjProject, 'ny-button ny-button-primary': $config.isRxpjProject}"  hover-class="bg-click" @tap="onSubmit" v-else>
        {{ $t1('提交') }}
      </view>
    </view>
  </view>
</template>
<script>
	import config from '../lib/config'
	import api from '../lib/api'
	import i18nT from '../mixins/i18n'
	import {
		_get,
		_post
	} from '../lib/server'
	export default {
		components: {

		},
		mixins: [i18nT],
		data() {
			return {
				firstSwitch: true, // 第一步
				secondSwitch: false, // 第二步
				name: "", // 用户名
				realName: "", // 姓名
				showPhone: "", // 手机号
				phone: "",
				captchaKey: '', // 验证码key值
				captcha_image_content: "",
				captchaCode: '', // 图片验证码
				smsCode: '', // 手机验证码
				codeSwitch: true, // 倒计时状态
				time: null, // 倒计时
				cutInter: null,
				sign: '', // 返回的验证标识
				subSwitch: false,
				pagesId: '', // 跳转的id标识
				pagesPath: ''
			}
		},

		mounted() {
			this.getImgCode()
			if (config.username) {
				this.name = config.username;
			}
			this.pagesId = uni.getStorageSync('pagesId');
		},
		watch: {
			phone: {
				handler(val) {
					this.showPhone = val.substr(0, 3) + "****" + val.substr(7);
				},
				immediate: true,
			},
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
			
				if (this.firstSwitch) {
					if (this.name == '') {
						uni.showToast({
							icon: "none",
							title: this.$t1("请输入会员账号"),
							duration: 2000,
						})
						return
					} else if (this.realName == '') {
						uni.showToast({
							icon: "none",
							title: this.$t1("请输入真实姓名"),
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
					this.firstSubList()
				} else {
					this.secondSubList()
				}
			},
			// 第一次验证
			firstSubList() {
				this.getImgCode()
				let query = {
					name: config.dealaccount(this.name),
					realName: this.realName,
					captchaCode: this.captchaCode,
					captchaKey: this.captchaKey,
				}
			
				if (this.subSwitch) {
					return
				} else {
					this.subSwitch = true;
				}
				_post(api.vertifyInfo,query).then(res => {
					setTimeout(() => {
						this.subSwitch = false;
					}, 3000);
					if (res.code == 0) {
						this.phone = res.data.phone;
						this.sign = res.data.sign;
						this.firstSwitch = false;
						this.secondSwitch = true;
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg,
							duration: 2000,
						})
					}
				})
			},
			// 获取验证码
			getCode() {
				// if (this.phone == '') {
				// 	uni.showToast({
				// 		icon: "none",
				// 		title: "请输入验证码",
				// 		duration: 2000,
				// 	})
				// 	return
				// }

				_get(api.mobilebyacc + '/' + config.dealaccount(this.name) + '?functionId=6').then((res, err) => {
					if (res.code == 0) {
						this.codeSwitch = false;
						this.cotDown(60);
						uni.showToast({
							icon: "success",
							title: this.$t1("验证码发送成功"),
							duration: 2000,
						})
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg,
							duration: 2000,
						})
					}
				})
			},
			// 倒计时
			cotDown(val) {
				let time = val;
				this.time = time;
				this.cutInter = setInterval(() => {
					time--;
					this.time = time;
					if (time <= 0) {
						clearInterval(this.cutInter)
						this.codeSwitch = true;
					}
				}, 1000)
			},
			// 第二步验证
			secondSubList() {
				if (this.pagesId == 3) {
					this.thawFun()
				} else {
					this.getPasswordFun();
				}
			},
			// 忘记登录密码 
			getPasswordFun() {
				let query = {
					name: config.dealaccount(this.name),
					// phone: this.phone,
					smsCode: this.smsCode
				}
				if (this.subSwitch) {
					return
				} else {
					this.subSwitch = true;
				}
				_post(api.vertifySmscode, query).then(res => {
					setTimeout(() => {
						this.subSwitch = false;
					}, 3000);
					if (res.code == 0) {
						uni.setStorageSync('sign', this.sign)
						uni.setStorageSync('smsCode', this.smsCode)
						if (this.pagesId == 1) {
							this.$emit('jump', 'UpdatePassword')
						}
						if (this.pagesId == 4) {
							this.$emit('jump', 'SetWithdrawalpsd')
						}
						if (this.pagesId == 5 || this.pagesId == 6) {
							this.$emit('jump', 'UpdateBankName')
						}

					} else {
						uni.showToast({
							icon: "none",
							title: res.msg,
							duration: 2000,
						})
					}
				})
			},
			// 账号解冻 
			thawFun() {
				const data = {
					name: config.dealaccount(this.name),
					realName: this.realName,
					// phone: this.phone,
					smsCode: this.smsCode,
					sign: this.sign
				};
				if (this.subSwitch) {
					return
				} else {
					this.subSwitch = true;
				}
				_post(api.thaw, data).then(res => {
					if (res) {
						uni.showToast({
							icon: "success",
							title: this.$t1('提交成功!'),
							duration: 2000,
						})
						uni.navigateBack()
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg,
							duration: 2000,
						})
						return
					}
				})
			},
		}
	}
</script>

<style lang="scss"  scoped  src="../scs.scss"></style>