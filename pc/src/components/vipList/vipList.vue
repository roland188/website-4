<template>
  <div class="vipList">
    <el-dialog
      custom-class="vipDialog"
      :visible.sync="show"
      width="5.9rem"
      :show-close="isShowClose"
      :before-close="closeDialog"
      :modal-append-to-body="false"
    >
      <!-- 头部 -->
      <div slot="title" class="alertHeader">
        <img loading="lazy"
          class="dialogClose-header-img cursorPoint"
          v-lazy="require('@/assets/image/gameImg/login-close2.png')"
          @click="closeDialog"
        />
        <div class="alertTitle">{{ $t('VIP等级') }}</div>
      </div>
      <div class="vipListContent" v-if="vipList.length > 0">
        <div class="thead tr">
          <div class="u-flex-all">{{ $t('等级') }}</div>
          <div class="u-flex-all">{{ $t('达成条件') }}</div>
          <div class="u-flex-all">{{ $t('提现次数') }}</div>
        </div>
        <el-scrollbar style="height:570px;" ref="multipleTable">
        <div class="tr" v-for="(item, i) in vipList" :key="i">
            <div class="u-flex-all">
              <!-- <img loading="lazy" v-lazy="require('../../assets/image/xfImg/'+item.gradeName+'.png')" alt /> -->{{ item.gradeName }}
            </div>
            <div class="u-flex-all">{{ $t('存款{x},有效投注{y}', { x: item.charge, y: item.bet }) }}</div>
            <div class="u-flex-all">{{ $t('24h/{x}次', { x: item.withdrawLimit }) }}</div>
        </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    'name': 'login',
    data() {
        return {
            'show': false,
            'isShowClose': false,
            'vipList':[]
        };
    },
    'methods': {
        openDialog() {
            this.show = true;
            this.$http.post(this.$api.getVipList, '').then((res) => {
                if (res.code == 0) {
                    this.vipList = res.data || [];
                }
            });

        },
        closeDialog() {
            this.show = false;
        },
        getURl(name) {
            let str = name.toLocaleLowerCase();
            str = require('../../assets/image/qqImg/' + str + '.png');
            return str;
        }
    }
};
</script>

<style lang="less" scoped>
.vipList {
  .alertHeader {
    padding: 0.32rem;
    border-top-left-radius: 0.1rem;
    border-top-right-radius: 0.1rem;
    position: relative;
  }
  .alertTitle {
    color: var(--themeDark);
    font-size: 24px;
    padding-top: 0 !important;
    text-align: center;
  }
  .vipListContent {
    width: 100%;
    padding: 0 0.7rem 0.4rem 0.7rem;
    min-height: 1rem;
    height:6.5rem !important;
    box-sizing: border-box;
    .tr {
      width: 100%;
      height: 0.7rem;
      display: flex;
      img {
        width: 80%;
      }
      div:nth-child(1) {
        flex: 1;
      }
      div:nth-child(2) {
        flex: 2;
      }
      div:nth-child(3) {
        flex: 1;
      }
      div {
        font-size: 0.14rem;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        border-top: 0.01rem solid rgba(204, 214, 228, 1);
        border-left: 0.01rem solid rgba(204, 214, 228, 1);
      }
      div:nth-child(3n) {
        border-right: 0.01rem solid rgba(204, 214, 228, 1);
      }
    }
    .tr:last-child {
      border-bottom: 0.01rem solid rgba(204, 214, 228, 1);
    }
    .thead {
      height: 0.59rem;
      > div {
        height: 100%;
        font-weight: bold;
        background: rgba(245, 245, 245, 1);
      }
    }
  }
  .loginClose {
    position: absolute;
    top: 0.3rem;
    right: 0.29rem;
    width: 0.24rem;
    height: 0.24rem;
    background-image: url("../../assets/image/qqImg/login-close2.png");
    background-size: cover;
    cursor: pointer;
    transition: 1s;
  }
  .loginClose:hover {
    transform: rotate(180deg);
  }
}
</style>
<style>
.vipList .el-dialog__header {
  padding: 0 !important;
}

.vipList .el-dialog__body {
  padding: 0rem 0rem !important;
  overflow: scroll;
}
</style>
