<template>
    <div class="prizePool">
        <swiper :options="swiperOptionLeft">
            <swiper-slide class="item">
                <img src="../../assets/image/qqImg/jackCD.png" alt="">
                <div class="jackpotNum">
                    <span class="ng-scope" 
                        :class="item >= 0 ? 'jackpotN' + item : i == 9 ? 'jackpotP' : 'jackpotD'"
                        v-for="(item,i) in numList1" :key="i"></span>
                </div>
            </swiper-slide>
            <swiper-slide class="item">
                <img src="../../assets/image/qqImg/jackBac.png" alt="">
                <div class="jackpotNum jackpotBAC">
                    <span class="ng-scope" 
                        :class="item >= 0 ? 'jackpotN' + item : i == 9 ? 'jackpotP' : 'jackpotD'"
                        v-for="(item,i) in numList2" :key="i"></span>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
export default {
    data() {
        return {
            swiperOptionLeft: {//swiper3
                autoplay: 1000,
                speed: 1000,
                direction: 'vertical',
                slidesPerView: 1,
                loop:true,
                autoplay: {
                    delay: 3000, //等4秒下一个
                    disableOnInteraction: false // 用户操作后继续自动轮播
                },
            },
            jackList1:[4,1,8,5,7,1,1,6],
            jackList2:[2,6,4,4,7,4,1,9],
            timer0: null,
            timer: null,
            numList1: [],
            numList2: [],
        }
    },
    mounted() {
        this.addNum1()
        this.addNum2()
        this.timer0 = setInterval(this.addNum1, 2000)
        this.timer0 = setInterval(this.addNum2, 2000)
    },
    computed: {
    },
    methods: {
      // 数字累加
      addNum1() {
        let numArr = Number(this.jackList1.join(""));
        let addNum = Math.ceil(Math.random()*10+1)
        numArr = numArr + addNum
        let numList = numArr.toString().split("")
        this.jackList1 = numList
        this.numList1 = [...this.jackList1]
        this.numList1 = this.transform(this.numList1)
      },
      // 数字累加
      addNum2() {
        let numArr = Number(this.jackList2.join(""));
        let addNum = Math.ceil(Math.random()*10+1)
        numArr = numArr + addNum
        let numList = numArr.toString().split("")
        this.jackList2 = numList
        this.numList2 = [...this.jackList2]
        this.numList2 = this.transform(this.numList2)
      },
      // 正则加逗号
      transform(numList) {
            numList.splice(1,0,'.')
            numList.splice(5,0,'.')
            numList.splice(9,0,',')
        return numList
      }
    },
    
    beforeDestroy() {
      this.timer0 = null
      this.timer = null
      clearInterval(this.timer0)
      clearInterval(this.timer)
    },

}
</script>
<style lang="scss" scoped>
.prizePool{
  min-width:500px;
  height: 100%;
  display: flex;
  align-items: center;
  .swiper-container{
    width: 100%;
    height: 100%;
    padding: 0 20px;
    .item{
      position: relative;
      display: flex;
      align-items: center;
      padding-left: 10px;
      &::after{
        content: '';
        transform: skew(20deg);
        -webkit-transform: skew(20deg);
        position: absolute;
        z-index: -1;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(204,51,51,1);
        background: -moz-linear-gradient(left, rgba(204,51,51,1) 0%, rgba(153,15,15,1) 75%, rgba(125,185,232,0) 100%);
        background: -webkit-linear-gradient(left, rgba(204,51,51,1) 0%,rgba(153,15,15,1) 75%,rgba(125,185,232,0) 100%);
        background: linear-gradient(to right, rgba(204,51,51,1) 0%,rgba(153,15,15,1) 75%,rgba(125,185,232,0) 100%);
      }
    }
    .item:nth-child(odd){
      &::after{
        background: #052d66;
        background: -moz-linear-gradient(left, #052d66 0%, #0f4999 50%, #3373cc 100%);
        background: -webkit-linear-gradient(left, #052d66 0%,#0f4999 50%,#3373cc 100%);
        background: linear-gradient(to right, #052d66 0%,#0f4999 50%,#3373cc 100%);
      }
    }
    .jackpotNum{
        height: 32px;
        width: 236px;
        display: flex;
        justify-content: flex-end;
        margin-top: 3px;
        
        [class*="jackpotN"] {
            width: 24px;
        }
        .ng-scope{
            background-image: url('../../assets/image/qqImg/jackNumCD.png');
            background-repeat: no-repeat;
            background-position-x: center;
            background-size: 24px auto;
        }
        @for $i from 0 to 10{
            .jackpotN#{$i}{
                background-position-y: - $i * 32px;
            }
        }
        .jackpotP,.jackpotD {
            width: 14px;
            margin-left: -3px;
            margin-right: -1px;
        }
        .jackpotP {
            background-position-y: -320px;
        }
        .jackpotD {
            background-position-y: -352px;
        }
        .jackpotH {
            background-position-y: bottom;
        }
    }
    
    .jackpotBAC span {
        background-image: url('../../assets/image/qqImg/jackNumBAC.png');
        background-repeat: no-repeat;
        background-position-x: center;
        background-size: 24px auto;
    }
  }
}
</style>