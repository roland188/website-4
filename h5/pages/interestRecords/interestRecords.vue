<template>
  <view class="interest-record-layout">
    <view class="perHeader">
      <view class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <view class="perHeaderReal">
        <view
          style="backgroundimage: url('../../static/image/qqImg/bankback.png')"
          @tap="goBack"
        ></view>
        <view>{{ $t('利息宝记录') }}</view>
        <view @tap="openScreen">{{ $t('筛选') }}</view>
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

    <view class="record-list">
      <scroll-view scroll-y="true" @scrolltolower="lower">
        <view class="record-item" v-for="(item, i) in dataList" :key="i">
          <view class="record-header">
            <view class="record-name">
              <image
                src="../../static/image/qqImg/interest-coin3.png"
                mode=""
              ></image>
              <text>{{ item.name }}</text>
            </view>
            <view v-show="item.status == 0" class="record-status status1">{{
              $t('计息中')
            }}</view>
            <view v-show="item.status == 1" class="record-status status2">{{
              $t('已到期')
            }}</view>
            <view v-show="item.status == 2" class="record-status status3">{{
              $t('已领取')
            }}</view>
          </view>
          <view class="record-body">
            <view class="deposit-money">
              {{ $t('存款金额：') }}{{ $config.currency }}{{
                filterNumber(item.depositAmount)
              }}
            </view>
            <view class="deposit-time">
              {{ $t('存入时间：') }}{{ switchTime(item.createdAt) }}
            </view>
            <view class="rate-row">
              {{ $t('利率：') }}{{ filterNumber(item.apr) }}%
            </view>
            <view class="settle-time">
              {{ $t('结息时间：')
              }}{{ switchTime(item.interestEndTime) }}
            </view>
            <view class="stored-time">
              {{ $t("已存放：{hour}小时", { hour: item.hour }) }}
            </view>
            <view class="interests-row">
              <view
                >{{ $t('利息：') }}{{ $config.currency }}{{
                  filterNumber(item.interest)
                }}</view
              >
              <view
                >{{ $t('本利总额：') }}{{ $config.currency }}
                {{ getSum(item.depositAmount, item.interest) }}</view
              >
            </view>
            <view class="record-btn" v-if="item.status != 2">
              <view
                v-show="item.status == 0"
                class="u-flex-all status1-btn"
                @click="openGetRatePopup(item)"
                >{{ $t('提前领取') }}</view
              >
              <view
                v-show="item.status == 1"
                class="u-flex-all status2-btn"
                @click="openGetRatePopup(item)"
                >{{ $t('领回') }}</view
              >
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

    <!-- 领取利息弹窗 -->
    <uni-popup ref="popup" type="center">
      <!-- 领取 -->
      <view class="get-rate-popup" v-show="isGet">
        <view class="popup-title">{{ $t('利息宝领取') }}</view>
        <view clas="popup-content">
          <view class="popup-total-money">{{
            getSum(popupData.depositAmount, popupData.interest)
          }}</view>
          <view class="popup-rate-row"
            >({{ $t('包含利息') }}{{ filterNumber(popupData.interest)
            }}{{ $t('元') }})</view
          >
          <view class="water-multiple">
            {{
              $t("利息流水要求:{ auditFactor}倍", { auditFactor: popupData.auditFactor })
            }}
          </view>
          <view class="popup-tips" v-show="popupData.status == 0">{{
            $t('提前领取额度，只能领取部分利息，是否确认提前领取？')
          }}</view>
        </view>
        <view class="popup-btns">
          <view class="cancel-btn u-flex-all" @click="cancelFn">{{
            $t('取消')
          }}</view>
          <view class="confirm-btn u-flex-all" @click="confirmGetFn">{{
            $t('立即领取')
          }}</view>
        </view>
      </view>
      <!-- 领取成功 -->
      <view class="get-rate-popup" v-show="!isGet">
        <view class="popup-title">{{ $t('提取成功') }}</view>
        <view clas="popup-content">
          <view class="water-multiple">{{ $t('恭喜您，完成取款操作！请及时查看账户余额！') }}</view>
        </view>
        <view class="popup-btns">
          <view class="confirm-btn u-flex-all" @click="cancelFn">{{
            $t('知道了')
          }}</view>
        </view>
      </view>
    </uni-popup>

    <!-- 筛选弹窗 -->
    <view class="screen-container" v-show="isShowScreen">
      <view class="perHeader">
        <view class="status_bar">
          <!-- 这里是状态栏 -->
        </view>
        <view class="perHeaderReal">
          <view
            style="
              backgroundimage: url('../../static/image/qqImg/bankback.png');
            "
            @tap="closeScreen"
          ></view>
          <view>{{ $t('利息宝') }}</view>
        </view>
      </view>
      <view class="content">
        <view class="text time">{{ $t('时间') }}</view>
        <view class="input-box">
          <input
            type="text"
            :placeholder="$t('开始时间')"
            v-model="startTime"
            @tap="toggleTab()"
          />
          <text class="text thought">{{ $t('至') }}</text>
          <input
            type="text"
            :placeholder="$t('结束时间')"
            v-model="endTime"
            @tap="toggleTabs()"
          />
        </view>

        <view class="trade-status">
          <view class="status-key">{{ $t('交易状态') }}</view>
          <view style="display: flex">
            <view
              class="status-item u-flex-all"
              v-for="(item, i) in navList.slice(1)"
              :key="i"
              :class="{ tradeNavActive: tradeStatusId == i }"
              @click="tradeStatusId = i"
              >{{ item.title }}</view
            >
          </view>
        </view>
      </view>
      <view class="btns">
        <view class="u-flex-all screenResetBtn" @click="resetFn">{{
          $t('重置')
        }}</view>
        <view class="u-flex-all screenConfirmBtn" @click="confirmScreenFn">{{
          $t('确定')
        }}</view>
      </view>

      <view class="mask" @click="closeScreen"></view>
    </view>

    <yu-datetime-picker
      @confirm="onConfirm"
      startYear="2010"
      ref="dateTime"
      :isAll="true"
      :current="true"
    ></yu-datetime-picker>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import yuDatetimePicker from "@/components/yu-datetime-picker/yu-datetime-picker.vue";
export default {
  data() {
    return {
      navList: [
        {
          title: this.$t('全部'),
        },
        {
          title: this.$t('计息中'),
        },
        {
          title: this.$t('已到期'),
        },
        {
          title: this.$t('已领取'),
        },
      ],
      navActiveId: 0,
      interestId: "",
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
      popupData: {},
      startOrEnd: "", //开始时间还是结束时间
      startTime: "",
      endTime: "",
      isShowScreen: false,
      tradeStatusId: 0,
      isGet: true, //是否要领取，默认领取
    };
  },
  onLoad(options) {
    if (options.id) {
      this.interestId = options.id;
    }
    this.getInterestRecordList(-1);
  },
  methods: {
    goBack() {
      uni.navigateBacks({
        delta: 1,
      });
    },
    filterNumber(num) {
      return (num * 1).toFixed(2);
    },
    switchNav(index) {
      this.navActiveId = index;
      this.currentPage = 1;
      this.loadingType = "more";
      this.getInterestRecordList(index - 1);
    },
    getSum(a, b) {
      return this.filterNumber(a + b);
    },
    getInterestRecordList(type, startTime, endTime) {
      var _this = this;

      if (_this.loadingType != "more") {
        //显示正在加载中。。。或者没有更多数据了，就不用请求了
        return false;
      }
      _this.loadingType = "loading"; //显示正在加载中。。。。

      var data = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status: type,
        startTime: startTime ? startTime + " 00:00:00" : "",
        endTime: endTime ? endTime + " 23:59:59" : "",
      };

      //通过id查看记录
      if (this.interestId) {
        this.$set(data, "interestId", this.interestId);
      }

      this.$api.interestRecordList(
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
        this.getInterestRecordList();
      }
    },
    openGetRatePopup(item) {
      //领取弹窗
      this.popupData = item;
      this.$refs.popup.open();
    },
    cancelFn() {
      this.isGet = true;
      this.$refs.popup.close();
    },
    confirmGetFn() {
      this.getRateFn();
    },
    getRateFn() {
      //领取利息
      var _this = this;
      var id = this.popupData.id;

      this.$api.receiveInterest(id, function (err, res) {
        if (err) {
          setTimeout(function () {
            _this.cancelFn();
          }, 1500);
        } else {
          //领取成功
          _this.isGet = false;
          _this.switchNav(_this.navActiveId);
        }
      });
    },
    //开始日期弹窗
    toggleTab(item, index) {
      this.$refs.dateTime.show();
      this.startOrEnd = "1";
    },
    //结束日期弹窗
    toggleTabs(item, index) {
      this.$refs.dateTime.show();
      this.startOrEnd = "2";
    },
    //选择日期
    onConfirm(val) {
      this.startOrEnd === "1"
        ? (this.startTime = val.selectRes)
        : (this.endTime = val.selectRes);
    },
    openScreen() {
      this.isShowScreen = true;
    },
    closeScreen() {
      this.isShowScreen = false;
    },
    resetFn() {
      this.startTime = "";
      this.endTime = "";
    },
    confirmScreenFn() {
      this.closeScreen();
      this.navActiveId = this.tradeStatusId + 1;
      this.currentPage = 1;
      this.loadingType = "more";
      console.log(this.startTime, this.endTime);
      this.getInterestRecordList(
        this.tradeStatusId,
        this.startTime,
        this.endTime
      );
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
  },
  components: {
    uniPopup,
    yuDatetimePicker,
  },
};
</script>

<style lang="scss">
.interest-record-layout {
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
      color: var(--themeActTitleBg);
      background-color: var(--themeActTopBg);

      view:nth-child(1) {
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

      view:nth-child(3) {
        font-size: 28upx;
      }
    }
  }

  .interest-nav {
    display: flex;
    height: 100upx;

    .nav-title {
      flex: 25% 0 0;
      font-size: 30upx;
      color: #a7a7a7;
      border-bottom: 4upx solid transparent;
    }

    .navActive {
      border-color: #cb3318;
      color: #cb3318;
      font-weight: bold;
    }
  }

  .record-list {
    flex: 1;
    overflow: auto;
    padding: 20upx 32upx 0;
    box-sizing: border-box;
    background-color: #f7f7f7;

    ::v-deep uni-scroll-view {
      height: 100%;
    }

    .record-item {
      margin-bottom: 20upx;
      width: 100%;
      background: #ffffff;
      border-radius: 16upx;

      .record-header {
        height: 106upx;
        padding: 0 32upx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2upx solid #f7f7f7;

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

        .record-status {
          font-size: 24upx;
        }

        .status1 {
          color: #ff631e;
        }

        .status2 {
          color: #1d1717;
        }

        .status3 {
          color: #a7a7a7;
        }
      }

      .record-body {
        padding: 30upx 32upx 24upx;
        box-sizing: border-box;
        font-size: 22upx;

        > view {
          margin-bottom: 16upx;
        }

        .deposit-money {
          font-size: 30upx;
          font-weight: bold;
          margin-bottom: 32upx;
        }

        .interests-row {
          display: flex;
          justify-content: space-between;
          align-items: center;

          view:nth-child(1) {
            color: #ff631e;
          }

          view:nth-child(2) {
            opacity: 0.8;
          }
        }

        .record-btn {
          display: flex;
          justify-content: flex-end;
          margin-top: 36upx;

          > view {
            width: 176upx;
            height: 60upx;
            border-radius: 36upx;
            box-shadow: 0px 3px 6px rgba(255, 229, 217, 0.39);
            font-size: 28upx;
            background: #cb3318;
            color: #fff;
          }

          .disBtn {
            opacity: 0.5;
          }
        }
      }
    }
  }

  .get-rate-popup {
    width: 536upx;
    background-color: #fff;
    text-align: center;
    border-radius: 16upx;
    padding-top: 32upx;

    .popup-title {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 8upx;
    }

    .popup-total-money {
      font-size: 50upx;
      margin-bottom: 16upx;
    }

    .popup-rate-row {
      font-size: 24upx;
      margin-bottom: 10upx;
    }

    .water-multiple {
      font-size: 30upx;
      margin-bottom: 8upx;
    }

    .popup-tips {
      color: #a7a7a7;
      font-size: 24upx;
      margin: 0 60upx 12upx;
      line-height: 34upx;
    }

    .popup-btns {
      display: flex;
      height: 80upx;
      border-top: 2upx solid #f4f4f4;

      view {
        flex: 1;
        font-size: 30upx;
      }

      .cancel-btn {
        color: #a7a7a7;
        border-right: 2upx solid #f4f4f4;
      }

      .confirm-btn {
        color: #cb3318;
      }
    }
  }

  .screen-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    flex-direction: column;

    .perHeader {
      color: #fff;

      .perHeaderReal {
        color: #fff;
      }
    }

    .content {
      padding: 50upx 32upx 0;
      box-sizing: border-box;
      background-color: #fff;

      .text {
        height: 42upx;
        font-size: 30upx;
        font-weight: bold;
        line-height: 42upx;
      }

      .time {
        margin-bottom: 32upx;
      }

      .input-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 50upx;

        input {
          width: 244upx;
          height: 80upx;
          line-height: 80upx;
          border: 1px solid #e1e1e1;
          border-radius: 10upx;
          text-align: center;
        }
      }

      .trade-status {
        margin-bottom: 134upx;

        .status-key {
          font-size: 30upx;
          font-weight: bold;
          margin-bottom: 32upx;
        }

        .status-item {
          width: 142upx;
          height: 60upx;
          background: #ffffff;
          border: 1px solid #e1e1e1;
          border-radius: 10upx;
          color: #a7a7a7;
          font-size: 26upx;
          margin-right: 32upx;
        }

        .tradeNavActive {
          background: #cb3318;
          color: #fff;
        }
      }
    }

    .btns {
      display: flex;
      align-items: center;

      view {
        flex: 1;
        height: 88upx;
        font-size: 30upx;
      }

      .screenResetBtn {
        background: #ffefef;
        color: #cb3318;
      }

      .screenConfirmBtn {
        background: #cb3318;
        color: #fff;
      }
    }

    .mask {
      flex: 1;
    }
  }
}
</style>
