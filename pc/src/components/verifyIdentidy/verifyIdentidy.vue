<template>
  <div class="validate-identidy-layout">
    <el-dialog
      :visible.sync="show"
      width="5.9rem"
      :show-close="isShowClose"
      :modal-append-to-body="false"
    >
        <img loading="lazy"
            class="v-close cursorPoint"
            :src="require('@/assets/image/gameImg/login-close2.png')"
            @click="closeDialog"
        />
        <div class="v-title">{{ $t('验证身份') }}</div>
        <div class="content-box">
            <div class="step1" v-if="showStep === 1">
                <img loading="lazy"
                class="content-img"
                :src="require('../../assets/image/verify/sigh@2x.png')"
                />
                <div class="text1">{{ $t('安全验证') }}</div>
                <div class="text2">{{ $t('您正在一台新设备登录，为了您的账号安全，请进行安全验证') }}。</div>
                <div
                    class="registerBtn themeColorkBgc u-flex-all"
                    :class="{validDis:validIsDis}"
                    @click="showStep = 2"
                >{{ $t('开始验证') }}</div>
            </div>
            <div v-if="showStep === 2">
                <el-row class="row-margin">
                    <el-col :span="6">
                        <div class="text-align left-text">
                            {{ $t('手机号') }}：
                        </div>
                    </el-col>
                    <el-col :span="18">
                        <div class="text-align">
                            <el-input
                                v-model="phone"
                                :placeholder="$t('请输入手机号码')"
                            ></el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="row-margin">
                    <el-col :span="6">
                        <div class="text-align left-text">
                            {{ $t('验证码') }}:
                        </div>
                    </el-col>
                    <el-col :span="18">
                        <div class="text-align" style="display:flex">
                            <el-input
                                v-model="smsCode"
                                :placeholder="$t('请输入短信验证码')"
                            ></el-input>
                            <el-button
                                type="primary"
                                :disabled="disabled"
                                class="butCode themeBtn btnBuy verPCode"
                                @click="getPhoneCode"
                            >
                                {{ codeButtext }}
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <div
                    class="v-submit-valid registerBtn themeColorkBgc u-flex-all"
                    @click="verify"
                >{{ $t('确定') }}</div>
            </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    props:{
        account:{
        type:String,
        default:''
        }
    },
    data() {
        return {
            isShowClose: false,
            show: false,
            validIsDis: true, //提交验证默认禁用
            validateRealNameStatus: true,
            showStep:1,
            phone:'',
            smsCode:'',
            codeButtext: this.$t('获取验证码'),
            intervalID:null,
            disabled: false,

        };
    },
    'props': {
        'account': String
    },
    methods: {
        verify() {
            if (!this.smsCode) {
                this.$http.showMesasge(this.$t('请输入短信验证码'));
                return;
            }
            let params = {
                mobile:this.phone,
                name:this.account,
                smsCode:this.smsCode,
                fingerprint: this.$config.fingerprint,
                phoneModel: this.$config.phoneModel
            }
            this.$http.post(this.$api.checkValidateSmsCode,params,true).then( res => {
                if (res.code == 0) {
                    this.closeDialog(1);
                    this.$emit('loginAction');
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        openDialog() {
            this.show = true;
        },
        closeDialog(type) {
            if (type !== 1) {
                this.$parent.validateStatus = -1;
            }
            this.show = false;
        },
         //获取验证码 
        getPhoneCode() {
            if (!this.phone) {
                this.$message.error(this.$t('请输入手机号'));
                return;
            }
            // if (!/^1[3456789]\d{9}$/.test(this.phone)) {
            //     this.$message.error(this.$t('手机号格式错误'));
            //     return;
            // }
            this.$http.get(this.$api.sendSmsCode + "/" + this.phone + `?functionId=3&codePrefix=${this.$config.codePrefix}&codeFlag=1`)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(this.$t('获取验证码成功'));
                        this.disabled = true;
                        var time = 60;
                        this.intervalID = setInterval(() => {
                            time--;
                            this.codeButtext =
                                this.$t('获取验证码') +
                                "(" +
                                time +
                                ")";
                            if (time == 0) {
                                clearInterval(this.intervalID);
                                this.codeButtext = this.$t('获取验证码');
                                this.disabled = false;
                                time = 60;
                            }
                        }, 1000);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
    },
};
</script>

<style lang='less'>
.validate-identidy-layout {
  position: relative;
  z-index: 999;
  .el-dialog__wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  //   el-dialog
  .el-dialog {
    .el-dialog__header {
      padding: 0 !important;
    }
    .el-dialog__body {
      height: 5rem;
      padding: 0.32rem 0.7rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #000;
    }
  }
  .v-close {
    position: absolute;
    top: 0.14rem;
    right: 0.14rem;
    width: 0.17rem;
    height: 0.17rem;
    transition: 1s;
    cursor: pointer;
  }
  .v-close:hover {
    transform: rotate(180deg);
  }
  .step1 {
    .text1 {
        font-weight:700;
        color:#333333;
        font-size:30px;
        margin-top: 20px;
    }
    .text2 {
        padding: 0 28px;
        text-align: left;
        color:#333333;
        font-size:14px;
        line-height: 20px;
        margin-top: 20px;
    }
  }
  .v-title {
    height: 0.4rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #2d2b4d;
    margin-bottom: 0.3rem;
  }
  .content-img {
      width: 140px;
      height: 140px;
  }
  .v-tip-text {
    font-size: 0.13rem;
    font-weight: 500;
    color: #7d7d7d;
    height: 0.2rem;
    margin-bottom: 0.38rem;
  }
  .registerBtn {
    margin:  0 auto;
    margin-top: 20px;
    width: calc(100% - 0.4rem);
    height: 0.46rem;
    border-radius: 0.25rem;
    font-size: 0.16rem;
    color: white;
    cursor: pointer;
  }
                    
  .v-submit-valid {
      margin-top: 120px;
  }
  .themeColorkBgc {
    background-color: #678fff!important;
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
            border: 1px solid #333;
        }
        .el-radio__inner::after {
            background-color: var(--themeColor);
            width: 0.08rem;
            height: 0.08rem;
        }
        .verPCode {
            margin-top: 3px;
        }
    }
}
</style>