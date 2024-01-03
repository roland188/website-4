<template>
  <div class="personal">
        <!-- 个人资料 -->
        <div class="perInfo">
          <div class="perRow perInfoRow infoRealName">
            <div class="themeDark themeDark8">{{$t('姓名')}}：</div>
            <input
              type="text"
              class="input"
              :placeholder="$t('请输入姓名')"
              v-model="realName"
              :disabled="initUserData&&initUserData.realName ? true : false"
            />
          </div>
          <div class="perRow perInfoRow infoNickName">
            <div class="themeDark themeDark8">{{$t('昵称')}}：</div>
            <input
              type="text"
              class="input"
              v-model="nickname"
              maxlength="8"
              :placeholder="$t('请输入昵称')"
              :disabled="initUserData&&initUserData.nickname ? true : false"
            />
          </div>
          <div class="perRow perInfoRow phoneNumer">
            <div class="themeDark themeDark8">{{$t('手机号')}}：</div>
            <input
              type="text"
              class="input"
              maxlength="11"
              v-model="phone"
              :placeholder="$t('请输入手机号')"
              :disabled="initUserData&&initUserData.phone ? true : false"
            />
          </div>

          <div class="perRow perInfoRow infoBirthday">
            <div class="themeDark themeDark8">{{$t('生日')}}：</div>
            <div style="position:relative;flex:5;">
              <el-date-picker
                class="myDatePicker"
                v-model="birthday"
                type="date"
                :placeholder="$t('请输入生日')"
                value-format="timestamp"
                :disabled="initUserData&&initUserData.birthday ? true :false"
              ></el-date-picker>
            </div>
          </div>
          <!-- <div class="perRow perInfoRow infoQQ">
            <div class="themeDark themeDark8">{{$t('QQ')}}：</div>
            <input
              type="text"
              class="input"
              v-model="qq"
              :placeholder="$t('请输入QQ')"
              :disabled="initUserData&&initUserData.qq ? true :false"
            />
          </div>
          <div class="perRow perInfoRow infoWechat">
            <div class="themeDark themeDark8">{{$t('微信')}}：</div>
            <input
              type="text"
              class="input"
              v-model="wechat"
              :placeholder="$t('请输入微信')"
              :disabled="initUserData&&initUserData.wechat ? true :false"
            />
          </div> -->
          <div class="perRow perInfoRow infoEmail" style="margin-bottom:0.6rem;">
            <div class="themeDark themeDark8">{{$t('邮箱')}}：</div>
            <input
              type="text"
              class="input"
              v-model="email"
              :placeholder="$t('请输入邮箱')"
              :disabled="initUserData&&initUserData.email ? true: false"
            />
          </div>
          <div class="perSubmit">
            <div
              class="u-flex-all themeColorkBgc" @click="updateMembers"
            > 
            <el-button type="primary" round style="width: 100%;" :disabled='subDisabled'>{{$t('提交')}}</el-button></div>
          </div>
        </div>
  </div>
</template>
<script>
export default {
  name: "register",
  data() {
    return {
      userId: "",
      disabledBtn:false,
      isNavActive: 1,
      avatar: "",
      realName: "",
      realNameInit: "", //初始真实姓名
      realNameInitEncode: "", //初始真实姓名加密后的值
      nickname: "",
      birthday: "",
      wechat: "",
      qq: "",
      email: "",
      phone: "",
      smsCode: "", //短信验证码
      isBindPhone: 0, //默认为0，手机号未注册
      tempUserInfo: {},
      phoneInit: "", //初始真实手机号
      phoneInitEncode: "", //初始加密后手机号
      initUserData: null,
      subDisabled:false,
    };
  },
  created() {
    if (this.$common.getUser()) {
      this.userId = this.$common.getUser().user_id;
    }
    this.getMemberInfo()
  },
  mounted() {
  },
  methods: {
      //获取用户信息
    getMemberInfo: async function() {
      let _this = this;
      if (this.$common.getUser()) {
        this.userId = this.$common.getUser().user_id;
      }
      let data = "/" + _this.userId;
      const res = await _this.$http.get(_this.$api.members, data);
      if (res.code == 0) {
        //获取会员信息
        _this.initUserData = res.data;
        _this.userData = res.data;
        this.avatar = this.userData.avatar;
        this.realName = this.userData.realName;
        //真实姓名加密
        this.realNameEncode();
        //真实姓名初始值
        this.realNameInit = this.userData.realName;
        this.nickname = this.userData.nickname;
        this.birthday = this.userData.birthday;
        this.qq = this.userData.qq;
        this.wechat = this.userData.wechat;
        this.email = this.userData.email;
        this.isBindPhone = this.userData.bindPhone; //是否綁定手機號
        this.phone = this.userData.phone;
        //手机号加密
        this.encodePhone();
        //手机号真实初始值
        this.phoneInit = this.userData.phone;

        var userInfo = {
          avatar: res.data.avatar,
          realName: res.data.realName,
          phone: res.data.phone,
          wechat: res.data.wechat,
          qq: res.data.qq,
          email: res.data.email,
          birthday: res.data.birthday,
          nickname: res.data.nickname
        };
        
      if (
          this.realName &&
          this.nickname  &&
          this.phone  &&
          this.birthday  &&
          this.qq  &&
          this.wechat  &&
          this.email
        ){
          this.subDisabled = true;
        }
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } else {
        this.$message.error(res.msg);
      }
    },
    //手机格式验证
    phoneIsValid() {
      if (this.phone == this.phoneInitEncode) {
        return true;
      }
      return /^1[3456789]\d{9}$/.test(this.phone);
    },
    //微信号校验(支持纯数字)
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
        return /^[1-9][0-9]{4,14}$/.test(this.qq);
      } else {
        return true;
      }
    },
    // email校验
    emailIsValid() {
      if (this.email) {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(
          this.email
        );
      } else {
        return true;
      }
    },
    //更新会员信息
    async updateMembers() {
      var _this = this;
      if (this.membersDisabled) {
        return;
      }
      // if(!this.phoneIsValid()){
      //   this.$message.error(this.$t("手机号码不正确"));
      //   return;
      // }else 
      if (!this.qqIsValid()) {
        this.$message.error(this.$t("QQ号码不存在！"));
        return;
      } else if (!this.WeChatIsValid()) {
        this.$message.error(this.$t("微信号码不存在！"));
        return;
      } else if (!this.emailIsValid()) {
        this.$message.error(this.$t("邮箱不存在！"));
        return;
      }
      //更新会员信息接口
      await _this.updateMembersInter();
    },
    async updateMembersInter() {
      //更新会员信息接口
      var _this = this;
      var userInfo = JSON.parse(localStorage.getItem("userInfo"));

      //有改变，传新值；无改变，传null
      for (const k in userInfo) {
        var k1 = k + "1";
        //realName
        if (k == "realName") {
          //realName没有变化
          if (this.realName == this.realNameInitEncode) {
            _this.$set(_this.tempUserInfo, k1, null);
          } else if (!this.realName) {
            //清空了原有数据，return
            this.$message({
              message:this.$t('只能修改，不能清空哦'),
              type: "warning"
            });
            return;
          } else {
            _this.$set(_this.tempUserInfo, k1, _this[k]);
          }
        } else if (k == "phone") {
          //phone没有变化
          if (this.phone == this.phoneInitEncode) {
            _this.$set(_this.tempUserInfo, k1, null);
          } else {
            _this.$set(_this.tempUserInfo, k1, _this[k]);
          }
        } else if (k == "sex") {
          //性别 0/1
          if (userInfo[k] == _this[k]) {
            _this.$set(_this.tempUserInfo, k1, null);
          } else if (userInfo[k] != _this[k]) {
            _this.$set(_this.tempUserInfo, k1, _this[k]);
          }
        } else {
          //其他
          if (userInfo[k] == _this[k]) {
            _this.$set(_this.tempUserInfo, k1, null);
          } else if (userInfo[k] != _this[k] && _this[k]) {
            _this.$set(_this.tempUserInfo, k1, _this[k]);
          } else {
            this.$message({
              message: this.$t("只能修改，不能清空哦"),
              type: "warning"
            });
            return;
          }
        }
      }
      var data = {
        avatar: _this.tempUserInfo.avatar1,
        birthday: _this.tempUserInfo.birthday1,
        email: _this.tempUserInfo.email1,
        nickname: _this.tempUserInfo.nickname1,
        phone: _this.tempUserInfo.phone1,
        qq: _this.tempUserInfo.qq1,
        realName: _this.tempUserInfo.realName1,
        // sex: _this.tempUserInfo.sex1,
        userId: _this.userId,
        wechat: _this.tempUserInfo.wechat1,
        codePrefix: this.$config.codePrefix,
      };
      var res = await _this.$http.put(_this.$api.updateInfo, data);
      if (res.code == 0) {
        this.$message.success(this.$t("更新会员成功"));
        // true,更新会员信息
        //重新获取会员信息
        this.getMemberInfo()
      } else {
        this.$message.error(res.msg);
      }
    },
    //绑定手机号
    async bindPhone() {
      var _this = this;
      if (!this.bindPhoneDisabled) {
        return;
      }
      //绑定手机号接口
      await _this.bindPhoneInter();
    },
    //绑定手机号接口
    async bindPhoneInter() {
      var _this = this;
      if (this.phone == this.phoneInitEncode) {
        //手机号没变化
        var data = {
          phone: this.phoneInit,
          smsCode: this.smsCode
        };
      } else {
        //手机号改变
        var data = {
          phone: this.phone,
          smsCode: this.smsCode
        };
      }

      var res = await _this.$http.post(_this.$api.bindPhone, data);
      if (res.code == 0) {
        this.$message.success(this.$t("绑定手机号成功"));
      } else {
        this.$message.error(res.msg);
      }
    },
    //真实姓名加密
    realNameEncode() {
      if (this.realName) {
        var strLength = this.realName.length;
        this.realName =
          this.realName.substr(0, 1) + new Array(strLength).join("*");
        this.realNameInitEncode = this.realName;
      }
    },
    //手机号加密
    encodePhone() {
      if (this.phone) {
        this.phone = this.phone.substr(0, 3) + "****" + this.phone.substr(-4);
        this.phoneInitEncode = this.phone;
      }
    },
  },
  computed: {
    bindPhoneDisabled() {
      return this.phone && this.smsCode;
    },
  },
};
</script>
<style >
   .personal .el-input__inner{
       height: 0.44rem;
       line-height: 0.44rem;
       border: none;
       padding-left: 0.08rem!important;
   }
   .personal .el-input__inner::-webkit-input-placeholder{
       color: #616161;
   }
  .personal .el-input.is-disabled .el-input__inner{
        background-color: #fff;
        color: #000;
  }
</style>
<style scoped>
.personal{
    /* padding: 0 25%; */
    width: 1180px;
    margin:  0 auto;
}
.personal .input{
    background-color: #fff;
}
.perDialog {
  box-sizing: border-box;
  position: relative;
}

.alertHeader {
  padding: 0.32rem;
  border-top-left-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
  position: relative;
}
.alertTitle {
  font-size: 24px;
}
.perBody {
  min-height: 6.27rem;
  padding: 0 0.7rem 0.4rem;
  box-sizing: border-box;
  position: relative;
}
.perNav {
  padding-bottom: 0.2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.perNavBtn {
  width: 0.94rem;
  height: 0.49rem;
  border-bottom: 0.03rem solid transparent;
  font-size: 0.14rem;
}
.perRow {
  padding-top: 0.16rem;
  box-sizing: border-box;
  display: flex;
}
.perRow > div,
.perRow > input {
  height: 0.44rem;
  line-height: 0.44rem;
}
.perRow > div:nth-child(1) {
  font-size: 0.15rem;
  flex: 1;
  display: flex;
  box-sizing: border-box;
}
.perRow > input {
  flex: 4;
}

.perInfoRow > input {
  flex: 5;
}
.infoSex {
  font-size: 0.15rem;
}
.infoSex > div:nth-child(1) {
  flex: none;
  width: 18%;
}
/* .infoSex > input {
  flex: none;
} */
.infoSex .unSelectRadio {
  width: 0.14rem;
  height: 0.14rem;
  border: 0.01rem solid rgba(51, 51, 51, 1);
  border-radius: 50%;
  opacity: 1;
  position: relative;
  margin-right: 0.14rem;
}

.infoSex .selectRadio {
  border: 0.01rem solid rgba(50, 160, 237, 1);
}
.infoSex .selectRadioInner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.07rem;
  height: 0.07rem;
  background: rgba(50, 160, 237, 1);
  border-radius: 50%;
  opacity: 1;
}

.smsCode {
  position: relative;
}
.smsCode > div:nth-child(1) {
  flex: none;
  width: 20%;
}
.smsCode > input {
  width: calc(80% - 1.08rem);
  flex: none;
  padding-right: 0.11rem;
  box-sizing: border-box;
}
.smsCodeBtn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 1rem;
  height: 0.34rem;
  background: #329feb;
  border-radius: 0.04rem;
  font-size: 0.12rem;
  color: #fff;
  z-index: 99;
}
.smsCodeDisabled {
  opacity: 0.5;
}
.perSubmit {
  margin-top: 0.2rem;
  box-sizing: border-box;
  text-align: center;
}
.perSubmit > div {
  width: 100%;
  height: 0.46rem;
  border-radius: 0.25rem;
  font-size: 0.16rem;
}
.bindedPhoneNumber {
  flex: 5;
  padding-left: 0.08rem;
  border: 1px solid rgba(204, 214, 228, 1);
  border-radius: 0.08rem;
  box-sizing: border-box;
  color: #999999;
}
.myDatePicker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 0.44rem;
  z-index: 99;
}

.myDatePicker > input {
  padding: 0 !important;
}
/* .myDatePicker > input::placeholder {
  font-size: 0.14rem !important;
  color: #a7a7a7;
} */
</style>
<style lang="less">
.el-dialog {
  /* 居中对齐 */
  margin: 0 !important;
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.personal .el-dialog {
  max-height: 100% !important;
}
.perDialog .el-dialog__header {
  padding: 0 !important;
}

.perDialog .el-dialog__body {
  padding: 0 !important;
}
.perDialog .el-date-editor.el-input {
  width: 100%;
}
// 禁用样式
.perDialog .el-input.is-disabled .el-input__inner {
  background: #f4f4f4;
  color: #9695a6 !important;
}
.perDialog .el-input--suffix .el-input__inner {
  height: 0.44rem;
  line-height: 0.44rem;
  padding-left: 0.08rem;
  // border: 1px solid rgba(204, 214, 228, 1);
  border-radius: 0.08rem;
  box-sizing: border-box;
  font-size: 0.16rem;
  display: flex;
  align-items: center;
  outline: none;
  // color: #333;
}
.perDialog .el-input--suffix .el-input__inner::placeholder {
  font-size: 0.14rem !important;
  // color: #a7a7a7;
}
.perDialog .el-input--suffix .el-input__inner:focus {
  border: 1px solid var(--themeColor) !important;
}
.perDialog .el-input--prefix .el-input__inner {
  padding-right: 0;
}
.perDialog .el-input__prefix {
  left: 0;
}
.perDialog .el-input__prefix i.el-input__icon {
  line-height: 100%;
  display: none;
}

.perDialog .el-input__suffix .el-input__suffix-inner .el-input__icon {
  height: 0.44rem;
  width: 0.25rem;
  text-align: center;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  line-height: 0.44rem;
}

.personal .el-dialog__wrapper {
  overflow: hidden;
}
</style>
