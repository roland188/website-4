<template>
  <div id="agent-apply">
    <div class="wrap">
      <p class="title">{{ $t('代理申请') }}</p>
      <el-form
        v-if="!resultsShow"
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="175px"
      >
        <el-form-item :label="$t('账号') + '：'" prop="account">
          <el-input
            v-model="form.account"
            :placeholder="$t('输入申请账号')"
            maxlength="15"
            @blur="blurHandler('account')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('密码') + '：'" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            :placeholder="$t('输入账户密码')"
            maxlength="16"
            @blur="blurHandler('password')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('确认密码') + '：'" prop="confirmPas">
          <el-input
            type="password"
            v-model="form.confirmPas"
            :placeholder="$t('再次输入密码')"
            maxlength="16"
            @blur="blurHandler('confirmPas')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('姓名') + '：'" prop="name2">
          <el-input
            v-model="form.name2"
            :placeholder="$t('请输入姓名')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('手机号') + '：'" prop="phone">
          <div class="code">{{ $config.codePrefix }}</div>
          <el-input
            v-model="form.phone"
            :placeholder="$t('请输入手机号')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('生日') + '：'" prop="birthday2">
          <el-date-picker
            v-model="form.birthday2"
            type="date"
            :placeholder="$t('请选择生日')"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <!-- <el-form-item label="QQ：" prop="qq2">
          <el-input
            v-model="form.qq2"
            :placeholder="$t('请输入qq')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('微信') + '：'" prop="wechat2">
          <el-input
            v-model="form.wechat2"
            :placeholder="$t('请输入微信号')"
          ></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('性别') + '：'" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">{{ $t('男') }}</el-radio>
            <el-radio :label="0">{{ $t('女') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('邮箱') + '：'" prop="email2">
          <el-input
            v-model="form.email2"
            :placeholder="$t('请输入邮箱')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('地址') + '：'" prop="address2">
          <el-input
            v-model="form.address2"
            :placeholder="$t('请输入地址')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div v-if="resultsShow" class="agent-results">
        <p>{{ $t('提交成功，请在3日内与专员联系开通， 并提供您的代理编号和代理链接。') }}</p>
      </div>
      <div class="submit">
        <el-button v-if="!resultsShow" class="agent-submit" type="primary" round @click="submitForm('ruleForm')">{{ $t('立即申请') }}</el-button>
        <el-button v-if="resultsShow" class="iknow-btn" type="primary" round @click="toHome()">{{ $t('知道了') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "agentApply",
  data() {
    //账户校验
    const checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('请输入账号')));
      } else {
        if (!/^[a-zA-Z0-9]{4,15}$/.test(value)) {
          callback(new Error(this.$t('请输入{x}位字母或数字', { x: '4-15' })));
        } else {
          callback();
        }
      }
    };
    //手机号校验
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('手机号不能为空')));
      }
      callback()
      // 越南站点，按照产品要求直接放开限制
      // else {
      //   const reg = /^\d{10,11}$/;
      //   if (reg.test(value)) {
      //     callback();
      //   } else {
      //     return callback(new Error(this.$t('请输入正确的手机号')));
      //   }
      // }
    };
    //密码校验
    const validatePsdReg = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('请输入密码')));
      } else {
        if (!/^[a-zA-Z0-9]{6,16}$/.test(value)) {
          callback(new Error(this.$t('请输入{x}位字母或数字', { x: '6-16' })));
        } else {
          callback();
        }
      }
    };
    //二次密码确认
    const passwordChecking = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('请输入密码')));
      } else {
        if (value !== this.form.password) {
          callback(new Error(this.$t('两次密码不一致,请重新输入')));
        } else {
          callback();
        }
      }
    };
    //姓名校验
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('请输入姓名')));
      }
      callback()
      // 越南站放开限制
      // else {
      //   if (!/^.{0,8}$/.test(value)) {
      //     callback(new Error(this.$t('姓名不能超过8位')));
      //   } else {
      //     callback();
      //   }
      // }
    };
    //生日校验
    const checkBirth = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('请选择生日')));
        callback();
      } else {
        callback();
      }
    };
    //qq校验
    const checkQQ = (rule, value, callback) => {
      const reg = /^[1-9]\d{4,10}$/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error(this.$t('请输入正确的qq号')));
        }
      } else {
        callback();
      }
    };
    //微信校验
    const checkWechat = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z\d_-]{5,19}$/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error(this.$t('请输入正确的微信号')));
        }
      } else {
        callback();
      }
    };
    //邮箱校验
    const checkEmail = (rule, value, callback) => {
      const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error(this.$t('请输入正确的邮箱')));
        }
      } else {
        callback();
      }
    };
    return {
      rules: {
        account: [{ required: true, validator: checkAccount, trigger: "blur" },],
        password: [{ required: true, validator: validatePsdReg, trigger: "blur" },],
        confirmPas: [{ required: true, validator: passwordChecking, trigger: "blur" },],
        name2: [{ required: true, validator: checkName, trigger: "blur" }],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        birthday2: [{ required: true, validator: checkBirth, trigger: "blur" }],
        qq2: [{ required: false, validator: checkQQ, trigger: "blur" }],
        wechat2: [{ required: false, validator: checkWechat, trigger: "blur" }],
        email2: [{ required: false, validator: checkEmail, trigger: "blur" }],
      },
      form: {
        account: "", //用户名
        password: "", //密码
        confirmPas: "", //确认密码
        name2: "", //姓名
        phone: "", //号码
        birthday2: "", //生日
        qq2: "",
        wechat2: "",
        sex: 1,
        email2: "",
        address2: ""
      },
      resultsShow: false
    };
  },
  computed: {},
  mounted() {
  },
  methods: {
    //提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            phone: this.form.phone,
            password: this.form.password,
            name: this.form.account, //账户名
            nickname: this.form.name2 || "", //姓名
            birthday: this.form.birthday2 || "", //生日
            qq: this.form.qq2 || "",
            wechat: this.form.wechat2 || "",
            sex: this.form.sex || "", //性别
            email: this.form.email2 || "", //邮箱
            address: this.form.address2 || "" //地址
          };
          //账号处理
          if (window.mergeAccount) {
            data.name = this.form.account + window.mergeAccount;
          }
          this.$set(data, "clientItem", window.childCode);
          this.$set(data, "appId", window.theme);
          this.$http.post(this.$api.appSave, data,true).then(res => {
            if (res.code == 0) {
              this.resultsShow = true;
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error(this.$t('请输入完整信息'));
        }
      });
    },
    //大写转小写
    blurHandler(name) {
      // this.form[name] = this.form[name].toLowerCase();
      //全角转半角
      this.form[name] = this.toCDB(this.form[name]);
    },
    //全角转为半角
    toCDB(str) {
      var tmp = "";
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) == 12288) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
        }
        if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        } else {
          tmp += String.fromCharCode(str.charCodeAt(i));
        }
      }
      return tmp;
    },
    toHome() {
      this.$router.push({ path: "/home" });
    }
  },
};
</script>

<style lang="scss" scoped>
#agent-apply {
  background-color: #f2f2f2;
  .wrap {
    width: 700px;
    padding: 20px 0;
    min-height: 450px;
    margin: 0 auto;
    .title {
      font-size: 28px;
      // padding-left: 100px;
      font-weight: bolder;
      color: #000;
      text-align: center;
      margin-bottom: 20px;
    }
    .el-form {
      .el-form-item {
        margin-bottom: 20px;
        label {
          color: #c0c4cc;
        }
        .el-date-editor.el-input, .el-date-editor.el-input__inner {
          width: 100%;
        }
      }
    }
    .agent-results {
      padding-left: 100px;
      padding-bottom: 100px;
      color: #007dff;
      font-size: 14px;
      text-align: center;
    }
    .submit {
      padding-left: 100px;
      .agent-submit {
        width: 100%;
        // margin-top: 30px;
        background-color: #a58f5a;
        border: none;
      }
      .iknow-btn {
        width: 100%;
        margin-top: 30px;
        background-color: #e5414a;
        border: none;
      }
    }
  }
}
</style>
