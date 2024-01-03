<template>
  <div class="actRecords">
    <el-dialog
      custom-class="vipDialog"
      :visible.sync="show"
      width="6.9rem"
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
        <div class="alertTitle">{{$t('活动记录')}}</div>
      </div>

      <div class="actRecordsContent" v-if="actRecordsData.length > 0">
        <el-scrollbar style="height:100%">
          <div style="height:100%;overflow:auto;">
            <div class="thead tr">
              <div class="u-flex-all">{{$t('日期')}}</div>
              <div class="u-flex-all">{{$t('完成条件')}}</div>
              <div class="u-flex-all">{{$t('完成情况')}}</div>
            </div>
            <div class="tr" v-for="(item, i) in actRecordsData" :key="i">
              <div class="u-flex-all">{{ item.censusDate | censusDate }}</div>
              <div v-if="item.activityCompletionStr">{{ item.activityCompletionStr }}</div>
              <div class="u-flex-all" v-else>--/--</div>
              <div class="u-flex-all" v-if="item.auditStatus == 0 && item.status == 0">{{$t('进行中')}}</div>
              <div class="u-flex-all" v-if="item.auditStatus == 0 && item.status == 10">{{$t('未完成')}}</div>
              <div class="u-flex-all" v-if="item.auditStatus == 1 && item.status == 0">{{$t('等待审核')}}</div>
              <div class="u-flex-all" v-if="item.auditStatus == 1 && item.status == 8">{{$t('审核未通过')}}</div>
              <div
                class="u-flex-all"
                v-if="
              item.auditStatus == 1 && (item.status == 5 || item.status == 6)
            "
              >{{$t('已完成，奖励已发放')}}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      show: false,
      isShowClose: false,
      actRecordsData: []
    };
  },
  filters: {
    censusDate(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var M = date.getMonth() + 1;
        var D = date.getDate();
        return this.$t('{x}月{y}日',{x:M,y:D});
      } else {
        return "--/--";
      }
    }
  },
  methods: {
    openDialog(list) {
      this.show = true;
      this.actRecordsData = list;

      this.actRecordsData.forEach(item => {
        // 将activityCompletion拼接为字符串
        var activityCompletion = item.activityCompletion;
        //
        if (activityCompletion && JSON.stringify(activityCompletion) != "{}") {
          var activityCompletionStr = "";
          for (const k in activityCompletion) {
            //取两位小数
            var moneyToFixed;
            if (k == "局数") {
              moneyToFixed = activityCompletion[k];
            } else {
              moneyToFixed = this.$common.setNumFixed(activityCompletion[k], 2);
            }

            var str = k + moneyToFixed + "，";
            activityCompletionStr += str;
          }
          activityCompletionStr = activityCompletionStr.substring(
            0,
            activityCompletionStr.lastIndexOf("，")
          );
          this.$set(item, "activityCompletionStr", activityCompletionStr);
        }
      });
    },
    closeDialog() {
      this.show = false;
    },
    getActRecords() {}
    // moneyToFixed(val) {
    //   return Number(val).toFixed(2);
    // }
  }
};
</script>

<style lang="less" scoped>
.actRecords {
  .alertHeader {
    // padding: 0.32rem;
    border-top-left-radius: 0.1rem;
    border-top-right-radius: 0.1rem;
    position: relative;
  }
  .alertTitle {
    color: var(--themeDark);
    font-size: 24px;
    padding-top: 0 !important;
  }
  // .actRecordsHeader {
  //   height: 1.5rem;
  //   box-sizing: border-box;
  //   background-color: #2996e6;
  //   border-radius: 0.2rem 0.2rem 0 0;
  //   flex-direction: column;
  //   justify-content: center;
  //   position: relative;
  //   .actRecordsTitle {
  //     font-size: 0.25rem;
  //     color: rgba(255, 255, 255, 1);
  //     margin-top: 0.15rem;
  //   }
  // }
  .actRecordsContent {
    width: 100%;
    // max-height: 6.62rem;
    height: 100%;
    padding: 0 0.7rem 0.4rem 0.7rem;
    box-sizing: border-box;
    overflow: auto;
    .tr {
      width: 100%;
      display: flex;
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
        height: auto;
        // line-height: 0.38rem;
        padding: 0.1rem 0.22rem;
        box-sizing: border-box;
        font-size: 0.14rem;
        font-weight: 500;
        color: var(--themeLight);
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
      > div {
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: 0.16rem;
        font-weight: bold;
        background: rgba(245, 245, 245, 1);
        color: var(--themeDark);
      }
    }
  }
}
</style>
<style>
.actRecords .el-dialog__header {
  padding: 0 !important;
}

.actRecords .el-dialog .el-dialog__body {
  padding: 0 !important;
  align-items: center !important;
  height: 5.67rem;
}
</style>
