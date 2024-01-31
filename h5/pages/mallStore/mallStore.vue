<template>
    <view class="index">
        <uni-nav-bar left-icon="back" :title="$t('积分商城')" @clickLeft="goBack"  right-icon="headphones" @clickRight="handleGoServe('/pages/customerService/customerService')"></uni-nav-bar>
        <view class="bgc">
            <view class="LuckyDraw">
                <view class="feiwen"></view>
            </view>
            <view class="coinOrThree">
                <view class="coinOrThreeLeft">
                    <view></view>
                    <text>{{coinNum}}</text>
                </view>
                <view class="coinOrThreeRight">
					<view></view>
                    <!-- <view class="icon" @click="sign()"></view> -->
                    <view class="icon1" @click="goRecords('./records')"></view>
                    <view class="icon2" @click="toPage('./prize')"></view>
                    <view class="icon3" @click="toPage('./rules')"></view>
                </view>
            </view>

            <view class="subtitles" style="text-align:left;">
                <view>
                    <view class="rollingItem" v-for="(item,index) in list" :key="index" :class="{single:index%2 !== 1 || index%2 !== 0,double:index%2 === 1}">
                        <view class="imgs">
                            <image class="img-item" :src="$config.getImgUrl(item.imgUrlApp)" />
                            <!-- <img :src="item.imgUrlApp"/> -->
                        </view>
                        <text class="text">{{item.promptMsg}}</text>
                    </view>
                </view>
            </view>

            <view class="content">
                <view class="container">
                    <view class="container1"></view>
                </view>
              <view class="bottomCircle"></view>
                <view class="container2">
                    <view class="item" :class="[`location${index+1}`,move?`newLocation${index + 1}`:`location${index+1}`]" v-for="(item,index) in lotteryMallVOList" :key="index" v-show="index < 7">
                        <image class="img-item1" :src="$config.getImgUrl(item.imgUrlApp)"/>
                        <!-- <img :src="item.imgUrlApp" alt /> -->
                    </view>

                    <view class="item ball2 location8" :class="{newLocation8:move}"></view>
                    <view class="item ball2 location9" :class="{newLocation9:move}"></view>
                    <view class="item ball2 location10" :class="{newLocation10:move}"></view>
                    <view class="item ball3 location11" :class="{newLocation11:move}"></view>
                    <view class="item ball3 location12" :class="{newLocation12:move}"></view>
                    <view class="item ball3 location13" :class="{newLocation13:moves}"></view>
                </view>

                <view class="cost">
                  {{ $t('花费') }}<text>{{singleAmount}}</text>{{currency}}
                </view>
                <view class="extracting">
                    <text class="button" @click="LuckyDraw()"></text>
                    <text class="hand"></text>
                </view>
            </view>
            <!-- 虚拟商品 -->
            <virtualProduct  ref='virtualProduct' :currency="currency"/>
            <!-- 实用商品 -->
            <practicalGoods ref='practicalGoods' :currency="currency"/>


        </view>
            <!-- 签到弹窗 -->
        <view class="mask" v-show="signShow" @click="close()" @touchmove.prevent></view>
        <view class="box" v-show="signShow" @touchmove.prevent>
            <view class="maskContent">
                <view class="content">
                    <view class="Continuous">
                        <view></view>
                        <text>{{ $t('连续签到') }}{{signIn.days}}{{ $t('天') }}</text>
                        <view></view>
                    </view>
                    <image src="../../static/image/pointsMall/gift.png" class="contentImg" />
                    <view class="text1">{{ $t('今日签到') }}：<text>{{signIn.todaySignPoint}}</text>{{currency}}</view>
                    <view class="text2">{{ $t('再连续签到') }}<text>{{signIn.nextDays}}</text>{{ $t('天可获得') }}<text>{{signIn.nextMultiple}}</text>{{ $t('倍奖励') }}</view>
                    <view class="text2" v-show="name">{{ $t('当前') }}<text>{{name}}</text>{{ $t('节日期间额') }}</view>
                    <view class="text2" v-show="signMultiple">{{ $t('外加') }}<text>{{signMultiple}}</text>{{ $t('倍奖励') }}</view>
                </view>
                <view class="signButton" @click="signins()" :class="{opct:alreadySign}">{{signInText}}</view>
            </view>
            <i @click="close()" class="close"></i>
        </view>
      <!--  <view class="prompt" v-show="promptShow && type == '1'">
            <text>恭喜您，抽得{{prompt.name}}，请及时联系在线客服提供收件人相关信息</text>
        </view> -->
		<!-- 首次登录弹窗提示 -->
        <view class="prompt prompts" v-show="promptShow && type === '0'">
            <text>{{prompt.remark}}</text>
        </view>

        <view class="prompt" v-show="lackBi">
          <img class="mark" src="../../static/image/pointsMall/mark.png" alt="">
          <text class="textTips">{{currency}} {{$t('余额不足')}}</text>
        </view>
    </view>
</template>
<script>
import virtualProduct from "./components/virtualProduct";
import practicalGoods from "./components/practicalGoods";
import { mapGetters, mapMutations } from 'vuex'
import mailStore from './store'
import Toast from './tost';
export default {
    components:{
        virtualProduct,
        practicalGoods
    },
    data() {
        return {
            headerTitle: this.$t("积分商城"),
            move:false,
            list:[],
            lotteryMallVOList:[],
            signShow:false,
            moves:false,
            coinNum:0,
            currency:'',
            titleName:'',
            singleAmount:'',
            prompt:{},
            promptShow:false,
            type:0,
            smoke:true,
            signIn:{},
            name:'',
            signMultiple:'',
            signInText: this.$t('签到'),
            alreadySign:false,
            lackBi:false,
			isLogin: false
        }
    },
    onLoad(){
        this.getClientMall();
        if(this.$config.showdialog){
            this.sign();
        }
    },
    onShow () {
		this.isLogin = this.$api.isLogin()
		if(this.isLogin){
			this.getMemberPoint();
		}
    },
    methods: {
        ...mapGetters(['getMallUserName', 'getMallUserRmb', 'getMallCurrency']),
        ...mapMutations(['updateMallUserRmb', 'updateMallCurrency']),
        // 返回
        goBack () {
          uni.navigateBacks();
            // uni.navigateBack({
            //      delta: 1
            // })
        },
        // 联系客服
        // goServer () {
        //     uni.navigateTo({
        //         url: '/pages/customerService/customerService'
        //     })
        // },
        //剩余币
        getMemberPoint(){
            this.$api.getMallMemberPoint((err, res) => {
                if (err) return
                // this.updateMallUserName(res.memberName)
                 console.info(666888777, res.memberName)
              mailStore._mutations.updateMallUserName[0](res.memberName)
                // this.updateMallUserRmb(res.balance)
              mailStore._mutations.updateMallUserRmb[0](res.balance)
                this.coinNum = res.balance
            })
        },
        //需要消耗币及币种
        getClientMall(){
            let that = this;
            that.$api.getClientMall((err, res) => {
                if (err) return
                 mailStore.commit("updateMallCurrency", res.currency)
                // that.updateMallCurrency(res.currency)
                that.titleName = res.name
                that.currency = res.currency
                that.singleAmount = res.singleAmount
                that.shoppingMallList()
            })
        },
        // 抽奖
        LuckyDraw() {
            let that = this;
            console.log(that.coinNum >= that.singleAmount)
            if(that.coinNum >= that.singleAmount){
                if(that.smoke){
                    that.smoke = false;
                    that.$api.doLottery((err, res) => {
                        that.getMemberPoint()
                        if (err) {
                            that.smoke = true
                            return
                        }
                        that.prompt = res;
                        that.move = true;//开启抽奖动画
                        that.moves = false;//初始化中奖出球
                        new Promise((resolve)=>{
                            setTimeout(()=>{
                                that.move = false;//1.7秒后关闭抽奖动画
                                that.moves = true;//关闭抽奖后，开启出奖球
                                resolve(true)
                            },1700)
                        }).then((val)=>{
                            if(val){
                                return new Promise((resolve)=>{
                                    setTimeout(()=>{
                                        that.type = res.type + '';
                                        that.moves = false;//关闭出奖动画
                                        if(!res.type){//未中奖type为null,直接提醒remark
                                            Toast(res.remark);
                                            resolve(false);
                                        }else{
                                            that.promptShow = true;//出奖完后弹出中奖弹窗
                                            resolve(true);
                                        }
                                    },1000)
                                }).then((val1)=>{
                                    if(val1){
                                        if(res.type === 1){
                                            mailStore.commit("setChangeItem", that.prompt);
                                            // that.$router.push({
                                            //     path:'/exchangeGoods',
                                            //     query:{
                                            //         type:2,
                                            //         isProInfo:false,
                                            //         name:'index'
                                            //     }
                                            // })
											// let type = '2'
											// let name = 'index'
											let query = {
												type:2,
												isProInfo:false,
												name:'index'
											}
											uni.navigateTo({
												url: `./exchangeGoods?type=2&isProInfo=false&name=index`
											})
                                        }
                                        setTimeout(()=>{
                                            that.promptShow = false;
                                            that.smoke = true;
                                        },1000)

                                    }else{
                                        that.smoke = true;
                                    }
                                })
                            }
                            })
                    })
                }
            }else{
                if(!this.lackBi){
                    this.lackBi = true;
                    setTimeout(()=>{
                        this.lackBi = false;
                    },1000)
                }

            }

        },
        getSignPrecondition(){
            let that = this;
            this.$api.getSignPrecondition((err, res) => {
                if (err) return
                that.signIn = res;
                if(res.holidayDTO){
                    that.name = res.holidayDTO.name;
                    that.signMultiple = (res.holidayDTO.signMultiple).toString();
                }
                that.alreadySign = res.alreadySign;
                if(res.alreadySign){
                    that.signInText = this.$t('已签到');
                }
            })
        },
        //弹出签到
        sign(){
            this.signShow = true;
            this.getSignPrecondition();
        },
		// 跳转记录
		goRecords(url){
			if(!this.isLogin){
				uni.showToast({
					title: this.$t('请先登录!'),
					// image: require('@/static/image/pointsMall/tanhao.png')
				})
				return false
			}
			uni.navigateTo({
			     url
			})
		},
        signins(){
            let that = this;
            if(!that.alreadySign){
                that.$api.doSignIn((err, res) => {
                    if (err) return
                     if(res.signSucceed){
                        that.signInText = this.$t('已签到')
                        that.alreadySign = true;
                        that.getMemberPoint();
                        that.getSignPrecondition();
                        Toast(this.$t('签到成功！'));
                    }else{
                        Toast(res.msg);
                    }
                })
            }
        },
        close(){
            this.signShow = false;
        },
        toPage(pageName) {
            uni.navigateTo({
                 url: pageName
            })
        },
        //获取商品列表
        shoppingMallList() {
            let that = this;
            that.$api.shoppingMallList((err, res) => {
                if (err) return
				if(res){
					that.$refs.virtualProduct.virtualMallVOList = res.virtualMallVOList; //虚拟商品数据
					that.$refs.practicalGoods.shoppingMallVOList = res.shoppingMallVOList; //实用商品数据
					that.$refs.virtualProduct.limitCount = res.limitCount;
					that.$refs.practicalGoods.limitCount = res.limitCount;
					that.lotteryMallVOList = res.lotteryMallVOList;
					that.list = res.luckyMallVOList;
				}
            })
        },
        handleGoServe(url){
        uni.navigateTo({
          url: "/pages/subCustomerService/subCustomerService",
        });
      }
    }
};
</script>

<style lang="scss" scoped>
.index {
    overflow-x: hidden;
    flex: 1;
    background-color: #FFDFC7;
    min-height: 100%;
    .bgc {
        background: url("../../static/image/pointsMall/bgc.png") no-repeat;
    }
    .LuckyDraw {
        width: 310px;
        margin: 0 auto;
        height: 88vh;
        margin-top: 40px;
        box-sizing: border-box;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        z-index: 1;
    }
    .feiwen {
        width: 100%;
        height: 80%;
        position: absolute;
        left: 0;
        top: 50px;
        background: url("../../static/image/pointsMall/beating.png") no-repeat;
        background-size: 100% 100%;
        animation: feiwen 2s ease infinite;
        z-index: 1;
    }
    @keyframes feiwen {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
    .coinOrThree {
        height: 50px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        box-sizing: border-box;
        align-items: center;
        position: relative;
        z-index: 3;
        .coinOrThreeLeft {
            position: relative;
            height: 20px;
            line-height: 18px;
            border: 1px solid #FFF;
            border-radius: 30px;
            padding: 0 10px;
            box-sizing: border-box;
            view {
                display: inline-block;
                width: 24px;
                height: 28px;
                position: absolute;
                left: 0;
                top: -5px;
                background: url("../../static/image/pointsMall/coin.png") no-repeat;
                background-size: 100% 100%;
            }
            text {
                display: inline-block;
                color: #ffffff;
                margin-left: 20px;
            }
        }
        .coinOrThreeRight {
            display: flex;
            justify-content: space-between;
            width: 150px;
            view {
                width: 35px;
                height: 35px;
            }
            .icon{
                background: url("../../static/image/pointsMall/sign.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon1 {
                background: url("../../static/image/pointsMall/record.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon2 {
                background: url("../../static/image/pointsMall/prize.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon3 {
                background: url("../../static/image/pointsMall/rules.png") no-repeat;
                background-size: 100% 100%;
            }
        }
    }
    .subtitles {
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        color: #ffffff;
        overflow: hidden;
        width: 100%;
        view {
            display: inline-block;
            white-space: nowrap;
			transform: translate3d(0, 0, 0);
            // animation: gundong 100s linear infinite;
			animation: 100s linear 1s infinite gundong;
            .single{
                position: relative;
                top:10px;
                margin-left:10px;
                background: #50858b;
            }
            .double{
                position: relative;
                top:20px;
                background: #b33c5e;
            }
            .rollingItem {
                height: 20px;
                display: inline-block;
                position: relative;
                border-radius: 10px;
                margin-left: 50px;
                .imgs{
                    position: absolute;
                    left: 0;
                    top: -30%;
                    width: 30px;
                    height:30px;
                    background: url("../../static/image/pointsMall/ball1.png") no-repeat;
                    background-size: 100% 100%;
                    transform: translateY(-50%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    overflow: hidden;
                    .img-item{
                        width: 28px;
                        height:28px;
                    }
                }
                .text{
                    display: inline-block;
                    margin: 0 20px ;
                    height:20px;
                    line-height: 48px;
                    position: relative;
                    top: -14px;
                    left:15px;
                }
            }
            .rollingItem:nth-child(1) {
                margin-left: 750upx;
            }
        }
    }
	@keyframes gundong {
	    0%{
	        transform:translateX(0%);
	    }
	    100%{
	        transform:translateX(-100%);
	    }
	}
    .content {
        position: relative;
        z-index: 2;
        display:flex;
        flex-direction: column;
    }
    .container {
        width: 310px;
        height: 350px;
        background: url("../../static/image/pointsMall/machine.png") no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
        position: relative;
        z-index: 1;
    }

    .container1 {
        width: 310px;
        height: 70px;
        position: absolute;
        left: 0;
        bottom: 25px;
        background: url("../../static/image/pointsMall/a.png") no-repeat;
        background-size: 100% 100%;
    }
   .bottomCircle {
     width: 705upx;
     height: 140upx;
     background: url("../../static/image/pointsMall/bottomCircle.png") no-repeat;
     background-size: 100% 100%;
     margin: 0 auto;
     position: absolute;
     z-index: -1;
     left: 20upx;
     bottom: 205upx;
   }

  .container2 {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        position: absolute;
        left: 53%;
        top: 0;
        transform: translateX(-50%);
        .item {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: url("../../static/image/pointsMall/ball1.png") no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            .img-item1 {
                width: 70%;
                height: 70%;
            }
        }
        .ball2 {
            width: 35px;
            height: 35px;
            background: url("../../static/image/pointsMall/ball2.png") no-repeat;
            background-size: 100% 100%;
        }
        .ball3 {
            width: 35px;
            height: 35px;
            background: url("../../static/image/pointsMall/ball3.png") no-repeat;
            background-size: 100% 100%;
        }
        .location1 {
            left: 120px;
            bottom: 30px;
            animation: ballAnimation1 2s linear infinite;
        }
        @keyframes ballAnimation1 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(10px, -10px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation1 {
            animation: newBallAnimation1 1.7s linear 1;
        }
        @keyframes newBallAnimation1 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(-30px, -100px);
            }
            30% {
                transform: translate(-50px, 100px);
            }
            45% {
                transform: translate(-70px, -100px);
            }
            60% {
                transform: translate(-20px, 100px);
            }
            75% {
                transform: translate(-70px, -100px);
            }
            90% {
                transform: translate(-30px, 50px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location2 {
            left: 120px;
            bottom: 70px;
            animation: ballAnimation2 4.5s ease infinite;
        }
        @keyframes ballAnimation2 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(-10px, -10px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation2 {
            animation: newBallAnimation2 1.7s linear 1;
        }
        @keyframes newBallAnimation2 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(-90px, -70px);
            }
            30% {
                transform: translate(10px, 50px);
            }
            45% {
                transform: translate(-30px, -70px);
            }
            60% {
                transform: translate(-70px, 100px);
            }
            75% {
                transform: translate(-10px, -70px);
            }
            90% {
                transform: translate(-50px, 100px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location3 {
            left: 40px;
            bottom: 90px;
            animation: ballAnimation3 4.5s linear infinite;
        }
        @keyframes ballAnimation3 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(-10px, -10px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation3 {
            animation: newBallAnimation3 1.7s linear 1;
        }
        @keyframes newBallAnimation3 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(100px, -10px);
            }
            30% {
                transform: translate(40px, -50px);
            }
            45% {
                transform: translate(20px, 90px);
            }
            60% {
                transform: translate(80px, 0px);
            }
            75% {
                transform: translate(-20px, -50px);
            }
            90% {
                transform: translate(50px, 100px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location4 {
            left: 10px;
            bottom: 60px;
            animation: ballAnimation4 4s linear infinite;
        }
        @keyframes ballAnimation4 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(-10px, 20px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation4 {
            animation: newBallAnimation4 1.7s linear 1;
        }
        @keyframes newBallAnimation4 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(100px, -80px);
            }
            30% {
                transform: translate(100px, 50px);
            }
            45% {
                transform: translate(0px, 50px);
            }
            60% {
                transform: translate(80px, -80px);
            }
            75% {
                transform: translate(0, 50px);
            }
            90% {
                transform: translate(10px, -80px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location5 {
            left: 40px;
            bottom: 60px;
            animation: ballAnimation5 3s linear infinite;
        }
        @keyframes ballAnimation5 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(-10px, 20px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation5 {
            animation: newBallAnimation5 1.7s linear 1;
        }
        @keyframes newBallAnimation5 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(-10px, -90px);
            }
            30% {
                transform: translate(80px, 40px);
            }
            45% {
                transform: translate(0px, -90px);
            }
            60% {
                transform: translate(10px, 40px);
            }
            75% {
                transform: translate(100px, -10px);
            }
            90% {
                transform: translate(60px, 70px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location6 {
            left: 80px;
            bottom: 70px;
            animation: ballAnimation6 4s linear infinite;
        }
        @keyframes ballAnimation6 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(-10px, 20px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation6 {
            animation: newBallAnimation6 1.7s linear 1;
        }
        @keyframes newBallAnimation6 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(60px, 10px);
            }
            30% {
                transform: translate(-90px, -40px);
            }
            45% {
                transform: translate(0px, 60px);
            }
            60% {
                transform: translate(50px, -20px);
            }
            75% {
                transform: translate(-90px, -40px);
            }
            90% {
                transform: translate(10px, 70px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location7 {
            left: 120px;
            bottom: 10px;
            animation: ballAnimation7 3s linear infinite;
        }
        @keyframes ballAnimation7 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(-10px, 5px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation7 {
            animation: newBallAnimation7 1.7s linear 1;
        }
        @keyframes newBallAnimation7 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(-120px, -10px);
            }
            30% {
                transform: translate(30px,-80px);
            }
            45% {
                transform: translate(-120px, -130px);
            }
            60% {
                transform: translate(10px, 0px);
            }
            75% {
                transform: translate(-50px, -130px);
            }
            90% {
                transform: translate(-50px, 80px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location8 {
            left: 80px;
            bottom: 10px;
            animation: ballAnimation8 4.5s linear infinite;
        }
        @keyframes ballAnimation8 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(-20px, 20px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation8 {
            animation: newBallAnimation8 1.7s linear 1;
        }
        @keyframes newBallAnimation8 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(-50px, -150px);
            }
            30% {
                transform: translate(-50px, 10px);
            }
            45% {
                transform: translate(40px, -140px);
            }
            60% {
                transform: translate(50px, 10px);
            }
            75% {
                transform: translate(-70px, -140px);
            }
            90% {
                transform: translate(50px, -130px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location9 {
            left: 50px;
            bottom: 20px;
            animation: ballAnimation9 4s linear infinite;
        }
        @keyframes ballAnimation9 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(5px, 10px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation9 {
            animation: newBallAnimation9 1.7s linear 1;
        }
        @keyframes newBallAnimation9 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(20px, -150px);
            }
            30% {
                transform: translate(-20px, 0px);
            }
            45% {
                transform: translate(80px, 110px);
            }
            60% {
                transform: translate(20px, 10px);
            }
            75% {
                transform: translate(10px, -90px);
            }
            90% {
                transform: translate(20px, 80px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location10 {
            left: 30px;
            bottom: 10px;
            animation: ballAnimation10 4.5s linear infinite;
        }
        @keyframes ballAnimation10 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(5px, 10px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation10 {
            animation: newBallAnimation10 1.7s linear 1;
        }
        @keyframes newBallAnimation10 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(120px, -20px);
            }
            30% {
                transform: translate(-40px, -80px);
            }
            45% {
                transform: translate(80px, -120px);
            }
            60% {
                transform: translate(-20px, 110px);
            }
            75% {
                transform: translate(60px, -150px);
            }
            90% {
                transform: translate(70px, 80px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location11 {
            left: 10px;
            bottom: 40px;
            animation: ballAnimation11 4.5s linear infinite;
        }
        @keyframes ballAnimation11 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(-5px, 15px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation11 {
            animation: newBallAnimation11 1.7s linear 1;
        }
        @keyframes newBallAnimation11 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(90px, -110px);
            }
            30% {
                transform: translate(-10px, 0px);
            }
            45% {
                transform: translate(120px, -100px);
            }
            60% {
                transform: translate(-10px, 10px);
            }
            75% {
                transform: translate(150px, -20px);
            }
            90% {
                transform: translate(-10px, -70px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location12 {
            left: 10px;
            bottom: 40px;
            animation: ballAnimation11 4.5s linear infinite;
        }
        @keyframes ballAnimation12 {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translate(-5px, 15px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .newLocation12 {
            animation: newBallAnimation12 1.7s linear 1;
        }
        @keyframes newBallAnimation12 {
            0% {
                transform: translateX(0);
            }
            15% {
                transform: translate(90px, -110px);
            }
            30% {
                transform: translate(-10px, 0px);
            }
            45% {
                transform: translate(120px, -100px);
            }
            60% {
                transform: translate(-10px, 10px);
            }
            75% {
                transform: translate(150px, -20px);
            }
            90% {
                transform: translate(-10px, -70px);
            }
            100% {
                transform: translateX(0);
            }
        }
        .location13 {
            width: 30px;
            height: 30px;
            left: 70px;
            bottom: -20px;
        }
        .newLocation13 {
            animation: newBallAnimation13 0.7s linear 1;
        }
        @keyframes newBallAnimation13 {
            0% {
                left: 70px;
                bottom: -20px;
            }
            15%{
                left: 46px;
                bottom: -10px;
            }
            30%{
                left: 22px;
                bottom: -4px;
            }
            45%{
                left: 7px;
                bottom: 10px;
            }
            55%{
                left: -4px;
                bottom: 22px;
            }
            65%{
                left: -12px;
                bottom: 37px;
            }
            75%{
                left: -17px;
                bottom: 54px;
            }
            80%{
                left: -21px;
                bottom: 70px;
            }
            90%{
                left: -21px;
                bottom: 70px;
            }
            99%{
                left: -34px;
                bottom: 75px;

            }
            100%{
                left: -38px;
                bottom: 75px;
                display: none;
            }
        }
    }
    .cost {
        display: inline-block;
        padding: 4px 10px;
        margin: 0 auto;
        background: #FFFAF8;
        box-sizing: border-box;
        border-radius: 20px;
        text-align: center;
        color: #333333;
        font-size: 14px;
        border: 1px solid #EA5F13;
        text {
            color: #ff2a2a;
            margin: 0 3px;
        }
    }
    .extracting {
        width: 180px;
        height: 50px;
        display: flex;
        justify-content: center;
        margin: 10px auto;
        position: relative;
      .button {
        display: inline-block;
        width: 150px;
        height: 58px;
        background: url("../../static/image/pointsMall/button.png") no-repeat;
        background-size: 100% 100%;
        &:active{
          transform: translateY(1px);
          height: 55px;
        }
      }
        .hand {
            width: 50px;
            height: 30px;
            background: url("../../static/image/pointsMall/hand.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 10px;
            top: 5px;
            animation: hands 1s ease infinite;
        }
        @keyframes hands {
            0% {
                transform: translateY(0);
            }
            12.5% {
                transform: translateY(8px);
            }
            25% {
                transform: translateY(0);
            }
            37.5% {
                transform: translateY(8px);
            }
            50% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(0);
            }
        }
    }
    .mask{
        width:100vw;
        height:100vh;
        background: rgba(0,0,0,0.5);
        position: fixed;
        left: 0;
        top: 0;
        z-index:5;
    }
    .box{
        display: flex;
        flex-direction: column;
        width: 300px;
        position: absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
        z-index: 5;
        align-items: center;
        .maskContent{
            width: 300px;
            height: 400px;
            background: url('../../static/image/pointsMall/signBgc.png') no-repeat;
            background-size: 100% 100%;
            z-index: 4;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .content{
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top:100px;
                .Continuous{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color:#D75E02;
                    width: 100%;
                    view{
                        display: inline-block;
                        width: 40px;
                        height:1px;
                        background-color: #D75E02;
                    }
                }
                .contentImg{
                    width: 80px;
                    height: 80px;
                    margin-top: 5px;
                }
                text{
                    margin:0;
                }
                .text1{
                    font-size: 16px;
                    color: #333333;
                    font-weight: bold;
                    margin-bottom: 5px;
                    text{
                        color: #D75E02;
                    }
                }
                .text2{
                    color:#ACACAC;
                    font-size: 12px;
                    text{
                        color: #D75E02;
                    }
                }
            }
            .signButton{
                width: 150px;
                height: 50px;
                background: url('../../static/image/pointsMall/btnbg.png') no-repeat;
                background-size: 100% 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #D75E02;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
            .opct{
                opacity: 0.5;
            }
        }
        .close{
            display: inline-block;
            width: 35px;
            height: 35px;
            background: url('../../static/image/pointsMall/close.png') no-repeat;
            background-size: 100% 100%;
            margin-top: 20px;
        }
    }

    .prompt{
        width: auto;
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        background: rgba(0,0,0,0.7);
        border-radius: 10px;
        z-index: 3;
        display:flex;
        align-items: center;
        padding:20rpx 30rpx;
        box-sizing: border-box;
        img{
            width: 36rpx;
            margin-right: 20rpx;
        }

        .textTips{
            font-size:14px;
            color:#ffffff;
            text-align: center;
            box-sizing:border-box;
            margin:0;
        }
    }
    .prompts{
        width: 150px;
    }
}

</style>
