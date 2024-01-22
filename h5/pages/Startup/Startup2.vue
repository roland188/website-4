<template>
	<view class="startBox">
		<image class="logo" :src="$config.platformLogo('logo')" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataJsonArr: {
					picUrl: "",
					url: "",
				},
				appUrlJson: [],
				forDataJsonUrl: null,
			};
		},
		onShow() {
			let self = this;
			// if (self.$config.host.indexOf("192.168.") != -1) {
			//   self.appInit();
			// } else {
			// #ifdef APP-PLUS
			self.getMaintain();
			let hostChu = self.$server.getConfigHost();
			self.appUrlJson = self.$config.appUrlJson;
			// #endif
			// #ifdef H5
			let host = this.$server.getConfigHost();
			let newHost = [host];
			self.forDataJsonUrl = newHost;
			self.forDataJson(newHost);
			// #endif
			// }
		},
		methods: {
			getMaintain() {
				let self = this;
				let maintainUrl = self.$config.maintainUrl;
				uni.request({
					url: maintainUrl,
					method: "POST",
					header: {
						clientCode: self.$config.clientCode,
						clientItem: self.$config.childCode,
					},
					complete: (res) => {
						if (res.statusCode == 200) {
							console.log('maintainUrl', maintainUrl, res)
							// self.$config.maintianTime = res.data.time;
							if (res.data.data.status === 1) {
								// uni.setStorageSync("maintian", true);
								uni.reLaunch({
									url: "../maintain/maintain",
								});
							} else {
								self.getJsonData();
							}
						} else {
							self.getJsonData();
						}
					},
				});
			},
			getJsonData() {
				var self = this;
				let appUrlJson = self.appUrlJson;
				uni.request({
					url: self.appUrlJson[0],
					header: {
						"Cache-Control": "no-cache",
					},
					complete: (res) => {
						if (res.statusCode == 200) {
							let resData = res.data[0];
							self.forDataJsonUrl = res.data;
							self.forDataJson(resData);
						} else {
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === "none") {
										uni.hideLoading();
										// uni.navigateTo({
										// 	url: '../defaultPage/defaultNetworkBroken/defaultNetworkBroken'
										// })
									} else {
										if (self.appUrlJson.length > 0) {
											let a = self.appUrlJson;
											let b = a.splice(0, 1);
											self.appUrlJson = a;
											self.getJsonData();
										} else {
											uni.showModal({
												title: self.$t("startUp.title"),
												// content:this.$t('startUp.content'),
												success: function(res) {
													if (res.confirm) {
														console.log("用户点击确定");
													} else if (res.cancel) {
														console.log("用户点击取消");
													}
												},
											});
										}
									}
								},
							});
						}
					},
				});
			},
			forDataJson(list) {
				let self = this;
				// #ifdef  H5
				self.$config.domainName = localStorage.getItem("domainName");
				// #endif

				let forDataJsonUrlOld = self.forDataJsonUrl;
				// if (list && list.length) {
				let host = forDataJsonUrlOld[0];
				let clientItem = "";
				let skinCode = "";
				// #ifdef  H5
				clientItem = window.childCode; //子平台id字段
				skinCode = window.theme;
				// #endif
				// #ifdef  APP-PLUS
				clientItem = self.$config.childCode; //客户端id字段
				skinCode = self.$config.theme;
				// #endif
				var req = {
					url: host + "/longm/api/v1/domain/pageList",
					header: {
						clientCode: self.$config.clientCode,
						// #ifdef  H5
						h5: 1,
						// #endif
						clientItem: clientItem,
						skinCode: skinCode,
					},
					success: function(res) {
						if (res.statusCode == 200) {
							if (res.data.code == 0) {
								self.$config.host = host;
								self.$server.setConfigHost(host);
								let dataUrl = res.data.data;
								self.$server.setConfigUrl(dataUrl);
								dataUrl.map((item) => {
									if (item.type == 1) {
										//web
										self.$config.codeUrl = item.domain;
										self.$server.setCodeUrl(item.domain);
									} else if (item.type == 2) {
										//图片
										self.$config.imgHost = item.domain;
										self.$server.setImgHost(item.domain);
									} else if (item.type == 3) {
										//图片
										self.$config.dowUrl = item.domain + "/";
									} else if (item.type == 4) {
										//彩金
										self.$config.jackpotUrl = item.domain;
									} else if (item.type == 5) {
										//客服
										self.$config.customerServiceUrl = item.domain;
									}
								});

								self.appInit();
								self.clientCode();
							} else if (res.data.code == 130010) {
								// uni.navigateTo({
								// 	url:'/pages/maintain/maintain'
								// })
							} else if (res.data.code == 110009) {
								//黑名单
								// uni.reLaunch({
								// 	url:'/pages/defaultPage/defaultPage403/defaultPage403'
								// })
							} else {
								// self.forDataJson(list);
							}
						} else if (res.statusCode == 500 || res.statusCode == 503) {} else {}
					},
					fail: function(res) {
						let a = self.forDataJsonUrl;
						let b = a.splice(0, 1);
						self.forDataJsonUrl = a;
						if (a.length === 0) {
							if (self.appUrlJson.length >= 1) {
								let c = self.appUrlJson;
								let d = c.splice(0, 1);

								self.getJsonData();
							} else {
								consoole.log(222222);
								uni.showModal({
									title: "提示",
									content: "服务器错误，请联系客服",
									success: function(res) {
										if (res.confirm) {
											console.log("用户点击确定");
										} else if (res.cancel) {
											console.log("用户点击取消");
										}
									},
								});
							}
						} else {
							self.forDataJson();
						}
					},
				};
				// #ifdef  APP-PLUS
				uni.getSystemInfo({
					success: function(res) {
						if (res.platform === "android") {
							req.header.android = 1;
						} else if (res.platform === "ios") {
							req.header.ios = 1;
						}
					},
				});
				// #endif

				uni.request(req);
				// } else {
				// 	self.appInit();
				// }
			},
			appInit() {
				// #ifdef  APP-PLUS
				this.appIng();
				// #endif
				// #ifdef  H5
				this.webIng();
				// #endif
			},
			appIng() {
				var platform = uni.getSystemInfoSync().platform;
				this.platform = platform;
				// this.firstApp('android');

				uni.switchTab({
					url: "../index/index",
					success: function() {
						uni.$emit("update", {
							msg: "页面更新",
						});
					},
				});
			},
			webIng() {
				this.dataJsonArr.picUrl = "88888.png";
				uni.switchTab({
					url: "../index/index",
					success: function() {
						uni.$emit("update", {
							msg: "页面更新",
						});
					},
				});
			},
			clientCode() {
				let self = this;

				self.$api.clientCode(
					self.$config.clientCode,
					function(err, res) {
						if (err) {} else {
							self.$server.setClientCodeRes(res);
							self.$server.setCustomerService(res.customerUrl);
						}
					},
					false
				);
			},
			// app判断
			firstApp() {
				let isFirst = this.$server.getIsFirst();
				if (isFirst && isFirst === true) {
					//以前下载过

					uni.switchTab({
						url: "../index/index",
						success: function() {
							uni.$emit("update", {
								msg: "页面更新",
							});
						},
					});
				} else {
					//没下载过
					uni.reLaunch({
						url: "../Introduction/Introduction",
					});
				}

				this.$server.setIsFirst(true);
			},
		},
	};
</script>

<style scoped>
	.startBox {
		width: 100%;
		height: 100%;
		background-color: var(--theme);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo {
		width: 60%;
		height: auto;
	}
</style>
