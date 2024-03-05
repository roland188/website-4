<template>
  <div class="add-money-alert">
    <div>
      <div class="deposit-lesson" v-if="window.projectImgUrl == 'funw'" @click="showDepositLesson">{{ $t('充值教程') }}</div>
      <el-row>
        <el-col>
          <!-- 威尼斯人做特殊处理 -->
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane :label="$t('线上入款')" name="1"  v-if="listPayWays.online.length > 0">
              <ul class="box-card-mode justify-content">
                <li
                  class="box-items cursorPoint"
                  v-for="(item, index) in listPayWays.online"
                  :key="index"
                  @click="onSelectMoneyMode(index, item)"
                  :class="[index == selectMoneyMode ? 'money-mode-avited' : '']"
                >
                  <el-image
                    v-if="item.scale && item.scale != 0"
                    class="scaleImg"
                    :src="require('../../assets/image/jiaobiao_bg_pc.png')"
                  ></el-image>
                  <p v-if="item.scale && item.scale != 0" class="scale-text">
                    {{ `${$t('赠送')}${item.scale * 100}%` }}
                  </p>
                  <el-image
                    class="money-type-img"
                    :src="$common.getImgUrl(item.icon)"
                  ></el-image>
                  <p class="box-item-text">{{ item.name }}</p>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane :label="$t('数字货币存款')" name="0" v-if="listPayWays.offline.length > 0">
              <ul class="box-card-mode justify-content">
                <li
                  class="box-items cursorPoint"
                  v-for="(item, index) in listPayWays.offline"
                  :key="index"
                  @click="onSelectMoneyMode(index, item)"
                  :class="[index == selectMoneyMode ? 'money-mode-avited' : '']"
                >
                  <el-image
                    v-if="item.scale && item.scale != 0"
                    class="scaleImg"
                    :src="require('../../assets/image/jiaobiao_bg_pc.png')"
                  ></el-image>
                  <p v-if="item.scale && item.scale != 0" class="scale-text">
                    {{ `${$t('赠送')}${item.scale * 100}%` }}
                  </p>
                  <el-image
                    class="money-type-img"
                    :src="$common.getImgUrl(item.icon)"
                  ></el-image>
                  <p class="box-item-text">{{ item.name }}</p>
                </li>
              </ul>
            </el-tab-pane>
            <!-- <el-tab-pane
              label="数字货币"
              name="2"
              v-if="listPayWays.digit.length > 0"
            >
              <ul
                class="box-card-mode justify-content"
                v-if="listPayWays.digit.length > 0"
              >
                <li
                  class="box-items cursorPoint"
                  v-for="(item, index) in listPayWays.digit"
                  :key="index"
                  @click="onSelectMoneyMode(index, item)"
                  :class="[index == selectMoneyMode ? 'money-mode-avited' : '']"
                >
                  <el-image
                    v-if="item.scale && item.scale != 0"
                    class="scaleImg"
                    :src="require('../../assets/image/jiaobiao_bg_pc.png')"
                  ></el-image>
                  <p v-if="item.scale && item.scale != 0" class="scale-text">
                    {{ `赠送${item.scale * 100}%` }}
                  </p>
                  <el-image
                    class="money-type-img"
                    :src="$common.getImgUrl(item.icon)"
                  ></el-image>
                  <p class="box-item-text">{{ item.name }}</p>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane
              label="VIP专享"
              name="3"
              v-if="listPayWays.vips.length > 0"
            >
              <ul
                class="box-card-mode justify-content"
                v-if="listPayWays.digit.length > 0"
              >
                <li
                  class="box-items cursorPoint"
                  v-for="(item, index) in listPayWays.vips"
                  :key="index"
                  @click="onSelectMoneyMode(index, item)"
                  :class="[index == selectMoneyMode ? 'money-mode-avited' : '']"
                >
                  <el-image
                    v-if="item.scale && item.scale != 0"
                    class="scaleImg"
                    :src="require('../../assets/image/jiaobiao_bg_pc.png')"
                  ></el-image>
                  <p v-if="item.scale && item.scale != 0" class="scale-text">
                    {{ `赠送${item.scale * 100}%` }}
                  </p>
                  <el-image
                    class="money-type-img"
                    :src="$common.getImgUrl(item.icon)"
                  ></el-image>
                  <p class="box-item-text">{{ item.name }}</p>
                </li>
              </ul>
            </el-tab-pane> -->
          </el-tabs>
        </el-col>
      </el-row>
      <div v-if="moneyModeList.length > 0" style="margin-top: 0rem">
        <el-row class="row-margin" v-if="!unionMode">
          <el-col :span="5">
            <div class="text-align left-text">{{$t('充值通道')}}:</div>
          </el-col>
          <el-col :span="19">
            <div class="text-align">
              <el-radio-group
                v-model="passindex"
                fill="#f8711d"
                @change="onChangePass"
              >
                <div @click="selected">
                  <el-radio
                    v-for="(item, index) in paymentWay"
                    :key="index"
                    :label="index"
                    @change="currency(item)"
                    >{{ item.name }}</el-radio
                  >
                </div>
              </el-radio-group>
              <p
                v-show="currencyCode == 'currency'"
                style="text-align: left; color: #f8711d; font-size: 12px"
              >
                1{{ paytype }}≈{{ exchangeRate }}
              </p>
            </div>
          </el-col>
        </el-row>

        <el-row class="row-margin" v-if="unionMode">
          <el-col :span="5">
            <div class="text-align left-text">{{ $t('选择银行') }}：</div>
          </el-col>
          <el-col :span="19">
            <div class="text-align">
              <el-select
                v-model="selectBankList"
                :placeholder="$t('请选择')"
                class="select-list"
                size="medium"
                @change="onChaneBankList"
              >
                <el-option
                  v-for="(item, index) in paymentWay"
                  :key="item.id"
                  :label="item.name"
                  :value="index"
                  class="select-item"
                >
                  <span style="float: left">
                    {{ item.name }}
                  </span>
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>

        <el-row class="row-margin" v-if="online == 1">
          <el-col :span="5">
            <div class="text-align left-text">{{$t('存款姓名')}}：</div>
          </el-col>
          <el-col :span="19">
            <div class="text-align">
              <el-input v-model="userName" :placeholder="$t('请输入姓名')"></el-input>
              <p class="tips-text themeAssistColorClass"> {{$t('*为及时到账请输入正确的存款人姓名')}}
              </p>
            </div>
          </el-col>
        </el-row>

        <el-row
          class="row-margin"
          v-if="currencyCode != 'currency' && currencyCode != 'vip'"
        >
          <el-col :span="5">
            <div class="text-align left-text">{{ $t('充值金额') }}：</div>
          </el-col>
          <el-col :span="19">
            <div class="text-align">
              <ul class="box-card-mode" v-if="input_money">
                <li
                  class="box-item-money btnUnchecked"
                  v-for="(item, index) in moneyList"
                  :key="index"
                  @click="selectMoney(index)"
                  :class="index == MoneyIndex ? 'themeBtnActive' : ''"
                >
                  <p class="box-item-text">{{ item }}</p>
                </li>
              </ul>
              <div v-if="!input_money">
                <el-input
                  v-model="money"
                  :placeholder="$t('请输入存款金额')"
                  ref="inputs"
                  autofocus="autofocus"
                  onkeypress="return (/[\d]/.test(String.fromCharCdoe(event.keyCode)))"
                >
                  <span slot="append" class="rem-text"></span>
                </el-input>
              </div>
              <p class="tips-text themeAssistColorClass" style="display: flex;flex-direction: column;">
                <span>{{ $t('单笔最低入款金额{x}，最高入款金额{y}', { x: `${$utils._toThousands(minMoney)}`, y: `${$utils._toThousands(maxMoney)}` }) }}</span>
                <span style="margin: 10px 0">{{ $t('1点={x}', { x: `${$utils._toThousands(1000)}` }) }}{{ $t('CNY') }}</span>
                <span v-if="['vi'].includes(window.locale)">
                  = {{ $utils._toThousands(money*1000) }} {{ $t('CNY') }}，
                  {{ $t('手续费：') }} {{ serviceFeeRate.toFixed(2) + '%'}} = {{ $utils._toThousands((serviceFeeRate/100 * money*1000)) }} {{ $t('CNY') }}，
                  {{ $t('实际到账：') }}{{ money }} = 
                  {{ $utils._toThousands(money*1000 - (serviceFeeRate/100 * money*1000)) }} {{ $t('CNY') }}
                </span>
                <span v-if="projectImgUrl==='wbgj' && activeName == 0" @click="handleGoServer" style="font-size: 13px">{{ $t('有问题，请点击联系客服') }}</span>
              </p>
            </div>
          </el-col>
        </el-row>

        <!-- 温馨提醒-->
        <el-row
          class="row-margin"
          style="margin-bottom: 0.08rem"
          v-if="currencyCode == 'currency'"
        >
          <el-col :span="24">
            <div class="left-text remarkName">{{ $t('温馨提示') }}：</div>
            <p class="remarkText">
              1.{{ $t(' 请注意页面显示的最小转账额度，小于最小充值金额的充值将不会上账且无法退回') }}；

            </p>
            <p class="remarkText">
              2.{{ $t('您充值至上述地址后，需要整个网络节点的确认，请耐心等待，我们收到数字货币后会立即向您的账户上账对应金额，若长时间未收到，可联系客服咨询') }}；

            </p>
            <p class="remarkText">
              3.{{ $t('转账时请务必核对币种以及链名称，若提交错误资产不可找回') }}。
            </p>
            <p class="remarkText">
              4.{{ $t('页面显示汇率只供参考，由于汇率存在波动，上账时将根据最新的汇率比例进行计算') }}。
            </p>
          </el-col>
        </el-row>
      </div>
    </div>

    <div v-if="moneyModeList.length > 0" style="margin-top: 0.5rem">
      <el-button
        type="primary"
        class="next-but themeBtn btnBuy"
        v-if="true"
        round
        @click="nextBut"
        >{{ $t('下一步') }}</el-button
      >
    </div>

    <div class="data-null" v-if="!moneyModeListReqSuccess">
      <img loading="lazy" v-lazy="imgNone" alt />
      <p>
        <span>{{ $t('暂时无法充值，如需充值可') }}</span>
        <el-link type="primary" @click="openService">{{ $t('联系客服') }}</el-link>。
      </p>
    </div>

    <!-- <div class="add-bank-div" v-if="moneyModeList.length <= 0">
            <img loading="lazy" :src="imgNone" />
            <p>暂时无法充值，请稍后再试</p>
        </div>-->
    <!-- 驗證碼彈窗 -->
    <el-dialog :visible.sync="isShowSmsCode" width="5.2rem" class="diaLogNote">
      <div slot="title" class="alertHeader dialogHeader">
        <img
          loading="lazy"
          class="cursorPoint dialogClose-header-img"
          :src="require('@/assets/image/gameImg/login-close2.png')"
          @click="hideSmsCode"
        />
        <div class="alertTitle dialogTitles">{{ $t('绑定手机号') }}</div>
      </div>
      <el-row class="row-margin">
        <el-col :span="6">
          <div class="text-align left-text">{{ $t('手机号码') }}：</div>
        </el-col>
        <el-col :span="18">
          <div class="text-align">
            <el-input
              v-if="showPhoneInput"
              v-model="phoneText"
              :disabled="showPhoneInput"
            ></el-input>
            <el-input
              v-else
              v-model="phone"
              maxlength="11"
              :placeholder="$t('请输入手机号码')"
              :disabled="showPhoneInput"
            ></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-margin">
        <el-col :span="6">
          <div class="text-align left-text">{{ $t('验证码') }}:</div>
        </el-col>
        <el-col :span="18">
          <div class="text-align" style="display: flex">
            <el-input
              v-model="smsCode"
              :placeholder="$t('请输入短信验证码')"
            ></el-input>
            <el-button
              type="primary"
              :disabled="codeButDis"
              class="butCode themeBtn btnBuy verPCode"
              @click="getPhoneCode"
              >{{ codeButtext }}</el-button
            >
          </div>
        </el-col>
      </el-row>
      <div
        @click="bindPhone"
        class="confirmNoteStyle themeBtn btnBuy bindPhone"
      > {{ $t('确定') }}

      </div>
    </el-dialog>
    <el-dialog :visible.sync="note" width="4.62rem" class="diaLogNote">
      <div slot="title" class="alertHeader">
        <img
          loading="lazy"
          class="cursorPoint dialogClose-header-img"
          v-lazy="require('@/assets/image/gameImg/login-close2.png')"
          @click="dialogClose"
        />
        <div
          class="alertTitle dialogTitles"
          v-show="currencyCode == 'currency'"
        > {{ $t('温馨提示') }}

        </div>
        <div
          class="alertTitle dialogTitles"
          v-show="currencyCode != 'currency'"
        >
          {{ $t('备注') }}

        </div>
      </div>
      <div class="secondaryPopup">
        <div
          class="contentText currency"
          v-show="currencyCode == 'currency' && !showRemark"
        >
          <p class="remarkText">
            1.{{ $t('请注意页面显示的最小转账额度，小于最小充值金额的充值将不会上账且无法退回') }};

          </p>
          <p class="remarkText">
            2.{{ $t('您充值至上述地址后，需要整个网络节点的确认，请耐心等待，我们收到数字货币后会立即向您的账户上账对应金额，若长时间未收到，可联系客服咨询') }};

          </p>
          <p class="remarkText">
            3.{{ $t('转账时请务必核对币种以及链名称，若提交错误资产不可找回') }}。

          </p>
          <p class="remarkText">
            4.{{ $t('页面显示汇率只供参考，由于汇率存在波动，上账时将根据最新的汇率比例进行计算') }}。
          </p>
        </div>
        <span
          class="contentText"
          v-show="currencyCode != 'currency' || showRemark"
          >{{ onlineRemark }}</span
        >
        <div @click="confirmNote" class="confirmNoteStyle themeBtn btnBuy">

          {{ $t('确定') }}
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="isShowDepost"
      width="70%"
      class="showDepost"
      :close-on-click-modal="false"
    >
      <div class="show-deposit-wrapper" >
        <el-scrollbar style="height:100% ">
        <div class="show-deposit-header" style="height:100%;overflow:auto;">
          <span>{{ $t('存款教程') }}</span>
          <img
            class="deposit-close-img"
            loading="lazy"
            v-lazy="require('@/assets/image/gameImg/login-close2.png')"   
            @click="isShowDepost = false" 
          />
        </div>
        <ul
          class="box-card-mode justify-content"
          v-if="deposLessonArr.length > 0"
        >
          <li
            class="methods-items"
            v-for="item in deposLessonArr"
            :key="item.id"
            @click="changeActivedMode(item.id)"
            :class="[item.id == activedMode ? 'money-mode-avited' : '']"
          >
            <el-image class="methods-items-img" :src="item.url"></el-image>
            <p class="box-item-text">{{ item.title }}</p>
          </li>
        </ul>
        <div class="jjpay-steps" v-if="activedMode == 2" @click="changeSteps">
          <div class="steps">
            <span :class="{ active: isShowSteps == 0 }" data-steps="downLoad"
              >1. {{ $t('下载JJPAY') }}</span
            >
            <img
              data-steps="downLoad"
              src="@/assets/image/wallet/blue-arrow.png"
              alt=""
              v-show="isShowSteps == 0"
            />
          </div>
          <div class="steps">
            <span :class="{ active: isShowSteps == 1 }" data-steps="goAndBuy"
              >2. {{ $t('买币') }}</span
            >
            <img
              data-steps="goAndBuy"
              src="@/assets/image/wallet/blue-arrow.png"
              alt=""
              v-show="isShowSteps == 1"
            />
          </div>
          <div class="steps">
            <img
              class="last-img"
              data-steps="deposit"
              src="@/assets/image/wallet/gray-arrow.png"
              alt=""
              v-show="isShowSteps == 2"
            />
            <span :class="{ active: isShowSteps == 2 }" data-steps="deposit"
              >3. {{ $t('充值') }}</span
            >
          </div>
        </div>
        <div class="show-deposit-steps">
          <img :src="depositSteps[activedMode - 1].url[isShowSteps]" alt="" />
        </div>
      </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      window,
      imgNone: require("../../assets/image/dze/imgNone.png"),
      note: false,
      moneyModeList: [],
      moneyList: [],
      selectMoneyMode: null,
      MoneyIndex: null,
      passindex: null,
      setMoney: "",
      paymentWay: [], //付款通道
      paymentWayitem: "",
      input_money: false,
      money: "",
      selectBankList: "",
      unionMode: false,
      maxMoney: "",
      minMoney: "",
      userName: "",
      phone: "",
      smsCode: "",
      codeButDi: false,
      codeButtext: this.$t('获取验证码'),
      isShowClose: false,
      phoneText: "",
      moneyModeListReqSuccess: true,
      online: 0,
      onlineRemark: "",
      exchangeRate: "", //数字货币存款汇率
      paytype: "", //数字货币名称'
      showRemark: false,
      currencyCode: "",
      winOpen: "",
      refresh: null,
      listPayWays: {
        offline: [],
        online: [],
        digit: [],
        vips: [],
      },
      serviceFeeRate:'',//汇率
      activeName: "1",
      codeButDis: false,
      isShowSmsCode: false,
      rechargeSms: "",
      isBindPhone: "",
      showPhoneInput: false,
      projectImgUrl: window.projectImgUrl,
      realNameState: "",
      isShowDepost: false,
      deposLessonArr: [
        {
          id: 1,
          title: this.$t('GOPay钱包'),
          url: require("@/assets/image/wallet/wallet1.png"),
        },
        {
          id: 2,
          title: this.$t('JJPay钱包'),
          url: require("@/assets/image/wallet/wallet2.png"),
        },
        {
          id: 3,
          title: this.$t('网银转账'),
          url: require("@/assets/image/wallet/wallet3.png"),
        },
        {
          id: 4,
          title: this.$t('支付宝扫码'),
          url: require("@/assets/image/wallet/wallet4.png"),
        },
        {
          id: 5,
          title: this.$t('QQH5'),
          url: require("@/assets/image/wallet/wallet5.png"),
        },
        {
          id: 6,
          title: this.$t('数字钱包'),
          url: require("@/assets/image/wallet/wallet6.png"),
        },
        {
          id: 7,
          title: this.$t('数字货币'),
          url: require("@/assets/image/wallet/wallet7.png"),
        },
      ],
      depositSteps: [
        {
          id: 1,
          url: [require("@/assets/image/wallet/steps.png")],
        },
        {
          id: 2,
          url: [
            require("@/assets/image/wallet/steps1.png"),
            require("@/assets/image/wallet/steps2.png"),
            require("@/assets/image/wallet/steps3.png"),
          ],
        },
        {
          id: 3,
          url: [require("@/assets/image/wallet/steps4.png")],
        },
        {
          id: 4,
          url: [require("@/assets/image/wallet/steps5.png")],
        },
        {
          id: 5,
          url: [require("@/assets/image/wallet/steps6.png")],
        },
        {
          id: 6,
          url: [require("@/assets/image/wallet/steps7.png")],
        },
        {
          id: 7,
          url: [require("@/assets/image/wallet/steps8.png")],
        },
      ],
      activedMode: 1,
      isShowSteps: 0,
    };
  },
  // watch: {
  //     show(newValue, oldValue) {
  //         if (newValue) {
  //             this.getMoneyMode();
  //             this.$nextTick(() => {
  //                 if (this.$refs.inputs) {
  //                     this.$refs.inputs.focus();
  //                 }
  //             });
  //             let self = this;
  //             this.refresh = setInterval(function () {
  //                 self.getMoneyMode();
  //             }, 120000);
  //         } else {
  //             clearInterval(this.refresh);
  //         }
  //     },
  // },
  created() {
    this.projectImgUrl = window.projectImgUrl;
    this.getSmsSetting();
    this.getuserInfo();
    // this.getMoneyMode();
    this.$nextTick(() => {
      if (this.$refs.inputs) {
        this.$refs.inputs.focus();
      }
    });
    let self = this;
    this.refresh = setInterval(function () {
      self.getMoneyMode();
    }, 120000);
  },
  beforeDestroy() {
    clearInterval(this.refresh);
  },
  methods: {
    handleGoServer(){
      let win = window.open()
      win.location.href = this.$common.getCustomerService()
    },
    //绑定手机号
    bindPhone() {
      if (!this.phone) {
        this.$http.showMesasge(this.$t('手机号不能为空')+"！");
        return;
      }
      // if (
      //   this.phone &&
      //   !this.showPhoneInput &&
      //   !/^1[3456789]\d{9}$/.test(this.phone)
      // ) {
      //   this.$message.error(this.$t('手机号格式错误'));
      //   return;
      // }
      if (!this.smsCode) {
        this.$http.showMesasge(this.$t('请输入短信验证码'));
        return;
      }
      let option = {
        phone: this.phone,
        smsCode: this.smsCode,
        codePrefix: this.$config.codePrefix,
      };
      this.$http.post(this.$api.bindPhone, option, true).then((res) => {
        if (res.code == 0) {
          this.$message.success(this.$t('绑定手机号成功'));
          this.getuserInfo();
        } else {
          let msg = res.msg;
          this.$message.error(msg);
        }
      });
    },
    //是否开启手机验证码
    getSmsSetting() {
      this.$http
        .get(this.$api.getSettings, "withdraw_open", false)
        .then((res) => {
          if (res.code == 0) {
            if (res.data.svalue) {
              this.rechargeSms = res.data.svalue.recharge_sms;
            } else {
              this.rechargeSms = "";
            }
          }
        });
    },
    phoneEncode(val) {
      //手机号加密
      if (val) {
        return val.substr(0, 3) + "****" + val.substr(-4);
      } else {
        return "";
      }
    },
    //获取是否绑定手机号
    getuserInfo() {
      this.$http
        .get(
          this.$api.members + "/" + this.$common.getUser().user_id,
          "",
          false
        )
        .then((res) => {
          if (res.code == 0) {
            this.isBindPhone = res.data.bindPhone;
            this.realNameState = res.data.realName;
            this.userName = res.data.realName;
            this.isShowSmsCode = false;
            if (res.data.phone) {
              this.phone = res.data.phone;
              this.phoneText = this.phoneEncode(res.data.phone);
              this.showPhoneInput = true;
            } else {
              this.phone = "";
              this.showPhoneInput = false;
            }
          }
          this.getMoneyMode();
        });
    },
    hideSmsCode() {
      this.isShowSmsCode = false;
      this.smsCode = "";
      this.phone = "";
    },
    //获取验证码
    getPhoneCode() {
      if (!this.phone) {
        this.$message.error(this.$t('请输入手机号'));
        return;
      }
      if (this.phone && !this.showPhoneInput) {
        if (!/^1[3456789]\d{9}$/.test(this.phone)) {
          this.$message.error(this.$t('手机号格式错误'));
          return;
        }
      }
      this.$http
        .get(this.$api.sendSmsCode + "/" + this.phone + `?functionId=3&codePrefix=${this.$config.codePrefix}&codeFlag=1`)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success(this.$t('获取验证码成功'));
            this.codeButDis = true;
            var time = 60;
            this.intervalID = setInterval(() => {
              time--;
              this.codeButtext = this.$t('获取验证码') + "(" + time + ")";
              if (time == 0) {
                this.codeButDis = false;
                clearInterval(this.intervalID);
                this.codeButtext = this.$t('获取验证码');
                time = 60;
              }
            }, 1000);
          } else {
            let msg = res.msg;
            this.$message.error(msg);
          }
        });
    },

    //头部入款方式切换
    handleTabClick() {
      if (this.activeName == 0) {
        this.moneyModeList = this.listPayWays.offline;
      } else if (this.activeName == 1) {
        this.moneyModeList = this.listPayWays.online;
      } else if (this.activeName == 2) {
        this.moneyModeList = this.listPayWays.digit;
      } else if (this.activeName == 3) {
        this.moneyModeList = this.listPayWays.vips;
      }
      this.onSelectMoneyMode(0, this.moneyModeList[0]);
    },
    // 获取汇率
    currency(item) {
      this.exchangeRate = item.exchangerate;
      this.paytype = item.paytype;
    },
    //获取付款方式
    getMoneyMode() {
      var data = {
        terminal: 1,
        version: 4,
      };
      this.$http.post(this.$api.getlistPayWays, data, true).then((res) => {
        if (res.code == 0) {
          this.moneyModeListReqSuccess = true;
          this.listPayWays = res.data;
          if (this.$route.query.method == 0) {
            this.activeName = "0";
            this.moneyModeList = this.listPayWays.offline;
          } else {
            if (this.listPayWays.online.length > 0) {
              this.activeName = "1";
              this.moneyModeList = this.listPayWays.online;
            } else if (this.listPayWays.offline.length > 0) {
              this.activeName = "0";
              this.moneyModeList = this.listPayWays.offline;
            }
          }
          // if(this.projectImgUrl === 'amwnsr' || this.projectImgUrl === 'amxpj' || this.projectImgUrl ==='wbgj'){

          //   // else if (this.listPayWays.digit.length > 0) {
          //   //   this.activeName = "2";
          //   //   this.moneyModeList = this.listPayWays.digit;
          //   // } else if (this.listPayWays.vips.length > 0) {
          //   //   this.activeName = "3";
          //   //   this.moneyModeList = this.listPayWays.vips;
          //   // }
          // } else {
          //   if (this.listPayWays.offline.length > 0){
          //     this.activeName = "0";
          //     this.moneyModeList = this.listPayWays.offline;
          //   } else if(this.listPayWays.online.length > 0) {
          //     this.activeName = "1";
          //     this.moneyModeList = this.listPayWays.online;
          //   } else if (this.listPayWays.digit.length > 0) {
          //     this.activeName = "2";
          //     this.moneyModeList = this.listPayWays.digit;
          //   } else if (this.listPayWays.vips.length > 0) {
          //     this.activeName = "3";
          //     this.moneyModeList = this.listPayWays.vips;
          //   }
          // }

          //默认选中第一个
          this.selectMoneyMode = 0;
          this.onSelectMoneyMode(0, this.moneyModeList[0]);
        } else {
          this.moneyModeListReqSuccess = false;
          this.$message.error(this.$t('加载失败，请重试'));
        }
      });
    },
    selected() {
      if (this.currencyCode == "currency") {
        // this.note = true
        this.showRemark = true;
      }
    },
    //选择付款方式
    onSelectMoneyMode(index, item) {
      if (item.code === "currency" && item.channels.length > 0) {
        this.exchangeRate = item.channels[0].exchangerate;
        this.paytype = item.channels[0].paytype;
        this.showRemark = false;
        this.note = true;
      }

      this.currencyCode = item.code;
      this.selectMoneyMode = index;
      this.paymentWay = item.channels;
      this.serviceFeeRate = item.serviceFeeRate*1
      this.passindex = 0;
      this.MoneyIndex = 0;
      this.money = "";
      if (item.code == "onlineBank") {
        if (!this.realNameState) {
          this.isActualName();
          return;
        }
      }
      if (item.code == "union") {
        this.unionMode = true;
        this.selectBankList = item.channels[0].name;
      } else {
        this.unionMode = false;
      }
      this.onChangePass(0);
    },
    // 网银支付是否绑定真实姓名
    isActualName() {
      this.$confirm(this.$t('请先完善真实姓名，以确保充值及时到账'), this.$t('提示')+'！', {
        confirmButtonText: this.$t('确定'),
        type: "warning",
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false,
      }).then(() => {
        this.$router.push({
          path: "/mcenter/myAccount",
        });
      });
    },
    dialogClose() {
      this.note = false;
      //取消mypage的点击高亮效果
    },
    confirmNote() {
      this.note = false;
    },
    //选择充值通道
    onChangePass(e) {
      this.paymentWayitem = this.paymentWay[e];
      //online为1,线下显示存款姓名
      this.online = this.paymentWayitem.online;
      this.userName = this.realNameState;
      this.onlineRemark = this.paymentWayitem.remark;
      if (this.onlineRemark) {
        this.note = true;
      }
      let amountstr = this.paymentWayitem.amount;
      this.input_money = amountstr.indexOf(",") != -1 ? true : false;
      amountstr = amountstr.replace(/\[|]/g, "");
      if (this.input_money) {
        this.moneyList = amountstr.split(",").filter(function (item) {
          return item && item.trim();
        });
        this.minMoney = this.moneyList[0];
        this.maxMoney = this.moneyList[this.moneyList.length - 1];
        this.money = this.minMoney;
      } else {
        this.moneyList = amountstr.split("-");
        this.minMoney = this.moneyList[0];
        this.maxMoney = this.moneyList[1];
        this.money = "";
      }
      this.MoneyIndex = 0;
    },
    //选择银行卡
    onChaneBankList() {
      this.onChangePass(this.selectBankList);
    },
    //选择金额
    selectMoney(e) {
      this.MoneyIndex = e;
      this.money = this.moneyList[e];
    },
    onBalck() {
      this.$emit("colseAddMoney", 1);
      // this.userName = "";
      this.activeName = "1";
    },
    submitBankInfo() {},
    onCopyResult(type) {
      if (type === "success") {
        this.$message({
          message: this.$t('复制成功'),
          type: "success",
        });
      } else {
        this.$message.error(this.$t('复制失败'));
      }
    },
    nextBut() {
      if (window.projectImgUrl == "funw") {
        _paq.push(["trackEvent", "PC_submit", "PC_submit", this.$t('充值提交')]);
        _paq.push(["trackGoal", 1]);
      }
      if (this.currencyCode == "vip") {
        window.open(this.paymentWayitem.vendorcode, "_blank");
        return;
      }
      if (this.currencyCode != "currency") {
        if (this.paymentWayitem.paytype == "union" || this.online) {
          if (!this.userName) {
            this.$message({
              message: this.$t('请输入存款姓名'),
              type: "warning",
            });
            return;
          }
        }
        if (!this.input_money) {
          if (+this.money < +this.minMoney || +this.money > +this.maxMoney) {
            this.$message({
              message: this.$t('请输入正确的金额'),
              type: "warning",
            });
            return;
          }
        }
      }
      if (this.rechargeSms == 1 && this.isBindPhone == 0) {
        this.$message({
          message: this.$t('请先绑定手机号'),
          type: "warning",
        });
        this.isShowSmsCode = true;
        return;
      }
      var data = {
        money: this.money, //入款金额
        online: this.paymentWayitem.online, //	支付模式
        channelId: this.paymentWayitem.id, //	充值通道
        payType: this.paymentWayitem.paytype, //	支付方式
        terminal: 1, //	终端类型 1.pc端, 11.原生android, 12.原生ios, 13.h5的android, 14.h5的ios
        vendorcode: this.paymentWayitem.vendorcode,
        vendorname: this.paymentWayitem.vendorname,
        vendorNickName: this.paymentWayitem.name,
        transferName: this.userName,
      };
      if (this.activeName == 0 && this.currencyCode == "union") {
        // 公司入款用内链打开
        this.$http.post(this.$api.getPaymentNextStep, data).then((res) => {
          if (res.code == 0) {
            const query = res.data.url.split("?")[1];
            this.$router.push({
              name: "bankRecharge",
              query: {
                query: query,
              },
            });
          } else {
            this.$alert(res.msg + `(${res.code})`, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
              confirmButtonClass: "themeColorkBgc borderNone",
              callback: (action) => {
                this.getMoneyMode();
              },
            });
            self.winOpen.location.href = "/error.html?type=2";
          }
        });
        return;
      }

      self.winOpen = window.open("/wait.html", "_blank");
      this.$http.post(this.$api.getPaymentNextStep, data).then((res) => {
        if (res.code == 0) {
          // window.open(res.data.url, '_blank')
          self.winOpen.location.href = res.data.url;
          this.onBalck();
        } else {
          this.$alert(res.msg + `(${res.code})`, this.$t('提示'), {
            confirmButtonText: this.$t('确定'),
            confirmButtonClass: "themeColorkBgc borderNone",
            callback: (action) => {
              this.getMoneyMode();
            },
          });
          self.winOpen.location.href = "/error.html?type=2";
        }
      });
    },
    //打开客服
    openService() {
      let url = this.$common.getCustomerService();
      window.open(url, "_blank");
    },
    showDepositLesson() {
      this.isShowDepost = true;
    },
    changeActivedMode(id) {
      this.isShowSteps = 0;
      this.activedMode = id;
    },
    changeSteps(event) {
      const typeArr = ["downLoad", "goAndBuy", "deposit"];
      if (
        !typeArr.includes(event.target.dataset.steps) ||
        typeArr.indexOf(event.target.dataset.steps) == this.isShowSteps
      )
        return;
      this.isShowSteps = typeArr.indexOf(event.target.dataset.steps);
    },
  },
};
</script>

<style lang="scss">
.add-money-alert {
  padding-top: 20px;
  width: 1180px;
  margin: 0 auto;
  .deposit-lesson {
    position: relative;
    width: 100px;
    z-index: 999;
    left: 7rem;
    top: 30px;
    font-size: 18px;
    line-height: 22px;
    text-decoration-line: underline;
    color: #f87c30;
    &::after {
      content: "";
      display: inline-block;
      width: 15px;
      height: 15px;
      background-image: url("~@/assets/image/mark.png");
      background-size: cover;
      margin: 10px 0 0 6px;
    }

    &:hover{
        cursor: pointer;
      }
  }
  .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: transparent;
    z-index: 1;
  }
  .el-tabs__item:hover {
    color: $theme-color;
    cursor: pointer;
  }
  .el-tabs__item.is-active {
    color: $theme-color;
  }
  .el-tabs__active-bar {
    background: $theme-color;
  }
  .el-tabs__item {
    padding: 0px 0.4rem;
    color: #9695a6;
    font-size: 18px;
  }
  .el-tabs__nav-scroll {
    overflow: hidden;
    display: flex;
    justify-content: space-around;
  }
  // 备注弹窗样式
  .diaLogNote {
    .el-icon-close:before {
      content: "";
    }
    .confirmNoteStyle {
      width: 80%;
      height: 0.35rem;
      border-radius: 20px;
      color: #fff;
      line-height: 0.35rem;
      margin-top: 0.2rem;
      font-size: 0.16rem;
      background: $theme-color;
      text-align: center;
    }
    .confirmNoteStyle:hover {
      background: $theme-color;
    }
    .bindPhone {
      margin: 0 auto;
      margin-top: 0.3rem !important;
      cursor: pointer;
    }
    .el-dialog__body {
      min-height: 0;
      padding: 0.2rem 0.3rem 0.3rem;
    }
    .secondaryPopup {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    .contentText {
      font-size: 0.16rem;
      display: flex;
      text-align: left;
      width: 80%;
    }
    .currency {
      display: flex;
      flex-direction: column;
    }
  }

  .showDepost {
    .el-dialog {
      border-radius: 15px;
    }
    .el-icon-close:before {
      content: "";
    }

    .el-dialog__header {
      padding: 0;
      padding-top: 25px;
    }

    .el-dialog__body {
      padding: 0;
    }

    .el-scrollbar__view {
      padding: 0 30px 130px;
    }

    .show-deposit-wrapper {
      height: 90vh;
      overflow: auto;
      .show-deposit-header {
        font-size: 0.36rem;
        font-size: 20px;
        line-height: 28px;
        color: #333333;
        margin-bottom: 0.36rem;
        margin-left: 0.09rem;
        position: relative;
        .deposit-close-img {
          width: 16px;
          height: 16px;
          position: absolute;
          right: 0px;
          &:hover {
            cursor: pointer;
          }
        }
      }

      .jjpay-steps {
        display: flex;
        width: 6.174rem;
        height: 0.522rem;
        background: #f7f9fa;
        border-radius: 4px;
        margin: 0 auto;
        padding-left: 8px;
        margin-bottom: 0.36rem;
        .steps {
          display: flex;
          flex: auto;
          color: #99adbb;
          align-items: center;
          text-align: center;

          span {
            width: 1.764rem;
            height: 0.522rem;
            line-height: 2;
            font-size: 0.27rem;
            position: relative;
            flex: auto;
          }
          img {
            height: 0.522rem;
            position: relative;
            left: -1px;
          }

          .active {
            background: #608ff7;
            color: #fff;
          }

          .last-img {
            transform: translateX(100%);
            z-index: 1;
          }
        }
      }

      .show-deposit-steps {
        width: 80%;
        margin: 0 auto;
        img {
          width: 100%;
        }
      }
    }
  }

  .row-margin {
    margin: 0.2rem 0px;
    .left-text {
      // height: 0.44rem;
      line-height: 0.44rem;
      margin-left: 0.1rem;
    }
    .el-radio__inner {
      width: 0.14rem;
      height: 0.14rem;
      border: 1px solid $theme-color;
    }
    .el-radio__inner::after {
      background-color: $theme-color;
      width: 0.08rem;
      height: 0.08rem;
    }
  }
  .tips-text {
    color: #f8711d;
    display: block;
    text-align: left;
    font-size: 12px;
    margin-top: 0.1rem;
  }
  .box-card-mode {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
    .box-items {
      position: relative;
      border: 0.01rem solid #ccd6e4;
      border-radius: 10px;
      width: 20%;
      margin-right: 0.2rem;
      margin-left: 0.09rem;
      margin-bottom: 0.16rem;
      margin-top: 0.01rem;
      padding: 0.16rem 0;
      text-align: center;
      .box-item-text {
        font-size: 0.14rem;
      }
      .money-type-img {
        width: 0.35rem;
      }

      .method-img {
        width: 2rem;
      }
      .scaleImg {
        position: absolute;
        width: 0.5rem;
        height: 0.5rem;
        top: -0.05rem;
        left: -0.03rem;
      }
      .scale-text {
        position: absolute;
        top: 0.06rem;
        left: -0.26rem;
        width: 0.8rem;
        text-align: center;
        color: #ffffff;
        font-size: 12px;
        transform: rotate(-45deg);
      }
    }

    .methods-items {
      position: relative;
      border-radius: 10px;
      width: 20%;
      height: 0.9rem;
      margin-right: 0.2rem;
      margin-left: 0.09rem;
      margin-bottom: 0.16rem;
      margin-top: 0.01rem;
      text-align: center;
      display: flex;
      align-items: center;
      border: 0.01rem solid #d9d9d9;
      .methods-items-img {
        width: 28px;
        height: 28px;
        margin: 0 0.18rem;
      }
    }
    .box-item-money {
      //   border: 0.01rem solid #ccd6e4;
      border-radius: 0.1rem;
      min-width: 0.6rem;
      height: 0.27rem;
      line-height: 0.27rem;
      text-align: center;
      margin: 0.1rem;
      padding: 0px 0.1rem;
      //   color: #ccd6e4;
      cursor: pointer;
      .box-item-text {
        font-size: 0.14rem;
      }
    }
    .money-mode-avited {
      border: 0.01rem solid $theme-color;
      background: url("../../assets/image/jiaobiao_dui_PC.png") no-repeat;
      background-position-x: right;
      background-position-y: bottom;
      background-size: 0.35rem;
      // color: #FFAD50;
    }
    .money-text-avited {
      border: 0.1px solid $theme-color;
      color: $theme-color;
    }
  }
  // .box-items:nth-child(3n) {
  //     margin-right: 0px !important;
  // }
  .text-align {
    text-align: left;
    font-size: 0.16rem;
    color: #333;
    .rem-text {
      line-height: 0.44rem;
      font-size: 0.18rem;
      color: #333;
    }
    .themeBtnActive {
      background-color: $theme-color !important;
      color: #fff !important;
    }
  }

  .susses-title {
    font-size: 0.17rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin-left: 0.1rem;
    margin: 0.2rem 0px 0.1rem 0.1rem;
  }
  .zh-detail-text {
    line-height: 0.4rem;
    margin-left: 0.1rem;
    font-size: 0.17rem;
    color: #333333;
  }
  .coay-text {
    float: right;
  }
  .sussex-tip-text {
    color: #ffac74;
    font-size: 0.12rem;
    margin-left: 0.1rem;
    line-height: 2;
  }
  .coay-view {
    background: #f7f7f7;
    padding: 10px;
    margin-left: 20px;
    p {
      color: #666666;
      font-size: 0.14rem;
      line-height: 2;
    }
  }
  .el-input__inner {
    height: 0.44rem;
    font-size: 0.14rem;
    color: #333;
    &::placeholder {
      font-size: 0.14rem;
      color: #999;
    }
  }
  .row-button {
    .el-button {
      color: #fff;
      border: 0px;
      width: 70%;
      font-size: 0.15rem;
      padding: 0.12rem 0.2rem;
    }
    .el-button.is-round {
      padding: 0.11rem 0.2rem;
    }
    .backBut {
      background: #f8711d;
    }
    .subBut {
      background: #32a0ed;
    }
  }
  .next-but {
    width: 100%;
    color: #fff;
    border: 0px;
    height: 0.4rem;
    font-size: 0.15rem;
    padding: 0.1rem 0.2rem;
    margin-top: 0.1rem;
    font-size: 0.16rem;
    background: $theme-color;
  }
  .next-but:hover {
    background: $theme-color !important;
  }
  .next-but:focus {
    background: $theme-color !important;
  }
  .data-null {
    text-align: center;
    margin: 1rem 0px;
    img {
      width: 1.5rem;
      height: auto;
    }
    p {
      color: #999;
      font-size: 0.14rem;
      margin-top: 0.15rem;
    }
    .el-divider__text,
    .el-link {
      margin-top: -2px;
    }
  }
  .el-button.is-round {
    padding: 0.12rem 0.2rem;
  }

  .el-input__inner {
    border-radius: 8px;
    border: 1px solid #ccd6e4;
    // padding-left: 0.08rem;
  }

  .el-radio {
    height: 0.44rem;
    line-height: 0.44rem;
    .el-radio__input.is-checked .el-radio__inner {
      border-color: $theme-color;
      background: #fff;
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: var(--themeDark);
    }
    .el-radio__label {
      color: var(--themeDark);
    }
  }
  .select-list {
    width: 100%;
  }
  .el-radio__label {
    font-size: 0.14rem;
    color: #999;
  }
  .el-select-dropdown__item {
    font-size: 0.16rem;
  }
  .el-input--medium .el-input__inner {
    height: 0.44rem;
    line-height: 0.44rem;
  }

  .remarkName {
    font-size: 0.16rem;
    text-align: left;
    line-height: 1 !important;
  }
  .remarkText {
    color: #999;
    font-size: 0.12rem;
    line-height: 0.2rem;
    text-align: left;
    margin: 0.1rem 0 0 0.1rem;
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    border-color: $theme-color;
    outline: 0;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: $theme-color;
  }
  .el-select .el-input__inner:focus {
    border-color: $theme-color;
  }
  .el-select-dropdown__item.selected {
    color: var(--themeDark);
  }
  .el-input--prefix .el-input__inner {
    padding-left: 30px;
  }
  .alertTitle {
    text-align: center;
    font-size: 15px;
    font-weight: bold;
  }
}

.el-button--primary.is-active,
.el-button--primary:active {
  background: $theme-color !important;
  border-color: $theme-color !important;
  color: #fff;
}
.el-message-box {
  z-index: 1000;
}
//  .el-dialog__body{
//      min-height: 4rem;
//  }
.add-bank-div {
  text-align: center;
  margin: 1rem;
  img {
    width: 3rem;
    height: 2.5rem;
  }
  p {
    color: #999999;
    font-size: 0.16rem;
    margin-top: 0.1rem;
  }
}
.butCode {
  font-size: 0.15rem;
  padding: 0.12rem 0.2rem;
  height: 0.4rem;
  line-height: 0 !important;
  border: none !important;
  margin-left: 0.2rem !important;
}
</style>
