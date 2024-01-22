<!-- 启动页 -->
<template>
    <view style="width:100%;height:100%">
        <view class="startup-page" v-if="isAmxpj"></view>
        <view class="startBox" v-if="!isAmxpj">
            <image class="logo" :src="$config.platformLogo('logo')" mode="widthFix"></image>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            dataJsonArr: {
                picUrl: '',
                url: '',
            },
            appUrlJson: [],
            forDataJsonUrl: null,
            isAmxpj: false,
            interval: 0
        };
    },
    onShow () {
        // #ifdef H5
        this.$config.domainName = localStorage.getItem('domainName') // 同步url.js中的domainName（易记域名）到config.js
        // #endif
        this.isAmxpj = (window ? window.projectImgUrl : this.$config.projectImgUrl) == 'amxpj'
        setTimeout(() => {
            /* H5平台直接获取配置信息 */
            // #ifdef H5
            const list = [this.$server.getConfigHost()] // h5不用遍历获取，只有一个host，从url.js里面来
            this.forDataJson(list)
            // #endif

            /* APP需要先从json中获取真实host */
            // #ifdef APP-PLUS
            this.getJsonData()
            // #endif
        }, 500)
    },
    methods: {
        // 获取配置信息
        // 通过传进来的host数组，来遍历获取配置，获取到了就停止
        async forDataJson (list) {
            let result
            for (let i = 0; i < list.length; i++) {
                result = await this.forDataJsonReq(list[i])
                if (result) { // 获取到了配置
                    break
                }
            }
            // 获取配置信息失败
            if (!result) {
                uni.showModal({
                    title: '提示',
                    content: '服务器错误，请联系客服'
                })
                return
            }
            // 获取配置成功，分发各项配置
            console.log('---成功', result)
            result.data.map(item => {
                switch (item.type) { // 根据配置项的type来设置各个配置
                    case 1: // web
                        this.$config.codeUrl = item.domain
                        this.$server.setCodeUrl(item.domain)
                        break
                    case 2: // 图片
                        this.$config.imgHost = item.domain
                        this.$server.setImgHost(item.domain)
                        break
                    case 3: // 上传下载
                        this.$config.dowUrl = item.domain + '/'
                        break
                    case 4: // 彩金
                        this.$config.jackpotUrl = item.domain
                        break
                    case 5: // 客服
                        this.$config.customerServiceUrl = item.domain
                        break
                }
            })
            // 可以进入app
            this.appInit()
            this.clientCode()
        },
        // 获取配置信息请求
        forDataJsonReq (host) {
            return new Promise(resolve => {
                let clientItem = ''
				let skinCode = ''

				// #ifdef H5
				clientItem = window.childCode
				skinCode = window.theme
				// #endif

				// #ifdef APP-PLUS
				clientItem = this.$config.childCode
				skinCode = this.$config.theme
                // #endif

                // 请求体
                const req = {
                    url: host + '/longm/api/v1/domain/pageList',
                    header: {
						clientCode: this.$config.clientCode,
						clientItem: clientItem,
						skinCode: skinCode,
					},
                    success: res => {
                        if (res.statusCode == 200 && res.data.code == 0) {
                            // 处理一些配置
                            this.$config.host = host
                            this.$server.setConfigHost(host)
                            this.$server.setConfigUrl(res.data.data)
                            resolve(res.data)
                        } else if(res.data.code == 110009){
													//黑名单
													uni.reLaunch({
														url:'/pages/iplimit/iplimit?ip='+ res.data.msg + '&custommerUrl=' + res.data.data.customer
													})
												} else {
                           resolve(false)
                        }
                    },
                    fail: () => {
                        resolve(false)
                    }
                }


                // 平台参数

                // #ifdef H5
                req.header.h5 = 1 
                // #endif

                // #ifdef APP-PLUS
                try {
                    const systemInfo = uni.getSystemInfoSync()
                    if (systemInfo.platform === 'android') {
                        req.header.android = 1
                    } else if (systemInfo.platform === 'ios') {
                        req.header.ios = 1
                    }
                } catch (e) {
                    uni.showToast({
                        title: '获取设备信息失败',
                        icon: 'none',
                    })
                }
				// #endif

				uni.request(req)
            })
        },
        // 获取客服信息
        clientCode () {
            this.$api.clientCode(this.$config.clientCode, (err, res) => {
                if (err) {
                    uni.showToast({
                        icon: 'none',
                        title: '获取客服信息失败'
                    })
                    return
                }
                this.$server.setClientCodeRes(res)
                this.$server.setCustomerService(res.customerUrl)
            })
        },
        // 进入app
        appInit () {
            uni.switchTab({
                url: '../index/index',
                success: () => {
                    uni.$emit('update', { // 这个估计有的项目需要通过这个事件做页面处理，本项目没有
                        msg: '页面更新',
                    })
                }
            })
        },
        // 获取服务信息
        async getJsonData () {
            const list = this.$config.appUrlJson
            // 循环解析json文件，直到获取到了包含host的数组
            let result
            for (let i = 0; i < list.length; i++) {
                result = await this.getJsonDataSync(list[i])
                if (result) {
                    break
                }
            }
            // 没有获取到服务信息
            if (!result) {
                uni.showModal({
                    title: '提示',
                    content: '服务异常，请联系客服'
                })
                return
            }
            // 获取到了hos的数组，去获取服务器配置
            this.forDataJson(result)
        },
        // 获取服务器请求
        getJsonDataSync (url) {
            return new Promise(resolve => {
                uni.request({
                    url: url,
                    header: {
						'Cache-Control': 'no-cache',
					},
                    complete: res => {
                        if (res && res.statusCode == 200) { // 获取到了
                            resolve(res.data)
                        } else {
                            resolve(false)
                        }
                    }
                })
            })
        }
    }
}
</script>

<style scoped>
.startup-page {
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-color: #020101;
    background-position: center center;
    background-image: url('../../static/startup.jpg');
}
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
