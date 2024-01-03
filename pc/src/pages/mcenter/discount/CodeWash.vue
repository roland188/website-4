<template>
    <div class="basic-codewash">
        <!-- 头部 -->
        <div class="header">
            <div class="title tipColor">{{ $t('洗码积分') }}</div>
            <div class="right" @click="onBack">
                <div class="tips">
                    {{ $t('点击关闭即可返回自助大厅') }}
                    <i class="el-icon-caret-right"></i>
                </div>
                <img loading="lazy"
                    v-lazy="require('../../../assets/images/dze/close.png')"
                    class="closeimg"
                />
            </div>
        </div>
        <div class="codewash-body">
             {{ $t("累计洗码金额") }}
            <span class="link" @click="goDetail">[ {{ $t('查看更多') }} ]</span>
             <span v-if="userfan.rebateDown > 0" class="rebateDown">{{ $t('{x}元起领', { x: userfan.rebateDown }) }}</span>
            <!-- <span  class="red">{{ $common.setNumFixed(userfan.rebateAmount, 2) }}</span> -->
            <div class="codewash-box">
                <div class="codewash-box-item">
                    <div class="num">{{userfan.totalEffect.toFixed(3)}}</div>
                    <span>{{ $t('有效投注') }}</span>
                </div>
                <div  class="codewash-box-item">
                    <div class="num red">{{userfan.rebateAmount.toFixed(3)}}<span style="font-size:16px;color:#b2b2b2;margin-left:3px">{{ $t('元') }}</span></div>
                    <span>{{ $t('洗码金额') }}</span>
                </div>
                <!-- <div  class="codewash-box-item">
                    <div class="num red">{{rebackP}} %</div>
                    <span>返点比例</span>
                </div> -->
                <div style="flex:1;text-align:right">
                    <el-button v-if="!canGet" size="small" disabled style="width:120px">{{ $t('未满足领取条件') }}</el-button>
                    <el-button v-if="canGet" size="small" type="primary" :loading="loading" style="width:120px" @click="onSubmit">{{ $t('一键领取全部') }}</el-button>
                </div>
            </div>
        </div>

        <!-- 表格 -->
        <el-table size="mini" :data="tableData" style="width: 100%;line-height:30px;margin-top:30px;">
            <!-- 复制一波 -->
             <el-table-column show-overflow-tooltip prop="orderNo" :label="$t('订单号')" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div style="display:flex;align-items:center">
                        <el-tooltip effect="dark" :content="scope.row.orderNo" placement="top-start">
                            <span class="betNo">{{ scope.row.orderNo }}</span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" :label="$t('交易时间')" align="center">
                <template slot-scope="scope">
                    <span>{{$common.format(scope.row.createdAt)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="typeText" :label="$t('返水类型')" align="center"></el-table-column>
            <el-table-column prop="amount" :label="$t('金额')" align="center">
                <template slot-scope="scope">
                    <span>{{$common.setNumFixed(scope.row.amount, 2)}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('详情')" align="center">
                <template slot-scope="scope">
                    <el-button @click="toDetails(scope.row)" type="text">{{$t('详情')}}</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 返水详情弹窗 -->
        <el-dialog
            :title="$t('返水详情')"
            :visible.sync="dialogVisible"
            width="800px">
            <div class="reback-dialog-table" v-loading="dialoagLoading">
                <div class="reback-dialog-tr">
                    <div class="reback-dialog-td">{{ $t('时间') }}</div>
                    <div class="reback-dialog-td">{{ $t('游戏平台') }}</div>
                    <div class="reback-dialog-td">{{ $t('游戏名称') }}</div>
                    <div class="reback-dialog-td">{{ $t('流水') }}</div>
                    <div class="reback-dialog-td">{{ $t('返水') }}</div>
                </div>
                <div class="reback-dialog-tr" v-for="(item, i) in dialogForm" :key="i">
                    <div class="reback-dialog-td">{{$common.format(item.createdAt)}}</div>
                    <div class="reback-dialog-td">{{item.vendorName}}</div>
                    <div class="reback-dialog-td">{{item.gameName}}</div>
                    <div class="reback-dialog-td">{{$common.setNumFixed(item.effectiveBet, 2)}}</div>
                    <div class="reback-dialog-td">{{$common.setNumFixed(item.rebateAmount, 2)}}</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">{{ $t('确定') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data () {
        return {
            loading: false,
            dialogVisible: false,
            dialoagLoading: false,
            userfan: {
                rebateAmount: 0,
                rebateDown: 0,
                totalEffect: 0
            },
            dialogForm: [],
            tableData: []
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'getVipsConfig']),
        rebackP: function () {
            if (!this.userInfo || !this.userInfo.nowMemberVip) return '0'
            if (!this.userInfo.nowMemberVip.vipLevel) return '0'
            return this.getVipsConfig[this.userInfo.nowMemberVip.vipLevel].bounsRate
        },
        canGet: function () {
            return this.userfan.rebateAmount >= this.userfan.rebateDown
        }
    },
    mounted () {
        this.getuserFanshui()
        this.getDatas4()
    },
    methods: {
        // 查看详情
        toDetails (item) {
            this.dialogVisible = true
            this.dialoagLoading = true
            this.$http.post(this.$api.getDetailByBetNo, { betNo: item.betNo }).then(res => {
                this.dialoagLoading = false
                if (res.code) {
                    this.dialogForm = {}
                    return
                }
                this.dialogForm = res.data || []
            })
        },
        // 查看明细
        goDetail () {
            this.$router.push({
                path: '/my/customerReport',
                query: {
                    tab: 4
                }
            })
        },
        // 获取返利
        getuserFanshui(type) {
            this.loading = true
            const id = this.$cache.get("set_user").user_id
            if (!id) return
            this.$http
                .get(
                    this.$api.getRebateAmount +
                        id
                )
                .then(res => {
                    this.loading = false
                    if (res.code == 0) {
                        this.userfan = res.data;
                        if (type) {
                            this.$message({
                                message: this.$t("返水刷新成功"),
                                type: "success"
                            });
                        }
                    } else {
                        if (type) {
                            this.$message({
                                message: this.$t("返水额度刷新失败，请重试！"),
                                type: "warning"
                            });
                        } else {
                            this.$message({
                                message: res.msg,
                                type: "error"
                            })
                        }
                    }
                });
        },
        onBack() {
            // this.$router.go(-1);
            this.$router.push({
                path: '/mcenter/discount'
            })
        },
        onSubmit() {
            if (this.loading) return
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 5000)
            this.$http
                .get(
                this.$api.receiveRebate +
                this.$cache.get("set_user").user_id
                )
            .then((res) => {
                this.loading = false
                if (res.code == 0) {
                    this.$message.success(this.$t('领取成功'))
                }
                this.getuserFanshui()
            });
        },
        // 获取洗码记录
        getDatas4 () {
            const that = this
            const data = {
                memberId: this.$common.getUser().user_id,
                currentPage: 1,
                pageSize: 10,
                startTime: '',
                endTime: '',
            }
            this.loading = true
            this.$http.post(this.$api.rebates, data, true).then(res => {
                this.loading = false
                if (res.code) return
                res.data.list.map(e => {
                    e.orderNo = e.betNo
                    e.amount = e.rebateAmount
                    e.typeText = e.typeName
                })
                this.tableData = res.data.list || []
            })
        },
    }
}
</script>
<style lang="scss">
.basic-codewash {
    .header {
        // padding: 10px 0;
        margin: 20px 0;
        .title {
            font-size: 14px;
            border-bottom: 2px solid #e91919;
            padding: 0px 60px 20px 60px;
        }
        .right {
            cursor: pointer;
        }
        .tips {
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            color: #999;
            font-size: 12px;
            padding: 5px 10px;
            display: inline-block;
            margin-right: 10px;
        }
        border-bottom: 1px solid #e8e8e8;
    }
    .closeimg {
        width: 31px;
        height: 31px;
    }
    .card {
        border-radius: 4px;
        border: 1px solid #dcdcdc;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        padding: 12px 12px 0px 12px;
        margin-bottom: 58px;
        .title {
            font-size: 14px;
        }
        .flexbox {
            display: flex;
            align-items: center;
            padding: 15px 0;
            .item {
                text-align: center;
                padding: 0 30px;
                line-height: 2;
                margin-right: 60px;
            }
            .left {
                flex-grow: 2;
                display: flex;
                flex-wrap: wrap;
            }
            .one {
                text-align: center;
                line-height: 2;
                min-width: 130px;
                margin-top: 10px;
                margin-bottom: 10px;
            }
            .right {
                text-align: center;
                line-height: 2;
                border-left: 1px solid #dcdcdc;
                padding-left: 44px;
                flex-shrink: 0;
                .money {
                    font-weight: bold;
                    color: #e91919;
                    font-size: 15px;
                }
            }
            .img {
                width: 24px;
                height: 24px;
            }
            .text {
                color: #2ba8ff;
                cursor: pointer;
            }
            .btnclear {
                font-size: 12px;
                width: 120px;
                border: none;
                border: 1px solid #e6e6e6;
                background: #f5f5f5;
                color: #909090;
            }
            .btnred {
                background: #e91919;
                color: #fff;
            }
        }
        .borderB {
            border-bottom: 1px solid #e8e8e8;
        }
        .space-between {
            justify-content: space-between;
        }
    }
    .tipColor {
        color: #e91919;
    }
    .fullColor {
        color: #333;
    }
    .textcolor {
        color: #999;
    }
    .flagF {
        color: #ff3a2b !important;
    }
    .font {
        font-size: 12px;
    }
    .remk {
        color: #0066ff;
        cursor: pointer;
        border-bottom: 1px solid;
    }
    .tipbox {
        p {
            line-height: 2.5;
        }
    }
    .codewash-body {
        margin: 30px 0 20px 0;
        font-size: 16px;
        .codewash-box {
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .codewash-box-item {
                width: 160px;
                text-align: left;
                line-height: 18px;
                color: #b2b2b2;
                font-size: 12px;
                .num {
                    color: #333;
                    font-size: 20px;
                    line-height: 32px;
                }
                .red {
                    color: #ff3a2b;
                    text-align: left;
                }
            }
        }
        .link {
            margin-left: 15px;
            color: #2ba8ff;
            font-size: 12px;
            cursor: pointer;
        }
        .rebateDown {
            padding: 1px 10px 1px 8px;
            background: #ff3a2b;
            border-radius: 2px;
            position: relative;
            margin-left: 15px;
            height: 20px;
            line-height: 20px;
            color: #fff;
            font-size: 12px;
            display: inline-block;
        }
    }
}
</style>
<style scoped>
/deep/ .el-pager li.active {
    color: #d00;
}
.customer-report-tabs {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 0;
}
.customer-report-tab {
    border-right: 1px solid #eee;
    padding: 0 20px;
    cursor: pointer;
}
.active-report-tab {
    color: #d00;
    font-weight: bold;
    position: relative;
}
.active-report-tab::after {
    content: "";
    position: absolute;
    display: block;
    width: 80%;
    height: 3px;
    background-color: #d00;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
}
.customer-report-dates {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    border-top: 1px solid #eee;
}
.customer-report-date {
    height: 30px;
    line-height: 30px;
    padding: 0 30px;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 0 3px rgb(0 0 0 / 12%);
    cursor: pointer;
    margin-right: 6px;
    border-radius: 40px;
}
.active-report-date {
    background-color: #ff3a2b;
    color: #fff;
}
.statusColor {
    color: #E91919 !important;
    width:
     100%;
}
.betNo{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.reback-dialog-table {
    padding-top: 30px;
    text-align: center;
    line-height: 40px;;
}
.reback-dialog-tr {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.reback-dialog-td {
    flex: 1;
    border: 1px solid #eee;
}
</style>