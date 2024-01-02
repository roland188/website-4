export const updateApp = {
	data(){
		return {
			modeldata: {},
			idVersion: "", // id版本号
			updatePackage: "", // 新包
			forceUpdate: 0,
			latestVer: false
		}
	},
	onLoad(){
		// #ifdef APP-PLUS
		this.Appupdate(true)
		// #endif
	},
	mounted() {
		uni.$once("modelUp", (data) => {
			// 更新第四步,触发common.js更新逻辑,传入的分别为当前实例及更新对象
			this.$common.update(this, this.updatePackage);
		});
	},
	onBackPress() {
		// #ifdef APP-PLUS
		if (this.forceUpdate === 1) {
			return true
		} else {
			return false
		}
		// #endif
	},
	methods:{
		// 热更新操作
		Appupdate(flag) {
			let that = this;
			var data = {
				appId: that.$config.theme,
				versionType: 2,
			};
			this.latestVer = true
			that.$api.appVersion(data, (err, res) => {
				if (res) {
					plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
						const models = uni.getSystemInfoSync();
						let code = Number(wgtinfo.version.replace(/\./g, ""));
						res.forEach((item) => {
						    if (item.versionCode > code) {
						        if (item.versionType === 2) {
									this.latestVer = false
						            that._modelsUpModel(item, '前往更新', code)
						        } else if(this.latestVer) {
									that._getVersion(item, code, models, flag)
								}
						    }
						})
					});
				}
			});
		},
		// 比较版本号
		_getVersion(item, code, models,promptShow) {
			if (item.versionCode > code) {
				this._modelsUpModel(item, '立即更新',code)
			} else {
				//调用时传过来的true,区分弹出最新版本还是弹出jp和广告
				if (!promptShow) {
				    uni.showToast({
				        title: "当前已是最新版本！",
				        icon: "none",
				        duration: 2000,
				    });
				} else {
				    //弹出规则第二步,如果不需要更新则获取弹出规则,此处为APP逻辑,H5则在第一步的时候直接调用getPopUpAdsSetting方法,H5不走Appupdate方法,在Appupdate函数里有APP-PLUS的判断只有APP会走更新代码
				    this.getPopUpAdsSetting(); //获取弹出规则
				}
			}
			
		},
		_modelsUpModel(item, upText,code) {
			this.$store.commit("update", upText);
			this.modeldata.title = "发现新版本V" + item.newVersion;
			this.modeldata.content = item.updateDescription;
			this.forceUpdate = item.forceUpdate;
			if (item.versionCode - code > 1) {
				this.modeldata.cancel = 1;
			} else {
				this.modeldata.cancel = item.forceUpdate;
			}
		
			this.idVersion = item.id;
			this.updatePackage = item;
			this.updateShow = true;
			//弹出更新弹窗
			this.upModel();
		},
		upModel() {
			// #ifdef APP-PLUS
			uni.navigateTo({
				url: "/pages/modelPage/modelPage",
			});
			let modelJson = {
				title: this.modeldata.title,
				content: this.modeldata.content,
				forceUpdate: this.forceUpdate,
				url: this.updatePackage.apkUrl,
			};
			uni.setStorageSync("modelJson", modelJson);
			// #endif
		},
	}
}