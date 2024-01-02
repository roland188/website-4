<template>
  <div class="marquee" v-if="showText">
    <div class="bbox" id="box_el">
      <div class="content" :class="{ move }" id="con_el">
        {{ text }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['text'],
  data() {
    return {
      move: false
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    showText() {
      return !!this.text
    }
  },
  methods: {
    init() {
      if (!this.text) return
      this.$nextTick(() => {
        const contentEl = document.getElementById('con_el')
        const boxEl = document.getElementById('box_el')
        if (boxEl.clientWidth < contentEl.clientWidth) {
          const speed = 50
          contentEl.style.animationDuration = contentEl.clientWidth / speed + 's'
          this.move = true
        }
      })
    }
  },
  watch: {
    text() {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
$height: 36px;
.marquee {
  position: relative;
  height: $height;
  margin-bottom: 10px;
}
.bbox {
  width: 100%;
  line-height: $height;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff4d7;
  color: #e91919;
  overflow: hidden;
}
.content {
  padding: 0 10px;
  white-space: nowrap;
  width: max-content;
}
.move {
  animation: roll 15s infinite linear;
  &:hover {
    animation-play-state: paused;
  }
}

@keyframes roll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>