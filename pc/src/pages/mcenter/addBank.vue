<template>
    <div class="addbankpage">
        <div class="backBtn" @click="onBack">
            <el-image :src="backimg" fit="fit"></el-image>
        </div>
        <div>
            <el-row class="elrows">
                <el-col :span="24">
                    <div class="col-title">
                        <span>{{$t('账户姓名')}}：</span>
                    </div>
                    <div class="col-input">
                        <el-input
                            v-model="bankCardInfo.account"
                            :disabled="disabledName"
                            :placeholder="$t('请输入账户姓名')"
                        ></el-input>
                        <span class="tips-text themeAssistColorClass" v-if="!isBankShow"
                            >{{$t('为了您的资金能迅速到账，请确保填写姓名与银行卡开户姓名一致')}}
                            </span
                        >
                    </div>
                </el-col>
            </el-row>
            <el-row class="elrows">
                <el-col :span="24">
                    <div class="col-title">
                        <span>{{$t('银行名称')}}：</span>
                    </div>
                    <div class="col-input">
                        <el-select
                            v-model="bankCardInfo.name"
                            :placeholder="$t('请选择银行名称')"
                            class="select-list"
                            :class="{ 'selectbank-img': backImg }"
                            @change="showMessage($event)"
                        >
                            <template slot="prefix" v-if="backImg">
                                <el-image :src="backImg" class="prefixSlot">
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                            </template>
                            <el-option
                                v-for="item in bankNameList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name"
                                class="select-item"
                            >
                                <div style="
                                        text-align: left;
                                        width: 100%;
                                        height: 0.4rem;">
                                    <el-image
                                        :src="$common.getImgUrl(item.imgUrl)"
                                        style="
                                            width: 0.25rem;
                                            height: 0.25rem;
                                            vertical-align: middle;
                                            padding-right: 0.05rem;">
                                        <div
                                            slot="error"
                                            class="image-slot"
                                        ></div>
                                    </el-image>
                                    <p style="display: inline-block" :style="item.name == '数字货币' ? 'font-weight: bold;' : ''">
                                        {{ item.name }}
                                    </p>
                                </div>
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
            <el-row class="elrows" v-if="!isBankShow && !['vi'].includes(locale)">
                <el-col :span="24">
                    <div class="col-title">
                        <span>{{$t('支行名称')}}：</span>
                    </div>
                    <div class="col-input">
                        <el-input
                            v-model="bankCardInfo.branch"
                            :placeholder="$t('请输入支行名称')"
                        ></el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row class="elrows" v-if="!isBankShow">
                <el-col :span="24">
                    <div class="col-title">
                        <span>{{$t('卡号')}}：</span>
                    </div>
                    <div class="col-input">
                        <el-input
                            v-model="bankCardInfo.number"
                            :placeholder="$t('请输入卡号')"
                            @input="onChangeBankNumber"
                        ></el-input>
                        <span class="tips-text themeAssistColorClass">{{
                            $t(bankNumberTipsText)
                        }}</span>
                    </div>
                </el-col>
            </el-row>
            
            <el-row class="elrows" v-if="isBankShow">
                <el-col :span="24">
                    <div class="col-title">
                        <span>{{$t('链路')}}：</span>
                    </div>
                    <div class="col-input">
                        <el-input
                            v-model="bankCardInfo.branch"
                            :placeholder="$t('请输入TRC20')"
                        ></el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row class="elrows" v-if="isBankShow">
                <el-col :span="24">
                    <div class="col-title">
                        <span>{{$t('地址')}}：</span>
                    </div>
                    <div class="col-input">
                        <el-input
                            v-model="bankCardInfo.number"
                            :placeholder="$t('请输入钱包地址')"
                        ></el-input>
                    </div>
                </el-col>
            </el-row>
            <template v-if="isPhoneShow">
                <div>
                    <el-row class="elrows">
                        <el-col :span="24">
                            <div class="col-title">
                                <span>{{$t('手机号')}}：</span>
                            </div>
                            <div class="col-input">
                                <el-input
                                    :placeholder="$t('请输入手机号')"
                                    v-model="bankCardInfo.phoneCode"
                                    :disabled="disabledPhone"
                                >
                                </el-input>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="elrows">
                        <el-col :span="24" style="display: flex">
                            <div class="col-title">
                                <span>{{$t('验证码')}}</span>
                            </div>
                            <div class="col-input flexPhone">
                                <el-input
                                    v-model="bankCardInfo.pCode"
                                    :placeholder="$t('请输入验证码')"
                                ></el-input>
                                <el-button
                                    type="primary"
                                    class="butCode themeBtn btnBuy verPCode"
                                    :disabled="codeButDis"
                                    @click="getPhoneCode"
                                >
                                    {{ $t(codeButtext) }}
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <el-row class="row-button">
                <el-col :span="24">
                    <div class>
                        <el-button type="primary"
                            class="subBut themeBtn btnBuy"
                            :disabled="succesBtn"
                            round
                            @click="submitBankInfo(0)"
                            >{{$t('提交')}}</el-button
                        >
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            backimg:require('../../assets/image/dze/back.png'),
            userData: {},
            bankCardInfo: {
                account: "",
                name: "",
                branch: "",
                number: "",
                phone: "",
            },
            projectImgUrl: window.projectImgUrl,
            bankNameList:[],
            disabledName:false,//姓名是否可编辑
            bankNumberTipsText: this.$t('请认真校对银行卡号，卡号错误将导致资金无法到账'),
            succesBtn:false,
            backImg: "", //选中银行图片
            codeButtext: this.$t('获取验证码'),
            codeButDis: false,
            isPhoneShow:false,
            disabledPhone: false,
            isBankShow:false,
            bind_usdt_sms:0,
            bind_sms:0,
            locale: window.locale
        };
    },
    watch:{
        //  判断当前存款方式
        ['bankCardInfo.name'](){
            if(this.bankCardInfo.name == this.$t('数字货币')){
                this.isBankShow = true
                this.isPhoneShow = this.bind_usdt_sms == 1 ? true : false; 
            }else{
                this.isBankShow = false
                this.isPhoneShow = this.bind_sms == 1 ? true : false;
            }
            if (this.isPhoneShow && !this.bankCardInfo.phoneCode) { // 提示去绑定手机
                this.phoneDisab = true;
                this.$confirm(this.$t('您还未绑定手机，是否去绑定手机？'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning'
                }).then(() => {
                    this.$router.push({
                        path: '/mcenter/myAccount'
                    })
                }).catch(() => {
                    this.$message.warning(this.$t('未绑定手机无法绑卡，请先绑定手机'))
                })
            }
        }
    },
    created(){
        this.getBankList();
        this.getuserInfo();
        this.getBindSmsSetting()
    },
    methods: {
        getBindSmsSetting() {
            this.$http.get(this.$api.bindBankNnm).then((res) => {
                if (res && res.data.svalue) {
                    this.bind_usdt_sms = res.data.svalue.bind_usdt_sms || 0;
                    this.bind_sms = res.data.svalue.bind_sms || 0;
                    this.isPhoneShow = this.bind_sms == 1 ? true : false;
                }
            });
        },
         showMessage(e) {
            let selectdata = this.bankNameList.filter((item, index) => {
                return item.name == e;
            });
            if(e == this.$t("数字货币") || this.isBankShow){
                this.bankCardInfo.number = '';
                this.bankCardInfo.branch = '';
            }
            this.backImg = this.$common.getImgUrl(selectdata[0].imgUrl);
        },
        getBankList() {
            this.$http.get(this.$api.querybank).then((res) => {
                if (res.code == 0) {
                    this.bankNameList = res.data.filter(item =>{
                        return item.type == 0
                    });
                }
            });
        },
        //获取验证码
        getPhoneCode() {
            // if (this.phone && !this.disabledPhone) {
            //     if (!/^1[3456789]\d{9}$/.test(this.phone)) {
            //         this.$message.error(this.$t("手机号格式错误"));
            //         return;
            //     }
            // }
            if (!this.bankCardInfo.phoneCode) {
                this.$message.error(this.$t('请输入手机号'));
                return;
            }
            this.$http
                .get(
                    this.$api.sendSmsCode +
                        "/" +
                        this.bankCardInfo.phoneCode +
                        `?functionId=7&codePrefix=${this.$config.codePrefix}&codeFlag=1`
                )
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(this.$t("获取验证码成功"));
                        this.codeButDis = true;
                        var time = 60;
                        this.intervalID = setInterval(() => {
                            time--;
                            this.codeButtext =
                                this.$t('获取验证码') +
                                "(" +
                                time +
                                ")";
                            if (time == 0) {
                                this.codeButDis = false;
                                clearInterval(this.intervalID);
                                this.codeButtext = this.$t('获取验证码');
                                time = 60;
                            }
                        }, 1000);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        getuserInfo() {
            this.$http.get(this.$api.members + "/" + this.$common.getUser().user_id,"",true).then((res) => {
                    if (res.code == 0) {
                        this.userData = res.data;
                        this.bindPhone = res.data.bindPhone;
                        this.userId = res.data.userId;
                        this.disabledName = !res.data.realNameEditable;
                        var tel = res.data.phone;
                        if (tel && tel != null && tel != "") {
                            this.bankCardInfo.phoneCode = res.data.phone;
                            this.disabledPhone = true;
                        }else{
                            this.disabledPhone = false;
                        }
                        this.codeButDis = false;
                        if (res.data.realName) {
                            let name = res.data.realName;
                            this.bankCardInfo.account = res.data.realName;
                        } else {
                            this.$confirm(this.$t("请完善真实姓名"), this.$t("提示"), {
                                confirmButtonText: this.$t("确定"),
                                confirmButtonClass: "themeColorkBgc borderNone",
                                cancelButtonText: this.$t("取消"),
                                type: "warning",
                            }).then(() => {
                                    //打开个人资料
                                     this.$router.push("/mcenter/myAccount");
                            }).catch(() => {
                                    //关闭
                            });
                            return;
                        }
                        if (!res.data.withdrawPassWordState) {
                            this.$confirm(
                                this.$t("请先设置取款密码再添加银行卡"), this.$t("提示"), {
                                    confirmButtonText: this.$t("确定"),
                                    confirmButtonClass:
                                        "themeColorkBgc borderNone",
                                    cancelButtonText: this.$t("取消"),
                                    type: "warning",
                                }).then(() => {
                                     this.$router.push("/mcenter/securityCenter");
                                }).catch(() => {
                                    //关闭
                                });
                            return;
                        }
                    }
                });
        },
        //判断卡号
        onChangeBankNumber(e) {
            // var pattern = /^[0-9]*$/; // /^([1-9]{1})(\d{14}|\d{18})$/;
            var bankinput = e;
            var bank = bankinput.replace(/\s*/g, "");
            // pattern.test(bank)
            if (!bank.length) {
                this.bankNumberTipsText = "请输入正确的银行卡号";
                this.successBnakNumber = false;
            } else {
                this.bankNumberTipsText = this.$t('请认真校对银行卡号，卡号错误将导致资金无法到账')
                this.successBnakNumber = true;
            }
        },
        submitBankInfo(currencyCard) {
            let option = null;
                if (!this.bankCardInfo.account) {
                    this.$message({
                        message: this.$t("请输入账户名称"),
                        type: "warning"
                    });
                    return;
                }
                if (!this.bankCardInfo.name) {
                    this.$message({
                        message: this.$t("请选择银行"),
                        type: "warning"
                    });
                    return;
                }
                if (!this.bankCardInfo.number && !this.isBankShow) {
                    this.$message({
                        message: this.$t("请输入卡号"),
                        type: "warning"
                    });
                    return;
                }
                
                if(!['vi'].includes(locale)){
                    if (!this.bankCardInfo.branch && !this.isBankShow) {
                        this.$message({
                            message: this.$t("请输入支行"),
                            type: "warning"
                        });
                        return;
                    }
                }
                if (!this.successBnakNumber && !this.isBankShow) {
                    this.$message.error(this.$t("请输入正确的银行卡号"));
                    return;
                }
                if(!this.bankCardInfo.branch && this.isBankShow){
                    this.$message.error(this.$t("请输入链路"));
                    return;
                }
                if(!this.bankCardInfo.number && this.isBankShow){
                    this.$message.error(this.$t("请输入钱包地址"));
                    return;
                }
                if (this.isPhoneShow && !this.bankCardInfo.pCode) {
                    this.$message.error(this.$t("请输入验证码"));
                    return;
                }
                // let backCardFull = this.bankCardInfo.number.replace(/\s*/g, ""); //去除所有空格
                option = {
                    account: this.bankCardInfo.account, //	银行卡账户名
                    branch: ['vi'].includes(locale) ? this.bankCardInfo.name : this.bankCardInfo.branch, //	支行
                    memberId: this.userId, //	会员id
                    name: this.bankCardInfo.name, //	银行名称
                    number: this.bankCardInfo.number, //卡号
					clientItem:window.childCode, //子平台id字段
                    type: currencyCard,
                    phone: this.bankCardInfo.phoneCode, //绑定银行卡手机号
                    smsCode: this.bankCardInfo.pCode, //  手机验证码
                }
            this.succesBtn = true;
            this.$http.post(this.$api.addbank, option).then(res => {
                this.succesBtn = false;
                if (res.code == 0) {
                    this.$message({
                        message: this.$t("添加成功"),
                        type: "success"
                    });
                    this.onBack();
                } else {
                    this.$alert(res.msg || this.$t("请求出错，请稍后再试！"), this.$t("提示"), {
                        confirmButtonText: this.$t("确定"),
                        confirmButtonClass:'themeColorkBgc borderNone',
                        callback: action => {
                            this.bankCardInfo.sms_code = "";
                        }
                    });
                }
            });
        },
        onBack(){
           this.$router.back()
        }
    },
};
</script>

<style lang="scss" scoped>
.addbankpage {
    padding: 20px 25% 0 25%;
    .prefixSlot {
        height: 0.2rem;
        width: 0.2rem;
        margin-top: 0.11rem;
    }
    .elrows {
        margin-bottom: 0.2rem;
        .col-title {
            line-height: 0.44rem;
            display: inline-block;
            vertical-align: top;
            width: 20%;
            text-align: left;
            span {
                font-size: 0.15rem;
            }
        }
        .col-input {
            display: inline-block;
            width: 79%;
            &.flexPhone{
                display: flex;
            }
            .select-list {
                width: 100%;
                // padding-left: 0.5rem;
            }
            .select-item {
                text-align: left;
            }
            .el-input__inner {
                border-radius: 8px;
                // border: 1px solid #CCD6E4;
                height: 0.44rem;
                font-size: 0.16rem;
                padding-left: 0.08rem;
                &::placeholder {
                    font-size: 0.14rem;
                }
            }

            .selectbank-img {
                .el-input__inner {
                    padding-left: 0.3rem;
                    -webkit-backface-visibility: hidden;
                    -webkit-transform-style: preserve-3d;
                }
            }
            .USDT-name{
                font-weight: bold;
            }
        }
        .tips-text {
              color: #f8711d;
            display: block;
            text-align: left;
            font-size: 0.1rem;
            margin-top: 0.1rem;
        }
        .col-but-code {
            width: 29%;
            display: inline-block;
            // button {
            //     margin-left: 0.3rem;
            // }
        }
    }
      .row-button {
        margin-top: 0.32rem;
        .el-button {
            color: #fff;
            border: 0px;
            width:95%;
            font-size: 0.16rem;
            padding: 0.12rem 0.2rem;
            margin: 0 auto;
            display: block;
        }
        .backBut {
            background: #f8711d;
            width: 2rem;
            height: 0.4rem;
        }
       
        .backBut:hover {
            background: #fd9d5c;
        }
    }
    .backBtn{
           display: inline-block;
        /* background: #fff; */
        border-radius: 50%;
        /* padding: 11px 15px; */
        vertical-align: middle;
        text-align: center;
        -webkit-box-shadow: 10px 1px 10px #eee;
        box-shadow: 10px 1px 10px #eee;
        width: 50px;
        height: 50px;
        line-height: 48px;
        margin-bottom: 20px;
    }
}
</style>