<!-- 
 页面：提款-账户
 作者：丹泽尔
 -->
<template>
  <view class="accBox">
    <uni-nav-bar
      :title="$t('提现')"
      leftIcon="back"
      :status-bar="true"
      :fixed="true"
      :shadow="false"
      @clickLeft="BackPage"
    ></uni-nav-bar>
    <view class="">
      <view class="account-view">
        <view class="contents">
          <view class="conBox">
            <view class="conTop">
              <view class="topLeft">
                <text
                  class="account-text themeTextOne oneTitleColor8"
                  @click="getMoneyGame(1)"
                  >{{ $t('账户余额') }}&nbsp;{{
                    $t('(元)')
                  }}&nbsp;</text
                >
                <image
                  :src="['kubet','choibet','phattai68','jun88'].includes(projectImgUrl) ? 
                      require('../../static/image/refresh1.png') :
                      require('../../static/image/r2.png')"
                  class="refresh-img"
                  :class="{ 'refresh-img-animation': refreshimg }"
                  @click="getMoneyGame(1)"
                ></image>
              </view>
              <view class="but-moeny" @click="onekey">
                {{ $t('一键归集') }}
              </view>
              <!-- <image src="../../static/image/dzr/butone.png" ></image> -->
            </view>
            <view class="">
              <!-- <image
                src="../../static/image/rmb1.png"
                mode="aspectFit"
                class="rmb-size"
              ></image> -->
              {{ $config.currency }}
              <text class="moeny">{{ userMoney }}</text>
            </view>
          </view>
        </view>
        <view class="card-bg" v-if="showAccount">
          <view class="box">
            <view
              class="box-item-box"
              v-for="(item, index) in gameList"
              :key="index"
              v-show="index < num"
            >
              <view class="box-item">
                <text class="gamename themeTextOne oneTitleColor8">{{
                  item.vendorName
                }}</text>
                <text
                  class="rmb accoutMoney"
                  v-if="item.operation"
                  :class="[item.totalMoney == 0 ? 'game-money-text' : '']"
                >
                  {{ $config.currency }}{{ item.totalMoney.toFixed(2) }}</text
                >
                <text
                  class="maintaining maintainBackground"
                  v-if="!item.operation"
                  >{{ $t('归集中') }}</text
                >
              </view>
              <view class="box-xian-h"></view>
              <view class="box-xian-s"></view>
            </view>
            <view
              v-show="gameList.length > 15"
              class="box-item-box"
              @click="showMore"
            >
              <view class="more-text-view">
                <view class="more-text">{{ moreText }}</view>
                <image
                  v-if="isListShow"
                  src="../../static/image/move.png"
                  class="icon-move"
                  mode=""
                ></image>
                <image
                  v-if="!isListShow"
                  src="../../static/image/away.png"
                  class="icon-move"
                  mode=""
                ></image>
              </view>
            </view>
          </view>
        </view>
      </view>
      
			<!-- 稽核未完成 -->
			<view v-if="auditList.totalFail" class="audit-box">
				<text>
          {{ $t('亲，您只要完成') + $config.currency + (auditList.amountAudit-auditList.afterTotalBet) + $t('有效投注额，') }} 
          <br/>
          {{ $t('就可以提现了～')}}
        </text>
				<view class="audit-line">
					<view :style="{'width': `${auditList.afterTotalBet/auditList.amountAudit*100}%`}"></view>
				</view>
				<view class="audit-count"> 
          {{ $t('有效投注额')}} 
          {{ $config.currency }} {{auditList.afterTotalBet}} / 
          {{ $config.currency }} {{auditList.amountAudit}}
        </view>
			</view>

      <view class="bank-view" v-else>
        <view class="bankTs">
          <text class="my-card-title oneTitleColor8">{{
            $t('请选择提款方式')
          }}</text>
          <image
            v-if="
              bankCardList.length < bankCountNumber ||
              usdtList.length < usdtCountNumber
            "
            class="bankAdd"
            @click="onAddCard"
            src="../../static/image/r3.png"
            mode="widthFix"
          ></image>
        </view>
        <view class="bankUl">
          <view
            class="bank-list"
            v-for="(item, index) in bankList"
            :key="index"
            @click="opneDrawing(item)"
          >
            <view class="bank-item-left">
              <image
                v-if="item.type == 2"
                src="../../static/image/wallet.png"
                class="bank-img"
                mode=""
              ></image>
              <image
                v-else
                :src="$config.getImgUrl(item.imgUrl)"
                class="bank-img"
                mode=""
              ></image>
              <view class="bank-conent">
                <text v-if="item.type == 2" class="title-text oneTitleColor8"
                  >({{ $t('origo钱包') + item.branch }})</text
                >
                <text v-else class="title-text oneTitleColor8"
                  >{{ item.name
                  }}{{ item.type === 1 ? "(" + item.branch + ")" : "" }}</text
                >
                <view class="title-code">
                  {{ item.number | banknumber }}
                </view>
              </view>
            </view>
          </view>
          <view class="">
            <view class="img-null" v-if="bankList.length == 0">
              <image :src="$config.themeImgUrl('n1')" mode="aspectFit"></image
              ><br />
              <text class="themeTextTwo">{{ $t('一张银行卡都没有呢') }}</text>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 100px; background-color: #f4f4f4"></view>
    </view>

    <view
      class="add-card-view"
      v-if="(bankCardList.length < bankCountNumber ||
        usdtList.length < usdtCountNumber)  && !auditList.totalFail 
      "
    >
      <view class="add-card themeBtn gameListActive" @click="onAddCard">
        <text class="add-card-text gameListActive">{{ $t('添加收款方式') }}</text>
      </view>
    </view>
    <uni-popup ref="popupAdd" type="bottom">
      <view class="p-centent">
        <view
          class="item line"
          v-if="bankCardList.length < bankCountNumber"
          @click="addGetMoney(0)"
        >
          {{ $t('添加银行卡') }}
        </view>
        <view
          class="item line"
          v-if="usdtList.length < usdtCountNumber"
          @click="addGetMoney(1)"
        >
          {{ $t('添加数字货币') }}
        </view>
        <!-- <view class="item line" @click="addGetMoney(2)"> 添加origo钱包 </view> -->
        <view class="item" @click="addGetMoney(3)">
          {{ $t('取消') }}
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="popup" type="center">
      <view class="">
        <view class="phone-card" @tap.stop>
          <view class="">
            <view class="header">
              <text class="">{{ $t('请验证手机号提款') }}</text>
              <image
                src="../../static/image/close.png"
                class="close-img"
                @click="onClosePup"
              ></image>
            </view>
            <view class="conent">
              <view class="phone-box">
                <view class="title"> {{ $t('手机号') }}： </view>
                <view class="input-p-box">
                  <view class="phone-input" v-if="modeldata.phone">
                    {{ modeldata.phone }}
                  </view>
                  <input
                    v-if="!modeldata.phone"
                    type="number"
                    maxlength="11"
                    class="phone-input"
                    :placeholder="$t('请输入手机号')"
                    v-model="modeldata.mphone"
                    value="phone"
                  />
                </view>
              </view>
              <text v-if="phoneError" class="errText">{{
                $t('请输入正确的手机号')
              }}</text>
              <view class="code-box">
                <view class="title"> {{ $t('验证码') }}： </view>
                <view class="">
                  <input
                    type="number"
                    class="phone-input"
                    :placeholder="$t('请输入验证码')"
                    v-model="code"
                  />
                </view>
                <view class="code-time">
                  <text
                    class="code-text"
                    :class="{ 'time-text': disabledBut }"
                    @click="getPhoneCode"
                    >{{ codeButtext }}</text
                  >
                </view>
              </view>
              <text v-if="codeErrorText" class="errText">{{
                codeErrorText
              }}</text>
            </view>
            <view class="btn-sub" @click="onSubmit">
              {{ $t('确认') }}
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import cache from "../../utils/cache.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue";

export default {
  components: {
    uniPopup,
  },
  filters: {
    banknumber(val) {
      // if (val.length > 8) {
      return val.substr(0, 4) + " **** **** " + val.substr(-4);
      // } else {
      // 	return val
      // }
    },
  },
  data() {
    return {
      moreText: this.$t('更多'),
      num: 15,
      isListShow: true,
      showAccount: true,
      gameList: [],
      userMoney: "0.00",
      refreshimg: false,
      option: {},
      bankList: [],
      userdata: "",
      isbutOne: true,
      shuaFlag: true,
      isMoney: true, //false可以点击归集    true不可以点击归集
      codeButtext: this.$t('获取验证码'),
      scrollHeight: 0,
      upRefresh: true,
      scrollTop: 0,
      scrollAnimation: true,
      topHeight: 160,
      interruptPosition: 140,
      status: 0,
      scrollType: 0, //0正常显示位置    1主动触发展开   2还原位置   3禁止滑动
      textGui: false,
      shouUp: true,
      shouUpAnd: true,
      showPicker: false,
      bankitem: "",
      codeErrorText: "",
      modeldata: {},
      code: "", //验证码
      disabledBut: false,
      phoneError: false,
      bankCountNumber: 0, // 可绑定的银行卡数量
      usdtCountNumber: 0, // 可绑定的数字货币数量
      bankCardList: [], // 已绑定的银行卡
      usdtList: [], // 已绑定的数字货币
      phoneDisab: false,
      projectImgUrl: this.$config.projectImgUrl,
      // 稽核参数
      auditList: {
        afterTotalBet: 0, // 有效投注额
        amountAudit: 0, // 需稽核金额
        totalFail: 0, // 稽核失败数量
      }
    };
  },
  onLoad() {
    this.option = {
      clientId: cache.get("set_user").tenant_id, //tenant_id
      clientIp: this.$config.clientIp,
      memberId: cache.get("set_user").user_id, //userid
      username: cache.get("set_user").username,
    };
  },
  onShow() {
    if (this.$server.getUserBalance()) {
      let res = this.$server.getUserBalance();
      this.userMoney = this.$common.setNumFixed(res.totalBalance, 2);
      this.gameList = res.totalBalanceDetail;
    } else {
      this.getMoneyGame();
    }
    this.getbanklist();
    this.getUserData();
    this.getCardCount();
    this.getCost()
  },
  methods: {
    getCardCount() {
      this.$api.getRegisterSet("withdraw_open", (err, res) => {
        this.bankCountNumber = res.svalue.bank_card_count; // 可绑银行卡数量
        this.usdtCountNumber = res.svalue.digit_money_count; // 可绑数字货币数量
      });
    },
    showMore() {
      this.isListShow = !this.isListShow;
      this.num = this.isListShow ? 15 : this.gameList.length;
      this.moreText = this.isListShow
        ? this.$t('更多')
        : this.$t('收起');
    },
    //游戏厂商余额
    getMoneyGame(type) {
      this.refreshimg = true;

      this.$api.getGameBalance(
        this.option,
        (err, res) => {
          this.refreshimg = false;
          this.isMoney = false;
          this.shuaFlag = false;
          if (err) {
            if (type == 1) {
              uni.showToast({
                title: err.msg,
                icon: "none",
              });
            }
          } else {
            this.$server.setUserBalance(res);
            this.userMoney = res.totalBalance.toFixed(2);
            this.gameList = res.totalBalanceDetail;

            if (type == 1) {
              uni.showToast({
                title: this.$t('刷新余额成功'),
                duration: 3000,
                position: "center",
                icon: "none",
              });
            }
          }
        },
        false
      );
    },
    //获取银行卡列表
    getbanklist() {
      this.$api.getbankcardlist((err, res) => {
        this.bankList = res;
        this.bankCardList = res.filter((item) => {
          return item.type == 0;
        });
        this.usdtList = res.filter((item) => {
          return item.type == 1;
        });
      });
    },
    openaccount() {
      this.showAccount = !this.showAccount;
    },
    //一键归集
    onekey() {
      let self = this;
      self.shouUp = false;
      if (self.isbutOne) {
        self.textGui = true;
        uni.showLoading({
          title: this.$t('归集中！'),
        });
        self.guiGetOneMerge();
      } else {
        uni.showToast({
          title: this.$t('点击间隔10s，请勿重复操作！'),
          icon: "none",
        });
        self.isMoney = true;
        setTimeout(function () {
          self.isbutOne = true;
        }, 10000);
      }
    },
    //一键归集
    guiGetOneMerge(type) {
      var data = {
        clientId: cache.get("set_user").tenant_id, //tenant_id
        clientIp: "101.231.217.194",
        memberId: cache.get("set_user").user_id, //userid
        username: cache.get("set_user").username,
      };
      this.$api.getOneMerge(data, (err, res) => {
        uni.hideLoading();
        this.isMoney = true;
        this.textGui = false;
        this.isbutOne = false;
        if (res) {
          uni.showToast({
            title: this.$t('归集成功！'),
            duration: 3000,
            position: "center",
            icon: "none",
          });
          this.getMoneyGame();
        } else {
          uni.showToast({
            title: this.$t('归集失败，请重新尝试！'),
            duration: 3000,
            position: "center",
            icon: "none",
          });
        }
      });
    },
    getUserData() {
      this.$api.userInfo(cache.get("set_user").user_id, (err, res) => {
        if (res) {
          if (res.phone) {
            this.phoneDisab = true;
          }
          this.userdata = res;
        }
      });
    },
    opneDrawing(e) {
      this.bankitem = e;
      this.$api.firstWithdraw((err, res) => {
        if (res == true) {
          let phone = "";
          if (this.userdata.phone) {
            var reg = /^(\d{3})\d{4}(\d{4})$/;
            phone = this.userdata.phone.replace(reg, "$1****$2");
          }
          this.modeldata = {
            phone: phone,
            mphone: this.userdata.phone,
          };
          this.$refs.popup.open();
        } else {
          if (this.userdata.withdrawPassWordState) {
            if (e.type == 0) {
              uni.navigateTo({
                url: "../drawing/drawing?bankid=" + e.id,
              });
            } else {
              uni.navigateTo({
                url:
                  "../drawing/drawingCu/drawingCu?bankid=" +
                  e.id +
                  "&type=" +
                  e.type,
              });
            }
          } else {
            uni.showModal({
              title: this.$t('提示'),
              content: this.$t('您还未设置交易密码， 是否前往设置？'),
              confirmText: this.$t('立即前往'),
              success: (res) => {
                if (res.confirm) {
                  console.log("用户点击确定");
                  uni.navigateTo({
                    url:
                      "../upPassword/upPassword?type=2&isPassWord=" +
                      this.userdata.withdrawPassWordState,
                  });
                  // uni.navigateTo({
                  // 	url: '../upPassword/upPassword?type=2&isPassWord=false',
                  // });
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              },
            });
          }
        }
      });
    },
    listMe(list, type) {
      return list.filter(function (item) {
        return item.type == type;
      });
    },
    // 添加提款方式
    addAccout(type) {
      this.showPicker = false;
      if (type == 1) {
        //银行卡
        let dataArr = this.listMe(this.bankList, 0);
        if (dataArr.length >= 3) {
          uni.showToast({
            icon: "none",
            title: this.$t('您最多只能绑3张银行卡！如需调整，请联系客服！'),
          });
          return;
        }
        uni.navigateTo({
          url: "../addCard/addCard",
        });
      }
    },
    onAddCard() {
      this.$refs.popupAdd.open();
    },
    addGetMoney(e) {
      if (e == 0) {
        uni.navigateTo({
          url: "../addBank/addBank",
        });
      }
      if (e == 1) {
        uni.navigateTo({
          url: "../addCurrency/addCurrency",
        });
      }
      if (e == 2) {
        uni.navigateTo({
          url: "../addWallet/addWallet",
        });
      }
      // if(e == 3){
      this.$refs.popupAdd.close();
      // }
    },
    onSubmit() {
      console.log(this.code);
      let self = this;
      if (!this.code) {
        // this.showToast("请输入验证码");
        this.codeErrorText = this.$t('请输入验证码');

        // setTimeout(function() {
        // 	self.codeErrorText = ""
        // }, 1500)
        return;
      }
      const codePrefix = '84'
      this.$api.bindPhone(this.modeldata.mphone, this.code, codePrefix, (err, res) => {
        if (res) {
          // this.$emit("childFn", 300);
          uni.navigateTo({
            url: "../drawing/drawing?bankid=" + this.bankitem.id,
          });
          this.codeErrorText = "";
          this.code = "";
          this.onClosePup();
        }
        if (err) {
          this.codeErrorText = err.msg;
          setTimeout(function () {
            self.codeErrorText = "";
          }, 1500);
        }
      });
    },
    
    getCost(start = false) {
      let option = {
        memberId: cache.get("set_user").user_id,
      };
      this.$api.getCost(option, (err, res) => {
        if (res) {
          // 稽核参数
					if (res.dataList.length) {
						this.auditList.afterTotalBet = (res.dataList.reduce((afterTotalBet, item) => afterTotalBet + item.afterTotalBet || 0, 0)).toFixed(2);
						this.auditList.amountAudit = (res.dataList.reduce((amountAudit, item) => amountAudit + item.amountAudit || 0, 0)).toFixed(2);
					}
					this.auditList.totalFail = res.depositAudit.failed + res.discountAudit.failed; // 稽核失败总数
        }
      });
    },
    getPhoneCode() {
      if (this.phoneDisab == false) {
        // if (!/^1[3456789]\d{9}$/.test(this.modeldata.mphone * 1)) {
        //   this.phoneError = true;
        //   return;
        // } else {
        //   this.phoneError = false;
        // }
        this.phoneError = false;
      }

      if (this.disabledBut) {
        return;
      }
      this.$api.sendSmsCode(this.modeldata.mphone, 3, (err, res) => {
        console.log("验证码", err, res);
        if (err) {
          this.codeErrorText = err.msg;
        } else if (res) {
          this.showToast(this.$t('获取验证码成功'));
          this.disabledBut = !this.disabledBut;
          this.codeButtext = "60S";
          var time = 60;
          var intervalID = setInterval(() => {
            time--;
            this.codeButtext = time + "S";
            if (time == 0) {
              this.disabledBut = !this.disabledBut;
              clearInterval(intervalID);
              this.codeButtext = this.$t('获取验证码');
              time = 60;
            }
          }, 1000);
        }
      });
    },
    showToast(title) {
      console.log(title);
      uni.showToast({
        title: title,
        duration: 2000,
        icon: "none",
        position: "bottom",
      });
    },
    BackPage() {
      uni.navigateBacks({});
    },
    onClosePup() {
      this.$refs.popup.close();
    },
  },
};
</script>
<style lang="scss">
.phone-card {
  background-color: #ffffff;
  width: 80%;
  border-radius: 8px;
  margin-left: 10%;
  .header {
    font-size: 36rpx;
    font-weight: bold;
    padding: 32rpx 0px;
    text-align: center;
    .close-img {
      width: 34rpx;
      height: 34rpx;
      float: right;
      right: 32rpx;
    }
  }
  .conent {
    padding: 0px 40rpx;
    .phone-box {
      display: flex;
      align-items: center;
      .input-p-box {
        flex-grow: 2;
      }
    }

    .title {
      text-align: left;
      white-space: nowrap;
    }

    .codeM {
      margin-right: 30rpx;
    }

    .code-box {
      margin-top: 32rpx;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .code-text {
        color: #ebcc45;
        font-size: 22rpx;
      }

      .code-time {
        width: 200rpx;
      }

      .time-text {
        color: #a7a7a7;
      }
    }

    .phone-input {
      background-color: #f7f7f7;
      border-radius: 18px;
      height: 70rpx;
      text-align: left;
      padding-left: 10px;
      line-height: 70rpx;
    }

    .errText {
      font-size: 22rpx;
      color: #ff5e5e;
      margin: 15rpx 0px;
    }
  }

  .btn-sub {
    text-align: center;
    font-size: 30rpx;
    border-top: 1px solid #f4f4f4;
    padding: 20rpx 0px;
    color: #ebcc45;
    margin-top: 16px;
  }
}
.p-centent {
  text-align: center;
  background-color: #ffffff;
  .item {
    line-height: 90rpx;
  }
  .line {
    border-bottom: 1px solid #e4e4e4;
  }
}

.accBox {
  background-color: #f4f4f4;
  height: 100%;
}

$text-color: #484440;

.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}

.bank-view {
  // border-top: 14rpx solid #f4f4f4;
  margin-top: 14upx;
}

.bankTs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 106upx;
  background-color: #fff;
  padding: 0upx 30upx;
}

.bankAdd {
  width: 36upx;
  height: 36upx;
}

.bankUl {
  padding: 20upx 30upx 90rpx;
}

.bank-list {
  display: flex;
  justify-content: space-between;
  border-bottom: 2rpx solid #f4f4f4;
  // padding: 17rpx 35rpx;
  padding: 32upx;
  border-radius: 16upx;
  background-color: #fff;
  margin-bottom: 20upx;

  .bank-item-left {
    text-align: left;
    flex-grow: 1;
    display: flex;
    align-items: center;

    .bank-img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }

    .bank-conent {
      display: inline-block;
    }

    .title-code {
      font-size: 24rpx;
      color: var(--textTwo);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 74vw;
    }

    .title-text {
      font-size: 28rpx;
      color: var(--textOne);
      font-weight: bold;
    }
  }

  .bank-item-right {
    text-align: right;
    align-self: center;

    .right-more {
      width: 24rpx;
      height: 30rpx;
    }
  }
}

.my-card-title {
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: var(--textOne);
  line-height: 38px;
  // margin-left: 30rpx;
}

.card-bg {
  /* background-image: url(../../static/image/dzr/bg@2x.png);
		background-size: cover; */
  max-height: 500px;
  overflow: scroll;
}

.contents {
  // border-top: 1px solid var(--borderColor);
  // padding: 90upx 0px 10px 15px;
  // padding-top: 90upx;
}

.conBox {
  background-color: #fff;
  padding: 24upx 30upx;
  border-top: 1px solid var(--borderColor);
  padding-bottom: 0upx;
}

.conTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topLeft {
  display: flex;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
}

.account-text {
  font-size: 30rpx;
  font-weight: 600;

  // color: $text-color;
}

.but-moeny {
  display: block;
  float: right;
  width: 180rpx;
  height: 60rpx;
  padding: 0 10rpx;
  margin-right: -30upx;
  font-size: 24upx;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 64upx;
  border-bottom-left-radius: 64upx;
  font-family: "微软雅黑";
  background: #ebcc45;
}

.moeny {
  font-weight: 600;
  font-size: 54rpx;
  line-height: 2;
  color: $text-color;
  margin-left: 6rpx;
}

.see-model {
  font-size: 30rpx;
  color: $text-color;
}

.refresh-img {
  width: 40upx;
  height: 40upx;
  vertical-align: middle;
  margin-left: 6upx;
}

.refresh-img-animation {
  animation: mymove 1.5s infinite;
  // animation-iteration-count:infinite;
}

.arrow-img {
  width: 25rpx;
  height: 25rpx;
  margin-left: 11rpx;
}

.rmb-size {
  width: 21rpx;
  height: 31rpx;
}

.box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0px 30rpx;

  .box-item-box {
    width: 25%;
    text-align: center;
    padding: 8upx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    // border-bottom: 1px solid #F0F0F0;
    // border-right: 1px solid #f0f0f0;
    .more-text-view {
      text-align: center;
      line-height: 1;

      .more-text {
        line-height: 1;
      }
    }

    .icon-move {
      width: 18rpx;
      height: 20rpx;
    }
  }

  .box-xian-h {
    width: 1px;
    height: 70%;
    position: absolute;
    right: 0px;
    top: 50%;
    margin-top: -40upx;
    z-index: 99;
    background-color: #f4f4f4;
  }

  // .box-xian-h:nth-child(3n - 1){
  // 	background-color: #fff;
  // }
  .box-xian-s {
    width: 80%;
    height: 1px;
    position: absolute;
    left: 50%;
    bottom: 0px;
    margin-left: -68upx;
    z-index: 99;
    background-color: #f4f4f4;
  }

  .box-item {
    // width: 25%;
    // text-align: center;
    // padding: 20rpx 0px;
    // border-bottom: 1px solid #F0F0F0;

    .gamename {
      font-size: 26rpx;
      font-family: PingFangSC;
      font-weight: 600;
      color: var(--textOne);
      line-height: 38rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      width: 150rpx;
    }

    .rmb {
      color: var(--themeBtn);
      font-size: 26rpx;
      font-weight: 600;
    }

    .accoutMoney {
      color: var(--accoutMoney) !important;
    }

    .game-money-text {
      color: var(--textTwo);
      font-size: 22rpx;
      font-weight: 500;
    }

    .maintaining {
      width: 88rpx;
      height: 32rpx;
      // background: linear-gradient(90deg, rgba(240, 193, 113, 1) 0%, rgba(243, 218, 158, 1) 100%);
      border-radius: 64rpx;
      text-align: center;
      color: #fff;
      padding: 4upx 14upx;
      font-size: 22upx;
    }
    .maintainBackground {
      background: #ff6e6e;
    }
  }
}

.add-card-view {
  position: fixed;
  bottom: 0rem;
  background: var(--pageBackground);
  width: 100%;
  height: 60px;
  // -webkit-transform: translateZ(0);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-card {
  text-align: center;
  background: #ebcc45;
  border-radius: 60rpx;
  height: 80rpx;
  line-height: 80rpx;
  // margin: 10px 12%;
  // position: absolute;
  width: 90%;
}

.add-card-text {
  // color: #000;
  font-size: 30rpx;
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
}

.img-null {
  text-align: center;
  margin: 20px 0px;
}

.img-null image {
  width: 528rpx;
  height: 368rpx;
}

.img-null text {
  font-size: 24rpx;
  font-family: PingFangSC;
  font-weight: 400;
}

@keyframes mymove {
  0% {
    -webkit-transform: rotate(0deg);
  }

  // 25%{-webkit-transform:rotate(90deg);}
  50% {
    -webkit-transform: rotate(180deg);
  }

  // 75%{-webkit-transform:rotate(270deg);}
  100% {
    -webkit-transform: rotate(360deg);
  }
}

.loadingBox {
  width: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
}

.loadimgTopBox {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.loadingGif {
  width: 40%;
}

.loadingText {
  width: 100%;
  text-align: center;
  margin-top: -30px;
}
</style>
<style scoped>
.yu-datetime-content {
  height: auto;
}

.accountLi {
  height: 52px;
  text-align: center;
  line-height: 52px;
  background-color: #fff;
  border-bottom: 1px solid #f4f4f4;
  /* color: #1D1717; */
  font-size: 14px;
}

.liOut {
  /* color: #D6AE66; */
}

.account-view {
  background-color: #fff;
}


.audit-box {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #a7a7a7;
  text-align: center;
  margin-top: 60rpx;
  >text {
    font-size: 30rpx;
    line-height: 42rpx;
  }
  .audit-line {
    width: 480rpx;
    height: 24rpx;
    margin: 30rpx auto 16rpx;
    border-radius: 100rpx;
    background-color: #e1e1e1;
    overflow: hidden;
    view {
      width: 0;
      height: 100%;
      border-radius: 100rpx;
      background: var(--myloginbtn);
    }
  }
  .audit-count {
    font-size: 26rpx;
    line-height: 36rpx;
  }
}

</style>
