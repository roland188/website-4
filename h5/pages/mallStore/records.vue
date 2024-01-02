<template>
    <view class="records-layout">
        <uni-nav-bar left-icon="back" :title="$t('商城记录')" @clickLeft="goBack"></uni-nav-bar>
        <view class="nav-bar" :style="{top:topHeight + 'px'}">
            <view class="nav-bar-box">
                <view class="nav-bar-box-col" :class="{active:navId == 1}" @click="navId = 1">{{ $t('商城流水记录') }}</view>
                <view class="nav-bar-box-col" :class="{active:navId == 2}" @click="navId = 2">{{ $t('商城兑换记录') }}</view>
            </view>
        </view>

        <!-- 流水记录 -->
        <view class="records-list" v-if="navId == 1">
            <view class="table-header">
                <view class="table-header-flex">
                    <view>{{ $t('交易时间') }}</view>
                    <view>{{ $t('类型') }}</view>
                    <view>{{ $t('变动') }}</view>
                    <view>{{ $t('变动后余额') }}</view>
                </view>
            </view>

            <template v-if="reqWaterRecordList">
                <view class="table-box" v-for="(item,i) in waterRecordList" :key="i">
                    <view>{{item.createdAt | timeSwitchAll}}</view>
                    <view
                        style="color:blue;"
                        v-if="item.type == 0 || item.type == 1 ||item.type == 6 || item.type == 8 "
                    >{{item.type | waterTypeStr(that)}}</view>
                    <view
                        style="color:red;"
                        v-if="item.type == 2 || item.type == 3 ||item.type == 4 ||item.type == 5"
                    >{{item.type | waterTypeStr(that)}}</view>
                    <view>{{item.amount}}</view>
                    <view>{{item.balance}}</view>
                </view>
            </template>
            <template v-else>
                <view class="noMore">{{ $t('没有更多了') }}</view>
            </template>
        </view>

        <!-- 兑换记录 -->
        <view class="records-list" v-if="navId == 2">
            <view class="table-header">
                <view class="table-header-flex">
                    <view>{{ $t('交易时间') }}</view>
                    <view>{{ $t('商品名称') }}</view>
                    <view>{{ $t('兑换类型') }}</view>
                    <view>{{ $t('状态') }}</view>
                </view>
            </view>

            <template v-if="reqChangeRecordList">
                <view class="table-box" v-for="(item,i) in changeRecordList" :key="i">
                    <view>{{item.createdAt | timeSwitchAll}}</view>

                    <view
                        v-if="item.type == 1 && item.shoppingCount != 1"
                    >{{item.shoppingName}}({{item.shoppingCount}})</view>
                    <view v-else>{{item.shoppingName}}</view>
                    <view>{{item.type | typeStr(that)}}</view>
                    <view style="color:blue;" v-if="item.status == 0">{{item.status | statusStr(that)}}</view>
                    <view v-if="item.status == 1">{{item.status | statusStr(that)}}</view>
                    <view style="color:red;" v-if="item.status == 2">{{item.status | statusStr(that)}}</view>
                </view>
            </template>
            <template v-else>
                <view class="noMore">{{ $t('没有更多了') }}</view>
            </template>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            headerTitle: this.$t('商城记录'),
            window: window,
            showArrow: true,
            navId: 1,
            reqWaterRecordList: true, //请求流水记录成功
            reqChangeRecordList: true, //请求兑换记录成功
            waterRecordList: [], //流水记录
            changeRecordList: [], //兑换记录
			topHeight: 0,
            that: this,
        };
    },
    filters: {
        typeStr(val, that) {
            var varStr = "";
            switch (val) {
                case 0:
                    varStr = that.$t('抽奖');
                    break;
                case 1:
                    varStr = that.$t('兑换');
                    break;
            }
            return varStr;
        },
        statusStr(val, that) {
            var varStr = "";
            switch (val) {
                case 0:
                    varStr = that.$t('待处理');
                    break;
                case 1:
                    varStr = that.$t('已完成');
                    break;
                case 2:
                    varStr = that.$t('已拒绝');
                    break;
            }
            return varStr;
        },
        waterTypeStr(val, that) {
            var varStr = "";
            switch (val) {
                case 0:
                    varStr = that.$t('签到获得');
                    break;
                case 1:
                    varStr = that.$t('流水打码');
                    break;
                case 2:
                    varStr = that.$t('积分兑换');
                    break;
                case 3:
                    varStr = that.$t('抽奖消耗');
                    break;
                case 4:
                    varStr = that.$t('到期扣除');
                    break;

                case 5:
                    varStr = that.$t('后台扣除');
                    break;
                case 6:
                    varStr = that.$t('后台增加');
                    break;
                case 8:
                    varStr = that.$t('抽奖获得');
                    break;
            }
            return varStr;
        },
        // timeSwitch(val) {
        //     if (val) {
        //         var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        //         var Y = date.getFullYear() + "-";
        //         var M =
        //             (date.getMonth() + 1 < 10
        //                 ? "0" + (date.getMonth() + 1)
        //                 : date.getMonth() + 1) + "-";
        //         var D =
        //             date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        //         var time = Y + M + D;
        //         return time;
        //     }
        // },
        timeSwitchAll(val) {
            if (val) {
                var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                // var Y = date.getFullYear() + "-";
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
                    date.getMinutes() < 10
                        ? "0" + date.getMinutes()
                        : date.getMinutes();
                // var s =
                //     ":" + date.getSeconds() < 10
                //         ? "0" + date.getSeconds()
                //         : date.getSeconds();
                var time = M + D + h + m;
                return time;
            }
        }
    },
    onLoad() {
		uni.getSystemInfo({
			success:(res)=> {
				let height = 46
				this.topHeight = height + res.statusBarHeight
			}
		})
        this.exchangeRecordList();
        this.getWaterRecordList();
    },
    methods: {
        // 返回
        goBack () {
          uni.navigateBacks();
			// this.$pageBack.pageBack()
            // uni.navigateBack({
            //      delta: 1
            // })
        },
        exchangeRecordList() {
            this.$api.listShoppingExchangeRecord((err, res) => {
                if (err) return
                this.changeRecordList = res
                if (res.length == 0) {
                    this.reqChangeRecordList = false
                }
            })
        },
        getWaterRecordList() {
            var data = {
                memberId: this.$config.userId
            }
            this.$api.pageMemberPointChange(data, (err, res) => {
                if (err) return
                this.waterRecordList = res.list
                if (res.list.length == 0) {
                    this.reqWaterRecordList = false
                }
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.records-layout {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    overflow: auto;
    background-color: #fff;
    .nav-bar {
        position: fixed;
        top: 46px;
        color: #333;
        width: 100%;
        z-index: 2;
        .nav-bar-box {
            width: 100%;
            display: flex;
            background: #f6f6f6;
            text-align: center;
            justify-content: space-between;
            .nav-bar-box-col {
                font-size: 14px;
                text-align: center;
                flex: 1;
                height: 50px;
                line-height: 50px;
            }
            .active {
                color: #EA5F13;
                position: relative;
            }
            .active:after {
                content: "";
                width: 37.5px;
                height: 0.75px;
                background: #EA5F13;
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                -webkit-transform: translateX(-50%);
            }
        }
    }
    .records-list {
        min-height: 100%;
        position: relative;
        box-sizing: border-box;
        overflow-y: auto;
        padding-top: 65px;
        top: 20px;
        font-size: 12px;
        .table-box {
            display: flex;
            width: 100%;
            text-align: center;
            line-height: 30px;
            view {
                flex: 1
            }
        }
        .table-header {
            position: fixed;
            top: 95px;
            left: 0;
            right: 0;
            background: #fff;
        }
        .table-header-flex {
            display: flex;
            flex-direction: row;
            text-align: center;
            box-sizing: border-box;
            > view {
                flex: 1;
                line-height: 30px;
                font-size: 12px;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .noMore {
            text-align: center;
            color: #999;
            line-height: 100px;
        }
    }
}
</style>
