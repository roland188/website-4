<template>
    <div class="correspondence">
        <div class="screening">
            <div class="transaction"
                 v-if="interestShow">
                <div class="title">{{$t('交易状态:')}}</div>
                <div v-for="(item, i) of typeList"
                     :key="i"
                     class="item"
                     @click="onChangeType(item)"
                     :class="{ itemAcitied: item.id == typeIndex }">
                    {{ $t(item.name) }}
                </div>
            </div>
            <div class="transaction"
                 v-if="interestShow">
                <div class="title">{{$t('交易时间:')}}</div>
                <div v-for="(item, i) of timeList"
                     :key="i"
                     class="item"
                     @click="onChangeTime(item)"
                     :class="{ itemAcitied: item.id == timeIndex }">
                    {{ $t(item.name) }}
                </div>
            </div>
            <el-row>
                <el-col :span="5"
                        style="margin-right: 20px"
                        v-show="tabName === `${$t('投注记录')}`">
                    <el-select v-model="form.region"
                               :placeholder="$t('请选择游戏平台')"
                               @change="changes">
                        <el-option el-option
                                   v-for="(item, index) in gameList"
                                   :label="$t(item.vendorName)"
                                   :value="item.vendorCode"
                                   :key="index"></el-option>
                    </el-select>
                </el-col>

                <el-col :span="5">
                    <el-date-picker type="date"
                                    :placeholder="$t('请选择开始时间')"
                                    v-model="form.startTimeBet"
                                    :picker-options="startDatePicker"
                                    :editable="false"
                                    :clearable="false"
                                    style="width: 100%; cursor: pointer"></el-date-picker>
                </el-col>

                <el-col class="line"
                        :span="1">{{$t('至')}}</el-col>

                <el-col :span="5">
                    <el-date-picker type="date"
                                    :placeholder="$t('请选择开始时间')"
                                    v-model="form.endTimeBet"
                                    :picker-options="endDatePicker"
                                    :editable="false"
                                    :clearable="false"
                                    style="width: 100%"></el-date-picker>
                </el-col>

                <el-col :span="2"
                        class="query">
                    <span @click="query()">{{$t('查询')}}</span>
                </el-col>

                <el-col :span="2"
                        class="reset">
                    <span @click="reset()">{{$t('重置')}}</span>
                </el-col>
            </el-row>

            <el-table :data="tableData"
                      border
                      style="margin-top: 20px"
                      height="500"
                      :key="random"
                      :cell-style="cellStyle"
                      v-if="!interestShow">
                <el-table-column prop="prop1"
                                 :label="$t(tabLabel.label1)"
                                 align="center"></el-table-column>
                <el-table-column prop="prop2"
                                 :label="$t(tabLabel.label2)"
                                 align="center"></el-table-column>
                <el-table-column prop="prop3"
                                 :label="$t(tabLabel.label3)"
                                 align="center"></el-table-column>
                <el-table-column prop="prop4"
                                 :label="$t(tabLabel.label4)"
                                 align="center"></el-table-column>
                <el-table-column prop="prop5"
                                 :label="$t(tabLabel.label5)"
                                 align="center"></el-table-column>
                <el-table-column prop="prop6"
                                 :label="$t(tabLabel.label6)"
                                 align="center"
                                 v-if="showOne"></el-table-column>
                <el-table-column prop="prop7"
                                 :label="$t(tabLabel.label7)"
                                 align="center"
                                 v-if="showOne"></el-table-column>
                <el-table-column prop="prop8"
                                 :label="$t(tabLabel.label8)"
                                 align="center"
                                 v-if="showOne"></el-table-column>
            </el-table>
            <el-table :data="tableData"
                      border
                      style="margin-top: 20px"
                      height="400"
                      v-if="interestShow">
                <el-table-column prop="name"
                                 :label="$t('活动名称')"
                                 align="center"></el-table-column>
                <el-table-column prop="createdAt"
                                 :label="$t('存入时间')"
                                 align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createdAt | times }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="apr"
                                 :label="$t('利率')"
                                 align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.apr }}%</span>
                    </template>
                </el-table-column>
                <el-table-column prop="interestEndTime"
                                 :label="$t('结息时间')"
                                 align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.interestEndTime | times }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="depositAmount"
                                 :label="$t('存入金额')"
                                 align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.depositAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="hour"
                                 :label="$t('已存放')"
                                 align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.hour }}{{$t('小时')}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="interest"
                                 :label="$t('利息')"
                                 align="center">
                    <template slot-scope="scope">
                        <span> {{ scope.row.interest }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('本利总额')"
                                 align="center">
                    <template slot-scope="scope">
                        <span> {{
                                scope.row.interest + scope.row.depositAmount
                            }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="status"
                                 :label="$t('状态')"
                                 align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">{{$t('计息中')}}</span>
                        <span v-if="scope.row.status == 1">{{$t('已到期')}}</span>
                        <span v-if="scope.row.status == 2">{{$t('已领取')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                                 :label="$t('操作')"
                                 align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0"
                              class="redBtn"
                              @click="onCell(scope)">{{$t('提前领取')}}</span>
                        <span v-if="scope.row.status == 1" @click="onCell(scope)"
                              class="redBtn">{{$t('领回')}}</span>
                    </template>
                </el-table-column>
            </el-table>

            <div class="bottom"
                 :class="{ right: tabName !== $t('投注记录') }">
                <div class="combined"
                     v-show="tabName === $t('投注记录')">
                     <span>
                        {{$t('总投注')}}: 
                        <span :style="{'color': gameSummary.totalBet > 0 ? 'red' : 'green'}">
                            {{ gameSummary.totalBet }}
                        </span>
                     </span>
                     <span>
                        {{$t('总有效投注')}}: 
                        <span :style="{'color': gameSummary.effective > 0 ? 'red' : 'green'}">
                            {{ gameSummary.effective }}
                        </span>
                     </span>
                     <span>
                        {{$t('总派彩')}}: 
                        <span :style="{'color': gameSummary.distributed > 0 ? 'red' : 'green'}">
                            {{ gameSummary.distributed }}
                        </span>
                     </span>
                     <span>
                        {{$t('总盈亏金额')}}: 
                        <span :style="{'color': gameSummary.profit > 0 ? 'red' : 'green'}">
                            {{ gameSummary.profit }}
                        </span>
                     </span>
                </div>
                <el-pagination layout="prev,pager,next"
                               :total="total"
                               @current-change="query"
                               :pageSize="10"
                               :current-page.sync="currentPage">
                </el-pagination>
            </div>

            <p v-if="interestShow"
               class="tips">
                {{$t('利息宝钱包')}}：<span class="money">{{ zMoney }}</span>{{$t('当前总获得利息')}}：{{ zlixi }} 
            </p>
        </div>

        <el-dialog :title="$t('利息宝领取')"
                   :visible.sync="dialogVisible"
                   :center="true"
                   width="20%">
            <div class="dialogcent">
                <p class="m">{{ itemli.depositAmount + itemli.interest }}{{$t('元')}}</p>
                <p class="mm">({{$t('包含利息')}}{{ itemli.interest }}{{$t('元')}})</p>
                <p class="mmm">{{$t('利息流水要求')}}:{{ itemli.auditFactor }}{{$t('倍')}}</p>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <el-button round
                           @click="dialogVisible = false">{{$t('取消')}}</el-button>
                <el-button round
                           type="danger"
                           @click="receiveInterest">{{$t('立即领取')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    'filters': {
        'times': function (value) {
            var date = new Date(value);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? '0' + d : d;
            var h = date.getHours();
            h = h < 10 ? '0' + h : h;
            var minute = date.getMinutes();
            minute = minute < 10 ? '0' + minute : minute;
            var second = date.getSeconds();
            second = second < 10 ? '0' + second : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
        }
    },
    data() {
        return {
            'startDatePicker': this.beginDate(),
            'endDatePicker': this.endDate(),
            'gameList': [],
            'tableData': [],
            'gameCode': '',
            'total': 0, //分页总数
            'currentPage': 0,
            'form': {
                'region': '',
                'startTimeBet': '',
                'endTimeBet': '',
                'pageSize': 10,
                'pageNum': 1,
                'vendorCodeList': [],
                'memberId': this.$common.getUser() ?
                    this.$common.getUser().user_id :
                    ''
            },
            'tabName': '',
            //投注记录汇总
            'gameSummary': {
                'totalBet': '',
                'effective': '',
                'distributed': '',
                'profit': ''
            },
            'tabLabel': {},
            'showOne': true,
            'random': '',
            'interestShow': false,
            'typeList': [
                { 'name': this.$t('全部'), 'id': -1 },
                { 'name': this.$t('计息中'), 'id': 0 },
                { 'name': this.$t('已到期'), 'id': 1 },
                { 'name': this.$t('已领取'), 'id': 2 }
            ],
            'typeIndex': -1,
            'timeList': [
                { 'name': this.$t('今日'), 'id': 0 },
                { 'name': this.$t('昨日'), 'id': 1 },
                { 'name': this.$t('近7日'), 'id': 7 },
                { 'name': this.$t('近30日'), 'id': 30 }
            ],
            'timeIndex': -1,
            'endTime': '',
            'startTime': '',
            'itemli': {},
            'dialogVisible': false,
            'zMoney': 0.0,
            'zlixi': 0.0
        };
    },
    mounted() {
        this.getGameListData();
    },
    'methods': {
        cellStyle({row,column,rowIndex,columnIndex}){
            let color = '#000'
            // console.log(row,column,rowIndex,columnIndex)
            if(columnIndex == 7){
                if(row.prop8 > 0){
                    color = 'red'
                }else{
                    color = 'green'
                }
            }
            if(columnIndex == 4 && this.tabName != this.$t('利息宝记录')){
                switch (row.status) {
                    case 0:
                        color = '#f90'  //待支付
                        break;
                    case 1:
                        color = '#2d8cf0'  //支付中
                        break;
                    case 2:
                        color = '#19be66'  //支付成功
                        break;
                    case 3:
                        color = '#ed4014'  //支付失败
                         break;
                    case 4:
                        color = '#9299a3'  //已关闭
                        break;
                }
                
            }
            return "color:"+ color
        },
        format(time, format) {
            var t = new Date(time);
            var tf = function (i) {
                return (i < 10 ? '0' : '') + i;
            };
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    // eslint-disable-next-line no-unreachable
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    // eslint-disable-next-line no-unreachable
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    // eslint-disable-next-line no-unreachable
                    break;
                case 'dd':
                    return tf(t.getDate());
                    // eslint-disable-next-line no-unreachable
                    break;
                case 'HH':
                    return tf(t.getHours());
                    // eslint-disable-next-line no-unreachable
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    // eslint-disable-next-line no-unreachable
                    break;
                }
            });
        },
        beginDate() {
            let that = this;
            return {
                disabledDate(time) {
                    if (that.form.endTimeBet) {
                        return (
                            time.getTime() > that.form.endTimeBet ||
                            time.getTime() > Date.now()
                        );
                    } else {
                        return time.getTime() > Date.now();
                    }
                }
            };
        },
        endDate() {
            let that = this;
            return {
                disabledDate(time) {
                    if (that.form.startTimeBet) {
                        return (
                            time.getTime() < that.form.startTimeBet ||
                            time.getTime() > Date.now()
                        );
                    } else {
                        return time.getTime() > Date.now();
                    }
                }
            };
        },
        //游戏记录
        query(currentPage = 1, name) {
            console.log(currentPage,name)
            this.onChangeTime({ 'id': this.timeIndex });
            this.random = name;
            this.currentPage = 1;
            let form = JSON.parse(JSON.stringify(this.form));
            this.currentPage = currentPage;
            form.pageNum = this.currentPage;
            form.startTimeBet ?
                form.startTimeBet = this.format(
                    form.startTimeBet,
                    'yyyy-MM-dd HH:mm:ss'
                ) :
                form.startTimeBet = '';
            form.endTimeBet ?
                form.endTimeBet = this.format(
                    form.endTimeBet,
                    'yyyy-MM-dd 23:59:59'
                ) :
                form.endTimeBet = '';
            if (name) {
                this.tabName = name;
                this.reset();
            }
            this.interestShow = this.tabName == this.$t('利息宝记录');
            this.tableData = [];
            let data;
            switch (this.tabName) {
            case this.$t('投注记录'):
                this.showOne = true;
                this.tabLabel = {
                    'label1': this.$t('游戏平台'),
                    'label2': this.$t('游戏名称'),
                    'label3': this.$t('投注时间'),
                    'label4': this.$t('派彩时间'),
                    'label5': this.$t('投注金额'),
                    'label6': this.$t('有效投注'),
                    'label7': this.$t('派彩金额'),
                    'label8': this.$t('盈亏金额')
                };
                form.vendorCodeList = [];
                this.gameCode ?
                    form.vendorCodeList.push(this.gameCode) :
                    form.vendorCodeList.push();
                this.$http.post(this.$api.query, form, true).then((res) => {
                    if (res.data && res.data.total > 0) {
                        this.gameSummary.totalBet = this.$common.setNumFixed(
                            Math.abs(res.data.totalBetAmount),
                            2
                        );
                        this.gameSummary.effective = this.$common.setNumFixed(
                            res.data.totalBetAmountValid,
                            2
                        );
                        this.gameSummary.distributed = this.$common.setNumFixed(
                            res.data.totalPayoff,
                            2
                        );
                        this.gameSummary.profit = this.$common.setNumFixed(
                            this.gameSummary.distributed -
                                    this.gameSummary.totalBet,
                            2
                        );
                        this.total = res.data.total;
                        res.data.list.map((item) => {
                            item.prop1 = item.vendorName; //游戏平台
                            item.prop2 = item.gameName; //游戏名称
                            item.prop3 = this.$common.conversionTime(
                                item.betTime
                            ); //投注时间
                            item.prop5 = this.$common.setNumFixed(
                                Math.abs(Number(item.betAmount)),
                                2
                            ); //投注金额
                            item.prop6 = this.$common.setNumFixed(
                                  item.betAmountValid,
                                  2
                            ); //有效投注
                            if(item.status == 0){
                              item.prop4 = this.$t('待结算'); //派彩时间
                            //   item.prop6 = '-'; //有效投注
                              item.prop7 = '-'; //派彩金额
                              item.prop8 = '-'; //盈亏金额
                            }else{
                              item.prop4 =
                                  this.$common.conversionTime(
                                      item.payoutTime
                                  ); //派彩时间
                              item.prop7 = this.$common.setNumFixed(
                                  item.payoff,
                                  2
                              ); //派彩金额
                              item.winLoss == null ?
                                  item.prop8 = '0.00' :
                                  item.prop8 = this.$common.setNumFixed(
                                      item.winLoss,
                                      2
                                  ); //盈亏金额
                            }
                        });
                        this.tableData = res.data.list;
                    } else {
                        this.total = 0;
                        this.tableData = [];
                        this.gameSummary.totalBet = '0.00';
                        this.gameSummary.effective = '0.00';
                        this.gameSummary.distributed = '0.00';
                        this.gameSummary.profit = '0.00';
                    }
                });
                break;
            case this.$t('充值记录'):
                this.showOne = false;
                this.tabLabel = {
                    'label1': this.$t('订单号'),
                    'label2': this.$t('交易时间'),
                    'label3': this.$t('支付方式'),
                    'label4': this.$t('金额'),
                    'label5': this.$t('状态')
                };
                data = {
                    'createdAtBegin': form.startTimeBet || '',
                    'createdAtEnd': form.endTimeBet || '',
                    'memberId': this.$common.getUser().user_id || '',
                    'currentPage': form.pageNum,
                    'pageSize': 10
                };
                this.$http
                    .post(this.$api.pcOnlinePayRecordsList, data, true)
                    .then((res) => {
                        if (res.data && res.data.totalRecords > 0) {
                            this.total = res.data.totalRecords;
                            res.data.content.map((item) => {
                                item.prop1 = item.orderNo; //订单号
                                item.prop2 = this.$common.conversionTime(
                                    item.createdAt
                                ); //交易时间
                                item.prop4 = this.$common.setNumFixed(
                                    item.amount,
                                    2
                                ); //金额
                                if (item.type === 41) {
                                    switch (item.status) {
                                    case 0:
                                        item.prop5 = this.$t('未处理'); //状态
                                        break;
                                    case 1:
                                    case 5:
                                    case 6:
                                    case 7:
                                        item.prop5 = this.$t('处理中');
                                        break;
                                    case 2:
                                        item.prop5 = this.$t('充值成功');
                                        break;
                                    case 3:
                                        item.prop5 = this.$t('充值失败');
                                        break;
                                    case 4:
                                        item.prop5 = this.$t('关闭');
                                        break;
                                    }
                                } else {
                                    switch (item.status) {
                                    case 0:
                                        item.prop5 = this.$t('待支付');
                                        break;
                                    case 1:
                                        item.prop5 = this.$t('支付中');
                                        break;
                                    case 2:
                                        item.prop5 = this.$t('支付成功');
                                        break;
                                    case 3:
                                        item.prop5 = this.$t('支付失败');
                                        break;
                                    case 4:
                                        item.prop5 = this.$t('已关闭');
                                        break;
                                    }
                                }
                                switch (item.type) {
                                case 3:
                                    item.prop3 = this.$t('线下银行卡支付'); //支付方式
                                    break;
                                case 4:
                                    item.prop3 = this.$t('线下二维码支付');
                                    break;
                                case 5:
                                    item.prop3 = this.$t('线上支付');
                                    break;
                                case 11:
                                    item.prop3 = this.$t('手动上分');
                                    break;
                                case 41:
                                    item.prop3 = this.$t('数字货币支付');
                                    break;
                                }
                            });
                            this.tableData = res.data.content;
                        } else {
                            this.total = 0;
                            this.tableData = [];
                        }
                    });
                break;
            case this.$t('银行转账'):
                this.showOne = false;
                this.tabLabel = {
                    'label1': this.$t('订单号'),
                    'label2': this.$t('交易时间'),
                    'label3': this.$t('支付方式'),
                    'label4': this.$t('金额'),
                    'label5': this.$t('状态')
                };
                data = {
                    'createdAtBegin': form.startTimeBet || '',
                    'createdAtEnd': form.endTimeBet || '',
                    'memberName': this.$common.getUser().username || '',
                    'currentPage': form.pageNum,
                    'pageSize': 10
                };

                this.$http
                    .post(this.$api.bankTransfer, data, true)
                    .then((res) => {
                        if (res.data && res.data.totalRecords > 0) {
                            this.total = res.data.totalRecords;
                            res.data.content.map((item) => {
                                item.prop1 = item.orderNo; //订单号
                                item.prop2 = this.$common.conversionTime(
                                    item.createdAt
                                ); //交易时间
                                item.prop4 = this.$common.setNumFixed(
                                    item.amount,
                                    2
                                ); //金额
                                switch (item.status) {
                                case 0:
                                    item.prop5 = this.$t('待支付'); //状态
                                    break;
                                case 1:
                                    item.prop5 = this.$t('支付中');
                                    break;
                                case 2:
                                    item.prop5 = this.$t('支付成功');
                                    break;
                                case 3:
                                    item.prop5 = this.$t('支付失败');
                                    break;
                                }
                                switch (item.type) {
                                case 'alipay':
                                    item.prop3 = this.$t('支付宝扫码'); //支付方式
                                    break;
                                case 'wechat':
                                    item.prop3 = this.$t('微信扫码');
                                    break;
                                case 'wechath5':
                                    item.prop3 = this.$t('微信H5');
                                    break;
                                case 'zfbh5':
                                    item.prop3 = this.$t('支付宝H5');
                                    break;
                                case 'unionclound':
                                    item.prop3 = this.$t('银联扫码');
                                    break;
                                case 'union':
                                    item.prop3 = this.$t('银联转账');
                                    break;
                                case 'other':
                                    item.prop3 = this.$t('其它');
                                    break;
                                }
                            });
                            this.tableData = res.data.content;
                        } else {
                            this.tableData = [];
                            this.total = 0;
                        }
                    });
                break;
            case this.$t('提款记录'):
                this.showOne = false;
                this.tabLabel = {
                    'label1': this.$t('订单号'),
                    'label2': this.$t('交易时间'),
                    'label3': this.$t('提款方式'),
                    'label4': this.$t('余额'),
                    'label5': this.$t('状态')
                };
                data = {
                    'createdAtBegin': form.startTimeBet || '',
                    'createdAtEnd': form.endTimeBet || '',
                    'id': this.$common.getUser().user_id,
                    'currentPage': form.pageNum,
                    'pageSize': 10
                };
                this.$http
                    .post(this.$api.withdrawalsRecords, data, true)
                    .then((res) => {
                        if (res && res.data && res.data.totalRecords > 0) {
                            this.total = res.data.totalRecords;
                            res.data.content.map((item) => {
                                item.prop1 = item.orderNo;
                                item.prop2 = this.$common.conversionTime(
                                    item.createdAt
                                );
                                item.prop4 = this.$common.setNumFixed(
                                    item.amount,
                                    2
                                );
                                if (item.type === 43) {
                                    switch (item.status) {
                                    case 0:
                                        item.prop5 = this.$t('未处理');
                                        break;
                                    case 1:
                                    case 5:
                                    case 6:
                                    case 7:
                                        item.prop5 = this.$t('处理中');
                                        break;
                                    case 2:
                                        item.prop5 = this.$t('提款成功');
                                        break;
                                    case 3:
                                        item.prop5 = this.$t('提款失败');
                                        break;
                                    case 4:
                                        item.prop5 = this.$t('关闭');
                                        break;
                                    }
                                } else {
                                    switch (item.status) {
                                    case 0:
                                        item.prop5 = this.$t('待出款');
                                        break;
                                    case 1:
                                        item.prop5 = this.$t('出款中');
                                        break;
                                    case 2:
                                        item.prop5 = this.$t('出款成功');
                                        break;
                                    case 3:
                                        item.prop5 = this.$t('出款失败');
                                        break;
                                    case 4:
                                        item.prop5 = this.$t('关闭');
                                        break;
                                    }
                                }
                                switch (item.type) {
                                case 8:
                                    item.prop3 = this.$t('银行卡提款');
                                    break;
                                case 10:
                                    item.prop3 = this.$t('手动下分');
                                    break;
                                case 43:
                                    item.prop3 = this.$t('数值货币提款申请');
                                    break;
                                case 47:
                                    item.prop3 = this.$t('origo钱包提款');
                                    break;
                                }
                            });
                            this.tableData = res.data.content;
                        } else {
                            this.tableData = [];
                            this.total = 0;
                        }
                    });
                break;
            case this.$t('其它'):
                this.showOne = false;
                this.tabLabel = {
                    'label1': this.$t('订单号'),
                    'label2': this.$t('交易时间'),
                    'label3': this.$t('类型'),
                    'label4': this.$t('金额'),
                    'label5': this.$t('状态')
                };
                data = {
                    'currentPage': this.currentPage, //当前页码
                    'pageSize': 10,
                    'createdAtStart': form.startTimeBet || '',
                    'createdAtEnd': form.endTimeBet || ''
                };
                this.$http
                    .post(this.$api.getList, data, true)
                    .then((res) => {
                        if (res.data && res.data.totalRecords > 0) {
                            this.total = res.data.totalRecords;
                            res.data.content.map((item) => {
                                item.prop1 = item.orderNo;
                                item.prop4 = this.$common.setNumFixed(
                                    item.amount,
                                    2
                                );
                                item.prop2 = this.$common.conversionTime(
                                    item.createdAt
                                );
                                if (item.type === 42) {
                                    switch (item.status) {
                                    case 0:
                                        item.prop5 = this.$t('未处理');
                                        break;
                                    case 1:
                                    case 5:
                                    case 6:
                                    case 7:
                                        item.prop5 = this.$t('处理中');
                                        break;
                                    case 2:
                                        item.prop5 = this.$t('成功');
                                        break;
                                    case 3:
                                        item.prop5 = this.$t('失败');
                                        break;
                                    case 4:
                                        item.prop5 = this.$t('关闭');
                                        break;
                                    }
                                } else {
                                    switch (item.status) {
                                    case 0:
                                        item.prop5 = this.$t('待领取');
                                        break;
                                    case 1:
                                        item.prop5 = this.$t('已过期');
                                        break;
                                    case 2:
                                        item.prop5 = this.$t('成功');
                                        break;
                                    case 3:
                                        item.prop5 = this.$t('失败');
                                        break;
                                    }
                                }

                                switch (item.type) {
                                case 6:
                                    item.prop3 = this.$t('线下入款优惠');
                                    break;
                                case 7:
                                    item.prop3 = this.$t('线上入款优惠');
                                    break;
                                case 11:
                                    item.prop3 = this.$t('手动上分');
                                    break;
                                case 12:
                                    item.prop3 = this.$t('手动存款优惠上分');
                                    break;
                                case 13:
                                    item.prop3 = this.$t('手动返水优惠上分');
                                    break;
                                case 14:
                                    item.prop3 = this.$t('手动活动优惠上分');
                                    break;
                                case 15:
                                    item.prop3 = this.$t('自动活动优惠上分');
                                    break;
                                case 20:
                                    item.prop3 = this.$t('手动下分-存款');
                                    break;
                                case 21:
                                    item.prop3 = this.$t('手动下分-优惠活动');
                                    break;
                                case 22:
                                    item.prop3 = this.$t('手动下分-人工存款反水');
                                    break;
                                case 23:
                                    item.prop3 = this.$t('手动下分-存款优惠');
                                    break;
                                case 25:
                                    item.prop3 = this.$t('手动上分-优惠活动');
                                    break;
                                case 26:
                                    item.prop3 = this.$t('手动上分-人工存款返水');
                                    break;
                                case 27:
                                    item.prop3 = this.$t('手动上分-存款优惠');
                                    break;
                                case 28:
                                    item.prop3 = this.$t('手动上分-其他');
                                    break;
                                case 31:
                                    item.prop3 = this.$t('手动上分彩金');
                                    break;
                                case 32:
                                    item.prop3 = this.$t('活动上分彩金');
                                    break;
                                case 33:
                                    item.prop3 =
                                                '手动上分彩金-人工存款返水';
                                    break;
                                case 34:
                                    item.prop3 = '手动上分彩金-存款优惠';
                                    break;
                                case 35:
                                    item.prop3 = '手动上分彩金-优惠活动';
                                    break;
                                case 36:
                                    item.prop3 = '手动上分-其他彩金';
                                    break;
                                case 42:
                                    item.prop3 = this.$t('数值货币优惠上分');
                                    break;
                                case 44:
                                    item.prop3 = this.$t('救济金上分');
                                    break;
                                case 45:
                                    item.prop3 = this.$t('救济金彩金');
                                    break;
                                case 46:
                                    item.prop3 = this.$t('每日签到上分');
                                    break;
                                case 50:
                                    item.prop3 = this.$t('全民返利');
                                    break;
                                case 51:
                                    item.prop3 = this.$t('利息宝存入');
                                    break;
                                case 52:
                                    item.prop3 = this.$t('利息宝本金提取');
                                    break;
                                case 53:
                                    item.prop3 = this.$t('利息宝利息提取');
                                    break;
                                case 62:
                                    item.prop3 = this.$t('信息认证奖励');
                                case 63:
                                    item.prop3 = this.$t('周勤奖励');
                                    break;
                                case 64:
                                    item.prop3 = this.$t('幸运注单');
                                    break;
                                case 65:
                                    item.prop3 = this.$t('周年礼金');
                                    break;
                                case 66:
                                    item.prop3 = this.$t('棋牌奖励');
                                    break;
                                case 67:
                                    item.prop3 = this.$t('棋牌救援');
                                    break;
                                case 68:
                                    item.prop3 = this.$t('千倍百倍');
                                    break;
                                case 69:
                                    item.prop3 = this.$t('亿元回馈');
                                    break;
                                case 70:
                                    item.prop3 = this.$t('大转盘');
                                    break;
                                case 71:
                                    item.prop3 = this.$t('积分兑换虚拟商品');
                                    break;
                                case 72:
                                    item.prop3 = this.$t('积分商城抽奖');
                                    break;
                                case 73:
                                    item.prop3 = this.$t('站内活动');
                                    break;
                                case 99:
                                    item.prop3 = this.$t('其他');
                                    break;
                                case 101:
                                    item.prop3 = this.$t('VIP晋级礼金');
                                    break;
                                case 103:
                                    item.prop3 = this.$t('VIP每周红包');
                                    break;
                                }
                            });
                            this.tableData = res.data.content;
                        } else {
                            this.tableData = [];
                            this.total = 0;
                        }
                    });
                break;
            case this.$t('利息宝记录'):
                localStorage.setItem('interest', 1);
                this.startTime = form.startTimeBet || this.startTime;
                this.endTime = form.endTimeBet || this.endTime;

                let option = {
                    'currentPage': form.pageNum, //当前页码
                    'endTime': this.endTime, //结束开放时间
                    'pageSize': 10, //每页记录数
                    'startTime': this.startTime, //起始开放时间
                    'status': this.typeIndex //利息宝记录参与状态 0，计息中 1，已到期 2,已领取
                };
                this.$http
                    .post(this.$api.interestRecordList, option, true)
                    .then((res) => {
                        if (res.code == 0) {
                            this.tableData = res.data.content;
                            this.total = res.data.totalRecords;
                            this.zlixi = res.data.receiveInterest;
                            this.zMoney = res.data.totalDeposit;
                        } else {
                            this.tableData = [];
                        }
                    });
                break;
            }
        },
        onChangeType(item) {
            this.typeIndex = item.id;
        },
        onChangeTime(item) {
            this.timeIndex = item.id;
            // //今天的时间
            if (item.id == 0) {
                this.startTime = this.getDay(0) + ' 00:00:00';
                this.endTime = this.getDay(0) + ' 23:59:59';
            }
            //昨天
            if (item.id == 1) {
                this.startTime = this.getDay(-1) + ' 00:00:00';
                this.endTime = this.getDay(-1) + ' 23:59:59';
            }
            if (item.id == 7) {
                this.startTime = this.getDay(-7) + ' 00:00:00';
                this.endTime = this.getDay(-1) + ' 23:59:59';
            }
            if (item.id == 30) {
                this.startTime = this.getDay(-30) + ' 00:00:00';
                this.endTime = this.getDay(-1) + ' 23:59:59';
            }
        },
        getDay(day) {
            var today = new Date();
            var targetday_milliseconds =
                today.getTime() + 1000 * 60 * 60 * 24 * day;
            today.setTime(targetday_milliseconds); //注意，这行是关键代码
            var tYear = today.getFullYear();
            var tMonth = today.getMonth();
            var tDate = today.getDate();
            tMonth = this.doHandleMonth(tMonth + 1);
            tDate = this.doHandleMonth(tDate);
            return tYear + '-' + tMonth + '-' + tDate;
        },
        doHandleMonth(month) {
            var m = month;
            if (month.toString().length == 1) {
                m = '0' + month;
            }
            return m;
        },
        onCell(e) {
            this.itemli = e.row;
            this.dialogVisible = true;
            // this.receiveInterest(id)
        },
        //利息宝提前领取
        receiveInterest(id) {
            this.$http
                .put(
                    this.$api.receiveInterest + '/' + this.itemli.id,
                    null,
                    true
                )
                .then((res) => {
                    this.dialogVisible = false;
                    if (res.code == 0) {
                        this.$message({
                            'message': this.$t('领取成功'),
                            'type': 'success'
                        });
                        this.query(1, this.$t('利息宝记录'));
                    } else {
                        this.$message({
                            'message': res.msg,
                            'type': 'warning'
                        });
                    }
                });
        },
        //重置
        reset() {
            this.form.region = '';
            this.form.startTimeBet = '';
            this.form.startTimeBet = '';
            this.form.endTimeBet = '';
            this.form.vendorCodeList = [];
            this.gameCode = '';
        },
        //获取游戏平台
        getGameListData() {
            if (this.$store.state.token) {
                this.$http.get(this.$api.platform).then((res) => {
                    if (res) {
                        this.gameList = res.data;
                        this.gameList.unshift({
                            'vendorCode': this.$t('捕鱼'),
                            'vendorId': 9999,
                            'vendorName': this.$t('捕鱼')
                        });
                    }
                });
            }
        },
        //选中游戏平台
        changes(val) {
            this.gameCode = val;
        }
    }
};
</script>
<style lang="scss">
.correspondence {
    width: 1180px;
    margin: 0 auto;
    .screening {
        margin: 20px 0;
    }
    .line {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .query,
    .reset {
        margin-left: 20px;
        width: 110px;
        height: 40px;
    }
    .query span,
    .reset span {
        width: 110px;
        height: 40px;
        border-radius: 40px;
        background: #59bafc;
        display: inline-block;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 16px;
    }
    .reset span {
        background: #8e9da8;
    }
    .combined {
        margin-top: 10px;
        span {
            margin-right: 10px;
            font-size: 14px;
            color: #9695a6;
        }
    }
    .bottom {
        display: flex;
        justify-content: space-between;
    }
    .right {
        float: right;
    }
    .transaction {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        .title {
            color: #2d2b4d;
            font-size: 16px;
        }
        .item {
            font-size: 12px;
            border-radius: 8px;
            padding: 10px 25px;
            margin: 0 20px;
            min-width: 75px;
            text-align: center;
            // background: #c4e3f8;
            color: #59bafc;
            border: 1px solid #59bafc;
        }
        .itemAcitied {
            background: #59bafc;
            color: #fff;
        }
    }
    .redBtn {
        background: #e5414a;
        color: #fff;
        border-radius: 18px;
        padding: 3px 5px;
        /* margin: 3px; */
        display: block;
        font-size: 12px;
    }
    .dialogcent {
        text-align: center;
        line-height: 1.5;
        .m {
            color: #2d2b4d;
            font-size: 32px;
            font-weight: bold;
        }
        .m {
            color: #2d2b4d;
            font-size: 14px;
        }
        .mmm {
            color: #1d1717;
            font-size: 18px;
        }
    }
}
.tips {
    margin-top: 20px;
    .money {
        font-weight: bold;
    }
}
</style>
