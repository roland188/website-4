<template>
    <Back class="lottery" :img="require('../../../assets/shop/ribbon.png')" noStyle>
        <div class="draw_area">
            <div class="machine_bag"></div>
            <div class="balls">
                <div
                    class="float_ball null null1"
                    :class="{ 'null-1': btnshow }"
                >
                    <MyImage loading="lazy" :src="require('../../../assets/shop/dow.png')" class="imgY" alt />
                </div>
                <div
                    class="float_ball null null2"
                    :class="{ 'null-2': btnshow }"
                >
                    <MyImage loading="lazy" :src="require('../../../assets/shop/dow1.png')" class="imgY" alt />
                </div>
                <div
                    class="float_ball null null3"
                    :class="{ 'null-3': btnshow }"
                >
                    <MyImage loading="lazy" :src="require('../../../assets/shop/dow.png')" class="imgY" alt />
                </div>
                <div
                    class="float_ball null null4"
                    :class="{ 'null-4': btnshow }"
                >
                    <MyImage loading="lazy" :src="require('../../../assets/shop/dow1.png')" class="imgY" alt />
                </div>
                <div
                    class="float_ball null null5"
                    :class="{ 'null-5': btnshow }"
                >
                    <MyImage loading="lazy" :src="require('../../../assets/shop/dow.png')" class="imgY" alt />
                </div>
                <div
                    class="float_ball null null6"
                    :class="{ 'null-6': btnshow }"
                >
                    <MyImage loading="lazy" :src="require('../../../assets/shop/dow1.png')" class="imgY" alt />
                </div>
                <div
                    v-if="imgArrey[0]"
                    class="float_ball award award1"
                    :class="{ 'award-turn-1': btnshow }"
                >
                    <MyImage loading="lazy"
                        :src="$config.getImgUrl(imgArrey[0])"
                        class="imgY"
                        alt
                    />
                </div>
                <div
                    v-if="imgArrey[1]"
                    class="float_ball award award2"
                    :class="{ 'award-turn-2': btnshow }"
                >
                    <MyImage loading="lazy"
                        :src="$config.getImgUrl(imgArrey[1])"
                        class="imgY"
                        alt
                    />
                </div>
                <div
                    v-if="imgArrey[2]"
                    class="float_ball award award3"
                    :class="{ 'award-turn-3': btnshow }"
                >
                    <MyImage loading="lazy"
                        :src="$config.getImgUrl(imgArrey[2])"
                        class="imgY"
                        alt
                    />
                </div>
                <div
                    v-if="imgArrey[3]"
                    class="float_ball award award4"
                    :class="{ 'award-turn-4': btnshow }"
                >
                    <MyImage loading="lazy"
                        :src="$config.getImgUrl(imgArrey[3])"
                        class="imgY"
                        alt
                    />
                </div>
                <div
                    v-if="imgArrey[4]"
                    class="float_ball award award5"
                    :class="{ 'award-turn-5': btnshow }"
                >
                    <MyImage loading="lazy"
                        :src="$config.getImgUrl(imgArrey[4])"
                        class="imgY"
                        alt
                    />
                </div>
                <div
                    v-if="imgArrey[5]"
                    class="float_ball award award6"
                    :class="{ 'award-turn-6': btnshow }"
                >
                    <MyImage loading="lazy"
                        :src="$config.getImgUrl(imgArrey[5])"
                        class="imgY"
                        alt
                    />
                </div>
                <div
                    v-if="imgArrey[6]"
                    class="float_ball award award7"
                    :class="{ 'award-turn-7': btnshow }"
                >
                    <MyImage loading="lazy"
                        :src="$config.getImgUrl(imgArrey[6])"
                        class="imgY"
                        alt
                    />
                </div>
                <div
                    class="win-anim"
                    v-show="result"
                    :class="{ 'win-anim-y': yuanBtn }"
                ></div>
            </div>

            <div class="machine">
                <div class="machine-top"></div>
                <div class="machine-buttom"></div>
                <MyImage loading="lazy"
                    :src="require('../../../assets/shop/btn.png')"
                    class="btn-machine"
                    @click="onLottery"
                />
                <Back class="hand" :img="require('../../../assets/shop/hand.png')" noStyle></Back>
                <Back class="tips" :img="require('../../../assets/shop/tips.png')" noStyle>
                    {{ $t("花费") }}
                    <b style="color:#F9E324;">{{ clientMalls.singleAmount }}</b>
                    {{ clientMalls.currency }}
                </Back>
            </div>
            <div class="tip-text">
                <MyImage loading="lazy" :src="require('../../../assets/shop/text.png')" alt="" />
            </div>
            <div class="buttons">
                <Back
                    class="show_draw_goods show_draw"
                    :img="require('../../../assets/shop/btn6.png')"
                    noStyle
                    @click="openPage(0)"
                ></Back>
                <Back
                    class="show_draw_result show_draw"
                    :img="require('../../../assets/shop/btn2.png')"
                    noStyle
                    @click="openPage(1)"
                ></Back>
                <!-- <div class="show_draw_sing show_draw" @click="openSign"></div> -->
                <br />
                <br />
                <br />
                <div class="amount">
                    <div class="in">
                        <b>{{ clientMalls.currency }}</b>
                        &nbsp;&nbsp;
                        <span style="display: inline-block; min-width: 180px">
                            {{ userRmb }} </span
                        >&nbsp;&nbsp;&nbsp;
                        <i class="line">|</i>
                        <a class="guize" @click="openPage(2)">{{
                            $t("规则")
                        }}</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="rolldown">
            <MyImage loading="lazy" :src="require('../../../assets/shop/down.png')" alt srcset />
        </div>

        <el-dialog
            :visible.sync="dialogVisible"
            width="400px"
            top="30vh"
            :show-close="false"
        >
            <div slot="title">
                <div>
                    <span class="titleDia">{{ $t("温馨提示") }}</span>
                    <MyImage loading="lazy"
                        class="close-btn cursorPoint"
                        :src="require('../../../assets/shop/close.png')"
                        @click="dialogVisible = false"
                    />
                </div>
            </div>
            <div class="dialogRes">
                <div class="dialogFlex">
                    <MyImage loading="lazy"
                        :src="require('../../../assets/shop/reslut.png')"
                        class="img"
                        v-if="!failure"
                        alt=""
                    />
                    <MyImage loading="lazy" style="vertical-align: middle;display: inline-block;width: 20px;height:20px;"
                        :src="require('../../../assets/shop/X.png')"
                        class="img"
                        v-if="failure"
                        alt=""
                    />
                    <p class="text">
                        {{ remark }}
                    </p>
                </div>
                <div class="btnBox">
                    <!-- <el-button class="btn" @click="dialogVisible = false">
                        {{ $t("确定") }}
                    </el-button> -->
                    <span slot="footer" class="dialog-footer">
                        <el-button class="subBtn" @click="dialogVisible = false"> {{$t('确定')}}</el-button>
                    </span>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="showDialg"
            top="0vh"
            :center="true"
            :show-close="false"
            custom-class="signDia"
        >
            <div>
                <div class="signbg">
                    <p class="name">{{ $t("每日签到抽奖") }}</p>
                    <div class="dayflex">
                        <p class="day">——————</p>
                        <p class="day">
                            {{ $t("连续签到") }}{{ signdata.days
                            }}{{ $t("天") }}
                        </p>
                        <p class="day">——————</p>
                    </div>
                    <MyImage loading="lazy"
                        :src="require('../../../assets/shop/money.png')"
                        class="sign_img"
                        alt=""
                    />
                    <div>
                        <p class="tips">
                            {{ $t("今日签到") }}：<span class="days">
                                {{ signdata.todaySignPoint }}
                            </span>
                            {{ clientMalls.currency }}
                        </p>
                        <p class="tips1">
                            {{ $t("再连续签到") }}
                            <span class="days">
                                {{ signdata.nextDays }}
                            </span>
                            {{ $t("天可获得") }}
                            <span class="days">
                                {{ signdata.nextMultiple }}
                            </span>
                            {{ $t("倍奖励") }}
                        </p>
                        <p class="tips1" v-if="signdata.holidayDTO">
                            {{ $t("当前") }}
                            <span class="days">
                                {{ signdata.holidayDTO.name }}
                            </span>
                            {{ $t("节假期间签到额外加") }}
                            <span class="days">
                                {{ signdata.holidayDTO.signMultiple }}
                            </span>
                            {{ $t("倍奖励") }}
                        </p>
                    </div>
                    <div
                        class="btn_sign"
                        :class="{ disabledbtn: signdata.alreadySign }"
                        @click="onSign"
                    >
                        {{ signText }}
                    </div>
                </div>
                <div class="closeBox">
                    <MyImage loading="lazy"
                        :src="require('../../../assets/shop/closes.png')"
                        class="close-img"
                        @click="setShowDialg(false)"
                    />
                </div>
            </div>
        </el-dialog>

        <!-- 抽重实物 -->
        <changeModal ref="changeModal" />
    </Back>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import changeModal from "./changeModal";
// import { showLogin } from '../../login/login.js'
export default {
    components: {
        changeModal,
    },
    computed: mapState({
        clientMalls: (state) => state.clientMall,
        showDialg: (state) => state.showDialg,
        userRmb: (state) => state.userRmb,
    }),
    data() {
        return {
            btnshow: false,
            yuanBtn: false,
            result: false,
            dialogVisible: false,
            signdata: { holidayDTO: "" },
            remark: "",
            failure: false,
            clickRes: true, //防止重复点击
            signText: this.$t('签到'),
            imgArrey: [],
        };
    },
    created() {
        this.shoppingMallList();
        this.$nextTick(() => {
            if (this.showDialg) {
                this.getSignData();
            }
        });
    },
    watch: {
        showDialg(newValue) {
            if (newValue) {
                this.getSignData();
            }
        },
    },
    methods: {
        ...mapMutations(["setShowDialg", "setUserRmb", "setShowLogin"]),
        onLottery() {
            if (!this.$common.getUser()) {
                this.setShowLogin({ show: true, isLogin: true })
                return
            }
            if (this.userRmb < this.clientMalls.singleAmount) {
                this.failure = true;
                this.remark = `${this.$t("用户")}${this.clientMalls.currency}${this.$t("小于抽奖")}${this.clientMalls.currency}`;
                this.dialogVisible = true;
                return;
            }
            if (!this.clickRes) {
                return;
            }
            this.clickRes = false;
            this.btnshow = true;
            setTimeout(() => {
                this.btnshow = false;
                this.result = !this.result;
                this.yuanBtn = !this.yuanBtn;
            }, 3000);
            setTimeout(() => {
                this.yuanBtn = !this.yuanBtn;
                this.result = !this.result;

                this.getRes();
            }, 6000);
        },
        getRes() {
            this.$http.post(this.$api.doLottery).then((res) => {
                this.clickRes = true;
                this.getMemberPoint();
                if (res.data.hit) {
                    if (res.data.type == 1) {
                        //实物奖品
                        // res.data.name = res.data.remark;
                        this.$refs.changeModal.changevisible = true;
                        this.$refs.changeModal.canClose = false
                        this.$refs.changeModal.changeItem = res.data;
                        this.$refs.changeModal.isShowBox = false;
                        return;
                    }
                    this.failure = false;
                    this.remark = res.data.remark;
                    this.dialogVisible = true;
                } else {
                    this.failure = true;
                    this.remark = res.data.remark;
                    this.dialogVisible = true;
                }
            });
        },
        openPage(type) {
            if (type == 1 && !this.$common.getUser()) {
                this.setShowLogin({ show: true, isLogin: true })
                return
            }
            this.$emit("routing", type);
        },
        openSign() {
            this.setShowDialg(true);
        },
        //获取签到信息
        getSignData() {
            this.$http.get(this.$api.getSignPrecondition).then((res) => {
                if (res.code == 0) {
                    this.signdata = res.data;
                    if (this.signdata.alreadySign) {
                        this.signText = this.$t("已签到");
                    } else {
                        this.signText = this.$t("签到");
                    }
                }
            });
        },
        onSign() {
            this.$http.get(this.$api.doSignIn).then((res) => {
                if (res.data.signSucceed) {
                    this.$message({
                        message: this.$t("签到成功"),
                        type: "success",
                    });
                    this.getSignData();
                    this.getMemberPoint();
                } else {
                    this.$message(res.data.msg);
                }
            });
        },
        //更新剩余币数
        getMemberPoint() {
            if (!this.$common.getUser()) return
            this.$http.get(this.$api.getMemberPoint).then((res) => {
                if (res.code == 0) {
                    this.setUserRmb(res.data.balance);
                }
            });
        },
        shoppingMallList() {
            this.$http.get(this.$api.shoppingMallList).then((res) => {
                if (res.code == 0) {
                    if (res.data.lotteryMallVOList.length >= 0) {
                        let list = res.data.lotteryMallVOList;
                        list.sort((a, b) => {
                            return b.amount - a.amount;
                        });
                        list.forEach((element) => {
                            this.imgArrey.push(element.imgUrl);
                        });
                    }
                }
            });
        },
    },
};
</script>

<style lang="scss" >
.signDia {
    text-align: center;
    background: none;

    .el-dialog__body {
        // padding: 0;
        text-align: center;
        background: url("../../../assets/shop/bgSign.png") no-repeat;
        background-size: 100% 100%;
    }
    .signbg {
        background: url("../../../assets/shop/signdia.png") no-repeat;
        background-size: 100% 100%;
        width: 544px;
        height: 718px;
        display: inline-block;
        .dayflex {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .name {
            color: #fff;
            font-size: 40px;
            font-weight: bold;
            margin-top: 159px;
        }
        .day {
            color: #d75e02;
            font-size: 16px;
            margin: 0 10px;
        }
        .sign_img {
            width: 160px;
            height: 160px;
        }
        .tips {
            color: #333333;
            font-size: 16px;
            margin: 0;
            margin-top: 20px;
        }
        .tips1 {
            color: #acacac;
            font-size: 14px;
            margin: 0;
        }
        .days {
            color: #fa7a03;
        }

        .btn_sign {
            background: url("../../../assets/shop/btnbg.png") no-repeat;
            background-size: 100% 100%;
            color: #d31112;
            text-align: center;
            height: 80px;
            line-height: 80px;
            font-size: 20px;
            font-weight: bold;
            position: absolute;
            bottom: 135px;
            width: 30%;
            left: 35%;
            cursor: pointer;
        }
        .disabledbtn {
            filter: grayscale(5);
        }
    }
    .closeBox {
        text-align: center;
        margin-top: 10px;
    }
    .close-img {
        width: 50px;
        height: 50px;
    }
}
.close-btn {
    position: absolute;
    top: 12px;
    right: 18px;
    width: 30px;
    height: 30px;
    transition: 1s;
}
.close-btn:hover {
    transform: rotate(180deg);
}
.titleDia {
    color: #333;
    font-size: 18px;
}
.dialogRes {
    .dialogFlex {
        display: flex;
        align-items: center;
        .img {
            width: 75px;
            height: 75px;
            margin-right: 10px;
            flex-shrink: 0;
        }
        .text {
            color: #111;
            font-size: 15px;
        }
    }
    .btnBox {
        text-align: right;
        .btn {
            background: red;
            color: #fff;
            width: 100px;
            border: none;
        }
    }
}
.lottery {
    background: url("../../../assets/shop/ribbon.png") no-repeat center -40px;
    background-position: center -40px;
    width: 100%;
    position: relative;
    // height: 600px;
    .draw_area {
        height: 870px;
        position: relative;
        top: -75px;
        .machine_bag {
            width: 73px;
            height: 69px;
            background: url("../../../assets/shop/yuan.png") no-repeat;
            left: 50%;
            top: 583px;
            margin-left: 344px;
            position: absolute;
            z-index: 21;
        }
        .balls {
            width: 350px;
            height: 350px;
            position: absolute;
            left: 50%;
            margin-left: 268px;
            top: 175px;
            .float_ball {
                color: #fff;
            }
            .null1 {
                left: 50%;
                top: 50%;
                width: 54px;
                animation: null1data 4.5s linear infinite;
            }
            .null2 {
                left: 15%;
                top: 55%;
                width: 62px;
                animation: null2data 4.5s linear infinite;
            }
            .null3 {
                left: 33%;
                top: 60%;
                animation: null3data 4.5s linear infinite;
            }
            .null4 {
                left: 56%;
                top: 56%;
                width: 80px;
                animation: null4data 4.5s linear infinite;
            }
            .null5 {
                left: 47%;
                top: 63%;
                width: 80px;
                animation: null5data 4.5s linear infinite;
            }
            .null6 {
                left: 68%;
                top: 46%;
                animation: null6data 4.5s linear infinite;
            }
            .award {
                width: 80px;
                height: 80px;
                line-height: 80px;
                text-align: center;
                background: url("../../../assets/shop/dow2.png") no-repeat 50%;
                background-size: contain;
            }
            .award1 {
                left: 46%;
                top: 39%;
                width: 80px;
                transform: rotate(-15deg);
                animation: award1data 4.5s linear infinite;
            }
            .award2 {
                left: 11%;
                top: 46%;
                animation: award2data 4.5s linear infinite;
            }
            .award3 {
                left: 28%;
                top: 59%;
                -webkit-transform: rotate(15deg);
                transform: rotate(15deg);
                animation: award3data 4.5s linear infinite;
            }
            .award4 {
                left: 58%;
                top: 53%;
                -webkit-transform: rotate(25deg);
                transform: rotate(25deg);
                animation: award4data 4.5s linear infinite;
            }
            .award5 {
                left: 24%;
                top: 26%;
                animation: award5data 4.5s linear infinite;
            }
            .award6 {
                left: 30%;
                top: 30%;
                animation: award6data 4.5s linear infinite;
            }
            .award7 {
                left: 56%;
                top: 22%;
                animation: award7data 4.5s linear infinite;
            }
            div {
                position: absolute;
                transform-origin: center;
            }
            .imgY {
                width: 50px;
                height: 50px;
                vertical-align: middle;
            }
            .win-anim {
                top: 150px;
                right: 330px;
                width: 40px;
                height: 40px;
                background: url("../../../assets/shop/dow.png") no-repeat 50%;
                background-size: contain;
                z-index: 21;
            }
            .win-anim-y {
                animation: winan 3s linear 1;
                -webkit-animation-fill-mode: forwards;
            }
            .award-turn-1 {
                left: 46%;
                top: 39%;
                width: 80px;
                animation: award-turn 1s linear 3;
            }
            .award-turn-2 {
                left: 11%;
                top: 46%;
                animation: award-turn-data2 1s linear 3;
                animation-delay: 0.1s;
            }
            .award-turn-3 {
                animation: award-turn-data3 1s linear 3;
            }
            .award-turn-4 {
                animation: award-turn-data4 1s linear 3;
            }
            .award-turn-5 {
                animation: award-turn-data5 1s linear 3;
            }
            .award-turn-6 {
                animation: award-turn-data6 1s linear 3;
            }
            .award-turn-7 {
                animation: award-turn-data7 1s linear 3;
            }
            .null-1 {
                left: 50%;
                top: 50%;
                width: 54px;
                animation: ball1-data 1s linear 3;
            }
            .null-2 {
                animation: ball2-data 1s linear 3;
            }
            .null-3 {
                animation: ball3-data 1s linear 3;
            }
            .null-4 {
                animation: ball4-data 1s linear 3;
            }
            .null-5 {
                animation: ball5-data 1s linear 3;
            }
            .null-6 {
                animation: ball6-data 1s linear 3;
            }
        }
        .machine {
            overflow: auto;
            width: 1056px;
            height: 612px;
            position: absolute;
            bottom: 83px;
            left: 50%;
            .machine-top {
                position: absolute;
                z-index: 21;
                width: 1056px;
                height: 612px;
                background: url("../../../assets/shop/machine.png") no-repeat;
            }
            .machine-buttom {
                z-index: 20;
                width: 720px;
                height: 140px;
                background: url("../../../assets/shop/podium.png") no-repeat ;
                background-size: cover;
                position: absolute;
                top: 420px;
                left: 10%;
            }
            .btn-machine {
                position: absolute;
                z-index: 22;
                bottom: 0;
                left: 50%;
                border: none;
                margin-left: -176px;
                width: 193px;
                height: 88px;
                // background: url("../../../assets/shop/btn.png") no-repeat bottom;
                cursor: pointer;
            }
            .btn-machine:active {
                filter: grayscale(2);
                cursor: not-allowed;
            }
            .hand {
                width: 136px;
                height: 86px;
                background: url("../../../assets/shop/hand.png") no-repeat;
                position: absolute;
                z-index: 22;
                left: 494px;
                top: 538px;
                animation-name: Handdata;
                animation-timing-function: ease-in-out;
                animation-duration: 0.5s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
            }
            .tips {
                width: 235px;
                height: 56px;
                background: url("../../../assets/shop/tips.png") no-repeat;
                text-align: center;
                line-height: 39px;
                color: #fff;
                position: absolute;
                bottom: 13px;
                left: 85px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                font-size: 12px;
                opacity: 1;
                .red {
                    color: #db4508;
                }
            }
        }
        .tip-text {
            position: absolute;
            top: 280px;
            left: 50%;
            margin-left: -504px;
        }
        .buttons {
            position: absolute;
            bottom: 120px;
            left: 50%;
            margin-left: -500px;
            .show_draw_goods {
                cursor: pointer;
                background: url("../../../assets/shop/btn6.png") no-repeat;
                height: 80px;
                width: 180px;
                display: inline-block;
            }
            .show_draw_result {
                cursor: pointer;
                background: url("../../../assets/shop/btn2.png") no-repeat; 
                width: 153px;
                height: 80px;
                display: inline-block;
            }
            .show_draw_sing {
                cursor: pointer;
                background: url("../../../assets/shop/sign.png") no-repeat;
                width: 153px;
                height: 80px;
                display: inline-block;
            }
            .show_draw:active {
                filter: grayscale(2);
            }
            .amount {
                border: 8px solid #EFCA81;
                // width: 355px;
                .in {
                    border: 1px dotted #fff;
                    margin: -4px;
                    min-height: 44px;
                    line-height: 44px;
                    color: #fff;
                    font-size: 14px;
                    padding: 0 2em;
                }
                .line {
                    vertical-align: middle;
                    font-style: normal;
                    margin-right: 10px;
                }
                a {
                    color: #fff;
                    cursor: pointer;
                }
                span {
                    color: #db510a;
                    font-size: 18px;
                }
            }
        }
    }
    .rolldown {
        position: absolute;
        bottom: 30px;
        left: 50%;
        margin-left: -16px;
        -webkit-animation: bounce 3s 3s infinite;
        animation: bounce 3s 3s infinite;
    }
    @keyframes award1data {
        0% {
            transform: translate(0);
        }
        50% {
            transform: translate(-8px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award2data {
        0% {
            transform: translate(0);
        }
        50% {
            transform: translate(-3px, 4px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award3data {
        0% {
            transform: translate(0);
        }
        50% {
            transform: translate(-1px, 3px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award4data {
        0% {
            transform: translate(0);
        }
        50% {
            transform: translate(-3px, 1px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award5data {
        0% {
            transform: translate(0);
        }
        50% {
            transform: translate(2px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award6data {
        0% {
            transform: translate(0);
        }
        50% {
            transform: translate(-2px, 2px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award7data {
        0% {
            transform: translate(0);
        }
        50% {
            transform: translate(-8px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes null6data {
        0% {
            transform: translate(0);
        }

        50% {
            transform: translate(10px, 12px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes null5data {
        0% {
            transform: translate(0);
        }

        50% {
            transform: translate(12px, -12px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes null4data {
        0% {
            transform: translate(0);
        }

        50% {
            transform: translate(6px, 14px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes null3data {
        0% {
            transform: translate(0);
        }

        50% {
            transform: translate(-17px, -16px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes null2data {
        0% {
            transform: translate(0);
        }

        50% {
            transform: translate(17px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes null1data {
        0% {
            transform: translate(0);
        }

        50% {
            transform: translate(-1px, -13px);
        }
        100% {
            transform: translate(0);
        }
    }

    @keyframes Handdata {
        0% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
        }

        100% {
            -webkit-transform: translateY(-20px);
            transform: translateY(-20px);
        }
    }

    @keyframes bounce {
        0%,
        20%,
        53%,
        80%,
        100% {
            -webkit-animation-timing-function: cubic-bezier(
                0.215,
                0.61,
                0.355,
                1
            );
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }

        40%,
        43% {
            -webkit-animation-timing-function: cubic-bezier(
                0.755,
                0.05,
                0.855,
                0.06
            );
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            -webkit-transform: translate3d(0, -30px, 0);
            transform: translate3d(0, -30px, 0);
        }
        70% {
            -webkit-animation-timing-function: cubic-bezier(
                0.755,
                0.05,
                0.855,
                0.06
            );
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            -webkit-transform: translate3d(0, -15px, 0);
            transform: translate3d(0, -15px, 0);
        }
        90% {
            -webkit-transform: translate3d(0, -4px, 0);
            transform: translate3d(0, -4px, 0);
        }
    }

    @keyframes ball1-data {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-50px, -85px);
        }
        40% {
            transform: translate(105px, -50px);
        }
        60% {
            transform: translate(25px, -55px);
        }
        80% {
            transform: translate(55px, -25px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes ball2-data {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-50px, -75px);
        }
        40% {
            transform: translate(75px, -50px);
        }
        60% {
            transform: translate(25px, -85px);
        }
        80% {
            transform: translate(-25px, -25px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes ball3-data {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-40px, -85px);
        }
        40% {
            transform: translate(90px, 50px);
        }
        60% {
            transform: translate(155px, -75px);
        }
        80% {
            transform: translate(-25px, -15px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes ball4-data {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-50px, -85px);
        }
        40% {
            transform: translate(74px, -121px);
        }
        60% {
            transform: translate(-122px, -153px);
        }
        80% {
            transform: translate(-77px, 33px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes ball5-data {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(84px, -174px);
        }
        40% {
            transform: translate(-93px, 12px);
        }
        60% {
            transform: translate(-111px, -170px);
        }
        80% {
            transform: translate(-1px, -207px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes ball6-data {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(25px, -35px);
        }
        40% {
            transform: translate(-155px, 65px);
        }
        60% {
            transform: translate(35px, -75px);
        }
        80% {
            transform: translate(-25px, -25px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes winan {
        0% {
            top: 150px;
            right: 330px;
        }
        15% {
            top: 177px;
            right: 373px;
        }
        30% {
            top: 220px;
            right: 376px;
        }
        45% {
            top: 318px;
            right: 376px;
        }
        55% {
            top: 370px;
            right: 376px;
        }
        65% {
            top: 394px;
            right: 358px;
        }
        75% {
            top: 406px;
            right: 288px;
        }
        80% {
            top: 406px;
            right: 288px;
        }
        90% {
            top: 422px;
            right: 218px;
        }
        100% {
            top: 450px;
            right: 218px;
        }
    }
    @keyframes award-turn {
        0% {
            transform: translate(0);
        }

        20% {
            transform: translate(31px, 73px);
        }
        40% {
            transform: translate(-90px, 60px);
        }
        60% {
            transform: translate(-140px, -25px);
        }
        80% {
            transform: translate(-20px, -118px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award-turn-data2 {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(220px, -65px);
        }
        40% {
            transform: translate(58px, -144px);
        }
        60% {
            transform: translate(94px, 32px);
        }
        80% {
            transform: translate(193px, -102px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award-turn-data3 {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-40px, -85px);
        }
        40% {
            transform: translate(60px, -50px);
        }
        60% {
            transform: translate(55px, -75px);
        }
        80% {
            transform: translate(-35px, -25px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award-turn-data4 {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(40px, -55px);
        }
        40% {
            transform: translate(60px, -50px);
        }
        60% {
            transform: translate(-135px, -80px);
        }
        80% {
            transform: translate(-35px, -25px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award-turn-data5 {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-65px, -35px);
        }
        40% {
            transform: translate(60px, -50px);
        }
        60% {
            transform: translate(45px, -75px);
        }
        80% {
            transform: translate(25px, -25px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award-turn-data6 {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(25px, -35px);
        }
        40% {
            transform: translate(-75px, 105px);
        }
        60% {
            transform: translate(35px, -70px);
        }
        80% {
            transform: translate(-25px, -25px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes award-turn-data7 {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-12px, -54px);
        }
        40% {
            transform: translate(-143px, -30px);
        }
        60% {
            transform: translate(-121px, 127px);
        }
        80% {
            transform: translate(27px, 112px);
        }
        100% {
            transform: translate(0);
        }
    }
}
</style>