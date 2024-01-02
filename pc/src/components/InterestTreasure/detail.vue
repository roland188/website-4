<template>
    <div class="">
        <el-dialog :visible.sync="dialogVisible" width="30%" :modal-append-to-body="false" :append-to-body='true'
            :destroy-on-close="true" class="dialogD" :before-close="handleClose">
            <div slot="title">
                <p class="headerTitle">{{ $t('利息宝-存款') }}</p>
            </div>
            <div>
                <div class="titleColor title">
                    {{ $t('活动名称') }}：{{ lidata.name }}
                </div>
                <!-- <p class="title-f">购买利率</p> -->
                <div class="titleColor title-m">
                    {{ $t('存款总额：{x}元/可再存入{y}元', {
                        x: lidata.totalDeposit, y: lidata.totalDepositLimit - lidata.totalDeposit
                    }) }}

                </div>
                <div class="titleColor title-m">
                    {{ $t('存款笔数：{x}笔/可再存入{y}笔', {
                        x: lidata.totalDepositRoll, y: lidata.depositRollLimit -
                            lidata.totalDepositRoll
                    }) }}

                </div>
                <p class="titleColor title-m">{{ $t('存入金额') }}：</p>
                <el-input v-model="setMoney" type="number" :placeholder="plac" @blur="profitForecast"></el-input>
                <p class="tips">{{ $t(`预计最高利率{x}%，最高可获利息：{y}元`, { x: aprData.apr, y: aprData.interest }) }}</p>
                <p class="Description">{{ $t('购买利率说明') }}：</p>
                <el-collapse accordion>
                    <el-collapse-item v-for="(item, i) of lidata.levelData" :key="i">
                        <template slot="title">
                            <!-- <img loading="lazy" src="../../assets/image/dze/right.png" class="sanjiao" alt="" srcset="">
                       <img loading="lazy" src="../../assets/image/dze/bottom.png" class="sanjiao-b" alt="" srcset=""> -->
                            <p class="card-title"> {{ $t('存款{x}元', { x: item.amount }) }} <span
                                    class="float-r">{{ $t('最高年利率') }}：{{ item.apr }}%</span>
                            </p>
                        </template>
                        <div class="bgcard">
                            <p class="text" v-for="(it, ii) of item.detail" :key="ii">
                                {{ it.time }}{{ $t('小时') }} <span class="float-r">{{ $t('年利率') }}：{{ it.apr }}%</span>
                            </p>
                        </div>
                    </el-collapse-item>
                </el-collapse>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button round type="danger" class="btn" :disabled='disabledBtn' @click="onSubmit">{{ btnText
                }}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('存款成功')" :visible.sync="goit" :modal-append-to-body="false" :append-to-body='true'
            class="dialogD" width="400px" :center="true">
            <span>{{ $t('恭喜你，完成存款操作！您可在利息宝记录中查看投注详情以及奖金信息！') }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button round class="btn" @click="goit = false">{{ $t('知道了') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    // props:{
    //     itemData:Object
    // },
    data() {
        return {
            dialogVisible: false,
            setMoney: '',
            goit: false,
            lidata: {
                levelData: [],
            },
            aprData: {
                interest: 0,
                apr: 0,
            },
            minAmount: 0,
            plac: '',
            disabledBtn: false,
            itemId: '',
            btnText: this.$t('立即存入'),
        }
    },
    methods: {
        onSubmit() {
            if (this.setMoney < this.minAmount) {
                this.$message({
                    message: this.$t('输入的金额小于最低限额')+'：' + this.minAmount,
                    type: 'warning',
                })
                return
            }
            if (this.setMoney > this.lidata.maxDepositLimit) {
                this.$message({
                    message: this.$t('输入的金额大于最高限额')+'：' + this.lidata.maxDepositLimit,
                    type: 'warning',
                })
                return
            }
            if (this.lidata.depositRollLimit - this.lidata.totalDepositRoll <= 0) {
                this.$message({
                    message: this.$t('存入笔数超限'),
                    type: 'warning',
                })
                return
            }
            if (this.lidata.totalDepositLimit - this.lidata.totalDeposit <= 0) {
                this.$message({
                    message: this.$t('存入金额超限'),
                    type: 'warning',
                })
                return
            }
            let money = this.lidata.totalDepositLimit - this.lidata.totalDeposit;
            if (this.setMoney > money) {
                this.$message({
                    message: this.$t('存入金额超限,您最多还能存入')+'：' + money,
                    type: 'warning',
                })
                return
            }
            let option = {
                amount: this.setMoney,
                interestId: this.lidata.id,
            }
            this.$http.post(this.$api.joininterest, option).then((res) => {
                if (res.code === 0) {
                    this.goit = true
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'warning',
                    })
                }
            })
        },
        open() {
            if (this.itemId) {
                this.dialogVisible = true
                this.getdata()
            }
        },
        getdata() {
            let id = '/' + this.itemId
            this.$http.get(this.$api.interestDetail, id, true).then((res) => {
                if (res.code == 0) {
                    res.data.levelData = res.data.levelData.sort((a, b) => {
                        return a.amount - b.amount
                    })
                    this.minAmount = res.data.minDepositLimit;
                    this.lidata = res.data
                    this.plac = this.$t('单笔最低额度：{x}元',{x:this.minAmount})
                    this.disabledBtn
                    if (res.data.status == 3) {
                        this.btnText = this.$t('未开放')
                        this.disabledBtn = true
                    }
                    if (res.data.status == 2) {
                        this.btnText = this.$t('结束申请')
                        this.disabledBtn = true
                    }
                    if (res.data.status == 1) {
                        this.btnText = this.$t('结束计息')
                        this.disabledBtn = true
                    }
                    if (res.data.status == 4) {
                        this.btnText = this.$t('立即存入')
                        this.disabledBtn = false
                    }
                }
            })
        },
        handleClose() {
            this.setMoney = ''
            this.dialogVisible = false
        },
        //预计盈利
        profitForecast() {
            let option = {
                amount: this.setMoney,
                interestId: this.lidata.id,
            }
            this.$http.post(this.$api.profitForecast, option).then((res) => {
                if (res.code === 0) {
                    this.aprData = res.data
                }
            })
        },
    },
}
</script>

<style lang="scss" >
.dialogD {
    .is-disabled {
        opacity: 0.5;
    }

    .el-dialog__body {
        padding: 30px 70px;
    }

    .headerTitle {
        text-align: center;
        color: #2d2b4d;
        font-size: 24px;
    }

    .titleColor {
        color: #2d2b4d;
    }

    .title-f {
        color: #9695a6;
        font-size: 14px;
    }

    .title {
        font-size: 20px;
        margin-bottom: 8px;
    }

    .title-m {
        font-size: 15px;
        margin: 8px 0;
    }

    .tips {
        text-align: right;
        color: #f9a425;
        font-size: 13px;
        margin: 10px 0;
    }

    .Description {
        color: #1d1717;
        font-size: 13px;
        margin-bottom: 15px;
    }

    .bgcard {
        background: #f7f7f7;
        padding: 10px 24px;

        .text {
            color: #7d7d7d;
            font-size: 15px;
        }
    }

    .float-r {
        float: right;
    }

    .card-title {
        color: #1d1717;
        font-size: 15px;
        width: 100%;
    }

    .sanjiao {
        width: 8px;
        height: 10px;
    }

    .sanjiao-b {
        width: 10px;
        height: 8px;
    }

    .btn {
        background: #e5414a;
        width: 100%;
        color: #ffffff;
        font-size: 15px;
        border: none;
    }

    .confirmButtonClass {}
}
</style>