<template>
  <div class="privateDialog">
    <el-dialog :visible.sync="dialogVisible" :width="dialogStyle.dialogWidth" :show-close="false" :before-close="handleClose" :modal-append-to-body="false">
      <div class="dialog-header">

        <!-- 头部icon下面的title文字 -->
        <slot name="title"></slot>
        <img loading="lazy" class="dialogClose-header-img cursorPoint"  @click="dialogClose" v-lazy="require('../../assets/image/xfImg/login-close.png')"/>
      </div>
      <div class="dialog-content">
        <div class="dialog-content-top">
          <!-- 主体内容 -->
          <slot></slot>
        </div>
        <!-- 分页开始 -->
        <div class="dialog-paging borderTop" v-if="dialogStyle.paging">
          <slot name="combined"></slot>
          <el-pagination layout="pager" :total="dialogStyle.total" @current-change="currentChange" :pageSize="10" :current-page.sync="dialogStyle.currentPage"> </el-pagination>
        </div>
        <!-- 分页结束 -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DaiLog',
  props: {
    //接收窗口样式数组
    // dialogStyle.dialogWidth 窗口宽度
    // dialogStyle.iconWidth 头部icon宽度
    // dialogStyle.iconHieght 头部icon高度
    // dialogStyle.iconImg 图片路径
    dialogStyle: {
      type: Object,
      default: ''
    },
    paging: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    //点击关闭按钮关闭
    dialogClose() {
      this.dialogVisible = false;
      //取消mypage的点击高亮效果
      this.$store.commit('cancelActive', true);
      this.$store.commit('rebate',false)
      this.$store.commit('mosaicGoldShow',false)
    },
    // 点击遮罩层关闭
    handleClose() {
      this.dialogVisible = false;
      this.$store.commit('cancelActive', true);
      this.$store.commit('rebate',false)
      this.$store.commit('mosaicGoldShow',false)
    },
    // 弹出事件
    popUp(isTrue) {
      this.dialogVisible = isTrue;
    },
    currentChange(val) {
      this.$emit('getListData', val);
    }
  }
}
</script>

<style lang="less">
.privateDialog {
  .el-dialog__wrapper {
    overflow: hidden;
  }
  .el-form-item__content::before {
    display: none;
    content: '';
  }
  .el-dialog {
    .el-input__inner {
      font-size: 0.16rem;
    }
    input::-webkit-input-placeholder {
      font-size: 0.14rem;
    }
    input::-moz-input-placeholder {
      color: #bababa;
      font-size: 0.14rem;
    }
    input:-ms-input-placeholder {
      font-size: 0.14rem;
    }
    .el-pager li {
      font-size: 0.13rem;
    }
  }
  .dialog-header {
    // background-color: #2996e6;
    // height: 1.59rem;
    // border: none;
    // border-radius: 0.1rem 0.1rem 0 0;
    // position: relative;
    // background: #2996e6;
    padding: 0.16rem;
    // border-top-left-radius: 0.1rem;
    // border-top-right-radius: 0.1rem;
    h1 {
      color: var(--themeDark);
      font-weight: normal;
      font-size: 0.24rem;
      margin-top: 0.16rem;
    }
  }
  .dialog-icon {
    display: inline-block;
    margin-top: 0.38rem;
    // background-size: cover !important;
  }
  .dialog-header-close {
    background: url('../../assets/image/xfImg/close.png') no-repeat;
    background-size: cover;
    width: 0.47rem;
    height: 0.47rem;
    position: absolute;
    top: 0.15rem;
    right: 0.15rem;
  }
  .el-dialog__body {
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .el-dialog__header {
    padding: 0;
  }
  .dialog-content {
    // height: 5.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 0.2rem 0.45rem 0.4rem;
  }
  .dialog-paging {
    display: flex;
    justify-content: flex-end;
    el-tooltippadding: 0.09rem 0 0rem 0;
    border-top: 1px solid #a7a7a7;
    align-items: center;
  }
  .el-pager li.active {
    color:  #896835;
    cursor: default;
  }

  // 公共样式颜色等修改
  .el-form-item__label,
  .line,
  .el-table tr {
    color: #000;
  }
  .el-tooltip {
    // color: var(--inputBorder);
  }
  input::-webkit-input-placeholder {
    /* 修改字体颜色 */
    color:  #896835;
  }
}
</style>
