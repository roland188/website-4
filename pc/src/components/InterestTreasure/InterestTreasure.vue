<template>
    <div class="dialog">
        <el-dialog
            :visible.sync="dialogVisible"
            width="730px"
            :modal-append-to-body="false"
            :append-to-body='true'
            class="dialog"
            :before-close="handleClose">
            <div slot="title">
                <p class="headerTitle">{{$t('利息宝')}}</p>
            </div>
            <div class="diaCentent">
                <div class="header-tab">
                    <div v-for="(item,i ) of tabs" :key="i" class="tabItem" :class="{'linbor':item.id == tabIndex}" @click="onChangeTab(item)">
                        {{item.name}}
                    </div>
                </div>
                <ul class="ulFlex">
                    <li class="card" v-for="(item,i) of listData" :key="i" @click="openDetail(item)">
                        <template v-if="item.status == 4">
                            <div class="bg4">
                                <div>
                                    <div class="card-header">
                                        <img loading="lazy" v-lazy="require('../../assets/image/dze/l1.png')" class="title-img" alt="" srcset="">
                                        <div class="title-name">{{item.name}}</div>
                                        <div class="title-type title-type4">{{$t('进行中')}}</div>
                                        <img loading="lazy" v-lazy="require('../../assets/image/dze/r1.png')" class="title-r" alt="" srcset="">
                                    </div>
                                </div>
                                <div>
                                    <p class="text">
                                        {{$t('年利率')}}：<span class="text-num">{{item.minRate}}%~{{item.maxRate}}%</span>
                                    </p>
                                    <p class="time timetype2">
                                    {{$t('开放区间')}}：{{item.startTime|times}}~{{item.endTime|times}}
                                    </p>
                                </div>
                                <div class="btn-box">
                                    <el-button round class="btn-get btn">{{$t('存入提升收益')}}</el-button>
                                </div>
                            </div>
                        </template>
                        <template v-if="item.status == 3">
                            <div class="bg3">
                                <div>
                                    <div class="card-header">
                                        <img loading="lazy" v-lazy="require('../../assets/image/dze/l2.png')" class="title-img" alt="" srcset="">
                                        <div class="title-name balk">{{item.name}}</div>
                                        <div class="title-type title-type3">{{$t('未开放')}}</div>
                                        <img loading="lazy" v-lazy="require('../../assets/image/dze/r2.png')" class="title-r" alt="" srcset="">
                                    </div>
                                </div>
                                <div>
                                    <p class="text balk">
                                        {{$t('年利率')}}：<span class="text-num">{{item.minRate}}%~{{item.maxRate}}%</span>
                                    </p>
                                    <p class="time timetype">
                                    {{$t('开放区间')}}：{{item.startTime |times}}~{{item.endTime |times}}
                                    </p>
                                </div>
                                <div class="btn-box">
                                    <el-button round class="btn-get3 btn">{{$t('存入提升收益')}}</el-button>
                                </div>
                            </div>
                        </template>
                        <template v-if="item.status == 2">
                            <div class="bg2">
                                <div>
                                    <div class="card-header">
                                        <img loading="lazy" v-lazy="require('../../assets/image/dze/l3.png')" class="title-img" alt="" srcset="">
                                        <div class="title-name balk">{{item.name}}</div>
                                        <div class="title-type title-type2">{{$t('结束申请')}}</div>
                                        <img loading="lazy" v-lazy="require('../../assets/image/dze/r3.png')" class="title-r" alt="" srcset="">
                                    </div>
                                </div>
                                <div>
                                    <p class="text balk">
                                        {{$t('年利率')}}：<span class="text-num">{{item.minRate}}%~{{item.maxRate}}%</span>
                                    </p>
                                    <p class="time timetype">
                                    {{$t('开放区间')}}：{{item.startTime |times}}~{{item.endTime |times}}
                                    </p>
                                </div>
                                <div class="btn-box">
                                    <el-button round class="btn-see btn" @click.stop="onSee">{{$t('查看')}}</el-button>
                                </div>
                            </div>
                        </template>
                        <template v-if="item.status == 1">
                            <div class="bg1">
                                <div>
                                    <div class="card-header">
                                        <img loading="lazy" v-lazy="require('../../assets/image/dze/l4.png')" class="title-img" alt="" srcset="">
                                        <div class="title-name balk">{{item.name}}</div>
                                        <div class="title-type title-type1">{{$t('结束计息')}}</div>
                                        <img loading="lazy" v-lazy="require('../../assets/image/dze/r4.png')" class="title-r" alt="" srcset="">
                                    </div>
                                </div>
                                <div>
                                    <p class="text balk">
                                        {{$t('年利率')}}：<span class="text-num">{{item.minRate}}%~{{item.maxRate}}%</span>
                                    </p>
                                    <p class="time timetype">
                                    {{$t('开放区间')}}：{{item.startTime |times}}~{{item.endTime |times}}
                                    </p>
                                </div>
                                <div class="btn-box btn">
                                    <el-button round class="btn-involved btn" @click.stop="onSee">{{$t('查看')}}</el-button>
                                </div>
                            </div>
                        </template>
                        
                    </li>
                </ul>
                <div v-if="listData.length == 0" class="nullBox">
                    <img loading="lazy" v-lazy="require('../../assets/image/dze/imgNone.png')" class="nullImg" alt="" srcset="">
                    <p class="nullText">{{$t('空空如也')}}</p>
                </div>
                <p class="seeText" @click="openList">{{$t('查看利息宝记录')}}<img loading="lazy" src="../../assets/image/dze/r4.png" class="imgRight" alt="" srcset=""></p>
            </div>
            <span slot="footer" class="dialog-footer">
                 <el-pagination
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    :pager-count="5"
                    :total="total"
                    @current-change="currentChange">
                </el-pagination>
            </span>
        </el-dialog>
        <detail ref="refDetail" ></detail>
    </div>
</template>

<script>
import detail from './detail'
    export default {
        components: {
            detail,
        },
        filters: {
            times: function(value) {
                var date = new Date(value);
                var y = date.getFullYear();  
                var m = date.getMonth() + 1;  
                m = m < 10 ? ('0' + m) : m;  
                var d = date.getDate();  
                d = d < 10 ? ('0' + d) : d;  
                var h = date.getHours();  
                h=h < 10 ? ('0' + h) : h;  
                var minute = date.getMinutes();  
                minute = minute < 10 ? ('0' + minute) : minute;  
                var second=date.getSeconds();  
                second=second < 10 ? ('0' + second) : second;  
                return y + '-' + m + '-' + d+' '+h+':'+minute; 
            }
        },
        data() {
            return {
                dialogVisible: false,
                tabs:[
                    {name:this.$t("全部"),id:-1}, {name:this.$t("进行中"),id:4}, {name:this.$t("未开放"),id:3}, {name:this.$t("已结束"),id:2},
                ],
                tabIndex:-1,
                total:50,//总数
                pageSize:6,
                currentPage:1,
                listData:[],
                itemData:{}
            }
        },
        methods: {
            //查看利息宝记录
            openList(){
                localStorage.setItem('interest',5);
                 const { href } = this.$router.resolve({
                    'name': 'correspondence'
                });
                window.open(href, '_blank');
            },
            open(){
                this.dialogVisible = true;
                this.getList();
            },
            currentChange(e){
                this.currentPage = e;
                this.getList();

            },
            openDetail(item){
                this.itemData = item;
                if(this.itemData.id){
                    this.$refs.refDetail.itemId = this.itemData.id
                    this.$refs.refDetail.open();
                }
                
            },
            onSee(){
                localStorage.setItem('interest',5);
                //新窗口跳转
                const { href } = this.$router.resolve({
                    'name': 'correspondence'
                });
                window.open(href, '_blank');
            },
            getList(){
                let option = {
                    type:this.tabIndex==-1?"":this.tabIndex,
                    pageSize:this.pageSize,//每页记录数
                    currentPage:this.currentPage,//当前页码
                }
                this.$http.post(this.$api.interestList,option,true).then(res => {
                    if (res.code === 0) {
                        this.listData = res.data.content;
                        this.total= res.data.totalRecords;
                    }
                });
            },
            onChangeTab(i){
                this.tabIndex = i.id;
                this.currentPage = 1;
                this.getList();
            },
            handleClose() {
                 this.dialogVisible = false;
            }
        },
    }
</script>

<style lang="scss" >
.dialog{
    .el-dialog__body{
        padding: 30px 70px;
        min-height: 500px;
    }
    .headerTitle{
        text-align: center;
        color: #2D2B4D;
        font-size: 24px;
    }
    .nullBox{
        text-align: center;
        margin: 20px;
        .nullImg{
            width: 35%;
        }
        .nullText{
            font-size: 18px;
            color: #757575;
            opacity: 0.6;
            margin-top: 10px;
        }
    }
    .diaCentent{
        min-height: 300px;
        .header-tab{
            display: flex;
            justify-content: space-around;
        }
        .tabItem{
            color: #2D2B4D;
            font-size: 14px;
            padding-bottom: 10px;
        }
        .linbor{
            color: #E5414A;
            border-bottom: 3px solid #E5414A;
        }
        .ulFlex{
            display: flex;
            flex-wrap: wrap;
            margin-top: 20px;
            justify-content: space-between;
            .card{
                margin-bottom: 12px;
                width: 49%;
                .bg4{
                    background: url('../../assets/image/dze/card1.png');
                    background-size: cover;
                    padding: 10px;
                    border-radius: 10px;
                }
                .bg3{
                    background: url('../../assets/image/dze/card2.png');
                    background-size: cover;
                    padding: 10px;
                    border-radius: 10px;
                }
                .bg2{
                    background: url('../../assets/image/dze/card3.png');
                    background-size: cover;
                    padding: 10px;
                    border-radius: 10px;
                }
                .bg1{
                    background: url('../../assets/image/dze/card4.png');
                    background-size: cover;
                    padding: 10px;
                    border-radius: 10px;
                }
                .card-header{
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.1);
                    height: 35px;;
                    .title-img{
                        width: 15px;
                        height: 15px;
                        margin-right: 5px;
                    }
                    .title-name{
                        color: #FFFFFF;
                        flex-grow: 2;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        width: 150px;;
                    }
                    
                    .title-type{
                       font-size: 12px;
                    }
                    .title-r{
                         width: 20px;
                        height: 20px;
                    }
                     .title-type4{
                        color: #FFFFFF;
                    }
                    .title-type3{
                      color: #11AEFF;
                    }
                     .title-type2{
                      color: #FF631E;
                    }
                     .title-type2{
                      color: #A7A7A7;
                    }
                }
                .time{
                    font-size: 7px;
                }
                .timetype{
                    color: #A7A7A7;
                }
                .timetype2{
                    color: #FFFFFF;
                    opacity: 0.7;
                }
                .text{
                    color: #FFFFFF;
                    margin: 10px 0;
                    font-size: 9px;
                    .text-num{
                        font-size: 12px;
                        font-weight: bold;
                    }
                }
                .balk{
                    color: #1D1717 !important;
                    
                }
                .btn-get{
                    background: #FFF9A4;
                    color: #FF631E;
                   
                }
                .btn-get3{
                      background: #11AEFF;
                    color: #fff;
                }
                .btn{
                     border: none;
                    line-height: 19px;
                    padding: 3px 10px;
                }
                .btn-involved{
                    background: #A7A7A7;
                    color: #ffffff;
                }
                .btn-see{
                     background: #FF631E;
                    color: #ffffff;
                }
                .btn-box{
                    // float: right;
                    // margin-top: 12px;
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 12px;
                }
            }
        }
    }
    .seeText{
        text-align: center;
        color: #2D2B4D;
        font-size: 14px;
        cursor: pointer;
    }
    .imgRight{
        margin-left: -5px;
        vertical-align: middle;
    }
}
</style>