<!-- 顶部下载 -->
<template>
    <view class="PrizePool-view">
        <!-- <view class="promo-image">
          <image class="img" :src="'@/static/image/indexImg/promo_img_1.png'"  mode="heightFix"></image>
          <image class="img_gif" :src="'@/static/image/indexImg/promo_img_2.gif"  mode="heightFix"></image>
        </view> -->
        <view class="jackpot-title">{{$t('老虎机快要爆分')}}</view>
        <view class="jackpot">
          <view class="item" v-for="(item,i) in jackList" :key="i">
            <text>{{ item }}</text>
          </view>
        </view>
 
        <view class="games-wrap">
          <view class="btn-sanhu">
            <image class="img" :src="'@/static/image/indexImg/btn-sanhu.png'"  mode="aspectFit"></image>
            <text>{{$t('幸运抽奖')}}</text>
          </view>
          <view class="games">
            <view class="games-items" v-for="(item,i) in list" :key="i">
            <view class="title">{{$t('老虎机')}}</view>
            <view class="content">
              <image class="img1" :src="require('@/static/image/indexImg/game-bg' + (i+1) + '.png')"  mode="widthFix"></image>
              <image class="img2" :src="item.iconUrl"  mode="widthFix"></image>
            </view>
            <view class="blance">
              <view class="num">{{ item.showNumber }}</view>
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
        jackList:[8,8,8,8,4,7,1,6,9],
        list:[
          {
            showNumber:'',
            numner: 888893838,
            iconUrl: require('@/static/image/indexImg/pg_w.png'),
          },
          {
            numner: 888743832,
            showNumber:'',
            iconUrl: require('@/static/image/indexImg/jili.png'),
          },
          {
            numner: 888522395,
            showNumber:'',
            iconUrl: require('@/static/image/indexImg/jili.png'),
          },
        ],
        timer0: null,
        timer: null,
      };
    },
    created() {
        this.list.forEach(v => {
            v.numner += Math.floor(Math.random(0, 9) * 100000)
        })
        this.timer0 = setInterval(this.addNum0, 500)
        this.timer = setInterval(this.addNum, 200)
    },
    methods: {
      // 数字累加
      addNum() {
        let addNum = Math.ceil(Math.random()*10)
          this.list.forEach(v => {
              v.showNumber = this.transform(v.numner += addNum)
          })
      },
      // 数字累加
      addNum0() {
        let numArr = Number(this.jackList.join(""));
        let addNum = Math.ceil(Math.random()*10+1)
        numArr = numArr + addNum
        this.jackList = numArr.toString().split("")
      },
      // 正则加逗号
      transform(num) {
          return num.toString().replace(/\B(?=(\d{3})+$)/g, ",")
      }
    },
    beforeDestroy() {
      this.timer0 = null
      this.timer = null
      clearInterval(this.timer0)
      clearInterval(this.timer)
		},
  };
  </script>
  
  <style lang="less" scoped>
  .PrizePool-view{
    position: relative;
    // margin-top: 40upx;
    padding: 220upx 10upx 10upx;
    text-align: center;
    background: url('@/static/image/indexImg/promo_bg.png') no-repeat ;
    background-size: 100% 100%;
    object-fit: cover;
    .promo-image{
      position: absolute;
      top: 0%;
      left: 50%;
      width: 80%;
      margin: 0 auto;
      transform: translateX(-50%);
      .img{
        width: 100%;
        height: 336upx;
      }
      .img_gif{
        position: absolute;
        bottom: 10px;
        left: 48%;
        width: 200upx;
        transform: translateX(-50%);
        color: #fff;
        font-weight: 900;
        text-align: center;
        text-transform: uppercase;
        height: 166upx;
      }
    }
    .jackpot-title{
      margin: 0 0 20Upx;
      // padding-top: 180Upx;
      color: #fff;
      font-size: 40Upx;
      font-weight: 900;
      text-align: center;
      text-transform: uppercase;
    }
    .jackpot{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      list-style: none;
      gap: 10upx;
      .item{
        padding: 6upx 14upx;
        font-size: 34upx;
        font-weight: 700;
        border-radius: 4upx;
        background: linear-gradient(180deg, #00FF5F 29.11%, #009B3A 81.82%);

        uni-text{
          font-size: 36upx;
          font-weight: 900;
          line-height: 40upx;
          color: #0F0D13;
          // background: linear-gradient(180deg,#f9e584 0%,#f1c03e 100%);
          // -webkit-background-clip: text;
          // -webkit-text-fill-color: transparent;
          // background-clip: text;
          // text-fill-color: transparent;
        }
      }
    }
  
  }
  .games-wrap{
    background: linear-gradient(180deg, rgba(1, 156, 59, 0.00) 0%, #003313 100%);
    padding: 12upx;
    .btn-sanhu{
      width: 295upx;
      height: 60upx;
      position: relative;
      display: inline-block;
      margin: 20upx auto;
      animation: zoomInOut 2s ease-in-out infinite;
      .img{
        width: 100%;
        height: 100%;
      }
      uni-text{
        position: absolute;
        top: 55%;
        left: 50%;
        color: #fff;
        font-size: 24upx;
        font-weight: 800;
        text-transform: uppercase;
        white-space: nowrap;
        transform: translate(-40%,-50%);
      }
    }
  }
  .games{
    display: flex;
    align-items: center;
    justify-content: space-between;

    .games-items{
      padding-top: 40upx;
      background: url('@/static/image/indexImg/game-icon.png') no-repeat center/cover;
      position: relative;
      border-radius: 24upx;

      .title{
        z-index: 1;
        position: absolute;
        top: 0;
        right: 0;
        padding: 4upx 20upx 2upx 50upx;
        color: #a4a4a4;
        font-size: 11px;
        font-weight: 800;
        line-height: 18px;
        background: linear-gradient(270deg,#000000 46.06%,rgba(23,23,0,0) 96.15%);
        border-top-right-radius: 12px;
        text-transform: uppercase;
      }
      .content{
        position: relative;
        display: flex;
        border-radius: 24upx;
        .img1{
          width: 110upx;
        }
        .img2{
          width: 100upx;
        }
      }
      .blance{
        padding: 8upx 0;
        color: #fff;
        font-size: 10px;
        font-weight: 600;
        text-align: center;
        text-transform: uppercase;
        line-height: 12px;
        padding-right: 30upx;
        background: url('@/static/image/indexImg/icon_coin.png') no-repeat right/24upx #414141;
        border-bottom-left-radius: 24upx;
        border-bottom-right-radius: 24upx;
        .num{
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg,#f9e584 0%,#f1c03e 100%);
          background-clip: text;
          -webkit-background-clip: text;
          text-fill-color: transparent;
          -webkit-text-fill-color: transparent;
          gap: 2px;
        }
      }
    }
  }
  @keyframes zoomInOut {
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
  </style>
  