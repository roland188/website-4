<!-- 登录区域 -->
<template>
  <view class="conBgBox">
    <view class="conBox">
      <view class="usertitle" v-show="!login">
        <view class="login-wrap">
          <view
            class="btns loginBtn"
            @click="toPage('/pages/Login/Login?type=0')"
          >
            {{ $t("登录") }}
          </view>
          <view
            class="btns regBtn"
            @click="toPage('/pages/Login/Login?type=1')"
          >
            {{ $t("注册") }}
          </view>
        </view>
      </view>
      <view class="conLeft" v-show="login">
        <view class="leftNone">
          <view class="leftTop moneyFlex">
            <image
              :src="'@/static/image/indexImg/md.png'"
              mode=""
              class="moenyIcon"
            ></image>
            <view class="moneyNum indexMoneyColor">
              {{ $t("总余额") }}
            </view>
            <image
              :src="'@/static/image/indexImg/requt.png'"
              mode=""
              class="shuaImg"
              :class="{ scroller: infoSwitch }"
              @click="currMemberCheck"
            ></image>
          </view>
          <view class="leftBottom moneyTop">
            <view class="money indexMoneyColor">
              <text class="textM"
                >{{ $config.currency}}&nbsp;{{ dataJson.balance || "0.00" }}</text
              >
            </view>
          </view>
        </view>
      </view>
      <view class="conRight" v-show="login">
        <view class="rightLi" @tap="routerLink(1)">
          <view class="liIconBox">
            <image
              :src="'@/static/image/indexImg/cz1.png'"
              mode="widthFix"
              class="liIcon iconOne"
            ></image>
          </view>
          <view class="liName liNameTop threeColor">
            {{ $t("充值") }}
          </view>
        </view>
        <view class="rightLi" @tap="routerLink(3)">
          <view class="liIconBox">
            <image
              :src="'@/static/image/indexImg/cz2.png'"
              mode="widthFix"
              class="liIcon iconOne"
            ></image>
          </view>
          <view class="liName liNameTop threeColor">
            {{ $t("提现") }}
          </view>
        </view>
        <view class="rightLi" @tap="routerLink(5)">
          <view class="liIconBox">
            <view class="red-img" v-if="caiFlag"></view>
            <image
              :src="'@/static/image/indexImg/cz4.png'"
              mode="widthFix"
              class="liIcon iconOne"
            ></image>
          </view>
          <view class="liName liNameTop threeColor">
            {{ $t("奖励") }}
          </view>
        </view>
        <!-- <view class="rightLi" @tap="routerLink(7)">
          <view class="liIconBox">
            <image
              :src="'@/static/image/indexImg/cz3.png'"
              mode="widthFix"
              class="liIcon iconOne"
            ></image>
          </view>
          <view class="liName liNameTop threeColor">
            {{ $t("mall") }}
          </view>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    login: [Boolean, Number],
  },
  data() {
    return {
      tenMinuteSwitch: false, // 点击间隔10S
      infoSwitch: false, // 刷新金额开关
      caiFlag: false,
      dataJson: {
        balance: "0.00",
        name: "xxx",
      },
    };
  },
  mounted() {},
  methods: {
    routerLink(type) {
      this.$emit("routerLink", type);
    },
    // 登录
    tologin() {
      uni.navigateTo({
        url: "/pages/Login/Login",
      });
    },
    getNotReceive() {
      let self = this;
      self.$api.getNotReceive(function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          self.caiFlag = res.notReceiveState;
        }
      }, false);
    },
    // 获取用户信息
    currMember() {
      let self = this;
      if (self.tenMinuteSwitch) {
        uni.showToast({
          title: self.$t("总余额"),
          icon: "none",
          duration: 2000,
        });
        return;
      }
      self.tenMinuteSwitch = true;
      self.infoSwitch = true;
      let option = {
        clientId: this.$cache.get("set_user").tenant_id, //tenant_id
        clientIp: this.$config.clientIp,
        memberId: this.$cache.get("set_user").user_id, //userid
        username: this.$cache.get("set_user").username,
      };
      this.$api.getGameBalance(
        option,
        (err, res) => {
          if (err) {
          } else {
            // debugger;
            this.$server.setUserBalance(res);
            this.dataJson.balance = res.totalBalance.toFixed(2);
            this.dataJson.name = res.username;
          }
          self.infoSwitch = false;
          setTimeout(() => {
            self.tenMinuteSwitch = false;
          }, 10000);
        },
        false
      );
      this.getNotReceive();
    },
    // 检测刷新
    currMemberCheck() {
      if (this.login) {
        this.currMember();

      } else {
        this.tologin();
      }
    },
    // 时间转换
    getTimeState() {
      // 获取当前时间
      let timeNow = new Date();
      // 获取当前小时
      let hours = timeNow.getHours();
      // 设置默认文字
      let text = ``;
      // 判断当前时间段
      if (hours >= 0 && hours <= 10) {
        text = this.$t("早上好");
      } else if (hours > 10 && hours <= 14) {
        text = this.$t("中午好");
      } else if (hours > 14 && hours <= 18) {
        text = this.$t("下午好");
      } else if (hours > 18 && hours <= 24) {
        text = this.$t("晚上好");
      }
      // 返回当前时间段对应的状态
      return text;
    },
    toPage(name, isLoginIntercept) {
      // isLoginIntercept  是否登录拦截   1是
      if (!isLoginIntercept) {
        //登录、注册
        uni.navigateTo({
          url: name,
        });
      } else {
        //登录拦截
        if (!this.login) {
          uni.navigateTo({
            url: "/pages/Login/Login",
          });
        } else {
          uni.navigateTo({
            url: name,
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
// 功能登录区域
.conBgBox {
  margin-top: 5px;
  min-height: 100upx;
  display: flex;
  align-items: center;
  .conBox {
    display: flex;
    flex: 1;
    align-items: center;
    height: 100%;
    .usertitle {
      width: 100%;
      font: 12px/24px normal;
      position: relative;

      .welcome {
        color: #fce760;
        font-size: 24upx;
        margin-left: 10upx;
      }

      .login-wrap {
        width: 100%;
        display: flex;
		    margin-top: -20upx;
        .btns {
          flex: 1;
          height: 80upx;
          line-height: 80upx;
          font-size: 28upx;
          font-weight: bold;
          border-radius: 200upx;
          text-align: center;
        }

        .loginBtn {
          color: #fff;
          background: var(--ptTheme);    
        }

        .regBtn {
          margin-left: 20upx;
          color: #000;
          background: var(--ptThemeYellow);  
        }
      }

      .userinfo {
        float: left;
        margin-left: 10px;
        width: 100%;
        position: relative;
      }

      .com {
        float: right;
        margin-right: 10px;
      }
    }

    .conLeft {
      flex-grow: 0;
      width: 280upx;
      padding: 0px 4px;

      .leftNone {
        .leftTop {
          color: #888787;
          font-size: 10px;
          padding-left: 2px;

          .moenyIcon {
            width: 17px;
            height: 17px;
          }

          .moneyNum {
            font-size: 24upx;
            margin-left: 4px;
            margin-top: 2px;
            font-weight: 700;
          }

          .indexMoneyColor {
            color: #c2c2c2;
          }

          .shuaImg {
            width: 28upx;
            height: 28upx;
            margin-left: 4px;
          }
        }

        .leftBottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -6px;

          .money {
            font-size: 36upx;
            font-weight: bold;
            line-height: 80upx;
            color:var(--ptTheme);
            padding-left: 2px;
            max-width: 222upx;
            overflow:hidden; //超出的文本隐藏
            text-overflow:ellipsis; //用省略号显示
            white-space:nowrap; //不换行
          }
        }

        .moneyFlex {
          display: flex;
          align-items: center;
        }
      }
    }

    .conRight {
      display: flex;
      flex-grow: 1;
      align-items: center;

      justify-content: flex-end;

      .rightLi {
        width: 36%;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        position: relative;

        .liIconBox {
          display: -webkit-box;
          display: -webkit-flex;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50upx;

          .liIcon {
            display: block;
            width: 70upx;
          }

          .red-img {
            background: red;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            position: absolute;
            top: -10upx;
            right: 20upx;
            z-index: 2;
          }
        }

        .liName {
          width: 100%;
          text-align: center;
          font-size: 28upx;
          margin-top: 4px;
          color: #e6d7b4;
          white-space: nowrap;
        }
      }
    }

    .beforelogin {
      position: relative;
      width: 100%;
      height: 52px;
      line-height: 52px;

      .btn {
        font: 12px/24px normal;
        float: left;
        height: 24px;
        width: 80px;
        border: 1px solid #868686;
        color: #868686;
        border-radius: 15px;
        text-align: center;
        margin-left: 10px;
      }
    }

    .title {
      float: left;
      overflow: hidden;

      .mIcon {
        width: 20px;
        height: 20px;
        float: left;
        margin-top: 2px;
      }

      .scroller {
        animation: scroller 2s infinite linear;
      }

      .mIcon:nth-last-child(1) {
        margin-left: 5px;
      }

      .total {
        float: left;
        margin-left: 5px;
      }
    }

    .discount {
      float: right;
      min-width: 72px;
      text-align: center;
      border: 1px solid #fb0;
      border-radius: 4px;
      font: 12px/18px normal;
      overflow: hidden;

      view {
        line-height: 18px;
      }

      .distitle {
        background-color: #22211f;
        color: #ebcc45;
      }

      .dismoney {
        color: #000;
        background-color: var(--ptTheme);
      }
    }
  }
}
</style>
