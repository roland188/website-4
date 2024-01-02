<template>
  <div class="egg-award-page">
    <div class="award-coat" v-show="isShow">
      <!-- <img class="bg-img" :src="getImg" @click="openDialog" /> -->
      <img class="bg-img" src="./image/outside.gif" @click="openDialog" />
      <div class="award-number">
        <p>{{ percentComplete }}%</p>
        <p>{{ $t('领取{x}元', { x: rewardAmount }) }}</p>
      </div>
      <img class="close" src="./image/s-close.png" @click="closeCoat" />
    </div>
    <el-dialog
      class="award-inside"
      :visible.sync="adVisible"
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="zp-container">
        <div
          class="head-bg"
          :class="
            stateEgg == 1 ? 'bgLeft1' : stateEgg == 2 ? 'bgLeft2' : 'bgLeft3'
          "
          :style="{
            backgroundImage:
              'url(' + require('./image/s' + stateEgg + '.png') + ')',
          }"
        ></div>
        <div class="contaier">
          <div v-if="awardShow">
            <!-- <div class="title">电子游戏 投注领礼金</div> -->
            <div style="overflow: auto; max-height: 3.5rem">
              <div
                class="item"
                v-for="(item, index) in totalAward"
                :key="index"
              >
                <div class="item-left">
                  <span>{{ $t('已投注') }}：</span>
                  <span style="color: #c60000">{{ totalSpinCount }}</span
                  >/
                  <span>{{ item.rounds }}</span>
                </div>
                <div
                  class="item-right"
                  :class="item.status != 0 ? 'disabled' : ''"
                  @click="goReceive(item)"
                >
                  {{ item.status == 0 ? $t('领取') : $t('未达标') }}
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="title">{{ $t('恭喜获得{x}元', { x: reward }) }}</div>
            <div class="submit item-right" @click="submit">{{ $t('确认') }}</div>
          </div>
        </div>
        <div class="down-close" v-if="awardShow">
          <img class="close" src="./image/m-close.png" @click="closeDialog" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      adVisible: false,
      isShow: false, // 是否显示弹窗
      stateEgg: 1, // 弹窗图片状态
      awardShow: true, // 领取成功
      receiveStatus: 1, // 领取按钮状态
      totalAward: [], // 弹窗遍历数据
      thematicActivitiesId: "", // 领取id
      percentComplete: 0, // 已投注金额
      rewardAmount: 0, // 领取总金额
      totalSpinCount: 0, // 已投注
      reward: 0,
    };
  },
  watch: {
    "$store.state.token"(n) {
      if (n) {
        this.getWaterBallList();
      } else {
        this.isShow = false;
      }
    },
  },
  computed: {
    getImg() {
      return require("./image/s" + this.stateEgg + ".png");
    },
  },
  mounted() {
    if (this.$common.getUser()) {
      this.getWaterBallList();
    }
  },
  methods: {
    // 获取活动数据
    async getWaterBallList() {
      const clientItem = window.childCode;
      const res = await this.$http.get(this.$api.getWaterBallList, clientItem);
      if (res.code === 0 && res.data) {
        //0 已开启 1  未开启 && name ==='砸蛋活动'
        const list = res.data.filter(
          (e) => e.name.includes("电子闯关") && e.status === 0
        );
        if (!list.length) return;
        this.isShow = true;
        const { percentComplete, rewardAmount, speActBigWheelVO, id } =
          list[0] || [];
        const { totalSpinCount, totalAward } = speActBigWheelVO || {};
        this.thematicActivitiesId = id;
        this.percentComplete = percentComplete;
        this.rewardAmount = rewardAmount;
        this.totalSpinCount = totalSpinCount;
        if (Array.isArray(totalAward) && totalAward.length > 0) {
          const awardList = totalAward.filter(
            (item) => item.status === -2 || item.status === 0
          );
          const alreadyList = totalAward.every((item) => item.status == 1);
          if (alreadyList) this.isShow = false;
          if (awardList.length > 0) {
            const stateEgg = awardList.find((element) => element.status === 0);
            if (stateEgg) this.stateEgg = 2;
            else this.stateEgg = 1;
            this.totalAward = awardList;
          }
        }
      }
    },
    // 领取 status=0
    goReceive(item) {
      if (item.status * 1 === 0) {
        this.onReceive(item);
      }
    },
    onReceive(item) {
      this.reward = item.award;
      this.$http
        .put(
          this.$api.getSbwReceive +
            this.thematicActivitiesId +
            "&betNo=" +
            encodeURIComponent(item.rounds)
        )
        .then((res) => {
          if (res.code == 0) {
            _paq.push([
              "trackEvent",
              "Pc_receiveEggActivity",
              "Pc_receiveEggActivity",
              "电子闯关领取",
              1,
            ]);
            this.stateEgg = 3;
            this.awardShow = false;
          } else {
            this.$message.error(this.$t("errorCode." + res.code));
          }
        });
    },
    submit() {
      this.getWaterBallList();
      this.$message.success(this.$t('领取成功，请刷新余额查看'));
      this.adVisible = false;
      this.awardShow = true;
    },
    openDialog() {
      this.adVisible = true;
      _paq.push([
        "trackEvent",
        "Pc_clickEggActivity",
        "Pc_clickEggActivity",
        "电子闯关活动",
        1,
      ]);
    },
    closeCoat() {
      this.isShow = false;
    },
    closeDialog() {
      this.adVisible = false;
    },
  },
};
</script>
<style lang="less">
.egg-award-page {
  margin-top: 50px;
  .award-coat {
    width: 1.46rem;
    text-align: center;
    cursor: pointer;
    .bg-img {
      width: 100%;
      height: 1.25rem;
    }
    .award-number {
      background: #000000;
      opacity: 0.9;
      mix-blend-mode: normal;
      border-radius: 18px;
      white-space: nowrap;

      & > p {
        font-size: 0.12rem;
        color: #e7c98f;
      }
    }
    .close {
      width: 0.24rem;
      height: 0.24rem;
      margin-top: 0.1rem;
    }
  }

  .award-inside {
    .zp-container {
      position: relative;
      text-align: center;

      .head-bg {
        width: 3rem;
        height: 1.95rem;
        position: absolute;
        top: -1.1rem;
        background-repeat: no-repeat;
        background-size: contain;
      }
      .bgLeft1 {
        left: 0.78rem !important;
      }
      .bgLeft2 {
        left: 0.78rem !important;
      }
      .bgLeft3 {
        left: 0.78rem !important;
      }
    }

    .contaier {
      width: 3.98rem;
      min-height: 2rem;
      // background: linear-gradient(180deg, #f5dc9e 0%, #e8b664 100%);
      background: url("./image/bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      // border-radius: 0.24rem;
      padding-top: 0.95rem;
      padding-bottom: 0.1rem;
      font-weight: 500;
      font-size: 0.16rem;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .title {
        font-style: normal;
        font-weight: 700;
        font-size: 0.2rem;
        text-align: center;
        color: #c60000;
      }

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #902f2f;
        border-radius: 0.35rem;
        margin: 0.2rem 0.35rem;
        padding: 0.1rem;
        color: #902f2f;
        font-weight: 600;
      }
      .submit {
        margin: 0.26rem 0.85rem;
        padding: 0.12rem 0 !important;
      }
      .item-right {
        // background: linear-gradient(180deg, #ffffff 0%, #ffd87e 98.93%);
        background: linear-gradient(177.08deg, #ff8800 1.19%, #ff0000 96.37%);
        border-radius: 0.35rem;
        color: #fff;
        font-size: 0.13rem;
        padding: 0.05rem 0.13rem;
        cursor: pointer;
      }
      .disabled {
        opacity: 0.4;
      }
    }
    .down-close {
      width: 3.98rem;
      text-align: center;
      .close {
        width: 0.4rem;
        height: 0.4rem;
        margin-top: 0.2rem;
        cursor: pointer;
      }
    }
  }

  .el-dialog {
    background: transparent !important;
    box-shadow: none !important;
  }
}
</style>
