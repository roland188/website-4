<template>
  <div class="returnWater">
    <div class="timeButton">
      <span
        v-for="(item, index) in timeList"
        :key="index"
        :class="{ selectButton: selectButton === item.id }"
        @click="slelect(item)"
        >{{ $t(item.name) }}</span
      >
    </div>
    <el-table :data="tableData" border style="width: 100%" height="500">
      <el-table-column
        prop="createdAt"
        :label="$t('订单号')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="orderNo"
        :label="$t('交易时间')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="payChannel"
        :label="$t('返水类型')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="amount"
        :label="$t('金额')"
        align="center"
      ></el-table-column>
      <el-table-column :label="$t('操作')" align="center">
        <template slot-scope="scope">
          <span
            v-show="scope.row.type === 16"
            class="cursorPoint"
            style="color:red;"
            @click="details(1, scope.row)"
            >{{$t('详情')}}</span
          >
        </template></el-table-column
      >
    </el-table>
    <el-pagination
      layout="prev,pager,next"
      :total="total"
      @current-change="returnWater"
      :pageSize="10"
      :current-page.sync="currentPage"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: "value",
      selectButton: "1",
      tableData: [],
      startTime: "",
      endTime: "",
      total: 0, //总条目数
      pageSize: 10, //每页显示个数
      currentPage: 0,
      timeList: [
        {
          name: this.$t("今日"),
          id: "1",
        },
        {
          name: this.$t("昨日"),
          id: "2",
        },
        {
          name: this.$t("最近一周"),
          id: "3",
        },
      ],
    };
  },
  methods: {
    details(type, row) {
      this.$router.push({
        name: "returnWaterDetail",
        params: {
          type: type + "",
          betNo: row.betNo,
        },
      });
    },
    //选择固定日期
    slelect(item) {
      this.selectButton = item.id;
      switch (this.selectButton) {
        // 今日
        case "1":
          this.startTime = this.dateTime(0)[0] + " 00:00:00";
          this.endTime = this.dateTime(0)[1] + " 23:59:59";
          break;
        // 昨日
        case "2":
          this.startTime = this.dateTime(1)[0] + " 00:00:00";
          this.endTime = this.dateTime(1)[1] + " 23:59:59";
          break;
        // 近7日
        case "3":
          this.startTime = this.dateTime(6)[0] + " 00:00:00";
          this.endTime = this.dateTime(6)[1] + " 23:59:59";
          break;
      }
      this.returnWater();
    },
    getTimeNum(val) {
      if (val < 10) {
        return "0" + val;
      }
      return val;
    },
    //固定日期转换
    dateTime(dateOf) {
      let forSevenDays, resultsTime, Yesterdays, dateTime;
      dateTime = new Date();
      forSevenDays = new Date(dateTime);
      forSevenDays.setDate(forSevenDays.getDate() - dateOf);
      //n天前
      resultsTime =
        forSevenDays.getFullYear() +
        "-" +
        this.getTimeNum(forSevenDays.getMonth() + 1) +
        "-" +
        this.getTimeNum(forSevenDays.getDate());
      // 今天
      if (dateOf == 1) {
        Yesterdays =
          forSevenDays.getFullYear() +
          "-" +
          this.getTimeNum(forSevenDays.getMonth() + 1) +
          "-" +
          this.getTimeNum(forSevenDays.getDate());
      } else {
        Yesterdays =
          dateTime.getFullYear() +
          "-" +
          this.getTimeNum(dateTime.getMonth() + 1) +
          "-" +
          this.getTimeNum(dateTime.getDate());
      }
      return [resultsTime, Yesterdays];
    },
    //请求数据
    returnWater(currentPage = 1) {
      let that = this;
      that.currentPage = currentPage;
      if (that.selectButton == 1) {
        that.startTime = that.dateTime(0)[0] + " 00:00:00";
        that.endTime = that.dateTime(0)[1] + " 23:59:59";
      }
      let data = {
        memberId: that.$common.getUser().user_id,
        currentPage: that.currentPage,
        pageSize: 10,
        startTime: that.startTime || "",
        endTime: that.endTime || "",
      };
      that.$http.post(that.$api.rebates, data, true).then((res) => {
        if (res.data && res.data.total > 0) {
          that.total = res.data.total;
          res.data.list.map((item) => {
            item.createdAt = that.$common.conversionTime(item.createdAt);
            item.orderNo = item.betNo;
            item.amount = that.$common.setNumFixed(item.rebateAmount, 2);
            item.payChannel = item.typeName;
          });
          that.tableData = res.data.list;
        } else {
          that.total = 0;
          that.tableData = [];
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.returnWater {
  // padding: 0 25%;
  // box-sizing: border-box;
  width: 1180px;
  margin:  0 auto;
  .timeButton {
    margin: 20px 0;
    span {
      display: inline-block;
      width: 100px;
      height: 50px;
      background: #ccc;
      color: #fff;
      font-size: 16px;
      text-align: center;
      line-height: 50px;
      margin-right: 2px;
    }
    .selectButton {
      background: #314053;
    }
  }
  .el-pagination {
    text-align: right;
  }
}
</style>
