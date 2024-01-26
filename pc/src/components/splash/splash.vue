<template>
  <div class="splashBox flex align-items_center justify-content_center" :class="{'noamxpj': projectImgUrl !=='amxpj','amxpj': projectImgUrl ==='amxpj'}">
    <div class="splashContent">
      <div class="splashImgBox">
        <img loading=”lazy” class="splashImg" :src="$common.getTitleImgUrl(projectImgUrl == 'g9bet' ?  'Logo-1' : 'Logo')" alt />
      </div>
      <p class="TextColor">LOADING...</p>
      <div class="splashLoad">
        <div>
          <img loading=”lazy” class="loading" :src="require('../../assets/image/progressbar.png')" alt />
        </div>
        <img loading=”lazy” :style="{left:left + '%',transition: transition + 'ms'}" class="slider" :src="require('../../assets/image/progresspoint.png')" alt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
    'name': 'Splash',
    'props': {
        'msg': String
    },
    data() {
        return {
            'window': window,
            left: 0,
            transition: 5000,
            projectImgUrl:window.projectImgUrl
        };
    },
    mounted () {
      setTimeout(() => {
        this.left = 60
      }, 100)
    },
    methods: {
      // 加载完毕
      over () {
        this.transition = 500
        this.left = 88
      }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

.splashBox {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  background-size: cover;
  z-index: 999999;
  background-color: #fff;
}
.noamxpj{
   background: url('../../assets/image/bg.png') no-repeat;
   background-size: 100% 100%;
}
.amxpj{
   background-color: #0a0a0a;
}
.justify-content_center {
    justify-content: center;
}
.align-items_center {
    align-items: center;
}
.flex {
    display: flex;
}
.splashContent {
  margin: auto;
  width: 766px;
  display: flex;
  align-items: center;
  flex-direction: column;

  p {
    font-size: 28px;
    color: #fc7837;
    letter-spacing: 2px;
  }
  .splashLoad {
    width: 100%;
    margin-top: 30px;
    position: relative;
    .loading {
      width: 100%;
    }
    .slider {
      width: 100px;
      height: 100px;
      position: absolute;
      top: -120%;
    }
  }
}
.splashImgBox {
  position: relative;
  // width: 80%;
}
.splashImg{
  // min-width: 50%;
}
.defaultUserImgDong {
  width: 100% !important;
  position: absolute;
  left: 0px;
  top: 0px;
}
</style>
