<template>
    <!-- 记录 -->
    <div class="records-layout">
        <el-dialog
            :visible.sync="show"
            width="800px"
            :show-close="isShowClose"
            :modal="isShowModal"
            :close-on-click-modal="false"
        >
            <div class="records-container">
                <div class="header">
                    <div class="nav-bar">
                        <div
                            class="title"
                            :class="{active:navId == 0}"
                            @click="navId = 0"
                        >{{$t('抽奖兑奖')}}</div>
                        <div
                            class="title"
                            :class="{active:navId == 1}"
                            @click="navId = 1"
                        >{{$t('积分流水')}}</div>
                    </div>

                    <img loading="lazy"
                        class="close-btn cursorPoint"
                        v-lazy="require('../../../assets/shop/close.png')"
                        @click="closeDialog"
                    />
                </div>

                <!-- 抽奖兑奖 -->
                <div class="content" v-if="navId == 0">
                    <div class="tips">{{$t('温馨提示: 只显示最近一个月的记录！中奖实物和兑换实物均在每周一统一进行发货。请您在抽中奖品后及时提供您的收货信息，如果奖品在一个月时间内客户未进行确认，逾期者视为放弃。')}}</div>
                    <div class="table-box">
                        <table
                            cellspacing="0"
                            cellpadding="0"
                            border="1"
                            width="100%"
                            class="table"
                            style="margin-top: 0px;border-collapse: collapse;"
                        >
                            <thead>
                                <th>{{$t('名称')}}</th>
                                <th>{{$t('类型')}}</th>
                                <th>{{$t('消费积分')}}</th>
                                <th>{{$t('创建时间')}}</th>
                                <th>{{$t('备注')}}</th>
                                <th>{{$t('操作')}}</th>
                            </thead>
                            <tbody v-if="reqPrizeRecord">
                                <tr v-for="(item,i) in prizeRecordList" :key="i">
                                    <td
                                        v-if="item.type == 1 && item.shoppingCount != 1"
                                    >{{item.shoppingName}}({{item.shoppingCount}})</td>
                                    <td v-else>{{item.shoppingName}}</td>
                                    <td>{{item.type | typeStr(that) }}</td>
                                    <td>{{item.amount}}</td>
                                    <td>{{item.createdAt | timeSwitch}}</td>
                                    <td>{{item.remark || '--'}}</td>
                                    <td
                                        style="color:blue;"
                                        v-if="item.status == 0"
                                    >{{item.status | statusStr(that)}}</td>
                                    <td v-if="item.status == 1">{{item.status | statusStr(that)}}</td>
                                    <td
                                        style="color:red;"
                                        v-if="item.status == 2"
                                    >{{item.status | statusStr(that)}}</td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <td colspan="6" class="nothing">--{{$t('暂无记录')}}--</td>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- 腾币流水 -->
                <div class="content" v-if="navId == 1">
                    <div class="tips">{{$t('温馨提示: 只显示最近一个月的记录！')}}</div>
                    <div class="table-box">
                        <table
                            cellspacing="0"
                            cellpadding="0"
                            border="1"
                            width="100%"
                            class="table"
                            style="margin-top: 0px;border-collapse: collapse;"
                        >
                            <thead>
                                <th>{{$t('时间')}}</th>
                                <th>{{$t('事件')}}</th>
                                <th>{{$t('变动')}}</th>
                                <th>{{$t('余额')}}</th>
                            </thead>
                            <tbody v-if="reqWaterRecord">
                                <tr v-for="(item,i) in waterRecordList" :key="i">
                                    <td>{{item.createdAt | timeSwitchAll}}</td>
                                    <td
                                        style="color:blue;"
                                        v-if="item.type == 0 || item.type == 1 ||item.type == 6 || item.type == 8 "
                                    >{{item.type | waterTypeStr(that)}}</td>
                                    <td
                                        v-if="item.type == 2 || item.type == 3 ||item.type == 4 ||item.type == 5"
                                    >{{item.type | waterTypeStr(that)}}</td>
                                    <td>{{item.amount}}</td>
                                    <td>{{item.balance}}</td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <td colspan="4" class="nothing">--{{$t('暂无记录')}}--</td>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            isShowClose: false,
            isShowModal: false,
            navId: 0,
            prizeRecordList: [], //抽奖兑奖记录
            waterRecordList: [], //流水记录
            reqPrizeRecord: true,
            reqWaterRecord: true,
            that: this,
        };
    },
    filters: {
        typeStr(val, that) {
            var varStr = "";
            switch (val) {
                case 0:
                    varStr = that.$t("抽奖");
                    break;
                case 1:
                    varStr = that.$t("兑换");
                    break;
            }
            return varStr;
        },
        statusStr(val, that) {
            var varStr = "";
            switch (val) {
                case 0:
                    varStr = that.$t("待处理");
                    break;
                case 1:
                    varStr = that.$t("已完成");
                    break;
                case 2:
                    varStr = that.$t("已拒绝");
                    break;
            }
            return varStr;
        },
        waterTypeStr(val, that) {
            var varStr = "";
            switch (val) {
                case 0:
                    varStr = that.$t("签到获得");
                    break;
                case 1:
                    varStr = that.$t("流水打码");
                    break;
                case 2:
                    varStr = that.$t("积分兑换");
                    break;
                case 3:
                    varStr = that.$t("抽奖消耗");
                    break;
                case 4:
                    varStr = that.$t("到期扣除");
                    break;

                case 5:
                    varStr = that.$t("后台扣除");
                    break;
                case 6:
                    varStr = that.$t("后台增加");
                    break;
                case 8:
                    varStr = that.$t("抽奖获得");
                    break;
            }
            return varStr;
        },
        timeSwitch(val) {
            if (val) {
                var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + "-";
                var M =
                    (date.getMonth() + 1 < 10
                        ? "0" + (date.getMonth() + 1)
                        : date.getMonth() + 1) + "-";
                var D =
                    date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                var time = Y + M + D;
                return time;
            }
        },
        timeSwitchAll(val) {
            if (val) {
                var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + "-";
                var M =
                    (date.getMonth() + 1 < 10
                        ? "0" + (date.getMonth() + 1)
                        : date.getMonth() + 1) + "-";
                var D =
                    (date.getDate() < 10
                        ? "0" + date.getDate()
                        : date.getDate()) + " ";
                var h =
                    (date.getHours() < 10
                        ? "0" + date.getHours()
                        : date.getHours()) + ":";
                var m =
                    (date.getMinutes() < 10
                        ? "0" + date.getMinutes()
                        : date.getMinutes()) + ":";
                var s =
                    date.getSeconds() < 10
                        ? "0" + date.getSeconds()
                        : date.getSeconds();
                var time = Y + M + D + h + m + s;
                return time;
            }
        }
    },
    methods: {
        openDialog() {
            this.show = true;
        },
        closeDialog() {
            this.show = false;
        },
        exchangeRecordList() {
            this.$http.get(this.$api.exchangeRecordList).then(res => {
                if (res.code == 0) {
                    this.prizeRecordList = res.data;
                    if (res.data.length == 0) {
                        this.reqPrizeRecord = false;
                    }
                } else {
                    this.$message.error(res.msg)
                }
            });
        },
        getWaterRecordList() {
            var data = {
                memberId: this.$config.userId
            };
            this.$http.post(this.$api.waterRecordList, data).then(res => {
                this.waterRecordList = res.data.list;
                if (res.data.list.length == 0) {
                    this.reqWaterRecord = false;
                }
            });
        }
    },
    watch: {
        show(n) {
            if (n) {
                this.exchangeRecordList();
                this.getWaterRecordList();
            }
        }
    }
};
</script>

<style lang='scss'>
.records-layout {
    .el-dialog__wrapper {
        display: flex;
        align-items: center;

        .el-dialog {
            margin: 0 auto !important;
            border-radius: 12px 12px 0 0;
            .el-dialog__header {
                padding: 0 !important;
            }
            .el-dialog__body {
                padding: 0 !important;
            }
        }
    }
    .records-container {
        .header {
            border-bottom: 1px solid #e8e8e8;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            line-height: 55px;
            padding: 0 24px;
            position: relative;
            .nav-bar {
                display: flex;
                .title {
                    font-size: 16px;
                    padding: 0 16px;
                    cursor: pointer;
                }
                .active {
                    border-bottom: 2px solid #CCA456;
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
        }
        .content {
            padding: 24px;
            font-size: 14px;
            word-wrap: break-word;
            .tips {
                margin: 0px 0px 1em;
                height: auto;
                background: rgba(252, 215, 141, 0.20);
                line-height: 30px;
                padding: 0 12px;
                color: #E73621;
                font-size: 12px;
                text-align: left;
            }
            .table-box {
                min-height: 300px;
                max-height: 501px;
                overflow-y: auto;
                width: 100%;
                .table {
                    margin: 10px 0 0;
                    font-size: 13px;
                    border-left: 1px solid #CCA456;
                    border-top: 1px solid #CCA456;
                    th {
                        background: #CCA456;
                        font-weight: 700;
                        color: #fff;
                        height: 44px;
                        text-align: center;
                        vertical-align: middle;
                        border-right: 1px solid #CCA456;
                        border-bottom: 1px solid #CCA456;
                    }
                    td {
                        height: 44px;
                        text-align: center;
                        vertical-align: middle;
                        border-right: 1px solid #CCA456;
                        border-bottom: 1px solid #CCA456;
                        color: #222;
                        background: #fff;
                    }
                }
            }
        }
    }
}
</style>