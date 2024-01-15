<template>
  <view class="act-Detail-layout">
    <uni-nav-bar
      :title="$t('活动详情')"
      :status-bar="true"
      left-icon="back"
      @clickLeft="goBack"
      :fixed="true"
      background-color="#22211f"
      color="#fff"
      :shadow="false"
    ></uni-nav-bar>
    <view class="activity" v-if="!ByAppFlag">
      <view class="actImg">
        <image :src="$config.getImgUrl(this.activityList.pictureApp)" style="width: 688upx; height: 260upx; border-radius: 20upx"></image>
      </view>
      <view class="actTile">
        {{ this.activityList.intro }}
      </view>
      <view class="actTime" v-show="isShow">
        {{ $t('活动时间') }}:
        {{ this.activityList.forever == 1 ? $t('永久') : `${timeSwitch(this.activityList.startTime)}-${timeSwitch(this.activityList.endTime)}` }}
      </view>
    </view>
    <view class="act-detail-content">
      <view v-html="strings"> </view>
    </view>

    <!-- 	<view class="to-customer" v-if="this.activityList.type==0 && this.activityList.activityCompletion">
			<view class="service" @click="toCustomer">
				咨询客服
			</view>
			<view class="record" @click="openRecord">
				活动记录
			</view>
		</view>
		<view class="to-customer u-flex-all" @click="toCustomer" v-else> 咨询客服 </view> -->
    <view v-if="isShowActBtn" class="to-customer u-flex-all" @click='jumpActivity'> {{ $t('参加活动') }} </view>
    <view v-else class="to-customer u-flex-all" @click="toCustomer"> {{ $t('咨询客服') }} </view>
    <uni-popup ref="showtip" type="center">
      <view class="chuiLei-container">
        <view class="header">
          <image src="../../static/image/mb/font_title.png" mode="aspectFit"></image>
        </view>
        <scroll-view class="scroll-view_H" scroll-y="true">
          <view class="vipUl1">
            <view class="vipUl">
              <view class="vipLiHeader">
                <view class="vipLi liHeader li"> {{ $t('统计时间') }} </view>
                <view class="vipLi liHeader li liDa">  {{ $t('完成金额') }} </view>
                <view class="vipLi liHeader li">  {{ $t('状态') }} </view>
              </view>
              <view class="vipList" v-for="(item, index) of recordList" :key="index">
                <view class="vipLi" v-if="item.censusDate">
                  {{ timeSwitch(item.censusDate) }}
                </view>
                <view class="vipLi" v-else> -- {{ $t('暂无') }}-- </view>
                <view class="vipLi liDa">
                  <text> {{ item.activityCompletion[$t('损益')] }}</text>
                </view>
                <view class="vipLi">
                  <text v-show="item.auditStatus == 0 && item.status == 0"> {{ $t('进行中') }}</text>
                  <text v-show="item.auditStatus == 0 && item.status == 10"> {{ $t('未完成') }}</text>
                  <text v-show="item.auditStatus == 1 && item.status == 0"> {{ $t('待统计') }}</text>
                  <text v-show="item.auditStatus == 1 && (item.status == 5 || item.status == 6)"> {{ $t('已完成') }}</text></view
                >
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <image src="@/static/image/dze/close1.png" mode="widthFix" class="closeicon" @click="$refs.showtip.close()"></image>
    </uni-popup>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      strings: "",
      src: "../../static/image/back.png",
      jumpFlag: false,
      ByAppFlag: false,
      actFlag: false,
      id: null,
      activityList: [],
      recordList: [],
      activityCompletionArr: [],
      isShow: false,
      isShowActBtn: 0, // 是否显示参加活动按钮
    };
  },
  onLoad(options) {
    if (options.actId) {
      this.jumpFlag = true;
      this.id = options.actId;
    } else if (options.ByAppFlag) {
      this.ByAppFlag = true;
      this.id = options.ByAppFlag;
    } else {
      this.id = options.id;
      this.actFlag = true;
    }
    this.getActDetail(this.id);
    // this.getParticipate(this.id);
  },
  methods: {
    jumpActivity() {
      const self = this
      if (!this.$api.isLogin()) {
        uni.showToast({
          title:  self.$t('请先登录'),
          icon: "none",
        });
      } else {
        let datas = this.activityList;
        if(datas.jumpType == 4) {
          this.goGameDataClick(datas.bannerGame);
        } else if (datas.jumpType == 5) { //双十一活动大转盘类型
          if (datas?.expand?.actType == 3) {
            this.$cache.set("activityItem", datas);
            uni.navigateTo({
              url: "/pages/activity/activity",
            });
					} else {
						if (datas.urlId) {
							uni.navigateTo({
								//专题
								url: "/pages/actDetail/actDetail?ByAppFlag=" + datas.urlId,
							});
						}
					}
        } else if (datas.jumpType == 1) {
          uni.navigateTo({
            url: "/pages/webViewQQ/webViewQQ?url=" + datas.url,
          });
        }else if (datas.jumpType == 7) {
          uni.navigateTo({
            url: datas.url,
          });
        }
      }
    },
    // 进入游戏action
    goGameDataClick(reqData) {
       let self = this;
        let isIos = "";
        uni.showLoading({
            title: self.$t('正在进入游戏...'),
            mask: true,
        });
        var req = [self.$server.getUser().tenant_id, self.$server.getUser().username, reqData.vendorId, reqData.id, self.$config.clientIp, self.$server.getUser().user_id, 2];
        // #ifdef H5
        uni.getSystemInfo({
            success: function(resNew) {
                if (reqData.openMode === 1) {
                    isIos = "ios";
                    self.isIos = true;
                    self.winOpen = window.open("", "_blank"); //首先打开一个新页面
                } else {
                    isIos = "android";
                    self.isIos = false;
                }
            },
        });
        // #endif
        self.$api.getTokenUrl(
            ...req,
            function(err, res) {
                if (err) {
                    if (isIos === "ios") {
                        self.winOpen.location.href = "/error.html?type=1"; //改变页面的location
                        console.log("%c" + "gameDetail", "color:#a70a0a;", err);
                    } else {
                        if (reqData.status === 0) {
                            uni.showToast({
                                title: self.$t('维护中'),
                                icon: "none",
                            });
                        } else {
                            uni.showToast({
                                title: self.$t('进入游戏失败，请稍后重试！'),
                                icon: "none",
                            });
                        }
                    }
                } else {
                    let strCode = "?index=" + self.index + "&j=" + self.j + "&type=" + self.type + "&gameKindId=" + self.gameKindId;
                    let title = reqData.name;
                    // #ifdef H5
                    if (isIos === "ios") {
                        self.parensRes = res.gameUrl;
                        if (res.status === 1) {
                            //未冻结
                            setTimeout(function() {
                                //这里使用setTimeout非常重要，没有将无法实现
                                self.winOpen.location.href = res.gameUrl; //改变页面的location
                            }, 100);
                        } else {
                            localStorage.setItem("newGameUrl", res.gameUrl);
                            self.winOpen.location.href = "/error.html?type=2"; //改变页面的location
                        }
                    } else {
                        self.$server.setWebView(res.gameUrl, 3, title, strCode); //1首页 ，2搜索，3游戏列表，4活动，5公告  6缺省页
                        if (res.status === 1) {
                            uni.navigateTo({
                                url: "/pages/gameWebView/gameWebView",
                            });
                        } else {
                            self.openalert6();
                        }
                    }
                    // #endif
                    // #ifdef APP-PLUS
                    let dataGame = {
                        url: res,
                        type: 1,
                        title: title,
                        req: req,
                        urlCode: strCode,
                    };
                    uni.setStorageSync("dataGame", dataGame);
                    uni.navigateTo({
                        url: "/pages/webNvue/webNvue",
                    });
                    // #endif
                }
            },
            true
        );
    },
    getParticipate(activityId) {
      const userinfo = this.$cache.get("set_user");
      const data = {
        activityId,
        memberId: userinfo.user_id,
      };
      this.$api.participate(data, (err, res) => {
        console.log(err, res);
      });
    },
    openRecord() {
      let login = this.$api.isLogin();
      if (!login) {
        uni.navigateTo({
          url: "/pages/Login/Login",
        });
        return;
      } else {
        this.getRecordDetai();
      }
    },
    getRecordDetai() {
      this.$refs.showtip.open();
    },
    getActDetail(actId) {
      var _this = this;
      let url = this.$api.activityInfo; //从优惠列表跳转进来
      if (this.jumpFlag) {
        url = this.$api.appActDetail; //从活动记录里跳转进来
      }
      if (this.ByAppFlag) {
        url = this.$api.getThematicActivitiesByApp; //专题活动跳转进来
      }
      url(actId, function (err, res) {
        console.log(res);
        _this.activityList = res;
        _this.recordList = res.list;
        _this.isShowActBtn = res.isShow;
        if (res.list) {
          _this.recordList.forEach((item) => {
            console.log(item.activityCompletion);
            _this.activityCompletionArr.push(item.activityCompletion);
          });
        }
        _this.isShow = true;
        var obj = res;
        if (err) {
          console.log("获取活动详情失败");
        } else {
          //type=3时，url为空，content显示responseFields
          if (obj.type == 3) {
            if (obj.activityExtensionsVo && !obj.activityExtensionsVo.url) {
              _this.strings = obj.activityExtensionsVo.responseFields;
            } else {
              _this.strings = obj.rules;
            }
          } else {
            _this.strings = obj.rules;
          }
          if (res.intro && _this.ByAppFlag) {
            //专题活动内容
            _this.strings = res.intro;
          }
          //img适配
          _this.strings = _this.strings.replace(/\<p/gi, '<p class="richImg"');
        }
      });
    },

    //时间格式转换
    timeSwitch(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var time = Y + M + D;
        return time;
      }
    },
    //联系客服
    toCustomer() {
      uni.navigateTo({
        url: "/pages/subCustomerService/subCustomerService",
      });
    },
    goBack() {
      uni.navigateBacks();
    },
  },
};
</script>

<style lang="scss">
.actHeader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72upx;
  line-height: 72upx;
  text-align: center;
  font-size: 18px;
  z-index: 2;
  color: #fff;
  background: #22211f;

  .actHeaderIMg {
    width: 30upx;
    height: 30upx;
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.activity {
  width: 100%;
  padding: 0 32upx;
  box-sizing: border-box;
  position: relative;
  margin-top: 20upx;

  .actTile {
    font-size: 36upx;
    font-weight: bold;
  }

  .actTime {
    font-size: 26upx;
    color: #666;
  }
}

.act-Detail-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000;
  .perHeader {
    width: 100%;
    /* #ifdef APP-PLUS */
    height: calc(72upx + var(--status-bar-height));
    /* #endif */
    /* #ifdef H5 */
    height: 72upx;
    /* #endif */
    color: #fff;
    position: relative;
    text-align: center;

    .actHeaderIMg {
      width: 40upx;
      height: 40upx;
      position: absolute;
      left: 3px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .perHeaderReal {
    width: 100%;
    display: flex;
    align-items: center;
    height: 72upx;
    color: var(--themeActTitleBg);
    background-color: var(--themeActTopBg);
    padding: 0 30upx;
    box-sizing: border-box;
  }

  .perBody {
    flex: 1;
    padding: 0 30upx;
    box-sizing: border-box;
  }

  .perHeaderReal view:nth-child(1) {
    width: 44upx;
    height: 44upx;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
  }

  .perHeaderReal view:nth-child(2) {
    flex: 1;
    font-size: 18px;
    text-align: center;
  }

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .act-detail-content {
    flex: 1;
    padding: 30upx 30upx 100upx;
    box-sizing: border-box;
    overflow: auto;
    // color: #fff;
    // background-color: #000;

    // table{
    // 	border-collapse: collapse;
    // 	border-spacing: 0;
    // 	 border: 1px red !important ;
    // }
  }

  .to-customer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80upx;
    font-size: 32upx;
    text-align: center;
    background: linear-gradient(90deg, rgba(240, 193, 113, 1) 0%, rgba(243, 218, 158, 1) 100%);

    & > uni-view {
      display: inline-block;
      width: 50%;
      line-height: 80upx;
      text-align: center;

      color: #000;
    }

    .service {
      background: linear-gradient(to right, #f0c375, #f0c375);
    }

    .record {
      background: linear-gradient(to right, #f6d73f, #f6d73f);
    }
  }

  .chuiLei-container {
    background-color: #fff;
    width: 680upx;
    height: 812upx;
    overflow-y: scroll !important;
    border-radius: 30upx !important;

    // padding: 32upx;
    .header {
      height: 110upx;
      border-radius: 16upx 16upx 0 0;
      background-color: #f8d63c;
      display: flex;
      justify-content: center;
      align-items: center;

      image {
        width: 80%;
        height: 100upx;
      }
    }

    .scroll-view_H {
      height: 712upx;
    }

    .vipUl1 {
      padding: 30upx;
    }

    .vipUl {
      border-top: 1px solid #e0e0e0;
      border-left: 1px solid #e0e0e0;
      overflow: auto;
    }

    .vipLiHeader {
      display: flex;
    }

    .vipList {
      display: flex;
    }

    .vipLi {
      flex-grow: 0;
      flex-shrink: 0;
      width: 27%;
      text-align: center;
      font-size: 24upx;
      padding: 12upx 0px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
    }

    .liDa {
      flex-grow: 1;
    }

    .liHeader {
      font-size: 26upx;
      font-weight: 600;
    }
  }

  .closeicon {
    width: 80upx;
    height: 80upx !important;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    top: 30upx;
  }

  rich-text ::v-deep .richImg {
    max-width: 100%;
    height: auto;
  }

  rich-text ::v-deep .richImg img {
    width: 100%;
    height: 100%;
  }
}
</style>
