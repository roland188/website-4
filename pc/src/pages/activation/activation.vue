<template>
    <div class="activation">
        <div class="banner" v-if="activityData.picture">
            <img loading="lazy" v-lazy="$common.getImgUrl(activityData.picture)" alt />
        </div>
        <div class="banner" v-else>
            <img loading="lazy" v-lazy="$config.getLocaleImg('bannerLoading1')" alt />
        </div>
        <div class="Body">
            <div class="activationBody">
                <div class="submit-btn act-btn a-r10"  @click="showJoinDialog">{{$t('点击领取我的免费激活码')}}</div>
                <div class="title">{{activityData.name}}</div>
                <div class="time">
                    <div v-if="activityData.forever == 0">
                        <!-- <div class="showtype">xxx</div> -->
                       {{ timeSwitch(activityData.startTime) }} -
				        {{ timeSwitch(activityData.endTime) }}
                    </div>
                    <div v-else>
                        {{$t('活动时间：永久')}}
                    </div>
                </div>
                <div class="content">
                    <div class="innerContent" v-html="activityData.rules"></div>
                </div>
            </div>
        </div>

        <el-dialog
            title=""
            :visible.sync="showDialog"
            :append-to-body="true"
            :show-close="true"
            width="550px"
            center
        >
        <div class="dialog-content-wrap-nc">
            <div class="head">
                <div class="noticeTitle">
                {{$t('领取我的免费激活码')}}
                </div>
            </div>
            <div class="state-btns-wrap">
                <div class="input-style" v-for="(item,index) in activityData.activationCodeConf" :key="index">
                <div class="right">{{item.name}}</div>
                <div class="left">
                    <div class="icon"><img :src="item.receive == 0 ? require('../../assets/image/icon_no.png') : require('../../assets/image/icon_yes.png')" /></div>
                    <div class="Finish bet" @click="goReceive(item)" v-if="item.receive==0">{{$t('去晋级')}}</div>
                    <div class="Finish" @click="goReceive(item)" v-if="item.receive==1">{{$t('领取')}}</div>
                    <div class="Finish sre-btn" @click="goReceive(item)" v-if="item.receive==2">{{$t('已领取')}}</div>
                </div>
                </div>
            </div>
      </div>
    </el-dialog>
            <el-dialog
            title=""
            :visible.sync="successDialog"
            :append-to-body="true"
            :show-close="true"
            width="550px"
            center
        >
        <div class="dialog-content-wrap-nc">
            <div class="head">
                <div class="noticeTitle">
                {{$t('领取成功！请妥善保存！')}}
                </div>
            </div>
            <div class="state-btns-wrap">
               	<div class="jhm_text">
					{{$t('您的会员激活码为')}}：{{codeKey}}
				</div>
				<div class="copy-btn-wrap">
					<div class="copy-btn" @click="copyCode(codeKey)">
						{{$t('复制激活码')}}
					</div>
					<div class="copy-btn" @click="backReceive">
						{{$t('查看其他任务')}}
					</div>
				</div>
            </div>
      </div>
    </el-dialog>
        <!-- 引入组件 -->
    <ActDetail ref="actDetail"></ActDetail>
    </div>
</template>
<script>
import ActDetail from "../actDetail/actDetail";
export default {
    name: "activation",
    components:{
        ActDetail
    },
    data() {
        return {
            activityTime: "", //时间
            activityData: {}, //详情数据
            innerContent: "", //详情内容
            showDialog: false,
            successDialog:false,
            codeKey: ''
        };
    },
    created() {
        this.getActivationPage()
    },
    methods: {
        getActivationPage(){
              this.$http.post(this.$api.getActivationPage).then((res)=>{
                if(res.code == 0){
                    this.activityData = res.data
                }
              })
        },
        getActivationCdk(confId){
             this.$http.post(this.$api.getActivationCdk +"?confId=" + confId, true) .then((res)=>{
                 console.log(res.data)
                if(res.code == 0){
                   
                    this.codeKey = res.data.codeKey
                }
             })
        },
        showJoinDialog() {
            this.showDialog = true;
        },
        goReceive(item){
            const index = item.receive;
            if (index == 0) {
                this.$router.push({
                   path:'/home', 
                });
                // this.showDialog = false;
                // this.$refs.actDetail.openDialog(349);
                // this.$router.push({
                //     //从活动列表进入
                //     path: "/actDetail",
                //     query: {
                //         id: 349,
                //     },
                // });
                return
            } else{
                this.getActivationCdk(item.id);
                this.showDialog = false;
                this.successDialog = true;
            }
        },
          copyCode (code) {
            this.$copyText(code).then(() => {
                this.$message.success(this.$t('复制成功'))
            }, () => {
                this.$message.error(this.$t('复制失败'))
            })
        },
    	backReceive() {
                this.showDialog = true;
                this.successDialog = false;
			},
    	//时间格式转换
			timeSwitch(val) {
				if (val) {
					var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
					var Y = date.getFullYear() + "-";
					var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
					var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
					var h, mm;
					h = date.getHours();
					mm = date.getMinutes();
					h = h < 10 ? "0" + h : h;
					mm = mm < 10 ? "0" + mm : mm;
					var time = Y + M + D + " " + h + ":" + mm + "";
					return time;
				}
			},
    }
};
</script>
<style lang="scss">

    .dialog-content-wrap-nc {
    .head {
    margin: 0px 0.9rem;
    text-align: center;
    color: #999;
    font-size: 13px;
    .noticeTitle{
        color: #000;
        font-size: 16px;
        font-weight: 800;
    }
    }
    .state-btns-wrap {
    margin: 0.3rem 0;
    .input-style {
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 0.9rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.5rem;
        position: relative;
        margin-bottom: 0.2rem;
        .right {
        color: #333;
        font-size: 15px;
        font-weight: bold;
        padding-left: 0.2rem;
        }
        .left {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        }
        .icon {
        width: 0.3rem;
        height: 0.3rem;
        }
        .Finish {
        background: #1ebc73;
        color: #fff;
        margin-left: 20px;
        width: 1.4rem;
        height: 0.5rem;
        line-height: 0.5rem;
        border-top-right-radius: 0.9rem;
        border-bottom-right-radius: 0.9rem;
        cursor: pointer;
        }
        .bet {
        background: #f97611;
        }
        .sre-btn{
            color: #666!important;
		    background: #dfdfdf!important;
		    box-shadow: 0 2px 3px 0 #dfdfdf, 0 4px 7px 0 #ddd;
            cursor: pointer;
        }
    }
    }
    }

    .act-btn {
        background-image: linear-gradient(to bottom, #ffa25a, #f97611);
        color: rgb(255, 255, 255);
    }
     .submit-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        .submit-btn {
          line-height: 0.5rem;
          text-align: center;
          margin: 0 0.2rem;
          cursor: pointer;
        }
        .service {
          background: #fafafa;
          color: #fe9330;
          border: 1px solid #e6e6e6;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        }
      }
           .submit-btn {
                width: 3.3rem !important;
          line-height: 0.5rem;
          text-align: center;
          margin: 0 auto;
          cursor: pointer;
        }
        		.noticeTitle {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				padding: 20px 10px;
				text-align: center;
			}
            .jhm_text{
                font-family:PingFang SC;
                font-weight:500;
                color:#333333;
                font-size:17px;
                text-align:center;
                padding-bottom: 32px;
            }
			.copy-btn-wrap {
				display: flex;
				justify-content: space-around;
				align-items: center;

				.copy-btn {
					width: 220px;
					height: 40px;
					margin-top: 5px;
					line-height: 40px;
					text-align: center;
					color: #666;
					background: #dfdfdf;
					box-shadow: 0 2px 3px 0 #dfdfdf, 0 4px 7px 0 #ddd;
					border-radius: 7px;
                    cursor: pointer;
					background-image: linear-gradient(to bottom, #ffa25a, #f97611);
					color: white;
				}
			}
</style>
<style scoped>

.activation .dialogVisible .el-dialog {
    border-radius: 6px !important;
    padding: 30px 0;
    box-sizing: border-box;
    border: 2px solid;
    border-color: #d1ac84;
    border-radius: 10px;
    background-color: #fff;
}
.getItVisible .el-dialog {
    height: 140px;
    border: 2px solid;
    border-color: #d1ac84;
    border-radius: 10px;
    box-shadow: 0px 5px 5px 0px rgba(179, 147, 112, 0.2);
    overflow: auto;
}

.getItVisible .el-dialog--center .el-dialog__body {
    padding-left: 0 !important;
    padding-right: 0 !important;
    text-align: center !important;
}
.getItVisible .el-dialog__body p {
    margin-top: 21px;
    font-size: 16px;
    font-weight: 400;
    color: #57607e;
}
.activation .dialogVisible .el-dialog__title {
    font-size: 18px;
    font-weight: normal;
    color: #4b4b4b;
    line-height: 10px;
    margin-bottom: 10px;
    font-weight: 600;
    display: block;
}
.getItVisible img {
    widows: 47px;
    height: 47px;
}
.activation .el-table th {
    text-align: center;
    background: linear-gradient(0deg, #d9b26e, #f5d7a8);
    font-size: 14px;
    font-weight: 400;
    color: #553b0f !important;
}
.activation .el-table tr {
    background: transparent;
    color: #313131 !important;
}
.activation .el-table td,
.activation .el-table th.is-leaf,
.activation .el-table--border,
.activation .el-table--group {
    border-color: rgba(87, 96, 126, 0.2) !important;
}
.activation .el-table::before,
.activation .el-table--border::after,
.activation .el-table--group::after {
    background-color: rgba(87, 96, 126, 0.1) !important;
}
.activation .el-table__body td,
.el-table td,
.el-table th.is-leaf {
    border: none !important;
}
.activation .el-table::before {
    height: 0 !important;
}
</style>
<style lang="less" scoped>
.activation {
    text-align: center;
    width: 100%;
    background: url("../../assets/image/activityDatial.png") no-repeat;
    background-size: 100% 100%;
    padding-bottom: 100px;
    position: relative;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    .actComplete {
        text-align: left;
        margin-bottom: 10px;
    }
    .innerContent {
        color: #999;
        font-size: 14px;
    }
    .themeLightColorClass {
        font-size: 18px;
        color: #fe8318 !important;
    }
    .conTitle {
        font-size: 18px;
        color: #4b4b4b !important;
    }
    .banner {
        width: 100%;
        // height: 600px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            // object-fit: cover;
        }
    }
    .time {
        font-size: 16px;
        font-weight: 400;
        color: #424242;
        line-height: 20px;
        opacity: .7;
        margin-top: 20px
    }
    .title {
        text-align: center;
        font-size: 0.38rem;
        font-weight: bold;
        color: #3e444d;
        display: inline-block;
        margin-right: 5px;
        margin-top: 18px;
        vertical-align: bottom;
    }
    .showtype {
        display: inline-block;
        padding: 0 5px;
        width: 58px;
        height: 22px;
        background: url("../../assets/image/typeImg.png") no-repeat;
        background-size: 100% 100%;
        opacity: .8;
        margin-right: 10px;
        color: #fff;
        font-size: 10px;
        text-align: center;
        line-height: 22px;
    }
    .alertHeader {
        padding: 0.5rem 0;
        border-top-left-radius: 0.3rem;
        border-top-right-radius: 0.3rem;
        position: relative;
    }
    .close-img {
        width: 0.3rem;
        height: 0.3rem;
        position: absolute;
        top: 0.35rem;
        right: 0.35rem;
        transition: 1s;
    }
    .a-r10{
        border-radius:10px;
    }
    .close-img:hover {
        transform: rotate(180deg);
    }

    .alertTitle {
        font-size: 0.36rem !important;
        padding-top: 0 !important;
    }
    .activationHeader {
        text-align: left;
        border-bottom: 0.01rem solid #f4f4f4;
        .activationTitle {
            font-family: PingFang SC;
            font-size: 0.36rem;
            margin-bottom: 0.13rem;
        }
        .activationTime {
            display: flex;
            height: 0.36rem;
            line-height: 0.36rem;
            padding-bottom: 0.26rem;
            .actPublishTime {
                font-size: 0.14rem;
                font-weight: 500;
                height: 100%;
                margin-right: 0.2rem;
            }
            .actRemainTime {
                height: 100%;
                background: rgba(255, 255, 255, 1);
                border-radius: 0.18rem;
                font-size: 0.21rem;
                font-weight: 500;
                padding: 0 0.16rem;
            }
        }
    }
    .activationBody {
        box-shadow: 0 5px 15px rgba(0, 0, 0, .2);
        text-align: center;
        padding: 65px;
        padding-bottom: 40px;
        box-sizing: border-box;
        position: relative;
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;
        margin-top: .22rem;
        background: #fdfdfd;
        border-radius: 12px;
        .content {
            padding: 0.24rem 0;
            font-size: 0.16rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: var(--themeLight);
            text-align: left;
            box-sizing: border-box;
            word-break: break-all;
            // height: 500px;
            overflow: auto;
        }
        .loadingText {
            height: 0.14rem;
            line-height: 0.14rem;
            font-size: 0.14rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(102, 102, 102, 1);
        }
    }
    .activationFooter {
        // position: absolute;
        // bottom: 0.8rem;
        // width: calc(100% - 1.4rem);
        overflow: hidden;
        padding-top: 0.16rem;
        .actComplete {
            width: 100%;
            font-size: 0.18rem;
            font-weight: 700;
            color: var(--themeDark);
            position: relative;
            span {
                font-weight: 400;
            }
        }
        .actMoney {
            align-items: flex-end;
            font-size: 0.14rem;
            > div {
                margin-bottom: 5px;
            }
            .totalDeposit {
                color: var(--themeLight);
            }
            .totalDepositMoney {
                display: flex;
                margin-left: 0.05rem;
                color: var(--themeAssistColor);
            }
        }
        .activationBtn {
            font-size: 15px;
            text-align: center;
            width: 160px;
            height: 50px;
            line-height: 50px;
            border-radius: 10px;
        }
        .activationBtn1 {
            font-size: 15px;
            text-align: center;
            width: 160px;
            height: 50px;
            line-height: 50px;
            border-radius: 10px;
            color: #ff9521;
            margin-right: 20px;
            background: url("../../assets/image/btn_bg.png") no-repeat;
            background-size: 100% 100%;
        }
        .activationBtn-act {
            width: 200px;
            height: 50px;
            line-height: 50px;
            border-radius: 10px;
            font-size: 15px;
            text-align: center;
            margin-right: 20px;
            background: rgb(85, 121, 226);
            color: rgb(255, 255, 255);
        }
    }

    > .el-dialog__wrapper {
        .el-dialog {
            // border-radius: 0.3rem;
        }
    }

    //el-Dialog样式
    .el-dialog__header {
        padding: 0;
    }
    .el-dialog__body {
        padding: 0.25rem 0.4rem 0.4rem 0.4rem !important;
        border-radius: 0.3rem;
        box-sizing: border-box;
    }
    .el-dialog__wrapper {
        overflow: hidden;
    }

    //滚动条
    .el-scrollbar__bar {
        opacity: 1;
    }
    .el-scrollbar__wrap {
        overflow: auto;
        // overflow-x: hidden;
        padding-right: 0.2rem;
    }
    .el-scrollbar__thumb {
        background-color: var(--themeColor) !important;
    }
    .el-scrollbar__bar.is-vertical {
        background: #f4f4f4;
    }
}
// notify样式
.myNotify {
    width: 2.5rem !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.15rem 0.3rem !important;
    background-color: #000 !important;
    opacity: 0.5;
    .success {
        width: 0.55rem;
        height: 0.39rem;
        background-size: 100% 100%;
        margin-bottom: 0.1rem;
    }
    .el-notification__content {
        color: white !important;
        font-size: 0.18rem;
    }
}
</style>
