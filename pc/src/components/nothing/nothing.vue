<template>
  <div class="nothing">
    <img loading="lazy" v-lazy="require(`@/assets/image/gameImg/${img}.png`)" alt />
    <div class="nothingText">{{title}}</div>
  </div>
</template>
<script>
export default {
  name: "nothing",
  data() {
    return {};
  },
  props: {
    img: String,
    title: String
  }
};
</script>
<style lang='less' scoped>
.nothing {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  img {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    // width: 25%;
    height: 42.4%;
  }
  .nothingText {
    position: absolute;
    bottom: 32%;
    width: 100%;
    text-align: center;
    font-size: 0.16rem;
    color: var(--themeLight);
  }
}
</style>
