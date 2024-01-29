<!-- 个人信息页面  by 琦琦-->
<template>
  <view class="personal pageBackground bgPage">
    <!--    <view class="perHeader themeNavBg">
      <view class="status_bar">
    
      </view>
      <view class="perHeaderReal">
        <view @tap="goBack"></view>
        <view class="textOne setMoneyColor">个人资料</view>
        <view class="textOne saveBtn setMoneyColor" :style="{ visibility: !isShowSaveBtn ? 'hidden' : 'visible' }" @tap="userInfoSave"
          >保存</view
        >
      </view>
    </view> -->
    <uni-nav-bar :title="$t('个人资料')" leftIcon="back" :status-bar="true" :fixed="true" :shadow="false" @clickLeft="goBack">
      <view slot="right">
        <view class="textOne saveBtn setMoneyColor" :style="{ visibility: !isShowSaveBtn ? 'hidden' : 'visible' }" @tap="userInfoSave"
          >{{ $t('保存') }}</view
        >
      </view>
    </uni-nav-bar>
    <view class="perBody">
      <view class="perTop">
        <!-- 个人头像 -->
        <view class="userImage" style="margin-right: 18upx">
          <image src="../../static/image/qqImg/user.png" mode="aspectFill" lazy-load></image>
        </view>

        <view>
          <!-- 账户名 -->
          <view class="account themeDetTextColor4" style="color: #000">
            <view style="display: flex; margin-bottom: 20upx; align-items: center">
              <view class="accountVal setMoneyColor" style="font-size: 36upx; font-weight: bold; margin-right: 16upx">{{
                accountName
              }}</view>
			  <image
			    class="my-jb-img"
			    :src="vipImg === 'normal_user'? $config.getThemeUrl('normal_user'): $config.getFileImgUrl('dze/' + vipImg)"
			    mode="widthFix"
			  ></image>
              <!-- <image class="my-jb-img" :src="require('../../static/image/dze/' + vipImg + '.png')" mode="widthFix"></image> -->
            </view>
            <view class="accountDisModify" style="font-size: 28upx">{{$t('账号无法修改')}}</view>
          </view>
        </view>
      </view>

      <view class="perRow perPhone mypageBgitem themePerRowBg" style="position: relative; border: none">
        <view class="perIcon" style="backgroundImage: url('../../static/image/qqImg/perPhone.png')"></view>
        <view class="perRowName perName themeTextOne">{{ $t('手机号码') }}</view>
        <view v-if="initUserData && initUserData.phone" class="perRowVal themeTextOne">{{ phone | phoneEncode }}</view>
        <input
          type="text"
          v-else
          class="perRowVal themeTextOne"
          maxlength="11"
          @input="onInput($event, 'phone')"
          v-model="phone"
          :placeholder="$t('请填写手机号')"
          placeholder-class="themeTextTwo"
        />
      </view>

      <view class="perContent mypageBgitem themePerRowBg">
        <view class="perRow personalBorder8">
          <view class="perIcon" style="backgroundImage: url('../../static/image/qqImg/perName.png')"></view>
          <view class="perRowName perName themeTextOne">{{ $t('真实姓名') }}</view>
          <input
            type="text"
            class="perRowVal themeTextOne"
            @input="onInput($event, 'realName')"
            @blur="commonBlurFn($event, 'realName')"
            :value="initRealName"
            :placeholder="$t('请填写你的真实姓名')"
            placeholder-class="themeTextTwo"
            :disabled="initUserData && initUserData.realName ? true : false"
          />
        </view>

        <view class="perRow personalBorder8">
          <view class="perIcon" style="backgroundImage: url('../../static/image/qqImg/zalo.png')"></view>
          <view class="perRowName perName themeTextOne">{{ $t('WhatsApp') }}</view>
          <input
            type="text"
            class="perRowVal themeTextOne"
            @input="onInput($event, 'wechat')"
            @blur="commonBlurFn($event, 'wechat')"
            v-model="wechat"
            :placeholder="$t('请填写你的WhatsApp')"
            placeholder-class="themeTextTwo"
            :disabled="initUserData && initUserData.wechat ? true : false"
          />
        </view>

        <view class="perRow personalBorder8">
          <view class="perIcon" style="backgroundImage: url('../../static/image/qqImg/Facebook.png')"></view>
          <view class="perRowName perName themeTextOne">{{ $t('Telegram') }}</view>
          <input
            type="text"
            class="perRowVal themeTextOne"
            @input="onInput($event, 'qq')"
            @blur="commonBlurFn($event, 'qq')"
            v-model="qq"
            :placeholder="$t('请填写你的Telegram')"
            placeholder-class="themeTextTwo"
            :disabled="initUserData && initUserData.qq ? true : false"
          />
        </view>

        <view class="perRow personalBorder8" style="border: none">
          <view class="perIcon" style="backgroundImage: url('../../static/image/qqImg/perEmail.png')"></view>
          <view class="perRowName perName themeTextOne">{{ $t('邮箱地址') }}</view>
          <input
            type="text"
            class="perRowVal themeTextOne"
            @input="onInput($event, 'email')"
            v-model="email"
            @blur="commonBlurFn($event, 'email')"
			 :placeholder="$t('请填写邮箱地址')"
            placeholder-class="themeTextTwo"
            :disabled="initUserData && initUserData.email ? true : false"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import cache from "../../utils/cache.js";
export default {
  data() {
    return {
      icon: "normal_user",
      vipImg: "normal_user",
      accountName: "",
      //余额
      balance: "",
      //头像
      avatar: "",
      //真实姓名
      realName: "",
      realNameValue: "",
      phone: "",
      wechat: "",
      qq: "",
      email: "",
      bindPhone: 0, //手机号是否绑定过
      birthday: "",
      nickName: "",
      sex: 0,
      avatar1: "",
      birthday1: "",
      email1: "",
      nickName1: "",
      phone1: "",
      qq1: "",
      realName1: "",
      sex1: 0,
      // userId1: "",
      wechat1: "",
      firstValue: true,
      initUserData: null, //初始会员信息
      vip: -1,
      codePrefix:'+84',
      isShowSaveBtn: false, //是否显示保存按钮
    };
  },
  filters: {
    phoneEncode(val) {
      //手机号加密
      if (val) {
        return val.substr(0, 3) + "****" + val.substr(-4);
      } else {
        return this.$t('请填写手机号');
      }
    },
  },
  onShow(e) {
    //获取用户id
    if (cache.get("set_user")) {
      this.userId = cache.get("set_user").user_id;
      console.log(this.userId);
      this.getUserInfo(); //获取个人信息
    }
  },
  onUnload() {
    //强制隐藏软键盘
    // #ifdef APP-PLUS
    plus.key.hideSoftKeybord();
    // #endif
  },
  //点击完成（导航栏自定义按钮）
  onNavigationBarButtonTap(btn) {
    if (btn) {
      // console.log(btn)
      // #ifdef APP-PLUS
      let pages = getCurrentPages();
      let page = pages[pages.length - 1];
      let currentWebview = page.$getAppWebview();
      let titleObj = currentWebview.getStyle().titleNView;
      if (!titleObj.buttons[0].text) {
        return;
      }
      // #endif
    }

    this.updateUserInfo();
  },
  methods: {
    commonBlurFn(e, key) {
      //ios  input输入，键盘上点击完成，即触发
      this.isShowSaveBtn = true;
      this[key] = e.detail.value;
    },
    getUserInfo() {
      var _this = this;
      //获取个人信息接口
      _this.$api.userInfo(
        _this.userId,
        function (err, res) {
          if (err) {
            console.log(err, "获取个人信息失败");
          } else {
            console.log(res, "获取个人信息完成");
            _this.initUserData = res;
            _this.avatar = res.avatar;
            _this.accountName = res.name;
            _this.realName = res.realName;
            _this.realNameValue = res.realName;
            _this.phone = res.phone;
            _this.wechat = res.wechat;
            _this.qq = res.qq;
            _this.email = res.email;
            _this.bindPhone = res.bindPhone;
            _this.birthday = res.birthday;
            _this.nickName = res.nickName;
            _this.sex = res.sex;
            _this.vip = res.levelId;
            //获取用户vip等级
            _this.getVipData();

            //获取余额
            // _this.getUserBalance();
            // _this.balance = _this.$server.getUserBalance().totalBalance.toFixed(2);

            //存本地，后面做对比
            uni.setStorage({
              key: "userData",
              data: {
                avatar: res.avatar,
                realName: res.realName,
                phone: res.phone,
                wechat: res.wechat,
                qq: res.qq,
                email: res.email,
                birthday: res.birthday,
                nickName: res.nickName,
                sex: res.sex,
                codePrefix: res.codePrefix
              },
              success: function () {
                console.log("success");
              },
            });
          }
        },
        true
      );
    },
    //获取VIP信息
    getVipData() {
      this.$api.getvipdata(this.vip, (err, res) => {
        console.log(res.gradeId);
        if (res) {
          this.vipImg = res.gradeId - 1;
          if (this.vipImg == 0) {
            this.vipImg = "normal_user";
          }
        }
      });
    },

    getUserBalance() {
      const self = this
      let option = {
        clientId: cache.get("set_user").tenant_id, //tenant_id
        clientIp: this.$config.clientIp,
        memberId: cache.get("set_user").user_id, //userid
        username: cache.get("set_user").username,
      };
      this.$api.getUserBalance(
        option,
        (err, res) => {
          if (res) {
            this.balance = res.money.toFixed(2);
          }
          if (err) {
            uni.showToast({
              title: self.$t('获取失败，请重试'),
              duration: 2000,
              icon: "none",
            });
          }
        },
        true
      );
    },
    // realNameIsValid() {
    // 	//真实姓名校验
    // 	if (this.realName) {
    // 		return (/^.{0,8}$/.test(this.realName));
    // 	} else {
    // 		return true;
    // 	}

    // },
    //微信号校验
    WeChatIsValid() {
      if (this.wechat) {
        return /^[a-zA-Z0-9][a-zA-Z0-9_-]{5,19}$/.test(this.wechat);
      } else {
        return true;
      }
    },
    //qq校验
    qqIsValid() {
      if (this.qq) {
        return true;
      } else {
        return false;
      }
    },
    // email校验
    emailIsValid() {
      if (this.email) {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this.email);
      } else {
        return true;
      }
    },
    toUpdateUserImg() {
      uni.navigateTo({
        // url: '../updateUserImg/updateUserImg?userImage='+this.avatar,
        url: "../updateUserImg/updateUserImg",
      });
    },
    toUpdatePhone() {
      const self = this
      if (this.bindPhone) {
        //手机号只能绑定一次
        uni.showToast({
          icon: "none",
          title: self.$t('您已绑定手机，如需更换，请联系客服'),
          duration: 3000,
        });

        return;
      }

      uni.navigateTo({
        url: "../upPassword/upPassword?type=3",
      });
    },
    onInput(e, name) {
      //方便h5调试
      //ios  input输入，键盘上点击确认才会触发，（直接点击完成不触发）
      this[name] = e.target.value;
      this.isShowSaveBtn = true;
    },
    updateUserInfo() {
      var _this = this;
      console.log(_this.qqIsValid());
      //正则校验
      // if (!this.realNameIsValid()) {
      // 	uni.showToast({
      // 		icon: 'none',
      // 		title: '姓名不能超过8位！',
      // 	})
      // 	return;
      // } else
      // if (!_this.WeChatIsValid()) {
      // 	uni.showToast({
      // 		icon: 'none',
      // 		title: '微信号不存在！',

      // 	})
      // 	return;
      // }
      if (!_this.qqIsValid()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('Telegram不存在！'),
        });
        return;
      }
      if (!_this.emailIsValid()) {
        uni.showToast({
          icon: "none",
          title: _this.$t('邮箱不存在'),
        });
        return;
      }
      var data = {
        avatar: _this.avatar,
        realName: _this.realName,
        phone: _this.phone,
        wechat: _this.wechat,
        qq: _this.qq,
        email: _this.email,
        birthday: _this.birthday,
        nickName: _this.nickName,
        sex: _this.sex,
        codePrefix: _this.codePrefix,
      };
      //有更改，传新值；无更改，传null
      uni.getStorage({
        key: "userData",
        success: function (res) {
          console.log(res.data, "获取本地");
          var userData = res.data;
          for (var k in userData) {
            var k1 = k + "1";
            if (data[k] == userData[k]) {
              _this[k1] = null;
              // console.log(_this[k1])
            } else {
              _this[k1] = _this[k];
              // console.log(_this[k1])
            }
          }

          //更新会员接口
          _this.$api.updateInfo(
            _this.avatar1,
            _this.birthday1,
            _this.email1,
            _this.nickName1,
            _this.phone1,
            _this.qq1,
            _this.realName1,
            _this.sex1,
            _this.userId,
            _this.wechat1,
            _this.codePrefix,
            function (err, res) {
              if (err) {
                console.log(err, "更新会员失败");
                uni.showToast({
                  icon: "none",
                  title: err.msg,
                });
              } else {
                console.log(res, "更新会员完成");
                uni.showToast({
                  title: _this.$t('更新会员完成'),
				  icon: "none",
                });
                setTimeout(function () {
                  //跳转到我的页面
                  uni.navigateTo({
                    url: "../my/my",
                  });
                }, 1000);
              }
            },
            false
          );
        },
      });
    },
    goBack() {
        uni.navigateBacks();
    },
    userInfoSave() {
      console.log(11111111);
      //保存个人信息
      this.updateUserInfo();
    },
  },
  computed: {
    initRealName() {
      //真实姓名加密
      if (this.realNameValue) {
        var strLength = this.realNameValue.length;
        var str = this.realNameValue.substr(0, 1);
        for (var i = 0; i < strLength - 1; i++) {
          str += "*";
        }
        //new Array(strLength-1).join("*")
        return str.substr(0, 12);
      } else {
        return this.realNameValue;
      }
    },
  },
};
</script>

<style scoped>
.personal {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  flex-direction: column;
}

.my-jb-img {
  width: 114rpx;
  height: auto;
  vertical-align: middle;
  margin-left: 10upx;
}

.perHeader {
  width: 100%;
  /* #ifdef APP-PLUS */
  height: calc(88upx + var(--status-bar-height));
  /* #endif */
  /* #ifdef H5 */
  height: 88upx;
  /* #endif */
  color: #fff;
}

.perHeaderReal {
  width: 100%;
  display: flex;
  align-items: center;
  height: 88upx;
  padding: 0 30upx;
  box-sizing: border-box;
  color: var(--themeActTitleBg);
  background-color: var(--themeActTopBg);
}

.perBody {
  flex: 1;
  padding: 0 30upx;
  box-sizing: border-box;
  background-color: #fff;
}

.perHeaderReal view:nth-child(1) {
  width: 44upx;
  height: 44upx;
  background: url(../../static/image/back.png) no-repeat;
  background-size: cover;
  background-repeat: no-repeat;
}

.perHeaderReal view:nth-child(2) {
  flex: 1;
  font-size: 36upx;
  font-weight: bold;
  text-align: center;
}

.perHeaderReal view:nth-child(3) {
  width: 88upx;
  font-size: 28upx;
  text-align: right;
  visibility: hidden;
}

.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #fff;
}

.perTop {
  width: 100%;
  padding: 48upx 0 68upx 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.perName {
  width: 156upx;
  font-size: 30upx;
  display: flex;
  justify-content: flex-start;
  font-weight: bold;
}

.balanceVal {
  font-size: 28upx;
  font-weight: bold;
}

.userImage > image {
  width: 180upx;
  height: 180upx;
  border-radius: 90upx;
  flex-shrink: 0;
}

.accountVip {
  width: 114upx;
  height: 44upx;
  background-size: cover;
  background-repeat: no-repeat;
}

.perContent {
  width: 100%;
  height: auto;
  padding: 0 32upx 0 16upx;
  background-color: #ffffff;
  box-sizing: border-box;
  border-radius: 16upx;
}

.perRow {
  height: 106upx;
  border-bottom: 2upx solid #f6f6f6;
  display: flex;
  align-items: center;
}

.perRow > .perIcon {
  width: 40upx;
  height: 40upx;
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 16upx;
}

.perRow > .perRowName {
  height: 100%;
  display: flex;
  align-items: center;
}

.perRow > .perRowVal {
  flex: 1;
  height: 100%;
  font-size: 30upx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.perRowVal >>> .uni-input-input {
  text-align: right !important;
}

.perRowVal >>> .uni-input-placeholder {
  font-size: 28upx !important;
  text-align: right !important;
}

.perPhone {
  height: 106upx;
  line-height: 106upx;
  border-radius: 16upx;
  background-color: #fff;
  padding: 0 32upx 0 16upx;
  margin-bottom: 20upx;
}

.updatePhoneImg {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 61upx;
  height: 69upx;
  flex-shrink: 0;
}
</style>
