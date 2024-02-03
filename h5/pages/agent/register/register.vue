<template>
  <view>
    <uni-nav-bar leftIcon="back" :title="$t('代理注册')" @clickLeft="BackPage" :fixed="true" :statusBar="true">
    </uni-nav-bar>
    <view class="content-wrap">
      <uni-forms :modelValue="formData" ref="form" :rules="rules">
        <uni-forms-item required :label="$t('账号') + ':'" name="account">
          <uni-easyinput type="text" v-model="formData.account" :placeholder="$t('请输入账号(长度4到15位)')" />
        </uni-forms-item>
        <uni-forms-item required :label="$t('密码') + ':'" name="password">
          <uni-easyinput type="password" v-model="formData.password" :placeholder="$t('请输入账号密码')" />
        </uni-forms-item>
        <uni-forms-item required :label="$t('密码') +':'" name="confirmPas">
          <uni-easyinput type="password" v-model="formData.confirmPas" :placeholder="$t('请再次输入账户密码')" />
        </uni-forms-item>
        <uni-forms-item required :label="$t('手机号')+':'" name="phone">
          <uni-easyinput type="text" v-model="formData.phone" maxlength="11" :placeholder="$t('请输入手机号')" />
        </uni-forms-item>
        <uni-forms-item :label="$t('姓名') + ':'" name="name2">
          <uni-easyinput type="text" v-model="formData.name2" :placeholder="$t('请输入姓名')" />
        </uni-forms-item>
        <uni-forms-item :label="$t('生日') + ':'" name="birthday2">
          <!-- <uni-easyinput type="text" v-model="formData.birthday2" @tap="toggleTab" :placeholder="$t('请输入生日')" /> -->
          <view type="text" disabled @tap="toggleTab" class="birthday" :class="{themeTextTwo : !formData.birthday2}">{{ formData.birthday2 ? formData.birthday2  : $t('请输入生日')}}</view>
        </uni-forms-item>

        <!-- <uni-forms-item label="QQ:" name="qq2">
          <uni-easyinput type="text" v-model="formData.qq2" :placeholder="$t('请输入Telegram')" />
        </uni-forms-item>
        <uni-forms-item :label="$t('WhatsApp') + ':'" name="wechat2">
          <uni-easyinput type="text" v-model="formData.wechat2" :placeholder="$t('请输入WhatsApp')" />
        </uni-forms-item> -->
        <uni-forms-item :label="$t('性别')+ ':'" name="sex">
          <uni-data-checkbox v-model="formData.sex" :localdata="range" @change="change"></uni-data-checkbox>
        </uni-forms-item>
        <uni-forms-item :label="$t('邮箱') + ':'" name="email2">
          <uni-easyinput type="text" v-model="formData.email2" :placeholder="$t('请输入邮箱')" />
        </uni-forms-item>
        <uni-forms-item :label="$t('地址')+':'" name="address2">
          <uni-easyinput type="text" v-model="formData.address2" :placeholder="$t('请输入地址')" />
        </uni-forms-item>
        <view class="reg-agreement" @tap="CheckboxChange">
          <view style="line-height: 0px">
            <image
              :src="isChecked ? '../../../static/image/qqImg/checked.png' : '../../../static/image/qqImg/unCheck.png'"
              style="width: 16px; height: 16px"
            ></image>
          </view>
          <text style="margin-left: 16upx; font-size: 28upx; line-height: 36upx"
            >{{ $t('已经满18周岁，并且同意本站') }}<text class="themeColor linkTextColor">{{ $t('《用户使用协议》') }}</text></text
          >
        </view>
        <button class="submit-btn" type="primary" @click="submitForm">{{ $t('立即申请') }}</button>
      </uni-forms>
    </view>
    <yuDatetimePicker @confirm="changeBirthday" 
        startYear="2010" ref="dateTime" 
        :isAll="true" :current="true"></yuDatetimePicker>
  </view>
</template>

<script>
import { uniForms, uniEasyinput, uniFormsItem, uniDataCheckbox, } from "@dcloudio/uni-ui";
import yuDatetimePicker from "@/components/yu-datetime-picker/yu-datetime-picker.vue";
export default {
  components: {
    uniForms,
    uniEasyinput,
    uniFormsItem,
    uniDataCheckbox,
    yuDatetimePicker,
  },
  data() {
    return {
      isChecked: true,
      formData: {
        account: "", //用户名
        password: "", //密码
        confirmPas: "", //确认密码
        name2: "", //姓名
        phone: "", //号码
        birthday2: "", //生日
        qq2: "",
        wechat2: "",
        sex: "", //性别
        email2: "", //邮箱
        address2: "", //地址
      },
      inputindex:1,
      range: [
        {
          value: 0,
          text: this.$t('男'),
        },
        {
          value: 1,
          text: this.$t('女'),
        },
      ],
      rules: {
        account: {
          rules: [
            {
              required: true,
              errorMessage: this.$t('请输入账号'),
            },
            {
              minLength: 4,
              maxLength: 15,
              errorMessage: this.$t('账号长度在 {minLength} 到 {maxLength} 个字符'),
            },
          ],
        },

        password: {
          rules: [
            {
              required: true,
              errorMessage:  this.$t('请输入正确的密码'),
            },
          ],
        },

        confirmPas: {
          rules: [
            {
              required: true,
              errorMessage: this.$t('请输入正确确认的密码'),
            },
            {
              validateFunction: function (rule, value, data, callback) {
                if (data.password !== data.confirmPas) {
                  callback(this.$t('两次密码不一致'));
                }
                return true;
              },
            },
          ],
        },

        phone: {
          rules: [
            {
              required: true,
              errorMessage: this.$t('请输入注册手机号码'),
            },
            {
              validateFunction: function (rule, value, data, callback) {
                let iphoneReg = /^[0-9]*$/;
                if (!iphoneReg.test(value)) {
                  callback(this.$t('手机号码格式不正确，请重新填写'));
                }
                return true;
              },
            },
          ],
        },
      },
    };
  },

  onReady() {
    // 需要在onReady中设置规则
    this.$refs.form.setRules(this.rules);
  },
  mounted(){
  },
  methods: {
    submitForm(form) {
      const self = this
      if (!this.isChecked) {
        uni.showToast({
          icon: "none",
          title: self.$t('请选择同意本站!'),
        });
        return;
      }
      this.$refs.form
        .submit()
        .then((res) => {
          let data = {
            phone: this.formData.phone,
            password: this.formData.password,
            name: this.formData.account, //账户名
            nickname: this.formData.name2, //姓名
            birthday: this.formData.birthday2, //生日
            // qq: this.formData.qq2,
            // wechat: this.formData.wechat2,
            sex: this.formData.sex, //性别
            email: this.formData.email2, //邮箱
            address: this.formData.address2, //地址
          };
          this.$api.getAppSave(
            data,
            (err, res) => {
              uni.showToast({
                icon: "success",
                title: self.$t('申请成功'),
              });
              // uni.navigateTo({
              // 	url: '/pages/index/index'
              // })
              setTimeout(() => {
                uni.navigateBacks();
              }, 4000);
            },
            true
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    change(val) {
      const sex = val.detail.value;
      this.formData.sex = sex;
    },
    CheckboxChange(e) {
      this.isChecked = !this.isChecked;
    },
    
    toggleTab() {
      this.$refs.dateTime.show();
      this.inputindex = 1;
    },
    //选择日期
    changeBirthday(time) {
      this.formData.birthday2 =  time.selectRes;
    },
    BackPage() {
      uni.navigateBacks({})
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep{
  .content-wrap{
    .uni-forms-item__label{
      width: 160rpx !important;
    }
  }
  .birthday{
    width: 100%;
    min-height: 72rpx;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    font-size: 26rpx;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    background-color: #fff;
    padding-left: 20rpx;
  }
  .themeTextTwo{
    color: #999;
    font-size: 22rpx;
    font-weight: 200;
  }
}
.content-wrap {
  padding: 17px;

  .reg-agreement {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #939393;
    margin: 25px 0;

    ::v-deep .uni-data-checklist .checklist-group .checklist-box {
      margin: 0;
    }
  }

  .submit-btn {
    width: 80%;
    border-radius: 100px;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(60deg, #e0b74a, #fce760);
  }

  ::v-deep .is-input-border {
    background: #fff;
  }
}
</style>
