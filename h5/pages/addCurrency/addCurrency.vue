<!-- 
 页面：添加银行卡
 作者：丹泽尔
 -->
<template>
  <view class="addBankPage">
    <uni-nav-bar :title="$t('添加数字货币')" leftIcon="back" :status-bar="true" :fixed="true" :shadow="false" @clickLeft="BackPage"></uni-nav-bar>

    <view class="conent pageBackground">
      <view class="addCardUl">
        <view class="uni-flex border-item">
          <view class="flex-item">
            <text class="name oneTitleColor8">{{ $t('账户姓名') }}</text>
          </view>
          <view class="flex-item-right">
            <input
              class="inputColor themeTextOne oneTitleColor8"
              :placeholder="$t('请输入账户姓名')"
              placeholder-class="placeholder-class"
              :disabled="disabledName"
              v-model="bankData.account"
            />
          </view>
        </view>
        <view class="uni-flex border-item">
          <view class="flex-item">
            <text class="name oneTitleColor8">{{ $t('银行名称') }}</text>
          </view>
          <view class="flex-item-right">
            <view class="cu-item arrow">
              <view class="contentCard">
                <image :src="bankImg" v-if="bankImg" class="png" mode="aspectFit"></image>
                <text class="text-grey oneTitleColor8">{{ bankCodeName }}</text>
                <!-- <image src="../../static/image/more.png" class="right-more" mode=""></image> -->
              </view>
            </view>
          </view>
        </view>
        <view class="uni-flex border-item">
          <view class="flex-item">
            <text class="name oneTitleColor8">{{bankCodeName === $t('数字货币') ? $t('地址') : $t('卡号')}}</text>
          </view>
          <view class="flex-item-right">
            <input
              class="inputColor themeTextOne oneTitleColor8"
              type="text"
              :placeholder="bankCodeName === $t('数字货币') ? $t('请输入钱包地址') : $t('请输入卡号')"
              placeholder-class="placeholder-class"
              v-model="bankData.number"
            />
          </view>
        </view>
        <!-- <text class="tip-text" v-if="bankcodeTip && bankCodeName !== '数字货币'">银行卡号必须大于12位小于19位</text> -->
        <view class="uni-flex border-item">
          <view class="flex-item">
            <text class="name oneTitleColor8">{{bankCodeName === $t('数字货币') ? $t('链路') : $t('支行')}}</text>
          </view>
          <view class="flex-item-right">
            <input
              class="inputColor themeTextOne oneTitleColor8"
              :placeholder="bankCodeName === $t('数字货币') ? $t('请输入ERC20或TRC20') : $t('请输入支行名称')"
              placeholder-class="placeholder-class"
              v-model="bankData.branch"
            />
          </view>
        </view>
        <view v-show="smsShow">
          <view class="uni-flex border-item">
            <view class="flex-item">
              <text class="name oneTitleColor8">{{ $t('手机号') }}</text>
            </view>
            <view class="flex-item-right">
              {{phoneNum}}
            </view>
				  </view>
          <view class="uni-flex border-item">
            <view class="flex-item">
              <text class="name oneTitleColor8">{{ $t('验证码') }}</text>
            </view>
            <view class="flex-item-right">
              <input type="number" :placeholder="$t('请输入短信验证码')" style="font-size: 24upx;" v-model='smsNum'
              @confirm='submit()' />
            </view>
            <view class='verifyCode' :class="!isDisable ? 'themeColor':'disabledPhone'" @tap='getPhoneCode'>{{count==0?$t('获取验证码'):count+'S'}}</view>
          </view>
        </view>
      </view>

      <view class="submit-view">
        <button class="but-submit" :disabled="successBtn" @click="submit()">{{ $t('确认提交') }}</button>
      </view>
    </view>

    <uni-popup ref="popup" type="bottom" @tap.stop @change="handlePopupChange">
      <view class="popup-header">
        <view class="header-title"> {{ $t('选择银行') }} </view>
        <view class="">
          <image src="../../static/image/close.png" class="closeImg" @click="onClosePopup" mode=""></image>
        </view>
      </view>
      <view class="padding-xl">
        <view class="bank-search">
					<input class="bank-search__input" type="text" :cursor-spacing="400" v-model.trim="keyword" :placeholder="$t('请选择银行')" placeholder-style="color:#999;font-size:28rpx">
					<image src="../../static/image/gs2.png" class="bank-search_s" mode=""></image>
					<image src="../../static/image/cha4.png" class="bank-search_e" mode="" @click="keyword = ''"></image>
				</view>
        <scroll-view scroll-y="true" class="scroll-Y" v-if="bankList.length">
          <view class="view-list" v-for="(item, index) in bankList" :key="index" @click="getbank(item, index)">
            <image :src="$config.getImgUrl(item.imgUrl)" class="radio-item-img" mode=""></image>
            <text class="radio-item-text" :style="{fontWeight:item.name==$t('数字货币')?'bold':'500'}">{{ item.name }}{{ item.number | subtrings }}</text>
            <!-- <image src="../../static/image/select2.png" v-show="index == current" class="radio-item-img-activty" mode=""></image> -->
          </view>
        </scroll-view>
        <view v-else class="scroll-Y bank-search__empty">
					<text>{{ $t('未搜索到相关银行') }}</text>
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
    subtrings(cardnum) {
      if (cardnum) {
        return "(" + cardnum.substring(cardnum.length - 4, cardnum.length) + ")";
      } else {
        return;
      }
    },
  },
  data() {
    return {
      Ispassword: true,
      codeButtext: this.$t('获取验证码'),
      smsNum: "", // 短信验证码
      count: 0,
      isDisable: false, //禁止再次发送短信验证码
      phoneTip: false,
      bankcodeTip: false,
      isselectbank: false,
      bankCodeName: this.$t('请选择银行'),
      bankImg: "",
      card_num: "",
      phoneNum: "", // 手机号
      items: [],
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
      showPhone: "",
      showPhoneIS: false,
      showName: "",
      successBtn: false,
      disabledName: false, //是否可编辑银行卡
      smsShow: false, // 是否开启验证码
      keyword:'',
      bind_sms: 0,
      bind_usdt_sms: 0,
    };
  },
  computed:{
    bankList() {
      if (this.keyword === '') return this.items
        return this.items.filter((bank) =>
        bank.name.toLowerCase().includes(this.keyword.toLowerCase())
      )
    }
  },
  onLoad() {
    this.bankCodeName = this.$t('确定');
    this.bankData.name = this.$t('确定');
    // this.$api.getbanklist((err, res) => {
    //   // this.items = res;
    //   this.items = res.filter(item => { return item.name !== '数字货币' })
    // });
  },
  onShow() {
    const self = this
    this.$api.userInfo(cache.get("set_user").user_id, (err, res) => {
      this.phoneNum = res.phone;
      this.disabledName = !res.realNameEditable;
      this.bindPhone = res.bindPhone;
      this.memberId = res.userId;
      if (res.phone) {
        this.showPhoneIS = true;
      }
      var tel = res.phone;
      var reg = /^(\d{3})\d{4}(\d{4})$/;
      this.showPhone = tel.replace(reg, "$1****$2");
      this.bankData.phone = res.phone;
      // }
      if (res.realName) {
        let name = res.realName;
        // this.bankData.account = res.realName; //name.substr(0,1) + new Array(name.length).join('*');
        this.bankData.account = res.realName;
      } else {
        uni.showModal({
          title: self.$t('提示'),
          content: self.$t('请填写真实姓名再添加银行卡'),
          confirmText: self.$t('确定'),
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
          title: this.$t('提示'),
          content: this.$t('请先设置取款密码再添加银行卡'),
          confirmText: this.$t('确定'),
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
      this.getBindSmsSetting();
    });
  },
  methods: {
    //是否需要短信验证
    getBindSmsSetting() {
      const self = this 
      this.$api.getRegisterSet("withdraw_open", (err, res) => {
        if (res) {
          this.bind_usdt_sms = res.svalue.bind_usdt_sms || 0;
          this.bind_sms = res.svalue.bind_sms || 0;
          //是否短信验证
          this.smsShow = this.bind_usdt_sms == 1 ? true : false;
          if (this.smsShow && !this.phoneNum) {
            uni.showModal({
              title: self.$t('提示'),
              content: self.$t('请您前往绑定手机号'),
              confirmText: self.$t('确定'),
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: "/pages/personal/personal",
                  });
                } else {
                  console.log('else', res)
                }
              },
            })
            return
          }
        }
      });
    },
    //验证银行卡号
    bankcode(event) {
      if (this.bankCodeName === this.$t('数字货币')) return false;
      var pattern = /^[0-9]*$/; // /^([1-9]{1})(\d{14}|\d{18})$/;
      var bankinput = event.detail.value;
      var bank = bankinput.replace(/\s*/g, "");
      if (pattern.test(bank) && bank.length > 12 && bank.length <= 19) {
        this.bankcodeTip = false;
      } else {
        this.bankcodeTip = true;
      }
    },
    //获取验证码
    getPhoneCode() {
      //获取短信验证码
      var _this = this;
      const TIME_COUNT = 59;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.isDisable = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            clearInterval(this.timer);
            this.timer = null;
            this.isDisable = false;
          }
        }, 1000);
        //手机验证码接口
        this.$api.sendSmsCode(
          this.phoneNum,
          2,
          function (err, res) {
            if (err) {
              uni.showToast({
                icon: "none",
                title: err.msg,
              });
            } else {
              console.log(res, "获取手机验证码完成");
            }
          },
          false
        );
      }
    },
    submit() {
      if (!this.bankData.name) {
        this.showToast(this.$t('请选择银行'));
        return;
      }
      if (!this.bankData.account) {
        this.showToast(this.$t('请输入账户姓名'));
        return;
      }
      if (!this.bankData.branch && this.bankCodeName === this.$t('数字货币')) {
        this.showToast(this.$t('请输入ERC20或TRC20'));
        return;
      }
      if (this.bankData.branch.trim() == "" && this.bankCodeName === this.$t('数字货币')) {
        this.showToast(this.$t('请输入ERC20或TRC20'));
        return;
      }
      if (!this.bankData.branch) {
        this.showToast(this.$t('请输入支行名称'));
        return;
      }
      if (this.bankData.branch.trim() == "") {
        this.showToast(this.$t('请输入支行名称'));
        return;
      }
      if (!this.bankData.number && this.bankCodeName === this.$t('数字货币')) {
        this.showToast(this.$t('请输入钱包地址'));
        return;
      }
      if (!this.bankData.number) {
        this.showToast(this.$t('请输入卡号'));
        return;
      }
      // if (this.bankcodeTip) {
      //   return;
      // }
      var banknum = this.bankData.number.replace(/\s*/g, ""); //去除空格
      var data = {
        account: this.bankData.account, //	银行卡账户名
        branch: this.bankData.branch, //	支行
        memberId: this.memberId, //	会员id
        name: this.bankData.name, //	银行名称
        number: banknum, //卡号
        phone: this.phoneNum, //手机号
				smsCode: this.smsNum, //验证码
        // #ifdef H5
        clientItem: window.childCode, //子平台id字段
        // #endif
        // #ifdef APP-PLUS
        clientItem: this.$config.childCode, //客户端id字段
        // #endif
        type: 1,
      };
      this.successBtn = true;
      const self =this
      this.$api.addbankcard(data, (err, res) => {
        console.log("添加银行卡", err, res);
        this.successBtn = false;
        if (err) {
          uni.showModal({
            title: self.$t('提示'),
            content: err.msg + "(" + err.code + ")",
            confirmText: self.$t('重新添加'),
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log("用户点击确定");
              }
            },
          });
        }
        if (res) {
          uni.navigateBacks();
          uni.showToast({
            title: self.$t('添加成功'),
            duration: 2000,
            position: "center",
          });
        }
      });
    },
    onBindPhone() {
      this.$api.updateInfo(null, null, null, null, this.bankData.phone, null, null, null, this.memberId, null, (err, res) => {});
    },
    //父组件接收子组件
    onchildFn(e) {
      if (e == 200 || e == 100) {
        uni.navigateBacks();
      } else if (e == 400) {
        uni.navigateTo({
          url: "../Personal/Personal",
        });
      } else if (e == 500) {
        uni.navigateTo({
          url: "../upPassword/upPassword?type=2&isPassWord=false",
        });
      }

      this.modeldata.isShow = false;
    },
    showPasswoid() {
      this.Ispassword = !this.Ispassword;
    },
    getbank(e) {
      this.bankCodeName = e.name;
      this.bankData.name = e.name;
      this.bankImg = this.$config.getImgUrl(e.imgUrl);
      // this.option.bank_id = e.id;
      this.card_num = e.number;

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
    BackPage() {
      uni.navigateBacks({});
    },
    //打开选择银行卡弹框
    onSetBank() {
      this.$refs.popup.open();
    },
    onClosePopup() {
      this.$refs.popup.close();
    },
    handlePopupChange({show}){
      if (!show && this.bankList.length === 0) {
        this.keyword = ''
      }
    }
  },
  watch: {
    ['bankCodeName'](){
      const self =this
      if(this.bankCodeName == this.$t('数字货币')){
        this.smsShow = this.bind_usdt_sms == 1 ? true : false;
      }else{
        this.smsShow = this.bind_sms == 1 ? true : false;
      }
      if (this.smsShow && !this.phoneNum) {
        uni.showModal({
          title: self.$t('提示'),
          content: self.$t('请您前往绑定手机号'),
          confirmText: self.$t('确定'),
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/personal/personal",
              });
            } else {
              console.log('else', res)
            }
          },
        })
        return
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-header {
  background: #ffffff;
  display: flex;
  justify-content: end;
  padding: 25rpx 10rpx;
  border-bottom: 1px solid #f5f6f8;

  .header-title {
    flex-grow: 2;
    text-align: center;
  }

  .closeImg {
    width: 40rpx;
    height: 40rpx;
    vertical-align: middle;
    // float: right;
  }
}

.padding-xl {
  padding: 0px;
  background: #ffffff;

  .scroll-Y {
    height: 300px;
    padding: 0px 15px;
  }

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

.addBankPage {
  background: #f8f8f8;
  height: 100%;
}

.conent {
  border-top: 1px solid #f5f6f8;
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
  display: flex;
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
  .verifyCode {
    // width: 228rpx;
    // height: 88rpx;
    background-size: 100% 100%;
    border-radius: 10rpx;
  }
  .disabledPhone {
    position: absolute;
    right: 180upx;
  }
  .themeColor {
    position: absolute;
    right: 80upx;
    font-size: 28upx;
    color: #ebcc45;
  }
}

.submit-view {
  width: 90%;
  position: fixed;
  left: 5%;
  bottom: 3%;
}

.but-submit {
  background: #ebcc45;
  // color: #484440;
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
.bank-search{
  position: relative;
  height: 100rpx;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  &__input{
    border:2rpx solid #eee;
    height: 80rpx; 
    padding: 0 70rpx;
    font-size: 28rpx;
    border-radius: 40rpx;
  }
  &__empty{
    color:#999
  }
  ::v-deep .uni-input-wrapper {
    padding-left: 0;
  }
  .bank-search_s {
    position: absolute;
    top: 42rpx;
    left: 50rpx;
    width: 36rpx;
    height: 36rpx;
    filter: grayscale(60%);
  }
  .bank-search_e {
    position: absolute;
    top: 42rpx;
    right: 50rpx;
    width: 36rpx;
    height: 36rpx;
  }
  
}
</style>
<style scoped>
@import url("../addBank/index.css");
</style>
