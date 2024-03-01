<!-- 首页 -->
<template>
  <view class="content" :class="{ 'theme-container': skinId === 'sovip' }">
    <betc88Index v-if="skinId === 'betc88'" />
    <wynnIndex v-if="skinId === 'wynn'" />
    <dola789 v-if="skinId === 'dola789'" />
    <kubetIndex v-if="['kubet', 'choibet', 'phattai68'].includes(skinId)" />
    <sovip v-if="skinId === 'sovip'" ref="pageIndex"></sovip>
    <bgga v-if="skinId === 'bgga'" />
    <bet88 v-if="['xiaocao', 'g9bet'].includes(skinId)" />
    <jun88 v-if="skinId === 'jun88'" />
    <xoc88 v-if="skinId === 'xoc88'" />
    <myTabBar :current="0" ref="menuBar" />
    <!-- 红包和大转盘活动合并后的入口，需要时解开注释 -->
    <!-- <mergeNewRed v-if="skinId === 'betc88'" /> -->
    <!-- 水球入口 -->
    <betSbw v-if="skinId === 'betc88'" />
  </view>
</template>

<script>
import betc88Index from "./betc88/index.vue";
import dola789 from "./dola789/index.vue";
import wynnIndex from "./wynn/index.vue";
import kubetIndex from "./kubet/index.vue";
import bgga from "./bgga/index.vue";
import sovip from "./sovip/index.vue";
import jun88 from "./jun88/index.vue";
import myTabBar from "@/components/myTabBar/index.vue";
import config from "@/utils/config";
import betSbw from "./components/sbw/sbw.vue";
import bet88 from "./bet88/index.vue";
import xoc88 from "./xoc88/index.vue";
// import mergeNewRed from './components/newRed/index.vue';
export default {
  data() {
    return {
      skinId: config.projectImgUrl,
    };
  },
  components: {
    betc88Index,
    kubetIndex,
    wynnIndex,
    bgga,
    sovip,
    jun88,
    bet88,
    xoc88,
    myTabBar,
    betSbw,
    dola789
  },
  onReachBottom() {
    this.$refs.pageIndex && this.$refs.pageIndex.getGameList();
  },
  methods: {},
};
</script>

<style>
.theme-container {
  background: #0f0f0f;
  height: 100%;
}
</style>
