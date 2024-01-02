<template>
  <div class="tabs-content">
    <div class="table-head">
      <div class="title-th">{{ $t('等级') }}</div>
      <div class="title-th">{{ $t('体育返水') }}</div>
      <div class="title-th">{{ $t('电竞返水') }}</div>
      <div class="title-th">{{ $t('篮球返水') }}</div>
      <div class="title-th">{{ $t('真人返水') }}</div>
      <div class="title-th">{{ $t('棋牌返水') }}</div>
      <div class="title-th">{{ $t('电子返水') }}</div>
      <!-- <div class="title-th">{{$t('返水上限')}}</div> -->
    </div>
    <div class="tabs-main">
      <div class="tr-box" v-for="(item, index) in vipConfigList" :key="item.id"
        :class="[index % 2 == 0 ? 'ou-bg' : 'ji-bg']">
        <div class="name">{{ item.vipName }}</div>
        <div class="inner-info">{{ item.rebate1 }}</div>
        <div class="inner-info">{{ item.rebate2 }}</div>
        <div class="inner-info">{{ item.rebate3 }}</div>
        <div class="inner-info">{{ item.rebate4 }}</div>
        <div class="inner-info">{{ item.rebate5 }}</div>
        <div class="inner-info">{{ item.rebate6 }}</div>
        <!-- <div class="inner-info">{{ item.rebateMax }}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      vipConfigList: [],
    };
  },
  mounted() {
    this.getUserVIPlist();
  },
  methods: {
    async getUserVIPlist() {
      let res = await this.$http.get(this.$api.getUserVIPlist);
      if (res.code == 0) {
        this.vipConfigList = res.data.mnvlrList;
        console.log(this.vipConfigList)
      }
    },
  },
};
</script>

<style  lang="scss"></style>
