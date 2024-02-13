<template>
  <div class="Rescue-layout discount-layout">
    <commonHeader :title="data.name || name" />
    <div class="content">
      <!-- <div class="titps-top"> -->
      <Marquee v-if="dd.marquee" :text="data.marquee" />
      <!-- </div> -->
      <el-table
        class="tabel-layout"
        :data="listData"
        style="width: 100%"
        :empty-text="'--' + $t('暂无记录') + '--'"
        :header-cell-style="{
          background: '#fff',
          color: '#606060',
          fontSize: '14px',
          fontWeight: '500',
          borderTop: '2px solid #eaeaea',
        }"
      >
        <el-table-column prop="checkTimeStop" :label="$t('日期')" align="center">
        </el-table-column>
        <el-table-column prop="amountLoss" :label="$t('负盈利')" align="center">
        </el-table-column>
        <el-table-column
          cell-class-name="'isRed'"
          prop="amountReward"
          :label="$t('奖励金')"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="status" :label="$t('操作')" align="center">
          <template slot-scope="scope">
            <!-- 领取 -->
            <div
              class="receive_btn"
              v-if="scope.row.status == 0"
              @click="receive(1, scope.row.recordsNumber)"
            >
              {{ $t('领取') }}
            </div>
            <!-- 已领取 -->
            <div
              class="isReceive_btn"
              v-if="scope.row.status == 1 && !buttonShow"
              @click="receive(2)"
            >
              {{ $t('已领取') }}
            </div>
            <!-- 未达成 -->
            <div class="isReceive_btn" v-if="buttonShow" @click="receive(3)">
              {{ $t('未达成领取条件') }}
            </div>
            <div
              class="isReceive_btn"
              @click="receive(3)"
              v-if="scope.row.status === 0 && !buttonShow && !timePass"
            >
              {{ $t('未达成领取条件') }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="fullColor">
        {{ $t('领取时间') }}：{{
          common.conversionTime(compensationVO.validTimeStartApp)
        }}
        -- {{ common.conversionTime(compensationVO.validTimeStopApp) }}
      </div>
      <div class="tipbox">
        <p class="fullColor" style="text-align: left">
          <span class="fullColor"
            >{{ $t('温馨提示：如遇网络因素不显示当前符合的注单，请稍后刷新网络后重新或点击下面的自助提交') }}</span
          >
          {{ $t('请点击') }}
          <span class="tipColor" @click="customerService"> {{ $t('这里') }} </span>
          {{ $t('自助提交申请优惠。') }}
        </p>
      </div>
      <div class="tipbox2">
        <span class="remk" @click="openDetail"> {{ $t('优惠详情') }} </span>
      </div>
    </div>
  </div>
</template>
<script>
import commonHeader from "./commonHeader.vue";
import Marquee from "@/components/Marquee/index.vue";
// import common from '@/utils/common'
export default {
  props: {
    dd: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    commonHeader,
    Marquee,
  },
  data() {
    return {
      common: {
        conversionTime(timeStamp) {
          if (timeStamp > 0) {
            var date = new Date();
            date.setTime(timeStamp);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var d = date.getDate();
            d = d < 10 ? "0" + d : d;
            var h = date.getHours();
            h = h < 10 ? "0" + h : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? "0" + minute : minute;
            second = second < 10 ? "0" + second : second;
            return (
              y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second
            );
            // return y + '-' + m + '-' + d
          } else {
            return "";
          }
        },
      },
      listData: [],
      buttonShow: false,
      data: {},
      compensationVO: {
        validTimeStartApp: "",
        validTimeStopApp: "",
      },
      name: "",
    };
  },
  created() {
    this.id = this.dd.id;
    this.name = this.dd.name;
    this.getData(this.id);
  },
  computed: {
    timePass() {
      // 是否在领取时间段内
      const now = new Date().getTime();
      return (
        now >= this.compensationVO.validTimeStartApp &&
        now <= this.compensationVO.validTimeStopApp
      );
    },
  },
  methods: {
    // 获取转换时间
    getTime(val) {
      if (val) {
        var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var time = Y + M + D;
        return time;
      }
    },
    openDetail() {
      this.$emit("detail", this.dd.id);
      // this.$router.push({
      //   path:'/actDetail',
      //   query:{
      //     byAppId:this.data.id
      //   }
      // })
    },
    getData(id) {
      let that = this;
      this.$http
        .get(this.$api.getThematicActivitiesByApp, "/" + id, true)
        .then((res) => {
          console.log("----数据", res);
          that.listData = [];
          let list = {};
          if (res.code == 0) {
            that.compensationVO = res.data.compensationVO;
            that.data = res.data;
            if (res.data.compensationVO.receivedList.length !== 0) {
              list = res.data.compensationVO.receivedList;
              // let yesday = list.checkTimeStop - 24 * 60 * 60 * 1000 // 获取的是前一天日期
              list.checkTimeStop = this.getTime(list.checkTimeStop);
              list.map((li) => {
                if (li.checkTimeStop) {
                  return (li.checkTimeStop = this.getTime(li.checkTimeStop));
                }
              });
              that.buttonShow = false;
              that.listData = list;
            } else {
              let yesday = new Date().getTime() - 24 * 60 * 60 * 1000; // 获取的是前一天日期
              list.checkTimeStop = this.getTime(yesday);
              that.listData.push({
                checkTimeStop: list.checkTimeStop,
                amountLoss: 0.0,
                amountReward: 0.0,
              });
              that.buttonShow = true;
            }
          } else {
            let yesday = new Date().getTime() - 24 * 60 * 60 * 1000; // 获取的是前一天日期
            list.checkTimeStop = this.getTime(yesday);
            that.listData.push({
              checkTimeStop: list.checkTimeStop,
              amountLoss: 0.0,
              amountReward: 0.0,
            });
            that.buttonShow = true;
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        });
    },
    customerService() {
      if (['vi'].includes(window.locale)) { // betcome直接跳客服窗口
        const url = this.$common.getCustomerService();
        window.open(url, "_blank");
        return;
      }
      if (window.customerServiceStatus == 1) {
        //新客服
        var _this = this;
        var obj = {};
        obj.host = _this.$common.getHost();
        obj.clientCode = window.clientCode;
        obj.clientItem = window.childCode;
        obj.username =
          this.$common.getUser() && this.$common.getUser().username;
        // obj.language = this.$common.getLocale();
        obj.theme = window.theme;
        obj.projectImgUrl = window.projectImgUrl;
        obj.orgin = window.location.origin + "/activity";
        var str = JSON.stringify(obj);
        str = window.btoa(str);
        var url =
          _this.$config.customerServiceUrl + "/customerService/pc?s=" + str;
        window.open(url, "_blank");
      } else {
        //旧客服
        const url = this.$common.getCustomerService();
        window.open(url, "_blank");
      }
    },
    receive(val, betNeo) {
      let that = this;
      if (val === 1) {
        that.$http
          .put(
            this.$api.getReceiveActivities +
              that.id +
              "&betNo=" +
              encodeURIComponent(betNeo)
          )
          .then((res) => {
            if (res.code == 0) {
              that.$message({
                message: res.data,
                type: "success",
              });
              that.getData(that.id);
            } else {
              that.$message({ type: "warning", message: res.msg });
            }
          });
      } else if (val === 2) {
        this.$message({
          message: that.Rescue.message2,
          type: "warning",
        });
      } else if (val === 3) {
        this.$message({
          message: that.Rescue.receive2,
          type: "warning",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./discount.scss";
.Rescue {
  .headTip {
    margin: 20px 0;
    background-color: #fff4d7;
    color: #e91919;
    font-size: 12px;
    padding: 10px;
  }
  .content {
    .table {
      width: 100%;
      height: 80px;
      background-color: #ffffff;
      border: 1px solid #dcdcdc;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tableLeft {
        display: flex;
        justify-content: space-around;
        padding-left: 20px;
        box-sizing: border-box;
        li {
          display: flex;
          flex-direction: column;
          margin-right: 110px;
          .text1 {
            color: #333333;
            font-size: 20px;
          }
          .text2 {
            color: #999999;
            font-size: 12px;
            margin-top: 5px;
          }
          .red {
            color: #e91919;
          }
        }
      }
      .tableRight {
        width: 118px;
        height: 36px;
        margin-right: 16px;
        background: #f5f5f5;
        border: 1px solid #e6e6e6;
        border-radius: 2px;
        text-align: center;
        line-height: 36px;
        color: #999999;
        font-weight: 500;
      }
      .receive {
        background-color: #e91919;
        color: #ffffff;
        border: none;
      }
    }

    //温馨提示样式
    .lastTip {
      .title {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #e91919;
        margin-top: 50px;
      }
      p {
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 25px;
        color: #333333;
        line-height: 2.5;
      }
      .clickon {
        color: #517ae9;
      }
    }
  }
}
</style>
