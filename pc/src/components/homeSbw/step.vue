<template>
  <div class="flex a-center">
    <div
      class="progress-container"
      :class="{ 'border-f': percentage === 100 }"
      id="containerStep"
      ref="progressContainer"
      :style="{ background: inBgColor }"
    >
      <div
        class="progress-content flex j-end j-center"
        id="contentStep"
        ref="progressContent"
        :style="{
          height: strokeWidth + 'px',
          background: `linear-gradient(to right, ${bgColor},${bgColor1})`,
          width: contentWidth,
          transition: `width ${duration / 1000}s ease`,
        }"
        v-if="isAnimate"
      ></div>
      <div
        class="step-text"
        :class="{ 'color-f': percentage === 100 }"
        @click="handleSetp"
      >
        {{ stepText }}
      </div>
    </div>
    <div style="width: 150upx"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name: "AiProgress",
  components: {},
  props: {
    // 进度条的值
    percentage: {
      type: [Number, String],
      required: true,
    },
    stepText: {
      type: String,
      default: "",
    },
    // 是否内联显示数据
    textInside: {
      type: Boolean,
      default: true,
    },
    // 进度条高度
    strokeWidth: {
      type: [Number, String],
      default: 30,
    },
    // 默认动画时长
    duration: {
      type: [Number, String],
      default: 2000,
    },
    // 是否有动画
    isAnimate: {
      type: Boolean,
      default: true,
    },
    // 背景颜色
    bgColor: {
      type: String,
       default: '#b57c3b',
    },
    bgColor1: {
      type: String,
      default: '#efc67c',
    },
    // 是否不显示数据
    noData: {
      type: Boolean,
      default: false,
    },
    // 是否自定义显示内容
    lineData: {
      type: Boolean,
      default: false,
    },
    // 自定义底色
    inBgColor: {
      type: String,
      default: "#ebeef5",
    },
  },
  data() {
    return {
      width: 0,
      timer: null,
      containerWidth: 0,
      contentWidth: 0,
    };
  },
  methods: {
    handleSetp() {
      this.$emit("handleSetp");
    },
    start() {
      if (this.isAnimate) {
        this.$nextTick(() => {
          let progressContainer = this.$refs.progressContainer;
          let progressContent = this.$refs.progressContent;
          let offsetWidth = progressContainer.offsetWidth
          let width = offsetWidth * ((this.percentage * 1) / 100);
          progressContent.style.width = width.toFixed(2) + "px";
          progressContent.style.transition = `width ${
            this.duration / 1000
          }s ease`;
          let container = document.getElementById('containerStep')
          let box = container.getBoundingClientRect()
          this.contentWidth = box.width  * 1 * ((this.percentage * 1) / 100).toFixed(2) + 'px'

        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.start();
    });
  },
  created() {},
  filters: {},
  computed: {},
  watch: {},
  directives: {},
};
</script>

<style scoped lang="scss">
.content {
  margin-bottom: 10px;
  .c-per {
    font-size: 26px;
  }
}
.progress-container {
  // width: 100%;
  flex: 1;
  border-radius: 100px;
  box-shadow: 1px 6px 6px rgba(0, 0, 0, 0.16);
  border: 1upx solid rgba(204, 204, 204, 1);
  position: relative;
  .progress-content {
    border-radius: 100px;
    width: 0;
  }
  .textInside {
    color: #fff;
    margin-right: 10px;
    position: relative;
  }
  .step-text {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: rgba(51, 51, 51, 1);
    font-size: 14px;
    z-index: 1;
  }
  .color-f {
    color: #ffffff;
  }
}
.text {
  margin-left: 10px;
}
.percentage {
  margin-left: 6px;
  font-size: 12px;
  width: 30px;
}
.flex {
  display: flex;
}
.a-center {
  align-items: center;
}
.j-center {
  justify-content: center;
}
.j-between {
  justify-content: space-between;
}
.content {
  margin-bottom: 10px;
  color: #666;
  font-size: 32px;
}
.border-f {
  border: 1px solid #ffffff;
}
</style>
