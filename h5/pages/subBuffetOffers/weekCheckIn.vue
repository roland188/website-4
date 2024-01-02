<template>
  <view class="page-container" :class="'SignPage-'+ $config.projectImgUrl">
    <view class="content">
      <view class="s-header">
        <image
          src="./image/weekCheckIn/back.png"
          @click="goBack"
          class="back"
        ></image>
        <text>{{ title }}</text>
      </view>
      <view class="page-main">
        <image
          src="./image/weekCheckIn/bg-boy.png"
          class="top-rightImg"
        ></image>
        <view class="header">
          <image src="./image/weekCheckIn/image1.png" class="img1" mode="" />
          <view class="header-end">
            <view class="active-info">
              <view class="level">{{ `VIP${vipLevel}` }}</view>
              <view class="num"
                >签到天数
                <text class="days">{{ checkInfo.signDays || 0 }}</text>
              </view>
            </view>
            <view
              class="btnSuccess"
              v-if="
                currentSignInfo.current &&
                currentSignInfo.canSignIn &&
                currentSignInfo.signIn
              "
              >今日已签到</view
            >
            <view
              class="btnNormal"
              v-if="
                currentSignInfo.current &&
                currentSignInfo.canSignIn &&
                !currentSignInfo.signIn
              "
              @click="daySign"
              >立即签到</view
            >
            <view
              class="btn btn-un"
              v-if="
                currentSignInfo.current &&
                !currentSignInfo.canSignIn &&
                !currentSignInfo.signIn
              "
              >未完成</view
            >
          </view>
        </view>
        <view class="activity-block">
          <!--签到历史-->
          <view class="activity-history" v-if="daySignList.length">
            <view
              v-for="(day, index) in daySignList"
              :key="'day' + day.day"
              class="activity-history-card"
              :class="[
                day.signIn ? 'sub-success' : day.canLate ? 'sub-supply' : '',
                day.day === 7 ? 'last-card' : '',
              ]"
            >
              <text class="sub-num">{{ day.day }}</text>
              <view
                v-if="index <= 5"
                class="history-box"
                :class="[
                  day.signIn ? 'sign-success' : '',
                  day.current && day.signIn ? 's-succ' : '',
                  day.current && !day.signIn ? 's-normal' : '',
                ]"
                @click="historySign(day)"
              >
                <view class="box-top-right" v-if="day.hot">加倍</view>
                <view :class="day.signIn ? 'txt-success' : 'txt-normal'">{{
                  day.award
                }}</view>
                <view class="btn-success" v-if="day.signIn">
                  <image
                    src="./image/weekCheckIn/icon-right.png"
                    class="iRight"
                  ></image>
                </view>

                <view class="btn-supply" v-if="day.canLate && isOpenSupply"
                  >补签</view
                >
                <view
                  class="btn-unSign"
                  v-if="day.current && !day.signIn && day.canSignIn"
                  >未签</view
                >
                <view
                  class="btn-normal"
                  v-if="!day.canSignIn && !day.signIn && !day.canLate"
                  >{{ `+${day.activeValue}活跃` }}</view
                >
              </view>
              <view
                v-else
                @click="historySign(day)"
                class="last-card-box"
                :class="[
                  day.signIn ? 'sign-success' : '',
                  day.current && day.signIn ? 's-succ' : '',
                  day.current && !day.signIn ? 's-normal' : '',
                ]"
              >
                <image
                  v-if="!day.signIn"
                  src="./image/weekCheckIn/last-normal.png"
                  class="bgImg"
                ></image>
                <image
                  v-if="day.current && day.signIn"
                  src="./image/weekCheckIn/last-success.png"
                  class="bgImg"
                ></image>
                <!-- <view class="btn-normal">
                    {{ `+${day.activeValue}活跃` }}
                  </view> -->
                <view class="last-hot" v-if="day.hot">超级加倍</view>
                <view class="last-bottom">
                  <view
                    :class="day.signIn ? 'award-success' : 'award-normal'"
                    >{{ day.award }}</view
                  >
                  <view class="btn-success" v-if="day.signIn">
                    <image
                      src="./image/weekCheckIn/icon-right.png"
                      class="iRight"
                    ></image>
                  </view>
                  <view
                    class="btn-normal"
                    v-if="!day.canSignIn && !day.signIn && !day.canLate"
                    >{{ `+${day.activeValue}活跃` }}</view
                  >
                  <view class="btn-supply" v-if="day.canLate && isOpenSupply"
                    >补签</view
                  >
                  <view
                    class="btn-unSign"
                    v-if="day.current && !day.signIn && day.canSignIn"
                    >未签</view
                  >
                </view>
              </view>
            </view>
          </view>
          <!--签到进度-->
          <view class="activity-process" v-if="isOpenActive">
            <view class="process-info">
              <view class="process-num">{{ checkInfo.activeTotal || 0 }}</view>
              <text class="txt">{{$t('当前活跃值')}}</text>
            </view>
            <view class="process-schedule">
              <view class="schedule-top">
                <view
                  v-for="active in activeList"
                  :key="'active' + active.id"
                  class="img-box"
                >
                  <image
                    v-if="active.canReceive && !active.receive"
                    src="./image/weekCheckIn/rec.png"
                    class="pImg"
                    @click="receive(active.id)"
                  />
                  <image
                    v-if="!active.canReceive && !active.receive"
                    src="./image/weekCheckIn/notRec.png"
                    class="pImg"
                  />
                  <image
                    v-if="active.receive"
                    src="./image/weekCheckIn/received.png"
                    class="pImg"
                  />
                </view>
              </view>
              <view class="schedule-bottom" v-if="activeList.length > 0">
                <view class="progress-box">
                  <progress
                    :percent="percent"
                    activeColor="#59D036"
                    backgroundColor="#F2F2F2"
                    stroke-width="8"
                    border-radius="4"
                  />
                </view>
                <view class="process-num">
                  <view
                    v-for="num in activeProgress"
                    :key="'num' + num"
                    class="bar-ibox"
                    :class="
                      num <= checkInfo.activeTotal ? 'bar-ibox-activity' : ''
                    "
                  >
                    <text class="bar-ibox-num"> {{ num }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="footer">
          <view class="item" v-if="hasDaySignTask">
            <view class="item-sign">
              <image
                src="./image/weekCheckIn/image2.png"
                class="img2"
                mode=""
              />
              <view class="item-end">
                <view class="item-info">
                  <view class="title">{{ title1 }}</view>
                  <view class="text">
                    <text>{{ taskType[Number(currentSignInfo.type)] }}</text>
                    {{
                      Number(currentSignInfo.type) === 2
                        ? currentSignInfo.valuesEscape
                        : currentSignInfo.values
                    }}
                    <text v-if="[1, 3].includes(+currentSignInfo.type)"
                      >{{$t('元')}}</text
                    >
                    <text v-if="[4, 5].includes(+currentSignInfo.type)"
                      >{{$t('次')}}</text
                    >
                    <text
                      v-if="
                        [2].includes(+currentSignInfo.type) &&
                        currentSignInfo.values
                      "
                      >{{$t('成功登录过')}}</text
                    >
                    <text
                      v-if="
                        [2].includes(+currentSignInfo.type) &&
                        !currentSignInfo.values
                      "
                      >{{$t('当日需成功登录过')}}</text
                    >
                  </view>
                </view>
                <view class="item-status">
                  <view
                    class="btn"
                    :class="taskIsSuccess ? 'btn-green' : 'btn-un'"
                  >
                    <text v-if="taskIsSuccess">{{$t('已完成')}}</text>
                    <text v-else>{{$t('未完成')}}</text>
                  </view>

                  <view
                    class="btn btn-red btn-download"
                    @click="dowApp"
                    v-if="
                      Number(currentSignInfo.type) === 2 &&
                      !taskIsSuccess &&
                      currentSignInfo.valuesEscape &&
                      currentSignInfo.valuesEscape
                        .toLowerCase()
                        .search('app') != -1
                    "
                    >{{$t('立即下载')}}</view
                  >
                </view>
              </view>
            </view>
          </view>
          <view class="item item-supply" v-if="isOpenSupply">
            <view class="item-top">
              <view>{{$t('剩余补签卡')}}：{{ checkInfo.lateTotal || 0 }}</view>
            </view>
            <view class="item-bottom">
              <image
                src="./image/weekCheckIn/image3.png"
                class="img3"
                mode=""
              />
              <view class="item-end">
                <view class="item-info">
                  <view class="title">{{ title2 }}</view>
                  <view class="text">{{$t(`充值金额≥${suppleMin}元，补签卡+1`)}}</view>
                </view>
                <view
                  class="btn btn-red"
                  v-if="!checkInfo.lateTotalMax"
                  @click="goRecharge"
                  >{{ btn_text3 }}</view
                >
                <view class="btn btn-un" v-else> {{$t('已达上限')}} </view>
              </view>
            </view>
          </view>
        </view>
        <view>
          <uni-popup ref="popup" :mask-click="false" type="center">
            <view class="pop-container">
              <view class="container">
                <view class="pop-wrapper">
                  <view
                    class="img-status"
                    :class="
                      signType === 1
                        ? 'img-sign1'
                        : signType === 2
                        ? 'img-sign2'
                        : 'img-sign3'
                    "
                  ></view>
                  <view class="modal-content">
                    <view class="txt1">{{ popTxt1 }}</view>
                    <view class="txt2">{{ popTxt2 }}</view>
                    <view class="txt3" v-show="signType === 2">{{$t('消耗1张补签卡')}}</view
                    >
                    <view
                      class="btn btn-red btn-confirm-1"
                      :class="signType === 2 ? 'btn-supply' : ''"
                      @click="confirm"
                      >{{ signType === 2 ? $t("立即补签") : $t("确定") }}</view
                    >
                  </view>
                </view>
              </view>
              <image
                class="close"
                src="./image/weekCheckIn/close.png"
                @click="closePop"
              ></image>
            </view>
          </uni-popup>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import cache from "../../utils/cache.js";
export default {
  data() {
    return {
      userId: cache.get("set_user").user_id,
      title: this.$t("每日签到"),
      title1: this.$t("今日签到任务"),
      title2: this.$t("获得补签卡"),
      btn_text1: this.$t("立即签到"),
      btn_text2: this.$t("今日已签到"),
      btn_text3: this.$t("去充值"),
      popTxt1: "",
      popTxt2: "",
      popTxt3: "",
      checkInfo: {}, //用户签到信息
      hasDaySignTask: true, //是否有当日签到任务
      taskIsSuccess: false, //今日任务是否达标
      daySignList: [],
      currentSignInfo: {}, //当前签到信息
      suppleMin: 0, //补签最少充值金额
      isOpenSupply: true, //是否开启补签
      isOpenActive: true, //是否开启活跃值
      activeList: [],
      activeProgress: [], //活跃进度
      taskType: {
        1: this.$t("充值金额≥"),
        2: this.$t("当日需"),
        3: this.$t("有效投注金额≥"),
        4: this.$t("成功充值次数≥"),
        5: this.$t("成功提现次数≥"),
      }, //任务类型
      vipLevel: 1,
      query: {},
      signType: null, //签到类型 1:签到,2:补签,3:补签成功
      supplyDay: 0,
      currValue: 0, //当前活跃值
    };
  },
  computed: {
    //进度条百分比
    percent() {
      if (this.activeList.length <= 0) {
        return 0;
      }
      // const total = this.activeList.reduce((acc, cur) => {
      //   return acc + cur.minValue;
      // }, 0);
      let number = 0;
      let index = 0;
      this.activeList.map((item) => {
        if (item.canReceive) {
          number += item.minValue;
          index += 1;
        }
      });
      this.currValue = number;
      return (index / this.activeList.length) * 100;
    },
  },

  onLoad(options) {
    this.query = options;
    this.getVipLevel();
    this.getData();
  },
  methods: {
    dowApp() {
      let u = navigator.userAgent;
      let inviteCode = JSON.parse(sessionStorage.getItem("inviteCode"));
      if (window.projectImgUrl == "wbgj") {
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isIOS) {
          uni.navigateTo({
            url: "../download/download",
          });
          return;
        }
        let url = window.location.origin + "/downloadUrl?";
        url += "code=" + window.childCode;
        // if(this.$config.iosDownloadUrl) {
        // 	url += '&ios=' + encodeURIComponent(this.$config.iosDownloadUrl)
        // }
        if (this.$config.androidDownloadUrl) {
          url +=
            "&android=" + encodeURIComponent(this.$config.androidDownloadUrl);
        }
        if (inviteCode) {
          url += "&agentCode=" + inviteCode;
        }
        window.location.href = url;
      } else {
        if (inviteCode && inviteCode != "null") {
          this.getInviteCode(inviteCode);
          inviteCode =
            String.fromCharCode(8203) + inviteCode + String.fromCharCode(8203);
          this.$copyText(inviteCode);
        }

        if (
          (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) &&
          this.$config.androidDownloadUrl
        ) {
          window.location.href = this.$config.androidDownloadUrl;
        }
        // if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && this.$config.iosDownloadUrl) {
        //   window.location.href = this.$config.iosDownloadUrl
        // }
        if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          if (window.projectImgUrl == "ybyl") {
            uni.navigateTo({
              url: "/pages/download/download",
            });
          } else {
            window.location.href = this.$config.iosDownloadUrl;
          }
        }
        // if(this.$config.pcDownloadUrl) {
        // 	url += '&pc=' + encodeURIComponent(this.$config.pcDownloadUrl)
        // }
      }
    },
    goBack() {
      uni.navigateBacks(-1);
    },
    //领取活跃值奖励
    receive(id) {
      this.$api.receiveActive(this.query.id, id, (err, res) => {
        if (err) return;
        if (res) {
          this.getData(false);
        }
      });
    },
    //补签
    signLate(day) {
      this.$api.signSupply(this.query.id, day, (err, res) => {
        if (err) return;
        if (res) {
          this.signType = 3;
          this.popTxt1 = this.$t("补签成功，恭喜获得");
        }
      });
    },
    getData(needShowToast = true) {
      this.$api.getActivityById(this.query.id, (err, res) => {
        if (err) return;
        if (res && Object.keys(res).length) {
          this.checkInfo = res.memberSignInfoVO;
          this.daySignList = res.signInConfigs || [];
          this.suppleMin = res.lateMoneyMin;
          //开启展示补签任务和显示补签
          this.isOpenSupply = res.lateOn;
          //开启展示活跃值
          this.isOpenActive = res.activeOn;
          if (this.isOpenActive) {
            this.activeList = res.activeConfigs;
            this.activeProgress.length = 0;
            if (Array.isArray(this.activeList) && this.activeList.length > 0) {
              this.activeList.forEach((item) => {
                this.activeProgress.push(item.minValue);
              });
            }
          }
          this.todayIsSign(this.daySignList, needShowToast);
        }
      });
    },
    getVipLevel() {
      this.$api.userInfo(this.userId, (err, res) => {
        if (err) return;
        if (res) {
          const levelId = res.levelId;
          if (!levelId) return;
          this.$api.getvipdata(levelId, (err, res) => {
            if (err) return;
            if (res) {
              this.vipLevel = res.gradeId === 1 ? res.gradeId : res.gradeId - 1;
            }
          });
        }
      });
    },
    //当日是否已签到
    todayIsSign(data, needShow) {
      if (Array.isArray(data) && data.length > 0) {
        const find = data.find((item) => item.current);
        //current有为true，才代表有今日签到任务
        if (find) {
          //今日任务是否达标
          this.taskIsSuccess = find.canSignIn;
          this.hasDaySignTask = true;
          this.currentSignInfo = find;
          if (needShow) {
            this.showToast(this.currentSignInfo.signIn);
          }
        }
      } else {
        this.taskIsSuccess = this.hasDaySignTask = false;
      }
    },
    showToast(status) {
      if (status) {
        uni.showToast({
          title: this.$t("今日已签到，记得明天再来哦~"),
          duration: 2000,
          icon: "none",
        });
      } else {
        uni.showToast({
          title: this.$t("今日签到任务还未完成~"),
          duration: 2000,
          icon: "none",
        });
      }
    },
    daySign() {
      // if (this.dayIsSign) {
      //   uni.showToast({
      //     title: "暂无签到次数~",
      //     duration: 2000,
      //     icon: "none",
      //   });
      //   return;
      // }
      this.signType = 1;
      this.popTxt1 = this.$t("签到成功，恭喜获得");
      this.popTxt2 = this.currentSignInfo.award + this.$t("元红包");
      this.activitySign();
    },
    historySign(dayObj) {
      //签到
      // if (dayObj.current && !dayObj.signIn) {
      //   this.signType = 1;
      //   this.popTxt2 = dayObj.award + "元红包";
      //   this.activitySign();
      // }
      //补签
      if (dayObj.canLate) {
        this.signType = 2;
        this.supplyDay = dayObj.day;
        this.popTxt1 = this.$t("本次补签可获得");
        this.popTxt2 = dayObj.award + this.$t("元红包");
        this.$refs.popup.open();
      }
    },
    getImage(value) {
      if (value) {
        return require("./image/weekCheckIn/red1.png");
      } else {
        return require("./image/weekCheckIn/red2.png");
      }
    },
    //签到功能
    activitySign() {
      this.$api.activitySignById(this.query.id, (err, res) => {
        if (err) return;
        if (res) {
          this.$refs.popup.open();
        }
      });
    },
    closePop() {
      this.$refs.popup.close();
    },
    //跳转充值
    goRecharge() {
      uni.navigateTo({
        url: "/pages/recharge/recharge",
      });
    },
    confirm() {
      //补签
      if (this.signType === 2) {
        this.signLate(this.supplyDay);
      } else {
        this.getData();
        setTimeout(() => {
          this.closePop();
        }, 2000);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// 开元体育
.page-container.SignPage-kyty{
  background: url("./image/weekCheckIn/weekCheckIn_bg.png") no-repeat center/cover !important;
  .btn-red{
			background: linear-gradient(90deg,#8bddea,#179cff);
  }
  .process-num{
    border: 3px solid #179cff !important;
    color: #179cff !important; 
  }
  .item-info{
    .text{
      color: #179cff !important; 
    }
  }
}

.page-container {
  min-height: 100%;
  background: url("./image/weekCheckIn/bg.png") no-repeat center/cover;
  padding: 0 24upx;
  // font-family: title2;
  .content {
    padding-top: 340upx;
    padding-bottom: 60upx; /* 为底部留出空间 */
  }
  .s-header {
    position: fixed;
    top: var(--status-bar-height);
    left: 0;
    right: 0;
    height: 48px;
    line-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 34upx;
    font-weight: 500;
    .back {
      position: absolute;
      width: 16upx;
      height: 28upx;
      left: 26upx;
      background: none !important;
    }
  }
  .btn {
    width: 152upx;
    height: 64upx;
    line-height: 64upx;
    border-radius: 48upx;
    text-align: center;
    &-green {
      background: #59d036;
      color: #fff;
    }
    &-red {
      background: #f64430;
      color: #fff;
    }
    &-confirm {
      margin-top: 116upx;
    }
    &-supply {
      margin-top: 80upx !important;
    }
    &-un {
      background: #ccc;
      color: #fff;
    }
  }
  .btn-confirm-1{
  	width: 360upx;
  	height: 80upx;
	line-height: 80upx;
	margin-top: 80upx;
  }

  .img1 {
    width: 112upx;
    height: 112upx;
  }
  .img2 {
    width: 128upx;
    height: 104upx;
  }
  .img3 {
    width: 96upx;
    height: 88upx;
  }
  .bgImg {
    width: 192upx;
    height: 162upx;
  }
  .page-main {
    background: #f8f8f8;
    border-radius: 12upx;
    padding: 24upx;
    position: relative;
    .top-rightImg {
      position: absolute;
      width: 374upx;
      height: 328upx;
      right: -24upx;
      top: -246upx;
    }
    .header {
      display: flex;
      align-items: center;
      height: 150upx;
      background: #fff;
      border-radius: 12upx;
      padding: 24upx;
      &-end {
        margin-left: 32upx;
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: space-between;
        .active-info {
          .level {
            background: linear-gradient(
              82.82deg,
              #ffff00 11.18%,
              #ffa127 123.97%
            );
            border-radius: 24upx;
            font-size: 24upx;
            color: #db1b02;
            text-align: center;
            line-height: 1.5;
            width: 80upx;
          }
          .num {
            font-size: 32upx;
            color: #000;
            font-weight: 700;
            line-height: 32upx;
            margin-top: 14upx;
            display: flex;
            align-items: center;
            .days {
              font-weight: 500;
              font-size: 48upx;
              color: #db1b02;
              margin-left: 10upx;
            }
          }
        }
        .btnSuccess {
          width: 200upx;
          height: 64upx;
          line-height: 64upx;
          border-radius: 48upx;
          text-align: center;
          background: #59d036;
          color: #fff;
        }
        .btnNormal {
          width: 180upx;
          height: 64upx;
          line-height: 64upx;
          border-radius: 48upx;
          text-align: center;
          background: #f64430;
          color: #fff;
        }
      }
    }
    .activity-block {
      margin-top: 24upx;
      margin-bottom: 24upx;
      .activity-history {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        &-card {
          // width: 154upx;
          width: 22%;
          height: 180upx;
          position: relative;
          border-radius: 6upx;
          margin-right: 26upx;
          margin-bottom: 16upx;
          background: url("./image/weekCheckIn/sub-noraml.png") no-repeat;
          background-color: #fff;
          &:nth-child(4n) {
            margin-right: 0 !important;
          }
          .sub-num {
            position: absolute;
            top: 4upx;
            left: 8upx;
            font-size: 24upx;
            color: #fff;
          }
          .history-box {
            width: 100%;
            height: 100%;
            background: url("./image/weekCheckIn/bg-close.png") no-repeat;
            background-position: center 10upx;
            .box-top-right {
              position: absolute;
              width: 56upx;
              height: 28upx;
              line-height: 28upx;
              top: 0;
              right: 0;
              font-size: 20upx;
              color: #f64430;
              background: url("./image/weekCheckIn/hot-s.png") no-repeat;
              text-align: center;
            }
            .txt-success {
              font-weight: 500;
              font-size: 32upx;
              line-height: 32upx;
              color: #db1b02;
              text-align: center;
              padding-top: 40upx;
            }
            .txt-normal {
              font-weight: 500;
              font-size: 28upx;
              line-height: 28upx;
              color: #fbe2a2;
              text-align: center;
              padding-top: 40upx;
            }
            .btn-normal {
              width: 120upx;
              height: 36upx;
              line-height: 36upx;
              background: rgba(251, 226, 162, 0.4);
              border-radius: 22upx;
              margin: 58upx auto 0;
              color: #db1b02;
              text-align: center;
            }
            .btn-supply {
              width: 78upx;
              height: 36upx;
              line-height: 36upx;
              background: #f64430;
              border-radius: 22upx;
              margin: 54upx auto 0;
              text-align: center;
              color: #fff;
              margin-top: 58upx !important;
            }
            .btn-success {
              width: 78upx;
              height: 36upx;
              line-height: 36upx;
              background: #59d036;
              border-radius: 22upx;
              margin: 54upx auto 0;
              text-align: center;
              .iRight {
                width: 26upx;
                height: 20upx;
              }
            }
            .btn-unSign {
              width: 78upx;
              height: 36upx;
              line-height: 36upx;
              background: #ccc;
              border-radius: 22upx;
              margin: 54upx auto 0;
              text-align: center;
              color: #fff;
            }
          }
          .s-succ {
            border: 1px solid #59d036;
            border-radius: 6upx;
          }
          .s-normal {
            border: 1px solid #f64430;
            border-radius: 6upx;
          }
          .sign-success {
            background: url("./image/weekCheckIn/bg-open.png") no-repeat;
            background-position: center 26upx;
          }
        }
        .success {
          background-color: rgba(89, 208, 54, 0.1) !important;
        }
        .sub-success {
          background: url("./image/weekCheckIn/sub-success.png") no-repeat;
          background-color: rgba(89, 208, 54, 0.1);
        }
        .sub-supply {
          background: url("./image/weekCheckIn/sub-supply.png") no-repeat;
          background-color: #e8e8e8;
        }
        .last-card {
          // width: 324upx;
          width: 48%;
          height: 180upx;
          border-radius: 6upx;
          margin-right: 16upx;
          margin-bottom: 16upx;
          margin-right: 0;
          background-color: #fff;
          &-box {
            width: 100%;
            height: 100%;
            background: url("./image/weekCheckIn/other-box-bg.png") no-repeat;
            background-position: center 30%;
            text-align: center;
            .last-hot {
              position: absolute;
              min-width: 96upx;
              height: 28upx;
              line-height: 28upx;
              top: 0;
              right: 0;
              font-size: 20upx;
              color: #f64430;
              background: url("./image/weekCheckIn/hot-l.png") no-repeat;
              background-size: 100%;
              background-position: 100%;
              text-align: center;
              padding-left: 12upx;
            }
            .last-bottom {
              position: absolute;
              top: 60upx;
              left: 0;
              right: 0;
              bottom: 0;
              text-align: center;
              .award-normal {
                margin: auto;
                background-color: #db1b02;
                width: 96upx;
                height: 36upx;
                line-height: 36upx;
                color: #fbe2a2;
                border-radius: 22upx;
                border: 2upx solid #fbe2a2;
              }
              .award-success {
                margin: auto;
                background-color: #fffce2;
                width: 96upx;
                height: 36upx;
                line-height: 36upx;
                color: #db1b02;
                border-radius: 22upx;
                border: 2upx solid #db1b02;
              }
              .btn-normal {
                width: 180upx;
                height: 36upx;
                line-height: 36upx;
                background: rgba(251, 226, 162, 0.4);
                border-radius: 22upx;
                margin: 32upx auto 0;
                color: #db1b02;
                text-align: center;
              }
              .btn-supply {
                width: 98upx;
                height: 36upx;
                line-height: 36upx;
                background: #f64430;
                border-radius: 22upx;
                margin: 32upx auto 0;
                text-align: center;
                color: #fff;
              }
              .btn-success {
                width: 98upx;
                height: 36upx;
                line-height: 36upx;
                background: #59d036;
                border-radius: 22upx;
                margin: 32upx auto 0;
                text-align: center;
                .iRight {
                  width: 26upx;
                  height: 20upx;
                }
              }
              .btn-unSign {
                width: 98upx;
                height: 36upx;
                line-height: 36upx;
                background: #ccc;
                border-radius: 22upx;
                margin: 32upx auto 0;
                text-align: center;
                color: #fff;
              }
            }
          }
          .bottom {
            width: 180upx;
            height: 36upx;
            line-height: 36upx;
            background: rgba(251, 226, 162, 0.4);
            border-radius: 22upx;
            margin: auto;
            position: relative;
            top: -56upx;
            color: #db1b02;
          }
        }
      }
      .activity-process {
        display: flex;
        align-items: center;
        height: 174upx;
        background: #fff;
        border-radius: 6upx;
        //   margin-left: 32upx;
        .process-info {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          align-items: center;
          margin-left: 8upx;
          margin-top: 8upx;
          width: 130upx;
          .process-num {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 96upx;
            text-align: center;
            line-height: 96upx;
            height: 96upx;
            border: 6upx solid #f64430;
            border-radius: 50%;
            color: #f64430;
            font-size: 40upx;
            font-weight: 500;
          }
          .txt {
            font-size: 24upx;
            color: #999999;
          }
        }
        .process-schedule {
          display: flex;
          flex-grow: 1;
          flex-wrap: wrap;
          margin-left: 30upx;
          position: relative;
          top: -24upx;
          .schedule-top {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-around;
            .img-box {
              width: 100upx;
              height: 100upx;
            }
            .pImg {
              width: 100upx;
              height: 100upx;
            }
          }
          .schedule-bottom {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-around;
            margin-top: 16upx;
            .progress-box {
              display: flex;
              width: 80%;
              height: 6upx;
              position: relative;
              ::v-deep .uni-progress-inner-bar {
                border-radius: 8upx;
              }
            }

            .process-num {
              position: absolute;
              display: flex;
              align-items: center;
              justify-content: space-around;
              width: 100%;
            }
            // .process
            .bar-ibox {
              width: 44upx;
              height: 44upx;
              line-height: 1;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f2f2f2;
              color: #999;
              &-num {
                // color: #999;
                font-weight: 500;
                font-size: 20upx;
              }
            }
            .bar-ibox-activity {
              background: #59d036;
              color: #fff;
            }
          }
        }
      }
    }
    .footer {
      .item {
        display: flex;
        // align-items: center;
        // height: 174upx;
        border-radius: 12upx;
        margin-top: 24upx;
        margin-bottom: 24upx;
        background: #fff;

        .item-sign {
          display: flex;
          flex-grow: 1;
          align-items: center;
          padding: 24upx 0 24upx 24upx;
        }
        .item-top {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          color: #333333;
          opacity: 0.6;
        }
        .item-bottom {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: flex-start;
        }
        &-end {
          display: flex;
          flex-grow: 1;
          align-items: center;
          justify-content: space-between;
          margin-left: 32upx;

          .item-info {
            .title {
              font-weight: 700;
              font-size: 32upx;
              line-height: 32upx;
              color: #000000;
              // font-family: title1;
            }
            .text {
              line-height: 30upx;
              color: #db1b02;
              margin-top: 24upx;
            }
          }
          .btn {
            min-width: 130upx;
            //   // height: 64upx;
            //   // line-height: 64upx;
            text-align: center;
            //   // padding: 0 !important;
          }
        }
        .item-status {
          display: flex;
          width: 200upx;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          padding: 16upx 24upx 16upx 0;
          .btn-download {
            margin-top: 10upx;
          }
        }
      }
      .item-supply {
        flex-direction: column;
        padding: 24upx;
        .item-top {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          color: #333333;
          opacity: 0.6;
        }
        .item-bottom {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: flex-start;
        }
        .item-end {
          margin-left: 32upx;
        }
      }
    }
    .pop-container {
      text-align: center;
      .container {
        position: relative;
        display: flex;
        justify-content: center;
        width: 488upx;
        height: 552upx;
        background: url("./image/weekCheckIn/bg-pop.png") no-repeat;
        background-size: contain;
        .pop-wrapper {
          width: 80%;
          height: 100%;
          display: flex;
          justify-content: center;
          .img-status {
            width: 100%;
            margin-top: -112upx;
          }
          .img-sign1 {
            background: url("./image/weekCheckIn/sign1.png") no-repeat;
          }
          .img-sign2 {
            background: url("./image/weekCheckIn/sign2.png") no-repeat;
          }
          .img-sign3 {
            background: url("./image/weekCheckIn/sign3.png") no-repeat;
          }
          .modal-content {
            position: absolute;
            top: 176upx;
          }
          .txt1 {
            font-weight: 500;
            font-size: 40upx;
            color: #000000;
            line-height: 1;
            // margin-top: 24upx;
            margin-bottom: 16upx;
          }
          .txt2 {
            font-weight: 500;
            font-size: 40upx;
            color: #db1b02;
            line-height: 1;
            margin-bottom: 32upx;
          }

          .txt3 {
            font-size: 28upx;
            color: #db1b02;
            // margin-bottom: 106upx;
          }
        }
      }
      .close {
        width: 40upx;
        height: 40upx;
        margin-top: 20upx;
      }
    }
  }
}

</style>
