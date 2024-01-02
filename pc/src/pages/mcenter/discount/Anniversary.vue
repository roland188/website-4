<template>
    <div class="basic Anniversary">
        <commonHeader :title='data.name' />
        <div class="headTip">
            <p class="first">{{ $t('温馨提示：如您在周年礼金领取日开始之前累积存款未达到 {x} 元，将无法获得此优惠！', { x: yearlyGiftVO.deposit || 0 }) }} </p>
            <p>{{ $t('派发时间：首次存款日期开始，倒数一周年后即可领取彩金！（需要每一年累计存款1000元以上）') }}</p>
        </div>
        <div class="lastBox1" v-if="yearlyGiftVO.countdown && Object.keys(this.daoTime).length > 0">
            {{ $t('距满年时间还有') }}
            <span class="tipinfo time" >
                {{this.daoTime.day + $t('天') + this.daoTime.hour + $t('时') + this.daoTime.minute + $t('分') + this.daoTime.second + '秒'}} <!-- 有首存款但是领取时间不到 -->
            </span>
        </div>
        <div class="lastBox1" v-if="yearlyGiftVO && !yearlyGiftVO.firstDepositDate">
            {{ $t('距满年时间还有') }}
            <span class="tipinfo time" > {{ $t('00天00时00分00秒') }}</span><!-- 没有首存款 -->
        </div>
        <div class="content">
            <div class="box">
                <div class="headBox">
                    <p class="title" v-if="yearlyGiftVO.firstDepositDate">{{formatTime(yearlyGiftVO.firstDepositDate)}}</p>
                    <p class="title" v-else>00-00-00</p>
                    <p class="tip">{{ $t('第一次存款日期') }}</p>
                </div>
                <div class="headBox">
                    <p class="title">{{yearlyGiftVO.levelName}}</p>
                    <p class="tip">{{ $t('当前VIP等级') }}</p>
                </div>
                <div class="headBox">
                    <p class="title subtitle">{{yearlyGiftVO.amount}}</p>
                    <p class="tip">{{ $t('预发放周年礼金') }}</p>
                </div>
            </div>
            <div class="lastBox">
                <!-- 没有首存款 -->
                <span class="tipinfo" v-if="!yearlyGiftVO.firstDepositDate">{{ $t('未满足参与条件，没有首存款') }}</span>
                <!-- 领取状态 0不可领取 1可领取 2已领取 -->
                <el-button  class="ligqu" @click="submit(1)" v-if="yearlyGiftVO.status == 1">{{ $t('领取') }}</el-button>  <!-- 可领取 -->
                <el-button  class="ligqu ligqued"  @click="submit(2)" v-if="yearlyGiftVO.status == 2">{{ $t('已领取') }}</el-button> <!-- 已领取 -->
                <span class="lookInfo" @click="openDetail">{{ $t('【查看优惠详情】') }}</span>
            </div>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            :title="$t('温馨提示')"
            width="350px"
            top='30vh'
            center>
            <span v-if="yearlyGiftVO.countdown">{{ $t('未到领取时间') }}</span>
            <span v-else-if="yearlyGiftVO.deposit && !yearlyGiftVO.countdown">{{ $t('存款金额未达到') }}：{{yearlyGiftVO.deposit}}</span>
            <span v-else>{{ $t('没有首存款') }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" class="myclbtn">{{ $t('确定') }}</el-button>
            </span>
        </el-dialog>
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
            dialogVisible:false,
            time:null,  //结束时间（后台返回，现在只是模拟时间）,
            daoTime:{},
            data:{},
            intro:'',
            yearlyGiftVO:{}
        }
    },
    created(){
        this.id = this.$route.query.did;
        this.getData(this.id);
    },
    computed:{
        // Anniversary(){
        //     return this.$t('Anniversary')
        // }
    },
    methods:{
           //倒计时
        countDown(endTimeStamp) {  //参数倒计时结束时间
            var mss = endTimeStamp;
            var timeId = setInterval(()=>{
                    let days = parseInt(mss / (1000 * 60 * 60 * 24))
                    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
                    let seconds = parseInt((mss % (1000 * 60)) / 1000)
                    this.daoTime = {
                        day: days < 10 ? "0" + days : days,
                        hour: hours < 10 ? "0" + hours : hours,
                        minute: minutes < 10 ? "0" + minutes : minutes,
                        second: seconds < 10 ? "0" + seconds : seconds,
                        mss: mss,
                    } 
                    mss = mss - 1000;
                    if(mss <= 0){
                        clearInterval(timeId)
                        this.yearlyGiftVO.status = 1;
                        this.daoTime = {}
                    }
                    return this.daoTime;
            },1000)
        },
        //时间戳转时间
        formatTime(time){
            if(time){
                 var date = new Date(time); // 初始化日期
                var year = date.getFullYear(); //获取年份
                var month = date.getMonth() + 1; // 获取月份
                var day = date.getDate(); // 获取具体日
                var hour = date.getHours(); // 获取时
                var minutes = date.getMinutes(); // 获取分
                var seconds = date.getSeconds(); // 获取秒
                return year + this.$t('年') + month + this.$t('月') + day + this.$t('日') + ' ' +  hour + this.$t('时') + minutes + this.$t('分') + seconds + this.$t('秒')
            }
           
        },
        submit(val){
            if(val == 1){  //可领取
                this.$http.put(this.$api.getReceiveActivities + this.id,true)
                .then((res) => {
                    if(res.code == 0){
                        this.$message({
                            message:  res.data,
                            type: 'success',
                        })
                        this.getData(this.id);
                    }else{
                        this.$message({type: 'warning', message: res.msg });
                    }
                });
            }else{
                this.$message({
                    message: this.$t('已领取'),
                    type: 'warning',
                })
            }
        },
         //获取详情数据
        getData(id) {
            this.$http.get(this.$api.getThematicActivitiesByApp, '/'+id,true)
            .then((res) => {
                console.log('----详情', res.data.yearlyGiftVO)
                if(res.code == 0){
                    this.data = res.data;
                    this.intro = res.data.intro;
                    this.yearlyGiftVO = res.data.yearlyGiftVO;
                    // countdown有值，说明有倒计时时间  无值说明倒时时间为0
                    if(this.yearlyGiftVO && this.yearlyGiftVO.countdown){  //进来先判断一下时间渲染是为了避免一秒后渲染bug
                        let mss = this.yearlyGiftVO.countdown;
                        let days = parseInt(mss / (1000 * 60 * 60 * 24))
                        let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                        let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
                        let seconds = parseInt((mss % (1000 * 60)) / 1000)
                        this.daoTime = {
                            day: days < 10 ? "0" + days : days,
                            hour: hours < 10 ? "0" + hours : hours,
                            minute: minutes < 10 ? "0" + minutes : minutes,
                            second: seconds < 10 ? "0" + seconds : seconds,
                            mss: mss,
                        } 
                        this.time = mss-1000;
                        this.countDown(this.time);
                    }
                    if(!this.yearlyGiftVO.status){  // 没有首存款或未达到领取条件
                        this.dialogVisible = true;
                        this.daoTime = {};
                        this.time =0
                    }
                   
               }
            });
        },
          //时间戳转时间
       formatTime(time){
           if(time){
                var date = new Date(time); // 初始化日期
                var year = date.getFullYear(); //获取年份
                var month = date.getMonth() + 1; // 获取月份
                var day = date.getDate(); // 获取具体日
                var hour = date.getHours(); // 获取时
                var minutes = date.getMinutes(); // 获取分
                var seconds = date.getSeconds(); // 获取秒
                return year + '-' + month + '-' + day + ' ' +  (hour>9?hour:'0'+hour) + ':' + (minutes>9?minutes:'0'+minutes) + ':' + (seconds>9?seconds:'0'+seconds) 
           }
        },
        //跳转详情
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
            localStorage.setItem('disIntro',this.intro)
        },
    }
};
</script>
<style lang="scss">
    .Anniversary{
        .el-dialog--center .el-dialog__body{
            text-align: center;
            font-size: 17px;
        }
        .el-dialog__title{
            font-weight: 600;
            font-size: 21px;
        }
        .myclbtn{
            background-color: #ff3a2b;
            color: #fff;
            border: none;
            width: 110px;
        }
    }
</style>
<style lang="scss" scoped>
.Anniversary{
    .el-message-box{
        width: 300px;
    }
    .headTip {
        margin: 20px 0;
        background-color: #FFF4D7;
        color: #E91919;
        font-size: 12px;
        padding: 10px;
        .first{
            margin-bottom: 5px;
        }
    }
    .content{
        background: #FFFFFF;
        border: 1px solid #DCDCDC;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        padding: 16px;
        box-sizing: border-box;
        border-radius: 4px;
        .box{
            display: flex;
            height: 72px;
            border-bottom: 1px solid #E8E8E8;
            .headBox{
                width: 33%;
                margin-right: 10px;
                .title{
                    font-size: 20px;
                    color: #333333;
                    margin-bottom: 10px;
                }
                .subtitle{
                    color: #E91919;
                }
                .tip{
                    font-size: 12px;
                    font-weight: 500;
                    color: #999999;
                }
            }
            .headBox:last-child{
                margin-right: 0;
            }
        }
        .lastBox{
            font-size: 13px;
            height: 50px;
            position: relative;
            padding-right: 25px;
            .tipinfo{
                line-height: 62px;
                color: #E91919;
            }
            .time{
                color: #333;
            }
            .lookInfo{
                float: right;
                line-height: 62px;
                color: #0066CC;
                cursor: pointer;
            }
            .ligqu,.ligqu:hover{
                float: right;
                width: 100px;
                height: 33px;
                line-height: 33px;
                padding: 0;
                color: #fff;
                background-color: #E91919;
                margin-left: 20px;
                border: none;
                margin-top: 15px;

            }
            .ligqued,.ligqued:hover{
                background-color: #E6E6E6;
                color: #999;
            }
        }
    }
     .lastBox1{
        text-align: right;
        margin-bottom: 20px;
        color: #333333;
        height: 16px;
        font-size: 12px;
        border-left: 3px solid #E91919;
        .tipinfo{
              color: #E91919;
              font-size: 14px;
              font-weight: bold;
        }
    }
}
</style>