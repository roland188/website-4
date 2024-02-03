<template>
  <view class="perfer-wrap">
    <uni-nav-bar
      :title="$t('优惠活动')"
      :fixed="true"
      :statusBar="true"
      :shadow="false"
    >
    </uni-nav-bar>
    <view class="nav-wrap">
      <scroll-view
        :enable-flex="true"
        scroll-with-animation
        :throttle="false"
        scroll-x
      >
        <view class="tabBox" v-if="navList.length">
          <view class="tab-item" @tap="changeIndex('')">
            <view :class="switchId == '' ? 'tab-choice' : ''">{{
              $t('全部优惠')
            }}</view>
          </view>
          <view
            class="tab-item"
            :key="item.id"
            v-for="(item, index) in navList"
            @tap="changeIndex(item.id)"
          >
            <view :class="switchId == item.id ? 'tab-choice' : ''">{{
              item.remark
            }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="activity-layout">
      <view class="content-wrap">
        <view class="item" v-if="actReqSuccess">
          <view
            class="img-wrap"
            v-for="(item, index) in activityList"
            :key="index"
            @tap="toActivityDetail($event, item)"
          >
            <view class="actImg">
              <image
                :src="$config.getImgUrl(item.pictureApp)"
                lazy-load
              ></image>
            </view>
            <view class="actInform">
              <view class="actInformLeft">
                <view class="actInBox">
                  <text class="themeText">{{ item.name }}</text>
                </view>
                <view class="actType">
                  <text class="themeTextTwo" v-if="item.forever == 1">{{
                    $t('活动时间: 永久')
                  }}</text>
                  <text class="themeTextTwo" v-else
                    >{{ $t('活动时间：')
                    }}{{ timeSwitch(item.startTime) }} -
                    {{ timeSwitch(item.endTime) }}</text
                  >
                </view>
              </view>
            </view>
          </view>
          <view v-show="isLoadMore" color="#fff">
            <view style="text-align: center; line-height: 80upx">{{
              nomoreText
            }}</view>
            <uni-load-more v-if="loadStatus != 'noMore'" :status="loadStatus">{{
              nomoreText
            }}</uni-load-more>
          </view>
        </view>
        <view v-else>
          <view style="padding-top: 200rpx; text-align: center; color: #fff">{{
            $t('暂时没有活动哦')
          }}</view>
        </view>
      </view>
    </view>
	  <myTabBar :current="2" ref="menuBar" />
  </view>
</template>

<script>
import { uniLoadMore } from "@dcloudio/uni-ui";
import myTabBar from '@/components/myTabBar/index.vue';
export default {
  components: {
    uniLoadMore,
    myTabBar
  },
  data() {
    return {
      loadStatus: "loading", //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
      loadingText: this.$t('加载中...'),
      loadmoreText: this.$t('下拉刷新'),
      nomoreText: this.$t('没有更多了哦'),
      isLoadMore: false, //是否加载中
      src: "../../static/image/back.png",
      rules: "", //活动规则，跳转到外部链接
      flag: true, //页面跳转，禁止双击
      actReqSuccess: true, //是否显示nothing
      userId: "",
      opacityHeight: 0,
      startTop: 0,
      uid: "",
      username: "",
      tenetid: "",
      switchId: "",
      currentPage: 1,
      pageSize: 5,
      totalRecords: "",
      activityList: [],
      navList: [],
      actReqSuccess: true,
    };
  },
  onShow() {
    this.getActivityList();
    this.getActivityType();
  },
  onReachBottom() {
    this.isLoadMore = true;
    this.currentPage += 1;
    this.getActivityList();
  },
  methods: {
    timeSwitch(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + ".";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + ".";
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var h, mm;
        h = date.getHours();
        mm = date.getMinutes();
        h = h < 10 ? "0" + h : h;
        mm = mm < 10 ? "0" + mm : mm;
        var time = Y + M + D + " " + h + ":" + mm + "";
        return time;
      }
    },
    // 获取优惠导航
    getActivityType() {
      this.$api.activityType({}, (err, res) => {
        this.navList = res;
      });
    },
    // 获取优惠列表
    getActivityList() {
      this.$api.activity(
        this.currentPage,
        this.pageSize,
        this.switchId,
        (err, res) => {
          this.totalRecords = res.totalRecords;
          if (res.content) {
            console.log(res.content.length);
            if (this.currentPage == 1) {
              this.activityList = res.content;
            } else {
              this.activityList = this.activityList.concat(res.content);
            }
            if (res.content.length < this.pageSize) {
              this.isLoadMore = true;
              this.loadStatus = "noMore";
            } else {
              this.isLoadMore = false;
            }
          } else {
            this.isLoadMore = true;
            this.loadStatus = "noMore";
          }
          if (this.activityList.length === this.totalRecords) {
            this.loadStatus = "noMore";
          }
        }
      );
    },
    changeIndex(id) {
      if (id == this.switchId) return;
      this.switchId = id;
      // if (id) {
      // 	this.pageSize = 5
      // } else {
      // 	this.pageSize = 50
      // }
      this.currentPage = 1;
      this.getActivityList();
    },

    goGameDataClick(reqData) {
      let isIos = "";
      uni.showLoading({
        title: this.$t('正在进入游戏...'),
        mask: true,
      });
      let self = this;
      var req = [
        self.tenetid,
        self.username,
        reqData.vendorId,
        reqData.ids || reqData.id,
        self.$config.clientIp,
        self.uid,
        2,
      ];
      // #ifdef H5
      uni.getSystemInfo({
        success: function (resNew) {
          if (reqData.openMode === 1) {
            isIos = "ios";
            self.isIos = true;
            self.winOpen = window.open("", "_blank");
          } else {
            isIos = "android";
            self.isIos = false;
          }
        },
      });
      // #endif
      self.$api.getTokenUrl(
        ...req,
        function (err, res) {
          if (err) {
            if (isIos === "ios") {
              self.winOpen.location.href = "/error.html?type=1";
            } else {
              if (reqData.status === 0) {
                uni.showToast({
                  title:  this.$t('维护中'),

                  icon: "none",
                });
              } else {
                uni.showToast({
                  title:  this.$t('进入游戏失败，请稍后重试！'),

                  icon: "none",
                });
              }
            }
          } else {
            let strCode =
              "?index=" +
              self.index +
              "&j=" +
              self.j +
              "&type=" +
              self.type +
              "&gameKindId=" +
              self.gameKindId;
            let title = reqData.name;
            // #ifdef H5
            if (isIos === "ios") {
              self.parensRes = res.gameUrl;
              if (res.status === 1) {
                setTimeout(function () {
                  self.winOpen.location.href = res.gameUrl;
                }, 100);
              } else {
                localStorage.setItem("newGameUrl", res.gameUrl);
                self.winOpen.location.href = "/error.html?type=2";
              }
            } else {
              self.$server.setWebView(res.gameUrl, 3, title, strCode);
              if (res.status === 1) {
                uni.navigateTo({
                  url: "../gameWebView/gameWebView",
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
    toActivityDetail(e, item) {
      var _this = this;
      if (item.type == 7) {
        uni.navigateTo({
          url: item.url,
        });
      }
      if (item.type == 3) {
        if (item.activityExtensionsVo.url) {
          //跳转链接
          // #ifdef H5
          window.open(item.activityExtensionsVo.url);
          // #endif

          // #ifdef APP-PLUS
          uni.navigateTo({
            url: "../webView/webView?url=" + item.activityExtensionsVo.url,
          });
          // #endif

          return;
        } else if (
          item.activityExtensionsVo &&
          item.activityExtensionsVo.type == 4
        ) {
          //跳转游戏
          if (!_this.$api.isLogin()) {
            uni.navigateTo({
              url: "../Login/Login",
            });
            return;
          } else {
            _this.uid = _this.$server.getUser().user_id;
            _this.username = _this.$server.getUser().username;
            _this.tenetid = _this.$server.getUser().tenant_id;
            _this.goGameDataClick(item.activityExtensionsVo.activityGame);
            return;
          }
        } else {
          //打开活动详情
          var id = item.id;
        }
      } else {
        var id = item.id;
      }
      uni.navigateTo({
        url: "../actDetail/actDetail?id=" + id,
      });
    },
    BackPage() {
      uni.navigateBacks({});
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
}

.perfer-wrap {
  position: relative;

  .nav-wrap {
    width: 100%;
    position: fixed;
    /* #ifdef APP-PLUS */
    top: calc(80upx + var(--status-bar-height));
    /* #endif */
    /* #ifdef H5 */
    top: 80rpx;
    /* #endif */
    background: var(--themeNavTabBg);
    z-index: 999;

    .tabBox {
      position: relative;
      white-space: nowrap;
      line-height: 60rpx;
      margin: 0 20rpx;
      overflow-x: auto;
      box-shadow: 15px 0 10px -11px #a9a8a5, -15px 0 15px -15px #151414;

      .tab-item {
        padding: 16rpx 12rpx;
        position: relative;
        display: inline-block;
        text-align: center;
        font-size: 24upx;
        color: var(--themeNavTabColor);

        .tab-choice {
          color: var(--themeNavTabAcColor);
          border-bottom: 4rpx solid var(--themeNavTabAcColor);
        }
      }
    }
  }

  .activity-layout {
    height: calc(100vh - 80upx - 100upx);
    box-sizing: border-box;
    background: var(--theme);
    .content-wrap {
      flex: 1;
      overflow: auto;
      /* #ifdef APP-PLUS */
      padding: 80upx 26upx 30upx;
      /* #endif */
      /* #ifdef H5 */
      padding: 80upx 26upx 70upx;
      /* #endif */
      background: var(--theme);
      padding-bottom: 50rpx;

      .img-wrap {
        margin-top: 30upx;
        border-top: 1px solid #ddc9a1;
        border-bottom: 1px solid #7d715b;
        border-right: 1px solid #c1af8e;
        border-left: 1px solid #9e8f74;
        border-radius: 20upx;
        padding: 9upx;

        .actImg {
          width: 100%;
          height: 260upx;
          background: url(@/static/image/bannerLoading.png) no-repeat;
          background-size: 100% 100%;
          border-radius: 10upx;
          overflow: hidden;

          & > image {
            width: 100%;
            height: 100%;
          }
        }

        .actInform {
          width: 100%;
          padding: 20upx 20upx 0;
          box-sizing: border-box;
          background: var(--themeNavTabBg);

          .actInformLeft {
            flex: 1;
            overflow: hidden;
            height: 100%;

            .actInBox {
              height: 40upx;

              .themeText {
                display: inline-block;
                max-width: 99%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 36upx;
                font-weight: 500;
                color: var(--themeNavTabAcColor);
                line-height: 44upx;
              }
            }

            .actType {
              .themeTextTwo {
                padding: 0 !important;
                font-size: 26upx;
                color: #666;
                font-weight: 400;
              }
            }
          }
        }
      }
    }
  }
}
</style>
