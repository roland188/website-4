<template>
  <div class="log-out">
    <el-dialog :visible.sync="dialogVisible" width="4.26rem" :before-close="handleClose" :show-close="false" style="border-radius: 0.1rem;">
      <span class="title">{{ $t('领取返利') }}</span>
      <img loading="lazy" class="dialogClose-header-img cursorPoint"  @click="handleClose" v-lazy="require('../../assets/image/xfImg/login-close.png')"/>
      <slot name="contentText"></slot>
      <span class="footer-button">
        <el-button @click="cancel()" class="button-left">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="determine()" class="button-right">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      val: '',
      type: ''
    }
  },
  methods: {
    cancel(){
      this.dialogVisible = false
    },
    handleClose() {
      this.dialogVisible = false;
    },
    isShow(val, type) {
      this.dialogVisible = true;
    },
    determine() {
      this.$emit('confirmLogout');
      this.dialogVisible = false;
    }
  }
}
</script>
<style lang="less">
.log-out {
  position: absolute;
  .el-dialog {
    height: 2.6rem;
    .el-dialog__body {
      padding: 0;
      height: 100%;
    }
    .el-button {
      padding: 0;
    }
  }

  .title {
    height: 0.55rem;
    box-sizing: border-box;
    border-radius: 0.1rem 0.1rem 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.28rem;
    color: var(--themeDark);
    padding-top: 0.32rem;
  }
  p {
    font-size: 0.35rem;
    color: var(--themeDark);
    margin-top: 0.45rem;
    text-align: center;
    padding: 0 0.6rem;
    // margin: 0.4rem 0.4rem 0.1rem 0.4rem;
  }
  .el-dialog__close {
    font-size: 0.3rem;
  }
  .footer-button {
    display: flex;
    justify-content: space-around;
    position: fixed;
    width: 100%;
    bottom: 0.32rem;
    .el-button {
      width: 1.58rem;
      height: 0.46rem;
      text-align: center;
      font-size: 0.15rem;
      font-weight: 500;
      border-radius: 0.25rem;
      color: #ffffff;
      border-color:#896835;
    }
    .button-left {
      color:#896835;
      border-color:#896835;
      margin-left: 0.4rem;
      &:hover {
        background-color: #ffffff;
        // border: 1px solid var(--themeGameHeader);
      }
    }
    .button-right {
      margin-right: 0.4rem;
      background-color:#896835;
      // &:hover {
      //   border: 1px solid var(--themeGameHeader);
      //   background-color: var(--themeGameHeader);
      // }
    }
  }
  .el-dialog__header {
    padding: 0;
  }
}
</style>