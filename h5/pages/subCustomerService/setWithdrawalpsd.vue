<template>
	<!-- 设置取款新密码 -->
	<view class="scs-content">
		<view>
			<input type="text" v-model="password" class="inputStyle" :placeholder="$t1('请输入新密码')" />
		</view>
		<view>
			<input type="text" v-model="enterNum" class="inputStyle" :placeholder="$t1('请确认新密码')" />
		</view>
		<view class="submit" hover-class="bg-click" @click="onSubmit">
			{{ $t1('提交') }}
		</view>
	</view>
</template>

<script>
	import MyAes from "./lib/myAes.js"
	import api from './lib/api'
	import i18nT from './mixins/i18n'
	import {
		_get,
		_post
	} from './lib/server'
	export default {
		mixins: [i18nT],
		data() {
			return {
				password: '', // 密码
				enterNum: '', // 确认密码
				subSwitch: false,
			}
		},
		mounted() {

		},
		methods: {
			passwordCheck(pass) {
				if (/^\d{6}$/.test(pass)){
					return false
				} else {
					return this.$t1('取款密码只能是6位数字')
				}
			},
			onSubmit() {
			
				if (this.password == '') {
					uni.showToast({
						icon: "none",
						title: this.$t1("请输入新密码"),
						duration: 2000,
					})
					return
				} else if (this.password != this.enterNum) {
					uni.showToast({
						icon: "none",
						title: this.$t1("两次密码输入不一致"),
						duration: 2000,
					})
					return
				} else if (this.passwordCheck(this.password)) {
					uni.showToast({
						icon: "none",
						title: this.passwordCheck(this.password),
						duration: 2000,
					})
					return
				}
				// 加密
				let aseKey = 'pigxpigxpigxpigx';
				let encodePassword = MyAes.encrypt(this.password, aseKey);
				let data = {
					password: encodePassword,
					resetType: 2,
					sign: uni.getStorageSync('sign'),
					smsCode: uni.getStorageSync('smsCode')
				};
				if (this.subSwitch) {
					return
				} else {
					this.subSwitch = true;
				}
				_post(api.resetPassword, data).then(res => {
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
						this.subSwitch = false;
						uni.showToast({
							icon: "none",
							title: res.msg,
							duration: 2000,
						})
					}
				})
			}

		}
	}
</script>

<style lang="scss"  scoped src="./scs.scss"></style>
