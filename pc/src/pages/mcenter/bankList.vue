<template>
    <div class="bankpage">
        <ul class="ul-back-card" v-if="bankListReqSuccess">
            <li
                class="ui-li-item"
                v-for="(item, index) in bankList"
                :key="index"
            >
                <div class="card-bank-img">
                    <img loading="lazy" v-if="item.type == 2" v-lazy="require('../../assets/image/dze/wallet.png')" class="card-bank-img-icon" alt="">
                    <el-image v-else
                        :src="$common.getImgUrl(item.imgUrl)"
                        class="card-bank-img-icon"
                    >
                        <div slot="error" class="image-slot"></div>
                    </el-image>
                </div>
                <div class="card-bank-text">
                    <p v-if="item.type === 0" class="bank-name">
                        {{ item.name }}
                    </p>
                    <p v-if="item.type === 1" class="bank-name">
                        {{ `${item.name}(${item.branch})` }}
                    </p>
                     <p v-if="item.type === 2" class="bank-name">
                        {{ $t('三方钱包') }}({{ item.name }})
                    </p>
                    <p class="bank-font" v-if="(item.type === 0)">{{ item.number | banknumber}}</p>
                    <p class="bank-font" v-else>{{ item.number | usdtNumber}}</p>
                </div>
                <p class="remove-but" @click="removeBack(item)">
                    <i class="el-icon-delete"></i>
                </p>
            </li>
        </ul>

        <div class="add-bank-div" v-if="!bankListReqSuccess">
            <img loading="lazy" v-lazy="require('../../assets/image/dze/imgNone.png')" />
            <p> {{ $t(' 这里空空的，一张银行卡都没有呢') }}...

                <br />{{ $t('要不试试') }}
                <span class="text-add themeTextColor">{{ $t('添加收款方式') }}</span
                >？
            </p>
        </div>
        <br /><br /><br />
        <el-row type="flex" justify="center">
            <el-col :span="12" v-if="bankCardCount > bankCardList.length">
                <div class="grid-content bg-purple-light">
                    <el-button
                        type="primary"
                        class="submit-but themeBtn btnBuy"
                        round
                        @click="openAddBankCard(0)"
                        >{{ $t('添加银行卡') }}</el-button
                    >
                </div>
            </el-col>
            <el-col :span="12" v-if="bankUsdtCount > usdtList.length">
                <div class="grid-content bg-purple">
                    <el-button
                        type="primary"
                        class="submit-but themeBtn btnBuy"
                        round
                        @click="openAddBankCard(1)"
                        >{{ $t('添加数字货币') }}</el-button
                    >
                </div>
            </el-col >
            <el-col :span="12" v-if="bankOrigoCount > origoList.length">
                <div class="grid-content bg-purple-light">
                    <el-button
                        type="primary"
                        class="submit-but themeBtn btnBuy"
                        round
                        @click="openAddBankCard(2)"
                        >{{ $t('添加三方钱包') }}</el-button
                    >
                </div>
            </el-col>
             
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bankList: [],
            bankCardList:[],
            usdtList: [],
            origoList: [],
            bankListReqSuccess: true,
            backcardId: "",
            bankCardCount:'',
            bankUsdtCount:'',
            bankOrigoCount:'',
            projectImgUrl: window.projectImgUrl 
        };
    },
    filters: {
        banknumber(val) {
            if (val) {
                return val.substr(0, 4) + " **** **** " + val.substr(-4);
            } else {
                return;
            }
        },
        usdtNumber(val){
            if(val){
                return val.substr(0, 3) + " *** *** *** " + val.substr(-3);
            }else{
                return
            }
        }
    },
    created() {
        this.getBankList();
        this.getBindBankNum();
    },
    methods: {
        openAddBankCard(e) {
            if(e == 0){
                this.$router.push("/mcenter/addBank");
            } else {
                this.$router.push({ path: "/mcenter/addCurrey/", query: { type: e} });
            }
            
        },
        getBankList() {
            this.$http.get(this.$api.banklist, null, true).then((res) => {
                if (res.code == 0) {
                    this.bankListReqSuccess = true;
                    this.bankList = res.data;
                    this.bankCardList = res.data.filter(item => { return item.type == 0});
                    this.usdtList = res.data.filter(item => { return item.type == 1});
                    this.origoList = res.data.filter(item => { return item.type == 2});
                    if (this.bankList.length == 0) {
                        this.bankListReqSuccess = false;
                    }
                } else {
                    this.bankListReqSuccess = false;
                }
            });
        },
        removeBack(e) {
            this.backcardId = e.id;
            this.$confirm(this.$t('是否确认删除')+"？", this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: "warning",
            })
                .then(() => {
                    this.removeBackCard();
                })
                .catch(() => {});
        },
        removeBackCard() {
            this.$http
                .delete(this.$api.removeBack, this.backcardId)
                .then((res) => {
                    if (res.code == 0) {
                        this.getBankList();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
         //获取银行卡绑定数量
        getBindBankNum  () {
            this.$nkhttp.http(this.$api.bindBankNnm, null, "get", (data) => {
                if(data){
                    this.bankCardCount = data.svalue.bank_card_count || 0;//银行卡
                    this.bankUsdtCount = data.svalue.digit_money_count || 0;//数字货币
                    this.bankOrigoCount = data.svalue.origo_money_count || 0;//origo
                }
            });   
        }
    },
};
</script>

<style lang="scss" scoped>
.bankpage {
    padding-top: 20px;
    width: 1180px;
    margin: 0 auto;
    .ul-back-card {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 0.05rem;
        display: flex;
        gap: 0.3rem;
        justify-content: space-between;
        align-items: center;
        .ui-li-item {
            border: 1px solid rgba(204, 214, 228, 1);
            border-radius: 5px;
            flex: 1;
            max-width: 46%;
            text-align: left;
            padding: 0 0.1rem;
            height: 0.7rem;
            display: flex;
            .card-bank-img {
                display: flex;
                align-items: center;
                vertical-align: top;
                .card-bank-img-icon {
                    width: 0.3rem;
                    height: 0.3rem;
                }
            }
            .remove-but {
                color: #f68e8c;
                float: right;
                font-size: 0.2rem;
                margin: 0.1rem;
                display: none;
                cursor: pointer;
            }
            .card-bank-text {
                display: inline-block;
                margin-left: 10px;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .bank-name {
                    color: #333;
                    font-size: 0.14rem;
                    margin-top: 0.11rem;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .bank-font {
                    margin: 0.12rem 0;
                    color: #333;
                    font-size: 0.12rem;
                }
            }
        }
        .ui-li-item:nth-child(2n) {
            margin-right: 0px;
        }
        .ui-li-item-add {
            border: 1px solid rgba(204, 214, 228, 1);
            border-radius: 5px;
            width: calc(50% - 0.2rem);
            text-align: center;
            margin-bottom: 0.16rem;
            height: 0.7rem;
            .add-bank {
                line-height: 0.7rem;
            }
        }
        .ui-li-item:hover {
            border: 1px solid #54b9ff;
            .remove-but {
                display: block;
            }
        }
        .ui-li-item-add:hover {
            background: #54b9ff;
            border-color: #54b9ff;
            color: #fff;
        }
    }
    .add-bank-div {
        margin: 1rem;
        img {
            width: 2rem;
            height: 2.5rem;
        }
        p {
            color: #999999;
            font-size: 0.16rem;
            margin-top: 0.4rem;
        }
        .el-link {
            font-size: 0.16rem;
        }
        .text-add {
            cursor: pointer;
        }
    }
    .submit-but {
        width: 95%;
        color: #fff;
        border: 0px;
        height: 0.46rem;
        font-size: 0.15rem;
        padding: 0.1rem 0.2rem;
        margin-top: 0.1rem;
        font-size: 0.16rem;
        background: #54b9ff;
    }
    .submit-but:hover {
        background: #54b9ff;
    }
    .el-button--primary:focus,
    .el-button--primary:hover {
        background: #54b9ff;
    }
}
</style>