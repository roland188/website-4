<template>
  <view class="pageBackground">
    <uni-nav-bar
      :title="$t('充值')"
      leftIcon="back"
      :status-bar="true"
      :fixed="true"
      color="#fff"
      :shadow="false"
      @clickLeft="BackPage"
    ></uni-nav-bar>
    <!-- 转账方式 -->
    <view class="bgImg">
      <!-- <text class="name-ck padding setMoneyColor">请选择付款方式：</text> -->
      <view class="model-box">
        <view
          class="model-name"
          v-for="item of modelNames"
          :key="item.id"
          @click="onTabs(item.id)"
          :class="{ modelActity: item.id == modelIndex }"
        >
          <view class="">
            {{ item.name }}
          </view>
          <view class="bg-actiter" v-if="item.id == modelIndex"></view>
        </view>
      </view>
      <view class="felx-money">
        <view
          class="money-mode-card-bai "
          :class="index == avited_class ? 'borderCardActive' : 'borderCard-1'"
          v-for="(item, index) of paymentList"
          :key="index"
          @click="onChaneMoney(index, item)"
        >
          <view class="jiaobiao" v-if="item.scale > 0">
            <text class="jiaobiao-text"
              >{{ $t('赠送') + item.scale * 100 }}%</text
            >
          </view>
          <view
            class="money-mode-card"
            :class="index == avited_class ? 'money-mode-avited' : ''"
            v-bind:style="
              index == avited_class
                ? { backgroundImage: 'url(../../static/image/bgActive.png)' }
                : ''
            "
          >
            <view style="line-height: 1">
              <image
                :src="$config.getImgUrl(item.icon)"
                mode="aspectFit"
                class="money-mode-img"
              ></image>
            </view>
            <text class="money-mode-text">{{ item.name }}</text>
          </view>
        </view>
        <!-- <view
          class="money-mode-card-bai"
          :class="index == avited_class ? 'borderCardActive' : ''"
          v-for="(item, index) of listPayWays.offline"
          :key="index"
          @click="onChaneMoney(index, item)"
        >
          <view class="jiaobiao" v-if="item.scale > 0">
            <text class="jiaobiao-text"
              >{{ $t('赠送') + item.scale * 100 }}%</text
            >
          </view>
          <view
            class="money-mode-card"
            :class="index == avited_class ? 'money-mode-avited' : ''"
            v-bind:style="
              index == avited_class
                ? { backgroundImage: 'url(../../static/image/bgActive.png)' }
                : ''
            "
          >
            <view style="line-height: 1">
              <image
                :src="$config.getImgUrl(item.icon)"
                mode="aspectFit"
                class="money-mode-img"
              ></image>
            </view>
            <text class="money-mode-text">{{ item.name }}</text>
          </view>
        </view> -->
      </view>
      <view class="null-card" v-if="paymentList.length == 0">
        <image
          src="../../static/image/mb/null-data.png"
          class="null-img"
          mode="widthFix"
        ></image>
        <view class="null-text"> {{ $t('暂时没有该存款方式') }} </view>
      </view>
    </view>
    <view class="contentPadding" v-if="paymentList.length > 0">
      <!-- 充值通道 -->
      <view class="bordertop" v-if="indexMoney != 'union'">
        <text class="name-ck themeTextOne drawingText">{{
          $t('充值通道')
        }}</text>
        <view class="radio-card">
          <view
            class="last-tiem"
            v-for="(item, index) in paymentWay"
            :key="index"
            @click="radioChange(index)"
          >
            <image
              src="../../static/image/checked.png"
              v-if="index == radioindex"
              class="radioimg"
              mode=""
            ></image>
            <image
              src="../../static/image/unCheck.png"
              v-if="index != radioindex"
              class="radioimg"
              mode=""
            ></image>
            <text :class="{ themeColor: index == radioindex }">{{
              item.name
            }}</text>
            <!-- <text>{{avited_class != 5 ?item.name : item.paytype}}</text> -->
          </view>
        </view>
      </view>

      <!-- 银行转账 -->
      <view class="bordertop" v-if="indexMoney == 'union'">
        <view class="">
          <text class="selectbanktitle themeTextOne drawingText"
            >{{ $t('选择银行') }}：</text
          >
          <view class="cu-item arrow" @click="onSetBank">
            <view class="text-space">
              <!-- <image :src="bankImg" v-if="bankImg" class="png" mode="aspectFit"></image> -->
              <text class="bankname">{{ bankCodeName }}</text>
              <image
                src="../../static/image/more.png"
                class="right-more"
                mode=""
              ></image>
            </view>
          </view>
        </view>
      </view>
      <view
        class="bordertop newFlexBox"
        v-if="online == 1 && indexMoney != 'currency'"
        style="padding-bottom: 0"
      >
        <view class="flex-item">
          <text class="name-ck">{{ $t('充值姓名') }}</text>
        </view>
        <view class="" style="margin-top: 4px">
          <view class="text-space inputNew">
            <input
              type="text"
              :placeholder="$t('请输入存款姓名')"
              placeholder-class="placeholder"
              v-model="bankname"
            />
          </view>
          <text class="text-space tipscolor">{{ $t('未及时到账，请务必输入正确的存款姓名') }}</text>
        </view>
      </view>

      <!-- 存款金额 -->
      <view
        class=""
        :class="
          indexMoney != 'union' && !online && currency != 'currency'
            ? 'bordertop'
            : ''
        "
      >
        <view
          class="bordertop newFlexBox"
          v-if="!input_money && currency != 'currency' && currency != 'vip'"
        >
          <view class="" style="margin-top: 4px">
			<!--  <view class="flex-item">
			   
			  </view> -->
            <view class="inputNew newFlexBox">
			  <text class="name-ck">{{ $t("充值金额") }}</text>
              <view class="rmb-text"> {{ $config.currency }} </view>
              <input
                class="uni-input1"
                cursor-spacing="0"
                type="number"
                v-model="money"
                :placeholder="$t('请输入存款金额')"
                placeholder-class="placeholder"
                @input="onInputMoney"
              />
            </view>
            <!-- <text v-if="moneyList.length == 2" class="text-space tipscolor"
              >{{ $t('单笔最低入款金额') }}{{ moneyList[0]
              }}{{
                $t('元，最高入款金额') + moneyList[1] + $t('元')
              }}</text
            > -->
            <view class="tipBox">
              <view>= {{ $common.setNumVnd(money, 1000) }} VND</view>
              <view>
                <view>{{ $t('手续费') }}：0</view>
                <view>{{ serviceFeeRate.toFixed(2) + '%'}} = {{ $common.setNumVnd((serviceFeeRate/100 * money), 1000) }} VND</view>
              </view>
              <view>
                <view>{{ $t("实际入款") }}：{{ money }}</view>
                <view>= {{ $common.setNumVnd((money - (serviceFeeRate/100 * money)), 1000) }} VND</view>
              </view>
            </view>
          </view>
        </view>
        <view
          class=""
          v-if="input_money && currency != 'currency' && currency != 'vip'"
        >
          <text class="name-ck">{{ $t('充值金额') }}：</text>
          <view class="box">
            <view
              class="item"
              v-for="(item, index) of moneyList"
              :key="index"
              @click="onMoneyselect(index)"
              :class="index == money_select ? 'gameListActive' : 'themeTextTwo'"
            >
              <text>{{ $config.currency }}{{ item }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 提示信息 -->
      <!-- 		<view class="tips-text" v-if="moneyList.length == 2">
			<text>
				温馨提醒：\n 1.单笔最低入款金额{{moneyList[0]}}元，最高入款金额{{moneyList[1]}}元</text>
		</view> -->
      <view class="tips-text" v-if="currency === 'currency'">
        <view class="tipTopTitle"> {{ $t('温馨提示') }}： </view>
        <view class="tipUl">
          <view class="tipLi"> {{ $t('1.请注意页面显示的最小转账额度，小于最小充值金额的充值将不会上账且无法退回；') }} </view>
          <view class="tipLi">
            {{ $t('2.您充值至上述地址后，需要整个网络节点的确认，请耐心等待，我们收到数字货币后会立即向您的账户上账对应金额，若长时间未收到，可联系客服咨询') }}
          </view>
          <view class="tipLi"> {{ $t('3.转账时请务必核对币种以及链名称，若提交错误资产不可找回。') }} </view>
          <view class="tipLi">{{ $t('4.页面显示汇率只供参考，由于汇率存在波动，上账时将根据最新的汇率比例进行计算。') }}</view>
        </view>
      </view>

      <view
        class="cu-modal bottom-modal"
        :class="{ show: isselectbank }"
        @tap="hideModal()"
      >
        <view class="cu-dialog">
          <view class="cu-bar bg-white justify-end">
            <view class="content">{{ $t('选择银行') }}</view>
            <view class="action" @tap="hideModal()">
              <text class="cuIcon-close text-bank"></text>
            </view>
          </view>
          <view class="padding-xl">
            <view
              class="view-list"
              v-for="(item, index) in unionList"
              :key="index"
              @click="radioChangeBank(item, index)"
            >
              <text class="radio-item-text">{{ item.name }}</text>
              <image
                src="../../static/image/select2.png"
                v-show="index == currentUnion"
                class="radio-item-img-activty"
                mode=""
              ></image>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 100px"></view>

      <view class="but-submit rechargeBtn">
        <button
          class="but-next themeBtn gameListActive"
          v-if="indexMoney != 'union'"
          @click="onNextStep"
        >
          {{ $t('确认充值') }}
        </button>
        <button
          class="but-next themeBtn gameListActive"
          v-if="indexMoney == 'union'"
          @click="onNextStep"
        >
          {{ $t('下一步') }}
        </button>
        <view v-if="currency == 'currency' && sellrate" class="btn-hui">
          1USDT≈{{ sellrate }} {{ $config.currency }}
        </view>
      </view>
    </view>
    <!-- 充值需先验证手机-->
    <uni-popup ref="verify_popup" type="center">
      <view class="verify-wrap">
        <view class="phone-card" @tap.stop>
          <view class="">
            <view class="header">
              <text class="">{{ $t('充值需先验证手机') }}</text>
              <image
                src="../../static/image/close.png"
                class="close-img"
                @click="onClosePup"
              ></image>
            </view>
            <view class="conent">
              <view class="phone-box">
                <view class="input-p-box">
                  <input
                    type="text"
                    maxlength="11"
                    :disabled="phoneDisab"
                    class="phone-input"
                    v-model="whetherPhone"
                    :placeholder="$t('请输入手机号')"
                  />
                </view>
              </view>

              <view class="code-box">
                <view class="code">
                  <input
                    type="number"
                    class="phone-input"
                    v-model="verify_code"
                    :placeholder="$t('请输入验证码')"
                  />
                </view>
                <button
                  class="code-time"
                  :class="{ 'time-text': disabledBut }"
                  :disabled="disabledBut"
                  @click="getPhoneCode"
                >
                  {{ code_text }}
                </button>
              </view>
            </view>
            <view class="btn-sub" @click="onSubmit">
              {{ $t('确定') }}
            </view>
            <view class="tips">{{ $t('手机号有误?请联系客服修改') }}</view>
          </view>
        </view>
      </view>
    </uni-popup>
    <!-- <tips v-bind:msg="modeldata" @childFn="onchildFn"></tips> -->
  </view>
</template>

<script>
import cache from "../../utils/cache.js";
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
let newTimeVer = null;
export default {
  components: {
    uniNavBar,
  },
  filters: {
    subtrings(cardnum) {
      if (cardnum) {
        return (
          "(" + cardnum.substring(cardnum.length - 4, cardnum.length) + ")"
        );
      } else {
        return "";
      }
    },
  },
  data() {
    return {
      paymentList: [], //付款方式数组
      paymentWay: [], //付款通道数组
      paymentWayitem: "",
      indexMoney: 0, //选中的付款方式
      avited_class: null, //判断选中付款方式
      money: "", //输入金额
      onSuccess: false,
      moneyList: "", //固定金额数组
      radioindex: 0, //选中付款通道
      input_money: false, //是否显示输入金额输入框
      money_select: Number, //选中金额
      remark: "",
      isselectbank: false, //是否打开选择银行卡
      bankCodeName: this.$t('请选择银行卡'),
      unionList: [], //银行卡数组
      card_num: "",
      bankImg: "",
      currentUnion: null,
      bankname: "",
      modeldata: "",
      online: 0,
      onlineRemark: "",
      sellrate: 7.02,
      zhuanSellrate: 0,
      digitCcy: "", //币种
      digitLink: "", //链路
      currency: "",
      opacityHeight: 0,
      startTop: 0,
      refresh: null,
      modelNames: [],
      terminal: 0,
      listPayWays: {},
      modelIndex: 0,
      code_text: this.$t('获取验证码'),
      whetherPhone: "",
      verify_popup: false,
      disabledBut: false,
      verify_code: "", // 验证码
      bindPhone: "", // 是否綁定手机 0 否 1是
      recharge_sms: 0, // 是否开启短信验证
      phoneDisab: false, // 禁用手机号输入框
      realName: "",
      serviceFeeRate: 0,//手续费率
    };
  },
  watch: {
    //实时监听，判断登录按钮是否解除禁用
    onlineRemark(newVal) {
      console.log(newVal);
    },
  },
  computed: {
    isOffline() {
      let isoff = false;
      if (this.listPayWays.offline && this.listPayWays.offline.length) {
        this.listPayWays.offline.forEach((e) => {
          if (e.channels && e.channels.length) {
            e.channels.forEach((b) => {
              if (b.id == this.paymentWayitem.id) {
                isoff = true;
              }
            });
          }
        });
      }
      return isoff;
    },
  },
  onPageScroll(e) {
    var stop = e.scrollTop;
    if (this.startTop > stop) {
      // console.log("下滑",stop/180);
      this.opacityHeight = stop / 180;
    } else {
      // console.log("上滑",stop/180);
      this.opacityHeight = stop / 180;
    }
    this.startTop = stop;
  },
  created() {
    this.getUserInfo();
    this.getRegisterSet();
	uni.getSystemInfo({
	  success: (res)=> {
	    this.pageScrollToS(res.windowHeight);
	  },
	});
    // uni.onWindowResize((res) => {
    //   console.log("变化后的窗口宽度=" + res.size.windowWidth);
    //   console.log("变化后的窗口高度=" + res.size.windowHeight);
    //   this.pageScrollToS(res.size.windowHeight);
    // });
    // uni.getSystemInfo({
    //   success: function (res) {
    //     console.log("==>", res);
    //   },
    // });
  },

  onShow() {
    this.getData();
    let self = this;
	// #ifdef H5
	this._getAppNotSendLatestSuccessRecord()
	// #endif
    this.refresh = setTimeout(function () {
      self.modelIndex = 0;
      self.getData();
    }, 120000);
  },
  onHide() {
    let self = this;
    uni.hideLoading();
  },
  onUnload() {
    console.log("onUnload");
    uni.hideLoading();
    if (this.refresh) {
      clearTimeout(this.refresh);
      this.refresh = null;
    }
  },
  methods: {
	_getAppNotSendLatestSuccessRecord() {
	    // console.log("rechargeComplete:");
	    this.$api._getAppNotSendLatestSuccessRecord({ memberId: this.$server.getUser().user_id },(err, res) => {
			this._getByOrderNo(res.orderNo)
		})
	},
	_getByOrderNo(orderNo){
		this.$api._getByOrderNo({ orderNo },(err, res) => {
			let tags = ["", "first", "second", "third"];
			let tag = tags[res.rechargeTimes];
			if (!tag) {
			  return;
			}
			if(res.rechargeTimes===1){
				if (window.isMaskApp && window.ANDROID_JS_BRIDGE) {
					 window.ANDROID_JS_BRIDGE.first_recharge_success(); // adjust埋
					 // window.ANDROID_JS_BRIDGE.Purchase(); // 脸书埋
				  //    window.ANDROID_JS_BRIDGE.purchase()  // 快手埋
				}
			}
			console.log("res==",res)
		})
	},
    // 获取个人信息
    getUserInfo() {
      const userId = cache.get("set_user").user_id;
      this.$api.userInfo(userId, (err, res) => {
        console.log(res);
        this.whetherPhone = res.phone;
        // bindPhone 0 未绑定 1 绑定
        this.bindPhone = res.bindPhone;
        this.realName = res.realName;
        this.bankname = res.realName;
        if (this.whetherPhone) {
          this.phoneDisab = true;
        }
      });
    },
    // 是否开启验证  recharge_sms 0 未开启，1开启
    getRegisterSet() {
      this.$api.getRegisterSet("withdraw_open", (err, res) => {
        if (res && res.svalue) {
          this.recharge_sms = res.svalue.recharge_sms || 0;
        }
      });
    },
    // 关闭验证弹窗
    onClosePup() {
      this.$refs.verify_popup.close();
    },
    // 获取充值验证码
    getPhoneCode() {
      const self = this
      if (this.phoneDisab == false) {
        if (this.whetherPhone == "") {
          uni.showToast({
            icon: "none",
            title: self.$t('请输入手机号'),
          });
          return;
        }
        // if (!/^1[3456789]\d{9}$/.test(this.whetherPhone)) {
        //   uni.showToast({
        //     icon: "none",
        //     title: self.$t('请输入正确的手机号'),
        //   });
        //   return;
        // }
      }
      this.$api.sendSmsCode(this.whetherPhone, 3, (err, res) => {
        if (res) {
          this.disabledBut = true;
          this.code_text = "60S";
          let time = 60;
          let intervalID = setInterval(() => {
            time--;
            this.code_text = time + "S";
            if (time == 0) {
              this.disabledBut = false;
              clearInterval(intervalID);
              this.code_text = self.$t('获取验证码');
              time = 60;
            }
          }, 1000);
          uni.showToast({
            icon: "success",
            title: self.$t('验证码发送成功'),
          });
        } else {
          uni.showToast({
            icon: "none",
            title: res.msg,
          });
        }
      });
    },

    // 验证提交
    onSubmit() {
      const self = this
      if (!this.verify_code) {
        uni.showToast({
          icon: "none",
          title: self.$t('请输入验证码'),
        });
        return;
      } else {
        this.$api.bindPhone(this.whetherPhone, this.verify_code, (err, res) => {
          if (res) {
            this.onClosePup();
            uni.showToast({
              icon: "success",
              title: self.$t('绑定手机号成功'),
              duration: 2000,
            });
            this.getUserInfo();
            this.onNextStep("isRepeat");
          } else {
            uni.showToast({
              icon: "none",
              title: res.msg,
            });
            return;
          }
        });
      }
    },
    onInputMoney(event) {
      if (!/(^[1-9]\d*$)/.test(event.target.value)) {
        let num = event.target.value.split(".");
        console.log("请输入正整数", num, num[0]);
        setTimeout(() => {
          this.money = num[0];
        }, 100);
        return;
      }
    },
    //入款方式切换
    onTabs(i) {
      this.modelIndex = i;
      if (i == 0) {
        if (this.$config.locale == 'vi') {
          this.paymentList = this.listPayWays.online; //公司入款
        } else {
          this.paymentList = this.listPayWays.offline;
        }
      } else if (i == 1) {
          if (this.$config.locale == 'vi') {
        this.paymentList = this.listPayWays.offline;
        } else {
        this.paymentList = this.listPayWays.online; //公司入款
      }
      } else if (i == 2) {
        this.paymentList = this.listPayWays.digit;
      } else if (i == 3) {
        this.paymentList = this.listPayWays.vips;
      }
      this.onChaneMoney(0, this.paymentList[0]);
      this.avited_class = 0;
      if (this.paymentList[0]) {
        this.currency = this.paymentList[0].code;
      }
      this.money_select = 0;
    },
    getData() {
      const self = this
      var data = {
        terminal: 0,
        version: 1,
      };
      this.$api.getPayment(data, (err, res) => {
        console.log("付款方式", err, res);
        if (res) {
          if (this.$config.locale == 'vi') {
            this.modelNames = [
              {
                name: this.$t('线上入款'),
                id: 0,
              },
              {
                name: this.$t('公司入款'),
                id: 1,
              },
            ];
          } else {
            this.modelNames = [
              {
                name: this.$t('公司入款'),
                id: 0,
              },
              {
                name: this.$t('线上入款'),
                id: 1,
              },
            ];
          }
          let routes = getCurrentPages();
          let curRoute = routes[routes.length - 1].route;
          let curUrl = "pages/recharge/recharge";
          if (curRoute == curUrl) {
            this.modifyData(res);
          }
        } else {
          uni.showModal({
            title: self.$t('提示'),
            content: self.$t('当前无充值信息，请联系客服！'),
            confirmText: self.$t('知道了'),
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log("用户点击确定");
                uni.navigateBacks();
              }
            },
          });
        }
      });
    },
    pageScrollToS(top) {
      uni.pageScrollTo({
        scrollTop: top,
        duration: 100,
      });
    },
    modifyData(res) {
      const self = this
      if (res.length == 0) {
        uni.showModal({
          title: self.$t('提示'),
          content: self.$t('当前无充值信息，请联系客服！'),
          confirmText: self.$t('确定'),
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log("用户点击确定");
              uni.navigateBacks();
            }
          },
        });
        return;
      }
	 
      this.listPayWays = res;
      // if(this.listPayWays.offline.length>0){
      // 	this.modelIndex = 0;
      // 	this.paymentList = this.listPayWays.offline;
      // } if(this.listPayWays.online.length>0){
      // 	this.modelIndex = 1;
      // 	this.paymentList = this.listPayWays.online;
      // }
      if (this.listPayWays.digit.length > 0) {
        this.modelNames.push({
          name: this.$t('数字货币'),
          id: 2,
        });
        // this.modelIndex = 2;
        // this.paymentList = this.listPayWays.digit;
      }
      if (this.listPayWays.vips.length > 0) {
        this.modelNames.push({
          name: this.$t('VIP专享'),
          id: 3,
        });
        // this.modelIndex = 3;
        // this.paymentList = this.listPayWays.vips;
      }
      this.avited_class = 0;
      this.currency = "";
      this.money_select = 0;
      this.onTabs(0);
      // this.onChaneMoney(0, this.paymentList[0]);
    },
    //点击付款方式事件
    onChaneMoney(index, item) {
      const self = this
      console.log(index, item);
      if (!item || !item.code) return;
      this.indexMoney = item.code;
      this.avited_class = index;
      this.currency = item.code;
      this.paymentWay = item.channels;
      this.serviceFeeRate = item.serviceFeeRate * 1
      console.log(this.paymentWay);
      this.money = "";
      this.bankname = "";

      if (item.code == "union") {
        //银联
        this.unionList = item.channels;
        this.currentUnion = 0;
        this.paymentWayitem = this.paymentWay[0];
        //onlineRemark
        this.onlineRemark = this.paymentWayitem.remark;
        this.bankCodeName = this.unionList[0].name;
        this.radioChangeBank(this.paymentWayitem, 0);
      } else {
        if (item.code == "currency") {
          let a = self.$t('1.请注意页面提示的最小转账额度，小于最小转账金额的充值将不会上账且无法退回；2.您充值至上述地址后，需要整个网络节点的确认，请耐心等待，我们收到数字货币后会立即向您的账户上账对应金额，若长时间未收到，可联系客服咨询3.转账时请务必核对币种以及链名称，若提交错误资产不可找回。');
          uni.showModal({
            title: self.$t('提示'),
            content: a,
            confirmText: self.$t('知道了'),
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log("用户点击确定");
              }
            },
          });
          this.moneyList = [];
          this.paymentWayitem = this.paymentWay[0];
          this.sellrate = this.paymentWay[0].exchangerate;
        } else {
          this.radioChange(0);
        }
      }
    },
    //点击付款通道事件
    radioChange(index) {
      const self = this
      this.money_select = 0;
      this.radioindex = index;
      this.paymentWayitem = this.paymentWay[index];
      //online为1,线下显示存款姓名
      this.online = this.paymentWayitem.online;
      if (this.online === 1 && this.indexMoney != "currency") {
        this.bankname = this.realName;
      }
      this.onlineRemark = this.paymentWayitem.remark;
      console.log(this.paymentWayitem);
      this.digitCcy = this.paymentWayitem.paytype;
      this.sellrate = this.paymentWayitem.exchangerate;
      if (this.onlineRemark) {
        this.modeldata = {
          content: this.onlineRemark,
          isShow: true,
          types: 1,
          showCancel: false,
          confirmText: self.$t('知道了'),
          success: 10,
        };
        uni.showModal({
          title: self.$t('提示'),
          content: this.onlineRemark,
          confirmText: self.$t('知道了'),
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

      var amountstr = this.paymentWayitem.amount;

      this.input_money = amountstr.indexOf(",") != -1 ? true : false;
      amountstr = amountstr.replace(/\[|]/g, "");
      if (this.input_money) {
        let arr = amountstr.split(",");

        var r = arr.filter(function (s) {
          return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
        });
        this.moneyList = r;
        this.money = this.moneyList[0];
      } else {
        this.money = "";
        this.moneyList = amountstr.split("-");
      }

      this.remark = this.paymentWay[index].remark;
    },
    //点击固定金额
    onMoneyselect(index) {
      this.money_select = index;
      this.money = this.moneyList[index];
    },
    //下一步
    async onNextStep(isRepeat) {
      if (this.currency == "currency") {
      } else {
        if (this.paymentWayitem.paytype == "union") {
          if (!this.bankname) {
            this.showtoast(this.$t('请输入姓名'));
            return;
          }
        }
        if (!this.input_money) {
          var min = parseInt(this.moneyList[0]);
          var max = parseInt(this.moneyList[1]);
          if (this.money < min || this.money > max) {
            this.showtoast(this.$t('金额输入不在范围'));
            return;
          }
        }

        if (this.currency == "vip") {
          console.log(this.paymentWayitem.vendorcode);
          window.open(this.paymentWayitem.vendorcode, "_blank");
          return;
        }

        if (isRepeat != "isRepeat") {
          if (this.recharge_sms == 1 && this.bindPhone == 0) {
            this.$refs.verify_popup.open();
            return;
          }
        }
      }
      let terminal = 0;
      //#ifdef H5
	  let isMaskApp = window.isMaskApp
      // 新版
      maskAppToNative("otpcode");
      //老版
      maskAppOldToNative("otpcode");
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // let isUc = u.indexOf("UCBrowser") > -1;
      if (isAndroid) {
        //这个是安卓操作系统
        terminal = 13;
      }
      if (isIOS) {
        //这个是ios操作系统
        terminal = 14;
      }
      // #endif

      //#ifdef APP-PLUS
      try {
        const res = uni.getSystemInfoSync();
        console.log(res.platform);
        if (res.platform == "ios") {
          terminal = 12;
        } else {
          terminal = 11;
        }
      } catch (e) {
        // error
      }
      //#endif

      var data = {
        money: this.money, //			入款金额
        online: this.paymentWayitem.online, //	支付模式
        channelId: this.paymentWayitem.id, //	充值通道
        payType: this.paymentWayitem.paytype, //	支付方式
        terminal: terminal, //	终端类型 //	终端类型 1.pc端, 11.原生android, 12.原生ios, 13.h5的android, 14.h5的ios
        vendorcode: this.paymentWayitem.vendorcode,
        vendorname: this.paymentWayitem.vendorname,
        vendorNickName: this.paymentWayitem.name,
        transferName: this.bankname,
      };

      let self = this;

      if (this.isOffline && this.paymentWayitem.paytype === "union") {
        // 公司入款用内链跳转
        self.$api.getPaymentNextStep(data, (err, res) => {
          if (err) {
            uni.showModal({
              title: self.$t('提示'),
              content: `${self.$t('该通道不可用请重试！')}(${ err.code})`,
              confirmText: self.$t('知道了'),
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  uni.redirectTo({
                    url: "/pages/recharge/recharge",
                  });
                }
              },
            });
          } else {
          // #ifdef H5
          if (window.isMaskApp && window.ANDROID_JS_BRIDGE) {
            window.ANDROID_JS_BRIDGE.recharge_success(); // adjust埋
            window.ANDROID_JS_BRIDGE.Purchase(); // 脸书埋
            window.ANDROID_JS_BRIDGE.purchase()  // 快手埋
          }
          if(localStorage.getItem('fbPixelId') && window.fbq){
            fbq('trackCustom', 'h5-recharge',{  value: this.money, currency: 'CNY'})
          }
          // #endif  
            console.log("0----充值返回", res.url);
            const query = res.url.split("?")[1];
            uni.navigateTo({
              url: "/pages/bankRecharge/bankRecharge?" + query,
            });
          }
        });
        return;
      }

      // #ifdef H5
	  if(!isMaskApp){
		  localStorage.setItem("waitData", JSON.stringify(data));
		  localStorage.setItem("waitUrl", "");
		  localStorage.setItem("waitForm", "recharge");
		  localStorage.setItem("waitRes", "");
		  const wait = window.open("/pages/wait/wait", "_blank");
		  const timeout = (window.winOpenTime || 6000) / 500;
		  let i = 0;
		  let interval = setInterval(() => {
			i++;
			const waitUrl = localStorage.getItem("waitUrl");
			if (waitUrl) {
			  wait.location.href = waitUrl;
			  localStorage.setItem("waitRes", "1");
			  clearInterval(interval);
			}
			if (i >= timeout) {
			  wait.close();
			  uni.showToast({
				icon: "none",
				title: self.$t('支付加载失败'),
			  });
			  clearInterval(interval);
			}
		  }, 500);
		  setTimeout(() => {
			uni.redirectTo({
			  url: "/pages/recharge/recharge",
			});
		  }, 300);
	  }
      // #endif
	  
		if (!window || isMaskApp) {
		  self.$api.getPaymentNextStep(data, (err, res) => {
			console.log("充值==========", err, res);
			if (err) {
			  uni.showModal({
				title: self.$t('提示'),
				content: `${self.$t('该通道不可用请重试！')}(${self.$t('错误码')}:${err.code})`,
				confirmText: self.$t('知道了'),
				showCancel: false,
				success: function (res) {
				  if (res.confirm) {
					console.log("用户点击确定");
					uni.redirectTo({
					  url: "/pages/recharge/recharge",
					});
				  }
				},
			  });
			} else {
			  cache.set("url", res.url);
			  if (res.url.includes("weixin://")) {
				  // #ifdef H5
				  window.location.href  = res.url
				  // #endif 
				  // #ifdef APP-PLUS  
					plus.runtime.openURL(res.url);
				  // #endif
			  } else {
				// #ifdef H5
				if (window.isMaskApp && window.ANDROID_JS_BRIDGE) {
					 window.ANDROID_JS_BRIDGE.recharge_success(); // adjust埋
					 window.ANDROID_JS_BRIDGE.Purchase(); // 脸书埋
					 window.ANDROID_JS_BRIDGE.purchase()  // 快手埋
				}
				if(window.isMaskApp){
					window.location.href  = res.url
				}
				// #endif 
				// #ifdef APP-PLUS   
				setTimeout(() => {
				  uni.navigateTo({
					url: "../webView/webView?url=" + 1,
				  });
				}, 500);
				// #endif
			  }
			}
		});
	  }
    },

    //打开选择银行卡
    onSetBank() {
      this.isselectbank = true;
    },
    //子组件事件
    getprod(e) {
      if (e == 1) {
        this.onSuccess = !this.onSuccess;
      }
    },
    radioChangeBank(item, index) {
      this.currentUnion = index;
      this.bankCodeName = item.name;
      this.radioChange(index);
      this.hideModal();
    },
    hideModal() {
      console.log("关闭====", this.isselectbank);
      this.isselectbank = false;
    },
    onchildFn(e) {
      console.log(e);
      if (e === 200) {
        uni.navigateBacks();
      } else if (e === 12) {
        uni.redirectTo({
          url: "/pages/recharge/recharge",
        });
      } else {
        this.modeldata.isShow = false;
      }
    },
    showtoast(titel) {
      uni.showToast({
        title: titel,
        icon: "none",
        position: "center",
        duration: 2000,
      });
    },
    BackPage() {
      if (this.refresh) {
        clearTimeout(this.refresh);
        this.refresh = null;
      }
      uni.navigateBacks({});
    },
  },
};
</script>
<style lang="scss" scoped>
.verify-wrap {
  width: 600upx;

  .phone-card {
    background-color: #ffffff;
    // width: 80%;
    border-radius: 16upx;
    // margin-left: 10%;

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

        .code {
          margin-right: 20rpx;
        }

        .code-text {
          color: #fff;
          font-size: 22rpx;
        }

        .code-time {
          // width: 150upx;
          color: #fff;
          font-size: 26upx;
          border-radius: 8rpx;
          text-align: center;
          background: linear-gradient(to bottom, #cfa65f, #eac27c);
        }

        .time-text {
          color: #f1ebeb;
        }
      }

      .phone-input {
        background-color: #f7f7f7;
        border-radius: 18rpx;
        height: 70rpx;
        text-align: left;
        padding-left: 10px;
        line-height: 70rpx;
        font-size: 24rpx;
      }

      .errText {
        font-size: 22rpx;
        color: #ff5e5e;
        margin: 15rpx 0px;
      }
    }

    .btn-sub {
      font-size: 30rpx;
      margin: 54rpx 130rpx 20rpx;
      padding: 12rpx;
      color: #fff;
      border-radius: 8rpx;
      text-align: center;
      background: linear-gradient(to bottom, #cfa65f, #eac27c);
    }

    .tips {
      text-align: center;
      font-size: 24upx;
      opacity: 0.7;
      padding-bottom: 20upx;
    }
  }
}
</style>
<style>
@import url("./recharge.css");
</style>
