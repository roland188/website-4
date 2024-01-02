<template>
  <div class="tabs-content" v-html="descriptionList.vipRuleContent"></div>
</template>
<script>
export default {
  name:'vip04',
  props:['descriptionList'],
  data(){
    return {}
  },
}
</script>
<style>
.text-line{
  text-indent: 32px;
    font-size: 14px;
    color: #666666;
    margin-bottom: 5px;
}
</style>


