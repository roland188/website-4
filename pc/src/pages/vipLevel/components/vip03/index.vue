<template>
  <div class="tabs-content" v-html="descriptionList.vipFaqContent"></div>
</template>
<script>
export default {
  name:'vip03',
  props:['descriptionList'],
}
</script>
<style lang="scss" scoped>
.other {
  box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.06);
}
::v-deep img {
  max-width: max-content;
  height: auto;
}
</style>
