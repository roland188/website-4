<template>
    <div class="padding">
        <div class="headerBox">
            <div>
                <p class="title">{{ $t('账户余额') }}
                    <img loading="lazy" v-lazy="reimg" class="refMoney" alt="" @click="getGameMoneyList" :class="{'refresh-img-animation':refreshImgTime}"  srcset="">
                </p>
                <p> {{$common.numToThousandAndFixed(userMoney, 2)}}</p>
            </div>
            <div>
                <el-button class="oneBtn" @click="onMergeGame">{{ $t('一键归集') }}</el-button>
            </div>
        </div>
        <div class="game-list-view">
            <el-scrollbar class="scroll-style">
                <ul class="box-game">
                    <li
                        class="box-item-view"
                        v-for="(item, index) in gameList"
                        :key="index">
                        <p class="game-name">{{ item.vendorName }}</p>
                        <p
                            class="game-money" v-if="item.operation"
                            :class="[item.totalMoney != 0 ? 'themeTextColor' : '',]">
                            {{ $common.numToThousandAndFixed(item.totalMoney, 2) }}
                        </p>
                        <p class="game-repair maintainBgColor"
                            v-if="!item.operation">
                            {{ $t('归集中') }}
                        </p>
                    </li>
                </ul>
            </el-scrollbar>
        </div>
        <template v-if="auditList.totalFail">
            <div class="audit-box">
				<div class="tips">
                {{ $t('亲，您只要完成') + $config.currency + (auditList.amountAudit-auditList.afterTotalBet) + $t('有效投注额，') }} 
                {{ $t('就可以提现了～')}}
                </div>
				<div class="audit-line">
					<div class="line" :style="{'width': `${auditList.afterTotalBet/auditList.amountAudit*100}%`}"></div>
				</div>
				<div class="audit-count">
                    {{ $t('有效投注额')}} 
                    {{ $config.currency }} {{auditList.afterTotalBet}} / 
                    {{ $config.currency }} {{auditList.amountAudit}}
                </div>
            </div>
        </template>
        
        <template v-else>
            <div>
                <el-row class="item">
                    <el-col :span="4">
                        <div class="">
                            <p class="title">{{ $t('收款方式') }}：</p>
                        </div>
                    </el-col>
                    <el-col :span="20">
                        <div>
                            <el-select v-model="backcardname" class="selectBox" :placeholder="$t('请选择收款方式')"
                            @change="onSelectbank($event)">
                                <template slot="prefix" v-if="backImg">
                                    <!-- <img loading="lazy" class="prefixSlot" :src="backImg" /> -->
                                    <el-image :src="backImg" class="prefixSlot">
                                        <div slot="error" class="image-slot">
                                            <i class="el-icon-picture-outline"></i>
                                        </div>
                                    </el-image>
                                </template>
                                <el-option v-for="item in bankList" :key="item.id" :label="item.name" :value="item.id">
                                    <div style="text-align: left;width: 100%;">
                                        <!-- <img loading="lazy" v-lazy="require('../../assets/image/dze/wallet.png')" v-if="item.type === 2" style="width: 0.25rem;height: 0.25rem;vertical-align: middle;padding-right: 0.05rem;" alt srcset /> -->
                                        <el-image
                                            :src="$common.getImgUrl(item.imgUrl)"
                                            style="width: 0.25rem;height: 0.25rem; vertical-align: middle; padding-right: 0.05rem;"
                                        >
                                            <div slot="error" class="image-slot"></div>
                                        </el-image>
                                        <p style="display: inline-block" v-if="item.type === 2"> {{ $t('三方钱包') }}({{ item.name}})</p>
                                        <p v-else style="display: inline-block;">{{ item | banktitle }}</p>
                                    </div>
                                </el-option>
                                <el-option :label="$t('添加收款方式')" value="add">
                                    <div class="money-select-option-add-bank">
                                        <div>
                                            <i
                                                class="el-icon-circle-plus-outline add-bank-img themeTextColor"
                                            ></i>
                                        </div>
                                        <div class="add-text">
                                            <span> {{ $t('添加收款方式') }}</span>
                                        </div>
                                        <div>
                                            <i class="el-icon-arrow-right icon-right-img"></i>
                                        </div>
                                    </div>
                                </el-option>
                            </el-select>
                            <p v-if="selectBank"
                                class="add-text-card themeTextColor" @click="openAddBankCard">
                            {{ $t('没有收款方式？立即添加') }}
                            </p>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-row class="item">
                    <el-col :span="4">
                        <div class="">
                            <p class="title">{{ $t('提款金额') }}：</p>
                        </div>
                    </el-col>
                    <el-col :span="20">
                        <div v-if="withdrawType == 1" class="withdraw-buttom-box">
                            <div class="withdraw-buttom themeBtnBorder" :class="checkMoneyIndex === index && withdrawNum ? 'withdraw-buttom-act' : '' " v-for="(item,index) in withdrawFixed" :key="'withdraw' + index" 
                            @click="checkMoney(item,index)">
                                {{ item }}
                            </div>
                        </div>
                        <el-input v-else v-model="setmoney" :placeholder="placeholderPhone"
                                autofocus="autofocus"
                                onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                @input="onChangePhone" @blur="onMoneyBlur"></el-input>
                        <div
                            style="font-size: 12px;flex-grow: 1;"
                            class="themeAssistColorClass"
                            v-if="backitemdata[0]&&backitemdata[0].type == 1"
                        >
                            <span
                                style="font-size: 14px;"
                            >1RMB≈{{exchange}}{{currencyName}}</span>
                            <span
                                style="display:flex;"
                            >{{ $t('当前可提款金额') }} {{$common.numToThousandAndFixed(SureMoney, 3)}},{{ $t('最小提现金额') }}{{(exchange=== 0?'0.000000':($common.numToThousandAndFixed((singleMin/digitBuyRate),6)))+currencyName}}</span>
                        </div>
                        <span class="tips-text themeTextColor" v-if="backitemdata[0]&&backitemdata[0].type == 1">
                            {{ $t('实际到账金额') }}： {{ $common.numToThousandAndFixed(ActualMoney,3)}}
                            {{(exchange === 0?'0.000000':accMul(ActualMoney,exchange))}}{{currencyName}}
                            <img loading="lazy"
                            v-lazy="reimg"
                                class="refresh-img cursorPoint"
                                :class="{refreshAnimation: refreshImgStart}"
                                fit="fit"
                                @click="getCost(true)"
                            />
                        </span>
                        <span class="tips-text themeTextColor" v-else >
                            {{ $t('实际到账金额') }}： {{ $common.numToThousandAndFixed(ActualMoney,3)}}
                            <img loading="lazy"
                                v-lazy="reimg"
                                class="refresh-img cursorPoint"
                                :class="{refreshAnimation: refreshImgStart}"
                                fit="fit"
                                @click="getCost(true)"
                            />
                        </span>
                        
                        <div class="tipBox">
                            <!-- <p class="tips-text-ele">实际到账金额： {{ $common.numToThousandAndFixed(ActualMoney,2)}}</p> -->
                            <p class="tips-text-ele">{{ $t('提现手续费') }}： {{ $common.numToThousandAndFixed(handlingfee,3)}} {{ $t('CNY') }}</p>
                            <p class="tips-text-ele">{{ $t('行政费用') }}： {{ $common.numToThousandAndFixed(administrativeCosts,3)}} {{ $t('CNY') }}</p>
                            <p class="tips-text-ele">{{ $t('优惠扣除') }}： {{ $common.numToThousandAndFixed(discountDeduction,3)}} {{ $t('CNY') }}</p>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="item">
                    <el-col :span="4">
                        <div class="">
                            <p class="title">{{ $t('交易密码') }}：</p>
                        </div>
                    </el-col>
                    <el-col :span="20">
                        <el-input v-model="moneyPassword" type="password" :placeholder="$t('请输入交易密码')"></el-input>
                    
                    </el-col>
                </el-row>
            </div>
            <div class="footBox">
                <el-button
                        type="primary"
                        class="submit-but"
                        :disabled="submitButDis"
                        round
                        @click="submitInfo"
                    >{{ $t('确认提款') }}</el-button>
                    <p
                        class="problem-text themeAssistColorClass themeTextColor"
                        @click="openService"
                    >{{ $t('有问题？请联系在线客服') }}</p>
            </div>
        </template>
        <!-- <div>
                <el-button type="primary" class="submit-but themeBtn btnBuy" round @click="onNextStep">下一步</el-button>
                <p
                    class="problem-text themeAssistColorClass themeTextColor"
                    @click="openService"
                >有问题？请联系在线客服</p>
            </div> -->
            <!-- 绑定手机号 -->
        <el-dialog
            :visible.sync="dialogPhone"
            :close-on-click-modal="false"
            :show-close="isShowClose"
            :before-close="onbalckPhone"
            width="426px"
        >
            <div slot="title" class="alertHeader ">
                <div class="alertTitle ">{{ $t('请验证手机号提款') }}</div>
            </div>
            <div class="phone-content">
                <div class="phoneBox">
                    <div class="title">{{ $t('手机号') }}：</div>
                    <div class="inputBox">
                        <div v-if="userData.phone" class="phonemm">{{phoneEncode(showPhone)}}</div>
                        <el-input v-if="!userData.phone" v-model="showPhone"  type="number" maxlength="11" class="phoneInput" placeholder="请输入手机号"></el-input>
                    </div>
                </div>
                <div class="codeBox">
                    <div  class="title">{{ $t('验证码') }}：</div>
                    <div>
                        <el-input v-model="sms_code" type="number" :placeholder="$t('请输入验证码')"></el-input>
                    </div>
                    <div>
                        <el-button
                            class="butCode"
                            :disabled="codeButDis"
                            @click="getPhoneCode"
                        >{{codeButtext}}</el-button>
                    </div>
                </div>
                <div class="p-btn-center">
                    <el-button class="subBut" round @click="submitPhone()">{{ $t('提交') }}</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="note" width="4.62rem" class="diaLogNote">
            <div slot="title" class="alertHeader">
                <!-- <img loading="lazy"
                    class="cursorPoint dialogClose-header-img"
                    @click="dialogClose"
                /> -->
                <div class="alertTitle">{{ $t('提示') }}</div>
            </div>
            <div class="secondaryPopup">
                <span class="contentText">{{message}}</span>
                <div class="confirmNoteStyle" @click="confirm">{{ $t('确定') }}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    filters: {
        banknumber(val) {
            if (val) {
                return val.substr(0, 4) + " **** **** " + val.substr(-4);
            } else {
                return;
            }
        },
        banktitle(val) {
            if (val.name) {
                return val.name + "(" + val.number.substr(-4) + ")";
            } else {
                return "";
            }
        },
        subNum(val){
            var re = /([0-9]+\.[0-9]{6})[0-9]*/;
            let aNew = (val + '').replace(re,'$1');
            return aNew;
        },
    },
    data() {
        return {
            reimg:require('../../assets/image/refresh.png'),
            walletimg:require('../../assets/image/dze/wallet.png'),
            userData: {},
            bankList: [],
            selectBank: true,
            gameList: [],
            backImg: "", //选中银行图片
            backcardname: "",
            backitemdata: [],
            selectionId: "", //选中银行卡
            dialogPhone:false,//绑定银行卡弹框
            showPhone:"",
            isBindPhone:"",//绑定手机号
            sms_code:"",
            codeButtext: this.$t('获取验证码'),
            codeButDis:false,
            userData:"",
            // encryptionPhone:"",
            handlingfee: 0, //手续费
            administrativeCosts: 0, //行政费用,
            discountDeduction: 0, //优惠扣除
            ActualMoney: 0, //实际到账金额
            moneyPassword:"",
            setmoney:"",
            submitButDis:false,
            isShowClose:false,
            SureMoney: 0,//当前可提现
            placeholderPhone: this.$t('请输入提款金额'),
            refreshImgTime: false,
            exchange: "", //汇率
            digitBuyRate: "", //转换前的汇率
            currencyName: "", //货币名称
            calculate: "", //计算最小提现金额
            actualAmount: "", //实际到账金额
            note: false,
            message: "",
            userMoney:0,
            handlingfees:0,//手续费
            withdrawPayRate:0, //手续费百分比
            bindPhones: false,
            withdrawType:0, //取款方式 0:区间任意金额，1:固定金额
            withdrawFixed:null, //固定金额
            singleMax:0,//固定最大金额
            singleMin:0,//固定最小金额
            checkMoneyIndex: null,
            withdrawNum:false, 
            // 稽核参数
            auditList: {
                afterTotalBet: 0, // 有效投注额
                amountAudit: 0, // 需稽核金额
                totalFail: 0, // 稽核失败数量
            },
            refreshImgStart:false,
        };
    },
    created() {
        // this.getUserMoney();
        this.getBankList();
        this.getUserInfo();
        this.getGameMoneyList();
        this.getCost();
        this.getBalance();
        this.userMoney = this.$common.getUserBalance().totalBalance;
    },
    methods: {
        
        checkMoney(num,index) {
            this.setmoney = num
            this.checkMoneyIndex = index
            this.withdrawNum = true
            this.onChangePhone(num)
        },
        //计算数字精度
        accMul(arg1,arg2){ 
            var m=0,s1=arg1.toString(),s2=arg2.toString(); 
            try{m+=s1.split(".")[1].length}catch(e){} 
            try{m+=s2.split(".")[1].length}catch(e){} 
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
        },
        getUserInfo() {
            this.$http.get( this.$api.members + "/" + this.$common.getUser().user_id, "", true ) .then((res) => {
                    if (res.code == 0) {
                        this.userData = res.data;
                    }
                });
        },
        //获取银行卡列表
        getBankList() {
            this.$http.get(this.$api.banklist).then((res) => {
                if (res.code == 0 && res.data.length > 0) {
                    this.bankList = res.data;
                    this.selectBank = false;
                } else {
                    this.selectBank = true;
                }
            });
        },
        //一键归集
        onMergeGame() {
            let option = {
                clientId: this.$common.getUser().tenant_id, //tenant_id
                clientIp: "192.168.1.1",
                memberId: this.$common.getUser().user_id, //userid
                username: this.$common.getUser().username,
            };
            this.$http
                .post(this.$api.oneKeyBalance, option, true)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(this.$t('归集成功'));
                        this.getGameMoneyList();
                        this.getBalance()
                    }
                });
        },
        //获取游戏厂商列表
        getGameMoneyList(refour = false) {
            // if (this.refreshImgTime) {
            //     setTimeout(() => {
            //         this.refreshImgTime = false;
            //     }, 10000);
            //     this.$message.error("点击间隔10S,请勿重复操作");
            //     return;
            // }
            this.refreshImgTime = true;
            let option = {
                clientId: this.$common.getUser().tenant_id, //tenant_id
                clientIp: "192.168.1.1",
                memberId: this.$common.getUser().user_id, //userid
                username: this.$common.getUser().username,
            };
            this.$http
                .post(this.$api.getGameMoneyList, option, true)
                .then((res) => {
                    this.refreshImgTime = false;
                    if (res.code == 0 && res.data) {
                        this.gameList = res.data.totalBalanceDetail;
                        this.userMoney = res.data.totalBalance;
                        this.$common.setUserBalance(res.data);
                        if (refour) {
                            this.$message.success(this.$t('刷新成功'));
                        }
                    }
                });
        },
        onSelectbank(e) {
            this.backitemdata = [];
            if (e == "add") {
                this.backcardname = "";
                this.backImg = "";
                this.openAddBankCard();
                return;
            }
            if(this.userMoney == 0 || this.userMoney < 0){
                 this.backcardname = "";
                 this.backImg = "";
                 this.$message.error(this.$t('注：只有在中心钱包的余额才能提款'));
                return;
            }
            this.backitemdata = this.bankList.filter((item) => {
                return item.id == e;
            });
            if(this.backitemdata[0].type == 2){
                this.backcardname = this.$t('三方钱包') + '('+this.backitemdata[0].name+')';;
            }
            this.backImg = this.$common.getImgUrl(this.backitemdata[0].imgUrl);
            if (this.backitemdata[0].type == 1) {
                this.getDigitRate();
            }
           
        },
         // 获取汇率
        getDigitRate() {
            let data = {
                digitCcy: this.backitemdata[0].name,
                digitLink: this.backitemdata[0].branch,
                type: this.backitemdata[0].type
            };
            this.$http.post(this.$api.getDigitRate, data).then((res) => {
                if (res.code == 0) {
                    this.digitBuyRate = res.data.digitBuyRate;
                    this.exchange = this.subNum6(1 / res.data.digitBuyRate);
                    this.currencyName = res.data.digitCcy;
                } else {
                    this.message = res.msg;
                    if (!this.showNote) {
                        this.note = true;
                    }
                    this.showNote = true;
                    this.exchange = 0;
                    this.currencyName = this.backitemdata[0].name;
                }
            });
        },
         //小數點截取6位
        subNum6(val){
            var re = /([0-9]+\.[0-9]{6})[0-9]*/;
            let aNew = (val + '').replace(re,'$1');
            return aNew;
        },

        //获取中新钱包余额，可提现
        getBalance() {
            let option = {
                clientId: this.$common.getUser().tenant_id,
                username: this.$common.getUser().username,
            };
            this.$http.post(this.$api.queryBalance, option).then((res) => {
                if (res.code == 0) {
                    this.SureMoney = res.data.money;
                    this.placeholderPhone = this.$t('请输入您需要提取的金额')
                    // this.placeholderPhone = this.$t('当前取款金额{x}元', { x: this.$common.numToThousandAndFixed(res.data.money, 2) })
                }
            });
        },
        //获取手续费等
        getCost(start = false) {
            this.refreshImgStart = true;
            let option = {
                memberId: this.$common.getUser().user_id,
            };
            this.$http.post(this.$api.getCurrentAudit, option).then((res) => {
                this.refreshImgStart = false;
                if (res.code == 0) {
                    this.withdrawType = res.data.withdrawType; //取款限额方式
                    this.withdrawFixed = res.data.withdrawFixed ?  res.data.withdrawFixed.split(',') : res.data.withdrawFixed // 取款整额数组
                    this.handlingfees = res.data.handlingfee; //手续费
                    this.withdrawPayRate = res.data.withdrawPayRate
                    this.handlingfee = this.handlingfees; //手续费
                    this.administrativeCosts = res.data.administrativeCosts; //行政费用,
                    this.discountDeduction = res.data.discountDeduction; //优惠扣除
                    this.singleMin = res.data.singleMin;
                    this.singleMax = res.data.singleMax;
                    if (start) {
                        this.handlingfee = this.handlingfees + this.setmoney*Number(this.withdrawPayRate)
                        this.ActualMoney =
                            this.setmoney -
                            this.handlingfee -
                            this.administrativeCosts -
                            this.discountDeduction;
                        if (this.ActualMoney < 0) {
                            this.ActualMoney = 0;
                            this.handlingfee = this.handlingfees
                        }
                    }
                    // 稽核参数
                    if (res.data.dataList.length) {
                        this.auditList.afterTotalBet = (res.data.dataList.reduce((afterTotalBet, item) => afterTotalBet + item.afterTotalBet || 0, 0)).toFixed(2);
                        this.auditList.amountAudit = (res.data.dataList.reduce((amountAudit, item) => amountAudit + item.amountAudit || 0, 0)).toFixed(2);
                    }
                    this.auditList.totalFail = res.data.depositAudit.failed + res.data.discountAudit.failed; // 稽核失败总数
                }else{
                    this.refreshImgStart = false;
                }
            });
        },
         onChangePhone(e) {
            // this.setmoney = this.setmoney.replace(
            //     /^(\-)*(\d+)\.(\d\d).*$/,
            //     "$1$2.$3"
            // );
            if (e) {
                // e = e.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                this.handlingfee = this.handlingfees + this.setmoney*Number(this.withdrawPayRate)
                this.ActualMoney = e -
                    this.handlingfee -
                    this.administrativeCosts -
                    this.discountDeduction;
            }
            if (this.ActualMoney <= 0) {
                this.ActualMoney = 0;
                this.handlingfee = this.handlingfees
            }
        },
        //金额输入框失去焦点
        onMoneyBlur() {
            if (this.setmoney > this.SureMoney) {
                this.$alert(this.$t('输入金额超出范围，请重新输入'), this.$t('提示'), {
                    confirmButtonText: this.$t('确定'),
                    confirmButtonClass: "borderNone",
                    callback: (action) => {
                        this.setmoney = "";
                        this.ActualMoney = 0;
                    },
                });
                this.handlingfee = this.handlingfees
            }
        },
        //提交取款
        submitInfo(){
            if(this.backitemdata.length <= 0){
                 this.$message({
                        message: this.$t('请选择银行卡'),
                        type: "error",
                        duration: "2000",
                });
                return;
            }
            if(!this.moneyPassword){
                this.$message({
                        message: this.$t('请输入密码'),
                        type: "error",
                        duration: "2000",
                });
                return;
            }
             //验证是否首次提款
            this.onNextStep();
            
        },
        phoneEncode(val) {
            //手机号加密
            if (val) {
                return val.substr(0, 3) + "****" + val.substr(-4)
            } else {
                return ''
            }
        },
        onNextStep() {
            this.$http.get(this.$api.firstWithdraw).then(res =>{
                if(res.data){
                    if(this.userData.phone){
                        // var reg = /^(\d{3})\d{4}(\d{4})$/;
                        // let phoneText = this.userData.phone
                        // this.encryptionPhone = phoneText.replace(reg, "$1****$2");
                        this.showPhone = this.userData.phone;
                        this.isBindPhone = this.userData.bindPhone;
					    this.bindPhones = true;
                    }
                    else{
					    this.bindPhones = false;
                    }
                    this.dialogPhone = true;
                }else{
                    this.nextGetMoney()
                }
            })
            
        },
        nextGetMoney(){
            
            // this.dialogPhone = true;
             if(!(/(^[1-9]\d*$)/.test(this.setmoney))){
                this.$message({
                        message: this.$t('提款金额只能输入正整数'),
                        type: "error",
                        duration: "2000",
                });
                return;
             }
            this.$freeze.freeze().then((res) => {
                if (!res) {
                    this.$message({
                        message: this.$t('您的钱包已被冻结，请联系客服')+'!',
                        type: "error",
                        duration: "2000",
                    });
                } else {
                    if (this.setmoney < this.singleMin && this.withdrawType == 0) {
                        this.$message({
                            message: this.$t('最小提现金额为{x}元', { x: this.singleMin }),
                            type: "warning",
                        });
                        return;
                    }
                    if (this.setmoney > this.singleMax && this.withdrawType == 0) {
                        this.$message({
                            message: this.$t('最大提现金额为{x}元', { x: this.singleMax }),
                            type: "warning",
                        });
                        return;
                    }
                    if (this.ActualMoney <= 0) {
                        this.$message({
                            message: this.$t('实际到账金额不得小于0'),
                            type: "warning",
                        });
                        return;
                    }
                    var data = {
                        amount: this.setmoney,
                        bankNo: this.backitemdata[0].number,
                        bankAccount: this.backitemdata[0].account, //银行卡户名
                        bankBranch: this.backitemdata[0].branch, //	支行
                        bankName: this.backitemdata[0].name, //银行名称
                        password: this.moneyPassword,
                        handlingfee: this.handlingfee, //手续费
                        administrativeCosts: this.administrativeCosts, //行政费用,
                        discountDeduction: this.discountDeduction, //优惠扣除
                        operator: this.$common.getUser().username,
                        type: this.backitemdata[0].type,
                        digitRate: this.digitBuyRate,
                        bankId: this.backitemdata[0].id,
                    };
                    this.$http
                        .post(this.$api.entranceWithdraw, data, true)
                        .then((res) => {
                            if (res.code == 0) {
                                this.$alert(this.$t('申请成功，请等待平台审核'), this.$t('提示'),{
                                        confirmButtonText: this.$t('确定'),
                                        confirmButtonClass:
                                            "themeColorkBgc borderNone",
                                        callback: (action) => {
                                            //关闭所有弹框
                                            
                                        },
                                    }
                                );
                                this.setmoney = '';
                                this.moneyPassword = '';
                                this.handlingfee = this.handlingfees
                                this.withdrawNum = false
                            } else {
                                this.$alert(res.msg || this.$t('请求出错，请稍后重试'), this.$t('提示'),{
                                        confirmButtonText: this.$t('确定'),
                                        confirmButtonClass:
                                            "themeColorkBgc borderNone",
                                        callback: (action) => {
                                            // this.closeBack(2);
                                        },
                                    }
                                );
                            }
                        });
                }
            });
        },
        //打开客服
        openService() {
            if (['vi'].includes(window.locale)) { // betcome直接跳客服窗口
                const url = this.$common.getCustomerService();
                window.open(url, "_blank");
                return;
            }
              //新旧客服判断
           if(window.customerServiceStatus == 1){  //新客服
                var obj = {};
                obj.host = this.$common.getHost();
                obj.clientCode = window.clientCode;
                obj.clientItem = window.childCode;
                obj.username = this.$common.getUser() && this.$common.getUser().username;
                obj.language = this.$i18n.locale;
                obj.theme = window.theme;
                obj.projectImgUrl = window.projectImgUrl;
                obj.orgin = window.location.origin + "/activity";
                var str = JSON.stringify(obj);
                str = window.btoa(str);
                let url = location.origin + "/func" + "/customerService/pc?s=" +str;
                window.open(url, "_blank");
            }else{ //旧客服
                  const url = this.$common.getCustomerService();
                  window.open(url, "_blank");
            }
        },
        openAddBankCard() {
            this.$router.push('/mcenter/bank');
            this.$emit('switchTab');
        },

         //关闭绑定手机号弹框
        onbalckPhone(){
            this.dialogPhone = false;
        },
        getPhoneCode(){
            // if (this.phone && !this.bindPhones) {
            //     if (!/^1[3456789]\d{9}$/.test(this.phone)) {
            //         this.$message.error(this.$t('手机号格式错误'));
            //         return;
            //     }
            // }
            if (!this.showPhone) {
                this.$message.error(this.$t('请输入手机号'));
                return;
            }
            this.$http
                .get(this.$api.sendSmsCode + "/" + this.showPhone +`?codePrefix=${this.$config.codePrefix}&codeFlag=1&functionId="+3`)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(this.$t('获取验证码成功'));
                        this.codeButDis = true;
                        var time = 60;
                        this.intervalID = setInterval(() => {
                            time--;
                            this.codeButtext = `${this.$t('获取验证码')}(${time})`;
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
        submitPhone(){
             let option = {
                phone:this.showPhone,
				smsCode:this.sms_code.toString(),
                codePrefix: this.$config.codePrefix,
            }
            this.$http.post(this.$api.bindPhone, option, true).then((res) => {
                    if (res.code == 0) {
                        this.getUserInfo();
                         this.$message.success(this.$t('绑定手机号成功'));
                        this.dialogPhone = false;
                        this.nextGetMoney();
                        //绑定成功后打开取款
                    }else{
                        this.$message.error(res.msg);
                    }
                });
        },

        confirm() {
            this.dialogClose();
        },
        dialogClose() {
            this.note = false;
        },
    },
};
</script>

<style lang="scss" scoped>
    .diaLogNote {
        .el-icon-close:before {
            content: "";
        }
        .confirmNoteStyle {
            width: 80%;
            height: 0.35rem;
            border-radius: 20px;
            background-color: #32a0ed;
            color: #fff;
            line-height: 0.35rem;
            margin-top: 0.2rem;
            font-size: 0.16rem;
            text-align: center;
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
            // display: flex;
            text-align: left;
            // width: 80%;
            white-space: pre-line;
        }
    }
    .withdraw-buttom-box {
        margin-left: -10px;
        margin-bottom: 10px;
        display:flex;
        justify-content:flex-start;
        align-items: center;
        .withdraw-buttom {
            display: flex;
            width: auto;
            height: 32px;
            border:1px solid #ccc;
            justify-content:center;
            align-items: center;
            padding: 0px 20px;
            text-align: center;
            border-radius: 5px;
            color: #000;
            cursor: pointer;
            margin:0 10px;
            &:hover {
                color: #fff;
                background: #54b9ff;
            }
        }
        
        .withdraw-buttom-act {
            color: #fff;
            background: #54b9ff;
        }
    }
    .refresh-img-animation {
            animation: mymove 1.5s infinite;
            // animation-iteration-count:infinite;
    }
    @keyframes mymove {
		0% {
			-webkit-transform: rotate(0deg);
		}

		// 25%{-webkit-transform:rotate(90deg);}
		50% {
			-webkit-transform: rotate(180deg);
		}

		// 75%{-webkit-transform:rotate(270deg);}
		100% {
			-webkit-transform: rotate(360deg);
		}
	}
    .alertHeader{
        text-align: center;
        .alertTitle{
            font-size: 16px;
            font-weight: bold;
        }
        
    }
    .phone-content{
        .title{
            color: #2D2B4D;
            font-size: 15px;
            white-space: nowrap;
        }
        .phoneBox{
            display: flex;
            align-items: center;
        }
        .codeBox{
            display: flex;
            align-items: center;
            margin: 0.32rem 0px;
        }
        .inputBox{
            flex-grow: 2;
            .phonemm{
                text-align: left;
                background: #f4f4f4;
                height: 0.44rem;
                line-height: 0.44rem;
                border-radius: 8px;
                padding-left: 10px;
            }
        }
        .p-btn-center{
            text-align: center;
        }
        .subBut {
             background: #54b9ff;
            width: 3.47rem;
            height: 0.44rem;
            border-radius: 50px;
            color: #fff;
        }
        .subBut:hover {
            background: #54b9ff;
        }
        .butCode {
            font-size: 0.15rem;
            padding: 0.12rem 0.2rem;
            height: 0.4rem;
            border: none;
            margin-left: 8px;
            color: #fff;
            background: #54b9ff;
        }
        .butCode:hover {
            background: #54b9ff;
            // margin-left: 0.1rem;
        }
        .el-button.is-disabled,
        .el-button.is-disabled:focus,
        .el-button.is-disabled:hover {
            margin-left: 0.1rem;
            opacity: 0.6 !important;
        }
        .el-button:focus, .el-button:hover {
        color: #fff;
        border-color: #54b9ff;
        background-color: #54b9ff;
    }
    }
    .footBox{
        margin-top: 20px;
        text-align: center;
        .submit-but{
            width: 50%;
            background: #54b9ff;
            border: none;
        }
        .problem-text{
            color: #fd9d5c;
            margin-top: 10px;
        }
    }
    .padding {
        // padding: 0 25%;
        width: 1180px;
        margin:  0 auto;
    }
    .title {
        font-size: 15px;
        font-weight: bold;
        line-height: 2;
    }
    .selectBox{
        width: 100%;
    }
    .prefixSlot {
                height: 20px;
                width: 20px;
                margin-top: 0.11rem;
    }
    .money-select-option-add-bank {
        display: flex;
        justify-content: space-between;
        .add-text {
            flex-grow: 1;
            text-align: left;
        }
        .add-bank-img {
            // color: #ffac74;
            font-size: 0.18rem;
            padding-top: 0.08rem;
            padding-right: 0.05rem;
        }
    }
    .item{
        padding: 15px;
        .tipBox{
            margin-top: 10px;
            .tips-text-ele {
                color: #a7a7a7;
                font-size: 13px;
                text-align: left;
                line-height: 0.18rem;
            }
        }
    }
    .headerBox {
        display: flex;
        padding: 15px;
        justify-content: space-between;
        .oneBtn {
            background: #54b9ff;
            color: #fff;
            border: none;
            border-radius: 25px;
            min-width: 160px;
        }
        .refMoney{
            width: 25px;
            height: 25px;
        }
    }
    .game-list-view {
        margin-top: 0.13rem;
        .box-game {
            display: flex;
            flex-wrap: wrap;
            .box-item-view {
                border: 1px solid #eee;
                width: calc(25% - 2px);
                // height: 56px;
                text-align: center;
                // flex-grow: 1;
                .game-money {
                    color: #999;
                    font-size: 0.12rem;
                    margin-bottom: 0.07rem;
                }
                .game-money-activty {
                    color: #ffac74;
                }
                .game-name {
                    color: #666;
                    margin: 0.07rem 0px;
                    font-size: 0.13rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: block;
                }
                .game-repair {
                    color: #666;
                    //   background: var;
                    border-radius: 0.1rem;
                    display: inline-block;
                    padding: 0px 0.1rem;
                    margin-bottom: 0.1rem;
                    font-size: 0.12rem;
                }
            }
        }
        .el-scrollbar__thumb {
            background: #54b9ff;
        }
        .el-scrollbar__bar.is-vertical {
            background: #f4f4f4;
        }
        .scroll-style {
            height: 2.5rem;
            border: 0.012rem solid #54b9ff;
            border-radius: 0.06rem;
        }
    }
    // 余额刷新动画
    .refreshAnimation {
        animation: refresh 0.5s infinite linear;
        -moz-animation: refresh 0.5s infinite linear;
        -webkit-animation: refresh 0.5s infinite linear;
        -o-animation: refreshing 0.5s infinite linear;
    }
    .refresh-img {
        width: 0.2rem;
        height: 0.19rem;
    }
    @keyframes refresh {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    @-moz-keyframes refresh {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes refresh {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @-o-keyframes refresh {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    
    .audit-box {
        display: flex;
        align-items: center;
        flex-direction: column;
        color: #a7a7a7;
        text-align: center;
        margin-top: 30  px;
        .tips {
            font-size: 16px;
            line-height: 22px;
        }
        .audit-line {
            width: 240px;
            height: 12px;
            margin: 15px auto 7px;
            border-radius: 50px;
            background-color: #e1e1e1;
            overflow: hidden;
            .line {
                width: 0;
                height: 100%;
                border-radius: 50px;
                background: #e7ae2a;
            }
        }
        .audit-count {
            font-size: 14px;
            line-height: 18px;
        }
    }
</style>