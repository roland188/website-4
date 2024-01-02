<template>
	<view class="mask" @tap="tapMask" :style="{backgroundColor:value?`rgba(0,0,0,${opacity})`:'rgba(0,0,0,0)'}" :class="!value?'':'mask-show'"
	 @touchmove.stop.prevent>
		<!-- 	 <view class="mask" @tap="tapMask" :class="!value?'':'mask-show'" style="z-index:99999999999999999999999999999;"
	  @touchmove.stop.prevent> -->

		<block v-if="type=='default'">
			<view class="default-view" @tap.stop>
				<view class="title title_bg">{{mData.title}}</view>
				<view class="content word-break">
					<image :src="mData.typesrc" class="tip-conent-img" v-if="mData.typesrc" mode=""></image>
					{{mData.content}}
					<view class="tip-ts" @click="modelToasts()">
						<view class="tipToastCon">
							<view class="tipYuan" :class="modelToast?'tipYuanActive':''"></view>
							<view class="tipToastText">
								{{$t('不再提示')}}
							</view>
						</view>
					</view>
				</view>

				<view class="btn">
					<view class="button cancel" @tap="tapCancel">{{mData.cancelText?mData.cancelText:$t('取消')}}</view>
					<view class="button confirm" @tap="tapConfirm">{{mData.confirmText?mData.confirmText:$t('确认')}}</view>
				</view>
			</view>
		</block>

		<block v-if="type=='update'">
			<view class="share-view" @tap.stop>
				<view class="share-box">
					<image src="../../static/image/dzr/updataapp.png" mode="widthFix" class="indexTanTop"></image>
					<view class="content">
						<text>{{mData.title}}</text>
						<view>{{mData.content}}</view>
					</view>
					<view class="submitBut" @tap.stop="tapConfirm('update')">
						{{$t('立即更新')}}
					</view>
				</view>
				<!-- <view class="title title_bg" v-if="mData.title">{{mData.title}}</view> -->

				<image class="image cancel" v-if="mData.cancel == 0" @tap.stop="tapCancel" src="../../static/image/indexImg/cha4.png"></image>
			</view>

		</block>
		<!-- 冻结按钮类型 -->
		<block v-if="type=='centerWallet'">
			<view class="default-view" @tap.stop>
				<view class="title title_bg">{{mData.title}}</view>
				<view class="content word-break" style="text-align: center;">
					{{mData.content}}
				</view>
				<view class="btn">
					<view class="button cancel" @tap="tapCancel">{{mData.cancelText?mData.cancelText:$t('取消')}}</view>
					<view class="button confirm" @tap.stop="tapConfirm('centerWallet')">{{mData.confirmText?mData.confirmText:$t('确认')}}</view>
				</view>
			</view>
		</block>

		<!-- 公告 -->
		<block v-if="type=='share'">
			<view class="share-view" @tap.stop>
				<view class="share-box clBox" v-bind:style="{backgroundImage:'url('+$config.themeImgUrl('t3')+')'}">
					<!-- <image src="../../static/image/theme/theme1/t1.png" mode="widthFix" class="indexTanTop"></image> -->
					<view class="imgKong">

					</view>
					<view class="shareTitle">
						{{$t('公告通知')}}
					</view>
					<swiper class="swiper" @change="change" autoplay="true" interval='6000'>
						<swiper-item v-for="(item,index) of modeldata.notices" :key="index">
							<view class="swiper-item">
								<view class="tanTitle">
									{{item.subject}}
								</view>
								<scroll-view scroll-y="true" class="scroll-y-tips">
									{{item.content}}
								</scroll-view>
							</view>
						</swiper-item>
					</swiper>
					<view class="dotBox">
						<newSwiperDot class="dot" :current="current" :list="modeldata.notices"></newSwiperDot>
					</view>

				</view>
				<image class="image cancel" @tap.stop="tapCancel" :src="$config.themeImgUrl('tNone')"></image>
			</view>
		</block>

		<block v-if="type=='userVip'">
			<view class="uservip" @tap.stop>
				<view class="uservip-box">
					<image src="../../static/image/dzr/bgviptitle.png" mode="widthFix" class="indexTanTop"></image>
					<view class="">
						<view class="vip-table-conent">
							<div class="div-table">
								<div class="flex-grid">
									<div class="col th">{{$t('等级')}}</div>
									<div class="col th" colspan="2">{{$t('达成条件')}}</div>
									<div class="col th" colspan="2">{{$t('提现次数')}}</div>

								</div>
								<div class="flex-grid" v-for="(item,index) in mData.vipList" :key="index">
									<div class="col">{{item.gradeName}}</div>
									<div class="col">{{$t('存款')}}{{item.charge}},{{$t('有效投注')}}{{item.bet}}</div>
									<div class="col">24h/{{item.withdrawLimit}}{{$t('次')}}</div>
									<!-- 	<div class="col" v-if="item.withdrawPayType.free==1&&item.withdrawPayType.each==0">无限次</div>
									<div class="col" v-if="item.withdrawPayType.each==1&&item.withdrawPayType.free==1">每次都收</div>
									<div class="col" v-if="item.withdrawPayType.each==0&&item.withdrawPayType.free ==0">
										{{item.withdrawPayType.hourNumber.hour}}h{{item.withdrawPayType.hourNumber.number}}次</div> -->
								</div>

							</div>
						</view>
					</view>


				</view>
				<image class="image cancel" @tap.stop="tapCancel" src="../../static/image/indexImg/cha4.png"></image>

			</view>
		</block>

		<block v-if="type=='userback'">
			<view class="user-back" @tap.stop>
				<view class="title title_bg">{{mData.title}}</view>
				<view class="content word-break">
					<text class="fan-money" v-if="mData.money">{{mData.money}}</text>
					<!--  -->
					<text class="fan-num" v-if="mData.money">{{$t('流水要求')}}{{mData.content}}{{$t('倍')}} \n</text>
					<text class="fan-text" v-if="!mData.money">{{mData.content}}</text>
				</view>
				<view class="btn newBtn">
					<view class="button cancel themeTextTwo" @tap="tapCancel(mData.cancelText)">{{mData.cancelText?mData.cancelText:$t('取消')}}</view>
					<view class="button confirm themeColor" @tap="tapConfirm(mData.confirmText)">{{mData.confirmText?mData.confirmText:$t('确认')}}</view>
				</view>
			</view>
		</block>

		<block v-if="type=='pullKing'">
			<view class="pullKing share-view">
				<!-- 金币掉落 -->
				<view class="goldCoins" :class="{gifShow:gifShow === false}"></view>
				<!-- 皇冠部分 -->
				<view class="content">

					<!-- 光 -->
					<view class="light"></view>
					<!-- 名称 -->
					<view class="gameHeader">
						<image class="gameIcon" :src="mData.pictureUr?$config.getImgUrl(mData.pictureUr):img"></image>
						<text>{{mData.gameName}}</text>
					</view>
					<!-- 皇冠 -->
					<view class="crown"></view>

					<!-- 摇杆 -->
					<i class="rocker"></i>
					<!-- 滚动容器 -->
					<view class="container">
						<view class="digitalContainer">
							<view class="digital" v-for="(item,index) in containerList" :style="'transform:translateY(-'+ item.indexs +'%)'"
							 :key="index" :class="{digitals:slidingIndex.includes(index) }">
								<view v-for="(items,indexs) in digitalList" :key="indexs">
									<image :src="items.img"></image>
								</view>
							</view>
						</view>
					</view>

					<!-- 幸运头奖部分 -->
					<view class="luckyPrize">
						<view class="lights"></view>
						<text class="prizeTitle">{{ $t('幸运头奖') }}</text>
						<swiper class="prizeBox" vertical="true" autoplay="false" duration="400" interval="2000" circular="true"
						 disable-touch="true">
							<swiper-item class="single" v-for="(item,index) in mData.dataList" :key="index">
								<view v-for="(items,index) in item" :key="index" class="items">
									<text>{{items.username}}</text>
									<text v-if="items.jackpot">{{ $config.currency }}{{items.jackpot}}</text>
								</view>
							</swiper-item>
						</swiper>
					</view>
					<view class="enter" @click="enterGame"></view>
					<i class="pullKingClose" @tap.stop="tapCancel"></i>
				</view>

			</view>
		</block>

		<block v-if="type == 'advertising'">
			<slot>
				<view class="advertising">
					<view class="advertisingCenter" @click="jump()">
						<img class="img iconWidth" src="../../static/image/xf/defaultIcon.png" v-show="!rules.picUrlApp">
						<img class="img" :src="$config.getImgUrl(rules.picUrlApp)" v-show="rules.picUrlApp">
                        <!-- picUrlApp -->
					</view>
					<image class="close" @tap.stop="tapCancel" src="../../static/image/indexImg/cha4.png" alt="">
				</view>
			</slot>
		</block>

		<!-- 获取高额返利 -->
		<block v-if="type == 'getHighRebate'">
			<slot>
				<view class='get-high-rebate-box' @tap.stop>
					<view class='title'>{{ $t('返利领取')}}</view>
					<view class='money'>{{mData.money}}</view>
					<view class='multiple'>{{ $t('流水要求')}}{{mData.multiple}}{{ $t('倍')}}</view>
					<view class='btns'>
						<view class='themeTextTwo u-flex-all' @click='tapCancel'>{{ $t('取消')}}</view>
						<view class='themeColor u-flex-all' @click='tapConfirm'>{{ $t('立即领取')}}</view>
					</view>
				</view>
			</slot>
		</block>
	</view>
</template>

<script>
	import newSwiperDot from '@/components/newSwiperDot/newSwiperDot.vue'
	import TabMask from './tabMask.js'
	import cache from '../../utils/cache.js'
	export default {
		props: {
			type: {
				type: String,
				default: 'default'
			},
			value: {
				type: Boolean,
				default: false
			},
			maskEnable: {
				type: Boolean,
				default: true
			},
			mData: {
				type: [Object, Array],
				default: () => {}
			},
			tabbarHeight: {
				type: Number,
				default: null
			},
			navHeight: {
				type: Number,
				default: null
			},
			opacity: {
				type: Number,
				default: 0.6
			},
		},
		data() {
			return {
				modeldata: {
					notices: {
						moname: ''
					}
				},
				rules: {},
				img: '../../static/image/xf/game_lost.png',
				containerList: [{
						indexs: '0'
					},
					{
						indexs: '0'
					},
					{
						indexs: '0'
					},
					{
						indexs: '0'
					},
					{
						indexs: '0'
					},
					{
						indexs: '0'
					},
					{
						indexs: '0'
					},
				],
				flag: true,
				timeOut: null,
				tabMask: null,
				current: 0,
				innerAudioContext: null,
				gifShow: true,
				slidingIndex: [],
				animationData: {},
				digitalList: [{
						img: '../../static/image/xf/0.png'
					},
					{
						img: '../../static/image/xf/1.png'
					},
					{
						img: '../../static/image/xf/2.png'
					},
					{
						img: '../../static/image/xf/3.png'
					},
					{
						img: '../../static/image/xf/4.png'
					},
					{
						img: '../../static/image/xf/5.png'
					},
					{
						img: '../../static/image/xf/6.png'
					},
					{
						img: '../../static/image/xf/7.png'
					},
					{
						img: '../../static/image/xf/8.png'
					},
					{
						img: '../../static/image/xf/9.png'
					},
				],
				checkbox: [{
					value: 'A',
					checked: true
				}, {
					value: 'B',
					checked: true
				}, {
					value: 'C',
					checked: false
				}],
				modelToast: false,
				activityFlag: true,
			}
		},
		components: {
			newSwiperDot
		},
		mounted() {
			//#ifdef APP-PLUS
			this.tabMask = new TabMask({
				tabbarHeight: this.tabbarHeight,
				navHeight: this.navHeight,
				opacity: this.opacity,
				fn: this.tapMask
			})
			//#endif
		},
		methods: {
			// 广告2详情
			toMessageInfo(id) {
				var _this = this;
				var msgid = id - 0;
				// console.log(_this.localIds, msgid)

				if (_this.flag) {
					_this.flag = false;
					setTimeout(function() {
						_this.flag = true;
						// 跳转到站内信详情或公告详情页面

						// 跳转到外部页面
						var obj = {};
						obj.client = "h5";
						obj.token = _this.$server.getToken();
						obj.host = _this.$config.host;
						//图片服务器地址
						obj.imgHost = _this.$config.imgHost;
						obj.id = msgid;
						obj.clientCode = _this.$config.clientCode;
						obj.col = _this.$config.themeIndex;
						var title = '';
						obj.type = 3;
						title = _this.$t('消息中心')

						var str = JSON.stringify(obj);
			
						// #ifdef H5
						str = window.btoa(str);
						// #endif
						// #ifdef APP-PLUS
						str = new Buffer(str).toString('base64')
						// #endif
						var url = _this.$config.codeUrl + "/page/view.html?s=" + str;
						uni.navigateTo({
							url: "../webViewQQ/webViewQQ?url=" + url + "&title=" + title
						})
					}, 500)

				}
			},
			toActivityDetail(item) {
				var _this = this;
				var id = item.urlId;

				var title = item.name;
				if (cache.get('set_user')) {
					//获取用户id
					_this.userId = cache.get('set_user').user_id;
				}
				// 跳转到外部链接
				if (_this.activityFlag) {
					_this.activityFlag = false;
					setTimeout(function() {
						_this.activityFlag = true;
						var obj = {};
						obj.client = "h5";
						obj.token = _this.$server.getToken();
						obj.host = _this.$config.host;
						obj.userId = _this.userId;
						//图片服务器地址
						obj.imgHost = _this.$config.imgHost;
						obj.type = 1;
						obj.id = id;
						obj.clientCode = _this.$config.clientCode;
						obj.col = _this.$config.themeIndex;
						var str = JSON.stringify(obj);
			
						// #ifdef H5
						str = window.btoa(str);
						// #endif
						// #ifdef APP-PLUS
						str = new Buffer(str).toString('base64')
						// #endif
						var url = _this.$config.codeUrl + "/page/view.html?s=" + str;
						//url太长，会被截取,存本地
						_this.$server.setActivityUrl(url);
						uni.navigateTo({
							url: '../webViewQQ/webViewQQ?url=2' + "&title=" + title
						})
					}, 500)
				}
			},
			//广告跳转
			jump() {
				switch (this.rules.jumpType) {
					case 1:
						if (this.rules.url) {
							// #ifdef APP-PLUS
							uni.navigateTo({
								url: "../webViewQQ/webViewQQ?url=" + this.rules.url
							})
							// #endif
							// #ifdef H5
							window.open(this.rules.url, "_blank");
							// #endif
						}
						break;
					case 2:
						this.toMessageInfo(this.rules.urlId)
						break;
					case 4:
						this.toActivityDetail(this.rules)
						// uni.navigateTo({
						//     url:"../../pages/activity/activity"
						// })
						break;
					case 4:
						var form = {
							bannerGame: {
								id: this.rules.urlId,
								name: this.rules.name
							},
							vendorId: this.rules.vendorId,
						}
						this.$emit('goGameNew', form, 4)
						break;
					case 5:
						this.$emit('routerLink', 6, this.rules.urlId, this.rules.type)
						// this.$emit('doShowRelief',this.rules.urlId);
						// uni.navigateTo({
						//     url:"../../pages/timeDiscountDetail/timeDiscountDetail?id=" + this.rules.urlId
						// })
						break;
				}
			},
			advertising(rules) {
				this.rules = rules
	
			},
			mDatas() {
				let req = [1, 5];
				let self = this;
				self.$api.ptgNotices(...req, function(err, res) {
					if (err) {
						console.log('%c' + 'notices', 'color:#a70a0a;', err);
					} else {
						self.modeldata.notices = res.content;
					}
				}, false)
			},
			pullKing(rules) {
				this.rules = rules
				let i = 0
				// #ifdef H5
				this.gifShow = true
				this.slidingIndex = [];
				// #endif
				let setIntval = setInterval(() => {
					this.slidingIndex.push(i)
					i++;
					if (i > 10) {
						clearInterval(setIntval)
					}
				}, 200)
				if (rules.popUpSound === 1) {
					setTimeout(() => {
						const innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.autoplay = true;
						innerAudioContext.src = '../../static/coin.mp3';
						innerAudioContext.play();
					}, 1000)
				}

				//金币动画1.9秒后关闭
				setTimeout(() => {
					this.gifShow = false
				}, 4000)
				this.containerList.map((item) => {
					item.indexs = Math.floor(Math.random() * 9) * 100;
				}, 1)
			},
			//立即进入
			enterGame() {
				this.$emit('enterGame', this.mData)
				this.$emit('cancel');
			},
			// 轮播图变化  
			change(e) {
				this.current = e.detail.current;
			},
			checkboxChange(e) {
				var items = this.mData,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if (values.includes(item.title)) {
						this.$set(item, 'flag', true)
					} else {
						this.$set(item, 'flag', false)
					}
				}
			},
			inputConfirm() {
				this.$emit('onConfirm', this.mData.content)
				this.$emit('input', false)
			},
			tapCancel() {
				let modelType = ''
				if (this.type == 'default') {
					modelType = 'default'
				} else if (this.type == 'centerWallet') {
					modelType = 'centerWallet'
				} else {
					modelType = ''
				}
				this.$emit('cancel', modelType);
			},
			tapConfirm(item) {
				this.$emit('onConfirm', item)
				// this.$emit('input', false)
			},
			tapMask() {
				if (!this.maskEnable) {
					return
				} else {
					this.$emit('cancel', this.mData)
				}
			},
			modelToasts() {
				this.modelToast = !this.modelToast;
				this.$emit('modelToast', this.modelToast)
			},
		},
		watch: {
			value: {
				immediate: true,
				handler(newVal, oldVal) {
					//#ifdef APP-PLUS
					if (newVal) {
						this.tabMask.show()
					} else {
						this.tabMask.hide()
					}
					//#endif
				}
			}
		}
	}
</script>

<style lang="scss">
	.pullKing {

		// 金币
		.goldCoins {
			pointer-events: none;
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
			background: url('../../static/image/xf/bi.gif') no-repeat;
			background-size: 100% 100%;
			z-index: 999;
		}

		.gifShow {
			display: none;
		}

		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.content {
			height: 86%;
			position: relative;
			display: flex;
			justify-content: center;

			//背景金光
			.light {
				width: 705rpx;
				height: 705rpx;
				background: url('../../static/image/xf/jinguang.png') no-repeat;
				background-size: 100% 100%;
				animation: spin 5s linear infinite;
			}

			@keyframes spin {
				0% {
					-ms-transform: rotate(0deg);
					-moz-transform: rotate(0deg);
					-webkit-transform: rotate(0deg);
					-o-transform: rotate(0deg);
				}

				100% {
					-ms-transform: rotate(360deg);
					-moz-transform: rotate(360deg);
					-webkit-transform: rotate(360deg);
					-o-transform: rotate(360deg);
				}
			}

			//头部游戏名称
			.gameHeader {
				position: absolute;
				left: 0;
				top: 20rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;

				.gameIcon {
					display: inline-block;
					width: 55rpx;
					height: 55rpx;
					border-radius: 50%;
					background-size: 100% 100%;
				}

				text {
					margin-left: 12rpx;
					font-size: 16px;
					color: #ffffff;
					text-shadow: 1px 1px 1px #FF0000;
				}
			}

			// 皇冠
			.crown {
				position: absolute;
				top: 80rpx;
				width: 607rpx;
				height: 384rpx;
				background: url('../../static/image/xf/huangguan.png') no-repeat;
				background-size: 100% 100%;
			}

			//数字滚动容器
			.container {
				// overflow: hidden;
				position: absolute;
				top: 420rpx;
				width: 682rpx;
				height: 139rpx;
				background: url('../../static/image/xf/kuang.png') no-repeat;
				background-size: 100% 100%;
				display: flex;
				justify-content: center;

				.digitalContainer {
					width: 400rpx;
					height: 80rpx;
					overflow: hidden;
					top: 28rpx;
					position: absolute;
					left: 138rpx;
					display: flex;
					justify-content: space-around;

					.digitals {
						animation: pullKing 1s linear 3;
					}

					.digital {
						width: 100%;
						display: flex;
						flex-direction: column;
						align-items: center;
						position: relative;
						top: 0;

						@keyframes pullKing {
							0% {
								-ms-transform: translateY(0);
								-moz-transform: translateY(0);
								-webkit-transform: translateY(0);
								-o-transform: translateY(0);
							}

							100% {
								-ms-transform: translateY(-720rpx);
								-moz-transform: translateY(-720rpx);
								-webkit-transform: translateY(-720rpx);
								-o-transform: translateY(-720rpx);
							}
						}

						image {
							width: 70%;
							height: 40px;
						}

						view {
							width: 100%;
							height: 100%;
						}
					}

					.digitals {
						animation: pullKing 1s linear 3 reverse;
					}
				}
			}

			//摇杆
			.rocker {
				position: absolute;
				right: 15rpx;
				bottom: 0;
				top: 420rpx;
				width: 96rpx;
				height: 62rpx;
				background: url('../../static/image/xf/lagan.png') no-repeat;
				background-size: 100% 100%;
				animation: yaogan 1s linear;
				transform-origin: left bottom;
			}

			@keyframes yaogan {
				0% {
					-ms-transform: rotate(0deg);
					-moz-transform: rotate(0deg);
					-webkit-transform: rotate(0deg);
					-o-transform: rotate(0deg);
				}

				50% {
					-ms-transform: rotate(-60deg);
					-moz-transform: rotate(-60deg);
					-webkit-transform: rotate(-60deg);
					-o-transform: rotate(-60deg);
				}

				100% {
					-ms-transform: rotate(0deg);
					-moz-transform: rotate(0deg);
					-webkit-transform: rotate(0deg);
					-o-transform: rotate(0deg);
				}
			}

			//幸运用户滚动框
			.luckyPrize {
				position: absolute;
				top: 560rpx;
				width: 512rpx;
				height: 274rpx;
				background: url('../../static/image/xf/kuang2.png') no-repeat;
				background-size: 100% 100%;
				display: flex;
				justify-content: center;

				.lights {
					width: 100%;
					height: 100%;
					position: absolute;
					left: 0;
					top: 0;
					background: url('../../static/image/xf/light1.png') no-repeat;
					background-size: 100% 100%;
					animation: lights 1s linear infinite;
				}

				@keyframes lights {
					0% {
						background: url('../../static/image/xf/light1.png') no-repeat;
						background-size: 100% 100%;
					}

					50% {
						background: url('../../static/image/xf/light2.png') no-repeat;
						background-size: 100% 100%;
					}

					100% {
						background: url('../../static/image/xf/light1.png') no-repeat;
						background-size: 100% 100%;
					}
				}

				//幸运头奖title
				.prizeTitle {
					position: absolute;
					top: 46rpx;
					line-height: 0;
					font-weight: 800;
					font-size: 36rpx;
					color: #B44918;
					text-shadow: 0px 2px 0px rgba(255, 255, 255, 0.75);
				}

				//滚动区域
				.prizeBox {
					overflow: hidden;
					height: 65%;
					width: 80%;
					position: absolute;
					top: 68rpx;

					.single {
						height: 48rpx;
						font-size: 26rpx;
						color: #B44918;

						.items {
							display: flex;
							justify-content: space-between;
							margin-top: 6rpx;
						}
					}
				}
			}

			//立即进入
			.enter {
				position: absolute;
				top: 860rpx;
				width: 200rpx;
				height: 73rpx;
				background: url('../../static/image/xf/jinru.png') no-repeat;
				background-size: 100% 100%;
				animation: reciprocating 1.5s linear infinite;
			}

			@keyframes reciprocating {
				0% {
					-ms-transform: scale(1);
					-moz-transform: scale(1);
					-webkit-transform: scale(1);
					-o-transform: scale(1);
				}

				50% {
					-ms-transform: scale(1.2);
					-moz-transform: scale(1.2);
					-webkit-transform: scale(1.2);
					-o-transform: scale(1.2);
				}

				100% {
					-ms-transform: scale(1);
					-moz-transform: scale(1);
					-webkit-transform: scale(1);
					-o-transform: scale(1);
				}
			}

			.pullKingClose {
				position: absolute;
				top: 980rpx;
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				background: url('../../static/image/indexImg/cha4.png') no-repeat;
				background-size: 100% 100%;
				color: #ffffff;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

	}

	.mask {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 1rpx;
		left: 0;
		z-index: 9999;
		transition: background 0.3s linear;
		display: flex;
		align-items: center;
		opacity: 1;
		visibility: hidden;
		justify-content: center;

		&.mask-show {
			visibility: visible;
			opacity: 1;
		}

	}

	.hover {
		background: #f2f2f2;
	}

	.user-back {
		width: 80%;
		background: #FFFFFF;
		border-radius: 16upx;
		overflow: hidden;
		// padding-bottom: 1rem;

		.title_bg {
			// background: linear-gradient(-90deg, rgba(246, 216, 163, 1) 0%, rgba(254, 253, 249, 1) 100%);
			border-radius: 20px 20px 0px 0px;
			text-align: center;
			line-height: 2.3rem;
		}

		.content {
			background: #FFFFFF;
			text-align: center;
			margin-bottom: 12px;
			line-height: 1.4;

			.fan-money {
				// display: block;
				font-size: 1.5rem;
				font-weight: 600;
				color: #1D1717;
			}

			.fan-num {
				display: block;
				font-size: 0.85rem;
				color: #1D1717;
			}

			.fan-text {
				font-weight: 500;
				color: #1D1717;
				font-size: 0.82rem;
				/* margin: 1rem 2rem; */
				display: block;
				margin: 1.5rem;
			}
		}

		.btn {
			text-align: center;
			font-size: 30upx;

			.confirm {
				width: 80%;
				// background: linear-gradient(90deg, rgba(240, 193, 113, 1) 0%, rgba(243, 218, 158, 1) 100%);
				// margin-left: 10%;
				line-height: 2rem;
				border-left: 1px solid #f4f4f4;
			}

			.cancel {
				width: 80%;
			}

		}
	}


	.default-view {
		width: 600rpx;
		font-weight: 400;
		font-size: 18px;
		background-color: #fff;
		border-radius: 20rpx;

		.title {
			height: 69rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.content {
			padding: 40rpx;
			font-size: 15px;
			// line-height: 3;
			text-align: left;
			font-size: 13px;
			color: #484440;
			font-weight: 700;
		}

		.btn {
			height: 100rpx;
			display: flex;
			flex-direction: row;

			.button {
				display: flex;
				flex: 1;
				justify-content: center;
				align-items: center;
				// color: rgb(0, 122, 255);
				color: #484440;
				border-radius: 30rpx;
				height: 30px;
				line-height: 30px;
				font-size: 14px;
			}

			.cancel {
				background: linear-gradient(-60deg, rgba(219, 240, 255, 1) 0%, rgba(214, 226, 246, 1) 100%);
				margin-left: 10%;
			}

			.confirm {
				background: linear-gradient(90deg, rgba(240, 193, 113, 1) 0%, rgba(243, 218, 158, 1) 100%);
				margin: 0px 10%;
			}
		}
	}

	.share-view {
		width: 557rpx;
		padding: 20rpx;
		text-align: center;

		.share-box {
			border-radius: 20rpx;
			// background-color: #fff;
			padding-bottom: 10rpx;
			position: relative;

			.indexTanTop {
				width: 100%;
				height: 175rpx;
				flex-grow: 0;
				flex-shrink: 0;
			}

			.swiper {
				min-height: 450rpx;
				max-height: 565rpx;
			}

			.tanTitle {
				color: #484440;
				font-size: 38rpx;
				text-align: center;
				// font-weight: 600;
				line-height: 3;
				width: 80%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin: 0 auto;
			}

			.scroll-y-tips {
				color: #484440;
				font-size: 24upx;
				padding: 0px 20px;
				text-align: left;
				text-indent: 15px;
				max-height: 300rpx;
			}

			.tanCon {
				color: #484440;
				font-size: 24upx;
				overflow-y: scroll;
				padding: 0px 20px;
				text-align: left;
				text-indent: 15px;
				max-height: 300rpx;
			}

			.content {
				padding: 40rpx;
				font-size: 15px;
				line-height: 3;
				text-align: left;
				font-size: 24rpx;
				color: #484440;
				font-weight: 700;
				height: 360rpx;
				overflow-y: auto;
			}

			.submitBut {
				text-align: center;
				width: 80%;
				flex-grow: 1;
				font-size: 30rpx;
				color: #484440;
				border-radius: 40rpx;
				height: 70rpx;
				line-height: 70rpx;
				margin: 0px 0px 45rpx 10%;
				color: #484440;
				background: linear-gradient(90deg, rgba(240, 193, 113, 1) 0%, rgba(243, 218, 158, 1) 100%);
			}
		}

		.image {
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 20rpx;
		}

		.cancel {
			margin-top: 43rpx;
			width: 74rpx;
			height: 74rpx;
		}

	}

	.word-break {
		word-wrap: break-word;
		word-break: break-all;
		white-space: pre-wrap;
	}

	.title_bg {
		// background: linear-gradient(to right, #FEFDF9, #F6D7A6);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		font-size: 36rpx;
		// color: #484440;
		font-weight: 600;

	}

	.tip-conent-img {
		width: 37rpx;
		height: 37rpx;
		vertical-align: middle;
		margin-right: 10rpx;
	}

	.dotBox {
		padding-bottom: 30upx;
	}

	.uservip {
		text-align: center;
		width: 90%;

		.uservip-box {
			line-height: 0;

			.indexTanTop {
				width: 100%;
				height: 175rpx;
				flex-grow: 0;
				flex-shrink: 0;
			}

			.vip-table-conent {
				padding: 0.7rem 1.1rem;
				background: #fff;
				border-bottom-left-radius: 10px;
				border-bottom-right-radius: 10px;

				.div-table {
					display: table;
					width: 100%;
					/* border: 1px solid #000; */
					border-collapse: collapse;
				}

				.div-table .flex-grid {
					display: table-row;
				}

				.div-table .flex-grid .col {
					display: table-cell;
					text-align: center;
					border: 1px solid #D6D0CA;
					font-size: 9px;
					vertical-align: middle;
					padding: 0.2rem;
				}

				.div-table .flex-grid .th {
					font-weight: 600;
					font-size: 10px;
				}

			}

		}

		.image {
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 20rpx;
		}

		.cancel {
			margin-top: 43rpx;
			width: 74rpx;
			height: 74rpx;
		}
	}

	.tip-ts {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tipToastCon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tipToastText {
		color: #1D1717;
		font-size: 20upx;
		font-weight: 500;
	}

	.tipYuan {
		width: 16upx;
		height: 16upx;
		border-radius: 50%;
		margin-right: 16upx;
		padding: 8upx;
		border: 1px solid #dfdfdf;
	}

	.tipYuanActive {
		background-color: #D6AE66;
	}

	.clBox {
		background-position: top;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.imgKong {
		width: 100%;
		height: 220upx;
	}

	.newBtn {
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-top: 1px solid #f4f4f4;
		height: 80upx;
	}

	.shareTitle {
		position: absolute;
		left: 42upx;
		top: 160upx;
		color: #fff;
		font-size: 32upx;
	}

	.advertising {
		width: 90%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.advertising .img {
		width: 100%;
	}

	.advertising .advertisingCenter {
		width: 665rpx;
		height: 938rpx;
		display: flex;
		// background-color: #E7E7E7;
		// border: 2rpx solid #D4D4D4;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.advertisingCenter {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.advertising .close {
		width: 68rpx;
		height: 68rpx;
		margin-top: 40rpx;
	}

	.advertising .iconWidth {
		width: 100% !important;
	}

	//领取高额返利
	.get-high-rebate-box {
		width: 536upx;
		background-color: #fff;
		border-radius: 16upx;
		color: #1D1717;

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
			font-size: 50upx;
			font-weight: 500;
			line-height: 60upx;

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
</style>
