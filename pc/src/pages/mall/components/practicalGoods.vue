<template>
    <div class="practicalGoods">
        <div class="header" style="height: 100px">
            <MyImage loading="lazy" style="height: 100%" :src="require('@/assets/shop/btn4.png')"/>
        </div>
         <div class="ProductList">
             <div class="boxFather" v-for="(item,index) in shoppingMallVOList" :key='index'>
                 <div class="pic">
                     <MyImage loading="lazy" :src="$config.getImgUrl(item.imgUrl)"/>
                 </div>
                 <h1>{{item.name}}</h1>
                 <p class="price">{{toThousands(item.amount)}}{{clientMalls.currency}}</p>
                  <p class="changeBtn" @click="opentip(item)">{{$t('立即兑换')}}</p>
            </div>
             <div class="boxFather lastboxFather" >
                 <div class="">
                    <p>{{$t('更多惊喜')}}</p>
                    <p>{{$t('敬请期待')}}</p>
                 </div>
            </div>
        </div>
         <!-- 兑换商品弹窗 -->
         <changeModal ref="changeModal"/>
          <!-- 提示弹窗 -->
         <el-dialog
             class="tipModal" center
             :title="$t('温馨提示')"
             top='30vh'
             :visible.sync="visibleTip"
             width="350px">
             <div style="text-align: center;">
                 <MyImage loading="lazy" :src="require('@/assets/shop/X.png')" style="vertical-align: middle;display: inline-block;width: 20px"/>
                 <span class="tipcon">{{$t('用户')}}{{clientMalls.currency}}{{$t('少于礼品所需')}}{{clientMalls.currency}}</span>
             </div>
             <span slot="footer" class="dialog-footer">
                 <el-button class="subBtn" @click="visibleTip = false"> {{$t('确定')}}</el-button>
             </span>
         </el-dialog>
    </div>
 </template>
 <script>
 import changeModal from './changeModal'
 export default {
     components:{
         changeModal
     },
     data() {
         return{
             shoppingMallVOList:[],
             visibleTip:false,
             limitCount:0
         }
     },
     computed: {
         // Product() {
         //     return this.$t('Product')
         // },
         clientMalls(){
              return this.$store.state.clientMall
         }
     },
     methods:{
         //余额三位加逗号
         toThousands(num) {
             return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
         },
         // 打开兑换弹窗
         opentip(val){
             if(val.amount*1 > this.$store.state.userRmb){   //判断用户腾博是否大于兑换商品所需腾博
                 this.visibleTip = true;  
                 return;
             }
             this.$refs.changeModal.changevisible = true;
             this.$refs.changeModal.canClose = true
             this.$refs.changeModal.changeItem = val;
             this.$refs.changeModal.limitCount = this.limitCount;
             // this.$refs.changeModal.isShowBox = false;   //控制不显示左侧盒子
         }
     }
 }
 </script>
 <style lang='scss'>
  .el-popover{
         position: absolute;
         -webkit-box-sizing: border-box;
         box-sizing: border-box;
         padding: 10px 15px 10px 25px;
         left: 0;
         background-color: #fff4d7;
         border: 1px solid #f85a3f;
         border-radius: 16px;
         color: #f85a3f;
         margin-bottom: 0;
     }
 .practicalGoods {
     .el-dialog__wrapper{
         .el-form-item{
             margin-bottom: 45px;
         }
         .el-form-item:last-child{
             margin-bottom: 10px!important;
         }
         .el-dialog{
             border-radius: 12px;
             box-sizing: border-box;
         }
         .el-dialog__body{
             padding:10px 30px 0;
         }
         .el-dialog__header{
             padding: 20px;
         }
         .el-dialog__headerbtn{
             // font-size: 30px;
             // top: 10px;
             .el-dialog__close{
                 color: #c1c1c1;
                 transition: 1s;
             }
             .el-dialog__close:hover {
                 transform: rotate(180deg);
             }
         }
         .el-dialog__footer{
             padding: 10px 30px 20px;
         }
     }
     .el-input-number--small{
         width: 100px;
     }
     .el-button--default:hover{
         background-color: transparent;
         color: #000;
         border: none;
         border: 1px solid #DCDFE6;
     }
     .el-button--primary,.el-button--primary:hover{
         background-color: #ff3a2b;
         border: none;
     }
     .checkbox .el-checkbox__label,.checkbox .el-checkbox__input.is-checked+.el-checkbox__label{
          color: rgb(248, 90, 63);
     }
     .checkbox .el-checkbox__inner{
         border-color: #9b9b9b;
     }
     .el-checkbox{
         margin-right: 0!important;
     }
     .checkbox .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
         background-color: #0075ff;
         border-color: #0075ff;
     }
     .selectAdderss .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
         background-color: #0075ff;
         border-color: #0075ff;
     }
     .selectAdderss{
         // left: 20px;
     }
     .tipModal.el-dialog__wrapper{
         .el-dialog{
             .el-dialog__header{
                 border: none !important;
             }
             .el-dialog__body{
                 padding:10px 30px 0!important;
             }
             .el-dialog__footer{
                 padding: 10px 30px 20px !important;
             }
         }
     }
 }
 </style>
 <style lang='scss' scoped>
    .notice_list{
         ol{
             padding: 0;
             li:last-child{
                 margin-bottom: 0;
             }
         }
     }
  .practicalGoods{
     width: 1200px;
     margin:  0 auto;
     .tipcon{
             margin-left: 15px;
             display: inline-block;
             height: 68px;
             line-height: 68px;
         }
     .subBtn {
         background: linear-gradient(#FCD78D, #CCA456);
         color:#fff;
         height:44px;
         width: 200px!important;
     }
     .header{
         padding: 30px 0;
         display: flex;
         justify-content: center;
     }
     .ProductList{
         display: flex;
         justify-content: flex-start;
         flex-wrap: wrap;
         .boxFather{
             width: 285px;
              height: 400px;
             margin-right: 20px;
             margin-bottom: 20px;
              background-color: rgba(255, 255, 255, 0.60);
             border-radius: 12px;
             cursor: pointer;
             -webkit-transition: all .5s;
             transition: all .5s;
             box-sizing: border-box;
              padding: 33px 39px 20px 40px;
             position: relative;
             .pic{
                 height: 194px;
                 width: 100%;
                 display: flex;
                 justify-content: center;
                 align-items: center;
                 img{
                      width: 206px;
                      height: 206px;
                 }
             }
             h1{
                 line-height: 27px;
                  font-size: 20px;
                 margin-top: 0;
                 color: #000;
                 text-align: center;
                 font-weight: 600;
                 margin-bottom: 3px;
                  margin-top: 25px;
                 overflow: hidden;
                 white-space: nowrap;
                 text-overflow: ellipsis;
             }
              .changeBtn {
                  display: flex;
                  padding: 8px 32px;
                  justify-content: center;
                  align-items: center;
                  color: #fff;
                  gap: 10px;
                  margin-top: 24px;
                  border-radius: 40px;
                  background: linear-gradient(#FCD78D, #CCA456);
              }
             .price{
                  font-size: 16px;
                 color: #db511a;
                 line-height: 19px;
                 text-align: center;
                  font-weight: 500;
                 margin: 0;
             }
         }
         .boxFather:hover{
              background-color: rgba(255, 255, 255, 0.219);
         }
         .boxFather:nth-child(4n){
             margin-right: 0px;
         }
     }
     .openModal{
         .tipcon{
             margin-left: 15px;
             display: inline-block;
             height: 68px;
             line-height: 68px;
         }
     }
     .lastboxFather{
         display: flex;
         justify-content: center;
         align-items: center;
         p{
             margin: 0;
             margin-bottom: 3px;
             color: #616886;
             font-size: 22px;
         }
     }
     ::v-deep .el-dialog__title {
             font-size: 24px;
         }
 }
 
 </style>