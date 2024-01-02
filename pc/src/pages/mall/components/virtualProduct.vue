<template>
    <div class="virtualProduct">
        <div class="header" style="height: 100px" v-if="virtualMallVOList.length>0">
            <MyImage loading="lazy" style="height: 100%" :src="require('@/assets/shop/btn3.png')"/>
        </div>
        <div class="ProductList">
            <div class="boxFather" v-for="(item,index) in virtualMallVOList" :key='index'>
                 <div class="box">
                     <div class="pic">
                          <MyImage loading="lazy" :src="$config.getImgUrl(item.imgUrl)"/>
                     </div>
                     <div class="moneyContent">
                         <p class="name">{{item.name}}</p>
                         <div class="money"><b>{{toThousands(item.amount)}}</b> {{clientMalls.currency}}</div>
                     </div>
                 </div>
                 <div class="changeBtn" @click="openModel(item)">
                     {{$t('立即兑换')}}
                 </div>
            </div>
        </div>
        <!-- 提示弹窗 -->
         <el-dialog
             class="tipModal" center
             :title="$t('温馨提示')"
             top='30vh'
             :visible.sync="visibleTip"
             width="350px">
             <div class="content" style="text-align: center;">
                 <MyImage loading="lazy" :src="require('@/assets/shop/X.png')" style="vertical-align: middle;display: inline-block;width: 20px"/>
                 <span class="tipcon">{{$t('用户')}}{{clientMalls.currency}}{{$t('小于礼品所需')}}{{clientMalls.currency}}</span>
             </div>
             <span slot="footer" class="dialog-footer">
                 <el-button class="subBtn" @click="visibleTip = false"> {{$t('确定')}}</el-button>
             </span>
         </el-dialog>
        <!-- 兑换弹窗 -->
         <el-dialog
             class="openModal"
             :title="changeItem.name"
             top='30vh'
             :visible.sync="visible"
             :modal='false'
             :lock-scroll='false'
             width="450px">
             <div class="modalContent">
                 <div class="picter">
                      <MyImage loading="lazy" :src="$config.getImgUrl(changeItem.imgUrl)" class="img"/>
                 </div>
                 <div class="content">
                     <div class="price">
                         <p class="boxprice"> {{$t('单价：')}}</p>
                         <b class="redPrice">{{toThousands(changeItem.amount)}}</b>
                     </div>
                     <div class="number">
                         <p> {{$t('数量：')}}</p>
                         <el-input-number size="small" :min='1' :max='changeItem.reserveCount' :step="1" :step-strictly='true' v-model="count"></el-input-number><span class="maxClass" @click="setCount">{{$t('最大')}}</span>
                     </div>
                 </div>
             </div>
             <span slot="footer" class="dialog-footer">
                 <span class="allPrece">{{$t('总价：')}}<b class="price">{{toThousands(totalPrice)}}</b></span>
                 <el-button @click="visible = false">{{$t('取 消')}}</el-button>
                 <el-button type="primary" @click="submitModal">{{$t('立即兑换')}}</el-button>
             </span>
         </el-dialog>
    </div>
 </template>
 <script>
 import { mapMutations } from "vuex";
 export default {
     data() {
         return{
             visible:false,
             visibleTip:false,
             count:1,
             virtualMallVOList:[],
             changeItem:{},
             totalPrice:0,
             limitCount:0   //控制加减的数量
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
          ...mapMutations(["setUserRmb"]),
         //点击最大数量
         setCount(){
             if(this.changeItem.reserveCount <= 0){
                 this.$message({ message: this.$t('商品库存不足，无法兑换'),type: "error"});
                 return
             }
             this.count = this.changeItem.reserveCount;
         },
         //余额三位加逗号
         toThousands(num) {
             return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
         },
         //打开弹窗
         openModel(item){
             this.changeItem = item;
             this.totalPrice = this.changeItem.amount*1;
             if(this.totalPrice > this.$store.state.userRmb){   //判断用户腾博是否大于兑换商品所需腾博
                 this.visibleTip = true;  
                 return;
             }
             if(this.limitCount == 0){   //根据后台数据控制加减数量
                 this.count = 1;
             }else{
                 this.count = this.limitCount;
                 this.changeItem.reserveCount = this.limitCount;
             }
             this.visible = true
         },
         //虚拟商品确定兑换
         submitModal(){
             if(this.changeItem.reserveCount <= 0){
                 this.$message({ message: this.$t('商品库存不足，无法兑换'),type: "error"});
                 return
             }
             if(this.totalPrice > this.$store.state.userRmb){   //判断用户腾博是否大于兑换商品所需腾博
                 this.visibleTip = true;  
                 return;
             }
             let params = {
                 "count": this.count,
                 "id": this.changeItem.id,
             }
             this.$http.post(this.$api.exchange,params).then((res) => {
                 if (res.code == 0) {
                     this.$message({ message: this.$t('恭喜您，成功兑换') + this.changeItem.name + this.$t(',彩金已自动添加至您的余额账户'),type: "success"});
                     this.visible = false;
                     this.getMemberPoint();
                 } else {
                     this.$message.error(res.msg)
                 }
             });
         },
         //更新剩余币数
         getMemberPoint() {
             if (!this.$common.getUser()) return
             this.$http.get(this.$api.getMemberPoint).then((res) => {
                 if (res.code == 0) {
                     this.setUserRmb(res.data.balance);
                 }
             });
         },
     },
     watch:{
         count(newData){
             let that = this;
             if(newData){
                 that.totalPrice = newData * 1 * that.changeItem.amount;
             }
         }
     }
 }
 </script>
 <style lang='scss'>
 .virtualProduct {
     .el-dialog__wrapper{
         .el-dialog{
             border-radius: 12px!important;
             width: 400px!important;
             box-sizing: border-box;
             .el-dialog__body{
                 padding: 30px!important;
                 padding-bottom: 0!important;
             }
             .el-dialog__header{
                 border-bottom: 1px solid #e8e8e8;
                 padding: 20px!important;
             }
             .el-dialog__headerbtn{
                 // font-size: 30px;
                 top: 10px;
                 .el-dialog__close{
                     color: #c1c1c1;
                     transition: 1s;
                 }
                 .el-dialog__close:hover {
                     transform: rotate(180deg);
                 }
             }
             .el-dialog__footer{
                 padding: 30px;
             }
         }
   
         .el-input-number--small{
             width: 125px;
         }
         .el-button--default{
             color: #999;
             width: 88px;
             height: 38px;
             box-sizing: border-box;
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
             width: 108px;
             height: 38px;
         }
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
     .virtualProduct{
         width: 1200px;
         margin:  0 auto;
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
                 width: 33%;
                 margin-bottom: 12px;
                 margin-right: 5px;
             }
             .boxFather:nth-child(3n){
                  margin-right: 0;
             }
             .box{
                 height: 168px;
                 background: rgba(255, 255, 255, 0.66);
                 overflow: hidden;
                 display: flex;
                 .pic{
                     width: 120px;
                     float: left;
                     margin-left: 18px;
                     margin-top: 24px;
                     img{
                         width: 120px;
                         height: 120px;
                     }
                 }
                 .moneyContent{
                     padding: 0 16px;
                      flex: 1;
                      overflow: hidden;
                     .name{
                         color: #000;
                         font-size: 20px;
                         margin-top: 44px;
                         margin-bottom: 30px;
                         font-weight: 600;
                          overflow: hidden;
                         white-space: nowrap;
                         text-overflow: ellipsis;
                     }
                     .money{
                         font-size: 15px;
                         color: #000;
                         b{
                             font-size: 28px;
                             color: #db511a;
                         }
                     }
                    
                 }
             }
             .changeBtn{
                background: linear-gradient(#FCD78D, #CCA456);
                 color: #fff;
                 height: 38px;
                 width: 146px;
                 line-height: 38px;
                 border-radius: 19px;
                 margin: 18px auto;
                 cursor: pointer;
                 -webkit-transition: all .5s;
                 transition: all .5s;
                 font-size: 14px;
                 text-align: center;
             }
         }
         .openModal{
             .modalContent{
                 text-align: center;
                 .picter{
                     width: 200px;
                     height: 200px;
                     border: 1px solid #dcdcdc;
                     margin: auto;
                     position: relative;
                     .img{
                         width: 120px;
                         height: 120px;
                         position: absolute;
                         top: 50%;
                         left: 50%;
                         transform: translate(-50% ,-50%);
                     }
                 }
                 .content{
                     background-color: #f6f6f6;
                     height: 81px;
                     box-sizing: border-box;
                     color: #999;
                     text-align: left;
                     margin-top: 10px;
                     padding: 12px 15px;
                     display: flex;
                     justify-content: flex-start;
                     p{
                         margin-bottom: 0;
                     }
                     .price{
                         .boxprice{
                             margin: 0;
                             margin-bottom: 5px;
                         }
                         width: 45%;
                         padding-bottom: 12px;
                         .redPrice{
                             color: #CCA456;
                         }
                         
                     }
                     .number{
                         flex:1;
                         padding-bottom: 12px;
                         p{
                              margin:0;
                         }
                         .maxClass{
                             line-height: 34px;
                             font-size: 14px;
                             color: #008dff;
                             vertical-align: middle;
                             padding: 0 .5em;
                             cursor: pointer;
                         }
                     }
                 }
             }
         }
         .tipcon{
             text-align: center;
             margin-left: 15px;
             display: inline-block;
             height: 68px;
             line-height: 68px;
         }
         .subBtn {
             background: linear-gradient(180deg, #F99541 0%, #EA5F13 100%);
             color:#fff;
             height:44px;
             width: 200px!important;
         }
         .dialog-footer{
             .allPrece{
               float: left;
               font-size: 13px;
               line-height: 38px;
                color: #999;
               .price{
                   color:#CCA456;
               }
             }
         }
     }
     ::v-deep .header img {
             height: 100%;
         }
    ::v-deep .el-dialog__title {
        font-size: 24px;
    }
 
 </style>