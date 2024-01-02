<!-- 腾币商城主页 -->
<template>
    <Back class="shop-home" :img="require('../../assets/shop/bg.png')" noStyle>
        <barrages :barragesList="barragesList"></barrages>
        <lottery @routing="routing"></lottery>
        <!-- 虚拟商品 -->
        <virtualProduct ref="virtualProduct" />
        <!-- 实用商品 -->
        <practicalGoods ref="practicalGoods" />
        <prizeList ref="prizeList" />
        <records ref="records" />
    </Back>
</template>

<script>
import { mapMutations } from "vuex";
import barrages from "./components/barrages.vue";
import virtualProduct from "./components/virtualProduct";
import practicalGoods from "./components/practicalGoods";
import prizeList from "./components/prizeList";
import records from "./components/records.vue";
import Lottery from "./components/Lottery";
export default {
    components: {
        barrages,
        virtualProduct,
        practicalGoods,
        prizeList,
        records,
        Lottery
    },
    data () {
        return {
            problemList: [],
            index: 0,
            shoppingMallList: {}, //商品列表数据
            barragesList: [], //弹幕数据
        }
    },
    created () {
        this.getData();
        this.getMemberPoint();
        this.getshoppingMallList();
    },
    methods: {
        ...mapMutations(["setClientMall", "setUserRmb"]),
        routing(type) {
            switch (type) {
                case 0:
                    //奖品列表
                    this.$refs.prizeList.openDialog();
                    break;
                case 1:
                    // 记录;
                    this.$refs.records.openDialog();
                    break;
                case 2:
                    //规则（新窗口跳转）
                    this.$router.push("/mallrules");
                    break;

                default:
                    break;
            }
        },
        getData() {
            this.$http.get(this.$api.getClientMall).then((res) => {
                if (res.code == 0) {
                    this.setClientMall(res.data);
                }
            });
        },
        getMemberPoint() {
            if (!this.$common.getUser()) return
            this.$http.get(this.$api.getMemberPoint).then((res) => {
                if (res.code == 0) {
                    this.setUserRmb(res.data.balance);
                }
            });
        },
        //获取商品列表
        getshoppingMallList() {
            this.$http.get(this.$api.shoppingMallList).then((res) => {
                console.log('res;', res)
                if (res.code == 0) {
                    this.shoppingMallList = res.data;
                    this.$refs.virtualProduct.virtualMallVOList = res.data.virtualMallVOList; //虚拟商品数据
                    this.$refs.practicalGoods.shoppingMallVOList =
                        res.data.shoppingMallVOList; //实用商品数据
                    this.barragesList = res.data.luckyMallVOList;
                    console.log('barrages.vue:', this.barragesList)
                    this.$refs.virtualProduct.limitCount = res.data.limitCount;
                    this.$refs.practicalGoods.limitCount = res.data.limitCount;
                }
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.shop-home {
    background: #ffc88c url("../../assets/shop/bg.png") no-repeat center -105px; 
    background-position: center -105px;
    background-color: #ffc88c;
    overflow: hidden;
    width: 100%;
    flex: 1;
    position: relative;
}
</style>