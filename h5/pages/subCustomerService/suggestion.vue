<!-- 投诉与建议 -->
<template>
	<view class="scs-content">
		<view>
			<input type="text" v-model="account" class="inputStyle" :placeholder="$t1('请输入会员账号')" />
		</view>
		<view>
			<textarea class="inputStyle textarea" :placeholder="$t1('您的投诉与建议')" v-model="message"></textarea>
		</view>

		<view class="">
			<text class="upload-text">{{ $t1('上传截图') }}</text>
			<uniFilePicker v-model="imageValue" :limit="1" file-extname="png,jpg" fileMediatype="image" mode="grid" @select="select" @success="success"/>
		</view>

		<view class="submit" hover-class="bg-click" @click="onSubmit">
			{{ $t1('提交') }}
		</view>
	</view>
</template>
<script>
	import uniFilePicker from './components/uni-file-picker/uni-file-picker.vue'
	import config from './lib/config'
	import api from './lib/api'
	import {
		_get,
		_post
	} from './lib/server'
	import i18nT from './mixins/i18n'
	export default {
		components: {
			uniFilePicker
		},
		mixins: [i18nT],
		data() {
			return {
				account: "",
				money: "",
				message: "",
				subSwitch: false,
				imageValue: [],
				imageList: [],
				uploadUrl: config.baseURL + '/longm/api/v1/file/upload'
			}
		},

		mounted() {
			if (config.username) {
				this.account = config.username;
			}
		},

		methods: {
			successFails(list){
				console.log(list)
				const res = list.map(item => {
					let resItem = JSON.parse(item);
					return resItem.url;
				});
				this.imageList = [...this.imageList, ...res];
				uni.showModal({
					content : this.$t1('上传成功,详细信息请看控制台')
				});
			},
			deleteFails(e){
				console.log(e)
				const { data, index} = e;
				this.imageList.splice(index,1)
				uni.showModal({
					content: this.$t1("删除成功,详细信息请看控制台"),
					showCancel: true
				});
			},
			// 获取上传状态
			select(e) {
				// console.log("获取上传状态",e)
				// let _this = this;
				// const tempFilePaths = e.tempFilePaths;
				// console.log(tempFilePaths,"tempFilePaths====")
				// uni.uploadFile({
				// 	url: config.baseURL + '/longm/api/v1/file/upload',
				// 	filePath: tempFilePaths[0],
				// 	name: 'file',
				// 	formData: {},
				// 	success: (uploadFileRes) => {
				// 		const imageValue = JSON.parse(uploadFileRes.data).data.url;
				// 		console.log(imageValue,"imageValue=======")
				// 		_this.imageValue[0] = imageValue
				// 	}
				// });
			},
			success(e){
				this.imageValue[0] = e
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
				} else if (this.message == '') {
					uni.showToast({
						icon: "none",
						title: this.$t1("请输入投诉与建议"),
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
					annex: this.imageValue[0],
					memeberName: config.dealaccount(this.account),
					memo: this.message,
				}
				if (this.subSwitch) {
					return
				} else {
					this.subSwitch = true;
				}
				_post(api.suggest, query).then(res => {
					if (res.code == 0) {
						uni.showToast({
							icon: "none",
							title: this.$t1("提交成功"),
							duration: 2000,
						})
						setTimeout(() => {
							uni.navigateBacks()
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
		}
	}
</script>




<style lang="scss" scoped src="./scs.scss"></style>

</style>
