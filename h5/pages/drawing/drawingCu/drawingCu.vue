<template>
  <view>
    <uni-nav-bar :title="$t('取款')" leftIcon="back" :status-bar="true" :fixed="true" :shadow="false" @clickLeft="BackPage"></uni-nav-bar>
    <view class="card">
      <view class="title">
        {{ title }}
      </view>
      <view class="bank-box">
        <image v-if="bankCard.type == 2" src="../../../static/image/wallet.png" class="bank-img" mode=""></image>
        <image v-else :src="$config.getImgUrl(bankCard.imgUrl)" class="bank-img" mode=""></image>
        <view class="">
          <view class="bank-name" v-if="bankCard.type == 2"> {{$t('origo钱包')}}({{ bankCard.branch }}) </view>
          <view v-else class="bank-name">
            {{ bankCard.name }}
          </view>
          <view class="tip-text">
            {{ bankCard.number | banknumber }}
          </view>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="title"> {{$t('提款金额')}} </view>
      <view class="flex-box">
        <text class="rmb">{{ $config.currency }}</text>
        <!-- <input type="number"  v-model="getMoney" :placeholder="tipsText"
				onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" 
				 @blur="changeMoney" @focus='inputFocus' @input="onInput($event,'m')" class="input-box"/> -->

        <input
          type="number"
          value=""
          v-model="getMoney"
          :placeholder="tipsText"
          onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          class="input-box"
          @input="onInput($event, 'm')"
          @blur="changeMoney"
          @focus="inputFocus"
        />

        <text class="all-text" @click="allPay">{{$t('全部')}}</text>
      </view>
      <view class="">
        <view class="tips-waring">
          {{ balance }}
        </view>
        <view class="tip-text"> 1RMB≈{{ zhuanSellrate | subNum }}{{ bankCard.name }} </view>
        <view class="tip-text"> {{$t('当前可提现金额')+ SureMoney + $t('元')}} </view>
        <view class="tip-text"> {{$t('最小提现金额')}}{{ accMul(singleMin, zhuanSellrate) }}{{ bankCard.name }} </view>
      </view>
      <view class="title">
        {{$t('实际到账金额')}}
        <image :src="['kubet','choibet','phattai68','jun88'].includes(projectImgUrl) ? 
                require('@/static/image/refresh1.png') :
                require('@/static/image/r2.png')"
                class="refresh-img" mode="" @click="getCost(true)"></image>
      </view>
      <view class=""> {{ ActualMoney.toFixed(2) }}
        {{ $config.currency }} ≈ {{ accMul(ActualMoney, zhuanSellrate) }}USDT </view>
      <view class="tip-text"> {{$t('提现手续费')}}：{{ $config.currency }}{{ handlingfee.toFixed(2) }} </view>
      <view class="tip-text"> {{$t('行政费用')}}：{{ $config.currency }}{{ administrativeCosts.toFixed(2) }} </view>
      <view class="tip-text"> {{$t('优惠扣除')}}：{{ $config.currency }}{{ discountDeduction.toFixed(2) }} </view>
    </view>
    <view class="card flex-box padding">
      <view class="title"> {{$t('交易密码')}} </view>
      <input type="password" v-model="withdrawpassword" @input="onInput($event, 'p')" :placeholder="$t('请输入交易密码')" />
    </view>
    <view class="">
      <view class="btn-get-money" @click="onSubmit" :class="{ disabledbtn: disabledbut }"> {{$t('确认提款')}} </view>
    </view>
  </view>
</template>
<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";

export default {
  components: {
    uniPopup,
  },
  filters: {
    banknumber(val) {
      // if(val.length>8){
      return val.substr(0, 4) + " **** **** " + val.substr(-4);
      // }else{
      // 	return val
      // }
    },
    subNum(val) {
      var re = /([0-9]+\.[0-9]{6})[0-9]*/;
      let aNew = (val + "").replace(re, "$1");
      return aNew;
    },
  },
  data() {
    return {
      discountDeduction: 0, //优惠扣除
      handlingfee: 0, //手续费
      administrativeCosts: 0, //行政费用,
      ActualMoney: 0.0, //实际到账金额
      withdrawpassword: "",
      getMoney: "",
      bankCard: {
        number: "",
      },
      digitCcy: "",
      digitLink: "",
      SureMoney: 0, //可用余额
      singleMax: "",
      singleMin: "",
      tipsText: this.$t('请输入提款金额'),
      sellrate: 7.02,
      zhuanSellrate: 0,
      balance: "",
      disabledbut: true,
      refreshimg:false,
      bankType: 0, //收款方式type
      title: this.$t('数字货币钱包'),
      projectImgUrl: this.$config.projectImgUrl,
    };
  },
  onLoad(option) {
    this.bankId = option.bankid;
    this.bankType = option.type;
    if (this.bankType == 1) {
      this.title = this.$t('数字货币钱包');
    } else {
      this.title = this.$t('origo钱包');
    }
  },
  onShow() {
    let option = {
      clientId: this.$cache.get("set_user").tenant_id,
      username: this.$cache.get("set_user").username,
    };
    this.$api.getBalanceMoney(option, (err, res) => {
      if (res) {
        this.SureMoney = res.money ? res.money.toFixed(2) : 0;
      }
    });
    this.getCost();
    this.getbankcardlist();
  },
  methods: {
    //计算数字精度
    accMul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
    },
    getbankcardlist() {
      this.$api.getbankcardlist((err, res) => {
		if(res){
			let dataArr = this.listMe(res, this.bankType);
			dataArr.forEach((item) => {
			  if (this.bankId == item.id) {
				this.bankCard = item;
				this.digitCcy = item.name;
				this.digitLink = item.branch;
				this.getDigitRate();
			  }
			});
			console.log(this.bankCard);
		}
      });
    },
    listMe(list, type) {
      return list.filter(function (item) {
        return item.type == type;
      });
    },
    //监听输入框事件
    onInput(event, t) {
      let n = event.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
      if (t === "m") {
        if (!/(^[1-9]\d*$)/.test(n)) {
          uni.showToast({
            title: this.$t('只能输入正整数'),
            duration: 2000,
            position: "center",
            icon: "none",
          });
          let num = event.target.value.split(".");
          console.log("请输入正整数", num, num[0]);
          setTimeout(() => {
            this.getMoney = num[0];
          }, 100);

          return;
        }
        // this.getMoney = n
      }
      setTimeout(() => {
        if (this.getMoney && this.withdrawpassword) {
          this.disabledbut = false;
        } else {
          this.disabledbut = true;
        }
        this.ActualMoney = this.getMoney - this.handlingfee - this.administrativeCosts - this.discountDeduction;
        if (this.ActualMoney < 0) {
          this.ActualMoney = 0;
        }
      }, 300);
    },
    //获取焦点
    changeMoney() {
      console.log(this.getMoney, this.SureMoney);
      this.balance = this.getMoney * 1 > this.SureMoney * 1 ? this.$t('金额超限，请输入正确金额') : "";
      this.colorShow = true;
    },
    // 失去焦点
    inputFocus() {
      this.colorShow = false;
    },
    getCost(start = false) {
      let option = {
        memberId: this.$cache.get("set_user").user_id,
      };
      this.refreshimg = true
      this.$api.getCost(option, (err, res) => {
        if (res) {
          this.refreshimg = false
          this.handlingfee = res.handlingfee; //手续费
          this.administrativeCosts = res.administrativeCosts; //行政费用,
          this.discountDeduction = res.discountDeduction; //优惠扣除
          this.singleMax = res.singleMax; //单次最大
          this.singleMin = res.singleMin;
          if (start) {
            this.ActualMoney = this.getMoney - this.handlingfee - this.administrativeCosts - this.discountDeduction;
            if (this.ActualMoney < 0) {
              this.ActualMoney = 0;
            }
            uni.showToast({
              title: this.$t('刷新成功'),
              duration: 2000,
              position: "center",
              icon: "none",
            });
          }
        }else{
          this.refreshimg = false
        }
      });
    },
    // 全部体现
    allPay() {
      this.getMoney = this.$common.setNumFixed(this.SureMoney, 2);
      this.ActualMoney = this.getMoney * 1;
      if (this.getMoney && this.withdrawpassword) {
        this.disabledbut = false;
      } else {
        this.disabledbut = true;
      }
    },
    getDigitRate() {
      let param = {
        digitCcy: this.digitCcy, //币种
        digitLink: this.digitLink, //链路
        type: this.bankType,
      };
      this.$api.getDigitRate(param, (err, res) => {
        console.log(err, res);
        if (err) {
          clearInterval(this.timeGetRate);
          this.timeGetRate = null;
          console.log(err);
          if (err.code === 130000) {
            uni.showModal({
              title: this.$t('提示'),
              content: err.msg,
              confirmText: this.$t('确定'),
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log("用户点击确定");
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              },
            });
          } else {
            uni.showToast({
              icon: "none",
              title: err.msg,
            });
          }
        } else {
          this.sellrate = res.digitBuyRate;
          this.zhuanSellrate = this.subNum6(1 / this.sellrate);
        }
      });
    },
    subNum6(val) {
      var re = /([0-9]+\.[0-9]{6})[0-9]*/;
      let aNew = (val + "").replace(re, "$1");
      return aNew;
    },
    onSubmit() {
      if (!this.getMoney) {
        uni.showToast({
          title: this.$t('请输入取款金额'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      if (this.balance) {
        uni.showToast({
          title: this.$t('您的余额不足，无法提现！'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      if (this.getMoney < this.singleMin) {
        uni.showToast({
          title: this.$t('您的取款额度低于单次取款限额')+":" + this.singleMin + this.$t('元'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      if (this.getMoney > this.singleMax) {
        uni.showToast({
          title: this.$t('您的取款额度高于单次取款限额') + ":" + this.singleMax + this.$t('元'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
      if (this.ActualMoney <= 0) {
        uni.showToast({
          title: this.$t('您的实际获得额度过低，无法提现！'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }

      if (!this.getMoney) {
        this.modeldata = {
          content: this.$t('请输入金额'),
          isShow: true,
          types: 1,
          showCancel: false,
          confirmText: this.$t('确定'),
          success: 200,
        };
        return;
      }
      if (!this.withdrawpassword) {
        uni.showToast({
          title: this.$t('请输入交易密码'),
          duration: 3000,
          position: "center",
          icon: "none",
        });
        return;
      }
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
        operator: this.$cache.get("set_user").username,
        type: this.bankType,
        digitRate: this.sellrate,
      };
      this.$api.setBankDrawing(data, (err, res) => {
        if (res) {
          // #ifdef H5
          if(localStorage.getItem('fbPixelId') && window.fbq){
            fbq('trackCustom', 'h5-withdrawal',{  value: this.getMoney, currency: 'CNY'})
          }
          // #endif
          uni.showModal({
            title: this.$t('提示'),
            content: this.$t('申请成功，请等待平台审核'),
            confirmText: this.$t('确定'),
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log("用户点击确定");
              }
            },
          });
        }
        if (err) {
          uni.showModal({
            title: this.$t('提示'),
            content: err.msg || this.$t('提款失败请重试'),
            confirmText: this.$t('确定'),
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log("用户点击确定");
              }
            },
          });
        }
      });
    },
    BackPage() {
      uni.navigateBacks();
    },
  },
};
</script>
<style lang="scss" scoped>
.all-text {
  color: #ebcc45;
}
.rmb {
  font-size: 25px !important;
  margin-right: 6px;
  font-weight: bold;
}
.input-box {
  flex-grow: 2;
}
.card {
  border-radius: 10px;
  margin: 30rpx;
  background: #ffffff;
  padding: 20rpx;
  .refresh-img {
    width: 45rpx;
    height: 45rpx;
    vertical-align: middle;
    margin-left: 10px;
  }
  .tip-text {
    color: #a7a7a7;
    font-size: 24rpx;
  }
  .tips-waring {
    color: #f4333c;
    font-size: 24rpx;
  }
  .title {
    color: #333333;
    font-size: 30rpx;
    font-weight: bold;
    margin-right: 30rpx;
  }

  .bank-box {
    display: flex;
    align-items: center;
    .bank-img {
      width: 80rpx;
      height: 80rpx;
      margin-right: 20rpx;
    }
    .bank-name {
      font-size: 28rpx;
      font-weight: bold;
    }
  }
}
.flex-box {
  display: flex;
  align-items: center;
}
.padding {
  padding: 50rpx 30rpx;
}
.btn-get-money {
  background: #ebcc45;
  color: #1f1f1f;
  margin: 30rpx;
  text-align: center;
  font-size: 30rpx;
  border-radius: 20px;
  line-height: 90rpx;
}
.disabledbtn {
  opacity: 0.6;
}
.refresh-img-animation {
  animation: mymove 1.5s infinite;
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
</style>
