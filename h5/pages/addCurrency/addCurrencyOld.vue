<!-- 
 页面：添加银行卡
 作者：丹泽尔
 -->
<template>
  <view class="conent pageBackground">
    <uni-nav-bar title="添加数字货币" leftIcon="back" :status-bar="true" :fixed="true" :shadow="false" @clickLeft="BackPage"></uni-nav-bar>

    <view class="addCardUl">
      <view class="uni-flex border-item">
        <view class="flex-item">
          <text class="name oneTitleColor8">选择币种</text>
        </view>
        <view class="flex-item-right">
          <view class="cu-item arrow" @click="onSetBank">
            <view class="content">
              <text class="text-grey oneTitleColor8">{{ bankCodeName }}</text>
              <image src="../../static/image/more.png" class="right-more" mode=""></image>
            </view>
          </view>
        </view>
      </view>
      <view v-show="radioItems.length > 0" class="uni-flex border-item">
        <view class="flex-item">
          <text class="name oneTitleColor8">链名称</text>
        </view>
        <view class="flex-item-right">
          <view class="currencyLabel" v-for="(item, index) in radioItems" :key="index" @click="lableTap(item, index)">
            <view class="currencyRadio" v-if="isLabel !== index"></view>
            <view
              class="currencyRadio"
              :style="{ backgroundImage: 'url(' + $config.themeImgUrl('z1') + ')' }"
              v-if="isLabel === index"
            ></view>
            <view class="currencyName themeTextOne oneTitleColor8">
              {{ item.link }}
            </view>
          </view>
        </view>
      </view>
      <view class="uni-flex border-item">
        <view class="flex-item">
          <text class="name oneTitleColor8">钱包地址</text>
        </view>
        <view class="flex-item-right">
          <input
            class="inputColor themeTextOne oneTitleColor8"
            :placeholder="labelName"
            placeholder-class="placeholder-class"
            v-model="bankData.number"
          />
        </view>
      </view>
    </view>

    <view class="submit-view">
      <button class="but-submit" :disabled="successBtn" @click="submit()">确定添加</button>
    </view>

    <uni-popup ref="popup" type="bottom">
      <view class="select-p">
        <view class="header"> 选择币种 </view>
        <view class="padding-xl">
          <view class="view-list" v-for="(item, index) in items" :key="index" @click="getbank(item, index)">
            <text class="radio-item-text">{{ item.currency }}</text>
            <image src="../../static/image/select2.png" v-show="index == current" class="radio-item-img-activty" mode=""></image>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";

export default {
  components: {
    uniPopup,
  },
  data() {
    return {
      labelName: "",
      radioItems: [],
      bankCodeName: "请选择币种类型",
      items: [
        {
          cname: "比特币",
          addrtype: [
            {
              link: "OMNI",
              id: 3,
              sellrate: 7.02,
              buyrate: 7.03,
            },
          ],
          currency: "BTC",
        },
        {
          cname: "以太币",
          addrtype: [
            {
              link: "ERC20",
              id: 2,
              sellrate: 7.02,
              buyrate: 7.03,
            },
          ],
          currency: "ETH",
        },
        {
          cname: "泰达币",
          addrtype: [
            {
              link: "OMNI",
              id: 4,
              sellrate: 7.02,
              buyrate: 7.03,
            },
            {
              link: "ERC20",
              id: 1,
              sellrate: 7.02,
              buyrate: 7.03,
            },
          ],
          currency: "USDT",
        },
      ],
      bankData: {
        account: "",
        name: "",
        branch: "",
        number: "",
        withdrawpassword: "",
        phone: "",
        sms_key: "",
        sms_code: "",
      },
      disabledBut: false,
      modeldata: "",
      bindPhone: 0,
      memberId: "",
      isLabel: 0,
      successBtn: false,
      current: 0,
    };
  },
  watch: {
    ["bankData.number"](val) {
      // this.bankData.number = val.replace(/[^\w]/g, '');
      if (/[^\w]/.test(val)) {
        //当输入非数字和字母的时候用''替换
        var temp_amount = val.replace(/[^\w]/g, "");
        this.bankData.number = temp_amount;
      }
    },
  },
  onLoad() {
    this.getListDigitPayWays();
  },
  onShow() {
    this.$api.userInfo(this.$cache.get("set_user").user_id, (err, res) => {
      this.bindPhone = res.bindPhone;
      this.memberId = res.userId;
      this.bankData.phone = res.phone;
      if (res.realName) {
        this.bankData.account = res.realName;
      } else {
        uni.showModal({
          title: "提示",
          content: "请填写真实姓名再添加银行卡",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log("用户点击确定");
              uni.navigateTo({
                url: "../personal/personal",
              });
            }
          },
        });
        return;
      }
      if (!res.withdrawPassWordState) {
        uni.showModal({
          title: "提示",
          content: "请先设置取款密码再添加银行卡",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log("用户点击确定");
              uni.navigateTo({
                url: "../upPassword/upPassword?type=2&isPassWord=false",
              });
            }
          },
        });
        return;
      }
    });
  },
  methods: {
    BackPage() {
      uni.navigateBacks();
    },
    getListDigitPayWays() {
      this.$api.listDigitPayWays((err, res) => {
        if (err) {
          uni.showToast({
            icon: "none",
            title: err.msg + "(" + err.code + ")",
          });
        } else {
          this.items = res;
          this.bankCodeName = res[0].currency;
          this.radioItems = res[0].addrtype;
          this.bankData.branch = res[0].addrtype[0].link;
          this.labelName = "请输入" + res[0].addrtype[0].link + "钱包地址";
        }
      });
    },
    // 点击label
    lableTap(item, i) {
      this.isLabel = i;

      this.bankData.branch = item.link;
      this.labelName = "请输入" + item.link + "钱包地址";
    },
    // radioChange: function(e) {
    // 	var checked = e.target.value
    // 	var changed = {}
    // 	for (var i = 0; i < this.radioItems.length; i++) {
    // 		if (checked.indexOf(this.radioItems[i].name) !== -1) {
    // 			changed['radioItems[' + i + '].checked'] = true
    // 		} else {
    // 			changed['radioItems[' + i + '].checked'] = false
    // 		}
    // 	}
    // },
    submit() {
      this.bankData.name = this.bankCodeName;
      if (!this.bankData.name) {
        this.showToast("请选择币种");
        return;
      }
      if (!this.bankData.account) {
        this.showToast("请输入钱包地址");
        return;
      }
      if (!this.bankData.branch) {
        this.showToast("请输入链地址");
        return;
      }
      if (this.bankData.branch.trim() == "") {
        this.showToast("请输入链地址");
        return;
      }
      if (!this.bankData.number) {
        this.showToast("请输入钱包地址");
        return;
      }
      var banknum = this.bankData.number.replace(/\s*/g, ""); //去除空格
      var data = {
        account: this.bankData.account, //	银行卡账户名
        branch: this.bankData.branch, //	支行
        memberId: this.memberId, //	会员id
        name: this.bankData.name, //	银行名称
        number: banknum, //卡号
        // #ifdef H5
        clientItem: window.childCode, //子平台id字段
        // #endif
        // #ifdef APP-PLUS
        clientItem: this.$config.childCode, //客户端id字段
        // #endif
        type: 1,
      };
      this.successBtn = true;
      this.$api.addbankcard(data, (err, res) => {
        this.successBtn = false;
        if (err) {
          let msg = err.msg;
          let code = err.code;
          uni.showToast({
            title: msg + `(${code})`,
            duration: 2000,
            icon: "none",
          });
        }
        if (res) {
          uni.navigateBacks();
          uni.showToast({
            title: "添加成功",
            duration: 2000,
            position: "center",
          });
        }
      });
    },
    onSetBank() {
      this.$refs.popup.open();
    },
    getbank(e, i) {
      this.current = i;

      this.bankCodeName = e.currency;
      this.radioItems = e.addrtype;
      this.bankData.branch = e.addrtype[0].link;
      this.labelName = "请输入" + e.addrtype[0].link + "钱包地址";
      this.$refs.popup.close();
    },
    showToast(title) {
      uni.showToast({
        title: title,
        duration: 2000,
        icon: "none",
        position: "center",
      });
    },
  },
};
</script>

<style lang="scss">
.select-p {
  background: #ffffff;
  .header {
    text-align: center;
    height: 90rpx;
    line-height: 90rpx;
  }
  .padding-xl {
    overflow: scroll;
    max-height: 300px;
    padding: 15px;
    .view-list {
      text-align: left;
      line-height: 3.5;
    }

    .radio-item-img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      vertical-align: middle;
    }

    .radio-item-text {
      width: 90%;
      text-align: left;
    }

    .radio-item-img-activty {
      width: 13px;
      height: 10px;
      margin-left: 46rpx;
    }
  }
}
.conent {
  border-top: 1px solid #f5f6f8;
}
.addCardUl {
  border-radius: 10px;
  background: #ffffff;
  margin: 30rpx;
}

.uni-flex {
  display: -webkit-flex;
  /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  line-height: 2;
}

.flex-item {
  flex-grow: 1;
  width: 28%;
  /* default 0 */
}

.flex-item-right {
  flex-grow: 3;
  width: 75%;
  align-items: center;
  justify-content: space-between;

  /* padding-top: 5px; */
  .sms-with {
    display: inline-block;
    width: 50%;
  }

  .flex-Code {
    text-align: right;
    // width: 40%;
    display: inline-block;
  }
}

.border-item {
  border-bottom: 1px solid var(--separator);
  padding: 32upx 16upx;
  display: flex;
  align-items: center;
}

.submit-view {
  width: 75%;
  position: fixed;
  left: 12%;
  bottom: 3%;
}

.but-submit {
  background: #ebcc45; //linear-gradient(to right, #F0C171, #F3DA9E);
  color: #1f1f1f;
  border-radius: 60rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
}

.visible-img {
  width: 26px;
  height: 16px;
}

.but-submit-code {
  color: #d6ae66;
  border: 1px solid #d6ae66;
  border-radius: 60rpx;
  padding: 0px 8px;
  height: 42rpx;
  line-height: 40rpx;
  text-align: center;
  font-size: 22rpx;
  background: #fff;
}

.tip-text {
  color: #f4333c;
  font-size: 22rpx;
  padding-left: 50rpx;
}

.bank-code {
  line-height: 4;
  border-bottom: 1px solid #f5f6f8;
}

.png {
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  padding-right: 5px;
}

.cu-item {
  display: inline-block;
}

.right-more {
  width: 13px;
  height: 13px;
  margin-left: 10px;
  vertical-align: middle;
}

.name {
  font-size: 30rpx;
  vertical-align: middle;
  color: var(--textOne);
  font-weight: 600;
}

button::after {
  border: none;
}

.text-grey {
  color: var(--textOne);
  font-size: 30rpx;
  vertical-align: middle;
  font-weight: 600;
}

.placeholder-class {
  font-size: 28rpx !important;
  color: var(--textTwo);
  font-weight: 500;
}
.disabledStyle {
  color: var(--textTwo) !important;
}

.uni-radio-input-checked {
  background-color: red !important;
}
</style>
<style></style>
