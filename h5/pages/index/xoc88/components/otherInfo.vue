<!-- 顶部下载 -->
<template>
    <view class="other-info">
        <view class="app">
            <view class="content">
                <view class="title">tải ứng dụng</view>
                <view class="app_items">
                    <view class="android" @click="dowApp">
                        <image mode="heightFix"  src="../../../static/image/indexImg/app_android.png"></image>
                        <text>Hướng dẫn</text>
                    </view>
                    <view class="ios" @click="dowApp">
                        <image mode="heightFix" src="../../../static/image/indexImg/app_ios.png"></image>
                        <text>Hướng dẫn</text>
                    </view>
                </view>
            </view>
            <view class="bg-wrapper">
                <image class="img" mode="heightFix" src="../../../static/image/indexImg/app_img.png"></image>
            </view>
        </view>
         <view class="partner-okvip">
            <view>
                <view class="payment-title">Đối Tác Chính Thíc</view>
                <view class="sub-title">UD Almería & GTG</view>
            </view>
            <view class="partner_right">
                <image class="img1" mode="widthFix" src="../../../static/image/indexImg/CVF.png"></image>
                <view class="line"></view>
                <image class="img2" mode="widthFix" src="../../../static/image/indexImg/logoOKvip.png"></image>
            </view>
        </view>
        <view class="payment">
            <view>Phương Thức Thanh Toán</view>
            <view class="payment-list">
                <image mode="widthFix" src="../../../static/image/indexImg/icon-payment-1.png"></image>
                <image mode="widthFix" src="../../../static/image/indexImg/icon-payment-2.png"></image>
                <image mode="widthFix" src="../../../static/image/indexImg/icon-payment-3.png"></image>
                <image mode="widthFix" src="../../../static/image/indexImg/icon-payment-4.png"></image>
                <image mode="widthFix" src="../../../static/image/indexImg/icon-payment-5.png"></image>
                <image mode="widthFix" src="../../../static/image/indexImg/icon-payment-6.png"></image>
                <image mode="widthFix" src="../../../static/image/indexImg/icon-payment-7.png"></image>
                <image mode="widthFix" src="../../../static/image/indexImg/icon-payment-8.png"></image>
            </view>
        </view>
        <view class="info">
            <view class="info_content">
                <view class="license">
                    <view class="title">Giấy Phép</view>
                    <view class="left">
                        <image class="img"  mode="heightFix" src="../../../static/image/indexImg/giayphep1.png"></image>
                        <image class="img"  mode="heightFix" src="../../../static/image/indexImg/giayphep2.png"></image>
                        <image class="img"  mode="heightFix" src="../../../static/image/indexImg/giayphep3.png"></image>
                    </view>
                    <view class="right">
                        <image class="img"  mode="heightFix" src="../../../static/image/indexImg/giayphep4.png"></image>
                        <image class="img"  mode="heightFix" src="../../../static/image/indexImg/giayphep5.png"></image>
                    </view>
                </view>
                <view class="security">
                    <view class="title">Bảo Vệ</view>
                    <image class="img" mode="heightFix" src="../../../static/image/indexImg/security-1.png"></image>
                    <image class="img" mode="heightFix" src="../../../static/image/indexImg/security-2.png"></image>
                </view>
                <view class="follow">
                    <view class="title">Theo Dõi Chúng Tôi</view>
                    <view class="flex">
                        <image class="img" mode="heightFix" src="../../../static/image/indexImg/follow1.png"></image>
                        <image class="img" mode="heightFix" src="../../../static/image/indexImg/follow2.png"></image>
                        <image class="img" mode="heightFix" src="../../../static/image/indexImg/follow3.png"></image>
                          
                    </view>
                </view>
                <view class="slogan">
                    <view class="title">Chơi Có Trách Nhiệm</view>
                    <view class="flex">
                        <image class="img" mode="heightFix" src="../../../static/image/indexImg/slogan1.png"></image>
                        <image class="img" mode="heightFix" src="../../../static/image/indexImg/slogan2.png"></image>
                        <image class="img" mode="heightFix" src="../../../static/image/indexImg/slogan3.png"></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
  
<script>
export default {
    data() {
        return {
        };
    },
    created() {
        this.setInviteCode()
    },
    methods: {
        setInviteCode() {
            let inviteCode = "";
            inviteCode = JSON.parse(sessionStorage.getItem("inviteCode"));
            if (inviteCode && inviteCode !='null' ) {
                this.getInviteCode(inviteCode)
                inviteCode  = String.fromCharCode(8203) + inviteCode + String.fromCharCode(8203)
                this.$copyText(inviteCode)
            }
        },
        // 请求绑定邀请码
        async getInviteCode(code){
            let params = {
                agentCode: code,
            }
            console.log(code,'code')
            await this.$api.bindAgentCode(params,(err,res) => {
                if(err){
                    console.log(err.msg)
                }
            })
        },
        dowApp() {
            let u = navigator.userAgent;
            if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
                //安卓手机
                if (this.$config.androidDownloadUrl) window.location.href = this.$config.androidDownloadUrl;
            }
            if (u.indexOf('iPhone') > -1) {
                //苹果手机
                if (this.$config.iosDownloadUrl) window.location.href = this.$config.iosDownloadUrl;

            }
        },
    },
};
</script>
  
<style lang="less" scoped>
.other-info {
    margin: 25px 0 0;
    padding-bottom: 20px;
    color: #fff;
    background: #27282a
}

.app {
    display: flex;
    justify-content: space-between;
    height: 300upx;
    padding: 20upx 30upx;
    .content {
        width: 45%;
        margin: 0 auto
    } 
    .bg-wrapper {
        width: 55%;
        transform: translateY(-20%)
    }
     .bg-wrapper uni-image {
        width: 100%;
        height: 320upx;
    }

    .title {
        margin-bottom: 10px;
        padding-top: 3px;
        color: #fff;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        text-transform: uppercase
    }
    .app_items {
        display: flex;
        justify-content: space-between;
        margin: 0;
        padding: 0;
        list-style: none;
        .android,.ios{
            width: 120upx;
            uni-image{
                width: 120upx; 
                height: 120upx;
            }
            uni-text{
                width: 100%;
                white-space: nowrap;
                margin: 8upx 0 0;
                color: #e1e1e1;
                font-size: 24upx;
                text-decoration-line: underline;
            }
        }
    }
    .content {
        width: 45%;
        margin: 0 auto;
    }
}
.partner-okvip{
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 60upx 40upx 40upx;
    .partner_right{
        flex: 1;
        margin-left: 40upx;
        display: flex;
        align-items: center;
        justify-content: center;
        .img1{
            width: 96upx;
            height: 114upx;
        }
        .line{
            display: inline-block;
            vertical-align: middle;
            width: 4upx;
            height: 114upx;
            margin: 0 30upx;
            background: #8b8b8b;
        }
        .img2{
            width: 200upx;
        }
    }
}
.payment{
    padding: 0 40upx;
    .payment-list{
        display: flex;
        justify-content: space-between;
        margin: 30upx 0 20upx;
        padding: 0;
        uni-image{
            width: 60upx;
        }
    }
}
.info{
    display: flex;
    margin: 40upx 0 0;
    padding: 0 40upx;
    justify-content: flex-start;
    .info_content{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .title{
            margin: 0 0 20upx;
            font-size: 26upx;
            font-weight: 400;
            white-space: nowrap;
        }
        .license{
            width: 60%;
            .left{
                display: flex;
                margin: 0 0 20Upx;
                padding: 0;
                gap: 20upx;
                align-items: center;
                .img{
                    width: 60upx;
                    height: 38upx;
                }
            }
            .right{
                .img{
                    height: 38upx;
                }
            }
        }
        .security{
            width: 40%;
            .img{
                height: 46upx;
            }
        }
        .follow{
            width: 60%;
            margin-top: 40upx;
            .flex{
                display: flex;
                justify-content: flex-start;    
                align-items: center;
                gap: 40upx;
            }
            .img{
                width: 39upx;
                height: 39upx;
            }
        }
        .slogan{
            width: 40%;
            margin-top: 40upx;
            .flex{
                display: flex;
                justify-content: flex-start;    
                align-items: center;
                gap: 40upx;
            }
            .img{
                width: 39upx;
                height: 39upx;
            }
        }
    }
}
</style>
  