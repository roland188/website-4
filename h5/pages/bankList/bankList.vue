<!-- 
 页面：我的银行卡
 作者：丹泽尔
 -->
<template>
  <view class="bankCardBgBox">
    <uni-nav-bar :title="$t('银行卡/数字货币列表')" leftIcon="back" :status-bar="true" :fixed="true" :shadow="false" @clickLeft="BackPage"></uni-nav-bar>

    <view class="conent">
      <view class="card">
        <view class="header"> {{ $t('我的银行卡/数字货币') }} </view>
        <view class="cu-list menu-avatar">
          <view class="cu-item" v-for="(item, index) in bankList" :key="index">
            <view class="cu-avatar round lg">
              <image v-if="item.type == 2" class="cu-img" src="../../static/image/wallet.png" mode="widthFix"></image>
              <image v-else class="cu-img" :src="$config.getImgUrl(item.imgUrl)" mode="widthFix"></image>
            </view>
            <view class="content">
              <view class="title-text themeTextOne oneTitleColor8" v-if="item.type == 2"> {{$t('origo钱包')}}({{ item.branch }})</view>
              <view v-else class="title-text themeTextOne oneTitleColor8"
                >{{ item.name }}{{ item.type === 1 ? "(" + item.branch + ")" : "" }}</view
              >
              <view class="text-sm title-code themeTextTwo">
                {{ item.number | banknumber }}
              </view>
            </view>
          </view>
        </view>
        <view class="" v-if="bankList.length == 0">
          <view class="img-null">
            <!-- <image :src="$config.themeImgUrl('n1')" mode="widthFix"></image><br> -->
            <text>{{ $t('这里空空的什么都没有') }}</text>
          </view>
        </view>

        <view class="add-card" v-if="bankCardList.length <= bankCountNumber || usdtList.length < usdtCountNumber">
          <view class="add-card-btn" @click="onAddCard">
            <!-- <image src="../../static/image/dzr/add.png" class="add-card-img"></image> -->
            <text class="add-card-text">{{ $t('添加收款方式') }}</text>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="popup" type="bottom">
      <view class="p-centent">
        <view class="item line" v-if="bankCardList.length <= bankCountNumber" @click="addGetMoney(0)"> {{ $t('添加银行卡') }} </view>
        <view class="item line" v-if="usdtList.length <= usdtCountNumber" @click="addGetMoney(1)"> {{ $t('添加数字货币')  }} </view>
        <!-- <view class="item line" @click="addGetMoney(2)"> 添加origo钱包 </view> -->
        <view class="item" @click="addGetMoney(3)"> {{ $t('取消') }} </view>
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
  filters: {
    banknumber(val) {
      return val.substr(0, 4) + " **** **** " + val.substr(-4);
    },
  },
  data() {
    return {
      showPicker: false,
      bankList: [],
      listTouchStart: 0,
      listTouchDirection: null,
      modalName: null,
      modeldata: "",
      yuanFlag: false,
      text: this.$t('全选'),
      all: false,
      removeList: [],
      bankId: "",
	  bankCountNumber: 0, // 可绑定的银行卡数量
      usdtCountNumber: 0, // 可绑定的数字货币数量
      bankCardList: [], // 已绑定的银行卡
      usdtList: [], // 已绑定的数字货币
    };
  },
  onShow() {
    this.getbanklist();
	this.getCardCount();
  },
  methods: {
		getCardCount() {
			this.$api.getRegisterSet('withdraw_open', (err, res) => {
				this.bankCountNumber = res.svalue.bank_card_count; // 可绑银行卡数量
				this.usdtCountNumber = res.svalue.digit_money_count; // 可绑数字货币数量
			})
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
      this.$refs.popup.close();
      // }
    },
    allClick() {
      this.all = !this.all;
      if (this.all) {
        this.bankList.map((item) => {
          item.select = true;
          this.removeList.push(item.id);
        });
      } else {
        this.bankList.map((item) => {
          item.select = false;
          this.removeList = [];
        });
      }
    },
    //获取银行卡列表
    getbanklist() {
      this.$api.getbankcardlist((err, res) => {
        this.bankList = res;
        this.bankCardList = res.filter(item => { return item.type == 0});
        this.usdtList = res.filter(item => { return item.type == 1});
      });
    },
    onAddCard() {
      // this.showPicker = true;
      this.$refs.popup.open();
    },
    onpages(item) {
      uni.navigateTo({
        url: "../drawing/drawing?id=" + item.id + "&name=" + item.name + "&number=" + item.number,
      });
    },
    //多选删除
    removeall() {
      if (this.removeList.length > 0) {
        this.modeldata = {
          content: this.$t('是否确认删除？'),
          isShow: true,
          types: 1,
          showCancel: true,
          cancelText: this.$t('取消'),
          confirmText: this.$t('删除'),
          remove: true,
          success: 300,
        };
      }
    },
    remove(id) {
      this.bankId = id;
      this.modeldata = {
        content: this.$t('是否确认删除？'),
        isShow: true,
        types: 1,
        showCancel: true,
        cancelText: this.$t('取消'),
        confirmText: this.$t('删除'),
        remove: true,
        success: 400,
      };
    },
    removeFull() {
      this.$api.deleteBankid(this.bankId, (err, res) => {
        if (err) {
          this.modeldata = {
            content: err.msg,
            isShow: true,
            icon: 1,
            types: 1,
            showCancel: false,
            confirmText: this.$t('确定'),
            success: 200,
          };
        }
        if (res) {
          uni.showToast({
            title: this.$t('删除成功'),
            duration: 2000,
            position: "center",
          });
          this.getbanklist();
        }
      });
    },
    //父组件接收子组件
    onchildFn(e) {
      const self =this
      if (e == 300) {
        let parem = "";
        this.removeList.forEach((i) => {
          parem += i + "&ids=";
        });
        this.$api.deleteBankids(parem, (err, res) => {
          this.yuanFlag = false;
          if (err) {
            uni.showModal({
              title: self.$t('提示'),
              content: err.msg,
              showCancel: false,
              confirmText: self.$t('重新添加'),
              success: function (res) {
                if (res.confirm) {
                  console.log("用户点击确定");
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              },
            });
          } else {
            this.getbanklist();
            uni.showToast({
              title: self.$t('删除成功'),
              duration: 2000,
              position: "center",
            });
          }
        });
      } else if (e == 400) {
        this.removeFull();
      }
      this.modeldata.isShow = false;
    },

    listMe(list, type) {
      return list.filter(function (item) {
        return item.type == type;
      });
    },
    // 添加提款方式
    addAccout(type) {
      const self = this
      let bankListArr = this.listMe(this.bankList, 0);
      if (bankListArr.length >= 3) {
        uni.showToast({
          icon: "none",
          title: self.$t('您最多只能绑3张银行卡！如需调整，请联系客服！'),
        });
        return;
      }
      uni.navigateTo({
        url: "../addCard/addCard",
      });
    },
    BackPage() {
      uni.navigateBacks({});
    },
  },
};
</script>
<style scoped>
/* @import url('../../components/yu-datetime-picker/yu-datetime-picker.css'); */
</style>
<style lang="scss" scoped>
.bankCardBgBox {
  background: #f8f8f8;
  .cu-list.menu-avatar>.cu-item {
    justify-content: flex-start;
    height: auto;
    >.cu-avatar {
      position: relative;
      left: 0;
    }
    .content {
      flex: 1;
      position: relative;
      left: auto;
      margin-left: 20upx;
    }
  }
  .card {
    margin: 15px;
    background-color: #fff;
    border-radius: 8px;
    padding: 2px;
    padding-bottom: 15px;
    .header {
      background-color: #ebcc45;
      padding: 10px 15px;
      color: #1f1f1f;
      font-size: 15px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
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

.title-img {
  flex-grow: 1;
  text-align: center;
}

.title-img image {
  width: 40px;
  height: 40px;
  vertical-align: text-top;
}

.code-name-code {
  flex-grow: 6;
  line-height: 1.5;
}

.title-code {
  font-size: 34rpx;
  color: #484440;
}

.title-text {
  font-size: 32rpx;
  color: #484440;
}

.img-null {
  text-align: center;
  margin: 40px 0px;
}

.img-null image {
  width: 528rpx;
  height: auto;
}

.img-null text {
  font-size: 28rpx;
  font-family: PingFangSC;
  font-weight: 400;
  color: rgba(138, 137, 137, 1);
  line-height: 38rpx;
}

.add-card {
  text-align: center;
  margin-top: 20rpx;
  // position: fixed;
  // width: 100%;
  // left: 0%;
  // bottom: 0%;
  .disabledBtn {
    background-color: var(--btnDisColor);
  }
}
.add-card-btn {
  border-radius: 60rpx;
  height: 80rpx;
  line-height: 70rpx;
  font-size: 30rpx;
  width: 90%;
  margin-left: 5%;
  background: #ebcc45;
  color: #1f1f1f;
}

.add-card-text {
  // color: #000;
  font-size: 28rpx;
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
}

.add-card-img {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}

.mycardtext {
  font-size: 30rpx;
  font-family: PingFangSC;
  font-weight: 400;
  color: rgba(72, 68, 64, 1);
  line-height: 43rpx;
  margin: 19rpx 0px 0px 34rpx;
  display: block;
}

.cu-item {
  // border-bottom: 14rpx solid #F6F5F8;
  padding: 36upx 16upx;
  margin-top: 20upx;
  border-radius: 18upx;
  display: flex;
  align-items: center;
  position: relative;
  .cu-avatar {
    width: 96upx;
    height: 96upx;
    background-color: #fff;
    box-shadow: 0px 6upx 12upx rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
}
</style>
