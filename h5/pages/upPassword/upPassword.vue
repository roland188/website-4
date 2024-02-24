<!-- 平头哥 -->
<template>
  <view class="passwordBox">
    <uni-nav-bar
      :title="title"
      leftIcon="back"
      :status-bar="true"
      :fixed="true"
      :shadow="false"
      background-color="#000"
      color="#fff"
      @clickLeft="onLeft"
    >
    </uni-nav-bar>
    <view v-if="type != 3" class="">
      <view v-if="isPassWord === 'true'" class="passwordTop">
        <view class="passwordList">
          <view class="passwordName themeTextOne oneTitleColor8">
            {{ type == 1 ? $t('原登录密码') : $t('原取款密码')}}
          </view>
          <input
            class="input themeTextOne oneTitleColor8 oldPassword"
            v-model="oldPassword"
            :placeholder="$t('输入原密码')"
            placeholder-class="inputPlace"
            placeholder-style="color:#C3C3C3"
            :type="type1 ? 'text' : 'password'"
            value=""
          />
          <view class="passwordIcon" @click="checkType(1)">
            <image v-if="type1" class="showIcon" src="../../static/image/qqImg/cShow.png" mode=""></image>
            <image v-else class="showIcon" src="../../static/image/qqImg/cNone.png" mode=""></image>
          </view>
        </view>
        <view class="passwordList">
          <view class="passwordName themeTextOne oneTitleColor8">
            {{ type == 1 ? $t('新登录密码') : $t('新取款密码') }}
          </view>
          <input
            class="input themeTextOne oneTitleColor8 oldPassword"
            v-model="newPassword"
            :placeholder="$t('输入新密码')"
            placeholder-style="color:#C3C3C3"
            :type="type2 ? 'text' : 'password'"
            value=""
            @blur="newPasswordBlur"
          />
          <view class="passwordIcon" @click="checkType(2)">
            <image v-if="type2" class="showIcon" src="../../static/image/qqImg/cShow.png" mode=""></image>
            <image v-else class="showIcon" src="../../static/image/qqImg/cNone.png" mode=""></image>
          </view>
        </view>
        <view class="passwordList">
          <view class="passwordName themeTextOne oneTitleColor8">
            {{ type == 1 ? $t('确认新密码') : $t('确认新密码') }}
          </view>
          <input
            class="input themeTextOne oneTitleColor8 oldPassword"
            v-model="aeginPassword"
            :placeholder="$t('再次输入密码')"
            placeholder-style="color:#C3C3C3"
            :type="type3 ? 'text' : 'password'"
            value=""
            @blur="aeginPasswordBlur"
          />
          <view class="passwordIcon" @click="checkType(3)">
            <image v-if="type3" class="showIcon" src="../../static/image/qqImg/cShow.png" mode=""></image>
            <image v-else class="showIcon" src="../../static/image/qqImg/cNone.png" mode=""></image>
          </view>
        </view>
      </view>
      <view v-else class="passwordTop">
        <view class="passwordList">
          <view class="passwordName themeTextOne oneTitleColor8"> {{ $t('设置密码') }}： </view>
          <input
            class="input themeTextOne oneTitleColor8 oldPassword"
            v-model="oldPassword"
            :placeholder="$t('输入新密码')"
            placeholder-style="color:#C3C3C3"
            :type="type2 ? 'text' : 'password'"
            value=""
          />
          <view class="passwordIcon" @click="checkType(2)">
            <image v-if="type2" class="showIcon" src="../../static/image/qqImg/cShow.png" mode=""></image>
            <image v-else class="showIcon" src="../../static/image/qqImg/cNone.png" mode=""></image>
          </view>
        </view>
        <view class="passwordList">
          <view class="passwordName themeTextOne oneTitleColor8"> {{ $t('确认密码') }}： </view>
          <input
            class="input themeTextOne oneTitleColor8 oldPassword"
            v-model="aeginPassword"
            :placeholder="$t('再次输入密码')"
            placeholder-style="color:#C3C3C3"
            :type="type3 ? 'text' : 'password'"
            value=""
          />
          <view class="passwordIcon" @click="checkType(3)">
            <image v-if="type3" class="showIcon" src="../../static/image/qqImg/cShow.png" mode=""></image>
            <image v-else class="showIcon" src="../../static/image/qqImg/cNone.png" mode=""></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 手机 -->
    <view v-else class="passwordTop">
      <view class="passwordList">
        <view class="passwordName themeTextOne oneTitleColor8"> {{ $t('新手机号') }}： </view>
        <input
          maxlength="11"
          class="input themeTextOne oneTitleColor8 oldPassword"
          v-model="phone"
          :placeholder="$t('请输入新手机号码')"
          placeholder-style="color:#C3C3C3"
          :type="type3 ? 'text' : 'password'"
          value=""
        />
      </view>
      <view v-if="type == 3" class="passwordList" style="position: relative">
        <view class="passwordName themeTextOne oneTitleColor8 mwidth"> {{ $t('验证码') }}： </view>
        <input
          class="input themeTextOne oneTitleColor8 oldPassword verifyCode"
          v-model="code"
          maxlength="20"
          :placeholder="$t('请输入验证码')"
          placeholder-style="color:#C3C3C3"
          :type="type3 ? 'text' : 'password'"
          value=""
        />
        <view class="phoneGet" @tap="getCode()" :class="!isDisable ? 'unDisabled' : 'disabled'">
          {{ count == 0 ? $t('获取验证码') : count + "S" }}
        </view>
      </view>
    </view>

    <view class="passwordKong">
      <view v-if="errtext" class="errText">
        {{ errtext }}
      </view>
    </view>
    <view class="passwordBottom">
      <view class="passBtn gameListActive" @click="submit()">
        {{ type == 3 ? $t('确认') : $t('确认提交') }}
      </view>
      <view v-if="type != 3" class="passWen">
        <text class="passYou">{{ $t('有问题？请联系') }}</text>
        <view class="passLink linkTextColor" @tap="goKe()"> {{ $t('在线客服') }} </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: 1,
      oldPassword: "", //旧密码
      newPassword: "", //新密码
      aeginPassword: "", //确认密码
      errtext: "",
      type1: "text", //默认type旧密码
      type2: "text", //默认type新密码
      type3: "text", //默认type确定密码
      phone: "",
      code: "",
      count: 0,
      timer: null,
      isDisable: false,
      isPassWord: false,
      title: "",
    };
  },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    this.type = option.type;
    console.log(option);
    this.isPassWord = option.isPassWord;
    if (option.type == 1) {
      this.title = this.$t('修改登录密码');
      // uni.setNavigationBarTitle({
      // 	title: '修改登录密码'
      // })
    } else if (option.type == 2) {
      this.title = this.$t('修改取款密码');
      console.log(this.isPassWord);
      if (this.isPassWord === "true") {
        this.title = this.$t('修改取款密码');
        // uni.setNavigationBarTitle({
        // 	title: '修改取款密码'
        // })
      } else {
        this.title = this.$t('设置取款密码');
        // uni.setNavigationBarTitle({
        // 	title: '设置取款密码'
        // })
      }
    } else {
      this.title = this.$t('修改手机号码');
      // uni.setNavigationBarTitle({
      // 	title: '修改手机号码'
      // })
    }
  },
  methods: {
    passwordIsValid() {
      //密码校验
      // return /^[a-zA-Z0-9]{6,15}$/.test(this.oldPassword);
      return true;
    },
    aeginPasswordIsValid() {
      //密码校验
      return /^[a-zA-Z0-9]{6,15}$/.test(this.aeginPassword);
    },
    newPasswordIsValid() {
      //密码校验
      // return /^[a-zA-Z0-9]{6,15}$/.test(this.newPassword);
      return true;
    },
    oldTradePasswordIsValid() {
      //取款密码校验
      return /^[0-9]{6}$/.test(this.oldPassword);
    },
    newTradePasswordIsValid() {
      //取款密码校验
      return /^[0-9]{6}$/.test(this.newPassword);
    },
    // 修改登录密码
    upReset() {
      var req = [this.newPassword, this.oldPassword];
      let self = this;
      self.$api.updatePassword(
        ...req,
        function (err, res) {
          if (err) {
            console.log("%c" + "updatePassword", "color:#a70a0a;", err);
          } else {
            uni.showToast({
              title: self.$t('修改成功'),
            });
            setTimeout(function () {
              uni.navigateBacks({
                delta: 1,
              });
            }, 1000);
          }
        },
        true
      );
    },
    // 修改取款密码
    upBankPwd() {
      var req = [this.newPassword, this.oldPassword];
      let self = this;
      self.$api.withdrawPass(
        ...req,
        function (err, res) {
          if (err) {
            console.log("%c" + "withdrawPass", "color:#a70a0a;", err);
          } else {
            uni.showToast({
              title: self.$t('设置成功'),
            });
            setTimeout(function () {
              uni.navigateBacks({
                delta: 1,
              });
            }, 1000);
          }
        },
        true
      );
    },
    onLeft() {
      uni.navigateBacks({
        delta: 2,
      });
    },
    // 设置取款密码
    upBankPwdSet() {
      var req = [this.oldPassword];
      let self = this;
      self.$api.withdrawPassSet(
        ...req,
        function (err, res) {
          if (err) {
            console.log("%c" + "withdrawPass", "color:#a70a0a;", err);
          } else {
            uni.showToast({
              title: self.$t('设置成功'),
            });
            setTimeout(function () {
              uni.navigateBacks({
                delta: 1,
              });
            }, 1000);
          }
        },
        true
      );
    },
    // 提交
    submit(type) {
      const self = this
      let types = this.type;
      if (types != 3) {
        // if (!this.passwordIsValid()) {
        // 	this.errtext = '原密码密码至少为6位字母或数字'
        // 	return
        // }

        if (this.isPassWord === "true") {
          //修改
          if (types == 1) {
            //登录密码
            if (!this.passwordIsValid()) {
              this.errtext = this.$t('原密码必须为4-10位,字母数字符号至少两种组合');
              return;
            }
          } else if (types == 2) {
            //取款密码
            if (!this.oldTradePasswordIsValid()) {
              this.errtext = this.$t('原取款密码必须为6位数字');
              return;
            }
          }
        } else {
          //设置--取款密码
          if (!this.oldTradePasswordIsValid()) {
            this.errtext = this.$t('新取款密码必须为6位数字');
            return;
          }
        }

        if (this.oldPassword == "" && this.isPassWord === "true") {
          this.errtext = this.$t('原密码不可为空');
          return;
        }

        if (this.oldPassword !== this.aeginPassword && this.isPassWord === "false") {
          this.errtext = this.$t('两次输入的密码不一致');
          return;
        }
        if (this.newPassword !== this.aeginPassword && this.isPassWord === "true") {
          this.errtext = this.$t('两次输入的密码不一致');
          return;
        } else {
          this.errtext = "";
          if (this.type == 1) {
            //登录

            if (!this.newPasswordIsValid()) {
              this.errtext = this.$t('新密码必须为4-10位,字母数字符号至少两种组合');
              return;
            }

            this.upReset();
          } else {
            if (this.isPassWord === "true") {
              //取款密码
              if (!this.newTradePasswordIsValid()) {
                this.errtext = this.$t('新取款密码必须为6位数字');
                return;
              }

              // if (!this.newPasswordIsValid()) {
              // 	this.errtext = '新密码必须为4-10位字母或数字！'
              // 	return
              // }
              this.upBankPwd();
            } else {
              this.upBankPwdSet();
            }
          }
        }
      } else {
        //绑定手机号接口
        this.$api.bindPhone(
          this.phone,
          this.code,
          function (err, res) {
            if (err) {
              console.log(err, "绑定手机号失败");
              uni.showToast({
                icon: "none",
                title: err.msg,
              });
            } else {
              console.log(res, "绑定手机号成功");
              uni.showToast({
                icon: "none",
                title: self.$t('手机号绑定成功'),
              });
              //修改手机号成功
              uni.navigateTo({
                url: "../Personal/Personal",
              });
            }
          },
          false
        );
      }
    },
    // 切换类型
    checkType(type) {
      if (type == 1) {
        //旧密码
        this.type1 = !this.type1;
      } else if (type == 2) {
        //旧密码
        this.type2 = !this.type2;
      } else if (type == 3) {
        //旧密码
        this.type3 = !this.type3;
      }
    },
    // 获取验证码
    getCode() {
      const self = this
      const TIME_COUNT = 59;
      if (this.phone == "") {
        this.errtext = this.$t('手机号不可为空');
        return;
      }
      // if (!/^1[3456789]\d{9}$/.test(this.phone)) {
      //   uni.showToast({
      //     title: self.$t('手机格式不正确'),
      //     icon: false,
      //   });
      //   return;
      // }
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.isDisable = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
            this.isDisable = false;
          }
        }, 1000);
        //手机验证码接口
        this.$api.sendSmsCode(
          this.phone,
          2,
          function (err, res) {
            if (err) {
              console.log(err, "获取手机验证码失败");
            } else {
              console.log(res, "获取手机验证码完成");
            }
          },
          false
        );
      }
    },
    // 联系客服
    goKe() {
      uni.navigateTo({
        url: "/pages/subCustomerService/subCustomerService",
      });
    },
    newPasswordBlur() {
      //大写转小写
      // this.newPassword = this.newPassword.toLowerCase();
      //空格处理
      // this.newPassword = this.newPassword.replace(/\ /g, "");
    },
    aeginPasswordBlur() {
      //大写转小写
      // this.aeginPassword = this.aeginPassword.toLowerCase();
      //空格处理
      // this.aeginPassword = this.aeginPassword.replace(/\ /g, "");
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
</style>
