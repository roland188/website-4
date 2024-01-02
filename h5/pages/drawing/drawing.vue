<!-- 
 页面：提款页面
 作者：丹泽尔
 -->
<template>
  <view class="drawingPage">
    <uni-nav-bar :title="$t('取款')" leftIcon="back" :status-bar="true" :fixed="true" :shadow="false" @clickLeft="BackPage"></uni-nav-bar>
    <view class="drawIngBox">
      <view class="bankWhiteBox">
        <text class="my-card-title themeTextOne drawingText">{{$t('提款银行卡')}}</text>
        <view class="bank-list" @click="onSetBank">
          <view class="bank-item-left">
            <image :src="$config.getImgUrl(bankCard.imgUrl)" class="bank-img" mode=""></image>
            <view class="bank-conent">
              <text class="title-text themeTextOne drawingText">{{ bankCard.name }}</text>
              <view class="title-code themeTextTwo">
                {{ bankCard.number | banknumber }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="bank-view">
        <view class="bankFlex bankWhiteBox">
          <text class="my-card-title drawingText">{{$t('提款金额')}}</text>
          <view v-if="withdrawType" class="withdraw-box" >
						<text v-for="(item,index) in withdrawFixed" :key="'withdraw' + index" :class="{indexBtnActive:checkMoneyIndex === index}" 
						@click="checkMoney(item,index)">{{ item }}</text>
					</view>
          <view v-else class="bankLeft">
            <view class="bank-input" :class="{ bottomColor: !colorShow }">
              <input
                type="number"
                v-model="getMoney"
                :placeholder="tipsText"
                onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                @input="onInput($event, 'm')"
                @blur="changeMoney"
                @focus="inputFocus"
              />
              <view class="yuan">{{ $config.currency }}</view>
              <view class="allMoney textToastColor" @click="onMoenyAll(false)"> {{$t('全部')}} </view>
            </view>
            <view class="bankYesGet">
              <text class="yesText">{{$t('当前可提现金额')+ SureMoney + $t('元')}}</text>
            </view>
            <text class="tip-text" v-if="balance">{{ balance }}</text>
          </view>
        </view>
        <view class="bankWhiteBox">
          <view class="bankShi">
            <view class="bankShiLi">
              <text class="my-card-title drawingText">{{$t('实际到账金额')}}</text>
              <text class="ActualMoney moneyShi themeColor accoutMoney">{{ ActualMoney.toFixed(2) }}</text>
            </view>
            <view class="bankShiLiRight" @click="onRefresh()">
              <image :src="$config.themeImgUrl('r2')" class="refresh-img" mode="widthFix"></image>
              <view class="newShua themeTextOne drawingText"> {{$t('刷新')}} </view>
            </view>
          </view>

          <view class="tips">
            <text>{{$t('提现手续费')}}：{{ handlingfee.toFixed(3) }} {{ $t('元')}}</text>
            <text>{{$t('行政费用')}}：{{ administrativeCosts.toFixed(3)}} {{ $t('元') }}</text>
            <text>{{$t('优惠扣除')}}：{{ discountDeduction.toFixed(3)}} {{ $t('元') }}</text>
          </view>
        </view>
      </view>
      <view class="bankFlex bankWhiteBox">
        <text class="my-card-title drawingText">{{$t('交易密码')}}</text>
        <view class="bank-input inputJy" :class="{ bottomColor: !passWordBtShow }">
          <input
            type="password"
            v-model="withdrawpassword"
            :placeholder="$t('请输入交易密码')"
            @input="onInput($event, 'p')"
            @blur="passWordMoneys"
            @focus="passWordFocuss"
          />
        </view>
      </view>
      <view style="height: 150px"></view>
      <view class="but-view">
        <button @click="onSubmit" class="" :class="{ disabledStyle: disabledbut }">{{$t('确认提款')}}</button>
        <view style="margin-top: 5px">
          <text class="themeTextTwo">{{$t('有问题？请联系')}}</text>
          <navigator class="service" hover-class="none" @click="openSerive">{{$t('在线客服')}}</navigator>
        </view>
      </view>
    </view>
    <!-- <selectback v-bind:titleText="titleText" v-bind:isshow="isselectbank" v-bind:dlist="items" @ongetback="getbank"></selectback>

		<tips v-bind:msg="modeldata" @childFn="onchildFn"></tips> -->
  </view>
</template>

<script>
import cache from "../../utils/cache.js";

export default {
  components: {
    // tips: Tips,
    // selectback: SelectBack,
  },
  filters: {
    subtrings(cardnum) {
      if (cardnum) {
        return "(" + cardnum.substring(cardnum.length - 4, cardnum.length) + ")";
      } else {
        return "";
      }
    },
    banknumber(val) {
      if (val) {
        return val.substr(0, 4) + " **** **** " + val.substr(-4);
      } else {
        return;
      }
    },
  },
  data() {
    return {
      titleText: this.$t('选择银行'),
      isselectbank: false,
      tipsText: this.$t('请输入提款金额'),
      SureMoney: 0, //可用余额
      withdrawpassword: "",
      balance: "", //余额不足
      items: [],
      disabledbut: true,
      bankCard: {},
      bankId: "",
      getMoney: "",
      discountDeduction: 0, //优惠扣除
      handlingfee: 0, //手续费
      handlingfees: 0,
      withdrawPayRate:0, //百分比
      administrativeCosts: 0, //行政费用,
      ActualMoney: 0.0, //实际到账金额
      singleMax: 0, //单次最大
      singleMin: 0, //单次最小
      colorShow: true,
      passWordBtShow: true,
      withdrawFixed:null,
      withdrawType:0,
      checkMoneyIndex:null
    };
  },
  onLoad(option) {
    this.bankId = option.bankid;
  },
  onShow() {
    let option = {
      clientId: cache.get("set_user").tenant_id,
      username: cache.get("set_user").username,
    };
    this.$api.getBalanceMoney(option, (err, res) => {
      if (res) {
        this.SureMoney = res.money ? res.money.toFixed(3) : 0;
      }
    });
    this.getbankcardlist();
    this.getCost();
  },
  methods: {
    checkMoney(item,index) {
      this.getMoney = item
      this.checkMoneyIndex = index
      this.onMoenyAll(true)
    },
    listMe(list, type) {
	  if(Array.isArray(list) && list.length===0) return []
      return list.filter(function (item) {
        return item.type == type;
      });
    },
    getbankcardlist() {
      this.$api.getbankcardlist((err, res) => {
		  if(res){
			  let dataArr = this.listMe(res, 0);
			  this.items = dataArr;
			  this.items.forEach((item) => {
			    if (this.bankId == item.id) {
			      this.bankCard = item;
			    }
			  });
		  }
      });
    },
    getCost(start = false) {
      let option = {
        memberId: cache.get("set_user").user_id,
      };
      this.$api.getCost(option, (err, res) => {
        if (res) {
          this.withdrawFixed = res.withdrawFixed ?  res.withdrawFixed.split(',') : res.withdrawFixed; // 取款整额数组
          this.withdrawType = res.withdrawType; // 取款类型
          this.withdrawPayRate = res.withdrawPayRate; //百分比
          this.handlingfee = res.handlingfee + this.getMoney*Number(this.withdrawPayRate); //手续费
          this.handlingfees = res.handlingfee; //手续费
          this.administrativeCosts = res.administrativeCosts; //行政费用,
          this.discountDeduction = res.discountDeduction; //优惠扣除
          this.singleMax = res.singleMax; //单次最大
          this.singleMin = res.singleMin;
          if (start) {
            this.ActualMoney = this.getMoney - this.handlingfee - this.administrativeCosts - this.discountDeduction;
            if (this.ActualMoney < 0) {
              this.ActualMoney = 0;
            }
          }
        }
      });
    },
    //刷新金额
    onRefresh() {
      this.getCost();
    },
    onSubmit() {
      const self = this
      if (!this.getMoney) {
        uni.showToast({
          title: self.$t('请输入取款金额'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      if (!/(^[1-9]\d*$)/.test(this.getMoney)) {
        uni.showToast({
          title: self.$t('提款金额必须为正整数'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      if (this.balance) {
        uni.showToast({
          title: self.$t('您的余额不足，无法提现！'),
          duration: 3000,
          position: "center",
          icon: "none",
        });

        return;
      }
      if (this.getMoney < this.singleMin) {
        uni.showToast({
          title: self.$t('您的取款额度低于单次取款限额') + this.singleMin + self.$t('元'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      if (this.getMoney > this.singleMax) {
        uni.showToast({
          title: self.$t('您的取款额度高于单次取款限额') + this.singleMax + self.$t('元'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      if (this.ActualMoney <= 0) {
        uni.showToast({
          title: self.$t('您的实际获得额度过低，无法提现！'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      if (!this.withdrawpassword) {
        uni.showToast({
          title: self.$t('请输入交易密码'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      uni.showModal({
        title: self.$t('提示'),
        content: self.$t('是否确认提款？'),
        confirmText: self.$t('确定'),
        success: (res) => {
          if (res.confirm) {
            this.onSubmitFull();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    //全部
    onMoenyAll(isAll) {
      if(!isAll) this.getMoney = Math.floor(this.SureMoney * 1);//
      this.handlingfee = this.handlingfees + this.getMoney*Number(this.withdrawPayRate);
      this.colorShow = false;
      this.ActualMoney = this.getMoney * 1 - this.handlingfee - this.administrativeCosts - this.discountDeduction;
      if (this.ActualMoney < 0) {
        this.ActualMoney = 0;
      }
      if (this.getMoney && this.withdrawpassword) {
        this.disabledbut = false;
      } else {
        this.disabledbut = true;
      }
    },
    showModal() {
      this.isselectbank = true;
    },
    hideModal() {
      this.isselectbank = false;
    },
    onSetBank() {
      this.showModal();
    },
    onSubmitFull() {
      const self = this
      var data = {
        amount: this.getMoney,
        bankNo: this.bankCard.number,
        bankAccount: this.bankCard.account, //银行卡户名
        bankBranch: this.bankCard.branch, //	支行
        bankName: this.bankCard.name, //银行名称
        password: this.withdrawpassword,
        handlingfee: this.handlingfee, //手续费
        administrativeCosts: this.administrativeCosts, //行政费用,
        discountDeduction: this.discountDeduction, //优惠扣除
        operator: cache.get("set_user").username,
        bankId: this.bankId,
        type: 0,
      };
      this.$api.setBankDrawing(data, (err, res) => {
        if (res) {
          uni.showModal({
            title: self.$t('提示'),
            content: self.$t('申请成功，请等待平台审核'),
            confirmText: self.$t('确定'),
            cancelText: self.$t("取消"),
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                uni.navigateBacks();
              }
            },
          });
        }
        if (err) {
          uni.showModal({
            title: self.$t('提示'),
            content: err.msg || self.$t('提款失败请重试'),
            confirmText: self.$t('确定'),
            cancelText: self.$t("取消"),
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log("用户点击确定");
              } else if (res.cancel) {
                console.log("用户点击取消");
              }
            },
          });
        }
      });
    },
    getbank(e) {
      if (e != 1) {
        this.bankCard = e;
      }
      this.isselectbank = false;
    },
    //监听输入框事件
    onInput(event, t) {
      let n = event.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
      if (t === "m") {
        this.getMoney = n;
        this.handlingfee = this.handlingfees + this.getMoney*Number(this.withdrawPayRate);
      }
      setTimeout(() => {
        if (this.getMoney && this.withdrawpassword) {
          this.disabledbut = false;
        } else {
          this.disabledbut = true;
        }
        this.ActualMoney = this.getMoney * 1 - this.handlingfee - this.administrativeCosts - this.discountDeduction;
        if (this.ActualMoney < 0) {
          this.ActualMoney = 0;
        }
      }, 300);
    },
    //获取焦点
    changeMoney() {
      const self = this
      if (!/(^[1-9]\d*$)/.test(this.getMoney)) {
        uni.showToast({
          title: self.$t('提款金额必须为正整数'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      this.balance = this.getMoney * 1 > this.SureMoney * 1 ? self.$t('金额超限，请输入正确金额') : "";
      this.colorShow = true;
    },
    // 失去焦点
    inputFocus() {
      this.colorShow = false;
    },
    //密码获取焦点
    passWordMoneys() {
      this.passWordBtShow = true;
    },
    // 密码失去焦点
    passWordFocuss() {
      this.passWordBtShow = false;
    },
    BackPage() {
      uni.navigateBacks({});
    },
    openSerive() {
      uni.navigateTo({
        url: "/pages/subCustomerService/subCustomerService",
      });
    },
  },
};
</script>

<style lang="scss">
@import url("./drawing.css");
$text-color: #484440;
.drawingPage {
  background: #f8f8f8;
  height: 100%;
}
.bank-list {
  display: flex;
  justify-content: space-between;
  // border-bottom: 2rpx solid #F6F5F8;
  padding: 30rpx 16rpx;
  background-color: #fff;
  border-radius: 16upx;

  .bank-item-left {
    display: flex;
    align-items: center;
    flex-grow: 1;
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
      // color: $text-color;
      line-height: 1.8;
      margin-top: 10upx;
    }

    .title-text {
      font-size: 28rpx;
      font-weight: 600;
      // color: $text-color;
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
  // color: rgba(29, 23, 23, 1);
  line-height: 1;
  margin-top: 12rpx;
  color: var(--textOne);
  width: 170upx;
}

.bank-input {
  // padding-left: 28rpx;
  // border-bottom: 2rpx solid #F6F5F8;
  // margin-top: 35rpx;
  // padding-bottom: 10rpx;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8upx;
}
.bank-input view {
  font-size: 34rpx;
  font-weight: 600;
}
::v-deep uni-input {
  width: 260rpx;
  margin-right: 10px;
}
.bank-input .uni-input-placeholder {
  font-size: 20rpx;
  position: absolute;
  top: auto !important;
  left: 0;
  color: grey;
  overflow: hidden;
  text-overflow: clip;
  white-space: pre;
  word-break: keep-all;
  pointer-events: none;
  line-height: inherit;
}
.bank-view {
  // padding: 0px 30upx;
  // border-bottom: 17rpx solid #F6F5F8;
  // border-top: 17rpx solid #F6F5F8;

  .tips {
    text {
      display: block;
      line-height: 2;
    }
  }
}

.refresh-img {
  width: 40upx;
  height: 40upx;
  vertical-align: sub;
  // margin-right: 20rpx;
}

.ActualMoney {
  color: #d6ae66;
}
.accoutMoney {
  color: var(--accoutMoney) !important;
}
.bottomColor {
  border-bottom: 1px solid var(--themeBtn);
}
.bankFlex {
  display: flex;
}
.bankWhiteBox {
  background-color: #fff;
  border-radius: 16upx;
  margin-top: 20upx;
  padding: 24upx 16upx;
}
</style>
