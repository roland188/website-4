<template>
  <div class="tabs-content">
    <div class="table-head">
      <div class="title-th">{{ $t('等级') }}</div>
      <div class="title-th">{{ !['vi'].includes(locale) ? $t('体育返水') : $t('电子')  }}</div>
      <div class="title-th">{{ !['vi'].includes(locale) ? $t('电竞返水') : $t('捕鱼')  }}</div>
      <div class="title-th">{{ !['vi'].includes(locale) ? $t('篮球返水') : $t('棋牌')  }}</div>
      <div class="title-th">{{ !['vi'].includes(locale) ? $t('真人返水') : $t('真人')  }}</div>
      <div class="title-th">{{ !['vi'].includes(locale) ? $t('棋牌返水') : $t('体育')  }}</div>
      <div class="title-th">{{ !['vi'].includes(locale) ? $t('电子返水') : $t('彩票')  }}</div>
      <!-- <div class="title-th">{{$t('返水上限')}}</div> -->
    </div>
    <div class="tabs-main">
      <div class="tr-box" v-for="(item, index) in vipConfigList" :key="item.id"
        :class="[index % 2 == 0 ? 'ou-bg' : 'ji-bg']">
        <div class="name">{{ item.vipName }}</div>
        <div class="inner-info">{{ !['vi'].includes(locale) ? item.rebate1 : item.rebate6 }}</div>
        <div class="inner-info">{{ !['vi'].includes(locale) ? item.rebate2 : item.rebate3 }}</div>
        <div class="inner-info">{{ !['vi'].includes(locale) ? item.rebate3 : item.rebate5 }}</div>
        <div class="inner-info">{{ !['vi'].includes(locale) ? item.rebate4 : item.rebate4 }}</div>
        <div class="inner-info">{{ !['vi'].includes(locale) ? item.rebate5 : item.rebate1 }}</div>
        <div class="inner-info">{{ !['vi'].includes(locale) ? item.rebate6 : item.rebate2 }}</div>
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
      projectImgUrl: window.projectImgUrl,
      locale: window.locale,
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
