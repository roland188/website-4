<template>
  <div class="tabs-content">
    <div class="table-head">
      <div class="title-th">{{$t('等级')}}</div>
      <!-- <div class="title-th">累计存款</div> -->
      <div class="title-th">{{ !['vi'].includes(locale) ?  $t('升级所需有效流水') : $t('累积存款')}}</div>
      <!-- <div class="title-th">保级有效流水</div> -->
      <div class="title-th">{{ !['vi'].includes(locale) ? $t('晋级礼金') : $t('升级奖励')}}</div>
      <div class="title-th">{{$t('生日礼金')}}</div>
      <!-- <div class="title-th">VIP每月红包</div>
      <div class="title-th">豪礼赠送</div> -->
    </div>
    <div class="tabs-main">
      <template>
        <div
          class="tr-box"
          v-for="(level, index) in vipLevelList"
          :class="[index % 2 == 0 ? 'ou-bg' : 'ji-bg']"
          :key="level.id"
        >
          <div class="name">{{ $t(level.vipName) }}</div>
          <!-- <div class="inner-info">
            {{ tranNumber(level.upgradeRecharge, 2) }}
          </div> -->
          <div class="inner-info">{{ tranNumberComma(level.upgradeRecharge) }}</div>
          <!-- <div class="inner-info">{{ tranNumber(level.insuranceBet, 2) }}</div> -->
          <div class="inner-info">{{ level.levelGift }}</div>
          <div class="inner-info">{{ level.birthGift }}</div>
          <!-- <div class="inner-info">{{ level.monthGit }}</div>
          <div class="inner-info">{{ level.gitDesc }}</div> -->
        </div>
      </template>
    </div>
  </div>
</template>

    <script>
export default {
  components: {},
  data() {
    return {
      vipLevelList: [],
      projectImgUrl: window.projectImgUrl,
      locale: window.locale,
    };
  },
  mounted() {
    this.getUserVIPlist();
  },
  methods: {
    tranNumber(num, point) {
      // 将数字转换为字符串,然后通过split方法用.分隔,取到第0个
      let numStr = num.toString().split(".")[0];
      if (numStr.length < 5) {
        // 判断数字有多长,如果小于6,,表示10万以内的数字,让其直接显示
        return numStr;
      } else if (numStr.length >= 5 && numStr.length <= 8) {
        // 如果数字大于5位,小于8位,让其数字后面加单位万
        let decimal = numStr.substring(
          numStr.length - 4,
          numStr.length - 4 + point
        );
        // 由千位,百位组成的一个数字
        return parseFloat(parseInt(num / 10000) + "." + decimal) + "万";
      } else if (numStr.length > 8) {
        // 如果数字大于8位,让其数字后面加单位亿
        let decimal = numStr.substring(
          numStr.length - 8,
          numStr.length - 8 + point
        );
        return parseFloat(parseInt(num / 100000000) + "." + decimal) + "亿";
      }
    },
    tranNumberComma(num) {
      let numStr = num + ''
      return numStr.replace(/\d+/, function(n) {
        return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      })
    },
    async getUserVIPlist() {
      let res = await this.$http.get(this.$api.getUserVIPlist);
      if (res.code == 0) {
        this.vipLevelList = res.data.mnvlrList;
      }
    },
  },
};
</script>

    <style  lang="scss">
.tabs-main {
  min-height: 800px;
}
</style>
