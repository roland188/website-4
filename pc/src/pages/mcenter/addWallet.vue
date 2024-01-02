<template>
    <div class="addWallet">
        <div class="backBtn" @click="onBack">
            <el-image :src="backimg" fit="fit"></el-image>
        </div>
        <div>
            <el-row :span="24">
                <el-form
                    ref="form"
                    :model="formData"
                    label-width="100px"
                    label-position="left"
                >
                    <el-col :span="24">
                        <el-form-item :label="$t('origo钱包')">
                            <el-input
                                v-model="formData.address"
                                :placeholder="$t('请输入origo钱包')"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="$t('选择币种：')">
                            <el-select
                                class="selectBox"
                                v-model="formData.coin"
                                :placeholder="$t('请选择币种')"
                                @change="changes"
                            >
                                <el-option
                                    label="USDT"
                                    value="USDT"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-button
                            type="primary"
                            class="butCode"
                            :disabled="succesBtn"
                            @click="submitBankInfo()"
                            >{{$t('提交')}}</el-button
                        >
                        <p @click="onAppDaw" class="appDwa">
                            {{$t('点击这里')}}<span class="a-app">{{$t('下载origo钱包')}}</span>
                        </p>
                    </el-col>
                </el-form>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            backimg: require("../../assets/image/dze/back.png"),
            formData: {
                coin: "",
                chain: "",
                address: "",
                mobile: "",
                verification: "",
            },
            currencyList: [], //数字货币币种
            chainName: [], //链名称
            succesBtn: false,
        };
    },
    created() {
        this.listDigitPayWays();
        this.getuserInfo();
    },
    methods: {
        //下载钱包
        onAppDaw() {
            window.open("https://website.origowallet.info", "_blank");
        },
        getuserInfo() {
            this.$http
                .get(
                    this.$api.members + "/" + this.$common.getUser().user_id,
                    "",
                    true
                )
                .then((res) => {
                    if (res.code == 0) {
                        this.userId = res.data.userId;
                        this.codeButDis = false;
                        if (!res.data.realName) {
                            this.$confirm(this.$t("请完善真实姓名"), this.$t("提示"), {
                                confirmButtonText: this.$t("确定"),
                                confirmButtonClass: "themeColorkBgc borderNone",
                                cancelButtonText: this.$t("取消"),
                                type: "warning",
                            })
                                .then(() => {
                                    //打开个人资料
                                    this.$router.push("/mcenter/myAccount");
                                })
                                .catch(() => {
                                    //关闭
                                });
                            return;
                        }
                        if (!res.data.withdrawPassWordState) {
                            this.$confirm(
                                this.$t("请先设置取款密码再添加银行卡"),
                                this.$t("提示"),
                                {
                                    confirmButtonText: this.$t("确定"),
                                    confirmButtonClass:
                                        "themeColorkBgc borderNone",
                                    cancelButtonText: this.$t("取消"),
                                    type: "warning",
                                }
                            )
                                .then(() => {
                                    this.$router.push(
                                        "/mcenter/securityCenter"
                                    );
                                })
                                .catch(() => {
                                    //关闭
                                });
                            return;
                        }
                    }
                });
        },
        //选择币种
        changes(val) {
            this.currencyList.map((item) => {
                if (val === item.currency) {
                    this.chainName = item.addrtype;
                }
            });
        },
        // 数字货币列表
        listDigitPayWays() {
            let that = this;
            that.$http.post(that.$api.listDigitPayWays).then((res) => {
                if (res.code == 0) {
                    if (res.data.length > 0) {
                        that.currencyList = res.data;
                        that.chainName = res.data[0].addrtype;
                        this.formData.coin = res.data[0].currency;
                        this.formData.chain = res.data[0].addrtype[0].link;
                    }
                }
            });
        },
        submitBankInfo() {
            let option = null;
            if (!this.formData.address) {
                this.$message({
                    message: this.$t("请输入origo钱包账户"),
                    type: "warning",
                });
                return;
            }
            if (!this.formData.coin) {
                this.$message({
                    message: this.$t("请选择币种"),
                    type: "warning",
                });
                return;
            }
            option = {
                branch: "USDT", //	链路
                memberId: this.userId, //	会员id
                name: this.formData.coin, //	币种
                number: this.formData.address, //钱包地址
                clientItem: window.childCode, //子平台id字段
                type: 2,
            };
            this.succesBtn = true;
            this.$http.post(this.$api.addbank, option).then((res) => {
                this.succesBtn = false;
                if (res.code == 0) {
                    this.$message({
                        message: this.$t("添加成功"),
                        type: "success",
                    });
                    this.onBack();
                } else {
                    this.$alert(res.msg || this.$t("请求出错，请稍后再试！"), this.$t("提示"), {
                        confirmButtonText: this.$t("确定"),
                        confirmButtonClass: "themeColorkBgc borderNone",
                        callback: (action) => {},
                    });
                }
            });
        },
        onBack() {
            this.$router.back();
        },
    },
};
</script>

<style lang="scss" scoped>
.addWallet {
    padding: 20px 25% 0 25%;
    .appDwa {
        text-align: center;
        margin-top: 0.1rem;
        cursor: pointer;
        .a-app {
            color: #66b1ff;
        }
        .a-app:hover {
            border-bottom: 1px solid #66b1ff;
        }
    }
    .selectBox {
        width: 100%;
    }
    .butCode {
        width: 100%;
        border-radius: 50px;
    }
    .themeAssistColorClass {
        color: #f8711d;
    }
    .backBtn {
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