<template>
  <div>
    <headers
      ref="headers"
      @trigger="trigger"
      @openReturnWater="openReturnWater"
      @openVip="openVip"
    ></headers>
    <router-view ref="trigger" @switchTab="switchTab"></router-view>

    <ReturnWater
      ref="returnWater"
      @refresh="refresh"
      @reReturnWaterDetail="reReturnWaterDetail"
    ></ReturnWater>
    <VipList ref="vipList"></VipList>
  </div>
</template>

<script>
import ReturnWater from './returnWater/returnWater.vue';
import headers from './header/header';
//vip弹窗
import VipList from '../../components/vipList/vipList';
export default {
    'components': {
        'headers': headers,
        ReturnWater,
        VipList
    },
    data() {
        return {
            'key': 'value'
        };
    },
    'methods': {
        openVip(){
            this.$refs.vipList.openDialog();
        },
        trigger(name) {
            if (this.$router.currentRoute.name === 'correspondence') {
                this.$refs.trigger.query(1, name);
            } else if (this.$router.currentRoute.name === 'returnWater') {
                this.$refs.trigger.returnWater(1);
            }
        },
        openReturnWater() {
            this.$refs.returnWater.openDialog();
        },
        refresh() {
            this.$refs.headers.getReturnWater('refresh');
            this.$refs.headers.getUserBalance();
        },
        switchTab() {
            //切换头部tab
            this.$refs.headers.sureUrl = window.location.pathname;
        },
        reReturnWaterDetail() {
            //在返水详情页面   请求待领取返水详情
            this.$refs.trigger.According(0);
        }
    }
};
</script>

<style lang="scss" scoped></style>
