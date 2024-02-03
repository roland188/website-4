<template>
  <view class="my-theme">
    <uni-nav-bar
      :right-text="islogin ? $t('登出') : ''"
      :title="$t('会员中心')"
      :status-bar="true"
      :fixed="true"
      color="#fff"
      :shadow="false"
      @clickRight="logout"
    ></uni-nav-bar>
    <view class="userBox">
      <view class="">
        <image
          src="../../static/image/user.png"
          class="userImg"
          mode=""
        ></image>
      </view>
      <view class="user" v-if="islogin">
        <view class="username">
          {{ username }}
          <image
            class="my-jb-img"
            @click="openPerson"
            v-if="this.$config.clientCode == 'amjs'"
            :src="require('../../static/image/dze/' + 'a' + vipImg + '.png')"
            mode="widthFix"
          ></image>
          <image
            class="my-jb-img"
            @click="openPerson"
            v-else
            :src="
              vipImg === 'normal_user'
                ? $config.getThemeUrl('normal_user')
                : $config.getFileImgUrl('dze/' + vipImg)
            "
            mode="widthFix"
          ></image>
        </view>
        <view class="userMoney">
          <text class="currency">{{ $config.currency }} </text> {{ userMoney }}
        </view>
      </view>
      <view class="letter-wrap" v-if="islogin" @tap="handelStation">
        <image
          src="../../static/image/qqImg/h5_icon_znx.png"
          mode="aspectFill"
        ></image>
        <view class="letter-text"> {{ $t('站内信') }}</view>
        <view class="showNewData" v-if="msgIsUnRead || noticeIsUnRead"> </view>
      </view>
      <view class="" v-if="!islogin">
        <view class="login" @click="toPage('../Login/Login?type=0')">
          {{ $t('登录') }}
        </view>
        <view class="register" @click="toPage('../Login/Login?type=1')">
          {{ $t('注册') }}
        </view>
      </view>
    </view>
    <view class="card">
      <view class="flexBox">
        <view class="item" @click="toPage('../recharge/recharge', 1)">
          <image
            src="@/static/image/indexImg/cz1.png"
            class="imgtitle"
            mode=""
          ></image>
          <view class="itemtext"> {{ $t('充值') }} </view>
        </view>
        <view class="item" @click="toPage('../account/account', 1)">
          <image
            src="@/static/image/indexImg/cz2.png"
            class="imgtitle"
            mode=""
          ></image>
          <view class="itemtext"> {{ $t('提现') }} </view>
        </view>
        <view class="item" @click="openCaiJin">
          <view class="positionDiv">
            <view class="red-img" v-if="caiFlag"></view>
            <image
              src="@/static/image/indexImg/cz4.png"
              class="imgtitle"
              mode=""
            ></image>
            <view class="itemtext"> {{ $t('奖励') }} </view>
          </view>
        </view>
        <view
          class="item highLight"
          v-show="isShowHighRebate"
          @click="toPage('../highMargin/highMargin', 1)"
        >
          <view class="img-box">
            <image
              src="@/static/image/quan.png"
              class="imgtitle"
              mode=""
            ></image>
            <view class="red-point" v-if="isGetHighRebate"></view>
          </view>
          <view class="itemtext"> {{ $t('全民返利') }} </view>
        </view>
      </view>
    </view>
    <view class="card">
      <view class="flexBox rev-padding">
        <view class="">
          <image
            src="../../static/image/m7.png"
            mode=""
            class="rec-img"
          ></image>
        </view>
        <view class="rev-money">
          <view style="color: #c2c2c2">
            {{ $t('累计返水：')
            }}{{ userfan.rebateAmount ? rebateAmount : "0.00"
            }}
			<!-- {{ $t('元') }} -->
            <image
              src="../../static/image/r2.png"
              class="refresh-img"
              @click="getuserFanshui(1)"
              :class="{ shuaActive: shuaFlag }"
              mode=""
            ></image>
          </view>
          <view style="color: #c2c2c2">
            {{ $t('满') }}{{ userfan.rebateDown }}{{ $t('元可领取') }}
          </view>
        </view>
        <view>
          <view
            class="btn-rev"
            @click="openFanBut"
            :class="huiNone ? 'receive-hui' : ''"
          >
            <image :src="$config.getThemeUrl('btn') || btnImg" style="width: 100px; height: 50px"></image>
          </view>
        </view>
      </view>
    </view>
    <view class="title-wrap" style="padding-top: 25upx">
      <text class="shu" style="background-color: #ebcc45"></text>
      <text class="nameFull">{{ $t('我的账户') }}</text>
    </view>
    <view class="card">
      <view class="listCard">
        <view class="record">
          <view class="itemcard" @click="personal(1)">
            <image
              src="../../static/image/icon_memberdata_n.png"
              class="imgcard"
              mode=""
            ></image>
            <view class="text"> {{ $t('基本资料') }} </view>
          </view>
          <view class="itemcard" @click="personal(2)">
            <image
              src="../../static/image/icon_betinfo_n.png"
              class="imgcard"
              mode=""
            ></image>
            <view class="text"> {{ $t('安全中心') }} </view>
          </view>
          <view class="itemcard" @click="toPage('../bankList/bankList', 1)">
            <image
              src="../../static/image/bank.png"
              class="imgcard"
              mode=""
            ></image>
            <view class="text"> {{ $t('银行卡/数字货币') }} </view>
          </view>
          <view style="width: 30%"></view>
        </view>
      </view>
    </view>
    <view class="title-wrap" style="padding-top: 25upx">
      <text class="shu" style="background-color: #fd4eb3"></text>
      <text class="nameFull">{{ $t('自助服务') }}</text>
    </view>
    <view class="newCard">
      <view class="card">
        <view class="listCard">
          <view class="record">
            <view
              class="itemcard"
              @click="
                toPage('../returnWaterRecords/returnWaterRecords?id=5', 1)
              "
            >
              <image
                src="../../static/image/icon_myrakeback_n.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t('我的返水') }} </view>
            </view>
            <view class="itemcard" @click="toPreferen()">
              <image
                src="../../static/image/icon_offer_n.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t('我的优惠') }} </view>
            </view>
            <view class="itemcard" @click="toPage('../setting/setting', 0)">
              <image
                src="../../static/image/setup.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t('设置') }} </view>
            </view>
            <view class="itemcard" @click="toPage('../subBuffetOffers/index', 1)">
              <image
                src="../../static/image/zzyh.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t('自助优惠') }} </view>
            </view>
            <view class="itemcard" @click="toPage('/pages/mallStore/mallStore', 1)">
              <image
                src="../../static/image/icon_integral.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t("积分商城") }} </view>
            </view>
            <view style="width: 30%"></view>
          </view>
        </view>
      </view>
    </view>
    <view class="title-wrap">
      <text class="shu" style="background-color: #bdfc48"></text>
      <text class="nameFull">{{ $t('往来记录') }}</text>
    </view>
    <view class="newCard">
      <view class="card">
        <view class="listCard">
          <view class="record">
            <view
              class="itemcard"
              @click="toPage('../gameRecord/gameRecord?id=1', 1)"
            >
              <image
                src="../../static/image/icon_betrecord_n.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t('游戏记录') }} </view>
            </view>

            <view
              class="itemcard"
              @click="toPage('../activeRecord/activeRecord?id=2', 1)"
            >
              <image
                src="../../static/image/activeRecord.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t('活动记录') }} </view>
            </view>

            <view
              class="itemcard"
              @click="toPage('../firstRecord/firstRecord?id=3', 1)"
            >
              <image
                src="../../static/image/prepaidRecords.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t('充值记录') }} </view>
            </view>

            <view
              class="itemcard"
              @click="toPage('../withdrawalRecord/withdrawalRecord?id=4', 1)"
            >
              <image
                src="../../static/image/withdrawalRecord.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t('提现记录') }} </view>
            </view>

            <view class="itemcard" @click="toPage('../other/other?id=10', 1)">
              <image
                src="../../static/image/otherRecord.png"
                class="imgcard"
                mode=""
              ></image>
              <view class="text"> {{ $t('其它') }} </view>
            </view>

            <view style="width: 30%"></view>
          </view>
        </view>
      </view>
    </view>
    <view class="title-wrap">
      <text class="shu" style="background-color: #a48be2"></text>
      <text class="nameFull">{{ $t('信息公告') }}</text>
    </view>
    <view class="newCard">
      <view class="card">
        <view class="listCard">
          <view class="record">
            <view
              class="itemcard highLight"
              @click="toPage('../Message/Message')"
            >
              <view class="img-box">
                <image
                  src="../../static/image/icon_news_n.png"
                  class="imgcard"
                  mode=""
                ></image>
              </view>
              <view class="text"> {{ $t('公告消息') }} </view>
            </view>
            <view
              class="itemcard highLight"
              @click="toAgenPath('/pages/agent/agent')"
            >
              <view class="img-box">
                <image
                  src="../../static/image/indexImg/handshake.png"
                  class="imgcard"
                  mode=""
                ></image>
              </view>
              <view class="text"> {{ $t('代理加盟') }} </view>
            </view>
            <view style="width: 30%"></view>
          </view>
        </view>
      </view>
    </view>
    <view class="interest-box" @click="openMall()" v-if="status == 1">
      <view class="left-box">
        <image src="../../static/image/jfsc.png" mode=""></image>
        <text>{{ mall }}</text>
      </view>
    </view>
    <view
      class="interest-box"
      v-if="isInterestShow"
      @click="toPage('../interest/interest', 1)"
    >
      <view class="left-box">
        <image src="../../static/image/interest.png" mode=""></image>
        <text>{{ $t('利息宝') }}</text>
      </view>
      <view class="right-box">
        <text v-if="isInterestActive">NEWS</text>
        <image src="../../static/image/more.png" mode=""></image>
      </view>
    </view>
    <view style="height: 100rpx"></view>
    <chunLei-modal
      v-model="vipShow"
      :mData="modeldata"
      :type="modeltype"
      :maskEnable="true"
      @cancel="cancel1"
      :tabbarHeight="tabbarHeight"
      @onConfirm="onConfirm1"
    >
    </chunLei-modal>

    <uni-popup ref="showtip" type="center">
      <view class="chuiLei-container" v-if="this.$config.clientCode == 'amjs'">
        <image
          src="@/static/image/qqImg/le.png"
          style="width: 100%; height: 100%"
        ></image>
      </view>
      <view class="chuiLei-container" v-else>
        <view class="header">
          <image :src="$config.getThemeUrl('topword')" mode="widthFix"></image>
        </view>
        <scroll-view class="scroll-view_H" scroll-y="true">
          <view class="vipUl1">
            <view class="vipUl">
              <view class="vipLiHeader">
                <view class="vipLi liHeader li"> {{ $t('等级') }} </view>
                <view class="vipLi liHeader li liDa">
                  {{ $t('达成条件') }}
                </view>
                <view class="vipLi liHeader li"> {{ $t('提现次数') }} </view>
              </view>
              <view class="vipList" v-for="(item, i) of vipList" :key="i">
                <view class="vipLi">
                  {{ item.gradeName }}
                </view>
                <view class="vipLi liDa">
                  <text>
                    {{ $t('存款') }}{{ item.charge }},{{ $t('有效投注')
                    }}{{ item.bet }}</text
                  >
                </view>
                <view class="vipLi">
                  24h/{{ item.withdrawLimit }}{{ $t('次') }}
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <image
        src="../../static/image/dze/close1.png"
        mode="widthFix"
        class="closeicon"
        @click="$refs.showtip.close()"
      ></image>
    </uni-popup>
	 <myTabBar :current="4" ref="menuBar" />
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
import cache from "../../utils/cache.js";
import chunLeiModal from "@/components/chunLei-modal/chunLei-modal.vue";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import btnImg from "@/static/image/public/vi/btn.png"
import myTabBar from '@/components/myTabBar/index.vue';
export default {
  components: {
    uniNavBar,
    "chunLei-modal": chunLeiModal,
    uniPopup,
	myTabBar
  },
  data() {
    return {
      username: "",
      userfan: {
        rebateDown: "0.00",
      },
      vipList: [],
      vipImg: "normal_user",
      shuaFlag: false,
      huiNone: true,
      rebateAmount: "",
      islogin: "",
      isShowHighRebate: false,
      userdata: {},
      isGetHighRebate: false,
      msgIsUnRead: false,
      noticeIsUnRead: false,
      modeldata: {},
      modeltype: "",
      tabbarHeight: 50,
      vipShow: false,
      uid: "",
      userMoney: "0.00",
      mall: "",
      status: null, //积分商城状态
      caiFlag: false, //彩金状态
      isInterestShow: false, //利息宝是否显示
      isInterestActive: false, //利息宝活动状态
	  btnImg,
    };
  },
  onShow() {
    this.islogin = this.$cache.get('access_token');
    if (this.islogin && this.$cache.get("set_user")) {
      this.username = this.$cache.get("set_user").username;
      this.uid = this.$server.getUser().user_id;
      this.getUserdata();
      this.getuserFanshui();
      this.getNewsSee(); //是否有未读消息
      this.currMember();
      this.getNotReceive();
      this.getVipList();
    }
    //判断全民返利功能是否开启
    this.getRegisterSet();
    //利息宝是否显示
    //this.getIntereststatus();
    // this.getVipList();
    //	this.getClientMall(); //商城信息
  },
  methods: {
    getClientMall() {
      let _this = this;
      this.$api.getClientMall(function (err, res) {
        if (err) {
        } else {
          _this.mall = res.name;
          _this.status = res.status;
        }
      }, false);
    },
    // 站内信
    handelStation() {
      uni.navigateTo({
        url: "/pages/Message/Message",
      });
      // this.this.getNotReceive();
    },
    //积分商城
    openMall() {
      if (!this.$api.isLogin()) {
        uni.navigateTo({
          url: "../login/login",
        });
        return;
      }
      //积分商城
      var _this = this;
      var obj = {};
      obj.host = _this.$config.host;
      obj.clientCode = _this.$config.clientCode;
      obj.language = uni.getStorageSync("lang")
        ? uni.getStorageSync("lang")
        : "zh_CN";
      let userInfo = this.$server.getUser();
      obj.userId = userInfo && userInfo.user_id;
      obj.token = userInfo && userInfo.token_type + " " + userInfo.access_token;
      obj.showdialog = false; //是否点击签到
      // #ifdef H5
      obj.type = 1;
      obj.clientItem = window.childCode;
      obj.theme = window.theme;
      obj.projectImgUrl = window.projectImgUrl;
      // #endif
      // #ifdef APP-PLUS
      obj.type = 2;
      obj.clientItem = _this.$config.childCode;
      obj.theme = _this.$config.theme;
      obj.projectImgUrl = _this.$config.projectImgUrl;
      // #endif
      console.log(obj);

      var str = JSON.stringify(obj);
      // #ifdef H5
      str = window.btoa(str);
      // #endif
      // #ifdef APP-PLUS
      str = new Buffer(str).toString("base64");
      // #endif

      var url = _this.$config.codeUrl + "/mall/h5?s=" + str;
      _this.$server.setMallUrl(url);
      uni.navigateTo({
        url: "../webviewNotNav/webviewNotNav?url=mall",
      });
    },
    getVipList() {
      this.$api.getVipList("", (err, res) => {
        if (res) {
          this.vipList = res;
        }
      });
    },
    openPerson() {
      // this.$refs.showtip.open();//旧版
      uni.navigateTo({
          url: "../vipLevel/vipLevel",
      });
    },
    // 获取彩金状态
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
    // 获取余额
    currMember() {
      let option = {
        clientId: cache.get("set_user").tenant_id, //tenant_id
        clientIp: this.$config.clientIp,
        memberId: cache.get("set_user").user_id, //userid
        username: cache.get("set_user").username,
      };

      this.$api.getGameBalance(
        option,
        (err, res) => {
          this.$server.setUserBalance(res);
          this.userMoney = res.totalBalance.toFixed(2);
        },
        false
      );
    },
    //跳转到我的优惠页面
    toPreferen() {
      uni.navigateTo({
        url: "../preferential/preferential",
      });
    },
    toAgenPath(url) {
      uni.navigateTo({
        url: url,
      });
    },
    //彩金
    openCaiJin() {
      if (!this.$api.isLogin()) {
        uni.navigateTo({
          url: "../Login/Login?type=0",
        });
        return;
      }
      uni.navigateTo({
        url: "/pages/jackpot/jackpot",
      });
    },
    personal(type) {
      if (!this.$api.isLogin()) {
        uni.navigateTo({
          url: "../Login/Login?type=0",
        });
      } else {
        if (type == 1) {
          //个人资料
          uni.navigateTo({
            url: "../personal/personal",
          });
        } else {
          //安全中心
          uni.navigateTo({
            url:
              "../safetyCenter/safetyCenter?withdrawPassWordState=" +
              this.userdata.withdrawPassWordState,
          });
        }
      }
    },
    //获取个人信息
    getUserdata() {
      this.$api.userInfo(
        cache.get("set_user").user_id,
        (err, res) => {
          if (err) {
            return;
          }
          if (res) {
            this.userdata = res;
            this.getVipData(res.levelId);
          }
        },
        false
      );
    },
    //获取VIP信息
    getVipData(vip) {
      this.$api.getvipdata(
        vip,
        (err, res) => {
          if (res) {
            this.vipImg = res.gradeId - 1;
            if (this.vipImg == 0) {
              this.vipImg = "normal_user";
            }
          }
        },
        false
      );
    },
    getRegisterSet() {
      var _this = this;
      this.$api.getRegisterSet(
        "allowance_on",
        function (err, res) {
          if (res) {
            _this.isShowHighRebate = res.svalue && res.svalue.allowance_on;
            if (_this.isShowHighRebate) {
              if (_this.islogin) {
                _this.queryHighRebate();
              }
            }
          }
        },
        false
      );
    },
    logout() {
      // #ifdef  H5
      // 新版
      maskAppToNative("loginout");
      //老版
      maskAppOldToNative("loginout");
      // #endif
      this.$api.logout((err, res) => {
        this.$server.clearToken();
        uni.navigateTo({
          url: "../Login/Login",
        });
      }, true);
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
        if (!this.islogin) {
          uni.navigateTo({
            url: "../Login/Login",
          });
        } else {
          uni.navigateTo({
            url: name,
          });
        }
      }
    },
    getuserFanshui(type) {
      const self = this
      if (!this.islogin) {
        uni.showToast({
          title: self.$t('请先登录'),
          icon: "none",
        });
        return;
      }
      this.shuaFlag = true;
      this.$api.getUserFanshui(
        cache.get("set_user").user_id,
        (err, res) => {
          this.shuaFlag = false;
          if (err) {
            if (type == 1) {
              uni.showToast({
                title: self.$t('返水额度刷新失败，请重试！'),
                icon: "none",
              });
            }
          } else {
            this.userfan = res;
            this.rebateAmount = this.$common.setNumFixed(res.rebateAmount, 2);
            if (this.userfan.rebateAmount < this.userfan.rebateDown) {
              this.huiNone = true;
            } else {
              this.huiNone = false;
            }
            if (type == 1) {
              uni.showToast({
                title: self.$t('返水刷新成功'),
                icon: "success",
              });
            }
          }
        },
        false
      );
    },
    queryHighRebate(type) {
      //查询返利
      var _this = this;
      this.$api.availableAmount(
        null,
        function (err, res) {
          if (err) {
            uni.showToast({
              icon: "none",
              title: err.msg,
            });
          } else {
            let allowance = _this.$common.setNumFixed(res.allowance, 2);
            let minCount = res.minCount;
            if (allowance >= minCount) {
              _this.isGetHighRebate = true;
            }
          }
        },
        false
      );
    },
    //获取是否有未读消息
    getNewsSee() {
      var data = {
        currentPage: "",
        pageSize: "",
        receiverType: 0,
      };
      this.$api.message(
        data.currentPage,
        data.pageSize,
        data.receiverType,
        (err, res) => {
          if (res) {
            this.msgIsUnRead = res.unreadFlag;
          }
        }
      );
      var data1 = {
        createdAt: "",
        currentPage: "",
        pageSize: "",
        publishedAt: "",
        subject: "",
      };
      this.$api.noticeList(
        data1.createdAt,
        data1.currentPage,
        data1.pageSize,
        data1.publishedAt,
        data1.subject,
        (err, res) => {
          if (res) {
            this.noticeIsUnRead = res.unreadFlag;
          }
        }
      );
    },
    openFanBut() {
      const self = this
      if (this.huiNone) {
        uni.showToast({
          title: self.$t('返水额度不满足条件，无法领取！'),
          icon: "none",
        });
        return;
      }
      console.log(this.userfan);
      if (this.userfan.rebateAmount < this.userfan.rebateDown) {
        uni.showToast({
          title: self.$t('返水额度不满足条件，无法领取！'),
          icon: "none",
        });
        return;
      }
      this.modeltype = "userback";
      this.modeldata = {
        title: this.$t('返水领取'),
        confirmText: this.$t('立即领取'),
        cancelText: this.$t('查看详情'),
        content: this.userfan.verityCount,
        money: this.rebateAmount,
      };

      this.vipShow = true;
    },
    getUserReceiveFanshui() {
      this.$api.getUserReceiveFanshui(
        cache.get("set_user").user_id,
        (err, res) => {
          if (res) {
            this.modeltype = "userback";
            this.modeldata = {
              title: this.$t('温馨提示'),
              confirmText: this.$t('我知道了'),
              content: this.$t('领取成功，请到中心钱包查看余额'),
            };
            this.getuserFanshui();
            this.vipShow = true;
          }
        }
      ),
        false;
    },
    cancel1() {
      this.vipShow = false;
      if (this.modeltype == "userback") {
        uni.navigateTo({
          url: "../BackwaterRecord/BackwaterRecord?type=1",
        });
      }
    },
    onConfirm1(e) {
      this.vipShow = false;
      if (e == this.$t('立即领取')) {
        this.getUserReceiveFanshui();
      }
    },
    getIntereststatus() {
      //利息宝是否显示
      var _this = this;
      this.$api.getRegisterSet(
        "interest_global_status",
        function (err, res) {
          if (res) {
            if (res.svalue.interest_global_status == 1) {
              _this.isInterestShow = true;
              if (_this.islogin) {
                _this.existRunningStatus();
              }
            } else {
              _this.isInterestShow = false;
            }
          }
        },
        false
      );
    },
    existRunningStatus() {
      //获取利息宝活动状态
      var _this = this;
      this.$api.existRunningStatus(function (err, res) {
        if (res) {
          _this.isInterestActive = true;
        }
      }, false);
    },
  },
};
</script>

<style lang="scss" scoped>
.my-theme{
  background: var(--mytheme);
}
.shuaActive {
  animation: mymove 1.25s linear infinite;
  -moz-animation: mymove 1.25s linear infinite;
  /* Firefox */
  -webkit-animation: mymove 1.25s linear infinite;
  /* Safari and Chrome */
  -o-animation: mymove 1.25s linear infinite;
  /* Opera */
}

.chuiLei-container {
  background-color: #fff;
  width: 680upx;
  height: 812upx;
  overflow-y: scroll !important;
  border-radius: 30upx !important;

  // padding: 32upx;
  .header {
    height: 110upx;
    border-radius: 16upx 16upx 0 0;
    background-color: #f8d63c;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 80%;
      height: 100upx;
    }
  }

  .scroll-view_H {
    height: 712upx;
  }

  .vipUl1 {
    padding: 30upx;
  }

  .vipUl {
    border-top: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    overflow: auto;
  }

  .vipLiHeader {
    display: flex;
  }

  .vipList {
    display: flex;
  }

  .vipLi {
    flex-grow: 0;
    flex-shrink: 0;
    width: 23%;
    text-align: center;
    font-size: 24upx;
    padding: 12upx 0px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }

  .liDa {
    flex-grow: 1;
  }

  .liHeader {
    font-size: 26upx;
    font-weight: 600;
  }
}

.closeicon {
  width: 80upx;
  height: 80upx !important;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  top: 30upx;
}

@keyframes mymove {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(720deg);
  }
}

.title-wrap {
  margin: 0 var(--mymargin);
}

.my-jb-img {
  width: 114rpx;
  height: auto;
  vertical-align: middle;
  margin-left: 10upx;
}

.shu {
  display: inline-block;
  border-radius: 25%;
  width: 8rpx;
  height: 44rpx;
  vertical-align: middle;
  margin-right: 4px;
}

.nameFull {
  color: #d7c39d;
  font-size: 26rpx;
}

// 新的UI布局
.newCard {
  .card {
    background: var(--theme);

    .listCard {
      padding: 0 !important;

      .itemcard {
        width: 29% !important;
        background: var(--mythemeCard);
        margin-bottom: 40upx;
        padding: 25upx 0 !important;
        border-radius: 20upx !important;
      }
    }
  }
}

.card {
  margin: var(--myCardmagin);
  background: var(--mythemeCard);
  border-radius: 4px;

  .listCard {
    display: flex;
    align-items: center;
    padding: 40rpx 0;

    .shu {
      display: inline-block;

      width: 8rpx;
      height: 44rpx;
      vertical-align: middle;
      margin-right: 4px;
    }

    .record {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      justify-content: space-between;
    }

    .nameFull {
      color: #d7c39d;
      font-size: 26rpx;
    }

    .itemcard {
      width: 30%;
      padding: 5px 0;
      margin-left: 5px;
      box-sizing: border-box;
      text-align: center;

      .imgcard {
        width: 60rpx;
        height: 60rpx;
      }

      .text {
        color: var(--mythemeColor);
        font-size: 24rpx;
      }
    }
  }

  .flexBox {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    text-align: center;

    .item {
    }

    .positionDiv {
      position: relative;
    }

    .red-img {
      background: red;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      position: absolute;
      right: 0px;
      z-index: 2;
    }

    .imgtitle {
      width: 84rpx;
      height: 84rpx;
    }

    .itemtext {
      text-align: center;
      color: var(--mythemeColor);
      font-size: 26rpx;
    }

    .rec-img {
      width: 50rpx;
      height: 50rpx;
    }

    .btn-rev {
      // border-radius: 20px;
      // background: #ebcc45;
      // color: #FFFFFF;
      // padding: 5rpx 30rpx;
      // font-size: 24rpx;
    }

    .receive-hui {
      opacity: 0.6;
    }

    .rev-money {
      flex-grow: 2;
      padding: 0 20rpx;
      text-align: left;

      .refresh-img {
        width: 40rpx;
        height: 40rpx;
        vertical-align: middle;
        margin-left: 10rpx;
      }
    }
  }

  .rev-padding {
    padding: 10px 32rpx;
  }
}

.cardp {
  padding: 0 50rpx;
}

.userBox {
  display: flex;
  align-items: center;
  background: var(--myuserBgColor);
  padding: 32rpx;

  .userImg {
    width: 120rpx;
    height: 120rpx;
  }

  .user {
    margin-left: 30rpx;

    .username {
      color: #ebcc45;
      font-size: 28rpx;
    }

    .userMoney {
      color: #fff;
      font-size: 24rpx;
      .currency{
        font-size: 28rpx;
        margin-right: 4rpx;
      }
    }
  }

  .letter-wrap {
    display: flex;
    position: absolute;
    right: 70upx;
    background-color: var(--mythemeBtnColor);
    border-radius: 28upx;
    padding: 6upx 16upx;

    & > uni-image {
      width: 44upx;
      height: 44upx;
    }

    .letter-text {
      margin-left: 10upx;
      color: #d8c39d;
      font-size: 28upx;
    }

    .showNewData {
      width: 16upx;
      height: 16upx;
      background: #d82424;
      position: absolute;
      border-radius: 50%;
      top: 0px;
      left: 60upx;
    }
  }

  .login {
    color: #fff;
    background: var(--myloginbtn);
    padding: 10rpx 40rpx;
    text-align: center;
    border-radius: 20px;
    display: inline-block;
    margin-right: 15rpx;
    margin-left: 20rpx;
  }

  .register {
    color: var(--myresisterColor);
    background: var(--myregisterbtn);
    border: var(--myresisterborder);
    padding: 10rpx 40rpx;
    text-align: center;
    border-radius: 20px;
    display: inline-block;
  }
}

//  红点
.highLight {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .img-box {
    position: relative;
    width: 84upx;
    height: 84upx;

    .red-point {
      position: absolute;
      top: 6upx;
      right: 0;
      width: 18upx;
      height: 18upx;
      background-color: #ff4040;
      border-radius: 50%;
    }
  }
}

.interest-box {
  margin: 20upx 32upx;
  padding: 24upx 20upx;
  border: 1px solid #ddd;
  border-radius: 8upx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;

  .left-box {
    display: flex;
    align-items: center;

    image {
      width: 40upx;
      height: 40upx;
      margin-right: 16upx;
    }
  }

  .right-box {
    display: flex;
    align-items: center;

    text {
      color: #fff;
      background-color: #fb5954;
      border-radius: 30upx;
      font-size: 0.6rem;
      display: inline-block;
      margin-right: 0.5rem;
      padding: 0.08rem 0.5rem;
    }

    image {
      width: 30upx;
      height: 30upx;
    }
  }
}
</style>
