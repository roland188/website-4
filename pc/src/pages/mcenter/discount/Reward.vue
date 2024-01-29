<template>
    <div class="basic Reward">
        <commonHeader :title='data.name || name'/>
        <Marquee :text="data.marquee" />
        <div class="content">
            <ul class="table">
                <div class="tableLeft">
                    <li>
                        <span class="text1">{{list.checkTime}}</span>
                        <span class="text2">{{$t('日期')}}</span>
                    </li>
                    <li>
                        <span class="text1">{{list.gameInnings}}</span>
                        <span class="text2">{{$t('完成总局数')}}</span>
                    </li>
                    <li>
                        <span class="text1">{{list.betAmountValid}}</span>
                        <span class="text2">{{$t('有效投注额')}}</span>
                    </li>
                    <li>
                        <span class="text1 red">{{list.amountReward}}</span>
                        <span class="text2">{{$t('奖励金')}}</span>
                    </li>
                </div>

                <li class="tableRight receive" @click="receive(1)" v-show="list.status === 0 && !buttonShow && timePass">{{$t('领取')}}</li>
                <li class="tableRight" @click="receive(3)" v-show="list.status === 0 && !buttonShow && !timePass">{{$t('未达成领取条件')}}</li>
                <li class="tableRight" @click="receive(2)" v-show="list.status === 1 && !buttonShow">{{$t('已领取')}}</li>
                <li class="tableRight" @click="receive(3)" v-show="buttonShow">{{$t('未达成领取条件')}}</li>
            </ul>
            <div style="padding:10px 20px">{{$t('领取时间：')}}{{common.conversionTime(compensationVO.validTimeStartApp)}} -- {{common.conversionTime(compensationVO.validTimeStopApp)}}</div>
            <div class="lastTip">
                <div class="title">{{$t('温馨提示：')}}</div>
                <p>{{$t('1. 根据会员每日在【开元棋牌】、【YOO棋牌】、【DB棋牌】、【大唐棋牌】平台所完成的游戏总局数， 且当天在上述棋牌平台的总有效投注额≥1000元，即会返送相对应的奖励金')}}</p>
                <p>{{$t('2. 每日16点前，统计昨日北京时间00点--23点59分59秒产生的总局数。')}}</p>
                <p>{{$t('3. 每日活动的奖励金不可累积，如用户在某一天未领取奖励金，则视为自动放弃该奖励将清零重新统计。')}}</p>
                <p>{{$t('4. 活动礼金不限游戏，只需1倍流水即可提款。')}}</p>
                <p>{{$t('5. 温馨提示： ')}}&nbsp;&nbsp;<span class="clickon" @click="openDetail()">{{$t('点击此处查看')}}</span>&nbsp;&nbsp;{{$t('棋牌奖励金优惠详情')}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import commonHeader from './commonHeader.vue'
import Marquee from '@/components/Marquee/index.vue'
import common from '../../../utils/common'
export default {
     props: {
        dd: {
        type: Object,
        default: () => ({}),
        },
    },
    components: {
        commonHeader,
        Marquee
    },
    data() {
        return {
            common,
            list:{
                checkTime:'',
            },
            compensationVO: {
                validTimeStartApp: '',
                validTimeStopApp: ''
            },
            buttonShow:false,
            data:{},
            name:'',
            betNo:'',
        };
    },
    created() {
        this.id = this.dd.id;
        this.name = this.dd.name;
        this.getData(this.id);
  },
    computed:{
        timePass() { // 是否在领取时间段内
            const now = new Date().getTime()
            return now >= this.compensationVO.validTimeStartApp && now <= this.compensationVO.validTimeStopApp
        },
        // Reward(){
        //     return this.$t('Reward')
        // }
    },
    methods:{
        openDetail(){
            this.$router.push({
                path:'/discount',
                query:{
                    flag:true,
                    name:this.data.name,
                    startTime:this.data.startTime,
                    endTime:this.data.endTime,
                    forever:this.data.forever,
                }
            });
            localStorage.setItem('disIntro',this.data.intro)
        },
        getData(id) {
            let that = this;
            that.$http.get(that.$api.getThematicActivitiesByApp, '/'+id,true)
            .then((res) => {
                console.log('----数据', res)
                if(res.code == 0){
                    that.compensationVO = res.data.compensationVO
                    that.data = res.data;
                    if(res.data.compensationVO.receivedList.length !== 0){
                        that.betNo = res.data.compensationVO.receivedList[0].recordsNumber;
                        that.list = res.data.compensationVO.receivedList[0];
                        let time = (new Date).getTime();
                        let yesday = new Date(time); // 获取的是前一天日期
                        that.list.checkTime = (yesday.getMonth()> 9 ? (yesday.getMonth() + 1) : + (yesday.getMonth() + 1)) + '-' +(yesday.getDate()> 9 ? (yesday.getDate()) : "0" + (yesday.getDate()));
                        that.buttonShow = false;
                    }else{
                        let time = (new Date).getTime() - 24 * 60 * 60 * 1000;
                        let yesday = new Date(time); // 获取的是前一天日期
                        that.list.checkTime = (yesday.getMonth()> 9 ? (yesday.getMonth() + 1) : + (yesday.getMonth() + 1)) + '-' +(yesday.getDate()> 9 ? (yesday.getDate()) : "0" + (yesday.getDate()));
                        that.list.gameInnings = 0;
                        that.list.betAmountValid = 0.00;
                        that.list.amountReward = 0.00;
                        that.buttonShow = true;
                    }
               }else{
                    let time = (new Date).getTime() - 24 * 60 * 60 * 1000;
                    let yesday = new Date(time); // 获取的是前一天日期
                    that.list.checkTime = (yesday.getMonth()> 9 ? (yesday.getMonth() + 1) :(yesday.getMonth() + 1)) + '-' +(yesday.getDate()> 9 ? (yesday.getDate()) : "0" + (yesday.getDate())) ;
                    that.list.gameInnings = 0;
                    that.list.betAmountValid = 0.00;
                    that.list.amountReward = 0.00;
                    that.buttonShow = true;
                    this.$message({
                        message:res.msg,
                        type:'warning'
                    })
               }
            });
        },
        receive(val){
            let that = this;
            if(val === 1){
                that.$http.put(this.$api.getReceiveActivities + that.id + "&betNo=" + encodeURIComponent(that.betNo))
                .then((res) => {
                    if(res.code == 0){
                        that.$message({
                            message:res.data,
                            type:'success'
                        })
                        that.getData(that.id);
                    }else{
                        that.$message({type: 'warning', message: res.msg });
                    }
                });

            }else if(val === 2){
                this.$message({
                    message:this.$t('奖励已领取！'),
                    type:'warning'
                })
            }else if(val === 3){
                this.$message({
                    message:this.$t('未达成领取条件'),
                    type:'warning'
                })
            }

        }
    }
};
</script>
<style lang="scss" scoped>
.Reward{
    .headTip {
        margin: 20px 0;
        background-color: #FFF4D7;
        color: #E91919;
        font-size: 12px;
        padding: 10px;
    }
    .content{
        .table{
            width: 100%;
            height: 87px;
            background-color: #ffffff;
            border: 1px solid #DCDCDC;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .tableLeft{
                display: flex;
                justify-content: space-around;
                padding-left: 20px;
                box-sizing: border-box;
                li{
                    display: flex;
                    flex-direction: column;
                    margin-right: 110px;
                    .text1{
                        color: #333333;
                        font-size: 20px;
                    }
                    .text2{
                        color: #999999;
                        font-size: 12px;
                        margin-top: 5px;
                    }
                    .red{
                        color: #E91919;
                    }
                }
            }
            .tableRight{
                width: max-content;
                height: 36px;
                margin-right:16px;
                padding: 0 0.3rem;
                background: #F5F5F5;
                border: 1px solid #E6E6E6;
                border-radius: 2px;
                text-align: center;
                line-height: 36px;
                color: #999999;
                font-weight: 500;
            }
            .receive{
                background-color: #E91919;
                color: #ffffff;
                border: none;
            }
        }

        //温馨提示样式
        .lastTip{
            .title{
                font-size: 14px;
                font-weight: 500;
                line-height: 20px;
                color: #E91919;
                margin-top: 50px;
            }
            p{
                font-size: 12px;
                font-family: PingFang SC;
                line-height: 25px;
                color: #333333;
                line-height: 2.5;
            }
            .clickon{
                color: #517AE9;
            }
        }
    }

}
</style>
