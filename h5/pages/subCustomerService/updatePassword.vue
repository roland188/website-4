<template>
	<!-- 设置登录新密码 -->
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
	import {
		_get,
		_post
	} from './lib/server'
	import i18nT from './mixins/i18n'
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
				if (pass.length < 6 || pass.length > 15) {
					return this.$t1('密码长度应该在6到15位')
				}
				// if (pass.includes(' ')) {
				// 	return '密码不能包含空格'
				// }
				let type = 0
				if ((/[0-9]/).test(pass)) {
					type += 1
				}
				if ((/[a-zA-Z]/).test(pass)) {
					type += 1
				}
				if (pass.replace(/[0-9a-zA-Z]/ig, '').length) {
					type += 1
				}
				if (type < 2) {
					return this.$t1('数字/字母/标点符号 密码中至少包含2种')
				}
				return false
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
				}else if(this.passwordCheck(this.password)){
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
					resetType: 1,
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

<style lang="scss" scoped src="./scs.scss"></style>
