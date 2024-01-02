<template>
	<view class="message">
		<!-- 导航栏 -->
		<view class="perHeader">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view class="perHeaderReal">
				<view style="backgroundImage: url('../../static/image/qqImg/bankback.png')" @tap="goBack"></view>
				<view>{{ $t('消息中心') }}</view>
			</view>
		</view>
		<!-- tab栏 -->
		<view class="msgNav borderColor">
			<view class="messageNav u-flex-all" @tap="switchStatus" data-isSelectNav="1">
				<view class="navImg u-flex-all" style="position: relative; height: 100%"> </view>
				<text class="showNewData" v-if="unreadMsg"></text>
				<text :class="isSelectNav == 1 ? 'themeNavActive' : ''">{{ $t('通知') }}</text>
			</view>

			<view class="noticeNav u-flex-all" @tap="switchStatus" data-isSelectNav="2">
				<view class="navImg u-flex-all" style="position: relative; height: 100%"> </view>
				<text class="showNewData" v-if="unreadNotice"></text>
				<text :class="isSelectNav == 2 ? 'themeNavActive' : ''">{{$t('公告')}}</text>
			</view>
		</view>

		<!-- 列表 : 通知 -->
		<view class="msgList pageBackground" v-show="isSelectNav == 1">
			<template v-if="msgReqSuccess">
				<scroll-view scroll-y="true" @scrolltolower="lower">
					<view class="msgItem" v-for="(item, index) in messageDataList" :key="index" @tap="toMessageInfo(item, 1)"
					 :data-msgid="item.id">
						<view class="msgItemImg u-flex-all">
							<!-- <uni-icons type='info' color='#000'></uni-icons> -->
						</view>
						<view class="msgItemBody">
							<view class="msgItemTitle themeTextOne">{{ item.subject }}</view>
							<view class="msgItemContent themeTextTwo" v-html="item.content"></view>
						</view>
						<view class="msgItemDate themeTextTwo">{{ stringHandler(item) }}</view>
						<text class="showNewData2" v-if="!item.readFlag"></text>
					</view>

					<!-- 上拉显示更多/正在加载/没有更多数据了 -->
					<!-- 			<text class="loading-text u-flex-all" style='margin:40upx 0;'>
						{{loadingType1 === 'more' ? loadingText1.loadingDown : (loadingType1 === 'loading' ? loadingText1.loadingRefresh : loadingText1.loadingNoMore)}}
					</text> -->
				</scroll-view>
			</template>
			<template v-else>
				<!-- 无内容显示 -->
				<image class="img-null" src="@/static/image/mb/null-data.png" mode="aspectFit"></image><br />
				<view class="noneMessage">{{ $t('一条通知都没呢...') }}<strong></strong></view>
			</template>
		</view>

		<!-- 列表  : 公告 -->
		<view class="msgList pageBackground" v-show="isSelectNav == 2">
			<template v-if="noticeReqSuccess">
				<scroll-view scroll-y="true" @scrolltolower="lower">
					<view class="msgItem" v-for="(item, index) in noticeDataList" :key="index" @tap="toMessageInfo(item, 2)"
					 :data-msgid="item.id">
						<view class="msgItemImg u-flex-all">
							<!-- <uni-icons type='info' color='#000'></uni-icons> -->
						</view>
						<view class="msgItemBody">
							<view class="msgItemTitle themeTextOne">{{ item.subject }}</view>
							<view class="msgItemContent themeTextTwo" v-html="item.content"></view>
						</view>
						<view class="msgItemDate themeTextTwo">{{ stringHandler(item) }}</view>
						<text class="showNewData2" v-if="!item.readFlag"></text>
					</view>

					<!-- 上拉显示更多/正在加载/没有更多数据了 -->
					<text class="loading-text u-flex-all" style="margin: 40upx 0">
						{{
              loadingType2 === "more"
                ? loadingText2.loadingDown
                : loadingType2 === "loading"
                ? loadingText2.loadingRefresh
                : loadingText2.loadingNoMore
            }}
					</text>
				</scroll-view>
			</template>
			<template v-else>
				<!-- 无内容显示 -->
				<image class="img-null" src="@/static/image/mb/null-data.png" mode="aspectFit"></image><br />
				<view class="noneMessage">{{ $t('一条公告都没呢...') }}</view>
			</template>
		</view>
	</view>
</template>

<script>
	import cache from "../../utils/cache.js";
	export default {
		data() {
			return {
				userId: "",
				isSelectNav: 1, //选择哪个tab
				pageSize: 12, //每页条数
				currentPage1: 1, //第几页 从1开始
				currentPage2: 1, //第几页 从1开始
				dataList: [],
				//各自的loadingText
				loadingType1: "more", //提示消息，'more'表示上拉加载更多，'loading'表示正在加载...，2表示没有更多数据了
				loadingText1: {
					loadingDown: "",
					loadingRefresh: this.$t('正在加载...'),
					loadingNoMore: this.$t('没有更多数据了'),
				},
				loadingType2: "more", //提示消息，'more'表示上拉加载更多，'loading'表示正在加载...，2表示没有更多数据了
				loadingText2: {
					loadingDown: "",
					// loadingDown: "上拉显示更多",
					loadingRefresh: this.$t('正在加载...'),
					loadingNoMore: this.$t('没有更多数据了'),
				},
				//公告
				//创建时间
				createdAt: "",
				//发布时间
				publishedAt: "",
				//公告主题
				subject: "",
				//显示导航栏的未读(全部数据)
				msgAllDataList: [],
				noticeAllDataList: [],
				//各自数据
				messageDataList: [],
				noticeDataList: [],
				flag: true, //页面跳转，禁止双击
				msgReqSuccess: true, //默认站内信请求成功（失败显示nothing）
				noticeReqSuccess: true,
				unreadMsg: false,
				unreadNotice: false,
			};
		},
		props: {
			navNumber: Number,
		},
		mounted() {
			var _this = this;
			if (cache.get("set_user")) {
				//获取用户id
				this.userId = cache.get("set_user").user_id;
			}
			_this.firstGetData();
		},
		onShow() {
			if (this.noticeDataList.length > 0) {
				let list = this.noticeDataList.find((item) => {
					return item.readFlag === 0;
				});
				if (list) {
					this.unreadNotice = true;
				} else {
					this.unreadNotice = false;
				}
			}
			if (this.messageDataList.length > 0) {
				let list = this.messageDataList.find((item) => {
					return item.readFlag === 0;
				});
				if (list) {
					this.unreadMsg = true;
				} else {
					this.unreadMsg = false;
				}
			}
		},
		methods: {
			goBack() {
				uni.navigateBacks({
					delta: 1,
				});
			},
			initData() {
				//刷新页面，数据初始化
				this.currentPage = 1;
				if (this.isSelectNav == 1) {
					this.loadingType1 = "more";
					this.currentPage1 = 1;
				} else {
					this.loadingType2 = "more";
					this.currentPage2 = 1;
				}
				this.getData();
			},
			async firstGetData() {
				var _this = this;
				//分页请求第一次
				await _this.getData();
				await _this.getNoticeData();
			},
			getData(currentPage = 1, pageSize = 12, receiverType = 0, isSelectNav) {
				var _this = this;
				if (_this.isSelectNav == 1) {
					//站内信============================
					if (_this.loadingType1 != "more") {
						//显示正在加载中。。。或者没有更多数据了，就不用请求了
						return false;
					}
					_this.loadingType1 = "loading"; //显示正在加载中。。。。
					//uni.showNavigationBarLoading(); //打开加载动画

					var callback = function(err, res) {
						if (err) {
							//uni.hideNavigationBarLoading(); //关闭加载动画
							uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
							_this.msgReqSuccess = false;
							_this.messageDataList = [];
							_this.unreadMsg = false;
						} else {
							if (res.content.length > 0) {
								_this.msgReqSuccess = true;
								_this.unreadMsg = res.unreadFlag;
								let data = currentPage == 1 ? [] : _this.messageDataList;
								data.push(...res.content);
								_this.messageDataList = data;
							} else {
								_this.msgReqSuccess = currentPage == 1 ? false : true;
								_this.unreadMsg = false;
							}

							if (_this.messageDataList.length == res.totalRecords) {
								//显示数据没有了
								_this.loadingType1 = "noMore";
							} else {
								//上拉加载更多
								_this.loadingType1 = "more";
							}

							//uni.hideNavigationBarLoading(); //关闭加载动画
							uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
						}
					};
					//获取通知接口
					_this.$api.message(currentPage, pageSize, receiverType, callback, false);
					return;
				} else {
					//公告============================
					if (_this.loadingType2 != "more") {
						return false;
					}
					_this.loadingType2 = "loading";
					//uni.showNavigationBarLoading(); //打开加载动画

					var callback = function(err, res) {
						if (err) {
							_this.noticeReqSuccess = false;
							_this.noticeDataList = [];
							_this.unreadNotice = false;
						} else {
							if (res.content.length > 0) {
								_this.noticeReqSuccess = true;
								_this.unreadNotice = res.unreadFlag;
								let data = currentPage == 1 ? [] : _this.noticeDataList;
								data.push(...res.content);
								_this.noticeDataList = data;
							} else {
								_this.noticeReqSuccess = currentPage == 1 ? false : true;
								_this.unreadNotice = false;
							}

							if (_this.noticeDataList.length == res.totalRecords) {
								//显示数据没有了
								_this.loadingType2 = "noMore";
							} else {
								//上拉加载更多
								_this.loadingType2 = "more";
							}

							//uni.hideNavigationBarLoading(); //关闭加载动画
							uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
						}
					};

					//获取公告接口
					_this.$api.noticeList(_this.createdAt, currentPage, pageSize, _this.publishedAt, _this.subject, callback, false);
				}
			},
			//初次获取noticeDataList（只请求一次方法）
			getNoticeData(currentPage = 1, pageSize = 12) {
				var _this = this;
				if (_this.loadingType2 != "more") {
					//显示正在加载中。。。或者没有更多数据了，就不用请求了
					return false;
				}
				_this.loadingType2 = "loading"; //显示正在加载中。。。。
				var callback = function(err, res) {
					if (err) {
						_this.noticeReqSuccess = false;
						_this.noticeDataList = [];
						_this.unreadNotice = false;
					} else {
						if (res.content.length > 0) {
							_this.noticeReqSuccess = true;
							_this.unreadNotice = res.unreadFlag;
							let data = currentPage == 1 ? [] : _this.noticeDataList;
							data.push(...res.content);
							_this.noticeDataList = data;
							let content = res.content;
							content.forEach(function(item) {
								//给每个对象添加一个isSelect(布尔值)
								_this.$set(item, "isSelect", false);
							});
						} else {
							_this.noticeReqSuccess = currentPage == 1 ? false : true;
							_this.unreadNotice = false;
						}

						if (_this.noticeDataList.length == res.totalRecords) {
							//显示数据没有了
							_this.loadingType2 = "noMore";
						} else {
							//上拉加载更多
							_this.loadingType2 = "more";
						}
					}
				};
				_this.$api.noticeList(_this.createdAt, currentPage, pageSize, _this.publishedAt, _this.subject, callback, false);
			},
			switchStatus(e) {
				var _this = this;
				_this.modalName = null;
				var isSelectNav = e.currentTarget.dataset.isselectnav;
				if (this.isSelectNav == isSelectNav) {
					return;
				} else {
					this.isSelectNav = isSelectNav;
				}
			},
			toMessageInfo(item, isSelectNav) {
				var _this = this;
				this.markReaded(isSelectNav, item.id);
				if (_this.flag) {
					_this.flag = false;
					setTimeout(function() {
						_this.flag = true;
						// 跳转到站内信详情或公告详情页面
						item.readFlag = 1;
						if (isSelectNav == 1) {
							//站内信
							uni.navigateTo({
								url: "../../pages/messageDetail/messageDetail?type=1&id=" + item.id,
							});
						} else {
							//公告详情
							uni.navigateTo({
								url: "../../pages/messageDetail/messageDetail?type=2&id=" + item.id,
							});
						}
					}, 500);
				}
			},
			markReaded(isSelectNav, id) {
				//标记已读
				var _this = this;
				if (isSelectNav == 1) {
					var callback = function(err, res) {
						if (err) {} else {}
					};
					_this.$api.readMessage(id, callback);
				} else {
					var messageIds = [id];
					var data = {
						content: "",
						delFlag: "",
						endAt: "",
						id: "",
						memberId: _this.userId,
						noticeIds: messageIds,
						operator: "",
						publishedAt: "",
						publishedAtType: 0,
						readFlag: 0,
						status: 0,
						subject: "",
					};
					var callback = function(err, res) {
						if (err) {} else {}
					};
					_this.$api.readNotice(
						data.content,
						data.delFlag,
						data.endAt,
						data.id,
						data.memberId,
						data.noticeIds,
						data.operator,
						data.publishedAt,
						data.publishedAtType,
						data.readFlag,
						data.status,
						data.subject,
						callback
					);
				}
			},
			lower() {
				// 上拉加载更多
				if (this.isSelectNav == 1) {
					if (this.loadingType1 != "more") {
						//显示正在加载中或者没有更多数据了，就不用请求了
						return;
					}
					this.currentPage1++;
					this.getData(this.currentPage1, this.pageSize);
				} else {
					if (this.loadingType2 != "more") {
						//显示正在加载中或者没有更多数据了，就不用请求了
						return;
					}
					this.currentPage2++;
					this.getData(this.currentPage2, this.pageSize);
				}
			},
			stringHandler(res) {
				if (res.createdAt) {
					return this.timeSwitch(res.createdAt);
				} else {
					return this.timeSwitch(res.publishedAt);
				}
			},
			timeSwitch(val) {
				if (val) {
					var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
					var Y = date.getFullYear() + "-";
					var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
					var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
					var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":"; // 获取时
					var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":"; // 获取分
					var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
					var time = Y + M + D + h + m + s;
					return time;
				}
			},
		},
		watch: {
			navNumber(n) {
				this.isSelectNav = n;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.message {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	/* 导航栏 */
	.perHeader {
		width: 100%;
		/* #ifdef APP-PLUS */
		height: calc(88upx + var(--status-bar-height));
		/* #endif */
		/* #ifdef H5 */
		height: 88upx;
		/* #endif */
		background-color: #22211f;
		color: #fff;
	}

	.perHeaderReal {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 88upx;
		color: #fff;
		padding: 0 30upx;
		box-sizing: border-box;
		background-color: #22211f;
		font-size: 32upx;
		position: relative;

		view:nth-child(1) {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 30upx;
			width: 40upx;
			height: 40upx;
			background-size: cover;
		}
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.msgNav {
		width: 100%;
		height: 100upx;
		display: flex;
		flex-shrink: 0;

		.themeNavActive {
			border-bottom: 2upx solid red;
		}
	}

	.msgList {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		text-align: center;

		.img-null {
			margin-top: 200upx;
			width: 528rpx;
			height: 368rpx;
		}
	}

	::v-deep uni-scroll-view {
		height: 100%;
	}

	.msgNav>view {
		flex: 1;
		height: 100upx;
		border-bottom: 3upx solid transparent;
		background-color: #fff;
	}

	.msgNav text {
		font-size: 30upx;
		font-weight: 500;
		margin-left: 8upx;
		// color: #fff;
	}

	.messageNav {
		position: relative;
	}

	.messageNav image {
		width: 40upx;
		height: 40upx !important;
		flex-shrink: 0;
	}

	.showNewData {
		width: 14upx;
		height: 14upx;
		background: #fff;
		position: absolute;
		border-radius: 50%;
		top: 20upx;
		right: 140upx;
	}

	.noticeNav {
		position: relative;
	}

	.noticeNav image {
		width: 40upx;
		height: 40upx !important;
		flex-shrink: 0;
	}

	.themeColor text {
		font-size: 32upx;
	}

	.msgItem {
		padding: 18upx 70upx 18upx 30upx;
		background-color: #fff;
		border-bottom: 1upx solid #f4f4f4;
		display: flex;
		position: relative;
		transition: all 0.6s ease-in-out 0s;
		transform: translateX(0px);
		position: relative;

		.showNewData2 {
			width: 14upx;
			height: 14upx;
			background: red;
			opacity: 0.8;
			position: absolute;
			border-radius: 50%;
			top: 60upx;
			right: 40upx;
		}
	}

	.msgItem.move-cur {
		transform: translateX(-176px);
	}

	.msgItem.move-curNotice {
		transform: translateX(-96px);
	}

	.msgItemImg {
		position: relative;
	}

	.msgItemImg>image {
		width: 92upx;
		height: 92upx !important;
		flex-shrink: 0;
	}

	.unReadBgc {
		background-color: red;
	}

	.msgItemBody {
		flex: 1;
		margin-left: 16upx;
		overflow: hidden;
		/* 解决rich-text中p标签的溢出 */
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* 修改p标签的样式 */
	.msgItemBody>>>.cont {
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.msgItemTitle {
		font-size: 30upx;
		font-weight: 700;
		line-height: 42upx;
		width: 85%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: left;
	}

	.msgItemContent {
		font-size: 24upx;
		line-height: 34upx;
		font-weight: 500;
		/* 溢出显示省略号 */
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: left;
	}

	.msgItemDate {
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
		margin-top: 6px;
		width: 140upx;
		height: 100%;
		font-size: 22upx;
		font-weight: 500;
	}

	.noneMessage {
		text-align: center;
	}
</style>
