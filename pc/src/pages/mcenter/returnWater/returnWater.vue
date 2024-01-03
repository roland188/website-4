<template>
  <div class="returnWaterLayout">
    <el-dialog
      :visible.sync="show"
      width="4.26rem"
      :show-close="isShowClose"
      :before-close="closeDialog"
      :modal-append-to-body="false"
    >
      <img 
        loading="lazy"
        class="returnWaterClose cursorPoint"
        v-lazy="require('@/assets/image/gameImg/login-close2.png')"
        @click="closeDialog"
      />

      <div class="reWaterTitle themeDark themeDark8">{{$t('返水领取')}}</div>
      <template v-if="notGet">
        <div class="reWaterMoney themeDark themeDark8">
          {{ $common.setNumFixed(waterMoney, 2) }}
        </div>
        <div class="reWaterDes themeDark themeDark8">
          {{$t('流水要求')}}{{ verityCount | waterMoneyToFixed }}{{$t('倍')}}
        </div>
        <div class="bottomBtns">
          <div
            class="reWaterBtn u-flex-all cursorPoint cancelSelf"
            @click="goDetail"
          >
            {{$t('查看详细')}}
          </div>
          <div
            class="reWaterBtn u-flex-all cursorPoint confirmSelf"
            @click="reWaterGet"
          >
            {{$t('立即领取')}}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="reWaterGetSuccess">{{$t('领取成功，请前往中心钱包查看')}}</div>
        <div
          class="reWaterBtn u-flex-all cursorPoint knownBtn"
          @click="closeDialog"
        >
          {{$t('知道了')}}
        </div>
      </template>
    </el-dialog>

    <!-- <Return-Water-Record ref="returnWaterRecord"></Return-Water-Record> -->
  </div>
</template>

<script>
// import ReturnWaterRecord from "../../components/returnWaterRecord/returnWaterRecord";
export default {
  name: "returnWater",
  data() {
    return {
      show: false,
      notGet: true,
      isShowClose: false,
      waterMoney: 0,
      verityCount: 0,
      isClickGetReturn: true, //不能重复点击
    };
  },
  methods: {
    openDialog() {
      this.show = true;
      this.getWaterdata();
    },
    closeDialog() {
      this.show = false;
      //数据初始化
      this.notGet = true;
    },
    //立即领取
    reWaterGet() {
      if (!this.isClickGetReturn) {
        return;
      }
      this.isClickGetReturn = false;
      this.$http
        .get(this.$api.receiveRebate + this.$common.getUser().user_id)
        .then((res) => {
          if (res.code == 0) {
            this.notGet = false;
            //领取成功，更新返水+金额
            this.$emit("refresh");

            this.isClickGetReturn = true;
          } else {
            this.isClickGetReturn = true;
            this.$message.error(res.msg);
          }
        });
    },
    //获取返水信息
    getWaterdata() {
      this.$http
        .get(this.$api.getRebateAmount + this.$common.getUser().user_id)
        .then((res) => {
          if (res.code == 0) {
            this.waterMoney = res.data.rebateAmount;
            this.verityCount = res.data.verityCount;
          } else {
            let msg =
              this.$t(`errorCode.${res.code}`) + `(${res.code})` ||
              this.$t(`请求错误`);
            this.$http.errMsg(msg);
          }
        });
    },
    //查看详细
    goDetail() {
      //返水详情
      this.closeDialog();
      if (window.location.pathname == "/mcenter/returnWaterDetail") {
        //在当前页面
        this.$emit("reReturnWaterDetail");
      } else {
        //不在
        this.$router.push({
          name: "returnWaterDetail",
          params: {
            type: "0",
          },
        });
      }
    },
  },
  filters: {
    waterMoneyToFixed(val) {
      if (val) {
        return Number(val).toFixed(2);
      } else {
        return "0.00";
      }
    },
  },
  components: {
    // ReturnWaterRecord
  },
};
</script>
<style lang="less">
.returnWaterLayout {
  position: relative;
  //   el-dialog
  /deep/ .el-dialog {
    text-align: center;
    .el-dialog__header {
      padding: 0 !important;
    }
    .el-dialog__body {
      // height: 2.6rem;
      padding: 0.32rem 0.4rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .returnWaterClose {
    position: absolute;
    top: 0.14rem;
    right: 0.14rem;
    width: 0.17rem;
    height: 0.17rem;
    transition: 1s;
    cursor: pointer;
  }
  .returnWaterClose:hover {
    transform: rotate(180deg);
  }
  .reWaterTitle {
    width: 100%;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.28rem;
  }
  .reWaterMoney {
    height: 0.59rem;
    line-height: 0.59rem;
    font-size: 0.42rem;
    margin: 0.08rem 0 0.04rem 0;
  }
  .reWaterDes {
    font-size: 0.16rem;
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    margin-bottom: 0.2rem;
  }
  .reWaterGetSuccess {
    margin: 0.44rem auto 0.38rem;
    width: 100%;
    line-height: 0.3rem;
    font-size: 0.2rem;
  }
  .bottomBtns {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .cancelSelf {
      border: 1px solid;
    }
    .confirmSelf {
      background-color: #54b9ff;
      color: #fff;
    }
  }
  .reWaterBtn {
    width: 1.58rem;
    height: 0.46rem;
    font-size: 0.16rem;
    border-radius: 0.23rem;
    box-sizing: border-box;
  }
  .knownBtn {
    width: 100% !important;
    background-color: #54b9ff;
    color: #fff;
  }
}
</style>
