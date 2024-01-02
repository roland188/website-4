<template>
 <view>
   <theme1 :option="option" v-if="!$config.isRxpjProject" > </theme1>
   <theme2 :option="option"  v-else > </theme2>
 </view>
</template>

<script>
import theme1 from "./customerServiceTheme/theme1.vue";
import theme2 from "./customerServiceTheme/theme2.vue";

export default {
  components: {
    theme1,
    theme2
  },
  data () {
    return {
      option: {}
    }
  },
  onLoad(option) {
    this.option = option
  },
  mounted() {
  }
};
</script>

