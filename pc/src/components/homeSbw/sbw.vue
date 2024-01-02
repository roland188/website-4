<template>
  <div class="line-chart">
    <div v-if="isShowBar">
      <vuedraggable :distanceRight="distanceRight" :distanceBottom="distanceBottom" :isScrollHidden="false"
        :isCanDraggable="true" :zIndex="998">
        <div class="mar-bot20" @click="handleShowOpen">
          <canvas id="bollCanvas" width="128px" height="128px"></canvas>
        </div>
      </vuedraggable>
    </div>
    <el-dialog :visible.sync="dialogVisible" center width="800px" height="490px" :show-close="false">
      <div class="step" v-if="!receivedSuccess">
        <div class="step-header">
          <div class="img-box">
            <img v-show="showDetail" @click="handleBackStep" class="img" src="./img/tbh_back.png" alt="" />
          </div>
          <div class="text">{{ showDetail ? $t("任务详情") : $t("PG周末-电游金") }}</div>
          <div class="img-box">
            <img class="img" v-show="!showDetail" @click="handleClose" src="./img/tbh_close.png" alt="" />
          </div>
        </div>
        <div class="step-list" v-if="!showDetail">
          <div class="step-item" v-for="(award, index) in totalAward" :key="award.award + index">
            <step :percentage="award.percentage" :stepText="award.percentageText"
              @handleSetp="() => handleSetp(award.status, award)">
              <div slot="right" class="btn" :class="{ 'btn-active': award.status == 0 }"
                @click="handleSetp(award.status, award)">
                {{ award.status === 0 ? $t("领取") : $t("详情") }}
              </div>
            </step>
          </div>
        </div>
        <div class="img-list" v-if="showDetail">
          <div v-html="intro"></div>
        </div>
      </div>
      <div class="received" v-if="receivedSuccess">
        <div class="close">
          <img class="img" @click="handleClose" src="./img/tbh_close.png" mode="" />
        </div>
        <img class="img-success" src="./img/success.png" mode="" />
        <div class="text-success">{{ $t('领取成功') }}</div>
        <span class="click-me">{{ $t('点击我的-钱包查看') }}</span>
        <div class="btn btn-active btn-auto" @click="handleClose">{{ $t('我知道了') }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vuedraggable from "vue-draggable-float";
import step from "./step.vue";
export default {
  components: {
    vuedraggable,
    step
  },
  data() {
    return {
      bollStep: null,
      bollTimeR: null,
      first: 1,
      receivedSuccess: false, //  显示领取成功页面
      showDetail: false, //  显示详情
      stepText: this.$t("完成"),
      status: 1, //未完成
      list: [],
      index: 0,
      percentComplete: 70, // 进度条
      rewardAmount: 0, // 领取总金额
      intro: "", // 富文本
      totalAward: [],
      thematicActivitiesId: "",
      isShowBar: false,
      distanceRight: 1750,
      distanceBottom: 300,
      dialogVisible: false,
    };
  },
  watch: {
    "$store.state.token"(n) {
      if (n) {
        this.getWaterBallList();
      } else {
        this.isShowBar = false
      }
    },
  },
  beforeDestroy() {
    cancelAnimationFrame(this.bollTimeR);
  },
  mounted() {
    this.distanceRight = window.innerWidth - 150
    if (this.$common.getUser()) {

      this.getWaterBallList()
    }
  },
  methods: {
    async getWaterBallList() {
      let childCode = window.childCode;
      const res = await this.$http.get(this.$api.getWaterBallList, childCode);
      if (res.code === 0 && res.data) {
        this.list = res.data;
        let sbwList = res.data.find(item => {
          return item.name.includes("水球") && item.status == 0
        })
        if (sbwList) this.isShowBar = true

        let { percentComplete, rewardAmount, intro, speActBigWheelVO, id } = sbwList || {};
        let { totalSpinCount, totalAward } = speActBigWheelVO || {};
        this.thematicActivitiesId = id;
        this.percentComplete = percentComplete;
        this.rewardAmount = rewardAmount;
        this.intro = intro;
        console.log(totalAward, "totalAward", speActBigWheelVO, res)
        let list = totalAward && totalAward.filter(
          (item) => item.status === -2 || item.status === 0
        );

        if (list && list.length > 0) {
          list.forEach((item) => {
            // 为完成
            if (item.status == 0) {
              item.percentage = 100;
              item.percentageText = this.$t("已完成");
            } else {
              item.percentage = Math.floor(totalSpinCount / item.rounds);
              item.percentageText =
                this.$t("已投注") + totalSpinCount + "/" + item.rounds;
            }
          });
          this.totalAward = list;
          setTimeout(() => {
            this.drawBollWave();
          }, 10);
        }
      }
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
    },
    // 返回进度列表
    handleBackStep() {
      this.showDetail = false;
    },
    // 点击领取或详情、进度条进入详情明细
    handleSetp(status, item) {
      console.log(status, "status");
      // 根据状态显示成功弹窗
      if (status === 0) {
        this.$http
          .put(
            this.$api.getSbwReceive + this.thematicActivitiesId + "&betNo=" + encodeURIComponent(item.rounds)
          )
          .then((res) => {
            if (res.code == 0) {
              this.getWaterBallList();
              this.receivedSuccess = true;
            } else {
              this.$message.error(this.$t("errorCode." + res.code));
            }
          });
      } else {
        this.showDetail = true;
      }
      _paq.push(["trackEvent", "Pc_receiveWaterActivity", "Pc_receiveWaterActivity", this.$t('水球领取'), 1]);
    },
    handleShowOpen() {
      this.dialogVisible = true;
      _paq.push(["trackEvent", "Pc_clickWaterActivity", "Pc_clickWaterActivity", this.$t('点击水球活动'), 1]);
    },
    toFixedNumber(n = 2, val) {
      //去小数点后2位
      if (typeof val == "number") {
        return val.toFixed(n) * 1;
      }
    },
    //绘制原型水球
    drawBollWave(ids, elem) {
      let _this = this;
      let canvas = document.getElementById("bollCanvas");
      let ctx = canvas.getContext("2d"),
        w = 128,
        h = 128,
        grd = null, //渐变色grd
        grds = null,
        angle = 0,
        x = 0,
        y = 0,
        y2 = 0,
        part = 0; //part声波初始位置
      let grid = {
        top: (5 * h) / 100, //水球距离顶的 15%
      };
      let bollArg = {
        R: h / 2 - grid.top, //圆半径
        O: {
          x: w / 2,
          y: h / 2,
        }, //圆心坐标 x, y
        A: 1, //振幅
        vs: 10, //声波运动速度 越大值 越慢
        lineWidth: 1,
        waveOpacity: 1, //水波的透明度
        waveHeight: _this.percentComplete, // 80百分之80%（占整个水球的百分比高度）
        angleStep: 5, //声波上圆点间隔的距离
        waveLen: 30, //波长
        waveStyle: {
          fillColor: {
            start: "#ff9f43",
            end: "#de5600"
          },
          strokeColor: "#ffffff",
        }, //波浪颜色样式
        oStyle: {
          fillColorStart: "#e7c172",
          fillColorEnd: "#ba8840",
          strokeColor: "#fdf4f4"
        }, //圆的颜色样式
        textStyle: {
          fillColor: "#fff",
          fontSize: 42,
        },
      };
      ctx.clearRect(0, 0, w, h);
      let drawBoll = () => {
        // console.log(ctx,"ddddd")
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = bollArg.lineWidth;
        // 设置描边颜色
        ctx.strokeStyle = bollArg.oStyle.strokeColor;
        // 设置填充色
        let grds = ctx.createLinearGradient(
          0,
          0,
          bollArg.O.y - bollArg.R,
          bollArg.O.y + bollArg.R
        );
        grds.addColorStop(0, bollArg.oStyle.fillColorStart);
        grds.addColorStop(1, bollArg.oStyle.fillColorEnd);
        ctx.fillStyle = grds;
        ctx.arc(bollArg.O.x, bollArg.O.y, bollArg.R, 0, 2 * Math.PI);
        // 关闭一个路径。会连接起点和终点。如果关闭路径后没有调用 fill 或者 stroke 并开启了新的路径，那之前的路径将不会被渲染
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.clip();
        // 水波纹渐变色
        grd = ctx.createLinearGradient(
          0,
          0,
          bollArg.O.y - bollArg.R,
          bollArg.O.y + bollArg.R
        );
        grd.addColorStop(0, bollArg.waveStyle.fillColor.start);
        grd.addColorStop(1, bollArg.waveStyle.fillColor.end);
        ctx.globalAlpha = bollArg.waveOpacity;
        ctx.beginPath();
        ctx.strokeStyle = bollArg.waveStyle.strokeColor;
        ctx.fillStyle = grd;
        ctx.moveTo(
          bollArg.O.x - bollArg.R,
          bollArg.O.y + bollArg.R + bollArg.A
        );
        for (
          angle = bollArg.O.x - bollArg.R;
          angle < bollArg.O.x + bollArg.R + bollArg.angleStep;
          angle += bollArg.angleStep
        ) {
          y =
            bollArg.A *
            Math.sin(
              this.bollStep / bollArg.vs +
              (angle / bollArg.waveLen) * Math.PI * 2
            );
          x = angle;
          ctx.lineTo(
            x,
            y +
            bollArg.R * 2 +
            bollArg.A +
            grid.top -
            part * 0.01 * ((bollArg.R * 2 * bollArg.waveHeight) / 100)
          );
        }
        ctx.lineTo(
          bollArg.O.x + bollArg.R,
          bollArg.O.y + bollArg.R + bollArg.A
        );
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = bollArg.textStyle.fillColor;
        ctx.font = "28px Microsoft YaHei"
        ctx.fillText(
          this.toFixedNumber(2, bollArg.waveHeight * 0.01 * part) + "%",
          bollArg.O.x,
          bollArg.O.y
        );
        ctx.font = "18px Microsoft YaHei"
        ctx.fillText(
          this.$t("领取{x}元", { x: _this.rewardAmount }),
          bollArg.O.x,
          bollArg.O.y + 20
        );
        ctx.save();
        ctx.restore();

        // ctx.setFontSize(14);
        ctx.save();
        ctx.restore();
        ctx.fill();
        // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
        // ctx.draw();

        part++;
        if (part >= 100) {
          part = 100;
        }

        this.bollStep++;
        if (this.bollStep > 2012) {
          this.bollStep = 0;
        }
        this.bollTimeR = window.requestAnimationFrame(drawBoll);
      };
      //  window.requestAnimationFrame(drawBoll);
      drawBoll();
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-dialog__header {
  padding: 0;
}

::v-deep .el-dialog--center .el-dialog__body {
  padding: 0;
}

::v-deep .el-dialog__body {
  padding: 0;
}

.mar-bot20 {
  cursor: pointer;
}

.step {
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 490px;
  background-color: #ffffff;
  border-radius: 20px;
  margin: 0 auto;
}

.step-header {
  display: flex;
  align-items: center;
  padding: 0 30px;
  height: 58px;
  border-bottom: 1px solid rgba(227, 224, 224, 1);
}

.img-box {
  width: 10%;
  margin-top: 17px;
  vertical-align: middle;
}

.text {
  flex: 1;
  text-align: center;
  font-size: 22px;
  color: rgba(112, 112, 112, 1);
  font-weight: 500;
  font-family: PingFang SC;
}

.img {
  width: 50px;
  height: 50px;
}

.step-list {
  padding: 20px;
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
}

.step-item {
  display: flex;
  flex-direction: column;
  //   width: 600px;
  margin-bottom: 40px;
}

.btn {
  width: 65px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  border-radius: 180px;
  margin-left: 20px;
  background: linear-gradient(rgba(255, 255, 255, 1),
      rgba(234, 234, 234, 1),
      rgba(255, 255, 255, 1));
  color: rgba(112, 112, 112, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  box-shadow: 1px 6px 6px rgba(0, 0, 0, 0.16);
}

.btn-active {
  background: linear-gradient(#b57c3b 0%, #eec57b 30%, #b67d3c 65%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 1);
}

.img-list {
  width: 670px;
  height: 822px;
  margin: 10px auto;
  padding: 0 20px;
  //   padding: 40px;
  font-size: 22px;
  overflow-y: auto;
}

.received {
  width: 360px;
  height: 341px;
  background: rgba(255, 255, 255, 1);
  border-radius: 20px;
  text-align: center;
}

.close {
  text-align: right;
  padding: 20px;
}

.img-success {
  width: 80px;
  height: 80px;
}

.text-success {
  color: rgba(32, 201, 77, 1);
  font-size: 26px;
  font-weight: 500;
  margin: 14px 0 30px;
  font-family: PingFang SC;
}

.click-me {
  font-size: 14px;
  color: rgba(112, 112, 112, 1);
  font-weight: 500;
  font-family: PingFang SC;
}

.btn-auto {
  width: 120px;
  height: 40px;
  margin: 20px auto;
}
</style>
