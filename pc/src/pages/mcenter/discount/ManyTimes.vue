<template>
    <div class="basic ManyTimes">
        <commonHeader :title='data.name' />
        <div class="headTip">
            <p>{{ $t('温馨提示：每天（00:00至当天23:59:59）只能领取一次千百倍奖金！（提交错误信息超过5次，取消当日申请资格）') }}</p>
        </div>
        <div class="content">
            <div class="table">
                <div class="section">
                    <div class="sectionItem yxpt">{{ $t('游戏平台') }}</div>
                    <div class="sectionItem timeWidth">{{ $t('游戏时间') }}</div>
                    <div class="sectionItem">{{ $t('投注额') }}</div>
                    <div class="sectionItem">{{ $t('中奖倍数') }}</div>
                    <div class="sectionItem">{{ $t('获得奖金') }}</div>
                    <div class="sectionItem">{{ $t('备注') }}</div>
                    <div class="sectionItem">{{ $t('操作') }}</div>
                </div>
                <el-scrollbar :style="{height:list.length > 10 ? '400px' :'auto'}" :class="list.length > 10 ? 'addclass':''">
                    <template v-if="messageReqSuccessFlag">
                        <ul>
                            <li v-for="(item,index) in list" :key="index">
                                <div class="">
                                    <div class="headView">
                                        <div class="sectionItem yxpt">{{item.vendorCode}}</div>
                                        <div class="sectionItem">{{formatTime(item.betTime)}}</div>
                                        <div class="sectionItem">{{item.betAmount}}</div>
                                        <div class="sectionItem">{{item.rewardTimes}}</div>
                                        <div class="sectionItem">{{item.amount}}</div>
                                        <div class="sectionItem">{{item.remark}}</div>
                                        <div class="sectionItem">
                                            <div v-if="item.status == 1">{{$t('已领取')}}</div>
                                            <div v-else>
                                                <el-button v-if="!data.speActLuckyTimesVO.received" type="danger" size="mini" round @click="submit(item,index)">{{ $t('申请奖励') }}</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </template>
                    <template v-else>
                        <p class="noList">--{{ $t('暂无中奖纪录') }}--</p>
                    </template>
                </el-scrollbar>
            </div>
            <div class="wxtip">
                <p class="title1">
                    <span class="fsiast">{{ $t('温馨提示') }}：</span>
                    <span>{{ $t('如遇网络因素不显示当前符合的注单，请稍后刷新网络后重试或点击下面的自助提交') }}</span>
                </p>
                <!-- <p class="title2">{{ $t('*CQ9、DT、AE、TTG 等平台，请点击！') }}&nbsp;&nbsp;<span class="ptTip" @click="toCustomerService">{{ $t('这里') }} </span>&nbsp;&nbsp;{{ $t('自助提交投诉建议。') }} </p> -->
            </div>
            <div class="lastTip">
                <div class="title">{{ $t('温馨提示') }}</div>
                <p>{{ $t('1. 当游戏的中奖牌局总派彩为投入额') }}<span style="color:#E91919">{{ $t('百倍') }}</span>{{ $t('以上时派发的奖金，满足条件的会员可自助申领。') }}</p>
                <p>{{ $t('2. 活动时间：2020-06-11至2022-02-27(00:00:00-23:45:00)。') }}</p>
                <p>{{ $t('3. 每位用户每天只可领取') }}{{data.speActLuckyTimesVO.dailyAppCount}}{{ $t('次千百倍奖金，如当日未领取，则视为自动放弃该奖励，第二日将清零重新统计。') }}<br/>{{ $t('（注意：不包括平台中的捕鱼游戏、现场庄家、视频扑克、街机游戏、牌桌游戏和刮刮乐等游戏。)') }}</p>
                <p>{{ $t('4. 活动礼金不限游戏，只需12倍流水即可提款。') }}</p>
                <p>5. {{ $t('温馨提示') }}：&nbsp;&nbsp;{{ $t('点击此处查看') }}<span class="clickon" @click="openDetail">【{{ $t('千倍万倍') }}】</span>&nbsp;&nbsp;{{ $t('优惠详情。') }}</p>
            </div>
        </div>
    </div>
</template>
<script>
import commonHeader from './commonHeader.vue'
export default {
    components: {
        commonHeader
    },
    data() {
        return {
            messageReqSuccessFlag:true,
            list:[],
            id:null,
            intro:'',
            data:{
                speActLuckyTimesVO:{
                    dailyAppCount:''
                }
            }
        };
    },
    computed:{
        // Anniversary(){
        //     return this.$t('Anniversary')
        // }
    },
    created(){
        this.id = this.$route.query.did;
        this.getData(this.id);
    },
    methods:{
        //点击联系客服
        toCustomerService() {
            this.$router.push({
                path: '/my/service/suggest'
            })
            // if (window.customerServiceStatus == 1) {
            //     //新客服
            //     var _this = this;
            //     var obj = {};
            //     obj.host = _this.$common.getHost();
            //     obj.clientCode = window.clientCode;
            //     obj.clientItem = window.childCode;
            //     obj.username =
            //         this.$common.getUser() && this.$common.getUser().username;
            //     obj.language = this.$common.getLocale();
            //     obj.theme = window.theme;
            //     obj.projectImgUrl = window.projectImgUrl;
            //     obj.orgin = window.location.origin + "/activity";
            //     var str = JSON.stringify(obj);
            //     str = window.btoa(str);
            //     var url =
            //         _this.$config.customerServiceUrl +
            //         "/customerService/pc?s=" +
            //         str;
            //     window.open(url, "_blank");
            // } else {
            //     //旧客服
            //     const url = this.$common.getCustomerService();
            //     window.open(url, "_blank");
            // }
        },
        //跳转详情
        openDetail() {
            this.$router.push({
            path:'/actDetail',
            query:{
                byAppId:this.data.id
            }
            })
        },
        //获取详情数据
        getData(id) {
            this.$http.get(this.$api.getThematicActivitiesByApp, '/'+id,true)
            .then((res) => {
                if(res.code == 0){
                    this.data = res.data;
                    this.intro = res.data.intro;
                    this.list = res.data.speActLuckyTimesVO.unreceivedList;
                   if(this.list.length == 0){
                       this.messageReqSuccessFlag = false;
                   }
               }
            });
        },
        //领取奖励
        submit(item,index){
            this.$confirm(this.$t('是否确认申请该注单奖励'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText:this.$t('取消'),
                type: 'warning'
                }).then(() => {
                        this.$http.put(this.$api.getReceiveActivities + item.thematicActivitiesId + '&betNo=' + encodeURIComponent(item.betNo)).then((res) => {
                            if(res.code == 0){
                                this.$message({ type: 'success', message: res.data});
                                this.getData(this.id);
                            }else{
                                this.$message({type: 'warning', message: res.msg });
                            }
                       
                        });
              
                }).catch(() => {
            });
        },
        //时间戳转时间
       formatTime(time){
            var date = new Date(time); // 初始化日期
            var year = date.getFullYear(); //获取年份
            var month = date.getMonth() + 1; // 获取月份
            var day = date.getDate(); // 获取具体日
            var hour = date.getHours(); // 获取时
            var minutes = date.getMinutes(); // 获取分
            var seconds = date.getSeconds(); // 获取秒
            return year + '-' + month + '-' + day + ' ' +  hour + ':' + minutes + ':' + seconds 
        },
    }
};
</script>
<style  lang="scss">
   .addclass{
        .el-scrollbar__wrap{
            overflow-x: hidden;
        }
   }
</style>
<style lang="scss" scoped>
.ManyTimes{
    .headTip {
        margin: 20px 0;
        background-color: #FFF4D7;
        color: #E91919;
        font-size: 12px;
        padding: 10px;
    }
    .content{
        .titleFa{
            overflow: hidden;
            margin-bottom: 15px;
            .flag{
                width: 4px;
                height: 21px;
                float: left;
                background: #E91919;
                margin-right: 8px;
            }
            .name{
                font-size: 14px;
                font-weight: bold;
                line-height: 21px;
                float: left;
                color: #333333;
            }
        }
        // 表格样式
        .table{
             font-size: 13px;
             margin-bottom: 10px;
             overflow-x: hidden;
             border-top:2px solid #eaeaea;
            .section {
                background-color: #fff;
                color: #333;
                height: 40px;
                line-height: 40px;
                display: flex;
                flex-direction: row;
            }
            ul{
                border: 1px solid #F5F5F5;
                border-bottom:none;
                margin-bottom: 10px;
            }
            .sectionItem {
                flex:1;
                text-align: center;
            }
            .yxpt{
                width: 100px!important;
            }
            .headView {
                display: flex;
                flex-direction: row;
                align-items: center;
                background-color: #fff; 
                height: 34px;
                line-height: 34px;
                font-size: 12px;
                color: #999999;
                cursor: pointer;
                border-bottom: 1px solid #F5F5F5;
                img {
                    width: 16px;
                    height: 16px;
                }
                .el-button--danger{
                    background: #E91919;
                    font-size: 12px;
                    padding: 5px 10px;
                    box-shadow: 0px 3px 6px rgba(230, 79, 79, 0.16);
                }
            }
            .headView:hover{
                background: #F6F6F6;
            }
            
        }
        .noList{
            background-color: #F5F5F5;
            color: #000;;
            text-align: center;
            height: 34px;
            line-height: 34px;
            border: 1px solid #f5f5f5;
            border-top: none;
        }
        .wxtip{
            margin-top: 20px;
            font-size: 12px;
            line-height: 17px;
            border-bottom: 1px solid #E8E8E8;
            padding-bottom: 20px;
            margin-bottom: 24px;
            .title1{
                margin-bottom: 12px;
                color: #999999;
                .fsiast{
                    color: #333333;
                }
            }
            .title2{
                color: #333333;
                .ptTip{
                    color: #E91919;
                    cursor: pointer;
                }
            }
        }
        //温馨提示样式
        .lastTip{
            .title{
                font-size: 14px;
                font-weight: 500;
                line-height: 20px;
                color: #E91919;
            }
            p{
                font-size: 12px;
                line-height: 25px;
                color: #333333;
            }
            .clickon{
                color: rgb(0, 102, 255);
            }
        }
    }
}
</style>