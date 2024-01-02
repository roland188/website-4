<!-- 这是活动记录 -->
<template>
  <view style="height: 100%; overflow: hidden">
    <cu-custom
      style="background-color: #ffffff"
      :isBack="true"
      :leftUrl="leftUrl"
      :rightId="rightId"
      @show="show"
    >
      <block slot="backText"></block>
      <block slot="content">{{ $t("其它") }}</block>
      <block slot="right" v-if="!screeingShow">{{ $t('筛选') }}</block>
    </cu-custom>
    <re-Cord ref="changeData" :parameters="parameterData"></re-Cord>
    <view
      class="screening"
      :class="{ screeningShowStyle: screeingShow }"
      :style="{ 'margin-top': top + 'rpx' }"
    >
      <view class="screeingContent">
        <screen-Ing :screeingId="value" @show="show"></screen-Ing>
      </view>
    </view>
  </view>
</template>

<script>
import reCord from "@/components/record/record.vue";
import screenIng from "@/components/screening/screening.vue";
export default {
  components: { reCord, screenIng },
  data() {
    return {
      tabbarId: 0,
      value: "",
      leftUrl: "../report/report",
      rightId: "other",
      parameterData: {},
      screeingShow: "",
      top: 0,
    };
  },
  onLoad(val) {
    if (val.id) {
      this.value = val.id;
    }
    // #ifdef APP-PLUS
    this.top = 70;
    // #endif
  },
  mounted() {
    this.$refs.changeData.change(this.value);
  },
  methods: {
    //头部传过来的值，是否弹出筛选页面
    show(showId, parameter, data) {
      this.screeingShow = showId;
      if (showId) {
        //筛选弹出 让后退按钮变为隐藏，而非路径
        this.leftUrl = "hidden";
      } else {
        if (parameter == "parameter") {
          this.parameterData = data;
          this.$refs.changeData.change(this.value, "", "", data);
        }
        // switch(this.rightId){
        // 	case 'GameScreening':
        this.leftUrl = "../report/report";
        // 	break;
        // }
      }
    },
  },
};
</script>

<style>
page {
  position: relative;
  width: auto;
  height: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  overflow: hidden;
  border-top: 2rpx solid #f0f0f0;
}
.screening {
  display: none;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  top: 90rpx;
  z-index: 999;
}
.screeingContent {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 70%;
  background-color: #fff;
}
.screeningShowStyle {
  display: inline-block;
}
</style>
