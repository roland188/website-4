<!-- 站内信详情  by  qiqi -->
<template>
  <view class="msg-detail">
    <view class="perHeader">
      <view class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <view class="perHeaderReal">
        <view style="backgroundImage: url('../../static/image/qqImg/bankback.png')" @tap="goBack"></view>
        <view class="textOne setMoneyColor">{{ $t('详情') }}</view>
      </view>
    </view>
    <view class="msg-detail-content">
      <rich-text :nodes="strings"></rich-text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      strings: "",
    };
  },
  onLoad(options) {
    if (options.type == 1) {
      this.getMsgDetail(options.id);
    } else {
      this.getNoticeDetail(options.id);
    }
  },
  methods: {
    getMsgDetail(id) {
      var _this = this;
      this.$api.messageInfo(id, function (err, res) {
        // console.log(err, res)
        if (err) {
        } else {
          _this.strings = res.content;
        }
      });
    },
    getNoticeDetail(id) {
      var _this = this;
      this.$api.noticeInfo(id, function (err, res) {
        // console.log(err, res)
        if (err) {
        } else {
          _this.strings = res.content;
        }
      });
    },
    goBack() {
      uni.navigateBacks();
    },
  },
};
</script>

<style lang="scss">
.msg-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

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
    align-items: center;
    height: 88upx;
    color: #fff;
    padding: 0 30upx;
    box-sizing: border-box;
    background-color: #22211f;
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
    font-size: 36upx;
    font-weight: bold;
    text-align: center;
  }

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .msg-detail-content {
    flex: 1;
    color: #000;
    overflow: auto;
    padding: 20upx;
    box-sizing: border-box;
    background-color: #f3f3f3;
  }
}
</style>
