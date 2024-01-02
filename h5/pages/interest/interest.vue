<template>
  <view class="interest-layout">
    <view class="perHeader">
      <view class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <view class="perHeaderReal">
        <view
          style="backgroundimage: url('../../static/image/qqImg/bankback.png')"
          @tap="goBack"
        ></view>
        <view>{{ $t('利息宝') }}</view>
        <view
          style="
            backgroundimage: url('../../static/image/qqImg/interest-record.png');
          "
          @tap="toPage('../interestRecords/interestRecords')"
        ></view>
      </view>
    </view>

    <view class="interest-nav">
      <view
        class="nav-title u-flex-all"
        v-for="(item, i) in navList"
        :key="i"
        @click="switchNav(i)"
        :class="{ navActive: navActiveId == i }"
        >{{ item.title }}</view
      >
    </view>

    <view class="interest-list">
      <scroll-view scroll-y="true" @scrolltolower="lower">
        <view class="interest-item" v-for="(item, i) in dataList" :key="i">
          <view
            v-show="item.status == 4"
            class="interest-item-container item-container1"
            @click="toPage('../interestDeposit/interestDeposit', item.id)"
          >
            <view class="item-header">
              <view class="item-header-left">
                <image
                  src="../../static/image/qqImg/interest-coin1.png"
                  mode=""
                ></image>
                <text>{{ item.name }}</text>
              </view>
              <view class="item-header-right">
                <text class="item-status">{{ $t('进行中') }}</text>
                <image
                  src="../../static/image/qqImg/interest-arrow1.png"
                  mode=""
                ></image>
              </view>
            </view>

            <view class="item-body">
              <view class="rate-row">
                <text class="rate-key">{{ $t('年利率：') }}</text>
                <text class="rate-val"
                  >{{ filterNumber(item.minRate) }}%~{{
                    filterNumber(item.maxRate)
                  }}%</text
                >
              </view>
              <view class="time-row">
                <text class="time-key">{{ $t('开放区间：') }}</text>
                <text class="time-val"
                  >{{ switchTime(item.startTime) }}~{{
                    switchTime(item.endTime)
                  }}</text
                >
              </view>
              <view class="btn-row">
                <view class="item-btn">{{ $t('存入提升收益') }}</view>
              </view>
            </view>
          </view>

          <view
            v-show="item.status == 3"
            class="interest-item-container item-container2"
            @click="toPage('../interestDeposit/interestDeposit', item.id)"
          >
            <view class="item-header">
              <view class="item-header-left">
                <image
                  src="../../static/image/qqImg/interest-coin2.png"
                  mode=""
                ></image>
                <text>{{ item.name }}</text>
              </view>
              <view class="item-header-right">
                <text class="item-status">{{ $t('未开放') }}</text>
                <image
                  src="../../static/image/qqImg/interest-arrow2.png"
                  mode=""
                ></image>
              </view>
            </view>

            <view class="item-body">
              <view class="rate-row">
                <text class="rate-key">{{ $t('年利率：') }}</text>
                <text class="rate-val"
                  >{{ filterNumber(item.minRate) }}%~{{
                    filterNumber(item.maxRate)
                  }}%</text
                >
              </view>
              <view class="time-row">
                <text class="time-key">{{ $t('开放区间：') }}</text>
                <text class="time-val"
                  >{{ switchTime(item.startTime) }}~{{
                    switchTime(item.endTime)
                  }}</text
                >
              </view>
              <view class="btn-row">
                <view class="item-btn">{{ $t('存入提升收益') }}</view>
              </view>
            </view>
          </view>

          <view
            v-show="item.status == 2"
            class="interest-item-container item-container3"
            @click="toPage('../interestDeposit/interestDeposit', item.id)"
          >
            <view class="item-header">
              <view class="item-header-left">
                <image
                  src="../../static/image/qqImg/interest-coin3.png"
                  mode=""
                ></image>
                <text>{{ item.name }}</text>
              </view>
              <view class="item-header-right">
                <text class="item-status">{{ $t('结束申请') }}</text>
                <image
                  src="../../static/image/qqImg/interest-arrow3.png"
                  mode=""
                ></image>
              </view>
            </view>

            <view class="item-body">
              <view class="rate-row">
                <text class="rate-key">{{ $t('年利率：') }}</text>
                <text class="rate-val"
                  >{{ filterNumber(item.minRate) }}%~{{
                    filterNumber(item.maxRate)
                  }}%</text
                >
              </view>
              <view class="time-row">
                <text class="time-key">{{ $t('开放区间：') }}</text>
                <text class="time-val"
                  >{{ switchTime(item.startTime) }}~{{
                    switchTime(item.endTime)
                  }}</text
                >
              </view>
              <view class="btn-row">
                <view
                  class="item-btn"
                  @click.stop="toPage('../interestRecords/interestRecords')"
                  >{{ $t('查看') }}</view
                >
              </view>
            </view>
          </view>

          <view
            v-show="item.status == 1"
            class="interest-item-container item-container4"
            @click="toPage('../interestDeposit/interestDeposit', item.id)"
          >
            <view class="item-header">
              <view class="item-header-left">
                <image
                  src="../../static/image/qqImg/interest-coin4.png"
                  mode=""
                ></image>
                <text>{{ item.name }}</text>
              </view>
              <view class="item-header-right">
                <text class="item-status"
                  ><strong>{{ $t('结束计息') }}</strong></text
                >
                <image
                  src="../../static/image/qqImg/interest-arrow4.png"
                  mode=""
                ></image>
              </view>
            </view>

            <view class="item-body">
              <view class="rate-row">
                <text class="rate-key">{{ $t('年利率：') }}</text>
                <text class="rate-val"
                  >{{ filterNumber(item.minRate) }}%~{{
                    filterNumber(item.maxRate)
                  }}%</text
                >
              </view>
              <view class="time-row">
                <text class="time-key">{{ $t('开放区间：') }}</text>
                <text class="time-val"
                  >{{ switchTime(item.startTime) }}~{{
                    switchTime(item.endTime)
                  }}</text
                >
              </view>
              <view class="btn-row">
                <view
                  class="item-btn"
                  @click.stop="toPage('../interestRecords/interestRecords')"
                  >{{ $t('查看') }}</view
                >
              </view>
            </view>
          </view>
        </view>

        <!-- 上拉显示更多/正在加载/没有更多数据了 -->
        <text
          class="loading-text u-flex-all"
          style="padding: 40upx 0; font-size: 28upx"
        >
          {{
            loadingType === "more"
              ? loadingText.loadingDown
              : loadingType === "loading"
              ? loadingText.loadingRefresh
              : loadingText.loadingNoMore
          }}
        </text>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          title: this.$t('全部'),
        },
        {
          title: this.$t('进行中'),
        },
        {
          title: this.$t('未开放'),
        },
        {
          title: this.$t('已结束'),
        },
      ],
      navActiveId: 0,
      status: 1,
      currentPage: 1,
      pageSize: 10,
      dataList: [],
      totalPages: 0,
      //loadingText
      loadingType: "more", //提示消息，'more'表示上拉加载更多，'loading'表示正在加载...，2表示没有更多数据了
      loadingText: {
        loadingDown: "",
        loadingRefresh: this.$t('加载中...'),
        loadingNoMore: this.$t('没有更多了哦'),
      },
    };
  },
  onLoad() {
    this.getInterestList();
  },
  methods: {
    //过滤数据
    filterNumber(num) {
      return (num * 1).toFixed(2);
    },
    goBack() {
      uni.navigateBacks({
        delta: 1,
      });
    },
    switchNav(index) {
      this.navActiveId = index;
      this.currentPage = 1;
      this.loadingType = "more";
      //全部0  进行中4   未开放3   已结束2
      var index = index == 0 ? index : 5 - index;
      this.getInterestList(index);
    },
    getInterestList(type) {
      var _this = this;

      if (_this.loadingType != "more") {
        //显示正在加载中。。。或者没有更多数据了，就不用请求了
        return false;
      }
      _this.loadingType = "loading"; //显示正在加载中。。。。

      var data = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };

      //类型筛选
      if (type) {
        this.$set(data, "type", type);
      }

      this.$api.interestList(
        data,
        function (err, res) {
          if (err) {
          } else {
            let data = _this.currentPage == 1 ? [] : _this.dataList;
            data.push(...res.content);
            _this.dataList = data;

            _this.totalPages = res.totalPages;

            if (_this.dataList.length == res.totalRecords) {
              //显示数据没有了
              _this.loadingType = "noMore";
            } else {
              //上拉加载更多
              _this.loadingType = "more";
            }
          }
        },
        true
      );
    },
    lower() {
      if (this.totalPages > this.currentPage) {
        this.currentPage++;
        this.getInterestList();
      }
    },
    add0(val) {
      return val < 10 ? "0" + val : val;
    },
    //日期转换
    switchTime(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear();
        var M = this.add0(date.getMonth() + 1);
        var D = this.add0(date.getDate());
        var h = this.add0(date.getHours());
        var m = this.add0(date.getMinutes());
        var s = this.add0(date.getSeconds());
        var time = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
        return time;
      } else {
        return "--/--";
      }
    },
    toPage(url, id) {
      console.log(id, "iiiiiiiiiiiiii");
      //跳转页面
      var idStr = "";
      if (id) {
        idStr = "?id=" + id;
      }
      uni.navigateTo({
        url: url + idStr,
      });
    },
  },
};
</script>

<style lang="scss">
.interest-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  //行高
  view {
    line-height: normal;
  }

  .perHeader {
    width: 100%;
    /* #ifdef APP-PLUS */
    height: calc(88upx + var(--status-bar-height));
    /* #endif */
    /* #ifdef H5 */
    height: 88upx;
    /* #endif */
    color: #fff;
    background-color: #000;

    .status_bar {
      height: var(--status-bar-height);
      width: 100%;
    }

    .perHeaderReal {
      width: 100%;
      display: flex;
      align-items: center;
      height: 88upx;
      padding: 0 30upx;
      box-sizing: border-box;
      border-bottom: 2upx solid #f4f4f4;
      color: #fff;
      background-color: #000;

      view:nth-child(1),
      view:nth-child(3) {
        width: 44upx;
        height: 44upx;
        background-size: cover;
        background-repeat: no-repeat;
      }

      view:nth-child(2) {
        flex: 1;
        font-size: 36upx;
        font-weight: bold;
        text-align: center;
      }
    }
  }

  .interest-nav {
    display: flex;
    height: 80upx;

    .nav-title {
      flex: 25% 0 0;
      font-size: 30upx;
      border-bottom: 4upx solid transparent;
    }

    .navActive {
      border-color: #cb3318;
      color: #cb3318;
    }
  }

  .interest-list {
    flex: 1;
    overflow: auto;
    padding: 0 32upx;
    box-sizing: border-box;

    ::v-deep uni-scroll-view {
      height: 100%;
    }

    .interest-item {
      margin-top: 20upx;

      .interest-item-container {
        width: 100%;
        height: 354upx;
        background-size: cover;
        background-repeat: no-repeat;

        .item-header {
          height: 106upx;
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 0 14upx 0 32upx;
          box-sizing: border-box;
          border-bottom: 2upx solid rgba(255, 255, 255, 0.1);

          > view {
            display: flex;
            align-items: center;
          }

          .item-header-left {
            image {
              width: 30upx;
              height: 30upx;
              margin-right: 14upx;
            }

            text {
              font-size: 30upx;
              width: 400upx;
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .item-header-right {
            image {
              width: 40upx;
              height: 40upx;
            }

            text {
              font-size: 24upx;
              opacity: 0.7;
              margin-left: 6upx;
            }
          }
        }

        .item-body {
          padding: 32upx;
          box-sizing: border-box;

          .rate-row {
            display: flex;
            align-items: center;

            .rate-key {
              font-size: 30upx;
            }

            .rate-val {
              font-size: 40upx;
            }
          }

          .time-row {
            font-size: 22upx;
            opacity: 0.7;
            margin: 12upx 0 32upx;
          }

          .btn-row {
            display: flex;
            justify-content: flex-end;

            .item-btn {
              height: 60upx;
              line-height: 60upx;

              border-radius: 36upx;
              padding: 0 32upx;
              font-size: 28upx;
            }
          }
        }
      }

      .item-container1 {
        color: #fff;
        background-image: url("../../static/image/qqImg/interest-bg1.png");

        .item-btn {
          background: #fff9a4;
          color: #ff631e;
        }
      }

      .item-container2 {
        color: #1d1717;
        background-image: url("../../static/image/qqImg/interest-bg2.png");

        .item-status {
          color: #11aeff;
        }

        .time-row {
          color: #a7a7a7;
        }

        .item-btn {
          background: #11aeff;
          box-shadow: 0px 1px 6px rgba(17, 174, 255, 0.34);
          color: #fff;
        }
      }

      .item-container3 {
        color: #1d1717;
        background-image: url("../../static/image/qqImg/interest-bg3.png");

        .item-status {
          color: #ff631e;
        }

        .time-row {
          color: #a7a7a7;
        }

        .item-btn {
          background: #ff631e;
          box-shadow: 0px 1px 6px rgba(255, 99, 30, 0.27);
          color: #fff;
        }
      }

      .item-container4 {
        color: #1d1717;
        background-image: url("../../static/image/qqImg/interest-bg4.png");

        .item-status {
          color: #a7a7a7;
        }

        .time-row {
          color: #a7a7a7;
        }

        .item-btn {
          background: #a7a7a7;
          box-shadow: 0px 1px 6px rgba(167, 167, 167, 0.35);
          color: #fff;
        }
      }
    }
  }

  //css隐藏滚动条样式：
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
